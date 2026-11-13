// Recommendation engine adapted from github.com/davidbeck45/almanac.
// Weighted component scoring with accord-based matching, heaviness-driven
// season/weather fit, performance-aware ranking, and tier assignment.

import { heaviness, accordFit, noteAccords, clamp } from './accords.js';
import { OCCASIONS as OCCASION_LIST, OCCASION_INTENSITY } from '../data/constants.js';

// --- Season target heaviness (Indian climate) ---
const SEASON_TARGET = {
  summer: -0.7,
  monsoon: -0.4,
  autumn: 0.1,
  winter: 0.6,
  spring: -0.2,
};

// --- Time-of-day heaviness preference ---
const TIME_TARGET = {
  morning: -0.3,
  afternoon: -0.1,
  evening: 0.3,
  night: 0.5,
};

// --- Occasion archetype mapping ---
// Maps scentify's 31 occasions to almanac's 7 occasion types.
const OCCASION_ARCHETYPE = {
  mehendi: 'formal', sangeet: 'nightout', 'wedding-ceremony': 'formal',
  reception: 'formal', engagement: 'formal',
  diwali: 'formal', holi: 'outdoors', eid: 'formal', navratri: 'nightout',
  'ganesh-chaturthi': 'formal', 'christmas-newyear': 'nightout',
  'pongal-onam': 'casual', 'raksha-bandhan': 'casual',
  office: 'office', interview: 'office', 'business-meeting': 'office',
  conference: 'office', 'office-party': 'casual',
  'dinner-date': 'date', 'friends-outing': 'casual', 'movie-mall': 'casual',
  'house-party': 'nightout', 'club-nightlife': 'nightout', 'brunch-cafe': 'casual',
  'temple-visit': 'cozy', 'pooja-home': 'cozy', 'prayer-gathering': 'cozy',
  'first-date': 'date', anniversary: 'date', birthday: 'nightout',
  graduation: 'formal', 'airport-travel': 'outdoors',
};

