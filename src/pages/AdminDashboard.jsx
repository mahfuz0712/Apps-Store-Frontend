import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleManageUsers = () => {
    navigate("/admin/users");
  };

  const handleManageApps = () => {
    navigate("/admin/apps");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-700">Welcome to the Admin Dashboard!</p>
      <p className="text-sm text-gray-500 mt-2">This page is under construction.</p>
      <div className="mt-8">
        <button
          onClick={handleManageUsers}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow"
        >
          Manage Developers
        </button>
        <button
          onClick={handleManageApps}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow ml-4"
        >
          Manage Apps
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
