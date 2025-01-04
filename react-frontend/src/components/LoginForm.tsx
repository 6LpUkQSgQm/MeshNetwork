import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

interface LoginValues {
  username: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const validationSchema = Yup.object({
    username: Yup.string().required(t("Username is required")),
    password: Yup.string().required(t("Password is required")),
  });

  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await login(values);
      toast.success(t("Login successful!"));

      const redirectPath = location.state?.from?.pathname || "/";
      console.log("Redirecting to:", redirectPath);
      navigate(redirectPath, { replace: true });
    } catch {
      toast.error(t("Invalid username or password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Field
            name="username"
            as={TextField}
            label={t("Username")}
            fullWidth
            margin="normal"
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
          />
          <Field
            name="password"
            as={TextField}
            label={t("Password")}
            type="password"
            fullWidth
            margin="normal"
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={isSubmitting}
            sx={{ marginTop: 2 }}
          >
            {isSubmitting ? t("Logging in...") : t("Login")}
          </Button>
          <Button
            onClick={onSwitchToRegister}
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {t("Register")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
