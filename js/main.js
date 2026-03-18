// ── NAV SCROLL ──
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── SMOOTH REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.imovel-card, .sobre-section, .contato-section').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  // trigger visible class on scroll
});

document.querySelectorAll('.imovel-card, .sobre-section, .contato-section').forEach(el => {
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      obs.disconnect();
    }
  }, { threshold: 0.08 });
  obs.observe(el);
});
