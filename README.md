# Ex03 To-Do List using JavaScript
## Date:12/05/2026

## AIM
To create a To-do Application with all features using JavaScript.

## ALGORITHM
### STEP 1
Build the HTML structure (index.html).

### STEP 2
Style the App (style.css).

### STEP 3
Plan the features the To-Do App should have.

### STEP 4
Create a To-do application using Javascript.

### STEP 5
Add functionalities.

### STEP 6
Test the App.

### STEP 7
Open the HTML file in a browser to check layout and functionality.

### STEP 8
Fix styling issues and refine content placement.

### STEP 9
Deploy the website.

### STEP 10
Upload to GitHub Pages for free hosting.

## PROGRAM
### index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elegant To-Do List</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="app-shell">
    <section class="todo-panel" aria-labelledby="app-title">
      <div class="panel-header">
        <p class="eyebrow">Daily planner</p>
        <h1 id="app-title">To-Do List</h1>
        <p class="subtitle">Plan your work, keep priorities visible, and finish the day with a cleaner mind.</p>
      </div>

      <form class="task-form" id="task-form">
        <label class="sr-only" for="task-input">Add a new task</label>
        <input type="text" id="task-input" placeholder="Add a task..." autocomplete="off" required>
        <button type="submit">Add</button>
      </form>

      <div class="toolbar" aria-label="Task filters">
        <button class="filter-btn active" type="button" data-filter="all">All</button>
        <button class="filter-btn" type="button" data-filter="active">Active</button>
        <button class="filter-btn" type="button" data-filter="completed">Done</button>
      </div>

      <ul class="task-list" id="task-list" aria-live="polite"></ul>

      <div class="empty-state" id="empty-state">
        <span>Nothing here yet</span>
        <p>Add your first task and start the list with one clear step.</p>
      </div>

      <footer class="panel-footer">
        <span id="task-count">0 tasks left</span>
        <button type="button" id="clear-completed">Clear completed</button>
      </footer>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>

```
### script.js
```
const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");
const clearCompletedBtn = document.querySelector("#clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function createTaskId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function updateCount() {
  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
}

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = getVisibleTasks();
  emptyState.classList.toggle("show", visibleTasks.length === 0);

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "X";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(checkbox, text, deleteButton);
    taskList.appendChild(item);
  });

  updateCount();
}

function addTask(text) {
  tasks.unshift({
    id: createTaskId(),
    text,
    completed: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    return;
  }

  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();

```
### style.css
```
:root {
  --bg: #eef2f8;
  --ink: #172033;
  --muted: #6b7280;
  --panel: rgba(255, 255, 255, 0.88);
  --line: rgba(148, 163, 184, 0.28);
  --accent: #2563eb;
  --accent-dark: #1d4ed8;
  --success: #0f9f6e;
  --danger: #dc2626;
  --shadow: 0 24px 70px rgba(30, 41, 59, 0.18);
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  font-family: "Inter", Arial, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.22), transparent 32rem),
    radial-gradient(circle at bottom right, rgba(15, 159, 110, 0.18), transparent 28rem),
    linear-gradient(135deg, #f8fafc 0%, var(--bg) 52%, #e0e7ff 100%);
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  width: min(100%, 920px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 48px 20px;
  display: grid;
  place-items: center;
}

.todo-panel {
  width: min(100%, 620px);
  padding: 34px;
  background: var(--panel);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 24px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
}

.panel-header {
  margin-bottom: 26px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 7vw, 3.5rem);
  line-height: 1;
  letter-spacing: 0;
}

.subtitle {
  max-width: 32rem;
  margin: 14px 0 0;
  color: var(--muted);
  line-height: 1.6;
}

.task-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.task-form input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 14px 12px;
  color: var(--ink);
  background: transparent;
}

.task-form input::placeholder {
  color: #9ca3af;
}

.task-form button,
.panel-footer button {
  border: 0;
  border-radius: 12px;
  font-weight: 700;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.task-form button {
  padding: 0 22px;
  color: #ffffff;
  background: var(--accent);
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.24);
}

.task-form button:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
}

.toolbar {
  display: flex;
  gap: 8px;
  margin: 22px 0 18px;
  padding: 6px;
  background: rgba(241, 245, 249, 0.82);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.filter-btn {
  flex: 1;
  min-height: 40px;
  border: 0;
  border-radius: 11px;
  color: var(--muted);
  background: transparent;
  font-weight: 700;
  transition: background 160ms ease, color 160ms ease, box-shadow 160ms ease;
}

.filter-btn.active {
  color: var(--ink);
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
}

.task-list {
  display: grid;
  gap: 10px;
  min-height: 74px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(30, 41, 59, 0.07);
  animation: taskIn 180ms ease both;
}

.task-item.completed .task-text {
  color: #9ca3af;
  text-decoration: line-through;
}

.task-check {
  width: 24px;
  height: 24px;
  margin: 0;
  accent-color: var(--success);
}

.task-text {
  min-width: 0;
  overflow-wrap: anywhere;
  line-height: 1.45;
  font-weight: 600;
}

.delete-btn {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 11px;
  color: var(--danger);
  background: #fff1f2;
  font-size: 1.2rem;
  line-height: 1;
  transition: background 160ms ease, transform 160ms ease;
}

.delete-btn:hover {
  background: #ffe4e6;
  transform: translateY(-1px);
}

.empty-state {
  display: none;
  margin-top: 14px;
  padding: 26px;
  text-align: center;
  color: var(--muted);
  border: 1px dashed rgba(100, 116, 139, 0.32);
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.62);
}

.empty-state.show {
  display: block;
}

.empty-state span {
  display: block;
  margin-bottom: 6px;
  color: var(--ink);
  font-weight: 800;
}

.empty-state p {
  margin: 0;
  line-height: 1.5;
}

.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 22px;
  padding-top: 18px;
  color: var(--muted);
  border-top: 1px solid var(--line);
  font-size: 0.95rem;
}

.panel-footer button {
  padding: 10px 14px;
  color: #334155;
  background: #f1f5f9;
}

.panel-footer button:hover {
  background: #e2e8f0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes taskIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 560px) {
  .app-shell {
    padding: 22px 12px;
  }

  .todo-panel {
    padding: 22px;
    border-radius: 20px;
  }

  .task-form {
    grid-template-columns: 1fr;
  }

  .task-form button {
    min-height: 46px;
  }

  .panel-footer {
    align-items: stretch;
    flex-direction: column;
  }
}

```

## OUTPUT
### WebSite:
https://to-do-list-omega-rose-94.vercel.app/

<img width="1522" height="696" alt="image" src="https://github.com/user-attachments/assets/350c709d-728d-4ef9-877d-524359b3ee13" />
<img width="1521" height="696" alt="image" src="https://github.com/user-attachments/assets/12702c69-cc57-423d-9273-ea3530a340ec" />
<img width="1521" height="696" alt="image" src="https://github.com/user-attachments/assets/2ddeacde-40cb-404e-a9c8-e32b00f0ec40" />
<img width="1522" height="698" alt="image" src="https://github.com/user-attachments/assets/aa83e24f-bc82-4e8a-b724-9bb807cb3f51" />

## RESULT
The program for creating To-do list using JavaScript is executed successfully.
