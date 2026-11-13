import { AuthRequired } from '@/components/common';
import CheckoutScreen from '@/features/customer/checkout/CheckoutScreen';

export default function CheckoutRoute() {
  return (
    <AuthRequired role="CUSTOMER">
      <CheckoutScreen />
    </AuthRequired>
  );
}
