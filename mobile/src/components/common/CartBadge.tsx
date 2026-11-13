import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';

import { IconButton } from '@/components/ui';
import { selectCartCount, useCartStore } from '@/store/cartStore';

/** Cart shortcut icon with live item-count badge. */
export function CartBadge() {
  const router = useRouter();
  const count = useCartStore(selectCartCount);

  return (
    <IconButton
      icon={ShoppingBag}
      variant="filled"
      badge={count}
      accessibilityLabel={count > 0 ? `Cart, ${count} items` : 'Cart'}
      onPress={() => router.push('/(customer)/cart')}
    />
  );
}
