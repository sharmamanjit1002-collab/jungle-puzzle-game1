"use strict";


/* =========================================
   GAME SETTINGS
========================================= */

const TOTAL_LEVELS = 100;

const QUESTIONS_PER_LEVEL = 10;

const TOTAL_QUESTIONS =
    TOTAL_LEVELS * QUESTIONS_PER_LEVEL;

const POINTS_PER_QUESTION = 10;

const STARTING_LIVES = 3;

const QUESTION_TIME = 20;


/* =========================================
   GAME STATE
========================================= */

let questions = [];

let currentQuestion = 0;

let score = 0;

let lives = STARTING_LIVES;

let selectedAnswer = null;

let submitted = false;

let timer = null;

let timeLeft = QUESTION_TIME;

let gameSoundOn = true;

let backgroundSoundOn = true;


/* =========================================
   HTML ELEMENTS
========================================= */

const levelEl =
    document.getElementById("level");

const scoreEl =
    document.getElementById("score");

const livesEl =
    document.getElementById("lives");

const questionNumberEl =
    document.getElementById(
        "questionNumber"
    );

const timerEl =
    document.getElementById("timer");

const timerBarEl =
    document.getElementById(
        "timerBar"
    );

const questionTextEl =
    document.getElementById(
        "questionText"
    );

const puzzleEl =
    document.getElementById("puzzle");

const answersEl =
    document.getElementById("answers");

const messageEl =
    document.getElementById("message");

const submitBtn =
    document.getElementById(
        "submitBtn"
    );

const nextBtn =
    document.getElementById(
        "nextBtn"
    );

const gameOverEl =
    document.getElementById(
        "gameOver"
    );

const levelCompleteEl =
    document.getElementById(
        "levelComplete"
    );

const winScreenEl =
    document.getElementById(
        "winScreen"
    );

const finalScoreEl =
    document.getElementById(
        "finalScore"
    );

const winScoreEl =
    document.getElementById(
        "winScore"
    );

const continueBtn =
    document.getElementById(
        "continueBtn"
    );

const restartBtn =
    document.getElementById(
        "restartBtn"
    );

const winRestartBtn =
    document.getElementById(
        "winRestartBtn"
    );

const backgroundSoundBtn =
    document.getElementById(
        "backgroundSoundBtn"
    );

const gameSoundBtn =
    document.getElementById(
        "gameSoundBtn"
    );


/* =========================================
   AUDIO
========================================= */

const jungleSound =
    document.getElementById(
        "jungleSound"
    );

const elephantSound =
    document.getElementById(
        "elephantSound"
    );

const monkeySound =
    document.getElementById(
        "monkeySound"
    );

const tigerSound =
    document.getElementById(
        "tigerSound"
    );


/* =========================================
   RANDOM NUMBER
========================================= */

function random(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}


/* =========================================
   CREATE ANSWERS
========================================= */

function makeAnswers(correct, level) {

    const answerSet =
        new Set();

    answerSet.add(correct);


    let difference =
        Math.max(
            2,
            Math.floor(level / 10) + 1
        );


    let attempts = 0;


    while (
        answerSet.size < 4 &&
        attempts < 100
    ) {

        attempts++;


        let wrong;


        const method =
            random(1, 4);


        if (method === 1) {

            wrong =
                correct +
                random(1, 4 + difference);

        } else if (method === 2) {

            wrong =
                correct -
                random(1, 4 + difference);

        } else if (method === 3) {

            wrong =
                correct +
                random(5, 10 + difference);

        } else {

            wrong =
                correct -
                random(5, 10 + difference);
        }


        if (wrong < 0) {
            wrong =
                Math.abs(wrong);
        }


        if (wrong !== correct) {
            answerSet.add(wrong);
        }
    }


    /*
       Safety fallback
    */

    let number =
        correct + 1;


    while (answerSet.size < 4) {

        if (
            !answerSet.has(number)
        ) {
            answerSet.add(number);
        }

        number++;
    }


    const options =
        shuffle(
            [...answerSet]
        );


    return {
        options: options,
        answer:
            options.indexOf(correct)
    };
}


