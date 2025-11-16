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
      {/* Mobile Navbar */}
      <div className="lg:hidden">
        {/* Fixed Navbar */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-3 px-4 bg-white border-b border-gray-200 transition-all duration-300 ${
            scrollDirection === "down"
              ? "-translate-y-full"
              : scrollDirection === "up"
              ? "translate-y-0 shadow-sm"
              : "translate-y-0"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LP</span>
            </div>
            <div>
              <p className="text-gray-900 font-bold text-lg">LabPilot</p>
            </div>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
          >
            <div className="flex flex-col items-center justify-center w-5 h-5">
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : "mb-1.5"
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "mb-1.5"
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </nav>

        {/* Spacer */}
        <div className="h-14"></div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20 transition-all duration-300" onClick={toggleMenu} />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SF</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Samiul Fahad</p>
              <p className="text-gray-500 text-sm">Admin</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {menu.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
                onClick={handleMenuClick}
              >
                <span className="text-lg">{getIconForMenu(item.label)}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            className="w-full flex items-center space-x-2 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            onClick={handleMenuClick}
          >
            <span>🚪</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
