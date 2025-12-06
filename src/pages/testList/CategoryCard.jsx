// CategoryCard.jsx (or your CategoryCard component file)

import React from "react";
import Icons from "../../components/icons";
import useStore from "./store"; // Adjust the path based on your structure

const CategoryCard = ({ category }) => {
  const { setModal, setPopup } = useStore();

  const handleEdit = () => {
    setModal({ view: "editCategory", data: category });
  };

  const handleDelete = () => {
    setPopup({
      type: "confirmation",
      action: "deleteCategory",
      message: `Are you sure you want to delete "${category.categoryName}"? This will also delete all tests in this category.`,
      data: category._id,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <span className="text-lg md:text-xl">
                {category.categoryName === "BLOOD" ? "🩸" : category.categoryName === "URINE" ? "🧪" : "📋"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">{category.categoryName}</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">{category.testCount || 0} tests</p>
            </div>
          </div>

          {/* Action buttons - Visible on all screen sizes */}
          <div className="flex items-center gap-1 md:gap-2 ml-2">
            {/* Edit button */}
            <button
              onClick={handleEdit}
              className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Edit category"
            >
              <Icons.Edit className="w-4 h-4 md:w-4 md:h-4" />
            </button>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete category"
            >
              <Icons.Delete className="w-4 h-4 md:w-4 md:h-4" />
            </button>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-gray-500">Created:</span>
            <span className="text-gray-700">{new Date(category.createdAt).toLocaleDateString()}</span>
          </div>
          {category.updatedAt && (
            <div className="flex items-center justify-between text-xs md:text-sm mt-1">
              <span className="text-gray-500">Updated:</span>
              <span className="text-gray-700">{new Date(category.updatedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover effect border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default CategoryCard;
