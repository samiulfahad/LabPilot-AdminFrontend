import useStore from "./store";
import Icons from "../../components/icons";

const CategoryCard = ({ category }) => {
  const { setPopup, setModal } = useStore();

  const handleDelete = () => {
    setPopup({
      type: "confirmation",
      message: `Delete ${category.name}?`,
      action: "deleteCategory",
      data: { categoryId: category._id },
    });
  };

  const handleEdit = () => {
    setModal({
      view: "editCategory",
      data: { categoryId: category._id, name: category.name },
    });
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md p-4">
      <div className="flex items-center justify-between">
        {/* Category Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icons.Details className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{category.name}</h3>
          </div>
        </div>

        {/* Action Buttons - Fixed for mobile */}
        <div className="flex items-center space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors duration-150"
            aria-label="Edit category"
          >
            <Icons.Edit className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors duration-150"
            aria-label="Delete category"
          >
            <Icons.Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
