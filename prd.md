# Product Requirements Document: AlgoQuiz (Blind 75 MVP)

## 1. Introduction

AlgoQuiz is an interactive, Duolingo-inspired web application designed to help software engineering students and professionals prepare for technical interviews by practicing LeetCode-style coding problems. It focuses on the Blind 75 list of common interview questions. The core experience involves presenting a problem statement and a partial Python code solution, requiring the user to select the correct code snippet from multiple choices to complete it, providing immediate feedback and explanations.

## 2. Goals

*   **Primary Goal:** Provide an engaging and effective platform for learning and reinforcing Data Structures & Algorithms (DS&A) concepts relevant to technical interviews.
*   **MVP Goal:** Launch a functional quiz application covering a significant portion of the Blind 75 questions, focusing on the core "choose the correct code snippet" interaction with immediate feedback and explanations.
*   **User Goal:** Help users efficiently practice common algorithm problems, identify knowledge gaps, and learn from mistakes through clear explanations.
*   **Learning Goal:** Solidify understanding of different approaches (e.g., brute force vs. optimal) and common pitfalls for standard algorithm problems.

## 3. Target Audience

*   Software engineering students preparing for internships or full-time roles.
*   Professional developers preparing for job changes or upskilling in algorithms.
*   Individuals seeking an interactive alternative to traditional LeetCode grinding or video tutorials.

## 4. User Stories

*   **As a student preparing for interviews, I want to** quickly test my understanding of common Blind 75 problems **so that I can** identify areas I need to study more.
*   **As a developer, I want to** see different implementation choices for a problem, including incorrect ones, **so that I can** better understand common mistakes and edge cases.
*   **As a user, I want to** receive immediate feedback on my answers **so that I can** quickly learn if my understanding is correct.
*   **As a user, I want to** read explanations for why an answer is correct or incorrect **so that I can** solidify my learning.
*   **As a user, I want to** track my progress through the quiz **so that I can** see how much I've completed.
*   **As a user, I want to** navigate between the quiz and a list of all questions **so that I can** jump to specific problems if needed.
*   **As a user, I want to** see the code presented clearly with syntax highlighting **so that it is** easy to read and understand.

## 5. Features (MVP Detailed Breakdown)

*   **5.1. Quiz Interface:**
    *   Display Problem Title.
    *   Display Problem Statement (formatted text, including examples and constraints).
    *   Display Python Code Skeleton with a clearly marked `<MISSING CODE BLOCK>`.
    *   Utilize Prism.js for Python syntax highlighting in the skeleton and choices.
*   **5.2. Multiple Choice Interaction:**
    *   Present 3-4 code snippets as choices for the `<MISSING CODE BLOCK>`.
        *   One choice must be the functionally correct and generally optimal/intended solution.
        *   Other choices should represent plausible but incorrect logic (e.g., common errors, off-by-one, wrong algorithm, less efficient but technically working).
    *   Choices are presented as radio buttons linked to the code snippets.
    *   Code snippets within choices are also syntax-highlighted.
*   **5.3. Answer Checking & Feedback:**
    *   "Check Answer" button validates the selected choice against the correct answer.
    *   Provide immediate visual feedback:
        *   Indicate "Correct" or "Incorrect".
        *   Highlight the user's selected choice (e.g., green border if correct, red if incorrect).
        *   Highlight the correct choice if the user selected an incorrect one.
    *   Display explanations for *why* the selected choice was correct/incorrect. (Potentially show explanations for all choices after submission).
    *   Disable choice selection and "Check Answer" button after submission for the current question.
*   **5.4. Navigation:**
    *   "Next Question" button appears after checking an answer, loads the subsequent question.
    *   Tab navigation to switch between the main "Quiz" view and a "Question List" view.
*   **5.5. Question Pool & Loading:**
    *   Quiz questions (title, statement, skeleton, choices, correct flag, explanations) are sourced from an external JSON file (`quiz-data.json`) loaded by `quiz.js`.
    *   Questions are shuffled using Fisher-Yates algorithm at the start of a session.
    *   Load questions sequentially from the shuffled list.
*   **5.6. Progress Tracking:**
    *   Display a progress bar showing `(current question number) / (total questions)`.
    *   Update progress bar fill percentage as the user moves through questions.
    *   Display text indicating progress (e.g., "Question 5 of 15").