/* =========================================
   ADDITION
========================================= */

function addition(level) {

    const max =
        20 + level * 4;


    const a =
        random(
            5,
            max
        );

    const b =
        random(
            5,
            max
        );


    const correct =
        a + b;


    const result =
        makeAnswers(
            correct,
            level
        );


    return {

        type: "addition",

        text:
            `${a} + ${b} = ?`,

        question:
            "Add the numbers.",

        options:
            result.options,

        answer:
            result.answer
    };
}


/* =========================================
   SUBTRACTION
========================================= */

function subtraction(level) {

    const max =
        20 + level * 4;


    let a =
        random(
            10,
            max
        );

    let b =
        random(
            1,
            max
        );


    if (b > a) {
        [a, b] = [b, a];
    }


    const correct =
        a - b;


    const result =
        makeAnswers(
            correct,
            level
        );


    return {

        type: "subtraction",

        text:
            `${a} - ${b} = ?`,

        question:
            "Subtract the smaller number from the larger number.",

        options:
            result.options,

        answer:
            result.answer
    };
}


/* =========================================
   MULTIPLICATION
========================================= */

function multiplication(level) {

    const max =
        Math.min(
            20,
            4 + Math.floor(level / 4)
        );


    const a =
        random(
            2,
            max
        );

    const b =
        random(
            2,
            max
        );


    const correct =
        a * b;


    const result =
        makeAnswers(
            correct,
            level
        );


    return {

        type: "multiplication",

        text:
            `${a} × ${b} = ?`,

        question:
            "Multiply the numbers.",

        options:
            result.options,

        answer:
            result.answer
    };
}


/* =========================================
   DIVISION
========================================= */

function division(level) {

    const divisor =
        random(
            2,
            Math.min(
                12,
                3 + Math.floor(level / 8)
            )
        );


    const answer =
        random(
            2,
            5 + Math.floor(level / 5)
        );


    const dividend =
        divisor * answer;


    const result =
        makeAnswers(
            answer,
            level
        );


    return {

        type: "division",

        text:
            `${dividend} ÷ ${divisor} = ?`,

        question:
            "Divide the numbers.",

        options:
            result.options,

        answer:
            result.answer
    };
}


/* =========================================
   ADDITION SEQUENCE
========================================= */

function additionSequence(level) {

    const step =
        random(
            1,
            Math.min(
                15,
                2 + Math.floor(level / 8)
            )
        );


    const start =
        random(
            1,
            20 + level
        );


    const numbers = [];


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        numbers.push(
            start + step * i
        );
    }


    const correct =
        start + step * 4;


    const result =
        makeAnswers(
            correct,
            level
        );


    return {

        type: "sequence",

        text:
            `${numbers.join(", ")}, ?`,

        question:
            `What comes next? Add ${step} each time.`,

        options:
            result.options,

        answer:
            result.answer
    };
}


/* =========================================
   SUBTRACTION SEQUENCE
========================================= */

function subtractionSequence(level) {

    const step =
        random(
            1,
            Math.min(
                12,
                2 + Math.floor(level / 8)
            )
        );


    const start =
        random(
            20,
            50 + level
        );


    const numbers = [];


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        numbers.push(
            start - step * i
        );
    }


    const correct =
        start - step * 4;


    const result =
        makeAnswers(
            correct,
            level
        );


    return {

        type: "sequence",

        text:
            `${numbers.join(", ")}, ?`,

        question:
            `What comes next? Subtract ${step} each time.`,

        options:
            result.options,

        answer:
            result.answer
    };
}


/* =========================================
   SQUARE SEQUENCE
========================================= */

function squareSequence(level) {

    const start =
        random(
            1,
            Math.min(
                12,
                3 + Math.floor(level / 15)
            )
        );


    const numbers = [];


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const n =
            start + i;

        numbers.push(
            n * n
        );
    }


    const next =
        start + 4;


    const correct =
        next * next;


    const result =
        makeAnswers(
            correct,
            level
        );


    return {

        type: "square",

        text:
            `${numbers.join(", ")}, ?`,

        question:
            "Find the next square number.",

        options:
            result.options,

        answer:
            result.answer
    };
}


