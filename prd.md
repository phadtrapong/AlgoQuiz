# Product Requirements Document: AlgoQuiz (Blind 75 MVP + Fun Mode)

## 1. Introduction
AlgoQuiz is an interactive, Duolingo-inspired web application designed to help software engineering students and professionals prepare for technical interviews by practicing LeetCode-style coding problems. It focuses on the Blind 75 list of common interview questions. The core experience involves presenting a problem statement and a partial Python code solution, requiring the user to select the correct code snippet from multiple choices to complete it, providing immediate feedback and explanations.

## 2. Goals
*   **Primary Goal:** Provide an engaging and effective platform for learning and reinforcing Data Structures & Algorithms (DS&A) concepts relevant to technical interviews.
*   **MVP Goal:** Launch a functional quiz application covering a significant portion of the Blind 75 questions, focusing on the core "choose the correct code snippet" interaction with immediate feedback and explanations.
*   **User Goal:** Help users efficiently practice common algorithm problems, identify knowledge gaps, and learn from mistakes through clear explanations.
*   **Learning Goal:** Solidify understanding of different approaches (e.g., brute force vs. optimal) and common pitfalls for standard algorithm problems.
*   **Fun Mode Goal (New):** Add optional Duolingo-style gamification (session streaks, simple XP/levels, subtle animations, optional sounds) to increase motivation without distracting from learning.

## 3. Target Audience
*   Software engineering students preparing for internships or full-time roles.
*   Professional developers preparing for job changes or upskilling in algorithms.
*   Individuals seeking an interactive alternative to traditional LeetCode grinding or video tutorials.
*   Learners who respond well to gamified progress indicators and bite-sized practice loops.

## 4. User Stories
*   **As a student preparing for interviews, I want to** quickly test my understanding of common Blind 75 problems **so that I can** identify areas I need to study more.
*   **As a developer, I want to** see different implementation choices for a problem, including incorrect ones, **so that I can** better understand common mistakes and edge cases.
*   **As a user, I want to** receive immediate feedback on my answers **so that I can** quickly learn if my understanding is correct.
*   **As a user, I want to** read explanations for why an answer is correct or incorrect **so that I can** solidify my learning.
*   **As a user, I want to** track my progress through the quiz **so that I can** see how much I have completed.
*   **As a user, I want to** navigate between the quiz and a list of all questions **so that I can** jump to specific problems if needed.
*   **As a motivated learner, I want to** build streaks, earn XP, and celebrate milestones **so that I can** stay engaged during longer practice sessions.

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
    *   Display explanations for why the selected choice was correct/incorrect. (Potentially show explanations for all choices after submission).
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
    *   Visually indicate which questions have been answered using clear textual prefixes (e.g., "[Done]", "[Missed]") based on saved session progress.
*   **5.8. Session Persistence & Review:** (New Feature)
    *   User progress (which questions answered, selected choice, correctness) is saved to `localStorage` after each answer.
    *   On page load, the application checks `localStorage` for saved progress and resumes the quiz at the next unanswered question.
    *   A new "Review Progress" tab is available.
    *   The Review tab displays summary statistics: Total Answered, Correct, Incorrect, Score %.
    *   The Review tab lists all answered questions, showing the title, correct/incorrect status, the user's selected answer (truncated), and the correct answer (truncated, if incorrect).
    *   A "Reset Progress" button in the Review tab allows clearing the saved session data and starting fresh (with confirmation).
*   **5.9. Fun & Gamification (MVP-Fun):**
    *   **Fun Mode Toggle / Focus Mode:** Fun Mode ON by default; Focus Mode reduces animations and disables sounds for a calmer experience.
    *   **Session Streak:** Flame-style indicator showing consecutive correct answers in the current session. An incorrect answer breaks the streak. Using a hint prevents the streak from increasing on that question.
    *   **XP & Levels:** Base +10 XP per correct answer; streak bonus +2 XP per tier (every three correct answers in a row, capped at +6 XP); -5 XP penalty whenever a hint is used; linear level curve where level N requires N x 100 cumulative XP. Session summary shows XP gained and progress toward the next level.
    *   **Hints (No Coins):** Offer a 50/50 option (remove two incorrect choices when applicable) and a short rationale fragment that nudges the learner toward the optimal approach. Hints apply the XP penalty and disable streak growth for that question; they also reduce the session score shown in the summary.
    *   **Celebrations & Micro-Interactions:** Subtle confetti bursts and button micro-animations on correct answers and streak milestones (three, six, nine in a row). Optional short sounds accompany events; sounds are disabled by default.
    *   **Session Summary:** After a session or when the user opts to finish, present questions attempted, correct/incorrect counts, best streak, XP gained, level progress, hint usage, and a quick action to retry missed questions.

