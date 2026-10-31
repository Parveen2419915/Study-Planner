let currentUser = null;
let tasks = [];
let points = 0;
let badges = [];

let timerDuration = 1500;
let timeLeft = timerDuration;
let timer = null;
let isRunning = false;

const registrationSection = document.getElementById('registrationSection');
const loginSection = document.getElementById('loginSection');
const plannerSection = document.getElementById('plannerSection');

const registrationForm = document.getElementById('registrationForm');
const regUsername = document.getElementById('regUsername');
const regPassword = document.getElementById('regPassword');
const regConfirm = document.getElementById('regConfirm');
const regErrorMsg = document.getElementById('regErrorMsg');
const regSuccessMsg = document.getElementById('regSuccessMsg');
const goToLogin = document.getElementById('goToLogin');

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginErrorMsg = document.getElementById('loginErrorMsg');
const quoteEl = document.getElementById('quote');
const goToRegister = document.getElementById('goToRegister');

const logoutBtn = document.getElementById('logoutBtn');
const darkModeToggle = document.getElementById('darkModeToggle');

const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const summary = document.getElementById('summary');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

const pointsDisplay = document.getElementById('pointsDisplay');
const badgesContainer = document.getElementById('badgesContainer');

const challenges = [
  'Write down three new words you learned today.',
  'Spend 10 minutes reviewing past notes.',
  'Teach a concept you studied to a friend or family member.',
  'Take a 5-minute brain-break walk.',
  'Organize your study space for better focus.'
];

const challengeText = document.getElementById('challengeText');
const gratitudeInput = document.getElementById('gratitudeInput');
const gratitudeBtn = document.getElementById('gratitudeBtn');
const gratitudeMessage = document.getElementById('gratitudeMessage');

const timerCustomInput = document.getElementById('timerCustomInput');
const timeDisplay = document.getElementById('timeDisplay');
const timerProgressBar = document.getElementById('timerProgressBar');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

const themeRadios = document.querySelectorAll('input[name="theme"]');

const happySound = document.getElementById('happySound');
const timerSound = document.getElementById('timerSound');

const quotes = [
  '“The future depends on what you do today.” – Mahatma Gandhi',
  '“Don’t watch the clock; do what it does. Keep going.” – Sam Levenson',
  '“Success is the sum of small efforts, repeated day in and day out.” – Robert Collier',
  '“Push yourself, because no one else is going to do it for you.”',
  '“Dream it. Wish it. Do it.”'
];

function showQuote() {
  quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

goToLogin.addEventListener('click', () => {
  registrationSection.classList.remove('active');
  loginSection.classList.add('active');
  showQuote();
});

goToRegister.addEventListener('click', () => {
  loginSection.classList.remove('active');
  registrationSection.classList.add('active');
});

registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  regErrorMsg.textContent = '';
  regSuccessMsg.textContent = '';

  const username = regUsername.value.trim();
  const password = regPassword.value;
  const confirm = regConfirm.value;

  if (!username || !password || !confirm) {
    regErrorMsg.textContent = 'Please fill all fields.';
    return;
  }

  if (password !== confirm) {
    regErrorMsg.textContent = 'Passwords do not match.';
    return;
  }

  if (localStorage.getItem(`user_${username}`)) {
    regErrorMsg.textContent = 'Username already exists.';
    return;
  }

  localStorage.setItem(`user_${username}`, password);

  regSuccessMsg.textContent = 'Registration successful! Please login.';

  regUsername.value = '';
  regPassword.value = '';
  regConfirm.value = '';

  setTimeout(() => {
    registrationSection.classList.remove('active');
    loginSection.classList.add('active');
    regSuccessMsg.textContent = '';
    showQuote();
  }, 1500);
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  loginErrorMsg.textContent = '';

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const storedPassword = localStorage.getItem(`user_${username}`);

  if (storedPassword && storedPassword === password) {
    currentUser = username;

    loginSection.classList.remove('active');
    plannerSection.classList.add('active');

    usernameInput.value = '';
    passwordInput.value = '';

    loadUserData();
    loadDarkModePreference();
  } else {
    loginErrorMsg.textContent = 'Invalid username or password.';
  }
});

logoutBtn.addEventListener('click', () => {
  plannerSection.classList.remove('active');
  loginSection.classList.add('active');
  currentUser = null;
});

darkModeToggle.addEventListener('click', () => {
  const enabled = document.body.classList.toggle('dark-mode');

  if (currentUser) {
    localStorage.setItem(`darkMode_${currentUser}`, enabled);
  }
});

