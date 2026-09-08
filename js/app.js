const $$ = (s) => [...document.querySelectorAll(s)];

/* Troca de abas dos dias da semana */
$$('.dtab').forEach((b) => {
  b.addEventListener('click', () => {
    $$('.dtab').forEach((x) => x.classList.remove('active'));
    $$('.panel').forEach((p) => p.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('panel-' + b.dataset.day).classList.add('active');
    window.scrollTo({
      top: document.getElementById('treino').offsetTop - 80,
      behavior: 'smooth'
    });
  });
});

/* Atualiza barra de progresso do dia */
function update(day) {
  const all = $$('.ex[data-day="' + day + '"]');
  const done = all.filter((c) => c.classList.contains('done')).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  const fill = document.getElementById('fill-' + day);
  const txt = document.getElementById('txt-' + day);
  if (fill) fill.style.width = pct + '%';
  if (txt) txt.textContent = done + '/' + all.length;
}

/* Marcar/desmarcar exercícios com persistência no localStorage */
$$('.ex').forEach((c) => {
  const k = 'plano3:' + c.dataset.key;
  if (localStorage.getItem(k) === '1') c.classList.add('done');
  c.addEventListener('click', () => {
    c.classList.toggle('done');
    localStorage.setItem(k, c.classList.contains('done') ? '1' : '0');
    update(c.dataset.day);
  });
});

['seg', 'ter', 'qua', 'qui', 'sex'].forEach(update);

/* Botão de reset do dia */
$$('.resetbtn').forEach((b) => {
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    const day = b.dataset.day;
    $$('.ex[data-day="' + day + '"]').forEach((c) => {
      c.classList.remove('done');
      localStorage.removeItem('plano3:' + c.dataset.key);
    });
    update(day);
  });
});

/* Registro do Service Worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('SW registrado com sucesso em:', reg.scope))
      .catch((err) => console.error('Falha ao registrar SW:', err));
  });
}