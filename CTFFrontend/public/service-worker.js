self.addEventListener('push', (event) => {
    const data = event.data.json();

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                const isPageFocused = clientList.some(client => client.focused);

                if (!isPageFocused) {
                    return self.registration.showNotification(data.title, {
                        body: data.body,
                        icon: '/icon.png',
                        badge: '/badge.png'
                    });
                }
            })
    );
});