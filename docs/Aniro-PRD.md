# PRD — Aniro

**Product:** Aniro  
**Type:** Personal student-life assistant PWA  
**Audience:** One user only  
**Primary platform:** Mobile-first web app / installable PWA  
**Business model:** Personal use, zero budget, no paid APIs or subscriptions  
**Status:** Planning

## 1. Product vision

Aniro is a private personal assistant for managing study, assignments, exams, money, health, and habits through a single low-friction conversational inbox.

The user should be able to type or speak naturally:

> “I spent 200 rupees on lunch, studied networking for 45 minutes, and my database assignment is due next Friday.”

Aniro identifies possible updates, presents them for approval, and then updates the relevant parts of the system: finance, health, study statistics, assignments, and calendar.

Aniro should reduce executive-function load. It must be calm, visual, editable, forgiving, and never shame the user for missed tasks, gaps in tracking, or broken streaks.

## 2. Problem statement

Students often manage their life across disconnected tools:

- Calendar for time
- Notes for assignments
- Spreadsheets or banking apps for money
- Habit apps for health
- Timers for studying
- Chat apps for quick thoughts

This creates friction. For an ADHD/autistic student, the cost of deciding where to record something can be high enough that the information is never recorded.

Aniro solves this by making one action—the daily “yap”—the main input method.

## 3. Goals

- Capture daily events in under one minute.
- Convert messy natural language into structured, reviewable updates.
- Keep modules, assignments, exams, study plans, finances, health, and habits in one place.
- Create adaptive study plans based on module type and exam/assignment deadlines.
- Sync approved time blocks with Google Calendar.
- Support private, local-first, single-user usage.
- Run with free tools and hosting.

## 4. Non-goals

Aniro will not initially:

- Support multiple users, social features, tutors, or teams.
- Offer clinical diagnosis, medical advice, or financial advice.
- Automatically make calendar or financial changes without approval.
- Depend on a paid LLM, paid speech service, or paid API.
- Use WhatsApp as a core integration; official WhatsApp automation is not a dependable zero-cost option.
- Replace a bank, accounting app, doctor, therapist, or university system.

## 5. Users

### Primary user

A single university student who:

- Has ADHD/autistic support needs or benefits from reduced friction.
- Wants help remembering tasks and deadlines.
- Needs a simple way to record spending and health patterns.
- Prefers speaking or typing naturally over filling forms.
- Needs study recommendations appropriate to different module types.
- Wants full control before data is changed.

## 6. Core user flows

### A. Daily conversational capture

1. User opens Aniro and taps “Tell Aniro about today.”
2. User types or records a voice memo.
3. Aniro extracts potential records.
4. Aniro displays an approval card.
5. User approves, edits, rejects, or sends a correction.
6. Aniro writes approved records to the correct dashboards.

Example output:

| Detected item | Proposed update |
|---|---|
| Expense | Rs. 200 — Food / Lunch |
| Health | Lunch logged |
| Study | Networking — 45 minutes |
| Assignment | Database assignment due Friday |
| Calendar | Optional reminder proposal |

### B. Module planning

1. User creates a module.
2. User chooses its learning type.
3. User adds topics, exam date, assignment deadlines, and confidence level.
4. Aniro proposes a study plan.
5. User reviews, changes, or approves it.
6. Approved blocks are added to the Aniro Google Calendar.

### C. Weekly review

1. Aniro presents the previous week’s study, spending, health, and habits.
2. It highlights overdue work, upcoming deadlines, review backlog, and patterns.
3. User chooses next week’s priorities.
4. Aniro creates an editable schedule proposal.

## 7. Features

### 7.1 Dashboard

The dashboard must show:

- Greeting and date
- Next calendar event
- Today’s top three priorities
- Upcoming assignments and exams
- Current study recommendation
- Study streak / consistency indicator
- Today’s spending and monthly budget status
- One health/habit prompt
- Quick “Yap to Aniro” action

The dashboard should use progressive disclosure: show only urgent or useful information first, with deeper analytics on separate pages.

### 7.2 Aniro Inbox

The Inbox is the primary interface.

Supported input:

- Typed conversational message
- Voice recording/transcription
- Quick entry templates
- Optional Telegram bot capture in a later phase

Functions:

- Identify dates, rupee amounts, categories, module names, task phrases, meals, study durations, and habit completion.
- Show confidence and source text for each proposed update.
- Require user approval before saving.
- Support corrections such as “make that tomorrow” or “the amount was 250.”
- Maintain an audit history and undo ability.

