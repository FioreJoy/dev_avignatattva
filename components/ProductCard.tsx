import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const location = useLocation();

  return (
    <Link 
      to={`/products/${product.id}`}
      state={{ product, from: location.pathname }}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-primary-teal transition-colors">{product.name}</h3>
        <p className="mt-2 text-lg font-semibold text-primary-teal">
          <span className="text-xs text-gray-500 font-normal">{product.variations.length > 1 ? 'From ' : ''}</span>
          ₹{product.startingPrice}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;