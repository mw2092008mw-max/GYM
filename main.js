const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const mobileVisit = document.querySelector('.mobile-visit');

function setMenu(open) {
  if (!menuButton || !primaryNav) return;
  const isEnglish = window.ironLanguage === 'en';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open
    ? (isEnglish ? 'Close menu' : 'إغلاق القائمة')
    : (isEnglish ? 'Open menu' : 'فتح القائمة'));
  primaryNav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const revealTargets = document.querySelectorAll('.manifesto-layout, .section-heading, .training-layout, .experience-grid, .coaches-heading, .coach-feature, .ritual-content, .ritual-steps, .membership-head, .membership-row, .notes-heading, .notes-grid, .visit-intro, .visit-form');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  revealTargets.forEach((target) => {
    target.classList.add('reveal');
    revealObserver.observe(target);
  });
}

document.querySelectorAll('.plan-select').forEach((button) => {
  button.addEventListener('click', () => {
    const interest = document.querySelector('#interest');
    if (interest) interest.value = button.dataset.plan;
    document.querySelector('#visit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.querySelector('#visit-form input')?.focus({ preventScroll: true }), 500);
  });
});

const visitForm = document.querySelector('#visit-form');
const feedback = document.querySelector('#form-feedback');
visitForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!visitForm.reportValidity()) return;
  const formData = new FormData(visitForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const interest = document.querySelector('#interest');
  const selectedInterest = interest?.selectedOptions[0]?.textContent.trim() || '';
  const language = window.ironLanguage || 'ar';
  const message = language === 'ar'
    ? `مرحبًا IRON DISTRICT، أود تأكيد زيارة.\nالاسم: ${name}\nالبريد الإلكتروني: ${email}\nالاهتمام: ${selectedInterest}`
    : `Hello IRON DISTRICT, I would like to arrange a visit.\nName: ${name}\nEmail: ${email}\nInterest: ${selectedInterest}`;
  const whatsappUrl = `https://wa.me/201108342262?text=${encodeURIComponent(message)}`;
  if (feedback) feedback.textContent = language === 'ar'
    ? 'يفتح واتساب الآن برسالة جاهزة إلى 01108342262.'
    : 'WhatsApp is opening with your request addressed to 01108342262.';
  const whatsappWindow = window.open(whatsappUrl, '_blank');
  if (whatsappWindow) whatsappWindow.opener = null;
  else window.location.assign(whatsappUrl);
});

if (mobileVisit) {
  const hero = document.querySelector('.hero');
  if ('IntersectionObserver' in window && hero) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      mobileVisit.classList.toggle('is-hidden', entry.isIntersecting);
    }, { threshold: 0.12 });
    heroObserver.observe(hero);
  }
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const imageFallback = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=82';
document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    if (image.dataset.fallbackAttempted !== 'true' && !image.src.includes('photo-1534438327276-14e5300c3a48')) {
      image.dataset.fallbackAttempted = 'true';
      image.src = imageFallback;
      return;
    }
    image.classList.add('image-unavailable');
    image.alt = window.ironLanguage === 'en' ? 'Image currently unavailable' : 'الصورة غير متاحة حاليًا';
  });
});

