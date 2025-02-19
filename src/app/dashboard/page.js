import { Box } from "@mui/material";
import Sidebar from "@/components/global/sidebar";

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <h1>Dashboard</h1>
      </Box>
    </Box>
  );
}
