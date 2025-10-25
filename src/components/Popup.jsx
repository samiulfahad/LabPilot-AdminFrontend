// components/Popup.js
import React from 'react';
import Portal from './Portal';

const Popup = ({ 
  type = 'success', // 'success', 'error', or 'confirmation'
  message = '',
  onClose, // Required prop to close from parent
  onConfirm, // Required for confirmation type
  confirmText = 'Confirm', // Customizable confirm button text
  cancelText = 'Cancel' // Customizable cancel button text
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
      buttonColor: 'bg-green-600 hover:bg-green-700',
      singleButton: true
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
      buttonColor: 'bg-red-600 hover:bg-red-700',
      singleButton: true
    },
    confirmation: {
      icon: (
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
          <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      ),
      title: 'Are you sure?',
      titleColor: 'text-yellow-600',
      confirmButtonColor: 'bg-red-600 hover:bg-red-700',
      cancelButtonColor: 'bg-gray-500 hover:bg-gray-600',
      singleButton: false
    }
  };

  const config = typeConfig[type];

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  // Close popup when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Close popup on Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <Portal>
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 text-center">
            {config.icon}
            <h3 className={`text-xl font-semibold mb-2 ${config.titleColor}`}>
              {config.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            {config.singleButton ? (
              // Single button for success/error
              <button
                onClick={onClose}
                className={`w-full py-3 px-4 text-white font-medium rounded-lg transition-colors ${config.buttonColor}`}
              >
                OK
              </button>
            ) : (
              // Dual buttons for confirmation
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 px-4 text-white font-medium rounded-lg transition-colors ${config.cancelButtonColor}`}
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 py-3 px-4 text-white font-medium rounded-lg transition-colors ${config.confirmButtonColor}`}
                >
                  {confirmText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Popup;