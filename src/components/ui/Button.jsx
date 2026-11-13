import React from 'react';

const variantClass = {
  primary: 'btn-primary shadow-md hover:shadow-lg',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn-outline border-base-300',
};

const sizeClass = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

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
    'btn rounded-full font-medium',
    variantClass[variant] || '',
    sizeClass[size] || '',
    fullWidth ? 'btn-block' : '',
    iconPosition === 'right' ? 'flex-row-reverse' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
}

Button.displayName = 'Button';

export default Button;
