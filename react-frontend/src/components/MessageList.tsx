import React from "react";
import {
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
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

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <List sx={{ padding: 2 }}>
      {messages.map((msg) => {
        const isUserMessage = msg.username === user?.username;

        const formattedTime = new Date(msg.timestamp).toLocaleString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        return (
          <ListItem
            key={msg.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isUserMessage ? "flex-end" : "flex-start",
              padding: "4px 8px",
              marginBottom: "12px",
            }}
          >
            <Card
              sx={{
                maxWidth: "80%",
                backgroundColor: isUserMessage
                  ? theme.palette.mode === "dark"
                    ? "#4CAF50"
                    : "#DFFFD6"
                  : theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: "12px",
                padding: "8px",
                fontSize: "0.9rem",
                wordWrap: "break-word",
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent sx={{ paddingBottom: "8px !important" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", marginBottom: "4px" }}
                >
                  {msg.username}
                </Typography>

                <Typography variant="body1">{msg.content}</Typography>
              </CardContent>
            </Card>

            <Box
              sx={{
                marginTop: "4px",
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textAlign: isUserMessage ? "right" : "left",
                width: "100%",
              }}
            >
              {formattedTime}
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default MessageList;