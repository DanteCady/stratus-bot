"use client";
import { Box, Paper, Typography } from "@mui/material";

export default function TaskSummary() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Task Summary</Typography>
      <Typography>Active: 10</Typography>
      <Typography>Completed: 5</Typography>
      <Typography>Failed: 2</Typography>
    </Paper>
  );
}
