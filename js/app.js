const $$ = (s) => [...document.querySelectorAll(s)];

/* ----------------------------------------------------
   1. ABAS DOS DIAS DO TREINO
---------------------------------------------------- */
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

/* ----------------------------------------------------
   2. CHECKLIST DE EXERCÍCIOS E BARRA DE PROGRESSO
---------------------------------------------------- */
function update(day) {
  const all = $$('.ex[data-day="' + day + '"]');
  const done = all.filter((c) => c.classList.contains('done')).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  const fill = document.getElementById('fill-' + day);
  const txt = document.getElementById('txt-' + day);
  if (fill) fill.style.width = pct + '%';
  if (txt) txt.textContent = done + '/' + all.length;
}

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

/* Botão de reset (limpa apenas os checks do dia para preservar as anotações de carga) */
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

/* ----------------------------------------------------
   3. PROGRESSÃO DE CARGA (INPUTS KG E REPS)
---------------------------------------------------- */
$$('.track-val').forEach((input) => {
  const storageKey = 'plano3_val:' + input.dataset.key;
  const savedVal = localStorage.getItem(storageKey);
  if (savedVal !== null) input.value = savedVal;

  input.addEventListener('input', () => {
    localStorage.setItem(storageKey, input.value.trim());
  });
});

/* ----------------------------------------------------
   4. DIÁRIO DE TREINO (NOTAS & STATUS DO DIA)
---------------------------------------------------- */
let activeDiaryDay = 'seg';
const diaryText = document.getElementById('diary-note');
const diaryHint = document.getElementById('diary-saved-hint');

function loadDiaryData(day) {
  // Carrega nota de texto
  const savedNote = localStorage.getItem('diary_note_' + day) || '';
  diaryText.value = savedNote;

  // Carrega status selecionados
  const savedStatus = JSON.parse(localStorage.getItem('diary_status_' + day) || '[]');
  $$('.status-chip').forEach((chip) => {
    chip.classList.toggle('active', savedStatus.includes(chip.dataset.status));
  });

  diaryHint.textContent = 'Salvo automaticamente';
}

// Troca de dia no Diário
$$('.diary-day-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.diary-day-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeDiaryDay = btn.dataset.diaryDay;
    loadDiaryData(activeDiaryDay);
  });
});

// Digitação no Diário com auto-save
diaryText.addEventListener('input', () => {
  localStorage.setItem('diary_note_' + activeDiaryDay, diaryText.value);
  diaryHint.textContent = 'Gravado ✓';
});

// Clique nos botões rápidos de status
$$('.status-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('active');
    const activeChips = $$('.status-chip.active').map((c) => c.dataset.status);
    localStorage.setItem('diary_status_' + activeDiaryDay, JSON.stringify(activeChips));
    diaryHint.textContent = 'Gravado ✓';
  });
});

// Inicia carregando a segunda-feira
loadDiaryData(activeDiaryDay);

/* ----------------------------------------------------
   5. REGISTRO DO SERVICE WORKER (PWA OFFLINE)
---------------------------------------------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('SW registrado em:', reg.scope))
      .catch((err) => console.error('Falha ao registrar SW:', err));
  });
}