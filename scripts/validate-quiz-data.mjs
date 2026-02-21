import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('quiz-data.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('blind75-manifest.json', 'utf8'));

const errors = [];
const manifestSlugs = new Set(manifest.map((m) => m.slug));
const dataIds = new Set();

if (manifest.length !== 75) {
  errors.push(`Manifest size must be 75, got ${manifest.length}`);
}

data.forEach((q, i) => {
  const where = `question[${i}] ${q.problemTitle || q.id || 'unknown'}`;
  const requiredQuestionFields = [
    'id',
    'problemTitle',
    'problemSlug',
    'topic',
    'difficulty',
    'problemStatement',
    'codeSkeleton',
    'choices',
  ];

  requiredQuestionFields.forEach((field) => {
    if (q[field] === undefined || q[field] === null || q[field] === '') {
      errors.push(`${where}: missing ${field}`);
    }
  });

  if (dataIds.has(q.id)) {
    errors.push(`${where}: duplicate id ${q.id}`);
  }
  dataIds.add(q.id);

  if (!Array.isArray(q.choices) || q.choices.length < 2) {
    errors.push(`${where}: choices must be array with at least 2 items`);
    return;
  }

  const correctCount = q.choices.filter((c) => c.correct === true).length;
  if (correctCount !== 1) {
    errors.push(`${where}: correct choice count must be 1, got ${correctCount}`);
  }

  const choiceIds = new Set();
  q.choices.forEach((c, j) => {
    const cWhere = `${where} choice[${j}]`;
    ['id', 'text', 'explanation', 'rationaleTags'].forEach((field) => {
      if (c[field] === undefined || c[field] === null || c[field] === '') {
        errors.push(`${cWhere}: missing ${field}`);
      }
    });
    if (choiceIds.has(c.id)) {
      errors.push(`${cWhere}: duplicate choice id ${c.id}`);
    }
    choiceIds.add(c.id);
    if (!Array.isArray(c.rationaleTags) || c.rationaleTags.length === 0) {
      errors.push(`${cWhere}: rationaleTags must be non-empty array`);
    }
  });
});

const manifestCoverage = manifest.filter((m) => data.some((q) => q.problemSlug === m.slug)).length;
if (manifestCoverage !== 75) {
  errors.push(`Manifest coverage must be 75/75, got ${manifestCoverage}/75`);
}

data.forEach((q) => {
  if (!manifestSlugs.has(q.problemSlug)) {
    errors.push(`Question problemSlug not in manifest: ${q.problemSlug}`);
  }
});

if (errors.length > 0) {
  console.error('Validation failed:');
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log(`Validation passed. Questions: ${data.length}, manifest coverage: ${manifestCoverage}/75`);
