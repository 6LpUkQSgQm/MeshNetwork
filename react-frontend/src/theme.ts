import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F4F4F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333",
      secondary: "#555",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1C1C1C",
      paper: "#343434",
    },
    text: {
      primary: "#FFF",
      secondary: "#CCC",
    },
  },
});