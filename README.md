# 🧠 EduBot — Intelligent AI Study Companion

> An intelligent, full-stack chatbot web application built for a **College AI Class Project**. Powered by **Anthropic Claude**, **Firebase Auth (Google Sign-In)**, and **Cloud Firestore**, with a bespoke **Academic Dark** UI/UX.

![EduBot Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Firestore Database Schema](#-firestore-database-schema)
5. [Firestore Security Rules](#-firestore-security-rules)
6. [Design System & Palette](#-design-system--palette)
7. [Environment Variables](#-environment-variables)
8. [Getting Started Locally](#-getting-started-locally)
9. [Deployment Guide](#-deployment-guide)
10. [Academic Integrity & Credits](#-academic-integrity--credits)

---

## 🎯 Project Overview

EduBot was engineered as an academic AI study companion tailored for computer science and engineering students. It assists with:
- **AI/ML Theoretical Concepts:** Neural networks, backpropagation, gradient descent, loss functions, Transformers, and optimization algorithms.
- **Code Debugging & Templates:** PyTorch, TensorFlow, Scikit-Learn, NumPy, and Python data pipelines.
- **Academic Capstone Ideas:** Guidance on semester project architectures, evaluation metrics, and dataset recommendations.
- **Persistent Contextual Memory:** Multi-turn conversational memory spanning multiple chat sessions saved to Cloud Firestore.

---

## ✨ Key Features

- 🔐 **Google OAuth Authentication:** One-click secure sign-in via Firebase Authentication.
- 🗂️ **Multi-Session Management:** Create, rename (double-click to edit), search, and delete individual chat sessions.
- ⚡ **Real-Time Streaming Responses:** Token-by-token streaming powered by Anthropic Claude Haiku (`claude-3-5-haiku` / SSE streaming).
- 💾 **Cloud Firestore Persistence:** Real-time listeners automatically synchronize chat history across devices.
- 🎨 **Academic Dark Design Language:** Tailored GitHub-inspired dark interface with vibrant indigo and purple accents.
- 📝 **Rich Markdown & Syntax Highlighting:** Full support for tables, lists, blockquotes, and syntax-highlighted code blocks with one-click copy buttons.
- 💡 **Instant Suggestion Chips:** Quick-start queries for core AI topics (Neural Networks, Python ML, Gradient Descent, Capstone Ideas).
- 📱 **Fully Responsive Layout:** Mobile-friendly drawer navigation and adaptive message container.
- 🛡️ **Offline & Demo Fallback Mode:** Built-in intelligent educational simulator for instant offline testing and live presentations.

---

## 🛠️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│  React 19 + Vite + Tailwind CSS + Lucide Icons + Hot Toast  │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     Google Auth & Firestore          Claude Streaming
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Firebase Platform       │ │       Anthropic API        │
│  - Firebase Auth (Google)    │ │  - Claude Haiku            │
│  - Cloud Firestore (Native)  │ │  - Multi-turn context      │
│  - Real-time WebSockets      │ │  - SSE Token Streaming     │
└──────────────────────────────┘ └────────────────────────────┘
```

- **Frontend Core:** React 19, Vite
- **Styling:** Tailwind CSS, PostCSS, Custom CSS Variables
- **Icons & UI:** Lucide React, React Hot Toast
- **Markdown & Code:** `react-markdown`, `remark-gfm`, `react-syntax-highlighter`
- **Backend & Database:** Firebase Modular SDK v10 (Auth + Firestore)
- **AI Engine:** Anthropic Claude API (`@anthropic-ai/sdk`)
- **Date Handling:** `date-fns`

---

## 🗄️ Firestore Database Schema

Firestore operates in **Native mode** with the following hierarchical data structure:

```
users/
 └── {userId}/
      ├── email: string
      ├── displayName: string
      ├── photoURL: string
      ├── createdAt: timestamp
      │
      └── sessions/
           └── {sessionId}/
                ├── title: string (auto-generated from first message, max 40 chars)
                ├── createdAt: timestamp
                ├── updatedAt: timestamp
                ├── messageCount: number
                │
                └── messages/
                     └── {messageId}/
                          ├── role: "user" | "assistant"
                          ├── content: string
                          ├── timestamp: timestamp
```

---

## 🔒 Firestore Security Rules

Deploy these rules in your **Firebase Console → Firestore Database → Rules** tab to ensure each student can strictly access only their own sessions and data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🎨 Design System & Palette

EduBot features the **Academic Dark** design specification:

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| `--bg-primary` | `#0D1117` | Deep ink black — main canvas |
| `--bg-secondary` | `#161B22` | Sidebar and card surfaces |
| `--bg-tertiary` | `#21262D` | Input fields, active chips, hover states |
| `--accent` | `#2F81F7` | GitHub Blue — primary actions & buttons |
| `--accent-secondary` | `#7C3AED` | Purple — AI response highlights & gradients |
| `--text-primary` | `#E6EDF3` | Near white — primary typography |
| `--text-secondary` | `#8B949E` | Muted slate — timestamps & metadata |
| `--border` | `#30363D` | Subtle dividers and outlines |
| `--success` | `#3FB950` | Operational status indicators |
| `--user-bubble` | `#1C2128` | User message background |
| `--bot-bubble` | `#0D1117` | Bot response background |

---

## 🔐 Environment Variables

Create a `.env` file in the root of the project (refer to `.env.example`):

```bash
# Firebase Credentials (Firebase Console -> Project Settings -> General)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef

# Anthropic Claude API Key (console.anthropic.com)
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/your-username/edubot.git
cd edubot
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Firebase and Anthropic keys
```

### 3. Launch Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

> **Note for Evaluators:** If you run EduBot without setting up Firebase or Anthropic API keys immediately, the application will automatically offer **Instant Demo / Guest Student Mode** with simulated AI responses and local session storage!

---

## 🌐 Deployment Guide

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `edubot` repository.
4. Add your environment variables (`VITE_FIREBASE_*` and `VITE_ANTHROPIC_API_KEY`) in the Vercel dashboard.
5. Click **Deploy**.

### Deploying to Firebase Hosting
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
# Specify 'dist' as public directory and configure as single-page app (y)
firebase deploy --only hosting
```

---

## 🎓 Academic Integrity & Credits

- **Course:** College Artificial Intelligence & Machine Learning Capstone
- **Project Title:** EduBot: Intelligent Multi-Turn Conversational Agent
- **LLM Engine:** Anthropic Claude Haiku
- **Database:** Google Cloud Firestore

Designed and developed with academic precision for college AI education.
