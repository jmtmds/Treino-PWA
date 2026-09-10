const $$ = (s) => [...document.querySelectorAll(s)];

// Remove chaves de texto corrompidas de versões antigas para restaurar o design original
['plano3_inline:treino-descanso', 'plano3_inline:treino-aquecimento', 'plano3_inline:seg1-pills'].forEach(k => localStorage.removeItem(k));

/* ----------------------------------------------------
   1. EXERCÍCIOS BASE E LOCALSTORAGE DINÂMICO
---------------------------------------------------- */
const DEFAULT_EXERCISES = {
  seg: [
    { id: 'seg1', name: 'Mesa flexora', sets: '3 × 10–12', rest: '⏱ 1:30', note: 'Leve para as pernas — você joga vôlei hoje' },
    { id: 'seg2', name: 'Crossover na polia alta', sets: '3 × 12–15', rest: '⏱ 1:15', note: 'Foco na contração, leve cruzamento' },
    { id: 'seg3', name: 'Remada alta na polia', sets: '3 × 10–12', rest: '⏱ 1:30', note: 'Cotovelos acima das mãos' },
    { id: 'seg4', name: 'Face pull', sets: '3 × 12–15', rest: '⏱ 1:00', note: 'Puxe até a testa, gire os punhos para fora' },
    { id: 'seg5', name: 'Tríceps unilateral na polia', sets: '3 × 10–12', rest: '⏱ 1:15', note: '—' },
    { id: 'seg6', name: 'Panturrilha no Smith c/ step', sets: '3 × 10–15', rest: '⏱ 1:00', note: '2–3s alongado embaixo, em cada repetição' }
  ],
  ter: [
    { id: 'ter1', name: 'Agachamento no Smith', sets: '4 × 6–10', rest: '⏱ 2:30', note: 'Paralela ou pouco abaixo · 1–2 reps de reserva · dia pesado de perna' },
    { id: 'ter2', name: 'Supino reto com barra', sets: '4 × 6–10', rest: '⏱ 2:30', note: 'Escápulas retraídas, barra na linha do peito' },
    { id: 'ter3', name: 'Puxada pronada', sets: '3 × 8–12', rest: '⏱ 2:00', note: 'Puxe com os cotovelos, não com as mãos' },
    { id: 'ter4', name: 'Cadeira flexora', sets: '3 × 10–12', rest: '⏱ 1:30', note: 'Controle a volta, sem pico isométrico' },
    { id: 'ter5', name: 'Elevação lateral c/ halteres', sets: '3 × 10–15', rest: '⏱ 1:00', note: 'Até a linha do ombro, sem encolher' },
    { id: 'ter6', name: 'Tríceps na polia', sets: '3 × 10–12', rest: '⏱ 1:15', note: 'Cotovelos fixos ao lado do corpo' }
  ],
  qua: [
    { id: 'qua1', name: 'Remada curvada supinada', sets: '3 × 8–12', rest: '⏱ 2:15', note: 'Tronco ~45°, sem arredondar a lombar' },
    { id: 'qua2', name: 'Leg press 45°', sets: '3 × 10–15', rest: '⏱ 2:00', note: 'Amplitude completa, sem soltar o quadril · intensidade moderada (vôlei hoje)' },
    { id: 'qua3', name: 'Crucifixo na máquina', sets: '3 × 10–12', rest: '⏱ 1:15', note: 'Excêntrica de 2–3s' },
    { id: 'qua4', name: 'Cadeira abdutora', sets: '3 × 12–15', rest: '⏱ 1:00', note: 'Tronco levemente à frente' },
    { id: 'qua5', name: 'Supersérie: Crucifixo inverso + Rosca martelo', sets: '12–15 + 10–12', rest: '⏱ 1:30 após o par', note: '3 rodadas · economiza ~5 min' }
  ],
  qui: [
    { id: 'qui1', name: 'Agachamento hack', sets: '3 × 8–12', rest: '⏱ 2:15', note: 'Fundo controlado, calcanhares no chão' },
    { id: 'qui2', name: 'Stiff (halteres ou barra)', sets: '3 × 8–12', rest: '⏱ 2:00', note: 'Joelhos quase travados, quadril para trás, coluna neutra' },
    { id: 'qui3', name: 'Supino inclinado c/ barra', sets: '4 × 8–12', rest: '⏱ 2:15', note: 'Inclinação ~30–45°' },
    { id: 'qui4', name: 'Puxada c/ pegada neutra', sets: '3 × 8–12', rest: '⏱ 1:45', note: 'Peito aberto, sem jogar o tronco para trás' },
    { id: 'qui5', name: 'Elevação lateral na polia', sets: '3 × 12–15', rest: '⏱ 1:00', note: 'Tensão constante' },
    { id: 'qui6', name: 'Tríceps francês', sets: '3 × 10–12', rest: '⏱ 1:15', note: 'Cotovelos apontando para cima' }
  ],
  sex: [
    { id: 'sex1', name: 'Elevação pélvica', sets: '4 × 8–12', rest: '⏱ 2:00', note: 'Contração máxima no topo, coluna neutra' },
    { id: 'sex2', name: 'Leg press 45°', sets: '3 × 10–15', rest: '⏱ 2:00', note: 'Vôlei amanhã — 1–2 reps de reserva' },
    { id: 'sex3', name: 'Desenvolvimento c/ halteres', sets: '4 × 8–12', rest: '⏱ 2:00', note: 'Antes: 2 séries leves de rotação de ombro na polia' },
    { id: 'sex4', name: 'Remada baixa c/ triângulo', sets: '3 × 8–12', rest: '⏱ 2:00', note: '1s de contração no encurtamento' },
    { id: 'sex5', name: 'Rosca direta (barra ou halteres)', sets: '3 × 10–12', rest: '⏱ 1:15', note: 'Sem balanço de tronco' },
    { id: 'sex6', name: 'Panturrilha em pé no Smith', sets: '3 × 10–15', rest: '⏱ 1:00', note: '2–3s alongado embaixo' }
  ]
};

