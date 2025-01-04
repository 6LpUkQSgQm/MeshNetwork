import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container, Paper, Typography } from "@mui/material";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";

import MessageForm from "./components/MessageForm";
import Messages from "./components/Messages";
import ThemeSwitcher from "./components/ThemeSwitcher";
import UserInfo from "./components/UserInfo";
import LanguageSwitcher from "./components/LanguageSwitcher";
import AuthContainer from "./components/AuthContainer";
import NotificationManager from "./components/NotificationManager";

import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useTranslation } from "react-i18next";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
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

            <Routes>
              {/* Connexion page */}
              <Route path="/login" element={<AuthContainer />} />

              {/* Protected route */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <>
                      <UserInfo />
                      <MessageForm />
                      <Messages />
                    </>
                  </ProtectedRoute>
                }
              />

              {/* Redirection by default */}
              <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            </Routes>
          </Paper>
        </Container>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;