import { Box } from "@mui/material";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import Sidebar from "@/components/global/sidebar";
export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <DashboardLayout />
    </Box>
  );
}
