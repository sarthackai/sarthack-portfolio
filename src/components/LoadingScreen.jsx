import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Status messages keyed to percentage thresholds ─── */
const STATUS_STAGES = [
  { threshold: 0,  text: 'INITIALIZING SYSTEM...' },
  { threshold: 15, text: 'LOADING NEURAL MODULES...' },
  { threshold: 35, text: 'LOADING PROJECTS...' },
  { threshold: 55, text: 'CONFIGURING AI ENGINE...' },
  { threshold: 75, text: 'LOADING INTERFACE...' },
  { threshold: 90, text: 'FINALIZING...' },
  { threshold: 100, text: 'SYSTEM READY' },
];

function getStatus(pct) {
  for (let i = STATUS_STAGES.length - 1; i >= 0; i--) {
    if (pct >= STATUS_STAGES[i].threshold) return STATUS_STAGES[i].text;
  }
  return STATUS_STAGES[0].text;
}

/* ─── SVG Neural Network Background ─── */
function NeuralBg() {
  const nodes = [
    { cx: 10, cy: 20 }, { cx: 25, cy: 45 }, { cx: 15, cy: 75 },
    { cx: 40, cy: 15 }, { cx: 50, cy: 50 }, { cx: 45, cy: 85 },
    { cx: 70, cy: 25 }, { cx: 75, cy: 55 }, { cx: 65, cy: 80 },
    { cx: 88, cy: 18 }, { cx: 90, cy: 50 }, { cx: 85, cy: 78 },
  ];

  const edges = [
    [0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5],
    [3,6],[3,7],[4,6],[4,7],[4,8],[5,7],[5,8],
    [6,9],[6,10],[7,9],[7,10],[7,11],[8,10],[8,11],
  ];

  return (
    <svg
      className="loading-screen__neural-bg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={`e${i}`}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          className="loading-screen__neural-edge"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={`n${i}`}
          cx={n.cx} cy={n.cy} r="0.8"
          className="loading-screen__neural-node"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── SD Brand Mark (from favicon) ─── */
function BrandMark() {
  return (
    <div className="loading-screen__brand" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="loading-screen__brand-svg">
        <defs>
          <linearGradient id="loader-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="20" fill="var(--loader-brand-bg, #0a0a1a)" />
        <text
          x="50" y="68"
          textAnchor="middle"
          fontFamily="'Space Grotesk', Arial, sans-serif"
          fontWeight="bold"
          fontSize="52"
          fill="url(#loader-brand-grad)"
        >
          SD
        </text>
      </svg>
    </div>
  );
}

/* ─── Main Loading Screen ─── */
export default function LoadingScreen({ onComplete }) {
  const [percentage, setPercentage] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const readyRef = useRef(false);

  const MIN_DURATION = 1800;
  const MAX_DURATION = 2800;

  // Track external readiness (fonts + basic document ready)
  useEffect(() => {
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) readyRef.current = true;
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(markReady);
    } else {
      setTimeout(markReady, 800);
    }

    return () => { cancelled = true; };
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Animate percentage 0→100
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? MIN_DURATION * 0.6 : MAX_DURATION;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      let progress = Math.min(elapsed / duration, 1);

      // Easing: ease-out cubic
      progress = 1 - Math.pow(1 - progress, 3);

      // If assets aren't ready and we're past 85%, slow down
      if (!readyRef.current && progress > 0.85) {
        progress = 0.85 + (progress - 0.85) * 0.3;
      }

      const pct = Math.min(Math.round(progress * 100), 100);
      setPercentage(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setShowReady(true);
        setTimeout(() => {
          setVisible(false);
        }, 700);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleExitComplete = useCallback(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, y: -20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading portfolio"
        >
          <NeuralBg />

          <div className="loading-screen__orb loading-screen__orb--purple" aria-hidden="true" />
          <div className="loading-screen__orb loading-screen__orb--blue" aria-hidden="true" />

          <div className="loading-screen__content">
            <BrandMark />

            <div className="loading-screen__percentage">
              <span className="loading-screen__pct-number">{percentage}</span>
              <span className="loading-screen__pct-symbol">%</span>
            </div>

            <div className="loading-screen__progress-track">
              <div
                className="loading-screen__progress-fill"
                style={{ transform: `scaleX(${percentage / 100})` }}
              />
              <div
                className="loading-screen__progress-glow"
                style={{ transform: `scaleX(${percentage / 100})` }}
              />
            </div>

            <div className="loading-screen__status" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={getStatus(percentage)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`loading-screen__status-text${showReady ? ' loading-screen__status-text--ready' : ''}`}
                >
                  {getStatus(percentage)}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="loading-screen__bottom-line" aria-hidden="true">
            <span>SARTHACK DAS</span>
            <span className="loading-screen__bottom-dot">·</span>
            <span>AI/ML PORTFOLIO</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
