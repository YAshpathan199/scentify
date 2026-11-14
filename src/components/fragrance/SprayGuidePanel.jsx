import { Droplets, Hand, Shirt, Lightbulb } from 'lucide-react';
import styles from './SprayGuidePanel.module.css';

const BODY_POINTS = {
  'behind-ears': [{ cx: 68, cy: 40 }, { cx: 132, cy: 40 }],
  neck: [{ cx: 100, cy: 73 }],
  collar: [{ cx: 100, cy: 88 }],
  chest: [{ cx: 100, cy: 130 }],
  'inner-elbows': [{ cx: 42, cy: 152 }, { cx: 158, cy: 152 }],
  wrists: [{ cx: 22, cy: 230 }, { cx: 178, cy: 230 }],
  scarf: [{ cx: 100, cy: 108 }],
  sleeves: [{ cx: 42, cy: 130 }],
};

const POINT_LABELS = {
  'behind-ears': 'Behind Ears',
  neck: 'Neck',
  collar: 'Collar',
  chest: 'Chest',
  'inner-elbows': 'Inner Elbows',
  wrists: 'Wrists',
  scarf: 'Scarf',
  sleeves: 'Sleeves',
};

function BodyMap({ activePoints = [] }) {
  const activeSet = new Set(activePoints);
  return (
    <svg
      viewBox="0 0 200 320"
      className={styles.bodyMap}
      aria-label="Body map showing spray application points"
    >
      <ellipse cx="100" cy="28" rx="20" ry="24" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <line x1="100" y1="52" x2="100" y2="66" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M70 66 Q70 60 60 80 L42 140 L42 200 L70 210 L100 215 L130 210 L158 200 L158 140 L140 80 Q130 60 130 66 Z"
        fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M60 80 Q40 100 30 150 L22 230" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M140 80 Q160 100 170 150 L178 230" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M70 210 L60 300" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      <path d="M130 210 L140 300" fill="none" stroke="var(--border-strong, var(--border))" strokeWidth="1.5" />
      {Object.entries(BODY_POINTS).map(([key, points]) =>
        points.map((pt, i) => {
          const isActive = activeSet.has(key);
          return (
            <g key={`${key}-${i}`}>
              {isActive && (
                <circle cx={pt.cx} cy={pt.cy} r="10" fill="var(--accent)" opacity="0.2" />
              )}
              <circle
                cx={pt.cx} cy={pt.cy} r="5"
                fill={isActive ? 'var(--accent)' : 'var(--text-muted)'}
                opacity={isActive ? 1 : 0.3}
              />
            </g>
          );
        })
      )}
    </svg>
  );
}

// guide = result of getSprayGuideForFragrance(...)
// compact = slightly tighter layout used on Results page
export default function SprayGuidePanel({ guide, compact = false }) {
  if (!guide) return null;
  return (
    <div className={`${styles.panel} ${compact ? styles.compact : ''}`}>
      <div className={styles.grid}>
        {/* Left: count + details */}
        <div className={styles.details}>
          <div className={styles.sprayCount}>
            <Droplets size={compact ? 18 : 20} className={styles.icon} />
            <span className={styles.sprayNum}>{guide.sprays[0]}–{guide.sprays[1]}</span>
            <span className={styles.sprayLabel}>sprays</span>
          </div>

          <div className={styles.row}>
            <Hand size={15} className={styles.rowIcon} />
            <span className={styles.rowLabel}>Apply on</span>
            <div className={styles.tags}>
              {guide.where.map((w) => (
                <span key={w} className={styles.tag}>{POINT_LABELS[w] || w}</span>
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <Shirt size={15} className={styles.rowIcon} />
            <span>
              {guide.skinOrClothes === 'skin'
                ? 'Skin only'
                : guide.skinOrClothes === 'clothes'
                ? 'Clothes only'
                : 'Skin & clothes'}
            </span>
          </div>

          <div className={styles.tip}>
            <Lightbulb size={14} className={styles.tipIcon} />
            <span>{guide.tip}</span>
          </div>
        </div>

        {/* Right: body map */}
        {!compact && (
          <div className={styles.bodyMapWrap}>
            <BodyMap activePoints={guide.where} />
          </div>
        )}
        {compact && (
          <div className={styles.bodyMapWrapCompact}>
            <BodyMap activePoints={guide.where} />
          </div>
        )}
      </div>
    </div>
  );
}

export { BodyMap, POINT_LABELS };
