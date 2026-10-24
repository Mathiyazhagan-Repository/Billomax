
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
  RotateCcw,
  X,
  ArrowUpDown,
  Eye,
  LockKeyhole,
  Wallet,
  CreditCard,
  Banknote,
  ReceiptText,
  Clock3,
  MapPin,
  UserRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ViewRegisterReportModal from "./ViewRegisterReportModal.jsx";

const initialRows = [
  {
    id: 1,
    openTime: "17/10/2024 15:53",
    closeTime: "",
    location: "Pharmacy",
    user: "Mr pharmacy khanajamit.m9@gmail.com",
    cardSlips: 25,
    cheques: 0,
    cash: 1089,
    bankTransfer: 0,
    advancePayment: 0,
    customPayment1: 0,
    customPayment2: 0,
    customPayment3: 0,
    customPayment4: 0,
    customPayment5: 0,
    customPayment6: 0,
    customPayment7: 0,
    otherPayments: 0,
    total: 1114,
    status: "Open",
  },
];

const columns = [
  { key: "openTime", label: "Open Time", type: "text" },
  { key: "closeTime", label: "Close Time", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "user", label: "User", type: "text" },
  { key: "cardSlips", label: "Total Card Slips", type: "money" },
  { key: "cheques", label: "Total cheques", type: "money" },
  { key: "cash", label: "Total Cash", type: "money" },
  { key: "bankTransfer", label: "Total bank transfer", type: "money" },
  { key: "advancePayment", label: "Total advance payment", type: "money" },
  { key: "customPayment1", label: "Custom Payment 1", type: "money" },
  { key: "customPayment2", label: "Custom Payment 2", type: "money" },
  { key: "customPayment3", label: "Custom Payment 3", type: "money" },
  { key: "customPayment4", label: "Custom Payment 4", type: "money" },
  { key: "customPayment5", label: "Custom Payment 5", type: "money" },
  { key: "customPayment6", label: "Custom Payment 6", type: "money" },
  { key: "customPayment7", label: "Custom Payment 7", type: "money" },
  { key: "otherPayments", label: "Other Payments", type: "money" },
  { key: "total", label: "Total", type: "money" },
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

export default function RegisterReport() {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [sort, setSort] = useState({
    key: "openTime",
    direction: "desc",
  });
  const [actionMessage, setActionMessage] = useState("");
  const [selectedRegister, setSelectedRegister] = useState(null);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = rows.filter((row) =>
      columns.some((column) =>
        String(row[column.key] ?? "")
          .toLowerCase()
          .includes(query)
      )
    );

    return [...result].sort((a, b) => {
      let comparison;

      if (columns.find((column) => column.key === sort.key)?.type === "money") {
        comparison = Number(a[sort.key] || 0) - Number(b[sort.key] || 0);
      } else {
        comparison = String(a[sort.key] ?? "").localeCompare(
          String(b[sort.key] ?? ""),
          undefined,
          { numeric: true, sensitivity: "base" }
        );
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredRows.length
    ? (safePage - 1) * pageSize
    : 0;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const totals = useMemo(
    () =>
      filteredRows.reduce((sum, row) => {
        columns
          .filter((column) => column.type === "money")
          .forEach((column) => {
            sum[column.key] =
              (sum[column.key] || 0) + Number(row[column.key] || 0);
          });
        return sum;
      }, {}),
    [filteredRows]
  );

  const grandTotal = filteredRows.reduce(
    (sum, row) => sum + Number(row.total || 0),
    0
  );
  const openRegisters = filteredRows.filter(
    (row) => !row.closeTime
  ).length;
  const locationsCount = new Set(
    filteredRows.map((row) => row.location).filter(Boolean)
  ).size;

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
              column.type === "money" ? money(row[column.key]) : row[column.key] ?? ""
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
    link.download = "RegisterReport.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseRegister = (id) => {
    setActionMessage(
      `Register #${id}: connect your existing close-register workflow to complete this action.`
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
          .print-area th, .print-area td { padding: 5px !important; font-size: 9px !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1800px] space-y-5">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <ReceiptText size={14} />
              <span className="text-[11px] font-extrabold">PHARMACY · REPORTS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Register Report
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Review register sessions, payment totals, and closing status.
            </p>
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
                <span className="app-section-title block text-[#10234F]">Filters</span>
                <span className="app-description mt-0.5 block text-[#577B9F]">
                  Search register sessions and payment records.
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
            <div className="border-t border-[#F2E8DE] bg-[#FFFEFC] px-5 py-5 sm:px-6">
              <label className="block max-w-lg space-y-1.5">
                <span className="text-xs font-semibold text-[#557493]">
                  Search register report
                </span>
                <span className="relative block">
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
                    placeholder="Search location, user, time, or amount..."
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  />
                </span>
              </label>
              <div className="mt-4">
                <ActionButton icon={RotateCcw} onClick={resetFilters}>
                  Reset filters
                </ActionButton>
              </div>
            </div>
          )}
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total Register Sessions"
            value={rows.length}
            caption="Sessions in this report"
            icon={ReceiptText}
          />
          <SummaryCard
            title="Open Registers"
            value={rows.filter((row) => !row.closeTime).length}
            caption="Sessions without a close time"
            icon={Clock3}
          />
          <SummaryCard
            title="Total Payments"
            value={money(rows.reduce((sum, row) => sum + Number(row.total || 0), 0))}
            caption="Combined register totals"
            icon={Wallet}
          />
        </section>

        {/* Payment overview */}
        <section className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
              <CreditCard size={19} />
            </span>
            <div>
              <h2 className="app-section-title text-[#10234F]">
                Payment Overview
              </h2>
              <p className="app-description mt-0.5 text-[#577B9F]">
                Payment totals across the register sessions shown
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: "cash", label: "Cash", icon: Banknote },
              { key: "cardSlips", label: "Card Slips", icon: CreditCard },
              { key: "cheques", label: "Cheques", icon: ReceiptText },
              { key: "bankTransfer", label: "Bank Transfer", icon: Wallet },
            ].map(({ key, label, icon: Icon }) => (
              <div
                key={key}
                className="rounded-xl border border-[#F2E8DE] bg-[#FFFCF8] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#577B9F]">
                    {label}
                  </span>
                  <Icon size={17} className="text-[#F04A13]" />
                </div>
                <p className="mt-2 text-lg font-bold text-[#10234F]">
                  {money(rows.reduce(
                    (sum, row) => sum + Number(row[key] || 0),
                    0
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Register table */}
        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <ReceiptText size={19} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  Register Sessions
                </h2>
                <p className="app-description mt-0.5 text-[#577B9F]">
                  Payment breakdown by register session
                </p>
              </div>
            </div>
          </div>

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
                  <div className="absolute left-0 top-full z-30 mt-2 max-h-96 w-72 overflow-y-auto rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-[#F2E8DE] pb-2">
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
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search register report..."
                className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1900px] border-collapse text-left text-sm">
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
                  <th className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wide text-[#526D8D]">
                    Action
                  </th>
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
                        <td key={column.key} className="px-4 py-4 align-middle">
                          {column.type === "money" ? (
                            <span className="whitespace-nowrap font-semibold tabular-nums text-[#19366F]">
                              {money(row[column.key])}
                              {column.key === "cheques" && (
                                <span                                 className="ml-1 text-xs text-[#8798AD]">
                                  (0)
                                </span>
                              )}
                              {column.key === "cardSlips" && (
                                <span                                 className="ml-1 text-xs text-[#8798AD]">
                                  (0)
                                </span>
                              )}
                            </span>
                          ) : column.key === "location" ? (
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-[#19366F]">
                              <MapPin size={14} className="text-[#8798AD]" />
                              {row.location || "—"}
                            </span>
                          ) : column.key === "user" ? (
                            <span className="inline-flex min-w-[190px] items-start gap-2 text-[#577B9F]">
                              <UserRound size={15} className="mt-0.5 shrink-0 text-[#8798AD]" />
                              <span className="break-words">{row.user || "—"}</span>
                            </span>
                          ) : column.key === "openTime" ? (
                            <span className="inline-flex min-w-[130px] items-start gap-2 text-[#577B9F]">
                              <Clock3 size={14} className="mt-0.5 shrink-0 text-[#8798AD]" />
                              {row.openTime || "—"}
                            </span>
                          ) : (
                            <span className="text-[#577B9F]">
                              {row[column.key] || "—"}
                            </span>
                          )}
                        </td>
                      ))}

                    <td className="px-4 py-4 align-middle">
                      <div className="flex min-w-[130px] flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRegister(row)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#DBE8F7] bg-[#F1F7FF] px-3 py-2 text-xs font-bold text-[#3478F6] transition hover:bg-[#E5F0FF]"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        {!row.closeTime && (
                          <button
                            type="button"
                            onClick={() => handleCloseRegister(row.id)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#FFE0D8] bg-[#FFF1EC] px-3 py-2 text-xs font-bold text-[#D94E32] transition hover:bg-[#FFE6DE]"
                          >
                            <LockKeyhole size={13} />
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={
                        columns.filter((column) =>
                          visibleColumns.includes(column.key)
                        ).length + 1
                      }
                      className="px-6 py-12 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#F04A13]">
                        <ReceiptText size={21} />
                      </div>
                      <p className="mt-3 font-semibold text-[#10234F]">
                        No data available in table
                      </p>
                      <p className="mt-1 text-sm text-[#577B9F]">
                        No register sessions match the current search.
                      </p>
                      {search && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-4 text-sm font-semibold text-[#F04A13] hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr className="border-t border-[#F2E8DE] bg-[#FFF1E5]">
                  {columns
                    .filter((column) => visibleColumns.includes(column.key))
                    .map((column, index) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap px-4 py-4 font-bold text-[#19366F]"
                      >
                        {index === 0
                          ? "Total:"
                          : column.type === "money"
                            ? money(totals[column.key] || 0)
                            : ""}
                      </td>
                    ))}
                  <td className="px-4 py-4" />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#577B9F]">
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
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>
              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF711A] px-3 text-sm font-bold text-white">
                {safePage}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {actionMessage && (
          <div className="no-print fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-start gap-3 rounded-xl border border-[#DDE4ED] bg-white p-4 shadow-xl">
            <AlertCircle size={19} className="mt-0.5 shrink-0 text-[#E86A20]" />
            <p className="flex-1 text-sm text-[#10234F]">{actionMessage}</p>
            <button
              type="button"
              onClick={() => setActionMessage("")}
              aria-label="Dismiss message"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>Billomax · Register Report</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>

      <ViewRegisterReportModal
        isOpen={Boolean(selectedRegister)}
        onClose={() => setSelectedRegister(null)}
        register={
          selectedRegister
            ? {
                dateRange: `${selectedRegister.openTime || "—"} - ${selectedRegister.closeTime || "Open"}`,
                totalSales: selectedRegister.total,
                totalPayment: selectedRegister.total,
                user: selectedRegister.user,
                businessLocation: selectedRegister.location,
              }
            : {}
        }
      />

      <div className="no-print fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3478F6] text-white shadow-[0_6px_18px_rgba(52,120,246,0.35)] transition hover:bg-[#2563EB]"
        >
          <ChevronUp size={22} strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7778FF] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#6667F0]"
        >
          <Printer size={17} />
          Print
        </button>
      </div>
    </main>
  );
}
