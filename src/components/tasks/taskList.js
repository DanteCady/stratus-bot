"use client";
import { Box, Paper, Typography } from "@mui/material";

export default function TaskList() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Task List</Typography>
      <Typography>List of tasks will be displayed here...</Typography>
    </Paper>
  );
}
