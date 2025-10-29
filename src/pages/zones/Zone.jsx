const Zone = ({ name, subZones, onAddSubZone, onEditZone, onEditSubZone, onDeleteZone, onDeleteSubZone }) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm px-5 py-4 mb-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {subZones.length} sub zone{subZones.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Zone Action Buttons - Top aligned with zone name */}
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={onAddSubZone}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Sub
          </button>
          
          <button 
            onClick={onEditZone}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          <button 
            onClick={onDeleteZone}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* SubZones List - Full width */}
      {subZones.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {subZones.map((item) => (
              <div 
                key={item._id} 
                className="flex items-center bg-blue-50 border border-blue-200 rounded-md group hover:bg-blue-100 transition-colors"
              >
                <span className="px-3 py-1 text-sm text-blue-800 font-medium">
                  {item.subZoneName}
                </span>
                
                {/* Action Buttons */}
                <div className="flex border-l border-blue-300">
                  <button 
                    onClick={() => onEditSubZone(item._id, item.subZoneName)}
                    className="p-1.5 text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Edit Sub Zone"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => onDeleteSubZone(item._id, item.subZoneName)} 
                    className="p-1.5 text-red-600 hover:bg-red-200 transition-colors"
                    title="Delete Sub Zone"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {subZones.length === 0 && (
        <div className="mt-4 text-center py-4 bg-gray-50 rounded border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm mb-2">No sub zones added yet</p>
          <button 
            onClick={onAddSubZone}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add first sub zone
          </button>
        </div>
      )}
    </div>
  );
};

export default Zone;