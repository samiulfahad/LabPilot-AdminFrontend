import { useState, useEffect } from "react";
import menu from "./menu"; // Adjust the path as needed

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("");

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        setScrollDirection("");
        return;
      }

      if (currentScroll > lastScroll && scrollDirection !== "down") {
        setScrollDirection("down");
      } else if (currentScroll < lastScroll && scrollDirection === "down") {
        setScrollDirection("up");
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll, scrollDirection]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

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
    <>
      {/* Modern Header */}
      <nav
        className={`lg:hidden min-w-full flex justify-between items-center py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-700 shadow-2xl backdrop-blur-lg border-b border-white/20 transition-all duration-500 ${
          scrollDirection === "down"
            ? "-translate-y-full opacity-0"
            : scrollDirection === "up"
            ? "translate-y-0 opacity-100 shadow-2xl"
            : "translate-y-0 opacity-100"
        }`}
      >
        {/* Logo with modern design */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <span className="text-white font-bold text-lg">🧪</span>
          </div>
          <div>
            <p className="text-white font-bold text-xl tracking-tight">LabPilot</p>
            <p className="text-white/70 text-xs">Medical Intelligence</p>
          </div>
        </div>

        {/* Modern Hamburger Button */}
        <button
          className={`relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
            isMenuOpen ? "bg-white/20 rotate-90" : ""
          }`}
          onClick={toggleMenu}
        >
          <div className="flex flex-col items-center justify-center w-6 h-6">
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : "mb-1.5"
              }`}
            ></span>
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "mb-1.5"
              }`}
            ></span>
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </div>
        </button>
      </nav>

      {/* Glass Morphism Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300"
          onClick={toggleMenu}
        />
      )}

      {/* Modern Sidebar - Now covers full height */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-2xl shadow-2xl border-l border-white/30 z-50 transform transition-all duration-500 ease-out ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🧪</span>
            </div>
            <div>
              <p className="text-gray-900 font-bold text-lg">LabPilot</p>
              <p className="text-gray-500 text-sm">Navigation Menu</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* MAIN NAVIGATION MENU - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
          <div className="space-y-2 px-4 py-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-4 mb-4">Main Menu</h3>
            {menu.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center p-4 rounded-2xl transition-all duration-200 group hover:bg-white hover:shadow-lg hover:scale-105 border border-transparent hover:border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50"
                onClick={handleMenuClick}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-200 shadow-md">
                    <span className="text-white text-lg">{getIconForMenu(item.label)}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 text-base">
                      {item.label}
                    </span>
                    <p className="text-gray-500 text-xs mt-1 group-hover:text-gray-600">{item.path}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-blue-500 transition-colors duration-200"></div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* User Info and Logout - Fixed at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-sm">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">Dr. John Smith</p>
              <p className="text-gray-600 text-xs">@johnsmith</p>
              <div className="flex items-center mt-1">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  @administrator
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            onClick={handleMenuClick}
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>

          {/* Version Info */}
          <div className="text-center mt-3">
            <p className="text-gray-400 text-xs">LabPilot v2.1.4</p>
            <p className="text-gray-400 text-xs">© 2024 Medical Systems</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
