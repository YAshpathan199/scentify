import { OCCASIONS, SEASONS, TIME_OF_DAY, DRESS_CODES, MOODS } from '../data/constants';

const FORMAL_OCCASIONS = [
  'wedding-ceremony',
  'reception',
  'engagement',
  'business-meeting',
  'interview',
  'diwali',
  'eid',
];

const CASUAL_OCCASIONS = [
  'friends-outing',
  'movie-mall',
  'brunch-cafe',
  'house-party',
  'airport-travel',
  'holi',
];

function findLabel(list, id) {
  const item = list.find((entry) => entry.id === id);
  return item ? item.label : id;
}

export function calculateQuizScores(fragrances, answers) {
  const maxScore = 34.5;

  const results = fragrances.map((fragrance) => {
    let score = 0;
    const reasons = [];

    // Occasion match (+10)
    if (answers.occasion && fragrance.occasions.includes(answers.occasion)) {
      score += 10;
      reasons.push(`Great for ${findLabel(OCCASIONS, answers.occasion)}`);
    }

    // Season match (+8)
    if (answers.season && fragrance.seasons.includes(answers.season)) {
      score += 8;
      reasons.push(`Perfect for ${findLabel(SEASONS, answers.season)}`);
    }

    // Time of day match (+6)
    if (answers.timeOfDay && fragrance.timeOfDay.includes(answers.timeOfDay)) {
      score += 6;
      reasons.push(`Ideal for ${findLabel(TIME_OF_DAY, answers.timeOfDay)}`);
    }

    // Dress code match (+4)
    if (answers.dressCode && fragrance.dressCodes.includes(answers.dressCode)) {
      score += 4;
      reasons.push(`Works with ${findLabel(DRESS_CODES, answers.dressCode)} wear`);
    }

    // Mood match (+3)
    if (answers.mood && fragrance.mood.includes(answers.mood)) {
      score += 3;
      reasons.push(`Matches your ${findLabel(MOODS, answers.mood)} mood`);
    }

    // Rating bonus
    score += fragrance.rating * 0.5;

    // Family bonus (+1)
    if (
      answers.occasion &&
      FORMAL_OCCASIONS.includes(answers.occasion) &&
      ['oriental', 'woody'].includes(fragrance.family)
    ) {
      score += 1;
      reasons.push('Great family for formal occasions');
    } else if (
      answers.occasion &&
      CASUAL_OCCASIONS.includes(answers.occasion) &&
      ['fresh', 'citrus', 'aquatic'].includes(fragrance.family)
    ) {
      score += 1;
      reasons.push('Great family for casual occasions');
    }

    const percentage = Math.min(Math.round((score / maxScore) * 100), 100);

    return {
      fragrance,
      score,
      maxScore,
      percentage,
      reasons,
    };
  });

  results.sort((a, b) => b.score - a.score);

  return results;
}

export function calculateOccasionScores(fragrances, occasionId, currentSeason) {
  const results = fragrances
    .map((fragrance) => {
      let score = 0;

      // Occasion match (+10)
      if (fragrance.occasions.includes(occasionId)) {
        score += 10;
      }

      // Current season match (+5)
      if (currentSeason && fragrance.seasons.includes(currentSeason)) {
        score += 5;
      }

      // Rating bonus
      score += fragrance.rating * 0.5;

      return { fragrance, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return results;
}
