import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, Calendar, User, Edit, LogOut } from "lucide-react";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve user details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch user data from your API here
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (authUser) {
          // For demo, using hardcoded values with the stored UserID
          setUser({
            _id: authUser.UserID,
            name: "Mohammad Mahfuz Rahman",
            firstName: "Mohammad",
            lastName: "Rahman",
            dob: "12 January, 1996",
            gender: "Male",
            location: "Dhaka, Bangladesh",
            phone: "+880 1540148390",
            email: "mahfuz@admin.com",
            bio: "Full-stack developer specializing in MERN stack applications. Creator of Mahfuz's App Store and other web applications.",
            role: authUser.Role || "User",
            joinedDate: "January 2023",
            profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
        <p className="text-gray-600 mb-6">Please log in to view your profile</p>
        <Button 
          variant="primary" 
          onClick={() => window.location.href = "/login"}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Cover with gradient */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-700"></div>
          
          <div className="relative px-6 pb-6">
            {/* Profile image */}
            <div className="absolute -top-16 flex justify-center">
              <div className="relative">
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full text-white">
                  <Edit size={16} />
                </div>
              </div>
            </div>
            
            {/* User info */}
            <div className="pt-20">
              <div className="flex flex-wrap justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-indigo-600 font-medium flex items-center">
                    <User size={16} className="mr-1" /> 
                    {user.role}
                  </p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    leftIcon={<Edit size={16} />}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    leftIcon={<LogOut size={16} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600">{user.bio}</p>
              
              <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-indigo-500" />
                  <span>Joined {user.joinedDate}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-indigo-500" />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Full Name</h3>
                <p className="text-gray-900">{user.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Date of Birth</h3>
                <p className="text-gray-900">{user.dob}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Gender</h3>
                <p className="text-gray-900">{user.gender}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                <p className="flex items-center text-gray-900">
                  <Mail size={16} className="mr-2 text-indigo-500" />
                  {user.email}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Phone Number</h3>
                <p className="flex items-center text-gray-900">
                  <Phone size={16} className="mr-2 text-indigo-500" />
                  {user.phone}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                <p className="flex items-center text-gray-900">
                  <MapPin size={16} className="mr-2 text-indigo-500" />
                  {user.location}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <Link 
                to="/settings" 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Profile Settings</h3>
                    <p className="text-sm text-gray-500">Update your personal information</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link 
                to="/settings/security" 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Security Settings</h3>
                    <p className="text-sm text-gray-500">Manage your password and account security</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              
              {user.role === "Developer" && (
                <Link 
                  to="/developer/dashboard" 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Developer Dashboard</h3>
                      <p className="text-sm text-gray-500">Manage your published apps</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
              
              {user.role === "Admin" && (
                <Link 
                  to="/admin" 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Admin Dashboard</h3>
                      <p className="text-sm text-gray-500">Manage the platform and users</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
