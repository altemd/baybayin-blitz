<script>
  import NameInput from './lib/NameInput.svelte';
  import Game from './lib/Game.svelte';
  import Leaderboard from './lib/Leaderboard.svelte';
  import Tutorial from './lib/Tutorial.svelte';
  import ZeroScore from './lib/ZeroScore.svelte';

  let gameState = $state('leaderboard'); // 'leaderboard' | 'name' | 'difficulty' | 'mode' | 'playing' | 'gameover'
  let playerName = $state('');
  let selectedDifficulty = $state('');
  let selectedMode = $state('free');
  let finalScore = $state(0);
  let leaderboardKey = $state(0);
  let showTutorial = $state(false);

  function startNewGame() {
    gameState = 'name';
  }

  function handleNameSubmit(name) {
    playerName = name;
    gameState = 'difficulty';
  }

  function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    selectedMode = 'flashcard';
    gameState = 'playing';
  }

  function selectMode(mode) {
    selectedMode = mode;
    gameState = 'playing';
  }

  function handleGameEnd(score) {
    finalScore = score;
    leaderboardKey++;
    gameState = 'gameover';
  }

  function handlePlayAgain() {
    gameState = 'name';
    finalScore = 0;
  }

  function goToLeaderboard() {
    gameState = 'leaderboard';
    finalScore = 0;
    playerName = '';
  }
</script>

