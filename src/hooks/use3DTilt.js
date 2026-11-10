import { useRef, useState, useCallback } from 'react';

export function use3DTilt({ max = 15, scale = 1.02, speed = 400, glare = true } = {}) {
  const ref = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
    transition: `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`,
  });
  const [glareStyle, setGlareStyle] = useState({
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    background: 'transparent',
    opacity: 0,
    transition: `opacity ${speed}ms ease`,
  });

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (max * (0.5 - y)).toFixed(2);
    const rotateY = (max * (x - 0.5)).toFixed(2);

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`,
      transition: `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`,
    });

    if (glare) {
      const angle = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 180;
      setGlareStyle(prev => ({
        ...prev,
        background: `linear-gradient(${angle}deg, rgba(255,255,255,0.25) 0%, transparent 80%)`,
        opacity: 0.7,
      }));
    }
  }, [max, scale, speed, glare]);

  const handleLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`,
    });
    if (glare) {
      setGlareStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [speed, glare]);

  return { ref, style, glareStyle, handlers: { onMouseMove: handleMove, onMouseLeave: handleLeave } };
}
