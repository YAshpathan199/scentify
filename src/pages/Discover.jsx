import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FragranceCard } from '../components/fragrance';
import { useFragrances } from '../context/FragranceContext';
import {
  SEASONS, TIME_OF_DAY, DRESS_CODES,
  OCCASION_CATEGORIES, OCCASIONS,
} from '../data/constants';
import styles from './Discover.module.css';

function buildOccasionMap() {
  const map = {};
  for (const occ of OCCASIONS) {
    if (!map[occ.category]) map[occ.category] = [];
    map[occ.category].push(occ.id);
  }
  return map;
}
const OCCASION_BY_CATEGORY = buildOccasionMap();

const STEPS = [
  {
    key: 'season',
    question: 'What season is it?',
    subtitle: 'Fragrances are made for every season',
    options: SEASONS.map(s => ({ id: s.id, label: s.label, icon: s.icon, desc: s.description })),
  },
  {
    key: 'occasionCategory',
    question: "What's the occasion?",
    subtitle: 'Pick the type of event or setting',
    options: OCCASION_CATEGORIES.map(c => ({ id: c.id, label: c.label, icon: c.icon })),
  },
  {
    key: 'timeOfDay',
    question: 'What time of day?',
    subtitle: 'When will you be wearing it?',
    options: TIME_OF_DAY.map(t => ({ id: t.id, label: t.label, icon: t.icon, desc: t.description })),
  },
  {
    key: 'dressCode',
    question: 'What are you wearing?',
    subtitle: 'Your outfit guides the fragrance choice',
    options: DRESS_CODES.map(d => ({ id: d.id, label: d.label, icon: d.icon, desc: d.description })),
  },
];

const slideVariants = {
  enter: d => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: d => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
};

const EMPTY_FILTERS = {
  season: [], occasionCategory: [],
  timeOfDay: [], dressCode: [],
};

