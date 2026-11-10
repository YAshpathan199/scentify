import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 35;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function ParticleField({ color = 'rgba(184,149,106,0.4)', className = '' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    function initParticles() {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: random(0, w),
        y: random(0, h),
        r: random(1.5, 4),
        vx: random(-0.3, 0.3),
        vy: random(-0.5, -0.1),
        alpha: random(0.2, 0.7),
        pulse: random(0, Math.PI * 2),
        pulseSpeed: random(0.01, 0.03),
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.8;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        if (p.y < -10) { p.y = h + 10; p.x = random(0, w); }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        const r = p.r * (0.8 + 0.2 * Math.sin(p.pulse * 1.5));

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${a.toFixed(2)})`);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${(a * 0.15).toFixed(3)})`);
        ctx.fill();
      });

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const lineAlpha = (1 - dist / 100) * 0.12;
            ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${lineAlpha.toFixed(3)})`);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    function handleMouse(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    resize();
    initParticles();
    draw();

    window.addEventListener('resize', () => { resize(); initParticles(); });
    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'auto',
        zIndex: 1,
      }}
    />
  );
}
