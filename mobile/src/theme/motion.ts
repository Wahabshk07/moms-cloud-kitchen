/**
 * Motion tokens — springs, durations, and reduced-motion fallbacks.
 * Prefer these over ad-hoc animation numbers so the app feels consistent.
 */
export const motion = {
  /** Default press scale for interactive surfaces. */
  pressScale: 0.97,
  /** Stronger press for primary CTAs. */
  pressScaleStrong: 0.94,
  /** Soft entrance fade. */
  fadeIn: { duration: 420 },
  /** Stagger delay between list items (ms). */
  stagger: 55,
  springs: {
    snappy: { damping: 18, stiffness: 280, mass: 0.85 },
    soft: { damping: 22, stiffness: 160, mass: 1 },
    bouncy: { damping: 12, stiffness: 220, mass: 0.9 },
    float: { damping: 28, stiffness: 40, mass: 1.2 },
  },
  /** Floating orb loop duration (ms). */
  orbLoop: 6200,
  /** Parallax max translate (px). */
  parallax: 12,
} as const;
