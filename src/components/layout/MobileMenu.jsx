import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import menu from "./menu";

const MobileMenu = () => {
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

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

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
      {/* Enhanced Mobile Navbar */}
      <div className="lg:hidden">
        {/* Fixed Navbar with Glass Morphism */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-3 px-4 bg-white/80 backdrop-blur-md border-b border-gray-200/60 transition-all duration-500 ${
            scrollDirection === "down"
              ? "-translate-y-full opacity-0"
              : scrollDirection === "up"
              ? "translate-y-0 opacity-100 shadow-sm"
              : "translate-y-0 opacity-100"
          }`}
        >
          {/* Logo with enhanced design */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">LP</span>
            </div>
            <div>
              <p className="text-gray-900 font-bold text-lg tracking-tight">LabPilot</p>
            </div>
          </Link>

          {/* Enhanced Hamburger Button with Animation */}
          <button
            onClick={toggleMenu}
            className="w-11 h-11 flex items-center justify-center bg-white text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-300 shadow-sm border border-gray-300 hover:border-blue-300 hover:shadow-md active:scale-95"
          >
            <div className="flex flex-col items-center justify-center w-5 h-5 relative">
              <span
                className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 top-2" : "top-0"
                }`}
              ></span>
              <span
                className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 top-2" : "top-2 opacity-100"
                }`}
              ></span>
              <span
                className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 top-2" : "top-4"
                }`}
              ></span>
            </div>
          </button>
        </nav>

        {/* Spacer */}
        <div className="h-16"></div>
      </div>

      {/* Enhanced Overlay with Gradient */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-[2px] transition-all duration-300"
          onClick={toggleMenu}
        />
      )}

      {/* Enhanced Mobile Sidebar with Glass Morphism */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/60 z-50 transform transition-all duration-500 ease-out ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Enhanced Header with Gradient */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">SF</span>
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-base">Samiul Fahad</p>
              <p className="text-gray-600 text-sm mt-0.5">Administrator</p>
            </div>
          </div>

          {/* Enhanced Close Button */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center bg-white text-gray-500 hover:text-red-500 rounded-xl transition-all duration-300 shadow-sm border border-gray-300 hover:border-red-300 hover:shadow-md active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Enhanced Scrollable Menu Area */}
        <div className="flex-1 overflow-y-auto pb-28 h-full">
          <div className="space-y-2 px-4 py-6">
            {menu.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md active:scale-95"
                  }`
                }
                onClick={handleMenuClick}
              >
                {/* Background shine effect for active state */}
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{getIconForMenu(item.label)}</span>
                    </div>
                    <span
                      className={`font-semibold text-base transition-all duration-300 ${
                        isActive ? "text-white" : "group-hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Enhanced Fixed Logout Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/60 bg-white/90 backdrop-blur-lg">
          <div className="space-y-4">
            {/* Enhanced Logout Button */}
            <button
              className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 group"
              onClick={handleMenuClick}
            >
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm font-semibold tracking-wide">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
