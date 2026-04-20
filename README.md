# Every.org Donations Dashboard Assessment

Internal dashboard and REST API for manually processing donations.


## Getting Started (Run locally)

Assumes you already have Node.js and npm installed.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script          | Purpose                  |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Production build         |
| `npm start`     | Run the production build |
| `npm run lint`  | ESLint                   |


## Overview

- Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui.
- In-memory store seeded from [`data/sample.json`](data/sample.json) — no database.
- REST API under `/api/donations` for ingesting donations and transitioning status.
- Dashboard at `/` to view donations, filter them, and move them through the
  `new -> pending -> success | failure` lifecycle.

