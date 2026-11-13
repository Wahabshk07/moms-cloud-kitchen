import type { ViewStyle } from 'react-native';

import { colors } from './colors';

/** Soft elevation — metallic depth without neon glow. */
export const shadows: Record<'none' | 'sm' | 'md' | 'lg' | 'glass' | 'hero' | 'float', ViewStyle> = {
  none: {},
  sm: {
    shadowColor: colors.deepBlue,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  md: {
    shadowColor: colors.deepBlue,
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  lg: {
    shadowColor: colors.deepBlue,
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  glass: {
    shadowColor: colors.deepBlue,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  hero: {
    shadowColor: colors.deepBlue,
    shadowOpacity: 0.24,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  float: {
    shadowColor: colors.deepBlue,
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
};
