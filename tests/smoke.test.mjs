import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  fisherYatesShuffle,
  normalizeQuestion,
  migrateLegacySession,
  findNextQuestionIndex,
  buildSessionStats,
  isValidQuestion,
} from '../quiz-core.mjs';

const data = JSON.parse(fs.readFileSync('quiz-data.json', 'utf8'));

assert.ok(Array.isArray(data) && data.length >= 75, 'quiz-data should load with at least 75 entries');

const normalized = data.map((q, i) => normalizeQuestion(q, i));
assert.ok(normalized.every((q) => isValidQuestion(q)), 'all normalized questions should be valid');

const shuffled = fisherYatesShuffle([1, 2, 3, 4, 5], () => 0.5);
assert.equal(shuffled.length, 5, 'shuffle should preserve length');

const order = normalized.slice(0, 3).map((q) => q.id);
const legacy = { 0: { selected: 0, correct: 0, isCorrect: true } };
const migrated = migrateLegacySession(legacy, normalized, order);
assert.ok(migrated[order[0]], 'legacy migration should map first question');

const nextIndex = findNextQuestionIndex(order, migrated);
assert.equal(nextIndex, 1, 'next question index should move past answered question');

const stats = buildSessionStats(order, migrated);
assert.equal(stats.answered, 1);
assert.equal(stats.correct, 1);

console.log('Smoke tests passed.');
