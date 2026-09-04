const root = document.documentElement;
const revealItems = [...document.querySelectorAll('[data-reveal]')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileMenuPreference = window.matchMedia('(max-width: 700px)');
const expertiseMenu = document.querySelector('.expertise-menu');

const syncExpertiseMenu = ({ matches }) => {
  if (expertiseMenu) expertiseMenu.open = !matches;
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

syncExpertiseMenu(mobileMenuPreference);
motionPreference.addEventListener?.('change', revealAll);
mobileMenuPreference.addEventListener?.('change', syncExpertiseMenu);

document.addEventListener('click', (event) => {
  if (!mobileMenuPreference.matches || !expertiseMenu?.open) return;
  if (!expertiseMenu.contains(event.target)) expertiseMenu.open = false;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenuPreference.matches && expertiseMenu?.open) {
    expertiseMenu.open = false;
    expertiseMenu.querySelector('summary')?.focus();
  }
});

observeReveals();
