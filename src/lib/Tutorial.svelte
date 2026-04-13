<script>
  let { onComplete } = $props();

  const cards = [
    // Vowels
    { id: 1, question: "What is 'a' in Baybayin?", answer: "\u1700", options: ["\u1700", "\u1701", "\u1702"] },
    { id: 2, question: "What is 'i/e' in Baybayin?", answer: "\u1701", options: ["\u1700", "\u1701", "\u1702"] },
    { id: 3, question: "What is 'u/o' in Baybayin?", answer: "\u1702", options: ["\u1700", "\u1701", "\u1702"] },

    // Consonants
    { id: 4, question: "What is 'ba' in Baybayin?", answer: "\u170A", options: ["\u170A", "\u170B", "\u1703"] },
    { id: 5, question: "What is 'ka' in Baybayin?", answer: "\u1703", options: ["\u1704", "\u1703", "\u1706"] },
    { id: 6, question: "What is 'ma' in Baybayin?", answer: "\u170B", options: ["\u170B", "\u1708", "\u1709"] },
    { id: 7, question: "What is 'na' in Baybayin?", answer: "\u1708", options: ["\u1706", "\u1708", "\u1711"] },

    // Top kudlit - adds i/e
    { id: 8, question: "The Top Kudlit adds 'i/e'. How do you write 'ba' with top kudlit?", hint: "\u170A → \u170A\u1712", answer: "\u170A\u1712", options: ["\u170A", "\u170A\u1712", "\u170A\u1713"] },
    { id: 9, question: "Top Kudlit: How do you write 'be/bi'?", answer: "\u170A\u1712", options: ["\u170A", "\u170A\u1712", "\u170A\u1713"] },
    { id: 10, question: "Top Kudlit: How do you write 'ke/ki'?", answer: "\u1703\u1712", options: ["\u1703\u1713", "\u1703\u1712", "\u1703"] },

    // Bottom kudlit - adds u/o
    { id: 11, question: "The Bottom Kudlit adds 'u/o'. How do you write 'ba' with bottom kudlit?", hint: "\u170A → \u170A\u1713", answer: "\u170A\u1713", options: ["\u170A\u1712", "\u170A", "\u170A\u1713"] },
    { id: 12, question: "Bottom Kudlit: How do you write 'bo/bu'?", answer: "\u170A\u1713", options: ["\u170A", "\u170A\u1713", "\u170A\u1712"] },
    { id: 13, question: "Bottom Kudlit: How do you write 'mo/mu'?", answer: "\u170B\u1713", options: ["\u170B\u1712", "\u170B\u1713", "\u170B"] },

    // Cross-kudlit - cancels vowel
    { id: 14, question: "The Cross Kudlit cancels the vowel. How do you write just 'b'?", hint: "\u170A → \u170A\u1714", answer: "\u170A\u1714", options: ["\u170A", "\u170A\u1712", "\u170A\u1714"] },
    { id: 15, question: "Cross Kudlit: How do you write just 'k'?", answer: "\u1703\u1714", options: ["\u1703\u1712", "\u1703\u1714", "\u1703\u1713"] },
    { id: 16, question: "Cross Kudlit: How do you write just 'n'?", answer: "\u1708\u1714", options: ["\u1708", "\u1708\u1712", "\u1708\u1714"] }
  ];

  let currentIndex = $state(0);
  let selectedAnswer = $state(null);
  let isCorrect = $state(null);
  let showNext = $state(false);
  let score = $state(0);
  let totalAnswered = $state(0);
  let tutorialComplete = $state(false);
  let accepting = $state(true);
  let optionOrder = $state([0, 1, 2]);

  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function getCard() {
    return cards[currentIndex];
  }

  function getOptions() {
    const card = getCard();
    return optionOrder.map(i => card.options[i]);
  }

  function resetCard() {
    selectedAnswer = null;
    isCorrect = null;
    showNext = false;
    accepting = false;
    optionOrder = shuffleArray([0, 1, 2]);
    setTimeout(() => { accepting = true; }, 150);
  }

  function handleAnswer(option) {
    if (!accepting || showNext) return;
    selectedAnswer = option;
    const card = getCard();
    isCorrect = option === card.answer;
    showNext = true;
    totalAnswered++;
    if (isCorrect) {
      score++;
    }
  }

  function handleNext() {
    accepting = false;
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      resetCard();
    } else {
      tutorialComplete = true;
    }
  }

  function restart() {
    currentIndex = 0;
    score = 0;
    totalAnswered = 0;
    tutorialComplete = false;
    resetCard();
  }

  function finish() {
    onComplete();
  }
</script>

