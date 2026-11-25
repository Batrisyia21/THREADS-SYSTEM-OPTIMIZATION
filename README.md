# Threads+ Interactive Prototype

Clickable UI/UX prototype for **Threads+**, a modular upgrade to Meta's Threads platform.
Built for **BIT3134 System Analysis & Design**, Group 2, Malaysia University of Science and Technology.

**Live demo:** https://batrisyia21.github.io/THREADS-SYSTEM-OPTIMIZATION/

## What it shows

The prototype follows the 10 screens designed in Section 4.1 of our report:

| # | Screen | Requirement |
|---|--------|-------------|
| 1 | Sign-in | FR-08 |
| 2 | Create post | FR-09 |
| 3 | Multi-tab category feed | FR-01 |
| 4 | Block, Quiet and Question controls | FR-02 |
| 5 | Advanced history search | FR-03 |
| 6 | Notification centre | FR-04 |
| 7 | Privacy Dashboard | FR-07 |
| 8 | Report a post | FR-05 |
| 9 | Moderator queue and review | FR-05, 06, 10, 11 |
| 10 | Administrator panel | FR-12, 13 |

It includes the input validation, confirmation dialogs and error states from Table 4.2 of the report.

## How to use

- Use the **Demo controls** sidebar to jump to any screen.
- Use the **Left/Right arrow keys** to move between screens.
- Click **Reset Demo** to restore all sample data.
- Turn on **Annotations** to show the numbered callouts from the report.

## Run locally

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install --legacy-peer-deps
npm run dev
```

Then open http://localhost:3000.

To create a production build:

```bash
npm run build
```

## Tech stack

React, TypeScript, Vite, Tailwind CSS, Lucide icons and Motion (animations). Deployed to GitHub Pages with GitHub Actions.

## Notes

- This is a design prototype only. All data is sample data held in memory, and nothing is saved or sent anywhere.
- It is not affiliated with or endorsed by Meta. Threads and Instagram are trademarks of Meta Platforms, Inc.

## Team (Group 2)

- Nur Batrisyia binti Zool Hilmi (B24090012)
- Aina Safirah binti Saifuddin (B24090022)
- Sharon Yeo (B24090127)
- Anis Akma Sofea binti Azman (B24090015)

Lecturer: Mohd Arif Fahmi bin Bidin
