import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import { useApi } from "../utils/api";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const { fetchMessages } = useApi();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMessagesContext = async (token, page = 1, perPage = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchMessages(token, page, perPage);
            return response.data
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError(err.response?.data?.msg || "An error occurred while fetching messages.");
        } finally {
            setLoading(false);
        }
    };

    const addMessage = (message) => {
        setMessages(message);
    };

    return (
        <MessageContext.Provider
            value={{
                messages,
                fetchMessagesContext,
                addMessage,
                loading,
                error,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

MessageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useMessages = () => React.useContext(MessageContext);