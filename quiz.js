// --- Quiz Logic ---
const problemTitleEl = document.getElementById('problem-title');
const problemStatementEl = document.getElementById('problem-statement');
const codeSkeletonEl = document.getElementById('code-skeleton'); // The <code> element
const choicesAreaEl = document.getElementById('choices-area');
const checkButton = document.getElementById('check-button');
const feedbackAreaEl = document.getElementById('feedback-area');
const nextButton = document.getElementById('next-button');
// --- Add Progress Bar Element References ---
const progressBarFillEl = document.getElementById('progress-bar-fill');
const progressTextEl = document.getElementById('progress-text');

let quizData = [];

// Fetch quiz data from external JSON file
fetch('quiz-data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    quizData = data;
    // Initialize the app after data is loaded
    initializeQuestionList();
    updateProgressBar();
    loadQuestion(currentQuestionIndex);
  })
  .catch(error => {
    console.error('Error loading quiz data:', error);
    document.querySelector('.quiz-container').innerHTML = '<div class="error-message">Failed to load quiz data. Please refresh the page.</div>';
  });

let currentQuestionIndex = 0;
let correctAnswerIndex = -1;

// Add new variables for tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const questionsListEl = document.getElementById('questions-list');

// Initialize question list
function initializeQuestionList() {
    questionsListEl.innerHTML = '';
    quizData.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        if (index < currentQuestionIndex) {
            questionItem.classList.add('completed');
        }
        questionItem.innerHTML = `${index + 1}. ${question.problemTitle}`;
        questionItem.addEventListener('click', () => {
            // Switch to quiz tab and load the selected question
            switchTab('quiz');
            if (index <= currentQuestionIndex) {
                currentQuestionIndex = index;
                loadQuestion(currentQuestionIndex);
            }
        });
        questionsListEl.appendChild(questionItem);
    });
}

// Tab switching functionality
function switchTab(tabId) {
    tabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabId);
    });
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}-tab`);
    });
    if (tabId === 'question-list') {
        initializeQuestionList();
    }
}

// Add tab button event listeners
tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
});

// Update loadQuestion to also update question list when needed
const originalLoadQuestion = loadQuestion;
loadQuestion = function(questionIndex) {
    originalLoadQuestion(questionIndex);
    // Update question list if it's visible
    if (document.getElementById('question-list-tab').classList.contains('active')) {
        initializeQuestionList();
    }
};

// --- Progress Bar Logic ---
function updateProgressBar() {
    const totalQuestions = quizData.length;
    // Calculate percentage based on the *next* question index (1-based for user)
    const percentComplete = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    // Update the bar width
    progressBarFillEl.style.width = `${percentComplete}%`;

    // Update the text (e.g., "Question 1 of 10")
    progressTextEl.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
}

function loadQuestion(questionIndex) {
     if (questionIndex >= quizData.length) {
        console.error("Question index out of bounds.");
        return;
    }

    const question = quizData[questionIndex];

    // --- Update progress bar for the new question ---
    updateProgressBar(); // Call this at the beginning of loading

    problemTitleEl.textContent = question.problemTitle;
    problemStatementEl.textContent = question.problemStatement;
    codeSkeletonEl.textContent = question.codeSkeleton;

    // Highlight the main skeleton *immediately* as it's already in the DOM
    if (window.Prism) {
        Prism.highlightElement(codeSkeletonEl);
    } else {
        console.warn("Prism syntax highlighter not found.");
    }

    // Clear previous choices and feedback
    choicesAreaEl.innerHTML = '';
    feedbackAreaEl.innerHTML = '';
    feedbackAreaEl.className = '';
    checkButton.disabled = false;
    checkButton.style.display = 'block';
    nextButton.style.display = 'none';

    // --- Shuffle choices ---
    let choicesWithOriginalIndex = question.choices.map((choice, index) => ({ choice, originalIndex: index }));
    let shuffledChoicesWithOriginalIndex = choicesWithOriginalIndex.sort(() => Math.random() - 0.5);
    correctAnswerIndex = shuffledChoicesWithOriginalIndex.findIndex(item => item.choice.correct);
    // --- End shuffle ---

    // --- Create and append elements first ---
    const choiceElementsToHighlight = []; // Keep track of code elements to highlight

    shuffledChoicesWithOriginalIndex.forEach((item, shuffledIndex) => {
        const choiceId = `choice-${shuffledIndex}`;
        const choiceData = item.choice;

        const label = document.createElement('label');
        label.htmlFor = choiceId;
        label.className = 'choice-label';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = choiceId;
        radio.name = 'answer';
        radio.value = shuffledIndex;

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = 'language-python';
        code.textContent = choiceData.text; // Set text content

        // Append structure together
        pre.appendChild(code);
        label.appendChild(radio);
        label.appendChild(pre);

        // Append the fully formed label to the DOM
        choicesAreaEl.appendChild(label);

        // Add the 'code' element to the list for highlighting later
        choiceElementsToHighlight.push(code);
    });

    // --- Highlight all choice code elements *after* they are in the DOM ---
    if (window.Prism) {
        choiceElementsToHighlight.forEach(codeElement => {
            Prism.highlightElement(codeElement);
        });
    }

    // Reset styles (should be fine here)
    document.querySelectorAll('.choice-label').forEach(label => {
        label.style.border = '';
        label.style.backgroundColor = '';
        label.style.opacity = '1';
    });
    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.disabled = false;
    });
}


function checkAnswer() {
    // ... (checkAnswer function remains the same) ...
    const selectedRadio = document.querySelector('input[name="answer"]:checked');
    if (!selectedRadio) {
        feedbackAreaEl.textContent = "Please select an answer.";
        feedbackAreaEl.className = 'incorrect';
        return;
    }

    const selectedChoiceIndex = parseInt(selectedRadio.value, 10);

    if (selectedChoiceIndex === correctAnswerIndex) {
        feedbackAreaEl.textContent = "Correct!";
        feedbackAreaEl.className = 'correct';
        selectedRadio.closest('label').style.border = '2px solid limegreen';
        selectedRadio.closest('label').style.backgroundColor = '#e7ffe7';
    } else {
        feedbackAreaEl.textContent = "Incorrect.";
        feedbackAreaEl.className = 'incorrect';
        const correctLabel = document.querySelector(`input[value='${correctAnswerIndex}']`)?.closest('label');
        if(correctLabel) {
            correctLabel.style.border = '2px solid limegreen';
            correctLabel.style.backgroundColor = '#e7ffe7';
        }
        selectedRadio.closest('label').style.border = '2px solid crimson';
        selectedRadio.closest('label').style.backgroundColor = '#fff0f0';
    }

    checkButton.disabled = true;
    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.disabled = true;
    });

    if (currentQuestionIndex < quizData.length - 1) {
         nextButton.style.display = 'block';
    } else {
         feedbackAreaEl.textContent += " Quiz Finished!";
         nextButton.style.display = 'none';
    }
}

function goToNextQuestion() {
    // ... (goToNextQuestion function remains the same) ...
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        console.log("End of quiz reached.");
    }
}


// --- Event Listeners ---
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', goToNextQuestion);


// --- Initial Load ---
// Remove these as they're already called in the fetch callback
// loadQuestion(currentQuestionIndex);
// initializeQuestionList();