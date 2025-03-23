import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pricing';
import { Button } from '@/components/ui/button';

const CartSidebar = () => {
  const { cartItems, removeFromCart, isCartOpen, toggleCart, getCartTotal } = useCart();
  const [, navigate] = useLocation();

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button 
            onClick={toggleCart}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close cart"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto h-[calc(100%-200px)]">
        {/* Empty cart message */}
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
            <p className="text-gray-500">Your cart is empty</p>
            <Link href="/shop" onClick={toggleCart} className="mt-4 inline-block text-primary hover:underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start border-b pb-4">
                <div className="flex-1">
                  <h4 className="font-medium">{item.size} EDDM Postcard</h4>
                  <p className="text-sm text-gray-600">Qty: {item.quantity.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {item.printType === 'single' ? '4/0 Single Sided' : '4/4 Double Sided'}, 
                    {item.finishType === 'gloss-both' ? ' Gloss' : 
                     item.finishType === 'matte-both' ? ' Matte' : 
                     item.finishType === 'uv-both' ? ' High Gloss UV' : 
                     ' High Gloss UV Front'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 border-t p-4 bg-white">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Subtotal</span>
          <span className="font-medium">{formatCurrency(getCartTotal())}</span>
        </div>
        <Button
          onClick={() => {
            if (cartItems.length > 0) {
              navigate('/checkout');
              toggleCart();
            }
          }}
          disabled={cartItems.length === 0}
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded font-medium"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartSidebar;
