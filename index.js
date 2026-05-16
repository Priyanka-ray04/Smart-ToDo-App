// ==========================
// SELECT HTML ELEMENTS
// ==========================

const todoInput = document.getElementById("todo-input");
const prioritySelect = document.getElementById("priority");
const addBtn = document.getElementById("add-btn");

const todoList = document.getElementById("todo-list");

const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");

const searchInput = document.getElementById("search-input");

const allBtn = document.getElementById("all-btn");
const completedBtn = document.getElementById("completed-btn");
const pendingBtn = document.getElementById("pending-btn");

// ==========================
// TODOS ARRAY
// ==========================

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// ==========================
// ADD TASK
// ==========================

addBtn.addEventListener("click", addTodo);

function addTodo() {
  const taskText = todoInput.value.trim();
  const priority = prioritySelect.value;

  // Validation
  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  // Todo Object
  const todo = {
    id: Date.now(),
    text: taskText,
    completed: false,
    priority: priority,
  };

  // Add into array
  todos.push(todo);

  // Save in localStorage
  saveTodos();

  // Render tasks
  renderTodos();

  // Clear input
  todoInput.value = "";
}

// ==========================
// RENDER TODOS
// ==========================

function renderTodos(filteredTodos = todos) {
  // Clear old tasks
  todoList.innerHTML = "";

  filteredTodos.forEach(function (todo) {
    // Create li
    const li = document.createElement("li");

    li.classList.add("todo-item");

    // Completed class
    if (todo.completed) {
      li.classList.add("completed");
    }

    // Add HTML
    li.innerHTML = `

      <div class="todo-left">

        <input 
          type="checkbox" 
          class="complete-checkbox"
          ${todo.completed ? "checked" : ""}
        >

        <span class="task-text">
          ${todo.text}
        </span>

        <span class="priority ${todo.priority.toLowerCase()}">
          ${todo.priority}
        </span>

      </div>

      <div class="todo-actions">

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>

    `;

    // ==========================
    // COMPLETE TASK
    // ==========================

    const checkbox = li.querySelector(".complete-checkbox");

    checkbox.addEventListener("change", function () {
      todo.completed = !todo.completed;

      saveTodos();

      renderTodos();
    });

    // ==========================
    // DELETE TASK
    // ==========================

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function () {
      todos = todos.filter(function (item) {
        return item.id !== todo.id;
      });

      saveTodos();

      renderTodos();
    });

    // ==========================
    // EDIT TASK
    // ==========================

    const editBtn = li.querySelector(".edit-btn");

    editBtn.addEventListener("click", function () {
      const updatedText = prompt("Edit your task", todo.text);

      if (updatedText === null) {
        return;
      }

      if (updatedText.trim() === "") {
        alert("Task cannot be empty");
        return;
      }

      todo.text = updatedText;

      saveTodos();

      renderTodos();
    });

    // Add li into ul
    todoList.appendChild(li);
  });

  // Update counters
  updateTaskStatus();
}

// ==========================
// UPDATE TASK STATUS
// ==========================

function updateTaskStatus() {
  const total = todos.length;

  const completed = todos.filter(function (todo) {
    return todo.completed;
  }).length;

  const pending = total - completed;

  totalTasks.innerText = total;
  completedTasks.innerText = completed;
  pendingTasks.innerText = pending;
}

// ==========================
// SAVE TODOS IN LOCAL STORAGE
// ==========================

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ==========================
// SEARCH TASK
// ==========================

searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();

  const filteredTodos = todos.filter(function (todo) {
    return todo.text.toLowerCase().includes(searchText);
  });

  renderTodos(filteredTodos);
});

// ==========================
// FILTER BUTTONS
// ==========================

// ALL TASKS
allBtn.addEventListener("click", function () {
  renderTodos(todos);
});

// COMPLETED TASKS
completedBtn.addEventListener("click", function () {
  const completedTodos = todos.filter(function (todo) {
    return todo.completed;
  });

  renderTodos(completedTodos);
});

// PENDING TASKS
pendingBtn.addEventListener("click", function () {
  const pendingTodos = todos.filter(function (todo) {
    return !todo.completed;
  });

  renderTodos(pendingTodos);
});

// ==========================
// INITIAL RENDER
// ==========================

renderTodos();
