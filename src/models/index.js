
let db;

function initialize() {
    let dbReq = indexedDB.open('publiclabDB');

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
    }
    
    // Fires when we can't open the database
    dbReq.onerror = function(event) {
        console.log('error opening database');
    }
}

// We make sure that initialize function gets fired once the DOM content is loaded
window.addEventListener('DOMContentLoaded', initialize());


function saveContentToDb(queryKey, queryContent) {
    // Start a database transaction and get the toolbox object store
    let tx = db.transaction(["toolbox"], 'readwrite');
    let store = tx.objectStore('toolbox');

    // Put the data into the object store
    let temp = { keys: queryKey, content: queryContent };
    store.add(temp);

    // Wait for the database transaction to complete
    tx.oncomplete = function() { 
        console.log("Entry added to store successfully!");
        return;
    }
    tx.onerror = function(event) {
        console.log('error storing content');
        return;
    }
}


function getContentFromDb(query) {
    let tx = db.transaction(["toolbox"], 'readonly');
    let store = tx.objectStore("toolbox");
    let index = store.index("keys");

    return new Promise((resolve, reject) => {
    
        let request = index.openCursor(IDBKeyRange.only(query));
    
        request.onsuccess = function(e) {
            let cursor = e.target.result;
            if (cursor) {
                // Called for each matching record.
                resolve(cursor.value.content);
              } else {
                // This null is very important, because we have a check for null 
                // in the functions of community-toolbox.js
                resolve(null);
              }
        }
    })
}


// This is not implemented fully yet...(this is WIP)
function deleteItemFromDb(query) {
    let tx = db.transaction(["toolbox"], 'readwrite');
    let store = tx.objectStore("toolbox");
    let index = store.index("keys");

    return new Promise((resolve, reject) => {
    
        let request = index.openCursor(IDBKeyRange.only(query));
    
        request.onsuccess = function(e) {
            let cursor = e.target.result;
            if (cursor) {
                // Called for each matching record.
                store.delete(cursor.key);

                // Wait for the database transaction to complete
                tx.oncomplete = function() { 
                    console.log("Entry deleted from store successfully!");
                    resolve(true);
                }
                tx.onerror = function(event) {
                    console.log('error deleting content: ' + event.target);
                    reject(false);
                }
            } else {
                // No more matching records.
                console.log("No matching entry found to be deleted :(");
                resolve(null);
            }
        }
    })
}







// EXPORTS
module.exports = {
    saveContentToDb: saveContentToDb,
    getContentFromDb: getContentFromDb,
    deleteItemFromDb: deleteItemFromDb,
}