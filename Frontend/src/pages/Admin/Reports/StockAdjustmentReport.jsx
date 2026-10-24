
import React, { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Filter,
  RotateCcw,
  ClipboardList,
  Wallet,
  CircleDollarSign,
  PackageCheck,
  X,
  ArrowUpDown,
} from "lucide-react";

const initialAdjustments = [];

const columns = [
  { key: "action", label: "Action" },
  { key: "date", label: "Date" },
  { key: "referenceNo", label: "Reference No" },
  { key: "location", label: "Location" },
  { key: "adjustmentType", label: "Adjustment type" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "amountRecovered", label: "Total amount recovered" },
  { key: "reason", label: "Reason" },
  { key: "addedBy", label: "Added By" },
];

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function SummaryCard({ title, rows, icon: Icon, accent = "orange" }) {
  const accentStyles = {
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
  };

  return (
    <section className="h-full rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-[0_5px_24px_rgba(16,35,79,0.045)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-[#10234F]">{title}</h2>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentStyles[accent]}`}
        >
          <Icon size={19} />
        </span>
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4"
          >
            <span className="text-sm font-medium leading-5 text-slate-600">
              {row.label}
            </span>
            <span className="whitespace-nowrap text-sm font-bold tabular-nums text-[#10234F]">
              {money(row.value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Button({ icon: Icon, children, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
        primary
          ? "border-transparent bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-sm hover:brightness-105"
          : "border-[#E1E7EF] bg-white text-[#34445E] hover:border-orange-200 hover:bg-orange-50 hover:text-[#D85B13]"
      }`}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

