# Facebook Security Educator — Bot specification

**Archetype:** education

**Voice:** professional and encouraging — write every user-facing message, button label, error, and empty state in this voice.

Teaches users to protect Facebook accounts through security tips, interactive quizzes, and daily lessons with optional progress tracking and reminders.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- general public
- non-technical users
- teens
- caregivers

## Success criteria

- User completes security quiz with 80%+ accuracy
- User enables daily security reminders
- User shares a security tip with others

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open main menu with welcome and onboarding
- **Random Tip** (button, actor: user, callback: tip:random) — Receive a random security tip
- **Browse Tips** (button, actor: user, callback: tip:categories) — Select tips by category (Account, Phishing, Passwords, etc.)
- **Take Quiz** (button, actor: user, callback: quiz:start) — Begin a topic-specific quiz
- **My Progress** (button, actor: user, callback: profile:view) — View quiz scores and learning streak
- **Manage Reminders** (button, actor: user, callback: reminders:settings) — Enable/disable daily security lessons

## Flows

### Onboarding
_Trigger:_ /start

1. Welcome message
2. Privacy notice (optional)
3. Request progress tracking consent (Yes/No)

_Data touched:_ User

### Quiz Taking
_Trigger:_ quiz:start

1. Select topic
2. Show question with 4 options
3. Provide answer explanation and score update

_Data touched:_ Quiz, User

### Daily Lesson
_Trigger:_ scheduled reminder

1. Send tip + quiz question
2. Allow snooze/turn off

_Data touched:_ Lesson sequence, User

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **User** _(retention: persistent)_ — Telegram user with optional profile and progress data
  - fields: telegram_id, display_name, quiz_scores, lesson_streak, reminder_preference
- **Tip** _(retention: persistent)_ — Security recommendation with metadata
  - fields: content, category, difficulty, explanation, next_steps
- **Quiz** _(retention: persistent)_ — Multiple-choice question with validation
  - fields: question, options, correct_answer, explanation, topic, difficulty
- **Lesson sequence** _(retention: persistent)_ — Ordered learning path for habit formation
  - fields: tip_sequence, quiz_sequence, schedule

## Integrations

- **Telegram** (required) — Bot API messaging
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Add/update security tips and quizzes
- Configure admin notification targets
- View anonymized usage reports

## Notifications

- Daily security lesson reminders (opt-in)
- Admin usage reports with anonymized data

## Permissions & privacy

- Explicit consent required to store progress data
- No Facebook credentials or account access
- Anonymized metrics only for admin reports

## Edge cases

- User declines progress tracking: operate in session-only mode
- Quiz question with multiple correct answers
- Missed daily lesson reminder rescheduling

## Required tests

- End-to-end quiz flow with scoring
- Daily reminder snooze/stop functionality
- Anonymous vs tracked user behavior divergence

## Assumptions

- Content is static and owner-curated
- Admin notifications use a single Telegram account/group
- No Facebook API integration required
