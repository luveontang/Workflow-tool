

let tasks = [];

try {
    let savedTasks = localStorage.getItem("tasks");

    if (savedTasks !== null) {
        let loadedTasks = JSON.parse(savedTasks);

        if (Array.isArray(loadedTasks)) {
            tasks = loadedTasks;
        }
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}


const taskForm = document.getElementById("taskForm");

// STEP 1: CREATE A TASK

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("taskName").value.trim();

    let person = document.getElementById("assignedTo").value.trim();

    let priority = document.getElementById("priority").value;

    let deadline = document.getElementById("deadline").value;

    if (name === "") {
        alert("Please enter a task name");
        return;
    }

    let task = {
        id: Date.now(),
        name: name,
        person: person || "Unassigned",
        priority: priority,
        deadline: deadline,
        status: "To Do"
    };

    tasks.push(task);

    saveTasks();

    displayTasks();
    updateDashboard();

    taskForm.reset();
});


// STEP 2: DISPLAY TASKS

function displayTasks() {

    let taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        let card = document.createElement("div");
        card.className = "task-card";

        let title = document.createElement("h3");
        title.textContent = task.name;

        let details = document.createElement("p");
        details.textContent =
            "Assigned to: " + task.person +
            " | Priority: " + task.priority +
            " | Deadline: " + (task.deadline || "None");

        let status = document.createElement("p");
        status.textContent = "Status: " + task.status;

        let statusSelect = document.createElement("select");

        ["To Do", "In Progress", "Completed"].forEach(
            function(optionText) {

                let option = document.createElement("option");
                option.value = optionText;
                option.textContent = optionText;

                statusSelect.appendChild(option);
            }
        );

        statusSelect.value = task.status;

        statusSelect.addEventListener("change", function() {
            task.status = statusSelect.value;
            
            saveTask();

            displayTasks();
            updateDashboard();
        });

        let completeButton = document.createElement("button");
        completeButton.textContent = "Mark as done";

        completeButton.addEventListener("click", function() {
            completeTask(task.id);
        });

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        if (task.status === "Completed") {
            card.classList.add("completed");
            completeButton.disabled = true;
        }

        card.appendChild(title);
        card.appendChild(details);
        card.appendChild(status);
        card.appendChild(statusSelect);
        card.appendChild(completeButton);
        card.appendChild(deleteButton);

        taskList.appendChild(card);
    });
}


// STEP 3: COMPLETE TASK

function completeTask(id) {

    let task = tasks.find(function(task) {
        return task.id === id;
    });

    if (task) {
        task.status = "Completed";
    }

    saveTasks();

    displayTasks();
    updateDashboard();
}


// STEP 4: DELETE TASK

function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();

    displayTasks();
    updateDashboard();
}


// STEP 5: UPDATE DASHBOARD

function updateDashboard() {

    document.getElementById("totalTasks")
        .textContent = tasks.length;

    let inProgress = tasks.filter(function(task) {
        return task.status === "In Progress";
    }).length;

    let completed = tasks.filter(function(task) {
        return task.status === "Completed";
    }).length;

    document.getElementById("progressTasks")
        .textContent = inProgress;

    document.getElementById("completedTasks")
        .textContent = completed;
}

function saveTasks() {

    try {
        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );
    } catch (error) {
        console.error("Could not save tasks:", error);
        alert("Your tasks could not be saved.");
    }

}
