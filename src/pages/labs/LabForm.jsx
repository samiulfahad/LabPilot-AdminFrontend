const LabForm = ({ formData, zones = [], onChange, onSubmit, onCancel }) => {
  // Get subzones for selected zone
  const selectedZone = zones.find((zone) => zone._id === formData.zoneId);
  const subZones = selectedZone?.subZones || [];

  return (
    <form onSubmit={onSubmit} className="space-y-2 py-4 min-w-2xl">
      {/* First Row: Lab Name & Lab ID */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="labName" className="block text-sm font-medium text-gray-700 mb-1">
            Lab Name
          </label>
          <input
            type="text"
            id="labName"
            name="labName"
            value={formData.labName || ""}
            onChange={(e) => onChange("labName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="labId" className="block text-sm font-medium text-gray-700 mb-1">
            Lab ID
          </label>
          <input
            type="text"
            id="labId"
            name="labId"
            value={formData.labId || ""}
            onChange={(e) => onChange("labId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Address - Single Line */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Email & Status in Single Line */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="isActive"
            name="isActive"
            value={formData.isActive}
            onChange={(e) => onChange("isActive", e.target.value === "true")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="true" className="text-green-600">
              Active
            </option>
            <option value="false" className="text-red-600">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* Contacts */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="contact1" className="block text-sm font-medium text-gray-700 mb-1">
            Primary Contact
          </label>
          <input
            type="text"
            id="contact1"
            name="contact1"
            value={formData.contact1 || ""}
            onChange={(e) => onChange("contact1", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={11}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="contact2" className="block text-sm font-medium text-gray-700 mb-1">
            Secondary Contact
          </label>
          <input
            type="text"
            id="contact2"
            name="contact2"
            value={formData.contact2 || ""}
            onChange={(e) => onChange("contact2", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={11}
          />
        </div>
      </div>

      {/* Zone & Sub Zone - At the end */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="zoneId" className="block text-sm font-medium text-gray-700 mb-1">
            Zone
          </label>
          <select
            id="zoneId"
            name="zoneId"
            value={formData.zoneId || ""}
            onChange={(e) => onChange("zoneId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label htmlFor="subZoneId" className="block text-sm font-medium text-gray-700 mb-1">
            Sub Zone
          </label>
          <select
            id="subZoneId"
            name="subZoneId"
            value={formData.subZoneId || ""}
            onChange={(e) => onChange("subZoneId", e.target.value)}
            disabled={!formData.zoneId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Lab
        </button>
      </div>
    </form>
  );
};

export default LabForm;
