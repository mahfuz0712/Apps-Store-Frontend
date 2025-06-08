import { useState, useEffect } from "react";
import Button from "../components/Button";
import { X, Plus, Search, Edit, Trash2, Check, XCircle, UserPlus, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../apis/v1/v1";
import React from "react";

function AdminDashboard() {
  // Developer Modal States
  const [showDevelopersModal, setShowDevelopersModal] = useState(false);
  const [showAppsModal, setShowAppsModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddDeveloperForm, setShowAddDeveloperForm] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Developer Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    joinedDate: "",
    status: "Pending"
  });

  // Apps Modal States
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [showAddAppForm, setShowAddAppForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [appSearchQuery, setAppSearchQuery] = useState("");
  
  // App Form states
  const [appFormData, setAppFormData] = useState({
    name: "",
    developerName: "",
    companyName: "",
    category: "",
    version: "1.0.0",
    status: "Pending"
  });

  // Users Modal States
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  
  // User Form states
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "User",
    joinedDate: "",
    status: "Active"
  });
  
  // Applicants Modal States
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantSearchQuery, setApplicantSearchQuery] = useState("");
  const [showApplicantDetails, setShowApplicantDetails] = useState(null);

  // Fetch data when modals open
  useEffect(() => {
    if (showDevelopersModal) {
      fetchDevelopers();
    }
    if (showAppsModal) {
      fetchApps();
    }
    if (showUsersModal) {
      fetchUsers();
    }
    if (showApplicantsModal) {
      fetchApplicants();
    }
  }, [showDevelopersModal, showAppsModal, showUsersModal, showApplicantsModal]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showDevelopersModal || showAppsModal || showUsersModal || showApplicantsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDevelopersModal, showAppsModal, showUsersModal, showApplicantsModal]);
  
  // Mock function to fetch developers - would be replaced with API call
  const fetchDevelopers = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(async () => {
      try {
        const UsersURL = import.meta.env.VITE_GET_USERS;
        console.log("Fetching developers from:", UsersURL);
        const response = await api.get(UsersURL);
        console.log("API Response:", response.data);
        
        // Check if response data structure is as expected
        if (response.data && Array.isArray(response.data.data)) {
          const allUsers = response.data.data;
          console.log("All users:", allUsers);
          
          // Filter out only users with Role "Developer"
          const developerUsers = allUsers.filter(user => user.Role === "Developer");
          console.log("Developer users:", developerUsers);
          
          // Map the API response to match the expected property names
          const mappedDevelopers = developerUsers.map(dev => ({
            id: dev._id || dev.id,
            name: dev.Name || dev.name || 'Unknown',
            email: dev.Email || dev.email || 'No email',
            phone: dev.Phone || dev.phone || "N/A",
            joinedDate: dev.createdAt ? new Date(dev.createdAt).toLocaleDateString() : "N/A",
            status: dev.Status || dev.status || "Active",
            apps: 0 // Default value
          }));
          
          console.log("Mapped developers:", mappedDevelopers);
          setDevelopers(mappedDevelopers);
        } else {
          console.error("Invalid response format:", response.data);
          setDevelopers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setDevelopers([]);
      }
      setLoading(false);
    }, 800);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Add new developer
  const handleAddDeveloper = (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In real app, this would be an API call
    const newDeveloper = {
      id: Date.now().toString(),
      ...formData,
      apps: 0
    };
    
    setDevelopers([...developers, newDeveloper]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      joinedDate: "",
      status: "Pending"
    });
    setShowAddDeveloperForm(false);
    toast.success("Developer added successfully");
  };
  
  // Start editing a developer
  const startEdit = (developer) => {
    setEditingDeveloper(developer.id);
    setFormData({
      name: developer.name || '',
      email: developer.email || '',
      phone: developer.phone || '',
      joinedDate: developer.joinedDate || '',
      status: developer.status || 'Active'
    });
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingDeveloper(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      joinedDate: "",
      status: "Pending"
    });
  };
  
  // Update developer
  const handleUpdateDeveloper = (id) => {
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In real app, this would be an API call
    const updatedDevelopers = developers.map(dev => 
      dev.id === id ? { ...dev, ...formData } : dev
    );
    
    setDevelopers(updatedDevelopers);
    setEditingDeveloper(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      joinedDate: "",
      status: "Pending"
    });
    toast.success("Developer updated successfully");
  };
  
  // Delete developer
  const handleDeleteDeveloper = (id) => {
    if (window.confirm("Are you sure you want to delete this developer?")) {
      // In real app, this would be an API call
      const filteredDevelopers = developers.filter(dev => dev.id !== id);
      setDevelopers(filteredDevelopers);
      toast.success("Developer deleted successfully");
    }
  };
  
  // Filter developers based on search
  const filteredDevelopers = developers.filter(dev => {
    if (!dev) return false;
    
    // Check if properties exist before calling toLowerCase()
    const name = dev.name || '';
    const email = dev.email || '';
    const status = dev.status || '';
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           status.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Fetch apps from API
  const fetchApps = () => {
    setAppsLoading(true);
    setTimeout(async() => {
      try {
        const AppsURL = import.meta.env.VITE_GET_APPS;
        console.log("Fetching apps from:", AppsURL);
        const response = await api.get(AppsURL);
        console.log("API Response:", response.data);
        
        // Ensure we have an array of apps
        let appData = [];
        if (response.data && response.data.data) {
          // If data.appsList exists, use that (from the API response)
          if (response.data.data.appsList && Array.isArray(response.data.data.appsList)) {
            appData = response.data.data.appsList.map(app => ({
              id: app._id,
              name: app.Name,
              developerName: app.Publisher?.DevelopedBy || 'Unknown',
              companyName: app.Publisher?.CompanyName || 'Unknown',
              category: app.Category,
              status: 'Approved', // Default status
              version: app.Version,
              description: app.Description || '',
              downloads: app.Downloads || 0,
              githubUsername: app.GithubUsername,
              repoName: app.RepoName,
              released: app.Released ? new Date(app.Released).toLocaleDateString() : 'N/A'
            }));
          } else if (Array.isArray(response.data.data)) {
            appData = response.data.data.map(app => ({
              id: app._id,
              name: app.Name,
              developerName: app.Publisher?.DevelopedBy || 'Unknown',
              companyName: app.Publisher?.CompanyName || 'Unknown',
              category: app.Category,
              status: 'Approved', // Default status
              version: app.Version,
              description: app.Description || '',
              downloads: app.Downloads || 0,
              githubUsername: app.GithubUsername,
              repoName: app.RepoName,
              released: app.Released ? new Date(app.Released).toLocaleDateString() : 'N/A'
            }));
          } else if (typeof response.data.data === 'object') {
            // If it's an object but not an array, try to extract values
            appData = Object.values(response.data.data).map(app => {
              if (!app) return null;
              return {
                id: app._id,
                name: app.Name,
                developerName: app.Publisher?.DevelopedBy || 'Unknown',
                companyName: app.Publisher?.CompanyName || 'Unknown',
                category: app.Category,
                status: 'Approved', // Default status
                version: app.Version,
                description: app.Description || '',
                downloads: app.Downloads || 0,
                githubUsername: app.GithubUsername,
                repoName: app.RepoName,
                released: app.Released ? new Date(app.Released).toLocaleDateString() : 'N/A'
              };
            }).filter(Boolean);
          }
        }
        
        console.log("Processed app data:", appData);
        setApps(appData);
      } catch (error) {
        console.error("Error fetching apps:", error);
        setApps([]);
      }
      setAppsLoading(false);
    }, 800);
  };
  
  // Handle app form input changes
  const handleAppInputChange = (e) => {
    const { name, value } = e.target;
    setAppFormData({
      ...appFormData,
      [name]: value
    });
  };
  
  // Add new app
  const handleAddApp = (e) => {
    e.preventDefault();
    // Validate form
    if (!appFormData.name || !appFormData.developerName || !appFormData.category || !appFormData.version) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Get developer name
    const developer = developers.find(dev => dev.id === appFormData.developerId);
    
    // In real app, this would be an API call
    const newApp = {
      id: Date.now().toString(),
      ...appFormData,
      developerName: developer ? developer.name : "Unknown Developer",
      downloads: 0
    };
    
    setApps([...apps, newApp]);
    setAppFormData({
      name: "",
      developerName: "",
      companyName: "",
      category: "",
      version: "1.0.0",
      status: "Pending"
    });
    setShowAddAppForm(false);
    toast.success("App added successfully");
  };
  
  // Start editing an app
  const startAppEdit = (app) => {
    setEditingApp(app.id || app._id);
    setAppFormData({
      name: app.name || app.Name || '',
      developerName: app.developerName || app.DeveloperName || '',
      companyName: app.companyName || app.CompanyName || '',
      category: app.category || app.Category || '',
      version: app.version || app.Version || '1.0.0',
      status: app.status || app.Status || 'Pending'
    });
  };
  
  // Cancel editing app
  const cancelAppEdit = () => {
    setEditingApp(null);
    setAppFormData({
      name: "",
      developerName: "",
      companyName: "",
      category: "",
      version: "1.0.0",
      status: "Pending"
    });
  };
  
  // Update app
  const handleUpdateApp = (id) => {
    // Validate form
    if (!appFormData.name || !appFormData.developerName || !appFormData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!Array.isArray(apps)) {
      toast.error("Unable to update app: Invalid data structure");
      return;
    }
    
    // In real app, this would be an API call
    const updatedApps = apps.map(app => 
      (app.id === id || app._id === id) ? { 
        ...app, 
        name: appFormData.name,
        developerName: appFormData.developerName,
        companyName: appFormData.companyName,
        category: appFormData.category,
        version: appFormData.version,
        status: appFormData.status,
        description: appFormData.description
      } : app
    );
    
    setApps(updatedApps);
    setEditingApp(null);
    setAppFormData({
      name: "",
      developerName: "",
      companyName: "",
      category: "",
      version: "1.0.0",
      status: "Pending"
    });
    toast.success("App updated successfully");
  };
  
  // Delete app
  const handleDeleteApp = (id) => {
    if (window.confirm("Are you sure you want to delete this app?")) {
      // In real app, this would be an API call
      if (!Array.isArray(apps)) {
        toast.error("Unable to delete app: Invalid data structure");
        return;
      }
      const filteredApps = apps.filter(app => app.id !== id && app._id !== id);
      setApps(filteredApps);
      toast.success("App deleted successfully");
    }
  };
  
  // Filter apps based on search
  const filteredApps = Array.isArray(apps) ? apps.filter(app => {
    if (!app) return false;
    
    // Check if properties exist before calling toLowerCase()
    const name = app.name || app.Name || '';
    const developerName = app.developerName || app.DeveloperName || '';
    const category = app.category || app.Category || '';
    const status = app.status || app.Status || '';
    
    return name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
           developerName.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
           category.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
           status.toLowerCase().includes(appSearchQuery.toLowerCase());
  }) : [];

  // Fetch users from API
  const fetchUsers = () => {
    setUsersLoading(true);
    setTimeout(async () => {
      try {
        const UsersURL = import.meta.env.VITE_GET_USERS;
        console.log("Fetching users from:", UsersURL);
        const response = await api.get(UsersURL);
        console.log("API Response for users:", response.data);
        
        // Check if response data structure is as expected
        if (response.data && Array.isArray(response.data.data)) {
          const allUsers = response.data.data;
          console.log("All users:", allUsers);
          
          // Map the API response to match the expected property names
          const mappedUsers = allUsers.map(user => ({
            id: user._id || user.id,
            name: user.Name || user.name || 'Unknown',
            email: user.Email || user.email || 'No email',
            role: user.Role || user.role || "User",
            phone: user.Phone || user.phone || "N/A",
            joinedDate: user.Joined ? new Date(user.Joined).toLocaleDateString() : "N/A",
            status: user.AccountStatus || user.status || "Active",
            lastLogin: user.LastLogin ? new Date(user.LastLogin).toLocaleDateString() : "Never"
          }));
          
          console.log("Mapped users:", mappedUsers);
          setUsers(mappedUsers);
        } else {
          console.error("Invalid response format:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
      setUsersLoading(false);
    }, 800);
  };
  
  // Handle user form input changes
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value
    });
  };
  
  // Add new user
  const handleAddUser = (e) => {
    e.preventDefault();
    // Validate form
    if (!userFormData.name || !userFormData.email || !userFormData.role) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In real app, this would be an API call
    const newUser = {
      id: Date.now().toString(),
      ...userFormData,
      lastLogin: "Never"
    };
    
    setUsers([...users, newUser]);
    setUserFormData({
      name: "",
      email: "",
      role: "User",
      joinedDate: "",
      status: "Active"
    });
    setShowAddUserForm(false);
    toast.success("User added successfully");
  };
  
  // Start editing a user
  const startUserEdit = (user) => {
    setEditingUser(user.id);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      joinedDate: user.joinedDate,
      status: user.status
    });
  };
  
  // Cancel editing user
  const cancelUserEdit = () => {
    setEditingUser(null);
    setUserFormData({
      name: "",
      email: "",
      role: "User",
      joinedDate: "",
      status: "Active"
    });
  };
  
  // Update user
  const handleUpdateUser = (id) => {
    // Validate form
    if (!userFormData.name || !userFormData.email || !userFormData.role) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In real app, this would be an API call
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...userFormData } : user
    );
    
    setUsers(updatedUsers);
    setEditingUser(null);
    setUserFormData({
      name: "",
      email: "",
      role: "User",
      joinedDate: "",
      status: "Active"
    });
    toast.success("User updated successfully");
  };
  
  // Delete user
  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // In real app, this would be an API call
      const filteredUsers = users.filter(user => user.id !== id);
      setUsers(filteredUsers);
      toast.success("User deleted successfully");
    }
  };
  
  // Filter users based on search
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!user) return false;
    
    // Check if properties exist before calling toLowerCase()
    const name = user.name || '';
    const email = user.email || '';
    const role = user.role || '';
    const status = user.status || '';
    
    return name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
           email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
           role.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
           status.toLowerCase().includes(userSearchQuery.toLowerCase());
  }) : [];

  // Fetch applicants from API
  const fetchApplicants = () => {
    setApplicantsLoading(true);
    setTimeout(async () => {
      try {
        const ApplicantsURL = import.meta.env.VITE_GET_APPLICANTS;
        console.log("Fetching applicants from:", ApplicantsURL);
        const response = await api.get(ApplicantsURL);
        console.log("API Response for applicants:", response.data);
        
        // Check if response data structure is as expected
        if (response.data && Array.isArray(response.data.data)) {
          const allApplicants = response.data.data;
          console.log("All applicants:", allApplicants);
          
          // Map the API response to match the expected property names
          const mappedApplicants = allApplicants.map(applicant => ({
            id: applicant._id || applicant.id,
            name: applicant.Name || applicant.name || 'Unknown',
            email: applicant.Email || applicant.email || 'No email',
            phone: applicant.Phone || applicant.phone || 'N/A',
            appliedFor: 'Developer', // Default value since it's not in the model
            appliedDate: applicant.Applied ? new Date(applicant.Applied).toLocaleDateString() : 'N/A',
            status: 'Pending Review', // Default status
            bkashTransactionID: applicant.BkashTransactionID || 'N/A',
            experience: 'Not specified', // Not in the model
            skills: [], // Not in the model
            portfolio: 'Not provided', // Not in the model
            resume: 'Not uploaded', // Not in the model
            coverLetter: 'Not provided' // Not in the model
          }));
          
          console.log("Mapped applicants:", mappedApplicants);
          setApplicants(mappedApplicants);
        } else {
          console.error("Invalid response format:", response.data);
          setApplicants([]);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setApplicants([]);
      }
      setApplicantsLoading(false);
    }, 800);
  };
  
  // Handle applicant approval
  const handleApproveApplicant = (id) => {
    // In real app, this would be an API call
    const updatedApplicants = applicants.map(applicant => 
      applicant.id === id ? { ...applicant, status: "Approved" } : applicant
    );
    
    setApplicants(updatedApplicants);
    toast.success("Applicant approved successfully");
  };
  
  // Handle applicant rejection
  const handleRejectApplicant = (id) => {
    // In real app, this would be an API call
    const updatedApplicants = applicants.map(applicant => 
      applicant.id === id ? { ...applicant, status: "Rejected" } : applicant
    );
    
    setApplicants(updatedApplicants);
    toast.success("Applicant rejected");
  };
  
  // Schedule interview
  const handleScheduleInterview = (id) => {
    // In real app, this would open a scheduling dialog
    const updatedApplicants = applicants.map(applicant => 
      applicant.id === id ? { ...applicant, status: "Interview Scheduled" } : applicant
    );
    
    setApplicants(updatedApplicants);
    toast.success("Interview scheduled successfully");
  };
  
  // Delete applicant
  const handleDeleteApplicant = (id) => {
    if (window.confirm("Are you sure you want to delete this applicant?")) {
      // In real app, this would be an API call
      if (!Array.isArray(applicants)) {
        toast.error("Unable to delete applicant: Invalid data structure");
        return;
      }
      const filteredApplicants = applicants.filter(applicant => applicant.id !== id && applicant._id !== id);
      setApplicants(filteredApplicants);
      toast.success("Applicant deleted successfully");
    }
  };
  
  // Toggle applicant details view
  const toggleApplicantDetails = (id) => {
    setShowApplicantDetails(showApplicantDetails === id ? null : id);
  };
  
  // Filter applicants based on search
  const filteredApplicants = Array.isArray(applicants) ? applicants.filter(applicant => {
    if (!applicant) return false;
    
    // Check if properties exist before calling toLowerCase()
    const name = applicant.name || '';
    const email = applicant.email || '';
    const appliedFor = applicant.appliedFor || '';
    const status = applicant.status || '';
    
    return name.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
           email.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
           appliedFor.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
           status.toLowerCase().includes(applicantSearchQuery.toLowerCase());
  }) : [];

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] py-12 pt-24 bg-gray-50">
      <h1 className="text-3xl font-bold mb-3 text-gray-900">Admin Dashboard</h1>
      <p className="text-md text-gray-700">Welcome to the Admin Dashboard!</p>
      <p className="text-sm text-gray-500 mt-1 mb-5">Manage your platform from here.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          variant="primary"
          size="md"
          onClick={() => setShowUsersModal(true)}
          leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>}
        >
          Manage Users
        </Button>
        <Button 
          variant="primary"
          size="md"
          onClick={() => setShowDevelopersModal(true)}
          leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
        >
          Manage Developers
        </Button>
        <Button 
          variant="primary"
          size="md"
          onClick={() => setShowAppsModal(true)}
          leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>}
        >
          Manage Apps
        </Button>
        <Button 
          variant="primary"
          size="md"
          onClick={() => setShowApplicantsModal(true)}
          leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 18h6"></path><path d="M9 10h6"></path></svg>}
        >
          Manage Applicants
        </Button>
      </div>

      {/* Developers Modal */}
      {showDevelopersModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white p-0 rounded-xl shadow-2xl w-full max-w-5xl z-10 animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Manage Developers
              </h2>
              <button
                onClick={() => setShowDevelopersModal(false)}
                className="text-white/80 hover:text-white focus:outline-none bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search developers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<UserPlus size={16} />}
                  onClick={() => setShowAddDeveloperForm(!showAddDeveloperForm)}
                >
                  {showAddDeveloperForm ? "Cancel" : "Add Developer"}
                </Button>
              </div>
              
              {/* Add Developer Form */}
              {showAddDeveloperForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Developer</h3>
                  <form onSubmit={handleAddDeveloper} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => setShowAddDeveloperForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                      >
                        Add Developer
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Developers Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Developer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Apps
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                            </div>
                          </td>
                        </tr>
                      ) : filteredDevelopers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No developers found
                          </td>
                        </tr>
                      ) : (
                        filteredDevelopers.map((developer) => (
                          <tr key={developer.id} className="hover:bg-gray-50">
                            {editingDeveloper === developer.id ? (
                              // Edit mode
                              <td colSpan="5" className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Full Name
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Email Address
                                    </label>
                                    <input
                                      type="email"
                                      name="email"
                                      value={formData.email}
                                      onChange={handleInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Phone Number
                                    </label>
                                    <input
                                      type="text"
                                      name="phone"
                                      value={formData.phone}
                                      onChange={handleInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Status
                                    </label>
                                    <select
                                      name="status"
                                      value={formData.status}
                                      onChange={handleInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Active">Active</option>
                                      <option value="Suspended">Suspended</option>
                                    </select>
                                  </div>
                                </div>
                              </td>
                            ) : (
                              // Display mode
                              <>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <span className="text-indigo-700 font-medium text-sm">
                                        {developer.name && typeof developer.name === 'string' 
                                          ? developer.name.split(' ').map(n => n[0]).join('')
                                          : 'NA'}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{developer.name || 'Unknown'}</div>
                                      <div className="text-sm text-gray-500 flex items-center">
                                        <Mail className="h-3 w-3 mr-1" />
                                        {developer.email || 'No email'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 flex items-center">
                                    <Phone className="h-3 w-3 mr-1 text-gray-500" />
                                    {developer.phone || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                                    {developer.joinedDate || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${developer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                      developer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                    {developer.status || 'Unknown'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {typeof developer.apps === 'number' ? developer.apps : 0}
                                </td>
                              </>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {editingDeveloper === developer.id ? (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleUpdateDeveloper(developer.id)}
                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="text-gray-600 hover:text-gray-900 bg-gray-50 p-1 rounded"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => startEdit(developer)}
                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDeveloper(developer.id)}
                                    className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDevelopersModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apps Modal */}
      {showAppsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white p-0 rounded-xl shadow-2xl w-full max-w-5xl z-10 animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Manage Apps
              </h2>
              <button
                onClick={() => setShowAppsModal(false)}
                className="text-white/80 hover:text-white focus:outline-none bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search apps..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={appSearchQuery}
                    onChange={(e) => setAppSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus size={16} />}
                  onClick={() => setShowAddAppForm(!showAddAppForm)}
                >
                  {showAddAppForm ? "Cancel" : "Add App"}
                </Button>
              </div>
              
              {/* Add App Form */}
              {showAddAppForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New App</h3>
                  <form onSubmit={handleAddApp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        App Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={appFormData.name}
                        onChange={handleAppInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Developer Name *
                      </label>
                      <input
                        type="text"
                        name="developerName"
                        value={appFormData.developerName}
                        onChange={handleAppInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={appFormData.companyName}
                        onChange={handleAppInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={appFormData.category}
                        onChange={handleAppInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Games">Games</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Utility">Utilities</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Version *
                      </label>
                      <input
                        type="text"
                        name="version"
                        value={appFormData.version}
                        onChange={handleAppInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={appFormData.status}
                        onChange={handleAppInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={appFormData.description}
                        onChange={handleAppInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      ></textarea>
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => setShowAddAppForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                      >
                        Add App
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Apps Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          App
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Developer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appsLoading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                            </div>
                          </td>
                        </tr>
                      ) : filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No apps found
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app) => (
                          <tr key={app.id || app._id} className="hover:bg-gray-50">
                            {editingApp === app.id || editingApp === app._id ? (
                              // Edit mode
                              <td colSpan="5" className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      App Name
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      value={appFormData.name}
                                      onChange={handleAppInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Developer Name
                                    </label>
                                    <input
                                      type="text"
                                      name="developerName"
                                      value={appFormData.developerName}
                                      onChange={handleAppInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Company Name
                                    </label>
                                    <input
                                      type="text"
                                      name="companyName"
                                      value={appFormData.companyName}
                                      onChange={handleAppInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Category
                                    </label>
                                    <select
                                      name="category"
                                      value={appFormData.category}
                                      onChange={handleAppInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    >
                                      <option value="">Select a category</option>
                                      <option value="Games">Games</option>
                                      <option value="Productivity">Productivity</option>
                                      <option value="Education">Education</option>
                                      <option value="Entertainment">Entertainment</option>
                                      <option value="Utility">Utilities</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Version
                                    </label>
                                    <input
                                      type="text"
                                      name="version"
                                      value={appFormData.version}
                                      onChange={handleAppInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Status
                                    </label>
                                    <select
                                      name="status"
                                      value={appFormData.status}
                                      onChange={handleAppInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </div>
                                </div>
                              </td>
                            ) : (
                              // Display mode
                              <>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                      <span className="text-indigo-700 font-medium text-sm">
                                        {(app.name || app.Name || 'A').charAt(0)}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{app.name || app.Name || 'Unknown'}</div>
                                      <div className="text-sm text-gray-500">
                                        {app.version || app.Version || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {app.developerName || app.DeveloperName || 'Unknown'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {app.category || app.Category || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${(app.status || app.Status) === 'Approved' ? 'bg-green-100 text-green-800' : 
                                      (app.status || app.Status) === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                    {app.status || app.Status || 'Unknown'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {typeof (app.downloads || app.Downloads) === 'number' 
                                    ? (app.downloads || app.Downloads).toLocaleString() 
                                    : '0'}
                                </td>
                              </>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {editingApp === app.id || editingApp === app._id ? (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleUpdateApp(app.id)}
                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={cancelAppEdit}
                                    className="text-gray-600 hover:text-gray-900 bg-gray-50 p-1 rounded"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => startAppEdit(app)}
                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteApp(app.id || app._id)}
                                    className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowAppsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white p-0 rounded-xl shadow-2xl w-full max-w-5xl z-10 animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                Manage Users
              </h2>
              <button
                onClick={() => setShowUsersModal(false)}
                className="text-white/80 hover:text-white focus:outline-none bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<UserPlus size={16} />}
                  onClick={() => setShowAddUserForm(!showAddUserForm)}
                >
                  {showAddUserForm ? "Cancel" : "Add User"}
                </Button>
              </div>
              
              {/* Add User Form */}
              {showAddUserForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
                  <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={userFormData.name}
                        onChange={handleUserInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={userFormData.email}
                        onChange={handleUserInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={userFormData.role}
                        onChange={handleUserInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="User">User</option>
                        <option value="Developer">Developer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={userFormData.status}
                        onChange={handleUserInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Banned">Banned</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => setShowAddUserForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                      >
                        Add User
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Users Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usersLoading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                            </div>
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            {editingUser === user.id ? (
                              // Edit mode
                              <td colSpan="5" className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Full Name
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      value={userFormData.name}
                                      onChange={handleUserInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Email Address
                                    </label>
                                    <input
                                      type="email"
                                      name="email"
                                      value={userFormData.email}
                                      onChange={handleUserInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Role
                                    </label>
                                    <select
                                      name="role"
                                      value={userFormData.role}
                                      onChange={handleUserInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                      <option value="User">User</option>
                                      <option value="Developer">Developer</option>
                                      <option value="Admin">Admin</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Status
                                    </label>
                                    <select
                                      name="status"
                                      value={userFormData.status}
                                      onChange={handleUserInputChange}
                                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                      <option value="Active">Active</option>
                                      <option value="Suspended">Suspended</option>
                                      <option value="Banned">Banned</option>
                                    </select>
                                  </div>
                                </div>
                              </td>
                            ) : (
                              // Display mode
                              <>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <span className="text-indigo-700 font-medium text-sm">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                      <div className="text-sm text-gray-500 flex items-center">
                                        <Mail className="h-3 w-3 mr-1" />
                                        {user.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                                      user.role === 'Developer' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-gray-100 text-gray-800'}`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                                    {user.joinedDate}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.lastLogin}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                      user.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                    {user.status}
                                  </span>
                                </td>
                              </>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {editingUser === user.id ? (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleUpdateUser(user.id)}
                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={cancelUserEdit}
                                    className="text-gray-600 hover:text-gray-900 bg-gray-50 p-1 rounded"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => startUserEdit(user)}
                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowUsersModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white p-0 rounded-xl shadow-2xl w-full max-w-5xl z-10 animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 14h6"></path>
                  <path d="M9 18h6"></path>
                  <path d="M9 10h6"></path>
                </svg>
                Manage Applicants
              </h2>
              <button
                onClick={() => setShowApplicantsModal(false)}
                className="text-white/80 hover:text-white focus:outline-none bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={applicantSearchQuery}
                    onChange={(e) => setApplicantSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setApplicantSearchQuery("Pending Review")}
                  >
                    Filter: Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setApplicantSearchQuery("Interview Scheduled")}
                  >
                    Filter: Interviews
                  </Button>
                </div>
              </div>
              
              {/* Applicants Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applicant
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applicantsLoading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                            </div>
                          </td>
                        </tr>
                      ) : filteredApplicants.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No applicants found
                          </td>
                        </tr>
                      ) : (
                        filteredApplicants.map((applicant) => (
                          <React.Fragment key={applicant.id || applicant._id}>
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-700 font-medium text-sm">
                                      {applicant.name && typeof applicant.name === 'string' 
                                        ? applicant.name.split(' ').map(n => n[0]).join('') 
                                        : 'NA'}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {applicant.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{applicant.appliedFor}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{applicant.appliedDate}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${applicant.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                    applicant.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 
                                    applicant.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'}`}>
                                  {applicant.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => toggleApplicantDetails(applicant.id)}
                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                                    title="View Details"
                                  >
                                    {showApplicantDetails === applicant.id ? 
                                      <X className="h-4 w-4" /> : 
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    }
                                  </button>
                                  
                                  {applicant.status === 'Pending Review' && (
                                    <>
                                      <button
                                        onClick={() => handleApproveApplicant(applicant.id)}
                                        className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"
                                        title="Approve"
                                      >
                                        <Check className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleScheduleInterview(applicant.id)}
                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1 rounded"
                                        title="Schedule Interview"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                      </button>
                                      <button
                                        onClick={() => handleRejectApplicant(applicant.id)}
                                        className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                                        title="Reject"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}
                                  
                                  <button
                                    onClick={() => handleDeleteApplicant(applicant.id)}
                                    className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            
                            {/* Expanded Details View */}
                            {showApplicantDetails === applicant.id && (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 bg-gray-50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Experience</h4>
                                      <p className="text-sm text-gray-600">{applicant.experience || 'Not specified'}</p>
                                      
                                      <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-2">Skills</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {Array.isArray(applicant.skills) && applicant.skills.length > 0 ? (
                                          applicant.skills.map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                              {skill}
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-sm text-gray-500">No skills listed</span>
                                        )}
                                      </div>
                                      
                                      <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-2">Transaction ID</h4>
                                      <p className="text-sm text-gray-600">{applicant.bkashTransactionID || 'Not available'}</p>
                                      
                                      <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-2">Portfolio</h4>
                                      {applicant.portfolio && applicant.portfolio !== 'Not provided' ? (
                                        <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                                          {applicant.portfolio}
                                        </a>
                                      ) : (
                                        <p className="text-sm text-gray-500">No portfolio provided</p>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Cover Letter</h4>
                                      <p className="text-sm text-gray-600">
                                        {applicant.coverLetter && applicant.coverLetter !== 'Not provided' 
                                          ? `${applicant.coverLetter.substring(0, 150)}...` 
                                          : 'No cover letter provided'}
                                      </p>
                                      
                                      <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-2">Contact Information</h4>
                                      <p className="text-sm text-gray-600">
                                        <strong>Email:</strong> {applicant.email}<br />
                                        <strong>Phone:</strong> {applicant.phone || 'Not provided'}
                                      </p>
                                      
                                      <div className="mt-4 flex space-x-2">
                                        <button className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md hover:bg-indigo-200 flex items-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                          Download Resume
                                        </button>
                                        <button className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md hover:bg-indigo-200 flex items-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                          Send Email
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowApplicantsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
