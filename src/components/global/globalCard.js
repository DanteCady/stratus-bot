import { Card, CardContent, Typography } from "@mui/material";

export default function GlobalCard({ title, children }) {
  return (
    <Card sx={{ p: 2, textAlign: "center" }}>
      <CardContent>
        {title && <Typography variant="h6">{title}</Typography>}
        {children}
      </CardContent>
    </Card>
  );
}
