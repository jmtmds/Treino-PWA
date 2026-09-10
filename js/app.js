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
  c.addEventListener('click', (e) => {
    // Evita alternar o status 'done' se o usuário estiver tocando/editando texto ou números
    if (e.target.closest('[contenteditable="true"]') || e.target.closest('.ex-inputs')) {
      return;
    }
    c.classList.toggle('done');
    localStorage.setItem(k, c.classList.contains('done') ? '1' : '0');
    update(c.dataset.day);
  });
});

['seg', 'ter', 'qua', 'qui', 'sex'].forEach(update);

/* Botão de reset de checks */
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
   3. INPUTS DE CARGA E REPETIÇÕES (KG & REPS)
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
   4. SISTEMA UNIVERSAL DE EDIÇÃO INLINE (LOCALSTORAGE)
---------------------------------------------------- */
$$('[data-edit-key]').forEach((el) => {
  const storageKey = 'plano3_inline:' + el.dataset.editKey;
  const savedText = localStorage.getItem(storageKey);
  if (savedText !== null) {
    el.innerText = savedText;
  }

  // Previne disparo de cards ao tocar para editar
  el.addEventListener('click', (e) => e.stopPropagation());

  // Salva no momento em que o usuário sai do campo
  el.addEventListener('blur', () => {
    localStorage.setItem(storageKey, el.innerText.trim());
  });
});

/* ----------------------------------------------------
   5. DIÁRIO: FEED COM CRIAR, EDITAR E DELETAR
---------------------------------------------------- */
const diaryText = document.getElementById('diary-text');
const submitBtn = document.getElementById('diary-submit');
const cancelBtn = document.getElementById('diary-cancel');
const feedContainer = document.getElementById('diary-feed');
let editingId = null;

// Alternância de tags
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

function getTagClass(tag) {
  switch (tag) {
    case 'Rendimento': return 'tag-rendimento';
    case 'Substituição': return 'tag-substituicao';
    case 'Desconforto/Dor': return 'tag-desconforto';
    case 'Não Treinei': return 'tag-nao-treinei';
    default: return '';
  }
}

function renderDiaryFeed() {
  const entries = getDiaryEntries();
  if (entries.length === 0) {
    feedContainer.innerHTML = '<div class="diary-empty">Nenhum comentário adicionado ainda.</div>';
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
            <div class="diary-entry-btns">
              <button class="diary-edit-btn" onclick="editDiaryEntry(${item.id})">✏️ Editar</button>
              <button class="diary-delete-btn" onclick="deleteDiaryEntry(${item.id})">🗑️ Deletar</button>
            </div>
          </div>
          ${tagHtml}
          <div class="diary-entry-body">${item.text}</div>
        </div>
      `;
    })
    .join('');
}

// Salvar ou Atualizar entrada
submitBtn.addEventListener('click', () => {
  const text = diaryText.value.trim();
  const selectedTags = $$('.tag-btn.active').map((b) => b.dataset.tag);

  if (!text && selectedTags.length === 0) {
    alert('Digite um comentário ou selecione uma tag.');
    return;
  }

  const entries = getDiaryEntries();

  if (editingId) {
    // Modo Edição
    const index = entries.findIndex((i) => i.id === editingId);
    if (index !== -1) {
      entries[index].text = text || '(Sem texto — apenas tags)';
      entries[index].tags = selectedTags;
      if (!entries[index].date.includes('(editado)')) {
        entries[index].date += ' (editado)';
      }
    }
    resetDiaryForm();
  } else {
    // Modo Criação
    const now = new Date();
    const dateStr =
      now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' às ' +
      now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newEntry = {
      id: Date.now(),
      date: dateStr,
      tags: selectedTags,
      text: text || '(Sem texto — apenas tags)'
    };
    entries.unshift(newEntry);
    resetDiaryForm();
  }

  saveDiaryEntries(entries);
  renderDiaryFeed();
});

// Preparar formulário para edição
window.editDiaryEntry = function (id) {
  const entries = getDiaryEntries();
  const target = entries.find((i) => i.id === id);
  if (!target) return;

  editingId = id;
  diaryText.value = target.text.replace('(Sem texto — apenas tags)', '');

  $$('.tag-btn').forEach((btn) => {
    btn.classList.toggle('active', target.tags.includes(btn.dataset.tag));
  });

  submitBtn.textContent = 'Salvar Alteração';
  cancelBtn.style.display = 'inline-block';

  window.scrollTo({
    top: document.getElementById('analise').offsetTop - 80,
    behavior: 'smooth'
  });
  diaryText.focus();
};

// Cancelar modo de edição
cancelBtn.addEventListener('click', resetDiaryForm);

function resetDiaryForm() {
  editingId = null;
  diaryText.value = '';
  $$('.tag-btn').forEach((b) => b.classList.remove('active'));
  submitBtn.textContent = 'Salvar Registro';
  cancelBtn.style.display = 'none';
}

// Excluir entrada do diário
window.deleteDiaryEntry = function (id) {
  if (!confirm('Deseja excluir este registro?')) return;
  const entries = getDiaryEntries().filter((item) => item.id !== id);
  saveDiaryEntries(entries);
  if (editingId === id) resetDiaryForm();
  renderDiaryFeed();
};

renderDiaryFeed();

/* ----------------------------------------------------
   6. REGISTRO DO SERVICE WORKER (PWA OFFLINE)
---------------------------------------------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('SW registrado em:', reg.scope))
      .catch((err) => console.error('Falha SW:', err));
  });
}