import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
