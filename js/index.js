const form = document.querySelector('#todo-form');
const taskTitleInput = document.querySelector('#task-title-input');
const todoListUl = document.querySelector('#todo-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Função para renderizar uma tarefa no HTML
function renderTaskOnHTML(task) {
    const li = document.createElement('li');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.checked = task.done;
    input.addEventListener('change', (event) => {
        const liToToggle = event.target.parentElement;
        const spanToToggle = liToToggle.querySelector('span');
        const done = event.target.checked;
        
        task.done = done;
        spanToToggle.style.textDecoration = done ? 'line-through' : 'none';

        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    const span = document.createElement('span');
    span.textContent = task.title;
    if (task.done) {
        span.style.textDecoration = 'line-through';
    }

    const button = document.createElement('button');
    button.textContent = 'Remover';
    // Adicionando evento ao botão de remover
    button.addEventListener('click', (event) => {
        const liToRemove = event.target.parentElement;
        const taskIndex = tasks.indexOf(task);

        if (taskIndex === -1) {
            return;
        }

        tasks = tasks.filter(t => t !== task);

        todoListUl.removeChild(liToRemove);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(button);
    
    todoListUl.appendChild(li);
}

// Renderizar as tarefas ao carregar a página
window.onload = () => {
    tasks.forEach(renderTaskOnHTML);
};

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o comportamento padrão de recarregar a página ao submeter o formulário
    
    const taskTitle = taskTitleInput.value;

    if (taskTitle.length < 3) {
        alert('Sua tarefa precisa ter, pelo menos, 3 caracteres.');
        return;
    }
    
    // Adicionando a nova tarefa no array de tasks
    const newTask = {
        title: taskTitle,
        done: false,
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Adicionando a nova tarefa no HTML
    renderTaskOnHTML(newTask);

    taskTitleInput.value = '';
});
