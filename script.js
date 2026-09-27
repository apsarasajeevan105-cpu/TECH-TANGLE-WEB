// =========================================
// TECH TANGLE - GAME LOGIC
// =========================================

// Game settings
const TIME_LIMIT = 10;
const TOTAL_QUESTIONS = 10;


// =========================================
// QUESTIONS
// =========================================

const questions = [
    "DIODE",
    "CURRENT",
    "BATTERY",
    "OSCILLATOR",
    "TRANSISTOR",
    "IMPEDANCE",
    "SEMICONDUCTOR",
    "MICROCONTROLLER",
    "RADIOFREQUENCY",
    "ELECTROMAGNETIC"
];


// =========================================
// GAME VARIABLES
// =========================================

let questionIndex = 0;
let score = 0;

let timeLeft = TIME_LIMIT;
let timerInterval = null;

let gameRunning = false;
let waitingForNextQuestion = false;


// =========================================
// GET HTML ELEMENTS
// =========================================

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startButton = document.getElementById("start-button");
const playAgainButton = document.getElementById("play-again-button");

const scoreValue = document.getElementById("score-value");
const timerValue = document.getElementById("timer-value");
const timerBar = document.getElementById("timer-bar");

const letterTiles = document.getElementById("letter-tiles");

const answerInput = document.getElementById("answer-input");
const checkButton = document.getElementById("check-button");

const resultBanner = document.getElementById("result-banner");

const finalScore = document.getElementById("final-score");

const progressDots = document.getElementById("progress-dots");


// =========================================
// SHUFFLE WORD
// =========================================

function shuffleWord(word) {

    let letters = word.split("");

    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [letters[i], letters[j]] =
        [letters[j], letters[i]];
    }

    let shuffled = letters.join("");

    // Make sure it is not exactly the original word
    if (shuffled === word && word.length > 1) {

        let temp = letters[0];
        letters[0] = letters[1];
        letters[1] = temp;

        shuffled = letters.join("");
    }

    return shuffled;
}


// =========================================
// CREATE PROGRESS DOTS
// =========================================

function createProgressDots() {

    progressDots.innerHTML = "";

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {

        const dot = document.createElement("div");

        dot.classList.add("progress-dot");

        progressDots.appendChild(dot);
    }
}


// =========================================
// UPDATE PROGRESS DOTS
// =========================================

function updateProgressDots() {

    const dots =
        document.querySelectorAll(".progress-dot");

    dots.forEach((dot, index) => {

        dot.classList.remove("active");
        dot.classList.remove("completed");

        if (index < questionIndex) {

            dot.classList.add("completed");

        } else if (index === questionIndex) {

            dot.classList.add("active");
        }
    });
}


// =========================================
// START GAME
// =========================================

function startGame() {

    // Reset game
    questionIndex = 0;
    score = 0;

    gameRunning = true;
    waitingForNextQuestion = false;

    // Update score
    scoreValue.textContent = score;

    // Hide start screen
    startScreen.classList.add("hidden");

    // Hide end screen
    endScreen.classList.add("hidden");

    // Show game screen
    gameScreen.classList.remove("hidden");

    // Create progress dots
    createProgressDots();

    // Show first question
    showQuestion();
}


// =========================================
// SHOW QUESTION
// =========================================

function showQuestion() {

    if (questionIndex >= TOTAL_QUESTIONS) {

        showEndScreen();

        return;
    }

    gameRunning = true;
    waitingForNextQuestion = false;

    // Clear previous result
    resultBanner.classList.add("hidden");
    resultBanner.classList.remove("result-wrong");

    resultBanner.textContent = "";

    // Enable input and button
    answerInput.disabled = false;
    checkButton.disabled = false;

    // Clear input
    answerInput.value = "";

    // Focus input
    answerInput.focus();

    // Get current word
    const currentWord = questions[questionIndex];

    // Shuffle word
    const shuffledWord = shuffleWord(currentWord);

    // Clear old tiles
    letterTiles.innerHTML = "";

    // Create letter tiles
    for (let letter of shuffledWord) {

        const tile = document.createElement("div");

        tile.classList.add("letter-tile");

        tile.textContent = letter;

        letterTiles.appendChild(tile);
    }

    // Update progress
    updateProgressDots();

    // Reset timer
    startTimer();
}


