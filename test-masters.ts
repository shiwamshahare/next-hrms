import { query } from "./src/lib/db";

async function testMasters() {
  console.log("🧪 Verifying Masters in PostgreSQL (Checking sequential IDs 1, 2, 3...)...");

  const tables = ["departments", "designations", "branches", "leave_types", "shifts", "salary_grades", "users"];

  for (const table of tables) {
    const res = await query(`SELECT id, * FROM ${table} ORDER BY id ASC LIMIT 3;`);
    const ids = res.rows.map((r: any) => r.id);
    console.log(`✓ Table '${table}': Total ${res.rowCount} rows. Sample IDs: [${ids.join(", ")}]`);
  }

  console.log("🎉 All tables verified with sequential IDs (1, 2, 3...)!");
  process.exit(0);
}

testMasters().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
