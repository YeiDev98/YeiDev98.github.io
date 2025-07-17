// ==== CONECTAR A INVENTARIO EN INDEXEDDB ====
let db;

const request = indexedDB.open("miscelaneaDB", 1);

request.onsuccess = (event) => {
  db = event.target.result;
  mostrarFechaHora();
};

request.onerror = () => {
  console.error("Error al abrir la base de datos.");
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("inventario")) {
    const store = db.createObjectStore("inventario", { keyPath: "codigo" });
    store.createIndex("nombre", "nombre", { unique: false });
  }
};

// ==== MOSTRAR FECHA Y HORA ====
function mostrarFechaHora() {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString();
  const hora = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("fechaFactura").textContent = `${fecha} ${hora}`;
}

// ==== BUSCAR Y AGREGAR PRODUCTO ====
function buscarYAgregarProducto() {
  const texto = document.getElementById("buscar").value.trim().toLowerCase();

  if (!texto || !db) return;

  const transaction = db.transaction("inventario", "readonly");
  const store = transaction.objectStore("inventario");

  let encontrado = false;

  // Buscar por código
  const reqCodigo = store.get(texto);
  reqCodigo.onsuccess = () => {
    if (reqCodigo.result) {
      agregarProductoFactura(reqCodigo.result);
      encontrado = true;
    }
  };

  reqCodigo.onerror = () => {
    console.error("Error al buscar producto.");
  };

  // Buscar por nombre si no se encontró por código
  transaction.oncomplete = () => {
    if (!encontrado) {
      const newTransaction = db.transaction("inventario", "readonly");
      const index = newTransaction.objectStore("inventario").index("nombre");
      const reqCursor = index.openCursor();
      reqCursor.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const nombreProducto = cursor.value.nombre.toLowerCase();
          if (nombreProducto.includes(texto)) {
            agregarProductoFactura(cursor.value);
            return;
          }
          cursor.continue();
        } else {
          alert("Producto no encontrado.");
        }
      };
    }
  };
}

// ==== AGREGAR PRODUCTO A LA FACTURA ====
function agregarProductoFactura(producto) {
  const tbody = document.querySelector("#tablaProductos tbody");

  const fila = document.createElement("tr");

  // Nombre
  const tdNombre = document.createElement("td");
  tdNombre.textContent = producto.nombre;

  // Cantidad (editable)
  const tdCantidad = document.createElement("td");
  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.value = 1;
  inputCantidad.min = 1;
  inputCantidad.oninput = actualizarTotalFactura;
  tdCantidad.appendChild(inputCantidad);

  // Precio
  const tdPrecio = document.createElement("td");
  tdPrecio.textContent = producto.precio;

  // Total por producto
  const tdTotal = document.createElement("td");
  tdTotal.textContent = producto.precio;

  // Botón eliminar
  const tdEliminar = document.createElement("td");
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "❌";
  btnEliminar.onclick = () => {
    fila.remove();
    actualizarTotalFactura();
  };
  tdEliminar.appendChild(btnEliminar);

  fila.append(tdNombre, tdCantidad, tdPrecio, tdTotal, tdEliminar);
  tbody.appendChild(fila);

  inputCantidad.addEventListener("input", () => {
    const cantidad = parseInt(inputCantidad.value) || 1;
    tdTotal.textContent = producto.precio * cantidad;
    actualizarTotalFactura();
  });

  actualizarTotalFactura();
}

// ==== ACTUALIZAR TOTAL DE FACTURA ====
function actualizarTotalFactura() {
  let total = 0;
  const filas = document.querySelectorAll("#tablaProductos tbody tr");

  filas.forEach(fila => {
    const precio = parseFloat(fila.children[2].textContent);
    const cantidad = parseInt(fila.children[1].children[0].value);
    total += precio * cantidad;
    fila.children[3].textContent = (precio * cantidad).toFixed(2);
  });

  document.getElementById("totalFactura").textContent = total.toFixed(2);
}

// ==== IMPRIMIR FACTURA ====
function imprimirFactura() {
  mostrarFechaHora(); // Asegura que la hora esté actualizada antes de imprimir
  window.print();
}
