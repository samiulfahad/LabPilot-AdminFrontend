const Category = ({ item, onDeleteCategory }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 mb-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {item.categoryName}
          </h3>
          <p className="text-sm text-gray-500">0 tests associated</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors">
            <span>📊</span>
            Tests
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-100 border border-green-200 transition-colors">
            <span>➕</span>
            Add
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">
            <span>✏️</span>
            Edit
          </button>
          <button onClick={onDeleteCategory} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-100 border border-red-200 transition-colors">
            <span>🗑️</span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


export default Category