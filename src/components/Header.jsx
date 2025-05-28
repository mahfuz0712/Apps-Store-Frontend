import { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({ user, Logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-green-600 text-white flex flex-wrap items-center justify-between p-4 mt-4">
      <div className="text-2xl font-bold">Mahfuz&apos;s Apps Store</div>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for apps & games..."
        className="px-4 py-2 rounded-md text-black w-full sm:w-64 focus:outline-none mt-2 sm:mt-0"
      />
      
      {/* Navbar with Dropdown Menu */}
      <nav className="flex space-x-4 mt-2 sm:mt-0 items-center relative">
        {user && <h1 className="text-sm">Welcome, {user.name}!</h1>}

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 shadow-md"
          >
            Menu
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md">
              <ul className="py-2 text-gray-700">
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={Logout}
                    className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 shadow-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

// Define prop types
Header.propTypes = {
  Logout: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default Header;
