import type { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
} as const;

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyMedium'
  | 'caption'
  | 'label'
  | 'button'
  | 'price';

export const typography: Record<TextVariant, TextStyle> = {
  display: { fontFamily: fontFamily.bold, fontSize: 34, lineHeight: 40, letterSpacing: -0.8 },
  h1: { fontFamily: fontFamily.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.5 },
  h2: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  h3: { fontFamily: fontFamily.medium, fontSize: 17, lineHeight: 23, letterSpacing: -0.1 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  button: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 20, letterSpacing: 0.1 },
  price: { fontFamily: fontFamily.bold, fontSize: 16, lineHeight: 22, letterSpacing: -0.2 },
};
