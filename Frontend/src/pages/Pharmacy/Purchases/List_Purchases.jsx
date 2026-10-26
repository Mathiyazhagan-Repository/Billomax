import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  FileSpreadsheet,
  FileText,
  Filter,
  Plus,
  Printer,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
} from "../../../utils/businessStorage.js";

const purchaseColumns = [
  { key: "action", label: "Action" },
  { key: "date", label: "Date" },
  { key: "reference", label: "Reference No" },
  { key: "location", label: "Location" },
  { key: "supplier", label: "Supplier" },
  { key: "purchaseStatus", label: "Purchase Status" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "grandTotal", label: "Grand Total" },
  { key: "paymentDue", label: "Payment due" },
  { key: "addedBy", label: "Added By" },
];

const PURCHASES_KEY = "billomax-purchases";

function readPurchases() {
  try {
    const stored = businessStorage.getItem(PURCHASES_KEY);
    const purchases = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(purchases)) {
      throw new Error("Saved purchases are not in the expected format.");
    }
    return purchases;
  } catch (error) {
    console.error("Could not load saved purchases:", error);
    return [];
  }
}

const initialFilters = {
  location: "",
  supplier: "",
  purchaseStatus: "",
  paymentStatus: "",
  dateRange: "01/01/2026 - 31/12/2026",
};

