import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const RETURNS_KEY = "billomax-purchase-returns";
const columns = [
  ["date", "Date"],
  ["reference", "Reference No"],
  ["parentPurchase", "Parent Purchase"],
  ["location", "Location"],
  ["supplier", "Supplier"],
  ["paymentStatus", "Payment Status"],
  ["grandTotal", "Grand Total"],
  ["paymentDue", "Payment due"],
];

function readReturns() {
  try {
    const stored = window.localStorage.getItem(RETURNS_KEY);
    if (!stored) return { returns: [], error: "" };
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      throw new Error("Saved purchase returns are not in the expected format.");
    }
    return { returns: parsed, error: "" };
  } catch (error) {
    console.error("Could not load saved purchase returns:", error);
    return {
      returns: [],
      error: "Purchase returns could not be loaded from this browser.",
    };
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function ListPurchaseReturn() {
  const [initialData] = useState(readReturns);
  const [returns] = useState(initialData.returns);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState({ location: "", startDate: "", endDate: "" });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState(initialData.error);

  const locations = useMemo(
    () => [...new Set(returns.map((item) => item.location).filter(Boolean))],
    [returns],
  );

  const filteredReturns = useMemo(() => {
    const query = search.trim().toLowerCase();
    return returns.filter((item) => {
      const matchesSearch = columns
        .map(([key]) => item[key] ?? "")
        .join(" ")
        .toLowerCase()
        .includes(query);
      const date = String(item.date ?? "").slice(0, 10);
      return (
        matchesSearch &&
        (!appliedFilters.location || item.location === appliedFilters.location) &&
        (!appliedFilters.startDate || date >= appliedFilters.startDate) &&
        (!appliedFilters.endDate || date <= appliedFilters.endDate)
      );
    });
  }, [appliedFilters, returns, search]);

  const pageCount = Math.max(1, Math.ceil(filteredReturns.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleReturns = filteredReturns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const firstEntry = filteredReturns.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastEntry = Math.min(currentPage * pageSize, filteredReturns.length);
  const total = filteredReturns.reduce(
    (sum, item) => sum + (Number(item.grandTotal) || 0),
    0,
  );
  const dueTotal = filteredReturns.reduce(
    (sum, item) => sum + (Number(item.paymentDue) || 0),
    0,
  );

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const exportCsv = () => {
    const csvValue = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [
      columns.map(([, label]) => csvValue(label)).join(","),
      ...filteredReturns.map((item) =>
        columns.map(([key]) => csvValue(item[key])).join(","),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "purchase-returns.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex-1 bg-[#FFFAF5] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8798AD]">
            Inventory management
          </p>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#F5852A]">
            Purchase Return
          </h1>
        </header>

        {notice && (
          <div
            role="status"
            className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F4D5B8] bg-[#FFF8F0] px-4 py-3 text-sm text-[#8B5A32]"
          >
            <span>{notice}</span>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <label className="text-xs font-semibold text-[#344B70]">
                  Business Location
                  <select
                    value={filters.location}
                    onChange={(event) => updateFilter("location", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                  >
                    <option value="">All locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
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
                      type="date"
                      aria-label="Start date"
                      value={filters.startDate}
                      onChange={(event) => updateFilter("startDate", event.target.value)}
                      className="h-10 w-full rounded-lg border border-[#D6DFEA] bg-white pl-9 pr-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                    />
                  </span>
                </label>
                <label className="text-xs font-semibold text-[#344B70]">
                  To
                  <input
                    type="date"
                    aria-label="End date"
                    value={filters.endDate}
                    onChange={(event) => updateFilter("endDate", event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                  />
                </label>
              </div>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const cleared = { location: "", startDate: "", endDate: "" };
                    setFilters(cleared);
                    setAppliedFilters(cleared);
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
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#6250EF] to-[#397FF7] px-4 text-sm font-semibold text-white transition hover:brightness-105"
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
              <h2 className="text-base font-semibold text-[#283961]">All Purchase Returns</h2>
              <p className="mt-0.5 text-xs text-[#8798AD]">Review supplier returns and outstanding amounts</p>
            </div>
            <button
              type="button"
              onClick={() => setNotice("Creating purchase returns is not available yet.")}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#F59A45] to-[#EF7F36] px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              <Plus size={15} />
              Add
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <label className="flex items-center gap-2 text-xs font-medium text-[#60738D]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-[#D7E0EB] bg-white px-2 text-sm text-[#536781] outline-none focus:border-[#F5A15D]"
              >
                {[10, 25, 50, 100].map((size) => <option key={size}>{size}</option>)}
              </select>
              entries
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D7E0EB] px-3 text-xs font-medium text-[#60738D] transition hover:border-[#F5A15D] hover:text-[#E87928]"
              >
                <Download size={14} />
                Export CSV
              </button>
              <label className="relative">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9BB0]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search..."
                  className="h-9 w-full rounded-lg border border-[#D7E0EB] bg-white pl-9 pr-3 text-sm text-[#536781] outline-none placeholder:text-[#9AA7B8] focus:border-[#F5A15D] sm:w-52"
                />
              </label>
            </div>
          </div>

          <div className="app-themed-scrollbar overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="border-y border-[#F1ECE6] bg-[#FFFCF8]">
                  {columns.map(([, label]) => (
                    <th key={label} className="px-4 py-3 text-xs font-semibold text-[#526783]">{label}</th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#526783]">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleReturns.length ? visibleReturns.map((item, index) => (
                  <tr key={item.id ?? item.reference ?? index} className="border-b border-[#F3EFEA] text-sm text-[#536781] hover:bg-[#FFFCF8]">
                    {columns.map(([key]) => (
                      <td key={key} className="px-4 py-3.5">
                        {key === "grandTotal" || key === "paymentDue"
                          ? formatMoney(item[key])
                          : key === "paymentStatus"
                            ? <span className="rounded-full bg-[#FFF3E8] px-2.5 py-1 text-xs font-medium text-[#C66A23]">{item[key] || "Due"}</span>
                            : item[key] || "—"}
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-right text-xs text-[#8798AD]">—</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3E8] text-[#E87928]">
                          <Search size={20} />
                        </span>
                        <p className="text-sm font-semibold text-[#344B70]">No purchase returns found</p>
                        <p className="mt-1 text-xs leading-5 text-[#8798AD]">
                          Purchase returns will appear here once they have been recorded.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredReturns.length > 0 && (
                <tfoot>
                  <tr className="bg-[#FFFCF8] text-sm font-semibold text-[#344B70]">
                    <td colSpan={6} className="px-4 py-3.5 text-right">Total</td>
                    <td className="px-4 py-3.5">{formatMoney(total)}</td>
                    <td className="px-4 py-3.5">{formatMoney(dueTotal)}</td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-[#8798AD]">
            <span>Showing {firstEntry} to {lastEntry} of {filteredReturns.length} entries</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7E0EB] text-[#60738D] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-medium text-[#536781]">{currentPage} / {pageCount}</span>
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage >= pageCount}
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7E0EB] text-[#60738D] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ListPurchaseReturn;
