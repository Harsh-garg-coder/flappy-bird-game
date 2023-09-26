const pipes = document.querySelectorAll(".pipe");
const bird = document.querySelector(".bird-container");
const board = document.querySelector(".game-board");
const startGameBtn = document.querySelector(".start-game-btn");
const overlay = document.querySelector(".overlay");

let isGameOn = true;
const gapHeight = 200;
let moveBirdDownIntervalId;
let gameOverIntervalId;

function moveBirdDown() {
    moveBirdDownIntervalId = setInterval(() => {
        const birdRect = bird.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();

        const birdCurrentTop = birdRect.top - boardRect.top;
        const birdNewTop = Math.floor(birdCurrentTop + 15);

        bird.style.top = birdNewTop + "px";
    }, 100);
}

function moveBirdUp() {
    const birdRect = bird.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const birdCurrentTop = birdRect.top - boardRect.top;
    const birdNewTop = Math.floor(birdCurrentTop - 50);

    bird.style.top = birdNewTop + "px";
    bird.style.transform = "rotateZ(-10deg)";

    setTimeout(() => {
        bird.style.transform = "rotateZ(0deg)";
    }, 200);
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function changeHeightsOfPipe(e) {
    const currentPipe = e.target;

    const topPipeNewHeight = generateRandomNumber(20, 40);

    currentPipe.querySelector(".top").style.height = topPipeNewHeight + "%";
    currentPipe.querySelector(".bottom").style.height = `calc(100% - 200px - ${topPipeNewHeight}%)`;
}

function setEventListenerToMoveBirdUp() {
    window.addEventListener("click", moveBirdUp)
}

function setEventListenerToChangePipeHeights() {
    for(let i = 0; i < pipes.length; i++) {
        const currentPipe = pipes[i];

        currentPipe.addEventListener("animationiteration", changeHeightsOfPipe);
    }
}

function setEventListenerToCheckGameOver() {
    gameOverIntervalId = setInterval(() => {
        const blockers = document.querySelectorAll(".top, .bottom");
    
        const birdRect = bird.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();

        for(let i = 0; i < blockers.length; i++) {
            const currentBlocker = blockers[i];

            const blockerRect = currentBlocker.getBoundingClientRect();

            if(
                ((birdRect.right >= blockerRect.left && birdRect.left <= blockerRect.right) && 
                (birdRect.bottom >= blockerRect.top && birdRect.top <= blockerRect.bottom)) || 
                (birdRect.top <= boardRect.top || birdRect.bottom >= boardRect.bottom)
            ) {
                isGameOn = false;
                gameOver();
            }
        }
    }, 100);
}

function stopPipes() {
    for(let i = 0; i < pipes.length; i++) {
        const currentPipe = pipes[i];
        currentPipe.style.animationName = "none";
    }
}

function gameOver() {
    clearInterval(moveBirdDownIntervalId);
    window.removeEventListener("click", moveBirdUp);
    stopPipes();
    clearInterval(gameOverIntervalId);
    overlay.style.display = "flex";
}

function movePipes() {
    for(let i = 0; i < pipes.length; i++) {
        pipes[i].style.animationName = "movePipe";
    }
}

function startGame() {
    overlay.style.display = "none";
    bird.style.top = "50%";
    movePipes();
    moveBirdDown();
    setEventListenerToMoveBirdUp();
    setEventListenerToChangePipeHeights();
    setEventListenerToCheckGameOver();
}

startGameBtn.addEventListener("click", startGame);