const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('open');
}));

function setupMoreButton(buttonId, gridSelector) {
  const button = document.querySelector(buttonId);
  const grid = document.querySelector(gridSelector);
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    grid.classList.toggle('show-all', !expanded);
    button.innerHTML = expanded ? 'Ver mais <span>⌄</span>' : 'Ver menos <span>⌃</span>';
  });
}

setupMoreButton('#structure-more', '.structure-grid');
setupMoreButton('#gallery-more', '.gallery-grid');

const structureGrid = document.querySelector('.structure-grid');
const galleryGrid = document.querySelector('.gallery-grid');
const photoDialog = document.querySelector('.photo-dialog');
const photoDialogImage = photoDialog.querySelector('.photo-dialog-image');
const photoDialogClose = photoDialog.querySelector('.photo-dialog-close');

function openPhoto(image) {
  if (!image) return;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  photoDialogImage.src = image.src;
  photoDialogImage.alt = image.alt;
  photoDialog.showModal();
  window.scrollTo(scrollX, scrollY);
  requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
}

structureGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.structure-card');
  if (!card) return;
  event.preventDefault();
  openPhoto(card.querySelector('img'));
});

galleryGrid.addEventListener('click', (event) => {
  const image = event.target.closest('img');
  if (!image) return;
  event.preventDefault();
  openPhoto(image);
});

photoDialogClose.addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('click', (event) => {
  if (event.target === photoDialog) photoDialog.close();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const text = [
    'Olá! Gostaria de falar com a Casa Bem Estar.',
    `Nome: ${data.get('name')}`,
    `Telefone: ${data.get('phone')}`,
    data.get('email') ? `E-mail: ${data.get('email')}` : '',
    data.get('subject') ? `Assunto: ${data.get('subject')}` : '',
    data.get('message') ? `Mensagem: ${data.get('message')}` : ''
  ].filter(Boolean).join('\n');
  status.textContent = 'Abrindo o WhatsApp para enviar sua mensagem.';
  window.open(`https://wa.me/5511922333665?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
});

// Reveals sections and cards as they enter the viewport.
const revealGroups = [
  { selector: '.hero-image-wrap, .about-image, .services-illustration-wrap, .contact-info', direction: 'right' },
  { selector: '.hero-copy, .about-copy, .services-copy, .contact-form-wrap', direction: 'left' },
  { selector: '.section-heading', direction: 'up' },
  { selector: '.structure-card, .value-card, .gallery-grid img', direction: 'up', stagger: true },
  { selector: '.service-list li', direction: 'up', stagger: true }
];

revealGroups.forEach(({ selector, direction, stagger }) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.dataset.reveal = direction;
    if (stagger) {
      element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 4) * 75}ms`);
    }
  });
});

const revealTargets = document.querySelectorAll('[data-reveal]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
} else {
  document.documentElement.classList.add('scroll-reveal-ready');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach((element) => revealObserver.observe(element));
}
