/**
 * Normalizes a Romanized Urdu/English string to standardized phonetics
 * to account for common spelling variations.
 */
export function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\(.*\)/g, '') // Remove parenthesis like (ع), (س), (a.s)
    .replace(/[-_/]/g, ' ') // Convert hyphens, underscores, slashes to spaces
    .replace(/[^a-z0-9\s]/g, '') // Keep only alphanumeric and spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
    // Normalizing vowels
    .replace(/aa+/g, 'a')
    .replace(/ee+/g, 'i')
    .replace(/oo+/g, 'u')
    .replace(/ai/g, 'i')
    .replace(/ay/g, 'i')
    .replace(/y/g, 'i')
    .replace(/e/g, 'i')
    .replace(/o/g, 'u')
    // Normalizing double consonants
    .replace(/bb+/g, 'b')
    .replace(/cc+/g, 'c')
    .replace(/dd+/g, 'd')
    .replace(/ff+/g, 'f')
    .replace(/gg+/g, 'g')
    .replace(/hh+/g, 'h')
    .replace(/jj+/g, 'j')
    .replace(/kk+/g, 'k')
    .replace(/ll+/g, 'l')
    .replace(/mm+/g, 'm')
    .replace(/nn+/g, 'n')
    .replace(/pp+/g, 'p')
    .replace(/rr+/g, 'r')
    .replace(/ss+/g, 's')
    .replace(/tt+/g, 't')
    .replace(/vv+/g, 'v')
    .replace(/ww+/g, 'w')
    .replace(/zz+/g, 'z')
    // Normalizing phonetically similar sounds
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/ph/g, 'f')
    .replace(/sh/g, 's')
    .replace(/th/g, 't');
}

/**
 * Calculates the Levenshtein distance between two strings.
 */
export function levenshteinDistance(a, b) {
  const tmp = [];
  let i, j, alen = a.length, blen = b.length;

  if (alen === 0) return blen;
  if (blen === 0) return alen;

  for (i = 0; i <= alen; i++) tmp[i] = [i];
  for (j = 0; j <= blen; j++) tmp[0][j] = j;

  for (i = 1; i <= alen; i++) {
    for (j = 1; j <= blen; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        a[i - 1] === b[j - 1] ? tmp[i - 1][j - 1] : tmp[i - 1][j - 1] + 1
      );
    }
  }
  return tmp[alen][blen];
}

/**
 * Calculates a similarity ratio between 0 (completely different) and 1 (identical).
 */
export function getSimilarity(a, b) {
  const normA = normalizeString(a);
  const normB = normalizeString(b);
  if (!normA || !normB) return 0;
  if (normA === normB) return 1;

  const distance = levenshteinDistance(normA, normB);
  const maxLength = Math.max(normA.length, normB.length);
  return 1 - distance / maxLength;
}

/**
 * Performs custom fuzzy and relevance-based ranking over a list of lyric items.
 */
export function rankLyrics(lyrics, query) {
  if (!query) {
    // If no query, return lyrics sorted by orderNumber
    return [...lyrics].sort((a, b) => a.orderNumber - b.orderNumber);
  }

  const queryClean = query.toLowerCase().trim();
  const queryNorm = normalizeString(query);
  const queryWords = queryNorm.split(' ').filter(w => w.length > 1);

  const scoredLyrics = lyrics.map((lyric) => {
    let score = 0;
    let matchReasons = [];

    const titleLower = lyric.title.toLowerCase();
    const personLower = lyric.person.toLowerCase();
    const reciterLower = lyric.reciter ? lyric.reciter.toLowerCase() : '';
    const categoryLower = lyric.category.toLowerCase();
    const engLyricsLower = lyric.lyricsEnglish.toLowerCase();
    const urdLyricsLower = lyric.lyricsUrdu; // Urdu script

    // 1. FULL STRING MATCHES (Highest weights)
    if (titleLower === queryClean) {
      score += 100;
      matchReasons.push('Exact Title Match');
    }
    if (personLower.includes(queryClean)) {
      score += 30;
      matchReasons.push('Person Exact Containment');
    }

    if (titleLower.startsWith(queryClean)) {
      score += 50;
      matchReasons.push('Title Starts With');
    } else if (titleLower.includes(queryClean)) {
      score += 25;
      matchReasons.push('Title Substring');
    }

    // Full similarity score
    const titleSimilarity = getSimilarity(lyric.title, query);
    if (titleSimilarity > 0.8) {
      score += titleSimilarity * 40;
      matchReasons.push(`Fuzzy Title Match (${Math.round(titleSimilarity * 100)}%)`);
    }

    // 2. WORD-BY-WORD FUZZY MATCHES (Solves multi-word queries like "Salam Abbas")
    const titleWords = normalizeString(lyric.title).split(' ').filter(w => w.length > 1);
    const personWords = normalizeString(lyric.person).split(' ').filter(w => w.length > 1);
    const reciterWords = reciterLower ? normalizeString(lyric.reciter).split(' ').filter(w => w.length > 1) : [];

    queryWords.forEach(qWord => {
      // Check title words
      titleWords.forEach(tWord => {
        const dist = levenshteinDistance(tWord, qWord);
        const maxLen = Math.max(tWord.length, qWord.length);
        const sim = 1 - dist / maxLen;
        if (sim >= 0.75) {
          score += sim * 35;
          matchReasons.push(`Title Word Match "${tWord}" ~ "${qWord}" (${Math.round(sim * 100)}%)`);
        }
      });

      // Check person words
      personWords.forEach(pWord => {
        const dist = levenshteinDistance(pWord, qWord);
        const maxLen = Math.max(pWord.length, qWord.length);
        const sim = 1 - dist / maxLen;
        if (sim >= 0.75) {
          score += sim * 20;
          matchReasons.push(`Person Word Match "${pWord}" ~ "${qWord}" (${Math.round(sim * 100)}%)`);
        }
      });

      // Check reciter words
      reciterWords.forEach(rWord => {
        const dist = levenshteinDistance(rWord, qWord);
        const maxLen = Math.max(rWord.length, qWord.length);
        const sim = 1 - dist / maxLen;
        if (sim >= 0.75) {
          score += sim * 15;
          matchReasons.push(`Reciter Word Match "${rWord}" ~ "${qWord}" (${Math.round(sim * 100)}%)`);
        }
      });
    });

    // 3. Lyrics content search (English / Roman Urdu)
    if (engLyricsLower.includes(queryClean)) {
      score += 12;
      matchReasons.push('Lyrics Content Match');
    } else {
      let wordMatches = 0;
      queryWords.forEach(word => {
        if (engLyricsLower.includes(word)) wordMatches++;
      });
      if (wordMatches > 0) {
        score += wordMatches * 3;
        matchReasons.push(`${wordMatches} Word Match(es) in Lyrics`);
      }
    }

    // 4. Urdu content search
    if (urdLyricsLower.includes(queryClean)) {
      score += 12;
      matchReasons.push('Urdu Lyrics Content Match');
    }

    return {
      lyric,
      score,
      matchReasons
    };
  });

  // Filter out items with score of 0, then sort by score descending
  return scoredLyrics
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.lyric.orderNumber - b.lyric.orderNumber)
    .map(item => item.lyric);
}
