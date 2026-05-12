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
