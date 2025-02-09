import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import MessageList from "./MessageList";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import { useMessages } from "../context/MessageContext";

interface Message {
  id: string;
  content: string;
  username: string;
  timestamp: number;
}

interface FetchMessagesResponse {
  messages: Message[];
  page: number;
  pages: number;
}

const Messages: React.FC = () => {
  const { token, user } = useAuth();
  const { fetchMessagesContext } = useMessages();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const socket = io(process.env.REACT_APP_API_URL!, {
    transports: ["websocket", "polling"],
    secure: true,
  });

  useEffect(() => {
    if (token) {
      loadInitialMessages();
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      navigate("/login", { replace: true });
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (token && user) {
      socket.on("new_message", (newMessage: Message) => {
        setMessages((prevMessages = []) => {
          const isDuplicate = prevMessages.some(
            (msg) => msg.id === newMessage.id
          );
          if (isDuplicate) {
            console.log("Duplicate message, skipping...");
            return prevMessages;
          }
          if (newMessage.username !== user.username) {
            triggerPushNotification(newMessage.content, newMessage.username);
          }
          return [newMessage, ...prevMessages];
        });
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [token, user]);

  const triggerPushNotification = async (content: string, sender: string) => {
    if (!("serviceWorker" in navigator)) {
      console.error("Service workers are not supported by this browser.");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) {
        console.warn("No active service worker found for notifications.");
        return;
      }

      const notificationTitle = "New Message";
      const notificationOptions = {
        body: `New message from ${sender}: ${content}`,
        icon: "/icon.png",
        badge: "/badge.png",
      };

      registration.showNotification(notificationTitle, notificationOptions);
    } catch (error) {
      console.error("Error triggering push notification:", error);
    }
  };

  const loadInitialMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchMessagesContext(token!, 1, 10) as FetchMessagesResponse | void;
      if (data) {
        setMessages(data.messages);
        setCurrentPage(2);
        setHasMore(data.page < data.pages);
      }
    } catch (error) {
      console.error("Failed to load initial messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const data = await fetchMessagesContext(token!, currentPage, 10) as FetchMessagesResponse | void;
      if (data) {
        setMessages((prevMessages) => [...prevMessages, ...data.messages]);
        setCurrentPage((prevPage) => prevPage + 1);
        setHasMore(data.page < data.pages);
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <InfiniteScroll
        dataLength={messages?.length}
        next={loadMoreMessages}
        hasMore={hasMore}
        loader={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "16px",
            }}
          >
            <CircularProgress />
          </div>
        }
      >
        <MessageList messages={messages} />
      </InfiniteScroll>
      {loading &&
        messages.length === 0 && ( // Loader pour le chargement initial
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <CircularProgress />
          </div>
        )}
    </div>
  );
};

export default Messages;