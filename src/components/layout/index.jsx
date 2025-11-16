import { NavLink } from "react-router-dom";
import menu from "./menu";
import MobileNavbar from "./MobileNavBar";

const Layout = ({ children }) => {

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <MobileNavbar />

      <nav
        className={
          "hidden lg:flex w-64 py-8 fixed left-0 top-0 h-screen flex-col bg-gray-800/90 backdrop-blur-xl border-e border-gray-700/30 shadow-2xl shadow-black/20 transform transition-transform duration-300 ease-in-out z-40"
        }
      >
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

     

      {/* Main content */}
      <main className="lg:ml-64 flex-1 min-h-screen bg-gradient-to-br from-gray-50/95 via-gray-100/95 to-white/95 backdrop-blur-sm">
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 pt-16 lg:pt-0 duration-500 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