export default function Discover() {
  const { fragrances } = useFragrances();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [done, setDone] = useState(false);

  const step = STEPS[currentStep];
  const currentSelections = done ? [] : (filters[step?.key] || []);
  const activeFilterCount = Object.values(filters).reduce((s, a) => s + a.length, 0);

  function toggleOption(id) {
    const key = step.key;
    setFilters(prev => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(id) ? arr.filter(v => v !== id) : [...arr, id] };
    });
  }

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'instant' }); }

  function goNext() {
    scrollTop();
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(s => s + 1);
    } else {
      setDone(true);
    }
  }

  function goBack() {
    scrollTop();
    if (done) { setDone(false); return; }
    if (currentStep > 0) { setDirection(-1); setCurrentStep(s => s - 1); }
  }

  function goToStep(i) {
    scrollTop();
    if (done) setDone(false);
    setDirection(i > currentStep ? 1 : -1);
    setCurrentStep(i);
  }

  function restart() {
    scrollTop();
    setFilters(EMPTY_FILTERS);
    setCurrentStep(0);
    setDone(false);
    setDirection(1);
  }

  const results = useMemo(() => {
    const hasAny = activeFilterCount > 0;
    const scored = fragrances.map(f => {
      if (!hasAny) return { fragrance: f, score: 0, total: 0, matchPercent: 100 };
      let matched = 0, total = 0;
      if (filters.season.length) { total++; if (filters.season.some(s => f.seasons?.includes(s))) matched++; }
      if (filters.timeOfDay.length) { total++; if (filters.timeOfDay.some(t => f.timeOfDay?.includes(t))) matched++; }
      if (filters.dressCode.length) { total++; if (filters.dressCode.some(d => f.dressCodes?.includes(d))) matched++; }
      if (filters.occasionCategory.length) {
        total++;
        const occIds = filters.occasionCategory.flatMap(cat => OCCASION_BY_CATEGORY[cat] || []);
        if (occIds.some(o => f.occasions?.includes(o))) matched++;
      }
      const matchPercent = total > 0 ? Math.round((matched / total) * 100) : 100;
      return { fragrance: f, score: matched, total, matchPercent };
    });
    if (hasAny) {
      scored.sort((a, b) => b.score !== a.score ? b.score - a.score : b.matchPercent - a.matchPercent);
      return scored.filter(s => s.score > 0);
    }
    return scored;
  }, [fragrances, filters, activeFilterCount]);

  return (
    <div className={styles.page}>

      {/* ── Step area ── */}
      <div className={styles.stepContainer}>

        {/* Stepper */}
        <div className={styles.stepper}>
          <div className={styles.stepperLine} />
          {STEPS.map((s, i) => {
            const isActive = !done && i === currentStep;
            const isPast = done || i < currentStep;
            const hasSelection = filters[s.key]?.length > 0;
            return (
              <button
                key={s.key}
                className={`${styles.stepDot}
                  ${isActive ? styles.stepDotActive : ''}
                  ${isPast && hasSelection ? styles.stepDotDone : ''}
                  ${isPast && !hasSelection ? styles.stepDotSkipped : ''}`}
                onClick={() => goToStep(i)}
                aria-label={s.question}
              >
                {isPast && hasSelection
                  ? <Check size={11} strokeWidth={3} />
                  : <span>{i + 1}</span>}
              </button>
            );
          })}
        </div>

        {!done ? (
          <>
            {/* Animated step content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className={styles.stepContent}
              >
                <p className={styles.stepCounter}>Step {currentStep + 1} of {STEPS.length}</p>
                <h2 className={styles.stepQuestion}>{step.question}</h2>
                <p className={styles.stepSubtitle}>{step.subtitle}</p>

                <div className={styles.optionsGrid}>
                  {step.options.map(opt => {
                    const isSelected = currentSelections.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''}`}
                        onClick={() => toggleOption(opt.id)}
                      >
                        {isSelected && (
                          <span className={styles.optionCheckmark}>
                            <Check size={11} strokeWidth={3} />
                          </span>
                        )}
                        <span className={styles.optionIcon}>{opt.icon}</span>
                        <span className={styles.optionLabel}>{opt.label}</span>
                        {opt.desc && <span className={styles.optionDesc}>{opt.desc}</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className={styles.navRow}>
              <button className={styles.navBack} onClick={goBack} disabled={currentStep === 0}>
                <ArrowLeft size={15} />
                Back
              </button>
              <div className={styles.navRight}>
                <button className={styles.navSkip} onClick={goNext}>Skip</button>
                <button
                  className={`${styles.navNext} ${currentSelections.length > 0 ? styles.navNextActive : ''}`}
                  onClick={goNext}
                >
                  {currentStep === STEPS.length - 1 ? 'See Results' : 'Next'}
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ── Done state ── */
          <div className={styles.doneState}>
            <span className={styles.doneEmoji}>✨</span>
            <h2 className={styles.doneTitle}>
              {results.length} fragrance{results.length !== 1 ? 's' : ''} matched
            </h2>
            <p className={styles.doneSubtitle}>
              Based on {activeFilterCount} preference{activeFilterCount !== 1 ? 's' : ''}
            </p>
            <div className={styles.doneActions}>
              <button className={styles.navBack} onClick={goBack}>
                <ArrowLeft size={15} />
                Edit Preferences
              </button>
              <button className={styles.restartBtn} onClick={restart}>
                <RotateCcw size={13} />
                Start over
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Live results ── */}
      <div className={styles.resultsSection}>
        <div className={styles.resultsInner}>
          {activeFilterCount === 0 ? (
            <div className={styles.resultsHint}>
              <span className={styles.resultsHintIcon}>🌸</span>
              <p>Your matches will appear here as you answer</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <p className={styles.resultsCount}>
                {results.length} {results.length === 1 ? 'match' : 'matches'}
              </p>
              <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                  {results.map(({ fragrance, matchPercent }, i) => (
                    <motion.div
                      key={fragrance.id}
                      layout
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.26, delay: i * 0.03 }}
                    >
                      <FragranceCard fragrance={fragrance} matchPercent={matchPercent} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className={styles.resultsHint}>
              <span className={styles.resultsHintIcon}>🔍</span>
              <p>No fragrances match this combination — try different options or skip a step</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
