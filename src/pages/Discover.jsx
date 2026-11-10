import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  OCCASIONS,
  OCCASION_CATEGORIES,
  SEASONS,
  TIME_OF_DAY,
  DRESS_CODES,
  MOODS,
  HOME_ROOMS,
} from '../data/constants';
import { getCurrentSeason } from '../utils/helpers';
import styles from './Discover.module.css';

const MODE_OPTIONS = [
  { id: 'personal', label: 'Personal Wear', icon: '🧑', desc: 'Find the perfect fragrance to wear' },
  { id: 'home', label: 'Home Spray', icon: '🏠', desc: 'Scent your rooms beautifully' },
];

const HOME_TIMES = [
  { id: 'morning', label: 'Morning', icon: '🌅', description: '6 AM – 12 PM' },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️', description: '12 PM – 5 PM' },
  { id: 'evening', label: 'Evening', icon: '🌆', description: '5 PM – 9 PM' },
  { id: 'night', label: 'Night', icon: '🌙', description: '9 PM – 6 AM' },
];

const PERSONAL_LABELS = ['Occasion', 'Season', 'Time', 'Dress Code', 'Mood'];
const HOME_LABELS = ['Room', 'Time of Day'];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function Discover() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({
    occasion: null,
    season: getCurrentSeason(),
    timeOfDay: null,
    dressCode: null,
    mood: null,
  });
  const [homeAnswers, setHomeAnswers] = useState({
    room: null,
    time: null,
  });
  const [occasionCategory, setOccasionCategory] = useState(null);

  const isHome = mode === 'home';
  const stepLabels = isHome ? HOME_LABELS : PERSONAL_LABELS;

  function personalStepToVisual(s) {
    if (s <= 1) return 0;
    return s - 1;
  }

  function personalCompletedVisual(index) {
    if (index === 0) return step >= 2;
    return step >= index + 2;
  }

  function goForward(nextStep) {
    setDirection(1);
    setStep(nextStep);
  }

  function goBack() {
    setDirection(-1);
    if (isHome) {
      if (step === 0) { setMode(null); }
      else { setStep(step - 1); }
    } else {
      if (step === 0) { setMode(null); }
      else if (step === 1) { setStep(0); }
      else { setStep(step - 1); }
    }
  }

  function selectMode(m) {
    setMode(m);
    setStep(0);
    setDirection(1);
  }

  // Personal flow
  function selectOccasionCategory(catId) {
    setOccasionCategory(catId);
    goForward(1);
  }

  function selectOccasion(occasionId) {
    setAnswers((prev) => ({ ...prev, occasion: occasionId }));
    goForward(2);
  }

  function selectSeason(seasonId) {
    setAnswers((prev) => ({ ...prev, season: seasonId }));
    goForward(3);
  }

  function selectTime(timeId) {
    setAnswers((prev) => ({ ...prev, timeOfDay: timeId }));
    goForward(4);
  }

  function selectDressCode(dressId) {
    setAnswers((prev) => ({ ...prev, dressCode: dressId }));
    goForward(5);
  }

  function selectMood(moodId) {
    const finalAnswers = { ...answers, mood: moodId };
    navigate('/results', { state: { answers: finalAnswers, mode: 'personal' } });
  }

  // Home flow
  function selectRoom(roomId) {
    setHomeAnswers((prev) => ({ ...prev, room: roomId }));
    goForward(1);
  }

  function selectHomeTime(timeId) {
    const final = { ...homeAnswers, time: timeId };
    navigate('/results', { state: { homeAnswers: final, mode: 'home' } });
  }

  const filteredOccasions = OCCASIONS.filter(
    (o) => o.category === occasionCategory
  );

  // Mode selection screen
  if (!mode) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key="mode"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={styles.stepContent}
            >
              <h1 className={styles.stepTitle}>What are you looking for?</h1>
              <p className={styles.stepSubtitle}>Choose your fragrance journey</p>
              <div className={styles.modeGrid}>
                {MODE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    className={styles.modeCard}
                    onClick={() => selectMode(opt.id)}
                  >
                    <span className={styles.modeIcon}>{opt.icon}</span>
                    <span className={styles.modeLabel}>{opt.label}</span>
                    <span className={styles.modeDesc}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Progress Indicator */}
        <div className={styles.progress}>
          {stepLabels.map((label, i) => {
            const isActive = isHome ? step === i : personalStepToVisual(step) === i;
            const isCompleted = isHome ? step > i : personalCompletedVisual(i);
            return (
              <div key={label} className={styles.progressStep}>
                {i > 0 && (
                  <div
                    className={`${styles.progressLine} ${
                      isCompleted || isActive ? styles.progressLineFilled : ''
                    }`}
                  />
                )}
                <div
                  className={`${styles.progressDot} ${
                    isActive ? styles.progressDotActive : ''
                  } ${isCompleted ? styles.progressDotCompleted : ''}`}
                />
                <span
                  className={`${styles.progressLabel} ${
                    isActive ? styles.progressLabelActive : ''
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <button className={styles.backButton} onClick={goBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${mode}-${step}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={styles.stepContent}
          >
            {/* ===== HOME SPRAY FLOW ===== */}
            {isHome && step === 0 && (
              <>
                <h1 className={styles.stepTitle}>Which room?</h1>
                <p className={styles.stepSubtitle}>Pick the space you want to scent</p>
                <div className={styles.gridCategories}>
                  {HOME_ROOMS.map((room) => (
                    <button
                      key={room.id}
                      className={styles.optionCard}
                      onClick={() => selectRoom(room.id)}
                    >
                      <span className={styles.optionIcon}>{room.icon}</span>
                      <span className={styles.optionLabel}>{room.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {isHome && step === 1 && (
              <>
                <h1 className={styles.stepTitle}>What time of day?</h1>
                <p className={styles.stepSubtitle}>
                  Scent preferences change throughout the day
                </p>
                <div className={styles.gridOptions}>
                  {HOME_TIMES.map((t) => (
                    <button
                      key={t.id}
                      className={`${styles.optionCard} ${styles.optionCardWide}`}
                      onClick={() => selectHomeTime(t.id)}
                    >
                      <span className={styles.optionIcon}>{t.icon}</span>
                      <span className={styles.optionLabel}>{t.label}</span>
                      <span className={styles.optionDesc}>{t.description}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ===== PERSONAL WEAR FLOW ===== */}
            {!isHome && step === 0 && (
              <>
                <h1 className={styles.stepTitle}>What's the occasion?</h1>
                <p className={styles.stepSubtitle}>First, pick a category</p>
                <div className={styles.gridCategories}>
                  {OCCASION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={styles.optionCard}
                      onClick={() => selectOccasionCategory(cat.id)}
                    >
                      <span className={styles.optionIcon}>{cat.icon}</span>
                      <span className={styles.optionLabel}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {!isHome && step === 1 && (
              <>
                <h1 className={styles.stepTitle}>What's the occasion?</h1>
                <p className={styles.stepSubtitle}>
                  Pick the specific event
                </p>
                <div className={styles.gridOptions}>
                  {filteredOccasions.map((occ) => (
                    <button
                      key={occ.id}
                      className={styles.optionCard}
                      onClick={() => selectOccasion(occ.id)}
                    >
                      <span className={styles.optionIcon}>{occ.icon}</span>
                      <span className={styles.optionLabel}>{occ.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {!isHome && step === 2 && (
              <>
                <h1 className={styles.stepTitle}>What season is it?</h1>
                <p className={styles.stepSubtitle}>
                  We've auto-selected the current season
                </p>
                <div className={styles.gridOptions}>
                  {SEASONS.map((season) => (
                    <button
                      key={season.id}
                      className={`${styles.optionCard} ${styles.optionCardWide} ${
                        answers.season === season.id
                          ? styles.optionCardSelected
                          : ''
                      }`}
                      onClick={() => selectSeason(season.id)}
                    >
                      <span className={styles.optionIcon}>{season.icon}</span>
                      <span className={styles.optionLabel}>
                        {season.label}
                      </span>
                      <span className={styles.optionDesc}>
                        {season.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {!isHome && step === 3 && (
              <>
                <h1 className={styles.stepTitle}>What time of day?</h1>
                <p className={styles.stepSubtitle}>
                  Choose when you'll be wearing it
                </p>
                <div className={styles.gridOptions}>
                  {TIME_OF_DAY.map((time) => (
                    <button
                      key={time.id}
                      className={`${styles.optionCard} ${styles.optionCardWide}`}
                      onClick={() => selectTime(time.id)}
                    >
                      <span className={styles.optionIcon}>{time.icon}</span>
                      <span className={styles.optionLabel}>{time.label}</span>
                      <span className={styles.optionDesc}>
                        {time.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {!isHome && step === 4 && (
              <>
                <h1 className={styles.stepTitle}>What are you wearing?</h1>
                <p className={styles.stepSubtitle}>
                  Your outfit affects fragrance choice
                </p>
                <div className={styles.gridOptions}>
                  {DRESS_CODES.map((dress) => (
                    <button
                      key={dress.id}
                      className={`${styles.optionCard} ${styles.optionCardWide}`}
                      onClick={() => selectDressCode(dress.id)}
                    >
                      <span className={styles.optionIcon}>{dress.icon}</span>
                      <span className={styles.optionLabel}>
                        {dress.label}
                      </span>
                      <span className={styles.optionDesc}>
                        {dress.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {!isHome && step === 5 && (
              <>
                <h1 className={styles.stepTitle}>What's your mood?</h1>
                <p className={styles.stepSubtitle}>
                  How do you want to feel?
                </p>
                <div className={styles.gridOptions}>
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      className={`${styles.optionCard} ${styles.optionCardWide}`}
                      onClick={() => selectMood(mood.id)}
                    >
                      <span className={styles.optionIcon}>{mood.icon}</span>
                      <span className={styles.optionLabel}>{mood.label}</span>
                      <span className={styles.optionDesc}>
                        {mood.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
