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
    const id = Date.now();
    await store.put({ id, title, audioFile });
    return id;
  };
  const getAudioFromIndexedDB = async (id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
  
      request.onsuccess = (event) => {
        resolve(event.target);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };
  export { openDB, saveAudioToIndexedDB, getAudioFromIndexedDB };