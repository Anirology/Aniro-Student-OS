# Aniro

Aniro is a single-user student life assistant with a Node.js backend, SQLite database, password login, and installable web interface.

## What works

- Typed daily capture with editable proposals for expenses, study sessions, assignments, and sleep before saving. Local rules understand named dates and multiple exams in one note; optional AI review can handle more varied wording.
- Modules, deadlines, study strategies, a focus timer, and editable planned sessions.
- Month calendar showing deadlines and study plans.
- Spending and budget overview; wellbeing notes, one-tap habit check-ins, and a 13-week GitHub-style activity map.
- Password login, account settings, password change, and sign out.
- Local insights, low-energy mode, undo, JSON backup/restore, CSV export, and offline asset caching.
- Calendar file (`.ics`) export. Optional Google Calendar event sync can create, update, and remove only Aniro-created events after an explicit preview.

## Run locally

Requires Node.js 24 or newer. From this directory, run `npm start` and open `http://127.0.0.1:4174`. The first visit creates the one allowed account. Choose a username and a password of at least 12 characters. Later visits require login.

The database is created at `data/aniro.sqlite`. This directory is excluded from Git. Back it up or use Settings → Export JSON. Clearing browser data does not remove server records.

## Habits and popups

Add a habit directly from Today or Wellbeing: type its name into **Add a habit** and submit. Select **Mark today** to check in; select **Done** to undo it. In Wellbeing, the **Activity map** shows 13 weeks for the selected habit. Select a square to add or undo a past check-in. The summary shows days checked in over the last week and, when applicable, the current run. Empty days carry no penalty.

Popups are for editing details and confirming sensitive actions. Edit fields and choose **Save changes** to apply them; **Cancel**, **×**, or **Esc** closes without saving. Deletion has a separate confirmation, and the latest saved change can be undone. Adding a habit no longer requires a popup.

## Optional AI review

No key is needed for **Review locally**. For **Review with AI**, create a Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey), copy `.env.example` to `.env.local`, replace the example value with your key, and restart the server. `.env.local` is excluded from Git, and the key is used only by the backend. Alternatively set `GEMINI_API_KEY` as a server environment variable. Never paste the key into the app, chat, or a public repository.

AI review sends only the note you submit to Google Gemini. Google currently offers a limited free tier for Gemini 2.5 Flash; limits and terms may change, and free-tier content may be used to improve Google's products. Check [current pricing](https://ai.google.dev/gemini-api/docs/pricing) before enabling billing. Aniro never saves AI suggestions automatically: edit, uncheck, or cancel them first.

If the backend cannot reach Google, Aniro now shows local suggestions automatically with an explanation. A configured key does not guarantee network access: outbound HTTPS to `generativelanguage.googleapis.com` must work from the server. The local parser remains usable without it.

## Google Calendar setup

Create a Google OAuth **Web application** client and add the app's origin to Authorized JavaScript origins. Paste its client ID into Aniro's Settings and select **Connect Google Calendar**. Aniro requests the `calendar.events` scope when you connect. Access tokens remain in browser memory for the current page session. The client ID is saved in your SQLite account data. Calendar sync needs an internet connection and will not run automatically in the background.

## Data and current limits

Records are stored in SQLite on this computer and require password login. The app currently runs locally and has no cloud deployment or password-recovery email. Browser caching preserves the interface, but server-backed record changes require the server to be reachable. Both local and AI extraction can miss or misread details; always check proposals. Google Calendar connection depends on a client ID owned and configured by the user.
