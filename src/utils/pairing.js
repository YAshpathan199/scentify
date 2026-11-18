export function getSharedNotes(a, b) {
  const allA = [...(a.notes?.top || []), ...(a.notes?.heart || []), ...(a.notes?.base || [])].map(n => n.toLowerCase());
  const allB = [...(b.notes?.top || []), ...(b.notes?.heart || []), ...(b.notes?.base || [])].map(n => n.toLowerCase());
  return allA.filter(n => allB.includes(n));
}

export function getPairingScore(a, b, rules) {
  let score = 0;
  const reasons = [];
  const shared = getSharedNotes(a, b);

  if (shared.length > 0) {
    score += shared.length * 10;
    reasons.push(`Shared notes: ${shared.join(', ')}`);
  }

  rules.forEach(rule => {
    const ruleFamilies = [rule.a, rule.b];
    if (ruleFamilies.includes(a.family) && ruleFamilies.includes(b.family)) {
      score += 15;
      reasons.push(`${rule.description} — ${rule.howToLayer}`);
    }
  });

  if (a.family !== b.family) {
    score += 5;
    reasons.push('Cross-family contrast adds depth');
  }

  return { score: Math.min(score, 100), reasons };
}

export function getTopPairings(fragrance, allFragrances, rules, limit = 4) {
  return allFragrances
    .filter(f => f.id !== fragrance.id)
    .map(f => ({ frag: f, ...getPairingScore(fragrance, f, rules) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
