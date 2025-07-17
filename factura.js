document.addEventListener("DOMContentLoaded", () => {
  const inventario = [
    { nombre: "Jabón", precio: 2500 },
    { nombre: "Gaseosa", precio: 3500 },
    { nombre: "Aceite", precio: 5200 },
    { nombre: "Pan", precio: 1800 },
  ];

  const inputBusqueda = document.getElementById("busqueda");
  const inputCantidad = document.getElementById("cantidad");
  const btnAgregar = document.getElementById("agregar");
  const tablaBody = document.querySelector("#tabla-productos tbody");
  const totalSpan = document.getElementById("total");
  const imprimirBtn = document.getElementById("imprimir");

  const facturaImpresion = document.getElementById("factura-impresion");
  const fechaImpresion = document.getElementById("fecha");
  const detalleFactura = document.getElementById("detalle-factura");
  const totalFactura = document.getElementById("total-factura");

  let productosFactura = [];

  function buscarProducto(nombre) {
    return inventario.find(
      (p) => p.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );
  }

  function agregarProducto() {
    const nombre = inputBusqueda.value;
    const cantidad = parseInt(inputCantidad.value);
    if (!nombre || isNaN(cantidad) || cantidad <= 0) return;

    const producto = buscarProducto(nombre);
    if (!producto) {
      alert("Producto no encontrado en el inventario");
      return;
    }

    const existente = productosFactura.find((p) => p.nombre === producto.nombre);
    if (existente) {
      existente.cantidad += cantidad;
      existente.total = existente.cantidad * existente.precio;
    } else {
      productosFactura.push({
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        total: producto.precio * cantidad,
      });
    }

    inputBusqueda.value = "";
    inputCantidad.value = 1;
    renderTabla();
    actualizarTotal();
  }

  function eliminarProducto(index) {
    productosFactura.splice(index, 1);
    renderTabla();
    actualizarTotal();
  }

  function renderTabla() {
    tablaBody.innerHTML = "";
    productosFactura.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td>${p.cantidad}</td>
        <td>$${p.total}</td>
        <td><button onclick="eliminarProductoDesdeBoton(${i})">Eliminar</button></td>
      `;
      tablaBody.appendChild(row);
    });
  }

  // Función para poder eliminar desde botón inline
  window.eliminarProductoDesdeBoton = eliminarProducto;

  function actualizarTotal() {
    const total = productosFactura.reduce((sum, p) => sum + p.total, 0);
    totalSpan.textContent = total.toLocaleString();
  }

  function obtenerFechaHora() {
    const now = new Date();
    const fecha = now.toLocaleDateString("es-CO");
    const hora = now.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit' });
    return `${fecha} ${hora}`;
  }

  function imprimirFactura() {
    // Rellenar la sección oculta con la info actual
    fechaImpresion.textContent = obtenerFechaHora();
    detalleFactura.innerHTML = "";
    productosFactura.forEach((p) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.cantidad}</td>
        <td>$${p.total}</td>
      `;
      detalleFactura.appendChild(row);
    });

    totalFactura.textContent = productosFactura.reduce((sum, p) => sum + p.total, 0).toLocaleString();

    // Mostrar solo el contenido de factura-impresion
    const ventana = window.open("", "Imprimir", "width=400,height=600");
    ventana.document.write(`
      <html>
        <head>
          <title>Factura</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 4px; text-align: left; }
            h2 { text-align: center; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          ${facturaImpresion.innerHTML}
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  }

  btnAgregar.addEventListener("click", agregarProducto);
  imprimirBtn.addEventListener("click", imprimirFactura);
});
