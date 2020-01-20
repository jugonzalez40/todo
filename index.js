'use strict';


const state = {
    panelVisible: false,
    tasks: [],
    taskCount: 0,
    editing: null
};
const elements = {
    newElementBtn: document.getElementById('add-btn'),
    panel: document.getElementById('panel'),
    form: document.getElementById('form'),
    taskContainer: document.getElementById('tasks-container'),
    formValues: {
        task: document.getElementById('task'),
        deadline: document.getElementById('deadline'),
        priority: document.getElementById('priority'),
    }
};

const setFormValues = (task, priority, deadline) => {
    elements.formValues.task.value = task || '';
    elements.formValues.deadline.value = deadline || '';
    elements.formValues.priority.value = priority || '';
};

const togglePanel = () => {
    panel.style.display = !state.panelVisible ? 'block' : 'none'
    state.panelVisible = !state.panelVisible;
    setFormValues();
    state.editing = null;
};

const renderTasks = () => {
    elements.taskContainer.innerHTML = '';
    state.tasks.forEach(task => {
        const htmlTask = `
            <li class="task">
                <div class="info">
                    <input class='v-check' type="checkbox" name="done-${task.id}" id="done-${task.id}" onclick="onCheckTask(${task.id})" >
                    <label for="done-${task.id}">${task.task}</label>
                    <p class="subtitle">Prioriy - ${task.priority} | Until ${task.deadline}</p>
                </div>

                <div class="actions">
                    <button onclick="deleteTask(${task.id})">
                        Delete
                    </button>

                    <button onclick="editTask(${task.id})">
                        Edit
                    </button>
                </div>
            </li>`;

        elements.taskContainer.innerHTML = elements.taskContainer.innerHTML + htmlTask;

    });
    state.tasks.forEach(task => document.getElementById(`done-${task.id}`).checked = task.check);
};

const onSaveForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    state.taskCount += 1;
    const newTask = {
        task: formData.get('task') || '...',
        priority: formData.get('priority') || 'Low',
        deadline: formData.get('deadline') || '',
        check: false,
        id: state.taskCount
    };

    state.tasks = state.editing ?
        state.tasks.map(task => task.id === state.editing.id ? {...newTask, ... { id: task.id, check: document.getElementById(`done-${task.id}`).checked } } : task) : [...state.tasks, newTask];

    renderTasks(newTask);
    togglePanel();
};

elements.newElementBtn.addEventListener('click', togglePanel);
form.addEventListener("submit", onSaveForm);

function deleteTask(taskId) {
    state.tasks = [...state.tasks.filter(task => task.id !== taskId)];
    renderTasks();
}

function editTask(taskId) {
    togglePanel();
    const taskToEdit = state.tasks.find(task => task.id === taskId);
    if (taskToEdit) setFormValues(taskToEdit.task, taskToEdit.priority, taskToEdit.deadline);
    state.editing = taskToEdit;
}

function onCheckTask(taskId) {
    state.tasks = state.tasks.map(task => taskId === task.id ? {...task, ... { check: document.getElementById(`done-${task.id}`).checked } } : task);
}