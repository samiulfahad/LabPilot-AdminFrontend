import useLabManagementStore from "./store";

const AdminForm = () => {
  const { adminForm, updateAdminForm, handleAddAdmin, clearAdminForm, setActiveModal, modalData } =
    useLabManagementStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddAdmin();
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    updateAdminForm(name, value);
  };

  const closeForm = () => {
    clearAdminForm();
    setActiveModal(null, null);
  };

  return (
    <>
      {/* Admin Form */}
      <div className="space-y-3 p-4 m-4">
        {/* Name Field */}
        <div className="flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <label className="w-20 px-3 py-2 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={adminForm.name || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
            placeholder="Enter name"
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
            value={adminForm.username || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
            placeholder="Enter username"
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
            value={adminForm.password || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
            placeholder="Enter password"
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
            value={adminForm.email || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
            placeholder="Enter email"
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
            value={adminForm.phone || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-2 rounded-r-lg focus:outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Admin
          </button>
          <button
            onClick={closeForm}
            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-sm bg-gray-500 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
        </div>

        {/* Debug info */}
        {modalData && <div className="text-xs text-gray-500 mt-2">Adding admin to: {modalData.labName}</div>}
      </div>
    </>
  );
};

export default AdminForm;