/* =========================================
   MISSING NUMBER
========================================= */

function missingNumber(level) {

    const a =
        random(
            5,
            20 + level
        );


    const b =
        random(
            2,
            15 + Math.floor(level / 2)
        );


    const total =
        a + b;


    const result =
        makeAnswers(
            b,
            level
        );


    return {

        type: "missing",

        text:
            `${a} + ? = ${total}`,

        question:
            "Find the missing number.",

        options:
            result.options,

        answer:
            result.answer
    };
}


/* =========================================
   CREATE ONE QUESTION
========================================= */

function createQuestion(level, number) {

    /*
       Levels 1-10
       Easy
    */

    if (level <= 10) {

        const types = [
            addition,
            subtraction,
            additionSequence
        ];


        return types[
            number % types.length
        ](level);
    }


    /*
       Levels 11-25
       Medium
    */

    if (level <= 25) {

        const types = [
            addition,
            subtraction,
            multiplication,
            division,
            additionSequence,
            subtractionSequence
        ];


        return types[
            number % types.length
        ](level);
    }


    /*
       Levels 26-50
       Hard
    */

    if (level <= 50) {

        const types = [
            addition,
            subtraction,
            multiplication,
            division,
            additionSequence,
            subtractionSequence,
            squareSequence,
            missingNumber
        ];


        return types[
            number % types.length
        ](level);
    }


    /*
       Levels 51-100
       Expert
    */

    const types = [
        addition,
        subtraction,
        multiplication,
        division,
        additionSequence,
        subtractionSequence,
        squareSequence,
        missingNumber
    ];


    return types[
        random(
            0,
            types.length - 1
        )
    ](level);
}


/* =========================================
   GENERATE 1000 QUESTIONS
========================================= */

function generateQuestions() {

    questions = [];


    /*
       We keep question signatures
       to reduce duplicates.
    */

    const used =
        new Set();


    for (
        let level = 1;
        level <= TOTAL_LEVELS;
        level++
    ) {

        for (
            let q = 0;
            q < QUESTIONS_PER_LEVEL;
            q++
        ) {

            let question;

            let attempts = 0;


            do {

                question =
                    createQuestion(
                        level,
                        q
                    );

                attempts++;


                /*
                   Include type + puzzle
                   in the signature.
                */

                const signature =
                    question.type +
                    "|" +
                    question.text;


                if (
                    !used.has(signature)
                ) {

                    used.add(signature);

                    break;
                }


                /*
                   If duplicate,
                   generate again.
                */

            } while (
                attempts < 100
            );


            question.level =
                level;

            question.number =
                q + 1;


            questions.push(
                question
            );
        }
    }


    console.log(
        "Questions created:",
        questions.length
    );
}


/* =========================================
   UPDATE LIVES
========================================= */

function updateLives() {

    let text = "";


    for (
        let i = 0;
        i < STARTING_LIVES;
        i++
    ) {

        if (i < lives) {

            text += "❤️ ";

        } else {

            text += "🖤 ";
        }
    }


    livesEl.textContent =
        text.trim();
}


/* =========================================
   LOAD QUESTION
========================================= */

function loadQuestion() {

    clearInterval(timer);


    const question =
        questions[
            currentQuestion
        ];


    if (!question) {

        showWin();

        return;
    }


    selectedAnswer = null;

    submitted = false;


    nextBtn.disabled = true;

    submitBtn.disabled = false;


    messageEl.textContent =
        "";


    levelEl.textContent =
        question.level;


    questionNumberEl.textContent =
        question.number;


    questionTextEl.textContent =
        question.question;


    puzzleEl.textContent =
        question.text;


    /*
       Clear old buttons
    */

    answersEl.innerHTML =
        "";


    /*
       Create four answer buttons
    */

    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "answer-button";


            button.innerHTML = `
                <span class="answer-letter">
                    ${String.fromCharCode(65 + index)}
                </span>

                <span class="answer-text">
                    ${option}
                </span>
            `;


            button.addEventListener(
                "click",
                function () {

                    selectAnswer(
                        index
                    );
                }
            );


            answersEl.appendChild(
                button
            );
        }
    );


    startTimer();
}


