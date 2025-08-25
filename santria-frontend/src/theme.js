import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" }, // blue
    secondary: { main: "#0d47a1" },
    background: { default: "#f5f8ff", paper: "#ffffff" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h5: { fontWeight: 700 },
  },
});

export default theme;
