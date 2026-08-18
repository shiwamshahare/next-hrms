import { query } from "./index";
import bcrypt from "bcryptjs";

export async function initDatabase(forceRecreate: boolean = false) {
  try {
    console.log("🔄 Initializing PostgreSQL database schema...");

    if (forceRecreate) {
      console.log("🗑️ Dropping existing tables to recreate fresh master schema...");
      await query(`
        DROP TABLE IF EXISTS salary_grades CASCADE;
        DROP TABLE IF EXISTS shifts CASCADE;
        DROP TABLE IF EXISTS leave_types CASCADE;
        DROP TABLE IF EXISTS branches CASCADE;
        DROP TABLE IF EXISTS designations CASCADE;
        DROP TABLE IF EXISTS departments CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
      `);
    }

    // 1. Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'STAFF',
        full_name VARCHAR(150),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // 2. Departments Master
    await query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        head_name VARCHAR(150),
        budget NUMERIC(12, 2) DEFAULT 0.00,
        location VARCHAR(150) DEFAULT 'Headquarters',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Designations Master
    await query(`
      CREATE TABLE IF NOT EXISTS designations (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(150) NOT NULL,
        level VARCHAR(50) NOT NULL DEFAULT 'L1',
        department VARCHAR(150) NOT NULL,
        min_salary NUMERIC(12, 2) DEFAULT 0.00,
        max_salary NUMERIC(12, 2) DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Branches Master
    await query(`
      CREATE TABLE IF NOT EXISTS branches (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        timezone VARCHAR(50) DEFAULT 'UTC',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Leave Types Master
    await query(`
      CREATE TABLE IF NOT EXISTS leave_types (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        days_allowed INT NOT NULL DEFAULT 10,
        is_paid BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Shifts Master
    await query(`
      CREATE TABLE IF NOT EXISTS shifts (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        start_time VARCHAR(20) NOT NULL,
        end_time VARCHAR(20) NOT NULL,
        grace_minutes INT DEFAULT 15,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Salary Grades Master
    await query(`
      CREATE TABLE IF NOT EXISTS salary_grades (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        grade_name VARCHAR(150) NOT NULL,
        min_salary NUMERIC(12, 2) NOT NULL,
        max_salary NUMERIC(12, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ All tables created successfully.");

    // Seed Users
    const checkUsers = await query("SELECT COUNT(*) FROM users;");
    if (parseInt(checkUsers.rows[0].count, 10) === 0 || forceRecreate) {
      console.log("🌱 Seeding Users (Password: '1')...");
      const salt = bcrypt.genSaltSync(10);
      const defaultPasswordHash = bcrypt.hashSync("1", salt);

      const defaultUsers = [
        { username: "admin", email: "admin@hrms.corp", password_hash: defaultPasswordHash, role: "HR_ADMIN", full_name: "System Administrator" },
        { username: "manager", email: "manager@hrms.corp", password_hash: defaultPasswordHash, role: "OPERATIONS_LEAD", full_name: "Marcus Thorne" },
        { username: "engineer", email: "engineer@hrms.corp", password_hash: defaultPasswordHash, role: "STAFF_ENGINEER", full_name: "Alex Vance" },
        { username: "johnsnow", email: "johnsnow@hrms.corp", password_hash: defaultPasswordHash, role: "STAFF", full_name: "John Snow" },
      ];

      for (const u of defaultUsers) {
        await query(
          `INSERT INTO users (username, email, password_hash, role, full_name)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;`,
          [u.username, u.email, u.password_hash, u.role, u.full_name]
        );
      }
    }

    // Seed Departments (IDs: 1, 2, 3...)
    const checkDepts = await query("SELECT COUNT(*) FROM departments;");
    if (parseInt(checkDepts.rows[0].count, 10) === 0 || forceRecreate) {
      console.log("🌱 Seeding Departments Master (IDs: 1, 2, 3...)...");
      const depts = [
        { code: "DEP-01", name: "Engineering & Technology", head_name: "Alex Vance", budget: 850000.00, location: "Tower A, Floor 4" },
        { code: "DEP-02", name: "Product Design Guild", head_name: "Elena Rostova", budget: 320000.00, location: "Tower A, Floor 3" },
        { code: "DEP-03", name: "Product Management", head_name: "Marcus Thorne", budget: 450000.00, location: "Tower B, Floor 2" },
        { code: "DEP-04", name: "People Operations & Legal", head_name: "Sarah Jenkins", budget: 280000.00, location: "Executive Wing" },
        { code: "DEP-05", name: "Cloud Operations", head_name: "Tariq Mansoor", budget: 520000.00, location: "Data Center" },
      ];
      for (const d of depts) {
        await query(
          `INSERT INTO departments (code, name, head_name, budget, location)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (code) DO NOTHING;`,
          [d.code, d.name, d.head_name, d.budget, d.location]
        );
      }
    }

    // Seed Designations (IDs: 1, 2, 3...)
    const checkDes = await query("SELECT COUNT(*) FROM designations;");
    if (parseInt(checkDes.rows[0].count, 10) === 0 || forceRecreate) {
      console.log("🌱 Seeding Designations Master (IDs: 1, 2, 3...)...");
      const desList = [
        { code: "DES-01", title: "Junior Software Engineer", level: "L1", department: "Engineering & Technology", min_salary: 60000, max_salary: 85000 },
        { code: "DES-02", title: "Software Engineer", level: "L2", department: "Engineering & Technology", min_salary: 85000, max_salary: 120000 },
        { code: "DES-03", title: "Senior Software Engineer", level: "L3", department: "Engineering & Technology", min_salary: 120000, max_salary: 165000 },
        { code: "DES-04", title: "Principal Architect", level: "L5", department: "Engineering & Technology", min_salary: 180000, max_salary: 240000 },
        { code: "DES-05", title: "Product Designer", level: "L2", department: "Product Design Guild", min_salary: 75000, max_salary: 110000 },
        { code: "DES-06", title: "Product Manager", level: "L3", department: "Product Management", min_salary: 115000, max_salary: 160000 },
        { code: "DES-07", title: "HR Executive", level: "L1", department: "People Operations & Legal", min_salary: 55000, max_salary: 80000 },
      ];
      for (const d of desList) {
        await query(
          `INSERT INTO designations (code, title, level, department, min_salary, max_salary)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (code) DO NOTHING;`,
          [d.code, d.title, d.level, d.department, d.min_salary, d.max_salary]
        );
      }
    }

    // Seed Branches (IDs: 1, 2, 3...)
    const checkBranches = await query("SELECT COUNT(*) FROM branches;");
    if (parseInt(checkBranches.rows[0].count, 10) === 0 || forceRecreate) {
      console.log("🌱 Seeding Branches Master (IDs: 1, 2, 3...)...");
      const branches = [
        { code: "BR-01", name: "Global Headquarters", city: "San Francisco", country: "United States", timezone: "America/Los_Angeles" },
        { code: "BR-02", name: "East Coast Tech Hub", city: "New York", country: "United States", timezone: "America/New_York" },
        { code: "BR-03", name: "EMEA Operations Center", city: "London", country: "United Kingdom", timezone: "Europe/London" },
        { code: "BR-04", name: "APAC Engineering Center", city: "Bengaluru", country: "India", timezone: "Asia/Kolkata" },
        { code: "BR-05", name: "Regional Office", city: "Tokyo", country: "Japan", timezone: "Asia/Tokyo" },
      ];
      for (const b of branches) {
        await query(
          `INSERT INTO branches (code, name, city, country, timezone)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (code) DO NOTHING;`,
          [b.code, b.name, b.city, b.country, b.timezone]
        );
      }
    }

    // Seed Leave Types (IDs: 1, 2, 3...)
    const checkLeave = await query("SELECT COUNT(*) FROM leave_types;");
    if (parseInt(checkLeave.rows[0].count, 10) === 0 || forceRecreate) {
      console.log("🌱 Seeding Leave Types Master (IDs: 1, 2, 3...)...");
      const leaveTypes = [
        { code: "LV-01", name: "Paid Annual Leave", days_allowed: 20, is_paid: true },
        { code: "LV-02", name: "Medical & Sick Leave", days_allowed: 12, is_paid: true },
        { code: "LV-03", name: "Casual / Personal Leave", days_allowed: 7, is_paid: true },
        { code: "LV-04", name: "Maternity Leave", days_allowed: 90, is_paid: true },
        { code: "LV-05", name: "Paternity Leave", days_allowed: 15, is_paid: true },
      ];
      for (const l of leaveTypes) {
        await query(
          `INSERT INTO leave_types (code, name, days_allowed, is_paid)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (code) DO NOTHING;`,
          [l.code, l.name, l.days_allowed, l.is_paid]
        );
      }
    }

    // Seed Shifts (IDs: 1, 2, 3...)
    const checkShifts = await query("SELECT COUNT(*) FROM shifts;");
    if (parseInt(checkShifts.rows[0].count, 10) === 0 || forceRecreate) {
      console.log("🌱 Seeding Shifts Master (IDs: 1, 2, 3...)...");
      const shifts = [
        { code: "SH-01", name: "General Day Shift", start_time: "09:00 AM", end_time: "06:00 PM", grace_minutes: 15 },
        { code: "SH-02", name: "Early Morning Shift", start_time: "06:00 AM", end_time: "03:00 PM", grace_minutes: 10 },
        { code: "SH-03", name: "Evening / Swing Shift", start_time: "02:00 PM", end_time: "11:00 PM", grace_minutes: 15 },
        { code: "SH-04", name: "Night Support Shift", start_time: "10:00 PM", end_time: "07:00 AM", grace_minutes: 15 },
      ];
      for (const s of shifts) {
        await query(
          `INSERT INTO shifts (code, name, start_time, end_time, grace_minutes)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (code) DO NOTHING;`,
          [s.code, s.name, s.start_time, s.end_time, s.grace_minutes]
        );
      }
    }

    // Seed Salary Grades (IDs: 1, 2, 3...)
    const checkGrades = await query("SELECT COUNT(*) FROM salary_grades;");
    if (parseInt(checkGrades.rows[0].count, 10) === 0 || forceRecreate) {
      console.log("🌱 Seeding Salary Grades Master (IDs: 1, 2, 3...)...");
      const grades = [
        { code: "GRD-01", grade_name: "Junior Grade (L1)", min_salary: 50000.00, max_salary: 75000.00, currency: "USD" },
        { code: "GRD-02", grade_name: "Mid-Level Professional (L2)", min_salary: 75000.00, max_salary: 115000.00, currency: "USD" },
        { code: "GRD-03", grade_name: "Senior Staff (L3)", min_salary: 115000.00, max_salary: 165000.00, currency: "USD" },
        { code: "GRD-04", grade_name: "Lead & Principal (L4)", min_salary: 160000.00, max_salary: 220000.00, currency: "USD" },
        { code: "GRD-05", grade_name: "Director & Executive (L5)", min_salary: 210000.00, max_salary: 320000.00, currency: "USD" },
      ];
      for (const g of grades) {
        await query(
          `INSERT INTO salary_grades (code, grade_name, min_salary, max_salary, currency)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (code) DO NOTHING;`,
          [g.code, g.grade_name, g.min_salary, g.max_salary, g.currency]
        );
      }
    }

    console.log("🎉 All Master Data seeded with sequential IDs (1, 2, 3...)!");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  }
}

// Standalone execution
if (require.main === module) {
  const force = process.argv.includes("--force") || true;
  initDatabase(force)
    .then(() => {
      console.log("Database master initialization complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
