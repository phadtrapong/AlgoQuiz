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
const reviewSummaryEl = document.getElementById('review-summary');
const reviewListEl = document.getElementById('review-list');
const resetProgressButton = document.getElementById('reset-progress-button');

let quizData = [];
let currentQuestionIndex = 0;
let correctAnswerIndex = -1;
let sessionProgress = {}; // { questionIndex: { selected: shuffledIndex, correct: correctAnswerIndex, isCorrect: bool } }
const SESSION_STORAGE_KEY = 'algoQuizSessionProgress'; // Key for localStorage

// --- Persistence Functions ---

/**
 * Saves the current session progress to localStorage.
 */
function saveSessionProgress() {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionProgress));
  } catch (e) {
    console.error("Failed to save session progress:", e);
  }
}

/**
 * Loads session progress from localStorage.
 */
function loadSessionProgress() {
  try {
    const savedProgress = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedProgress) {
      sessionProgress = JSON.parse(savedProgress);
      // Find the next unanswered question to resume
      const lastAnsweredIndex = Math.max(...Object.keys(sessionProgress).map(Number));
      // Decide where to start: next question or beginning if all answered
      if (lastAnsweredIndex >= 0 && lastAnsweredIndex < quizData.length - 1) {
           currentQuestionIndex = lastAnsweredIndex + 1;
      } else if (Object.keys(sessionProgress).length === quizData.length) {
          // All questions answered - maybe start at review or first question?
          console.log("Quiz previously completed. Starting from beginning or review tab.");
          // For now, let's just start at 0, Review tab would be better later.
          currentQuestionIndex = 0; // Or handle differently (e.g., show review tab first)
      } else {
          currentQuestionIndex = 0; // Default to start if progress is weird
      }
      console.log("Session progress loaded. Resuming at question:", currentQuestionIndex + 1);
    } else {
      sessionProgress = {};
      currentQuestionIndex = 0; // No saved progress
    }
  } catch (e) {
    console.error("Failed to load or parse session progress:", e);
    sessionProgress = {}; // Reset on error
    currentQuestionIndex = 0;
  }
}

// Fetch quiz data from external JSON file
function fetchQuizData() {
  fetch('quiz-data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      quizData = data;
      if (quizData.length > 0) {
         loadSessionProgress(); // Load progress AFTER quiz data is available
         updateProgressBar();
         loadQuestion(currentQuestionIndex);
      } else {
          console.error("Quiz data is empty.");
          // Display an error message in the UI
          document.querySelector('.quiz-container').innerHTML = '<div class="error-message">No questions found in quiz data.</div>';
      }
    })
    .catch(error => {
      console.error('Error loading or parsing quiz data:', error);
      document.querySelector('.quiz-container').innerHTML = `<div class="error-message">Failed to load quiz data: ${error.message}. Please refresh.</div>`;
    });
}

// Add new variables for tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const questionsListEl = document.getElementById('questions-list');

// Tab switching functionality
function switchTab(tabId) {
    console.log(`Switching to tab: ${tabId}`); // Log which tab we're trying to switch to

    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        console.log(` Hiding content: #${content.id}`);
        content.classList.remove('active');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    const contentToShow = document.getElementById(`${tabId}-tab`);
    if (contentToShow) {
        console.log(` Showing content: #${contentToShow.id}`);
        contentToShow.classList.add('active');
    } else {
        console.error(`Content element not found for tab ID: ${tabId}-tab`);
    }

    // Activate the selected tab button
    const buttonToActivate = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (buttonToActivate) {
        console.log(` Activating button: [data-tab="${buttonToActivate.dataset.tab}"]`);
        buttonToActivate.classList.add('active');
    } else {
        console.error(`Button element not found for data-tab: ${tabId}`);
    }

    // Populate list ONLY when switching TO that tab
    if (tabId === 'question-list' && quizData.length > 0) {
        populateQuestionsList();
    } else if (tabId === 'review') {
        populateReviewView();
    }
}

// REMOVED loadQuestion override

