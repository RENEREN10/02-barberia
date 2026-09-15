/* =====================================================
   ARCHIVO: main.js
   DESCRIPCIÓN: Lógica de Dapper Peluquería y Barbería.
   Incluye slider automático del hero, aparición suave
   al scrollear, año dinámico del footer, anclas centradas
   y selector de idioma ES/EN con diccionario JS.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initRevealOnScroll();
  initFooterYear();
  initCenteredAnchors();
  initLanguage();
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

/* ===== 5. IDIOMA ES/EN - Diccionario JS con persistencia =====
   Todos los textos traducibles llevan data-i18n="clave".
   - data-i18n="clave" -> innerHTML
   - data-i18n-aria="clave" -> aria-label
   - data-i18n-content="clave" -> content (meta description)
   - data-i18n-title="clave" -> title (iframe mapa)
   - data-i18n-href="clave" -> href (links WhatsApp con texto predefinido)
   La elección se guarda en localStorage y se mantiene entre páginas. */
const I18N = {
  es: {
    "meta.title.home": "Dapper Peluquería y Barbería | Estilo para Él y Ella",
    "meta.desc.home": "Dapper Peluquería y Barbería premium. Cortes para hombres y mujeres, color, barba y estilo.",
    "meta.title.men": "Servicios Hombre | Dapper Peluquería y Barbería",
    "meta.desc.men": "Servicios para hombre en Dapper: cortes fade, barba, facial y combos.",
    "meta.title.women": "Servicios Dama | Dapper Peluquería y Barbería",
    "meta.desc.women": "Servicios para dama en Dapper: corte, color, cepillado, alisados y combos.",
    "nav.services": "Servicios",
    "nav.location": "Ubicación",
    "nav.reviews": "Reseñas",
    "nav.book": "Reservar Cita",
    "hero.kicker": "Peluquería & Barbería Premium",
    "hero.title": "Estilo que <span>Habla</span> por Ti",
    "hero.desc": "Belleza y estilo premium para hombres y mujeres. Cortes precisos, color, barba perfecta y una experiencia pensada para quienes exigen distinción.",
    "exp.kicker": "Estás a una cita de tu mejor versión",
    "exp.title": "Donde el estilo se convierte en <span>experiencia</span>",
    "exp.p1": "Bienvenido a <strong>Dapper Peluquería & Barbería</strong>, un espacio donde la elegancia se vive en cada detalle. Aquí el cuidado personal va más allá de un corte: es un ritual de estilo para hombres, mujeres y adolescentes que buscan verse y sentirse excepcionales.",
    "exp.p2": "De un fade impecable a un color luminoso, de la barba perfectamente perfilada a un cepillado con acabado premium. Nuestro equipo de barberos y estilistas combina técnica, productos de alta gama y atención cálida para que cada visita sea un momento para ti. Agenda tu cita y vive la distinción en cada detalle.",
    "exp.link": "Agendar mi cita →",
    "services.kicker": "Nuestro menú",
    "services.title": "Nuestros Servicios",
    "services.subtitle": "Para él y para ella. Elige tu categoría y descubre todos los servicios, combos y precios.",
    "men.tag": "Para Él",
    "men.title": "Servicios Hombre",
    "men.desc": "Cortes fade, clásicos, barba, facial y combos.",
    "men.li1": "Corte clásico y fade",
    "men.li2": "Ritual de barba con toalla caliente",
    "men.li3": "Combos corte + barba + facial",
    "men.btn": "Ver servicios de hombre",
    "women.tag": "Para Ella",
    "women.title": "Servicios Dama",
    "women.desc": "Corte, color, cepillado, alisados y combos.",
    "women.li1": "Corte, cepillado y tratamientos",
    "women.li2": "Color, rayitos y balayage",
    "women.li3": "Combos corte + color + peinado",
    "women.btn": "Ver servicios de dama",
    "why.kicker": "Por qué elegirnos",
    "why.title": "Una Experiencia Pensada Para Ti",
    "why.subtitle": "Detalles que hacen diferente cada visita a Dapper.",
    "why.1.title": "Atención con o sin cita",
    "why.1.text": "Te recibimos siempre, a tu ritmo.",
    "why.2.title": "Especialistas en él y ella",
    "why.2.text": "Barberos máster y estilistas profesionales.",
    "why.3.title": "Bebida de cortesía",
    "why.3.text": "Disfruta mientras te consienten.",
    "location.kicker": "Visítanos",
    "location.title": "Dónde Encontrarnos",
    "location.subtitle": "Te esperamos en un espacio diseñado para tu comodidad.",
    "location.addrLabel": "Dirección",
    "location.addrValue": "Calle Principal #12-34, Zona Rosa",
    "location.phoneLabel": "Teléfono / WhatsApp",
    "location.hoursTitle": "Horarios de atención",
    "location.day1": "Lunes a Viernes",
    "location.day2": "Sábados",
    "location.day3": "Domingos y Festivos",
    "location.mapTitle": "Mapa de Dapper Peluquería y Barbería",
    "reviews.kicker": "Opiniones reales",
    "reviews.title": "Lo Que Dicen Nuestros Clientes",
    "reviews.subtitle": "La confianza se gana corte a corte. Esto opinan quienes ya vivieron la experiencia Dapper.",
    "review1.text": "“El mejor fade que me han hecho. Precisos, puntuales y el ritual de barba es otro nivel. Salí renovado.”",
    "review1.service": "Corte Fade + Barba",
    "review2.text": "“Mi balayage quedó espectacular, el color tal como lo pedí. Me asesoraron con calma y el trato fue hermoso.”",
    "review2.service": "Color + Cepillado",
    "review3.text": "“Llevé a mi hija adolescente por su primer corte y salió feliz. Lugar limpio, ambiente elegante y gran atención.”",
    "review3.service": "Corte + Tratamiento",
    "footer.tag": "Peluquería & Barbería",
    "footer.rights": "Dapper Peluquería y Barbería. Todos los derechos reservados.",
    "whatsapp.aria": "Escríbenos por WhatsApp",
    "detail.men.kicker": "Para Él",
    "detail.men.title": "Servicios <span>Hombre</span>",
    "detail.men.desc": "Cortes precisos, barba perfecta y combos pensados para el hombre que exige distinción.",
    "detail.women.kicker": "Para Ella",
    "detail.women.title": "Servicios <span>Dama</span>",
    "detail.women.desc": "Corte, color y peinado con acabado premium, pensados para resaltar tu estilo único.",
    "detail.back": "← Volver a servicios",
    "service.cta": "Agendar este servicio",
    "badge.popular": "Popular",
    "badge.combo": "Combo",
    "badge.ultimate": "Total",
    "men.s1.name": "Corte Clásico",
    "men.s1.desc": "Lavado, corte con tijera o máquina, perfilado de contornos y peinado a tu medida.",
    "men.s2.name": "Fade / Degradado",
    "men.s2.desc": "Degradado preciso, diseño de contornos, cejas y styling final con producto premium.",
    "men.s3.name": "Ritual de Barba",
    "men.s3.desc": "Toalla caliente, pre-afeitado, recorte con navaja, aceites y cierre con crema hidratante.",
    "men.s4.name": "Combo Corte + Barba",
    "men.s4.desc": "Corte a tu elección + ritual de barba completo, bebida de cortesía y styling de firma.",
    "men.s5.name": "Limpieza Facial Hombre",
    "men.s5.desc": "Limpieza profunda, exfoliación y mascarilla revitalizante para una piel impecable.",
    "men.s6.name": "Combo Dapper Leyenda",
    "men.s6.desc": "Corte + barba + limpieza facial exprés, bebida de cortesía y asesoría de imagen.",
    "women.s1.name": "Corte Dama",
    "women.s1.desc": "Asesoría de estilo, lavado, corte a medida y cepillado final con acabado suave.",
    "women.s2.name": "Cepillado + Tratamiento",
    "women.s2.desc": "Lavado con tratamiento hidratante, cepillado liso o con ondas y serum protector.",
    "women.s3.name": "Color / Rayitos",
    "women.s3.desc": "Color global, rayitos o balayage con diagnóstico previo y tratamiento de cierre.",
    "women.s3.price": "Desde $120.000",
    "women.s4.name": "Alisado Keratina",
    "women.s4.desc": "Alisado progresivo con keratina, lavado especial, planchado técnico y sellado.",
    "women.s4.price": "Desde $150.000",
    "women.s5.name": "Peinado Evento",
    "women.s5.desc": "Recogidos, ondas o trenzas para eventos, con prueba de estilo y fijación premium.",
    "women.s6.name": "Combo Dama Total",
    "women.s6.desc": "Corte + cepillado + tratamiento hidratante profundo y bebida de cortesía.",
    "wa.men.s1": "https://wa.me/?text=Hola%20quiero%20agendar%20Corte%20Cl%C3%A1sico%20Hombre",
    "wa.men.s2": "https://wa.me/?text=Hola%20quiero%20agendar%20Fade%20Degradado",
    "wa.men.s3": "https://wa.me/?text=Hola%20quiero%20agendar%20Ritual%20de%20Barba",
    "wa.men.s4": "https://wa.me/?text=Hola%20quiero%20agendar%20Combo%20Corte%20m%C3%A1s%20Barba",
    "wa.men.s5": "https://wa.me/?text=Hola%20quiero%20agendar%20Limpieza%20Facial%20Hombre",
    "wa.men.s6": "https://wa.me/?text=Hola%20quiero%20agendar%20Combo%20Dapper%20Leyenda",
    "wa.women.s1": "https://wa.me/?text=Hola%20quiero%20agendar%20Corte%20Dama",
    "wa.women.s2": "https://wa.me/?text=Hola%20quiero%20agendar%20Cepillado%20m%C3%A1s%20Tratamiento",
    "wa.women.s3": "https://wa.me/?text=Hola%20quiero%20agendar%20Color%20Rayitos",
    "wa.women.s4": "https://wa.me/?text=Hola%20quiero%20agendar%20Alisado%20Keratina",
    "wa.women.s5": "https://wa.me/?text=Hola%20quiero%20agendar%20Peinado%20Evento",
    "wa.women.s6": "https://wa.me/?text=Hola%20quiero%20agendar%20Combo%20Dama%20Total"
  },
  en: {
    "meta.title.home": "Dapper Salon & Barbershop | Style for Him and Her",
    "meta.desc.home": "Premium Dapper Salon & Barbershop. Cuts for men and women, color, beard and style.",
    "meta.title.men": "Men's Services | Dapper Salon & Barbershop",
    "meta.desc.men": "Services for men at Dapper: fade cuts, beard, facial and combos.",
    "meta.title.women": "Women's Services | Dapper Salon & Barbershop",
    "meta.desc.women": "Services for women at Dapper: cut, color, blowout, straightening and combos.",
    "nav.services": "Services",
    "nav.location": "Location",
    "nav.reviews": "Reviews",
    "nav.book": "Book Now",
    "hero.kicker": "Premium Salon & Barbershop",
    "hero.title": "Style that <span>Speaks</span> for You",
    "hero.desc": "Premium beauty and style for men and women. Precise cuts, color, perfect beard and an experience designed for those who demand distinction.",
    "exp.kicker": "You are one appointment away from your best version",
    "exp.title": "Where style becomes <span>experience</span>",
    "exp.p1": "Welcome to <strong>Dapper Salon & Barbershop</strong>, a space where elegance lives in every detail. Here personal care goes beyond a cut: it is a style ritual for men, women and teens who want to look and feel exceptional.",
    "exp.p2": "From a flawless fade to luminous color, from a perfectly sculpted beard to a premium blowout. Our team of master barbers and stylists combines technique, high-end products and warm service so every visit is a moment for you. Book your appointment and live distinction in every detail.",
    "exp.link": "Book my appointment →",
    "services.kicker": "Our menu",
    "services.title": "Our Services",
    "services.subtitle": "For him and for her. Choose your category and discover all services, combos and prices.",
    "men.tag": "For Him",
    "men.title": "Men's Services",
    "men.desc": "Fade, classic cuts, beard, facial and combos.",
    "men.li1": "Classic and fade cuts",
    "men.li2": "Hot-towel beard ritual",
    "men.li3": "Cut + beard + facial combos",
    "men.btn": "View men's services",
    "women.tag": "For Her",
    "women.title": "Women's Services",
    "women.desc": "Cut, color, blowout, straightening and combos.",
    "women.li1": "Cut, blowout and treatments",
    "women.li2": "Color, highlights and balayage",
    "women.li3": "Cut + color + styling combos",
    "women.btn": "View women's services",
    "why.kicker": "Why choose us",
    "why.title": "An Experience Designed For You",
    "why.subtitle": "Details that make every visit to Dapper different.",
    "why.1.title": "Walk-ins and appointments",
    "why.1.text": "We always welcome you, at your pace.",
    "why.2.title": "Specialists in him and her",
    "why.2.text": "Master barbers and professional stylists.",
    "why.3.title": "Complimentary drink",
    "why.3.text": "Enjoy while we pamper you.",
    "location.kicker": "Visit us",
    "location.title": "Where To Find Us",
    "location.subtitle": "We look forward to seeing you in a space designed for your comfort.",
    "location.addrLabel": "Address",
    "location.addrValue": "Calle Principal #12-34, Zona Rosa",
    "location.phoneLabel": "Phone / WhatsApp",
    "location.hoursTitle": "Opening hours",
    "location.day1": "Monday to Friday",
    "location.day2": "Saturdays",
    "location.day3": "Sundays & Holidays",
    "location.mapTitle": "Dapper Salon & Barbershop map",
    "reviews.kicker": "Real reviews",
    "reviews.title": "What Our Clients Say",
    "reviews.subtitle": "Trust is earned cut by cut. Here is what those who have lived the Dapper experience say.",
    "review1.text": "“The best fade I have ever had. Precise, on time and the beard ritual is on another level. I left renewed.”",
    "review1.service": "Fade Cut + Beard",
    "review2.text": "“My balayage looks spectacular, the color exactly as I asked. They advised me calmly and the service was lovely.”",
    "review2.service": "Color + Blowout",
    "review3.text": "“I brought my teenage daughter for her first cut and she left happy. Clean place, elegant atmosphere and great service.”",
    "review3.service": "Cut + Treatment",
    "footer.tag": "Salon & Barbershop",
    "footer.rights": "Dapper Salon & Barbershop. All rights reserved.",
    "whatsapp.aria": "Chat with us on WhatsApp",
    "detail.men.kicker": "For Him",
    "detail.men.title": "Men's <span>Services</span>",
    "detail.men.desc": "Precise cuts, perfect beard and combos designed for the man who demands distinction.",
    "detail.women.kicker": "For Her",
    "detail.women.title": "Women's <span>Services</span>",
    "detail.women.desc": "Cut, color and styling with a premium finish, designed to highlight your unique style.",
    "detail.back": "← Back to services",
    "service.cta": "Book this service",
    "badge.popular": "Popular",
    "badge.combo": "Combo",
    "badge.ultimate": "Ultimate",
    "men.s1.name": "Classic Cut",
    "men.s1.desc": "Wash, scissor or clipper cut, contour detailing and styling to suit you.",
    "men.s2.name": "Fade",
    "men.s2.desc": "Precise fade, contour design, eyebrows and final styling with premium product.",
    "men.s3.name": "Beard Ritual",
    "men.s3.desc": "Hot towel, pre-shave, straight-razor trim, oils and moisturizing finish.",
    "men.s4.name": "Cut + Beard Combo",
    "men.s4.desc": "Your choice of cut + full beard ritual, complimentary drink and signature styling.",
    "men.s5.name": "Men's Facial",
    "men.s5.desc": "Deep cleanse, exfoliation and revitalizing mask for flawless skin.",
    "men.s6.name": "Dapper Legend Combo",
    "men.s6.desc": "Cut + beard + express facial, complimentary drink and image consulting.",
    "women.s1.name": "Women's Cut",
    "women.s1.desc": "Style consultation, wash, tailored cut and final blowout with a soft finish.",
    "women.s2.name": "Blowout + Treatment",
    "women.s2.desc": "Wash with hydrating treatment, sleek or wavy blowout and protective serum.",
    "women.s3.name": "Color / Highlights",
    "women.s3.desc": "Global color, highlights or balayage with prior diagnosis and closing treatment.",
    "women.s3.price": "From $120.000",
    "women.s4.name": "Keratin Straightening",
    "women.s4.desc": "Progressive keratin straightening, special wash, technical flat-iron and sealing.",
    "women.s4.price": "From $150.000",
    "women.s5.name": "Event Styling",
    "women.s5.desc": "Updos, waves or braids for events, with style trial and premium hold.",
    "women.s6.name": "Total Women's Combo",
    "women.s6.desc": "Cut + blowout + deep hydrating treatment and complimentary drink.",
    "wa.men.s1": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Men%20Classic%20Cut",
    "wa.men.s2": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Fade",
    "wa.men.s3": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Beard%20Ritual",
    "wa.men.s4": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Cut%20plus%20Beard%20Combo",
    "wa.men.s5": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Men%20Facial",
    "wa.men.s6": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Dapper%20Legend%20Combo",
    "wa.women.s1": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Women%20Cut",
    "wa.women.s2": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Blowout%20plus%20Treatment",
    "wa.women.s3": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Color%20Highlights",
    "wa.women.s4": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Keratin%20Straightening",
    "wa.women.s5": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Event%20Styling",
    "wa.women.s6": "https://wa.me/?text=Hi%20I%20want%20to%20book%20Total%20Women%20Combo"
  }
};

