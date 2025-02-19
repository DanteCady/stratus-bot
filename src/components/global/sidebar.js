"use client";
import { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Box, Typography } from "@mui/material";
import { Dashboard, ListAlt, Person, Dns, People, Layers, Settings, Menu, ChevronLeft, Cloud, RestartAlt } from "@mui/icons-material";

const menuItems = [
  { text: "Dashboard", icon: <Dashboard /> },
  { text: "Tasks", icon: <ListAlt /> },
  { text: "Profiles", icon: <Person /> },
  { text: "Proxies", icon: <Dns /> },
  { text: "Accounts", icon: <People /> },
  { text: "Harvesters", icon: <Layers /> },
  { text: "Settings", icon: <Settings /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
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
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "flex-start" : "center", width: "100%", p: 1 }}>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <Menu />}
        </IconButton>
      </Box>
      <List sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {menuItems.map(({ text, icon }) => (
          <ListItemButton
            key={text}
            sx={{
              justifyContent: open ? "flex-start" : "center",
              px: open ? 2 : 0,
              py: 1,
              minWidth: "60px", // Ensures square size
              minHeight: "60px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>{icon}</ListItemIcon>
            {open && <ListItemText primary={text} />}
          </ListItemButton>
        ))}
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
