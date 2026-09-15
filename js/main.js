/* =====================================================
   ARCHIVO: main.js
   DESCRIPCIÓN: Lógica de Dapper Peluquería y Barbería.
   Incluye slider automático del hero, aparición suave
   al scrollear y año dinámico del footer.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initRevealOnScroll();
  initFooterYear();
  initCenteredAnchors();
});

/* ===== 1. SLIDER HERO - Rota las fotos solas, sin control manual =====
   Cambia la clase .is-active cada 5 segundos con crossfade.
   Si el usuario prefiere movimiento reducido, deja la primera fija. */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  // No animar si el usuario pidió movimiento reducido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // la primera ya trae .is-active desde el HTML
  }

  let current = 0;

  const show = (index) => {
    slides[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
  };

  // Precarga las imágenes para una transición fluida
  slides.forEach((slide) => {
    const bg = slide.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (bg && bg[1]) {
      const img = new Image();
      img.src = bg[1];
    }
  });

  // Rotación 100% automática
  setInterval(() => show(current + 1), 5000);
}

/* ===== 2. REVEAL ON SCROLL - Muestra el contenido al scrollear =====
   Usa IntersectionObserver para agregar .visible con animación suave. */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Si no hay soporte o hay movimiento reducido, muestra todo
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // solo anima una vez
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* ===== 3. AÑO FOOTER - Mantiene el copyright actualizado ===== */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ===== 4. ANCLAS CENTRADAS - Servicios/Ubicación/Reseñas bien ubicadas =====
   Al clickar en el nav, deja aire sobre el título para que se vea
   centrado como en la referencia y el header fijo no lo tape. */
function initCenteredAnchors() {
  // Respeta movimiento reducido: deja el salto nativo del navegador
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector('header');
      const headerH = header ? header.offsetHeight : 70;
      // Aire extra para que el kicker + título queden centrados, no pegados arriba
      const breathing = window.innerWidth <= 560 ? 30 : 50;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - breathing;

      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });
}
