
import React, { useMemo, useState } from "react";
import {
  Users,
  IndianRupee,
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
  Layers3,
  TrendingUp,
} from "lucide-react";

const initialRows = [
  {
    id: 1,
    customerGroup: "",
    totalSale: 2283.02,
  },
];

const columns = [
  { key: "customerGroup", label: "Customer Group" },
  { key: "totalSale", label: "Total Sale" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

function ActionButton({
  children,
  icon: Icon,
  onClick,
  variant = "secondary",
}) {
  const styles = {
    primary:
      "border-transparent bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-sm hover:brightness-105",
    secondary:
      "border-[#E2E7EF] bg-white text-[#34445E] hover:border-orange-200 hover:bg-orange-50 hover:text-[#D85B13]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-200 ${styles[variant]}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function SummaryCard({ title, value, icon: Icon, accent, description }) {
  const colors = {
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  };

  return (
    <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-[0_4px_18px_rgba(16,35,79,0.035)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-[#10234F]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${colors[accent]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function CustomerGroupsReport() {
  const [rows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [sortConfig, setSortConfig] = useState({
    key: "totalSale",
    direction: "desc",
  });
  const [minSale, setMinSale] = useState("");
  const [maxSale, setMaxSale] = useState("");

  const filteredRows = useMemo(() => {
    let result = rows.filter((row) => {
      const matchesSearch = row.customerGroup
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesMin =
        minSale === "" || row.totalSale >= Number(minSale);

      const matchesMax =
        maxSale === "" || row.totalSale <= Number(maxSale);

      return matchesSearch && matchesMin && matchesMax;
    });

    result = [...result].sort((a, b) => {
      const key = sortConfig.key;
      let first = a[key] ?? "";
      let second = b[key] ?? "";

      if (key === "totalSale") {
        first = Number(first);
        second = Number(second);
      } else {
        first = String(first).toLowerCase();
        second = String(second).toLowerCase();
      }

      if (first < second) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (first > second) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [rows, search, minSale, maxSale, sortConfig]);

  const totalSales = filteredRows.reduce(
    (total, row) => total + row.totalSale,
    0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );
  const safePage = Math.min(currentPage, totalPages);

  const pageRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const resetFilters = () => {
    setSearch("");
    setMinSale("");
    setMaxSale("");
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setCurrentPage(1);
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

    const csvRows = [
      exportColumns.map((column) => escapeCSV(column.label)).join(","),
      ...filteredRows.map((row) =>
        exportColumns
          .map((column) => {
            const value =
              column.key === "totalSale"
                ? formatCurrency(row.totalSale)
                : row[column.key];

            return escapeCSV(value);
          })
          .join(",")
      ),
    ];

    const blob = new Blob(["\uFEFF" + csvRows.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CustomerGroupsReport.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    // CSV format can be opened in Excel.
    exportCSV();
  };

  const exportPDF = () => {
    // Use the browser's print dialog and select Save as PDF.
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 py-5 text-slate-700 sm:px-6 lg:px-8">
      <style>{`
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-area {
            border: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .print-area table { min-width: 100% !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#E86A20]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6814]" />
              Reports / Customer insights
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              Customer Groups Report
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Review sales performance grouped by customer category.
            </p>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <ActionButton icon={FileSpreadsheet} onClick={exportExcel}>
              Export Excel
            </ActionButton>
            <ActionButton
              icon={FileText}
              onClick={exportPDF}
              variant="primary"
            >
              Export PDF
            </ActionButton>
          </div>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total Sales"
            value={formatCurrency(totalSales)}
            icon={IndianRupee}
            accent="orange"
            description="Sales for the current report results"
          />

          <SummaryCard
            title="Customer Groups"
            value={filteredRows.length}
            icon={Layers3}
            accent="blue"
            description="Groups matching the current filters"
          />

          <SummaryCard
            title="Report Overview"
            value={`${filteredRows.length} ${
              filteredRows.length === 1 ? "record" : "records"
            }`}
            icon={TrendingUp}
            accent="green"
            description="Available report entries"
          />
        </section>

        {/* Filters */}
        <section className="no-print overflow-visible rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_24px_rgba(16,35,79,0.04)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
                <Filter size={19} />
              </div>

              <div>
                <h2 className="font-bold text-[#10234F]">Filters</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Refine the report by sales amount.
                </p>
              </div>
            </div>

            {showFilters ? (
              <ChevronUp size={19} className="text-slate-400" />
            ) : (
              <ChevronDown size={19} className="text-slate-400" />
            )}
          </button>

          {showFilters && (
            <div className="border-t border-[#EDF0F5] px-5 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">
                    Minimum total sale (₹)
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={minSale}
                    onChange={(event) => {
                      setMinSale(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Enter minimum amount"
                    className="w-full rounded-xl border border-[#DFE5EE] bg-[#FFFEFC] px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">
                    Maximum total sale (₹)
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={maxSale}
                    onChange={(event) => {
                      setMaxSale(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Enter maximum amount"
                    className="w-full rounded-xl border border-[#DFE5EE] bg-[#FFFEFC] px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <div className="flex items-end">
                  <ActionButton icon={RotateCcw} onClick={resetFilters}>
                    Reset filters
                  </ActionButton>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Report table */}
        <section className="print-area overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_24px_rgba(16,35,79,0.045)]">
          <div className="flex flex-col gap-4 border-b border-[#EDF0F5] px-5 py-5 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
                  <Users size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#10234F]">
                    Customer Group Sales
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Sales summary by customer group
                  </p>
                </div>
              </div>
            </div>

            <div className="no-print flex flex-wrap gap-2">
              <ActionButton icon={Download} onClick={exportCSV}>
                Export CSV
              </ActionButton>
              <ActionButton icon={FileSpreadsheet} onClick={exportExcel}>
                Excel
              </ActionButton>
              <ActionButton icon={Printer} onClick={() => window.print()}>
                Print
              </ActionButton>
              <ActionButton
                icon={FileText}
                onClick={exportPDF}
                variant="primary"
              >
                Export PDF
              </ActionButton>
            </div>
          </div>

          {/* Table controls */}
          <div className="no-print flex flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm font-medium text-[#10234F] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-orange-200 hover:bg-orange-50"
                >
                  <SlidersHorizontal size={15} />
                  Column visibility
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-60 rounded-xl border border-[#E6EAF0] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-sm font-bold text-[#10234F]">
                        Visible columns
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowColumns(false)}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
                        aria-label="Close column menu"
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

            <label className="relative block w-full lg:max-w-xs">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search customer groups..."
                className="w-full rounded-xl border border-[#DFE5EE] bg-[#FFFEFC] py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
          </div>

          {/* Responsive data table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-[#E9EDF3] bg-[#F8FAFC]">
                  {columns
                    .filter((column) =>
                      visibleColumns.includes(column.key)
                    )
                    .map((column) => (
                      <th
                        key={column.key}
                        className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#52617A]"
                      >
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className="inline-flex items-center gap-2 transition hover:text-[#E86A20]"
                        >
                          {column.label}
                          {sortConfig.key === column.key ? (
                            sortConfig.direction === "asc" ? (
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
                            <span className="text-slate-300">
                              <ChevronUp size={12} />
                            </span>
                          )}
                        </button>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EDF0F5]">
                {pageRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-orange-50/40 ${
                      index % 2 === 1 ? "bg-[#FCFDFE]" : "bg-white"
                    }`}
                  >
                    {columns
                      .filter((column) =>
                        visibleColumns.includes(column.key)
                      )
                      .map((column) => (
                        <td
                          key={column.key}
                          className="px-5 py-4 align-middle"
                        >
                          {column.key === "customerGroup" ? (
                            row.customerGroup ? (
                              <span className="font-semibold text-[#10234F]">
                                {row.customerGroup}
                              </span>
                            ) : (
                              <span className="text-slate-400">&nbsp;</span>
                            )
                          ) : (
                            <span className="font-semibold tabular-nums text-[#10234F]">
                              {formatCurrency(row.totalSale)}
                            </span>
                          )}
                        </td>
                      ))}
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={Math.max(1, visibleColumns.length)}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Search size={21} />
                      </div>
                      <p className="mt-3 font-semibold text-[#10234F]">
                        No matching customer groups
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or sales filters.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 text-sm font-semibold text-[#E86A20] hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>

              {pageRows.length > 0 && (
                <tfoot>
                  <tr className="border-t border-[#E9EDF3] bg-[#FFFAF5]">
                    {columns
                      .filter((column) =>
                        visibleColumns.includes(column.key)
                      )
                      .map((column, index) => (
                        <td
                          key={column.key}
                          className="px-5 py-4 text-sm font-bold text-[#10234F]"
                        >
                          {index === 0
                            ? "Total"
                            : column.key === "totalSale"
                              ? formatCurrency(totalSales)
                              : ""}
                        </td>
                      ))}
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
                {filteredRows.length === 0
                  ? 0
                  : (safePage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#10234F]">
                {Math.min(safePage * pageSize, filteredRows.length)}
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
                className="inline-flex items-center gap-1 rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                    safePage === page
                      ? "bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-sm"
                      : "border border-[#DFE5EE] bg-white text-slate-600 hover:bg-orange-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>Billomax · Customer Groups Report</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>
    </div>
  );
}
