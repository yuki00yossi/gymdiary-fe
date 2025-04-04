import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  // }, [isLoggedIn, navigate]);
  if (isLoading) {
    return <div>Loading...</div>; // ローディング中の表示を追加することもできます
  }

  if (isLoggedIn) {
    return children;
  } else {
    navigate("/login");
    return null; // ローディング中の表示を追加することもできます
  }
};

export default ProtectedRoute;
