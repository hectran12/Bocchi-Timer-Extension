let start, addtask, Task_container, reset_timer, time;
time = document.getElementById('time');
start = document.getElementById("btn-start-timer");
addtask = document.getElementById("btn-add-task");
reset_timer = document.getElementById('btn-reset-timer');
Task_container = document.getElementById("task-container");


// load button

chrome.storage.local.get(['isRunning'], (res)=>{
    start.textContent = res.isRunning == false ? 'Start Timer': 'Pause Timer';
});

start.addEventListener('click', ()=>{
    chrome.storage.local.get(['isRunning'], (res)=> {
        chrome.storage.local.set({
            isRunning: !res.isRunning
        }, () => {
            start.textContent = res.isRunning ? 'Start Timer': 'Pause Timer';
        });
    })
});

reset_timer.addEventListener('click', ()=> {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false
    },()=>{
        start.textContent = 'Start Timer';
    });
});

addtask.addEventListener('click', ()=>addTask())
let Tasks = [];

chrome.storage.sync.get(['Tasks'], (res)=> {
    Tasks = res.Tasks ? res.Tasks : [];
    renderAllTask();
});

setInterval(() => {
    updateTimer()
},1000);

function updateTimer () {
    chrome.storage.local.get(['timer', 'isRunning', 'timeOptions'], (res)=>{
        var timer = res.timer;
        var min = `${res.timeOptions - Math.ceil(timer / 60)}`.padStart(2, '0')
        var second = '00';
        if (timer % 60 != 0) second = `${60 - (timer % 60)}`.padStart(2, '0');
        time.textContent = `${min}:${second}`;
    });
}

function saveTasks () {
    chrome.storage.sync.set({
        Tasks
    });
}

function renderTask (taskNum) {
    var TaskRow = document.createElement('div');
    var text = document.createElement('input');
    text.type = 'text';
    text.placeholder = 'Enter a task...';
    text.value = Tasks[taskNum];
    text.addEventListener('change', ()=>{
        Tasks[taskNum] = text.value;
        saveTasks();
    });
    text.className = 'task-input';
    var button = document.createElement('input');
    button.type = 'button';
    button.value = 'X';
    button.addEventListener('click', ()=>{
        deleteTask(taskNum);
        saveTasks();
    });
    button.className = 'task-delete';
    TaskRow.appendChild(text);
    TaskRow.appendChild(button);
    
    Task_container.appendChild(TaskRow);
}
function addTask () {
    var taskNum = Tasks.length;
    Tasks.push("");
    renderTask(taskNum);
    saveTasks();
}

function deleteTask (taskNum) {
    Tasks.splice(taskNum, 1);
    resetTaskContainer();
    renderAllTask();
}

function renderAllTask () {
    Tasks.forEach ((value, index) => {
        console.log(value);
        renderTask(index);
    })
}
function resetTaskContainer () {
    Task_container.innerHTML = '';
}