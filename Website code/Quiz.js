/**
 * PWA Quiz JavaScript
 * Handles quiz submission, scoring, and result display
 */

// Correct answers for each question
const correctAnswers = {
    q1: 'service worker', // Accept variations of this answer
    q2: 'b', // HTTPS
    q3: 'c', // Metadata about the app
    q4: 'b', // Network First
    q5: ['progressive', 'responsive', 'offline', 'installable'] // Multiple correct answers
};

// Points for each question
const questionPoints = {
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 5,
    q5: 10
};

// Total possible points
const totalPoints = 30;
const passingScore = 21; // 70% to pass

/**
 * Handle form submission
 */
document.getElementById('quiz-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get all answers
    const userAnswers = getUserAnswers();
    
    // Calculate score and generate results
    const results = gradeQuiz(userAnswers);
    
    // Display results
    displayResults(results);
    
    // Scroll to results
    document.getElementById('quiz-results').scrollIntoView({ behavior: 'smooth' });
});

/**
 * Get user's answers from the form
 * @returns {Object} User's answers for all questions
 */
function getUserAnswers() {
    const answers = {};
    
    // Question 1: Fill in the blank
    answers.q1 = document.getElementById('q1').value.trim().toLowerCase();
    
    // Question 2: Multiple choice (radio button)
    const q2Selected = document.querySelector('input[name="q2"]:checked');
    answers.q2 = q2Selected ? q2Selected.value : null;
    
    // Question 3: Multiple choice (radio button)
    const q3Selected = document.querySelector('input[name="q3"]:checked');
    answers.q3 = q3Selected ? q3Selected.value : null;
    
    // Question 4: Multiple choice (radio button)
    const q4Selected = document.querySelector('input[name="q4"]:checked');
    answers.q4 = q4Selected ? q4Selected.value : null;
    
    // Question 5: Multiple selection (checkboxes)
    const q5Checkboxes = document.querySelectorAll('input[name="q5"]:checked');
    answers.q5 = Array.from(q5Checkboxes).map(cb => cb.value);
    
    return answers;
}

/**
 * Grade the quiz and calculate scores
 * @param {Object} userAnswers - User's answers
 * @returns {Object} Grading results
 */
function gradeQuiz(userAnswers) {
    const results = {
        totalScore: 0,
        maxScore: totalPoints,
        questionResults: [],
        passed: false
    };
    
    // Grade Question 1 (Fill in the blank)
    const q1Result = gradeQuestion1(userAnswers.q1);
    results.questionResults.push(q1Result);
    results.totalScore += q1Result.score;
    
    // Grade Question 2 (Multiple choice)
    const q2Result = gradeMultipleChoice('q2', userAnswers.q2, correctAnswers.q2, 
        'HTTPS (Hypertext Transfer Protocol Secure)');
    results.questionResults.push(q2Result);
    results.totalScore += q2Result.score;
    
    // Grade Question 3 (Multiple choice)
    const q3Result = gradeMultipleChoice('q3', userAnswers.q3, correctAnswers.q3, 
        'To provide metadata about the app and control how it appears when installed');
    results.questionResults.push(q3Result);
    results.totalScore += q3Result.score;
    
    // Grade Question 4 (Multiple choice)
    const q4Result = gradeMultipleChoice('q4', userAnswers.q4, correctAnswers.q4, 
        'Network First');
    results.questionResults.push(q4Result);
    results.totalScore += q4Result.score;
    
    // Grade Question 5 (Multiple selection)
    const q5Result = gradeMultipleSelection(userAnswers.q5);
    results.questionResults.push(q5Result);
    results.totalScore += q5Result.score;
    
    // Determine if passed
    results.passed = results.totalScore >= passingScore;
    
    return results;
}

/**
 * Grade Question 1 (fill in the blank)
 * @param {string} answer - User's answer
 * @returns {Object} Question result
 */
function gradeQuestion1(answer) {
    const correct = answer === correctAnswers.q1 || 
                   answer === 'serviceworker' || 
                   answer === 'service-worker';
    
    return {
        questionNum: 1,
        correct: correct,
        score: correct ? questionPoints.q1 : 0,
        maxScore: questionPoints.q1,
        userAnswer: answer || '(no answer)',
        correctAnswer: 'service worker'
    };
}

