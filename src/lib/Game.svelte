<script>
  import { onMount, onDestroy } from 'svelte';
  import { flip } from 'svelte/animate';
  import { translateToBaybayin, getRandomWord, getBaybayinTiles } from './baybayin.js';

  let { playerName, difficulty, gameMode, onGameEnd } = $props();

  let currentWord = $state(null);
  let timer = $state(30);
  let score = $state(0);
  let selectedTiles = $state([]);
  let isGameOver = $state(false);
  let feedback = $state('');
  let feedbackType = $state('');
  let feedbackAnswer = $state('');
  let roundProgress = $state(0);

  // Free play mode tiles (full grid)
  const allTiles = getBaybayinTiles();

  // Flashcard mode state
  let flashcardChoices = $state([]);

  let timerInterval = null;
  const flipDurationMs = 200;

  let timerStarted = $state(false);

  const referenceVowels = [
    { char: '\u1700', latin: 'a' },
    { char: '\u1701', latin: 'i/e' },
    { char: '\u1702', latin: 'o/u' }
  ];

  const referenceConsonants = [
    { char: '\u1703', latin: 'ka' },
    { char: '\u1704', latin: 'ga' },
    { char: '\u1705', latin: 'nga' },
    { char: '\u1706', latin: 'ta' },
    { char: '\u1707', latin: 'da/ra' },
    { char: '\u1708', latin: 'na' },
    { char: '\u1709', latin: 'pa' },
    { char: '\u170A', latin: 'ba' },
    { char: '\u170B', latin: 'ma' },
    { char: '\u170C', latin: 'ya' },
    { char: '\u170E', latin: 'la' },
    { char: '\u170F', latin: 'wa' },
    { char: '\u1710', latin: 'sa' },
    { char: '\u1711', latin: 'ha' }
  ];

  function startNewRound() {
    currentWord = getRandomWord(difficulty);
    selectedTiles = [];
    isGameOver = false;
    feedback = '';
    feedbackType = '';
    feedbackAnswer = '';
    roundProgress = 0;

    if (gameMode === 'flashcard') {
      generateFlashcardChoices();
    }

    if (!timerStarted) {
      timerStarted = true;
      timerInterval = setInterval(() => {
        timer = timer - 1;
        if (timer <= 0) {
          clearInterval(timerInterval);
          endGame();
        }
      }, 1000);
    }
  }

  function endGame() {
    isGameOver = true;
    if (timerInterval) clearInterval(timerInterval);
    onGameEnd(score);
  }

  // Flashcard mode: generate 3 choices including the correct next tile
  function generateFlashcardChoices() {
    if (!currentWord) return;
    const correctBaybayin = translateToBaybayin(currentWord.word);
    const correctChars = [...correctBaybayin];

    // Skip spaces - auto-add them and move to next character
    while (roundProgress < correctChars.length && correctChars[roundProgress] === ' ') {
      selectedTiles = [...selectedTiles, { char: ' ', latin: 'space', type: 'consonant', id: `space-${roundProgress}` }];
      roundProgress = roundProgress + 1;
    }

    if (roundProgress >= correctChars.length) return;

    const correctChar = correctChars[roundProgress];
    const correctTile = allTiles.find(t => t.char === correctChar) || { char: correctChar, latin: '?', type: 'consonant' };

    // Get 2 random tiles that are NOT the correct one
    const wrongTiles = allTiles.filter(t => t.char !== correctChar);
    const shuffled = wrongTiles.sort(() => Math.random() - 0.5);
    const wrongChoices = shuffled.slice(0, 2);

    // Combine and shuffle
    const choices = [
      { ...correctTile, id: `fc-${roundProgress}-correct` },
      { ...wrongChoices[0], id: `fc-${roundProgress}-w1` },
      { ...wrongChoices[1], id: `fc-${roundProgress}-w2` }
    ].sort(() => Math.random() - 0.5);

    flashcardChoices = choices;
  }

  function handleFlashcardPick(tile) {
    if (isGameOver || !currentWord) return;

    const correctBaybayin = translateToBaybayin(currentWord.word);
    const correctChars = [...correctBaybayin];
    const correctChar = correctChars[roundProgress];

    if (tile.char === correctChar) {
      selectedTiles = [...selectedTiles, tile];
      roundProgress = roundProgress + 1;

      if (roundProgress >= correctChars.length) {
        // Word complete!
        const timeBonus = Math.floor(timer * 10);
        const difficultyMultiplier = difficulty === 'beginner' ? 1 :
                                     difficulty === 'intermediate' ? 2 : 3;
        const roundScore = (100 + timeBonus) * difficultyMultiplier;
        score += roundScore;
        feedback = `Correct! +${roundScore} points`;
        feedbackType = 'success';

        setTimeout(() => {
          startNewRound();
        }, 1200);
      } else {
        feedback = 'Good!';
        feedbackType = 'success';
        generateFlashcardChoices();
      }
    } else {
      const difficultyMultiplier = difficulty === 'beginner' ? 1 :
                                   difficulty === 'intermediate' ? 2 : 3;
      const penalty = 10 * difficultyMultiplier;
      score = Math.max(0, score - penalty);
      feedback = `Wrong! -${penalty} points`;
      feedbackType = 'error';
    }
  }

  // Free play mode: DnD handlers
  function handleDndConsider(e) {
    selectedTiles = e.detail.items;
  }

  function handleDndFinalize(e) {
    selectedTiles = e.detail.items;
  }

  function handleGridConsider(e) {
    // Grid items stay as is, just update for visual feedback
  }

  function handleGridFinalize(e) {
    // When dropping from grid to answer
  }

  function handleAnswerConsider(e) {
    selectedTiles = e.detail.items;
  }

  function handleAnswerFinalize(e) {
    selectedTiles = e.detail.items;
  }

  // Add tile from grid on click (free play mode)
  function addTileFromGrid(tile) {
    if (isGameOver) return;
    selectedTiles = [...selectedTiles, { ...tile, id: `sel-${Date.now()}-${Math.random()}` }];
  }

  function removeTile(index) {
    if (isGameOver) return;
    selectedTiles = selectedTiles.filter((_, i) => i !== index);
  }

  function clearTiles() {
    if (isGameOver) return;
    selectedTiles = [];
  }

  function checkAnswer() {
    if (isGameOver || !currentWord) return;

    const correctBaybayin = translateToBaybayin(currentWord.word);
    const userAnswer = selectedTiles.map(t => t.char).join('');

    if (userAnswer === correctBaybayin) {
      const timeBonus = Math.floor(timer * 10);
      const difficultyMultiplier = difficulty === 'beginner' ? 1 :
                                   difficulty === 'intermediate' ? 2 : 3;
      const roundScore = (100 + timeBonus) * difficultyMultiplier;
      score += roundScore;
      feedback = `Correct! +${roundScore} points`;
      feedbackType = 'success';

      setTimeout(() => {
        startNewRound();
      }, 1200);
    } else {
      feedback = 'Try again!';
      feedbackType = 'error';
    }
  }

  function skipWord() {
    if (isGameOver) return;
    feedback = 'Answer:';
    feedbackAnswer = translateToBaybayin(currentWord.word);
    feedbackType = 'info';
    setTimeout(() => {
      startNewRound();
    }, 1500);
  }

  function endGameEarly() {
    endGame();
  }

  function getTimerClass() {
    if (timer > 20) return 'timer-normal';
    if (timer > 10) return 'timer-warning';
    return 'timer-danger';
  }

  onMount(() => {
    if (difficulty === 'intermediate') {
      timer = 60;
    } else if (difficulty === 'expert') {
      timer = 90;
    }
    startNewRound();
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });
</script>

