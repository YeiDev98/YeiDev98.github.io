document.addEventListener("DOMContentLoaded", async () => {
  await abrirDB();
  mostrarFechaHora();
  configurarEventos();
});

// Mostrar fecha y hora actual en factura
function mostrarFechaHora() {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-CO');
  const hora = ahora.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById("fechaFactura").textContent = `${fecha} ${hora}`;
}

// Buscar y agregar producto desde IndexedDB
function buscarYAgregarProducto() {
  const criterio = document.getElementById("buscar").value.trim().toLowerCase();
  if (!criterio) return;

  const transaction = db.transaction(["productos"], "readonly");
  const store = transaction.objectStore("productos");
  const productos = [];

  store.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const producto = cursor.value;
      if (
        producto.nombre.toLowerCase().includes(criterio) ||
        producto.codigo?.toLowerCase().includes(criterio)
      ) {
        productos.push(producto);
      }
      cursor.continue();
    } else {
      if (productos.length > 0) {
        agregarProductoAFactura(productos[0]); // Agrega el primero encontrado
      } else {
        alert("Producto no encontrado");
      }
    }
  };
}

// Agregar producto a la tabla de la factura
function agregarProductoAFactura(producto) {
  const tbody = document.querySelector("#tablaProductos tbody");

  const fila = document.createElement("tr");

  const tdNombre = document.createElement("td");
  tdNombre.textContent = producto.nombre;

  const tdPrecio = document.createElement("td");
  tdPrecio.textContent = producto.precio.toFixed(2);

  const tdCantidad = document.createElement("td");
  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.value = 1;
  inputCantidad.min = 1;

  const tdTotal = document.createElement("td");
  tdTotal.textContent = producto.precio.toFixed(2);

  inputCantidad.addEventListener("input", () => {
    tdTotal.textContent = (inputCantidad.value * producto.precio).toFixed(2);
    actualizarTotalFactura();
  });

  tdCantidad.appendChild(inputCantidad);

  const tdEliminar = document.createElement("td");
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "✕";
  btnEliminar.onclick = () => {
    fila.remove();
    actualizarTotalFactura();
  };
  tdEliminar.appendChild(btnEliminar);

  fila.appendChild(tdNombre);
  fila.appendChild(tdPrecio);
  fila.appendChild(tdCantidad);
  fila.appendChild(tdTotal);
  fila.appendChild(tdEliminar);

  tbody.appendChild(fila);

  actualizarTotalFactura();
}

// Calcular y mostrar el total de la factura
function actualizarTotalFactura() {
  const filas = document.querySelectorAll("#tablaProductos tbody tr");
  let total = 0;

  filas.forEach(fila => {
    const cantidad = parseFloat(fila.querySelector("input").value);
    const precio = parseFloat(fila.cells[1].textContent);
    total += cantidad * precio;
  });

  document.getElementById("totalFactura").textContent = total.toFixed(2);
}

// Configurar eventos de los botones y entradas
function configurarEventos() {
  const btnAgregar = document.getElementById("btnAgregarProducto");
  const inputBuscar = document.getElementById("buscar");

  if (btnAgregar) {
    btnAgregar.addEventListener("click", buscarYAgregarProducto);
  }

  if (inputBuscar) {
    inputBuscar.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        buscarYAgregarProducto();
      }
    });
  }
  const btnImprimir = document.getElementById("imprimir");
  if (btnImprimir) {
  btnImprimir.addEventListener("click", imprimirFactura);
  }
}

// Imprimir la factura
function imprimirFactura() {
  const detalle = document.getElementById("detalle-factura");
  detalle.innerHTML = "";

  const filas = document.querySelectorAll("#tablaProductos tbody tr");

  filas.forEach(fila => {
    const nombre = fila.cells[0].textContent;
    const cantidad = fila.querySelector("input").value;
    const total = fila.cells[3].textContent;

    const filaImpresion = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = nombre;

    const tdCantidad = document.createElement("td");
    tdCantidad.textContent = cantidad;

    const tdTotal = document.createElement("td");
    tdTotal.textContent = total;

    filaImpresion.appendChild(tdNombre);
    filaImpresion.appendChild(tdCantidad);
    filaImpresion.appendChild(tdTotal);

    detalle.appendChild(filaImpresion);
  });

  // Copiar total a impresión (ya actualizado)
  const total = document.getElementById("totalFactura").textContent;
  document.querySelector("#factura-impresion #totalFactura").textContent = total;

  // Mostrar fecha actual
  mostrarFechaHora();

  // Imprimir
  window.print();
}
