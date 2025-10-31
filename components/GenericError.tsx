
import React from 'react';

interface GenericErrorProps {
  message: string;
  onRetry: () => void;
}

const GenericError: React.FC<GenericErrorProps> = ({ message, onRetry }) => (
  <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg" role="alert">
    <p className="text-red-700 font-semibold">{message}</p>
    <p className="text-red-600 text-sm mt-2">Please check your connection and try again.</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Retry
    </button>
  </div>
);

export default GenericError;
