'use strict';

let currentQuestionIndex = 0;
let quizData = []; // Will be populated by fetch
let selectedAnswerIndex = null; // Track selected answer index
let quizProgress = {}; // Store progress { questionIndex: { completed: bool, correct: bool, selected: int, explanation: str } }

// User state (Fun Mode, sounds, motion, XP, streaks)
const defaultUserState = {
    xp: 0,
    level: 1,
    sessionStreak: 0,
    bestSessionStreak: 0,
    settings: {
        funMode: true,
        sounds: false,
        reducedMotion: false,
        resumePreferences: null
    }
};

let userState = null;

// DOM Elements
const problemStatementEl = document.getElementById('problem-statement');
const codeSkeletonEl = document.getElementById('code-skeleton').querySelector('code');
const choiceTabsEl = document.getElementById('choice-tabs');
const choiceDetailsEl = document.getElementById('choice-details');
const choicesPlaceholderEl = document.getElementById('choices-placeholder'); // Placeholder text
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const feedbackAreaEl = document.getElementById('feedback-area');
const progressTextEl = document.getElementById('progress-text');
const progressBarFillEl = document.getElementById('progress-bar-fill');
const tabs = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const questionsListEl = document.getElementById('questions-list');
const reviewListEl = document.getElementById('review-list');
const reviewSummaryEl = document.getElementById('review-summary');
const resetProgressButton = document.getElementById('reset-progress-button');
const funModeToggle = document.getElementById('fun-mode-toggle');
const soundsToggle = document.getElementById('sounds-toggle');
const reducedMotionToggle = document.getElementById('reduced-motion-toggle');

// --- User State & Settings ---
function createDefaultUserState() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return {
        xp: defaultUserState.xp,
        level: defaultUserState.level,
        sessionStreak: defaultUserState.sessionStreak,
        bestSessionStreak: defaultUserState.bestSessionStreak,
        settings: {
            funMode: defaultUserState.settings.funMode,
            sounds: defaultUserState.settings.sounds,
            reducedMotion: prefersReducedMotion || defaultUserState.settings.reducedMotion,
            resumePreferences: null
        }
    };
}

function loadUserState() {
    const fallback = createDefaultUserState();
    try {
        const stored = localStorage.getItem('algoQuizUserState');
        if (!stored) {
            userState = fallback;
            return;
        }
        const parsed = JSON.parse(stored);
        userState = {
            ...fallback,
            ...parsed,
            settings: {
                ...fallback.settings,
                ...(parsed.settings || {})
            }
        };
    } catch (error) {
        console.warn('Failed to load user state. Using defaults.', error);
        userState = fallback;
    }
}

function saveUserState() {
    try {
        localStorage.setItem('algoQuizUserState', JSON.stringify(userState));
    } catch (error) {
        console.warn('Failed to save user state.', error);
    }
}

function setToggleDisabledClass(toggleEl) {
    if (!toggleEl) return;
    const label = toggleEl.closest('.settings-toggle');
    if (!label) return;
    if (toggleEl.disabled) {
        label.classList.add('settings-toggle--disabled');
    } else {
        label.classList.remove('settings-toggle--disabled');
    }
}

function applyUserSettings() {
    if (!userState) return;

    const funModeActive = !!userState.settings.funMode;

    if (funModeToggle) {
        funModeToggle.checked = funModeActive;
    }

    if (soundsToggle) {
        if (funModeActive) {
            soundsToggle.disabled = false;
            soundsToggle.checked = !!userState.settings.sounds;
        } else {
            soundsToggle.disabled = true;
            soundsToggle.checked = false;
            userState.settings.sounds = false;
        }
        setToggleDisabledClass(soundsToggle);
    }

    if (reducedMotionToggle) {
        if (funModeActive) {
            reducedMotionToggle.disabled = false;
            reducedMotionToggle.checked = !!userState.settings.reducedMotion;
        } else {
            reducedMotionToggle.disabled = true;
            reducedMotionToggle.checked = true;
            userState.settings.reducedMotion = true;
        }
        setToggleDisabledClass(reducedMotionToggle);
    }

    document.body.classList.toggle('fun-mode-off', !funModeActive);
    document.body.classList.toggle('fun-mode-on', funModeActive);
    document.body.classList.toggle('sounds-enabled', funModeActive && !!userState.settings.sounds);
    document.body.classList.toggle('reduced-motion', !funModeActive || !!userState.settings.reducedMotion);
}

