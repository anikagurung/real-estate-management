import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await axios.get("http://localhost:3000/api/user/users", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = Cookies.get("access_token");
      await axios.delete(`http://localhost:3000/api/user/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Remove deleted user from state
      setUsers(users.filter(user => user._id !== userId));
      alert("User deleted successfully!");

    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
    

      {/* Show Error Message */}
      {error && <p className="text-red-500">{error}</p>}
    
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Contact</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.fullname}</td>
                <td className="border border-gray-300 px-4 py-2">{user.contact || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
