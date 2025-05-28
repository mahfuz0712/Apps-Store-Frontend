import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn"); // Check if the user is logged in

  if (!isLoggedIn) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  } 

  // If logged in, render the child component (Dashboard)
  return children;
}

// Add PropTypes validation for 'children'
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // 'children' should be of type 'node' (React elements, strings, numbers, etc.)
};

export default PrivateRoute;
