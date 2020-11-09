'use strict';

/********** GLOBAL VARIABLES **********/
// the current question number
let currentNum = 0;
// the current score
let score = 0;


/********** TEMPLATE GENERATION FUNCTIONS **********/
// generates HTML for the start screen
function generateStartHtml() {
    return `
    <section class="js-start-page">
    <h2>Test your Freestyle Snowboarding Knowledge</h2>
    <div class="instructions">
        <h3>Instructions:</h3>
        <ul>
            <li>You will be given 10 multiple choice questions pertaining to different snowboarding grab and jib tricks</li>
            <li>All questions must be answered to complete the quiz</li>
        </ul>
    </div>
    <button type="submit" id="startQuiz">Start Quiz</button>
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
                ${generateOptionsHtml()}
                <button type="submit" id="submit-answer">Submit Answer</button>
            </div>
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
        <input type="radio" name="option" id="${i + 1}" value="${option}" required>
        <label for="option${i + 1}">${option}</label>
        `;
        i++;
    });
    return optionsHtml;
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
        $('main').html(generateFinalResultsHtml());
    }
}





function checkAnswer() {
    let selectedOption = $("input[name=option]:checked").val();
    let correctAnswer = STORE.questions[STORE.currentNum].correctAnswer;
    if (!selectedOption) {
        alert('Please select an answer.');
        return;
    } else if (selectedOption === correctAnswer) {
        STORE.score++;
        
    }
    showFeedbackHtml();
}

function showFeedbackHtml() {
    let selectedOption = $("input[name=option]:checked").val();
    let correctAnswer = STORE.questions[STORE.currentNum].correctAnswer;
    // correct answer
    if (selectedOption === correctAnswer) {
        $('#mainContent').html(`
        <section class="js-quiz-answer">
            <h1 class="correct">Correct!</h1>
            <div class="answer-is">The answer is:</div>
			<div>${correctAnswer}</div>
			<br>
			<button type="button" id="continue">Continue</button>
        </section>
        `);
    // wrong answer
    } else {
        $('main').html(`
        <section class="js-quiz-answer">
            <h1 class="correct">Wrong!</h1>
            <div class="answer-is">The correct answer is:</div>
			<div>${correctAnswer}</div>
			<br>
			<button type="button" id="continue">Continue</button>
        </section>
        `);
    }
}







// changes the quiz true to start
function startQuiz() {
    STORE.quizStarted = true;
    console.log('The quiz has started');
}

// goes to next question
function nextQuestion(){
    if (STORE.currentNum < STORE.questions.length) {
      STORE.currentNum++;
    } else if (store.currentNum === STORE.questions.length) {
      STORE.quizStarted = false;
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
        renderQuiz();
    });
}

// function handleNextQuestion() {
//     $('main').on('click', '#continue', event => {
//         event.preventDefault();
//         nextQuestion();
//         renderQuiz();
//     });
// }

// function handleSeeResults() {
    
// }

// function handleRetakeQuiz() {
    
// }


// this will be the main callback function when the page loads
function handleQuizApp() {
    renderQuiz();
    handleStartQuiz();
    handleSubmitAnswer();
    // handleNextQuestion();
    // handleSeeResults();
    // handleRetakeQuiz();
}

// when the page loads, call `handleQuizApp`
$(handleQuizApp);