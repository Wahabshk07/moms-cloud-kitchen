import { AuthRequired } from '@/components/common';
import OrderDetailScreen from '@/features/customer/orders/OrderDetailScreen';

export default function OrderDetailRoute() {
  return (
    <AuthRequired role="CUSTOMER">
      <OrderDetailScreen />
    </AuthRequired>
  );
}
