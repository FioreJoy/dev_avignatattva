import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { TherapyService } from '../types';

interface TherapyCardProps {
  service: TherapyService;
}

const TherapyCard: React.FC<TherapyCardProps> = ({ service }) => {
    const location = useLocation();

  return (
     <Link 
      to={`/therapies/${service.id}`}
      state={{ service, from: location.pathname }}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-primary-teal transition-colors">{service.name}</h3>
        <p className="mt-2 text-lg font-semibold text-primary-teal">
          <span className="text-xs text-gray-500 font-normal">{service.variations.length > 1 ? 'From ' : ''}</span>
          ₹{service.startingPrice}
        </p>
      </div>
    </Link>
  );
};

export default TherapyCard;