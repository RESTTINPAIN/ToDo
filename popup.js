// Get elements from the DOM
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoDate = document.querySelector('#todo-date');
const taskList = document.querySelector('#task-list');
const completedList = document.querySelector('#completed-list');
const toggleCompletedButton = document.getElementById('toggle-completed');
toggleCompletedButton.addEventListener('click', toggleCompleted);

// Add event listener to the form for submitting new tasks
todoForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form from submitting normally

  const taskName = todoInput.value.trim(); // Get the task name and remove whitespace
  const deadline = todoDate.value; // Get the deadline date

  if (taskName !== '') {
    // Create a new task object and add it to the tasks array
    const newTask = {
      name: taskName,
      deadline: deadline || new Date().toISOString().slice(0, 10), // Use today's date if deadline not specified
      completed: false
    };
    tasks.push(newTask);

    // Add the task to the DOM
    renderTask(newTask);

    // Clear the input fields
    todoInput.value = '';
    todoDate.value = '';
    
    saveTasksToLocalStorage(); // Save tasks to local storage
  }
});

// Render all the tasks in the tasks array
function renderTasks() {
  taskList.innerHTML = '';
  completedList.innerHTML = '';
  tasks.forEach((task) => {
    renderTask(task);
  });
  saveTasksToLocalStorage(); // Save tasks to local storage
}



// Render a single task in the appropriate list (Tasks or Completed)
function renderTask(task) {
  const taskElement = document.createElement('li');
  taskElement.classList.add('task');
  taskElement.innerHTML = `
    <div class="task-checkbox">
      <input type="checkbox" id="task-${tasks.indexOf(task)}" ${task.completed ? 'checked' : ''}>
      <label for="task-${tasks.indexOf(task)}"></label>
    </div>
    <div class="task-details">
      <div class="task-name ${task.completed ? 'completed' : ''}" contenteditable="${!task.completed}">${task.name}</div>
      <div class="task-date">${task.deadline}</div>
    </div>
    <button class="task-delete">Delete</button>
  `;
  const checkbox = taskElement.querySelector('.task-checkbox input');
  const deleteButton = taskElement.querySelector('.task-delete');

  // Add event listener to checkbox to mark task as completed or uncompleted
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    renderTasks();
    saveTasksToLocalStorage(); // Save tasks to local storage
  });
  
  // Add event listener to delete button to remove task from the tasks array and the DOM
  deleteButton.addEventListener('click', () => {
    const taskIndex = tasks.indexOf(task);
    tasks.splice(taskIndex, 1);
    renderTasks();
    saveTasksToLocalStorage(); // Save tasks to local storage
  });

  // Add event listener to task name and deadline to update task object when edited
  const taskNameElement = taskElement.querySelector('.task-name');
  const taskDateElement = taskElement.querySelector('.task-date');
  taskNameElement.addEventListener('input', () => {
    task.name = taskNameElement.innerText;
    saveTasksToLocalStorage(); // Save tasks to local storage
  });
  taskDateElement.addEventListener('input', () => {
    task.deadline = taskDateElement.innerText;
    saveTasksToLocalStorage(); // Save tasks to local storage
  });

  if (task.completed) {
    completedList.appendChild(taskElement);
  } else {
    taskList.appendChild(taskElement);
  }
}


// Initialize the tasks array with any saved tasks from local storage, or an empty array if no tasks found
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render the tasks on page load
renderTasks();

// Save the tasks array to local storage whenever it changes
function saveTasksToLocalStorage() {
localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add event listener to the "Show Completed" button to toggle the visibility of the completed tasks list
toggleCompletedButton.addEventListener('click', toggleCompleted);

let completedListVisible = false;

function toggleCompleted() {
  // Move completed tasks to completedTasks array
  const completedTasks = tasks.filter((task) => task.completed);
  
  // Render completed tasks
  completedList.innerHTML = '';
  completedTasks.forEach((task) => {
    renderTask(task, completedList);
  });
  
  // Toggle visibility of completed tasks list
  if (completedListVisible) {
    completedList.style.display = 'none';
    toggleCompletedButton.textContent = 'Show Completed';
  } else {
    completedList.style.display = 'block';
    toggleCompletedButton.textContent = 'Hide Completed';
  }
  
  completedListVisible = !completedListVisible;
}

// Call the saveTasksToLocalStorage function whenever the tasks array changes
window.addEventListener('beforeunload', saveTasksToLocalStorage);