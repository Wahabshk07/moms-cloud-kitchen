import { AuthRequired } from '@/components/common';
import OrderConfirmationScreen from '@/features/customer/checkout/OrderConfirmationScreen';

export default function OrderConfirmationRoute() {
  return (
    <AuthRequired role="CUSTOMER">
      <OrderConfirmationScreen />
    </AuthRequired>
  );
}
