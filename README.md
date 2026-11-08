# Dayspring

A personal React learning dashboard that lets you structure your studies around custom learning paths and goals, with progress tracking. The built-in AI tutor is designed to assist with explanations and next steps, suggesting resources, checkpoints, and gentle course adjustments based on how you're progressing.

## What's in it

- **Custom learning paths**: build and edit your own courses, then pick up where you left off
- **Goals & milestones**: set measurable targets with due dates and track them over time
- **Progress tracking**: an activity heatmap, a skill graph and quick stats on your dashboard
- **AI tutor** *(early)*: explanations, next steps, suggested resources and checkpoints, and gentle course adjustments as you go

## Stack

React, TypeScript, Vite, Tailwind, shadcn/ui and Supabase (auth + Postgres).

## Getting started

1. Create a Supabase project and apply the migrations in `supabase/migrations`.
2. Copy `.env.example` to `.env` and fill in your Supabase project's values.
3. Install and run:
   ```
   npm install
   npm run dev
   ```

## License

[MIT](LICENSE)
