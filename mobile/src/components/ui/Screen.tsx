import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/theme';
import { GradientBackground } from './GradientBackground';

/**
 * Safe-area presets:
 * - `tabs`  — top notch only; bottom tab bar already clears the home indicator
 * - `stack` — top notch + bottom home indicator (cart, checkout, auth, categories…)
 */
export type ScreenSafeArea = 'tabs' | 'stack';

const EDGE_PRESETS: Record<ScreenSafeArea, readonly Edge[]> = {
  tabs: ['top', 'left', 'right'],
  stack: ['top', 'right', 'bottom', 'left'],
};

interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a ScrollView. */
  scroll?: boolean;
  /** Horizontal screen padding. */
  padded?: boolean;
  /**
   * Layout context for system insets.
   * Prefer this over raw `edges` unless you need a custom set.
   */
  safeArea?: ScreenSafeArea;
  /** Override safe-area edges (advanced). */
  edges?: Edge[];
  /** Enables KeyboardAvoidingView (use on forms). */
  keyboard?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Fixed content pinned to the bottom (e.g. primary CTA). */
  footer?: ReactNode;
  header?: ReactNode;
  muted?: boolean;
  /** Soft ambient gradient + optional orbs behind content. */
  ambient?: boolean;
  /** Floating decorative orbs (auth / hero moments only). */
  orbs?: boolean;
  /** Let a parent GradientBackground show through (e.g. auth shell). */
  transparent?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  safeArea = 'stack',
  edges,
  keyboard = false,
  refreshing,
  onRefresh,
  footer,
  header,
  muted = false,
  ambient = true,
  orbs = false,
  transparent = false,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const resolvedEdges = edges ?? EDGE_PRESETS[safeArea];
  const padding = padded ? { paddingHorizontal: layout.screenPadding } : null;

  const footerOwnsBottom = Boolean(footer) && resolvedEdges.includes('bottom');
  const safeEdges = footerOwnsBottom
    ? (resolvedEdges.filter((e) => e !== 'bottom') as Edge[])
    : [...resolvedEdges];

  const tabClearance = safeArea === 'tabs' ? layout.tabBarHeight + spacing.xxl : 0;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.scrollContent,
        padding,
        contentStyle,
        footer ? { paddingBottom: spacing.xl } : { paddingBottom: spacing.xxxl + tabClearance },
        tabClearance && !footer ? { paddingBottom: spacing.xxxl + tabClearance } : null,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      // on-drag + Android adjustResize = keyboard opens then instantly closes
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
      nestedScrollEnabled
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.blue}
            colors={[colors.blue]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padding, contentStyle, tabClearance ? { paddingBottom: tabClearance } : null]}>
      {children}
    </View>
  );

  const inner = (
    <>
      {header}
      {body}
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: footerOwnsBottom ? Math.max(insets.bottom, spacing.md) : spacing.md,
            },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </>
  );

  // KeyboardAvoidingView on Android fights windowSoftInputMode and can bounce the keyboard.
  const useKAV = keyboard && Platform.OS === 'ios';

  const frame = (
    <SafeAreaView
      edges={safeEdges}
      style={[
        styles.flex,
        {
          backgroundColor:
            ambient || transparent
              ? 'transparent'
              : muted
                ? colors.bgMuted
                : colors.white,
        },
      ]}
    >
      {useKAV ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior="padding"
          keyboardVerticalOffset={insets.top}
        >
          {inner}
        </KeyboardAvoidingView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );

  if (ambient) {
    return (
      <GradientBackground variant={muted ? 'ambientDeep' : 'ambient'} orbs={orbs} style={styles.flex}>
        {frame}
      </GradientBackground>
    );
  }

  return frame;
}

/** @deprecated Prefer `safeArea="tabs"` on Screen. */
export const TAB_EDGES: Edge[] = [...EDGE_PRESETS.tabs];

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingTop: spacing.sm, flexGrow: 1 },
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    backgroundColor: colors.glassStrong,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.glassBorderMuted,
  },
});
