
import React, { useMemo, useState } from "react";
import {
  Activity,
  Filter,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  X,
  UserRound,
  LogIn,
  LogOut,
  ReceiptText,
  CalendarDays,
  Clock3,
} from "lucide-react";

const initialActivities = [
  { id: 1, date: "22/10/2026 12:12", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 2, date: "22/10/2026 11:21", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  {
    id: 3,
    date: "22/10/2026 11:00",
    subjectType: "Sell",
    action: "Added",
    by: "Mr pharmacy",
    note: "Invoice No.: 0041",
    details: { status: "Final", total: 15, paymentStatus: "Paid" },
  },
  { id: 4, date: "22/10/2026 10:59", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 5, date: "22/10/2026 10:32", subjectType: "User", action: "Logout", by: "Mr pharmacy", note: "" },
  { id: 6, date: "22/10/2026 09:57", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 7, date: "22/10/2026 09:54", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 8, date: "19/10/2026 12:20", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 9, date: "19/10/2026 12:19", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 10, date: "19/10/2026 11:37", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 11, date: "19/10/2026 11:37", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 12, date: "16/10/2026 13:25", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 13, date: "16/10/2026 11:04", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 14, date: "16/10/2026 10:57", subjectType: "User", action: "Logout", by: "Mr pharmacy", note: "" },
  { id: 15, date: "16/10/2026 10:56", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 16, date: "14/10/2026 14:58", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 17, date: "14/10/2026 12:31", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
  { id: 18, date: "14/10/2026 11:40", subjectType: "User", action: "Login", by: "Mr pharmacy", note: "" },
];

const columns = [
  { key: "date", label: "Date" },
  { key: "subjectType", label: "Subject Type" },
  { key: "action", label: "Action" },
  { key: "by", label: "By" },
  { key: "note", label: "Note" },
];

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ActionButton({ icon: Icon, children, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-orange-200 ${
        primary
          ? "border-transparent bg-[#FF711A] text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] hover:bg-[#F04A13]"
          : "border-[#E8EDF4] bg-white text-[#19366F] shadow-sm hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
      }`}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

function SummaryCard({ title, value, description, icon: Icon }) {
  return (
    <div className="flex min-h-[84px] items-center gap-2.5 rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FFE5AD] text-[#F47700]">
        <Icon size={22} strokeWidth={2.8} />
      </span>
      <div className="min-w-0">
        <p className="mb-1 text-[11px] font-bold leading-4 text-[#526D8D]">
          {title}
        </p>
        <p className="text-[18px] font-extrabold leading-none tracking-tight text-[#101C3D]">
          {value}
        </p>
        <p className="mt-1 text-[10px] text-[#577B9F]">{description}</p>
      </div>
    </div>
  );
}

function ActivityNote({ row }) {
  if (!row.note && !row.details) {
    return <span className="text-[#A5B1C0]">—</span>;
  }

  return (
    <div className="min-w-[190px] rounded-lg border border-[#F2E8DE] bg-[#FFFCF8] p-3">
      {row.note && (
        <p className="mb-2 text-sm font-semibold text-[#19366F]">{row.note}</p>
      )}
      {row.details && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#577B9F]">Status</span>
            <span className="rounded-md bg-[#EAF3FF] px-2 py-1 font-bold text-[#3478F6]">
              {row.details.status}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#577B9F]">Total</span>
            <span className="rounded-md bg-[#EAF3FF] px-2 py-1 font-bold text-[#3478F6]">
              {money(row.details.total)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#577B9F]">Payment Status</span>
            <span className="rounded-md bg-[#E7F7EE] px-2 py-1 font-bold text-[#16824B]">
              {row.details.paymentStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActivityLog() {
  const [activities] = useState(initialActivities);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [sort, setSort] = useState({ key: "date", direction: "desc" });

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = activities.filter((row) => {
      const matchesSearch = [
        row.date,
        row.subjectType,
        row.action,
        row.by,
        row.note,
        row.details?.status,
        row.details?.paymentStatus,
      ].some((value) => String(value ?? "").toLowerCase().includes(query));

      const matchesSubject =
        subjectFilter === "All" || row.subjectType === subjectFilter;
      const matchesAction = actionFilter === "All" || row.action === actionFilter;

      return matchesSearch && matchesSubject && matchesAction;
    });

    return [...result].sort((a, b) => {
      const comparison = String(a[sort.key] ?? "").localeCompare(
        String(b[sort.key] ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" }
      );
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [activities, search, subjectFilter, actionFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredActivities.length ? (safePage - 1) * pageSize : 0;
  const pageRows = filteredActivities.slice(startIndex, startIndex + pageSize);

  const loginCount = activities.filter((row) => row.action === "Login").length;
  const logoutCount = activities.filter((row) => row.action === "Logout").length;
  const salesCount = activities.filter((row) => row.subjectType === "Sell").length;

  const toggleSort = (key) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleColumn = (key) => {
    setVisibleColumns((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSubjectFilter("All");
    setActionFilter("All");
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const exportColumns = columns.filter((column) =>
      visibleColumns.includes(column.key)
    );
    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      exportColumns.map((column) => escapeCSV(column.label)).join(","),
      ...filteredActivities.map((row) =>
        exportColumns
          .map((column) => {
            const value =
              column.key === "note" && row.details
                ? `${row.note}; Status: ${row.details.status}; Total: ${money(
                    row.details.total
                  )}; Payment Status: ${row.details.paymentStatus}`
                : row[column.key];
            return escapeCSV(value);
          })
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ActivityLog.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen min-w-0 bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { border: 0 !important; box-shadow: none !important; overflow: visible !important; }
          .print-area table { min-width: 100% !important; }
          .print-area th, .print-area td { padding: 6px !important; font-size: 10px !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1700px] space-y-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <Activity size={14} />
              <span className="text-[11px] font-extrabold">PHARMACY · REPORTS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Activity Log
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Review user sessions, sales activity, and recorded events.
            </p>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <ActionButton icon={Download} onClick={exportCSV}>Export CSV</ActionButton>
            <ActionButton icon={FileSpreadsheet} onClick={exportCSV}>Export Excel</ActionButton>
            <ActionButton icon={Printer} onClick={() => window.print()}>Print</ActionButton>
            <ActionButton icon={FileText} onClick={() => window.print()} primary>
              Export PDF
            </ActionButton>
          </div>
        </header>

        <section className="no-print overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
                <Filter size={19} />
              </span>
              <span>
                <span className="app-section-title block text-[#10234F]">Filters</span>
                <span className="app-description mt-0.5 block text-[#577B9F]">
                  Narrow activities by subject, action, or keyword.
                </span>
              </span>
            </div>
            {showFilters ? <ChevronUp size={18} className="text-[#577B9F]" /> : <ChevronDown size={18} className="text-[#577B9F]" />}
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 border-t border-[#F2E8DE] bg-[#FFFEFC] px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-[#577B9F]">Subject type</span>
                <select
                  value={subjectFilter}
                  onChange={(event) => {
                    setSubjectFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  <option value="All">All subject types</option>
                  <option value="User">User</option>
                  <option value="Sell">Sell</option>
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-[#577B9F]">Action</span>
                <select
                  value={actionFilter}
                  onChange={(event) => {
                    setActionFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  <option value="All">All actions</option>
                  <option value="Login">Login</option>
                  <option value="Logout">Logout</option>
                  <option value="Added">Added</option>
                </select>
              </label>

              <div className="flex items-end">
                <ActionButton icon={RotateCcw} onClick={resetFilters}>Reset filters</ActionButton>
              </div>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Activity records"
            value={activities.length}
            description="Records currently loaded"
            icon={Activity}
          />
          <SummaryCard
            title="Login events"
            value={loginCount}
            description="Recorded login actions"
            icon={LogIn}
          />
          <SummaryCard
            title="Logout events"
            value={logoutCount}
            description="Recorded logout actions"
            icon={LogOut}
          />
          <SummaryCard
            title="Sales activities"
            value={salesCount}
            description="Recorded sales-related events"
            icon={ReceiptText}
          />
        </section>

        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="no-print flex flex-col gap-4 px-5 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#577B9F]">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm text-[#19366F] outline-none focus:border-[#FF8A37]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                entries
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColumns((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
                >
                  <SlidersHorizontal size={15} />
                  Column visibility
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-30 mt-2 w-60 rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-[#F2E8DE] pb-2">
                      <span className="text-sm font-bold text-[#10234F]">Visible columns</span>
                      <button
                        type="button"
                        onClick={() => setShowColumns(false)}
                        aria-label="Close column visibility"
                        className="rounded-md p-1 text-[#8798AD] hover:bg-[#FFF1E5]"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    {columns.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#577B9F] hover:bg-[#FFF1E5]"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="h-4 w-4 accent-[#FF711A]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="relative block w-full xl:max-w-sm">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search activity log..."
                className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                  {columns
                    .filter((column) => visibleColumns.includes(column.key))
                    .map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wide text-[#526D8D]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className="inline-flex items-center gap-2 text-left leading-5 hover:text-[#F04A13]"
                        >
                          {column.label}
                          {sort.key === column.key ? (
                            sort.direction === "asc" ? (
                              <ChevronUp size={14} className="shrink-0 text-[#F04A13]" />
                            ) : (
                              <ChevronDown size={14} className="shrink-0 text-[#F04A13]" />
                            )
                          ) : (
                            <ArrowUpDown size={13} className="shrink-0 text-[#A5B1C0]" />
                          )}
                        </button>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F2E8DE]">
                {pageRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-[#FFF7EF] ${
                      index % 2 ? "bg-[#FFFCF8]" : "bg-white"
                    }`}
                  >
                    {columns
                      .filter((column) => visibleColumns.includes(column.key))
                      .map((column) => (
                        <td key={column.key} className="px-4 py-3.5 align-top">
                          {column.key === "date" ? (
                            <span className="inline-flex items-center gap-2 whitespace-nowrap font-semibold text-[#19366F]">
                              <CalendarDays size={14} className="shrink-0 text-[#8798AD]" />
                              {row.date}
                            </span>
                          ) : column.key === "subjectType" ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF1E5] text-[#F04A13]">
                                {row.subjectType === "User" ? (
                                  <UserRound size={14} />
                                ) : (
                                  <ReceiptText size={14} />
                                )}
                              </span>
                              <span className="font-semibold text-[#19366F]">{row.subjectType}</span>
                            </span>
                          ) : column.key === "action" ? (
                            <span
                              className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                row.action === "Login"
                                  ? "bg-[#E7F7EE] text-[#16824B]"
                                  : row.action === "Logout"
                                    ? "bg-[#FFF1E5] text-[#D96A19]"
                                    : "bg-[#EAF3FF] text-[#3478F6]"
                              }`}
                            >
                              {row.action}
                            </span>
                          ) : column.key === "by" ? (
                            <span className="font-medium text-[#577B9F]">{row.by}</span>
                          ) : (
                            <ActivityNote row={row} />
                          )}
                        </td>
                      ))}
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={Math.max(visibleColumns.length, 1)}
                      className="px-6 py-12 text-center"
                    >
                      <Activity size={25} className="mx-auto text-[#FF9A56]" />
                      <p className="mt-3 font-semibold text-[#10234F]">
                        No activity records found
                      </p>
                      <p className="mt-1 text-sm text-[#577B9F]">
                        Try changing the search term or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#577B9F]">
              Showing{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredActivities.length ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#10234F]">
                {Math.min(startIndex + pageSize, filteredActivities.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredActivities.length}
              </span>{" "}
              entries
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} /> Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - safePage) <= 1
                )
                .map((page, index, pages) => (
                  <React.Fragment key={page}>
                    {index > 0 && page - pages[index - 1] > 1 && (
                      <span className="px-1 text-[#8798AD]">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold ${
                        safePage === page
                          ? "bg-[#FF711A] text-white"
                          : "border border-[#E8EDF4] bg-white text-[#19366F] hover:bg-[#FFF1E5]"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-[#8798AD] sm:flex-row sm:text-left">
          <p>Billomax · Activity Log</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>

      <div className="no-print fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3478F6] text-white shadow-[0_6px_18px_rgba(52,120,246,0.35)] transition hover:bg-[#2563EB]"
        >
          <ChevronUp size={22} strokeWidth={3} />
        </button>
      </div>
    </main>
  );
}
