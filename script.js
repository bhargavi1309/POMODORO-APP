/* =========================================
   DEFAULT SETTINGS
========================================= */

const DEFAULT_SETTINGS = {

    work: 25,

    shortBreak: 5,

    longBreak: 15,

    sound: true

};


/* =========================================
   LOAD SETTINGS
========================================= */

let settings =
    JSON.parse(
        localStorage.getItem(
            "focusFlowSettings"
        )
    ) || {
        ...DEFAULT_SETTINGS
    };


/* =========================================
   TIMER STATE
========================================= */

let currentSession = "work";

let timeRemaining =
    settings.work * 60;

let totalSessionTime =
    settings.work * 60;

let timerInterval = null;

let isRunning = false;


/* =========================================
   POMODORO COUNT
========================================= */

let pomodoroCount =
    Number(
        localStorage.getItem(
            "focusFlowPomodoros"
        )
    ) || 0;


/* =========================================
   DOM
========================================= */

const timer =
    document.getElementById(
        "timer"
    );

const startBtn =
    document.getElementById(
        "startBtn"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );

const skipBtn =
    document.getElementById(
        "skipBtn"
    );

const sessionLabel =
    document.getElementById(
        "sessionLabel"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const pomodoroCountElement =
    document.getElementById(
        "pomodoroCount"
    );

const taskInput =
    document.getElementById(
        "taskInput"
    );

const clearTaskBtn =
    document.getElementById(
        "clearTaskBtn"
    );

const settingsBtn =
    document.getElementById(
        "settingsBtn"
    );

const settingsModal =
    document.getElementById(
        "settingsModal"
    );

const closeSettingsBtn =
    document.getElementById(
        "closeSettingsBtn"
    );

const saveSettingsBtn =
    document.getElementById(
        "saveSettingsBtn"
    );

const workDuration =
    document.getElementById(
        "workDuration"
    );

const shortBreakDuration =
    document.getElementById(
        "shortBreakDuration"
    );

const longBreakDuration =
    document.getElementById(
        "longBreakDuration"
    );

const soundToggle =
    document.getElementById(
        "soundToggle"
    );

const alarmSound =
    document.getElementById(
        "alarmSound"
    );

const fullscreenBtn =
    document.getElementById(
        "fullscreenBtn"
    );

const installContainer =
    document.getElementById(
        "installContainer"
    );

const installBtn =
    document.getElementById(
        "installBtn"
    );

const desktopBackground =
    document.getElementById(
        "desktopBackground"
    );

const mobileBackground =
    document.getElementById(
        "mobileBackground"
    );

const backgroundImage =
    document.getElementById(
        "backgroundImage"
    );


/* =========================================
   SESSION NAMES
========================================= */

const SESSION_NAMES = {

    work: "Focus Time",

    shortBreak: "Short Break",

    longBreak: "Long Break"

};


/* =========================================
   BACKGROUND FILES
========================================= */

const BACKGROUNDS = {

    work: {

        desktopVideo:
            "assets/focus-desktop.mp4",

        mobileVideo:
            "assets/focus-mobile.mp4",

        desktopImage:
            "assets/focus-desktop.jpg",

        mobileImage:
            "assets/focus-mobile.jpg"

    },


    shortBreak: {

        desktopVideo:
            "assets/shortbreak-desktop.mp4",

        mobileVideo:
            "assets/shortbreak-mobile.mp4",

        desktopImage:
            "assets/shortbreak-desktop.jpg",

        mobileImage:
            "assets/shortbreak-mobile.jpg"

    },


    longBreak: {

        desktopVideo:
            "assets/longbreak-desktop.mp4",

        mobileVideo:
            "assets/longbreak-mobile.mp4",

        desktopImage:
            "assets/longbreak-desktop.jpg",

        mobileImage:
            "assets/longbreak-mobile.jpg"

    }

};


/* =========================================
   UPDATE BACKGROUND
========================================= */

function updateBackground(
    session
) {

    const background =
        BACKGROUNDS[session];


    if (!background) {
        return;
    }


    /*
     * Update desktop video
     */

    desktopBackground.pause();


    desktopBackground.src =
        background.desktopVideo;


    desktopBackground.load();


    desktopBackground
        .play()
        .catch(
            () => {
                console.log(
                    "Desktop video autoplay unavailable."
                );
            }
        );


    /*
     * Update mobile video
     */

    mobileBackground.pause();


    mobileBackground.src =
        background.mobileVideo;


    mobileBackground.load();


    mobileBackground
        .play()
        .catch(
            () => {
                console.log(
                    "Mobile video autoplay unavailable."
                );
            }
        );


    /*
     * Update fallback image
     */

    if (
        window.innerWidth <= 600
    ) {

        backgroundImage.style.backgroundImage =
            `url("${background.mobileImage}")`;

    }

    else {

        backgroundImage.style.backgroundImage =
            `url("${background.desktopImage}")`;

    }

}


/* =========================================
   RESPONSIVE BACKGROUND
========================================= */

window.addEventListener(
    "resize",
    () => {

        updateBackground(
            currentSession
        );

    }
);


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(
    seconds
) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        seconds % 60;


    return (
        String(minutes)
            .padStart(2, "0") +

        ":" +

        String(
            remainingSeconds
        ).padStart(2, "0")
    );

}


