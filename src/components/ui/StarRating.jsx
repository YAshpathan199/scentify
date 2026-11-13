import React from 'react';
import { Star } from 'lucide-react';

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
    <div className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((index) => {
        const isFilled = index < rating;
        return (
          <span
            key={index}
            className={isFilled ? 'text-primary' : 'text-base-300'}
          >
            <Star
              size={iconSize}
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
            />
          </span>
        );
      })}
      {showValue && <span className="ml-1 text-sm font-medium text-base-content/70">{rating}</span>}
    </div>
  );
}

StarRating.displayName = 'StarRating';

export default StarRating;
