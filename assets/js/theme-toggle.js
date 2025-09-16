const btn = document.getElementById('themeToggle');
if (btn) {
  btn.onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  };
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
}
