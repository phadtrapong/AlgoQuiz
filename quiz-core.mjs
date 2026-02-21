export function slugifyTitle(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function fisherYatesShuffle(items, rng = Math.random) {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function findCorrectChoiceId(question) {
  const choices = Array.isArray(question?.choices) ? question.choices : [];
  const correct = choices.filter((c) => c.correct === true);
  return correct.length === 1 ? correct[0].id : null;
}

export function normalizeQuestion(rawQuestion, index = 0) {
  const baseTitle = String(rawQuestion?.problemTitle || `Question ${index + 1}`);
  const questionId = String(rawQuestion?.id || slugifyTitle(baseTitle) || `question-${index + 1}`);
  const questionSlug = String(rawQuestion?.problemSlug || questionId);
  const topic = String(rawQuestion?.topic || 'General');
  const difficulty = String(rawQuestion?.difficulty || 'Medium');

  const rawChoices = Array.isArray(rawQuestion?.choices) ? rawQuestion.choices : [];
  const choices = rawChoices.map((choice, choiceIndex) => ({
    id: String(choice?.id || `${questionId}-choice-${choiceIndex + 1}`),
    text: String(choice?.text || ''),
    correct: choice?.correct === true,
    explanation: String(choice?.explanation || 'Explanation unavailable.'),
    rationaleTags: Array.isArray(choice?.rationaleTags) ? choice.rationaleTags : ['general'],
  }));

  return {
    id: questionId,
    problemTitle: baseTitle,
    problemSlug: questionSlug,
    topic,
    difficulty,
    problemStatement: String(rawQuestion?.problemStatement || ''),
    codeSkeleton: String(rawQuestion?.codeSkeleton || '# <MISSING CODE BLOCK>'),
    choices,
  };
}

export function migrateLegacySession(legacyProgress, questions, questionOrder) {
  const migrated = {};
  if (!legacyProgress || typeof legacyProgress !== 'object') {
    return migrated;
  }

  Object.entries(legacyProgress).forEach(([indexKey, value]) => {
    const qIndex = Number(indexKey);
    if (!Number.isInteger(qIndex) || qIndex < 0 || qIndex >= questionOrder.length) {
      return;
    }
    const questionId = questionOrder[qIndex];
    const question = questions.find((q) => q.id === questionId);
    if (!question) {
      return;
    }

    const selectedIdx = Number(value?.selected);
    const correctIdx = Number(value?.correct);

    const selectedChoiceId = Number.isInteger(selectedIdx) && question.choices[selectedIdx]
      ? question.choices[selectedIdx].id
      : null;
    const correctChoiceId = Number.isInteger(correctIdx) && question.choices[correctIdx]
      ? question.choices[correctIdx].id
      : findCorrectChoiceId(question);

    migrated[questionId] = {
      selectedChoiceId,
      correctChoiceId,
      isCorrect: Boolean(value?.isCorrect),
      answeredAt: value?.answeredAt || new Date().toISOString(),
    };
  });

  return migrated;
}

export function findNextQuestionIndex(questionOrder, sessionProgress) {
  for (let i = 0; i < questionOrder.length; i += 1) {
    if (!sessionProgress[questionOrder[i]]) {
      return i;
    }
  }
  return questionOrder.length > 0 ? questionOrder.length - 1 : 0;
}

export function buildSessionStats(questionOrder, sessionProgress) {
  let correct = 0;
  let answered = 0;
  questionOrder.forEach((id) => {
    if (sessionProgress[id]) {
      answered += 1;
      if (sessionProgress[id].isCorrect) {
        correct += 1;
      }
    }
  });
  return {
    answered,
    correct,
    incorrect: answered - correct,
    percentage: answered > 0 ? Number(((correct / answered) * 100).toFixed(1)) : 0,
  };
}

export function isValidQuestion(question) {
  if (!question || typeof question !== 'object') return false;
  if (!question.id || !question.problemTitle || !Array.isArray(question.choices)) return false;
  if (!question.codeSkeleton || !question.problemStatement) return false;
  const correctCount = question.choices.filter((c) => c.correct === true).length;
  if (correctCount !== 1) return false;
  if (question.choices.some((c) => !c.id || !c.text || !c.explanation)) return false;
  return true;
}
