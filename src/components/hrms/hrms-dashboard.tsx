"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Tag,
  MapPin,
  CalendarDays,
  Clock,
  CreditCard,
  Trash2,
  RotateCw,
  Plus,
  X,
  Check,
  AlertCircle,
  LayoutGrid,
  Search,
} from "lucide-react";

interface HRMSDashboardProps {
  onSwitchToLogin?: () => void;
}

export default function HRMSDashboard({ onSwitchToLogin }: HRMSDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Master Data States
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [salaryGrades, setSalaryGrades] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Form input states
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Show status notification
  const notify = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch Master Data from PostgreSQL
  const fetchMaster = async (type: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/masters?type=${type}`);
      const json = await res.json();
      if (json.success) {
        if (type === "departments") setDepartments(json.data);
        if (type === "designations") setDesignations(json.data);
        if (type === "branches") setBranches(json.data);
        if (type === "leave_types") setLeaveTypes(json.data);
        if (type === "shifts") setShifts(json.data);
        if (type === "salary_grades") setSalaryGrades(json.data);
        if (type === "users") setUsersList(json.data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all initial data
  const loadAll = () => {
    fetchMaster("departments");
    fetchMaster("designations");
    fetchMaster("branches");
    fetchMaster("leave_types");
    fetchMaster("shifts");
    fetchMaster("salary_grades");
    fetchMaster("users");
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Handle Master Creation
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/masters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          data: formData,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        notify(json.message || "Failed to create record", "error");
        return;
      }

      notify(`Record created successfully with ID #${json.data.id}!`, "success");
      setFormData({});
      setShowAddForm(false);
      fetchMaster(activeTab);
    } catch (err: any) {
      notify(err.message || "Operation failed", "error");
    }
  };

  // Handle Master Deletion
  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete ${type.slice(0, -1)} ID #${id}?`)) return;
    try {
      const res = await fetch(`/api/masters?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        notify(json.message || "Failed to delete record", "error");
        return;
      }
      notify(`Record #${id} deleted successfully.`, "success");
      fetchMaster(type);
    } catch (err: any) {
      notify(err.message || "Delete failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-6 py-3 flex items-center justify-between border-b-2 border-[var(--border)] select-none">
        <div className="flex items-center gap-2.5">
          <span className="size-3.5 bg-[var(--primary-red)] inline-block shrink-0" />
          <span className="font-extrabold uppercase tracking-wider text-sm sm:text-base">
            ADMIN // CONTROL PANEL
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={loadAll}
            className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-2 border-[var(--secondary-foreground)] px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-neutral-900 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">REFRESH</span>
          </button>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="bg-[var(--primary-red)] text-[var(--primary-foreground)] border-2 border-[var(--primary-red)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary-red-hover)] cursor-pointer"
          >
            SIGN IN
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 shrink-0 border-r-2 border-[var(--border)] bg-[var(--background)] select-none flex flex-col">
          {/* Section: Core */}
          <div className="px-5 py-2.5 bg-[var(--muted)] border-b border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            CORE OPERATIONS
          </div>
          <nav className="flex flex-col">
            <button
              type="button"
              onClick={() => {
                setActiveTab("dashboard");
                setShowAddForm(false);
              }}
              className={`w-full text-left px-5 py-3 border-b-2 border-[var(--border)] text-xs font-extrabold uppercase tracking-wider flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[var(--primary-red)] text-[var(--primary-foreground)]"
                  : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <LayoutDashboard className="size-4 shrink-0" />
              <span>DASHBOARD</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("users");
                setShowAddForm(false);
              }}
              className={`w-full text-left px-5 py-3 border-b-2 border-[var(--border)] text-xs font-extrabold uppercase tracking-wider flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "users"
                  ? "bg-[var(--primary-red)] text-[var(--primary-foreground)]"
                  : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <Users className="size-4 shrink-0" />
              <span>USERS DIRECTORY</span>
            </button>
          </nav>

          {/* Section: Masters */}
          <div className="px-5 py-2.5 bg-[var(--muted)] border-b border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mt-2">
            MASTER DATA (POSTGRESQL)
          </div>
          <nav className="flex flex-col">
            {[
              { id: "departments", label: "DEPARTMENTS", icon: Building2, count: departments.length },
              { id: "designations", label: "DESIGNATIONS", icon: Tag, count: designations.length },
              { id: "branches", label: "BRANCHES / LOCATIONS", icon: MapPin, count: branches.length },
              { id: "leave_types", label: "LEAVE TYPES", icon: CalendarDays, count: leaveTypes.length },
              { id: "shifts", label: "SHIFTS", icon: Clock, count: shifts.length },
              { id: "salary_grades", label: "SALARY GRADES", icon: CreditCard, count: salaryGrades.length },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowAddForm(false);
                    setFormData({});
                  }}
                  className={`w-full text-left px-5 py-2.5 border-b border-[var(--border)] text-xs font-extrabold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[var(--primary-red)] text-[var(--primary-foreground)] font-black"
                      : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 border ${
                      isActive
                        ? "border-white bg-black/20 text-white"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content View */}
        <main className="flex-1 p-5 sm:p-8 bg-[var(--background)] overflow-y-auto">
          {/* Notification Toast */}
          {notification && (
            <div
              className={`mb-6 p-3 text-xs font-bold border-2 border-[var(--border)] shadow-brutal flex items-center justify-between ${
                notification.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--primary-red)] text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === "success" ? (
                  <Check className="size-4 shrink-0" />
                ) : (
                  <AlertCircle className="size-4 shrink-0" />
                )}
                <span>{notification.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="cursor-pointer font-black"
              >
                ✕
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: DASHBOARD OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">
                  SYSTEM OVERVIEW
                </h1>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-1">
                  POSTGRESQL ENTERPRISE MASTER & OPERATOR METRICS
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border-2 border-[var(--border)] p-5 shadow-brutal-card bg-[var(--card)]">
                  <div className="text-3xl sm:text-4xl font-black text-[var(--foreground)] font-mono">
                    {departments.length}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[var(--muted-foreground)] mt-2">
                    DEPARTMENTS
                  </div>
                </div>

                <div className="border-2 border-[var(--border)] p-5 shadow-brutal-card bg-[var(--card)]">
                  <div className="text-3xl sm:text-4xl font-black text-[var(--foreground)] font-mono">
                    {designations.length}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[var(--muted-foreground)] mt-2">
                    DESIGNATIONS
                  </div>
                </div>

                <div className="border-2 border-[var(--border)] p-5 shadow-brutal-card bg-[var(--card)]">
                  <div className="text-3xl sm:text-4xl font-black text-[var(--foreground)] font-mono">
                    {branches.length}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[var(--muted-foreground)] mt-2">
                    GLOBAL BRANCHES
                  </div>
                </div>

                <div className="border-2 border-[var(--border)] p-5 shadow-brutal-card bg-[var(--card)]">
                  <div className="text-3xl sm:text-4xl font-black text-[var(--foreground)] font-mono">
                    {usersList.length}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[var(--muted-foreground)] mt-2">
                    OPERATOR USERS
                  </div>
                </div>
              </div>

              {/* Master Data Quick Jump Grid */}
              <div className="border-2 border-[var(--border)] p-6 shadow-brutal-lg bg-[var(--card)] space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--foreground)]">
                  MASTER DATA DIRECTORY
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("departments")}
                    className="p-4 border-2 border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-left cursor-pointer transition-colors shadow-brutal"
                  >
                    <Building2 className="size-5 text-[var(--primary-red)] mb-2" />
                    <div className="font-black text-xs uppercase">Manage Departments</div>
                    <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
                      {departments.length} records configured
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("designations")}
                    className="p-4 border-2 border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-left cursor-pointer transition-colors shadow-brutal"
                  >
                    <Tag className="size-5 text-[var(--primary-red)] mb-2" />
                    <div className="font-black text-xs uppercase">Manage Designations</div>
                    <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
                      {designations.length} records configured
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("branches")}
                    className="p-4 border-2 border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-left cursor-pointer transition-colors shadow-brutal"
                  >
                    <MapPin className="size-5 text-[var(--primary-red)] mb-2" />
                    <div className="font-black text-xs uppercase">Manage Branches</div>
                    <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
                      {branches.length} records configured
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: USERS DIRECTORY */}
          {/* ========================================================================= */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">
                    OPERATOR USERS
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">
                    POSTGRESQL USER DIRECTORY ({usersList.length} OPERATORS)
                  </p>
                </div>
              </div>

              <div className="border-2 border-[var(--border)] shadow-brutal-lg bg-[var(--card)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-b-2 border-[var(--border)] font-black uppercase tracking-wider">
                      <th className="p-3 w-16 text-center">ID</th>
                      <th className="p-3">USERNAME</th>
                      <th className="p-3">FULL NAME</th>
                      <th className="p-3">EMAIL ADDRESS</th>
                      <th className="p-3">ROLE</th>
                      <th className="p-3 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[var(--border)] font-medium">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-[var(--muted)]">
                        <td className="p-3 text-center font-mono font-bold text-[var(--primary-red)]">
                          #{u.id}
                        </td>
                        <td className="p-3 font-bold">{u.username}</td>
                        <td className="p-3">{u.full_name || "—"}</td>
                        <td className="p-3 font-mono">{u.email}</td>
                        <td className="p-3">
                          <span className="bg-[var(--primary-red)] text-white px-2 py-0.5 font-mono text-[10px] font-bold">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-emerald-600 text-white px-2 py-0.5 font-bold text-[10px]">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: DEPARTMENTS MASTER */}
          {/* ========================================================================= */}
          {activeTab === "departments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">
                    DEPARTMENTS MASTER
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">
                    POSTGRESQL TABLE: `departments` (SEQUENTIAL IDS: 1, 2, 3...)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary-red-hover)] cursor-pointer flex items-center gap-1.5 shadow-brutal self-start sm:self-auto"
                >
                  {showAddForm ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
                  <span>{showAddForm ? "CANCEL" : "ADD DEPARTMENT"}</span>
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <form
                  onSubmit={handleCreate}
                  className="border-2 border-[var(--border)] bg-[var(--card)] p-5 shadow-brutal space-y-4"
                >
                  <div className="font-black text-xs uppercase tracking-wider text-[var(--foreground)] border-b pb-2">
                    CREATE NEW DEPARTMENT (WILL GET NEXT ID: #{departments.length + 1})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="DEP-06"
                        value={formData.code || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Finance & Accounting"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">HEAD NAME</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={formData.head_name || ""}
                        onChange={(e) => setFormData({ ...formData, head_name: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--secondary)] cursor-pointer"
                  >
                    SAVE DEPARTMENT →
                  </button>
                </form>
              )}

              {/* Table */}
              <div className="border-2 border-[var(--border)] shadow-brutal-lg bg-[var(--card)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-b-2 border-[var(--border)] font-black uppercase tracking-wider">
                      <th className="p-3 w-16 text-center">ID</th>
                      <th className="p-3">CODE</th>
                      <th className="p-3">NAME</th>
                      <th className="p-3">HEAD</th>
                      <th className="p-3">LOCATION</th>
                      <th className="p-3 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[var(--border)] font-medium">
                    {departments.map((d) => (
                      <tr key={d.id} className="hover:bg-[var(--muted)]">
                        <td className="p-3 text-center font-mono font-bold text-[var(--primary-red)]">
                          #{d.id}
                        </td>
                        <td className="p-3 font-mono font-bold">{d.code}</td>
                        <td className="p-3 font-bold">{d.name}</td>
                        <td className="p-3">{d.head_name || "—"}</td>
                        <td className="p-3">{d.location || "Headquarters"}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete("departments", d.id)}
                            className="p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: DESIGNATIONS MASTER */}
          {/* ========================================================================= */}
          {activeTab === "designations" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">
                    DESIGNATIONS MASTER
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">
                    POSTGRESQL TABLE: `designations` (SEQUENTIAL IDS: 1, 2, 3...)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary-red-hover)] cursor-pointer flex items-center gap-1.5 shadow-brutal self-start sm:self-auto"
                >
                  {showAddForm ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
                  <span>{showAddForm ? "CANCEL" : "ADD DESIGNATION"}</span>
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <form
                  onSubmit={handleCreate}
                  className="border-2 border-[var(--border)] bg-[var(--card)] p-5 shadow-brutal space-y-4"
                >
                  <div className="font-black text-xs uppercase tracking-wider text-[var(--foreground)] border-b pb-2">
                    CREATE NEW DESIGNATION (WILL GET NEXT ID: #{designations.length + 1})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="DES-08"
                        value={formData.code || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">TITLE</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead QA Engineer"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">LEVEL</label>
                      <select
                        value={formData.level || "L1"}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)] cursor-pointer"
                      >
                        <option value="L1">L1 - Associate</option>
                        <option value="L2">L2 - Professional</option>
                        <option value="L3">L3 - Senior</option>
                        <option value="L4">L4 - Principal</option>
                        <option value="L5">L5 - Director</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">DEPARTMENT</label>
                      <input
                        type="text"
                        required
                        placeholder="Engineering & Technology"
                        value={formData.department || ""}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--secondary)] cursor-pointer"
                  >
                    SAVE DESIGNATION →
                  </button>
                </form>
              )}

              {/* Table */}
              <div className="border-2 border-[var(--border)] shadow-brutal-lg bg-[var(--card)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-b-2 border-[var(--border)] font-black uppercase tracking-wider">
                      <th className="p-3 w-16 text-center">ID</th>
                      <th className="p-3">CODE</th>
                      <th className="p-3">TITLE</th>
                      <th className="p-3">LEVEL</th>
                      <th className="p-3">DEPARTMENT</th>
                      <th className="p-3 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[var(--border)] font-medium">
                    {designations.map((d) => (
                      <tr key={d.id} className="hover:bg-[var(--muted)]">
                        <td className="p-3 text-center font-mono font-bold text-[var(--primary-red)]">
                          #{d.id}
                        </td>
                        <td className="p-3 font-mono font-bold">{d.code}</td>
                        <td className="p-3 font-bold">{d.title}</td>
                        <td className="p-3">
                          <span className="bg-yellow-400 text-black px-2 py-0.5 font-bold font-mono text-[10px]">
                            {d.level}
                          </span>
                        </td>
                        <td className="p-3">{d.department}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete("designations", d.id)}
                            className="p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: BRANCHES MASTER */}
          {/* ========================================================================= */}
          {activeTab === "branches" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">
                    BRANCHES & LOCATIONS MASTER
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">
                    POSTGRESQL TABLE: `branches` (SEQUENTIAL IDS: 1, 2, 3...)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary-red-hover)] cursor-pointer flex items-center gap-1.5 shadow-brutal self-start sm:self-auto"
                >
                  {showAddForm ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
                  <span>{showAddForm ? "CANCEL" : "ADD BRANCH"}</span>
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <form
                  onSubmit={handleCreate}
                  className="border-2 border-[var(--border)] bg-[var(--card)] p-5 shadow-brutal space-y-4"
                >
                  <div className="font-black text-xs uppercase tracking-wider text-[var(--foreground)] border-b pb-2">
                    CREATE NEW BRANCH (WILL GET NEXT ID: #{branches.length + 1})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="BR-06"
                        value={formData.code || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">BRANCH NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sydney Tech Hub"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">CITY</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sydney"
                        value={formData.city || ""}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">COUNTRY</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Australia"
                        value={formData.country || ""}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--secondary)] cursor-pointer"
                  >
                    SAVE BRANCH →
                  </button>
                </form>
              )}

              {/* Table */}
              <div className="border-2 border-[var(--border)] shadow-brutal-lg bg-[var(--card)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-b-2 border-[var(--border)] font-black uppercase tracking-wider">
                      <th className="p-3 w-16 text-center">ID</th>
                      <th className="p-3">CODE</th>
                      <th className="p-3">BRANCH NAME</th>
                      <th className="p-3">CITY</th>
                      <th className="p-3">COUNTRY</th>
                      <th className="p-3 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[var(--border)] font-medium">
                    {branches.map((b) => (
                      <tr key={b.id} className="hover:bg-[var(--muted)]">
                        <td className="p-3 text-center font-mono font-bold text-[var(--primary-red)]">
                          #{b.id}
                        </td>
                        <td className="p-3 font-mono font-bold">{b.code}</td>
                        <td className="p-3 font-bold">{b.name}</td>
                        <td className="p-3">{b.city}</td>
                        <td className="p-3 font-bold">{b.country}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete("branches", b.id)}
                            className="p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: LEAVE TYPES MASTER */}
          {/* ========================================================================= */}
          {activeTab === "leave_types" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">
                    LEAVE TYPES MASTER
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">
                    POSTGRESQL TABLE: `leave_types` (SEQUENTIAL IDS: 1, 2, 3...)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary-red-hover)] cursor-pointer flex items-center gap-1.5 shadow-brutal self-start sm:self-auto"
                >
                  {showAddForm ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
                  <span>{showAddForm ? "CANCEL" : "ADD LEAVE TYPE"}</span>
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <form
                  onSubmit={handleCreate}
                  className="border-2 border-[var(--border)] bg-[var(--card)] p-5 shadow-brutal space-y-4"
                >
                  <div className="font-black text-xs uppercase tracking-wider text-[var(--foreground)] border-b pb-2">
                    CREATE NEW LEAVE TYPE (WILL GET NEXT ID: #{leaveTypes.length + 1})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="LV-06"
                        value={formData.code || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">LEAVE NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bereavement Leave"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">DAYS ALLOWED</label>
                      <input
                        type="number"
                        required
                        placeholder="5"
                        value={formData.days_allowed || ""}
                        onChange={(e) => setFormData({ ...formData, days_allowed: parseInt(e.target.value, 10) })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--secondary)] cursor-pointer"
                  >
                    SAVE LEAVE TYPE →
                  </button>
                </form>
              )}

              {/* Table */}
              <div className="border-2 border-[var(--border)] shadow-brutal-lg bg-[var(--card)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-b-2 border-[var(--border)] font-black uppercase tracking-wider">
                      <th className="p-3 w-16 text-center">ID</th>
                      <th className="p-3">CODE</th>
                      <th className="p-3">LEAVE TYPE NAME</th>
                      <th className="p-3 text-center">DAYS ALLOWED</th>
                      <th className="p-3 text-center">PAID STATUS</th>
                      <th className="p-3 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[var(--border)] font-medium">
                    {leaveTypes.map((l) => (
                      <tr key={l.id} className="hover:bg-[var(--muted)]">
                        <td className="p-3 text-center font-mono font-bold text-[var(--primary-red)]">
                          #{l.id}
                        </td>
                        <td className="p-3 font-mono font-bold">{l.code}</td>
                        <td className="p-3 font-bold">{l.name}</td>
                        <td className="p-3 text-center font-mono font-bold">{l.days_allowed} DAYS</td>
                        <td className="p-3 text-center">
                          <span className="bg-emerald-600 text-white px-2 py-0.5 font-bold text-[10px]">
                            {l.is_paid ? "PAID" : "UNPAID"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete("leave_types", l.id)}
                            className="p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: SHIFTS MASTER */}
          {/* ========================================================================= */}
          {activeTab === "shifts" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">
                    WORK SHIFTS MASTER
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">
                    POSTGRESQL TABLE: `shifts` (SEQUENTIAL IDS: 1, 2, 3...)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary-red-hover)] cursor-pointer flex items-center gap-1.5 shadow-brutal self-start sm:self-auto"
                >
                  {showAddForm ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
                  <span>{showAddForm ? "CANCEL" : "ADD SHIFT"}</span>
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <form
                  onSubmit={handleCreate}
                  className="border-2 border-[var(--border)] bg-[var(--card)] p-5 shadow-brutal space-y-4"
                >
                  <div className="font-black text-xs uppercase tracking-wider text-[var(--foreground)] border-b pb-2">
                    CREATE NEW SHIFT (WILL GET NEXT ID: #{shifts.length + 1})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="SH-05"
                        value={formData.code || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">SHIFT NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Weekend Shift"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">START TIME</label>
                      <input
                        type="text"
                        required
                        placeholder="08:00 AM"
                        value={formData.start_time || ""}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">END TIME</label>
                      <input
                        type="text"
                        required
                        placeholder="05:00 PM"
                        value={formData.end_time || ""}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--secondary)] cursor-pointer"
                  >
                    SAVE SHIFT →
                  </button>
                </form>
              )}

              {/* Table */}
              <div className="border-2 border-[var(--border)] shadow-brutal-lg bg-[var(--card)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-b-2 border-[var(--border)] font-black uppercase tracking-wider">
                      <th className="p-3 w-16 text-center">ID</th>
                      <th className="p-3">CODE</th>
                      <th className="p-3">SHIFT NAME</th>
                      <th className="p-3">TIMINGS</th>
                      <th className="p-3 text-center">GRACE TIME</th>
                      <th className="p-3 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[var(--border)] font-medium">
                    {shifts.map((s) => (
                      <tr key={s.id} className="hover:bg-[var(--muted)]">
                        <td className="p-3 text-center font-mono font-bold text-[var(--primary-red)]">
                          #{s.id}
                        </td>
                        <td className="p-3 font-mono font-bold">{s.code}</td>
                        <td className="p-3 font-bold">{s.name}</td>
                        <td className="p-3 font-mono">{s.start_time} - {s.end_time}</td>
                        <td className="p-3 text-center font-mono">{s.grace_minutes} MINS</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete("shifts", s.id)}
                            className="p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: SALARY GRADES MASTER */}
          {/* ========================================================================= */}
          {activeTab === "salary_grades" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">
                    SALARY GRADES MASTER
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mt-0.5">
                    POSTGRESQL TABLE: `salary_grades` (SEQUENTIAL IDS: 1, 2, 3...)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary-red-hover)] cursor-pointer flex items-center gap-1.5 shadow-brutal self-start sm:self-auto"
                >
                  {showAddForm ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
                  <span>{showAddForm ? "CANCEL" : "ADD SALARY GRADE"}</span>
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <form
                  onSubmit={handleCreate}
                  className="border-2 border-[var(--border)] bg-[var(--card)] p-5 shadow-brutal space-y-4"
                >
                  <div className="font-black text-xs uppercase tracking-wider text-[var(--foreground)] border-b pb-2">
                    CREATE NEW SALARY GRADE (WILL GET NEXT ID: #{salaryGrades.length + 1})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">CODE</label>
                      <input
                        type="text"
                        required
                        placeholder="GRD-06"
                        value={formData.code || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">GRADE NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chief Executive (L6)"
                        value={formData.grade_name || ""}
                        onChange={(e) => setFormData({ ...formData, grade_name: e.target.value })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">MIN SALARY</label>
                      <input
                        type="number"
                        required
                        placeholder="250000"
                        value={formData.min_salary || ""}
                        onChange={(e) => setFormData({ ...formData, min_salary: parseFloat(e.target.value) })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase mb-1">MAX SALARY</label>
                      <input
                        type="number"
                        required
                        placeholder="450000"
                        value={formData.max_salary || ""}
                        onChange={(e) => setFormData({ ...formData, max_salary: parseFloat(e.target.value) })}
                        className="w-full bg-[var(--background)] border-2 border-[var(--border)] px-3 py-2 text-xs font-medium focus:outline-none focus:border-[var(--highlight)]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[var(--primary-red)] text-white border-2 border-[var(--border)] px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--secondary)] cursor-pointer"
                  >
                    SAVE SALARY GRADE →
                  </button>
                </form>
              )}

              {/* Table */}
              <div className="border-2 border-[var(--border)] shadow-brutal-lg bg-[var(--card)] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--secondary)] text-[var(--secondary-foreground)] border-b-2 border-[var(--border)] font-black uppercase tracking-wider">
                      <th className="p-3 w-16 text-center">ID</th>
                      <th className="p-3">CODE</th>
                      <th className="p-3">GRADE NAME</th>
                      <th className="p-3">SALARY RANGE</th>
                      <th className="p-3 text-center">CURRENCY</th>
                      <th className="p-3 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[var(--border)] font-medium">
                    {salaryGrades.map((g) => (
                      <tr key={g.id} className="hover:bg-[var(--muted)]">
                        <td className="p-3 text-center font-mono font-bold text-[var(--primary-red)]">
                          #{g.id}
                        </td>
                        <td className="p-3 font-mono font-bold">{g.code}</td>
                        <td className="p-3 font-bold">{g.grade_name}</td>
                        <td className="p-3 font-mono font-bold">
                          ${Number(g.min_salary).toLocaleString()} - ${Number(g.max_salary).toLocaleString()}
                        </td>
                        <td className="p-3 text-center font-mono font-bold">{g.currency}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete("salary_grades", g.id)}
                            className="p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
