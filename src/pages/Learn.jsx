import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Flower2, Archive, ArrowRight, FlaskConical } from 'lucide-react';
import { CONCENTRATIONS } from '../data/constants';
import styles from './Learn.module.css';

const CONC_COLORS = ['#6A859A', '#3A8FA8', '#B8956A', '#8B6914'];
const CONC_PERCENT = ['2–5%', '5–15%', '15–20%', '20–30%'];

const CARDS = [
  {
    icon: Droplets,
    title: 'Spray Guide',
    desc: 'Master the art of fragrance application. Learn how many sprays to use, where to apply, and how seasons and occasions change everything.',
    topics: [
      'Interactive spray calculator',
      'Body map application points',
      'Season-specific advice for Indian climate',
      'Home spray guide for every room',
    ],
    link: '/guide',
  },
  {
    icon: Flower2,
    title: 'Fragrance Families',
    desc: 'Explore the 8 scent families that define every perfume. Understand their character, best seasons, and how to pair them.',
    topics: [
      'Woody, Floral, Oriental & more',
      'Key notes and ingredients',
      'Best seasons and occasions',
      'Layering and pairing tips',
    ],
    link: '/families',
  },
  {
    icon: Archive,
    title: 'Storage Tips',
    desc: 'Keep your fragrances lasting years, not months. Essential storage advice tailored for the Indian climate.',
    topics: [
      'Temperature and humidity control',
      'Light and UV protection',
      'Indian climate-specific advice',
      'Common mistakes to avoid',
    ],
    link: '/storage',
  },
];

const STATS = [
  { number: '8', label: 'Fragrance Families' },
  { number: '5', label: 'Indian Seasons' },
  { number: '31', label: 'Occasions' },
  { number: '4', label: 'Concentration Types' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function Learn() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Learn About Fragrances</h1>
          <p className={styles.subtitle}>
            Everything you need to become a fragrance expert
          </p>
        </header>

        <div className={styles.grid}>
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className={styles.card}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
              >
                <div className={styles.cardIconWrap}>
                  <Icon size={28} className={styles.cardIcon} />
                </div>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <p className={styles.cardDesc}>{card.desc}</p>
                <ul className={styles.cardTopics}>
                  {card.topics.map((topic) => (
                    <li key={topic} className={styles.cardTopic}>{topic}</li>
                  ))}
                </ul>
                <Link to={card.link} className={styles.cardLink}>
                  Start Learning <ArrowRight size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Concentration Section */}
        <section className={styles.concSection}>
          <div className={styles.concHeader}>
            <div className={styles.concIconWrap}>
              <FlaskConical size={24} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.concTitle}>Concentration — EDT or EDP?</h2>
              <p className={styles.concSubtitle}>
                The concentration determines how long a fragrance lasts and how strong it projects. Higher concentration = fewer sprays needed.
              </p>
            </div>
          </div>

          <div className={styles.concGrid}>
            {CONCENTRATIONS.map((conc, i) => (
              <motion.div
                key={conc.id}
                className={styles.concCard}
                style={{ '--conc-color': CONC_COLORS[i] }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <span className={styles.concBadge}>{conc.shortLabel}</span>
                <h3 className={styles.concName}>{conc.label}</h3>
                <span className={styles.concPercent}>{CONC_PERCENT[i]} oil</span>

                <div className={styles.concBarWrap}>
                  <motion.div
                    className={styles.concBar}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${conc.strength * 25}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>

                <div className={styles.concMeta}>
                  <div className={styles.concMetaItem}>
                    <span className={styles.concMetaLabel}>Lasts</span>
                    <span className={styles.concMetaValue}>{conc.longevityRange[0]}–{conc.longevityRange[1]}h</span>
                  </div>
                  <div className={styles.concMetaItem}>
                    <span className={styles.concMetaLabel}>Sprays</span>
                    <span className={styles.concMetaValue}>{conc.baseSprays}</span>
                  </div>
                </div>

                <p className={styles.concDesc}>{conc.description}</p>
              </motion.div>
            ))}
          </div>

          <div className={styles.concTip}>
            <strong>Pro tip:</strong> In India's hot summers, EDT performs better than you'd expect — heat amplifies projection. Save your EDP and Parfum for cooler months when you need that extra push.
          </div>
        </section>

        <section className={styles.statsSection}>
          <h2 className={styles.statsTitle}>Quick Facts</h2>
          <div className={styles.stats}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={styles.statCard}
                variants={statVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={i}
              >
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
