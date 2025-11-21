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
      {/* Clean Mobile Navbar */}
      <div className="lg:hidden">
        <nav
          className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-5 bg-white border-b border-gray-200 transition-transform duration-300 ${
            scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LP</span>
            </div>
            <span className="text-gray-900 font-bold text-lg">LabPilot</span>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center w-5 h-5">
              <span
                className={`w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : "mb-1.5"
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "mb-1.5"
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </nav>

        {/* Spacer */}
        <div className="h-16"></div>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/20" onClick={toggleMenu} />}

      {/* Clean Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SF</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Samiul Fahad</p>
              <p className="text-gray-500 text-sm">Administrator</p>
            </div>
          </div>

          <button
            onClick={toggleMenu}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="space-y-1 p-4">
            {menu.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-600 hover:bg-gray-50"
                  }`
                }
                onClick={handleMenuClick}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${({ isActive }) =>
                    isActive ? "bg-blue-100" : "bg-gray-100"}`}
                >
                  <span className="text-sm">{getIconForMenu(item.label)}</span>
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Logout Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={handleMenuClick}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
