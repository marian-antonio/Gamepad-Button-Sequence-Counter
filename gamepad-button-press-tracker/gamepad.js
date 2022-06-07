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
    var d = document.createElement("div");
    d.setAttribute("id","controller"+gamepad.index);
    var t = document.createElement("h3");
    t.appendChild(document.createTextNode("Gamepad #" + gamepad.index));
    d.appendChild(t);

    // initial page displays a message to prompt user entry
    // controller button entry replaces that message with gamepad information
    document.getElementById("start").style.display = "none";
    document.body.appendChild(d);

    // to be used for displaying button input states later
    // rAF(updateStatus);
}

// function updateStatis(){}


function removegamepad(gamepad) {
    // removes controller element from the page
    var d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
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

// button indices
const x = 0;    // x=0, select button
const square = 2;   // square=4, to challenge npc 
const reset = 4; // L1=4, reset counter to 0

// change this number to which gamepad index you want to use
// ideally, would have a textbox or button in the front end to pass here
const gamepadNum = 2; 

// button states
let squareEnableState = false;
let xEnableState = false;
let resetCountState = false;

// functions to prevent throttle, allow one button press = one input
const loop = () => {
    const ctrl = navigator.getGamepads()[gamepadNum];

    if(ctrl){   // if controller is available
        // tracking the CURRENT states of each button
        const squareCurrentState = ctrl.buttons[square].pressed;
        const xCurrentState = ctrl.buttons[x].pressed;
        const resetCurrentState = ctrl.buttons[reset].pressed;

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


// configure action required by each enabled button
// to increment count, user needs to press square first, then x adds 1 to count
var addEnable = false; // tracks if user has pressed square

squareListener.squareListener((buttonState) => {
    addEnable = true;
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
        // allows me to focus on the game and let my peripheral vision see if i'm close to my target count
        console.log(num%10);
        if(num === 0){ // starting color
            document.body.style.background = "white"; 
        } else if (num >= 55){ // my target number is 55
            document.body.style.background = "#FF3200";
        } else if (num % 10 === 0){ // any number divisible by 10 is highlighted
            document.body.style.background = "#00FFFB"; 
        } else if (num === 51){ // count down to target number
            document.body.style.background = "#CAC499";
        } else if (num === 52){
            document.body.style.background = "#D5CA78";
        } else if (num === 53){
            document.body.style.background = "#FFE000";
        } else if (num === 54){
            document.body.style.background = "#5DE23C";
        } else{ // muted color for others
            document.body.style.background = "grey"; 
        }
        addEnable = false; // prompt user to press square again to increment
    }
});

// resetting count to zero:
resetListener.resetListener((buttonState) => {
    var count = document.getElementById("count");
    var num = count.innerHTML;
    if(buttonState){
        num = 0;
        count.innerHTML = num;
        if (num == 0){
            document.body.style.background = "white"; // resets color to default
        }
    }
});