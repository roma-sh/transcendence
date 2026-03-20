# Frontend (Pong UI)

## Entry point and flow
- **HTML entry:** `frontend/pong.html`
  - Loads Tailwind output: `./styles/output.css`
  - Loads page switching rules: `./styles/switch-pages.css`
  - Boots the app via `./scripts/js/pong.js`
- **TypeScript entry:** `frontend/scripts/pong.ts`
  - Initializes global click delegation, wallet state, and user menu state.
  - Handles hash-based navigation and calls the page initializers.

## How to run (2 terminals)
1) Frontend Tailwind watcher:
```bash
cd frontend
./runme.sh
```
This installs the Tailwind CLI (if needed) and watches
`styles/input.css` -> `styles/output.css`.

2) Backend server (separate terminal):
```bash
cd backend
./runme.sh
```
This installs backend dependencies, compiles the frontend TypeScript (via the
shared `tsconfig.json`), and starts the server.

Then open `http://localhost:3000` (the backend serves `frontend/pong.html` as
the index).

## TypeScript structure
- **Source:** `frontend/scripts/*.ts`
- **Compiled output:** `frontend/scripts/js/*.js`
- **Config:** `frontend/scripts/tsconfig.json`

Important: imports inside `.ts` files use the `.js` extension (e.g.
`./welcome-page.js`) so that the browser can load the compiled JS modules
directly.

If you change TypeScript:
- Run `make` inside `frontend/` to compile (`tsc --project ./scripts/tsconfig.json`).

## Tailwind setup
- **Input:** `frontend/styles/input.css`
  - Defines theme variables and keyframes.
- **Output:** `frontend/styles/output.css` (generated, do not edit by hand)
- **Runner:** `frontend/runme.sh` (starts Tailwind CLI in watch mode)

## Page switching: `switch-pages.css`
The UI is a single HTML file with many `<section id="...">` pages.
`frontend/styles/switch-pages.css` uses `:target` to show only the current
section:
- All pages are hidden by default.
- The section whose `id` matches `location.hash` is displayed.

Navigation happens by setting `location.hash` in TypeScript.

## Click delegation system
All click behavior is centralized in `frontend/scripts/clicks-delegation.ts`:
- Each clickable element in `pong.html` has a `data-action="..."` attribute.
- `setupGlobalClicksDelegation()` maps action names to handler functions.
- A single document-level listener finds the nearest `[data-action]` and
  invokes the corresponding handler.

Benefits:
- No per-element `addEventListener` calls.
- Easy to add new buttons: add the `data-action` in HTML and the handler mapping
  in `clicks-delegation.ts`.

## Key frontend files
- `frontend/pong.html`: single HTML document for all pages/sections.
- `frontend/scripts/pong.ts`: app bootstrap + hash router.
- `frontend/scripts/clicks-delegation.ts`: global click dispatch table.
- `frontend/styles/input.css`: Tailwind theme + keyframes.
- `frontend/styles/switch-pages.css`: `:target`-based page display rules.
- `frontend/runme.sh`: Tailwind CLI install + watch build.
- `frontend/Makefile`: TypeScript compile shortcut (`make`).

## Adding a new page (quick checklist)
1) Add a `<section id="your-page-id">` to `frontend/pong.html`.
2) Add `#your-page-id` to `frontend/styles/switch-pages.css`.
3) Add a new initializer in TypeScript and update the hash switch in
   `frontend/scripts/pong.ts`.
4) If the page has buttons, add `data-action` attributes and wire them in
   `frontend/scripts/clicks-delegation.ts`.
