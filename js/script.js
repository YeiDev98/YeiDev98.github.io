// ============================================
// MENÚ MÓVIL HAMBURGUESA
// ============================================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
  mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// ============================================
// BOTÓN VOLVER ARRIBA — CORREGIDO
// ============================================
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'flex';
  } else {
    backToTopButton.style.display = 'none';
  }
});

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// ANIMACIONES AL SCROLL
// ============================================
const revealElements = document.querySelectorAll('.room-card, .feature-card, .testimonial-card, .gallery-item');

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
});

const revealOnScroll = () => {
  revealElements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ============================================
// MODAL SELECTOR DE HUÉSPEDES (tarjetas)
// ============================================
const modal = document.getElementById('guest-modal');
const modalClose = document.getElementById('modal-close');
const modalHabName = document.getElementById('modal-hab-name');
const modalMaxLabel = document.getElementById('guest-max-label');
const guestCount = document.getElementById('guest-count');
const guestMinus = document.getElementById('guest-minus');
const guestPlus = document.getElementById('guest-plus');
const modalConfirm = document.getElementById('modal-confirm');

let currentHab = '';
let currentMax = 1;
let currentGuests = 1;

document.querySelectorAll('.btn-reservar').forEach(btn => {
  btn.addEventListener('click', () => {
    currentHab = btn.dataset.hab;
    currentMax = parseInt(btn.dataset.max);
    currentGuests = 1;

    modalHabName.textContent = currentHab;
    modalMaxLabel.textContent = currentMax;
    guestCount.textContent = currentGuests;
    guestMinus.disabled = true;
    guestPlus.disabled = currentMax === 1;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

const closeModal = () => {
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

guestMinus.addEventListener('click', () => {
  if (currentGuests > 1) {
    currentGuests--;
    guestCount.textContent = currentGuests;
    guestMinus.disabled = currentGuests === 1;
    guestPlus.disabled = false;
  }
});

guestPlus.addEventListener('click', () => {
  if (currentGuests < currentMax) {
    currentGuests++;
    guestCount.textContent = currentGuests;
    guestPlus.disabled = currentGuests === currentMax;
    guestMinus.disabled = false;
  }
});

modalConfirm.addEventListener('click', () => {
  const personaLabel = currentGuests === 1 ? '1 persona' : `${currentGuests} personas`;
  const msg = `🏨 *RESERVA HOTEL FÉNIX*%0A%0A🛏️ *Habitación:* ${currentHab}%0A👥 *Huéspedes:* ${personaLabel}%0A%0A✨ ¡Esperamos tu reserva!`;
  window.open(`https://wa.me/573127526760?text=${msg}`, '_blank');
  closeModal();
});

// ============================================
// SELECTOR DE PERSONAS EN FORMULARIO
// ============================================
const tipoHabSelect = document.getElementById('tipo-habitacion');
const personasWrapper = document.getElementById('personas-wrapper');
const formMinus = document.getElementById('form-minus');
const formPlus = document.getElementById('form-plus');
const formCount = document.getElementById('form-count');
const personasNote = document.getElementById('personas-note');

let formPersonas = 1;
let formMax = 1;

if (tipoHabSelect) {
  tipoHabSelect.addEventListener('change', () => {
    const selected = tipoHabSelect.options[tipoHabSelect.selectedIndex];
    const max = parseInt(selected.dataset.max);

    if (max) {
      formMax = max;
      formPersonas = 1;
      formCount.textContent = formPersonas;
      formMinus.disabled = true;
      formPlus.disabled = formMax === 1;
      personasNote.textContent = `Capacidad máxima: ${formMax} persona${formMax > 1 ? 's' : ''}`;
      personasWrapper.classList.add('visible');
    } else {
      personasWrapper.classList.remove('visible');
    }
  });
}

if (formMinus) {
  formMinus.addEventListener('click', () => {
    if (formPersonas > 1) {
      formPersonas--;
      formCount.textContent = formPersonas;
      formMinus.disabled = formPersonas === 1;
      formPlus.disabled = false;
    }
  });
}

if (formPlus) {
  formPlus.addEventListener('click', () => {
    if (formPersonas < formMax) {
      formPersonas++;
      formCount.textContent = formPersonas;
      formPlus.disabled = formPersonas === formMax;
      formMinus.disabled = false;
    }
  });
}

// ============================================
// FORMULARIO DE RESERVA → WHATSAPP
// ============================================
const form = document.getElementById('reservation-form');
const whatsappNumber = '573127526760';

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const fecha = document.getElementById('fecha')?.value || '';
    const tipoHabitacion = document.getElementById('tipo-habitacion')?.value || '';
    const mensaje = document.getElementById('mensaje')?.value.trim() || '';

    if (!nombre) { mostrarNotificacion('⚠️ Por favor, ingresa tu nombre completo', 'error'); return; }
    if (!fecha) { mostrarNotificacion('⚠️ Por favor, selecciona una fecha de llegada', 'error'); return; }
    if (!tipoHabitacion) { mostrarNotificacion('⚠️ Por favor, selecciona un tipo de habitación', 'error'); return; }

    const personasWrapper = document.getElementById('personas-wrapper');
    const personasVisible = personasWrapper && personasWrapper.classList.contains('visible');
    const personas = personasVisible ? formPersonas : null;

    const fechaFormateada = fecha.split('-').reverse().join('/');
    const personaLabel = personas ? (personas === 1 ? '1 persona' : `${personas} personas`) : 'No especificado';

    let msg = `🏨 *RESERVA HOTEL FÉNIX* 🏨%0A%0A`;
    msg += `👤 *Nombre:* ${nombre}%0A`;
    msg += `📅 *Fecha de llegada:* ${fechaFormateada}%0A`;
    msg += `🛏️ *Habitación:* ${tipoHabitacion}%0A`;
    msg += `👥 *Huéspedes:* ${personaLabel}%0A`;
    if (mensaje) msg += `💬 *Mensaje:* ${mensaje}%0A`;
    msg += `%0A✨ ¡Esperamos tu reserva!`;

    mostrarNotificacion('✅ ¡Redirigiendo a WhatsApp!', 'success');
    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    }, 900);
  });
}

// ============================================
// NOTIFICACIONES
// ============================================
function mostrarNotificacion(mensaje, tipo) {
  const n = document.createElement('div');
  Object.assign(n.style, {
    position: 'fixed', top: '90px', right: '20px', zIndex: '9999',
    padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: '500',
    boxShadow: '0 10px 25px rgba(0,0,0,0.25)', animation: 'slideInRight 0.3s ease',
    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    background: tipo === 'success' ? '#25D366' : '#dc3545',
    color: '#fff',
    borderLeft: tipo === 'success' ? '4px solid rgba(255,255,255,0.5)' : '4px solid #ffc107'
  });
  n.textContent = mensaje;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => n.parentNode?.removeChild(n), 300);
  }, 3000);
}

// ============================================
// CSS DE ANIMACIONES (dinámico)
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(110%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0);    opacity: 1; }
    to   { transform: translateX(110%); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);

// ============================================
// SCROLL SUAVE PARA ANCLAS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    }
  });
});

console.log('✅ Hotel Fénix · Doradal — Web cargada correctamente');
