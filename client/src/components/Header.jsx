import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react'; // For dropdown state
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Property</span>
            <span className="text-slate-700">Ease</span>
          </h1>
        </Link>

        {/* Search Form */}
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search.."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>

        {/* Navigation Links */}
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
          </Link>
          <Link to="/properties">
            <li className="hidden sm:inline text-slate-700 hover:underline">Properties</li>
          </Link>

          {/* Conditional Rendering for Admin Role */}
          {currentUser?.role === 'admin' && (
            <Link to="/admin-dashboard">
              <li className="text-slate-700 hover:underline">Admin Dashboard</li>
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 text-slate-700 hover:underline"
              onClick={toggleDropdown}
            >
              <FaUserCircle size={20} />
              {currentUser?.username || 'Account'}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg py-2 w-40">
                <Link to="/profile">
                  <li className="px-4 py-2 text-slate-700 hover:bg-slate-100">Profile</li>
                </Link>
                <Link to="/bookings"> {/* Change this link to /bookings */}
        <li className="px-4 py-2 text-slate-700 hover:bg-slate-100">
          Appointments
        </li>
      </Link>
                <li
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  onClick={() => {
                    // Add logout logic here if needed
                    console.log('Logout clicked');
                  }}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        </ul>
      </div>
    </header>
  );
}
