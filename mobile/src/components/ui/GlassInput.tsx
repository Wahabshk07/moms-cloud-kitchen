import { forwardRef } from 'react';
import type { TextInput } from 'react-native';

import { Input, type InputProps } from './Input';

/** Alias — same reliable field as Input (kept for redesign API). */
export type GlassInputProps = InputProps;

export const GlassInput = forwardRef<TextInput, GlassInputProps>(function GlassInput(props, ref) {
  return <Input ref={ref} {...props} />;
});
