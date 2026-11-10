import React from 'react';
import styles from './Card.module.css';

const paddingMap = {
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    styles.card,
    styles[variant],
    paddingMap[padding],
    hoverable ? styles.hoverable : '',
    onClick ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </div>
  );
}

Card.displayName = 'Card';

export default Card;
