/**
 * Service Worker
 * Adaptiert von:
 * https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
 * https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete
 * @author Sascha Andre Wolgast
 */

"use strict"


// Cache Name
const cacheName = 'v1';

// Dateien die in den Cache sollen
const cacheAssets = [
    'index.html',
    '/css/style.css',
    '/js/app.js'
];

// install Event-Listener registrieren
// Quelle: https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
self.addEventListener("install", (event) => {
    // Alle Dateien aus cachAssets in den Cache schreiben
    event.waitUntil(
      caches
        .open(cacheName)
        .then((cache) =>
          cache.addAll(cacheAssets)
        )
    );
});


// active Event-Listener registrieren
// Quelle: https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete
self.addEventListener('activate', event => {
    console.log("Service Worker: Activated.");
    // Alte Caches löschen
    event.waitUntil(
      caches.keys().then((keyList) =>
        Promise.all(
          keyList.map((key) => {
            if (!(key !== cacheName )) {
              return caches.delete(key);
            }
          })
        )
      )
    );
});

// fetch Event-Listener
// Quelle: https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
self.addEventListener("fetch", (event) => {
    // Liest Datei aus dem Cache , wenn vorhanden oder holt diese vom Webserver
    // und speichert sie im Cache und gibt sie zurück.
    event.respondWith(
      caches.match(event.request).then((response) => {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
          console.log(`Service Worker: ${event.request} aus Cache gelesen.`)
          return response;
        } else {
          return fetch(event.request)
            .then((response) => {
              console.log(`Service Worker: ${event.request} von Website gelesen.`)
              // response may be used only once
              // we need to save clone to put one copy in cache
              // and serve second one
              let responseClone = response.clone();
  
              caches.open(cacheName).then((cache) => {
                cache.put(event.request, responseClone);
              });
              return response;
            });
        }
      })
    );
  });
