import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import MessageForm from "./components/MessageForm";
import Messages from "./components/Messages";
import ThemeSwitcher from "./components/ThemeSwitcher";
import UserInfo from "./components/UserInfo";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useTranslation } from "react-i18next";
import AuthContainer from "./components/AuthContainer";
import NotificationManager from "./components/NotificationManager";

const App = () => {
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <NotificationManager />
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            {t("Message Board")}
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          {!isLoggedIn ? (
            <AuthContainer />
          ) : (
            <>
              <UserInfo />
              <MessageForm />
              <Messages />
            </>
          )}
        </Paper>
      </Container>
    </MuiThemeProvider>
  );
};

export default App;