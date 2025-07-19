document.addEventListener("DOMContentLoaded", async () => {
  await abrirDB();
  configurarEventos();
  cargarProductos();
});

function configurarEventos() {
  const btnAgregar = document.getElementById("agregarProducto");

  btnAgregar.addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const codigo = document.getElementById("codigo").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);

    if (!nombre || !codigo || isNaN(precio)) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const producto = { nombre, codigo, precio };
    await agregarProductoInventario(producto);

    document.getElementById("nombre").value = '';
    document.getElementById("codigo").value = '';
    document.getElementById("precio").value = '';

    cargarProductos();
  });
}

async function cargarProductos() {
  const tbody = document.querySelector("#tablaInventario tbody");
  tbody.innerHTML = "";

  const db = await abrirDB();
  const tx = db.transaction("productos", "readonly");
  const store = tx.objectStore("productos");

  store.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const producto = cursor.value;

      const fila = document.createElement("tr");

      const tdNombre = document.createElement("td");
      tdNombre.textContent = producto.nombre;

      const tdCodigo = document.createElement("td");
      tdCodigo.textContent = producto.codigo;

      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = producto.precio.toFixed(2);

      const tdEliminar = document.createElement("td");
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "🗑️";
      btnEliminar.onclick = () => eliminarProducto(cursor.primaryKey);

      tdEliminar.appendChild(btnEliminar);

      fila.appendChild(tdNombre);
      fila.appendChild(tdCodigo);
      fila.appendChild(tdPrecio);
      fila.appendChild(tdEliminar);

      tbody.appendChild(fila);

      cursor.continue();
    }
  };
}

async function eliminarProducto(id) {
  const db = await abrirDB();
  const tx = db.transaction("productos", "readwrite");
  const store = tx.objectStore("productos");
  store.delete(id);

  tx.oncomplete = () => {
    cargarProductos();
  };
}