*   **5.7. Question List View:**
    *   Display a list of all available question titles in the "Question List" tab.
    *   Allow users to click a question title to jump directly to that question in the quiz view.
    *   Visually indicate which questions have been answered (using ✅/❌ icons) based on saved session progress.
*   **5.8. Session Persistence & Review:** (New Feature)
    *   User progress (which questions answered, selected choice, correctness) is saved to `localStorage` after each answer.
    *   On page load, the application checks `localStorage` for saved progress and resumes the quiz at the next unanswered question.
    *   A new "Review Progress" tab is available.
    *   The Review tab displays summary statistics: Total Answered, Correct, Incorrect, Score %.
    *   The Review tab lists all answered questions, showing the title, correct/incorrect status, the user's selected answer (truncated), and the correct answer (truncated, if incorrect).
    *   A "Reset Progress" button in the Review tab allows clearing the saved session data and starting fresh (with confirmation).

## 6. Design & UX Requirements

*   **Visual Style:** Clean, intuitive interface. Inspiration drawn from Duolingo's feedback style (clear correct/incorrect states, progress tracking). Use the Okaidia theme for Prism.js.
*   **Layout:** Responsive design, usable on typical desktop/laptop screen sizes. Max-width container for readability.
*   **Readability:** Ensure problem statements and code are easily readable (adequate font size, line spacing, syntax highlighting).
*   **Feedback:** Feedback must be immediate, clear, and informative. Explanations are crucial for the learning aspect.
*   **Interaction:** Simple and intuitive controls (radio buttons, clear buttons). Smooth transitions for progress bar updates.

## 7. Technical Requirements

*   **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3. No external frameworks (React, Vue, Angular) for the MVP.
*   **Libraries:** Prism.js for syntax highlighting.
*   **Data:** Question data loaded from an external `quiz-data.json`.
*   **Compatibility:** Target modern web browsers (latest Chrome, Firefox, Safari, Edge).
*   **Deployment:** Static site hosting (e.g., GitHub Pages, Netlify, Vercel). No backend server required.
*   **Code Quality:** Adhere to rules defined in `.cursorrules` (consistent style, JSDoc for non-trivial functions, etc.). Recent refactoring in `quiz.js` has improved event handling and state management related to question lists and navigation.

## 8. Non-Goals (MVP)

*   User accounts or *cross-device* persistent progress tracking (uses `localStorage` only).
*   Saving quiz state *mid-question* if the browser is closed.
*   Support for languages other than Python for solutions.
*   Allowing users to type code instead of multiple choice.
*   Advanced analytics or performance tracking.
*   Integration with LeetCode accounts.
*   Timer per question or per quiz.
*   Mobile-specific optimization (focus on desktop/laptop first).
*   Loading questions from a backend or external API.

## 9. Success Metrics

*   **Completion Rate:** Percentage of users who start a quiz session and complete all questions.
*   **Feature Adoption:** Usage of the "Question List" tab.
*   **Content Coverage:** Number of Blind 75 questions successfully implemented with high-quality choices and explanations.
*   **Qualitative Feedback:** User feedback gathered through usability testing or surveys (post-MVP).

## 10. Future Considerations (Post-MVP Roadmap)

*   **Refactor `quizData`:** (Done) Question data is now loaded from an external JSON file for better maintainability and scalability.
*   **Complete Content:** Add all remaining Blind 75 questions.
*   **Enhance Explanations:** Improve display format, potentially add links to external resources or LeetCode discussions.
*   **Review Mode:** Allow users to review all questions and their answers/explanations after completing a quiz.
*   **Topic Filtering:** Allow users to select specific DS&A categories (Arrays, Trees, DP, etc.) for focused quizzes.
*   **Persistence:** Use `localStorage` to save progress within a session or potentially across sessions.
*   **User Accounts:** Basic user accounts to track long-term progress and performance.
*   **More Languages:** Support for other popular interview languages (e.g., Java, C++, JavaScript).
*   **Accessibility Improvements:** Conduct thorough accessibility audit and implement necessary ARIA attributes and keyboard navigation enhancements.
*   **Mobile Optimization:** Improve layout and usability on smaller screens.