function getExercisesData() {
  const saved = localStorage.getItem('plano3_exercises_data');
  return saved ? JSON.parse(saved) : DEFAULT_EXERCISES;
}

function saveExercisesData(data) {
  localStorage.setItem('plano3_exercises_data', JSON.stringify(data));
}

let exercisesState = getExercisesData();

/* ----------------------------------------------------
   2. ABAS DOS DIAS DO TREINO
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
   3. RENDERIZAÇÃO E EVENTOS DOS CARDS (03)
---------------------------------------------------- */
function renderExercises(day) {
  const container = document.getElementById('ex-list-' + day);
  if (!container) return;

  const list = exercisesState[day] || [];
  container.innerHTML = list
    .map((ex) => {
      const isDone = localStorage.getItem('plano3:' + ex.id) === '1' ? 'done' : '';
      const kgVal = localStorage.getItem('plano3_val:' + ex.id + '-kg') || '';
      const repsVal = localStorage.getItem('plano3_val:' + ex.id + '-reps') || '';

      return `
        <div class="ex ${isDone}" data-day="${day}" data-id="${ex.id}">
          <span class="cbox">✓</span>
          <div class="ex-info">
            <div class="ex-head-row">
              <div class="exname" contenteditable="false" data-field="name">${ex.name}</div>
              <div class="ex-btns">
                <button type="button" class="ex-edit-btn" onclick="toggleEditExercise('${day}', '${ex.id}', this)">✏️ Editar</button>
                <button type="button" class="ex-delete-btn" onclick="deleteExercise('${day}', '${ex.id}')">🗑️ Deletar</button>
              </div>
            </div>
            <div class="pills">
              <span class="p set" contenteditable="false" data-field="sets">${ex.sets}</span>
              <span class="p rest" contenteditable="false" data-field="rest">${ex.rest}</span>
            </div>
            <div class="exnote" contenteditable="false" data-field="note">${ex.note}</div>
            <div class="ex-inputs">
              <div class="input-box">
                <input type="number" inputmode="decimal" class="track-val" data-key="${ex.id}-kg" placeholder="—" value="${kgVal}">
                <span class="unit">kg</span>
              </div>
              <span class="sep">×</span>
              <div class="input-box">
                <input type="number" inputmode="numeric" class="track-val" data-key="${ex.id}-reps" placeholder="—" value="${repsVal}">
                <span class="unit">reps</span>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  attachCardEvents(day);
  update(day);
}

function attachCardEvents(day) {
  const container = document.getElementById('ex-list-' + day);
  if (!container) return;

  // Clique no card marca/desmarca — ignorado se estiver em modo de edição
  container.querySelectorAll('.ex').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (
        card.classList.contains('editing') ||
        e.target.closest('.ex-inputs') ||
        e.target.closest('.ex-btns')
      ) {
        return;
      }
      card.classList.toggle('done');
      const isDone = card.classList.contains('done');
      localStorage.setItem('plano3:' + card.dataset.id, isDone ? '1' : '0');
      update(day);
    });
  });

  // Salvar valores dos inputs kg e reps
  container.querySelectorAll('.track-val').forEach((input) => {
    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('input', () => {
      localStorage.setItem('plano3_val:' + input.dataset.key, input.value.trim());
    });
  });
}

function update(day) {
  const all = $$('#ex-list-' + day + ' .ex');
  const done = all.filter((c) => c.classList.contains('done')).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  const fill = document.getElementById('fill-' + day);
  const txt = document.getElementById('txt-' + day);
  if (fill) fill.style.width = pct + '%';
  if (txt) txt.textContent = done + '/' + all.length;
}

// Botão Editar/Salvar do Card individual
window.toggleEditExercise = function (day, id, btn) {
  const card = document.querySelector(`.ex[data-id="${id}"]`);
  if (!card) return;

  const isEditing = card.classList.contains('editing');
  const fields = card.querySelectorAll('[data-field]');

  if (!isEditing) {
    // Entra em modo de edição
    card.classList.add('editing');
    btn.textContent = '💾 Salvar';
    btn.style.color = 'var(--green)';
    btn.style.fontWeight = '800';

    fields.forEach((f) => {
      f.contentEditable = 'true';
    });
    const nameEl = card.querySelector('[data-field="name"]');
    if (nameEl) nameEl.focus();
  } else {
    // Salva alterações
    const target = exercisesState[day].find((x) => x.id === id);
    if (target) {
      fields.forEach((f) => {
        target[f.dataset.field] = f.innerText.trim();
        f.contentEditable = 'false';
      });
      saveExercisesData(exercisesState);
    }
    card.classList.remove('editing');
    btn.textContent = '✏️ Editar';
    btn.style.color = '';
    btn.style.fontWeight = '';
  }
};

// Botão + Adicionar Card Limpo
$$('.addbtn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const day = btn.dataset.day;
    const newEx = {
      id: 'ex_' + Date.now(),
      name: '',
      sets: '',
      rest: '',
      note: ''
    };
    if (!exercisesState[day]) exercisesState[day] = [];
    exercisesState[day].push(newEx);
    saveExercisesData(exercisesState);
    renderExercises(day);

    // Inicia o card já em modo de edição
    setTimeout(() => {
      const newCard = document.querySelector(`.ex[data-id="${newEx.id}"]`);
      if (newCard) {
        const editBtn = newCard.querySelector('.ex-edit-btn');
        if (editBtn) window.toggleEditExercise(day, newEx.id, editBtn);
      }
    }, 60);
  });
});

// Botão Deletar Card
window.deleteExercise = function (day, id) {
  if (!confirm('Deseja excluir este exercício?')) return;
  exercisesState[day] = exercisesState[day].filter((x) => x.id !== id);
  saveExercisesData(exercisesState);
  localStorage.removeItem('plano3:' + id);
  localStorage.removeItem('plano3_val:' + id + '-kg');
  localStorage.removeItem('plano3_val:' + id + '-reps');
  renderExercises(day);
};

// Botão Limpar Checks do Dia
$$('.resetbtn').forEach((b) => {
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    const day = b.dataset.day;
    $$('#ex-list-' + day + ' .ex').forEach((c) => {
      c.classList.remove('done');
      localStorage.removeItem('plano3:' + c.dataset.id);
    });
    update(day);
  });
});

// Renderização inicial
['seg', 'ter', 'qua', 'qui', 'sex'].forEach(renderExercises);

/* ----------------------------------------------------
   4. SISTEMA DE EDIÇÃO DE SEÇÕES COM BOTÃO "EDITAR"
---------------------------------------------------- */
// Carrega dados salvos anteriormente
$$('[data-edit-item]').forEach((el) => {
  const key = el.dataset.editItem;
  const saved = localStorage.getItem('plano3_block:' + key);
  if (saved !== null) {
    el.innerText = saved;
  }
});

// Evento dos botões ✏️ Editar / 💾 Salvar das Seções
$$('.sec-edit-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetContainer = document.getElementById(btn.dataset.target);
    if (!targetContainer) return;

    const isEditing = targetContainer.classList.contains('is-editing');
    const items = targetContainer.querySelectorAll('[data-edit-item]');

    if (!isEditing) {
      // Ativa modo de edição na seção
      targetContainer.classList.add('is-editing');
      btn.classList.add('saving');
      btn.textContent = '💾 Salvar';
      items.forEach((item) => {
        item.contentEditable = 'true';
      });
      if (items.length > 0) items[0].focus();
    } else {
      // Salva dados e trava novamente
      items.forEach((item) => {
        item.contentEditable = 'false';
        localStorage.setItem('plano3_block:' + item.dataset.editItem, item.innerText.trim());
      });
      targetContainer.classList.remove('is-editing');
      btn.classList.remove('saving');
      btn.textContent = '✏️ Editar';
    }
  });
});

/* ----------------------------------------------------
   5. DIÁRIO (02): FEED COM CRIAR, EDITAR E DELETAR
---------------------------------------------------- */
const diaryText = document.getElementById('diary-text');
const submitBtn = document.getElementById('diary-submit');
const cancelBtn = document.getElementById('diary-cancel');
const feedContainer = document.getElementById('diary-feed');
let editingId = null;

$$('.tag-btn').forEach((btn) => {
  btn.addEventListener('click', () => btn.classList.toggle('active'));
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

submitBtn.addEventListener('click', () => {
  const text = diaryText.value.trim();
  const selectedTags = $$('.tag-btn.active').map((b) => b.dataset.tag);

  if (!text && selectedTags.length === 0) {
    alert('Digite um comentário ou selecione uma tag.');
    return;
  }

  const entries = getDiaryEntries();

  if (editingId) {
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

cancelBtn.addEventListener('click', resetDiaryForm);

function resetDiaryForm() {
  editingId = null;
  diaryText.value = '';
  $$('.tag-btn').forEach((b) => b.classList.remove('active'));
  submitBtn.textContent = 'Salvar Registro';
  cancelBtn.style.display = 'none';
}

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