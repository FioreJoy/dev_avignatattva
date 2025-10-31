
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { BlogPost } from '../types';
import Loader from '../components/Loader';
import GenericError from '../components/GenericError';
import BlogPostCard from '../components/BlogPostCard';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBlogPosts();
      setPosts(data);
    } catch (err) {
      setError("Failed to load blog posts. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const allCats = posts.map(p => p.category);
    return ['All', ...Array.from(new Set(allCats))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
      .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [posts, selectedCategory, searchQuery]);

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <GenericError message={error} onRetry={fetchData} />;
    if (filteredPosts.length === 0) {
      return <p className="text-center text-gray-500 py-10">No blog posts found matching your criteria.</p>;
    }
    return (
      <div className="space-y-6">
        {filteredPosts.map(p => <BlogPostCard key={p.id} post={p} />)}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-primary-teal-dark mb-4">Our Blog</h1>
      <p className="text-gray-600 mb-8">Insights on wellness, ayurveda, and self-discovery.</p>

      <div className="sticky top-16 bg-brand-background/95 backdrop-blur-sm py-4 z-40 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent transition"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent transition bg-white"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
          </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default Blog;
