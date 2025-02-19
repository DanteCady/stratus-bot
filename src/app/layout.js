"use client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useState } from "react";
import { lightTheme, darkTheme } from "@/theme";
import Sidebar from "@/components/global/sidebar";
import { Box, IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3, ml: 2 }}>
              {/* Theme Toggle Button */}
              <IconButton onClick={toggleTheme} sx={{ position: "absolute", top: 5, right: 5 }}>
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              {children}
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
