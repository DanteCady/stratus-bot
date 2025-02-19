"use client";
import { useState } from "react";
import { useTheme } from "@mui/material/styles"; // Import theme
import { usePathname } from "next/navigation";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Box, Typography } from "@mui/material";
import { Dashboard, ListAlt, Person, Dns, People, Layers, Settings, Menu, ChevronLeft, Cloud, RestartAlt, Bolt } from "@mui/icons-material";

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Tasks", icon: <ListAlt />, path: "/tasks" },
  { text: "Profiles", icon: <Person />, path: "/profiles" },
  { text: "Proxies", icon: <Dns />, path: "/proxies" },
  { text: "Accounts", icon: <People />, path: "/accounts" },
  { text: "Harvesters", icon: <Layers />, path: "/harvesters" },
  { text: "Account Gen", icon: <Bolt />, path: "/account-generator" },
  { text: "Settings", icon: <Settings />, path: "/settings" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const theme = useTheme(); // Detects current theme
  const pathname = usePathname();
  const isDarkMode = theme.palette.mode === "dark"; // Check if dark mode is active

  return (
    <Drawer
  variant="permanent"
  sx={{
    width: open ? 240 : 80,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: open ? 240 : 80,
      transition: "width 0.3s ease-in-out",
      display: "flex",
      flexDirection: "column",
      alignItems: open ? "flex-start" : "center",
      justifyContent: "space-between",
      padding: open ? "10px" : "0px",
      backgroundColor: theme.palette.background.sidebar,  // FIXED
      color: theme.palette.text.primary,
      borderRight: isDarkMode ? "none" : `1px solid ${theme.palette.background.paper}`,
    },
  }}
>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "flex-start" : "center", width: "100%", p: 1 }}>
        <IconButton onClick={() => setOpen(!open)} sx={{ color: theme.palette.text.primary }}>
          {open ? <ChevronLeft /> : <Menu />}
        </IconButton>
      </Box>

      {/* Sidebar List Items */}
      <List sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {menuItems.map(({ text, icon, path }) => {
          const isActive = pathname === path;

          return (
            <ListItemButton
              key={text}
              href={path}
              sx={{
                justifyContent: open ? "flex-start" : "center",
                px: open ? 2 : 0,
                py: 0.5,
                minWidth: "60px",
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                borderRadius: "6px",
                backgroundColor: isActive ? theme.palette.background.paper : "transparent",
                boxShadow: isActive ? `0px 0px 6px ${theme.palette.accent.main}` : "none",
                "&:hover": { backgroundColor: theme.palette.secondary.light },
                "& .MuiListItemIcon-root": { color: isActive ? theme.palette.primary.main : theme.palette.text.secondary },
                transition: "0.2s ease-in-out",
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>
              {open && <ListItemText primary={text} sx={{ fontWeight: isActive ? "bold" : "normal" }} />}
            </ListItemButton>
          );
        })}
      </List>

      {/* Bottom Section */}
      <Box sx={{ width: "100%", pb: 2, display: "flex", flexDirection: open ? "row" : "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
        {/* Restart Button */}
        <IconButton sx={{ width: 60, height: 60 }}>
          <RestartAlt />
        </IconButton>

        {/* Backend Status */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Cloud />
          {open && <Typography variant="caption">Backend</Typography>}
        </Box>
      </Box>
    </Drawer>
  );
}
