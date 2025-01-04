import { useError } from "../context/ErrorContext";
import axios from "axios"

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const useApi = () => {
    const { showError } = useError();

    const loginUser = async (values) => {
        try {
            return await api.post("/login", values, { withCredentials: true });
        } catch (error) {
            showError(error.response?.data?.msg || "Login failed.");
            throw error;
        }
    };

    const registerUser = async (values) => {
        try {
            return await api.post("/register", values);
        } catch (error) {
            showError(error.response?.data?.msg || "Registration failed.");
            throw error;
        }
    };

    const fetchMessages = async (token, page, perPage) => {
        try {
            return await api.get(`/messages?page=${page}&per_page=${perPage}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            showError(error.response?.data?.msg || "Error fetching messages.");
            throw error;
        }
    };

    const sendMessage = async (token, content) => {
        try {
            return await api.post(
                "/messages",
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            showError(error.response?.data?.msg || "Error adding message.");
            throw error;
        }
    };

    const fetchCurrentUser = async (token) => {
        try {
            return await api.get("/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            showError(error.response?.data?.msg || "Error authenticating.");
            throw error;
        }
    };

    return { loginUser, registerUser, fetchMessages, fetchCurrentUser, sendMessage };
};