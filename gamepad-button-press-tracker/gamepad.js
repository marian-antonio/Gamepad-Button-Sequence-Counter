// counts button presses based on a sequence of entries
// all entries are from a game controller

/*
    TODO: 
    - polish front end design
    - show buttons pressed in front end
    - add a timer that can also be enabled/disabled/reset by a controller button
    - store times to database

*/

var gamepadInfo = document.getElementById("gamepad-info");
var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;


// connection and disconnection handlers

function connecthandler(e) {
    addgamepad(e.gamepad);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function addgamepad(gamepad){
    
    controllers[gamepad.index] = gamepad;
    console.log("Adding controllers[gamepad.index]: " + gamepad.index);
    var main = document.getElementById("gamepad-list");
    var d = document.createElement("li");
    d.setAttribute("id","controller"+gamepad.index);
    d.appendChild(document.createTextNode("GamePad [" + gamepad.index+"]"));
    document.getElementById("wait-message").style.display = "none";
    document.getElementById("gamepad-header").style.display = "block";
    main.appendChild(d);

    // to be used for displaying button input states later
    // rAF(updateStatus);
}

// function updateStatus(){}


function removegamepad(gamepad) {
    // removes controller element from the page
    var d = document.getElementById("controller" + gamepad.index);
    var main = document.getElementById("gamepad-list");
    document.main.removeChild(d);
    delete controllers[gamepad.index];
}

// controller polling to ensure one is connected
function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && (gamepads[i].index in controllers)) {
            controllers[gamepads[i].index] = gamepads[i];
        }
    }
}

// track events, check for controller connection, polling
if (haveEvents) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
    window.addEventListener("webkitgamepadconnected", connecthandler);
    window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
    setInterval(scangamepads, 500);
}

/* ================ COUNTER LOGIC ======================= */

// variable names for buttons used are based on PS4 controllers
// regardless, this app still works for other types of console controllers

/*
    BUTTON LIST
    0: x
    1: circle
    2: square
    3: triangle
    4: L1
    5: R1
    6: L2
    7: R2
    8: "Share"
    9: "Options"
    10: L3 (Left Joystick press)
    11: R3 (Right Joystick press)
    12: Dpad Up
    13: Dpad Down
    14: Dpad Left
    15: Dpad Right
    16: PS button
    17: Touchpad button

*/

// button indices
const x = 0;    // x=0, select button
const square = 2;   // square=4, to challenge npc 
const reset = 4; // L1=4, reset counter to 0
const timerButton = 5; // L2 controls timer 
const resetTimer = 16; // R2 resets timer 

// change this number to which gamepad index you want to use
// ideally, would have a textbox or button in the front end to pass here
const gamepadNum = 0; 

// button states
let squareEnableState = false;
let xEnableState = false;
let resetCountState = false;
let timerControlState = false; 
let resetTimerState = false;

// functions to prevent throttle, allow one button press = one input
const loop = () => {
    const ctrl = navigator.getGamepads()[gamepadNum];

    if(ctrl){   // if controller is available
        // tracking the CURRENT states of each button
        const squareCurrentState = ctrl.buttons[square].pressed;
        const xCurrentState = ctrl.buttons[x].pressed;
        const resetCurrentState = ctrl.buttons[reset].pressed;
        const timerCurrentState = ctrl.buttons[timerButton].pressed;
        const resetTimerCurrentState = ctrl.buttons[resetTimer].pressed;

        // for each button, check if state has changed
        // if so, update the enable state
        // trigger corresponding listener with the new state
        if(squareEnableState !== squareCurrentState){
            squareEnableState = squareCurrentState;
            squareListener.signal(squareCurrentState);
        }
        if(xEnableState !== xCurrentState){
            xEnableState = xCurrentState;
            xListener.signal(xCurrentState);
        }
        if(resetCountState !== resetCurrentState){
            resetCountState = resetCurrentState;
            resetListener.signal(resetCurrentState);
        }
        if(timerControlState !== timerCurrentState){
            timerControlState = timerCurrentState;
            timerListener.signal(timerCurrentState);
        }
        if(resetTimerState !== resetTimerCurrentState){
            resetTimerState = resetTimerCurrentState;
            resetTimerListener.signal(resetTimerCurrentState);
        }
    }

    setTimeout(loop, 50); // set interval for checking the button states
}

loop(); // enable loop

// state listeners:
const squareListener = {
    listeners: [],
    squareListener(btn){
        this.listeners.push(btn);
    },
    signal(state){
        for(const btn of this.listeners){
            btn(state);
        }
    }
}
const xListener = {
    listeners: [],
    xListener(btn){
        this.listeners.push(btn);
    },
    signal(state){
        for(const btn of this.listeners){
            btn(state);
        }
    }
}
const resetListener = {
    listeners: [],
    resetListener(btn){
        this.listeners.push(btn);
    },
    signal(state){
        for(const btn of this.listeners){
            btn(state);
        }
    }
}
const timerListener = {
    listeners: [],
    timerListener(btn){
        this.listeners.push(btn);
    },
    signal(state){
        for(const btn of this.listeners){
            btn(state);
        }
    }
}
const resetTimerListener = {
    listeners: [],
    resetTimerListener(btn){
        this.listeners.push(btn);
    },
    signal(state){
        for(const btn of this.listeners){
            btn(state);
        }
    }
}

// configure action required by each enabled button
// to increment count, user needs to press square first, then x adds 1 to count
var addEnable = false; // tracks if user has pressed square

squareListener.squareListener((buttonState) => {
    addEnable = true;
    document.getElementById("buttonStat").innerHTML = "True";
    document.getElementById("buttonStat").style.color = "#acf13c";
});

