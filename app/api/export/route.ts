import { generateCsvRows } from "@/domain/export/csvGenerator";
export const runtime = "nodejs";

async function streamCsvData(controller: ReadableStreamDefaultController) {
  const encoder = new TextEncoder();

  console.log("Iniciando stream CSV...");
  controller.enqueue(encoder.encode("id,name,value\n"));

  let rowCount = 0;
  for await (const row of generateCsvRows()) {
    controller.enqueue(encoder.encode(row));
    rowCount++;

    if (rowCount % 1000 === 0) {
      console.log(`Procesadas ${rowCount} filas...`);
    }
  }

  console.log(`Stream completado. Total: ${rowCount} filas`);
  controller.close();
}

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await streamCsvData(controller);
      } catch (error) {
        console.error("Error en el stream:", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="big-report.csv"',
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
