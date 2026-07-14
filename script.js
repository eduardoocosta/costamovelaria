/* =========================================================
   COSTA MOVELARIA — interações
   ========================================================= */


const WHATSAPP_NUMBER = '5543988737802';

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  setupWhatsappLinks();
  setupNavToggle();
  setupScrollReveal();
  setupTestimonialSlider();
  setupContactForm();
});


function setupWhatsappLinks() {
  const ids = ['waHeader', 'waContato', 'waFloat'];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  });
}

/* Ano automático no rodapé */
function setYear() {
  const el = document.getElementById('ano');
  if (el) el.textContent = new Date().getFullYear();
}

/* Menu mobile */
function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // fecha o menu ao clicar em um link
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Revela seções ao rolar a página */
function setupScrollReveal() {
  const targets = document.querySelectorAll('.section-head, .feature-list li, .catalog-card, .process-list li, .testimonial-slider, .contact-form, .contact-info');

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((t) => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(20px)';
    t.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(t);
  });
}

/* Slider de depoimentos */
function setupTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  let current = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ver depoimento ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => goTo(current + 1), 6000);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  track.parentElement.addEventListener('mouseenter', stopAutoplay);
  track.parentElement.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* Formulário de contato: monta a mensagem e abre o WhatsApp já preenchido */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = 'Preencha os campos obrigatórios antes de enviar.';
      status.style.color = '#E4967A';
      return;
    }

    const nome = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const ambienteSelect = form.ambiente;
    const ambiente = ambienteSelect.options[ambienteSelect.selectedIndex].text;
    const mensagem = form.mensagem.value.trim();

    const texto =
      `Olá! Vim pelo site da Costa Movelaria e quero um orçamento.\n\n` +
      `Nome: ${nome}\n` +
      `Telefone: ${telefone}\n` +
      `Ambiente: ${ambiente}\n` +
      `Mensagem: ${mensagem}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

    status.textContent = 'Abrindo o WhatsApp com sua mensagem pronta... você só precisa apertar "Enviar" lá dentro.';
    status.style.color = '';

    form.reset();
    // Redireciona a própria aba (mais confiável que window.open, que pode
    // ser bloqueado como pop-up pelo navegador, principalmente no celular)
    window.location.href = url;
  });
}