function initializeSettingsPanel() {
    if (!userState) {
        loadUserState();
    }

    if (funModeToggle) {
        funModeToggle.addEventListener('change', () => {
            const nextState = funModeToggle.checked;
            if (!nextState) {
                if (!userState.settings.resumePreferences) {
                    userState.settings.resumePreferences = {
                        sounds: userState.settings.sounds,
                        reducedMotion: userState.settings.reducedMotion
                    };
                }
            } else if (userState.settings.resumePreferences) {
                userState.settings.sounds = !!userState.settings.resumePreferences.sounds;
                userState.settings.reducedMotion = !!userState.settings.resumePreferences.reducedMotion;
                userState.settings.resumePreferences = null;
            }
            userState.settings.funMode = nextState;
            applyUserSettings();
            saveUserState();
        });
    }

    if (soundsToggle) {
        soundsToggle.addEventListener('change', () => {
            userState.settings.sounds = soundsToggle.checked;
            applyUserSettings();
            saveUserState();
        });
    }

    if (reducedMotionToggle) {
        reducedMotionToggle.addEventListener('change', () => {
            userState.settings.reducedMotion = reducedMotionToggle.checked;
            applyUserSettings();
            saveUserState();
        });
    }

    applyUserSettings();
}

// --- Initialization ---
function initializeQuiz() {
    loadProgress();
    fetch('quiz-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            quizData = data;
            // Shuffle questions initially
            // shuffleArray(quizData);
            populateQuestionList();
            displayQuestion(currentQuestionIndex);
            updateProgressBar();
            setupTabNavigation();
            setupReviewTab();
        })
        .catch(error => {
            console.error('Failed to load quiz data:', error);
            problemStatementEl.textContent = 'Error loading quiz questions. Please check the console.';
            // Optionally load fallback data or show a user-friendly error
        });
}

// --- Progress Management ---
function saveProgress() {
    localStorage.setItem('algoQuizProgress', JSON.stringify(quizProgress));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('algoQuizProgress');
    if (savedProgress) {
        quizProgress = JSON.parse(savedProgress);
        // Find the first incomplete question to start
        currentQuestionIndex = quizData.findIndex((_, index) => !quizProgress[index]?.completed);
        if (currentQuestionIndex === -1) currentQuestionIndex = 0; // If all complete, start from 0
    } else {
        quizProgress = {};
        currentQuestionIndex = 0;
    }
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all your progress?')) {
        quizProgress = {};
        localStorage.removeItem('algoQuizProgress');
        currentQuestionIndex = 0;
        // Reset UI elements
        feedbackAreaEl.style.display = 'none';
        nextButton.style.display = 'none';
        checkButton.disabled = true; // Disable until an answer is selected
        checkButton.style.display = 'inline-block';
        populateQuestionList(); // Update list styling
        displayQuestion(currentQuestionIndex);
        updateProgressBar();
        setupReviewTab(); // Clear review tab
    }
}

// --- Tab Navigation ---
function setupTabNavigation() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tabs and content
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate the clicked tab and content
            tab.classList.add('active');
            const targetContentId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetContentId);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Special handling for review tab update
            if (targetContentId === 'review') {
                setupReviewTab();
            }
        });
    });
}

// --- Question List ---
function populateQuestionList() {
    questionsListEl.innerHTML = ''; // Clear existing list
    quizData.forEach((question, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('question-item');
        
        let prefix = ''; // Icon prefix
        // Mark as completed if applicable
        if (quizProgress[index]?.completed) {
            listItem.classList.add('completed');
            if (quizProgress[index]?.correct === false) {
                listItem.classList.add('incorrect-answered'); // Add specific class for review styling
                prefix = '❌ '; // Add cross mark
            } else {
                 prefix = '✅ '; // Add check mark
            }
        }
        
        // Set text content including the prefix
        listItem.textContent = `${prefix}${index + 1}. ${question.problemTitle}`; // Use problemTitle
        listItem.dataset.index = index;

        listItem.addEventListener('click', () => {
            // Switch back to the quiz tab FIRST
            const quizTabButton = document.querySelector('.tab-button[data-tab="quiz-content"]');
            if (quizTabButton) {
                quizTabButton.click();
            } else {
                console.error('Quiz tab button not found');
                // Proceed even if button not found, might still work
            }
            
            // THEN update index and display the question
            currentQuestionIndex = index; 
            displayQuestion(currentQuestionIndex); 
        });
        questionsListEl.appendChild(listItem);
    });
}

