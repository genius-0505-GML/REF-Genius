/* =========================================================
   nav.js — Menu responsivo (botão ☰) compartilhado por todas as páginas
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('navBurger');
  const nav = document.querySelector('.nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav--open');
    burger.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('.nav__link')) nav.classList.remove('nav--open');
  });
});
