(() => {
  'use strict';
  // Troque pelo número da loja (DDI + DDD + número, só dígitos)
  const WHATSAPP = '5500000000000';
  const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navbar
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', scrollY > 20);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Animação ao rolar
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('visible'));

  // Contadores
  const fmt = new Intl.NumberFormat('pt-BR');
  const count = (el) => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '', t0 = performance.now();
    if (reduce) { el.textContent = fmt.format(target) + suffix; return; }
    const step = (t) => {
      const p = Math.min((t - t0) / 1800, 1);
      el.textContent = fmt.format(Math.round(target * (1 - Math.pow(1 - p, 3)))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const co = new IntersectionObserver((entries, obs) => entries.forEach(e => {
    if (e.isIntersecting) { count(e.target); obs.unobserve(e.target); }
  }), { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(c => co.observe(c));

  // Ripple nos botões
  document.querySelectorAll('.btn').forEach(btn => btn.addEventListener('click', (e) => {
    const r = btn.getBoundingClientRect(), s = Math.max(r.width, r.height), el = document.createElement('span');
    el.className = 'ripple';
    el.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    btn.appendChild(el); setTimeout(() => el.remove(), 600);
  }));

  // Links de WhatsApp
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener';
  });

  // Modal do produto
  const modal = document.getElementById('modal');
  const $ = (id) => document.getElementById(id);
  let current = null, lastFocus = null;
  const close = () => { modal.hidden = true; document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => {
    current = b.dataset; lastFocus = b;
    $('m-title').textContent = current.open;
    $('m-price').textContent = current.price;
    $('m-desc').textContent = current.desc;
    $('m-img').src = current.img; $('m-img').alt = current.open;
    modal.hidden = false; document.body.style.overflow = 'hidden';
    $('m-close').focus();
  }));
  $('m-close').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
  modal.querySelectorAll('[data-client]').forEach(b => b.addEventListener('click', () => {
    const cliente = b.dataset.client === 'sim' ? 'Já sou cliente.' : 'Ainda não sou cliente.';
    window.open(wa(`Olá! Quero pedir: ${current.open} (${current.price}). ${cliente}`), '_blank', 'noopener');
  }));
})();
