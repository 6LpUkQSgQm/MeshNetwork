import React, { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { fetchCurrentUser, loginUser, registerUser } = useApi();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetchCurrentUser(token);
          setUser(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          logout();
        }
      }
    };

    fetchUser();
  }, [token]);

  const login = async (values) => {
    try {
      const response = await loginUser(values);
      const { access_token, user: userData } = response.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem("token", access_token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (values) => {
    try {
      const response = await registerUser(values);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);