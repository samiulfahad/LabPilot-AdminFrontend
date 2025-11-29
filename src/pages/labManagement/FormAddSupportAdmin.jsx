import { useState } from "react";
import useLabManagementStore from "./store";
import InputField from "../../components/html/InputField";

const AddSupportAdminForm = () => {
  const { addSupportAdmin, modal, closeModal } = useLabManagementStore();
  const labId = modal.data._id;
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addSupportAdmin(labId, password, isActive);
  };

  const toggleAdminStatus = () => {
    setIsActive(!isActive);
  };

  const closeForm = () => {
    setPassword("");
    setIsActive(false);
    closeModal();
  };

  return (
    <div className="space-y-4 p-2">
      {/* Heading */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Add Support Admin</h2>
      </div>

      {/* Password Field */}
      <InputField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />

      {/* Admin Status Toggle */}
      <div className="border border-gray-300 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Status</label>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Current status:
            <span className={`ml-2 font-semibold ${isActive ? "text-green-600" : "text-red-600"}`}>
              {isActive ? "Active" : "Deactive"}
            </span>
          </span>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={toggleAdminStatus}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 mt-2">
          {isActive
            ? "Active support admin can login and perform assigned tasks."
            : "Deactive support admin cannot login to the system."}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Support Admin
        </button>
        <button
          onClick={closeForm}
          className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-gray-500 hover:bg-gray-600 text-white"
        >
          Cancel
        </button>
      </div>

      {/* Debug info */}
      {modal.data && <div className="text-xs text-gray-500 mt-2">Adding support admin to: {modal.data.name}</div>}
    </div>
  );
};

export default AddSupportAdminForm;
