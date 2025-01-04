import React, { createContext, useState, ReactNode, useContext } from "react";
import { useApi } from "../utils/api";
import { AxiosError } from "axios";

interface Message {
  id: string;
  content: string;
  username: string;
}

interface MessageContextProps {
  messages: Message[];
  fetchMessagesContext: (token: string, page?: number, perPage?: number) => Promise<Message[] | void>;
  addMessage: (message: Message) => void;
  loading: boolean;
  error: string | null;
}

interface MessageProviderProps {
  children: ReactNode;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const { fetchMessages } = useApi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessagesContext = async (token: string, page = 1, perPage = 10): Promise<Message[] | void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMessages(token, page, perPage);
      return response.data.messages;
    } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.msg) {
            setError(err.response.data.msg);
          } else {
            setError("An error occurred while fetching messages.");
          }
    } finally {
      setLoading(false);
    }
  };

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [message, ...prevMessages]);
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

export const useMessages = (): MessageContextProps => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};