// --- Review Tab ---
function setupReviewTab() {
    reviewListEl.innerHTML = ''; // Clear previous review items
    let incorrectCount = 0;
    let correctCount = 0;
    let completedCount = 0;

    for (const index in quizProgress) {
        if (quizProgress[index]?.completed) {
            completedCount++;
            if (quizProgress[index]?.correct) {
                correctCount++;
            } else {
                incorrectCount++;
                const question = quizData[index];
                if (!question) continue; // Skip if question data missing

                const reviewItem = document.createElement('li');
                reviewItem.classList.add('review-item', 'incorrect-answered');
                reviewItem.innerHTML = `
                    <strong>${parseInt(index) + 1}. ${question.problemTitle}</strong>
                    <span>Your Answer: Choice ${quizProgress[index].selected !== null ? String.fromCharCode(65 + quizProgress[index].selected) : 'N/A'}</span>
                    <div class="review-details">
                        <p><strong>Your Incorrect Choice:</strong></p>
                        <pre><code class="language-python">${question.choices[quizProgress[index].selected]?.text || 'Not Available'}</code></pre>
                        <p><strong>Correct Choice (${String.fromCharCode(65 + question.choices.findIndex(c => c.correct))}):</strong></p>
                        <pre><code class="language-python">${question.choices.find(c => c.correct)?.text || 'Not Available'}</code></pre>
                        <p><strong>Explanation:</strong></p>
                        <p>${quizProgress[index].explanation || 'No explanation available.'}</p>
                    </div>
                `;
                reviewListEl.appendChild(reviewItem);
            }
        }
    }

    // Update summary
    reviewSummaryEl.innerHTML = `
        <p>Total Questions: ${quizData.length}</p>
        <p>Completed: ${completedCount}</p>
        <p>Correct: ${correctCount}</p>
        <p>Incorrect: ${incorrectCount}</p>
    `;

    // Re-highlight code in the review tab
    reviewListEl.querySelectorAll('pre code').forEach((block) => {
        Prism.highlightElement(block);
    });
}

// --- Quiz Display & Interaction ---
function displayQuestion(index) {
    if (index >= quizData.length || index < 0) {
        console.error('Invalid question index:', index);
        problemStatementEl.textContent = 'End of Quiz or Invalid Question.';
        codeSkeletonEl.textContent = '';
        choiceTabsEl.innerHTML = '';
        choiceDetailsEl.innerHTML = '';
        checkButton.style.display = 'none';
        nextButton.style.display = 'none';
        return;
    }

    const question = quizData[index];
    problemStatementEl.innerHTML = question.problemStatement.replace(/\n/g, '<br>'); // Keep line breaks
    
    // Update code skeleton content
    if (codeSkeletonEl) {
        codeSkeletonEl.textContent = question.codeSkeleton;
        // Re-highlight skeleton code AFTER setting content
        Prism.highlightElement(codeSkeletonEl); 
    } else {
        console.error("#code-skeleton code element not found");
    }

    choiceTabsEl.innerHTML = ''; // Clear previous tabs
    choiceDetailsEl.innerHTML = ''; // Clear previous details
    choiceDetailsEl.appendChild(choicesPlaceholderEl); // Show placeholder
    choicesPlaceholderEl.style.display = 'block';

    selectedAnswerIndex = null; // Reset selection

    question.choices.forEach((choice, i) => {
        // Create Tab Button
        const tabButton = document.createElement('button');
        tabButton.classList.add('choice-tab-button');
        tabButton.textContent = String.fromCharCode(65 + i); // A, B, C...
        tabButton.dataset.index = i;

        tabButton.addEventListener('click', () => {
            // Remove selected class from all tabs
            choiceTabsEl.querySelectorAll('.choice-tab-button').forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked tab
            tabButton.classList.add('selected');
            selectedAnswerIndex = i;
            checkButton.disabled = false;

            // Display choice details
            choicesPlaceholderEl.style.display = 'none'; // Hide placeholder
            choiceDetailsEl.innerHTML = ''; // Clear previous details
            const choicePre = document.createElement('pre');
            const choiceCode = document.createElement('code');
            choiceCode.classList.add('language-python'); // Assuming python
            choiceCode.textContent = choice.text;
            choicePre.appendChild(choiceCode);
            choiceDetailsEl.appendChild(choicePre);
            Prism.highlightElement(choiceCode); // Highlight the new code
        });

        choiceTabsEl.appendChild(tabButton);
    });

    // Reset button states
    feedbackAreaEl.style.display = 'none';
    feedbackAreaEl.className = ''; // Remove correct/incorrect classes
    checkButton.style.display = 'inline-block';
    checkButton.disabled = true; // Disabled until a choice tab is clicked
    nextButton.style.display = 'none';

    updateProgressBar();
}

