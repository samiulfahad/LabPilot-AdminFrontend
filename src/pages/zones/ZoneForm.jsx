const ZoneForm = ({ input, handleInput, onSubmit, type, loading = false }) => {
  const getFormConfig = () => {
    const config = {
      addZone: { label: "Zone Name", btn: "Add Zone" },
      editZone: { label: "Zone Name", btn: "Save" },
      addSubZone: { label: "Sub Zone Name", btn: "Add Sub Zone" },
      editSubZone: { label: "Sub Zone Name", btn: "Save" },
    };
    return config[type] || { label: "Name", btn: "Submit" };
  };

  const { label, btn } = getFormConfig();
  const name = type?.includes("Zone") ? "zoneName" : "subZoneName";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          name={name}
          value={input}
          onChange={handleInput}
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
          placeholder={`Enter ${label.toLowerCase()}`}
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 mb-4 px-4 rounded-lg font-medium transition-colors duration-200"
      >
        {loading ? "Processing..." : btn}
      </button>
    </form>
  );
};

export default ZoneForm;
