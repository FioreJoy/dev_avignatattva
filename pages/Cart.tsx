
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../App';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, totalQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-serif font-bold text-primary-teal-dark mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/store" className="px-6 py-3 bg-primary-teal hover:bg-primary-teal-dark text-white font-bold rounded-full transition-colors duration-300">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-primary-teal-dark mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.cartItemId} className="flex items-center bg-white p-4 rounded-lg shadow-md">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-grow ml-4">
                <h2 className="font-bold text-lg">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.selectedVariation.name}</p>
                <p className="text-md font-semibold text-primary-teal mt-1">₹{parseFloat(item.selectedVariation.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center">
                <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-2 py-1 border rounded-l-md">-</button>
                <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-2 py-1 border rounded-r-md">+</button>
              </div>
              <button onClick={() => removeFromCart(item.cartItemId)} className="ml-6 text-gray-500 hover:text-red-600" aria-label={`Remove ${item.name} from cart`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-2xl font-serif font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
              <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
            </div>
             <div className="flex justify-between mb-4">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">FREE</span>
            </div>
            <hr className="my-4"/>
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button className="mt-6 w-full py-3 bg-accent-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
