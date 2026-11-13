/**
 * Metallic Blue × Silver design tokens.
 * White / soft silver remain dominant surfaces; blue carries brand + depth.
 * Glass values are translucent overlays — use selectively for hierarchy.
 */
export const colors = {
  // Surfaces
  white: '#FFFFFF',
  softWhite: '#F7F9FC',
  bgMuted: '#F7F9FC',
  bgAmbient: '#EEF3F8',

  // Typography
  black: '#171A21',
  textSecondary: '#687383',
  textTertiary: '#9AA3B0',

  // Metallic blue scale
  deepBlue: '#173B63',
  blue: '#285D8F',
  steelBlue: '#6386A8',
  lightBlue: '#A8C0D6',
  blueTint: '#E8F0F7',
  blueDark: '#173B63',

  // Silver scale
  silver: '#C4CCD5',
  brushedSilver: '#D8DEE6',
  lightSilver: '#E9EDF2',
  silverWhite: '#F4F6F9',

  // Borders / overlays
  border: '#E1E6EC',
  borderStrong: '#C9D2DC',
  overlay: 'rgba(23, 26, 33, 0.42)',

  // Glass (translucent surfaces)
  glass: 'rgba(255, 255, 255, 0.62)',
  glassStrong: 'rgba(255, 255, 255, 0.82)',
  glassSoft: 'rgba(255, 255, 255, 0.42)',
  glassBorder: 'rgba(255, 255, 255, 0.55)',
  glassBorderMuted: 'rgba(196, 204, 213, 0.55)',
  glassDark: 'rgba(23, 59, 99, 0.32)',
  glassTint: 'rgba(232, 240, 247, 0.72)',
  glassHighlight: 'rgba(255, 255, 255, 0.85)',

  // Ambient orbs / lighting (brand-derived only)
  orbBlue: 'rgba(40, 93, 143, 0.22)',
  orbSilver: 'rgba(196, 204, 213, 0.45)',
  orbDeep: 'rgba(23, 59, 99, 0.18)',
  sheen: 'rgba(244, 246, 249, 0.28)',

  // Pricing (restrained warm accent for price hierarchy)
  price: '#173B63',
  priceTint: '#E8F0F7',

  // Admin uses the same metallic system
  admin: '#285D8F',
  adminTint: '#E8F0F7',
  adminSoft: '#D8DEE6',

  // Functional
  danger: '#C62828',
  dangerTint: '#FDECEC',
  success: '#2E7D4F',
  successTint: '#E8F5EE',
} as const;

/** Brand gradients — always derived from the metallic blue × silver scale. */
export const gradients = {
  hero: [colors.deepBlue, colors.blue, colors.steelBlue] as const,
  heroSoft: [colors.blue, colors.steelBlue, colors.lightBlue] as const,
  ambient: [colors.softWhite, colors.blueTint, colors.silverWhite] as const,
  ambientDeep: [colors.blueTint, colors.softWhite, colors.brushedSilver] as const,
  sheen: ['rgba(244,246,249,0.28)', 'rgba(244,246,249,0.06)', 'transparent'] as const,
  silverEdge: [colors.silverWhite, colors.lightSilver, colors.brushedSilver] as const,
  tabBar: ['rgba(255,255,255,0.92)', 'rgba(247,249,252,0.88)'] as const,
  glassPanel: ['rgba(255,255,255,0.72)', 'rgba(232,240,247,0.55)'] as const,
} as const;

export type ColorName = keyof typeof colors;
