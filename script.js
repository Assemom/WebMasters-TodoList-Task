// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const notificationContainer = document.getElementById('notification-container');

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    notificationContainer.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    const tasks = loadTasks();
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="form-check-input" ${task.completed ? 'checked' : ''}>
                <p class="task-text">${task.text}</p>
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-info edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        const checkbox = li.querySelector('.form-check-input');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        // Toggle completion
        checkbox.addEventListener('change', () => {
            task.completed = !task.completed;
            saveTasks(tasks);
            renderTasks();
            showNotification(`Task marked as ${task.completed ? 'completed' : 'incomplete'}`);
        });
        
        // Edit task
        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit task:', task.text);
            if (newText && newText.trim()) {
                task.text = newText.trim();
                saveTasks(tasks);
                renderTasks();
                showNotification('Task updated successfully');
            }
        });

        // Delete task
        deleteBtn.addEventListener('click', () => {
            const index = tasks.indexOf(task);
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
            showNotification('Task deleted successfully');
        });

        taskList.appendChild(li);
    });
}

// Add new task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    
    if (text) {
        const tasks = loadTasks();
        tasks.push({
            text,
            completed: false
        });
        saveTasks(tasks);
        taskInput.value = '';
        renderTasks();
        showNotification('Task added successfully');
    }
});

// Initial render
renderTasks();