// factura.js
let db;
let inventario = [];

document.addEventListener('DOMContentLoaded', () => {
  const request = indexedDB.open('miscelaneaDB', 1);

  request.onsuccess = (event) => {
    db = event.target.result;
    cargarInventario();
  };

  request.onerror = () => alert('Error al abrir la base de datos');
});

function cargarInventario() {
  const transaction = db.transaction(['productos'], 'readonly');
  const store = transaction.objectStore('productos');

  const productos = [];
  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      productos.push(cursor.value);
      cursor.continue();
    } else {
      inventario = productos;
      configurarBuscador();
    }
  };
}

function configurarBuscador() {
  const input = document.getElementById('busqueda');
  const sugerencias = document.getElementById('sugerencias');

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    sugerencias.innerHTML = '';

    if (!query) return;

    const resultados = inventario.filter(prod =>
      prod.nombre.toLowerCase().includes(query)
    );

    resultados.forEach(prod => {
      const div = document.createElement('div');
      div.textContent = `${prod.nombre} - $${prod.precio}`;
      div.className = 'sugerencia';
      div.onclick = () => seleccionarProducto(prod);
      sugerencias.appendChild(div);
    });
  });
}

function seleccionarProducto(prod) {
  document.getElementById('busqueda').value = '';
  document.getElementById('sugerencias').innerHTML = '';
  agregarFila(prod);
}

function agregarFila(producto) {
  const tbody = document.getElementById('productos-body');
  const fila = document.createElement('tr');

  const celdaNombre = document.createElement('td');
  celdaNombre.textContent = producto.nombre;

  const celdaCantidad = document.createElement('td');
  const inputCantidad = document.createElement('input');
  inputCantidad.type = 'number';
  inputCantidad.min = 1;
  inputCantidad.value = 1;
  inputCantidad.oninput = actualizarTotal;
  celdaCantidad.appendChild(inputCantidad);

  const celdaPrecio = document.createElement('td');
  celdaPrecio.textContent = `$${producto.precio}`;

  const celdaSubtotal = document.createElement('td');
  celdaSubtotal.textContent = `$${producto.precio}`;
  celdaSubtotal.className = 'subtotal';

  const celdaAccion = document.createElement('td');
  celdaAccion.className = 'no-print';
  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.onclick = () => {
    fila.remove();
    actualizarTotal();
  };
  celdaAccion.appendChild(btnEliminar);

  fila.appendChild(celdaNombre);
  fila.appendChild(celdaCantidad);
  fila.appendChild(celdaPrecio);
  fila.appendChild(celdaSubtotal);
  fila.appendChild(celdaAccion);
  tbody.appendChild(fila);

  inputCantidad.dispatchEvent(new Event('input'));
}

function actualizarTotal() {
  const filas = document.querySelectorAll('#productos-body tr');
  let total = 0;

  filas.forEach(fila => {
    const cantidad = fila.querySelector('input').valueAsNumber || 0;
    const precio = parseFloat(fila.children[2].textContent.replace('$', '')) || 0;
    const subtotal = cantidad * precio;
    fila.querySelector('.subtotal').textContent = `$${subtotal.toFixed(0)}`;
    total += subtotal;
  });

  document.getElementById('total').textContent = `$${total.toFixed(0)}`;
}
