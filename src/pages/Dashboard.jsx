import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Star, Download, ChevronRight, ChevronLeft } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [featuredApps, setFeaturedApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredApps, setFilteredApps] = useState([]);
  const [categorizedApps, setCategorizedApps] = useState({});
  // Track scroll position for each category
  const [scrollPositions, setScrollPositions] = useState({});
  const categoryRowRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const appsEndpoint = import.meta.env.VITE_GET_APPS;
      const categoriesEndpoint = import.meta.env.VITE_CATEGORIES;
      
      try {
        // Fetch apps
        const appsResponse = await axios.get(appsEndpoint);
        const appsData = appsResponse.data.data.appsList;
        setApps(appsData);
        setFilteredApps(appsData);
        
        // Set featured apps (top 6 based on category or random)
        // Since we don't have rating data, we'll select featured apps by category
        const appsByCategory = {};
        appsData.forEach(app => {
          if (app.Category) {
            if (!appsByCategory[app.Category]) {
              appsByCategory[app.Category] = [];
            }
            appsByCategory[app.Category].push(app);
          }
        });

        console.log("Categorized apps:", appsByCategory);
        setCategorizedApps(appsByCategory);

        // Take one app from each category to feature
        let featured = [];
        Object.values(appsByCategory).forEach(apps => {
          if (apps.length > 0) {
            featured.push(apps[0]);
          }
        });

        // If we don't have enough, add some random apps
        if (featured.length < 6) {
          const remainingApps = appsData
            .filter(app => !featured.includes(app))
            .sort(() => 0.5 - Math.random())
            .slice(0, 6 - featured.length);
          
          featured = [...featured, ...remainingApps];
        }

        // Limit to 6 apps
        featured = featured.slice(0, 6);
        setFeaturedApps(featured);
        
        // Fetch categories or use default categories
        try {
          const categoriesResponse = await axios.get(categoriesEndpoint);
          // Make sure categoriesResponse.data is an array
          const categoriesData = Array.isArray(categoriesResponse.data) 
            ? categoriesResponse.data 
            : categoriesResponse.data?.data?.categories || [];
            
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error fetching categories:", error);
          // Default categories as fallback
          setCategories([
            { id: 1, Name: "Games", Logo: "🎮" },
            { id: 2, Name: "Productivity", Logo: "📊" },
            { id: 3, Name: "Education", Logo: "📚" },
            { id: 4, Name: "Entertainment", Logo: "🎬" },
            { id: 5, Name: "Utilities", Logo: "🔧" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback data for development
        setCategories([
          { id: 1, Name: "Games", Logo: "🎮" },
          { id: 2, Name: "Productivity", Logo: "📊" },
          { id: 3, Name: "Education", Logo: "📚" },
          { id: 4, Name: "Entertainment", Logo: "🎬" },
          { id: 5, Name: "Utilities", Logo: "🔧" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Helper function to get a placeholder image if Logo is invalid
  const getImageUrl = (logo) => {
    if (!logo || logo === "jj") {
      return "https://via.placeholder.com/400?text=App";
    }
    return logo;
  };

  // Handle horizontal scrolling for category rows
  const scrollRow = (categoryName, direction) => {
    const rowElement = categoryRowRefs.current[categoryName];
    if (rowElement) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      rowElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 overflow-hidden mb-10 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
        <div className="relative z-10 px-6 py-12 md:py-16 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
            Welcome to Mahfuz's Apps Store
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8">
            Discover the best apps and games developed by our community of talented developers.
          </p>
        </div>
      </div>
      
      {/* Categories */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          </div>
          <Link 
            to="/categories" 
            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map(category => (
              <Link 
                key={category.id || category._id}
                to={`/category/${category.id || category._id}`}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{category.Logo}</div>
                <span className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{category.Name}</span>
                <span className="text-xs text-gray-500 mt-1">
                  {apps.filter(app => app.Category === category.Name).length || 0} apps
                </span>
              </Link>
            ))
          ) : (
            <div className="col-span-5 text-center py-6 bg-white rounded-xl">
              <p className="text-gray-500">No categories available</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Apps */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Apps</h2>
          </div>
          <Link 
            to="/apps/featured" 
            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {featuredApps.map(app => (
            <div key={app._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
              <Link to={`/app/${app._id}`} className="block">
                <div className="relative">
                  <img
                    src={getImageUrl(app.Logo)}
                    alt={app.Name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-800 px-2 py-1 rounded-full shadow-sm flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                    <span>{app.Reviews?.length > 0 
                      ? (app.Reviews.reduce((sum, review) => sum + review.Rating, 0) / app.Reviews.length).toFixed(1) 
                      : "N/A"}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{app.Name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span>{app.Developer || "Unknown Developer"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      <span>{app.Category || "Uncategorized"}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Download className="h-3 w-3 mr-1" />
                      <span>{app.Downloads > 999 ? `${(app.Downloads/1000).toFixed(1)}K` : app.Downloads || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <button
                  onClick={() => navigate(`/app/${app._id}`)}
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Apps by Categories */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading apps...</p>
        </div>
      ) : (
        <>
          {Object.keys(categorizedApps).length > 0 ? (
            Object.entries(categorizedApps).map(([categoryName, categoryApps]) => (
              categoryApps.length > 0 && (
                <section key={categoryName} className="mb-12">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></div>
                        <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
                      </div>
                      <Link 
                        to={`/category/${categories.find(cat => cat.Name === categoryName)?.id || ''}`}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors ml-2"
                      >
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                    
                    <div className="relative group">
                      <button 
                        onClick={() => scrollRow(categoryName, 'left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-indigo-100 p-3 rounded-full shadow-md hover:bg-indigo-200 transition-colors border border-indigo-300 flex items-center justify-center opacity-0 group-hover:opacity-100 hidden md:flex"
                        style={{ left: "-18px" }}
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="h-6 w-6 text-indigo-700" />
                      </button>
                      
                      <div 
                        ref={el => categoryRowRefs.current[categoryName] = el}
                        className="flex overflow-x-auto pb-4 hide-scrollbar gap-4 px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {categoryApps.map(app => (
                          <div 
                            key={app._id} 
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden min-w-[200px] max-w-[200px] flex-shrink-0"
                          >
                            <Link to={`/app/${app._id}`} className="block">
                              <div className="relative">
                                <img
                                  src={getImageUrl(app.Logo)}
                                  alt={app.Name}
                                  className="w-full aspect-square object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-800 px-2 py-1 rounded-full shadow-sm flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                                  <span>{app.Reviews?.length > 0 
                                    ? (app.Reviews.reduce((sum, review) => sum + review.Rating, 0) / app.Reviews.length).toFixed(1) 
                                    : "N/A"}</span>
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{app.Name}</h3>
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                  <span>{app.Developer || "Unknown Developer"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <Download className="h-3 w-3 text-gray-500 mr-1" />
                                    <span className="text-xs text-gray-500">
                                      {app.Downloads > 999 ? `${(app.Downloads/1000).toFixed(1)}K` : app.Downloads || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => scrollRow(categoryName, 'right')}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-indigo-100 p-3 rounded-full shadow-md hover:bg-indigo-200 transition-colors border border-indigo-300 flex items-center justify-center opacity-0 group-hover:opacity-100 hidden md:flex"
                        style={{ right: "-18px" }}
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="h-6 w-6 text-indigo-700" />
                      </button>
                    </div>
                  </div>
                </section>
              )
            ))
          ) : (
            <div className="text-center py-6 bg-white rounded-xl mb-12">
              <p className="text-gray-500">No categorized apps available</p>
              <p className="text-xs text-gray-400 mt-2">Debug info: {JSON.stringify(Object.keys(categorizedApps))}</p>
            </div>
          )}
        </>
      )}
      
      {/* All Apps */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">All Apps</h2>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading apps...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No apps available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredApps.map(app => (
              <div key={app._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                <Link to={`/app/${app._id}`}>
                  <img
                    src={getImageUrl(app.Logo)}
                    alt={app.Name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{app.Name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <span>{app.Developer || "Unknown Developer"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="text-xs font-medium">
                          {app.Reviews?.length > 0 
                            ? (app.Reviews.reduce((sum, review) => sum + review.Rating, 0) / app.Reviews.length).toFixed(1) 
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Download className="h-3 w-3 mr-1" />
                        <span>{app.Downloads > 999 ? `${(app.Downloads/1000).toFixed(1)}K` : app.Downloads || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => navigate(`/app/${app._id}`)}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard; 