// --- Progress Bar Logic ---
function updateProgressBar() {
    // Ensure quizData is loaded before calculating
    if (!quizData || quizData.length === 0) {
        progressBarFillEl.style.width = '0%';
        progressTextEl.textContent = 'Loading...';
        return;
    }
    const totalQuestions = quizData.length;
    // Ensure index is valid
    const displayIndex = Math.max(0, Math.min(currentQuestionIndex, totalQuestions - 1));
    const percentComplete = ((displayIndex + 1) / totalQuestions) * 100;
    progressBarFillEl.style.width = `${percentComplete}%`;
    progressTextEl.textContent = `Question ${displayIndex + 1} of ${totalQuestions}`;
}

function loadQuestion(questionIndex) {
     if (questionIndex < 0 || questionIndex >= quizData.length) {
        console.error("Attempted to load question index out of bounds:", questionIndex);
        // Optionally handle this case, e.g., show quiz end screen or first question
        return;
    }

    const question = quizData[questionIndex];

    // --- Update progress bar for the new question ---
    updateProgressBar(); // Call this at the beginning of loading

    problemTitleEl.textContent = question.problemTitle;
    problemStatementEl.innerHTML = ''; // Clear previous
    // Basic conversion of newline to <br> for problem statement display
    const statementLines = question.problemStatement.split('\n');
    statementLines.forEach((line, index) => {
        problemStatementEl.appendChild(document.createTextNode(line));
        if (index < statementLines.length - 1) {
             problemStatementEl.appendChild(document.createElement('br'));
        }
    });

    codeSkeletonEl.textContent = question.codeSkeleton;

    // Highlight the main skeleton
    if (window.Prism) {
        Prism.highlightElement(codeSkeletonEl);
    } else {
        console.warn("Prism syntax highlighter not found.");
    }

    // Clear previous choices and feedback & reset buttons
    choicesAreaEl.innerHTML = '';
    resetFeedbackAndButtons(); // Use helper

    // --- Shuffle choices --- (Keep if desired)
    let choicesWithOriginalIndex = question.choices.map((choice, index) => ({ choice, originalIndex: index }));
    let shuffledChoicesWithOriginalIndex = choicesWithOriginalIndex.sort(() => Math.random() - 0.5);
    correctAnswerIndex = shuffledChoicesWithOriginalIndex.findIndex(item => item.choice.correct);
    // --- End shuffle ---

    // --- Create and append elements first ---
    const choiceElementsToHighlight = [];

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
        code.className = 'language-python'; // Assume Python, adjust if needed
        code.textContent = choiceData.text; // Set text content

        pre.appendChild(code);
        label.appendChild(radio);
        label.appendChild(pre);
        choicesAreaEl.appendChild(label);
        choiceElementsToHighlight.push(code);
    });

    // --- Highlight all choice code elements *after* they are in the DOM ---
    if (window.Prism) {
        choiceElementsToHighlight.forEach(codeElement => {
            Prism.highlightElement(codeElement);
        });
    }
}

function checkAnswer() {
    const selectedRadio = document.querySelector('input[name="answer"]:checked');
    if (!selectedRadio) {
        feedbackAreaEl.textContent = "Please select an answer.";
        feedbackAreaEl.className = 'feedback-area incorrect';
        return;
    }

    const selectedChoiceIndex = parseInt(selectedRadio.value, 10);
    const isCorrect = selectedChoiceIndex === correctAnswerIndex;

    // --- Record the result --- 
    sessionProgress[currentQuestionIndex] = {
        selected: selectedChoiceIndex,
        correct: correctAnswerIndex, // Storing this might be useful for review
        isCorrect: isCorrect
    };
    saveSessionProgress(); // Save progress immediately
    // -------------------------

    const selectedLabel = selectedRadio.closest('label');

    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.disabled = true;
    });
    checkButton.disabled = true;
    checkButton.style.display = 'none';

    if (isCorrect) { // Use the calculated isCorrect variable
        feedbackAreaEl.textContent = "Correct!";
        feedbackAreaEl.className = 'feedback-area correct';
        if (selectedLabel) {
            selectedLabel.classList.add('correct-style');
        }
    } else {
        feedbackAreaEl.textContent = "Incorrect.";
        feedbackAreaEl.className = 'feedback-area incorrect';
        const correctLabel = document.querySelector(`input[value='${correctAnswerIndex}']`)?.closest('label');
        if (correctLabel) {
            correctLabel.classList.add('correct-style');
        }
        if (selectedLabel) {
            selectedLabel.classList.add('incorrect-style');
        }
    }

    if (currentQuestionIndex < quizData.length - 1) {
         nextButton.style.display = 'inline-block';
    } else {
         feedbackAreaEl.textContent += " Quiz Finished!";
    }
    
    // Update question list view if it's active to mark as completed
    if (document.getElementById('question-list-tab').classList.contains('active')) {
        populateQuestionsList();
    }
}

