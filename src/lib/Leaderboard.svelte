<script>
  import { onMount } from 'svelte';

  let { currentScore = 0, playerName = '', difficulty = '', onPlayAgain, onRedirect, showPlayButton = false } = $props();
  
  let allScores = $state([]);
  let isNewHighScore = $state(false);
  let hasAddedScore = $state(false);
  let userSelectedTab = $state(null);
  let activeTab = $derived(userSelectedTab ?? (difficulty || 'expert'));
  let redirectTimer = null;

  onMount(() => {
    loadScores();
    if (currentScore > 0 && !hasAddedScore) {
      checkNewHighScore();
    }
    if (currentScore > 0 && onRedirect) {
      redirectTimer = setTimeout(() => onRedirect(), 5000);
    }
    return () => { if (redirectTimer) clearTimeout(redirectTimer); };
  });

  function loadScores() {
    const saved = localStorage.getItem('baybayin-blitz-scores');
    if (saved) {
      allScores = JSON.parse(saved);
    }
  }

  function saveScores() {
    localStorage.setItem('baybayin-blitz-scores', JSON.stringify(allScores));
  }

  function getFilteredScores() {
    return allScores
      .filter(s => s.difficulty === activeTab)
      .sort((a, b) => b.score - a.score);
  }

  function checkNewHighScore() {
    if (currentScore > 0 && playerName && !hasAddedScore) {
      hasAddedScore = true;
      
      allScores = [...allScores, {
        name: playerName,
        score: currentScore,
        difficulty: difficulty
      }];
      
      allScores.sort((a, b) => b.score - a.score);
      saveScores();
      
      const filtered = allScores
        .filter(s => s.difficulty === difficulty)
        .sort((a, b) => b.score - a.score);
      
      const position = filtered.findIndex(entry => 
        entry.name === playerName && entry.score === currentScore
      );
      isNewHighScore = position < 3;
    }
  }

  function getMedalEmoji(index) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  }

  let leaderboard = $derived(getFilteredScores());
</script>

<div class="leaderboard-container">
  {#if currentScore > 0 && isNewHighScore}
    <div class="new-high-score">
      <span class="trophy">🏆</span>
      <span class="high-score-text">New High Score!</span>
      <span class="score-display">{currentScore} pts</span>
    </div>
  {:else if currentScore > 0}
    <div class="game-over">
      <span>Game Over! Score: <strong>{currentScore}</strong></span>
    </div>
  {/if}

  <div class="leaderboard">
    <div class="leaderboard-header">
      <h3>Leaderboard</h3>
      <div class="tabs">
        <button class="tab {activeTab === 'beginner' ? 'active beginner' : ''}" onclick={() => userSelectedTab = 'beginner'}>Beginner</button>
        <button class="tab {activeTab === 'intermediate' ? 'active intermediate' : ''}" onclick={() => userSelectedTab = 'intermediate'}>Intermediate</button>
        <button class="tab {activeTab === 'expert' ? 'active expert' : ''}" onclick={() => userSelectedTab = 'expert'}>Expert</button>
      </div>
    </div>
    
    {#if leaderboard.length === 0}
      <p class="empty">No {activeTab} scores yet. Be the first!</p>
    {:else}
      <div class="leaderboard-list">
        {#each leaderboard as entry, index}
          <div class="leaderboard-entry {entry.name === playerName && entry.score === currentScore ? 'current-player' : ''}">
            <span class="rank">{getMedalEmoji(index)}</span>
            <span class="player-name">{entry.name}</span>
            <span class="score">{entry.score} pts</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .leaderboard-container {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .new-high-score {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 10px;
    margin-bottom: 1rem;
    animation: celebrate 0.5s ease-out;
  }

  @keyframes celebrate {
    0% { transform: scale(0.95); opacity: 0; }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); opacity: 1; }
  }

  .trophy {
    font-size: 1.5rem;
  }

  .high-score-text {
    font-weight: 700;
    color: #92400e;
    font-size: 1.1rem;
  }

  .score-display {
    font-weight: 700;
    color: #b45309;
    font-size: 1.25rem;
  }

  .game-over {
    text-align: center;
    padding: 0.75rem;
    background: var(--card-bg);
    border-radius: 10px;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .game-over strong {
    color: var(--primary-color);
    font-size: 1.25rem;
  }

  .leaderboard {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: var(--shadow);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    width: 100%;
  }

  .leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .leaderboard-header h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.3rem;
  }

  .tabs {
    display: flex;
    gap: 0.25rem;
  }

  .tab {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab:hover {
    background: var(--primary-light);
  }

  .tab.active {
    color: white;
    border-color: transparent;
  }

  .tab.active.beginner { background: #4ade80; color: #166534; }
  .tab.active.intermediate { background: #fbbf24; color: #92400e; }
  .tab.active.expert { background: #f87171; color: #991b1b; }

  .empty {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
    padding: 2rem 1rem;
    font-size: 1rem;
  }

  .leaderboard-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .leaderboard-entry {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: 0.75rem;
    align-items: center;
    padding: 0.7rem 1rem;
    background: var(--bg-color);
    border-radius: 8px;
    transition: background 0.2s;
  }

  .leaderboard-entry:hover {
    background: var(--primary-light);
  }

  .leaderboard-entry.current-player {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border: 2px solid #3b82f6;
  }

  .rank {
    font-size: 1.15rem;
    text-align: center;
  }

  .player-name {
    font-weight: 600;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1rem;
  }

  .score {
    font-weight: 700;
    color: var(--primary-color);
    font-size: 1rem;
  }

  @media (max-width: 500px) {
    .leaderboard-container {
      padding: 0 0.5rem;
    }

    .leaderboard-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