function checkAnswer() {
    if (selectedAnswerIndex === null) return; // No answer selected

    const question = quizData[currentQuestionIndex];
    const selectedChoice = question.choices[selectedAnswerIndex];
    const correctChoiceIndex = question.choices.findIndex(choice => choice.correct);
    const isCorrect = selectedChoice.correct;

    // Determine explanation to show
    let explanation = '';
    if (selectedChoice.explanation) {
        explanation = selectedChoice.explanation;
    } else if (isCorrect) {
        explanation = 'Correct!'; // Default correct message
    } else {
        // If incorrect and no specific explanation, try to find the correct one's explanation
        explanation = question.choices[correctChoiceIndex]?.explanation || 'Incorrect. Review the correct answer.';
    }

    // Store progress
    quizProgress[currentQuestionIndex] = {
        completed: true,
        correct: isCorrect,
        selected: selectedAnswerIndex,
        explanation: explanation // Store the determined explanation
    };
    saveProgress();

    // Show feedback
    showFeedback(isCorrect, explanation);

    // Disable choice tabs after checking
    choiceTabsEl.querySelectorAll('.choice-tab-button').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
        btn.style.opacity = '0.7';
    });

    checkButton.style.display = 'none';
    nextButton.style.display = 'inline-block';

    // Update question list styling
    const listItem = questionsListEl.querySelector(`.question-item[data-index="${currentQuestionIndex}"]`);
    if (listItem) {
        listItem.classList.add('completed');
        if (!isCorrect) {
            listItem.classList.add('incorrect-answered');
        }
    }
    updateProgressBar(); // Update progress after answering
}

function showFeedback(isCorrect, explanation) {
    feedbackAreaEl.textContent = explanation;
    feedbackAreaEl.className = isCorrect ? 'correct' : 'incorrect';
    feedbackAreaEl.style.display = 'block';

    const correctChoiceIndex = quizData[currentQuestionIndex].choices.findIndex(choice => choice.correct);

    // Highlight the correct tab and the selected tab (if different)
    choiceTabsEl.querySelectorAll('.choice-tab-button').forEach((btn, index) => {
        if (index === correctChoiceIndex) {
            btn.classList.add('correct-answer-highlight'); // Style for correct answer
        }
        if (index === selectedAnswerIndex && !isCorrect) {
            btn.classList.add('incorrect-selection-highlight'); // Style for wrong selection
        }
    });
}


function nextQuestion() {
    currentQuestionIndex++;
    // Find the next *incomplete* question
    while (currentQuestionIndex < quizData.length && quizProgress[currentQuestionIndex]?.completed) {
        currentQuestionIndex++;
    }

    if (currentQuestionIndex >= quizData.length) {
        // If all questions are completed, go to the first one or show end message
        // Optionally, check if all are completed and show a final message/review prompt
        if (Object.keys(quizProgress).length === quizData.length) {
            alert("Quiz finished! Check the Review tab.");
            document.querySelector('.tab-button[data-tab="review"]').click();
            // currentQuestionIndex = 0; // Loop back to start
        } else {
            // If some are skipped, find the first incomplete one from the beginning
            currentQuestionIndex = quizData.findIndex((_, index) => !quizProgress[index]?.completed);
             if (currentQuestionIndex === -1) currentQuestionIndex = 0; // Fallback
        }
    }

    displayQuestion(currentQuestionIndex);
}

// --- Utility Functions ---
function updateProgressBar() {
    const completedCount = Object.values(quizProgress).filter(p => p?.completed).length;
    const totalQuestions = quizData.length;
    const progressPercent = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

    progressTextEl.textContent = `Question ${currentQuestionIndex + 1}/${totalQuestions} (${completedCount} Completed)`;
    progressBarFillEl.style.width = `${progressPercent}%`;
}

// Fisher-Yates Shuffle (optional, if needed)
/*
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
*/

// --- Event Listeners ---
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);
resetProgressButton.addEventListener('click', resetProgress);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    loadUserState();
    initializeSettingsPanel();
    initializeQuiz();
});
