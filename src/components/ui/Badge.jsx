import React from 'react';
import styles from './Badge.module.css';

function Badge({
  children,
  variant = 'default',
  color,
  size = 'md',
  className = '',
}) {
  const classes = [
    styles.badge,
    variant !== 'family' ? styles[variant] : '',
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inlineStyle =
    variant === 'family' && color
      ? { backgroundColor: `${color}15`, color: color }
      : undefined;

  return (
    <span className={classes} style={inlineStyle}>
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';

export default Badge;
