
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { TherapyService } from '../types';
import Loader from '../components/Loader';
import GenericError from '../components/GenericError';
import TherapyCard from '../components/TherapyCard';

const AllTherapies: React.FC = () => {
  const [therapies, setTherapies] = useState<TherapyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTherapies();
      setTherapies(data);
    } catch (err) {
      setError("Failed to load therapy services. Please try again later.");
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
    if (therapies.length === 0) {
      return <p className="text-center text-gray-500">No therapy services found.</p>;
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {therapies.map(t => <TherapyCard key={t.id} service={t} />)}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-primary-teal-dark mb-8">All Therapy Services</h1>
      {renderContent()}
    </div>
  );
};

export default AllTherapies;
