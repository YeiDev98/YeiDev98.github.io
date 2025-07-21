document.addEventListener("DOMContentLoaded", async () => {
  await abrirDB();
  mostrarProductos();

  document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const codigo = document.getElementById("codigo").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);

    if (!nombre || !codigo || isNaN(precio) || isNaN(stock)) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const producto = {
      id: crypto.randomUUID(),
      nombre,
      codigo,
      precio,
      stock
    };

    const tx = db.transaction("productos", "readwrite");
    const store = tx.objectStore("productos");
    await store.add(producto);
    await tx.done;

    document.getElementById("formulario").reset();
    mostrarProductos();
  });
});

async function mostrarProductos() {
  const tx = db.transaction("productos", "readonly");
  const store = tx.objectStore("productos");

  const lista = document.getElementById("lista-productos");
  lista.innerHTML = "";

  let cursor = await store.openCursor();
  while (cursor) {
    const { id, nombre, codigo, precio, stock } = cursor.value;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${nombre}</td>
      <td>${codigo}</td>
      <td>${precio.toFixed(2)}</td>
      <td>${stock}</td>
      <td><button onclick="eliminarProducto('${id}')">Eliminar</button></td>
    `;

    lista.appendChild(fila);
    cursor = await cursor.continue();
  }
}

async function eliminarProducto(id) {
  const tx = db.transaction("productos", "readwrite");
  const store = tx.objectStore("productos");
  await store.delete(id);
  await tx.done;

  mostrarProductos();
}
