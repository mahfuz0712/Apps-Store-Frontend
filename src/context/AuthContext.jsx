import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../apis/v1/v1';

// Create the context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from session storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem('User'));
        const accessToken = sessionStorage.getItem('accessToken');
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

        if (storedUser && accessToken && isLoggedIn) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const loginUrl = import.meta.env.VITE_USER_LOGIN;
      const response = await api.post(loginUrl, {
        Email: email,
        Password: password,
      });

      if (response.data && response.data.success) {
        const userData = response.data.data;
        if (userData) {
          // Store user data
          const userInfo = {
            UserID: userData._id,
            Role: userData.Role || userData.role,
          };
          
          // Set in context
          setUser(userInfo);
          setIsAuthenticated(true);
          
          // Store in session storage
          sessionStorage.setItem('User', JSON.stringify(userInfo));
          
          // Store tokens
          if (response.data.accessToken) {
            sessionStorage.setItem('accessToken', response.data.accessToken);
          }
          
          if (response.data.refreshToken) {
            sessionStorage.setItem('refreshToken', response.data.refreshToken);
          }
          
          // Set login status
          sessionStorage.setItem('isLoggedIn', 'true');
          
          // Set role-specific flags
          const userRole = userData.Role || userData.role;
          if (userRole === 'Admin' || userRole === 'admin') {
            sessionStorage.setItem('isAdmin', 'true');
          } else if (userRole === 'Developer' || userRole === 'developer') {
            sessionStorage.setItem('isDeveloper', 'true');
          } else {
            sessionStorage.setItem('isUser', 'true');
          }
          
          return { success: true, role: userRole };
        }
      }
      return { success: false, message: response.data.message || 'Authentication failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear auth context
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear session storage
    sessionStorage.clear();
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshTokenValue = sessionStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const refreshUrl = import.meta.env.VITE_REFRESH_TOKEN;
      const response = await api.post(refreshUrl, {
        refreshToken: refreshTokenValue
      });

      if (response.data && response.data.success) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    
    // Handle case sensitivity and compare with the role property
    const userRole = user.Role || '';
    const roleToCheck = role || '';
    
    return userRole.toLowerCase() === roleToCheck.toLowerCase();
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 