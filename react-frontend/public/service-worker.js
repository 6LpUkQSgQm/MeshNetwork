const CACHE_NAME = "app-cache-v1";
const urlsToCache = ["/", "/index.html", "/static/js/bundle.js"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("push", (event) => {
    console.log("Push event received: ", event.data);
    if (!event.data) {
        console.error("No data found in push event.");
        return;
    }
    const data = event.data.json();
    console.log("Parsed data: ", data);
    const title = data.title || "Default Title";
    const options = {
        body: data.body || "Default body content",
        icon: "/icon.png",
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("message", (event) => {
    if (!event.data) {
        console.error("No message data received");
        return;
    }

    const { title, body } = event.data;

    const options = {
        body: body || "You have a new message!",
        icon: "/icon.png",
        badge: "/badge.png",
    };

    self.registration.showNotification(title || "Notification", options);
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});