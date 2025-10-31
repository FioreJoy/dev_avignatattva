
import React from 'react';
import type { Variation } from '../types';

interface VariationSelectorProps {
  variations: Variation[];
  selectedVariation?: Variation;
  onSelect: (variation: Variation) => void;
  title?: string;
}

const VariationSelector: React.FC<VariationSelectorProps> = ({ variations, selectedVariation, onSelect, title = "Select Option" }) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {variations.map(variation => {
          const isSelected = selectedVariation?.name === variation.name;
          return (
            <button
              key={variation.name}
              onClick={() => onSelect(variation)}
              className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                isSelected 
                  ? 'bg-primary-teal text-white border-primary-teal' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {variation.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariationSelector;
