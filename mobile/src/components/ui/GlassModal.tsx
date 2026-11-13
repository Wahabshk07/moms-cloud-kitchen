import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, shadows, spacing } from '@/theme';
import { Text } from './Text';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Centered frosted dialog — keep for confirmations / short forms. */
export function GlassModal({ visible, onClose, title, children, style }: GlassModalProps) {
  const reduced = useReducedMotion();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss">
          {Platform.OS === 'web' ? (
            <View style={[StyleSheet.absoluteFill, styles.dim]} />
          ) : (
            <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
          )}
        </Pressable>
        <Animated.View
          entering={reduced ? undefined : FadeIn.duration(220)}
          exiting={reduced ? undefined : FadeOut.duration(160)}
          style={[styles.panel, shadows.lg, style]}
        >
          {title ? (
            <Text variant="h2" style={styles.title}>
              {title}
            </Text>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

interface GlassBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Frosted bottom sheet — simple modal-based sheet (no extra deps). */
export function GlassBottomSheet({ visible, onClose, title, children, style }: GlassBottomSheetProps) {
  const reduced = useReducedMotion();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.sheetRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss">
          <View style={[StyleSheet.absoluteFill, styles.dim]} />
        </Pressable>
        <Animated.View
          entering={reduced ? undefined : SlideInDown.springify().damping(20)}
          exiting={reduced ? undefined : SlideOutDown.duration(200)}
          style={[styles.sheet, shadows.lg, style]}
        >
          <View style={styles.handle} />
          {title ? (
            <Text variant="h2" style={styles.title}>
              {title}
            </Text>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  dim: { backgroundColor: colors.overlay },
  panel: {
    borderRadius: radius.xl,
    backgroundColor: colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.glassBorder,
    padding: spacing.xl,
    gap: spacing.md,
    overflow: 'hidden',
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.silver,
    marginBottom: spacing.sm,
  },
  title: { marginBottom: spacing.xs },
});
