import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api/push';
const STORAGE_KEY = 'push_subscription';

export function usePushNotifications() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/service-worker.js');
            restoreSubscription();
        }
    }, []);

    const restoreSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const existingSub = await registration.pushManager.getSubscription();

            if (existingSub) {
                setSubscription(existingSub);
                localStorage.setItem(STORAGE_KEY, 'true');
            }
        } catch (error) {
            console.error('Failed to restore subscription:', error);
        }
    };

    const subscribe = async () => {
        const keyRes = await fetch(`${API_URL}/key`);
        const { publicKey } = await keyRes.json();

        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        await fetch(`${API_URL}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub)
        });

        setSubscription(sub);
        localStorage.setItem(STORAGE_KEY, 'true');
    };

    const unsubscribe = async () => {
        if (subscription) {
            await fetch(`${API_URL}/unsubscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: subscription.endpoint })
            });
            await subscription.unsubscribe();
            setSubscription(null);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return { subscription, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string) {
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
}