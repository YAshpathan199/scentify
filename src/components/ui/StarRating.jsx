import React from 'react';
import { Star } from 'lucide-react';
import styles from './StarRating.module.css';

const sizeMap = {
  sm: 14,
  md: 18,
};

function StarRating({
  rating = 0,
  size = 'md',
  showValue = false,
}) {
  const iconSize = sizeMap[size] || 18;

  return (
    <div className={styles.container}>
      {[0, 1, 2, 3, 4].map((index) => {
        const isFilled = index < rating;
        return (
          <span
            key={index}
            className={`${styles.star} ${isFilled ? styles.filled : styles.empty}`}
          >
            <Star
              size={iconSize}
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
            />
          </span>
        );
      })}
      {showValue && <span className={styles.value}>{rating}</span>}
    </div>
  );
}

StarRating.displayName = 'StarRating';

export default StarRating;
