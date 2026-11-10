import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PRESETS = {
  'fade-up': { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  'fade-down': { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  'fade-left': { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  'fade-right': { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  'zoom-in': { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  'flip-up': { hidden: { opacity: 0, rotateX: 30, y: 30 }, visible: { opacity: 1, rotateX: 0, y: 0 } },
  'slide-up-3d': {
    hidden: { opacity: 0, y: 60, rotateX: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
  },
};

export default function ScrollReveal({
  children,
  effect = 'fade-up',
  delay = 0,
  duration = 0.6,
  once = true,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px' });
  const preset = PRESETS[effect] || PRESETS['fade-up'];

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ perspective: 1000, ...style }}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: preset.hidden,
        visible: {
          ...preset.visible,
          transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
