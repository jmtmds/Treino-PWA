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

/* Botão de reset (limpa checks mantendo as anotações de carga) */
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
   4. DIÁRIO: FEED CRONOLÓGICO COM DATA, HORA E TAGS
---------------------------------------------------- */
const diaryText = document.getElementById('diary-text');
const submitBtn = document.getElementById('diary-submit');
const feedContainer = document.getElementById('diary-feed');

// Seleção / Desmarcação de tags do formulário
$$('.tag-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
  });
});

function getDiaryEntries() {
  return JSON.parse(localStorage.getItem('plano3_diary_entries') || '[]');
}

function saveDiaryEntries(entries) {
  localStorage.setItem('plano3_diary_entries', JSON.stringify(entries));
}

// Mapeamento de classe CSS por tag
function getTagClass(tag) {
  switch (tag) {
    case 'Rendimento': return 'tag-rendimento';
    case 'Substituição': return 'tag-substituicao';
    case 'Desconforto/Dor': return 'tag-desconforto';
    case 'Não Treinei': return 'tag-nao-treinei';
    default: return '';
  }
}

// Renderiza a lista de comentários
function renderDiaryFeed() {
  const entries = getDiaryEntries();
  if (entries.length === 0) {
    feedContainer.innerHTML = '<div class="diary-empty">Nenhum registro ainda. Anote suas percepções acima!</div>';
    return;
  }

  feedContainer.innerHTML = entries
    .map((item) => {
      const tagHtml = item.tags.length
        ? `<div class="diary-entry-tags">${item.tags
            .map((t) => `<span class="entry-pill ${getTagClass(t)}">${t}</span>`)
            .join('')}</div>`
        : '';

      return `
        <div class="diary-entry-card" data-id="${item.id}">
          <div class="diary-entry-header">
            <span class="diary-entry-date">${item.date}</span>
            <button class="diary-delete-btn" onclick="deleteDiaryEntry(${item.id})">🗑️ Deletar</button>
          </div>
          ${tagHtml}
          <div class="diary-entry-body">${item.text}</div>
        </div>
      `;
    })
    .join('');
}

// Salva um novo registro
submitBtn.addEventListener('click', () => {
  const text = diaryText.value.trim();
  const selectedTags = $$('.tag-btn.active').map((b) => b.dataset.tag);

  if (!text && selectedTags.length === 0) {
    alert('Digite um comentário ou selecione pelo menos uma tag.');
    return;
  }

  const now = new Date();
  const dateStr =
    now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' às ' +
    now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const newEntry = {
    id: Date.now(),
    date: dateStr,
    tags: selectedTags,
    text: text || '(Sem texto — apenas tags registradas)'
  };

  const entries = getDiaryEntries();
  entries.unshift(newEntry); // Insere no início para os mais recentes ficarem no topo
  saveDiaryEntries(entries);

  // Limpa o formulário
  diaryText.value = '';
  $$('.tag-btn').forEach((b) => b.classList.remove('active'));

  renderDiaryFeed();
});

// Deletar comentário específico
window.deleteDiaryEntry = function (id) {
  if (!confirm('Deseja excluir este registro?')) return;
  const entries = getDiaryEntries().filter((item) => item.id !== id);
  saveDiaryEntries(entries);
  renderDiaryFeed();
};

// Renderização inicial do diário
renderDiaryFeed();

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