function getSavedLang() {
  try {
    const saved = localStorage.getItem('dapper-lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch (e) { /* almacenamiento no disponible */ }
  return 'es';
}

function applyLang(lang) {
  if (!I18N[lang]) lang = 'es';
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = (I18N[lang] && I18N[lang][key]) ?? I18N.es[key];
    if (value != null) el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    const value = (I18N[lang] && I18N[lang][key]) ?? I18N.es[key];
    if (value != null) el.setAttribute('aria-label', value);
  });

  document.querySelectorAll('[data-i18n-content]').forEach((el) => {
    const key = el.getAttribute('data-i18n-content');
    const value = (I18N[lang] && I18N[lang][key]) ?? I18N.es[key];
    if (value != null) el.setAttribute('content', value);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const value = (I18N[lang] && I18N[lang][key]) ?? I18N.es[key];
    if (value != null) el.setAttribute('title', value);
  });

  document.querySelectorAll('[data-i18n-href]').forEach((el) => {
    const key = el.getAttribute('data-i18n-href');
    const value = (I18N[lang] && I18N[lang][key]) ?? I18N.es[key];
    if (value != null) el.setAttribute('href', value);
  });

  document.querySelectorAll('.lang-switch button').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  try {
    localStorage.setItem('dapper-lang', lang);
  } catch (e) { /* almacenamiento no disponible */ }
}

function initLanguage() {
  const buttons = document.querySelectorAll('.lang-switch button');
  if (!buttons.length) return;
  applyLang(getSavedLang());
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
}
