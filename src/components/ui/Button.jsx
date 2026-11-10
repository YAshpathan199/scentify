import React from 'react';
import styles from './Button.module.css';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    iconPosition === 'right' ? styles.iconRight : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {Icon && (
        <span className={styles.icon}>
          <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        </span>
      )}
      {children}
    </button>
  );
}

Button.displayName = 'Button';

export default Button;
