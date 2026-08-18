import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const ALLOWED_TABLES: Record<string, string> = {
  departments: "departments",
  designations: "designations",
  branches: "branches",
  leave_types: "leave_types",
  shifts: "shifts",
  salary_grades: "salary_grades",
  users: "users",
};

// GET: Fetch master records
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type || !ALLOWED_TABLES[type]) {
      // Return summary counts for dashboard
      const [deptCount, desCount, branchCount, userCount] = await Promise.all([
        query("SELECT COUNT(*) FROM departments;"),
        query("SELECT COUNT(*) FROM designations;"),
        query("SELECT COUNT(*) FROM branches;"),
        query("SELECT COUNT(*) FROM users;"),
      ]);

      return NextResponse.json({
        success: true,
        summary: {
          departments: parseInt(deptCount.rows[0].count, 10),
          designations: parseInt(desCount.rows[0].count, 10),
          branches: parseInt(branchCount.rows[0].count, 10),
          users: parseInt(userCount.rows[0].count, 10),
        },
      });
    }

    const tableName = ALLOWED_TABLES[type];
    const result = await query(`SELECT * FROM ${tableName} ORDER BY id ASC;`);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Masters GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch master data" },
      { status: 500 }
    );
  }
}

// POST: Create master record
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !ALLOWED_TABLES[type]) {
      return NextResponse.json(
        { success: false, message: "Invalid master type specified" },
        { status: 400 }
      );
    }

    let insertedRow;

    if (type === "departments") {
      const res = await query(
        `INSERT INTO departments (code, name, head_name, budget, location)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *;`,
        [data.code, data.name, data.head_name || null, data.budget || 0, data.location || "Headquarters"]
      );
      insertedRow = res.rows[0];
    } else if (type === "designations") {
      const res = await query(
        `INSERT INTO designations (code, title, level, department, min_salary, max_salary)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *;`,
        [data.code, data.title, data.level || "L1", data.department, data.min_salary || 0, data.max_salary || 0]
      );
      insertedRow = res.rows[0];
    } else if (type === "branches") {
      const res = await query(
        `INSERT INTO branches (code, name, city, country, timezone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *;`,
        [data.code, data.name, data.city, data.country, data.timezone || "UTC"]
      );
      insertedRow = res.rows[0];
    } else if (type === "leave_types") {
      const res = await query(
        `INSERT INTO leave_types (code, name, days_allowed, is_paid)
         VALUES ($1, $2, $3, $4)
         RETURNING *;`,
        [data.code, data.name, data.days_allowed || 10, data.is_paid ?? true]
      );
      insertedRow = res.rows[0];
    } else if (type === "shifts") {
      const res = await query(
        `INSERT INTO shifts (code, name, start_time, end_time, grace_minutes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *;`,
        [data.code, data.name, data.start_time, data.end_time, data.grace_minutes || 15]
      );
      insertedRow = res.rows[0];
    } else if (type === "salary_grades") {
      const res = await query(
        `INSERT INTO salary_grades (code, grade_name, min_salary, max_salary, currency)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *;`,
        [data.code, data.grade_name, data.min_salary, data.max_salary, data.currency || "USD"]
      );
      insertedRow = res.rows[0];
    }

    return NextResponse.json({
      success: true,
      message: "Master record created successfully",
      data: insertedRow,
    });
  } catch (error: any) {
    console.error("Masters POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create master record" },
      { status: 500 }
    );
  }
}

// DELETE: Remove master record
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !ALLOWED_TABLES[type] || !id) {
      return NextResponse.json(
        { success: false, message: "Invalid type or id provided" },
        { status: 400 }
      );
    }

    const tableName = ALLOWED_TABLES[type];
    await query(`DELETE FROM ${tableName} WHERE id = $1;`, [parseInt(id, 10)]);

    return NextResponse.json({
      success: true,
      message: `Record ${id} deleted from ${tableName}`,
    });
  } catch (error: any) {
    console.error("Masters DELETE error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete record" },
      { status: 500 }
    );
  }
}