/* =========================================
   GET SESSION DURATION
========================================= */

function getSessionDuration(
    session
) {

    if (
        session === "work"
    ) {

        return settings.work * 60;

    }


    if (
        session === "shortBreak"
    ) {

        return settings.shortBreak * 60;

    }


    if (
        session === "longBreak"
    ) {

        return settings.longBreak * 60;

    }


    return settings.work * 60;

}


/* =========================================
   UPDATE DISPLAY
========================================= */

function updateDisplay() {

    timer.textContent =
        formatTime(
            timeRemaining
        );


    sessionLabel.textContent =
        SESSION_NAMES[
            currentSession
        ];


    pomodoroCountElement.textContent =
        pomodoroCount;


    const percentage =
        (
            timeRemaining /
            totalSessionTime
        ) * 100;


    progressBar.style.height =
        `${percentage}%`;

    progressBar.style.width =
        "100%";


    document.title =
        `${formatTime(timeRemaining)} • ${SESSION_NAMES[currentSession]}`;

}


/* =========================================
   START TIMER
========================================= */

function startTimer() {

    if (isRunning) {
        return;
    }


    isRunning = true;

    startBtn.textContent =
        "Pause";


    timerInterval =
        setInterval(
            () => {

                if (
                    timeRemaining > 0
                ) {

                    timeRemaining--;

                    updateDisplay();

                }

                else {

                    completeSession();

                }

            },
            1000
        );

}


/* =========================================
   PAUSE
========================================= */

function pauseTimer() {

    isRunning = false;


    clearInterval(
        timerInterval
    );


    timerInterval = null;


    startBtn.textContent =
        "Start";

}


/* =========================================
   START / PAUSE
========================================= */

startBtn.addEventListener(
    "click",
    () => {

        if (isRunning) {

            pauseTimer();

        }

        else {

            startTimer();

        }

    }
);


/* =========================================
   RESET
========================================= */

function resetTimer() {

    pauseTimer();


    timeRemaining =
        getSessionDuration(
            currentSession
        );


    totalSessionTime =
        timeRemaining;


    updateDisplay();


    /*
     * Background remains
     * appropriate for session.
     */

    updateBackground(
        currentSession
    );

}


resetBtn.addEventListener(
    "click",
    resetTimer
);


/* =========================================
   ALARM
========================================= */

function playAlarm() {

    if (!settings.sound) {
        return;
    }


    alarmSound.currentTime = 0;


    alarmSound
        .play()
        .catch(
            error => {

                console.log(
                    "Alarm could not play:",
                    error
                );

            }
        );

}


/* =========================================
   COMPLETE SESSION
========================================= */

function completeSession() {

    /*
     * Stop current timer.
     */

    pauseTimer();


    /*
     * Alarm
     */

    playAlarm();


    /*
     * If Focus finished
     */

    if (
        currentSession === "work"
    ) {

        pomodoroCount++;


        localStorage.setItem(
            "focusFlowPomodoros",
            pomodoroCount
        );


        /*
         * Every 4 Focus sessions
         * → Long Break
         */

        if (
            pomodoroCount % 4 === 0
        ) {

            switchSession(
                "longBreak"
            );

        }

        else {

            switchSession(
                "shortBreak"
            );

        }

    }

    else {

        /*
         * Break finished
         * → Focus
         */

        switchSession(
            "work"
        );

    }


    /*
     * Automatically start
     * the new session.
     */

    startTimer();

}


/* =========================================
   SWITCH SESSION
========================================= */

function switchSession(
    session
) {

    currentSession =
        session;


    timeRemaining =
        getSessionDuration(
            session
        );


    totalSessionTime =
        timeRemaining;


    updateSessionTabs();


    /*
     * IMPORTANT:
     *
     * Change background
     * whenever session changes.
     */

    updateBackground(
        session
    );


    updateDisplay();

}


/* =========================================
   SESSION TABS
========================================= */

