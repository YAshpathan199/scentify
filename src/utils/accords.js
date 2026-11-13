// Note-to-accord mapping and heaviness calculation, adapted from
// github.com/davidbeck45/almanac's accord engine.
// Each note maps to one or more accord categories with relative weights.
// Heaviness (-1 fresh .. +1 heavy) drives season and weather matching.

const NOTE_TO_ACCORDS = {
  // Citrus
  bergamot: { citrus: 0.8, fresh: 0.2 },
  lemon: { citrus: 1.0 },
  orange: { citrus: 0.9, fruity: 0.1 },
  citrus: { citrus: 1.0 },
  grapefruit: { citrus: 0.9, fresh: 0.1 },
  lime: { citrus: 1.0 },

  // Green / Herbal
  'green notes': { green: 0.8, fresh: 0.2 },
  'green tea': { green: 0.6, herbal: 0.4 },
  mint: { fresh: 0.7, herbal: 0.3 },
  lavender: { lavender: 0.7, aromatic: 0.3 },
  geranium: { floral: 0.6, aromatic: 0.4 },
  honeysuckle: { floral: 0.7, fresh: 0.3 },

  // Floral
  rose: { rose: 0.8, floral: 0.2 },
  jasmine: { 'white floral': 0.8, floral: 0.2 },
  'orange blossom': { 'white floral': 0.6, floral: 0.4 },
  'cherry blossom': { floral: 0.7, fruity: 0.3 },
  'turkish rose': { rose: 0.9, floral: 0.1 },
  'violet leaf': { violet: 0.6, green: 0.4 },
  'violet flower': { violet: 0.8, floral: 0.2 },
  'floral accord': { floral: 0.7, 'white floral': 0.3 },
  'white flowers': { 'white floral': 0.8, floral: 0.2 },
  iris: { iris: 0.8, powdery: 0.2 },

  // Fruity
  apple: { fruity: 0.8, fresh: 0.2 },
  pineapple: { fruity: 0.6, tropical: 0.4 },
  'black currant': { fruity: 0.8, sweet: 0.2 },
  plum: { fruity: 0.7, sweet: 0.3 },
  cherry: { cherry: 0.8, sweet: 0.2 },
  berry: { fruity: 0.7, sweet: 0.3 },
  berries: { fruity: 0.7, sweet: 0.3 },
  'dried fruits': { fruity: 0.5, sweet: 0.5 },

  // Spicy
  cinnamon: { cinnamon: 0.8, 'warm spicy': 0.2 },
  pepper: { 'fresh spicy': 0.6, 'warm spicy': 0.4 },
  'black pepper': { 'fresh spicy': 0.6, 'warm spicy': 0.4 },
  'sichuan pepper': { 'fresh spicy': 0.7, aromatic: 0.3 },
  cardamom: { 'warm spicy': 0.5, aromatic: 0.5 },
  clove: { 'warm spicy': 0.8, balsamic: 0.2 },
  nutmeg: { 'warm spicy': 0.7, woody: 0.3 },
  ginger: { 'fresh spicy': 0.7, aromatic: 0.3 },
  spices: { 'warm spicy': 0.6, 'soft spicy': 0.4 },
  'warm spice': { 'warm spicy': 0.8, cinnamon: 0.2 },
  saffron: { 'warm spicy': 0.5, 'soft spicy': 0.5 },
  juniper: { herbal: 0.5, fresh: 0.3, aromatic: 0.2 },
  spice: { 'warm spicy': 0.5, 'soft spicy': 0.5 },

  // Woody
  cedar: { woody: 0.9, earthy: 0.1 },
  cedarwood: { woody: 0.9, earthy: 0.1 },
  sandalwood: { woody: 0.7, musky: 0.3 },
  patchouli: { patchouli: 0.8, earthy: 0.2 },
  vetiver: { earthy: 0.5, woody: 0.3, green: 0.2 },
  oakmoss: { mossy: 0.7, earthy: 0.3 },
  birch: { woody: 0.6, smoky: 0.4 },
  driftwood: { woody: 0.7, aquatic: 0.3 },
  'warm woods': { woody: 0.7, 'warm spicy': 0.3 },
  'smoky woods': { woody: 0.5, smoky: 0.5 },

  // Oriental / Amber / Resin
  amber: { amber: 0.9, 'warm spicy': 0.1 },
  vanilla: { vanilla: 0.9, sweet: 0.1 },
  'tonka bean': { vanilla: 0.5, sweet: 0.3, nutty: 0.2 },
  benzoin: { balsamic: 0.7, vanilla: 0.3 },
  incense: { balsamic: 0.5, smoky: 0.3, woody: 0.2 },
  labdanum: { balsamic: 0.6, amber: 0.4 },
  'peru balsam': { balsamic: 0.8, vanilla: 0.2 },

  // Gourmand
  coffee: { coffee: 0.9, smoky: 0.1 },
  praline: { nutty: 0.5, sweet: 0.3, vanilla: 0.2 },
  'bitter almond': { almond: 0.7, nutty: 0.3 },

  // Leather / Tobacco
  leather: { leather: 0.9, smoky: 0.1 },
  tobacco: { tobacco: 0.8, smoky: 0.2 },

  // Musk
  musk: { musky: 0.8, powdery: 0.2 },
  'white musk': { musky: 0.6, fresh: 0.4 },
  ambergris: { amber: 0.5, musky: 0.5 },
  ambroxan: { musky: 0.5, amber: 0.3, woody: 0.2 },

  // Aquatic
  'watery notes': { aquatic: 0.8, fresh: 0.2 },
  aqua: { aquatic: 0.8, marine: 0.2 },

  // Oud
  oud: { oud: 0.9, woody: 0.1 },

  // Other
  nagarmotha: { earthy: 0.6, woody: 0.4 },
  liquor: { rum: 0.5, whiskey: 0.5 },
};