/* =========================================
   SELECT ANSWER
========================================= */

function selectAnswer(index) {

    if (submitted) {
        return;
    }


    selectedAnswer =
        index;


    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(
        button => {

            button.classList.remove(
                "selected"
            );
        }
    );


    const selected =
        buttons[index];


    if (selected) {

        selected.classList.add(
            "selected"
        );
    }
}


/* =========================================
   SUBMIT ANSWER
========================================= */

function submitAnswer() {

    if (submitted) {
        return;
    }


    if (
        selectedAnswer === null
    ) {

        messageEl.textContent =
            "⚠️ Select an answer first.";

        return;
    }


    submitted = true;


    clearInterval(timer);


    submitBtn.disabled = true;


    const question =
        questions[
            currentQuestion
        ];


    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;
        }
    );


    /*
       CORRECT
    */

    if (
        selectedAnswer ===
        question.answer
    ) {

        score +=
            POINTS_PER_QUESTION;


        scoreEl.textContent =
            score;


        buttons[
            question.answer
        ].classList.add(
            "correct"
        );


        messageEl.textContent =
            "🐘 Correct! +10 points";


        playGameSound(
            elephantSound
        );


        /*
           Check if this was
           the last question
           of a level.
        */

        if (
            question.number ===
            QUESTIONS_PER_LEVEL
        ) {

            nextBtn.disabled =
                false;

        } else {

            nextBtn.disabled =
                false;
        }

    }


    /*
       WRONG
    */

    else {

        buttons[
            selectedAnswer
        ].classList.add(
            "wrong"
        );


        buttons[
            question.answer
        ].classList.add(
            "correct"
        );


        lives--;


        updateLives();


        messageEl.textContent =
            "🐒 Wrong answer! You lost 1 life.";


        playGameSound(
            monkeySound
        );


        if (lives <= 0) {

            nextBtn.disabled =
                true;


            setTimeout(
                showGameOver,
                800
            );


            return;
        }


        nextBtn.disabled =
            false;
    }
}


/* =========================================
   NEXT QUESTION
========================================= */

function nextQuestion() {

    if (!submitted) {
        return;
    }


    playGameSound(
        tigerSound
    );


    const oldQuestion =
        questions[
            currentQuestion
        ];


    /*
       Last question of level
    */

    if (
        oldQuestion.number ===
        QUESTIONS_PER_LEVEL
    ) {

        const currentLevel =
            oldQuestion.level;


        if (
            currentLevel >=
            TOTAL_LEVELS
        ) {

            currentQuestion++;

            showWin();

            return;
        }


        /*
           Show level complete screen
        */

        levelCompleteEl.classList.add(
            "show"
        );


        return;
    }


    currentQuestion++;


    loadQuestion();
}


/* =========================================
   CONTINUE TO NEXT LEVEL
========================================= */

function continueToNextLevel() {

    levelCompleteEl.classList.remove(
        "show"
    );


    currentQuestion++;


    loadQuestion();
}


/* =========================================
   TIMER
========================================= */

function startTimer() {

    clearInterval(timer);


    timeLeft =
        QUESTION_TIME;


    updateTimer();


    timer =
        setInterval(
            function () {

                timeLeft--;


                updateTimer();


                if (
                    timeLeft <= 0
                ) {

                    clearInterval(timer);


                    timeUp();
                }

            },
            1000
        );
}


/* =========================================
   UPDATE TIMER
========================================= */

function updateTimer() {

    timerEl.textContent =
        timeLeft;


    const percentage =
        (
            timeLeft /
            QUESTION_TIME
        ) * 100;


    timerBarEl.style.width =
        percentage + "%";
}


/* =========================================
   TIME UP
========================================= */

