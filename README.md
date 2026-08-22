# DayFlow 🌿✨
> **Make today count. One task at a time.**  
> An interactive story view & workspace dashboard for task management, daily rhythm tracking, and productivity growth.

---

## 🌟 Overview

**DayFlow** is a modern, full-stack productivity web application designed with a cinematic  experience. It combines physical depth scroll storytelling with a robust workspace dashboard, real-time productivity streak monitoring, customizable daily routine timeline (Daily Rhythm), and multi-user database persistence with Neon PostgreSQL.

---

## ✨ Key Features

### 🎬 1. Cinematic 3D Story Experience
- **Interactive 3D Cards**: Floating depth-layered cards powered by Three.js & React Three Fiber.
- **Scroll-Linked Depth Timeline**: Smooth low-latency scroll reveals guiding users through their day.
- **Productivity Plant Growth**: Interactive 3D plant that sprouts and evolves based on completed task milestones (*Seed ➔ Sprout ➔ Plant ➔ Flower ➔ Tree*).

### 📋 2. Workspace Dashboard & Task Manager
- **Task Management**: Create, edit, toggle, filter, and delete tasks with priority levels (*High, Medium, Low*) and category tags (*Personal Project, College, Coding, Work, Fitness, etc.*).
- **Search & Filtering**: Search across task titles, categories, and notes. Filter by *Today, Pending, Important, Completed*.
- **Task Confetti Rewards**: Canvas confetti explosion on completing tasks.

### ⏰ 3. Customizable Daily Rhythm
- **Personalized Routine Timeline**: View your day's schedule from morning stretch to evening wind-down.
- **Editable Slots**: Modal editor allowing users to add, modify, or delete custom rhythm time slots with icon choices.
- **Isolated User Schedules**: Daily Rhythm timeline choices persist independently for each user account.

### 🔥 4. Real-Time Productivity Streak Engine
- **Date-Based Consecutive Day Tracking**: Calculates real active streaks by tracking exact completion date timestamps (`completedAt`).
- **Zero-Task Defaults**: Newly registered user accounts start with 0 tasks, 0% focus index, and 0-day active streak (no guest data leakage).

### 🔒 5. Authentication & Database Persistence
- **Neon PostgreSQL Backend**: Express.js REST API with automatic schema creation (`public.users` and `public.tasks`).
- **Encrypted Password Hashing**: SHA-256 password hashing with salt.
- **Driver Layer Fallback**: Supports Neon PostgreSQL, MongoDB (Mongoose), or local JSON file storage.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti |
| **3D Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Backend** | Node.js, Express.js, `tsx watch`, `pg` (PostgreSQL), `mongoose` (MongoDB) |
| **Database** | Neon PostgreSQL (Serverless Cloud SQL) |

---


## 📄 License
Created for DayFlow Productivity Application. All rights reserved.
