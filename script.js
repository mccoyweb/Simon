let start = document.getElementById('start');
let colorButtons = document.querySelectorAll('.quarter-circle');
let buttonSequence = [];
let playerSequence = [];
let colors = {
    'green': {
        audio: new Audio(`sounds/simon-green.mp3`),
        element: document.getElementById('green')
    }, 
    'red': {
        audio: new Audio(`sounds/simon-red.mp3`),
        element: document.getElementById('red')
    }, 
    'yellow': {
        audio: new Audio(`sounds/simon-yellow.mp3`),
        element: document.getElementById('yellow')
    }, 
    'blue': {
        audio: new Audio(`sounds/simon-blue.mp3`),
        element: document.getElementById('blue')
    }
};
let colorNames = ['green', 'red', 'yellow', 'blue'];
let razz = new Audio(`sounds/razz.mp3`);


let changeColor = (color) => {
    color.element.classList.toggle('lit');
}

let removeListeners = () => {
    colorButtons.forEach((button) => {
        button.removeEventListener('click', buttonPress);
    });
}

let victorySequence = (num, round) => {
    if (round < 3) {
        colors[colorNames[num]].audio.currentTime = 0;
        colors[colorNames[num]].audio.play();
        changeColor(colors[colorNames[num]]);
        setTimeout(() => {
            changeColor(colors[colorNames[num]]);
            num++;
            if (num === 4) {
                round++;
                num = 0;
            }
            setTimeout(() => {
                victorySequence(num, round);
            }, 80);
        }, 100);
    }
}

let buttonPress = (e) => {
    playerSequence.push(e.target.id);
    changeColor(colors[e.target.id]);
    // Stop the game if the wrong button is clicked
    if (e.target.id !== buttonSequence[playerSequence.length - 1]) {
        removeListeners();
        razz.play();
        playerSequence = [];
        setTimeout(() => {
            changeColor(colors[e.target.id]);
        }, 1600);
    } // Otherwise continue
    else {
        setTimeout(() => {
            colors[e.target.id].audio.currentTime = 0;
            colors[e.target.id].audio.play();
            changeColor(colors[e.target.id]);
            // Has the player completed the sequence?
            if (playerSequence.length === buttonSequence.length) {
                removeListeners();
                playerSequence = [];
                if (buttonSequence.length === 8) {
                    setTimeout(() => {
                        victorySequence(0, 0);
                    }, 1000);
                } 
                else {
                    buttonSequence.push(colorNames[Math.floor(Math.random() * 4)]);
                    setTimeout(() => {
                        showSequence(0);
                    }, 800);
                }             
            }
        }, 210);
    }
}

let playerTurn = () => {
    colorButtons.forEach((button) => {
        button.addEventListener('click', buttonPress);
    });
};

let showSequence = (num) => {
    changeColor(colors[buttonSequence[num]]);
    colors[buttonSequence[num]].audio.currentTime = 0;
    colors[buttonSequence[num]].audio.play();

    // After delay, go to next in sequence or initiate player's turn
    setTimeout(() => {
        changeColor(colors[buttonSequence[num]]);
        if (num + 1 < buttonSequence.length) {
            setTimeout(showSequence, 50, ++num);
        } else {
            playerTurn();
        }
    }, 420);
};

let startGame = () => {
    buttonSequence = [];
    buttonSequence.push(colorNames[Math.floor(Math.random() * 4)]);
    showSequence(0);
};

start.addEventListener('click', startGame);
