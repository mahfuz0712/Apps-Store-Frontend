import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const User = JSON.parse(localStorage.getItem("User"));
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn || !User) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && User.Role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
