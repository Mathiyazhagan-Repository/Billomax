
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDownWideNarrow,
  FileText,
  FileSpreadsheet,
  Printer,
  Columns3,
  RotateCcw,
  ShoppingCart,
  ReceiptText,
  IndianRupee,
  SlidersHorizontal,
} from "lucide-react";

const columns = [
  { key: "date", label: "DATE" },
  { key: "invoice", label: "INVOICE NO." },
  { key: "customer", label: "CUSTOMER NAME" },
  { key: "gstin", label: "CUSTOMER GSTIN" },
  { key: "product", label: "PRODUCT/DESCRIPTION" },
  { key: "hsn", label: "HSN/SAC CODE" },
  { key: "quantity", label: "QUANTITY" },
  { key: "unitPrice", label: "UNIT PRICE" },
  { key: "shipping", label: "SHIPPING COST" },
  { key: "subTotal", label: "SUB TOTAL" },
  { key: "discount", label: "DISCOUNT" },
  { key: "afterDiscount", label: "SUB TOTAL AFTER DISCOUNT" },
  { key: "cgst", label: "CGST" },
  { key: "sgst", label: "SGST" },
  { key: "igst", label: "IGST" },
  { key: "total", label: "TOTAL" },
];

const initialRows = [];

const currencyKeys = [
  "unitPrice",
  "shipping",
  "subTotal",
  "discount",
  "afterDiscount",
  "cgst",
  "sgst",
  "igst",
  "total",
];

const money = (value) => `₹${Number(value || 0).toFixed(2)}`;

function ActionButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] shadow-sm transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13] focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/15"
    >
      <Icon size={15} />
      {children}
    </button>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold text-[#557493]">
        {label}
      </span>
      <span className="relative flex h-11 items-center">
        <CalendarDays
          size={16}
          className="pointer-events-none absolute left-3 text-[#577B9F]"
        />
        <input
          type="date"
          value={value}
          onChange={onChange}
          className="h-full w-full rounded-lg border border-[#E8EDF4] bg-white pl-10 pr-3 text-xs text-[#19366F] outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
        />
      </span>
    </label>
  );
}

