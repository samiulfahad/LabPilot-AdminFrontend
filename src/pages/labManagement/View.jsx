import useLabManagement from "../../store/local/labManagementStore";
import ViewAdmin from "./ViewAdmin";
import ViewLabDetails from "./ViewLabDetails";
import ViewStaff from "./ViewStaff";

const View = () => {
  const { view, closeView } = useLabManagement();

  // Generate readable title from type
  const getTitle = () => {
    switch (view) {
      case "staff":
        return "Staff Details";
      case "admin":
        return "Admin Details";
      case "labDetails":
        return "Lab Details";
      default:
        return "View Details";
    }
  };

  // Render the appropriate content based on type
  const renderContent = () => {
    switch (view) {
      case "staff":
        return <ViewStaff />; // ViewStaff will get data directly from store
      case "admin":
        return <ViewAdmin />; // ViewAdmin will get data directly from store
      case "labDetails":
        return <ViewLabDetails />; // ViewLabDetails will get data directly from store
      default:
        return <div>No content available</div>;
    }
  };

  if (!view) return null; // Don't render if no view is active

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Fixed Header Section */}
      <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-lg z-10">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <button
            onClick={closeView}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default View;
