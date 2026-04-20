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

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// ============================================
// BOTÓN VOLVER ARRIBA (BACK TO TOP)
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
// ANIMACIONES AL HACER SCROLL (REVEAL)
// ============================================
const revealElements = document.querySelectorAll('.room-card, .feature-card, .testimonial-card, .gallery-item');

const revealOnScroll = () => {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (elementTop < windowHeight - 100) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};

// Establecer estilos iniciales para animación
revealElements.forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Ejecutar al cargar

// ============================================
// FORMULARIO DE RESERVA - FUNCIONAL
// ============================================
const form = document.getElementById('reservation-form');
const whatsappNumber = '573127526760'; // Número de WhatsApp (sin +)

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const fecha = document.getElementById('fecha')?.value || '';
    const personas = document.getElementById('personas')?.value || '';
    const tipoHabitacion = document.getElementById('tipo-habitacion')?.value || '';
    const mensaje = document.getElementById('mensaje')?.value.trim() || '';
    
    // Validar campos obligatorios
    if (!nombre) {
      mostrarNotificacion('⚠️ Por favor, ingresa tu nombre completo', 'error');
      return;
    }
    
    if (!fecha) {
      mostrarNotificacion('⚠️ Por favor, selecciona una fecha de llegada', 'error');
      return;
    }
    
    if (!personas || personas < 1) {
      mostrarNotificacion('⚠️ Por favor, indica el número de personas', 'error');
      return;
    }
    
    if (!tipoHabitacion) {
      mostrarNotificacion('⚠️ Por favor, selecciona un tipo de habitación', 'error');
      return;
    }
    
    // Formatear fecha (de YYYY-MM-DD a DD/MM/YYYY)
    const fechaFormateada = fecha.split('-').reverse().join('/');
    
    // Construir mensaje para WhatsApp
    let mensajeWhatsApp = `🏨 *RESERVA HOTEL FÉNIX* 🏨%0A%0A`;
    mensajeWhatsApp += `👤 *Nombre:* ${nombre}%0A`;
    mensajeWhatsApp += `📅 *Fecha de llegada:* ${fechaFormateada}%0A`;
    mensajeWhatsApp += `👥 *Personas:* ${personas}%0A`;
    mensajeWhatsApp += `🛏️ *Habitación:* ${tipoHabitacion}%0A`;
    
    if (mensaje) {
      mensajeWhatsApp += `💬 *Mensaje:* ${mensaje}%0A`;
    }
    
    mensajeWhatsApp += `%0A✨ ¡Esperamos tu reserva! ✨`;
    
    // Crear URL de WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${mensajeWhatsApp}`;
    
    // Mostrar notificación de éxito
    mostrarNotificacion('✅ ¡Redirigiendo a WhatsApp para completar tu reserva!', 'success');
    
    // Redirigir a WhatsApp después de 1 segundo
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
    }, 1000);
  });
}

// ============================================
// FUNCIÓN PARA MOSTRAR NOTIFICACIONES
// ============================================
function mostrarNotificacion(mensaje, tipo) {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `custom-notification ${tipo}`;
  notificacion.innerHTML = `
    <div class="notification-content">
      <span>${mensaje}</span>
    </div>
  `;
  
  // Estilos de la notificación
  notificacion.style.position = 'fixed';
  notificacion.style.top = '100px';
  notificacion.style.right = '20px';
  notificacion.style.zIndex = '9999';
  notificacion.style.padding = '1rem 1.5rem';
  notificacion.style.borderRadius = '12px';
  notificacion.style.fontWeight = '500';
  notificacion.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  notificacion.style.animation = 'slideInRight 0.3s ease';
  
  if (tipo === 'success') {
    notificacion.style.backgroundColor = '#25D366';
    notificacion.style.color = '#fff';
    notificacion.style.borderLeft = '4px solid #fff';
  } else {
    notificacion.style.backgroundColor = '#dc3545';
    notificacion.style.color = '#fff';
    notificacion.style.borderLeft = '4px solid #ffc107';
  }
  
  document.body.appendChild(notificacion);
  
  // Eliminar notificación después de 3 segundos
  setTimeout(() => {
    notificacion.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// ============================================
// AGREGAR ANIMACIONES CSS DINÁMICAMENTE
// ============================================
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  /* Mejoras visuales para el formulario */
  .contact-form input:focus,
  .contact-form select:focus,
  .contact-form textarea:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
  }
  
  .btn-submit {
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-submit:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
  
  .btn-submit:active {
    transform: translateY(0);
  }
`;
document.head.appendChild(styleSheet);

// ============================================
// SCROLL SUAVE PARA TODOS LOS ENLACES ANCLA
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// LAZY LOADING DE IMÁGENES (MEJORA DE RENDIMIENTO)
// ============================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// BOTONES DE WHATSAPP EN HABITACIONES (YA FUNCIONAN)
// NOTA: Los botones de las tarjetas ya tienen href directo a WhatsApp
// ============================================
console.log('✅ Hotel Fénix - Web Premium Cargada Correctamente');
console.log('📱 Formulario de reservas funcional con WhatsApp');