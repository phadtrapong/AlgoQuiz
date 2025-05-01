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

# TODO: Add Remaining Blind 75 Questions and Answers

Below is a checklist of Blind 75 questions not yet implemented in the quiz. For each, add:
- Problem statement
- Code skeleton
- At least one correct and several plausible incorrect code snippets (with explanations)

## Arrays & Hashing
- [x] Valid Anagram
- [x] Group Anagrams
- [x] Top K Frequent Elements
- [ ] Product of Array Except Self (already present)
- [ ] Valid Sudoku
- [ ] Encode and Decode Strings
- [ ] Longest Consecutive Sequence

## Two Pointers
- [ ] Valid Palindrome
- [ ] Two Sum (already present)
- [ ] 3Sum (already present)
- [ ] Container With Most Water (already present)
- [ ] Trapping Rain Water

## Sliding Window
- [ ] Best Time to Buy and Sell Stock (already present)
- [ ] Longest Substring Without Repeating Characters
- [ ] Longest Repeating Character Replacement
- [ ] Minimum Window Substring
- [ ] Permutation in String
- [ ] Sliding Window Maximum
- [ ] Minimum Size Subarray Sum
- [ ] Longest Substring with At Most K Distinct Characters

## Stack
- [ ] Valid Parentheses
- [ ] Min Stack
- [ ] Evaluate Reverse Polish Notation
- [ ] Generate Parentheses
- [ ] Daily Temperatures
- [ ] Car Fleet
- [ ] Largest Rectangle in Histogram

## Binary Search
- [ ] Binary Search
- [ ] Search a 2D Matrix
- [ ] Koko Eating Bananas
- [ ] Find Minimum in Rotated Sorted Array (already present)
- [ ] Search in Rotated Sorted Array (already present)

## Linked List
- [ ] Reverse Linked List
- [ ] Merge Two Sorted Lists
- [ ] Reorder List
- [ ] Remove Nth Node From End of List
- [ ] Copy List with Random Pointer
- [ ] Add Two Numbers
- [ ] LRU Cache
- [ ] Merge K Sorted Lists
- [ ] Linked List Cycle
- [ ] Find the Duplicate Number
- [ ] Intersection of Two Linked Lists
- [ ] Linked List Cycle II
- [ ] Reverse Nodes in k-Group

## Trees
- [ ] Maximum Depth of Binary Tree
- [ ] Same Tree
- [ ] Invert/Flip Binary Tree
- [ ] Binary Tree Maximum Path Sum
- [ ] Binary Tree Level Order Traversal
- [ ] Serialize and Deserialize Binary Tree
- [ ] Subtree of Another Tree
- [ ] Construct Binary Tree from Preorder and Inorder Traversal
- [ ] Validate Binary Search Tree
- [ ] Kth Smallest Element in a BST
- [ ] Lowest Common Ancestor of BST
- [ ] Implement Trie (Prefix Tree)
- [ ] Add and Search Word
- [ ] Word Search II

## Heap / Priority Queue
- [ ] Merge K Sorted Lists
- [ ] Top K Frequent Elements
- [ ] Find Median from Data Stream

## Backtracking
- [ ] Subsets
- [ ] Combination Sum
- [ ] Permutations
- [ ] Word Search
- [ ] Palindrome Partitioning
- [ ] Letter Combinations of a Phone Number
- [ ] N-Queens

## Graphs
- [ ] Number of Islands
- [ ] Clone Graph
- [ ] Course Schedule
- [ ] Pacific Atlantic Water Flow
- [ ] Number of Connected Components in an Undirected Graph
- [ ] Graph Valid Tree
- [ ] Word Ladder

## Advanced Graphs
- [ ] Reconstruct Itinerary
- [ ] Min Cost to Connect All Points
- [ ] Network Delay Time
- [ ] Swim in Rising Water
- [ ] Alien Dictionary
- [ ] Cheapest Flight Within K Stops
- [ ] Redundant Connection

## 1D Dynamic Programming
- [ ] Climbing Stairs (already present)
- [ ] Min Cost Climbing Stairs
- [ ] House Robber
- [ ] House Robber II
- [ ] Longest Palindromic Substring
- [ ] Palindromic Substrings
- [ ] Decode Ways
- [ ] Coin Change
- [ ] Maximum Product Subarray (already present)
- [ ] Word Break

## 2D Dynamic Programming
- [ ] Unique Paths
- [ ] Longest Common Subsequence
- [ ] Best Time to Buy and Sell Stock with Cooldown
- [ ] Coin Change 2
- [ ] Target Sum
- [ ] Interleaving String

## Greedy
- [ ] Maximum Subarray (already present)
- [ ] Jump Game
- [ ] Insert Interval
- [ ] Merge Intervals
- [ ] Non-overlapping Intervals
- [ ] Meeting Rooms
- [ ] Meeting Rooms II

## Intervals
- [ ] Insert Interval
- [ ] Merge Intervals
- [ ] Non-overlapping Intervals
- [ ] Meeting Rooms
- [ ] Meeting Rooms II

## Bit Manipulation
- [ ] Sum of Two Integers (already present)
- [ ] Number of 1 Bits (already present)
- [ ] Counting Bits (already present)
- [ ] Missing Number
- [ ] Reverse Bits

## Math & Geometry
- [ ] Rotate Image
- [ ] Spiral Matrix
- [ ] Set Matrix Zeroes
- [ ] Happy Number
- [ ] Plus One
- [ ] Pow(x, n)
- [ ] Multiply Strings
- [ ] Detect Capital

# For each unchecked item, add to quizData in quiz.js as described above.