// --- Accord profiles per occasion archetype (from almanac) ---
const OCCASION_PROFILES = {
  casual: {
    'fresh spicy': 0.3, citrus: 0.3, woody: 0.3, aromatic: 0.3, fresh: 0.3,
    fruity: 0.2, musky: 0.2, lavender: 0.2, green: 0.2, herbal: 0.2,
    aquatic: 0.2, ozonic: 0.2, marine: 0.2, sweet: 0.1, floral: 0.1,
    earthy: 0.1, 'soft spicy': 0.1,
    vanilla: 0, 'warm spicy': 0, amber: 0, patchouli: 0,
    leather: -0.2, tobacco: -0.2, smoky: -0.2, oud: -0.3, animalic: -0.4,
  },
  office: {
    citrus: 0.6, fresh: 0.6, iris: 0.6, aromatic: 0.5, musky: 0.5,
    green: 0.5, 'fresh spicy': 0.4, lavender: 0.4, woody: 0.4,
    aquatic: 0.4, ozonic: 0.4, marine: 0.4, violet: 0.3, herbal: 0.3,
    'white floral': 0.2, mossy: 0.2, floral: 0.1, earthy: 0.1, rose: 0.1,
    vanilla: -0.2, 'warm spicy': -0.3, amber: -0.3, leather: -0.4,
    smoky: -0.4, sweet: -0.5, tobacco: -0.5, oud: -0.7, animalic: -0.8,
  },
  date: {
    vanilla: 0.7, amber: 0.6, 'warm spicy': 0.5, leather: 0.5, musky: 0.5,
    sweet: 0.4, rose: 0.4, cinnamon: 0.4, 'soft spicy': 0.4, balsamic: 0.4,
    tobacco: 0.4, iris: 0.3, 'white floral': 0.3, oud: 0.3, cherry: 0.3,
    coffee: 0.3, woody: 0.2, floral: 0.2, patchouli: 0.2,
    fruity: 0.1, smoky: 0.1,
    citrus: -0.3, herbal: -0.3, green: -0.4, fresh: -0.4,
    aquatic: -0.6, ozonic: -0.6, marine: -0.6,
  },
  nightout: {
    sweet: 0.7, vanilla: 0.6, fruity: 0.5, 'warm spicy': 0.5, cinnamon: 0.5,
    amber: 0.5, cherry: 0.4, tropical: 0.3, leather: 0.3, tobacco: 0.3,
    oud: 0.3, coffee: 0.3, 'fresh spicy': 0.2, 'soft spicy': 0.2,
    aromatic: 0.1, woody: 0.1, musky: 0.1, smoky: 0.1,
    citrus: 0, fresh: 0, floral: 0,
    aquatic: -0.2, ozonic: -0.2, marine: -0.2, iris: -0.3,
    green: -0.4, earthy: -0.4,
  },
  formal: {
    iris: 0.7, leather: 0.6, woody: 0.5, amber: 0.4, rose: 0.4,
    lavender: 0.4, aromatic: 0.4, mossy: 0.4, oud: 0.3, musky: 0.3,
    'warm spicy': 0.3, 'white floral': 0.3, balsamic: 0.3, patchouli: 0.3,
    tobacco: 0.3, 'fresh spicy': 0.2, floral: 0.2, earthy: 0.2, smoky: 0.2,
    citrus: 0.1,
    vanilla: 0, fresh: 0, green: 0,
    fruity: -0.4, aquatic: -0.4, sweet: -0.5, tropical: -0.6, coconut: -0.6,
  },
  outdoors: {
    citrus: 0.8, aquatic: 0.8, ozonic: 0.8, marine: 0.8, fresh: 0.7,
    green: 0.6, 'fresh spicy': 0.4, herbal: 0.4, aromatic: 0.3,
    tropical: 0.3, fruity: 0.2, musky: 0.1,
    woody: 0, floral: 0,
    amber: -0.5, 'warm spicy': -0.5, vanilla: -0.6, leather: -0.6,
    tobacco: -0.6, oud: -0.7,
  },
  cozy: {
    vanilla: 0.7, powdery: 0.5, sweet: 0.4, amber: 0.4, cinnamon: 0.4,
    musky: 0.4, 'warm spicy': 0.4, coffee: 0.4, 'soft spicy': 0.3,
    balsamic: 0.3, tobacco: 0.3, woody: 0.2, lavender: 0.2, cherry: 0.2,
    floral: 0.1, rose: 0.1, smoky: 0.1,
    aromatic: 0, earthy: 0,
    leather: -0.2, oud: -0.2, 'fresh spicy': -0.3, fresh: -0.3,
    citrus: -0.4, green: -0.4, aquatic: -0.6,
  },
};

// --- Performance expectations per archetype ---
const PERF_EXPECT = {
  office:   { sillage: -0.8, longevity: 0.4 },
  date:     { sillage: 0.1,  longevity: 0.5 },
  nightout: { sillage: 0.6,  longevity: 0.3 },
  formal:   { sillage: -0.2, longevity: 0.6 },
  casual:   { sillage: 0.0,  longevity: 0.0 },
  outdoors: { sillage: 0.2,  longevity: -0.2 },
  cozy:     { sillage: -0.5, longevity: 0.2 },
};

// --- Dress code → family affinity ---
const DRESS_FAMILY = {
  ethnic:         { oriental: 0.4, woody: 0.2, floral: 0.3, gourmand: 0.1 },
  formal:         { woody: 0.3, oriental: 0.3, aromatic: 0.3, floral: 0.1 },
  'smart-casual': { aromatic: 0.3, woody: 0.3, citrus: 0.2, fresh: 0.2 },
  casual:         { citrus: 0.3, fresh: 0.3, aquatic: 0.2, aromatic: 0.2 },
};

// --- Mood → heaviness lean ---
const MOOD_TARGET = {
  confident: 0.2,
  romantic: 0.4,
  chill: -0.2,
  energetic: -0.5,
  elegant: 0.1,
};

// --- Score weights ---
export const WEIGHTS = Object.freeze({
  season: 0.25,
  occasion: 0.25,
  time: 0.12,
  weather: 0.12,
  performance: 0.10,
  dressCode: 0.06,
  mood: 0.05,
  quality: 0.05,
});

// --- Tier system ---
const TIER_SIZES = [['S', 3], ['A', 5], ['B', 6]];
const TIER_FLOORS = { S: 0.72, A: 0.55, B: 0, C: -Infinity };
const TIERS = ['S', 'A', 'B', 'C'];

