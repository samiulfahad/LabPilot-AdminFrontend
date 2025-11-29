import useLabManagementStore from "./store";
import InputField from "../../components/html/InputField";

const AdminForm = () => {
  const { adminForm, updateAdminForm, addAdmin, clearAdminForm, modal, closeModal } = useLabManagementStore();

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
    closeModal();
  };

  return (
    <div className="space-y-1 p-2">
      {/* Heading */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Add Admin</h2>
      </div>

      {/* Input Fields */}
      <InputField label="Name" name="name" value={adminForm.name || ""} onChange={handleFieldChange} />

      <InputField label="Username" name="username" value={adminForm.username || ""} onChange={handleFieldChange} />

      <InputField
        label="Password"
        name="password"
        type="password"
        value={adminForm.password || ""}
        onChange={handleFieldChange}
      />

      <InputField label="Email" name="email" type="email" value={adminForm.email || ""} onChange={handleFieldChange} />

      <InputField label="Phone" name="phone" type="tel" value={adminForm.phone || ""} onChange={handleFieldChange} />

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
          className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Admin
        </button>
        <button
          onClick={closeForm}
          className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-gray-500 hover:bg-gray-600 text-white"
        >
          Cancel
        </button>
      </div>

      {/* Debug info */}
      {modal.data && <div className="text-xs text-gray-500 mt-2">Adding admin to: {modal.data.name}</div>}
    </div>
  );
};

export default AdminForm;
