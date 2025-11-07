import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  children,
  size = "md", // sm, md, lg, xl
}) => {
  // Handle body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'min-w-md max-w-md',
    md: 'min-w-lg max-w-lg',
    lg: 'min-w-2xl max-w-2xl',
    xl: 'min-w-4xl max-w-4xl'
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10] flex items-center justify-center px-4 py-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        className={`${sizeClasses[size]} bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100 flex flex-col max-h-[90vh]`}
      >
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;