// --- Rotation penalty ---
const ROTATION_PENALTY = [0.20, 0.12, 0.08, 0.06, 0.04, 0.03, 0.02, 0.015, 0.01, 0.005];

function daysBetween(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

function rotationPenalty(fragId, history, todayISO) {
  let penalty = 0;
  for (const h of history) {
    if (h.fragranceId !== fragId) continue;
    const d = daysBetween(h.date, todayISO);
    if (d < 0 || d >= ROTATION_PENALTY.length) continue;
    penalty = Math.max(penalty, ROTATION_PENALTY[d]);
  }
  return penalty;
}

// --- Component scoring functions ---

// Season fit: how well does the fragrance suit the selected season?
// Combines tag match with heaviness alignment.
function seasonFit(frag, seasonId) {
  if (!seasonId) return 0.5;
  const tagMatch = frag.seasons?.includes(seasonId) ? 1 : 0;
  const target = SEASON_TARGET[seasonId] ?? 0;
  const h = heaviness(frag);
  const dist = Math.abs(h - target);
  const heavinessFit = 1 - dist / 2;
  return 0.4 * tagMatch + 0.6 * heavinessFit;
}

// Time-of-day fit: heaviness alignment with time preference.
function timeFit(frag, timeId) {
  if (!timeId) return 0.5;
  const tagMatch = frag.timeOfDay?.includes(timeId) ? 1 : 0;
  const target = TIME_TARGET[timeId] ?? 0;
  const h = heaviness(frag);
  const dist = Math.abs(h - target);
  const heavinessFit = 1 - dist / 2;
  return 0.5 * tagMatch + 0.5 * heavinessFit;
}

// Weather fit: how well does the fragrance's heaviness suit the season's climate?
function weatherFit(frag, seasonId) {
  if (!seasonId) return 0.5;
  const target = SEASON_TARGET[seasonId] ?? 0;
  const h = heaviness(frag);

  // Quadratic penalty for being too heavy in summer or too light in winter
  const diff = h - target;
  const wrongWay = (seasonId === 'summer' || seasonId === 'monsoon') ? Math.max(0, diff) : (seasonId === 'winter' ? Math.max(0, -diff) : 0);
  const penalty = wrongWay * wrongWay;
  return clamp(1 - Math.abs(diff) / 2 - penalty * 0.5, 0, 1);
}

// Occasion fit: accord profile match + tag match.
function occasionFit(frag, occasionId) {
  if (!occasionId) return 0.5;
  const tagMatch = frag.occasions?.includes(occasionId) ? 1 : 0;
  const archetype = OCCASION_ARCHETYPE[occasionId] ?? 'casual';
  const profile = OCCASION_PROFILES[archetype];
  if (!profile) return tagMatch;

  // Accord-based fit, scaled to 0..1
  const raw = accordFit(frag, profile);
  const accordScore = clamp((raw + 0.5) / 1.0, 0, 1);

  return 0.4 * tagMatch + 0.6 * accordScore;
}

// Performance fit: longevity and projection vs occasion expectations.
function performanceFit(frag, occasionId) {
  if (!occasionId) return 0.5;
  const archetype = OCCASION_ARCHETYPE[occasionId] ?? 'casual';
  const expect = PERF_EXPECT[archetype] ?? { sillage: 0, longevity: 0 };

  // Normalize longevity: 1-10 → -1..+1 (5.5 center)
  const longevityLevel = clamp(((frag.longevity ?? 6) - 5.5) / 4.5, -1, 1);
  // Normalize projection: soft=-0.7, moderate=0, strong=0.5, beast=1
  const projMap = { soft: -0.7, moderate: 0, strong: 0.5, beast: 1 };
  const sillageLevel = projMap[frag.projection] ?? 0;

  // How well levels match expectations: agreement gives a boost, mismatch a penalty
  const longevityFit = expect.longevity === 0 ? 0.5 : 0.5 + 0.5 * clamp(expect.longevity * longevityLevel, -1, 1);
  const sillageFit = expect.sillage === 0 ? 0.5 : 0.5 + 0.5 * clamp(expect.sillage * sillageLevel, -1, 1);

  return 0.5 * longevityFit + 0.5 * sillageFit;
}

// Dress code fit: family affinity + tag match.
function dressFit(frag, dressCode) {
  if (!dressCode) return 0.5;
  const tagMatch = frag.dressCodes?.includes(dressCode) ? 1 : 0;
  const affinities = DRESS_FAMILY[dressCode];
  const familyBonus = affinities?.[frag.family] ?? 0;
  return 0.5 * tagMatch + 0.5 * clamp(0.5 + familyBonus, 0, 1);
}

// Mood fit: heaviness alignment with mood target + tag match.
function moodFit(frag, mood) {
  if (!mood) return 0.5;
  const tagMatch = frag.mood?.includes(mood) ? 1 : 0;
  const target = MOOD_TARGET[mood] ?? 0;
  const h = heaviness(frag);
  const heavinessFit = 1 - Math.abs(h - target) / 2;
  return 0.5 * tagMatch + 0.5 * heavinessFit;
}

// Quality: rating normalized to 0..1.
function qualityScore(frag) {
  return clamp(((frag.rating ?? 3) - 1) / 4, 0, 1);
}

// --- Weighted score ---
function scoreOf(parts) {
  let score = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    score += weight * (parts[key] ?? 0.5);
  }
  return score - (parts.rotation ?? 0);
}

