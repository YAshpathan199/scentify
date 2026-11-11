import { SPRAY_GUIDE, OCCASION_INTENSITY, CONCENTRATIONS } from '../data/constants';

function concAdjust(concentration) {
  const concData = CONCENTRATIONS.find((c) => c.id === concentration);
  if (!concData) return 0;
  if (concData.strength >= 4) return -2;
  if (concData.strength >= 3) return -1;
  if (concData.strength <= 1) return +2;
  return 0;
}

export function getSprayGuide(season, occasionId, concentration) {
  const intensity = OCCASION_INTENSITY[occasionId] || 'moderate';
  const seasonGuide = SPRAY_GUIDE[season] || SPRAY_GUIDE.autumn;
  const guide = seasonGuide[intensity];
  const sprayAdjust = concAdjust(concentration);

  return {
    sprays: [
      Math.max(1, guide.sprays[0] + sprayAdjust),
      Math.max(2, guide.sprays[1] + sprayAdjust),
    ],
    where: guide.where,
    skinOrClothes: guide.skinOrClothes,
    tip: guide.tip,
    intensity,
  };
}

// Used by the 4-level intensity selector in the Spray Calculator
export function getSprayGuideByIntensity(season, internalIntensity, concentration, bonus = 0) {
  const seasonGuide = SPRAY_GUIDE[season] || SPRAY_GUIDE.autumn;
  const guide = seasonGuide[internalIntensity];
  const sprayAdjust = concAdjust(concentration) + bonus;

  return {
    sprays: [
      Math.max(1, guide.sprays[0] + sprayAdjust),
      Math.max(2, guide.sprays[1] + sprayAdjust),
    ],
    where: guide.where,
    skinOrClothes: guide.skinOrClothes,
    tip: guide.tip,
    pairing: guide.pairing || [],
    intensity: internalIntensity,
  };
}
