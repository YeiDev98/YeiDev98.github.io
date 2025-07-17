// db.js
const DB_NAME = 'miscelaneaDB';
const DB_VERSION = 1;
let db;

function abrirDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      db = e.target.result;

      if (!db.objectStoreNames.contains('productos')) {
        const store = db.createObjectStore('productos', { keyPath: 'id', autoIncrement: true });
        store.createIndex('nombre', 'nombre', { unique: false });
      }
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };

    request.onerror = (e) => {
      reject('Error abriendo la base de datos');
    };
  });
}

// Agregar producto al inventario
async function agregarProductoInventario(producto) {
  const db = await abrirDB();
  const tx = db.transaction('productos', 'readwrite');
  const store = tx.objectStore('productos');
  store.add(producto);
  return tx.complete;
}

// Obtener todos los productos
async function obtenerProductos() {
  const db = await abrirDB();
  const tx = db.transaction('productos', 'readonly');
  const store = tx.objectStore('productos');
  return store.getAll();
}
