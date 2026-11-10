import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Thermometer,
  Sun,
  Droplets,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
} from 'lucide-react';
import { Button } from '../components/ui';
import styles from './Storage.module.css';

const ENEMIES = [
  {
    icon: Thermometer,
    title: 'Heat',
    text: "India's 40°C+ summers can break down fragrance molecules. Heat accelerates oxidation, changing the scent profile and reducing longevity.",
  },
  {
    icon: Sun,
    title: 'Light',
    text: 'UV rays degrade fragrance compounds. Clear bottles on windowsills or dressing tables in direct sunlight lose their character fastest.',
  },
  {
    icon: Droplets,
    title: 'Humidity',
    text: 'Monsoon humidity can corrode sprayer mechanisms and alter alcohol-based formulations. Bathrooms are the worst storage spot.',
  },
];

const DOS = [
  'Store in original box for UV protection',
  'Keep in AC room or cool wardrobe shelf',
  'Store upright to protect sprayer seal',
  'Use within 3–5 years of opening',
  'Close cap tightly after every use',
  'Store decants in dark glass atomizers',
  'Keep away from kitchen spice aromas',
];

const DONTS = [
  "Never leave on car dashboard (60°C+ inside)",
  'Avoid bathroom storage — steam and humidity',
  "Don’t store near windows or balcony doors",
  "Don’t shake the bottle — traps air inside",
  'Never remove the sprayer head',
  "Don’t store in fridge — temperature shocks",
  'Avoid keeping next to agarbatti or dhoop',
];

const SEASON_TIPS = [
  {
    season: 'Summer',
    icon: '☀️',
    months: 'Apr – Jun',
    color: '#D08A10',
    text: 'Move entire collection to AC room. If no AC, use a dark cupboard with silica gel packets. Avoid top shelves (heat rises). Morning application should be from refrigerator-cool bottles for extra freshness.',
  },
  {
    season: 'Monsoon',
    icon: '🌧️',
    months: 'Jul – Sep',
    color: '#4682B4',
    text: 'Check sprayer mechanisms for corrosion monthly. Wrap bottles in cloth to absorb excess moisture. Consider airtight containers for expensive bottles. Avoid open-shelf display.',
  },
  {
    season: 'Winter',
    icon: '❄️',
    months: 'Dec – Feb',
    color: '#6B8F71',
    text: 'Perfect storage conditions naturally. Can display bottles on dresser. The cool, dry air preserves fragrance integrity. Great time to open new bottles.',
  },
  {
    season: 'Spring / Autumn',
    icon: '🌸',
    months: 'Feb–Mar & Oct–Nov',
    color: '#B8860B',
    text: 'Transition seasons — maintain cool storage habits from summer but less critical. Good time to check your collection for any scent changes.',
  },
];

const LONGEVITY = [
  { type: 'EDC', label: 'Eau de Cologne', opened: '1–2 years', sealed: '3–4 years', strength: 25 },
  { type: 'EDT', label: 'Eau de Toilette', opened: '2–3 years', sealed: '4–5 years', strength: 50 },
  { type: 'EDP', label: 'Eau de Parfum', opened: '3–5 years', sealed: '5–8 years', strength: 75 },
  { type: 'Parfum', label: 'Parfum', opened: '5+ years', sealed: '8–10 years', strength: 100 },
];

const EXPIRY_SIGNS = [
  'Color has darkened significantly',
  'Scent has become sour or vinegar-like',
  'Top notes have disappeared',
  'Spray mechanism corroded or clogged',
  'Liquid has become cloudy',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Storage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Fragrance Storage & Care</h1>
          <p className={styles.subtitle}>
            Protect your collection in every Indian season
          </p>
        </header>

        {/* The Enemies */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Shield size={22} className={styles.sectionIcon} />
            The Three Enemies
          </h2>
          <div className={styles.enemyGrid}>
            {ENEMIES.map((enemy, i) => {
              const Icon = enemy.icon;
              return (
                <motion.div
                  key={enemy.title}
                  className={styles.enemyCard}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={i}
                >
                  <div className={styles.enemyIconWrap}>
                    <Icon size={28} />
                  </div>
                  <h3 className={styles.enemyTitle}>{enemy.title}</h3>
                  <p className={styles.enemyText}>{enemy.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Do's & Don'ts */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Do's & Don'ts</h2>
          <div className={styles.dosdonts}>
            <div className={styles.doCol}>
              <h3 className={styles.colTitle}>
                <CheckCircle size={20} className={styles.doIcon} /> Do
              </h3>
              <ul className={styles.ddList}>
                {DOS.map((item) => (
                  <li key={item} className={styles.doItem}>
                    <CheckCircle size={16} className={styles.doIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.dontCol}>
              <h3 className={styles.colTitle}>
                <XCircle size={20} className={styles.dontIcon} /> Don't
              </h3>
              <ul className={styles.ddList}>
                {DONTS.map((item) => (
                  <li key={item} className={styles.dontItem}>
                    <XCircle size={16} className={styles.dontIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Indian Climate Storage Guide */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Thermometer size={22} className={styles.sectionIcon} />
            Indian Climate Storage Guide
          </h2>
          <div className={styles.seasonGrid}>
            {SEASON_TIPS.map((s, i) => (
              <motion.div
                key={s.season}
                className={styles.seasonCard}
                style={{ borderTopColor: s.color }}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={i}
              >
                <div className={styles.seasonHeader}>
                  <span className={styles.seasonEmoji}>{s.icon}</span>
                  <div>
                    <h3 className={styles.seasonName}>{s.season}</h3>
                    <span className={styles.seasonMonths}>{s.months}</span>
                  </div>
                </div>
                <p className={styles.seasonText}>{s.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Longevity Guide */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Clock size={22} className={styles.sectionIcon} />
            Shelf Life Guide
          </h2>
          <div className={styles.longevityGrid}>
            {LONGEVITY.map((item) => (
              <div key={item.type} className={styles.longevityCard}>
                <div className={styles.longevityType}>{item.type}</div>
                <div className={styles.longevityLabel}>{item.label}</div>
                <div className={styles.longevityBar}>
                  <div
                    className={styles.longevityBarFill}
                    style={{ width: `${item.strength}%` }}
                  />
                </div>
                <div className={styles.longevityRow}>
                  <span className={styles.longevityKey}>Opened</span>
                  <span className={styles.longevityVal}>{item.opened}</span>
                </div>
                <div className={styles.longevityRow}>
                  <span className={styles.longevityKey}>Sealed</span>
                  <span className={styles.longevityVal}>{item.sealed}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Signs of Expired Fragrance */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <AlertTriangle size={22} className={styles.sectionIcon} />
            Signs Your Fragrance Has Expired
          </h2>
          <div className={styles.warningSection}>
            {EXPIRY_SIGNS.map((sign) => (
              <div key={sign} className={styles.warningItem}>
                <AlertTriangle size={18} className={styles.warningIcon} />
                <span>{sign}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Now that you know how to protect your bottles, explore what's in your collection.
          </p>
          <Link to="/explore">
            <Button variant="primary" size="lg">
              Explore Your Collection
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
