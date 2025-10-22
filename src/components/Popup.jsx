// components/ResultModal.jsx
import React from 'react';

const Popup = ({ 
  type = 'success', // 'success' or 'error'
  message = '',
  onClose // Required prop to close from parent
}) => {
  const typeConfig = {
    success: {
      icon: (
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
      title: 'Success!',
      titleColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: (
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ),
      title: 'Error!',
      titleColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    }
  };

  const config = typeConfig[type];

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4">
        <div className="p-6 text-center">
          {config.icon}
          <h3 className={`text-xl font-semibold mb-2 ${config.titleColor}`}>
            {config.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 text-white font-medium rounded-lg transition-colors ${config.buttonColor}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;