/**
 * Populates the list of questions in the 'Question List' tab.
 * Adds click listeners to jump to a specific question.
 */
function populateQuestionsList() {
  questionsListEl.innerHTML = '';

  quizData.forEach((question, index) => {
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';
    
    // --- Add visual indicator based on session progress --- 
    if (sessionProgress[index]) {
        questionItem.classList.add('answered'); // General answered class
        if (sessionProgress[index].isCorrect) {
            questionItem.classList.add('correct-answered'); // Mark correct
            questionItem.innerHTML = `✅ ${index + 1}. ${question.problemTitle}`;
        } else {
            questionItem.classList.add('incorrect-answered'); // Mark incorrect
            questionItem.innerHTML = `❌ ${index + 1}. ${question.problemTitle}`;
        }
    } else {
        questionItem.textContent = `${index + 1}. ${question.problemTitle}`; // Unanswered
    }
    // -------------------------------------------------------

    questionItem.dataset.questionIndex = index;
    questionsListEl.appendChild(questionItem);
  });

  // Add event listener to the list container (using event delegation)
  // Ensure this listener isn't added multiple times if populate is called often
  // A simple check (might need refinement if populate is called outside switchTab)
  if (!questionsListEl.dataset.listenerAttached) {
      questionsListEl.addEventListener('click', (event) => {
        const questionItemElement = event.target.closest('.question-item');
        if (questionItemElement) {
          const index = parseInt(questionItemElement.dataset.questionIndex, 10);
          console.log("Index:", index); // Keep for debugging if needed
          if (!isNaN(index)) {
            jumpToQuestion(index);
          }
        }
      });
      questionsListEl.dataset.listenerAttached = 'true'; // Mark as attached
  }
}

/**
 * Jumps to a specific question in the quiz.
 * @param {number} questionIndex - The index of the question to jump to.
 */
function jumpToQuestion(questionIndex) {
  if (questionIndex >= 0 && questionIndex < quizData.length) {
    currentQuestionIndex = questionIndex;
    loadQuestion(currentQuestionIndex); // Corrected function call
    // resetFeedbackAndButtons(); // This is called within loadQuestion now
    console.log("Switching to quiz tab");
    switchTab('quiz'); // Switch view back to the quiz
  } else {
    console.error('Invalid question index:', questionIndex);
  }
}

// --- Helper function to reset feedback and buttons ---
function resetFeedbackAndButtons() {
    feedbackAreaEl.textContent = '';
    feedbackAreaEl.className = 'feedback-area'; // Reset class name
    checkButton.disabled = false;
    checkButton.style.display = 'inline-block'; // Use inline-block or block as needed
    nextButton.style.display = 'none';

    // Re-enable radio buttons and reset styles
    document.querySelectorAll('#choices-area .choice-label').forEach(label => {
        label.classList.remove('correct-style', 'incorrect-style');
        const radio = label.querySelector('input[type="radio"]');
        if(radio) {
            radio.disabled = false;
            radio.checked = false; // Uncheck radios
        }
    });
}

/**
 * Populates the Review Progress tab with summary and details.
 */
