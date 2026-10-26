
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
    orange: "bg-[#FFE9D9] text-[#F04A13]",
    blue: "bg-[#CDE6FF] text-[#087AF0]",
    green: "bg-[#D1FBD1] text-[#13A52E]",
    purple: "bg-[#E8D8FF] text-[#8219F5]",
  };

  return (
    <section className="h-full rounded-2xl border border-[#E6EDF5] bg-white p-5 shadow-[0_3px_8px_rgba(25,43,80,0.04)] sm:p-6">
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
            <span className="text-sm font-medium leading-5 text-[#577B9F]">
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
          ? "border-transparent bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13]"
          : "border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
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
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#E8EDF4] bg-[#EDF4FF] px-2.5 py-2 text-xs font-semibold text-[#4276B5] hover:bg-[#E3ECF8]"
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
              ? "bg-[#FFF1E5] text-[#B85D0A]"
              : "bg-[#EAF7ED] text-[#218838]"
          }`}
        >
          {row[key] || "—"}
        </span>
      );
    }

    return (
      <span className="whitespace-nowrap text-[#577B9F]">
        {row[key] || "—"}
      </span>
    );
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { border: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1500px] space-y-5">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <PackageCheck size={15} />
              <span className="text-[11px] font-extrabold">
                INVENTORY · REPORTS
              </span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Stock Adjustment Report
            </h1>
            <p className="app-description mt-1">
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
        <section className="no-print flex flex-col gap-3 rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <label className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CDE6FF] text-[#087AF0]">
              <MapPin size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-xs font-semibold text-[#577B9F]">
                Location
              </span>
              <select
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm text-[#132653] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10 sm:min-w-52"
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
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
              <CalendarDays size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 block text-xs font-semibold text-[#577B9F]">
                Date range
              </span>
              <select
                value={dateFilter}
                onChange={(event) => {
                  setDateFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm text-[#132653] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10 sm:min-w-48"
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
                className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm outline-none focus:border-[#FF8A37]"
              />
              <input
                aria-label="End date"
                type="date"
                value={customEnd}
                onChange={(event) => {
                  setCustomEnd(event.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm outline-none focus:border-[#FF8A37]"
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
        <section className="no-print overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <Filter size={19} />
              </span>
              <span>
                <span className="block font-bold text-[#10234F]">Filters</span>
                <span className="app-description mt-0.5 block">
                  Narrow the report by location and date.
                </span>
              </span>
            </div>
            {showFilters ? (
              <ChevronUp size={18} className="text-[#8798AD]" />
            ) : (
              <ChevronDown size={18} className="text-[#8798AD]" />
            )}
          </button>

          {showFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F2E8DE] px-5 py-4 sm:px-6">
              <p className="app-description">
                Use the selectors above to narrow adjustment records.
              </p>
              <Button icon={RotateCcw} onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
          )}
        </section>

        {/* Table */}
        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <PackageCheck size={19} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  Stock Adjustments
                </h2>
                <p className="app-description mt-0.5">
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
              <label className="flex items-center gap-2 text-sm text-[#577B9F]">
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
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-medium text-[#577B9F] hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
                >
                  <SlidersHorizontal size={15} />
                  Column visibility
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-30 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-[#F8EBDD] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-[#F2E8DE] pb-2">
                      <span className="text-sm font-bold text-[#19366F]">
                        Visible columns
                      </span>
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
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search adjustments..."
                className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
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
                          className="inline-flex items-center gap-2 text-left leading-5 hover:text-[#F04A13]"
                        >
                          {column.label}
                          {column.key !== "action" &&
                            (sort.key === column.key ? (
                              sort.direction === "asc" ? (
                                <ChevronUp
                                  size={14}
                                  className="text-[#F04A13]"
                                />
                              ) : (
                                <ChevronDown
                                  size={14}
                                  className="text-[#F04A13]"
                                />
                              )
                            ) : (
                              <ArrowUpDown
                                size={13}
                                className="text-[#D5DDE7]"
                              />
                            ))}
                        </button>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F2E8DE]">
                {pageRows.map((row, index) => (
                  <tr
                    key={row.id ?? `${row.referenceNo}-${index}`}
                    className={`transition-colors hover:bg-[#FFF7EF] ${
                      index % 2 ? "bg-[#FFFEFC]" : "bg-white"
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
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#8798AD]">
                        <ClipboardList size={21} />
                      </div>
                      <p className="mt-3 font-semibold text-[#10234F]">
                        No data available in table
                      </p>
                      <p className="app-description mt-1">
                        Stock adjustment records will appear here when available.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>

              {pageRows.length > 0 && (
                <tfoot>
                  <tr className="border-t border-[#F2E8DE] bg-[#FFF7EF]">
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
          <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="app-description">
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
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-medium text-[#577B9F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF711A] px-3 text-sm font-semibold text-white">
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
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-medium text-[#577B9F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-[#8798AD] sm:flex-row">
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
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-5 py-4">
              <div>
                <h2 className="font-bold text-[#10234F]">
                  Stock Adjustment Details
                </h2>
                <p className="app-description mt-1">
                  Reference: {selectedAdjustment.referenceNo || "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdjustment(null)}
                aria-label="Close details"
                className="rounded-lg p-2 text-[#8798AD] hover:bg-[#FFF1E5] hover:text-[#19366F]"
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
                    className="flex items-start justify-between gap-4 border-b border-[#F2E8DE] pb-3 last:border-0"
                  >
                    <span className="text-sm text-[#577B9F]">
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
