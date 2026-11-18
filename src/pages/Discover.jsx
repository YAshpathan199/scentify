import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Check, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FragranceCard, SprayGuidePanel } from '../components/fragrance';
import { useFragrances } from '../context/FragranceContext';
import {
  SEASONS, TIME_OF_DAY, DRESS_CODES,
  OCCASION_CATEGORIES, OCCASIONS,
} from '../data/constants';
import { discoverScore, rank } from '../utils/engine';
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

function defaultFilters() {
  return { season: [getCurrentSeason()], occasionCategory: [], timeOfDay: [], dressCode: [] };
}

const SESSION_KEY = 'scentify_discover_state';

function loadSaved() {
  try {
    const s = sessionStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export default function Discover() {
  const { fragrances } = useFragrances();
  const [currentStep, setCurrentStep] = useState(() => loadSaved()?.currentStep ?? 0);
  const [direction, setDirection] = useState(1);
  const [filters, setFilters] = useState(() => loadSaved()?.filters ?? defaultFilters());
  const [done, setDone] = useState(() => loadSaved()?.done ?? false);
  const [openGuides, setOpenGuides] = useState(new Set());
  const [genderFilter, setGenderFilter] = useState(() => loadSaved()?.genderFilter ?? 'all');

  // Persist quiz state whenever it changes
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ filters, currentStep, done, genderFilter }));
  }, [filters, currentStep, done, genderFilter]);

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
    sessionStorage.removeItem(SESSION_KEY);
    setFilters(defaultFilters());
    setCurrentStep(0);
    setDone(false);
    setDirection(1);
    setGenderFilter('all');
  }

  const genderFiltered = useMemo(() => {
    if (genderFilter === 'all') return fragrances;
    return fragrances.filter(f => f.gender === 'unisex' || f.gender === genderFilter);
  }, [fragrances, genderFilter]);

  const results = useMemo(() => {
    if (activeFilterCount === 0) return [];

    const occIds = filters.occasionCategory.flatMap(cat => OCCASION_BY_CATEGORY[cat] || []);
    const engineFilters = {
      season: filters.season,
      timeOfDay: filters.timeOfDay,
      dressCode: filters.dressCode,
      occasionIds: occIds,
    };

    // Tag-match gate: only show fragrances with at least one matching tag
    const tagMatchSet = new Set();
    for (const f of genderFiltered) {
      if (discoverScore(f, engineFilters).score > 0) tagMatchSet.add(f.id);
    }
    if (tagMatchSet.size === 0) return [];

    // Weighted ranking determines display score and order (R1)
    const weightedAnswers = {
      season: filters.season[0],
      occasion: occIds[0],
      timeOfDay: filters.timeOfDay[0],
      dressCode: filters.dressCode[0],
    };
    const ranked = rank(genderFiltered, weightedAnswers);

    return ranked
      .filter(r => tagMatchSet.has(r.fragrance.id))
      .map(r => ({
        fragrance: r.fragrance,
        score: r.score,
        matchPercent: Math.round(r.score * 100),
        tier: r.tier,
      }));
  }, [genderFiltered, filters, activeFilterCount]);

  // R2: split into best matches (S/A tier) and secondary (B/C tier)
  const topMatches = useMemo(() => results.filter(r => r.tier === 'S' || r.tier === 'A'), [results]);
  const secondary = useMemo(() => results.filter(r => r.tier !== 'S' && r.tier !== 'A'), [results]);

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
                <p className={styles.stepSubtitle}>
                  {step.subtitle}
                  {step.key === 'season' && (
                    <span className={styles.autoDetected}> · auto-detected, tap to change</span>
                  )}
                </p>

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
                  {topMatches.length} match{topMatches.length !== 1 ? 'es' : ''}
                  {secondary.length > 0 ? ` · ${secondary.length} more` : ''}
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
          ) : (
            <>
              <div className={styles.genderToggleRow}>
                {[
                  { id: 'all', label: 'All', icon: '✨' },
                  { id: 'men', label: 'Him', icon: '👔' },
                  { id: 'women', label: 'Her', icon: '👗' },
                ].map(g => (
                  <button
                    key={g.id}
                    className={`${styles.genderToggleBtn} ${genderFilter === g.id ? styles.genderToggleBtnActive : ''}`}
                    onClick={() => setGenderFilter(g.id)}
                  >
                    <span>{g.icon}</span>
                    {g.label}
                  </button>
                ))}
                <span className={styles.genderToggleCount}>
                  {topMatches.length} {topMatches.length === 1 ? 'match' : 'matches'}
                  {secondary.length > 0 ? ` · ${secondary.length} more` : ''}
                </span>
              </div>
              {results.length > 0 ? (
                <>
                  {/* Best matches — S/A tier from weighted engine */}
                  <div className={styles.grid}>
                    <AnimatePresence mode="popLayout">
                      {topMatches.map(({ fragrance, matchPercent }, i) => {
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

                  {/* Also in collection — B/C tier, tag-matched but lower weighted score */}
                  {secondary.length > 0 && (
                    <>
                      <div className={styles.sectionDivider}>
                        <span className={styles.sectionDividerLabel}>Also in your collection</span>
                      </div>
                      <div className={`${styles.grid} ${styles.gridDimmed}`}>
                        <AnimatePresence mode="popLayout">
                          {secondary.map(({ fragrance, matchPercent }, i) => (
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
                  )}
                </>
              ) : (
                <div className={styles.resultsHint}>
                  <span className={styles.resultsHintIcon}>&#128270;</span>
                  <p>No matches for this filter — tap All to see all results</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}
