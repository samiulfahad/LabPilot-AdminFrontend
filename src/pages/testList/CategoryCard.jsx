import useStore from "./store";
import TestList from "./TestCard";
import Icons from "../../components/icons";

const CategoryCard = ({ categoryList }) => {
  const { setPopup, setModal } = useStore();

  return (
    <div className="space-y-4 md:space-y-6">
      {categoryList.map((item) => {
        // Calculate counts for this category
        const liveCount = item.tests.filter((test) => test.schemaId).length;
        const setupCount = item.tests.filter((test) => !test.schemaId).length;

        return (
          <div
            key={item._id}
            className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
          >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-4 md:mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-blue-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                  <Icons.Star className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate">{item.categoryName}</h3>
                  <div className="flex items-center gap-3 md:gap-4 mt-1 md:mt-2 flex-wrap">
                    {/* Total Tests Badge */}
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                      <Icons.Details className="w-3 h-3 md:w-4 md:h-4" />
                      {item.tests.length} {item.tests.length === 1 ? "Test" : "Tests"}
                    </span>

                    {/* Live Count Badge */}
                    {liveCount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {liveCount} Live
                      </span>
                    )}

                    {/* Setup Required Count Badge */}
                    {setupCount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        {setupCount} Setup
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex gap-2 md:gap-3 flex-wrap">
                <button
                  onClick={() => setModal({ view: "addTestForm", data: { categoryId: item._id } })}
                  className="flex items-center gap-1 md:gap-2 bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm flex-1 sm:flex-none justify-center"
                >
                  <Icons.Add className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Test</span>
                  <span className="sm:hidden">Test</span>
                </button>

                <button
                  onClick={() => {
                    setModal({
                      view: "editCategoryForm",
                      data: { categoryId: item._id, categoryName: item.categoryName },
                    });
                  }}
                  className="flex items-center gap-1 md:gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm flex-1 sm:flex-none justify-center"
                >
                  <Icons.Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                  onClick={() => {
                    setPopup({
                      type: "confirmation",
                      action: "deleteCategoy",
                      message: `You are going to delete ${item.categoryName} category and all its tests`,
                      data: item._id,
                    });
                  }}
                  className="flex items-center gap-1 md:gap-2 bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm flex-1 sm:flex-none justify-center"
                >
                  <Icons.Delete className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>

            {/* Tests Section */}
            <div>
              <TestList categoryId={item._id} list={item.tests} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryCard;
