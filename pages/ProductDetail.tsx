
import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useCart } from '../App';
import type { Variation, Product } from '../types';
import { CartItemType } from '../types';
import VariationSelector from '../components/VariationSelector';

const ProductDetail: React.FC = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  
  const product = location.state?.product as Product | undefined;

  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    if (product?.variations?.length) {
      setSelectedVariation(product.variations[0]);
    }
  }, [product]);

  if (!product) {
    // If no product data is passed, redirect to the store
    return <Navigate to="/store" replace />;
  }
  
  const handleAddToCart = () => {
      if (selectedVariation) {
          addToCart(product, selectedVariation, CartItemType.Product, quantity);
          setShowAddedMessage(true);
          setTimeout(() => setShowAddedMessage(false), 2000);
      }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary-teal-dark">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary-teal mt-2">
            ₹{selectedVariation ? parseFloat(selectedVariation.price).toFixed(2) : product.startingPrice}
          </p>
          <p className="mt-4 text-gray-600 whitespace-pre-wrap">{product.description}</p>
          
          <div className="mt-6">
            {product.variations.length > 1 && (
              <VariationSelector 
                variations={product.variations}
                selectedVariation={selectedVariation}
                onSelect={setSelectedVariation}
              />
            )}
          </div>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2">-</button>
                <span className="px-4 py-2 border-l border-r">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2">+</button>
            </div>
            <button 
                onClick={handleAddToCart}
                disabled={!selectedVariation}
                className="flex-grow py-3 px-6 bg-accent-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
          {showAddedMessage && (
            <div className="mt-4 text-green-600 font-semibold transition-opacity duration-300">
              Added to cart!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
