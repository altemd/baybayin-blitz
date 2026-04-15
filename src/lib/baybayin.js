// Baybayin translation logic adapted from kuya-bai-baybayin-translator

export function translateToBaybayin(text) {
  let rawText = text.toLowerCase();
  rawText = rawText.replace(/e/g, "i");
  rawText = rawText.replace(/o/g, "u");

  // Handle 'ng' combinations first (must come before other consonants)
  rawText = rawText.replace(/nga/g, "\u1705");
  rawText = rawText.replace(/ngi/g, "\u1705\u1712");
  rawText = rawText.replace(/ngu/g, "\u1705\u1713");
  rawText = rawText.replace(/ng/g, "\u1705\u1714");

  // Consonant + 'a' syllables
  rawText = rawText.replace(/ka/g, "\u1703");
  rawText = rawText.replace(/ga/g, "\u1704");
  rawText = rawText.replace(/ta/g, "\u1706");
  rawText = rawText.replace(/da/g, "\u1707");
  rawText = rawText.replace(/na/g, "\u1708");
  rawText = rawText.replace(/pa/g, "\u1709");
  rawText = rawText.replace(/fa/g, "\u1709");
  rawText = rawText.replace(/ba/g, "\u170A");
  rawText = rawText.replace(/ma/g, "\u170B");
  rawText = rawText.replace(/ya/g, "\u170C");
  rawText = rawText.replace(/ra/g, "\u1707");
  rawText = rawText.replace(/la/g, "\u170E");
  rawText = rawText.replace(/wa/g, "\u170F");
  rawText = rawText.replace(/sa/g, "\u1710");
  rawText = rawText.replace(/ha/g, "\u1711");

  // Consonant + 'i' syllables
  rawText = rawText.replace(/ki/g, "\u1703\u1712");
  rawText = rawText.replace(/gi/g, "\u1704\u1712");
  rawText = rawText.replace(/ti/g, "\u1706\u1712");
  rawText = rawText.replace(/di/g, "\u1707\u1712");
  rawText = rawText.replace(/ni/g, "\u1708\u1712");
  rawText = rawText.replace(/pi/g, "\u1709\u1712");
  rawText = rawText.replace(/bi/g, "\u170A\u1712");
  rawText = rawText.replace(/mi/g, "\u170B\u1712");
  rawText = rawText.replace(/yi/g, "\u170C\u1712");
  rawText = rawText.replace(/ri/g, "\u1707\u1712");
  rawText = rawText.replace(/li/g, "\u170E\u1712");
  rawText = rawText.replace(/wi/g, "\u170F\u1712");
  rawText = rawText.replace(/si/g, "\u1710\u1712");
  rawText = rawText.replace(/hi/g, "\u1711\u1712");

  // Consonant + 'u' syllables
  rawText = rawText.replace(/ku/g, "\u1703\u1713");
  rawText = rawText.replace(/gu/g, "\u1704\u1713");
  rawText = rawText.replace(/tu/g, "\u1706\u1713");
  rawText = rawText.replace(/du/g, "\u1707\u1713");
  rawText = rawText.replace(/nu/g, "\u1708\u1713");
  rawText = rawText.replace(/pu/g, "\u1709\u1713");
  rawText = rawText.replace(/bu/g, "\u170A\u1713");
  rawText = rawText.replace(/mu/g, "\u170B\u1713");
  rawText = rawText.replace(/yu/g, "\u170C\u1713");
  rawText = rawText.replace(/ru/g, "\u1707\u1713");
  rawText = rawText.replace(/lu/g, "\u170E\u1713");
  rawText = rawText.replace(/wu/g, "\u170F\u1713");
  rawText = rawText.replace(/su/g, "\u1710\u1713");
  rawText = rawText.replace(/hu/g, "\u1711\u1713");

  // Standalone vowels
  rawText = rawText.replace(/a/g, "\u1700");
  rawText = rawText.replace(/i/g, "\u1701");
  rawText = rawText.replace(/u/g, "\u1702");

  // Consonants without vowels (with virama)
  rawText = rawText.replace(/k/g, "\u1703\u1714");
  rawText = rawText.replace(/c/g, "\u1703\u1714");
  rawText = rawText.replace(/q/g, "\u1703\u1714");
  rawText = rawText.replace(/g/g, "\u1704\u1714");
  rawText = rawText.replace(/t/g, "\u1706\u1714");
  rawText = rawText.replace(/d/g, "\u1707\u1714");
  rawText = rawText.replace(/n/g, "\u1708\u1714");
  rawText = rawText.replace(/p/g, "\u1709\u1714");
  rawText = rawText.replace(/f/g, "\u1709\u1714");
  rawText = rawText.replace(/v/g, "\u170A\u1714");
  rawText = rawText.replace(/b/g, "\u170A\u1714");
  rawText = rawText.replace(/m/g, "\u170B\u1714");
  rawText = rawText.replace(/y/g, "\u170C\u1714");
  rawText = rawText.replace(/r/g, "\u1707\u1714");
  rawText = rawText.replace(/l/g, "\u170E\u1714");
  rawText = rawText.replace(/w/g, "\u170F\u1714");
  rawText = rawText.replace(/s/g, "\u1710\u1714");
  rawText = rawText.replace(/x/g, "\u1710\u1714");
  rawText = rawText.replace(/z/g, "\u1710\u1714");
  rawText = rawText.replace(/h/g, "\u1711\u1714");
  rawText = rawText.replace(/j/g, "\u1711\u1714");

  return rawText;
}

