<div align="center">

# DevMock

### AI-Powered Job Interview Practice Platform

*Practice smarter. Interview with confidence. Get hired faster.*

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

> **Final Year Capstone Project** — Full-Stack Web Application

</div>

---

## What is DevMock?

DevMock is a full-stack web application that simulates real-world technical and behavioural job interviews using a **live AI Voice Agent**. Instead of passively reading interview questions, users engage in a real-time spoken conversation with an AI interviewer, then receive an instant, deeply detailed performance report  turning abstract preparation into measurable, actionable improvement.

It bridges the gap between *knowing* the answers and *delivering* them confidently under pressure.

---

## Table of Contents

- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Future Roadmap](#future-roadmap)

---

## Key Features

### 🎙️ Real-Time AI Voice Interviews
Integrates the **Vapi SDK** to power a live, conversational AI interviewer. Users speak their answers aloud, creating a psychologically realistic interview simulation that text-based platforms cannot replicate.

### 🧠 Granular AI Feedback
After each session, the complete interview transcript is sent to **Google Gemini 2.5 Flash**, which grades the candidate across five professional dimensions:

| Metric | What is Evaluated |
|---|---|
| Communication Skills | Clarity, conciseness, and articulation |
| Technical Knowledge | Accuracy and depth of domain expertise |
| Problem-Solving | Logical reasoning and structured thinking |
| Cultural & Role Fit | Alignment with typical company values |
| Confidence & Clarity | Decisiveness and composure under pressure |

### ⚙️ Customisable Interviews
Users specify their target **job role**, **experience level**, and **technology stack** and the platform generates a tailored interview on demand, rather than serving a one-size-fits-all question bank.

### 🔐 Secure Profile Management
Inline profile editing with direct-to-cloud file uploads via Firebase Cloud Storage. Profile pictures are streamed directly to the bucket from the client only the resulting secure URL is written to Firestore, keeping database documents lean.

---

## Technical Architecture

This application was engineered with a focus on data privacy, framework-native performance patterns, and clear separation of concerns.

### Strict Data Segregation
The Firestore database separates global `interviews` (reusable templates that any user can access) from user-specific `feedbacks` (private scoring records). This design allows the community to share and re-take the same interview templates while guaranteeing that no user can ever read another user's performance scores.

### Server-Side Session Management
Authentication moves beyond standard client-side JWT tokens. Upon login, the **Firebase Admin SDK** (running exclusively on the server) mints an HTTP-only cookie containing a verified session token. This cookie cannot be read or manipulated by any JavaScript running in the browser, providing a significantly stronger security posture for protected Next.js routes.

### Aggressive Cache Invalidation
All database mutations submitting feedback, updating a profile, or generating a new interview are handled through **Next.js Server Actions**. Each action calls `revalidatePath` immediately after the Firestore write, which purges the relevant cached page segment. The result is a UI that always reflects the latest database state without requiring client-side polling or manual refresh.

### Voice-to-Feedback Pipeline

```
User speaks → Vapi SDK captures audio → Transcription generated
    → Transcript sent to Gemini 2.5 Flash → Structured feedback JSON returned
    → Feedback written to Firestore → Results page revalidated and displayed
```

---

## Tech Stack

**Frontend**

| Technology | Role |
|---|---|
| Next.js 15 (App Router) | Framework, file-based routing, Server Components |
| React 19 | UI rendering |
| TypeScript | End-to-end type safety |
| Tailwind CSS | Utility-first styling |
| Shadcn UI + Lucide React | Component library and icon set |
| React Hook Form + Zod | Form state management and schema validation |

**Backend & Services**

| Technology | Role |
|---|---|
| Next.js Server Actions | Secure, server-side business logic without a separate API layer |
| Next.js API Routes (`/api`) | Dedicated endpoint for Vapi webhook callbacks |
| Firebase Client SDK | Browser-side authentication and Cloud Storage uploads |
| Firebase Admin SDK | Firestore database access and HTTP-only session cookie management |
| Vercel AI SDK (`@ai-sdk/google`) | Structured Gemini API integration |
| Vapi SDK | Real-time voice AI agent orchestration |

---

## Project Structure

The codebase strictly follows Next.js 15 App Router conventions for optimal performance, co-location, and clarity.

```
ai_voice/
│
├── app/                            # File-based routing (Next.js App Router)
│   ├── (auth)/                     # Route group: public auth pages
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── layout.tsx              # Shared layout for auth pages
│   │
│   ├── (root)/                     # Route group: protected application pages
│   │   ├── interview/
│   │   │   └── [id]/               # Dynamic route per interview
│   │   │       ├── page.tsx        # Live voice agent session page
│   │   │       └── feedback/
│   │   │           └── page.tsx    # Post-interview feedback results page
│   │   ├── profile/
│   │   │   └── page.tsx            # User profile management page
│   │   ├── layout.tsx              # Protected layout (session guard)
│   │   └── page.tsx                # Dashboard / home page
│   │
│   ├── api/
│   │   └── vapi/generate/
│   │       └── route.ts            # API route: handles Vapi interview generation
│   │
│   ├── globals.css                 # Global Tailwind CSS imports
│   └── layout.tsx                  # Root layout (fonts, metadata)
│
├── components/                     # Reusable React components
│   ├── shared/                     # Global layout components
│   │   ├── Navbar.tsx
│   │   └── UserDropdown.tsx
│   ├── ui/                         # Primitive Shadcn UI components
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── sonner.tsx              # Toast notifications
│   ├── Agent.tsx                   # Core Vapi voice agent component
│   ├── AuthForm.tsx                # Sign-in / Sign-up form
│   ├── DisplayTechIcons.tsx        # Tech stack icon renderer
│   ├── FormField.tsx               # Reusable controlled form field
│   └── InterviewCard.tsx           # Interview summary card for dashboard
│
├── constants/
│   └── index.ts                    # App-wide constants (roles, tech options, etc.)
│
├── firebase/
│   ├── admin.ts                    # Server-side Firebase Admin SDK initialisation
│   └── client.ts                   # Browser-side Firebase Client SDK initialisation
│
├── lib/
│   ├── actions/
│   │   ├── auth.action.ts          # Server Actions: sign-in, sign-up, sign-out
│   │   └── general.action.ts       # Server Actions: interviews, feedback, profile
│   ├── utils.ts                    # Shared utility functions
│   └── vapi.sdk.ts                 # Vapi client initialisation and helper wrappers
│
├── public/                         # Static assets served at the root URL
│   ├── covers/                     # Company logo images used on interview cards
│   │   └── *.png                   # (adobe, amazon, facebook, spotify, etc.)
│   └── *.svg / *.png               # App icons, avatars, and decorative assets
│
├── types/
│   ├── index.d.ts                  # Global TypeScript interfaces (User, Interview, Feedback)
│   └── vapi.d.ts                   # Vapi SDK type extensions
│
├── .env.local                      # Secret environment variables (never committed)
├── .gitignore
├── next.config.ts                  # Next.js configuration
├── eslint.config.mjs               # ESLint rules
├── postcss.config.mjs              # PostCSS / Tailwind pipeline
├── tsconfig.json                   # TypeScript compiler configuration
└── package.json
```

---

## Prerequisites

Ensure all of the following are in place before running the project locally:

- **[Node.js](https://nodejs.org/) v18 or higher** verify with `node -v`
- A **[Firebase](https://firebase.google.com/) project** with the following services enabled:
  - Authentication (Email/Password provider)
  - Firestore Database
  - Cloud Storage
  - A **Service Account** with the JSON key downloaded (needed for the Admin SDK)
- A **[Google AI Studio](https://aistudio.google.com/)** account with a Gemini API key
- A **[Vapi](https://vapi.ai/)** account with a public API key

---

## Local Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/RAK-besay/DevMock.git>
cd ai_voice
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```bash
# Windows (PowerShell)
New-Item -Name ".env.local" -ItemType "file"

# macOS / Linux
touch .env.local
```

Populate it using the full reference in the [Environment Variables](#environment-variables) section below.

### 4. Run the Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Future Roadmap

If development were to continue beyond the Capstone requirements, the following features are prioritised:

**📊 Performance Analytics Dashboard**
Visual charts tracking a user's scores across multiple sessions over time, broken down by metric and technology category turning isolated interview results into a longitudinal improvement graph.

**🎭 Diverse Interviewer Personas**
Allow users to select an AI interviewer personality before starting. For example, a "Strict Technical Lead" who digs deep into implementation details, versus a "Friendly HR Manager" focused on culture fit and soft skills.

**👥 Peer-to-Peer Practice Mode**
Implement WebRTC to let two users interview each other using the platform's structured question sets, combining AI-generated content with the authentic pressure of a real human on the other side.

---

<div align="center">

Built with ❤️ as a Final Year Capstone Project

*Asia Pacific University*

</div>
