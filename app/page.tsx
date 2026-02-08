"use client";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { DownloadPanel } from "@/components/DownloadPanel";
export default function page() {
  return (
    <Card>
      <CardContent>
        <DownloadPanel />
      </CardContent>
    </Card>
  );
}
