
import React, { useMemo, useState } from "react";
import {
  Warehouse,
  Package,
  Boxes,
  AlertTriangle,
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
  RotateCcw,
  X,
  ArrowUpDown,
  MapPin,
  Layers3,
  Activity,
  CircleCheck,
  CircleAlert,
} from "lucide-react";

const initialRows = [];

const columns = [
  { key: "location", label: "Location" },
  { key: "rack", label: "Rack" },
  { key: "totalProducts", label: "Total Products" },
  { key: "totalStockQuantity", label: "Total Stock Quantity" },
  { key: "lowStockProducts", label: "Low Stock Products" },
  { key: "outOfStockProducts", label: "Out of Stock Products" },
  { key: "expiringProducts", label: "Expiring Products" },
  { key: "status", label: "Status" },
];

function SummaryCard({ title, value, icon: Icon, accent, detail }) {
  const styles = {
    orange: "bg-[#FFE5AD] text-[#F47700]",
    blue: "bg-[#CDE6FF] text-[#087AF0]",
    green: "bg-[#D1FBD1] text-[#13A52E]",
    red: "bg-[#FFE0DC] text-[#E24C3B]",
  };

  return (
    <div className="flex min-h-[84px] items-center gap-2.5 rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${styles[accent]}`}>
        <Icon size={22} strokeWidth={2.8} />
      </span>
      <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold leading-4 text-[#526D8D]">{title}</p>
          <p className="break-words text-[18px] font-extrabold leading-none tracking-tight text-[#101C3D]">
            {value}
          </p>
          {detail && <p className="mt-1 text-[10px] text-[#577B9F]">{detail}</p>}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  icon: Icon,
  onClick,
  primary = false,
}) {
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

export default function RackInventoryInsights() {
  const [rows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({
    key: "location",
    direction: "asc",
  });
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );

  const locations = useMemo(
    () => [...new Set(rows.map((row) => row.location).filter(Boolean))],
    [rows]
  );

  const statuses = useMemo(
    () => [...new Set(rows.map((row) => row.status).filter(Boolean))],
    [rows]
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = rows.filter((row) => {
      const matchesSearch = columns.some((column) =>
        String(row[column.key] ?? "")
          .toLowerCase()
          .includes(query)
      );

      const matchesLocation =
        locationFilter === "all" || row.location === locationFilter;

      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      return matchesSearch && matchesLocation && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      const numericKeys = [
        "totalProducts",
        "totalStockQuantity",
        "lowStockProducts",
        "outOfStockProducts",
        "expiringProducts",
      ];

      const first = a[sort.key] ?? "";
      const second = b[sort.key] ?? "";

      let comparison;

      if (numericKeys.includes(sort.key)) {
        comparison = Number(first) - Number(second);
      } else {
        comparison = String(first).localeCompare(String(second), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [rows, search, locationFilter, statusFilter, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredRows.length
    ? (safePage - 1) * pageSize
    : 0;

  const pageRows = filteredRows.slice(
    startIndex,
    startIndex + pageSize
  );

  const summary = useMemo(
    () =>
      filteredRows.reduce(
        (totals, row) => ({
          totalProducts: totals.totalProducts + Number(row.totalProducts || 0),
          totalStockQuantity:
            totals.totalStockQuantity + Number(row.totalStockQuantity || 0),
          racks: totals.racks + (row.rack ? 1 : 0),
          racksNeedingAttention:
            totals.racksNeedingAttention +
            (Number(row.lowStockProducts || 0) > 0 ||
            Number(row.outOfStockProducts || 0) > 0 ||
            Number(row.expiringProducts || 0) > 0
              ? 1
              : 0),
        }),
        {
          totalProducts: 0,
          totalStockQuantity: 0,
          racks: 0,
          racksNeedingAttention: 0,
        }
      ),
    [filteredRows]
  );

  const resetFilters = () => {
    setSearch("");
    setLocationFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const toggleSort = (key) => {
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
    const exportColumns = columns.filter((column) =>
      visibleColumns.includes(column.key)
    );

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const content = [
      exportColumns.map((column) => escapeCSV(column.label)).join(","),
      ...filteredRows.map((row) =>
        exportColumns
          .map((column) => escapeCSV(row[column.key] ?? ""))
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + content], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "RackInventoryInsights.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderCell = (row, key) => {
    if (key === "status") {
      const status = String(row.status || "").toLowerCase();
      const isAttention =
        status.includes("low") ||
        status.includes("out") ||
        status.includes("expir");

      return (
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
            isAttention
              ? "bg-[#FFE8E5] text-[#C43F32]"
              : "bg-[#E7F7E9] text-[#25813A]"
          }`}
        >
          {isAttention ? (
            <CircleAlert size={13} />
          ) : (
            <CircleCheck size={13} />
          )}
          {row.status || "—"}
        </span>
      );
    }

    if (
      [
        "totalProducts",
        "totalStockQuantity",
        "lowStockProducts",
        "outOfStockProducts",
        "expiringProducts",
      ].includes(key)
    ) {
      const isAlert =
        ["lowStockProducts", "outOfStockProducts", "expiringProducts"].includes(
          key
        ) && Number(row[key] || 0) > 0;

      return (
        <span
          className={`font-semibold tabular-nums ${
            isAlert ? "text-[#C43F32]" : "text-[#19366F]"
          }`}
        >
          {Number(row[key] || 0).toLocaleString("en-IN", {
            minimumFractionDigits: key === "totalStockQuantity" ? 2 : 0,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    }

    return (
      <span className="whitespace-nowrap font-medium text-[#577B9F]">
        {row[key] || "—"}
      </span>
    );
  };

  return (
    <main className="min-h-screen min-w-0 bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { border: 0 !important; box-shadow: none !important; overflow: visible !important; }
          .print-area table { min-width: 100% !important; }
          .print-area th, .print-area td { padding: 6px !important; font-size: 9px !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1700px] space-y-5">
        {/* Page heading */}
        <header>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
            <Warehouse size={14} />
            <span className="text-[11px] font-extrabold">PHARMACY · REPORTS</span>
          </div>

          <h1 className="app-page-title text-[#10234F]">
            Rack Inventory Insights
          </h1>

          <p className="app-description mt-1 text-[#577B9F]">
            Monitor rack-level inventory, stock availability, and products needing attention.
          </p>
        </header>

        {/* Filters */}
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
                <span className="app-section-title block text-[#10234F]">
                  Filters
                </span>
                <span className="app-description mt-0.5 block text-[#577B9F]">
                  Refine rack insights by location and status.
                </span>
              </span>
            </div>

            {showFilters ? (
              <ChevronUp size={18} className="text-[#577B9F]" />
            ) : (
              <ChevronDown size={18} className="text-[#577B9F]" />
            )}
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 border-t border-[#F2E8DE] bg-[#FFFEFC] px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-[#557493]">
                  Location
                </span>
                <span className="relative block">
                  <MapPin
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]"
                  />
                  <select
                    value={locationFilter}
                    onChange={(event) => {
                      setLocationFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  >
                    <option value="all">All locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-[#557493]">
                  Status
                </span>
                <span className="relative block">
                  <Activity
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  >
                    <option value="all">All statuses</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <div className="flex items-end">
                <ActionButton icon={RotateCcw} onClick={resetFilters}>
                  Reset filters
                </ActionButton>
              </div>
            </div>
          )}
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Racks"
            value={summary.racks}
            icon={Warehouse}
            accent="orange"
            detail="Racks represented in results"
          />
          <SummaryCard
            title="Total Products"
            value={summary.totalProducts}
            icon={Package}
            accent="blue"
            detail="Total product records"
          />
          <SummaryCard
            title="Total Stock Quantity"
            value={summary.totalStockQuantity.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            icon={Boxes}
            accent="green"
            detail="Combined stock quantity"
          />
          <SummaryCard
            title="Racks Needing Attention"
            value={summary.racksNeedingAttention}
            icon={AlertTriangle}
            accent="red"
            detail="Low, out-of-stock, or expiring products"
          />
        </section>

        {/* Main report table */}
        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <Layers3 size={19} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  Rack Inventory Overview
                </h2>
                <p className="app-description mt-0.5 text-[#577B9F]">
                  Inventory summary across all 8 report columns
                </p>
              </div>
            </div>

            <div className="no-print flex flex-wrap gap-2">
              <ActionButton icon={Download} onClick={exportCSV}>
                Export CSV
              </ActionButton>
              <ActionButton icon={FileSpreadsheet} onClick={exportCSV}>
                Export Excel
              </ActionButton>
              <ActionButton icon={Printer} onClick={() => window.print()}>
                Print
              </ActionButton>
              <ActionButton
                icon={FileText}
                onClick={() => window.print()}
                primary
              >
                Export PDF
              </ActionButton>
            </div>
          </div>

          {/* Toolbar */}
          <div className="no-print flex flex-col gap-4 px-5 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-[#577B9F]">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-semibold text-[#19366F] outline-none focus:border-[#FF8A37]"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] shadow-sm transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                >
                  <SlidersHorizontal size={15} />
                  Column visibility
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-30 mt-2 max-h-80 w-72 overflow-y-auto rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-[#F2E8DE] pb-2">
                      <span className="text-sm font-bold text-[#10234F]">
                        Visible columns
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowColumns(false)}
                        aria-label="Close column visibility"
                        className="rounded-md p-1 text-[#577B9F] hover:bg-[#FFF1E5]"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {columns.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-[#19366F] hover:bg-[#FFF7EF]"
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
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search location, rack, status..."
                className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1350px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                  {columns
                    .filter((column) =>
                      visibleColumns.includes(column.key)
                    )
                    .map((column) => (
                      <th
                        key={column.key}
                        className="app-table-heading px-4 py-4 uppercase tracking-wide text-[#19366F]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className="inline-flex items-center gap-2 text-left leading-5 transition hover:text-[#F04A13]"
                        >
                          {column.label}
                          {sort.key === column.key ? (
                            sort.direction === "asc" ? (
                              <ChevronUp
                                size={14}
                                className="shrink-0 text-[#FF711A]"
                              />
                            ) : (
                              <ChevronDown
                                size={14}
                                className="shrink-0 text-[#FF711A]"
                              />
                            )
                          ) : (
                            <ArrowUpDown
                              size={13}
                              className="shrink-0 text-[#A7B5C5]"
                            />
                          )}
                        </button>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F2E8DE]">
                {pageRows.map((row, index) => (
                  <tr
                    key={row.id ?? `${row.location}-${row.rack}-${index}`}
                    className={`transition-colors hover:bg-[#FFF1E5]/70 ${
                      index % 2 ? "bg-[#FFFCF8]" : "bg-white"
                    }`}
                  >
                    {columns
                      .filter((column) =>
                        visibleColumns.includes(column.key)
                      )
                      .map((column) => (
                        <td
                          key={column.key}
                          className="app-table-cell px-4 py-4 align-middle text-[#19366F]"
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
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE9D9] text-[#F04A13]">
                        <Warehouse size={21} />
                      </div>
                      <p className="mt-3 font-semibold text-[#10234F]">
                        No data available in table
                      </p>
                      <p className="mt-1 text-xs text-[#577B9F]">
                        Rack inventory records will appear here when available.
                      </p>
                      {(search ||
                        locationFilter !== "all" ||
                        statusFilter !== "all") && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-4 text-sm font-semibold text-[#E96B10] hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-[#577B9F]">
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
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                      safePage === page
                        ? "bg-[#FF711A] text-white shadow-sm"
                        : "border border-[#E8EDF4] bg-white text-[#19366F] hover:bg-[#FFF1E5]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-[11px] text-[#577B9F] sm:flex-row sm:text-left">
          <p>Billomax · Rack Inventory Insights</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>
    </main>
  );
}
