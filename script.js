

function agregarProducto() {
  const tbody = document.getElementById('productos-body');
  const fila = document.createElement('tr');

  fila.innerHTML = `
    <td><input type="text" placeholder="Producto" /></td>
    <td><input type="number" value="1" min="1" oninput="calcularTotal()" /></td>
    <td><input type="number" value="0" min="0" oninput="calcularTotal()" /></td>
    <td class="subtotal">$0</td>
    <td class="no-print"><button onclick="eliminarFila(this)">Eliminar</button></td>
  `;

  tbody.appendChild(fila);
  calcularTotal();
}

function eliminarFila(btn) {
  btn.closest('tr').remove();
  calcularTotal();
}

function calcularTotal() {
  let total = 0;
  const filas = document.querySelectorAll('#productos-body tr');

  filas.forEach(fila => {
    const cantidad = fila.children[1].querySelector('input').valueAsNumber || 0;
    const valor = fila.children[2].querySelector('input').valueAsNumber || 0;
    const subtotal = cantidad * valor;
    fila.querySelector('.subtotal').textContent = subtotal.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP'
    });
    total += subtotal;
  });

  document.getElementById('total').textContent = total.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP'
  });
}