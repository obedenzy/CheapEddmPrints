import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pricing';

const OrderSummary = () => {
  const { cartItems, getCartTotal } = useCart();
  
  // Calculate subtotal, shipping, and tax
  const subtotal = getCartTotal();
  const shipping = cartItems.length > 0 ? 25.00 : 0;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-start pb-4 border-b">
            <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-gray-100 mr-4 flex items-center justify-center">
              {item.frontImageUrl ? (
                <img 
                  src={item.frontImageUrl} 
                  alt={`${item.size} EDDM Postcard`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{item.size.replace('x', '" x ') + '"'} EDDM Postcard</h4>
              <p className="text-sm text-gray-600">Qty: {item.quantity.toLocaleString()}</p>
              <p className="text-sm text-gray-600">
                {item.printType === 'single' ? '4/0 Single Sided' : '4/4 Double Sided'}, 
                {item.finishType === 'gloss-both' ? ' Gloss' : 
                 item.finishType === 'matte-both' ? ' Matte' : 
                 item.finishType === 'uv-both' ? ' High Gloss UV' : 
                 ' High Gloss UV Front'}
              </p>
            </div>
            <div className="text-right ml-4">
              <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-3 pb-4 border-b">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>
      
      <div className="flex justify-between font-semibold text-lg pt-4">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