// =========================================
// START TIMER
// =========================================

function startTimer() {

    // Stop previous timer
    clearInterval(timerInterval);

    timeLeft = TIME_LIMIT;

    updateTimerDisplay();

    timerInterval = setInterval(() => {

        if (!gameRunning) {
            return;
        }

        timeLeft -= 0.1;

        if (timeLeft <= 0) {

            timeLeft = 0;

            updateTimerDisplay();

            clearInterval(timerInterval);

            timeUp();

            return;
        }

        updateTimerDisplay();

    }, 100);
}


// =========================================
// UPDATE TIMER
// =========================================

function updateTimerDisplay() {

    const seconds =
        Math.ceil(timeLeft);

    timerValue.textContent =
        seconds + "s";

    const percentage =
        (timeLeft / TIME_LIMIT) * 100;

    timerBar.style.width =
        percentage + "%";

    // Change timer appearance near the end
    if (timeLeft <= 3) {

        timerValue.style.color = "#FF5555";
        timerBar.style.background = "#FF5555";

    } else {

        timerValue.style.color = "#00FFCC";
        timerBar.style.background = "#00FFCC";
    }
}


// =========================================
// CHECK ANSWER
// =========================================

function checkAnswer() {

    // Prevent multiple clicks
    if (!gameRunning || waitingForNextQuestion) {
        return;
    }

    const userAnswer =
        answerInput.value.trim().toUpperCase();

    // Don't allow empty answer
    if (userAnswer === "") {

        answerInput.focus();

        return;
    }

    const correctAnswer =
        questions[questionIndex];

    // Stop timer
    clearInterval(timerInterval);

    gameRunning = false;
    waitingForNextQuestion = true;

    // Disable input and button
    answerInput.disabled = true;
    checkButton.disabled = true;

    // Check answer
    if (userAnswer === correctAnswer) {

        score++;

        scoreValue.textContent = score;

        showResult(
            "✓ CORRECT! +1",
            false
        );

    } else {

        showResult(
            "✗ WRONG! ANSWER: " + correctAnswer,
            true
        );
    }
}


// =========================================
// TIME UP
// =========================================

function timeUp() {

    if (!gameRunning || waitingForNextQuestion) {
        return;
    }

    gameRunning = false;
    waitingForNextQuestion = true;

    // Disable controls
    answerInput.disabled = true;
    checkButton.disabled = true;

    const correctAnswer =
        questions[questionIndex];

    showResult(
        "TIME UP! ANSWER: " + correctAnswer,
        true
    );
}


// =========================================
// SHOW RESULT
// =========================================

function showResult(message, wrong) {

    resultBanner.textContent = message;

    resultBanner.classList.remove("hidden");

    if (wrong) {

        resultBanner.classList.add("result-wrong");

    } else {

        resultBanner.classList.remove("result-wrong");
    }

    // Wait 1.5 seconds
    setTimeout(() => {

        nextQuestion();

    }, 1500);
}


// =========================================
// NEXT QUESTION
// =========================================

function nextQuestion() {

    questionIndex++;

    if (questionIndex >= TOTAL_QUESTIONS) {

        showEndScreen();

    } else {

        showQuestion();
    }
}


// =========================================
// SHOW END SCREEN
// =========================================

function showEndScreen() {

    clearInterval(timerInterval);

    gameRunning = false;
    waitingForNextQuestion = false;

    // Hide game
    gameScreen.classList.add("hidden");

    // Show end screen
    endScreen.classList.remove("hidden");

    // Show final score
    finalScore.textContent =
        "YOUR SCORE : " + score + " / " + TOTAL_QUESTIONS;
}


// =========================================
// PLAY AGAIN
// =========================================

function playAgain() {

    startGame();
}


// =========================================
// BUTTON EVENTS
// =========================================

startButton.addEventListener(
    "click",
    startGame
);

checkButton.addEventListener(
    "click",
    checkAnswer
);

playAgainButton.addEventListener(
    "click",
    playAgain
);


// =========================================
// ENTER KEY
// =========================================

answerInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            checkAnswer();
        }
    }
);