// --- Reason generation ---
function generateReasons(frag, parts, answers) {
  const reasons = [];
  const h = heaviness(frag);

  // Season
  if (answers.season && frag.seasons?.includes(answers.season)) {
    const seasonNames = { summer: 'summer', monsoon: 'monsoon', autumn: 'autumn', winter: 'winter', spring: 'spring' };
    reasons.push({ text: `Built for ${seasonNames[answers.season] ?? answers.season}`, tone: 'good', strength: parts.season });
  } else if (answers.season && parts.season < 0.4) {
    reasons.push({ text: `Not ideal for this season`, tone: 'bad', strength: 1 - parts.season });
  }

  // Weather alignment
  if (answers.season) {
    const target = SEASON_TARGET[answers.season] ?? 0;
    if ((answers.season === 'summer' || answers.season === 'monsoon') && h <= -0.3) {
      reasons.push({ text: 'Fresh notes cut the heat', tone: 'good', strength: 0.7 });
    } else if ((answers.season === 'summer' || answers.season === 'monsoon') && h >= 0.4) {
      reasons.push({ text: 'Heavy for this weather', tone: 'bad', strength: 0.8 });
    } else if (answers.season === 'winter' && h >= 0.3) {
      reasons.push({ text: 'Rich warmth for cold weather', tone: 'good', strength: 0.7 });
    } else if (answers.season === 'winter' && h <= -0.4) {
      reasons.push({ text: 'Too light for winter', tone: 'bad', strength: 0.6 });
    }
  }

  // Occasion
  if (answers.occasion) {
    const archetype = OCCASION_ARCHETYPE[answers.occasion];
    const occLabel = OCCASION_LIST.find(o => o.id === answers.occasion)?.label ?? answers.occasion;
    if (frag.occasions?.includes(answers.occasion)) {
      reasons.push({ text: `Great pick for ${occLabel}`, tone: 'good', strength: parts.occasion });
    }
    if (archetype === 'office' && h <= -0.2) {
      reasons.push({ text: 'Clean and office-appropriate', tone: 'good', strength: 0.5 });
    } else if (archetype === 'date' && h >= 0.2) {
      reasons.push({ text: 'Warm allure suits a date', tone: 'good', strength: 0.6 });
    } else if (archetype === 'nightout' && (frag.projection === 'strong' || frag.projection === 'beast')) {
      reasons.push({ text: 'Projects through the crowd', tone: 'good', strength: 0.5 });
    } else if (archetype === 'formal' && ['woody', 'oriental'].includes(frag.family)) {
      reasons.push({ text: 'Refined family for formal wear', tone: 'good', strength: 0.5 });
    } else if (archetype === 'cozy' && ['oriental', 'woody', 'gourmand'].includes(frag.family)) {
      reasons.push({ text: 'Comforting and close-wearing', tone: 'good', strength: 0.5 });
    }
  }

  // Performance
  if (frag.longevity >= 8) {
    reasons.push({ text: `Lasts ${frag.longevity}+ hours`, tone: 'good', strength: 0.4 });
  } else if (frag.longevity <= 4) {
    reasons.push({ text: 'Fades early — carry a decant', tone: 'bad', strength: 0.3 });
  }

  // Time
  if (answers.timeOfDay && frag.timeOfDay?.includes(answers.timeOfDay)) {
    const timeNames = { morning: 'morning', afternoon: 'afternoon', evening: 'evening', night: 'nighttime' };
    reasons.push({ text: `Ideal for ${timeNames[answers.timeOfDay] ?? answers.timeOfDay}`, tone: 'good', strength: parts.time });
  }

  // Dress code
  if (answers.dressCode && frag.dressCodes?.includes(answers.dressCode)) {
    const dressNames = { ethnic: 'ethnic wear', formal: 'formal attire', 'smart-casual': 'smart-casual', casual: 'casual' };
    reasons.push({ text: `Works with ${dressNames[answers.dressCode] ?? answers.dressCode}`, tone: 'good', strength: 0.3 });
  }

  // Mood
  if (answers.mood && frag.mood?.includes(answers.mood)) {
    const moodNames = { confident: 'confident', romantic: 'romantic', chill: 'chill', energetic: 'energetic', elegant: 'elegant' };
    reasons.push({ text: `Matches your ${moodNames[answers.mood] ?? answers.mood} vibe`, tone: 'good', strength: 0.2 });
  }

  // Rating
  if (frag.rating >= 5) {
    reasons.push({ text: 'Top-rated in the collection', tone: 'good', strength: 0.3 });
  }

  // Sort: good before bad, then by strength
  reasons.sort((a, b) => (b.tone === 'good') - (a.tone === 'good') || b.strength - a.strength);
  return reasons;
}

