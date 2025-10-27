const ZoneForm = ({ input, handleInput, onSubmit, type, loading = false }) => {
  // Determine form configuration based on type
  const getFormConfig = () => {
    const config = {
      addZone: { label: "Zone Name", btn: "Add Zone", icon: "🏢" },
      editZone: { label: "Zone Name", btn: "Save Changes", icon: "✏️" },
      addSubZone: { label: "Sub Zone Name", btn: "Add Sub Zone", icon: "📍" },
      editSubZone: { label: "Sub Zone Name", btn: "Save Changes", icon: "✏️" }
    };
    return config[type] || { label: "Name", btn: "Submit", icon: "📝" };
  };

  const { label, btn, icon } = getFormConfig();
  const name = type?.includes("Zone") ? "zoneName" : "subZoneName";

  // Get title based on type
  const getTitle = () => {
    const titles = {
      addZone: "Create New Zone",
      editZone: "Edit Zone",
      addSubZone: "Add Sub Zone", 
      editSubZone: "Edit Sub Zone"
    };
    return titles[type] || "Zone Management";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-3xl mb-2">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {type?.includes("add") ? "Enter the details below" : "Update the details below"}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Input Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input 
              name={name}
              value={input} 
              onChange={handleInput} 
              required 
              disabled={loading}
              className={`
                w-full px-4 py-3 border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-offset-1
                transition-all duration-200
                disabled:bg-gray-50 disabled:cursor-not-allowed
                ${loading 
                  ? 'border-gray-300 bg-gray-50 text-gray-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }
              `}
              placeholder={`Enter ${label.toLowerCase()}...`}
              autoFocus
            />
            {/* Loading indicator */}
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {type?.includes("Zone") 
              ? "Enter a unique name for the zone"
              : "Enter a descriptive name for the sub zone"
            }
          </p>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`
            w-full py-3 px-4 rounded-xl font-medium
            transition-all duration-200 transform
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            hover:scale-[1.02] active:scale-[0.98]
            ${type?.includes('edit') || type?.includes('Save')
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200 text-white'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:ring-green-200 text-white'
            }
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              {type?.includes('edit') || type?.includes('Save') ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              <span>{btn}</span>
            </div>
          )}
        </button>

        {/* Helper Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {type?.includes("add") 
              ? "This will create a new entry in the system"
              : "Changes will be applied immediately"
            }
          </p>
        </div>
      </form>
    </div>
  );
};

export default ZoneForm;