<div class="game-container {difficulty}">
  <div class="game-header">
    <div class="player-info">
      <span class="player-name">{playerName}</span>
      <span class="difficulty-badge {difficulty}">{difficulty}</span>
    </div>
    <div class="stats">
      <div class="stat">
        <span class="stat-label">Score</span>
        <span class="stat-value">{score}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Time</span>
        <span class="stat-value {getTimerClass()}">{timer}s</span>
      </div>
    </div>
  </div>

  <div class="game-body {difficulty === 'beginner' || difficulty === 'intermediate' ? 'with-sidebar' : ''}">
    {#if difficulty === 'beginner' || difficulty === 'intermediate'}
      <div class="ref-sidebar">
        <div class="ref-section">
          <span class="ref-label">Vowels</span>
          <div class="ref-grid">
            {#each referenceVowels as v}
              <div class="ref-item">
                <span class="ref-char baybayin-font">{v.char}</span>
                <span class="ref-latin">{v.latin}</span>
              </div>
            {/each}
          </div>
        </div>
        <div class="ref-section">
          <span class="ref-label">Consonants</span>
          <div class="ref-grid">
            {#each referenceConsonants as c}
              <div class="ref-item">
                <span class="ref-char baybayin-font">{c.char}</span>
                <span class="ref-latin">{c.latin}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <div class="game-content">

  {#if currentWord}
    <div class="word-section">
      <div class="word-card">
        <span class="filipino-word">{currentWord.word}</span>
        {#if gameMode === 'flashcard'}
          <span class="progress">{roundProgress}/{[...translateToBaybayin(currentWord.word)].length} tiles</span>
        {/if}
      </div>

      <div class="answer-area">
        <div class="selected-tiles">
          {#if selectedTiles.length === 0}
            <span class="placeholder">{gameMode === 'flashcard' ? 'Pick the correct tiles' : 'Tap tiles to spell the word'}</span>
          {:else}
            {#each selectedTiles as tile, index (tile.id)}
              <div
                class="selected-tile"
                animate:flip={{ duration: flipDurationMs }}
              >
                <span class="tile-char baybayin-font">{tile.char}</span>
                {#if gameMode === 'free'}
                  <button class="remove-btn" onclick={() => removeTile(index)} title="Remove">x</button>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      </div>

      {#if feedback}
        <div class="feedback {feedbackType}">
          {feedback}
          {#if feedbackAnswer}
            <span class="baybayin-font feedback-answer">{feedbackAnswer}</span>
          {/if}
        </div>
      {/if}

      <div class="actions">
        {#if gameMode === 'free'}
          <button class="action-btn check" onclick={checkAnswer} disabled={selectedTiles.length === 0}>
            Check
          </button>
          <button class="action-btn clear" onclick={clearTiles} disabled={selectedTiles.length === 0}>
            Clear
          </button>
        {/if}
        <button class="action-btn skip" onclick={skipWord}>
          Skip
        </button>
        <button class="action-btn end" onclick={endGameEarly}>
          End
        </button>
      </div>
    </div>

    {#if gameMode === 'free'}
      <div class="tile-grid">
        <div class="tiles-container">
          {#each allTiles as tile, i (tile.char + '-' + i)}
            <button
              class="tile {tile.type}"
              onclick={() => addTileFromGrid(tile)}
              animate:flip={{ duration: flipDurationMs }}
            >
              <span class="tile-char baybayin-font">{tile.char}</span>
              <span class="tile-latin">{tile.latin}</span>
            </button>
          {/each}
        </div>
      </div>
    {:else}
      <div class="flashcard-choices">
        <div class="choices-container">
          {#each flashcardChoices as choice (choice.id)}
            <button
              class="choice-card {choice.type}"
              onclick={() => handleFlashcardPick(choice)}
            >
              <span class="tile-char baybayin-font">{choice.char}</span>
              {#if difficulty === 'beginner'}
                <span class="tile-latin">{choice.latin}</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}
    {/if}
    </div>
  </div>
</div>

<style>
  .game-container {
    max-width: 850px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  .game-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .game-body.with-sidebar {
    display: flex;
    gap: 0.75rem;
    overflow: hidden;
  }

  .game-content {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.65rem 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    box-shadow: var(--shadow);
    flex-shrink: 0;
    margin-bottom: 0.75rem;
  }

  .player-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .player-name {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .difficulty-badge, .mode-badge {
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .difficulty-badge.beginner { background: #4ade80; color: #166534; }
  .difficulty-badge.intermediate { background: #fbbf24; color: #92400e; }
  .difficulty-badge.expert { background: #f87171; color: #991b1b; }

  .mode-badge.free { background: #60a5fa; color: #1e3a8a; }
  .mode-badge.flashcard { background: #c084fc; color: #3b0764; }

  .stats { display: flex; gap: 2rem; }
  .stat { display: flex; flex-direction: column; align-items: center; }
  .stat-label { font-size: 0.8rem; color: var(--text-muted); }
  .stat-value { font-size: 1.4rem; font-weight: 700; }

  .timer-normal { color: #4ade80; }
  .timer-warning { color: #fbbf24; }
  .timer-danger { color: #f87171; animation: pulse 1s infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .word-section { flex-shrink: 0; }

  .word-card {
    text-align: center;
    padding: 0.85rem 1.75rem;
    background: var(--card-bg);
    border-radius: 10px;
    box-shadow: var(--shadow);
    border: 2px solid var(--primary-color);
    margin-bottom: 0.75rem;
  }

  .filipino-word {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    text-transform: capitalize;
  }

  .translation {
    display: block;
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-top: 0.15rem;
  }

  .progress {
    display: block;
    font-size: 0.85rem;
    color: #c084fc;
    font-weight: 600;
    margin-top: 0.3rem;
  }

  .answer-area { margin-bottom: 0.5rem; }

  .selected-tiles {
    min-height: 50px;
    padding: 0.5rem;
    background: var(--card-bg);
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .placeholder {
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.85rem;
  }

  .selected-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 55px;
    padding: 0.25rem;
    background: var(--primary-light);
    border: 2px solid var(--primary-color);
    border-radius: 6px;
    cursor: grab;
    transition: all 0.15s;
    position: relative;
    box-sizing: border-box;
  }

  .selected-tile:hover {
    background: var(--primary-color);
    color: white;
    transform: scale(1.05);
  }

  .selected-tile .tile-char { 
    font-size: 1.4rem; 
    line-height: 1;
  }

  .remove-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #f87171;
    color: white;
    border: none;
    font-size: 0.6rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    padding: 0;
  }

  .remove-btn:hover { background: #ef4444; }

  .feedback {
    text-align: center;
    padding: 0.35rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .feedback.success { background: #dcfce7; color: #166534; }
  .feedback.error { background: #fee2e2; color: #991b1b; }
  .feedback.info { background: #dbeafe; color: #1e40af; }

  .feedback-answer {
    font-size: 1.2rem;
    margin-left: 0.5rem;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .action-btn.check { background: #4ade80; color: #166534; }
  .action-btn.check:hover:not(:disabled) { background: #22c55e; }
  .action-btn.clear { background: #fbbf24; color: #92400e; }
  .action-btn.clear:hover:not(:disabled) { background: #f59e0b; }
  .action-btn.skip { background: #94a3b8; color: white; }
  .action-btn.skip:hover { background: #64748b; }
  .action-btn.end { background: #f87171; color: white; }
  .action-btn.end:hover { background: #ef4444; }

  .ref-sidebar {
    width: 180px;
    flex-shrink: 0;
    background: var(--card-bg);
    border-radius: 10px;
    padding: 0.75rem;
    box-shadow: var(--shadow-sm);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ref-section {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .ref-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .ref-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
  }

  .ref-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
  }

  .ref-item .ref-char {
    font-size: 1.75rem;
    line-height: 1;
  }

  .ref-item .ref-latin {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .tile-grid {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .tiles-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    gap: 0.6rem;
    max-width: 100%;
  }

  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0.35rem;
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
    user-select: none;
  }

  .tile:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  .tile.vowel { border-color: #a78bfa; background: #f5f3ff; }
  .tile.consonant { border-color: #60a5fa; background: #eff6ff; }
  .tile.kudlit { border-color: #f472b6; background: #fdf2f8; }

  .game-container.expert .tile.vowel,
  .game-container.expert .tile.consonant,
  .game-container.expert .tile.kudlit {
    border-color: #9ca3af;
    background: #f9fafb;
  }

  .tile-char { font-size: 1.75rem; line-height: 1; margin-bottom: 0.15rem; }
  .tile-latin { font-size: 0.7rem; font-weight: 600; color: var(--text-muted); }

  /* Flashcard mode */
  .flashcard-choices {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .choices-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .choice-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 130px;
    padding: 1rem;
    background: var(--card-bg);
    border: 3px solid var(--border-color);
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
    box-shadow: var(--shadow);
    user-select: none;
  }

  .choice-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }

  .choice-card:active {
    transform: translateY(-2px) scale(1.02);
  }

  .choice-card.vowel { border-color: #a78bfa; background: #f5f3ff; }
  .choice-card.consonant { border-color: #60a5fa; background: #eff6ff; }
  .choice-card.kudlit { border-color: #f472b6; background: #fdf2f8; }

  .game-container.expert .choice-card.vowel,
  .game-container.expert .choice-card.consonant,
  .game-container.expert .choice-card.kudlit {
    border-color: #9ca3af;
    background: #f9fafb;
  }

  .choice-card .tile-char { font-size: 2.75rem; line-height: 1; margin-bottom: 0.3rem; }
  .choice-card .tile-latin { font-size: 0.85rem; }

  @media (max-width: 500px) {
    .game-header { flex-direction: column; gap: 0.35rem; }
    .stats { width: 100%; justify-content: space-around; }
    .actions { flex-wrap: wrap; }
    .action-btn { flex: 1; min-width: 70px; }
    .tiles-container { grid-template-columns: repeat(auto-fill, minmax(55px, 1fr)); }
    .choice-card { width: 90px; height: 100px; padding: 0.6rem; }
    .choice-card .tile-char { font-size: 2rem; }
    .selected-tile { width: 42px; height: 48px; }
    .selected-tile .tile-char { font-size: 1.15rem; }
    .game-body.with-sidebar { flex-direction: column; }
    .ref-sidebar { width: 100%; flex-shrink: 0; }
  }
</style>