/**
 * Grade multiple choice questions
 * @param {string} questionId - Question identifier
 * @param {string} userAnswer - User's selected answer
 * @param {string} correctAnswer - Correct answer key
 * @param {string} correctAnswerText - Text description of correct answer
 * @returns {Object} Question result
 */
function gradeMultipleChoice(questionId, userAnswer, correctAnswer, correctAnswerText) {
    const questionNum = parseInt(questionId.substring(1));
    const correct = userAnswer === correctAnswer;
    
    return {
        questionNum: questionNum,
        correct: correct,
        score: correct ? questionPoints[questionId] : 0,
        maxScore: questionPoints[questionId],
        userAnswer: userAnswer || '(no answer)',
        correctAnswer: correctAnswerText
    };
}

/**
 * Grade Question 5 (multiple selection)
 * @param {Array} userAnswers - User's selected answers
 * @returns {Object} Question result
 */
function gradeMultipleSelection(userAnswers) {
    const correctSet = new Set(correctAnswers.q5);
    const userSet = new Set(userAnswers);
    
    // Check if user selected exactly the correct answers
    const correct = correctSet.size === userSet.size && 
                   [...correctSet].every(answer => userSet.has(answer));
    
    return {
        questionNum: 5,
        correct: correct,
        score: correct ? questionPoints.q5 : 0,
        maxScore: questionPoints.q5,
        userAnswer: userAnswers.length > 0 ? userAnswers.join(', ') : '(no answer)',
        correctAnswer: 'Progressive, Responsive, Connectivity Independent (Offline), Installable'
    };
}

/**
 * Display quiz results
 * @param {Object} results - Grading results
 */
function displayResults(results) {
    const resultsDiv = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score-display');
    const resultsDetail = document.getElementById('results-detail');
    
    // Calculate percentage
    const percentage = Math.round((results.totalScore / results.maxScore) * 100);
    
    // Display overall score
    const passFailClass = results.passed ? 'pass-result' : 'fail-result';
    const passFailText = results.passed ? 'PASS' : 'FAIL';
    
    scoreDisplay.className = passFailClass;
    scoreDisplay.innerHTML = `
        <div style="font-size: 1.5rem;">${passFailText}</div>
        <div>Your Score: ${results.totalScore} / ${results.maxScore} (${percentage}%)</div>
        <div style="font-size: 1rem; margin-top: 0.5rem;">
            ${results.passed ? 'Congratulations! You passed the quiz!' : 'Keep studying and try again!'}
        </div>
    `;
    
    // Display individual question results
    let detailHTML = '<h2>Detailed Results</h2>';
    
    results.questionResults.forEach(result => {
        const resultClass = result.correct ? 'result-correct' : 'result-incorrect';
        const statusText = result.correct ? '✓ Correct' : '✗ Incorrect';
        const statusClass = result.correct ? 'correct-answer' : 'incorrect-answer';
        
        detailHTML += `
            <div class="result-item ${resultClass}">
                <div class="result-score">
                    Question ${result.questionNum}: ${result.score} / ${result.maxScore} points
                    <span class="${statusClass}" style="margin-left: 1rem;">${statusText}</span>
                </div>
                <div style="margin-top: 0.5rem;">
                    <strong>Your answer:</strong> ${result.userAnswer}
                </div>
                <div style="margin-top: 0.25rem;">
                    <strong>Correct answer:</strong> <span class="correct-answer">${result.correctAnswer}</span>
                </div>
            </div>
        `;
    });
    
    resultsDetail.innerHTML = detailHTML;
    
    // Show results div
    resultsDiv.style.display = 'block';
}

/**
 * Reset the quiz to initial state
 */
function resetQuiz() {
    // Clear form inputs
    document.getElementById('quiz-form').reset();
    
    // Hide results
    document.getElementById('quiz-results').style.display = 'none';
    
    // Scroll to top of quiz
    document.getElementById('quiz-form').scrollIntoView({ behavior: 'smooth' });
    
    // Optional: Show confirmation
    // alert('Quiz has been reset. Good luck!');
}