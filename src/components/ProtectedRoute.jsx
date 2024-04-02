import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  let childrenWithProps;
  // Checking isValidElement is the safe way and avoids a typescript error too.
  if (React.isValidElement(children)) {
    childrenWithProps = React.cloneElement(children, { user });
  }

  return <>{childrenWithProps}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
