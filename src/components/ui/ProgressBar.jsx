import React from 'react';
import styles from './ProgressBar.module.css';

function ProgressBar({
  value = 0,
  label,
  color,
  height = 'md',
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const fillColor = color || 'var(--accent)';

  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelRow}>
          <span className={styles.label}>{label}</span>
          <span className={styles.valueText}>{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={`${styles.track} ${styles[height]}`}>
        <div
          className={styles.fill}
          style={{
            width: `${clampedValue}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>
    </div>
  );
}

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
