import { useError } from "../context/ErrorContext";
import axios, { AxiosError, AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://raspberrypi.local:5003/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface LoginValues {
  username: string;
  password: string;
}

interface RegisterValues {
  username: string;
  password: string;
  email: string;
}

interface Message {
  id: string;
  content: string;
  username: string;
}

interface FetchMessagesResponse {
  messages: Message[];
  page: number;
  pages: number;
}

interface User {
  id: string;
  username: string;
  email: string;
}

export const useApi = () => {
  const { showError } = useError();

  const loginUser = async (values: LoginValues): Promise<AxiosResponse> => {
    try {
      return await api.post("/login", values, { withCredentials: true });
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.msg) {
        showError(err.response.data.msg);
      } else {
        showError("Login failed.");
      }
      throw err;
    }
  };

  const registerUser = async (
    values: RegisterValues
  ): Promise<AxiosResponse> => {
    try {
      console.log("API URL utilisée :", process.env.REACT_APP_API_BASE_URL);
      return await api.post("/register", values);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.msg) {
        showError(err.response.data.msg);
      } else {
        showError("Registration failed.");
      }
      throw err;
    }
  };

  const fetchMessages = async (
    token: string,
    page: number,
    perPage: number
  ): Promise<AxiosResponse<FetchMessagesResponse>> => {
    try {
      return await api.get(`/messages?page=${page}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.msg) {
        showError(err.response.data.msg);
      }
      showError("Error fetching messages.");
      throw err;
    }
  };

  const sendMessage = async (
    token: string,
    content: string
  ): Promise<AxiosResponse> => {
    try {
      return await api.post(
        "/messages",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.msg) {
        showError(err.response.data.msg);
      } else {
        showError("Error adding message.");
      }
      throw err;
    }
  };

  const fetchCurrentUser = async (
    token: string
  ): Promise<AxiosResponse<User>> => {
    try {
      return await api.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.msg) {
        showError(err.response.data.msg);
      } else {
        showError("Error authenticating.");
      }
      throw err;
    }
  };

  return {
    loginUser,
    registerUser,
    fetchMessages,
    fetchCurrentUser,
    sendMessage,
  };
};
