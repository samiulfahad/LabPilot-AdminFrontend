import InputField from "../../components/html/InputField";

const LabForm = ({ formData, zones = [], onChange, onSubmit, onClose }) => {
  // Get subzones for selected zone
  const selectedZone = zones.find((zone) => zone._id === formData.zoneId);
  const subZones = selectedZone?.subZones || [];
  const label = {};
  if (formData.type === "editLab") {
    label.formTitle = "Edit Lab";
    label.button = "Update Lab";
  } else {
    label.formTitle = "Add New Lab";
    label.button = "Create Lab";
  }

  const handleFieldChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-1 p-2">
      {/* Heading */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{label.formTitle}</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-2">
        {/* Single Line Inputs */}
        <InputField
          label="Lab Name"
          name="labName"
          value={formData.labName || ""}
          onChange={(e) => handleFieldChange("labName", e.target.value)}
        />

        {/* Lab ID & Status in one line */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Lab ID"
            name="labId"
            value={formData.labId || ""}
            onChange={(e) => handleFieldChange("labId", e.target.value)}
            disabled={formData.type === "editLab"}
          />

          <div className="flex border border-gray-300 rounded-lg">
            <label className="w-20 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
              Status
            </label>
            <select
              value={formData.isActive ? "true" : "false"}
              onChange={(e) => handleFieldChange("isActive", e.target.value === "true")}
              className={`flex-1 px-3 py-1 rounded-r-lg focus:outline-none ${
                formData.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <InputField
          label="Address"
          name="address"
          value={formData.address || ""}
          onChange={(e) => handleFieldChange("address", e.target.value)}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleFieldChange("email", e.target.value)}
        />

        {/* Contacts */}
        <InputField
          label="Primary Contact"
          name="contact1"
          type="tel"
          value={formData.contact1 || ""}
          onChange={(e) => handleFieldChange("contact1", e.target.value)}
          maxLength={11}
        />

        <InputField
          label="Contact 2"
          name="contact2"
          type="tel"
          value={formData.contact2 || ""}
          onChange={(e) => handleFieldChange("contact2", e.target.value)}
          maxLength={11}
        />

        {/* Zone & Sub Zone in one line */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex border border-gray-300 rounded-lg">
            <label className="w-20 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
              Zone
            </label>
            <select
              value={formData.zoneId || ""}
              onChange={(e) => handleFieldChange("zoneId", e.target.value)}
              className="flex-1 px-3 py-1 rounded-r-lg focus:outline-none"
            >
              <option value="">Select Zone</option>
              {zones.map((zone) => (
                <option key={zone._id} value={zone._id}>
                  {zone.zoneName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex border border-gray-300 rounded-lg">
            <label className="w-24 px-3 py-1 text-sm font-medium text-gray-700 border-r border-gray-300 bg-gray-50 rounded-l-lg flex items-center">
              Sub Zone
            </label>
            <select
              value={formData.subZoneId || ""}
              onChange={(e) => handleFieldChange("subZoneId", e.target.value)}
              disabled={!formData.zoneId}
              className="flex-1 px-3 py-1 rounded-r-lg focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select Sub Zone</option>
              {subZones.map((subZone) => (
                <option key={subZone._id} value={subZone._id}>
                  {subZone.subZoneName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-gray-500 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            {label.button}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabForm;
