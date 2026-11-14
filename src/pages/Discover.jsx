import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Check, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FragranceCard, SprayGuidePanel } from '../components/fragrance';
import { useFragrances } from '../context/FragranceContext';
import {
  SEASONS, TIME_OF_DAY, DRESS_CODES,
  OCCASION_CATEGORIES, OCCASIONS,
} from '../data/constants';
import { discoverScore } from '../utils/engine';
import { getSprayGuideForFragrance } from '../utils/sprayGuide';
import { getCurrentSeason } from '../utils/helpers';
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
    label: 'Season',
    question: 'What season is it?',
    subtitle: 'Fragrances are made for every season',
    options: SEASONS.map(s => ({ id: s.id, label: s.label, icon: s.icon, desc: s.description })),
  },
  {
    key: 'occasionCategory',
    label: 'Occasion',
    question: "What's the occasion?",
    subtitle: 'Pick the type of event or setting',
    options: OCCASION_CATEGORIES.map(c => ({ id: c.id, label: c.label, icon: c.icon })),
  },
  {
    key: 'timeOfDay',
    label: 'Time of day',
    question: 'What time of day?',
    subtitle: 'When will you be wearing it?',
    options: TIME_OF_DAY.map(t => ({ id: t.id, label: t.label, icon: t.icon, desc: t.description })),
  },
  {
    key: 'dressCode',
    label: 'Outfit',
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
  const [openGuides, setOpenGuides] = useState(new Set());

  function toggleGuide(id) {
    setOpenGuides(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

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
    if (!hasAny) return fragrances.map(f => ({ fragrance: f, score: 0, total: 0, matchPercent: 100 }));

    const occIds = filters.occasionCategory.flatMap(cat => OCCASION_BY_CATEGORY[cat] || []);
    const engineFilters = {
      season: filters.season,
      timeOfDay: filters.timeOfDay,
      dressCode: filters.dressCode,
      occasionIds: occIds,
    };

    const scored = fragrances.map(f => {
      const { score, matchPercent, relevance } = discoverScore(f, engineFilters);
      return { fragrance: f, score, total: Object.values(filters).filter(a => a.length).length, matchPercent, relevance };
    });
    scored.sort((a, b) => b.score !== a.score ? b.score - a.score : b.relevance - a.relevance);
    return scored.filter(s => s.score > 0);
  }, [fragrances, filters, activeFilterCount]);

  return (
    <div className={styles.page}>

      {/* Step area */}
      <div className={styles.stepContainer}>

        {/* daisyUI Steps */}
        <ul className="steps steps-horizontal w-full mb-8 sm:mb-12">
          {STEPS.map((s, i) => {
            const isPast = done || i < currentStep;
            const isActive = !done && i === currentStep;
            const hasSelection = filters[s.key]?.length > 0;
            return (
              <li
                key={s.key}
                className={`step cursor-pointer ${isPast && hasSelection ? 'step-primary' : ''} ${isActive ? 'step-primary' : ''}`}
                onClick={() => goToStep(i)}
              >
                <span className="hidden sm:inline text-xs">{s.question.replace("What's the ", '').replace('What ', '').replace('?', '')}</span>
              </li>
            );
          })}
        </ul>

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
              <button
                className={styles.navBack}
                onClick={goBack}
                disabled={currentStep === 0}
              >
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
          /* Done state */
          <div className={styles.doneState}>
            <div className={styles.doneHeader}>
              <span className={styles.doneEmoji}>&#10024;</span>
              <div>
                <h2 className={styles.doneTitle}>
                  {results.length} fragrance{results.length !== 1 ? 's' : ''} matched
                </h2>
                <p className={styles.doneSubtitle}>
                  Based on {activeFilterCount} preference{activeFilterCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className={styles.selectionSummary}>
              {STEPS.map((s, i) => {
                const selected = filters[s.key] || [];
                const selectedOpts = s.options.filter(o => selected.includes(o.id));
                return (
                  <div key={s.key} className={styles.selectionRow}>
                    <span className={styles.selectionLabel}>{s.label}</span>
                    <div className={styles.selectionChips}>
                      {selectedOpts.length > 0 ? (
                        selectedOpts.map(opt => (
                          <span key={opt.id} className={styles.selectionChip}>
                            {opt.icon} {opt.label}
                          </span>
                        ))
                      ) : (
                        <span className={styles.selectionSkipped}>Any</span>
                      )}
                    </div>
                    <button
                      className={styles.editStepBtn}
                      onClick={() => goToStep(i)}
                    >
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>

            <button className="btn btn-ghost btn-sm text-base-content/40 gap-1.5" onClick={restart}>
              <RotateCcw size={13} />
              Start over
            </button>
          </div>
        )}
      </div>

      {/* Live results */}
      <div className={styles.resultsSection}>
        <div className={styles.resultsInner}>
          {activeFilterCount === 0 ? (
            <div className={styles.resultsHint}>
              <span className={styles.resultsHintIcon}>&#127800;</span>
              <p>Your matches will appear here as you answer</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <p className={styles.resultsCount}>
                {results.length} {results.length === 1 ? 'match' : 'matches'}
              </p>
              <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                  {results.map(({ fragrance, matchPercent }, i) => {
                    const guideOpen = openGuides.has(fragrance.id);
                    const catId = filters.occasionCategory[0];
                    const occ = catId ? OCCASIONS.find(o => o.category === catId) : null;
                    const seasonId = filters.season[0] || getCurrentSeason();
                    const sprayGuide = occ
                      ? getSprayGuideForFragrance(fragrance, seasonId, occ.id)
                      : null;
                    return (
                      <motion.div
                        key={fragrance.id}
                        layout
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.26, delay: i * 0.03 }}
                      >
                        <FragranceCard fragrance={fragrance} matchPercent={matchPercent} />
                        {sprayGuide && (
                          <div className={styles.howToWearSection}>
                            <button
                              className={styles.howToWearToggle}
                              onClick={() => toggleGuide(fragrance.id)}
                              aria-expanded={guideOpen}
                            >
                              <Droplets size={14} />
                              How to Wear
                              {guideOpen
                                ? <ChevronUp size={14} className={styles.chevron} />
                                : <ChevronDown size={14} className={styles.chevron} />
                              }
                            </button>
                            <AnimatePresence initial={false}>
                              {guideOpen && (
                                <motion.div
                                  key="guide"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25 }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <div className={styles.howToWearInner}>
                                    <SprayGuidePanel guide={sprayGuide} compact />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className={styles.resultsHint}>
              <span className={styles.resultsHintIcon}>&#128270;</span>
              <p>No fragrances match this combination — try different options or skip a step</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
