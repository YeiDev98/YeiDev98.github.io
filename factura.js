const productosInventario = [
  { nombre: 'Gaseosa', precio: 3500 },
  { nombre: 'Papas fritas', precio: 2000 },
  { nombre: 'Agua', precio: 2500 },
  { nombre: 'Jugo Hit', precio: 3000 },
  { nombre: 'Chocolatina', precio: 1800 },
  { nombre: 'Empanada', precio: 2200 },
  { nombre: 'Cerveza', precio: 5000 }
];

let carrito = [];

document.getElementById('agregar').addEventListener('click', () => {
  const nombre = document.getElementById('busqueda').value.trim();
  const cantidad = parseInt(document.getElementById('cantidad').value);

  if (!nombre || isNaN(cantidad) || cantidad < 1) return;

  const producto = productosInventario.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (!producto) {
    alert('Producto no encontrado en el inventario.');
    return;
  }

  const existente = carrito.find(p => p.nombre === producto.nombre);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  document.getElementById('busqueda').value = '';
  document.getElementById('cantidad').value = 1;

  actualizarTabla();
});

function actualizarTabla() {
  const cuerpo = document.querySelector('#tabla-productos tbody');
  cuerpo.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    const totalProducto = item.precio * item.cantidad;
    total += totalProducto;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>$${item.precio}</td>
      <td>${item.cantidad}</td>
      <td>$${totalProducto}</td>
      <td><button onclick="eliminarProducto(${index})">🗑️</button></td>
    `;
    cuerpo.appendChild(fila);
  });

  document.getElementById('total').textContent = total;
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarTabla();
}

function cargarFechaHora() {
  const ahora = new Date();
  const opciones = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  };
  const fechaFormateada = ahora.toLocaleString('es-CO', opciones);
  document.getElementById('fechaFactura').textContent = fechaFormateada;
}

function imprimirFactura() {
  const tabla = document.getElementById('detalle-factura');
  tabla.innerHTML = '';
  let total = 0;

  carrito.forEach(item => {
    const fila = document.createElement('tr');
    const totalProducto = item.precio * item.cantidad;
    total += totalProducto;

    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>$${totalProducto}</td>
    `;
    tabla.appendChild(fila);
  });

  document.getElementById('total-factura').textContent = total;
  cargarFechaHora();

  // Solo imprime el contenido visible
  window.print();
}
