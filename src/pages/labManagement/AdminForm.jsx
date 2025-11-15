import useLabManagementStore from "./store";

const AdminForm = () => {
  const { adminForm, updateAdminForm, addAdmin, clearAdminForm, setActiveModal, modalData } = useLabManagementStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    addAdmin();
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    updateAdminForm(name, value);
  };

  const toggleAdminStatus = () => {
    updateAdminForm("isActive", !adminForm.isActive);
  };

  const closeForm = () => {
    clearAdminForm();
    setActiveModal(null, null);
  };

  return (
    <>
      {/* Admin Form */}
      <div className="space-y-1 p-2">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Admin</h2>
        </div>

        {/* Name Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={adminForm.name || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-1 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Username Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={adminForm.username || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-1 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Password Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={adminForm.password || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-1 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Email Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={adminForm.email || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-1 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Phone Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={adminForm.phone || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-1 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Admin Status Toggle */}
        <div className="border border-gray-300 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Status</label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Current status:
              <span className={`ml-2 font-semibold ${adminForm.isActive ? "text-green-600" : "text-red-600"}`}>
                {adminForm.isActive ? "Active" : "Deactive"}
              </span>
            </span>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={toggleAdminStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                adminForm.isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  adminForm.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-2">
            {adminForm.isActive
              ? "Active admin can login and perform assigned tasks."
              : "Deactive admin cannot login to the system."}
          </p>
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