### 7.3 Academic management

#### Modules

Each module has:

- Name and code
- Semester
- Instructor or notes
- Learning type
- Topics
- Exam dates
- Assignment links
- Study target
- Confidence rating
- Time spent
- Review backlog

#### Module learning types

| Type | Best study approach |
|---|---|
| Memory-heavy | Active recall, flashcards, spaced repetition |
| Practice-heavy | Problem sets, worked examples, error log, mixed practice |
| Concept-heavy | Explain-from-memory, comparisons, concept maps, written answers |
| Project-heavy | Milestones, next actions, deep-work blocks, deliverables |

Spacing and retrieval practice should be the base of the review engine, since they are well-supported learning approaches. [Nature Reviews Psychology](https://doi.org/10.1038/s44159-022-00089-1)

#### Assignments and exams

The app must support:

- Title, module, due date, priority, estimated effort, status
- Subtasks and milestones
- Countdown to deadlines
- Risk indication based on deadline, remaining work, and available study time
- Exam revision plan
- Calendar scheduling after user approval

### 7.4 Study planner

Aniro proposes plans based on:

- Module type
- Available calendar time
- Exam and assignment deadlines
- Previous study time
- Confidence level
- Missed sessions
- Preferred study hours
- Energy and sleep logs, if available

Rules:

- Never silently create or move calendar events.
- Recommend small, realistic blocks by default.
- Allow “minimum viable session” plans, such as 10 minutes.
- If a session is missed, offer reschedule, shorten, skip, or revise workload.
- Avoid overfilling the calendar.

### 7.5 Finance

Finance must be optimized for rapid logging rather than accounting perfection.

Functions:

- Expense/income records
- Rupee amounts
- Categories and subcategories
- Daily and monthly budget
- Savings goals
- Recurring expenses
- “Safe to spend” estimate
- Monthly category chart
- Editable transaction history

Default categories:

- Food
- Transport
- Education
- Health
- Subscriptions
- Entertainment
- Family
- Other

### 7.6 Health and habit tracking

Track only what is useful and comfortable:

- Sleep duration and quality
- Meals and meal notes
- Water
- Exercise/movement
- Mood and energy
- Medication reminder/completion, if voluntarily enabled
- Sensory overload or stress notes
- Custom habits

Habit system design:

- Cue/anchor: “After I make tea…”
- Tiny default action: “Open the textbook for two minutes.”
- If–then recovery plan: “If I miss afternoon study, I do a 10-minute review at night.”
- Weekly consistency score rather than punishing streak resets.
- Gentle prompts that can be snoozed or disabled.

Prompts, goals, self-monitoring, and positive feedback are more useful foundations than guilt-based streak mechanics. [JMIR systematic review](https://www.jmir.org/2024/1/e54375)

### 7.7 Statistics

Statistics page must include:

- Total study time by module
- Study time by week/month
- Planned versus completed sessions
- Revision backlog
- Assignment/exam risk overview
- Spending by category
- Budget trend
- Sleep/energy and study correlations
- Habit consistency patterns
- Best study times and most frequently missed times

Insights must be worded cautiously:

> “You completed more study blocks on days where you logged 7+ hours of sleep.”

Not:

> “Sleeping 7 hours caused your performance to improve.”

### 7.8 Google Calendar integration

Requirements:

- Connect through Google OAuth.
- Use a dedicated “Aniro Study” calendar by default.
- Read free/busy availability only as needed.
- Create, update, and delete only events created by Aniro.
- Store an external event ID for sync safety.
- Show a preview before calendar changes.
- Prevent duplicate events.
- Allow a one-click disconnect.

Google Calendar API usage is free for normal usage, but connection still requires a free Google Cloud project and OAuth client ID—not a paid API key. [Google Calendar quotas](https://developers.google.com/workspace/calendar/api/guides/quota)

## 8. Technical approach

| Layer | Recommended choice |
|---|---|
| Frontend | React + Vite + TypeScript |
| UI | Responsive mobile-first PWA |
| Hosting | Cloudflare Pages free tier |
| Backend | Cloudflare Workers |
| Database | Cloudflare D1 / SQLite |
| Offline storage | IndexedDB |
| Authentication | Single-user passkey or secure login |
| Calendar | Google Calendar OAuth/API |
| Notifications | PWA notifications and browser push |
| Voice | Browser speech recognition first; optional local Whisper later |
| Exports | CSV and JSON |

Cloudflare Pages and D1 provide a reasonable free hosting/database base for a low-traffic personal app. [Cloudflare Pages](https://developers.cloudflare.com/pages/) [Cloudflare D1](https://www.cloudflare.com/products/d1/)

## 9. Data model

Core entities:

- `users`
- `modules`
- `topics`
- `assignments`
- `exams`
- `study_sessions`
- `study_plans`
- `review_items`
- `calendar_events`
- `transactions`
- `budgets`
- `financial_goals`
- `health_logs`
- `habits`
- `habit_checkins`
- `inbox_messages`
- `proposed_actions`
- `audit_log`

Every proposed action must include:

- Source message
- Extracted information
- Confidence score
- Approval status
- Created/updated record IDs
- Timestamp
- Undo reference

## 10. Accessibility and UX requirements

Aniro must:

- Be mobile-first.
- Use high contrast and readable typography.
- Support reduced motion.
- Avoid overwhelming dashboards.
- Use plain language.
- Allow custom notification frequency.
- Offer a “low-energy mode” with only essential actions.
- Allow voice or text input.
- Never treat missed habits as failure.
- Make correction easier than perfect initial input.

## 11. Privacy and security

- Single-user by design.
- No selling, advertising, analytics tracking, or data sharing.
- Minimize calendar permissions.
- Encrypt sensitive tokens at rest where feasible.
- Keep audit history private.
- Support JSON/CSV export.
- Support deletion of individual records.
- Build offline capability for quick entry.
- Explain clearly what data leaves the device for Google Calendar sync.

## 12. Success metrics

The product succeeds if:

- Daily capture takes less than one minute.
- Most Inbox updates are approved with little correction.
- The user logs study, spending, or health information at least several times per week.
- Upcoming assignments and exams are not missed because of forgotten deadlines.
- The user can identify where study time and money went each month.
- The user feels less overwhelmed, not more monitored.

## 13. Six delivery stages

| Stage | Deliverable |
|---|---|
| 1. Foundation | PWA shell, authentication, offline storage, dashboard, backups |
| 2. Academic core | Modules, assignments, exams, tasks, study timer |
| 3. Inbox | Typed capture, proposal cards, review/edit/approve, audit log |
| 4. Planning | Module-type study plans, spaced reviews, calendar proposal flow |
| 5. Personal life | Finance, health logs, habits, notifications |
| 6. Intelligence | Voice capture, Telegram option, advanced insights, local AI parsing |

## 14. MVP definition

The first usable release includes:

- Dashboard
- Modules
- Assignments and exams
- Study timer
- Typed Aniro Inbox
- Approval before data changes
- Finance quick log
- Google Calendar study-event sync
- Basic weekly statistics
- Data export

Voice, Telegram, advanced health correlation, adaptive scheduling, and local AI parsing should wait until the MVP is used consistently.

---

## 15. Product decisions and MVP scope update

### Product principles

1. **Capture before organisation.** A user should be able to record a thought without first choosing a module, category, or form.
2. **Propose, then commit.** Natural-language parsing may suggest changes; it never writes important data or changes the calendar without an explicit user action.
3. **Useful at low energy.** The app always offers a small next step, including a 10-minute study option, a one-tap expense log, or a deferrable reminder.
4. **Private by default.** The app is single-user, local-first, exportable, and transparent about every external connection.
5. **No shame mechanics.** Missed plans are neutral information. Recovery is easier than maintaining a streak.

### MVP is a coherent loop

The first release must make this full loop reliable: capture a message, review the proposed records, approve or correct them, see the resulting priorities, then plan or complete a study session. Finance logging and calendar proposals are included only where they reinforce this loop.

| In MVP | Deferred until post-MVP |
| --- | --- |
| Typed Inbox, structured proposal cards, approve/edit/reject, undo | Voice capture and local speech-to-text |
| Modules, assignments, exams, topics, study timer | Telegram capture |
| Three-priority dashboard and weekly review | Adaptive scheduling based on health correlations |
| Expense quick log, transaction history, monthly category totals | Savings goals, recurring-expense automation, safe-to-spend calculation |
| Google Calendar connection and previewed Aniro-created study events | Reading or modifying non-Aniro events beyond availability |
| Local/offline draft capture, export, audit log | Advanced natural-language model parsing or cloud AI |

### Explicit MVP exclusions

- No automatic background extraction from messages. Parsing starts only after the user taps **Review updates**.
- No push notifications until the user has configured at least one reminder preference.
- No medical or financial recommendations, predictions, diagnoses, or causal claims.
- No account sharing, social feed, productivity leaderboard, or public profile.

## 16. Primary screens and requirements

### 16.1 Today dashboard

The default screen answers only: **What matters now? What is next? What can I record?**

Required order: next commitment, up to three priorities, one recommended study action, quick capture, then optional spending/health context. Do not show charts, long task lists, or every module above the fold.

Acceptance criteria:

- The page remains understandable with no logged data.
- A low-energy mode shows only next commitment, one priority, quick capture, and one small study action.
- Each priority has a visible reason, such as a deadline, calendar block, or user pin.

### 16.2 Inbox review

Each proposal card must show its source phrase, record type, proposed value, confidence, and destination. Group proposed changes from one message into a single review session, but let the user approve, edit, or reject every item independently.

Acceptance criteria:

- No proposal is persisted until the user approves it.
- Editing an amount, date, module, or category updates the preview before it is saved.
- Undo is available after any approved save and restores the prior state.
- Ambiguous dates and unmatched module names require clarification rather than guessing.

### 16.3 Academic workspace

Assignments and exams use clear statuses: `not started`, `in progress`, `submitted`, `completed`, and `archived`. Risk is presented as **needs attention**, **watch**, or **on track** with an explanation based on deadline, remaining effort, and available planned time.

Acceptance criteria:

- A user can create an assignment in under 30 seconds.
- A module can be linked to topics, deadlines, study sessions, and review items.
- A missed study block offers reschedule, shorten, skip, or revise workload. It never silently moves an event.

### 16.4 Calendar proposal flow

Calendar is an opt-in connection. Before any change, show date, duration, calendar, title, and edit/delete impact. Aniro may only modify events it created and must preserve its stored external-event ID.

Acceptance criteria:

- A cancelled approval creates no calendar event.
- Re-running a proposal does not create a duplicate event.
- Disconnecting Google removes future sync ability without deleting local records.

## 17. Information architecture and visual direction

Use the AniroLogy design system: paper canvas `#F7F8EE`, clean surface `#FEFFF8`, ink `#151614`, soft ink `#596056`, structural line `#B8BDB1`, and a single action accent, Aniro lime `#C8F74A`.

- Mobile-first, calm editorial layout with Space Grotesk display text, DM Sans body text, and JetBrains Mono only for dates, metrics, and metadata.
- Avoid a dense dashboard aesthetic. Prefer plain grouped surfaces, clear dividers, and progressive disclosure over cards everywhere.
- Lime means action or selected state, not severity. Errors use explicit labels and accessible non-colour indicators.
- Minimum 44px touch targets, 16px body text, reduced-motion support, and no horizontal overflow.
- Never use guilt-oriented streaks, red alarm dashboards, or celebratory gamification that distracts from the next useful action.

## 18. Data, sync, and resilience requirements

- Inbox messages and proposals are saved as drafts locally before network activity.
- Every mutation records `created_at`, `updated_at`, source, and an undo reference in the audit log.
- All records are exportable as JSON; transactions, sessions, assignments, and habits are also exportable as CSV.
- OAuth credentials and refresh tokens are stored only server-side or in protected storage; they must never appear in logs, exports, or client error reports.
- The app must show a clear offline state. Capture, draft review, and viewing previously synced data must continue offline; calendar sync is queued until connection resumes.
- The product must provide a recoverable account/data reset path and individual-record deletion.

## 19. Release checks

Before MVP release, validate with the primary user over at least two weeks:

- At least five real messages can be captured, reviewed, and corrected without data loss.
- A study block can be proposed, approved, synced, updated, and removed without duplicates.
- A user can recover from an incorrect date, wrong amount, or incorrect module through the UI without developer help.
- The dashboard remains useful on a day with no planned work and on a day with multiple deadlines.
- Exported JSON can restore a clean local test profile.
- Core capture and review screens work on a narrow mobile viewport with keyboard open.

## 20. Delivery order

1. **Foundation:** schema, local storage, backup/export, audit log, mobile shell, and accessibility baseline.
2. **Academic loop:** modules, deadlines, study timer, Today dashboard, and manual priority selection.
3. **Inbox loop:** typed capture, deterministic proposal rules, review/edit/approve/reject, and undo.
4. **Calendar:** OAuth, event-preview flow, idempotent Aniro-event sync, and disconnect.
5. **Review and finance:** weekly review, quick expense capture, monthly totals, and resilient offline drafts.
6. **Post-MVP learning:** only after consistent use, evaluate voice, richer planning, health/habit insights, and local AI parsing.