// --- Main ranking function ---
export function rank(fragrances, answers, opts = {}) {
  const { history = [], todayISO = new Date().toISOString().split('T')[0] } = opts;

  const scored = fragrances.map(frag => {
    const rotation = rotationPenalty(frag.id, history, todayISO);
    const parts = {
      season: seasonFit(frag, answers.season),
      occasion: occasionFit(frag, answers.occasion),
      time: timeFit(frag, answers.timeOfDay),
      weather: weatherFit(frag, answers.season),
      performance: performanceFit(frag, answers.occasion),
      dressCode: dressFit(frag, answers.dressCode),
      mood: moodFit(frag, answers.mood),
      quality: qualityScore(frag),
      rotation,
    };
    const score = scoreOf(parts);
    const reasons = generateReasons(frag, parts, answers);
    return { fragrance: frag, score, parts, reasons };
  });

  scored.sort((a, b) => b.score - a.score);

  // Assign tiers
  let i = 0;
  for (const [tier, size] of TIER_SIZES) {
    for (let n = 0; n < size && i < scored.length; n++, i++) scored[i].tier = tier;
  }
  for (; i < scored.length; i++) scored[i].tier = 'C';
  // Enforce floor scores
  for (const s of scored) {
    while (s.score < TIER_FLOORS[s.tier]) s.tier = TIERS[TIERS.indexOf(s.tier) + 1];
  }

  return scored;
}

// --- Discover page scoring (multi-filter with engine boost) ---
export function discoverScore(frag, filters) {
  let matched = 0, total = 0;

  if (filters.season?.length) {
    total++;
    if (filters.season.some(s => frag.seasons?.includes(s))) matched++;
  }
  if (filters.timeOfDay?.length) {
    total++;
    if (filters.timeOfDay.some(t => frag.timeOfDay?.includes(t))) matched++;
  }
  if (filters.dressCode?.length) {
    total++;
    if (filters.dressCode.some(d => frag.dressCodes?.includes(d))) matched++;
  }
  if (filters.occasionIds?.length) {
    total++;
    if (filters.occasionIds.some(o => frag.occasions?.includes(o))) matched++;
  }
  if (total === 0) return { score: 0, matchPercent: 100, relevance: 0.5 };

  const matchPercent = Math.round((matched / total) * 100);

  // Engine-based relevance within matched results
  const season = filters.season?.[0];
  const time = filters.timeOfDay?.[0];
  const h = heaviness(frag);
  const seasonTarget = season ? SEASON_TARGET[season] ?? 0 : 0;
  const timeTarget = time ? TIME_TARGET[time] ?? 0 : 0;
  const seasonAlign = 1 - Math.abs(h - seasonTarget) / 2;
  const timeAlign = 1 - Math.abs(h - timeTarget) / 2;
  const relevance = 0.5 * seasonAlign + 0.3 * timeAlign + 0.2 * qualityScore(frag);

  return { score: matched, matchPercent, relevance };
}

