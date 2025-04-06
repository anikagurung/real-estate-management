import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

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
            className="bg-transparent focus:none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>

        {/* Navigation Links */}
        <ul className="flex gap-4">
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

          {/* Profile or Sign In */}
          <Link to="/profile">
            {currentUser ? (
              <li className="text-slate-700 hover:underline">Profile</li>
            ) : (
              <li className="text-slate-700 hover:underline">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

