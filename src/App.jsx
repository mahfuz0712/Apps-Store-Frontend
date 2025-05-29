import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import ApplicationForm from "./pages/ApplicationForm";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full bg-gray-100">
        {/* Global Navbar */}
        <Navbar
          user={JSON.parse(localStorage.getItem("user"))}
          Logout={() => {
            sessionStorage.clear();
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        />

        {/* Routes with Error Boundary */}
        <main className="flex-grow mt-4">
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Dashboard />
                </ErrorBoundary>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="admin">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <AdminDashboard />
                  </ErrorBoundary>
                </PrivateRoute>
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
              path="/application"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ApplicationForm />
                </ErrorBoundary>
              }
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
