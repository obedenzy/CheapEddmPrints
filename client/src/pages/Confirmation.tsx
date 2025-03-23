import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/pricing';

const Confirmation = () => {
  const [, navigate] = useLocation();
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: 'EDDM-58974',
    email: 'customer@example.com',
    subtotal: 1100.00,
    shipping: 25.00,
    tax: 88.00,
    total: 1213.00,
    shippingInfo: {
      name: 'John Smith',
      address: '123 Main Street',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'United States'
    },
    deliveryDate: 'Jun 15, 2023 - Jun 20, 2023'
  });
  
  // Redirect if arriving here directly without order
  useEffect(() => {
    // Check if there was a completed order
    const hasCompletedOrder = localStorage.getItem('orderCompleted');
    
    if (!hasCompletedOrder) {
      navigate('/shop');
    }
  }, [navigate]);
  
  // Clear the completed order flag on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('orderCompleted');
    };
  }, []);
  
  return (
    <section>
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Order Confirmation</h1>
          <p className="mt-2">Thank you for your order!</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-light/10 text-accent mb-4">
              <i className="fas fa-check-circle text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Order Has Been Placed!</h2>
            <p className="text-gray-600 mb-6">Order #{orderDetails.orderNumber}</p>
            <p className="text-gray-600 mb-8">We've sent a confirmation email to <strong>{orderDetails.email}</strong> with your order details.</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-4 text-left">Order Summary</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">6.5" x 9" EDDM Postcards (2,000)</span>
                  <span>{formatCurrency(orderDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{formatCurrency(orderDetails.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(orderDetails.tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(orderDetails.total)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Shipping Information</h3>
              <p className="text-gray-600">{orderDetails.shippingInfo.name}</p>
              <p className="text-gray-600">{orderDetails.shippingInfo.address}</p>
              <p className="text-gray-600">{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.zip}</p>
              <p className="text-gray-600">{orderDetails.shippingInfo.country}</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">Expected delivery: <strong>{orderDetails.deliveryDate}</strong></p>
              <div className="flex justify-center space-x-4">
                <Link href="/profile">
                  <Button variant="link" className="text-primary hover:text-primary-dark font-medium">
                    View Order History
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="link" className="text-primary hover:text-primary-dark font-medium">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;
