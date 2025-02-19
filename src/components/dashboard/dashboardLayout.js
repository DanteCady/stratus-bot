import { Grid, Box, Typography, Chip } from "@mui/material";
import GlobalCard from "@/components/global/globalCard";
import TaskList from "./taskList";
import ProxyHealth from "./proxyHealth";
import AccountStatus from "./accountStatus";

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Compact Stat Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <GlobalCard>
            <Typography variant="h6">Total Checkouts</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4">1</Typography>
              <Chip label="Success" color="success" />
            </Box>
          </GlobalCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <GlobalCard>
            <Typography variant="h6">Total Carted</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4">0</Typography>
              <Chip label="Pending" color="warning" />
            </Box>
          </GlobalCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <GlobalCard>
            <Typography variant="h6">Total Failed</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4">2</Typography>
              <Chip label="Failed" color="error" />
            </Box>
          </GlobalCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <GlobalCard>
            <Typography variant="h6">Active Proxies</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4">18</Typography>
              <Chip label="Stable" color="primary" />
            </Box>
          </GlobalCard>
        </Grid>
      </Grid>

      {/* Task Flow Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TaskList />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProxyHealth />
        </Grid>
      </Grid>

      {/* Accounts & Checkouts - Interactive UI */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AccountStatus />
        </Grid>
        <Grid item xs={12} md={6}>
          <GlobalCard title="Successful Checkouts">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img src="/images/playstation.png" alt="PlayStation" width="24" />
                <Typography>🎮 DualSense Controller - HELLDIVERS™ 2</Typography>
                <Chip label="Success" color="success" />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img src="/images/bestbuy.png" alt="BestBuy" width="24" />
                <Typography>🖥️ RTX 4090 Graphics Card</Typography>
                <Chip label="Success" color="success" />
              </Box>
            </Box>
          </GlobalCard>
        </Grid>
      </Grid>
    </Box>
  );
}
