import { useState, useEffect } from "react";
import { X, Settings as SettingsIcon, User, Key, Bell } from "lucide-react";

const Settings = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const openModal1 = () => setOpen1(true);
  const openModal2 = () => setOpen2(true);
  const closeModal1 = () => setOpen1(false);
  const closeModal2 = () => setOpen2(false);
  
  // Disable body scroll when modal is open
  useEffect(() => {
    if (open1 || open2) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open1, open2]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <div className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage your personal information and account preferences</p>
          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow"
            onClick={openModal1}
          >
            Manage Profile
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Key className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
          </div>
          <p className="text-gray-600 mb-4">Update your password and secure your account</p>
          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow"
            onClick={openModal2}
          >
            Security Settings
          </button>
        </div>
      </div>
      
      {/* Modal 1 */}
      {open1 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal1}></div>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-3xl z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <User className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
              </div>
              <button 
                onClick={closeModal1}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1 pl-1">
                  Bio
                </label>
                <textarea
                  placeholder="Tell us about yourself"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none h-32"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal1}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={closeModal1}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal 2 */}
      {open2 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal2}></div>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-3xl z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Key className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
              </div>
              <button 
                onClick={closeModal2}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 pl-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 pl-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1 pl-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal2}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={closeModal2}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
