chrome.alarms.create('bocchiTimer', {
    periodInMinutes: 1/60
});
chrome.alarms.onAlarm.addListener((alarms)=>{
    if (alarms['name'] == 'bocchiTimer') {
        chrome.storage.local.get(['timer', 'isRunning', 'timeOptions'], (res)=>{
            if (res.isRunning) {
                let timer = res.timer + 1;
                chrome.storage.local.set({
                    timer
                });
                if (timer === 60 * res.timeOptions) {
                    this.registration.showNotification("Bocchi Timer", {
                        body: `Bocchi says: ${res.timeOptions} minutes have passed!`,
                        icon: 'notification.png'
                    });
                    chrome.storage.local.set({
                        timer: 0,
                        isRunning: false
                    });
                } 
            }
        });
    }
});

chrome.storage.local.get(['timer', 'isRunning', 'timeOptions'], (res)=>{
    chrome.storage.local.set({
        timer: "timer" in res ? res.timer : 0,
        isRunning: "isRunning" in res ? res.isRunning : false,
        timeOptions: "timeOptions" in res ? res.timeOptions : 25
    });
})


