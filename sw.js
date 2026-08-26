const CACHE_NAME = "focusflow-v9";


const FILES_TO_CACHE = [

    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",

    "./icons/icon-192.png",
    "./icons/icon-512.png",

    /* Focus */

    "./assets/focus-desktop.mp4",
    "./assets/focus-mobile.mp4",

    "./assets/focus-desktop.jpg",
    "./assets/focus-mobile.jpg",

    /* Short Break */

    "./assets/shortbreak-desktop.mp4",
    "./assets/shortbreak-mobile.mp4",

    "./assets/shortbreak-desktop.jpg",
    "./assets/shortbreak-mobile.jpg",

    /* Long Break */

    "./assets/longbreak-desktop.mp4",
    "./assets/longbreak-mobile.mp4",

    "./assets/longbreak-desktop.jpg",
    "./assets/longbreak-mobile.jpg",

    /* Alarm */

    "./sounds/alarm.mp3"

];


self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache => {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

        );


        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    name =>
                                        name !==
                                        CACHE_NAME
                                )
                                .map(
                                    name =>
                                        caches.delete(
                                            name
                                        )
                                )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches
                .match(
                    event.request
                )
                .then(
                    cachedResponse => {

                        if (
                            cachedResponse
                        ) {

                            return cachedResponse;

                        }


                        return fetch(
                            event.request
                        );

                    }
                )

        );

    }
);