# Pyramid – Task Management System

> A modern, full-stack task management application built as part of the AbleSpace Full Stack Developer Assessment.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-red?style=flat-square&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

## 🔗 Live Demo

| Resource | Link |
|----------|------|
| **Frontend (Vercel)** | [pyramid-task-manager.vercel.app](https://pyramid-task-manager.vercel.app) |
| **Backend API (Render)** | [pyramid-backend-8kmr.onrender.com](https://pyramid-backend-8kmr.onrender.com/api) |
| **GitHub Repository** | [github.com/Satyamsharma239/pyramid-task-manager](https://github.com/Satyamsharma239/pyramid-task-manager) |

> **Note:** The backend is hosted on Render's free tier. It may take ~30 seconds to wake up on the first request.

---

## 📖 Feature Walkthrough

### 1. Guest Login
- Open the app → Click **"Continue as Guest"**
- A JWT token is generated and stored in localStorage
- No email/password required — instant access

### 2. Kanban Board (4 Columns)
- Tasks are organized into **To Do**, **Doing**, **Completed**, and **On Hold** columns
- **Drag & Drop** tasks between columns using `@dnd-kit`
- Task status updates are sent to the backend in real-time
- Each column shows a task count badge

### 3. List View
- Toggle between **Board** and **List** views using the Fields dropdown
- List view groups tasks by status with collapsible sections
- Table columns: Task, Priority, Members, Due Date, Actions

### 4. Theme System (Light/Dark + 6 Accent Colors)
- Click your avatar in the sidebar to open the User Dropdown
- **Theme modes:** Light and Dark
- **Accent colors:** Amber, Blue, Pink, Rose, Emerald, Black
- Theme preferences persist across page refreshes (stored in localStorage)
- Implemented via CSS custom properties (`data-theme` + `data-color` attributes)

### 5. Task Management (Full CRUD)
- **Create:** Click "+ Add Task" button or the "+" icon on any column header
- **Edit:** Click the `...` menu on any task → Edit
- **Delete:** Click the `...` menu → Delete
- **Fields:** Title, Description, Status, Priority (Urgent/High/Medium/Low), Due Date, Assignee, Labels

### 6. Search & Filtering
- Click the 🔍 icon in the toolbar to search tasks by title
- Use the Fields dropdown to toggle visible columns (Priority, Members, Due Date, Labels, Status, Reporter)

### 7. Projects Page
- Navigate via sidebar → **Projects**
- Table layout showing project name, status, owner, and last updated

### 8. Settings / Profile Page
- Navigate via sidebar → User dropdown → **Settings**
- Profile form with name, email, and workspace controls

### 9. Responsive Design
- **Desktop:** Full sidebar (240px) + content area
- **Mobile/Tablet:** Collapsible sidebar with hamburger menu
- Optimized for 375px, 768px, and 1280px breakpoints

---

## ✨ Key Features Summary

| Feature | Implementation |
|---------|---------------|
| Kanban Board | 4 columns with drag-and-drop (`@dnd-kit`) |
| List View | Collapsible sections with table layout |
| Dark/Light Theme | CSS variables + `data-theme` attribute |
| 6 Accent Colors | `data-color` attribute with localStorage |
| Guest Auth | JWT token via NestJS Passport |
| Real-time Search | Frontend filtering with API support |
| Field Visibility | Toggle table columns via dropdown |
| Full CRUD | Create, Read, Update, Delete tasks |
| Responsive | Mobile-first with collapsible sidebar |
| Auto Seed Data | 11 demo tasks created on first login |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), Tailwind CSS 4 |
| Backend | NestJS 11, TypeORM |
| Database | SQLite (via better-sqlite3) |
| Auth | Passport.js, JWT |
| Drag & Drop | @dnd-kit |
| Language | TypeScript 5 |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📦 Project Structure

```
task-management-app/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # Pages (login, dashboard, projects, settings)
│   │   ├── components/        # Sidebar, BoardView, ListView, TaskCard, UserDropdown, etc.
│   │   ├── contexts/          # AuthContext, ThemeContext (light/dark + 6 colors)
│   │   ├── lib/               # API client, seed data
│   │   └── types/             # TypeScript types & constants
│   └── vercel.json            # Vercel deployment config
├── backend/                   # NestJS API
│   ├── src/
│   │   ├── auth/              # AuthModule, JwtStrategy, Guards
│   │   ├── entities/          # User, Task entities
│   │   └── tasks/             # TasksModule, DTOs, Service, Controller
│   └── nest-cli.json
├── render.yaml                # Render deployment config
├── part2_ablespace_analysis.md # Part 2 — Product Understanding
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js ≥ 18
- npm

### 1. Clone the repository
```bash
git clone https://github.com/Satyamsharma239/pyramid-task-manager.git
cd pyramid-task-manager
```

### 2. Start the Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```
The API will be available at `http://localhost:3001/api`.

### 3. Start the Frontend
In a separate terminal:
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Try it out
1. Click **"Continue as Guest"** to log in
2. Sample tasks are auto-seeded on first login
3. Drag tasks between columns
4. Toggle between Board and List views
5. Switch between Light/Dark themes and 6 accent colors

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/guest` | Guest login (returns JWT) |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/tasks` | List all tasks (supports `?status=`, `?priority=`, `?search=`) |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| PATCH | `/api/tasks/reorder` | Reorder/move a task |

All task endpoints are protected by `JwtAuthGuard`. Include `Authorization: Bearer <token>` header.

---

## 🧪 Testing

```bash
cd backend
npm run test
```
- 16 unit tests passing (AuthService + TasksService)

---

## 🎨 Design Decisions

| Decision | Rationale |
|----------|-----------|
| **SQLite** over MongoDB/PostgreSQL | Zero-friction setup — no Docker or external DB required. Reviewer can clone and run immediately. |
| **CSS Variables** for theming | Enables dynamic runtime theme switching without rebuild. Supports both light/dark and 6 accent colors. |
| **@dnd-kit** for drag-and-drop | Modern, performant React DnD library with first-class accessibility support. |
| **Notion-style flat design** | Matches the Figma spec — hairline borders (0.5px), 6px border-radius, 13px typography, no heavy shadows. |
| **Auto seed data** | 11 demo tasks are created on first guest login to showcase the UI immediately. |

---

## 📄 Part 2 – Product Understanding

See [`part2_ablespace_analysis.md`](./part2_ablespace_analysis.md) for the detailed AbleSpace "Take Data" workflow analysis, including:
- Feature breakdown of the existing interface
- Identified UX gaps and improvement opportunities
- Specific suggestions for IEP goal tracking and mastery criteria
- Recommended UI enhancements

---

## 👤 Author

**Satyam Sharma**
- GitHub: [@Satyamsharma239](https://github.com/Satyamsharma239)
- Email: satyu235@gmail.com

---

*Built with ❤️ as part of the AbleSpace Full Stack Developer Assessment*
