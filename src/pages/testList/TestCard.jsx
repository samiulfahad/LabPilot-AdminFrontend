import { Link } from "react-router-dom";
import useStore from "./store";
import Icons from "../../components/icons";
const TestCard = ({ test }) => {
  const { setPopup, setModal } = useStore();
  if (!test) {
    return (
      <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
        <Icons.Details className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No test data available</p>
      </div>
    );
  }
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all group">
      {/* Header with status and test name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-lg ${test.schemaId ? "bg-green-100" : "bg-yellow-100"}`}>
            {test.schemaId ? (
              <Icons.PowerOn className="w-5 h-5 text-green-600" />
            ) : (
              <Icons.PowerOff className="w-5 h-5 text-yellow-600" />
            )}
          </div>
          <h4 className="font-medium text-gray-900 text-base truncate">{test.name}</h4>
        </div>
        {/* Status badge - moved to top right */}
        {test.schemaId ? (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium shrink-0 ml-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Live
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium shrink-0 ml-2">
            Offline
          </span>
        )}
      </div>
      {/* Icon Actions */}
      <div className="flex justify-between gap-2">
        {test.schemaId ? (
          <>
            <Link
              to={"/render-schema/" + test.schemaId}
              className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center flex-1"
              title="View Form"
            >
              <Icons.View className="w-5 h-5" />
            </Link>
            <button
              onClick={() =>
                setModal({
                  view: "setSchema",
                  data: { testId: test._id, schemaId: test.schemaId },
                })
              }
              className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center flex-1"
              title="Change Schema"
            >
              <Icons.Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setPopup({
                  type: "confirmation",
                  message: `Make offline? It will nnset schema for ${test.name}?`,
                  action: "unsetSchema",
                  data: { name: test.name, testId: test._id },
                });
              }}
              className="p-3 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors flex items-center justify-center flex-1"
              title="Unset Schema"
            >
              <Icons.PowerOff className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setModal({ view: "setSchema", data: { testId: test._id, schemaId: test.schemaId } })}
            className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center flex-1"
            title="Set Schema"
          >
            <Icons.PowerOn className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => {
            setModal({
              view: "editTest",
              data: { name: test.name, testId: test._id, categoryId: test.categoryId },
            });
          }}
          className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center flex-1"
          title="Edit Test"
        >
          <Icons.Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setPopup({
              type: "confirmation",
              message: `Delete ${test.name}?`,
              action: "deleteTest",
              data: { testId: test._id },
            });
          }}
          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center flex-1"
          title="Delete Test"
        >
          <Icons.Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
export default TestCard;