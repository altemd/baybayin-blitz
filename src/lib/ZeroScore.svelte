<script>
  import { onMount, onDestroy } from 'svelte';

  let { playerName, onPlayAgain, onLearn, onRedirect } = $props();

  let timer = null;

  onMount(() => {
    if (onRedirect) {
      timer = setTimeout(() => onRedirect(), 5000);
    }
  });

  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });
</script>

<div class="zero-score-screen">
  <h2>No Points Scored!</h2>
  <p>Better luck next time, {playerName}!</p>
  <div class="zero-actions">
    <button class="hero-play-btn" onclick={onPlayAgain}>Try Again</button>
    <button class="tutorial-btn" onclick={onLearn}>Learn Baybayin</button>
    <button class="nav-btn" onclick={onRedirect}>Leaderboard</button>
  </div>
</div>

<style>
  .zero-score-screen {
    text-align: center;
    max-width: 400px;
    margin: 3rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .zero-score-screen h2 {
    font-size: 2rem;
    color: var(--text-color);
    margin: 0;
  }

  .zero-score-screen p {
    color: var(--text-muted);
    font-size: 1.1rem;
    margin: 0;
  }

  .zero-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .zero-actions :global(.hero-play-btn) {
    padding: 0.85rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    background: var(--primary-color);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
  }

  .zero-actions :global(.hero-play-btn:hover) {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  .zero-actions :global(.tutorial-btn) {
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

  .zero-actions :global(.tutorial-btn:hover) {
    background: var(--primary-light);
  }

  .zero-actions :global(.nav-btn) {
    padding: 0.5rem 1.25rem;
    background: transparent;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s;
  }

  .zero-actions :global(.nav-btn:hover) {
    background: var(--primary-light);
    border-color: var(--primary-color);
  }
</style>
