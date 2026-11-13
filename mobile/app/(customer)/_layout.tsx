import { Stack } from 'expo-router';

import { RoleGuard } from '@/components/common';
import { colors } from '@/theme';

export default function CustomerLayout() {
  return (
    <RoleGuard role="CUSTOMER" allowGuest>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.white },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-confirmation" />
      </Stack>
    </RoleGuard>
  );
}
