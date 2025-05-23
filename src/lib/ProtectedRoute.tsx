import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn) {
    return children;
  } else {
    return null;
  }
};

export default ProtectedRoute;
