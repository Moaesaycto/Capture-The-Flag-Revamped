import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/push";
const STORAGE_KEY = 'push_subscription';

export function usePushNotifications() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isSubscribing, setIsSubscribing] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            // Use import.meta.env.BASE_URL which Vite sets from vite.config.ts
            const swPath = `${import.meta.env.BASE_URL}service-worker.js`;

            navigator.serviceWorker.register(swPath)
                .then(reg => {
                    return reg.update();
                })
                .then(() => {
                    restoreSubscription();
                })
                .catch(err => {
                    console.error('Service worker registration failed:', err.message);
                });
        } else {
            console.warn('Push notifications not supported');
        }
    }, []);
    const restoreSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const existingSub = await registration.pushManager.getSubscription();
            if (existingSub) {
                setSubscription(existingSub);
                localStorage.setItem(STORAGE_KEY, 'true');
            } else {
                console.log('ℹNo existing subscription found');
            }
        } catch (error) {
            console.error('Failed to restore subscription:', error);
        }
    };

    const subscribe = useCallback(async () => {
        if (isSubscribing) {
            console.warn('Already subscribing, ignoring duplicate call');
            return;
        }

        setIsSubscribing(true);
        console.log('Starting subscription process...');

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Notification permission was denied. Please enable it in your browser settings.');
                return;
            }

            // Get public key from backend
            const keyRes = await fetch(`${API_URL}/key`);
            if (!keyRes.ok) {
                throw new Error(`Failed to fetch public key: ${keyRes.status} ${keyRes.statusText}`);
            }

            const keyData = await keyRes.json();
            const { publicKey } = keyData;

            if (!publicKey) {
                throw new Error('No public key in response');
            }

            const registration = await navigator.serviceWorker.ready;
            const applicationServerKey = urlBase64ToUint8Array(publicKey);

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            });

            const subscribeRes = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub.toJSON()) // Convert to JSON
            });

            if (!subscribeRes.ok) {
                const errorText = await subscribeRes.text();
                throw new Error(`Failed to send subscription to backend: ${subscribeRes.status} - ${errorText}`);
            }

            setSubscription(sub);
            localStorage.setItem(STORAGE_KEY, 'true');

        } catch (error) {
            alert(`Subscription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubscribing(false);
        }
    }, [isSubscribing]);

    const unsubscribe = useCallback(async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const existingSub = await registration.pushManager.getSubscription();

            if (existingSub) {
                await Promise.all([
                    fetch(`${API_URL}/unsubscribe`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ endpoint: existingSub.endpoint }),
                        keepalive: true
                    }).catch(err => console.warn('⚠️ Backend unsubscribe failed:', err)),
                    existingSub.unsubscribe()
                ]);

                setSubscription(null);
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
            setSubscription(null);
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    return { subscription, subscribe, unsubscribe, isSubscribing };
}

function urlBase64ToUint8Array(base64String: string) {
    try {
        base64String = base64String.trim();
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    } catch (error) {
        throw error;
    }
}