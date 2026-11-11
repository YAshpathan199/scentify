import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Shirt,
  Hand,
  Lightbulb,
  ChevronDown,
  AlertTriangle,
  Archive,
  Sun,
  Target,
  Home,
} from 'lucide-react';
import { Badge } from '../components/ui';
import { SAMPLE_FRAGRANCES } from '../data/fragrances';
import { SEASONS, CONCENTRATIONS, HOME_ROOMS, HOME_SPRAY_GUIDE, FRAGRANCE_FAMILIES } from '../data/constants';
import { getSprayGuideByIntensity } from '../utils/sprayGuide';
import { getCurrentSeason } from '../utils/helpers';
import styles from './Guide.module.css';

const BODY_POINTS = {
  'behind-ears': [
    { cx: 68, cy: 40 },
    { cx: 132, cy: 40 },
  ],
  neck: [{ cx: 100, cy: 73 }],
  collar: [{ cx: 100, cy: 88 }],
  chest: [{ cx: 100, cy: 130 }],
  'inner-elbows': [
    { cx: 42, cy: 152 },
    { cx: 158, cy: 152 },
  ],
  wrists: [
    { cx: 22, cy: 230 },
    { cx: 178, cy: 230 },
  ],
  scarf: [{ cx: 100, cy: 108 }],
  sleeves: [{ cx: 42, cy: 130 }],
};

const POINT_LABELS = {
  'behind-ears': 'Behind Ears',
  neck: 'Neck',
  collar: 'Collar',
  chest: 'Chest',
  'inner-elbows': 'Inner Elbows',
  wrists: 'Wrists',
  scarf: 'Scarf',
  sleeves: 'Sleeves',
};

function BodyMap({ activePoints = [] }) {
  const activeSet = new Set(activePoints);

  return (
    <svg
      viewBox="0 0 200 320"
      className={styles.bodyMap}
      aria-label="Body map showing spray application points"
    >
      <ellipse cx="100" cy="28" rx="20" ry="24" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <line x1="100" y1="52" x2="100" y2="66" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M70 66 Q70 60 60 80 L42 140 L42 200 L70 210 L100 215 L130 210 L158 200 L158 140 L140 80 Q130 60 130 66 Z"
        fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M60 80 Q40 100 30 150 L22 230" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M140 80 Q160 100 170 150 L178 230" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M70 210 L60 300" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M130 210 L140 300" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />

      {Object.entries(BODY_POINTS).map(([key, points]) =>
        points.map((pt, i) => {
          const isActive = activeSet.has(key);
          return (
            <g key={`${key}-${i}`}>
              {isActive && (
                <circle cx={pt.cx} cy={pt.cy} r="10" fill="var(--accent)" opacity="0.2" />
              )}
              <circle
                cx={pt.cx}
                cy={pt.cy}
                r="5"
                fill={isActive ? 'var(--accent)' : 'var(--text-muted)'}
                opacity={isActive ? 1 : 0.3}
              />
            </g>
          );
        })
      )}
    </svg>
  );
}

const ACCORDION_ITEMS = [
  {
    id: 'mistakes',
    title: 'Common Mistakes',
    icon: AlertTriangle,
    items: [
      "Don't rub wrists together — breaks top notes",
      "Don't spray and walk into it — wastes product",
      "Don't store in bathroom — heat/humidity degrade",
      "Don't mix two strong perfumes — competing sillage",
      "Don't spray on jewellery — tarnishes metals",
    ],
  },
  {
    id: 'storage',
    title: 'Storage Tips',
    icon: Archive,
    items: [
      'Cool, dark, dry place (wardrobe shelf ideal)',
      'AC room storage is best for Indian climate',
      'Keep original box for UV protection',
      'Never leave on car dashboard',
      'Avoid bathroom storage',
    ],
  },
  {
    id: 'seasonal',
    title: 'Seasonal Guide',
    icon: Sun,
    items: [
      'Summer: light, fresh scents, fewer sprays',
      'Monsoon: spray on clothes, fabric holds better',
      'Winter: go heavier, warm orientals and woods shine',
      'Spring/Autumn: versatile, moderate application',
    ],
  },
];

