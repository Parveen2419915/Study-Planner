// Get elements
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const filterButtons = document.querySelectorAll(".filter-btn");

// Load tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

let currentFilter = "all";


// Save tasks
function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}


// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className =
            task.completed ? "task completed" : "task";

        taskElement.innerHTML = `
            <div class="task-info">

                <h3>${task.task}</h3>

                <p>
                    📚 Subject: ${task.subject}
                </p>

                <p>
                    📅 ${task.date}
                    &nbsp;&nbsp;
                    ⏰ ${task.time}
                </p>

                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority} Priority
                </span>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskElement);
    });

    updateProgress();
}


// Add new task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const subject = document.getElementById("subject").value;
    const taskName = document.getElementById("task").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const priority = document.getElementById("priority").value;

    const newTask = {
        id: Date.now(),
        subject: subject,
        task: taskName,
        date: date,
        time: time,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskForm.reset();
});


// Complete / Undo task
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}


// Delete task
function deleteTask(id) {

    if (confirm("Are you sure you want to delete this task?")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        displayTasks();
    }
}


// Update progress
function updateProgress() {

    if (tasks.length === 0) {

        progressText.textContent = "0% Completed";
        progressFill.style.width = "0%";

        return;
    }

    const completedTasks =
        tasks.filter(task => task.completed).length;

    const percentage =
        Math.round((completedTasks / tasks.length) * 100);

    progressText.textContent =
        `${percentage}% Completed`;

    progressFill.style.width =
        `${percentage}%`;
}


// Filter buttons
filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        displayTasks();
    });
});


// Initial display
displayTasks();
