import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RegisterForm = ({ onSwitchToLogin }) => {
    const { register } = useAuth();
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        username: Yup.string().required(t("Username is required")),
        password: Yup.string().required(t("Password is required")),
        registration_code: Yup.string().required(t("Registration code is required")),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await register(values);
            toast.success(t("Registration successful!"));
            onSwitchToLogin();
        } catch (error) {
            toast.error(t("Registration failed."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{ username: "", password: "", registration_code: "" }}
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
                    <Field
                        name="registration_code"
                        as={TextField}
                        label={t("Registration Code")}
                        fullWidth
                        margin="normal"
                        error={touched.registration_code && Boolean(errors.registration_code)}
                        helperText={touched.registration_code && errors.registration_code}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={isSubmitting}
                        sx={{ marginTop: 2 }}
                    >
                        {isSubmitting ? t("Registering...") : t("Register")}
                    </Button>
                    <Button
                        onClick={onSwitchToLogin}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        {t("Back to Login")}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterForm;