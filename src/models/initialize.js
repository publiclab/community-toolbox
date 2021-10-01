// This function is responsible for setting up the database
function dbInit() {
    let db;
    let dbReq = indexedDB.open('publiclabDB');
    return new Promise((resolve, reject) => {
        // Fires when upgrade needed
        dbReq.onupgradeneeded = function(event) {
            // Set the db variable to our database so we can use it
            db = event.target.result;
    
            // Create an object store named toolbox, or retrieve it if it already exists.
            // Object stores in databases are where data are stored.
            let toolbox;
            if (!db.objectStoreNames.contains('toolbox')) {
                toolbox = db.createObjectStore('toolbox', {autoIncrement: true, keyPath: "keys"});
            } else {
                toolbox = db.transaction("toolbox", "readwrite").objectStore("toolbox");
            }
    
            // If there isn't already a KEY index, make one so we can query toolbox
            // by their KEY
            if (!toolbox.indexNames.contains('keys')) {
                toolbox.createIndex('keys', 'keys', { unique: true });
            }else {
                console.log("KEY index is already created");
            }
    
            // If there isn't already a CONTENT index, make one so we can query toolbox
            // by their CONTENT
            if (!toolbox.indexNames.contains('content')) {
                toolbox.createIndex('content', 'content', { unique: false });
            } else {
                console.log("content index is already created");
            }
    
        }
    
        // Fires once the database is opened (and onupgradeneeded completes, if
        // onupgradeneeded was called)
        dbReq.onsuccess = function(event) {
            // Set the db variable to our database so we can use it
            db = event.target.result;
            resolve(db);
        }
        
        // Fires when we can't open the database
        dbReq.onerror = function(event) {
            console.log('error opening database');
            resolve(null);
        }

    })


}


module.exports = {
    dbInit: dbInit,
}

