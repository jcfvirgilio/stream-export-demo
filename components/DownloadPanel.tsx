"use client";

import { useState, useRef } from "react";
import { LinearProgress, Button, Stack, Typography } from "@mui/material";

export function DownloadPanel() {
  const [progress, setProgress] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleClick = async () => {
    setProgress(0);
    setDownloading(true);
    abortRef.current = new AbortController();
    try {
      const response = await fetch("/api/export", {
        signal: abortRef.current.signal,
      });
      if (!response.body) throw new Error("No stream");
      const contentLength = response.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : undefined;
      const reader = response.body.getReader();
      let received = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total) {
            setProgress(Math.round((received / total) * 100));
          }
        }
      }
      // Descargar archivo
      const blob = new Blob(chunks, { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "big-report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if ((err as any).name !== "AbortError") {
        alert("Error en la descarga");
      }
    } finally {
      setDownloading(false);
      setProgress(null);
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          onClick={handleClick}
          disabled={downloading}
        >
          Descargar
        </Button>
        {downloading && (
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancelar
          </Button>
        )}
      </Stack>
      {downloading && (
        <Stack spacing={1} sx={{ width: 300 }}>
          <LinearProgress
            variant={progress !== null ? "determinate" : "indeterminate"}
            value={progress ?? 0}
          />
          <Typography variant="body2" align="center">
            {progress !== null ? `${progress}%` : "Descargando..."}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
