// lib/generateCsvRows.ts
export async function* generateCsvRows() {
  let id = 0;
  //emula database con 100000 filas
  const totalRows = 100000;
  const batchSize = 100; // Simula obtener 100 filas por vez desde la BD

  while (id < totalRows) {
    yield `${id},user_${id},${Math.random()}\n`;
    id++;

    // simula latencia de DB / cursor cada batch
    if (id % batchSize === 0) {
      await new Promise((r) => setTimeout(r, 50)); // 50ms de latencia por batch
    }
  }
}
