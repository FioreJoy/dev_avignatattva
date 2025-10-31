
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Product } from '../types';
import Loader from '../components/Loader';
import GenericError from '../components/GenericError';
import ProductCard from '../components/ProductCard';

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <GenericError message={error} onRetry={fetchData} />;
    if (products.length === 0) {
      return <p className="text-center text-gray-500">No products found.</p>;
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-primary-teal-dark mb-8">All Ayurveda Products</h1>
      {renderContent()}
    </div>
  );
};

export default AllProducts;
