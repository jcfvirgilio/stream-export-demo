// Importa el pool de conexiones a MySQL
import pool from "@/services/db";

// Función generadora asíncrona para obtener filas CSV desde la base de datos
export async function* generateCsvRowsFromDb() {
  const conn = await pool.getConnection(); // Obtiene una conexión del pool
  try {
    // Ejecuta la consulta para obtener todos los registros de user_metrics
    const [rows] = await conn.query("SELECT id, name, value FROM user_metrics");
    // Recorre cada fila obtenida
    for (const row of rows as any[]) {
      // Devuelve la fila formateada como CSV
      // 'yield' permite pausar la función y entregar el valor actual al consumidor.
      // En una función generadora, cada vez que se llama a 'next()', se ejecuta hasta el siguiente 'yield'.
      // Esto es útil para enviar datos por partes, como en un stream, sin cargar toda la información en memoria.
      yield `${row.id},${row.name},${row.value}\n`;
    }
  } finally {
    // Libera la conexión al pool
    conn.release();
  }
}
