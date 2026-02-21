import {
  fisherYatesShuffle,
  findCorrectChoiceId,
  normalizeQuestion,
  migrateLegacySession,
  findNextQuestionIndex,
  buildSessionStats,
  isValidQuestion,
} from './quiz-core.mjs';

const SESSION_STORAGE_KEY = 'algoQuizSessionProgressV2';
const LEGACY_STORAGE_KEY = 'algoQuizSessionProgress';
const GAME_STORAGE_KEY = 'algoQuizGameStateV2';
const LEGACY_GAME_STORAGE_KEY = 'algoQuizGameState';

const XP_PER_CORRECT = 10;
const XP_STREAK_BONUS = 5;
const ACHIEVEMENTS = [
  { id: 'first_correct', label: 'First Blood', desc: 'Answer your first question correctly' },
  { id: 'streak_3', label: 'On a Roll', desc: 'Get 3 correct in a row' },
  { id: 'streak_5', label: 'Hot Streak', desc: 'Get 5 correct in a row' },
  { id: 'xp_100', label: 'Centurion', desc: 'Earn 100 XP' },
  { id: 'halfway', label: 'Halfway There', desc: 'Answer half the quiz' },
  { id: 'perfect', label: 'Perfectionist', desc: 'Answer all completed questions correctly' },
];

const state = {
  questions: [],
  questionById: new Map(),
  questionOrder: [],
  currentQuestionIndex: 0,
  currentChoiceOrder: [],
  currentStreak: 0,
  bestStreak: 0,
  totalXP: 0,
  unlockedAchievements: new Set(),
  sessionProgress: {},
};

const el = {
  container: document.querySelector('.quiz-container'),
  loadingSpinner: document.getElementById('loading-spinner'),
  problemTitle: document.getElementById('problem-title'),
  problemStatement: document.getElementById('problem-statement'),
  codeSkeleton: document.getElementById('code-skeleton'),
  choicesArea: document.getElementById('choices-area'),
  checkButton: document.getElementById('check-button'),
  nextButton: document.getElementById('next-button'),
  feedbackArea: document.getElementById('feedback-area'),
  progressBarFill: document.getElementById('progress-bar-fill'),
  progressText: document.getElementById('progress-text'),
  questionsList: document.getElementById('questions-list'),
  reviewSummary: document.getElementById('review-summary'),
  reviewList: document.getElementById('review-list'),
  resetProgressButton: document.getElementById('reset-progress-button'),
  tabNavigation: document.querySelector('.tab-navigation'),
  tabButtons: Array.from(document.querySelectorAll('.tab-button')),
  tabContents: Array.from(document.querySelectorAll('.tab-content')),
  streakCount: document.getElementById('streak-count'),
  xpCount: document.getElementById('xp-count'),
  achievementToastContainer: document.getElementById('achievement-toast-container'),
};

function showAppError(message) {
  if (!el.container) return;
  el.container.innerHTML = `<div class="error-message" role="alert">${message}</div>`;
}

function saveState() {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.sessionProgress));
  localStorage.setItem(
    GAME_STORAGE_KEY,
    JSON.stringify({
      currentStreak: state.currentStreak,
      bestStreak: state.bestStreak,
      totalXP: state.totalXP,
      unlockedAchievements: Array.from(state.unlockedAchievements),
    }),
  );
}

function loadState() {
  let loadedSession = {};

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      loadedSession = JSON.parse(raw) || {};
    }
  } catch (_e) {
    loadedSession = {};
  }

  if (!Object.keys(loadedSession).length) {
    try {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacySession = JSON.parse(legacyRaw) || {};
        loadedSession = migrateLegacySession(legacySession, state.questions, state.questionOrder);
      }
    } catch (_e) {
      loadedSession = {};
    }
  }

  state.sessionProgress = loadedSession;

  try {
    const rawGame = localStorage.getItem(GAME_STORAGE_KEY) || localStorage.getItem(LEGACY_GAME_STORAGE_KEY);
    if (rawGame) {
      const game = JSON.parse(rawGame);
      state.currentStreak = Number(game.currentStreak || 0);
      state.bestStreak = Number(game.bestStreak || 0);
      state.totalXP = Number(game.totalXP || 0);
      state.unlockedAchievements = new Set(Array.isArray(game.unlockedAchievements) ? game.unlockedAchievements : []);
    }
  } catch (_e) {
    state.currentStreak = 0;
    state.bestStreak = 0;
    state.totalXP = 0;
    state.unlockedAchievements = new Set();
  }

  state.currentQuestionIndex = findNextQuestionIndex(state.questionOrder, state.sessionProgress);
  saveState();
}

