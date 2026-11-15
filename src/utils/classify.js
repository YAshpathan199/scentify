import { noteAccords, ACCORD_WEIGHTS } from './accords.js';

const FAMILY_ACCORDS = {
  floral:   { rose: 1.0, 'white floral': 1.0, floral: 0.9, iris: 0.7, violet: 0.6 },
  oriental: { amber: 1.0, vanilla: 0.9, 'warm spicy': 0.8, balsamic: 0.8, oud: 0.7, cinnamon: 0.6, 'soft spicy': 0.5 },
  woody:    { woody: 1.0, earthy: 0.7, patchouli: 0.6, mossy: 0.4 },
  fresh:    { fresh: 1.0, ozonic: 0.8, green: 0.5, herbal: 0.4 },
  citrus:   { citrus: 1.0, fresh: 0.3 },
  aquatic:  { aquatic: 1.0, marine: 0.9, ozonic: 0.7, fresh: 0.3 },
  aromatic: { aromatic: 1.0, lavender: 0.9, herbal: 0.6, 'fresh spicy': 0.4 },
  fougere:  { lavender: 1.0, aromatic: 0.8, mossy: 0.7, woody: 0.4 },
  chypre:   { mossy: 1.0, citrus: 0.6, earthy: 0.5, woody: 0.4, patchouli: 0.4 },
  spicy:    { 'warm spicy': 1.0, 'fresh spicy': 0.8, cinnamon: 0.8, tobacco: 0.5 },
  gourmand: { vanilla: 1.0, sweet: 0.9, coffee: 0.8, cherry: 0.7, nutty: 0.6, caramel: 0.6 },
  green:    { green: 1.0, herbal: 0.6, fresh: 0.4 },
  leather:  { leather: 1.0, smoky: 0.7, woody: 0.3, tobacco: 0.3 },
  powdery:  { powdery: 1.0, iris: 0.8, violet: 0.7, musky: 0.5 },
  musk:     { musky: 1.0, powdery: 0.4, fresh: 0.3 },
};

function scoreFamilyMatch(accords, familyProfile) {
  let score = 0;
  let weight = 0;
  for (const [accord, affinity] of Object.entries(familyProfile)) {
    const strength = accords[accord] || 0;
    score += strength * affinity;
    weight += affinity;
  }
  return weight > 0 ? score / weight : 0;
}

export function classifyFamily(accords) {
  const results = Object.entries(FAMILY_ACCORDS).map(([familyId, profile]) => ({
    familyId,
    score: scoreFamilyMatch(accords, profile),
  }));
  results.sort((a, b) => b.score - a.score);

  const topScore = results[0]?.score || 0;
  return results.map(r => ({
    ...r,
    confidence: topScore > 0 ? Math.round((r.score / topScore) * 100) : 0,
  }));
}

export function classifyFromNotes(notesObj) {
  const fakeFragrance = { notes: notesObj };
  const accords = noteAccords(fakeFragrance);
  return classifyFamily(accords);
}

export function classifyFromFragranticaAccords(fragranticaAccords) {
  const total = Object.values(fragranticaAccords).reduce((s, v) => s + v, 0);
  if (total <= 0) return [];
  const normalized = {};
  for (const [k, v] of Object.entries(fragranticaAccords)) {
    normalized[k] = v / total;
  }
  return classifyFamily(normalized);
}

export function parseInputJSON(text) {
  const parsed = JSON.parse(text);

  if (parsed.notes && (parsed.notes.top || parsed.notes.heart || parsed.notes.base)) {
    const accords = noteAccords({ notes: parsed.notes, fragranticaAccords: parsed.fragranticaAccords, fragranticaVotes: parsed.fragranticaVotes });
    return { type: 'full', accords, name: parsed.name, brand: parsed.brand, results: classifyFamily(accords) };
  }

  if (parsed.fragranticaAccords) {
    return { type: 'fragrantica', accords: null, results: classifyFromFragranticaAccords(parsed.fragranticaAccords) };
  }

  const keys = Object.keys(parsed);
  const looksLikeAccords = keys.length >= 2 && keys.every(k => typeof parsed[k] === 'number');
  if (looksLikeAccords) {
    return { type: 'accords', accords: null, results: classifyFromFragranticaAccords(parsed) };
  }

  throw new Error('Unrecognized format. Paste Fragrantica accords like {"fruity": 1.0, "citrus": 0.95} or a fragrance object with notes.');
}

export { FAMILY_ACCORDS };
