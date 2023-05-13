let db;
const init = require("../models/initialize");

function populateDb() {
  return init.dbInit().then((response) => {
    db = response;
  });
}

// Stores items to the database
function saveContentToDb(queryKey, queryContent) {
  // Start a database transaction and get the toolbox object store
  const tx = db.transaction(["toolbox"], "readwrite");
  const store = tx.objectStore("toolbox");

  // Put the data into the object store
  const temp = { keys: queryKey, content: queryContent };
  store.add(temp);

  // Wait for the database transaction to complete
  tx.oncomplete = function () {
    console.log("Entry added to store successfully!");
  };
  tx.onerror = function (event) {
    console.log("error storing content");
  };
}

// Fetches items from the database
function getContentFromDb(query) {
  const tx = db.transaction(["toolbox"], "readonly");
  const store = tx.objectStore("toolbox");
  const index = store.index("keys");

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const request = index.openCursor(IDBKeyRange.only(query));

    request.onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        // Called for each matching record.
        resolve(cursor.value.content);
      } else {
        // This null is very important, because we have a check for null
        // in the functions of community-toolbox.js
        resolve(null);
      }
    };
  });
}

// Deletes items from the database
function deleteItemFromDb(query) {
  const tx = db.transaction(["toolbox"], "readwrite");
  const store = tx.objectStore("toolbox");
  const index = store.index("keys");

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const request = index.openCursor(IDBKeyRange.only(query));

    request.onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        // Called for each matching record.
        store.delete(cursor.key);

        // Wait for the database transaction to complete
        tx.oncomplete = function () {
          console.log("Entry deleted from store successfully!");
          resolve(true);
        };
        tx.onerror = function (event) {
          console.log("error deleting content: " + event.target);
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(false);
        };
      } else {
        // No more matching records.
        console.log("No matching entry found to be deleted :(");
        resolve(null);
      }
    };
  });
}

function clearDB() {
  return new Promise((resolve, reject) => {
    let tx = db.transaction(["toolbox"], "readwrite");
    let store = tx.objectStore("toolbox");
    let objStoreReq = store.clear();
    objStoreReq.onsuccess = function (e) {
      resolve(true);
    };
  });
}

// EXPORTS
module.exports.saveContentToDb = saveContentToDb;
module.exports.getContentFromDb = getContentFromDb;
module.exports.deleteItemFromDb = deleteItemFromDb;
module.exports.populateDb = populateDb;
module.exports.clearDB = clearDB;
