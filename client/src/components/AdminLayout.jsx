import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div>
      {/* Admin Navbar */}
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/admin-dashboard" className="hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/users" className="hover:underline">
              Users
            </Link>
          </li>
          <li>
            <Link to="/settings" className="hover:underline">
              Properties
            </Link>
          </li>
        </ul>
      </nav>
     
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
