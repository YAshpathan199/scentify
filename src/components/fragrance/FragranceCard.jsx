import { Link } from 'react-router-dom';
import { Star, Clock, Wind } from 'lucide-react';
import { Badge } from '../ui';
import { FRAGRANCE_FAMILIES } from '../../data/constants';
import { formatPrice } from '../../utils/helpers';
import { use3DTilt } from '../../hooks/use3DTilt';
import styles from './FragranceCard.module.css';

export default function FragranceCard({ fragrance, matchPercent }) {
  const family = FRAGRANCE_FAMILIES.find(f => f.id === fragrance.family);
  const { ref, style: tiltStyle, glareStyle, handlers } = use3DTilt({
    max: 12, scale: 1.03, speed: 400, glare: true,
  });

  return (
    <Link to={`/fragrance/${fragrance.id}`} className={styles.card}>
      <div
        ref={ref}
        className={styles.tiltWrap}
        style={tiltStyle}
        {...handlers}
      >
        <div className={styles.imageArea} style={{ borderColor: family?.color || 'var(--border)' }}>
          {fragrance.image ? (
            <div className={styles.imageWrap} style={{ background: `${family?.color}10` }}>
              <img src={fragrance.image} alt={fragrance.name} className={styles.bottleImg} />
            </div>
          ) : (
            <div className={styles.placeholder} style={{ background: `${family?.color}15` }}>
              <span className={styles.familyIcon}>{family?.icon}</span>
            </div>
          )}
          {matchPercent !== undefined && (
            <div className={styles.matchBadge}>{matchPercent}% match</div>
          )}
          <div className={styles.glare} style={glareStyle} />
        </div>

        <div className={styles.info}>
          <p className={styles.brand}>{fragrance.brand}</p>
          <h3 className={styles.name}>{fragrance.name}</h3>

          <div className={styles.meta}>
            <Badge variant="family" color={family?.color} size="sm">
              {family?.label}
            </Badge>
            <span className={styles.concentration}>{fragrance.concentration}</span>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <Star size={13} fill="var(--accent)" color="var(--accent)" />
              <span>{fragrance.rating}</span>
            </div>
            <div className={styles.stat}>
              <Clock size={13} />
              <span>{fragrance.longevity}h</span>
            </div>
            <div className={styles.stat}>
              <Wind size={13} />
              <span>{fragrance.projection}</span>
            </div>
          </div>

          {fragrance.price > 0 && (
            <p className={styles.price}>{formatPrice(fragrance.price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
