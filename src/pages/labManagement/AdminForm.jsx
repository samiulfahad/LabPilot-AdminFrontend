const AdminForm = ({ formData, onFieldChange, onSubmit, onCancel }) => {
  
  

  return (
    <div className="space-y-3 p-4 m-4">
      {/* Name Field */}
      <div className="flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <label className="w-20 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={onFieldChange}
          className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
        />
      </div>

      {/* Username Field */}
      <div className="flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <label className="w-20 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username || ""}
          onChange={onFieldChange}
          className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
        />
      </div>

      {/* Password Field */}
      <div className="flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <label className="w-20 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password || ""}
          onChange={onFieldChange}
          className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
        />
      </div>

      {/* Email Field */}
      <div className="flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <label className="w-20 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={onFieldChange}
          className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
        />
      </div>

      {/* Phone Field */}
      <div className="flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <label className="w-20 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={onFieldChange}
          className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
        >
          Add Admin
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminForm;