// --- Dynamic spray guide ---
export function dynamicSprayGuide(frag, seasonId, occasionId, concentration) {
  const h = heaviness(frag);
  const archetype = OCCASION_ARCHETYPE[occasionId] ?? 'casual';
  const intensity = OCCASION_INTENSITY[occasionId] ?? 'moderate';

  // Base from concentration
  const concBase = { EDC: 5, EDT: 4, EDP: 3, Parfum: 2 };
  let base = concBase[concentration] ?? 3;

  // Season adjustment: heat reduces, cold increases
  const seasonAdj = { summer: -1, monsoon: -0.5, autumn: 0, winter: 1, spring: 0 };
  base += seasonAdj[seasonId] ?? 0;

  // Heaviness: heavy frags need fewer sprays in heat, more in cold
  const seasonTarget = SEASON_TARGET[seasonId] ?? 0;
  if (seasonTarget < -0.3 && h > 0.2) base -= 0.5;
  if (seasonTarget > 0.3 && h < -0.2) base += 0.5;

  // Sillage/longevity: strong projection → fewer sprays
  const projAdj = { soft: 1, moderate: 0, strong: -0.5, beast: -1 };
  base += projAdj[frag.projection] ?? 0;

  // Longevity: short-lived needs more
  if ((frag.longevity ?? 6) <= 4) base += 0.5;
  if ((frag.longevity ?? 6) >= 9) base -= 0.5;

  // Occasion: office/cozy → fewer, nightout → more
  const occAdj = { office: -1, cozy: -0.5, date: -0.5, formal: -0.25, casual: 0, nightout: 1, outdoors: 0.5 };
  base += occAdj[archetype] ?? 0;

  const sprays = [Math.max(1, Math.round(base - 0.5)), Math.max(2, Math.round(base + 0.5))];
  if (sprays[0] > sprays[1]) sprays[0] = sprays[1];

  // Placement: guided by heaviness, season, occasion
  const isHot = seasonTarget < -0.3;
  const isCold = seasonTarget > 0.3;
  const isOffice = archetype === 'office';
  const isDate = archetype === 'date';

  let where, skinOrClothes;
  if (isOffice || (isHot && h > 0)) {
    where = ['chest', 'stomach'];
    skinOrClothes = 'skin';
  } else if (isDate) {
    where = ['neck', 'chest', 'wrists'];
    skinOrClothes = 'skin';
  } else if (isCold) {
    where = ['neck', 'chest', 'collar or scarf', 'wrists'];
    skinOrClothes = 'both';
  } else if (archetype === 'nightout') {
    where = ['neck', 'chest', 'back of neck', 'wrists'];
    skinOrClothes = 'both';
  } else {
    where = ['neck', 'chest', 'wrists'];
    skinOrClothes = 'skin';
  }
  where = where.slice(0, Math.max(1, Math.min(sprays[1], where.length)));

  // Tips
  const tips = [];
  if (isHot && h > 0.3) tips.push('Heavy for this heat — go light');
  else if (isHot && h <= -0.3) tips.push('Fresh notes burn off fast — carry a decant');
  else if (isCold) tips.push('Cold mutes scent — spray on fabric for staying power');

  if (frag.projection === 'strong' || frag.projection === 'beast') {
    tips.push("You'll stop smelling it before others do");
  }
  if ((frag.longevity ?? 6) <= 4) tips.push('Take it along to top up');

  return {
    sprays,
    where,
    skinOrClothes,
    tip: tips[0] || (intensity === 'light' ? 'Keep it subtle' : intensity === 'heavy' ? 'Go generous' : 'Standard application'),
    intensity,
    tips,
  };
}

export { heaviness, noteAccords, SEASON_TARGET, TIME_TARGET, OCCASION_ARCHETYPE, OCCASION_PROFILES, PERF_EXPECT };
