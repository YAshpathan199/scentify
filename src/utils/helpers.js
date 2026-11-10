export function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 4 && month <= 6) return 'summer';
  if (month >= 7 && month <= 9) return 'monsoon';
  if (month >= 10 && month <= 11) return 'autumn';
  if (month >= 2 && month <= 3) return 'spring';
  return 'winter';
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 11) return 'Good morning';
  if (hour >= 12 && hour <= 16) return 'Good afternoon';
  if (hour >= 17 && hour <= 20) return 'Good evening';
  return 'Good night';
}

export function formatPrice(price) {
  if (!price) return '—';
  return `₹${price.toLocaleString('en-IN')}`;
}

export function getProjectionPercent(projection) {
  const map = { soft: 25, moderate: 50, strong: 75, beast: 100 };
  return map[projection] || 0;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
