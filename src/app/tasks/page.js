"use client";
import { Box, Grid, Typography } from "@mui/material";
import TaskControls from "@/components/tasks/taskControls";
import TaskSummary from "@/components/tasks/taskSummary";
import TaskFilters from "@/components/tasks/taskFilters";
import TaskList from "@/components/tasks/taskList";
import TaskCreation from "@/components/tasks/taskCreation";

export default function Tasks() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Tasks</Typography>
      <Grid container spacing={2}>
        {/* Task Controls and Summary */}
        <Grid item xs={12} md={12}>
          <TaskControls />
        </Grid>
        <Grid item xs={12} md={8}>
          {/* <TaskSummary /> */}
        </Grid>

        {/* Task Filters */}
        <Grid item xs={12}>
          <TaskFilters />
        </Grid>

        {/* Task List */}
        <Grid item xs={12}>
          <TaskList />
        </Grid>

        {/* Task Creation */}
        <Grid item xs={12}>
          <TaskCreation />
        </Grid>
      </Grid>
    </Box>
  );
}