## 6. Design & UX Requirements
*   **Visual Style:** Clean, intuitive interface. Inspiration drawn from Duolingo's feedback style (clear correct/incorrect states, progress tracking). Use the Okaidia theme for Prism.js.
*   **Layout:** Responsive design, usable on typical desktop/laptop screen sizes. Max-width container for readability.
*   **Readability:** Ensure problem statements and code are easily readable (adequate font size, line spacing, syntax highlighting).
*   **Feedback:** Feedback must be immediate, clear, and informative. Explanations are crucial for the learning aspect.
*   **Interaction:** Simple and intuitive controls (radio buttons, clear buttons). Smooth transitions for progress bar updates.
*   **Fun and Focus Modes:** Provide easy access to toggle fun features on/off. Respect browser `prefers-reduced-motion` settings and Focus Mode when rendering animations.
*   **Animations:** Keep animations short, subtle, and non-blocking. Avoid overwhelming the learner.
*   **Audio:** Optional short cues for correct/incorrect answers. Sounds are muted by default and can be enabled via settings.

## 7. Technical Requirements
*   **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
*   **Libraries:** Prism.js for syntax highlighting; small client-only effect libraries (e.g., lightweight confetti) are permitted if they keep bundle size reasonable.
*   **Data:** Question data loaded from an external `quiz-data.json` (schema may be extended as outlined below).
*   **Compatibility:** Target modern web browsers (latest Chrome, Firefox, Safari, Edge).
*   **Deployment:** Static site hosting (e.g., GitHub Pages, Netlify, Vercel). No backend server required.
*   **Code Quality:** Adhere to rules defined in `.cursorrules` (consistent style, JSDoc for non-trivial functions, etc.). Recent refactoring in `quiz.js` has improved event handling and state management related to question lists and navigation.

### 7.1 Data Schema Extensions (JSON)
Add optional fields to each question (backward compatible when omitted):
```jsonc
{
  "id": "two-sum",
  "difficulty": "Easy",
  "topics": ["Array", "HashMap"],
  "xpReward": 12,
  "hints": {
    "rationale": "Consider trading space for time with an auxiliary map.",
    "hasFiftyFifty": true
  }
}
```

### 7.2 LocalStorage State
*   `algoQuizProgress`: Existing per-question completion state.
*   `algoQuizUserState` (new): `{ "xp": number, "level": number, "sessionStreak": number, "bestSessionStreak": number, "settings": { "funMode": true, "sounds": false, "reducedMotion": false } }`.

## 8. Non-Goals (MVP)
*   User accounts or cross-device persistent progress tracking (uses `localStorage` only).
*   Saving quiz state mid-question if the browser is closed.
*   Support for languages other than Python for solutions.
*   Allowing users to type code instead of multiple choice.
*   Advanced analytics or external performance tracking.
*   Integration with LeetCode accounts.
*   Timer per question or per quiz.
*   Mobile-specific optimization (focus on desktop/laptop first).
*   Loading questions from a backend or external API.
*   Coins, stores, or premium power-ups.
*   Daily streaks or online leaderboards (session streak only in MVP-Fun).

## 9. Success Metrics
*   **Session Length (Primary):** Average time-on-site per session, targeting a 20-30% lift when Fun Mode is active.
*   **Completion Rate:** Percentage of users who complete the current session's selected set.
*   **Streak Engagement:** Average best streak per session and hint usage rate.
*   **Feature Adoption:** Fun Mode toggle usage, hint usage, and "Retry missed" activation from the review summary.
*   **Content Coverage:** Number of Blind 75 questions implemented with high-quality choices and explanations.
*   **Qualitative Feedback:** User perception of motivation and enjoyment without feeling distracted.

## 10. Future Considerations (Post-MVP Roadmap)
*   Refactor `quizData` (done) to maintain questions externally.
*   Complete Blind 75 content.
*   Enhance explanations with richer formatting and optional resource links.
*   Review 2.0: spaced repetition (local-only) and targeted "retry missed" sets.
*   Topic and difficulty filtering with lightweight adaptive recommendations based on recent misses/correct answers.
*   Daily/weekly challenges with local best streak tracking.
*   Achievements and badges for streak lengths, topic mastery, and speed milestones.
*   User accounts and cross-device sync (post frontend-only phase).
*   Support for additional programming languages (Java, C++, JavaScript).
*   Accessibility improvements: ARIA roles, full keyboard navigation parity, expanded reduced-motion support.
*   Mobile optimization for smaller screens.

## 11. Implementation Notes (MVP-Fun)
*   Add Fun Mode/Focus Mode toggle and settings UI (sounds default OFF).
*   Implement session streak tracking and UI; ensure hints suppress streak growth for that question.
*   Track XP and levels in `algoQuizUserState`; apply streak bonuses and hint penalties; display level progress bar.
*   Implement hints (50/50 and rationale fragment) with clear copy explaining penalties.
*   Add subtle confetti and micro-animations while honoring Focus Mode and reduced-motion settings.
*   Add a session summary card showing XP, level progress, best streak, hint usage, and quick access to retry missed questions.
*   Extend `quiz-data.json` incrementally with new fields; default gracefully when data is absent.