export default function Sales() {
  const [rows] = useState(initialRows);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedDates, setAppliedDates] = useState({
    from: "",
    to: "",
  });
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    key: "date",
    direction: "desc",
  });
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    Object.fromEntries(columns.map((column) => [column.key, true]))
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows
      .filter((row) => {
        const searchable = Object.values(row).join(" ").toLowerCase();
        if (query && !searchable.includes(query)) return false;

        const dateParts = row.date.split("-");
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        if (appliedDates.from && isoDate < appliedDates.from) return false;
        if (appliedDates.to && isoDate > appliedDates.to) return false;

        return true;
      })
      .sort((a, b) => {
        const first = a[sort.key];
        const second = b[sort.key];

        const comparison =
          typeof first === "number" && typeof second === "number"
            ? first - second
            : String(first ?? "").localeCompare(String(second ?? ""));

        return sort.direction === "asc" ? comparison : -comparison;
      });
  }, [rows, search, appliedDates, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRows.length / Number(pageSize))
  );
  const safePage = Math.min(page, pageCount);
  const start = filteredRows.length ? (safePage - 1) * Number(pageSize) : 0;
  const visibleRows = filteredRows.slice(
    start,
    start + Number(pageSize)
  );

  const totals = useMemo(
    () =>
      Object.fromEntries(
        currencyKeys.map((key) => [
          key,
          filteredRows.reduce(
            (sum, row) => sum + Number(row[key] || 0),
            0
          ),
        ])
      ),
    [filteredRows]
  );

  const applyFilters = () => {
    setAppliedDates({ from: fromDate, to: toDate });
    setPage(1);
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setAppliedDates({ from: "", to: "" });
    setSearch("");
    setPage(1);
  };

  const exportCSV = () => {
    const activeColumns = columns.filter(
      (column) => visibleColumns[column.key]
    );

    const csvRows = [
      activeColumns.map((column) => column.label),
      ...filteredRows.map((row) =>
        activeColumns.map((column) => row[column.key])
      ),
      activeColumns.map((column) =>
        currencyKeys.includes(column.key)
          ? money(totals[column.key])
          : column.key === "customer"
            ? "TOTAL"
            : ""
      ),
    ];

    const csv = csvRows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const sortBy = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setPage(1);
  };

  const activeColumnCount = columns.filter(
    (column) => visibleColumns[column.key]
  ).length;

  return (
    <main className="min-h-full min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      {/* Page header */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
            <ShoppingCart size={22} />
          </div>
          <div>
            <p className="mb-2 inline-flex rounded-lg bg-[#FFE9D9] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#F04A13]">
              Multi-Service Center · Reports
            </p>
            <h1 className="app-page-title text-[#10234F]">
              Sales Report
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Review invoices, sales amounts, discounts and GST details.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#F8EBDD] bg-white px-3 py-2.5 text-xs font-bold text-[#19366F] shadow-[0_3px_8px_rgba(25,43,80,0.04)]">
          <ReceiptText size={16} className="text-[#F04A13]" />
          <span>{filteredRows.length} sales records</span>
        </div>
      </header>

      {/* Date filters */}
      <section className="mb-5 rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
            <SlidersHorizontal size={17} />
          </div>
          <div>
            <h2 className="app-section-title text-[#10234F]">
              Filter Sales
            </h2>
            <p className="app-description mt-0.5 text-[#577B9F]">
              Select a date range to narrow down the report.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
          <DateField
            label="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <DateField
            label="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#FF711A] px-5 text-xs font-extrabold text-white shadow-[0_4px_10px_rgba(255,113,26,0.2)] transition hover:-translate-y-0.5 hover:bg-[#F04A13] sm:flex-none"
            >
              <Search size={15} />
              Apply Filter
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-4 text-xs font-bold text-[#19366F] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Sales report table */}
      <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
        <div className="flex flex-col gap-3 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
              <FileSpreadsheet size={19} />
            </div>
            <div>
              <h2 className="app-section-title text-[#10234F]">
                Sales Details
              </h2>
              <p className="app-description mt-0.5 text-[#577B9F]">
                Invoice-wise sales and tax breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#FFF7EF] px-3 py-2 text-xs text-[#577B9F]">
            <IndianRupee size={15} className="text-[#F04A13]" />
            <span>Currency: </span>
            <span className="font-bold text-[#19366F]">INR</span>
          </div>
        </div>

        {/* Table actions */}
        <div className="flex flex-col gap-3 border-b border-[#F2E8DE] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <ActionButton icon={FileText} onClick={exportCSV}>
                Export CSV
              </ActionButton>

              <ActionButton icon={FileSpreadsheet} onClick={exportCSV}>
                Export Excel
              </ActionButton>

              <ActionButton icon={FileText} onClick={() => window.print()}>
                Export PDF
              </ActionButton>

              <ActionButton icon={Printer} onClick={() => window.print()}>
                Print
              </ActionButton>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColumns((current) => !current)}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${
                    showColumns
                      ? "border-[#FF8A37] bg-[#FFF1E5] text-[#F04A13]"
                      : "border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                  }`}
                >
                  <Columns3 size={15} />
                  Toggle Columns
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${
                      showColumns ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-11 z-30 max-h-80 w-64 overflow-y-auto rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-[0_12px_35px_rgba(16,35,79,0.14)]">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A98AA]">
                        Visible columns
                      </p>
                      <span className="rounded-full bg-[#FFF1E5] px-2 py-1 text-[10px] font-bold text-[#E96B10]">
                        {activeColumnCount} / {columns.length}
                      </span>
                    </div>

                    {columns.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-xs font-medium text-[#19366F] transition hover:bg-[#FFF7EF]"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns[column.key]}
                          onChange={(e) =>
                            setVisibleColumns((current) => ({
                              ...current,
                              [column.key]: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 accent-[#FF711A]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="relative flex h-10 w-full items-center sm:max-w-[300px]">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 text-[#8A98AA]"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search sales records..."
                className="h-full w-full rounded-lg border border-[#E8EDF4] bg-white pl-9 pr-3 text-xs text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>
        </div>

        {/* Full-width responsive table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1900px] border-collapse text-left text-[11px] sm:text-xs">
            <thead>
              <tr className="bg-[#FFF7EF] text-[#19366F]">
                {columns.map(
                  (column) =>
                    visibleColumns[column.key] && (
                      <th
                        key={column.key}
                        className="app-table-heading whitespace-nowrap border-b border-r border-[#F2E8DE] px-4 py-4 last:border-r-0"
                      >
                        <button
                          type="button"
                          onClick={() => sortBy(column.key)}
                          className="flex w-full items-center justify-between gap-3 text-left transition hover:text-[#F04A13]"
                        >
                          {column.label}
                          {sort.key === column.key ? (
                            sort.direction === "asc" ? (
                              <ArrowDownWideNarrow
                                size={13}
                                className="shrink-0 text-[#FF711A]"
                              />
                            ) : (
                              <ArrowUpDown
                                size={13}
                                className="shrink-0 text-[#FF711A]"
                              />
                            )
                          ) : (
                            <ArrowUpDown
                              size={13}
                              className="shrink-0 text-[#B2BDCC]"
                            />
                          )}
                        </button>
                      </th>
                    )
                )}
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row, index) => (
                <tr
                  key={`${row.invoice}-${index}`}
                  className={`transition-colors hover:bg-[#FFF1E5]/70 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#FFFCF8]"
                  }`}
                >
                  {columns.map(
                    (column) =>
                      visibleColumns[column.key] && (
                        <td
                          key={column.key}
                          className="app-table-cell whitespace-nowrap border-b border-r border-[#F2E8DE] px-4 py-4 text-[#19366F] last:border-r-0"
                        >
                          {column.key === "invoice" ? (
                            <span className="inline-flex rounded-lg bg-[#CDE6FF] px-2.5 py-1 font-bold text-[#087AF0]">
                              {row[column.key]}
                            </span>
                          ) : column.key === "customer" ? (
                            <span className="font-semibold text-[#19366F]">
                              {row[column.key]}
                            </span>
                          ) : column.key === "product" ? (
                            <span className="font-semibold text-[#10234F]">
                              {row[column.key]}
                            </span>
                          ) : column.key === "total" ? (
                            <span className="font-bold tabular-nums text-[#13A52E]">
                              {money(row[column.key])}
                            </span>
                          ) : currencyKeys.includes(column.key) ? (
                            <span className="tabular-nums">
                              {money(row[column.key])}
                            </span>
                          ) : (
                            row[column.key] ?? "—"
                          )}
                        </td>
                      )
                  )}
                </tr>
              ))}

              {visibleRows.length === 0 && (
                <tr>
                  <td
                    colSpan={activeColumnCount}
                    className="h-40 px-4 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-[#8A98AA]">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2F5F9]">
                        <Search size={19} />
                      </div>
                      <p className="font-semibold text-[#526581]">
                        No matching sales records found
                      </p>
                      <p className="text-[11px]">
                        Try changing your search or date filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-[#F2E8DE] bg-[#FFF1E5] text-[#10234F]">
                {columns.map(
                  (column) =>
                    visibleColumns[column.key] && (
                      <td
                        key={column.key}
                        className="whitespace-nowrap border-r border-[#F2E8DE] px-4 py-4 font-bold last:border-r-0"
                      >
                        {currencyKeys.includes(column.key) ? (
                          <span className="tabular-nums">
                            {money(totals[column.key])}
                          </span>
                        ) : column.key === "customer" ? (
                          "TOTAL"
                        ) : (
                          ""
                        )}
                      </td>
                    )
                )}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-[#E9EEF5] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#577B9F]">
            <p>
              Showing{" "}
              <span className="font-bold text-[#19366F]">
                {filteredRows.length ? start + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#19366F]">
                {Math.min(start + Number(pageSize), filteredRows.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#19366F]">
                {filteredRows.length}
              </span>{" "}
              entries
            </p>

            <label className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-[#E8EDF4] bg-white px-2 font-semibold text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="inline-flex h-9 items-center gap-1 rounded-l-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            {Array.from({ length: pageCount }, (_, index) => index + 1)
              .filter(
                (number) =>
                  number === 1 ||
                  number === pageCount ||
                  Math.abs(number - safePage) <= 2
              )
              .map((number, index, numbers) => (
                <span key={number} className="contents">
                  {index > 0 && numbers[index - 1] !== number - 1 && (
                    <span className="flex h-9 min-w-7 items-center justify-center text-xs text-[#8A98AA]">
                      …
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPage(number)}
                    className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold transition ${
                      safePage === number
                        ? "border-[#FF711A] bg-[#FF711A] text-white shadow-sm"
                        : "border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                    }`}
                  >
                    {number}
                  </button>
                </span>
              ))}

            <button
              type="button"
              disabled={safePage === pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              className="inline-flex h-9 items-center gap-1 rounded-r-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 text-center text-[10px] text-[#8A98AA] sm:text-[11px]">
        Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3 |
        Copyright © 2026 All rights reserved.
      </footer>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1475F8] text-white shadow-[0_5px_14px_rgba(20,117,248,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0865DF] print:hidden"
      >
        <ChevronDown size={20} className="rotate-180" />
      </button>
    </main>
  );
}
