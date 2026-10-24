
import React, { useMemo, useState } from "react";
import {
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
  ReceiptText,
  Wallet,
  TrendingUp,
  BadgeIndianRupee,
  CalendarDays,
  Settings,
} from "lucide-react";

const initialRows = [
  { id: 1, date: "22/10/2026 11:00", invoice: "0041", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 15, paid: 15, remaining: 0 },
  { id: 2, date: "01/10/2026 17:00", invoice: "0040", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 15, paid: 15, remaining: 0 },
  { id: 3, date: "24/09/2026 15:43", invoice: "0039", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 25, paid: 25, remaining: 0 },
  { id: 4, date: "17/09/2026 13:07", invoice: "0038", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 15, paid: 15, remaining: 0 },
  { id: 5, date: "17/09/2026 13:07", invoice: "0037", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 15, paid: 15, remaining: 0 },
  { id: 6, date: "04/09/2026 14:09", invoice: "0036", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 45, paid: 45, remaining: 0 },
  { id: 7, date: "03/09/2026 10:55", invoice: "0035", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 15, paid: 15, remaining: 0 },
  { id: 8, date: "08/07/2026 11:35", invoice: "0038", customer: "dev", location: "Pharmacy", status: "Due", amount: 56.25, paid: 0, remaining: 56.25 },
  { id: 9, date: "08/07/2026 11:31", invoice: "0037", customer: "dev", location: "Pharmacy", status: "Due", amount: 87.5, paid: 0, remaining: 87.5 },
  { id: 10, date: "06/07/2026 12:28", invoice: "0036", customer: "poorna", location: "Pharmacy", status: "Due", amount: 20.02, paid: 0, remaining: 20.02 },
  { id: 11, date: "06/07/2026 12:15", invoice: "0035", customer: "Demo Customer", location: "Pharmacy", status: "Due", amount: 56.25, paid: 0, remaining: 56.25 },
  { id: 12, date: "29/06/2026 15:47", invoice: "0034", customer: "Demo Customer", location: "Pharmacy", status: "Due", amount: 97.5, paid: 0, remaining: 97.5 },
  { id: 13, date: "26/06/2026 11:29", invoice: "0033", customer: "user", location: "Pharmacy", status: "Due", amount: 87.5, paid: 0, remaining: 87.5 },
  { id: 14, date: "26/06/2026 11:23", invoice: "0032", customer: "user", location: "Pharmacy", status: "Due", amount: 87.5, paid: 0, remaining: 87.5 },
  { id: 15, date: "26/06/2026 11:19", invoice: "0031", customer: "user", location: "Pharmacy", status: "Due", amount: 106.25, paid: 0, remaining: 106.25 },
  { id: 16, date: "19/06/2026 15:32", invoice: "0030", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 25, paid: 25, remaining: 0 },
  { id: 17, date: "18/06/2026 12:22", invoice: "0029", customer: "Walk-In Customer", location: "Pharmacy", status: "Paid", amount: 25, paid: 25, remaining: 0 },
];

const columns = [
  { key: "date", label: "Date", type: "text" },
  { key: "invoice", label: "Invoice No.", type: "text" },
  { key: "customer", label: "Customer name", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "status", label: "Payment Status", type: "text" },
  { key: "amount", label: "Total amount", type: "money" },
  { key: "paid", label: "Total paid", type: "money" },
  { key: "remaining", label: "Total remaining", type: "money" },
];

const tabs = [
  { id: "added", label: "Sales Added" },
  { id: "commission", label: "Sales With Commission" },
  { id: "expenses", label: "Expenses" },
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

function SummaryCard({ title, value, caption, icon: Icon }) {
  return (
    <div className="flex min-h-[84px] items-center gap-2.5 rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FFE5AD] text-[#F47700]">
        <Icon size={22} strokeWidth={2.8} />
      </span>
      <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold leading-4 text-[#526D8D]">{title}</p>
          <p className="break-words text-[18px] font-extrabold leading-none tracking-tight text-[#101C3D]">
            {value}
          </p>
          <p className="mt-1 text-[10px] text-[#577B9F]">{caption}</p>
      </div>
    </div>
  );
}

export default function SalesRepresentativeReport() {
  const [rows] = useState(initialRows);
  const [activeTab, setActiveTab] = useState("added");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [sort, setSort] = useState({ key: "date", direction: "desc" });

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = rows.filter((row) =>
      columns.some((column) =>
        String(row[column.key] ?? "").toLowerCase().includes(query)
      )
    );

    return [...result].sort((a, b) => {
      const column = columns.find((item) => item.key === sort.key);
      const comparison =
        column?.type === "money"
          ? Number(a[sort.key] || 0) - Number(b[sort.key] || 0)
          : String(a[sort.key] ?? "").localeCompare(
              String(b[sort.key] ?? ""),
              undefined,
              { numeric: true, sensitivity: "base" }
            );

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredRows.length ? (safePage - 1) * pageSize : 0;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (sum, row) => ({
          amount: sum.amount + Number(row.amount || 0),
          paid: sum.paid + Number(row.paid || 0),
          remaining: sum.remaining + Number(row.remaining || 0),
          paidCount: sum.paidCount + (row.status === "Paid" ? 1 : 0),
          dueCount: sum.dueCount + (row.status === "Due" ? 1 : 0),
        }),
        { amount: 0, paid: 0, remaining: 0, paidCount: 0, dueCount: 0 }
      ),
    [filteredRows]
  );

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
      ...filteredRows.map((row) =>
        exportColumns
          .map((column) =>
            escapeCSV(
              column.type === "money" ? money(row[column.key]) : row[column.key]
            )
          )
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SalesRepresentativeReport.csv";
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
          .print-area th, .print-area td { padding: 5px !important; font-size: 10px !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1700px] space-y-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <ReceiptText size={14} />
              <span className="text-[11px] font-extrabold">PHARMACY · REPORTS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Sales Representative Report
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Review sales, collections, and outstanding balances.
            </p>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <ActionButton icon={Download} onClick={exportCSV}>Export CSV</ActionButton>
            <ActionButton icon={FileSpreadsheet} onClick={exportCSV}>Export Excel</ActionButton>
            <ActionButton icon={Printer} onClick={() => window.print()}>Print</ActionButton>
            <ActionButton icon={FileText} onClick={() => window.print()} primary>Export PDF</ActionButton>
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
                  Search and organize report records.
                </span>
              </span>
            </div>
            {showFilters ? <ChevronUp size={18} className="text-[#577B9F]" /> : <ChevronDown size={18} className="text-[#577B9F]" />}
          </button>
          {showFilters && (
            <div className="border-t border-[#F2E8DE] bg-[#FFFEFC] px-5 py-5 sm:px-6">
              <label className="block max-w-lg space-y-1.5">
                <span className="text-xs font-semibold text-[#557493]">Search records</span>
                <span className="relative block">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search customer, invoice, location..."
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  />
                </span>
              </label>
              <div className="mt-4">
                <ActionButton icon={RotateCcw} onClick={resetFilters}>Reset filters</ActionButton>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
              <TrendingUp size={19} />
            </span>
            <div>
              <h2 className="app-section-title text-[#10234F]">Summary</h2>
              <p className="app-description mt-0.5 text-[#577B9F]">Sales and expense overview</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#F8EBDD] bg-[#FFFCF8] p-4">
              <p className="text-xs font-semibold text-[#577B9F]">Total Sale − Total Sales Return</p>
              <p className="mt-2 text-xl font-extrabold text-[#F04A13]">
                {money(1883.65)} − {money(0)} = {money(1883.65)}
              </p>
            </div>
            <div className="rounded-xl border border-[#E6EDF5] bg-white p-4">
              <p className="text-xs font-semibold text-[#577B9F]">Total Expense</p>
              <p className="mt-2 text-xl font-extrabold text-[#19366F]">{money(0)}</p>
            </div>
          </div>
        </section>

        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="no-print flex flex-wrap gap-1 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-4 pt-3 sm:px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-[#FF711A] bg-[#FFF1E5] text-[#F04A13]"
                    : "border-transparent text-[#577B9F] hover:bg-[#FFF7EF] hover:text-[#10234F]"
                }`}
              >
                <Settings size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== "added" ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <ReceiptText size={28} className="text-[#FF9A56]" />
              <h3 className="mt-3 font-semibold text-[#10234F]">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
              <p className="mt-1 max-w-md text-sm text-[#577B9F]">
                This tab needs its original report data and calculation logic to display the correct records. No additional records have been fabricated.
              </p>
            </div>
          ) : (
            <>
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
                      <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                        <div className="mb-2 flex items-center justify-between border-b border-[#F2E8DE] pb-2">
                          <span className="text-sm font-bold text-[#10234F]">Visible columns</span>
                          <button type="button" onClick={() => setShowColumns(false)} aria-label="Close column visibility" className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><X size={15} /></button>
                        </div>
                        {columns.map((column) => (
                          <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#577B9F] hover:bg-[#FFF1E5]">
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
                    placeholder="Search report..."
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  />
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                      {columns.filter((column) => visibleColumns.includes(column.key)).map((column) => (
                        <th key={column.key} className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wide text-[#526D8D]">
                          <button type="button" onClick={() => toggleSort(column.key)} className="inline-flex items-center gap-2 text-left leading-5 hover:text-[#F04A13]">
                            {column.label}
                            {sort.key === column.key ? (
                              sort.direction === "asc" ? <ChevronUp size={14} className="shrink-0 text-[#F04A13]" /> : <ChevronDown size={14} className="shrink-0 text-[#F04A13]" />
                            ) : <ArrowUpDown size={13} className="shrink-0 text-[#A5B1C0]" />}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E8DE]">
                    {pageRows.map((row, index) => (
                      <tr key={row.id} className={`transition-colors hover:bg-[#FFF7EF] ${index % 2 ? "bg-[#FFFCF8]" : "bg-white"}`}>
                        {columns.filter((column) => visibleColumns.includes(column.key)).map((column) => (
                          <td key={column.key} className="px-4 py-3.5 align-middle">
                            {column.key === "status" ? (
                              <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${row.status === "Paid" ? "bg-[#E7F7EE] text-[#16824B]" : "bg-[#FFF1E5] text-[#D96A19]"}`}>
                                {row.status}
                              </span>
                            ) : column.type === "money" ? (
                              <span className="whitespace-nowrap font-semibold tabular-nums text-[#19366F]">{money(row[column.key])}</span>
                            ) : (
                              <span className="text-[#577B9F]">{row[column.key] || "—"}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {pageRows.length === 0 && (
                      <tr>
                        <td colSpan={Math.max(visibleColumns.length, 1)} className="px-6 py-12 text-center">
                          <ReceiptText size={24} className="mx-auto text-[#FF9A56]" />
                          <p className="mt-3 font-semibold text-[#10234F]">No data available in table</p>
                          <p className="mt-1 text-sm text-[#577B9F]">No records match the current search.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-[#F2E8DE] bg-[#FFF1E5]">
                      {columns.filter((column) => visibleColumns.includes(column.key)).map((column, index) => (
                        <td key={column.key} className="px-4 py-4 font-bold text-[#19366F]">
                          {index === 0 ? "Total:" : column.key === "status" ? (
                            <span className="leading-6">
                              <span className="block">Paid - {totals.paidCount}</span>
                              <span className="block">Due - {totals.dueCount}</span>
                            </span>
                          ) : column.key === "amount" ? money(totals.amount) : column.key === "paid" ? money(totals.paid) : column.key === "remaining" ? (
                            <span className="leading-6">
                              <span className="block">Sell Due - {money(totals.remaining)}</span>
                              <span className="block">Sell Return Due - {money(0)}</span>
                            </span>
                          ) : ""}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-[#577B9F]">
                  Showing <span className="font-semibold text-[#10234F]">{filteredRows.length ? startIndex + 1 : 0}</span> to{" "}
                  <span className="font-semibold text-[#10234F]">{Math.min(startIndex + pageSize, filteredRows.length)}</span> of{" "}
                  <span className="font-semibold text-[#10234F]">{filteredRows.length}</span> entries
                </p>
                <div className="flex items-center gap-1.5">
                  <button type="button" disabled={safePage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40">
                    <ChevronLeft size={15} /> Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter((page) => page === 1 || page === totalPages || Math.abs(page - safePage) <= 1)
                    .map((page, index, pages) => (
                      <React.Fragment key={page}>
                        {index > 0 && page - pages[index - 1] > 1 && <span className="px-1 text-[#8798AD]">…</span>}
                        <button type="button" onClick={() => setCurrentPage(page)} className={`h-9 min-w-9 rounded-lg px-3 text-sm font-bold ${safePage === page ? "bg-[#FF711A] text-white" : "border border-[#E8EDF4] bg-white text-[#19366F] hover:bg-[#FFF1E5]"}`}>
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  <button type="button" disabled={safePage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40">
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>Billomax · Sales Representative Report</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>

      <div className="no-print fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3478F6] text-white shadow-[0_6px_18px_rgba(52,120,246,0.35)] transition hover:bg-[#2563EB]">
          <ChevronUp size={22} strokeWidth={3} />
        </button>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-[#7778FF] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#6667F0]">
          <Printer size={17} /> Print
        </button>
      </div>
    </main>
  );
}
