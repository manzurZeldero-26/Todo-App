document.addEventListener('DOMContentLoaded', () => {
  // Referencias a Elementos DOM
  const todoForm = document.getElementById('todoForm');
  const taskInput = document.getElementById('taskInput');
  const errorMessage = document.getElementById('errorMessage');
  const taskList = document.getElementById('taskList');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const triforceBtn = document.getElementById('triforceBtn');

  // Contadores
  const totalCountEl = document.getElementById('totalCount');
  const completedCountEl = document.getElementById('completedCount');
  const pendingCountEl = document.getElementById('pendingCount');

  // Tareas iniciales de ejemplo
  let tasks = [
    { id: '1', text: 'Welcome to the todo app!', completed: false },
    { id: '2', text: 'Esto es una lista de tareas', completed: false },
    { id: '3', text: 'Tiene contadores', completed: true }
  ];

  // Restaurar o inicializar tema
  let currentTheme = localStorage.getItem('zeldaTheme') || 'dark';
  applyTheme(currentTheme);

  // ===================================================
  // LÓGICA DE AUDIO SINTETIZADO (WEB AUDIO API)
  // ===================================================
  function playZeldaFanfare() {
  const audio = new Audio('tempkKMstifGi6Q_mp3.mp3');
  audio.volume = 0.5; // Puedes ajustar el volumen de 0.0 a 1.0
  audio.play().catch(error => {
    console.log("El navegador bloqueó la reproducción o el archivo no se encuentra.", error);
  });
}
  // ===================================================
  // MANEJO DE TEMA (CLARO/OSCURO)
  // ===================================================
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggleBtn.textContent = '☀️ Modo Claro';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtn.textContent = '🌙 Modo Oscuro';
    }
    localStorage.setItem('zeldaTheme', theme);
  }

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
  });

  triforceBtn.addEventListener('click', () => {
    playZeldaFanfare();
  });

  // ===================================================
  // ACTUALIZACIÓN DE CONTADORES
  // ===================================================
  function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalCountEl.textContent = total;
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = pending;
  }

  // ===================================================
  // RENDERIZADO DE TAREAS
  // ===================================================
  function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'is-completed' : ''}`;
      li.dataset.id = task.id;

      if (task.isEditing) {
        // Vista Modo Edición
        li.innerHTML = `
          <button class="task-btn delete" disabled title="Eliminar">✕</button>
          <div class="task-content">
            <input type="text" class="task-input-edit" value="${escapeHtml(task.text)}">
          </div>
          <button class="task-btn edit save-btn" title="Guardar">💾</button>
        `;

        const editInput = li.querySelector('.task-input-edit');
        const saveBtn = li.querySelector('.save-btn');

        setTimeout(() => editInput.focus(), 0);

        const saveTask = () => {
          const val = editInput.value.trim();
          if (val) {
            task.text = val;
            task.isEditing = false;
            renderTasks();
          }
        };

        saveBtn.addEventListener('click', saveTask);
        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') saveTask();
        });

      } else {
        // Vista Normal
        li.innerHTML = `
          <button class="task-btn delete" title="Eliminar tarea">✕</button>
          <div class="task-content">${escapeHtml(task.text)}</div>
          <button class="task-btn edit" title="Editar tarea">✏️</button>
          <button class="task-btn complete" title="Completar tarea">✓</button>
        `;

        // Evento Eliminar
        li.querySelector('.delete').addEventListener('click', () => {
          tasks = tasks.filter(t => t.id !== task.id);
          renderTasks();
        });

        // Evento Editar
        li.querySelector('.edit').addEventListener('click', () => {
          task.isEditing = true;
          renderTasks();
        });

        // Evento Completar
        li.querySelector('.complete').addEventListener('click', () => {
          task.completed = !task.completed;
          renderTasks();
        });
      }

      taskList.appendChild(li);
    });

    updateCounters();
  }

  // Escapar HTML contra Inyecciones
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // ===================================================
  // VALIDACIÓN Y AGREGAR TAREA
  // ===================================================
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = taskInput.value.trim();

    if (!value) {
      errorMessage.classList.add('visible');
      taskInput.style.borderColor = 'var(--error-color)';
      return;
    }

    // Ocultar error si es válido
    errorMessage.classList.remove('visible');
    taskInput.style.borderColor = 'var(--input-border)';

    // Crear tarea nueva
    tasks.push({
      id: Date.now().toString(),
      text: value,
      completed: false
    });

    taskInput.value = '';
    renderTasks();
  });

  // Limpiar error al escribir
  taskInput.addEventListener('input', () => {
    if (errorMessage.classList.contains('visible')) {
      errorMessage.classList.remove('visible');
      taskInput.style.borderColor = 'var(--input-border)';
    }
  });

  // Render inicial
  renderTasks();
});