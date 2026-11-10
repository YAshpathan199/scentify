import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui';
import styles from './CTASection.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function CTASection() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  return (
    <section className={styles.cta}>
      <motion.div
        className={styles.inner}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className={styles.decoration} aria-hidden="true" />

        <h2 className={styles.title}>Ready to Find Your Signature Scent?</h2>

        <p className={styles.subtitle}>
          Take our 60-second quiz and discover which fragrance matches your
          style.
        </p>

        <Button variant="primary" size="lg" onClick={() => navigate('/discover')}>
          Start the Quiz
        </Button>
      </motion.div>
    </section>
  );
}
