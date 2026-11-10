import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Flower2, Archive, ArrowRight } from 'lucide-react';
import styles from './Learn.module.css';

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
