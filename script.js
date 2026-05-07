     // Quiz Data
    const quizData = [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Au", "Ag", "Gd"],
        correct: 1,
        explanation: "Au comes from the Latin word 'aurum' meaning gold."
      },
      {
        question: "Which planet has the most moons in our solar system?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 1,
        explanation: "Saturn has 146 confirmed moons, surpassing Jupiter's 95."
      },
      {
        question: "What year did the World Wide Web become publicly available?",
        options: ["1989", "1991", "1993", "1995"],
        correct: 1,
        explanation: "Tim Berners-Lee made the WWW publicly available on August 6, 1991."
      },
      {
        question: "Which element has the atomic number 1?",
        options: ["Helium", "Lithium", "Hydrogen", "Carbon"],
        correct: 2,
        explanation: "Hydrogen is the lightest and most abundant element in the universe."
      },
      {
        question: "What is the largest organ in the human body?",
        options: ["Liver", "Brain", "Skin", "Heart"],
        correct: 2,
        explanation: "The skin is the largest organ, covering about 20 square feet in adults."
      },
      {
        question: "Who painted 'The Starry Night'?",
        options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Salvador Dalí"],
        correct: 1,
        explanation: "Van Gogh painted it in 1889 while staying at a mental asylum in Saint-Rémy-de-Provence."
      },
      {
        question: "What is the speed of light in a vacuum (approximately)?",
        options: ["300,000 m/s", "300,000 km/s", "150,000 km/s", "1,080,000 km/h"],
        correct: 1,
        explanation: "Light travels at approximately 299,792 kilometers per second in a vacuum."
      },
      {
        question: "Which programming language was created by Brendan Eich in 1995?",
        options: ["Python", "Java", "JavaScript", "Ruby"],
        correct: 2,
        explanation: "Brendan Eich created JavaScript in just 10 days while working at Netscape."
      },
      {
        question: "What is the deepest ocean trench?",
        options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Philippine Trench"],
        correct: 2,
        explanation: "The Mariana Trench reaches a depth of about 11,034 meters (36,201 feet)."
      },
      {
        question: "Which country has the most UNESCO World Heritage Sites?",
        options: ["China", "Italy", "Spain", "France"],
        correct: 1,
        explanation: "Italy has 59 UNESCO World Heritage Sites, followed closely by China with 57."
      }
    ];

    // State
    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;
    let answered = false;
    let userAnswers = [];

    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const reviewScreen = document.getElementById('review-screen');

    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const reviewBtn = document.getElementById('review-btn');
    const backToResultsBtn = document.getElementById('back-to-results');

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentNum = document.getElementById('current-num');
    const totalNum = document.getElementById('total-num');
    const progressBar = document.getElementById('progress-bar');
    const feedback = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');

    const scoreValue = document.getElementById('score-value');
    const scoreRingFill = document.getElementById('score-ring-fill');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const correctCount = document.getElementById('correct-count');
    const incorrectCount = document.getElementById('incorrect-count');
    const accuracyValue = document.getElementById('accuracy-value');

    const reviewContainer = document.getElementById('review-container');

    // Initialize
    totalNum.textContent = quizData.length;

    // Event Listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    reviewBtn.addEventListener('click', showReview);
    backToResultsBtn.addEventListener('click', backToResults);

    // Functions
    function startQuiz() {
      currentQuestion = 0;
      score = 0;
      userAnswers = [];
      
      startScreen.classList.add('hidden');
      quizScreen.classList.remove('hidden');
      resultsScreen.classList.add('hidden');
      reviewScreen.classList.add('hidden');
      
      loadQuestion();
    }

    function loadQuestion() {
      answered = false;
      selectedAnswer = null;
      nextBtn.disabled = true;
      feedback.classList.add('hidden');
      
      const q = quizData[currentQuestion];
      
      // Update progress
      currentNum.textContent = currentQuestion + 1;
      const progress = ((currentQuestion + 1) / quizData.length) * 100;
      progressBar.style.width = `${progress}%`;
      
      // Update question
      questionText.textContent = q.question;
      questionText.classList.add('animate-slide-up');
      
      // Clear and populate options
      optionsContainer.innerHTML = '';
      const labels = ['A', 'B', 'C', 'D'];
      
      q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn animate-slide-in-right';
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.style.opacity = '0';
        btn.innerHTML = `
          <span class="option-label">${labels[index]}</span>
          <span>${option}</span>
        `;
        btn.addEventListener('click', () => selectAnswer(index, btn));
        optionsContainer.appendChild(btn);
      });
      
      // Clear animation classes after animation
      setTimeout(() => {
        questionText.classList.remove('animate-slide-up');
      }, 600);
    }

    function selectAnswer(index, btn) {
      if (answered) return;
      
      answered = true;
      selectedAnswer = index;
      
      const q = quizData[currentQuestion];
      const isCorrect = index === q.correct;
      
      // Store answer
      userAnswers.push({
        question: q.question,
        userAnswer: index,
        correctAnswer: q.correct,
        isCorrect: isCorrect,
        options: q.options,
        explanation: q.explanation
      });
      
      if (isCorrect) {
        score++;
        btn.classList.add('correct');
        showFeedback(true, q.explanation);
      } else {
        btn.classList.add('incorrect');
        // Show correct answer
        optionsContainer.children[q.correct].classList.add('correct');
        showFeedback(false, q.explanation);
      }
      
      // Disable all options
      Array.from(optionsContainer.children).forEach(b => b.disabled = true);
      
      // Enable next button
      nextBtn.disabled = false;
      
      // Update button text for last question
      if (currentQuestion === quizData.length - 1) {
        nextBtn.innerHTML = `
          See Results
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        `;
      }
    }

    function showFeedback(isCorrect, explanation) {
      feedback.classList.remove('hidden');
      feedback.style.background = isCorrect ? 'rgba(0, 217, 160, 0.1)' : 'rgba(255, 87, 87, 0.1)';
      feedback.style.border = `1px solid ${isCorrect ? 'var(--correct)' : 'var(--incorrect)'}`;
      feedbackText.innerHTML = `
        <span style="color: ${isCorrect ? 'var(--correct)' : 'var(--incorrect)'}">${isCorrect ? 'Correct!' : 'Incorrect'}</span>
        <span class="text-[var(--muted)] text-sm block mt-1">${explanation}</span>
      `;
    }

    function nextQuestion() {
      currentQuestion++;
      
      if (currentQuestion >= quizData.length) {
        showResults();
      } else {
        loadQuestion();
      }
    }

    function showResults() {
      quizScreen.classList.add('hidden');
      resultsScreen.classList.remove('hidden');
      
      // Animate score
      const percentage = (score / quizData.length) * 100;
      
      // Update stats
      correctCount.textContent = score;
      incorrectCount.textContent = quizData.length - score;
      accuracyValue.textContent = `${Math.round(percentage)}%`;
      
      // Animate score ring
      const circumference = 2 * Math.PI * 80; // radius = 80
      const offset = circumference - (percentage / 100) * circumference;
      
      setTimeout(() => {
        scoreRingFill.style.strokeDashoffset = offset;
      }, 100);
      
      // Animate score counter
      animateCounter(scoreValue, score, 1000);
      
      // Set result message
      if (percentage >= 80) {
        resultTitle.textContent = "Outstanding!";
        resultMessage.textContent = "You're a knowledge champion!";
      } else if (percentage >= 60) {
        resultTitle.textContent = "Great Job!";
        resultMessage.textContent = "You have a solid knowledge base.";
      } else if (percentage >= 40) {
        resultTitle.textContent = "Good Effort!";
        resultMessage.textContent = "Keep learning and improving.";
      } else {
        resultTitle.textContent = "Keep Trying!";
        resultMessage.textContent = "Every attempt makes you smarter.";
      }
    }

    function animateCounter(element, target, duration) {
      let start = 0;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      
      requestAnimationFrame(update);
    }

    function showReview() {
      resultsScreen.classList.add('hidden');
      reviewScreen.classList.remove('hidden');
      
      reviewContainer.innerHTML = '';
      
      userAnswers.forEach((answer, index) => {
        const labels = ['A', 'B', 'C', 'D'];
        const item = document.createElement('div');
        item.className = 'quiz-card p-5 animate-slide-up';
        item.style.animationDelay = `${index * 0.05}s`;
        item.style.opacity = '0';
        
        item.innerHTML = `
          <div class="flex items-start gap-3 mb-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold ${answer.isCorrect ? 'bg-[var(--correct)] text-[var(--bg)]' : 'bg-[var(--incorrect)] text-white'}">
              ${index + 1}
            </span>
            <p class="font-medium leading-snug">${answer.question}</p>
          </div>
          <div class="ml-10 space-y-2 text-sm">
            <p>
              <span class="text-[var(--muted)]">Your answer:</span> 
              <span class="${answer.isCorrect ? 'text-[var(--correct)]' : 'text-[var(--incorrect)]'}">${labels[answer.userAnswer]}. ${answer.options[answer.userAnswer]}</span>
            </p>
            ${!answer.isCorrect ? `
              <p>
                <span class="text-[var(--muted)]">Correct answer:</span> 
                <span class="text-[var(--correct)]">${labels[answer.correctAnswer]}. ${answer.options[answer.correctAnswer]}</span>
              </p>
            ` : ''}
            <p class="text-[var(--muted)] text-xs mt-2 italic">${answer.explanation}</p>
          </div>
        `;
        
        reviewContainer.appendChild(item);
      });
    }

    function backToResults() {
      reviewScreen.classList.add('hidden');
      resultsScreen.classList.remove('hidden');
    }

    function restartQuiz() {
      // Reset UI
      nextBtn.innerHTML = `
        Next
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      `;
      scoreRingFill.style.strokeDashoffset = 502;
      
      startQuiz();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (quizScreen.classList.contains('hidden')) return;
      
      const keys = ['1', '2', '3', '4', 'a', 'b', 'c', 'd'];
      const keyIndex = keys.indexOf(e.key.toLowerCase());
      
      if (keyIndex !== -1 && !answered) {
        const index = keyIndex % 4;
        const btn = optionsContainer.children[index];
        if (btn) selectAnswer(index, btn);
      }
      
      if (e.key === 'Enter' && !nextBtn.disabled) {
        nextQuestion();
      }
    });
  