function populateReviewView() {
    reviewListEl.innerHTML = ''; // Clear previous list
    reviewSummaryEl.innerHTML = ''; // Clear summary

    const answeredQuestions = Object.keys(sessionProgress);
    if (answeredQuestions.length === 0) {
        reviewSummaryEl.textContent = "No questions answered yet in this session.";
        return;
    }

    let correctCount = 0;
    answeredQuestions.forEach(qIndexStr => {
        if (sessionProgress[qIndexStr]?.isCorrect) {
            correctCount++;
        }
    });

    const totalAnswered = answeredQuestions.length;
    const incorrectCount = totalAnswered - correctCount;
    const percentage = totalAnswered > 0 ? ((correctCount / totalAnswered) * 100).toFixed(1) : 0;

    reviewSummaryEl.innerHTML = `
        <p>Total Answered: ${totalAnswered}</p>
        <p>Correct: ${correctCount}</p>
        <p>Incorrect: ${incorrectCount}</p>
        <p>Score: ${percentage}%</p>
    `;

    // Populate the list with details
    quizData.forEach((question, index) => {
        if (sessionProgress[index]) { // Only show answered questions
            const result = sessionProgress[index];
            const listItem = document.createElement('li');
            listItem.className = result.isCorrect ? 'review-item correct-answered' : 'review-item incorrect-answered';
            
            // Find the text of the selected and correct choices
            // Need to find the original choice text based on saved indices
            // Assumes choices were shuffled! We need to map back or store text.
            // --- Option 1: Re-find based on index (Simpler for now, less robust if choices change)
            let selectedChoiceText = "N/A";
            let correctChoiceText = "N/A";
            // Note: This assumes the *structure* of choices doesn't change, only order
            const originalChoices = quizData[index].choices; 
            if (originalChoices[result.selected]) {
                selectedChoiceText = originalChoices[result.selected].text.substring(0, 80) + '...'; // Truncate for display
            }
             if (originalChoices[result.correct]) {
                correctChoiceText = originalChoices[result.correct].text.substring(0, 80) + '...'; // Truncate
            }
            // --- End Option 1 ---
            // TODO: A more robust way would be to store the actual text or a stable ID in sessionProgress

            listItem.innerHTML = `
                <strong>${index + 1}. ${question.problemTitle}</strong> 
                <span>(${result.isCorrect ? 'Correct' : 'Incorrect'})</span>
                <div class="review-details">
                    Your Answer: <pre><code>${selectedChoiceText}</code></pre>
                    ${!result.isCorrect ? `Correct Answer: <pre><code>${correctChoiceText}</code></pre>` : ''}
                </div>
            `;
            reviewListEl.appendChild(listItem);
        }
    });
}

/**
 * Resets the session progress and restarts the quiz.
 */
function resetProgress() {
    if (confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
        sessionProgress = {};
        localStorage.removeItem(SESSION_STORAGE_KEY);
        currentQuestionIndex = 0;
        // Need to re-initialize the quiz state
        updateProgressBar();
        loadQuestion(currentQuestionIndex);
        // Switch back to quiz tab
        switchTab('quiz');
        // Clear review view if currently visible
        reviewListEl.innerHTML = '';
        reviewSummaryEl.innerHTML = 'Progress reset.';
        console.log("Session progress reset.");
    }
}

// Initialize Quiz and Event Listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  fetchQuizData(); // Fetch data when the DOM is ready (this now calls loadSessionProgress indirectly)

  // Tab Navigation Event Listener
  document.querySelector('.tab-navigation').addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('tab-button')) {
          const tabId = event.target.dataset.tab;
          switchTab(tabId);
      }
  });

  // Check Answer Button Listener
  if (checkButton) {
      checkButton.addEventListener('click', checkAnswer);
  } else {
      console.error('Check button not found');
  }

  // Next Question Button Listener
  if (nextButton) {
      nextButton.addEventListener('click', () => {
          // Move to the next question if possible
          if (currentQuestionIndex < quizData.length - 1) {
              currentQuestionIndex++;
              loadQuestion(currentQuestionIndex);
              // resetFeedbackAndButtons(); // Called within loadQuestion
              // updateProgressBar(); // Called within loadQuestion
          } else {
              // Handle quiz completion (already handled in checkAnswer, potentially)
              console.log('Attempted to go past the last question.');
              // alert('Quiz Complete!'); // Maybe show completion state differently
          }
      });
  } else {
       console.error('Next button not found');
  }

  // Initial UI setup (optional, if needed before data loads)
  updateProgressBar(); // Show initial loading state

  // Reset Progress Button Listener
  if (resetProgressButton) {
    resetProgressButton.addEventListener('click', resetProgress);
  } else {
    console.error('Reset progress button not found');
  }

}); // End DOMContentLoaded