function loadDarkModePreference() {
  const enabled = localStorage.getItem(`darkMode_${currentUser}`) === 'true';

  if (enabled) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

function loadUserData() {
  tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
  points = parseInt(localStorage.getItem(`points_${currentUser}`)) || 0;
  badges = JSON.parse(localStorage.getItem(`badges_${currentUser}`)) || [];

  loadChallenge();
  loadGratitude();
  renderTasks();
  updateSummary();
  renderRewards();
}

function saveTasks() {
  if (currentUser) {
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
  }
}

function savePoints() {
  if (currentUser) {
    localStorage.setItem(`points_${currentUser}`, points);
  }
}

function saveBadges() {
  if (currentUser) {
    localStorage.setItem(`badges_${currentUser}`, JSON.stringify(badges));
  }
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('priority-icon');

    if (task.priority === 'High') {
      iconSpan.textContent = '🔥';
      iconSpan.classList.add('priority-high');
    } else if (task.priority === 'Medium') {
      iconSpan.textContent = '⚡';
      iconSpan.classList.add('priority-medium');
    } else {
      iconSpan.textContent = '🍃';
      iconSpan.classList.add('priority-low');
    }

    const span = document.createElement('span');
    span.className = 'taskText';

    span.textContent = task.text + (task.deadline ? ` (Due: ${task.deadline})` : '');
    span.prepend(iconSpan);

    span.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;

      if (tasks[index].completed) {
        points += 10;
        checkBadges();
        savePoints();
        playHappySound();
      }

      saveTasks();
      renderTasks();
      updateSummary();
      renderRewards();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteBtn';

    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      updateSummary();
    });

    const subtasksContainer = document.createElement('div');
    subtasksContainer.style.marginTop = '8px';

    (task.subtasks || []).forEach((subtask, subIndex) => {
      const subDiv = document.createElement('div');
      subDiv.style.display = 'flex';
      subDiv.style.alignItems = 'center';
      subDiv.style.marginBottom = '5px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = subtask.completed;
      checkbox.style.marginRight = '8px';

      checkbox.addEventListener('change', () => {
        task.subtasks[subIndex].completed = checkbox.checked;
        saveTasks();
        renderTasks();
        updateSummary();
      });

      const label = document.createElement('span');
      label.textContent = subtask.text;

      if (subtask.completed) {
        label.style.textDecoration = 'line-through';
      }

      const subDelete = document.createElement('button');
      subDelete.textContent = '×';
      subDelete.className = 'subtaskDeleteBtn';
      subDelete.style.marginLeft = '8px';

      subDelete.addEventListener('click', () => {
        task.subtasks.splice(subIndex, 1);
        saveTasks();
        renderTasks();
        updateSummary();
      });

      subDiv.appendChild(checkbox);
      subDiv.appendChild(label);
      subDiv.appendChild(subDelete);
      subtasksContainer.appendChild(subDiv);
    });

    const subtaskInput = document.createElement('input');
    subtaskInput.type = 'text';
    subtaskInput.placeholder = 'Add subtask...';
    subtaskInput.style.width = '70%';
    subtaskInput.style.marginRight = '8px';

    const subtaskBtn = document.createElement('button');
    subtaskBtn.textContent = '+';
    subtaskBtn.style.padding = '4px 8px';

    subtaskBtn.addEventListener('click', () => {
      const value = subtaskInput.value.trim();

      if (value) {
        task.subtasks = task.subtasks || [];
        task.subtasks.push({
          text: value,
          completed: false
        });

        saveTasks();
        renderTasks();
        updateSummary();
        subtaskInput.value = '';
      }
    });

    const subtaskRow = document.createElement('div');
    subtaskRow.style.display = 'flex';
    subtaskRow.appendChild(subtaskInput);
    subtaskRow.appendChild(subtaskBtn);

    subtasksContainer.appendChild(subtaskRow);

    const notesToggleBtn = document.createElement('button');
    notesToggleBtn.textContent = 'Show Notes';
    notesToggleBtn.style.marginTop = '5px';

    const notesArea = document.createElement('textarea');
    notesArea.style.width = '95%';
    notesArea.style.display = 'none';
    notesArea.value = task.notes || '';
    notesArea.placeholder = 'Add notes here...';

    notesArea.addEventListener('input', (event) => {
      task.notes = event.target.value;
      saveTasks();
    });

    notesToggleBtn.addEventListener('click', () => {
      if (notesArea.style.display === 'none') {
        notesArea.style.display = 'block';
        notesToggleBtn.textContent = 'Hide Notes';
      } else {
        notesArea.style.display = 'none';
        notesToggleBtn.textContent = 'Show Notes';
      }
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(subtasksContainer);
    li.appendChild(notesToggleBtn);
    li.appendChild(notesArea);

    taskList.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();

  if (!text) {
    alert('Please enter a task!');
    return;
  }

  tasks.push({
    text,
    deadline: deadlineInput.value || null,
    priority: prioritySelect.value,
    completed: false,
    subtasks: [],
    notes: ''
  });

  taskInput.value = '';
  deadlineInput.value = '';
  prioritySelect.value = 'Low';

  saveTasks();
  renderTasks();
  updateSummary();
});

taskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  updateSummary();
});

function updateSummary() {
  const pending = tasks.filter(task => !task.completed).length;
  const completed = tasks.filter(task => task.completed).length;

  summary.textContent = `Pending: ${pending} | Completed: ${completed}`;
}

function checkBadges() {
  if (points >= 100 && !badges.includes('100 Points Winner')) {
    badges.push('100 Points Winner');
    alert('🎉 Badge unlocked: 100 Points Winner!');
  }

  if (points >= 300 && !badges.includes('Productivity Master')) {
    badges.push('Productivity Master');
    alert('🏆 Badge unlocked: Productivity Master!');
  }

  saveBadges();
}

function renderRewards() {
  pointsDisplay.textContent = `Points: ${points}`;
  badgesContainer.innerHTML = '';

  badges.forEach(badge => {
    const badgeElement = document.createElement('span');
    badgeElement.className = 'badge';
    badgeElement.textContent = badge;
    badgesContainer.appendChild(badgeElement);
  });
}

document.getElementById('sortSelect').addEventListener('change', (event) => {
  const value = event.target.value;

  if (value === 'priority') {
    const priorityOrder = {
      High: 3,
      Medium: 2,
      Low: 1
    };

    tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  } else if (value === 'deadline') {
    tasks.sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  } else if (value === 'completed') {
    tasks.sort((a, b) => a.completed - b.completed);
  }

  renderTasks();
  updateSummary();
});

function loadChallenge() {
  const challenge = challenges[new Date().getDate() % challenges.length];
  challengeText.textContent = challenge;
}

function saveGratitude(text) {
  if (currentUser) {
    localStorage.setItem(`gratitude_${currentUser}`, text);
  }
}

function loadGratitude() {
  const saved = localStorage.getItem(`gratitude_${currentUser}`);
  gratitudeMessage.textContent = saved ? `You wrote: "${saved}"` : '';
}

gratitudeBtn.addEventListener('click', () => {
  const text = gratitudeInput.value.trim();

  if (!text) {
    alert('Please write something before saving!');
    return;
  }

  saveGratitude(text);
  gratitudeMessage.textContent = `You wrote: "${text}"`;
  gratitudeInput.value = '';
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return String(minutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
  timerProgressBar.style.width = ((timerDuration - timeLeft) / timerDuration) * 100 + '%';
}

timerCustomInput.addEventListener('input', () => {
  if (isRunning) return;

  let value = parseInt(timerCustomInput.value);

  if (isNaN(value) || value < 1) {
    value = 1;
  }

  if (value > 7200) {
    value = 7200;
  }

  timerCustomInput.value = value;
  timerDuration = value;
  timeLeft = timerDuration;

  updateDisplay();
});

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;

      timerSound.currentTime = 0;
      timerSound.play().catch(error => console.log('Timer sound failed:', error));

      alert('Timer finished!');
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timer);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = timerDuration;
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

function applyTheme(theme) {
  document.body.style.background = '';
  document.body.style.color = '';
  document.body.style.boxShadow = '0 0 15px #a1a1a1';

  if (theme === 'dark') {
    document.body.style.background = '#2c3e50';
    document.body.style.color = '#ecf0f1';
    document.body.style.boxShadow = '0 0 20px #34495e';
  } else if (theme === 'sunset') {
    document.body.style.background = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
    document.body.style.color = '#6d4c41';
    document.body.style.boxShadow = '0 0 25px #bf360c';
  } else if (theme === 'forest') {
    document.body.style.background = 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)';
    document.body.style.color = '#1b5e20';
    document.body.style.boxShadow = '0 0 25px #2e7d32';
  } else {
    document.body.style.background = '#f2f4f8';
    document.body.style.color = '#2c3e50';
  }
}

themeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    applyTheme(radio.value);
  });
});

function playHappySound() {
  happySound.currentTime = 0;
  happySound.play().catch(error => console.log('Task completion sound failed:', error));
}

updateDisplay();
showQuote();