function timeUp() {

    if (submitted) {
        return;
    }


    submitted = true;


    submitBtn.disabled =
        true;


    const question =
        questions[
            currentQuestion
        ];


    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;
        }
    );


    /*
       Show correct answer
    */

    buttons[
        question.answer
    ].classList.add(
        "correct"
    );


    lives--;


    updateLives();


    messageEl.textContent =
        "⏰ Time's up! You lost 1 life.";


    playGameSound(
        monkeySound
    );


    if (lives <= 0) {

        nextBtn.disabled =
            true;


        setTimeout(
            showGameOver,
            800
        );


        return;
    }


    nextBtn.disabled =
        false;
}


/* =========================================
   GAME OVER
========================================= */

function showGameOver() {

    clearInterval(timer);


    finalScoreEl.textContent =
        score;


    gameOverEl.classList.add(
        "show"
    );


    levelCompleteEl.classList.remove(
        "show"
    );


    winScreenEl.classList.remove(
        "show"
    );
}


/* =========================================
   WIN
========================================= */

function showWin() {

    clearInterval(timer);


    winScoreEl.textContent =
        score;


    winScreenEl.classList.add(
        "show"
    );


    gameOverEl.classList.remove(
        "show"
    );


    levelCompleteEl.classList.remove(
        "show"
    );
}


/* =========================================
   RESTART
========================================= */

function restartGame() {

    clearInterval(timer);


    currentQuestion = 0;

    score = 0;

    lives =
        STARTING_LIVES;

    selectedAnswer =
        null;

    submitted =
        false;


    scoreEl.textContent =
        "0";


    updateLives();


    gameOverEl.classList.remove(
        "show"
    );


    levelCompleteEl.classList.remove(
        "show"
    );


    winScreenEl.classList.remove(
        "show"
    );


    generateQuestions();


    loadQuestion();
}


/* =========================================
   GAME SOUND
========================================= */

function playGameSound(sound) {

    if (!gameSoundOn) {
        return;
    }


    if (!sound) {
        return;
    }


    sound.currentTime = 0;


    sound.play().catch(
        function () {}
    );
}


/* =========================================
   BACKGROUND SOUND
========================================= */

function playBackgroundSound() {

    if (!backgroundSoundOn) {
        return;
    }


    if (!jungleSound) {
        return;
    }


    jungleSound.volume =
        0.25;


    jungleSound.play().catch(
        function () {}
    );
}


/* =========================================
   BACKGROUND SOUND BUTTON
========================================= */

backgroundSoundBtn.addEventListener(
    "click",
    function () {

        backgroundSoundOn =
            !backgroundSoundOn;


        if (
            backgroundSoundOn
        ) {

            backgroundSoundBtn.textContent =
                "🎵 Jungle Sound ON";


            playBackgroundSound();

        } else {

            backgroundSoundBtn.textContent =
                "🔇 Jungle Sound OFF";


            jungleSound.pause();
        }
    }
);


/* =========================================
   GAME SOUND BUTTON
========================================= */

gameSoundBtn.addEventListener(
    "click",
    function () {

        gameSoundOn =
            !gameSoundOn;


        if (gameSoundOn) {

            gameSoundBtn.textContent =
                "🔊 Game Sound ON";

        } else {

            gameSoundBtn.textContent =
                "🔇 Game Sound OFF";
        }
    }
);


/* =========================================
   START BACKGROUND MUSIC
   AFTER USER TOUCH/CLICK
========================================= */

document.addEventListener(
    "click",
    function startMusicOnce() {

        playBackgroundSound();

        document.removeEventListener(
            "click",
            startMusicOnce
        );

    }
);


/* =========================================
   BUTTON EVENTS
========================================= */

submitBtn.addEventListener(
    "click",
    submitAnswer
);


nextBtn.addEventListener(
    "click",
    nextQuestion
);


continueBtn.addEventListener(
    "click",
    continueToNextLevel
);


restartBtn.addEventListener(
    "click",
    restartGame
);


winRestartBtn.addEventListener(
    "click",
    restartGame
);


/* =========================================
   START GAME
========================================= */

function startGame() {

    generateQuestions();

    updateLives();

    loadQuestion();
}


startGame();