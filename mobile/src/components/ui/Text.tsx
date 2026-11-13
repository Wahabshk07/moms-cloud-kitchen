import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { colors, typography, type TextVariant } from '@/theme';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'blue'
  | 'white'
  | 'danger'
  | 'silver'
  | 'price'
  | 'admin';

const colorMap: Record<TextColor, string> = {
  primary: colors.black,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
  blue: colors.blue,
  white: colors.white,
  danger: colors.danger,
  silver: colors.silver,
  price: colors.price,
  admin: colors.admin,
};

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextStyle['textAlign'];
}

export function Text({ variant = 'body', color = 'primary', align, style, ...rest }: TextProps) {
  return <RNText {...rest} style={[typography[variant], { color: colorMap[color], textAlign: align }, style]} />;
}
