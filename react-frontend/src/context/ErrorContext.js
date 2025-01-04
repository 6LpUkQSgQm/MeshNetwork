import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const showError = (message) => {
        setError(message);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>
            </Snackbar>
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);