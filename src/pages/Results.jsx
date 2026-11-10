import { useMemo } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Check, RotateCcw, Compass, Droplets, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Badge } from '../components/ui';
import { NotesPyramid } from '../components/fragrance';
import { SAMPLE_FRAGRANCES } from '../data/fragrances';
import { OCCASIONS, SEASONS, FRAGRANCE_FAMILIES, HOME_ROOMS, HOME_SPRAY_GUIDE } from '../data/constants';
import { calculateQuizScores } from '../utils/scoring';
import styles from './Results.module.css';

function findLabel(list, id) {
  const item = list.find((entry) => entry.id === id);
  return item ? item.label : '';
}

function HomeResults({ homeAnswers }) {
  const room = HOME_ROOMS.find(r => r.id === homeAnswers.room);
  const guide = HOME_SPRAY_GUIDE[homeAnswers.room]?.[homeAnswers.time];
  const navigate = useNavigate();

  const matchedFragrances = useMemo(() => {
    if (!guide) return [];
    const familySet = new Set(guide.families);
    return SAMPLE_FRAGRANCES
      .filter(f => familySet.has(f.family))
      .map(f => {
        const familyIdx = guide.families.indexOf(f.family);
        const priority = familyIdx >= 0 ? familyIdx : 99;
        return { fragrance: f, priority };
      })
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 4);
  }, [guide]);

  if (!guide) return <Navigate to="/discover" replace />;

  const timeLabel = homeAnswers.time.charAt(0).toUpperCase() + homeAnswers.time.slice(1);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {room?.icon} Home Spray Picks
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            For your {room?.label} — {timeLabel}
          </motion.p>
        </header>

        {/* Spray Guide Card */}
        <motion.div
          className={styles.homeGuideCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className={styles.homeGuideHeader}>
            <div className={styles.homeSprayCount}>
              <Droplets size={20} className={styles.homeSprayIcon} />
              <span className={styles.homeSprayNum}>{guide.sprays[0]}–{guide.sprays[1]}</span>
              <span className={styles.homeSprayLabel}>sprays</span>
            </div>
            <div className={styles.homeGuideInfo}>
              <div className={styles.homeWhereRow}>
                <strong>Where to spray:</strong>
                <div className={styles.homeTagGroup}>
                  {guide.where.map(w => (
                    <span key={w} className={styles.homeTag}>{w}</span>
                  ))}
                </div>
              </div>
              <div className={styles.homeFamilyRow}>
                <strong>Best families:</strong>
                <div className={styles.homeTagGroup}>
                  {guide.families.map(fId => {
                    const fam = FRAGRANCE_FAMILIES.find(f => f.id === fId);
                    return fam ? (
                      <span key={fId} className={styles.homeFamilyTag} style={{
                        background: `${fam.color}15`,
                        color: fam.color,
                        borderColor: `${fam.color}40`,
                      }}>
                        {fam.icon} {fam.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.homeTip}>
            <Lightbulb size={16} />
            <span>{guide.tip}</span>
          </div>
        </motion.div>

        {/* Matched Fragrances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className={styles.homeRecTitle}>Recommended from your collection</h2>
          {matchedFragrances.length === 0 ? (
            <p className={styles.homeEmpty}>
              No fragrances in your collection match the recommended families. Try exploring new scents!
            </p>
          ) : (
            <div className={styles.results}>
              {matchedFragrances.map(({ fragrance }, index) => {
                const family = FRAGRANCE_FAMILIES.find(f => f.id === fragrance.family);
                return (
                  <motion.div
                    key={fragrance.id}
                    className={styles.card}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 + 0.1 * index }}
                  >
                    <div className={styles.rankRow}>
                      <span className={styles.rankBadge}>
                        <span className={styles.rankNumber}>#{index + 1}</span>
                      </span>
                      <Badge variant="family" color={family?.color} size="sm">
                        {family?.label}
                      </Badge>
                    </div>
                    <div className={styles.cardBody}>
                      {fragrance.image && (
                        <div className={styles.imageWrap}>
                          <img src={fragrance.image} alt={fragrance.name} className={styles.bottleImage} />
                        </div>
                      )}
                      <div className={styles.fragranceInfo}>
                        <p className={styles.brand}>{fragrance.brand}</p>
                        <h2 className={styles.fragranceName}>{fragrance.name}</h2>
                        <span className={styles.concentration}>{fragrance.concentration}</span>
                      </div>
                    </div>
                    <div className={styles.notesSection}>
                      <NotesPyramid notes={fragrance.notes} size="sm" />
                    </div>
                    <div className={styles.reasonsSection}>
                      <h3 className={styles.reasonsTitle}>Why for this room</h3>
                      <ul className={styles.reasonsList}>
                        <li className={styles.reasonItem}>
                          <Check size={14} className={styles.checkIcon} />
                          <span>{family?.label} family — {family?.description?.toLowerCase()}</span>
                        </li>
                        {fragrance.projection && (
                          <li className={styles.reasonItem}>
                            <Check size={14} className={styles.checkIcon} />
                            <span>{fragrance.projection.charAt(0).toUpperCase() + fragrance.projection.slice(1)} projection fills the {room?.label?.toLowerCase()}</span>
                          </li>
                        )}
                        <li className={styles.reasonItem}>
                          <Check size={14} className={styles.checkIcon} />
                          <span>{fragrance.longevity}h longevity keeps the room scented</span>
                        </li>
                      </ul>
                    </div>
                    <Link to={`/fragrance/${fragrance.id}`} className={styles.viewLink}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Button variant="outline" icon={RotateCcw} onClick={() => navigate('/discover')}>
            Try Again
          </Button>
          <Button variant="ghost" icon={Compass} onClick={() => navigate('/explore')}>
            Explore All
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (state?.mode === 'home' && state?.homeAnswers) {
    return <HomeResults homeAnswers={state.homeAnswers} />;
  }

  const answers = state?.answers;

  const results = useMemo(() => {
    if (!answers) return [];
    return calculateQuizScores(SAMPLE_FRAGRANCES, answers).slice(0, 3);
  }, [answers]);

  if (!answers) {
    return <Navigate to="/discover" replace />;
  }

  const occasionLabel = findLabel(OCCASIONS, answers.occasion);
  const seasonLabel = findLabel(SEASONS, answers.season);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Your Perfect Matches
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            For {occasionLabel} in {seasonLabel}
          </motion.p>
        </header>

        {/* Result Cards */}
        <div className={styles.results}>
          {results.map((result, index) => {
            const { fragrance, percentage, reasons } = result;
            const family = FRAGRANCE_FAMILIES.find(
              (f) => f.id === fragrance.family
            );
            const isFirst = index === 0;

            return (
              <motion.div
                key={fragrance.id}
                className={`${styles.card} ${isFirst ? styles.cardFirst : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 * (index + 1) }}
              >
                {/* Rank */}
                <div className={styles.rankRow}>
                  <span className={styles.rankBadge}>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    <span className={styles.rankNumber}>#{index + 1}</span>
                  </span>
                  <span
                    className={`${styles.matchPercent} ${
                      isFirst ? styles.matchPercentFirst : ''
                    }`}
                  >
                    {percentage}% match
                  </span>
                </div>

                {/* Fragrance Info */}
                <div className={styles.cardBody}>
                  {fragrance.image && (
                    <div className={styles.imageWrap}>
                      <img src={fragrance.image} alt={fragrance.name} className={styles.bottleImage} />
                    </div>
                  )}
                  <div className={styles.fragranceInfo}>
                    <p className={styles.brand}>{fragrance.brand}</p>
                    <h2 className={styles.fragranceName}>{fragrance.name}</h2>
                    <div className={styles.familyRow}>
                      <Badge variant="family" color={family?.color} size="sm">
                        {family?.label}
                      </Badge>
                      <span className={styles.concentration}>
                        {fragrance.concentration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes Pyramid */}
                <div className={styles.notesSection}>
                  <NotesPyramid notes={fragrance.notes} size="sm" />
                </div>

                {/* Reasons */}
                {reasons.length > 0 && (
                  <div className={styles.reasonsSection}>
                    <h3 className={styles.reasonsTitle}>
                      Why this fragrance
                    </h3>
                    <ul className={styles.reasonsList}>
                      {reasons.map((reason, i) => (
                        <li key={i} className={styles.reasonItem}>
                          <Check size={14} className={styles.checkIcon} />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* View Details */}
                <Link
                  to={`/fragrance/${fragrance.id}`}
                  className={styles.viewLink}
                >
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Button
            variant="outline"
            icon={RotateCcw}
            onClick={() => navigate('/discover')}
          >
            Retake Quiz
          </Button>
          <Button
            variant="ghost"
            icon={Compass}
            onClick={() => navigate('/explore')}
          >
            Explore All
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
