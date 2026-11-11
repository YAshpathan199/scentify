export const OCCASIONS = [
  // Wedding & Functions
  { id: 'mehendi', label: 'Mehendi', icon: '🎨', category: 'wedding' },
  { id: 'sangeet', label: 'Sangeet', icon: '💃', category: 'wedding' },
  { id: 'wedding-ceremony', label: 'Wedding Ceremony', icon: '💍', category: 'wedding' },
  { id: 'reception', label: 'Reception', icon: '🥂', category: 'wedding' },
  { id: 'engagement', label: 'Engagement', icon: '💑', category: 'wedding' },
  // Festivals
  { id: 'diwali', label: 'Diwali', icon: '🪔', category: 'festival' },
  { id: 'holi', label: 'Holi', icon: '🎨', category: 'festival' },
  { id: 'eid', label: 'Eid', icon: '🌙', category: 'festival' },
  { id: 'navratri', label: 'Navratri', icon: '🔱', category: 'festival' },
  { id: 'ganesh-chaturthi', label: 'Ganesh Chaturthi', icon: '🐘', category: 'festival' },
  { id: 'christmas-newyear', label: 'Christmas & New Year', icon: '🎄', category: 'festival' },
  { id: 'pongal-onam', label: 'Pongal / Onam', icon: '🌾', category: 'festival' },
  { id: 'raksha-bandhan', label: 'Raksha Bandhan', icon: '🧵', category: 'festival' },
  // Professional
  { id: 'office', label: 'Office', icon: '💼', category: 'professional' },
  { id: 'interview', label: 'Interview', icon: '🤝', category: 'professional' },
  { id: 'business-meeting', label: 'Business Meeting', icon: '📊', category: 'professional' },
  { id: 'conference', label: 'Conference', icon: '🎤', category: 'professional' },
  { id: 'office-party', label: 'Office Party', icon: '🎉', category: 'professional' },
  // Social
  { id: 'dinner-date', label: 'Dinner Date', icon: '🍷', category: 'social' },
  { id: 'friends-outing', label: 'Friends Outing', icon: '👯', category: 'social' },
  { id: 'movie-mall', label: 'Movie / Mall', icon: '🎬', category: 'social' },
  { id: 'house-party', label: 'House Party', icon: '🏠', category: 'social' },
  { id: 'club-nightlife', label: 'Club / Nightlife', icon: '🌃', category: 'social' },
  { id: 'brunch-cafe', label: 'Brunch / Cafe', icon: '☕', category: 'social' },
  // Religious
  { id: 'temple-visit', label: 'Temple Visit', icon: '🛕', category: 'religious' },
  { id: 'pooja-home', label: 'Pooja at Home', icon: '🪷', category: 'religious' },
  { id: 'prayer-gathering', label: 'Prayer Gathering', icon: '🙏', category: 'religious' },
  // Special
  { id: 'first-date', label: 'First Date', icon: '💕', category: 'special' },
  { id: 'anniversary', label: 'Anniversary', icon: '❤️', category: 'special' },
  { id: 'birthday', label: 'Birthday', icon: '🎂', category: 'special' },
  { id: 'graduation', label: 'Graduation', icon: '🎓', category: 'special' },
  { id: 'airport-travel', label: 'Airport / Travel', icon: '✈️', category: 'special' },
];

export const OCCASION_CATEGORIES = [
  { id: 'wedding', label: 'Wedding & Functions', icon: '💒' },
  { id: 'festival', label: 'Festivals', icon: '🪔' },
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'social', label: 'Social & Casual', icon: '👥' },
  { id: 'religious', label: 'Religious & Spiritual', icon: '🛕' },
  { id: 'special', label: 'Special Moments', icon: '💝' },
];

