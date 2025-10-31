
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { BlogPost } from '../types';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const location = useLocation();
  
  return (
    <Link 
        to={`/blog/${post.id}`} 
        state={{ post, from: location.pathname }}
        className="group flex flex-col md:flex-row bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-6 md:w-2/3 flex flex-col justify-between">
        <div>
          <p className="text-sm font-semibold text-primary-teal">{post.category}</p>
          <h2 className="mt-2 text-xl font-serif font-bold text-gray-800">{post.title}</h2>
          <p className="mt-2 text-gray-600 line-clamp-2">{post.excerpt}</p>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{new Date(post.datePublished).toLocaleDateString()}</span>
          <span className="flex items-center group-hover:text-primary-teal">Read More <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
