"use client";
import { Box, TextField } from "@mui/material";

export default function TaskFilters() {
  return (
    <Box>
      <TextField label="Search Tasks" variant="outlined" fullWidth />
    </Box>
  );
}
