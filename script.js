const root = document.documentElement;
const header = document.querySelector('.site-header');
const revealItems = [...document.querySelectorAll('[data-reveal]')];
const sectionLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileMenuPreference = window.matchMedia('(max-width: 700px)');
const expertiseMenu = document.querySelector('.expertise-menu');

const syncExpertiseMenu = ({ matches }) => {
  if (expertiseMenu) expertiseMenu.open = !matches;
};

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 16);
};

const revealAll = () => {
  root.classList.remove('motion-ready');
  revealItems.forEach((item) => item.classList.add('is-visible'));
};

const observeReveals = () => {
  if (motionPreference.matches || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  root.classList.add('motion-ready');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8%', threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
};

const observeSections = () => {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const current = entries.find((entry) => entry.isIntersecting);
      if (!current) return;

      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${current.target.id}`;
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-30% 0px -60%', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
};

updateHeader();
syncExpertiseMenu(mobileMenuPreference);
window.addEventListener('scroll', updateHeader, { passive: true });
motionPreference.addEventListener?.('change', revealAll);
mobileMenuPreference.addEventListener?.('change', syncExpertiseMenu);
observeReveals();
observeSections();
