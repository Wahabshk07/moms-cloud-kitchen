import { Tabs } from 'expo-router';
import { ClipboardList, House, User, UtensilsCrossed } from 'lucide-react-native';
import type { ComponentProps } from 'react';

import { GlassTabBar } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

export default function CustomerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...(props as unknown as ComponentProps<typeof GlassTabBar>)} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.deepBlue,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontFamily: fontFamily.medium, fontSize: 11 },
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <House size={22} color={color} strokeWidth={1.8} /> }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <UtensilsCrossed size={22} color={color} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={1.8} /> }}
      />
    </Tabs>
  );
}