const sessionTabs =
    document.querySelectorAll(
        ".session-tab"
    );


sessionTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                pauseTimer();


                switchSession(
                    tab.dataset.session
                );

            }
        );

    }
);


/* =========================================
   ACTIVE TAB
========================================= */

function updateSessionTabs() {

    sessionTabs.forEach(
        tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.session ===
                    currentSession
            );

        }
    );

}


/* =========================================
   SKIP
========================================= */

skipBtn.addEventListener(
    "click",
    () => {

        pauseTimer();


        if (
            currentSession === "work"
        ) {

            /*
             * Don't count skipped Focus
             * as completed.
             */

            switchSession(
                "shortBreak"
            );

        }

        else {

            switchSession(
                "work"
            );

        }

    }
);


/* =========================================
   TASK
========================================= */

taskInput.value =
    localStorage.getItem(
        "focusFlowTask"
    ) || "";


taskInput.addEventListener(
    "input",
    () => {

        localStorage.setItem(
            "focusFlowTask",
            taskInput.value
        );

    }
);


clearTaskBtn.addEventListener(
    "click",
    () => {

        taskInput.value = "";


        localStorage.removeItem(
            "focusFlowTask"
        );

    }
);


/* =========================================
   SETTINGS OPEN
========================================= */

settingsBtn.addEventListener(
    "click",
    () => {

        workDuration.value =
            settings.work;


        shortBreakDuration.value =
            settings.shortBreak;


        longBreakDuration.value =
            settings.longBreak;


        soundToggle.checked =
            settings.sound;


        settingsModal.classList.remove(
            "hidden"
        );

    }
);


/* =========================================
   SETTINGS CLOSE
========================================= */

closeSettingsBtn.addEventListener(
    "click",
    () => {

        settingsModal.classList.add(
            "hidden"
        );

    }
);


/* =========================================
   CLICK OUTSIDE MODAL
========================================= */

settingsModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            settingsModal
        ) {

            settingsModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================
   SAVE SETTINGS
========================================= */

saveSettingsBtn.addEventListener(
    "click",
    () => {

        const work =
            Number(
                workDuration.value
            );


        const shortBreak =
            Number(
                shortBreakDuration.value
            );


        const longBreak =
            Number(
                longBreakDuration.value
            );


        /*
         * Focus:
         * 1 - 180 minutes
         */

        settings.work =
            Math.min(
                180,
                Math.max(
                    1,
                    work || 25
                )
            );


        /*
         * Short Break:
         * 1 - 60 minutes
         */

        settings.shortBreak =
            Math.min(
                60,
                Math.max(
                    1,
                    shortBreak || 5
                )
            );


        /*
         * Long Break:
         * 1 - 120 minutes
         */

        settings.longBreak =
            Math.min(
                120,
                Math.max(
                    1,
                    longBreak || 15
                )
            );


        settings.sound =
            soundToggle.checked;


        /*
         * Save settings
         */

        localStorage.setItem(
            "focusFlowSettings",
            JSON.stringify(
                settings
            )
        );


        /*
         * Apply new duration
         */

        resetTimer();


        settingsModal.classList.add(
            "hidden"
        );

    }
);


/* =========================================
   FULLSCREEN
========================================= */

fullscreenBtn.addEventListener(
    "click",
    async () => {

        try {

            if (
                !document.fullscreenElement
            ) {

                await document
                    .documentElement
                    .requestFullscreen();

            }

            else {

                await document
                    .exitFullscreen();

            }

        }

        catch (error) {

            console.log(
                "Fullscreen unavailable:",
                error
            );

        }

    }
);


/* =========================================
   PWA INSTALL
========================================= */

let deferredInstallPrompt =
    null;


window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();


        deferredInstallPrompt =
            event;


        installContainer.classList.remove(
            "hidden"
        );

    }
);


installBtn.addEventListener(
    "click",
    async () => {

        if (
            !deferredInstallPrompt
        ) {

            return;

        }


        deferredInstallPrompt.prompt();


        await deferredInstallPrompt
            .userChoice;


        deferredInstallPrompt =
            null;


        installContainer.classList.add(
            "hidden"
        );

    }
);


/* =========================================
   SERVICE WORKER
========================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "sw.js"
                )
                .then(
                    () => {

                        console.log(
                            "Service Worker registered."
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "Service Worker error:",
                            error
                        );

                    }
                );

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

function initialize() {

    timeRemaining =
        getSessionDuration(
            currentSession
        );


    totalSessionTime =
        timeRemaining;


    updateSessionTabs();


    updateBackground(
        currentSession
    );


    updateDisplay();

}


initialize();