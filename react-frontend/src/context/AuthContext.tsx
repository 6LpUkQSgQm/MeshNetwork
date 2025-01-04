import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useApi } from "../utils/api";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<RegisterResponse>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginValues {
  username: string;
  password: string;
}

interface RegisterValues {
  username: string;
  password: string;
  email: string;
}

interface RegisterResponse {
  user: User;
  access_token: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { fetchCurrentUser, loginUser, registerUser } = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);

  useEffect(() => {
    fetchUser();
  }, [token]);

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

  const login = async (values: LoginValues) => {
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

  const register = async (values: RegisterValues) => {
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
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, register, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
