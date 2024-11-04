async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple');
    const data = await response.json();
    return data.results;
}

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');

async function startQuiz() {
    questions = await fetchQuestions();
    currentQuestionIndex = 0;
    score = 0;
    nextButton.classList.add('hide');
    showQuestion();
}

function showQuestion() {
    resetState();
    const questionData = questions[currentQuestionIndex];
    questionElement.innerText = questionData.question;

    const answers = [...questionData.incorrect_answers];
    answers.splice(Math.floor(Math.random() * (answers.length + 1)), 0, questionData.correct_answer);

    answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(button, questionData.correct_answer));
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(selectedButton, correctAnswer) {
    const isCorrect = selectedButton.innerText === correctAnswer;
    if (isCorrect) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.innerText === correctAnswer) {
                button.classList.add('correct');
            }
        });
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });
    nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    resetState();
    questionElement.innerText = `Quiz finished! You scored ${score} out of ${questions.length}.`;
    nextButton.innerText = 'Restart';
    nextButton.classList.remove('hide');
    nextButton.addEventListener('click', startQuiz);
}

startQuiz();
