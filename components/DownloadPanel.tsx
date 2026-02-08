"use client";

import { Button, Stack } from "@mui/material";
import { downloadFile } from "@/services/downloadService";

export function DownloadPanel() {
  const handleClick = () => {
    downloadFile("/api/export");
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleClick}>
          Descargar
        </Button>

        <Button variant="outlined" color="error">
          Cancelar
        </Button>
      </Stack>
    </Stack>
  );
}