<main>
  <header>
    <div class="logo" onclick={goToLeaderboard} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && goToLeaderboard()}>
      <span class="baybayin-logo baybayin-font">ᜊᜌ᜔ᜊᜌᜒᜈ᜔</span>
      <h1>Baybayin Blitz</h1>
    </div>
    {#if gameState !== 'leaderboard'}
      <button class="nav-btn" onclick={goToLeaderboard}>
        Leaderboard
      </button>
    {/if}
  </header>

  <div class="content" style="overflow-y: {gameState === 'name' ? 'hidden' : 'auto'}">
    {#if gameState === 'leaderboard'}
      <div class="homepage">
        <div class="homepage-left">
          {#key leaderboardKey}
            <Leaderboard 
              currentScore={0} 
              playerName=""
              onPlayAgain={startNewGame}
              showPlayButton={false}
            />
          {/key}
        </div>
        <div class="homepage-right">
          <div class="hero">
            <span class="inline-block pb-4 hero-baybayin baybayin-font">ᜊᜌ᜔ᜊᜌᜒᜈ᜔</span>
            <p class="hero-desc"></p>
            <h2>Baybayin Blitz</h2>
            <p class="hero-subtitle"></p>
            <p class="hero-desc">Learn to spell Filipino words using the Baybayin script!</p>
            <div class="hero-buttons">
              <button class="hero-play-btn" onclick={startNewGame}>
                Play Game
              </button>
              <button class="tutorial-btn" onclick={() => showTutorial = true}>
                Learn Baybayin
              </button>
            </div>
            <p class="credits">Inspired by WSL's M.J. Dionio, A.D. Fernandez, R. Feria, L.L. Figueroa, M.R. Solamo. (2020) "Likha! Mahika: an educational online competitive mobile game to help facilitate the learning of baybayin". 13th annual Int'l Conference on Education, Research and Innovation (ICERI 2020), 9-11 Nov. <a href="https://library.iated.org/view/DIONIO2020LIK" target="_blank" rel="noopener">https://library.iated.org/view/DIONIO2020LIK</a></p>
          </div>
        </div>
      </div>
    
    {:else if gameState === 'name'}
      <NameInput onSubmit={handleNameSubmit} />
    
    {:else if gameState === 'difficulty'}
      <div class="difficulty-select">
        <h2>Select Difficulty</h2>
        <div class="difficulty-options">
          <button 
            class="difficulty-card beginner"
            onclick={() => selectDifficulty('beginner')}
          >
            <span class="icon">🌱</span>
            <span class="title">Beginner</span>
            <span class="desc">Simple 1-2 syllable words</span>
            <span class="timer-info">30 seconds</span>
          </button>
          
          <button 
            class="difficulty-card intermediate"
            onclick={() => selectDifficulty('intermediate')}
          >
            <span class="icon">🌿</span>
            <span class="title">Intermediate</span>
            <span class="desc">3-4 syllable words</span>
            <span class="timer-info">60 seconds</span>
          </button>
          
          <button 
            class="difficulty-card expert"
            onclick={() => selectDifficulty('expert')}
          >
            <span class="icon">🌳</span>
            <span class="title">Expert</span>
            <span class="desc">Complex words & phrases</span>
            <span class="timer-info">90 seconds</span>
          </button>
        </div>
      </div>
    
    {:else if gameState === 'playing'}
      <Game 
        playerName={playerName} 
        difficulty={selectedDifficulty}
        gameMode={selectedMode}
        onGameEnd={handleGameEnd} 
      />
    
    {:else if gameState === 'gameover'}
      {#if finalScore === 0}
        <ZeroScore 
          playerName={playerName}
          onPlayAgain={handlePlayAgain}
          onLearn={() => { showTutorial = true; }}
          onRedirect={goToLeaderboard}
        />
      {:else}
        {#key leaderboardKey}
          <Leaderboard 
            currentScore={finalScore} 
            playerName={playerName}
            difficulty={selectedDifficulty}
            onPlayAgain={handlePlayAgain}
            onRedirect={goToLeaderboard}
          />
        {/key}
      {/if}
    {/if}
  </div>

  {#if showTutorial}
    <Tutorial onComplete={() => showTutorial = false} />
  {/if}
</main>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: var(--card-bg);
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .baybayin-logo {
    font-size: 1.75rem;
    color: var(--primary-color);
  }

  header h1 {
    font-size: 1.5rem;
    margin: 0;
    color: var(--text-color);
  }

  .nav-btn {
    padding: 0.6rem 1.25rem;
    font-size: 1rem;
    font-weight: 600;
    background: transparent;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background: var(--primary-light);
    border-color: var(--primary-color);
  }

  .content {
    flex: 1;
    padding: 1.25rem 2rem;
    overflow-y: auto;
    min-height: 0;
  }

  .homepage {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .homepage-left {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .homepage-right {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero {
    text-align: center;
    padding: 2rem;
  }

  .hero-baybayin {
    display: block;
    font-size: 4rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .hero h2 {
    font-size: 2.5rem;
    margin-bottom: 0.25rem;
    color: var(--text-color);
  }

  .hero-subtitle {
    font-size: 1.2rem;
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .hero-desc {
    font-size: 1rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .credits {
    margin-top: 2rem;
    font-size: 0.7rem;
    color: var(--text-muted);
    max-width: 400px;
    line-height: 1.4;
  }

  .credits a {
    color: var(--primary-color);
  }

  .hero-play-btn {
    padding: 1rem 3rem;
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
    background: var(--primary-color);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
  }

  .hero-play-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(230, 126, 34, 0.5);
  }

  .tutorial-btn {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-color);
    background: transparent;
    border: 2px solid var(--primary-color);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tutorial-btn:hover {
    background: var(--primary-light);
    transform: translateY(-1px);
  }

  .difficulty-select {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .difficulty-select h2 {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
    color: var(--text-color);
  }

  .difficulty-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  .difficulty-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.25rem;
    background: var(--card-bg);
    border: 3px solid var(--border-color);
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: var(--shadow);
  }

  .difficulty-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .difficulty-card.beginner:hover {
    border-color: #4ade80;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  }

  .difficulty-card.intermediate:hover {
    border-color: #fbbf24;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  }

  .difficulty-card.expert:hover {
    border-color: #f87171;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: var(--text-color);
  }

  .desc {
    color: var(--text-muted);
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }

  .timer-info {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-top: 0.5rem;
  }

  @media (max-width: 768px) {
    .homepage {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .homepage-right {
      order: -1;
    }

    .hero {
      padding: 1rem;
    }

    .hero-baybayin {
      font-size: 3rem;
    }

    .hero h2 {
      font-size: 1.75rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .hero-desc {
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .hero-play-btn {
      padding: 0.85rem 2.5rem;
      font-size: 1.1rem;
    }

    .content {
      padding: 1rem;
    }
  }

  @media (max-width: 600px) {
    header {
      padding: 0.5rem 1rem;
    }

    .logo {
      gap: 0.5rem;
    }

    .baybayin-logo {
      font-size: 1.25rem;
    }

    header h1 {
      font-size: 1rem;
    }

    .difficulty-options {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .difficulty-card {
      flex-direction: row;
      padding: 1rem;
      gap: 1rem;
    }

    .icon {
      font-size: 2rem;
      margin-bottom: 0;
    }
  }
</style>
