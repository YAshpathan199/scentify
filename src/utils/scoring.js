import { rank } from './engine.js';

export function calculateQuizScores(fragrances, answers, opts = {}) {
  const scored = rank(fragrances, answers, opts);

  return scored.map(s => ({
    fragrance: s.fragrance,
    score: s.score,
    maxScore: 1,
    percentage: Math.min(Math.round(s.score * 100), 100),
    reasons: s.reasons.filter(r => r.tone === 'good').map(r => r.text),
    tier: s.tier,
    parts: s.parts,
    allReasons: s.reasons,
  }));
}

export function calculateOccasionScores(fragrances, occasionId, currentSeason) {
  const answers = { occasion: occasionId, season: currentSeason };
  const scored = rank(fragrances, answers);
  return scored
    .filter(s => s.score > 0.3)
    .slice(0, 5)
    .map(s => ({
      fragrance: s.fragrance,
      score: s.score,
      tier: s.tier,
    }));
}