<div class="tutorial-overlay">
  <div class="tutorial-container">
    {#if tutorialComplete}
      <div class="completion-screen">
        <div class="completion-icon">🎉</div>
        <h2>Tutorial Complete!</h2>
        <p class="score-summary">You got {score} out of {totalAnswered} correct!</p>
        <div class="completion-actions">
          <button class="restart-btn" onclick={restart}>Try Again</button>
          <button class="finish-btn" onclick={finish}>Start Playing</button>
        </div>
      </div>
    {:else}
      {@const card = getCard()}
      {@const options = getOptions()}

      <div class="tutorial-header">
        <span class="card-count">{currentIndex + 1} / {cards.length}</span>
        <button class="close-btn" onclick={finish}>×</button>
      </div>

      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width: {((currentIndex) / cards.length) * 100}%"></div>
      </div>

      {#if card.hint}
        <div class="hint-box">
          <span class="hint-label">Hint:</span>
          <span class="hint-text baybayin-font">{card.hint}</span>
        </div>
      {/if}

      <div class="card-area">
        <div class="question-card">
          <p class="question">{card.question}</p>
        </div>

        <div class="options-grid">
          {#each options as option, i (i)}
            <button
              class="option-card {selectedAnswer === option ? (isCorrect ? 'correct' : 'incorrect') : ''} {showNext && option === card.answer ? 'reveal' : ''}"
              onclick={() => handleAnswer(option)}
              disabled={showNext}
            >
              <span class="baybayin-char baybayin-font">{option}</span>
            </button>
          {/each}
        </div>

        {#if showNext}
          <div class="feedback {isCorrect ? 'success' : 'error'}">
            {#if isCorrect}
              <span>✓ Correct!</span>
            {:else}
              <span>✗ The answer was:</span>
              <span class="correct-answer baybayin-font">{card.answer}</span>
            {/if}
          </div>

          <button class="next-btn" onclick={handleNext}>
            {currentIndex < cards.length - 1 ? 'Next' : 'Complete Tutorial'}
          </button>
        {/if}
      </div>

      <div class="score-bar">
        <div class="score-fill" style="width: {(score / Math.max(totalAnswered, 1)) * 100}%"></div>
        <span class="score-text">{score}/{totalAnswered}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .tutorial-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .tutorial-container {
    background: var(--card-bg);
    border-radius: 20px;
    width: 100%;
    max-width: 450px;
    padding: 1.5rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tutorial-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-count {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: var(--bg-color);
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #fee2e2;
    color: #991b1b;
  }

  .progress-bar-wrap {
    height: 6px;
    background: var(--bg-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .hint-box {
    background: #eff6ff;
    border: 1px solid #93c5fd;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
  }

  .hint-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1d4ed8;
  }

  .hint-text {
    font-size: 1.5rem;
    letter-spacing: 0.25rem;
  }

  .card-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .question-card {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border: 2px solid var(--primary-color);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;
    width: 100%;
  }

  .question {
    font-size: 1.15rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-color);
  }

  .options-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    width: 100%;
  }

  .option-card {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--bg-color);
    border: 3px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0.5rem;
  }

  .option-card:hover:not(:disabled) {
    border-color: var(--primary-color);
    transform: scale(1.05);
  }

  .option-card:disabled {
    cursor: default;
  }

  .option-card.correct {
    border-color: #4ade80;
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  }

  .option-card.incorrect {
    border-color: #f87171;
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  }

  .option-card.reveal {
    border-color: #4ade80;
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  }

  .baybayin-char {
    font-size: 2.5rem;
    line-height: 1;
  }

  .feedback {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
  }

  .feedback.success {
    background: #dcfce7;
    color: #166534;
  }

  .feedback.error {
    background: #fee2e2;
    color: #991b1b;
  }

  .correct-answer {
    font-size: 1.5rem;
    margin-left: 0.25rem;
  }

  .next-btn {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background: var(--primary-color);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .next-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  .score-bar {
    height: 24px;
    background: var(--bg-color);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .score-fill {
    height: 100%;
    background: linear-gradient(90deg, #4ade80, #22c55e);
    border-radius: 12px;
    transition: width 0.3s ease;
  }

  .score-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-color);
  }

  .completion-screen {
    text-align: center;
    padding: 2rem 1rem;
  }

  .completion-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .completion-screen h2 {
    font-size: 1.75rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .score-summary {
    font-size: 1.1rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
  }

  .completion-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .restart-btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-color);
    background: transparent;
    border: 2px solid var(--primary-color);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .restart-btn:hover {
    background: var(--primary-light);
  }

  .finish-btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background: var(--primary-color);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .finish-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  @media (max-width: 400px) {
    .tutorial-container {
      padding: 1rem;
    }

    .question {
      font-size: 1rem;
    }

    .baybayin-char {
      font-size: 2rem;
    }

    .options-grid {
      gap: 0.5rem;
    }
  }
</style>
