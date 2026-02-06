// src/app/test/page.tsx
import { supabase } from "../../../lib/supabaseClient";

export const dynamic = "force-dynamic"; // Evita cache en App Router

export default async function TestPage() {
  // SELECT * trae todas las columnas y todos los registros
  const { data, error } = await supabase.from("news").select("*");

  if (error) {
    return (
      <div>
        <h1>❌ Error en la consulta</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <h1>No hay registros en la tabla</h1>;
  }

  // Obtener dinámicamente las columnas
  const columns = Object.keys(data[0]);

  return (
    <div>
      <h1>📊 Datos de la tabla &quot;category&quot;</h1>
      <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{row[col]?.toString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
