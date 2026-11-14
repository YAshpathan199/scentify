import { useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Badge, StarRating, ProgressBar } from '../components/ui';
import { use3DTilt } from '../hooks/use3DTilt';
import { FragranceCard, NotesPyramid, SprayGuidePanel } from '../components/fragrance';
import { SAMPLE_FRAGRANCES } from '../data/fragrances';
import {
  FRAGRANCE_FAMILIES,
  SEASONS,
  OCCASIONS,
  CONCENTRATIONS,
  TIME_OF_DAY,
  MOODS,
} from '../data/constants';
import { getSprayGuideForFragrance } from '../utils/sprayGuide';
import { getCurrentSeason, formatPrice, getProjectionPercent } from '../utils/helpers';
import styles from './Detail.module.css';

const PROJECTION_COLORS = {
  soft: 'var(--info)',
  moderate: 'var(--accent)',
  strong: '#D08A10',
  beast: 'var(--error)',
};

function BottleViewer({ fragrance, family }) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [shadow, setShadow] = useState('');
  const [glowOpacity, setGlowOpacity] = useState(0);

  const handleMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const rotateY = x * 20;
    const rotateX = -y * 12;
    setTransform(`perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1.05,1.05,1.05)`);
    setShadow(`${-x * 20}px ${y * 20}px 40px rgba(0,0,0,0.15)`);
    setGlowOpacity(0.4);
  }, []);

  const handleLeave = useCallback(() => {
    setTransform('perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)');
    setShadow('0px 8px 30px rgba(0,0,0,0.08)');
    setGlowOpacity(0);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.imageArea}
      style={{ background: `${family?.color || '#999'}10` }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className={styles.bottleGlow} style={{
        opacity: glowOpacity,
        background: `radial-gradient(circle, ${family?.color || '#B8956A'}30 0%, transparent 70%)`,
      }} />
      {fragrance.image ? (
        <img
          src={fragrance.image}
          alt={fragrance.name}
          className={styles.bottleImage}
          style={{
            transform: transform || 'perspective(800px) rotateY(0deg) rotateX(0deg)',
            filter: `drop-shadow(${shadow || '0px 8px 30px rgba(0,0,0,0.08)'})`,
            transition: 'transform 0.15s ease-out, filter 0.15s ease-out',
          }}
        />
      ) : (
        <span className={styles.familyIconLarge}>{family?.icon}</span>
      )}
    </div>
  );
}

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fragrance = SAMPLE_FRAGRANCES.find((f) => f.id === id);

  const currentSeasonId = getCurrentSeason();
  const [selectedOccasion, setSelectedOccasion] = useState('');

  const family = fragrance
    ? FRAGRANCE_FAMILIES.find((f) => f.id === fragrance.family)
    : null;

  const concentration = fragrance
    ? CONCENTRATIONS.find((c) => c.id === fragrance.concentration)
    : null;

  const sprayGuide = useMemo(() => {
    if (!fragrance || !selectedOccasion) return null;
    return getSprayGuideForFragrance(fragrance, currentSeasonId, selectedOccasion);
  }, [fragrance, selectedOccasion, currentSeasonId]);

  const currentSeason = SEASONS.find((s) => s.id === currentSeasonId);

  const relatedFragrances = useMemo(() => {
    if (!fragrance) return [];
    const sameFamily = SAMPLE_FRAGRANCES.filter(
      (f) => f.family === fragrance.family && f.id !== fragrance.id
    );
    if (sameFamily.length >= 3) return sameFamily.slice(0, 3);
    const others = SAMPLE_FRAGRANCES.filter(
      (f) => f.id !== fragrance.id && f.family !== fragrance.family
    );
    const combined = [...sameFamily];
    for (const o of others) {
      if (combined.length >= 3) break;
      combined.push(o);
    }
    return combined;
  }, [fragrance]);

  if (!fragrance) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h2 className={styles.notFoundTitle}>Fragrance not found</h2>
          <p className={styles.notFoundText}>
            The fragrance you are looking for does not exist in our collection.
          </p>
          <Link to="/explore" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const matchedSeasons = fragrance.seasons
    .map((sId) => SEASONS.find((s) => s.id === sId))
    .filter(Boolean);

  const matchedOccasions = fragrance.occasions
    .map((oId) => OCCASIONS.find((o) => o.id === oId))
    .filter(Boolean);

  const matchedTimes = fragrance.timeOfDay
    .map((tId) => TIME_OF_DAY.find((t) => t.id === tId))
    .filter(Boolean);

  const matchedMoods = fragrance.mood
    .map((mId) => MOODS.find((m) => m.id === mId))
    .filter(Boolean);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/explore" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Collection
        </Link>

        <div className={styles.layout}>
          {/* LEFT COLUMN */}
          <motion.div
            className={styles.leftCol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BottleViewer fragrance={fragrance} family={family} />

            <p className={styles.brand}>{fragrance.brand}</p>
            <h1 className={styles.fragranceName}>{fragrance.name}</h1>

            <div className={styles.metaRow}>
              {concentration && (
                <Badge variant="accent" size="md">
                  {concentration.label}
                </Badge>
              )}
            </div>

            <div className={styles.ratingRow}>
              <StarRating rating={fragrance.rating} size="md" showValue />
            </div>

            {fragrance.price > 0 && (
              <p className={styles.price}>{formatPrice(fragrance.price)}</p>
            )}

            {fragrance.buyingLink && (
              <a
                href={fragrance.buyingLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buyButton}
              >
                <ShoppingCart size={15} />
                Buy Now
                <ExternalLink size={13} />
              </a>
            )}

            {fragrance.size && (
              <Badge variant="default" size="sm">
                {fragrance.size}
              </Badge>
            )}
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            className={styles.rightCol}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Family */}
            <div className={styles.familyBadgeRow}>
              <Badge variant="family" color={family?.color} size="md">
                {family?.icon} {family?.label}
              </Badge>
              <span className={styles.familyDesc}>{family?.description}</span>
            </div>

            {/* Description & Wearer */}
            {(fragrance.description || fragrance.wearer) && (
              <div className={styles.section}>
                {fragrance.description && (
                  <p className={styles.descriptionText}>{fragrance.description}</p>
                )}
                {fragrance.wearer && (
                  <div className={styles.wearerBox}>
                    <span className={styles.wearerLabel}>Who wears this</span>
                    <p className={styles.wearerText}>{fragrance.wearer}</p>
                  </div>
                )}
              </div>
            )}

            {/* Characteristics */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Characteristics</h3>
              <div className={styles.characteristics}>
                <ProgressBar
                  value={(fragrance.longevity / 12) * 100}
                  label={`Longevity · ${fragrance.longevity}h`}
                  color="var(--accent)"
                  height="md"
                />
                <ProgressBar
                  value={getProjectionPercent(fragrance.projection)}
                  label={`Projection · ${fragrance.projection}`}
                  color={PROJECTION_COLORS[fragrance.projection] || 'var(--accent)'}
                  height="md"
                />
              </div>
            </div>

            {/* Notes Pyramid */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Notes Pyramid</h3>
              <NotesPyramid notes={fragrance.notes} size="md" />
            </div>

            {/* Best For */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Best For</h3>

              <h4 className={styles.tagGroupLabel}>Seasons</h4>
              <div className={styles.tagGroup}>
                {matchedSeasons.map((s) => (
                  <span key={s.id} className={styles.tag}>
                    {s.icon} {s.label}
                  </span>
                ))}
              </div>

              <h4 className={styles.tagGroupLabel}>Occasions</h4>
              <div className={styles.tagGroup}>
                {matchedOccasions.map((o) => (
                  <span key={o.id} className={styles.tag}>
                    {o.icon} {o.label}
                  </span>
                ))}
              </div>

              <h4 className={styles.tagGroupLabel}>Time of Day</h4>
              <div className={styles.tagGroup}>
                {matchedTimes.map((t) => (
                  <span key={t.id} className={styles.tag}>
                    {t.icon} {t.label}
                  </span>
                ))}
              </div>

              <h4 className={styles.tagGroupLabel}>Mood</h4>
              <div className={styles.tagGroup}>
                {matchedMoods.map((m) => (
                  <span key={m.id} className={styles.tag}>
                    {m.icon} {m.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Spray Guide */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Spray Guide</h3>

              <div className={styles.seasonBanner}>
                {currentSeason?.icon} Current Season: {currentSeason?.label} — {currentSeason?.description}
              </div>

              <div className={styles.sprayControls}>
                <label className={styles.selectLabel}>
                  Occasion
                  <select
                    className={styles.select}
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                  >
                    <option value="">Select an occasion...</option>
                    {fragrance.occasions.map((oId) => {
                      const occ = OCCASIONS.find((o) => o.id === oId);
                      return occ ? (
                        <option key={occ.id} value={occ.id}>
                          {occ.icon} {occ.label}
                        </option>
                      ) : null;
                    })}
                  </select>
                </label>
              </div>

              {sprayGuide && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SprayGuidePanel guide={sprayGuide} />
                </motion.div>
              )}
            </div>

            {/* Related Fragrances */}
            {relatedFragrances.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Related Fragrances</h3>
                <div className={styles.relatedGrid}>
                  {relatedFragrances.map((f) => (
                    <FragranceCard key={f.id} fragrance={f} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
