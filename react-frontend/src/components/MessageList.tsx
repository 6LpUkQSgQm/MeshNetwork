import React from "react";
import { List, ListItem, Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@mui/material/styles";

interface Message {
  id: string;
  content: string;
  username: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages = [] }) => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <List sx={{ padding: 2 }}>
      {messages.map((msg) => (
        <ListItem
          key={msg.id}
          sx={{
            display: "flex",
            justifyContent:
              msg.username === user?.username ? "flex-end" : "flex-start",
            padding: "4px 8px",
            marginBottom: "8px",
          }}
        >
          <Card
            sx={{
              maxWidth: "80%",
              backgroundColor:
                msg.username === user?.username
                  ? theme.palette.mode === "dark"
                    ? "#4CAF50"
                    : "#DFFFD6"
                  : theme.palette.background.paper,
              color:
                msg.username === user?.username
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              borderRadius: "8px",
              padding: "8px",
              fontSize: "0.9rem",
              wordWrap: "break-word",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", marginBottom: "4px" }}
              >
                {msg.username}
              </Typography>

              <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                {msg.content}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                {new Date(msg.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default MessageList;