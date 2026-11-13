import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/theme';
import { IconButton } from './IconButton';
import { Text } from './Text';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  /** Show a back button (uses router.back). */
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  /** Editorial, large left-aligned title. */
  large?: boolean;
  /** Add the device's top safe-area inset (for navigator-level headers). */
  safeTop?: boolean;
  bordered?: boolean;
  /** Frosted translucent header (default on). */
  glass?: boolean;
}

export function Header({
  title,
  subtitle,
  back,
  onBack,
  right,
  large,
  safeTop,
  bordered,
  glass = true,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const content = (
    <View
      style={[
        styles.container,
        { paddingTop: (safeTop ? insets.top : 0) + spacing.sm },
        bordered && styles.bordered,
        !glass && styles.solid,
      ]}
    >
      <View style={styles.row}>
        {back ? (
          <IconButton
            icon={ChevronLeft}
            variant="outline"
            size={40}
            accessibilityLabel="Go back"
            onPress={handleBack}
            style={{ marginRight: spacing.md }}
          />
        ) : null}
        <View style={styles.titles}>
          {subtitle ? (
            <Text variant="label" color="blue" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          {title ? (
            <Text variant={large ? 'h1' : 'h3'} numberOfLines={large ? 2 : 1}>
              {title}
            </Text>
          ) : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );

  if (!glass || Platform.OS === 'web') return content;

  return (
    <View style={styles.glassWrap}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 28}
        tint="light"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  glassWrap: {
    overflow: 'hidden',
    backgroundColor: colors.glass,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.glassBorderMuted,
  },
  container: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
    backgroundColor: 'transparent',
  },
  solid: { backgroundColor: colors.white },
  bordered: { borderBottomWidth: 1, borderBottomColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  titles: { flex: 1, gap: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginLeft: spacing.md },
});