const INTENSITY_TABLE = [
  { label: 'Religious', range: '1–2', level: 'Subtle' },
  { label: 'Office', range: '2–3', level: 'Moderate' },
  { label: 'Casual', range: '3–4', level: 'Moderate' },
  { label: 'Date', range: '3–5', level: 'Noticeable' },
  { label: 'Wedding / Party', range: '5–7', level: 'Strong' },
];

const INTENSITY_LEVELS = [
  {
    id: 'subtle',
    label: 'Subtle',
    icon: '🌱',
    desc: 'Office · Religious · Daily',
    internal: 'light',
    bonus: 0,
    color: '#5A7E60',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    icon: '🌿',
    desc: 'Casual · Brunch · Travel',
    internal: 'moderate',
    bonus: -1,
    color: '#6A859A',
  },
  {
    id: 'noticeable',
    label: 'Noticeable',
    icon: '✨',
    desc: 'Dates · Social · Evening',
    internal: 'moderate',
    bonus: 0,
    color: '#B8956A',
  },
  {
    id: 'strong',
    label: 'Strong',
    icon: '🔥',
    desc: 'Parties · Weddings · Night',
    internal: 'heavy',
    bonus: 0,
    color: '#B34A45',
  },
];

export default function Guide() {
  const [selectedFragrance, setSelectedFragrance] = useState('');
  const [selectedIntensity, setSelectedIntensity] = useState('');
  const [openAccordion, setOpenAccordion] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const currentSeasonId = getCurrentSeason();
  const currentSeason = SEASONS.find((s) => s.id === currentSeasonId);

  const fragrance = SAMPLE_FRAGRANCES.find((f) => f.id === selectedFragrance);

  const sprayGuide = useMemo(() => {
    if (!fragrance || !selectedIntensity) return null;
    const level = INTENSITY_LEVELS.find(l => l.id === selectedIntensity);
    if (!level) return null;
    return getSprayGuideByIntensity(currentSeasonId, level.internal, fragrance.concentration, level.bonus);
  }, [fragrance, selectedIntensity, currentSeasonId]);

  const homeSpray = useMemo(() => {
    if (!selectedRoom || !selectedTime) return null;
    return HOME_SPRAY_GUIDE[selectedRoom]?.[selectedTime] || null;
  }, [selectedRoom, selectedTime]);

  const toggleAccordion = (id) => {
    setOpenAccordion((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>How to Wear Your Fragrance</h1>
          <p className={styles.subtitle}>Master the art of fragrance application</p>
        </header>

        {/* Season Banner */}
        <div className={styles.seasonBanner}>
          {currentSeason?.icon} Current Season: {currentSeason?.label} — {currentSeason?.description}
        </div>

        {/* Interactive Spray Calculator */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Spray Calculator</h2>

          <label className={styles.selectLabel}>
            Fragrance
            <select
              className={styles.select}
              value={selectedFragrance}
              onChange={(e) => {
                setSelectedFragrance(e.target.value);
                setSelectedIntensity('');
              }}
            >
              <option value="">Select a fragrance...</option>
              {SAMPLE_FRAGRANCES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.brand}
                </option>
              ))}
            </select>
          </label>

          <p className={styles.intensityHeading}>How intense?</p>
          <div className={styles.intensityGrid}>
            {INTENSITY_LEVELS.map((level) => {
              const isActive = selectedIntensity === level.id;
              return (
                <button
                  key={level.id}
                  className={`${styles.intensityBtn} ${isActive ? styles.intensityBtnActive : ''}`}
                  style={{ '--level-color': level.color }}
                  onClick={() => setSelectedIntensity(level.id)}
                >
                  <span className={styles.intensityBtnIconWrap}>
                    <span className={styles.intensityBtnIcon}>{level.icon}</span>
                  </span>
                  <span className={styles.intensityBtnLabel}>{level.label}</span>
                  <span className={styles.intensityBtnDesc}>{level.desc}</span>
                </button>
              );
            })}
          </div>

          {sprayGuide && (
            <motion.div
              className={styles.sprayResult}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.sprayResultGrid}>
                <div className={styles.sprayCount}>
                  <Droplets size={20} className={styles.sprayIcon} />
                  <span className={styles.sprayNumber}>
                    {sprayGuide.sprays[0]}–{sprayGuide.sprays[1]}
                  </span>
                  <span className={styles.sprayLabel}>sprays</span>
                </div>

                <div className={styles.sprayDetails}>
                  <div className={styles.sprayDetailItem}>
                    <Hand size={16} />
                    <span>Apply on: </span>
                    <div className={styles.tagGroup}>
                      {sprayGuide.where.map((w) => (
                        <span key={w} className={styles.tag}>
                          {POINT_LABELS[w] || w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.sprayDetailItem}>
                    <Shirt size={16} />
                    <span>
                      {sprayGuide.skinOrClothes === 'skin'
                        ? 'Apply on skin'
                        : sprayGuide.skinOrClothes === 'clothes'
                        ? 'Apply on clothes'
                        : 'Apply on both skin & clothes'}
                    </span>
                  </div>

                  <div className={styles.tipCallout}>
                    <Lightbulb size={16} />
                    <span>{sprayGuide.tip}</span>
                  </div>

                  {sprayGuide.pairing?.length > 0 && (
                    <div className={styles.pairingBlock}>
                      <p className={styles.pairingHeading}>Pairs well with</p>
                      <div className={styles.pairingChips}>
                        {sprayGuide.pairing.map((fId) => {
                          const fam = FRAGRANCE_FAMILIES.find(f => f.id === fId);
                          return fam ? (
                            <span
                              key={fId}
                              className={styles.pairingChip}
                              style={{ '--fam-color': fam.color }}
                            >
                              {fam.icon} {fam.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.bodyMapWrapper}>
                <BodyMap activePoints={sprayGuide.where} />
              </div>
            </motion.div>
          )}
        </section>

        {/* Home Spray Guide */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Home size={24} className={styles.sectionIcon} /> Home Spray Guide
          </h2>
          <p className={styles.homeSub}>
            Make every room smell amazing — pick a room and time of day for personalized spray recommendations.
          </p>

          <div className={styles.homeSelectors}>
            <div className={styles.homeRoomGrid}>
              {HOME_ROOMS.map((room) => (
                <button
                  key={room.id}
                  className={`${styles.homeRoomBtn} ${selectedRoom === room.id ? styles.homeRoomBtnActive : ''}`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <span className={styles.homeRoomIcon}>{room.icon}</span>
                  <span className={styles.homeRoomLabel}>{room.label}</span>
                </button>
              ))}
            </div>

            {selectedRoom && (
              <motion.div
                className={styles.homeTimeRow}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {[
                  { id: 'morning', label: 'Morning', icon: '🌅', desc: '6 AM – 12 PM' },
                  { id: 'afternoon', label: 'Afternoon', icon: '☀️', desc: '12 PM – 5 PM' },
                  { id: 'evening', label: 'Evening', icon: '🌆', desc: '5 PM – 9 PM' },
                  { id: 'night', label: 'Night', icon: '🌙', desc: '9 PM – 6 AM' },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={`${styles.homeTimeBtn} ${selectedTime === t.id ? styles.homeTimeBtnActive : ''}`}
                    onClick={() => setSelectedTime(t.id)}
                  >
                    <span className={styles.homeTimeIcon}>{t.icon}</span>
                    <span className={styles.homeTimeLabel}>{t.label}</span>
                    <span className={styles.homeTimeDesc}>{t.desc}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {homeSpray && (
            <motion.div
              className={styles.homeResult}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={`${selectedRoom}-${selectedTime}`}
            >
              <div className={styles.homeResultHeader}>
                <div className={styles.homeSprayCount}>
                  <Droplets size={20} className={styles.sprayIcon} />
                  <span className={styles.sprayNumber}>
                    {homeSpray.sprays[0]}–{homeSpray.sprays[1]}
                  </span>
                  <span className={styles.sprayLabel}>sprays</span>
                </div>
                <div className={styles.homeResultMeta}>
                  <span className={styles.homeRoomName}>
                    {HOME_ROOMS.find(r => r.id === selectedRoom)?.icon}{' '}
                    {HOME_ROOMS.find(r => r.id === selectedRoom)?.label}
                  </span>
                  <span className={styles.homeTimeName}>
                    {selectedTime.charAt(0).toUpperCase() + selectedTime.slice(1)}
                  </span>
                </div>
              </div>

              <div className={styles.homeDetails}>
                <div className={styles.homeDetailBlock}>
                  <h4 className={styles.homeDetailLabel}>Where to spray</h4>
                  <div className={styles.tagGroup}>
                    {homeSpray.where.map((w) => (
                      <span key={w} className={styles.tag}>{w}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.homeDetailBlock}>
                  <h4 className={styles.homeDetailLabel}>Best fragrance families</h4>
                  <div className={styles.homeFamilyChips}>
                    {homeSpray.families.map((fId) => {
                      const fam = FRAGRANCE_FAMILIES.find(f => f.id === fId);
                      return fam ? (
                        <span
                          key={fId}
                          className={styles.homeFamilyChip}
                          style={{ background: `${fam.color}15`, color: fam.color, borderColor: `${fam.color}40` }}
                        >
                          {fam.icon} {fam.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className={styles.tipCallout}>
                  <Lightbulb size={16} />
                  <span>{homeSpray.tip}</span>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* Tips Accordion */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Fragrance Tips</h2>

          <div className={styles.accordion}>
            {/* Standard accordion items (list-based) */}
            {ACCORDION_ITEMS.map((item) => {
              const isOpen = openAccordion.includes(item.id);
              const Icon = item.icon;
              return (
                <div key={item.id} className={styles.accordionItem}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.accordionHeaderLeft}>
                      <Icon size={18} className={styles.accordionIcon} />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className={styles.accordionBody}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className={styles.accordionContent}>
                          <ul className={styles.tipList}>
                            {item.items.map((tip, i) => (
                              <li key={i} className={styles.tipItem}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Concentration Guide */}
            {(() => {
              const isOpen = openAccordion.includes('concentration');
              return (
                <div className={styles.accordionItem}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() => toggleAccordion('concentration')}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.accordionHeaderLeft}>
                      <Droplets size={18} className={styles.accordionIcon} />
                      <span>Concentration Guide</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className={styles.accordionBody}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className={styles.accordionContent}>
                          <div className={styles.concTable}>
                            {CONCENTRATIONS.map((c) => (
                              <div key={c.id} className={styles.concRow}>
                                <div className={styles.concInfo}>
                                  <span className={styles.concName}>{c.label}</span>
                                  <span className={styles.concMeta}>
                                    {c.baseSprays}–{c.baseSprays + 2} sprays &middot; {c.longevityRange[0]}–{c.longevityRange[1]}h
                                  </span>
                                </div>
                                <div className={styles.concBar}>
                                  <div
                                    className={styles.concBarFill}
                                    style={{ width: `${(c.strength / 4) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            {/* Occasion Intensity */}
            {(() => {
              const isOpen = openAccordion.includes('intensity');
              return (
                <div className={styles.accordionItem}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() => toggleAccordion('intensity')}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.accordionHeaderLeft}>
                      <Target size={18} className={styles.accordionIcon} />
                      <span>Occasion Intensity</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className={styles.accordionBody}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className={styles.accordionContent}>
                          <div className={styles.intensityTable}>
                            {INTENSITY_TABLE.map((row) => (
                              <div key={row.label} className={styles.intensityRow}>
                                <span className={styles.intensityLabel}>{row.label}</span>
                                <span className={styles.intensityRange}>{row.range} sprays</span>
                                <Badge variant="default" size="sm">{row.level}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}
          </div>
        </section>
      </div>
    </div>
  );
}
