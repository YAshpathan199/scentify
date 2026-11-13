import { dynamicSprayGuide } from './engine.js';
import { SPRAY_GUIDE, OCCASION_INTENSITY, CONCENTRATIONS } from '../data/constants';

export function getSprayGuide(season, occasionId, concentration) {
  const frag = { longevity: 6, projection: 'moderate', family: 'aromatic', notes: {} };
  return dynamicSprayGuide(frag, season, occasionId, concentration);
}

export function getSprayGuideForFragrance(fragrance, season, occasionId) {
  return dynamicSprayGuide(fragrance, season, occasionId, fragrance.concentration);
}

export function getSprayGuideByIntensity(season, internalIntensity, concentration, bonus = 0) {
  const seasonGuide = SPRAY_GUIDE[season] || SPRAY_GUIDE.autumn;
  const guide = seasonGuide[internalIntensity];

  const concData = CONCENTRATIONS.find(c => c.id === concentration);
  let sprayAdjust = bonus;
  if (concData) {
    if (concData.strength >= 4) sprayAdjust -= 2;
    else if (concData.strength >= 3) sprayAdjust -= 1;
    else if (concData.strength <= 1) sprayAdjust += 2;
  }

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
