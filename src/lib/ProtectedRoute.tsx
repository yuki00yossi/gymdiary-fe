import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return children;
  } else {
    return null;
  }
};

export default ProtectedRoute;
