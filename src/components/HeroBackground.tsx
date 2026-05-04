import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

const shapes = [
  { size: 256, top: '8%',  left: '70%', color: 'border-brand-yellow/25', rotate: 45,  duration: 22 },
  { size: 128, top: '70%', left: '8%',  color: 'border-brand-yellow/15', rotate: -12, duration: 18 },
  { size: 96,  top: '20%', left: '15%', color: 'border-brand-blue/30',   rotate: 12,  duration: 14 },
  { size: 160, top: '55%', left: '60%', color: 'border-brand-blue/20',   rotate: 30,  duration: 26 },
  { size: 64,  top: '35%', left: '85%', color: 'border-brand-yellow/30', rotate: 0,   duration: 12 },
];

export default function HeroBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer A: drifting gradient mesh */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(circle at 20% 30%, rgba(255, 196, 36, 0.18), transparent 45%)',
            'radial-gradient(circle at 80% 70%, rgba(30, 91, 198, 0.20), transparent 50%)',
            'radial-gradient(circle at 60% 20%, rgba(255, 196, 36, 0.10), transparent 40%)',
          ].join(', '),
          backgroundSize: '180% 180%',
        }}
        animate={
          reduce
            ? undefined
            : { backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Layer B: floating geometric shapes */}
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute border ${s.color}`}
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            rotate: s.rotate,
          }}
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -24, 0, 18, 0],
                  rotate: [s.rotate, s.rotate + 12, s.rotate - 8, s.rotate],
                }
          }
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Layer C: fine grid texture */}
      <div className="absolute inset-0 hero-grid-overlay opacity-40" />

      {/* Top-to-bottom fade so content stays readable */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/40 via-transparent to-brand-navy/60" />
    </div>
  );
}
