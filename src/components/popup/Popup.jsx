// components/Popup.js
import React from "react";
import Portal from "../Portal";

// Icon components to avoid duplication
const Icons = {
  Success: () => (
    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
      <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  Error: () => (
    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
      <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  ),
  Warning: () => (
    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
      <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    </div>
  ),
};

// Base configurations
const BaseConfigs = {
  success: {
    icon: Icons.Success,
    title: "Success!",
    titleColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700",
    singleButton: true,
  },
  error: {
    icon: Icons.Error,
    title: "Error!",
    titleColor: "text-red-600",
    buttonColor: "bg-red-600 hover:bg-red-700",
    singleButton: true,
  },
  warning: {
    icon: Icons.Warning,
    titleColor: "text-yellow-600",
    confirmButtonColor: "bg-red-600 hover:bg-red-700",
    cancelButtonColor: "bg-gray-500 hover:bg-gray-600",
    singleButton: false,
  },
};

// Extended configurations using base configs
const typeConfig = {
  success: BaseConfigs.success,
  error: BaseConfigs.error,
  confirmation: {
    ...BaseConfigs.warning,
    title: "Are you sure?",
  },
  deleteStaff: {
    ...BaseConfigs.warning,
    title: "Delete Staff",
  },
  deleteAdmin: {
    ...BaseConfigs.warning,
    title: "Delete Admin?",
  },
  // Add more types easily by extending base configs
  deleteLab: {
    ...BaseConfigs.warning,
    title: "Delete Lab?",
  },
};

const Popup = ({
  type = "success",
  message = "",
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const config = typeConfig[type];

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Close popup on Escape key or Enter key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      } else if (e.key === "Enter") {
        if (config.singleButton) {
          onClose?.();
        } else {
          handleConfirm();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, config.singleButton]);

  const IconComponent = config.icon;

  return (
    <Portal>
      <div
        className="fixed inset-0 flex items-center justify-center backdrop-blur-[3px] z-[11] p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 text-center">
            <IconComponent />
            <h3 className={`text-xl font-semibold mb-2 ${config.titleColor}`}>{config.title}</h3>
            <div className="text-gray-600 mb-6">{message}</div>

            {config.singleButton ? (
              <button
                onClick={onClose}
                className={`
                  w-full py-3 px-4 text-white font-medium rounded-lg 
                  transition-colors focus:outline-none
                  ${config.buttonColor}
                `}
                autoFocus
              >
                OK
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className={`
                    flex-1 py-3 px-4 text-white font-medium rounded-lg 
                    transition-colors focus:outline-none
                    ${config.cancelButtonColor}
                  `}
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`
                    flex-1 py-3 px-4 text-white font-medium rounded-lg 
                    transition-colors focus:outline-none
                    ${config.confirmButtonColor}
                  `}
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
