function isStoringBlobsInIDBSupported(callback) {
    // IndexedDB
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
            IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
            dbVersion = 1.0,
            dbName = "idb-blob-supported-test-db",
            storeName = 'test-blob';
     
        if(!indexedDB) {
            return callback(null, false);
        }
        // Create/open database
        var request = indexedDB.open(dbName, dbVersion);
     
        request.onerror = function (event) {
            callback(event.value);
            callback = null;
        };
     
        request.onsuccess = function (event) {
            var db = request.result,
                blob = new Blob(['hello world']),
                cloneError = false,
                err,
                transaction;
     
            db.onerror = function (event) {
                callback(event.value);
                callback = null;
            };
            
            transaction = db.transaction(storeName, "readwrite");
 
            try {
                transaction.objectStore(storeName).put(blob, 'somekey');
            } catch(ee) {
                if(ee.name === 'DataCloneError') {
                    cloneError = true;
                } else {
                    err = ee;
                }
            }
            finally {
                indexedDB.deleteDatabase(dbName);
                callback(err, !cloneError);
            }
        };
        
        // For future use. Currently only in latest Firefox versions
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            db.createObjectStore(storeName);
        };
}