function setLoading(loading) {
  if (!el.loadingSpinner) return;
  el.loadingSpinner.classList.toggle('visible', loading);
}

function showFeedback(message, kind) {
  el.feedbackArea.textContent = message;
  el.feedbackArea.className = kind ? `feedback-area ${kind}` : 'feedback-area';
}

function clearFeedback() {
  showFeedback('', '');
}

function switchTab(tabId) {
  el.tabContents.forEach((content) => {
    content.classList.toggle('active', content.id === `${tabId}-tab`);
  });
  el.tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabId;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  if (tabId === 'question-list') {
    renderQuestionList();
  }
  if (tabId === 'review') {
    renderReview();
  }
}

function renderProblemStatement(statement) {
  el.problemStatement.textContent = '';
  const lines = String(statement || '').split('\n');
  lines.forEach((line, i) => {
    el.problemStatement.appendChild(document.createTextNode(line));
    if (i < lines.length - 1) {
      el.problemStatement.appendChild(document.createElement('br'));
    }
  });
}

function updateProgressBar() {
  const total = state.questionOrder.length;
  if (!total) {
    el.progressText.textContent = 'No questions loaded';
    el.progressBarFill.style.width = '0%';
    return;
  }

  const index = Math.max(0, Math.min(state.currentQuestionIndex, total - 1));
  const progressPercent = ((index + 1) / total) * 100;
  el.progressBarFill.style.width = `${progressPercent}%`;

  const stats = buildSessionStats(state.questionOrder, state.sessionProgress);
  el.progressText.textContent = `Question ${index + 1} of ${total} - ${stats.answered} answered`;
}

function updateGameUI() {
  el.streakCount.textContent = String(state.currentStreak);
  el.xpCount.textContent = String(state.totalXP);
}

