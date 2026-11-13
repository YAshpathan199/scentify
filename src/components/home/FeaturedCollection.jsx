import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Section } from '../ui';
import { FragranceCard } from '../fragrance';
import { SAMPLE_FRAGRANCES } from '../../data/fragrances';
import styles from './FeaturedCollection.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function FeaturedCollection() {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  const topFragrances = useMemo(
    () =>
      [...SAMPLE_FRAGRANCES]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6),
    []
  );

  return (
    <Section
      title="Featured Collection"
      subtitle={`${SAMPLE_FRAGRANCES.length} carefully curated fragrances`}
      id="featured"
    >
      <motion.div
        className={styles.scrollContainer}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {topFragrances.map((fragrance) => (
          <div key={fragrance.id} className={styles.cardWrapper}>
            <FragranceCard fragrance={fragrance} />
          </div>
        ))}
      </motion.div>

      <div className={styles.viewAll}>
        <Link to="/explore" className={styles.viewAllLink}>
          View All <ArrowRight size={16} />
        </Link>
      </div>
    </Section>
  );
}
