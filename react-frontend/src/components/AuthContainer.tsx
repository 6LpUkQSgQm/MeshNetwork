import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthContainer: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const switchToLogin = () => setIsRegistering(false);
  const switchToRegister = () => setIsRegistering(true);

  return (
    <div>
      {isRegistering ? (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      ) : (
        <LoginForm onSwitchToRegister={switchToRegister} />
      )}
    </div>
  );
};

export default AuthContainer;