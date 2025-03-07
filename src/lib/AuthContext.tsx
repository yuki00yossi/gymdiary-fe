import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface AuthContextType {
  isLoggedIn: boolean; // ログイン状態
  setIsLoggedIn: (status: boolean) => void;

  apiFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_ROOT + "/account/me",
          {
            credentials: "include",
          }
        );

        console.log(response.ok);

        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error("ログインチェックエラー");
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      if (response.status === 403) {
        setIsLoggedIn(false);
        navigate("/login");
      }

      return response;
    } catch (error) {
      console.error("APIエラーが発生しました。");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthはAuthProvider内で使用する必要があります。");
  }
  return context;
};
