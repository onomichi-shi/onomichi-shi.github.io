"use strict"

// https://www.youtube.com/watch?v=ksXwaWHCW6k
const cacheName = 'v1';

const cacheAssets = [
    'index.html',
    '/css/style.css',
    '/js/app.js'
];

// Install Event-Listener registrieren
self.addEventListener('install', (event) => {
    console.log("Servive Worker: Installed.")

    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets)
                .then(ok => {
                    console.log("Cached");
                })
                .catch(err => {
                    console.log("Error". err);
                });
            })
            .then(() => self.skipWaiting())
    );
});


// Active Event-Listener registrieren
self.addEventListener('activate', event => {
    console.log("Service Worker: Activated.");
    // Alte Cache löschen
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache =>  {
                    if(cache !== cacheName){
                        console.log('Service Worker: Clearing old cache.')
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

//
self.addEventListener('fetch', event => {
    console.log("Service Worker: Is fetching");
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    )
});