export const SEASONS = [
  {
    id: 'summer',
    label: 'Summer',
    icon: '☀️',
    months: [4, 5, 6],
    description: 'Hot & dry',
    tips: 'Go light on application — heat amplifies projection. Stick to fresh, aquatic, and citrus families.',
  },
  {
    id: 'monsoon',
    label: 'Monsoon',
    icon: '🌧️',
    months: [7, 8, 9],
    description: 'Humid & rainy',
    tips: 'Spray on clothes rather than skin — humidity affects longevity. Fresh and aromatic work best.',
  },
  {
    id: 'autumn',
    label: 'Autumn',
    icon: '🍂',
    months: [10, 11],
    description: 'Mild & pleasant',
    tips: 'Great season for any family. Woody and aromatic fragrances really shine.',
  },
  {
    id: 'winter',
    label: 'Winter',
    icon: '❄️',
    months: [12, 1, 2],
    description: 'Cool & dry',
    tips: 'Best season for fragrance! Go generous with oriental, woody, and gourmand families.',
  },
  {
    id: 'spring',
    label: 'Spring',
    icon: '🌸',
    months: [2, 3],
    description: 'Warm & pleasant',
    tips: 'Floral and aromatic fragrances are ideal. Standard application works great.',
  },
];

export const FRAGRANCE_FAMILIES = [
  { id: 'woody', label: 'Woody', color: '#8B4513', description: 'Warm, earthy, and grounding', icon: '🌳' },
  { id: 'floral', label: 'Floral', color: '#DB7093', description: 'Romantic, elegant, and soft', icon: '🌹' },
  { id: 'oriental', label: 'Oriental', color: '#B8860B', description: 'Rich, warm, and exotic', icon: '✨' },
  { id: 'fresh', label: 'Fresh', color: '#20B2AA', description: 'Clean, crisp, and invigorating', icon: '🌿' },
  { id: 'citrus', label: 'Citrus', color: '#FFA500', description: 'Bright, zesty, and uplifting', icon: '🍊' },
  { id: 'gourmand', label: 'Gourmand', color: '#D2691E', description: 'Sweet, edible, and comforting', icon: '🍫' },
  { id: 'aromatic', label: 'Aromatic', color: '#6B8E23', description: 'Herbal, fresh, and sophisticated', icon: '🌿' },
  { id: 'aquatic', label: 'Aquatic', color: '#4682B4', description: 'Oceanic, breezy, and refreshing', icon: '🌊' },
];

