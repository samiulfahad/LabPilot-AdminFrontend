import { NavLink } from "react-router-dom";
import menu from "./menu";

const DesktopMenu = () => {
  // Icon mapping for menu items
  const getIconForMenu = (label) => {
    const iconMap = {
      Home: "🏠",
      Labs: "🧪",
      Zones: "🗺️",
      "Lab Tests": "🔬",
      "Lab Management": "⚙️",
      Billing: "💰",
    };
    return iconMap[label] || "📄";
  };

  return (
    <nav className="hidden lg:flex w-64 fixed left-0 top-0 h-screen flex-col bg-white border-r border-gray-200 shadow-sm z-40">
      {/* Simple Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">LP</span>
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-lg">LabPilot</h1>
            <p className="text-gray-500 text-xs">Medical Platform</p>
          </div>
        </div>
      </div>

      {/* Simple Navigation Menu */}
      <div className="flex-1 p-4">
        <div className="space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="text-lg">{getIconForMenu(item.label)}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Simple User & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">SF</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-sm font-medium truncate">Samiul Fahad</p>
            <p className="text-gray-500 text-xs">Admin</p>
          </div>
        </div>

        <button className="w-full flex items-center space-x-2 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
          <span>🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default DesktopMenu;