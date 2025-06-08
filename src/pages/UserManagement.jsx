import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    Name: "",
    Email: "",
    Role: "",
    Phone: "",
    Password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const AllUserURL = import.meta.env.VITE_USERS;
        const res = await axios.get(AllUserURL);
        setUsers(res.data?.userDetails || []);
      } catch (err) {
        swal({
          title: "Error",
          text: "Failed to load users: " + err.message,
          icon: "error",
        });
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const openEditModal = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleAddUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUserSubmit = async () => {
    const { Name, Email, Role, Phone, Password } = newUser;
    if (!Name || !Email || !Role || !Phone || !Password) {
      swal({
        title: "Missing Fields",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
      });
      return;
    }

    try {
      const RegisterUserURL = import.meta.env.VITE_REGISTER;
      const response = await axios.post(RegisterUserURL, newUser);
      if (response.data.success) {
        swal({
          title: "Success",
          text: response.data.message,
          icon: "success",
        });
        setShowAddModal(false);
        setNewUser({ Name: "", Email: "", Role: "", Phone: "", Password: "" });
      } else {
        swal({
          title: "Error Saving",
          text: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      swal({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="border rounded px-3 py-2 w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{user.Name}</td>
                <td className="px-4 py-2">{user.Email}</td>
                <td className="px-4 py-2">{user.Role}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-green-600 hover:underline mr-2"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === idx + 1
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
            <h3 className="text-xl font-bold mb-4">Add User</h3>
            <input
              name="Name"
              value={newUser.Name}
              onChange={handleAddUserChange}
              placeholder="Name"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              name="Email"
              value={newUser.Email}
              onChange={handleAddUserChange}
              placeholder="Email"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              name="Phone"
              value={newUser.Phone}
              onChange={handleAddUserChange}
              placeholder="Phone"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              name="Password"
              value={newUser.Password}
              onChange={handleAddUserChange}
              placeholder="Password"
              type="password"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              name="Role"
              value={newUser.Role}
              onChange={handleAddUserChange}
              placeholder="Role"
              className="border p-2 rounded w-full mb-2"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleAddUserSubmit}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
              >
                Submit
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <p>Name: {editUser.Name}</p>
            <p>Email: {editUser.Email}</p>
            <p>Role: {editUser.Role}</p>
            <button
              onClick={() => setShowEditModal(false)}
              className="mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
