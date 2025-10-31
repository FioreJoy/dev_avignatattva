import React from 'react';
import { ADMIN_EMAIL_ADDRESS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h3 className="text-3xl font-serif font-bold text-primary-teal-dark">AvignaTattva</h3>
            <p className="mt-2 text-md text-gray-600">Discover Your True Self.</p>
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          <a href={`mailto:${ADMIN_EMAIL_ADDRESS}`} className="text-gray-500 hover:text-primary-teal">
            <span className="sr-only">Email</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          {/* Add social media links here if available */}
        </div>
        <div className="mt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AvignaTattva Wellness. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
