import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
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
      {/* Mobile Navbar Container with proper spacing */}
      <div className="lg:hidden">
        {/* Fixed Navbar */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-700 shadow-2xl backdrop-blur-lg border-b border-white/20 transition-all duration-500 ${
            scrollDirection === "down"
              ? "-translate-y-full opacity-0"
              : scrollDirection === "up"
              ? "translate-y-0 opacity-100 shadow-2xl"
              : "translate-y-0 opacity-100"
          }`}
        >
          {/* Logo with modern design */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <span className="text-white font-bold text-lg">🧪</span>
            </div>
            <div>
              <p className="text-white font-bold text-xl tracking-tight">LabPilot</p>
              <p className="text-white/70 text-xs">Medical Intelligence</p>
            </div>
          </Link>

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
      </div>

      {/* Glass Morphism Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300"
          onClick={toggleMenu}
        />
      )}

      {/* Modern Sidebar with Clean Header */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-2xl shadow-2xl border-l border-white/30 z-50 transform transition-all duration-500 ease-out ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Clean Header with User Info and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">👨‍⚕️</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-base truncate">Samiul Fahad</p>
              <p className="text-gray-600 text-sm">@sfahad</p>
              <div className="flex items-center mt-0.5">
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Administrator
                </span>
              </div>
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

        {/* Main Content Area - Menu and Fixed Logout */}
        <div className="flex flex-col h-full">
          {/* Scrollable Menu Area */}
          <div className="flex-1 overflow-y-auto" style={{ height: "calc(100% - 140px)" }}>
            <div className="space-y-1 p-4">
              {menu.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center p-4 rounded-xl transition-all duration-200 group border backdrop-blur-sm ${
                      isActive
                        ? "bg-blue-50 border-blue-200 shadow-md"
                        : "bg-white/50 border-transparent hover:bg-white hover:shadow-lg"
                    }`
                  }
                  onClick={handleMenuClick}
                >
                  {({ isActive }) => (
                    <div className="flex items-center space-x-4 w-full">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md ${
                          isActive
                            ? "bg-gradient-to-br from-blue-600 to-purple-700"
                            : "bg-gradient-to-br from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700"
                        }`}
                      >
                        <span className="text-white text-sm">{getIconForMenu(item.label)}</span>
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-semibold transition-colors duration-200 text-sm ${
                            isActive ? "text-blue-700" : "text-gray-800 group-hover:text-gray-900"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          isActive ? "bg-blue-600" : "bg-blue-400 group-hover:bg-blue-500"
                        }`}
                      ></div>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Fixed Logout Section - Absolutely positioned at bottom */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm p-4">
            <button
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 mb-2"
              onClick={handleMenuClick}
            >
              <span className="text-lg">🚪</span>
              <span className="text-sm">Logout</span>
            </button>

            <div className="text-center">
              <p className="text-gray-400 text-xs">LabPilot v1.0.0</p>
              <p className="text-gray-400 text-xs">© 2025 Lab Pilot</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
