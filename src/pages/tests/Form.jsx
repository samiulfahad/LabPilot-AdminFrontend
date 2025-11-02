const Form = ({ onSubmit, formData, onChange, onClose }) => {
  let formTitle = "Add New Test";
  if (formData.type === "addNewCategory") formTitle = "Add New Category";
  
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      {/* Form Title */}
      <div className="text-2xl font-bold text-gray-800 text-center mb-6">
        {formTitle}
      </div>
      
      {/* Category Name Input */}
      <div className="mb-6">
        <label 
          htmlFor="categoryName" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Category Name
        </label>
        <input
          type="text"
          id="categoryName"
          name="categoryName"
          value={formData?.categoryName || ""}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Enter category name"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button 
          type="button" 
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;