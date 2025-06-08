import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { Plus, ChevronRight, Package, BarChart2, Users, Settings } from "lucide-react";

const DeveloperDashboard = () => {
  const [stats, setStats] = useState({
    totalApps: 0,
    activeApps: 0,
    pendingApps: 0,
    totalDownloads: 0,
    revenue: 0,
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard data from backend
        const dashboardUrl = import.meta.env.VITE_DEVELOPER_DASHBOARD;
        const response = await axios.get(dashboardUrl, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (response.data?.success) {
          setStats(response.data.stats);
          setRecentApps(response.data.recentApps);
        } else {
          swal({
            title: "Error",
            text: response.data.message || "Failed to fetch dashboard data",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        swal({
          title: "Error",
          text: "Could not connect to the server",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Apps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApps}</p>
            </div>
            <Package className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Apps</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeApps}</p>
            </div>
            <Package className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Apps</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApps}</p>
            </div>
            <Package className="h-10 w-10 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
            </div>
            <BarChart2 className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-green-600">৳{stats.revenue}</p>
            </div>
            <Users className="h-10 w-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/developer/apps/new"
            className="flex items-center justify-center py-3 px-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition"
          >
            <Plus className="h-5 w-5 mr-2" /> Publish New App
          </Link>
          <Link
            to="/developer/apps"
            className="flex items-center justify-center py-3 px-4 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <Package className="h-5 w-5 mr-2" /> Manage Your Apps
          </Link>
          <Link
            to="/settings"
            className="flex items-center justify-center py-3 px-4 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <Settings className="h-5 w-5 mr-2" /> Account Settings
          </Link>
        </div>
      </div>

      {/* Recent Apps */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Apps</h2>
          <Link 
            to="/developer/apps" 
            className="text-sm text-green-600 hover:text-green-800 flex items-center"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : recentApps.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No apps published yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    App Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentApps.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={app.icon || "https://via.placeholder.com/40"}
                            alt={app.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {app.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : app.status === "pending" 
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.downloads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.publishedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/developer/apps/edit/${app.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperDashboard; 