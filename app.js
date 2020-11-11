'use strict';

/********** GLOBAL VARIABLES **********/
// the current question number
let currentNum = 0;
// the current score
let score = 0;


// changes the quiz to true to start the quiz
function startQuiz() {
    STORE.quizStarted = true;
    console.log('The quiz has started');
}

// changes global variables back to default and quiz to false 
function retakeQuiz() {
    STORE.quizStarted = false;
    STORE.currentNum = 0;
    STORE.score = 0;
}


/********** TEMPLATE GENERATION FUNCTIONS **********/
// generates HTML for the start screen
function generateStartHtml() {
    return `
    <section class="js-start-page">
    <header>
        <h1>Name that Snowboarding Trick!</h1>
    </header>
    <h2 class="header-test">Test your Freestyle Snowboarding Knowledge</h2>
    <div class="instructions">
    <form>
        <h3 class="rules">Instructions:</h3>
        <ul>
            <li>You will be given 10 multiple choice questions pertaining to different snowboarding grab and jib tricks</li>
            <li>All questions must be answered to complete the quiz</li>
        </ul>
    </div>
    <button type="button" id="startQuiz" autofocus>Start Quiz</button>
    </form>
    </section>
    `;
}

// generates HTML for current question number and score
function generateQuizStatusHtml() {
    return `
    <section class="js-quiz-page">
    <div class="status">
        <div class="quiz-number">
            Question ${STORE.currentNum + 1}/${STORE.questions.length}
        </div>
        <div class="quiz-score">
            Score: ${STORE.score}/${STORE.questions.length}
        </div>
    </div>
    `;
}

// generates HTML for current question
function generateQuestionHtml() {
    let currentNum = STORE.questions[STORE.currentNum];
    return `
    <form id="quiz-question">
        <fieldset>
        <div class="question">
            <legend>${currentNum.question}</legend>
        </div>
            <div class="quiz-options">
                ${generateOptionsHtml()} <br>
            </div>
            <button type="submit" id="submit-answer">Submit Answer</button>
        </fieldset>
    </form>
    </section>
    `;
}

// generates HTML for the list of options as answer
function generateOptionsHtml() {
    const optionsArray = STORE.questions[STORE.currentNum].answers;
    let optionsHtml = '';
    let i = 0;

    optionsArray.forEach(option => {
        optionsHtml += `
        <div class="wrapper-option">
            <input type="radio" name="option" id="${i + 1}" value="${option}" tabindex ="${i + 1}" required>
            <label for="option${i + 1}" class="option">${option}</label>
        </div> <br>
        `;
        i++;
    });
    return optionsHtml;
}

// generates HTML for the final results page
function generateFinalResultsHtml() {
    return `
    <section class="js-quiz-results">
    <form>
        <img src="photos/snowboarder-yellow.png" class="snowboarder" alt="snowboarder">
        <h1 class="result-heading">Your Final Score</h1>
        <div class="scores">
            <div class="final-score">${STORE.score}</div>
            <img src="photos/snowboard.png" class="snowboard" alt="snowboard">
            <div class="final-score">${STORE.questions.length}</div>
        </div>
        <div class="results-message">
            ${generateResultsText()}
        </div>
        <br>
        <button type="button" id="retake" autofocus>Retake Quiz</button>
    </form>
    </section>
    `;
}

// provides feedback message based on final score
function generateResultsText() {
    let score = STORE.score;
    if (score >= 0 && score <= 3) 
        return `Do you even snowboard? <br>
                Why don't you try again`;

    if (score >= 4 && score <=6 )
        return `You performance was decent <br>
                But there is still room for improvement`;

    if (score >= 7 && score <=9 )
        return `You almost got it! <br>
                Would you like to retake the quiz?`;
    
    if (score === 10)
        return `CONGRATULATIONS! You stomped the landing for a perfect score. <br>`;
}


/********** RENDER FUNCTION(S) **********/
// this function conditionally replaces the contents of the <main> tag based on the state of the store
function renderQuiz() {
    let html = '';
    if (STORE.quizStarted === false) {
        $('main').html(generateStartHtml());
        return;
    } 
    else if (STORE.currentNum >= 0 && STORE.currentNum < STORE.questions.length) {
        html = generateQuizStatusHtml();
        html += generateQuestionHtml();
        $('main').html(html);
    }
    else {
        html = generateFinalResultsHtml();
        $('main').html(html);
        // $('main').html(generateFinalResultsHtml());
    }
}


// checks to see if option selected is the correct answer
function checkAnswer() {
    let selectedOption = $("input[name=option]:checked").val();
    if (!selectedOption) {
        alert('Please select an answer.');
        return;
    }
    showFeedbackHtml();
}

// generates HTML on whether option selected is correct/incorrect
function showFeedbackHtml() {
    let selectedOption = $("input[name=option]:checked").val();
    let correctAnswer = STORE.questions[STORE.currentNum].correctAnswer;
    // correct answer
    if (selectedOption === correctAnswer) {
        STORE.score++;
        $('main').html(`
        <section class="js-quiz-answer">
        <form>
            <h1 class="correct">Correct!</h1>
            <div class="answer-is">The correct answer is:</div>
			<div class="answer">${correctAnswer}</div>
			<br>
            <button type="button" id="continue" autofocus>Continue</button>
        </form>
        </section>
        `);
    // wrong answer
    } else {
        $('main').html(`
        <section class="js-quiz-answer">
        <form>
            <h1 class="correct">Wrong!</h1>
            <div class="answer-is">The correct answer is:</div>
			<div class="answer">${correctAnswer}</div>
			<br>
            <button type="button" id="continue" autofocus>Continue</button>
        </form>
        </section>
        `);
    }
}


/********** EVENT HANDLER FUNCTIONS **********/
function handleStartQuiz() {
    $('main').on('click', '#startQuiz', event => {
        event.preventDefault();
        startQuiz()
        renderQuiz();
    });
}

function handleSubmitAnswer() {
    $('main').on('click', '#submit-answer', event => {
        event.preventDefault();
        checkAnswer();
    });
}

function handleNextQuestion() {
    $('main').on('click', '#continue', event => {
        event.preventDefault();      
        STORE.currentNum++;
        renderQuiz();
    });
}

function handleRetakeQuiz() {
    $('main').on('click', '#retake', event => {
        event.preventDefault();
        retakeQuiz();
        renderQuiz();
    });
}


// this will be the main callback function when the page loads
function handleQuizApp() {
    renderQuiz();
    handleStartQuiz();
    handleSubmitAnswer();
    handleNextQuestion();
    handleRetakeQuiz();
}

// when the page loads, call `handleQuizApp`
$(handleQuizApp);