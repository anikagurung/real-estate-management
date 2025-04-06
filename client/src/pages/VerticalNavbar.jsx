import React from "react";
import { Link } from "react-router-dom";

export default function VerticalNavbar() {
  return (
    <div className="w-full md:w-1/5 bg-white shadow-lg p-6 hidden md:block">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
      <ul className="space-y-4">
        <li className="text-gray-600 hover:text-blue-600 cursor-pointer">
          <Link to="/profile">Seller Profile</Link>
        </li>
        <li className="text-gray-600 hover:text-blue-600 cursor-pointer">
          <Link to="/seller-dashboard">Listed Properties</Link>
        </li>
        <li className="text-gray-600 hover:text-blue-600 cursor-pointer">
          <Link to="/add-property">Add New Property</Link>
        </li>
        
          <li className="text-gray-600 hover:text-blue-600 cursor-pointer">
          <Link to="/appointments">Appointments</Link>
</li>   
        <li className="text-gray-600 hover:text-blue-600 cursor-pointer">
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
}
