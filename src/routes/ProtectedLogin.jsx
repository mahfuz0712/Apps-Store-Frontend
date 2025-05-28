import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function ProtectedLogin({ children }) {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn"); // Check if the user is logged in

  if (isLoggedIn) {
    // If  logged in, redirect to dashboard page
    return <Navigate to="/" />;
  } else {
    // If not logged in, render the child component (login)
    return children;
  }
}

// Add PropTypes validation for 'children'
ProtectedLogin.propTypes = {
  children: PropTypes.node.isRequired, // 'children' should be of type 'node' (React elements, strings, numbers, etc.)
};

export default ProtectedLogin;
