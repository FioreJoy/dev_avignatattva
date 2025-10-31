
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import type { Variation, TherapyService } from '../types';
import VariationSelector from '../components/VariationSelector';
import BookingForm from '../components/BookingForm';

const TherapyDetail: React.FC = () => {
  const location = useLocation();
  const service = location.state?.service as TherapyService | undefined;

  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(undefined);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    if (service?.variations?.length) {
      setSelectedVariation(service.variations[0]);
    }
  }, [service]);

  if (!service) {
    return <Navigate to="/store/therapies" replace />;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img src={service.imageUrl} alt={service.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary-teal-dark">{service.name}</h1>
            <p className="text-2xl font-semibold text-primary-teal mt-2">
              ₹{selectedVariation ? parseFloat(selectedVariation.price).toFixed(2) : service.startingPrice}
            </p>
            <p className="mt-4 text-gray-600 whitespace-pre-wrap">{service.description}</p>

            <div className="mt-6">
              {service.variations.length > 1 && (
                <VariationSelector
                  variations={service.variations}
                  selectedVariation={selectedVariation}
                  onSelect={setSelectedVariation}
                  title="Select Session"
                />
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setBookingModalOpen(true)}
                disabled={!selectedVariation}
                className="w-full py-3 px-6 bg-primary-teal text-white font-bold rounded-lg hover:bg-primary-teal-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Request Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4 relative max-h-[90vh] overflow-y-auto">
                 <button onClick={() => setBookingModalOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" aria-label="Close booking form">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
                 <BookingForm onSuccess={() => setBookingModalOpen(false)} />
            </div>
        </div>
      )}
    </>
  );
};

export default TherapyDetail;