function showToast(text, description) {
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <span class="toast-label">${text}</span>
    <span class="toast-desc">${description}</span>
  `;
  el.achievementToastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function checkAndUnlockAchievements() {
  const stats = buildSessionStats(state.questionOrder, state.sessionProgress);
  const completedAll = stats.answered === state.questionOrder.length && state.questionOrder.length > 0;

  const unlock = (id) => {
    if (state.unlockedAchievements.has(id)) return;
    const def = ACHIEVEMENTS.find((item) => item.id === id);
    if (!def) return;
    state.unlockedAchievements.add(id);
    showToast(`Achievement Unlocked: ${def.label}`, def.desc);
  };

  if (stats.correct >= 1) unlock('first_correct');
  if (state.currentStreak >= 3) unlock('streak_3');
  if (state.currentStreak >= 5) unlock('streak_5');
  if (state.totalXP >= 100) unlock('xp_100');
  if (stats.answered >= Math.ceil(state.questionOrder.length / 2)) unlock('halfway');
  if (completedAll && stats.correct === stats.answered) unlock('perfect');
}

function renderChoices(question) {
  el.choicesArea.innerHTML = '';

  const order = fisherYatesShuffle(question.choices.map((c) => c.id));
  state.currentChoiceOrder = order;

  order.forEach((choiceId, index) => {
    const choice = question.choices.find((item) => item.id === choiceId);
    if (!choice) return;

    const label = document.createElement('label');
    label.className = 'choice-label';
    label.htmlFor = `choice-${index}`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'answer';
    radio.id = `choice-${index}`;
    radio.value = choice.id;
    radio.setAttribute('aria-label', `Choice ${index + 1}`);

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-python';
    code.textContent = choice.text;
    pre.appendChild(code);

    const explanation = document.createElement('p');
    explanation.className = 'choice-explanation';
    explanation.textContent = choice.explanation;

    label.appendChild(radio);
    label.appendChild(pre);
    label.appendChild(explanation);
    el.choicesArea.appendChild(label);
  });

  if (window.Prism) {
    el.choicesArea.querySelectorAll('code').forEach((node) => Prism.highlightElement(node));
  }
}

function renderQuestion(questionIndex) {
  if (questionIndex < 0 || questionIndex >= state.questionOrder.length) {
    return;
  }

  state.currentQuestionIndex = questionIndex;
  const questionId = state.questionOrder[questionIndex];
  const question = state.questionById.get(questionId);
  if (!question) return;

  el.problemTitle.textContent = question.problemTitle;
  renderProblemStatement(question.problemStatement);
  el.codeSkeleton.textContent = question.codeSkeleton;

  if (window.Prism) {
    Prism.highlightElement(el.codeSkeleton);
  }

  renderChoices(question);
  clearFeedback();

  el.checkButton.disabled = false;
  el.checkButton.style.display = 'inline-block';
  el.nextButton.style.display = 'none';

  updateProgressBar();
}

function markChoicesAfterAnswer(question, selectedChoiceId) {
  const correctChoiceId = findCorrectChoiceId(question);
  const labels = Array.from(el.choicesArea.querySelectorAll('.choice-label'));

  labels.forEach((label) => {
    const radio = label.querySelector('input[type="radio"]');
    if (!radio) return;
    radio.disabled = true;
    label.classList.remove('correct-style', 'incorrect-style', 'correct-answer-highlight', 'incorrect-selection-highlight');

    if (radio.value === correctChoiceId) {
      label.classList.add('correct-style');
    }
    if (radio.value === selectedChoiceId && selectedChoiceId !== correctChoiceId) {
      label.classList.add('incorrect-style');
    }
  });
}

function handleCheckAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    showFeedback('Select an answer before checking.', 'incorrect');
    return;
  }

  const questionId = state.questionOrder[state.currentQuestionIndex];
  const question = state.questionById.get(questionId);
  if (!question) return;

  const selectedChoiceId = selected.value;
  const correctChoiceId = findCorrectChoiceId(question);
  const isCorrect = selectedChoiceId === correctChoiceId;

  state.sessionProgress[questionId] = {
    selectedChoiceId,
    correctChoiceId,
    isCorrect,
    answeredAt: new Date().toISOString(),
  };

  if (isCorrect) {
    state.currentStreak += 1;
    state.totalXP += XP_PER_CORRECT + Math.max(0, state.currentStreak - 1) * XP_STREAK_BONUS;
  } else {
    state.currentStreak = 0;
  }

  state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
  checkAndUnlockAchievements();
  updateGameUI();
  saveState();

  markChoicesAfterAnswer(question, selectedChoiceId);
  showFeedback(isCorrect ? 'Correct. Great work.' : 'Not quite. Review the explanation and try the next one.', isCorrect ? 'correct' : 'incorrect');

  el.checkButton.disabled = true;
  el.checkButton.style.display = 'none';
  el.nextButton.style.display = state.currentQuestionIndex < state.questionOrder.length - 1 ? 'inline-block' : 'none';

  renderQuestionList();
  renderReview();
}

function renderQuestionList() {
  el.questionsList.innerHTML = '';

  state.questionOrder.forEach((questionId, index) => {
    const question = state.questionById.get(questionId);
    if (!question) return;

    const status = state.sessionProgress[questionId];
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'question-item';

    if (status) {
      item.classList.add(status.isCorrect ? 'correct-answered' : 'incorrect-answered');
    }

    const prefix = status ? (status.isCorrect ? 'OK' : 'X') : '...';
    item.textContent = `${prefix} ${index + 1}. ${question.problemTitle}`;

    item.addEventListener('click', () => {
      renderQuestion(index);
      switchTab('quiz');
    });

    el.questionsList.appendChild(item);
  });
}

function renderReview() {
  el.reviewSummary.innerHTML = '';
  el.reviewList.innerHTML = '';

  const stats = buildSessionStats(state.questionOrder, state.sessionProgress);
  if (!stats.answered) {
    el.reviewSummary.textContent = 'No answers yet. Complete a few questions to see stats.';
    return;
  }

  const cards = [
    { label: 'Answered', value: stats.answered },
    { label: 'Correct', value: stats.correct },
    { label: 'Incorrect', value: stats.incorrect },
    { label: 'Score', value: `${stats.percentage}%` },
  ];

  cards.forEach((entry) => {
    const card = document.createElement('div');
    card.className = 'stat-card';

    const value = document.createElement('span');
    value.className = 'stat-value';
    value.textContent = String(entry.value);

    const label = document.createElement('span');
    label.className = 'stat-label';
    label.textContent = entry.label;

    card.appendChild(value);
    card.appendChild(label);
    el.reviewSummary.appendChild(card);
  });

  state.questionOrder.forEach((questionId, idx) => {
    const result = state.sessionProgress[questionId];
    if (!result) return;
    const question = state.questionById.get(questionId);
    if (!question) return;

    const selected = question.choices.find((choice) => choice.id === result.selectedChoiceId);
    const correct = question.choices.find((choice) => choice.id === result.correctChoiceId) || question.choices.find((choice) => choice.correct);

    const item = document.createElement('li');
    item.className = `review-item ${result.isCorrect ? 'correct-answered' : 'incorrect-answered'}`;

    const title = document.createElement('strong');
    title.textContent = `${idx + 1}. ${question.problemTitle}`;

    const status = document.createElement('span');
    status.textContent = result.isCorrect ? '(Correct)' : '(Incorrect)';

    const details = document.createElement('div');
    details.className = 'review-details';

    const yourAnswer = document.createElement('p');
    yourAnswer.textContent = `Your answer: ${selected ? selected.text.split('\n')[0] : 'Unavailable'}`;
    details.appendChild(yourAnswer);

    if (!result.isCorrect && correct) {
      const correctAnswer = document.createElement('p');
      correctAnswer.textContent = `Correct answer: ${correct.text.split('\n')[0]}`;
      details.appendChild(correctAnswer);
    }

    item.appendChild(title);
    item.appendChild(status);
    item.appendChild(details);
    el.reviewList.appendChild(item);
  });
}

function resetProgress() {
  const confirmed = window.confirm('Reset all saved quiz progress and game stats?');
  if (!confirmed) return;

  state.sessionProgress = {};
  state.currentStreak = 0;
  state.bestStreak = 0;
  state.totalXP = 0;
  state.unlockedAchievements = new Set();

  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.removeItem(GAME_STORAGE_KEY);
  localStorage.removeItem(LEGACY_GAME_STORAGE_KEY);

  state.currentQuestionIndex = 0;
  updateGameUI();
  renderQuestion(0);
  renderQuestionList();
  renderReview();
  switchTab('quiz');
}

function validateAndLoad(rawData) {
  const normalized = rawData.map((q, index) => normalizeQuestion(q, index));
  const valid = normalized.filter((q) => isValidQuestion(q));

  if (!valid.length) {
    showAppError('No valid quiz entries found. Run data validation and refresh.');
    return;
  }

  state.questions = valid;
  state.questionById = new Map(valid.map((question) => [question.id, question]));
  state.questionOrder = valid.map((question) => question.id);

  loadState();
  updateGameUI();
  renderQuestion(Math.max(0, state.currentQuestionIndex));
  renderQuestionList();
  renderReview();
}

async function fetchQuizData() {
  setLoading(true);
  try {
    const response = await fetch('quiz-data.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz data (${response.status})`);
    }
    const raw = await response.json();
    if (!Array.isArray(raw)) {
      throw new Error('quiz-data.json must contain an array of questions.');
    }
    validateAndLoad(raw);
  } catch (error) {
    showAppError(`Unable to load quiz data: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

function wireEvents() {
  el.checkButton.addEventListener('click', handleCheckAnswer);

  el.nextButton.addEventListener('click', () => {
    const nextIndex = Math.min(state.currentQuestionIndex + 1, state.questionOrder.length - 1);
    renderQuestion(nextIndex);
  });

  el.tabNavigation.addEventListener('click', (event) => {
    const button = event.target.closest('.tab-button');
    if (!button) return;
    switchTab(button.dataset.tab);
  });

  el.resetProgressButton.addEventListener('click', resetProgress);
}

document.addEventListener('DOMContentLoaded', () => {
  wireEvents();
  fetchQuizData();
});
