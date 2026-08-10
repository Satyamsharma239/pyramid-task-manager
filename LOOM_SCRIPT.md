# Loom Video Script (2-3 minutes)

> Record your screen with your face in the corner. Speak naturally and confidently.

## Opening (15 seconds)
"Hi, I'm Satyam. This is my submission for the AbleSpace Full Stack Developer assessment. I built a task management system called Pyramid using Next.js, NestJS, and SQLite. Let me walk you through it."

## Login Page (15 seconds)
*Show the login page*
"Here's the login page. It matches the Figma design — dark theme, the Pyramid logo, and two login options. I'll click Continue as Guest, which creates a temporary user and returns a JWT token."

*Click Continue as Guest*

## Board View (30 seconds)
*Show the Kanban board with pre-populated tasks*
"The board automatically loads with sample tasks across four columns — To Do, Doing, Completed, and On Hold. Each task card shows the assignee, labels, and due date."

*Drag a task from To Do to Doing*
"Drag and drop is fully functional using dnd-kit. The status update is sent to the NestJS backend via a PATCH request."

## Create a Task (20 seconds)
*Click Add Task*
"The modal lets you set a title, description, status, priority, due date, assignee, and labels."

*Fill in a task and save it*
"The task appears in the correct column instantly."

## List View (15 seconds)
*Switch to List View*
"There's also a List View with collapsible sections per status, showing Priority, Members, and Due Date columns."

## Fields Toggle (10 seconds)
*Click the Fields dropdown*
"The Fields dropdown lets you toggle column visibility — just like in the Figma design."

## Theme Toggle (10 seconds)
*Click theme toggle in sidebar*
"The app supports both Dark and Light themes. The preference persists in localStorage."

## Closing (15 seconds)
"On the backend, I used NestJS with TypeORM and SQLite for zero-setup evaluation. The API is prefixed under /api with JWT authentication and input validation. Thank you for reviewing my submission!"
