import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    const fetchApps = async () => {
      const appsFromDatabase = import.meta.env.VITE_APPS;
      try {
        const response = await axios.get(appsFromDatabase);
        setApps(response.data);
        const data = [
          { id: 1, name: "App 1", description: "This is app1" },
          { id: 1, name: "App 1", description: "This is app1" }
        ]
        setApps(data);
      } catch (error) {
        console.error("Error fetching app data:", error);
      }
    };

    fetchApps();
  }, []);

  const Logout = () => {
    sessionStorage.clear();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 font-sans flex flex-col min-h-screen w-screen mt-4">
      {/* Header */}
      <Header user={user} Logout={Logout} />


      {/* Main Content */}
      <main className="flex-grow p-6 ">
        {/* App Categories */}
        <section id="featured" className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Apps</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" id="app-grid">
            {apps.map((app, index) => (
              <div key={index} className="flex flex-col items-center bg-white rounded-lg p-4  shadow-md">
                <Link to={`/app-details/${app.name}`}>
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="w-24 h-24 object-cover rounded-lg mb-2"
                  />
                </Link>
                <h3 className="text-sm font-semibold text-center">{app.name}</h3>
                <button className="bg-green-500 text-white rounded-md px-2 py-1 text-sm hover:bg-green-700 mt-2"
                onClick={() => navigate(`/app-details/${app.name}`)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
