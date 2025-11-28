const LabTestForm = ({ onChange, data, onSubmit, formType, onClose }) => {
  const name = data.name || "";

  let label;
  let btn;
  let title;

  if (formType === "addLabTest" || formType === "editLabTest") {
    title = "Add new Lab Test";
    btn = "Add New Lab Test";
    label = "Lab Test Name";

    if (formType === "editLabTest") {
      title = "Edit Lab Test";
      btn = "Update Lab Test";
    }

    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <h2 className="text-center font-bold text-lg">{title}</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <input
            name="name"
            value={name}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
            placeholder={`Enter ${label.toLowerCase()}`}
            autoFocus
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-2/3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            {btn}
          </button>
        </div>
      </form>
    );
  }
};

export default LabTestForm;
