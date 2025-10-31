# Fun Mode Feature Breakdown

## Milestones
1. **Settings & User State**
   - Fun Mode / Focus Mode toggle UI
   - Sound & motion preferences
   - Persist user configuration (lgoQuizUserState)
2. **Streak & XP Layer**
   - Track session streak and best streak
   - XP computation (base, streak bonus, hint penalty)
   - UI badges/progress indicators
3. **Hints System**
   - 50/50 and rationale fragment flows
   - Penalty hooks (XP, streak suppression)
   - Copy and tooltip guidance
4. **Session Summary & Review Enhancements**
   - Summary card with XP, streaks, hint usage
   - Retry-missed CTA and stats integration

## Dependencies
- Extended question schema (quiz-data.json)
- Prism highlighting for dynamic hint code blocks
- LocalStorage availability

## Risks
- LocalStorage quota & serialization errors
- Animation performance on low-power devices
- Ensuring default behavior when Fun Mode disabled
