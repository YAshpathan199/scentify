import React from 'react';

const variantClass = {
  default: 'bg-base-100 shadow-sm',
  elevated: 'bg-base-100 shadow-md',
  outlined: 'bg-transparent border border-base-300',
};

const paddingClass = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-10',
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
    'card rounded-xl transition-all duration-250',
    variantClass[variant] || '',
    paddingClass[padding] || '',
    hoverable ? 'hover:shadow-md hover:-translate-y-0.5' : '',
    onClick ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ');

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
