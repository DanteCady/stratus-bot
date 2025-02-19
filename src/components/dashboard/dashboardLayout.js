import { Grid } from "@mui/material";
import GlobalCard from "@/components/global/globalCard";
import TaskList from "./taskList";
import ProxyHealth from "./proxyHealth";
import AccountStatus from "./accountStatus";

export default function DashboardLayout() {
  return (
    <Grid container spacing={3}>
      {/* Top Metrics Panel */}
      <Grid item xs={12} md={3}>
        <GlobalCard title="Running Tasks"><strong>12</strong></GlobalCard>
      </Grid>
      <Grid item xs={12} md={3}>
        <GlobalCard title="Successful Checkouts"><strong>5</strong></GlobalCard>
      </Grid>
      <Grid item xs={12} md={3}>
        <GlobalCard title="Active Proxies"><strong>18</strong></GlobalCard>
      </Grid>
      <Grid item xs={12} md={3}>
        <GlobalCard title="Accounts in Use"><strong>8</strong></GlobalCard>
      </Grid>

      {/* Main Sections */}
      <Grid item xs={12} md={6}><TaskList /></Grid>
      <Grid item xs={12} md={6}><ProxyHealth /></Grid>
      <Grid item xs={12} md={6}><AccountStatus /></Grid>
    </Grid>
  );
}
