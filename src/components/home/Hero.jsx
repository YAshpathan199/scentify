import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button, ParticleField } from '../ui';
import styles from './Hero.module.css';

const PerfumeBottle3D = lazy(() => import('./PerfumeBottle3D'));

const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  top: `${5 + Math.random() * 90}%`,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 4,
  duration: 3 + Math.random() * 4,
}));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;
  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReduced) return;
    const handleMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouse({ x, y });
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMove);
    return () => el?.removeEventListener('mousemove', handleMove);
  }, [prefersReduced]);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.gradient} />

      {/* Parallax depth rings */}
      {!prefersReduced && (
        <div className={styles.depthLayers} aria-hidden="true">
          <div
            className={`${styles.depthRing} ${styles.ring1}`}
            style={{ transform: `translate(${mouse.x * -15}px, ${mouse.y * -15}px)` }}
          />
          <div
            className={`${styles.depthRing} ${styles.ring2}`}
            style={{ transform: `translate(${mouse.x * 25}px, ${mouse.y * 25}px)` }}
          />
          <div
            className={`${styles.depthRing} ${styles.ring3}`}
            style={{ transform: `translate(${mouse.x * -40}px, ${mouse.y * -40}px)` }}
          />
        </div>
      )}

      {!prefersReduced && (
        <ParticleField color="rgba(184,149,106,0.5)" />
      )}

      {!prefersReduced && (
        <div className={styles.sparkleField} aria-hidden="true">
          {SPARKLES.map((s) => (
            <motion.span
              key={s.id}
              className={styles.sparkle}
              style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Two-column layout: text left, bottle right */}
      <div className={styles.heroLayout}>
        <div
          className={styles.content}
          style={!prefersReduced ? {
            transform: `translate(${mouse.x * -5}px, ${mouse.y * -5}px)`,
            transition: 'transform 0.2s ease-out',
          } : undefined}
        >
          <motion.h1
            className={styles.title}
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Discover the Fragrance That Feels Like You
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Your personal fragrance advisor for every occasion, season, and mood
            &mdash; curated for the Indian fragrance lover.
          </motion.p>

          <motion.div
            className={styles.actions}
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Button variant="primary" size="lg" onClick={() => navigate('/discover')}>
              Find Your Scent
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={styles.outlineLight}
              onClick={() => navigate('/explore')}
            >
              Explore Collection
            </Button>
          </motion.div>
        </div>

        {/* 3D Bottle column */}
        <div className={styles.bottleSlot} aria-hidden="true">
          {!prefersReduced && (
            <Suspense fallback={null}>
              <PerfumeBottle3D style={{ width: '100%', height: '100%' }} />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
}
