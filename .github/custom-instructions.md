create an interactive, Duolingo-style quiz in HTML/JavaScript focusing on Google interview-style coding problems, specifically using Blind 75 LeetCode questions for the MVP. The core interaction involves presenting a LeetCode problem statement and a partially completed code solution, where the user has to select the correct code snippet from multiple choices to complete it.

Here's a breakdown of the components and a plan to build this MVP:

1. Core Components:

HTML Structure: To display the problem, code, and choices.

CSS Styling: To make it look presentable and potentially mimic the Duolingo feel (e.g., clear visual feedback).

JavaScript Logic:

To load the question data (problem statement, code skeleton, choices, correct answer).

To handle user interaction (selecting an answer).

To check the answer and provide immediate feedback.

To potentially load the next question (though MVP might just have one).

# Knowledge Sharing: LeetCode Quiz MVP

## 1. Project Goal & Vision

To create an engaging, Duolingo-inspired web application for practicing LeetCode-style coding problems, focusing initially on the Blind 75 list. The core aim is to make studying data structures and algorithms more interactive and effective through immediate feedback and explanations within a familiar quiz format.

## 2. Core Features (Current State)

*   **Interactive Quiz Interface:** Presents LeetCode problems one by one.
*   **Code Completion Questions:** Shows problem statement and a partial code solution (Python).
*   **Multiple Choice:** Users select the correct code snippet to complete the solution from several options (including plausible incorrect ones).
*   **Immediate Feedback:** Indicates if the selected answer is correct or incorrect upon checking.
*   **Explanations:** Displays reasons why each choice was correct or incorrect after an answer is submitted. (Added in latest iteration)
*   **Syntax Highlighting:** Uses Prism.js for readable Python code display.
*   **Progress Bar:** Visual indicator of progress through the current quiz session.
*   **Question Shuffling:** Presents questions in a random order per session. (Added in latest iteration)
*   **Content:** Growing library of Blind 75 questions with correct/incorrect choices and explanations, currently embedded in JS.

## 3. Target Audience

*   Software engineering students and professionals preparing for technical interviews.
*   Individuals looking for a more interactive way to learn and reinforce DS&A concepts.

## 4. Technology Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **Libraries:** Prism.js (for syntax highlighting)
*   **Data Format:** JavaScript Array of Objects (embedded directly in `quiz.js` for MVP simplicity). JSON file loading is a potential future refactor.
*   **Hosting:** Static web hosting (e.g., GitHub Pages, Netlify, Vercel).

## 5. Development Process & Workflow

*   **Iterative Development:** Started with core quiz loop, incrementally added features (styling, highlighting, progress bar, shuffling, explanations).
*   **Content Creation:**
    *   Select problem from Blind 75 list.
    *   Extract problem statement/constraints from LeetCode.
    *   Write correct Python solution skeleton.
    *   Implement one canonical correct code snippet.
    *   Devise 2-3 plausible incorrect snippets (common errors, edge cases, inefficiencies).
    *   Write clear explanations for *each* choice's correctness/incorrectness.
    *   Add the question object to the `quizData` array in `quiz.js`.
*   **Code Structure:** Currently single HTML, CSS, and JS files. Potential for refactoring into modules as complexity grows.

## 6. Key Decisions & Rationale

*   **Vanilla JS & Static Site:** Chosen for simplicity, speed of development for MVP, and ease of deployment. Avoided framework overhead initially.
*   **Embedded `quizData`:** Faster initial setup than handling external file loading/fetching. Acknowledged limitation for maintainability as content grows (JSON is the planned next step for data).
*   **Prism.js:** Lightweight, easy-to-integrate library for essential syntax highlighting.
*   **Fisher-Yates Shuffle:** Standard algorithm for effective randomization of question order.
*   **Focus on Explanations:** Prioritized adding explanations early, as this is key to the *learning* aspect of the tool's value proposition.

## 7. Deployment

*   Deploy static files (index.html, style.css, quiz.js) to any static hosting provider.
*   No backend required for the current feature set.

## 8. Future Roadmap / Backlog Summary (Tier 1 Focus)

*   **Complete Content Population:** Add remaining Blind 75 questions with high-quality choices/explanations.
*   **Improve Explanation Display:** Enhance visibility and clarity.
*   **Add Resource Links:** Link choices/explanations to relevant LeetCode pages or tutorials.
*   **Review Mode:** Allow users to review incorrect answers post-quiz.
*   **Topic Selection/Filtering:** Enable quizzes focused on specific DS&A categories.
*   **(Technical Debt):** Refactor `quizData` into an external JSON file.