export const MOODS = [
  { id: 'confident', label: 'Confident', icon: '💪', description: 'Bold, powerful' },
  { id: 'romantic', label: 'Romantic', icon: '💕', description: 'Warm, sensual' },
  { id: 'chill', label: 'Chill', icon: '😌', description: 'Relaxed, easygoing' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', description: 'Fresh, vibrant' },
  { id: 'elegant', label: 'Elegant', icon: '👑', description: 'Sophisticated, refined' },
];

export const DRESS_CODES = [
  { id: 'ethnic', label: 'Ethnic', icon: '👘', description: 'Kurta, sherwani, saree' },
  { id: 'formal', label: 'Formal', icon: '👔', description: 'Suit, blazer' },
  { id: 'smart-casual', label: 'Smart Casual', icon: '👕', description: 'Chinos, polo' },
  { id: 'casual', label: 'Casual', icon: '👟', description: 'Jeans, t-shirt' },
];

export const TIME_OF_DAY = [
  { id: 'morning', label: 'Morning', icon: '🌅', hours: [6, 12], description: '6 AM - 12 PM' },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️', hours: [12, 17], description: '12 PM - 5 PM' },
  { id: 'evening', label: 'Evening', icon: '🌆', hours: [17, 21], description: '5 PM - 9 PM' },
  { id: 'night', label: 'Night', icon: '🌙', hours: [21, 6], description: '9 PM - 6 AM' },
];

export const CONCENTRATIONS = [
  { id: 'EDC', label: 'Cologne', shortLabel: 'EDC', strength: 1, longevityRange: [1, 3], baseSprays: 6, description: 'Lightest concentration, great for hot weather' },
  { id: 'EDT', label: 'Eau de Toilette', shortLabel: 'EDT', strength: 2, longevityRange: [3, 5], baseSprays: 4, description: 'Moderate concentration, good for daily wear' },
  { id: 'EDP', label: 'Eau de Parfum', shortLabel: 'EDP', strength: 3, longevityRange: [5, 8], baseSprays: 3, description: 'Strong concentration, ideal for most occasions' },
  { id: 'Parfum', label: 'Parfum', shortLabel: 'Parfum', strength: 4, longevityRange: [8, 12], baseSprays: 2, description: 'Highest concentration, longest lasting' },
];

export const SPRAY_GUIDE = {
  summer: {
    light: {
      sprays: [2, 3],
      where: ['wrists', 'neck'],
      skinOrClothes: 'skin',
      tip: 'Heat amplifies — less is more',
      pairing: ['fresh', 'citrus', 'aquatic'],
    },
    moderate: {
      sprays: [3, 4],
      where: ['wrists', 'neck', 'chest'],
      skinOrClothes: 'skin',
      tip: 'Carry a decant to reapply',
      pairing: ['fresh', 'aromatic', 'citrus'],
    },
    heavy: {
      sprays: [4, 5],
      where: ['wrists', 'neck', 'chest', 'inner-elbows'],
      skinOrClothes: 'both',
      tip: 'Spray on clothes too',
      pairing: ['aromatic', 'fresh', 'floral'],
    },
  },
  monsoon: {
    light: {
      sprays: [2, 3],
      where: ['wrists', 'neck'],
      skinOrClothes: 'clothes',
      tip: 'Humidity carries scent further',
      pairing: ['fresh', 'aromatic', 'aquatic'],
    },
    moderate: {
      sprays: [3, 4],
      where: ['wrists', 'neck', 'collar'],
      skinOrClothes: 'clothes',
      tip: 'Fabric holds better in humidity',
      pairing: ['fresh', 'floral', 'aromatic'],
    },
    heavy: {
      sprays: [4, 6],
      where: ['neck', 'chest', 'collar', 'sleeves'],
      skinOrClothes: 'clothes',
      tip: 'Fresh aquatics cut through humidity',
      pairing: ['fresh', 'woody', 'aromatic'],
    },
  },
  autumn: {
    light: {
      sprays: [2, 4],
      where: ['wrists', 'neck'],
      skinOrClothes: 'skin',
      tip: 'Great season for any family',
      pairing: ['aromatic', 'fresh', 'floral'],
    },
    moderate: {
      sprays: [3, 5],
      where: ['wrists', 'neck', 'chest'],
      skinOrClothes: 'both',
      tip: 'Both warm and fresh fragrances work',
      pairing: ['woody', 'floral', 'aromatic'],
    },
    heavy: {
      sprays: [5, 7],
      where: ['wrists', 'neck', 'chest', 'behind-ears', 'collar'],
      skinOrClothes: 'both',
      tip: 'Woody and oriental fragrances shine',
      pairing: ['oriental', 'woody', 'floral'],
    },
  },
  winter: {
    light: {
      sprays: [3, 4],
      where: ['wrists', 'neck', 'chest'],
      skinOrClothes: 'skin',
      tip: 'Apply on warm pulse points',
      pairing: ['woody', 'floral', 'oriental'],
    },
    moderate: {
      sprays: [4, 6],
      where: ['wrists', 'neck', 'chest', 'behind-ears'],
      skinOrClothes: 'both',
      tip: 'Best season for fragrance',
      pairing: ['oriental', 'woody', 'gourmand'],
    },
    heavy: {
      sprays: [5, 7],
      where: ['wrists', 'neck', 'chest', 'behind-ears', 'collar', 'scarf'],
      skinOrClothes: 'both',
      tip: 'Layer on skin, clothes, and scarf',
      pairing: ['oriental', 'gourmand', 'woody'],
    },
  },
  spring: {
    light: {
      sprays: [2, 3],
      where: ['wrists', 'neck'],
      skinOrClothes: 'skin',
      tip: 'Standard application works great',
      pairing: ['floral', 'citrus', 'fresh'],
    },
    moderate: {
      sprays: [3, 5],
      where: ['wrists', 'neck', 'chest'],
      skinOrClothes: 'both',
      tip: 'Floral and aromatic fragrances are ideal',
      pairing: ['floral', 'aromatic', 'fresh'],
    },
    heavy: {
      sprays: [4, 6],
      where: ['wrists', 'neck', 'chest', 'inner-elbows', 'collar'],
      skinOrClothes: 'both',
      tip: 'Go generous for events',
      pairing: ['floral', 'woody', 'oriental'],
    },
  },
};

export const OCCASION_INTENSITY = {
  // Light
  holi: 'light',
  office: 'light',
  interview: 'light',
  'business-meeting': 'light',
  'movie-mall': 'light',
  'brunch-cafe': 'light',
  'temple-visit': 'light',
  'pooja-home': 'light',
  'prayer-gathering': 'light',
  'airport-travel': 'light',
  // Moderate
  mehendi: 'moderate',
  engagement: 'moderate',
  'ganesh-chaturthi': 'moderate',
  'pongal-onam': 'moderate',
  'raksha-bandhan': 'moderate',
  conference: 'moderate',
  'office-party': 'moderate',
  'dinner-date': 'moderate',
  'friends-outing': 'moderate',
  'house-party': 'moderate',
  'first-date': 'moderate',
  anniversary: 'moderate',
  birthday: 'moderate',
  graduation: 'moderate',
  // Heavy
  sangeet: 'heavy',
  'wedding-ceremony': 'heavy',
  reception: 'heavy',
  diwali: 'heavy',
  eid: 'heavy',
  navratri: 'heavy',
  'christmas-newyear': 'heavy',
  'club-nightlife': 'heavy',
};

export const HOME_ROOMS = [
  { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { id: 'living-room', label: 'Living Room / Hall', icon: '🛋️' },
  { id: 'kitchen', label: 'Kitchen & Dining', icon: '🍽️' },
  { id: 'bathroom', label: 'Bathroom', icon: '🚿' },
  { id: 'pooja-room', label: 'Pooja Room', icon: '🪷' },
  { id: 'entrance', label: 'Entrance / Foyer', icon: '🚪' },
];

export const HOME_SPRAY_GUIDE = {
  bedroom: {
    morning: {
      sprays: [2, 3],
      where: ['Pillows', 'Curtains'],
      families: ['fresh', 'citrus', 'aromatic'],
      tip: 'Light fresh scents to start the day — spray on curtains so the breeze carries fragrance in',
    },
    afternoon: {
      sprays: [1, 2],
      where: ['Curtains', 'Bedspread'],
      families: ['fresh', 'aquatic'],
      tip: 'Keep it light during hot afternoons — aquatic notes feel cooling',
    },
    evening: {
      sprays: [2, 3],
      where: ['Pillows', 'Bedsheets', 'Curtains'],
      families: ['woody', 'floral', 'oriental'],
      tip: 'Warm, calming scents help you wind down — spray pillows 30 min before bed',
    },
    night: {
      sprays: [1, 2],
      where: ['Pillows', 'Bedsheets'],
      families: ['woody', 'floral'],
      tip: 'Very subtle application — lavender or sandalwood notes promote restful sleep',
    },
  },
  'living-room': {
    morning: {
      sprays: [3, 4],
      where: ['Sofa cushions', 'Curtains', 'Rug edges'],
      families: ['citrus', 'fresh', 'aromatic'],
      tip: 'Energizing citrus or herbal scents create a welcoming morning atmosphere',
    },
    afternoon: {
      sprays: [2, 3],
      where: ['Curtains', 'Cushions'],
      families: ['fresh', 'aquatic'],
      tip: 'Clean, crisp scents keep the space feeling fresh during the day',
    },
    evening: {
      sprays: [3, 5],
      where: ['Sofa cushions', 'Curtains', 'Throw blankets'],
      families: ['oriental', 'woody', 'gourmand'],
      tip: 'Warm, rich scents make the hall feel cozy for family time or guests',
    },
    night: {
      sprays: [2, 3],
      where: ['Curtains', 'Cushions'],
      families: ['woody', 'oriental'],
      tip: 'Deep, grounding woody notes for a calm late-night ambience',
    },
  },
  kitchen: {
    morning: {
      sprays: [2, 3],
      where: ['Kitchen towels', 'Near window'],
      families: ['citrus', 'aromatic'],
      tip: 'Citrus cuts through cooking smells — spray near the window before cooking',
    },
    afternoon: {
      sprays: [2, 3],
      where: ['Dining table cloth', 'Kitchen towels'],
      families: ['citrus', 'fresh'],
      tip: 'Fresh scents neutralize lunch cooking odours — spray after cooking, not before',
    },
    evening: {
      sprays: [2, 4],
      where: ['Dining table cloth', 'Kitchen towels', 'Near exhaust area'],
      families: ['aromatic', 'citrus', 'fresh'],
      tip: 'Spray after dinner prep to refresh the space — herbal notes complement Indian spice aromas',
    },
    night: {
      sprays: [1, 2],
      where: ['Kitchen towels'],
      families: ['fresh', 'citrus'],
      tip: 'Light spray to keep kitchen smelling clean overnight',
    },
  },
  bathroom: {
    morning: {
      sprays: [2, 3],
      where: ['Towels', 'Near ventilation'],
      families: ['aquatic', 'fresh', 'citrus'],
      tip: 'Aquatic and fresh scents complement the clean morning shower vibe',
    },
    afternoon: {
      sprays: [1, 2],
      where: ['Towels'],
      families: ['fresh', 'aquatic'],
      tip: 'Quick refresh spray — keep it subtle in a small enclosed space',
    },
    evening: {
      sprays: [2, 3],
      where: ['Towels', 'Bath mat area'],
      families: ['floral', 'fresh', 'woody'],
      tip: 'Floral or woody scents turn your evening bath into a spa experience',
    },
    night: {
      sprays: [1, 2],
      where: ['Towels'],
      families: ['floral', 'woody'],
      tip: 'Calming scents for a relaxing nighttime routine',
    },
  },
  'pooja-room': {
    morning: {
      sprays: [2, 3],
      where: ['Curtains', 'Rug or aasan'],
      families: ['woody', 'oriental', 'floral'],
      tip: 'Sandalwood, oud, or floral notes complement agarbatti and create a sacred atmosphere',
    },
    afternoon: {
      sprays: [1, 2],
      where: ['Curtains'],
      families: ['woody', 'floral'],
      tip: 'Light woody notes maintain a peaceful ambience without overpowering dhoop',
    },
    evening: {
      sprays: [2, 3],
      where: ['Curtains', 'Rug or aasan'],
      families: ['oriental', 'woody'],
      tip: 'Rich oriental scents for evening aarti — pairs beautifully with camphor and ghee diya',
    },
    night: {
      sprays: [1, 2],
      where: ['Curtains'],
      families: ['woody'],
      tip: 'Subtle sandalwood or cedarwood for quiet nighttime meditation',
    },
  },
  entrance: {
    morning: {
      sprays: [2, 3],
      where: ['Doormat area', 'Shoe rack curtain'],
      families: ['citrus', 'fresh', 'aromatic'],
      tip: 'First impression scent — bright citrus welcomes anyone who walks in',
    },
    afternoon: {
      sprays: [2, 3],
      where: ['Doormat area', 'Nearby curtain'],
      families: ['fresh', 'aquatic'],
      tip: 'Clean scents counteract outdoor heat coming through the door',
    },
    evening: {
      sprays: [3, 4],
      where: ['Doormat area', 'Nearby curtain', 'Console table cloth'],
      families: ['woody', 'oriental', 'floral'],
      tip: 'Warm, inviting scent for guests arriving in the evening',
    },
    night: {
      sprays: [1, 2],
      where: ['Doormat area'],
      families: ['woody', 'fresh'],
      tip: 'Light application — just enough to keep the entrance smelling pleasant',
    },
  },
};

export const PAIRING_RULES = [
  {
    a: 'woody',
    b: 'fresh',
    description: 'Balanced outdoor scent',
    bestFor: 'Casual outings, brunches',
    howToLayer: 'Fresh on skin (wrists), Woody on collar/chest',
  },
  {
    a: 'oriental',
    b: 'gourmand',
    description: 'Rich evening blend',
    bestFor: 'Date nights, parties',
    howToLayer: 'Gourmand on skin (pulse points), Oriental on clothes',
  },
  {
    a: 'aromatic',
    b: 'citrus',
    description: 'Energizing daytime combo',
    bestFor: 'Office, morning wear',
    howToLayer: 'Citrus on skin first, Aromatic on top after 1 min',
  },
  {
    a: 'aquatic',
    b: 'woody',
    description: 'Sophisticated summer scent',
    bestFor: 'Summer evenings, travel',
    howToLayer: 'Aquatic on skin, Woody on collar/sleeves',
  },
  {
    a: 'floral',
    b: 'woody',
    description: 'Classic refined pairing',
    bestFor: 'Weddings, formal events',
    howToLayer: 'Woody on skin base, Floral sprayed over after drying',
  },
  {
    a: 'oriental',
    b: 'woody',
    description: 'Powerful winter blend',
    bestFor: 'Winter events, festivals',
    howToLayer: 'Woody on skin, Oriental on clothes and scarf',
  },
  {
    a: 'fresh',
    b: 'aromatic',
    description: 'Clean versatile layer',
    bestFor: 'Office, interviews',
    howToLayer: 'Fresh on skin, Aromatic on collar',
  },
];
