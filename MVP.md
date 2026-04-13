# Rigour AI — MVP Product Documentation

> An AI-powered learning accountability platform for software engineers leveling up for the job market.

---

## Stack Decision (Why This, Not Something Else)

For the Bangladesh 60k+ BDT market, the most in-demand full-stack combination right now is:

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | Required at most BD companies paying 60k+, SSR knowledge is a differentiator |
| Backend | Node.js + Express + TypeScript | Simpler than NestJS for learning, still directly transferable, shows Node fundamentals clearly |
| ORM | Prisma | Industry standard with Node, easier than raw SQL for moving fast, good for portfolio |
| Database | PostgreSQL | Every serious company uses it, Supabase makes it free to host |
| Auth | Clerk | Free tier, 2 hours to integrate vs 2 days of rolling your own JWT |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) | More reliable for structured output than GPT for this use case |
| Email | Resend + React Email | Best DX, free tier covers you |
| UI | shadcn/ui + Tailwind CSS | Fast to build, looks professional, what most companies use now |
| Hosting | Vercel (frontend) + Railway (backend + DB) | Both free tiers, both show up well on a resume |

**Do not use:** NestJS (too much to learn in a month on top of everything else), MongoDB (for this use case relational data is cleaner), Next.js API routes only (hides your Node.js skills — recruiters won't see it).

---

## What This Product Is

Rigour AI is a structured learning platform where an AI acts as your instructor. Unlike ChatGPT or Claude.ai:

- You do not write prompts — the platform handles that
- The AI assigns you tasks with deadlines and locked rubrics
- You submit real artifacts (code, written answers, designs)
- The AI reviews against the rubric, not vibes
- If you miss a deadline, something actually happens

**Target user for MVP:** A software engineer in Bangladesh who knows they need to upskill (Node.js, system design, DSA, behavioral interviews) to get a better job, but struggles with consistency and knowing what to study.

---

## MVP Scope

### In (Must Ship)

- [ ] User auth (sign up / log in)
- [ ] Onboarding intake form (target role, current skills, deadline, hours/week)
- [ ] AI-generated 4-week curriculum locked on creation
- [ ] One active task at a time with deadline visible
- [ ] Task submission panel (text + code paste)
- [ ] AI review with rubric score (pass/fail + written feedback)
- [ ] Hard lock: cannot access next task until current task is submitted
- [ ] Miss deadline → accountability email auto-sent to a contact you set at onboarding
- [ ] Dashboard: progress bar, completed tasks, current streak
- [ ] One project per user (no multi-project in MVP)

### Out (Do Not Build Yet)

- Financial penalties (Beeminder integration)
- Multiple projects per user
- Video/audio submission
- Job board scraping / JD gap analysis
- Side chat feature
- Mobile responsiveness (desktop only for MVP)
- Team/cohort features
- Notifications beyond email

---

## Architecture

```
┌─────────────────────────────────────┐
│            Next.js Frontend          │
│     (App Router, TypeScript, shadcn) │
└──────────────┬──────────────────────┘
               │ HTTP (REST)
┌──────────────▼──────────────────────┐
│        Node.js + Express API         │
│           (TypeScript)               │
│                                      │
│  Routes:                             │
│  /api/auth      → Clerk webhooks     │
│  /api/intake    → Onboarding         │
│  /api/curriculum→ AI generation      │
│  /api/tasks     → Task management    │
│  /api/submit    → Submission review  │
│  /api/email     → Resend triggers    │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│  PostgreSQL  │  │ Claude API   │
│  (Supabase)  │  │ (Anthropic)  │
│   + Prisma   │  └─────────────┘
└─────────────┘
```

---

## Database Schema

```prisma
// schema.prisma

model User {
  id                String    @id @default(cuid())
  clerkId           String    @unique
  email             String    @unique
  name              String
  accountabilityEmail String
  createdAt         DateTime  @default(now())
  intake            Intake?
  curriculum        Curriculum?
  tasks             Task[]
}

model Intake {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  targetRole      String   // "Senior Frontend", "Full Stack Node", etc.
  currentSkills   String[] // array of skill strings
  targetSkills    String[] // what they want to learn
  hoursPerWeek    Int
  deadlineDate    DateTime // hard deadline they commit to
  createdAt       DateTime @default(now())
}

model Curriculum {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  weeks     Json     // AI-generated week-by-week plan stored as JSON
  lockedAt  DateTime @default(now()) // cannot be edited after creation
}

model Task {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  weekNumber  Int
  title       String
  description String      // full task brief shown to user
  rubric      String      // locked rubric shown upfront, used for review
  type        TaskType    // CODE | WRITTEN | DESIGN
  dueAt       DateTime
  status      TaskStatus  @default(PENDING)
  submission  Submission?
  createdAt   DateTime    @default(now())
}

model Submission {
  id         String   @id @default(cuid())
  taskId     String   @unique
  task       Task     @relation(fields: [taskId], references: [id])
  content    String   // pasted code or written answer
  score      Int?     // 0-100 from AI review
  passed     Boolean?
  feedback   String?  // AI written feedback
  submittedAt DateTime @default(now())
  reviewedAt  DateTime?
}

enum TaskType {
  CODE
  WRITTEN
  DESIGN
}

enum TaskStatus {
  PENDING
  SUBMITTED
  PASSED
  FAILED
  OVERDUE
}
```

---

## API Endpoints

### Auth
Handled by Clerk. One webhook endpoint to sync user to your DB on sign-up.

```
POST /api/webhooks/clerk
```

### Intake
```
POST /api/intake          — Save intake form, trigger curriculum generation
GET  /api/intake          — Get current user's intake
```

### Curriculum
```
GET  /api/curriculum      — Get the locked curriculum
```

Curriculum generation happens server-side when intake is submitted. You call Claude API with the intake data and store the structured response. It is never regenerated unless the user explicitly restarts (which resets all progress).

### Tasks
```
GET  /api/tasks           — Get all tasks for user
GET  /api/tasks/current   — Get the active (current unlocked) task
POST /api/tasks/generate  — Internal: called after curriculum is created to seed week 1 tasks
```

### Submissions
```
POST /api/submissions          — Submit artifact for current task
GET  /api/submissions/:taskId  — Get submission + review for a task
```

When a submission is posted:
1. Save content to DB
2. Call Claude API with task description + rubric + submission content
3. Parse structured response (score, passed, feedback)
4. Update task status
5. If passed, unlock next task
6. If this was the last task of the week, generate next week's tasks

### Email
```
POST /api/email/overdue   — Called by a cron job (Railway cron) daily to check overdue tasks
```

---

## Claude API Prompt Design

### Curriculum Generation Prompt

```
You are a senior software engineering hiring manager. 
A developer has given you their profile. Generate a 4-week study curriculum.

Profile:
- Target Role: {targetRole}
- Current Skills: {currentSkills}
- Wants to Learn: {targetSkills}
- Hours per week available: {hoursPerWeek}
- Hard deadline: {deadlineDate}

Return ONLY valid JSON in this exact shape:
{
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "string",
      "goal": "string",
      "tasks": [
        {
          "title": "string",
          "description": "string — full brief, 2-3 paragraphs",
          "type": "CODE | WRITTEN | DESIGN",
          "rubric": "string — specific pass/fail criteria, bullet points",
          "estimatedHours": number
        }
      ]
    }
  ]
}

Rules:
- Max 3 tasks per week
- Each task must be completable in the estimated hours
- Rubric must be specific enough that pass/fail is unambiguous
- Do not pad with generic advice
```

### Submission Review Prompt

```
You are a strict but fair senior engineer reviewing a submission.

Task: {task.title}
Task Brief: {task.description}
Rubric: {task.rubric}

Submission:
{submission.content}

Return ONLY valid JSON:
{
  "score": number between 0 and 100,
  "passed": boolean,
  "feedback": "string — 2-3 paragraphs. Lead with what they got right, then what is missing or wrong, then one specific thing to improve. Do not be encouraging for the sake of it."
}

Passing threshold: 70. Be honest. A mediocre submission that technically meets rubric points should pass. A good-looking submission that misses rubric points should fail.
```

---

## UI Pages

```
/                     Landing page (simple, explains what it is, CTA to sign up)
/sign-up              Clerk auth
/sign-in              Clerk auth
/onboarding           Intake form (multi-step, wizard style)
/dashboard            Main view after onboarding
/task/:id             Active task view + submission panel
/task/:id/review      Submission feedback view
/progress             Full curriculum view with completed/locked tasks
```

### Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  Rigour AI         [Progress ██████░░░░ 60%]  [User] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  CURRENT TASK                           DUE: 3 days  │
│  ┌─────────────────────────────────────────────────┐│
│  │ Week 2 · Task 1: Build a REST API with Express  ││
│  │                                                  ││
│  │ [View Task & Submit]                             ││
│  └─────────────────────────────────────────────────┘│
│                                                      │
│  THIS WEEK         STREAK       DEADLINE             │
│  2/3 tasks done    4 days       Apr 30, 2026         │
│                                                      │
│  COMPLETED TASKS                                     │
│  ✓ Week 1 · Task 1   ✓ Week 1 · Task 2              │
│  ✓ Week 1 · Task 3   ✓ Week 2 · Task 1 (in review)  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Task View

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Dashboard                  DUE: 3 days   │
├─────────────────────────────────────────────────────┤
│  Build a REST API with Express                       │
│  Week 2 · Task 1 · CODE                             │
│                                                      │
│  BRIEF                                               │
│  Build a simple REST API using Node.js and Express   │
│  that handles CRUD for a "posts" resource...         │
│                                                      │
│  RUBRIC (this is what you will be graded on)         │
│  • GET /posts returns array of posts                 │
│  • POST /posts creates a post with validation        │
│  • PUT /posts/:id updates correctly                  │
│  • DELETE /posts/:id returns 204                     │
│  • Input validation returns proper 400 errors        │
│                                                      │
│  YOUR SUBMISSION                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ Paste your code or explanation here...           ││
│  │                                                  ││
│  │                                                  ││
│  └─────────────────────────────────────────────────┘│
│  [Submit for Review]                                 │
└─────────────────────────────────────────────────────┘
```

---

## Week-by-Week Build Plan

**Constraint: You are learning Node.js while building. Budget time accordingly.**

### Week 1 — Foundation (Days 1–7)

| Day | Task |
|---|---|
| 1 | Project setup: monorepo with `/frontend` (Next.js) and `/backend` (Express). TypeScript in both. Prettier + ESLint configured. |
| 2 | Prisma setup + PostgreSQL on Supabase. Write schema, run first migration. Seed script. |
| 3 | Clerk auth integration in Next.js. Webhook endpoint in Express to sync user on sign-up. |
| 4 | Intake form UI (multi-step with react-hook-form + zod). POST /api/intake endpoint. |
| 5 | Claude API integration. Curriculum generation endpoint. Test prompt, iterate until output is reliable. |
| 6 | Curriculum storage + locked display on /progress page. |
| 7 | Task seeding from curriculum JSON. GET /api/tasks/current logic. |

### Week 2 — Core Loop (Days 8–14)

| Day | Task |
|---|---|
| 8 | Dashboard UI. Progress bar, streak counter, current task card. |
| 9 | Task view page. Brief + rubric display. |
| 10 | Submission panel UI. Text/code input, submit button. |
| 11 | Submission review endpoint. Claude API call for grading. Parse and store result. |
| 12 | Review result page. Score, pass/fail, feedback display. Unlock next task on pass. |
| 13 | Hard lock logic: if task is PENDING and not current, show locked state. If overdue, mark OVERDUE. |
| 14 | Buffer day / fix what broke in Week 1-2. |

### Week 3 — Accountability & Polish (Days 15–21)

| Day | Task |
|---|---|
| 15 | Resend email integration. Overdue email template (React Email). |
| 16 | Daily cron job on Railway that checks for overdue tasks and triggers emails. |
| 17 | Landing page. Simple, explains the product, CTA. |
| 18 | Progress page. Full curriculum tree showing locked/completed/active tasks. |
| 19 | Error handling across all endpoints. Loading states in UI. |
| 20 | Environment config cleanup. README with setup instructions. |
| 21 | Buffer day. |

### Week 4 — Deployment & Demo (Days 22–28)

| Day | Task |
|---|---|
| 22 | Deploy backend to Railway. Environment variables. Test in prod. |
| 23 | Deploy frontend to Vercel. Connect to prod backend. |
| 24 | End-to-end test: sign up → intake → curriculum → task → submit → review → email. |
| 25 | Fix prod bugs. |
| 26 | Record a demo video (3-5 min Loom). This goes in your portfolio. |
| 27 | Write LinkedIn post about what you built and what you learned. |
| 28 | Apply to jobs. |

---

## Portfolio Talking Points

When a recruiter or interviewer asks about this project, you have answers for:

**"What did you build?"**
A full-stack AI-powered learning platform with structured task assignment, AI-graded submissions, and a deadline enforcement system.

**"What's the stack?"**
Next.js 14 with App Router, Node.js + Express backend (TypeScript throughout), PostgreSQL with Prisma, Clerk for auth, Claude API for AI features, deployed on Vercel + Railway.

**"What was hard?"**
Designing prompts for the Claude API that return consistent, parseable JSON for curriculum generation and submission grading. Handling edge cases where the AI output does not match the expected schema.

**"What would you improve?"**
Multi-project support, JD scraping to auto-generate gap analysis against real job postings, financial commitment stakes via Beeminder API.

**"Show me the code."**
Clean separation of frontend and backend. TypeScript strict mode. Prisma schema shows data modelling skills. Express middleware pattern shows understanding of Node.js fundamentals.

---

## Environment Variables

```env
# Backend (.env)
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
FRONTEND_URL=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Cost To Run This

| Service | Cost |
|---|---|
| Vercel | Free |
| Railway (backend + DB) | ~$5/month after free tier |
| Supabase (if used for DB) | Free |
| Clerk | Free up to 10,000 MAU |
| Resend | Free up to 3,000 emails/month |
| Anthropic API | ~$0.50–2 per user per curriculum generation + reviews |

**For personal use + portfolio demo: effectively free.**

---

## Definition of Done (MVP)

The MVP is done when you can do this end-to-end without touching the code:

1. Create an account
2. Fill in the intake form
3. See a 4-week curriculum generated for you
4. See your first task with a deadline and rubric
5. Paste a submission
6. Receive an AI-generated pass/fail with feedback
7. See the next task unlock
8. If you do nothing for 24 hours past a deadline, receive an email to your accountability contact

That is it. Ship that. Everything else is v2.
