import { Request, Response } from "express";
import { query } from "../db";

const ALLOWED_TABLES: Record<string, string> = {
  departments: "departments",
  designations: "designations",
  branches: "branches",
  leave_types: "leave_types",
  shifts: "shifts",
  salary_grades: "salary_grades",
  users: "users",
};

export const getMasterList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    if (!type || !ALLOWED_TABLES[type]) {
      res.status(400).json({ success: false, message: "Invalid master table type" });
      return;
    }

    const tableName = ALLOWED_TABLES[type];
    const result = await query(`SELECT * FROM ${tableName} ORDER BY id ASC;`);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMasterRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const data = req.body;

    if (!type || !ALLOWED_TABLES[type]) {
      res.status(400).json({ success: false, message: "Invalid master table type" });
      return;
    }

    let insertedRow;
    if (type === "departments") {
      const r = await query(
        `INSERT INTO departments (code, name, head_name, budget, location)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [data.code, data.name, data.head_name, data.budget || 0, data.location || "Headquarters"]
      );
      insertedRow = r.rows[0];
    } else if (type === "designations") {
      const r = await query(
        `INSERT INTO designations (code, title, level, department, min_salary, max_salary)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [data.code, data.title, data.level || "L1", data.department, data.min_salary || 0, data.max_salary || 0]
      );
      insertedRow = r.rows[0];
    } else if (type === "branches") {
      const r = await query(
        `INSERT INTO branches (code, name, city, country, timezone)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [data.code, data.name, data.city, data.country, data.timezone || "UTC"]
      );
      insertedRow = r.rows[0];
    } else if (type === "leave_types") {
      const r = await query(
        `INSERT INTO leave_types (code, name, days_allowed, is_paid)
         VALUES ($1, $2, $3, $4) RETURNING *;`,
        [data.code, data.name, data.days_allowed || 10, data.is_paid ?? true]
      );
      insertedRow = r.rows[0];
    } else if (type === "shifts") {
      const r = await query(
        `INSERT INTO shifts (code, name, start_time, end_time, grace_minutes)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [data.code, data.name, data.start_time, data.end_time, data.grace_minutes || 15]
      );
      insertedRow = r.rows[0];
    } else if (type === "salary_grades") {
      const r = await query(
        `INSERT INTO salary_grades (code, grade_name, min_salary, max_salary, currency)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [data.code, data.grade_name, data.min_salary, data.max_salary, data.currency || "USD"]
      );
      insertedRow = r.rows[0];
    }

    res.status(201).json({ success: true, message: "Created successfully", data: insertedRow });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMasterRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, id } = req.params;
    if (!type || !ALLOWED_TABLES[type] || !id) {
      res.status(400).json({ success: false, message: "Invalid parameters" });
      return;
    }

    const tableName = ALLOWED_TABLES[type];
    await query(`DELETE FROM ${tableName} WHERE id = $1;`, [parseInt(id, 10)]);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
