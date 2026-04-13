<script>
  import { translateToBaybayin } from './baybayin.js';

  let { onSubmit } = $props();
  let playerName = $state('');

  function handleSubmit(e) {
    e.preventDefault();
    if (playerName.trim()) {
      onSubmit(playerName.trim());
    }
  }

  // Get syllable groups from input
  function getSyllables(text) {
    if (!text) return [];
    
    const syllables = [];
    let processed = text.toLowerCase();
    processed = processed.replace(/e/g, "i");
    processed = processed.replace(/o/g, "u");
    
    const patterns = [
      /^nga/, /^ngi/, /^ngu/, /^ng/,
      /^ka/, /^ga/, /^ta/, /^da/, /^na/, /^pa/, /^fa/, /^ba/, /^ma/, /^ya/, /^ra/, /^la/, /^wa/, /^sa/, /^ha/,
      /^ki/, /^gi/, /^ti/, /^di/, /^ni/, /^pi/, /^bi/, /^mi/, /^yi/, /^ri/, /^li/, /^wi/, /^si/, /^hi/,
      /^ku/, /^gu/, /^tu/, /^du/, /^nu/, /^pu/, /^bu/, /^mu/, /^yu/, /^ru/, /^lu/, /^wu/, /^su/, /^hu/,
      /^a/, /^i/, /^u/,
    ];
    
    while (processed.length > 0) {
      let matched = false;
      for (const pattern of patterns) {
        const match = processed.match(pattern);
        if (match) {
          syllables.push(match[0]);
          processed = processed.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        syllables.push(processed[0]);
        processed = processed.slice(1);
      }
    }
    
    return syllables;
  }

  let syllables = $derived(playerName ? getSyllables(playerName) : []);
</script>

<div class="name-input-container">
  <span class="baybayin-title baybayin-font">ᜊᜌ᜔ᜊᜌᜒᜈ᜔</span>
  <p class="hero-desc"></p>
  <h2>Baybayin Blitz</h2>
  <p class="hero-subtitle"></p>
  
  <form onsubmit={handleSubmit}>
    <input 
      type="text" 
      id="player-name" 
      bind:value={playerName} 
      placeholder="Enter your name"
      autofocus
      maxlength="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      required
    />
    
    {#if syllables.length > 0}
      <div class="baybayin-preview">
        <div class="preview-label">Your name in Baybayin:</div>
        <div class="baybayin-cards">
          {#each syllables as syllable, i}
            <div class="baybayin-card">
              <span class="baybayin-char baybayin-font">{translateToBaybayin(syllable)}</span>
              <span class="latin-label">{syllable}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <button type="submit" disabled={!playerName.trim()}>
      Start Game
    </button>
  </form>
</div>

<style>
  .name-input-container {
    text-align: center;
    padding: 2rem;
    max-width: 450px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 300px;
    height: 100%;
    overflow: hidden;
  }

  h2 {
    font-size: 2.5rem;
    color: var(--text-color);
    margin-bottom: 1.5rem;
  }

  .baybayin-title {
    font-size: 4rem;
    color: var(--primary-color);
    display: block;
    margin-bottom: 0.5rem;
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

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-family: inherit;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
    text-align: center;
  }

  input:focus {
    border-color: var(--primary-color);
  }

  .baybayin-preview {
    background: var(--card-bg);
    border-radius: 10px;
    padding: 1rem;
    box-shadow: var(--shadow);
  }

  .preview-label {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .baybayin-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .baybayin-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 60px;
    padding: 0 0.35rem;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border: 2px solid var(--primary-color);
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
    animation: popIn 0.15s ease-out;
  }

  @keyframes popIn {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .baybayin-char {
    font-size: 1.5rem;
    color: var(--secondary-color);
    line-height: 1;
  }

  .latin-label {
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-top: 0.2rem;
    text-transform: uppercase;
  }

  button {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    background: var(--primary-color);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }

  button:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  button:disabled {
    background: var(--disabled-color);
    cursor: not-allowed;
  }
</style>
