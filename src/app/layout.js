"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import Sidebar from "@/components/global/sidebar";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Sidebar persists across all pages */}
            <Sidebar />

            {/* Main content with consistent spacing */}
            <Box sx={{ flexGrow: 1, p: 3, ml: 2 }}> {/* Adjust ml as needed */}
              {children}
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
