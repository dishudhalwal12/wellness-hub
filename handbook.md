# 🩺 WellnessHub Handbook

## 1. Project Overview

**WellnessHub** is an AI-powered clinical operations platform built as a **copilot for doctors and clinic staff**. The goal of the app is to reduce administrative workload, improve documentation quality, and give the clinic a modern, polished workflow for patient management, telehealth, billing, and AI-assisted decision support.

This project is not just a simple dashboard. It combines a modern Next.js frontend with Firebase services and Gemini-powered AI flows to simulate a production-style healthcare SaaS experience.

### What the app tries to solve
- Reduce manual work for doctors and reception staff
- Speed up note writing and billing support
- Organize patient workflows and clinic queues
- Support telehealth interactions with AI-generated summaries
- Keep the app visually premium and presentation-ready

---

## 2. Front-End Tech Stack

The frontend is built with a modern TypeScript-first React stack:

- **Next.js** with the **App Router**
- **React** for UI composition and client interactions
- **TypeScript** for type safety and maintainability
- **Tailwind CSS** for utility-based styling
- **Shadcn UI** for reusable component primitives
- **Lucide React** for icons
- **Recharts** for dashboard-style charts and metrics
- **Framer Motion** and **tailwindcss-animate** for subtle motion and transitions
- **React Hook Form** and **Zod** for form handling and validation
- **React Markdown** for rendering AI-generated markdown responses

### Front-end design style
The UI is intentionally designed to feel:
- clean
- premium
- clinical but human
- modern and trustable

The handbook and UI both emphasize a glassmorphism-inspired visual language, soft shadows, clear spacing, and friendly copy instead of harsh system-style error messages.

---

## 3. Backend and Platform Services

Even though this is a frontend-heavy TypeScript project, the app depends on several backend/platform services:

- **Firebase Authentication** for login and user identity
- **Firestore** for structured clinic data
- **Firebase Storage** for uploaded files and clinical documents
- **Google Gemini / Genkit** for AI assistance and clinical drafting
- **Jitsi Meet** for telehealth video workflows

In practice, the app behaves like a SaaS platform where the UI orchestrates AI and data services rather than acting as a static website.

---

## 4. Repository Structure

Important folders and what they are used for:

- `src/app` — main Next.js application routes, pages, layouts, and feature screens
- `src/ai` — AI flows, prompts, and action logic
- `src/firebase` — Firebase setup and data access hooks
- `src/components` — shared reusable UI components
- `src/hooks` — custom React hooks
- `src/lib` — utility helpers and demo data
- `public` — static assets
- `docs` — product and implementation notes
- `scripts` — helper scripts

The app uses route groups such as `(protected)` to separate authenticated application areas from the login entry flow.

---

## 5. How the App Works

### Authentication and access
Users sign in through Firebase Authentication. After login, the protected app routes load patient, billing, telehealth, notes, and reception workflows.

### Data flow
1. The user opens a feature page.
2. The page loads demo data and/or Firestore data.
3. If the feature includes AI, the page triggers an AI action or flow.
4. The result is shown in a structured UI card, panel, or chat-like layout.
5. In some areas, the result can be incorporated into the underlying record.

### Why demo data matters
The project is designed to avoid empty screens. Demo records are used to make the platform look and feel active even when the database is not fully populated. This helps with demos, class presentations, and stakeholder walkthroughs.

---

## 6. Main Features and How They Work

### 6.1 AI Diagnostic Copilot (`/patients`)
This feature accepts a patient lab report or text input and uses AI to:
- summarize findings
- highlight abnormal values
- suggest possible diagnoses
- recommend follow-up ideas

This is one of the core AI workflows in the app and is intended to assist doctors during interpretation of reports.

### 6.2 AI Reception Assistant (`/reception`)
This is a front-desk workflow assistant that behaves like a smart clinic queue manager.
It can help with tasks such as:
- prioritizing urgent walk-ins
- creating callbacks
- organizing queue items
- updating clinic workflow data

