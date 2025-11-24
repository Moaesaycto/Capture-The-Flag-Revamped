export async function subscribeUser() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        alert("Push notifications are not supported by your browser.");
        return;
    }

    const registration = await navigator.serviceWorker.register("/service-worker.js");

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // Public key, so allowed to be exposed!
        applicationServerKey: urlBase64ToUint8Array(
            "BPBB7YTMuhbUbFEZZNXeNeTpw_lD3dobyzOiE7HUO7POfrMlEM-kztNoAnD2473B732jlD4agryajdOMKnRUiz8"
        ),
    });

    // Send subscription object to your Spring Boot backend
    await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
    });

    console.log("User subscribed for push notifications:", subscription);
}

export async function unsubscribeUser() {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return;

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
        const unsubscribed = await subscription.unsubscribe();
        console.log("Unsubscribed:", unsubscribed);

        await fetch("/api/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription),
        });
    }
}

// helper function to convert base64 key
function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
