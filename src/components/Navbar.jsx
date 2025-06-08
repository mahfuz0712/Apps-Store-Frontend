import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";

const Navbar = ({ User: CurrentUser, Logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleSearch = () => setShowSearch((prev) => !prev);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo/Title */}
        <div className="text-2xl font-semibold flex items-center">
          <Link to="/" className="flex items-center hover:opacity-90 transition">
            <span className="hidden sm:inline">Mahfuz</span>
            <span className="inline sm:hidden">M</span>
            <span className="font-light text-sm">'s Apps Store</span>
          </Link>
        </div>

        {/* Search and User Icons */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-indigo-500 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {showSearch && (
              <form 
                onSubmit={handleSearch}
                className="absolute right-0 mt-2 w-64 md:w-80 bg-white rounded-lg shadow-lg z-50 animate-fade-in overflow-hidden"
              >
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search apps & games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 text-gray-800 focus:outline-none"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="p-2 text-gray-500 hover:text-indigo-600"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:bg-indigo-500 transition flex items-center"
              aria-label="User menu"
            >
              {CurrentUser ? (
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mr-1 overflow-hidden">
                    {CurrentUser.Avatar ? (
                      <img src={CurrentUser.Avatar} alt={CurrentUser.Name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{CurrentUser.Name?.split(' ')[0]}</span>
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                <ul className="divide-y divide-gray-100 text-sm text-gray-700">
                  <li>
                    <Link to="/" className="block px-4 py-3 hover:bg-gray-50 transition">
                      Home
                    </Link>
                  </li>
                  {CurrentUser ? (
                    <>
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-3 hover:bg-gray-50 transition"
                        >
                          Profile
                        </Link>
                      </li>
                      {CurrentUser.Role === "Developer" && (
                        <li>
                          <Link
                            to="/developer/dashboard"
                            className="block px-4 py-3 hover:bg-gray-50 transition"
                          >
                            Developer Dashboard
                          </Link>
                        </li>
                      )}
                      {CurrentUser.Role === "Admin" && (
                        <li>
                          <Link
                            to="/admin"
                            className="block px-4 py-3 hover:bg-gray-50 transition"
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          to="/settings"
                          className="block px-4 py-3 hover:bg-gray-50 transition"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={Logout}
                          className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 transition"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <button
                          onClick={() => navigate("/login")}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                        >
                          Login
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  User: PropTypes.object,
  Logout: PropTypes.func.isRequired,
};

export default Navbar;
