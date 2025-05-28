import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full bg-gray-100">
        {/* Global Navbar */}
        <Navbar user={JSON.parse(localStorage.getItem("user"))} Logout={() => {
          sessionStorage.clear();
          localStorage.removeItem("user");
          window.location.href = "/login";
        }} />

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
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
