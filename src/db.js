const dbName = 'SiteStoryDB';
const storeName = 'audioFiles';

const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(storeName, { keyPath: 'id' });
      };
    });
  };
  
  const saveAudioToIndexedDB = async (audioFile, title) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const id = title + Date.now();
    await store.put({ id, title, file: audioFile });
    return id;
  };

  const getFileFromIndexedDB = async (id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      console.log("Attempting to retrieve file with id:", id);
      const request = store.get(id);
  
      request.onsuccess = (event) => {
        console.log("Retrieved data:", event.target.result);
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        console.error("Error retrieving file:", event.target.error);
        reject(event.target.error);
      };
    });
  };

 const saveImageToIndexedDB = async (imageFile, title) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  const id = title + Date.now();
  await store.put({ id, title, file: imageFile });
  return id;
};

  
  
  
  export { openDB, saveAudioToIndexedDB, getFileFromIndexedDB,saveImageToIndexedDB };