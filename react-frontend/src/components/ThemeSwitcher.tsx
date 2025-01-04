import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const ThemeSwitcher: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="outlined"
      onClick={toggleTheme}
      sx={{
        borderRadius: "20px",
        textTransform: "none",
        fontSize: "16px",
        color: darkMode ? "#4CAF50" : "#FF9800",
        borderColor: darkMode ? "#4CAF50" : "#FF9800",
        "&:hover": {
          borderColor: darkMode ? "#FF6F00" : "#FF9800",
          backgroundColor: darkMode ? "#FFB74D" : "#FFCC80",
        },
        padding: "8px 16px",
      }}
    >
      {darkMode ? t("Light Mode") : t("Dark Mode")}
    </Button>
  );
};

export default ThemeSwitcher;
