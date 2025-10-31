
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BlogPost } from '../types';

const BlogDetail: React.FC = () => {
  const location = useLocation();
  const post = location.state?.post as BlogPost | undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }
  
  return (
    <article>
        <header className="relative h-64 md:h-96">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                 <p className="font-semibold text-accent-gold">{post.category}</p>
                 <h1 className="text-3xl md:text-5xl font-serif font-bold mt-2 max-w-4xl">{post.title}</h1>
                 <p className="mt-4 text-sm">{new Date(post.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </header>

        <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
            <div className="prose lg:prose-xl max-w-none">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                 </ReactMarkdown>
            </div>
        </div>
    </article>
  );
};

export default BlogDetail;
