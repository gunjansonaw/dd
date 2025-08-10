import { createTheme } from "@mui/material/styles";


export const muiTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "hsl(var(--background))",
      paper: "hsl(var(--card))",
    },
    text: {
      primary: "hsl(var(--foreground))",
      secondary: "hsl(var(--muted-foreground))",
    },
    primary: {
      main: "hsl(var(--primary))",
      contrastText: "hsl(var(--primary-foreground))",
    },
    secondary: {
      main: "hsl(var(--secondary))",
      contrastText: "hsl(var(--secondary-foreground))",
    },
    divider: "hsl(var(--border))",
    error: { main: "hsl(var(--destructive))" },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\"",
  },
});
