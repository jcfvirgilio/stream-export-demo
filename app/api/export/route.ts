import { generateCsvRowsFromDb } from "@/domain/export/generateCsvRowsFromDb";

export const runtime = "nodejs";
import pool from "@/services/db";

// Calcula el tamaño total del archivo CSV para el header Content-Length
async function getCsvSize(): Promise<number> {
  const conn = await pool.getConnection(); // Obtiene una conexión del pool
  try {
    // Consulta todos los registros de user_metrics
    const [rows] = await conn.query("SELECT id, name, value FROM user_metrics");
    const header = "id,name,value\n"; // Header del CSV
    let total = header.length;
    // Suma el tamaño de cada fila formateada como CSV
    for (const row of rows as any[]) {
      const line = `${row.id},${row.name},${row.value}\n`;
      total += line.length;
    }
    return total;
  } finally {
    conn.release(); // Libera la conexión
  }
}

// Envía los datos CSV por streaming al cliente
async function streamCsvData(controller: ReadableStreamDefaultController) {
  const encoder = new TextEncoder(); // Codifica texto a bytes
  controller.enqueue(encoder.encode("id,name,value\n")); // Envía el header
  // Recorre cada fila generada desde la BD y la envía
  for await (const row of generateCsvRowsFromDb()) {
    controller.enqueue(encoder.encode(row));
  }
  controller.close(); // Finaliza el stream
}

// Endpoint GET para exportar el CSV
export async function GET() {
  const contentLength = await getCsvSize(); // Calcula el tamaño del archivo
  // Crea el stream de datos
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await streamCsvData(controller); // Envía los datos por streaming
      } catch (error) {
        // Maneja errores en el stream
        console.error("Error en el stream:", error);
        controller.error(error);
      }
    },
  });

  // Devuelve la respuesta con headers adecuados para descarga
  return new Response(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="big-report.csv"',
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Content-Length": contentLength.toString(), // Header para barra de progreso
    },
  });
}