This feature is closely tied to Firestore, which means it does more than only generate text — it can update the operational queue.

### 6.3 AI Smart Notes (`/notes`)
This feature is built to reduce the burden of SOAP note drafting.
It typically:
- accepts subjective and objective input
- drafts assessment and plan content
- allows the doctor to incorporate AI suggestions into the final note

This makes the documentation process faster while still keeping the clinician in control.

### 6.4 AI Smart Billing (`/billing`)
This module supports revenue-cycle workflow by analyzing visit notes and suggesting:
- ICD-10 codes
- CPT codes
- confidence scores
- rationale for each suggestion

The rationale is important because it lets the user audit the AI’s recommendation instead of blindly accepting it.

### 6.5 Telehealth & AI Note Taker (`/telehealth`)
This is one of the most advanced parts of the app.
It supports:
- video consultation workflows
- pre-visit checklist style preparation
- document sharing
- microphone-based transcription
- AI-generated visit summaries and note drafts

The page is built as a client component and combines UI state, document handling, and AI-assisted note creation.

### 6.6 Medication Adherence (`/medications`)
This feature is browser-local and reminder-based.
It works as a medication adherence helper by:
- tracking scheduled doses locally
- triggering reminders
- playing alarms
- showing toast notifications

It is useful as a lightweight patient adherence demo without requiring heavy backend integration.

---

## 7. Telehealth Page Example Workflow

The telehealth page is a strong example of the project’s product thinking.

Typical flow:
1. The doctor opens a scheduled visit.
2. The page shows summary metrics such as visit type, prep status, and shared files.
3. The doctor joins or reviews the telehealth session.
4. If permissions are enabled, audio can be captured and transcribed.
5. The AI produces a note draft or summary from the visit context.
6. The final output can be copied, reviewed, or used in documentation.

This is a good example of how the app blends clinical UI, AI, and operational workflows.

---

## 8. AI and Environment Setup

To use the Gemini-powered features, the app needs environment configuration.

### Typical required variables
- `GOOGLE_API_KEY`
- `GENAI_MODEL=gemini-2.0-flash`

### Important note
If the API key is missing, AI-powered pages may still load, but the intelligent parts will not work correctly. Some features can still be demonstrated using demo content, but the real clinical AI workflow depends on the configured model key.

---

## 9. Visual and UX Principles

The project follows a consistent product tone:

- premium, not plain
- polished, not rough
- clinically professional, not robotic
- helpful, not overly technical

Design cues include:
- glassmorphism cards
- smooth spacing and layout rhythm
- animated transitions
- soft color gradients
- human-friendly microcopy

The app avoids intimidating wording and tries to sound like a real healthcare assistant.

---

## 10. What Makes This Project Stand Out

WellnessHub stands out because it combines:
- a modern frontend stack
- real authentication and data services
- AI-driven clinical workflows
- telehealth support
- billing intelligence
- demonstration-ready UX

For a presentation or professor walkthrough, the key idea is:

> This project is a clinical operations copilot that helps a clinic manage patients, notes, billing, and telehealth using a modern Next.js frontend integrated with Firebase and Gemini AI.

---

## 11. Good Summary for Presentation

If you need a short explanation to say aloud:

**WellnessHub is an AI-powered clinical platform built with Next.js, TypeScript, Tailwind CSS, Shadcn UI, Firebase, and Google Gemini. It helps doctors and clinic staff manage patient workflows, generate smart notes, assist with billing, support telehealth, and automate routine front-desk tasks. The app is designed to feel production-ready, visually premium, and clinically useful.**

---

## 12. Final Notes

This project is best understood as a **clinical SaaS prototype with production-style polish**. It is especially strong as a demo because it combines:
- business workflow thinking
- AI features
- data-driven UI
- real-world healthcare use cases

If someone reads this handbook, they should be able to explain both the **technical stack** and the **product story** of WellnessHub clearly.
