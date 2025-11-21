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

  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-3 py-4 sm:py-2 max-w-4xl mx-auto">
      {/* Form Title */}
      <div className="w-full text-center sm:text-left text-xl sm:text-lg font-semibold text-gray-800 pb-2">
        {label.formTitle}
      </div>

      {/* First Row: Lab Name & Lab ID */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <label htmlFor="labName" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Lab Name
          </label>
          <input
            type="text"
            id="labName"
            name="labName"
            value={formData.labName || ""}
            onChange={(e) => onChange("labName", e.target.value)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="labId" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Lab ID
          </label>
          <input
            disabled={formData.type === "editLab"}
            type="text"
            id="labId"
            name="labId"
            value={formData.labId || ""}
            onChange={(e) => onChange("labId", e.target.value)}
            className={`w-full px-3 py-3 sm:py-2 border rounded-lg shadow-sm focus:outline-none text-base sm:text-sm ${
              formData.type === "editLab"
                ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            }`}
          />
        </div>
      </div>

      {/* Address - Single Line */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
          className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
        />
      </div>

      {/* Email & Status in Single Line */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Status
          </label>
          <select
            id="isActive"
            name="isActive"
            value={formData.isActive ? "true" : "false"}
            onChange={(e) => onChange("isActive", e.target.value === "true")}
            className={`w-full px-3 py-3 sm:py-2 border rounded-lg shadow-sm focus:outline-none focus:border-transparent text-base sm:text-sm ${
              formData.isActive
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <option value="true" className="text-green-600 bg-green-50">
              Active
            </option>
            <option value="false" className="text-red-600 bg-red-50">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* Contacts */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <label htmlFor="contact1" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Primary Contact
          </label>
          <input
            type="tel"
            id="contact1"
            name="contact1"
            value={formData.contact1 || ""}
            onChange={(e) => onChange("contact1", e.target.value)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
            maxLength={11}
          />
          <p className="text-xs text-gray-500 mt-1">Max 11 digits</p>
        </div>

        <div className="flex-1">
          <label htmlFor="contact2" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Secondary Contact
          </label>
          <input
            type="tel"
            id="contact2"
            name="contact2"
            value={formData.contact2 || ""}
            onChange={(e) => onChange("contact2", e.target.value)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
            maxLength={11}
          />
          <p className="text-xs text-gray-500 mt-1">Max 11 digits</p>
        </div>
      </div>

      {/* Zone & Sub Zone */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <label htmlFor="zoneId" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Zone
          </label>
          <select
            id="zoneId"
            name="zoneId"
            value={formData.zoneId || ""}
            onChange={(e) => onChange("zoneId", e.target.value)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm"
          >
            <option value="">Select Zone</option>
            {zones.map((zone) => (
              <option key={zone._id} value={zone._id}>
                {zone.zoneName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="subZoneId" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Sub Zone
          </label>
          <select
            id="subZoneId"
            name="subZoneId"
            value={formData.subZoneId || ""}
            onChange={(e) => onChange("subZoneId", e.target.value)}
            disabled={!formData.zoneId}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
          >
            <option value="">Select Sub Zone</option>
            {subZones.map((subZone) => (
              <option key={subZone._id} value={subZone._id}>
                {subZone.subZoneName}
              </option>
            ))}
          </select>
          {!formData.zoneId && <p className="text-xs text-gray-500 mt-1">Please select a zone first</p>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 sm:pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 sm:py-2 text-base sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 sm:py-2 text-base sm:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          {label.button}
        </button>
      </div>
    </form>
  );
};

export default LabForm;
