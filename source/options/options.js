let timer_options, save;
timer_options = document.getElementById("timer-options");
save = document.getElementById("save-btn");

chrome.storage.local.get(['timeOptions'], (res)=>{
    timer_options.value = res.timeOptions ? res.timeOptions : 25;
});

timer_options.addEventListener('change', (event)=>{
    var val = event.target.value;
    if (val < 1 || val > 60) {
        timer_options.value = 25;
    }
});

save.addEventListener('click', ()=>{
    chrome.storage.local.set({
        timeOptions: timer_options.value,
        timer: 0,
        isRunning: false
    });
})