xListener.xListener((buttonState) =>{
    // get current count value from from end
    var count = document.getElementById("count");
    var num = count.innerHTML;

    // check if x is pressed, and square was pressed beforehand
    if(buttonState && addEnable){
        num++; // increment value
        count.innerHTML = num; // update front end


        // OPTIONAL:
        // background changes color based on current count number
        if (num >= 56){ // past target
            color = "#000000";
        }else if (num === 52){ // count down to target number
            color = "#CAC499";
            beep(threeSound); 
        } else if (num === 53){
            color = "#D5CA78";
            beep(twoSound); 
        } else if (num === 54){
            color = "#FFE000";
            beep(oneSound); 
        } else if (num === 55){
            color = "#5DE23C";
            beep(dingSound); 
        } else{ 
            color = "white"; 
        }

        document.getElementById("count-box").style.borderColor = color;
        // document.getElementById("stat-body").style.backgroundColor = color;
        addEnable = false; // prompt user to press square again to increment
        document.getElementById("buttonStat").innerHTML = "False";
        document.getElementById("buttonStat").style.color = "#e46821";
    }
});

// resetting count to zero:
resetListener.resetListener((buttonState) => {
    var count = document.getElementById("count");
    var num = count.innerHTML;
    if(buttonState){
        num = 0;
        count.innerHTML = num;
        addEnable = false; // reset enable states
        document.getElementById("buttonStat").innerHTML = "False";
        document.getElementById("buttonStat").style.color = "#e46821";
        if (num == 0){
            // document.getElementById("stat-body").style.borderColor = "#313939"; // resets color to default
            document.getElementById("count-box").style.borderColor = "white";
        }
    }
});



// extra functionalities

// sound effect
var soundPath = "../Sounds/";
var dingSound = soundPath + "609336__kenneth-cooney__completed.wav";
var oneSound = soundPath + "1.wav";
var twoSound = soundPath + "2.wav";
var threeSound = soundPath + "3.wav";
var fourSound = soundPath + "4.wav";
var fiveSound = soundPath + "5.wav";

function beep(soundName) {
    var audio = new Audio(
        soundName);
    audio.play();
}

// window stop watch control
window.onload = function (){
    var startState = false;
    var stopState = true;
    var resetState = false;

    var minutes = 00;
    var seconds = 00;
    var milliseconds = 00;

    var appendMinutes = document.getElementById("minutes");
    var appendSeconds = document.getElementById("seconds");
    var appendMilliseconds = document.getElementById("milliseconds");

    var buttonStart = document.getElementById('button-start');
    var buttonStop = document.getElementById('button-stop');
    var buttonReset = document.getElementById('button-reset');
    var buttonClear = document.getElementById('button-clear');
    var Interval ;

    buttonStart.onclick = function(){ start(); }
    buttonStop.onclick = function(){ stop(); }
    buttonReset.onclick = function(){ reset(); }
    buttonClear.onclick = function(){ clearTimeList(); }

    // control timer with gamepad controller
    timerListener.timerListener((buttonState) => {
        if(buttonState){
            if(!startState && stopState){
                document.getElementById("timer").style.color = "#acf13c";
                start();
            } else if(startState && !stopState && !resetState){
                document.getElementById("timer").style.color = "white";
                stop();
                reset();
            }
        }
    });

    resetTimerListener.resetTimerListener((buttonState) =>{
        if(buttonState){
            // clearTimeList();
            removePreviousTime();
        }
    })

    function start(){
        startState = true;
        stopState = false;
        resetState = false; 

        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);     
    }
    function stop(){
        startState = false;
        stopState = true;
        resetState = true;
        
        // clear interval stops timer
        clearInterval(Interval);
    }

    function reset() {
        startState = false;
        stopState = true;
        resetState = false;
        
        // add time to list node
        storeTime(appendMinutes.innerHTML, appendSeconds.innerHTML, appendMilliseconds.innerHTML);

        // reset timer
        clearInterval(Interval);
        milliseconds = "00";
        seconds = "00";
        minutes = "00";
        appendMilliseconds.innerHTML = milliseconds;
        appendSeconds.innerHTML = seconds;
        appendMinutes.innerHTML = minutes;
    }

    var listNum = 0; 

    function storeTime(minutes, seconds, milliseconds){
        listNum++;
        var timesList = document.getElementById("times");
        var node = document.createElement("li");
        var newTime = document.createTextNode("#"+listNum + ": "+minutes+":"+seconds+":"+milliseconds);
        node.appendChild(newTime);
        timesList.prepend(node);
    }

    function clearTimeList(){
        var timesList = document.getElementById("times");
        listNum = 0;
        timesList.innerHTML = '';
    }

    function removePreviousTime(){
        if (listNum > 0){
            var timesList = document.getElementById("times");
            timesList.firstChild.remove();
                listNum--;
            }
    }

    // timer functionality
    function startTimer () {
        milliseconds++; 
        if(milliseconds <= 9){
            appendMilliseconds.innerHTML = "0" + milliseconds;
        }
        if (milliseconds > 9){
            appendMilliseconds.innerHTML = milliseconds;
        } 
        
        if (milliseconds > 99) {
            seconds++;
            appendSeconds.innerHTML = "0" + seconds;
            milliseconds = 0;
            appendMilliseconds.innerHTML = "0" + 0;
        }
        
        if (seconds > 9){
            appendSeconds.innerHTML = seconds;
        }

        if (seconds > 59){
            minutes++;
            appendMinutes.innerHTML = "0" + minutes;
            seconds = 0;
            appendSeconds.innerHTML = "0" + 0;
        }
        if (minutes > 9){
            appendMinutes.innerHTML = minutes;
        }
    }
}


