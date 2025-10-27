const Zone = ({ name, subZones, onAddSubZone, onEdit, onDeleteZone, onDeleteSubZone }) => {
  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 px-6 py-4 mb-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {subZones.length} Sub Zone{subZones.length !== 1 ? 's' : ''}
          </p>
          
          {/* SubZones Grid */}
          {subZones.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sub Zones:</h4>
              <div className="flex flex-wrap gap-2">
                {subZones.map((item) => (
                  <div 
                    key={item._id} 
                    className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg overflow-hidden group hover:shadow-sm transition-all duration-200"
                  >
                    <span className="px-3 py-2 text-sm font-medium text-blue-800">
                      {item.subZoneName}
                    </span>
                    
                    {/* Action Buttons */}
                    <div className="flex border-l border-blue-200">
                      {/* Edit Button */}
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-100 transition-colors duration-200 group/edit"
                        title="Rename Sub Zone"
                      >
                        <svg
                          className="w-4 h-4 group-hover/edit:scale-110 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => onDeleteSubZone(item._id, item.subZoneName)} 
                        className="p-2 text-red-600 hover:bg-red-50 transition-colors duration-200 group/delete"
                        title="Delete Sub Zone"
                      >
                        <svg
                          className="w-4 h-4 group-hover/delete:scale-110 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zone Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 ml-4 flex-shrink-0">
          <button 
            onClick={onAddSubZone}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Sub
          </button>
          
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          <button 
            onClick={onDeleteZone}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Empty State */}
      {subZones.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 text-sm">No sub zones added yet</p>
          <button 
            onClick={onAddSubZone}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Add your first sub zone
          </button>
        </div>
      )}
    </div>
  );
};

export default Zone;