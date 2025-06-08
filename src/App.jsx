import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import UserManagement from "./pages/UserManagement";
import AppManagement from "./pages/AppManagement";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import OTP from "./pages/OTP";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

function App() {
  const User = JSON.parse(localStorage.getItem("User")) || null;
  
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("User");
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full bg-gray-100">
        {/* Global Navbar */}
        <Navbar
          User={User}
          Logout={handleLogout}
        />

        {/* Routes with Error Boundary */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Dashboard />
                </ErrorBoundary>
              }
            />
            <Route
              path="/login"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Login />
                </ErrorBoundary>
              }
            />
            <Route
              path="/otp"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <OTP />
                </ErrorBoundary>
              }
            />
            <Route
              path="/privacy"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <PrivacyPolicy />
                </ErrorBoundary>
              }
            />
            <Route
              path="/terms"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <TermsOfService />
                </ErrorBoundary>
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Profile />
                  </ErrorBoundary>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Settings />
                  </ErrorBoundary>
                </PrivateRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="Admin">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <AdminDashboard />
                  </ErrorBoundary>
                </PrivateRoute>
              }
            />
            <Route 
              path="/admin/users" 
              element={
                <PrivateRoute requiredRole="Admin">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <UserManagement />
                  </ErrorBoundary>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/apps" 
              element={
                <PrivateRoute requiredRole="Admin">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <AppManagement />
                  </ErrorBoundary>
                </PrivateRoute>
              } 
            />
            
            {/* Developer Routes */}
            <Route
              path="/developer/dashboard"
              element={
                <PrivateRoute requiredRole="Developer">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <DeveloperDashboard />
                  </ErrorBoundary>
                </PrivateRoute>
              }
            />
            <Route
              path="/developer/apps"
              element={
                <PrivateRoute requiredRole="Developer">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <AppManagement isDeveloper={true} />
                  </ErrorBoundary>
                </PrivateRoute>
              }
            />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
