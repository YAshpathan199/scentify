import React from 'react';

const heightClass = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

function ProgressBar({
  value = 0,
  label,
  color,
  height = 'md',
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-base-content/70">{label}</span>
          <span className="text-sm font-medium text-base-content/80">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-base-300/50 overflow-hidden ${heightClass[height] || heightClass.md}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: color || 'oklch(var(--p))',
          }}
        />
      </div>
    </div>
  );
}

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
