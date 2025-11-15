import useLabManagementStore from "./store";

const StaffForm = () => {
  const { staffForm, updateStaffForm, addStaff, clearStaffForm, setActiveModal, modalData } =
    useLabManagementStore();

  const accessOptions = ["createInvoice", "readInvoice", "updateInvoice", "readCashmemo", "uploadReport"];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(staffForm);
    addStaff();
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateStaffForm(name, type === "checkbox" ? checked : value);
  };

  const handleAccessChange = (accessItem) => {
    const currentAccess = staffForm.access || [];
    const newAccess = currentAccess.includes(accessItem)
      ? currentAccess.filter((item) => item !== accessItem)
      : [...currentAccess, accessItem];

    updateStaffForm("access", newAccess);
  };

  const toggleActiveStatus = () => {
    updateStaffForm("isActive", !staffForm.isActive);
  };

  const closeForm = () => {
    clearStaffForm();
    setActiveModal(null, null);
  };

  return (
    <>
      {/* Staff Form */}
      <div className="space-y-1 p-2 pt-0">
        {/* Heading */}
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Add Staff</h2>
        </div>

        {/* Name Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-0 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={staffForm.name || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-0 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Username Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-0 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={staffForm.username || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-0 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Password Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-0 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={staffForm.password || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-0 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Email Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-0 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={staffForm.email || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-0 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Phone Field */}
        <div className="flex border border-gray-300 rounded-lg">
          <label className="w-20 px-3 py-0 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={staffForm.phone || ""}
            onChange={handleFieldChange}
            className="flex-1 px-3 py-0 rounded-r-lg focus:outline-none"
          />
        </div>

        {/* Access Permissions */}
        <div className="border border-gray-300 rounded-lg p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Access Permissions</label>
          <div className="grid grid-cols-2 gap-1">
            {accessOptions.map((accessItem) => (
              <div key={accessItem} className="flex items-center">
                <input
                  type="checkbox"
                  id={accessItem}
                  checked={(staffForm.access || []).includes(accessItem)}
                  onChange={() => handleAccessChange(accessItem)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={accessItem} className="ml-2 text-sm text-gray-700 capitalize">
                  {accessItem.replace(/([A-Z])/g, " $1").trim()}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Status Toggle */}
        <div className="border border-gray-300 rounded-lg p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Staff Status</label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Current status:
              <span className={`ml-2 font-semibold ${staffForm.isActive ? "text-green-600" : "text-red-600"}`}>
                {staffForm.isActive ? "Active" : "Deactive"}
              </span>
            </span>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={toggleActiveStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                staffForm.isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  staffForm.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-1">
            {staffForm.isActive
              ? "Active staff can login and perform assigned tasks."
              : "Deactive staff cannot login to the system."}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Staff
          </button>
          <button
            onClick={closeForm}
            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-sm bg-gray-500 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
        </div>

        {/* Debug info */}
        {modalData && <div className="text-xs text-gray-500 mt-2">Adding staff to: {modalData.labName}</div>}
      </div>
    </>
  );
};

export default StaffForm;