function ToolButton({ icon: Icon, children, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#D7E0EB] bg-white px-3 text-xs font-medium text-[#60738D] transition hover:border-[#F5A15D] hover:text-[#E87928] ${className}`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function downloadFile(filename, content, mimeType) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function ListPurchases({ onNavigate }) {
  const [purchases] = useState(readPurchases);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    purchaseColumns.map((column) => column.key),
  );
  const [notice, setNotice] = useState("");

  const filteredPurchases = useMemo(() => {
    const query = search.trim().toLowerCase();
    return purchases.filter((purchase) => {
      const matchesSearch = Object.values(purchase)
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesFilters =
        (!appliedFilters.location ||
          purchase.location === appliedFilters.location) &&
        (!appliedFilters.supplier ||
          purchase.supplier === appliedFilters.supplier) &&
        (!appliedFilters.purchaseStatus ||
          purchase.purchaseStatus === appliedFilters.purchaseStatus) &&
        (!appliedFilters.paymentStatus ||
          purchase.paymentStatus === appliedFilters.paymentStatus);
      return matchesSearch && matchesFilters;
    });
  }, [appliedFilters, purchases, search]);

  const pageCount = Math.max(1, Math.ceil(filteredPurchases.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visiblePurchases = filteredPurchases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const shownColumns = purchaseColumns.filter((column) =>
    visibleColumns.includes(column.key),
  );
  const totalsLabelIndex = Math.max(
    0,
    shownColumns.findIndex((column) => column.key === "grandTotal") - 1,
  );
  const firstEntry = filteredPurchases.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastEntry = Math.min(currentPage * pageSize, filteredPurchases.length);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const exportCsv = () => {
    const header = shownColumns.map((column) => column.label);
    const rows = filteredPurchases.map((purchase) =>
      shownColumns.map((column) => purchase[column.key] ?? ""),
    );
    const csv = `\uFEFF${[header, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n")}`;
    downloadFile("purchases.csv", csv, "text/csv;charset=utf-8");
  };

  const exportExcel = () => {
    const header = shownColumns
      .map((column) => `<th>${column.label}</th>`)
      .join("");
    const rows = filteredPurchases
      .map(
        (purchase) =>
          `<tr>${shownColumns
            .map((column) => `<td>${purchase[column.key] ?? ""}</td>`)
            .join("")}</tr>`,
      )
      .join("");
    const workbook = `<html><head><meta charset="utf-8"></head><body><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></body></html>`;
    downloadFile(
      "purchases.xls",
      workbook,
      "application/vnd.ms-excel;charset=utf-8",
    );
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex-1 bg-[#FFFAF5] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8798AD]">
              Inventory management
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#F5852A]">
              Purchases
            </h1>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-4 flex items-center justify-between rounded-xl border border-[#F4D5B8] bg-[#FFF8F0] px-4 py-3 text-sm text-[#8B5A32]"
          >
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              className="font-semibold text-[#A66B3B] hover:text-[#74451F]"
            >
              Dismiss
            </button>
          </div>
        )}

        <section className="mb-5 overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.04)]">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold text-[#283961]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3E8] text-[#E87928]">
                <Filter size={16} />
              </span>
              Filters
            </span>
            <ChevronDown
              size={18}
              className={`text-[#8190A5] transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>
          {filtersOpen && (
            <div className="border-t border-[#F1ECE6] px-5 pb-5 pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <label className="text-xs font-semibold text-[#344B70]">
                  Business Location
                  <select
                    value={filters.location}
                    onChange={(event) => updateFilter("location", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                  >
                    <option value="">All locations</option>
                    <option value={getActiveBusinessStorage()}>{getActiveBusinessStorage()}</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-[#344B70]">
                  Supplier
                  <select
                    value={filters.supplier}
                    onChange={(event) => updateFilter("supplier", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                  >
                    <option value="">All suppliers</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-[#344B70]">
                  Purchase Status
                  <select
                    value={filters.purchaseStatus}
                    onChange={(event) => updateFilter("purchaseStatus", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                  >
                    <option value="">All statuses</option>
                    <option value="Received">Received</option>
                    <option value="Pending">Pending</option>
                    <option value="Ordered">Ordered</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-[#344B70]">
                  Payment Status
                  <select
                    value={filters.paymentStatus}
                    onChange={(event) => updateFilter("paymentStatus", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                  >
                    <option value="">All payment statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Due">Due</option>
                    <option value="Partial">Partial</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-[#344B70]">
                  Date Range
                  <span className="relative mt-1.5 block">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9BB0]"
                    />
                    <input
                      type="text"
                      value={filters.dateRange}
                      onChange={(event) => updateFilter("dateRange", event.target.value)}
                      placeholder="DD/MM/YYYY - DD/MM/YYYY"
                      className="h-10 w-full rounded-lg border border-[#D6DFEA] bg-white pl-9 pr-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                    />
                  </span>
                </label>
              </div>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilters(initialFilters);
                    setAppliedFilters(initialFilters);
                    setSearch("");
                    setPage(1);
                  }}
                  className="h-9 rounded-lg border border-[#D8E0EA] px-4 text-sm font-medium text-[#60738D] transition hover:bg-[#FFFCF8]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedFilters(filters);
                    setPage(1);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  <SlidersHorizontal size={14} />
                  Apply filters
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1ECE6] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#283961]">All Purchases</h2>
              <p className="mt-0.5 text-xs text-[#8798AD]">Review and manage purchase transactions</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("Add Purchase")}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-3.5 text-xs font-semibold text-white transition hover:brightness-105"
            >
              <Plus size={14} />
              Add Purchase
            </button>
          </div>

          <div className="flex flex-col gap-3 border-b border-[#F1ECE6] px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[#60738D]">
                  Show
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                    className="h-8 rounded-lg border border-[#D7E0EB] bg-white px-2 text-xs text-[#536781] outline-none focus:border-[#F5A15D]"
                  >
                    {[10, 25, 50, 100].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  entries
                </label>
                <ToolButton icon={FileSpreadsheet} onClick={exportCsv}>Export CSV</ToolButton>
                <ToolButton icon={FileSpreadsheet} onClick={exportExcel}>Export Excel</ToolButton>
                <ToolButton icon={Printer} onClick={() => window.print()}>Print</ToolButton>
                <div className="relative">
                  <ToolButton
                    icon={Columns3}
                    onClick={() => setColumnsOpen((open) => !open)}
                    aria-expanded={columnsOpen}
                  >
                    Column visibility <ChevronDown size={13} />
                  </ToolButton>
                  {columnsOpen && (
                    <div className="absolute left-0 top-10 z-20 w-56 rounded-xl border border-[#E4E9EF] bg-white p-2 shadow-[0_12px_30px_rgba(40,57,97,0.14)]">
                      {purchaseColumns.map((column) => (
                        <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#526783] hover:bg-[#FFFAF5]">
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(column.key)}
                            onChange={() => setVisibleColumns((current) =>
                              current.includes(column.key)
                                ? current.filter((key) => key !== column.key)
                                : [...current, column.key],
                            )}
                            className="accent-[#F5852A]"
                          />
                          {column.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <ToolButton icon={FileText} onClick={() => window.print()}>Export PDF</ToolButton>
              </div>
              <label className="relative block w-full sm:w-64">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#91A0B3]" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search purchases..."
                  aria-label="Search purchases"
                  className="h-9 w-full rounded-lg border border-[#D7E0EB] bg-white pl-9 pr-3 text-xs text-[#33496F] outline-none placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                />
              </label>
            </div>
          </div>

          <div className="app-themed-scrollbar overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="bg-[#FFFCF8]">
                  {shownColumns.map((column) => (
                    <th key={column.key} className="whitespace-nowrap border-b border-[#F0EAE3] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#667992]">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visiblePurchases.length ? (
                  visiblePurchases.map((purchase, index) => (
                    <tr key={purchase.id ?? index} className="border-b border-[#F3F0EC] text-sm text-[#536781]">
                      {shownColumns.map((column) => (
                        <td key={column.key} className="whitespace-nowrap px-4 py-3">{purchase[column.key] ?? "—"}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={Math.max(1, shownColumns.length)} className="h-40 px-4 text-center text-sm font-medium text-[#8997A9]">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-[#FFFCF8] text-xs font-semibold text-[#526783]">
                  {shownColumns.map((column, index) => (
                    <td key={column.key} className="whitespace-nowrap px-4 py-3">
                      {column.key === "grandTotal" || column.key === "paymentDue"
                        ? "₹ 0.00"
                        : index === totalsLabelIndex
                          ? "Totals"
                          : ""}
                    </td>
                  ))}
                </tr>
                <tr className="bg-white text-xs text-[#8798AD]">
                  <td colSpan={Math.max(1, shownColumns.length)} className="px-4 py-2.5">
                    Purchase due: <span className="font-semibold text-[#60738D]">₹ 0.00</span>
                    <span className="mx-3 text-[#D5DDE7]">|</span>
                    Purchase return due: <span className="font-semibold text-[#60738D]">₹ 0.00</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#F1ECE6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#8798AD]">
              Showing <span className="font-medium text-[#60738D]">{firstEntry}</span> to{" "}
              <span className="font-medium text-[#60738D]">{lastEntry}</span> of{" "}
              <span className="font-medium text-[#60738D]">{filteredPurchases.length}</span> entries
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7E0EB] text-[#7789A0] transition hover:border-[#F5A15D] hover:text-[#E87928] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#FFF3E8] px-2 text-xs font-semibold text-[#E87928]">
                {currentPage}
              </span>
              <button
                type="button"
                disabled={currentPage >= pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7E0EB] text-[#7789A0] transition hover:border-[#F5A15D] hover:text-[#E87928] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ListPurchases;