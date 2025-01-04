import React from "react";
import { Avatar, Button, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const UserInfo: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#2E3B4E",
        borderRadius: "8px",
        padding: "8px 16px",
        marginBottom: "16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "#388E3C", marginRight: "8px" }}>
          {user?.username.charAt(0).toUpperCase()}
        </Avatar>
        <Typography sx={{ color: "#FFF" }}>{user?.username}</Typography>
      </Box>
      <Button
        variant="outlined"
        color="inherit"
        onClick={logout}
        sx={{
          borderColor: "#FF9800",
          color: "#FF9800",
          "&:hover": {
            borderColor: "#FFC107",
            backgroundColor: "#FFB74D",
          },
        }}
      >
        {t("Logout")}
      </Button>
    </Box>
  );
};

export default UserInfo;