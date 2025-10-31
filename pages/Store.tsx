import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Product, TherapyService } from '../types';
import Loader from '../components/Loader';
import GenericError from '../components/GenericError';
import ProductCard from '../components/ProductCard';
import TherapyCard from '../components/TherapyCard';
import RevolvingCarousel from '../components/RevolvingCarousel';

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [therapies, setTherapies] = useState<TherapyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, therapiesData] = await Promise.all([
        api.getProducts(query),
        api.getTherapies(query)
      ]);
      setProducts(productsData);
      setTherapies(therapiesData);
    } catch (err) {
      setError("Failed to load store items. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData(searchQuery);
    }, 500); // Debounce search
    return () => clearTimeout(handler);
  }, [searchQuery, fetchData]);
  
  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <GenericError message={error} onRetry={() => fetchData(searchQuery)} />;
    
    const hasResults = products.length > 0 || therapies.length > 0;

    if (!hasResults && searchQuery) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl text-gray-700">No results found for "{searchQuery}".</h3>
          <p className="text-gray-500 mt-2">Try a different search term or clear the search.</p>
        </div>
      );
    }
    
    // If there's a search query, show a simple grid. Otherwise, show carousels.
    if (searchQuery) {
        return (
             <>
                {products.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-serif font-bold text-primary-teal-dark mb-4">Product Results</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  </section>
                )}
                {therapies.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-serif font-bold text-primary-teal-dark mb-4">Therapy Results</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {therapies.map(t => <TherapyCard key={t.id} service={t} />)}
                    </div>
                  </section>
                )}
            </>
        )
    }

    return (
      <>
        {products.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-serif font-bold text-primary-teal-dark">Ayurveda Products</h2>
              <Link to="/store/products" className="text-primary-teal hover:underline font-semibold transition-colors duration-300 flex items-center">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <RevolvingCarousel
                items={products}
                renderItem={(item) => <ProductCard product={item} />}
            />
          </section>
        )}
        {therapies.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-serif font-bold text-primary-teal-dark">Therapy Services</h2>
               <Link to="/store/therapies" className="text-primary-teal hover:underline font-semibold transition-colors duration-300 flex items-center">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
             <RevolvingCarousel
                items={therapies}
                renderItem={(item) => <TherapyCard service={item} />}
            />
          </section>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products and services..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent transition"
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default Store;
