import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontFamily, gradients, layout, motion, radius, shadows, spacing } from '@/theme';
import { Text } from './Text';

/**
 * Expo Router SDK 58 tab-bar contract (not classic React Navigation):
 * `emitter` + `navigateToTab(route.key)` — there is no `navigation` prop.
 */
export interface GlassTabBarProps {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: object }>;
  };
  descriptors: Record<
    string,
    {
      options: {
        title?: string;
        tabBarLabel?:
          | string
          | ((props: {
              focused: boolean;
              color: string;
              position: string;
              children: string;
            }) => ReactNode);
        tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => ReactNode;
      };
    }
  >;
  emitter: {
    emit: (event: {
      type: string;
      target?: string;
      canPreventDefault?: boolean;
    }) => { defaultPrevented: boolean };
  };
  navigateToTab: (routeKey: string) => void;
  insets?: { top: number; right: number; bottom: number; left: number };
}

function TabItem({
  label,
  focused,
  onPress,
  onLongPress,
  icon,
}: {
  label: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  icon: ReactNode;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, motion.springs.snappy);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.springs.soft);
      }}
      style={styles.item}
    >
      <Animated.View style={[styles.itemInner, focused && styles.itemFocused, anim]}>
        {icon}
        <Text
          variant="caption"
          color={focused ? 'primary' : 'tertiary'}
          style={[styles.label, focused && styles.labelFocused]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/** Frosted floating tab bar — shared by customer + admin navigators. */
export function GlassTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets: navInsets,
}: GlassTabBarProps) {
  const safe = useSafeAreaInsets();
  const bottom = Math.max(navInsets?.bottom ?? safe.bottom, spacing.sm);

  return (
    <View style={[styles.wrap, { paddingBottom: bottom }, shadows.md]} pointerEvents="box-none">
      <View style={styles.shell}>
        <LinearGradient
          colors={[...gradients.tabBar]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassStrong }]} />
        ) : (
          <BlurView
            intensity={Platform.OS === 'ios' ? 55 : 36}
            tint="light"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : options.title ?? route.name;
            const focused = state.index === index;
            const color = focused ? colors.deepBlue : colors.textTertiary;
            const icon = options.tabBarIcon?.({ focused, color, size: 22 });

            return (
              <TabItem
                key={route.key}
                label={label}
                focused={focused}
                icon={icon}
                onPress={() => {
                  const event = emitter.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigateToTab(route.key);
                  }
                }}
                onLongPress={() => {
                  emitter.emit({ type: 'tabLongPress', target: route.key });
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 0,
  },
  shell: {
    minHeight: layout.tabBarHeight,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    minHeight: layout.tabBarHeight,
  },
  item: { flex: 1, alignItems: 'center' },
  itemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingTop: spacing.xs,
    paddingBottom: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    minWidth: 64,
    minHeight: 56,
  },
  itemFocused: {
    backgroundColor: colors.blueTint,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    lineHeight: 14,
    includeFontPadding: false,
  },
  labelFocused: {
    color: colors.deepBlue,
  },
});
