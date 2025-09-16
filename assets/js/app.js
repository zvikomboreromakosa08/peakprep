// Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => nav.classList.toggle('open'));
}

// Smooth link transitions
document.querySelectorAll('a[href]').forEach(a => {
  a.addEventListener('click', e => {
    const url = a.getAttribute('href');
    if (!url || url.startsWith('#')) return;
    document.body.classList.add('fade-enter');
    setTimeout(() => { window.location.href = url; }, 60);
    e.preventDefault();
  });
});

// Remember last visit time for personalization
try {
  localStorage.setItem('pp:lastVisit', String(Date.now()));
} catch {}
