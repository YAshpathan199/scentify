import { SPRAY_GUIDE, OCCASION_INTENSITY, CONCENTRATIONS } from '../data/constants';

export function getSprayGuide(season, occasionId, concentration) {
  const intensity = OCCASION_INTENSITY[occasionId] || 'moderate';
  const seasonGuide = SPRAY_GUIDE[season] || SPRAY_GUIDE.autumn;
  const guide = seasonGuide[intensity];
  const concData = CONCENTRATIONS.find((c) => c.id === concentration);

  let sprayAdjust = 0;
  if (concData) {
    if (concData.strength >= 4) {
      sprayAdjust = -2;
    } else if (concData.strength >= 3) {
      sprayAdjust = -1;
    } else if (concData.strength <= 1) {
      sprayAdjust = +2;
    }
  }

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
