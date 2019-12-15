/*
working with cache API https://alligator.io/js/cache-api/

*/

//find existing cache files and delete it
function emptyCache() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1) {
        emptyCacheMethod1();
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
        emptyCacheMethod2();
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        emptyCacheMethod1();
    } else if ((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true)) //IF IE > 10
    {
        emptyCacheMethod2();
    }

}

function emptyCacheMethod1() {
    let id = "dynamic-v1";
    caches.open(id)
        .then(cache => cache.keys()
            .then(keys => {
                for (let key of keys) {
                    cache.delete(key)
                }
            }));
}

function emptyCacheMethod2() {
    caches.keys().then(keys => {
        keys.map(key => {
            caches.delete(key);
            console.log("Deleting cache named: " + key);
        })
    })
}