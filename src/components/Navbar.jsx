import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; // icon from Lucide (you can use any SVG if needed)

const Header = ({ user, Logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-green-600 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between">
        {/* Logo/Title */}
        <div className="text-2xl font-semibold">
          Mahfuz<span className="font-light text-sm">'s Apps Store</span>
        </div>

        {/* Search */}
        <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
          <input
            type="text"
            placeholder="Search apps & games..."
            className="w-full px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
          />
        </div>

        {/* Menu */}
        <div className="relative mt-2 sm:mt-0" ref={dropdownRef}>
          {/* Mobile hamburger icon */}
          <button
            className="sm:hidden p-2 rounded hover:bg-green-700 transition"
            onClick={toggleDropdown}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop user + menu button */}
          <div className="hidden sm:flex items-center space-x-2">
            {user && <span className="text-sm">Hi, {user.name}</span>}
            <button
              onClick={toggleDropdown}
              className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 shadow-sm transition"
            >
              Menu
            </button>
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-50">
              <ul className="divide-y divide-gray-200 text-sm text-gray-700">
                <li>
                  <Link to="/" className="block px-4 py-3 hover:bg-gray-100">
                    Home
                  </Link>
                </li>
                {user?.role === "developer" || user?.role === "admin" ? (
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/application"
                      className="block px-4 py-3 hover:bg-gray-100"
                    >
                      Apply for a Developer Account
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/settings"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                </li>
                {user?.role === "developer" || user?.role === "admin" ? (
                  <li>
                    <button
                      onClick={Logout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <button
                      onClick={() => {
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-3 text-dark-600 hover:bg-gray-100"
                    >
                      Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  Logout: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default Header;
