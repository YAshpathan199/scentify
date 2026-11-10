import { Compass, Sparkles, Heart } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '../ui';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    number: '01',
    icon: Compass,
    title: 'Take the Quiz',
    description:
      'Answer 5 quick questions about your occasion, season, and mood.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Get Matched',
    description:
      'Our algorithm finds your perfect fragrance match from the collection.',
  },
  {
    number: '03',
    icon: Heart,
    title: 'Discover More',
    description:
      'Explore detailed notes, spray guides, and fragrance pairings.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 50, rotateX: 20, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { delay: i * 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  return (
    <div className={styles.wrapper}>
      <Section
        title="How It Works"
        subtitle="Three simple steps to your perfect fragrance"
        id="how-it-works"
      >
        <div className={styles.grid}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className={styles.step}
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={i}
                style={{ perspective: 800 }}
              >
                <span className={styles.number}>{step.number}</span>
                <div className={styles.iconCircle}>
                  <Icon size={28} />
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