// Accord weights from almanac: how warm/heavy (+1) vs fresh/light (-1).
const ACCORD_WEIGHTS = {
  vanilla: 1.0, caramel: 0.9, chocolate: 1.0, cacao: 0.85, coffee: 0.9,
  honey: 1.0, oud: 0.75, tobacco: 1.0, whiskey: 0.9, rum: 0.9,
  leather: 0.9, smoky: 0.65, amber: 0.65, balsamic: 0.9, cinnamon: 1.0,
  'warm spicy': 1.0, animalic: 0.95, sweet: 0.2, almond: 0.55,
  cherry: 0.3, nutty: 0.65, 'soft spicy': 0.6, woody: 0.5,
  earthy: 0.4, patchouli: 0.55, rose: 0.1, powdery: 0.0,
  musky: -0.3, iris: 0.05, 'white floral': 0.0, floral: 0.25,
  violet: -0.25, fruity: -0.35, tropical: -0.6, lavender: 0.05,
  aromatic: 0.15, herbal: -0.35, 'fresh spicy': -0.15, salty: -0.55,
  green: -1.0, fresh: -0.75, citrus: -1.0, aquatic: -1.0,
  marine: -1.0, ozonic: -1.0, mossy: -0.05,
};

const FAMILY_BASE_HEAVINESS = {
  oriental: 0.7,
  gourmand: 0.8,
  woody: 0.3,
  floral: 0.0,
  aromatic: -0.3,
  fresh: -0.7,
  citrus: -0.8,
  aquatic: -0.9,
};

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

function allNotes(fragrance) {
  const n = fragrance.notes;
  if (!n) return [];
  return [...(n.top || []), ...(n.heart || []), ...(n.base || [])];
}

export function noteAccords(fragrance) {
  const notes = allNotes(fragrance);
  const accords = {};
  const layer = { top: 1.0, heart: 0.8, base: 0.6 };

  for (const [layerName, layerWeight] of Object.entries(layer)) {
    for (const note of fragrance.notes?.[layerName] || []) {
      const key = note.toLowerCase();
      const mapping = NOTE_TO_ACCORDS[key];
      if (!mapping) continue;
      for (const [accord, weight] of Object.entries(mapping)) {
        accords[accord] = (accords[accord] || 0) + weight * layerWeight;
      }
    }
  }

  // Normalize so the total sums to 1
  const total = Object.values(accords).reduce((s, v) => s + v, 0);
  if (total > 0) {
    for (const k of Object.keys(accords)) accords[k] /= total;
  }
  return accords;
}

export function heaviness(fragrance) {
  const accords = noteAccords(fragrance);
  let sum = 0, total = 0;
  for (const [accord, strength] of Object.entries(accords)) {
    const w = ACCORD_WEIGHTS[accord];
    if (w === undefined) continue;
    sum += strength * w;
    total += strength;
  }
  const fromNotes = total > 0 ? sum / total : 0;
  const fromFamily = FAMILY_BASE_HEAVINESS[fragrance.family] ?? 0;
  // Blend: notes have priority when available, family is the fallback
  return total > 0 ? 0.7 * fromNotes + 0.3 * fromFamily : fromFamily;
}

export function accordFit(fragrance, profile) {
  const accords = noteAccords(fragrance);
  let sum = 0, total = 0;
  for (const [accord, strength] of Object.entries(accords)) {
    total += strength;
    sum += strength * (profile[accord] ?? 0);
  }
  return total > 0 ? sum / total : 0;
}

export { ACCORD_WEIGHTS, FAMILY_BASE_HEAVINESS, NOTE_TO_ACCORDS, clamp };