export default function StockAdjustmentReport() {
  const [adjustments] = useState(initialAdjustments);
  const [location, setLocation] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumns, setShowColumns] = useState(false);
  const [sort, setSort] = useState({
    key: "date",
    direction: "desc",
  });
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);

  const locations = useMemo(
    () => [
      ...new Set(
        adjustments.map((item) => item.location).filter(Boolean)
      ),
    ],
    [adjustments]
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    let rows = adjustments.filter((item) => {
      const matchesSearch = columns
        .filter((column) => column.key !== "action")
        .some((column) =>
          String(item[column.key] ?? "")
            .toLowerCase()
            .includes(query)
        );

      const matchesLocation =
        location === "all" || item.location === location;

      let matchesDate = true;

      if (dateFilter === "custom") {
        if (customStart && item.date) {
          matchesDate = item.date >= customStart;
        }
        if (matchesDate && customEnd && item.date) {
          matchesDate = item.date <= customEnd;
        }
      } else if (dateFilter !== "all" && item.date) {
        const today = new Date();
        const date = new Date(item.date);
        const start = new Date(today);

        if (dateFilter === "today") {
          start.setHours(0, 0, 0, 0);
          const end = new Date(start);
          end.setDate(end.getDate() + 1);
          matchesDate = date >= start && date < end;
        } else if (dateFilter === "week") {
          start.setDate(today.getDate() - today.getDay());
          start.setHours(0, 0, 0, 0);
          matchesDate = date >= start && date <= today;
        } else if (dateFilter === "month") {
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          matchesDate = date >= start && date <= today;
        }
      }

      return matchesSearch && matchesLocation && matchesDate;
    });

    if (sort.key !== "action") {
      rows = [...rows].sort((a, b) => {
        const first = a[sort.key] ?? "";
        const second = b[sort.key] ?? "";

        const numericKeys = ["totalAmount", "amountRecovered"];
        let result;

        if (numericKeys.includes(sort.key)) {
          result = Number(first) - Number(second);
        } else {
          result = String(first).localeCompare(String(second), undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }

        return sort.direction === "asc" ? result : -result;
      });
    }

    return rows;
  }, [
    adjustments,
    search,
    location,
    dateFilter,
    customStart,
    customEnd,
    sort,
  ]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );
  const safePage = Math.min(currentPage, pageCount);
  const startIndex = filteredRows.length
    ? (safePage - 1) * pageSize
    : 0;
  const pageRows = filteredRows.slice(
    startIndex,
    startIndex + pageSize
  );

  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (sum, row) => ({
          amount: sum.amount + Number(row.totalAmount || 0),
          recovered:
            sum.recovered + Number(row.amountRecovered || 0),
        }),
        { amount: 0, recovered: 0 }
      ),
    [filteredRows]
  );

  const resetFilters = () => {
    setLocation("all");
    setDateFilter("all");
    setCustomStart("");
    setCustomEnd("");
    setSearch("");
    setCurrentPage(1);
  };

  const toggleSort = (key) => {
    if (key === "action") return;

    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const toggleColumn = (key) => {
    setVisibleColumns((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  };

  const exportCSV = () => {
    const exportColumns = columns.filter(
      (column) =>
        visibleColumns.includes(column.key) && column.key !== "action"
    );

    const escape = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const data = [
      exportColumns.map((column) => escape(column.label)).join(","),
      ...filteredRows.map((row) =>
        exportColumns
          .map((column) => {
            const value = ["totalAmount", "amountRecovered"].includes(
              column.key
            )
              ? money(row[column.key])
              : row[column.key] ?? "";
            return escape(value);
          })
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + data], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "StockAdjustmentReport.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  const renderCell = (row, key) => {
    if (key === "action") {
      return (
        <button
          type="button"
          onClick={() => setSelectedAdjustment(row)}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
        >
          <ClipboardList size={14} />
          View details
        </button>
      );
    }

    if (key === "totalAmount" || key === "amountRecovered") {
      return (
        <span className="whitespace-nowrap font-semibold tabular-nums text-[#10234F]">
          {money(row[key])}
        </span>
      );
    }

    if (key === "adjustmentType") {
      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            String(row[key]).toLowerCase() === "abnormal"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {row[key] || "—"}
        </span>
      );
    }

    return (
      <span className="whitespace-nowrap text-slate-600">
        {row[key] || "—"}
      </span>
    );
  };

  return (
    <main className="min-h-screen min-w-0 bg-[#FFFAF5] px-4 py-5 font-sans text-slate-700 sm:px-6 lg:px-8">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { border: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#E86A20]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6814]" />
              Inventory management
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              Stock Adjustment Report
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Review stock adjustments, recovered amounts, and adjustment records.
            </p>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <Button icon={FileSpreadsheet} onClick={exportCSV}>
              Export Excel
            </Button>
            <Button icon={FileText} onClick={printReport} primary>
              Export PDF
            </Button>
          </div>
        </header>

        {/* Location and date selectors */}
        <section className="no-print flex flex-col gap-3 rounded-2xl border border-[#E6EAF0] bg-white p-4 shadow-[0_5px_24px_rgba(16,35,79,0.035)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <label className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-xs font-semibold text-slate-500">
                Location
              </span>
              <select
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-[#DFE5EE] bg-[#FFFEFC] px-3 py-2 text-sm text-[#10234F] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:min-w-52"
              >
                <option value="all">All locations</option>
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <label className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <CalendarDays size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-xs font-semibold text-slate-500">
                Date range
              </span>
              <select
                value={dateFilter}
                onChange={(event) => {
                  setDateFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-[#DFE5EE] bg-[#FFFEFC] px-3 py-2 text-sm text-[#10234F] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:min-w-48"
              >
                <option value="all">All dates</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="custom">Custom range</option>
              </select>
            </span>
          </label>

          {dateFilter === "custom" && (
            <div className="flex flex-wrap gap-2">
              <input
                aria-label="Start date"
                type="date"
                value={customStart}
                onChange={(event) => {
                  setCustomStart(event.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#DFE5EE] px-3 py-2 text-sm outline-none focus:border-orange-400"
              />
              <input
                aria-label="End date"
                type="date"
                value={customEnd}
                onChange={(event) => {
                  setCustomEnd(event.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#DFE5EE] px-3 py-2 text-sm outline-none focus:border-orange-400"
              />
            </div>
          )}
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SummaryCard
            title="Adjustment Summary"
            icon={ClipboardList}
            accent="orange"
            rows={[
              { label: "Total Normal", value: 0 },
              { label: "Total Abnormal", value: 0 },
              { label: "Total Stock Adjustment", value: 0 },
            ]}
          />

          <SummaryCard
            title="Recovery Summary"
            icon={Wallet}
            accent="green"
            rows={[
              { label: "Total Amount Recovered", value: 0 },
            ]}
          />
        </section>

        {/* Filters panel */}
        <section className="no-print overflow-visible rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_24px_rgba(16,35,79,0.035)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
                <Filter size={19} />
              </span>
              <span>
                <span className="block font-bold text-[#10234F]">Filters</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Narrow the report by location and date.
                </span>
              </span>
            </div>
            {showFilters ? (
              <ChevronUp size={18} className="text-slate-400" />
            ) : (
              <ChevronDown size={18} className="text-slate-400" />
            )}
          </button>

          {showFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF0F5] px-5 py-4 sm:px-6">
              <p className="text-sm text-slate-500">
                Use the selectors above to narrow adjustment records.
              </p>
              <Button icon={RotateCcw} onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
          )}
        </section>

        {/* Table */}
        <section className="print-area overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_24px_rgba(16,35,79,0.045)]">
          <div className="flex flex-col gap-4 border-b border-[#EDF0F5] px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
                <PackageCheck size={19} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#10234F]">
                  Stock Adjustments
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Adjustment history and recovery details
                </p>
              </div>
            </div>

            <div className="no-print flex flex-wrap gap-2">
              <Button icon={Download} onClick={exportCSV}>
                Export CSV
              </Button>
              <Button icon={FileSpreadsheet} onClick={exportCSV}>
                Export Excel
              </Button>
              <Button icon={Printer} onClick={printReport}>
                Print
              </Button>
              <Button icon={FileText} onClick={printReport}>
                Export PDF
              </Button>
            </div>
          </div>

          {/* Table toolbar */}
          <div className="no-print flex flex-col gap-4 px-5 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm text-[#10234F] outline-none focus:border-orange-400"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-orange-200 hover:bg-orange-50"
                >
                  <SlidersHorizontal size={15} />
                  Column visibility
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-30 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-[#E6EAF0] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-sm font-bold text-[#10234F]">
                        Visible columns
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowColumns(false)}
                        aria-label="Close column visibility"
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    {columns.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-orange-50"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="h-4 w-4 accent-[#FF6814]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="relative block w-full xl:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search adjustments..."
                className="w-full rounded-xl border border-[#DFE5EE] bg-[#FFFEFC] py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
          </div>

          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-[#E9EDF3] bg-[#F8FAFC]">
                  {columns
                    .filter((column) =>
                      visibleColumns.includes(column.key)
                    )
                    .map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-[#52617A]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className="inline-flex items-center gap-2 text-left leading-5 hover:text-[#E86A20]"
                        >
                          {column.label}
                          {column.key !== "action" &&
                            (sort.key === column.key ? (
                              sort.direction === "asc" ? (
                                <ChevronUp
                                  size={14}
                                  className="text-[#E86A20]"
                                />
                              ) : (
                                <ChevronDown
                                  size={14}
                                  className="text-[#E86A20]"
                                />
                              )
                            ) : (
                              <ArrowUpDown
                                size={13}
                                className="text-slate-300"
                              />
                            ))}
                        </button>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EDF0F5]">
                {pageRows.map((row, index) => (
                  <tr
                    key={row.id ?? `${row.referenceNo}-${index}`}
                    className={`transition-colors hover:bg-orange-50/50 ${
                      index % 2 ? "bg-[#FCFDFE]" : "bg-white"
                    }`}
                  >
                    {columns
                      .filter((column) =>
                        visibleColumns.includes(column.key)
                      )
                      .map((column) => (
                        <td
                          key={column.key}
                          className="px-4 py-4 align-middle"
                        >
                          {renderCell(row, column.key)}
                        </td>
                      ))}
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={Math.max(visibleColumns.length, 1)}
                      className="px-6 py-14 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <ClipboardList size={21} />
                      </div>
                      <p className="mt-3 font-semibold text-[#10234F]">
                        No data available in table
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Stock adjustment records will appear here when available.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>

              {pageRows.length > 0 && (
                <tfoot>
                  <tr className="border-t border-[#DDE4ED] bg-[#F0F3F8]">
                    {columns
                      .filter((column) =>
                        visibleColumns.includes(column.key)
                      )
                      .map((column, index) => {
                        let value = "";
                        if (index === 0) value = "Total:";
                        if (column.key === "totalAmount") {
                          value = money(totals.amount);
                        }
                        if (column.key === "amountRecovered") {
                          value = money(totals.recovered);
                        }

                        return (
                          <td
                            key={column.key}
                            className="whitespace-nowrap px-4 py-4 font-bold text-[#10234F]"
                          >
                            {value}
                          </td>
                        );
                      })}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          <div className="no-print flex flex-col gap-4 border-t border-[#EDF0F5] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredRows.length ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#10234F]">
                {Math.min(startIndex + pageSize, filteredRows.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredRows.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-3 text-sm font-semibold text-white">
                {safePage}
              </span>

              <button
                type="button"
                disabled={safePage >= pageCount}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(pageCount, page + 1)
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-slate-400 sm:flex-row">
          <p>Billomax · Stock Adjustment Report</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>

      {/* Adjustment detail dialog */}
      {selectedAdjustment && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedAdjustment(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EDF0F5] bg-[#FFFAF5] px-5 py-4">
              <div>
                <h2 className="font-bold text-[#10234F]">
                  Stock Adjustment Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Reference: {selectedAdjustment.referenceNo || "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdjustment(null)}
                aria-label="Close details"
                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {columns
                .filter((column) => column.key !== "action")
                .map((column) => (
                  <div
                    key={column.key}
                    className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0"
                  >
                    <span className="text-sm text-slate-500">
                      {column.label}
                    </span>
                    <span className="max-w-[60%] break-words text-right text-sm font-semibold text-[#10234F]">
                      {["totalAmount", "amountRecovered"].includes(
                        column.key
                      )
                        ? money(selectedAdjustment[column.key])
                        : selectedAdjustment[column.key] || "—"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
