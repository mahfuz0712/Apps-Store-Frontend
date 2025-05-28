import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/LoginAndSignUp";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import OTPVerification from "./pages/OTP";
import NotFound from "./pages/NotFound";
import AppDetails from "./pages/AppsDetails.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx"; // Import the PrivateRoute component
import ProtectedLogin from "./routes/ProtectedLogin.jsx";
import ProtectedOTP from "./routes/ProtectedOTP.jsx";

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/app-details/:appName" element={<AppDetails />} />

        {/* Protected Route */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Protected Route */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Protected Route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Protected Login Route */}
        <Route
          path="/login"
          element={
            <ProtectedLogin>
              <Login />
            </ProtectedLogin>
          }
        />
        {/* Protected OTP Route */}
        <Route
          path="/otp"
          element={
            <ProtectedOTP>
              <OTPVerification />
            </ProtectedOTP>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