// Word lists by difficulty
export const wordLists = {
  beginner: [
    { word: "bata", translation: "child" },
    { word: "mata", translation: "eye" },
    { word: "paa", translation: "foot" },
    { word: "kamay", translation: "hand" },
    { word: "ulo", translation: "head" },
    { word: "aso", translation: "dog" },
    { word: "pusa", translation: "cat" },
    { word: "bahay", translation: "house" },
    { word: "araw", translation: "sun" },
    { word: "buwan", translation: "moon" },
    { word: "tubig", translation: "water" },
    { word: "pagkain", translation: "food" },
    { word: "damit", translation: "clothes" },
    { word: "sapatos", translation: "shoes" },
    { word: "libro", translation: "book" },
    { word: "lapis", translation: "pencil" },
    { word: "mesa", translation: "table" },
    { word: "upuan", translation: "chair" },
    { word: "pinto", translation: "door" },
    { word: "bintana", translation: "window" }
  ],
  intermediate: [
    { word: "maganda", translation: "beautiful" },
    { word: "mahalaga", translation: "important" },
    { word: "kumusta", translation: "hello" },
    { word: "salamat", translation: "thank you" },
    { word: "paumanhin", translation: "sorry" },
    { word: "magandang gabi", translation: "good evening" },
    { word: "magandang umaga", translation: "good morning" },
    { word: "kumakain", translation: "eating" },
    { word: "naglalakad", translation: "walking" },
    { word: "nagsasalita", translation: "speaking" },
    { word: "manunulat", translation: "writer" },
    { word: "guro", translation: "teacher" },
    { word: "doktor", translation: "doctor" },
    { word: "nars", translation: "nurse" },
    { word: "pulis", translation: "police" },
    { word: "sundalo", translation: "soldier" },
    { word: "magsasaka", translation: "farmer" },
    { word: "mangingisda", translation: "fisherman" },
    { word: "manggagawa", translation: "worker" },
    { word: "mamamayan", translation: "citizen" }
  ],
  expert: [
    { word: "kalayaan", translation: "freedom" },
    { word: "kapayapaan", translation: "peace" },
    { word: "katarungan", translation: "justice" },
    { word: "karapatan", translation: "rights" },
    { word: "bayanihan", translation: "community unity" },
    { word: "pag-ibig", translation: "love" },
    { word: "pag-asa", translation: "hope" },
    { word: "pananampalataya", translation: "faith" },
    { word: "karunungan", translation: "wisdom" },
    { word: "kabutihan", translation: "goodness" },
    { word: "katapangan", translation: "courage" },
    { word: "pagkakaibigan", translation: "friendship" },
    { word: "pagkakaisa", translation: "unity" },
    { word: "pamumuhay", translation: "way of life" },
    { word: "kasaysayan", translation: "history" },
    { word: "kultura", translation: "culture" },
    { word: "tradisyon", translation: "tradition" },
    { word: "paniniwala", translation: "belief" },
    { word: "adobo", translation: "adobo" },
    { word: "sinigang", translation: "sinigang" }
  ]
};

// Get a random word from the specified difficulty
export function getRandomWord(difficulty) {
  const words = wordLists[difficulty];
  return words[Math.floor(Math.random() * words.length)];
}

// Get all available Baybayin characters for the game tiles
export function getBaybayinTiles() {
  return [
    // Vowels
    { char: '\u1700', latin: 'a', type: 'vowel' },
    { char: '\u1701', latin: 'i/e', type: 'vowel' },
    { char: '\u1702', latin: 'o/u', type: 'vowel' },
    
    // Consonants with 'a'
    { char: '\u1703', latin: 'ka', type: 'consonant' },
    { char: '\u1704', latin: 'ga', type: 'consonant' },
    { char: '\u1705', latin: 'nga', type: 'consonant' },
    { char: '\u1706', latin: 'ta', type: 'consonant' },
    { char: '\u1707', latin: 'da/ra', type: 'consonant' },
    { char: '\u1708', latin: 'na', type: 'consonant' },
    { char: '\u1709', latin: 'pa', type: 'consonant' },
    { char: '\u170A', latin: 'ba', type: 'consonant' },
    { char: '\u170B', latin: 'ma', type: 'consonant' },
    { char: '\u170C', latin: 'ya', type: 'consonant' },
    { char: '\u170E', latin: 'la', type: 'consonant' },
    { char: '\u170F', latin: 'wa', type: 'consonant' },
    { char: '\u1710', latin: 'sa', type: 'consonant' },
    { char: '\u1711', latin: 'ha', type: 'consonant' },
    
    // Kudlit (diacritics)
    { char: '\u1712', latin: 'i/e kudlit', type: 'kudlit' },
    { char: '\u1713', latin: 'o/u kudlit', type: 'kudlit' },
    { char: '\u1714', latin: 'virama', type: 'kudlit' }
  ];
}
