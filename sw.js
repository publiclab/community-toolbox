var STATIC_CACHE = "static-v1";
var DYNAMIC_CACHE = "dynamic-v1";

self.addEventListener('install', (e) => {
    console.log("[Service Worker] installing...");
});

self.addEventListener('activate', (e) => {
    console.log("[Service Worker] activating...",e);
    e.waitUntil(
        caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
                    return caches.delete(key);
                }
            }))
        })
    );

    return self.clients.claim();
});


self.addEventListener('fetch', function (e) {
    let urlReq = e.request;

    e.respondWith(
        fetch(urlReq)
        .then((res) => {
            var resClone = res.clone();
            return caches.open(DYNAMIC_CACHE)
            .then((cache) => {
                cache.delete(urlReq.url)
                .then((bool) => {
                    cache.add(urlReq.url, resClone);
                })
                
                return res;
            })
    	})
        .catch((err) => {
            return caches.match(urlReq.url)
            .then((data) => {
                if(data!=undefined) {
                    return data;
            	}
            })
        })
    );
});