import { generateCsvRows } from "@/domain/export/csvGenerator";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Header CSV
        controller.enqueue(encoder.encode("id,name,value\n"));

        for await (const row of generateCsvRows()) {
          controller.enqueue(encoder.encode(row));
        }

        controller.close();
      } catch (error) {
        controller.error("error en el api de nextjs:", error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="big-report.csv"', //fuerza descarga
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
