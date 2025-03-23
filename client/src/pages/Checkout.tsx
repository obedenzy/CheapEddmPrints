import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';

const Checkout = () => {
  const { cartItems } = useCart();
  const [, navigate] = useLocation();
  
  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems, navigate]);
  
  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <section>
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
          <p className="mt-2">Complete your order</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <CheckoutForm />
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
