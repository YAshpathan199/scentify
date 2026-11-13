import React from 'react';

const variantClass = {
  default: 'badge-secondary',
  accent: 'badge-primary badge-outline',
};

const sizeClass = {
  sm: 'badge-sm text-[0.75rem]',
  md: 'badge-md',
};

function Badge({
  children,
  variant = 'default',
  color,
  size = 'md',
  className = '',
}) {
  const classes = [
    'badge font-medium',
    variant !== 'family' ? (variantClass[variant] || '') : '',
    sizeClass[size] || '',
    className,
  ].filter(Boolean).join(' ');

  const inlineStyle =
    variant === 'family' && color
      ? { backgroundColor: `${color}15`, color, borderColor: `${color}30` }
      : undefined;

  return (
    <span className={classes} style={inlineStyle}>
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';

export default Badge;
