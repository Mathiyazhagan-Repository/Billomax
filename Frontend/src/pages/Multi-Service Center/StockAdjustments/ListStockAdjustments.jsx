
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  FileDown,
  Printer,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Trash2,
  X,
  ClipboardList,
  MapPin,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import ViewStockAdjustmentModal from "../../Pharmacy/StockAdjustments/ViewStockAdjustmentModal.jsx";

const initialAdjustments = [
  {
    id: 1,
    date: "22/01/2025 17:06",
    referenceNo: "336464646",
    location: "Multi-Service Center",
    adjustmentType: "Normal",
    totalAmount: 12,
    totalAmountRecovered: 79,
    reason: "not ok",
    addedBy: "MSC Admin",
  },
  {
    id: 2,
    date: "22/01/2025 17:05",
    referenceNo: "1213133",
    location: "Multi-Service Center",
    adjustmentType: "Abnormal",
    totalAmount: 18,
    totalAmountRecovered: 733,
    reason: "",
    addedBy: "MSC Admin",
  },
];

const columns = [
  { key: "action", label: "Action" },
  { key: "date", label: "Date" },
  { key: "referenceNo", label: "Reference No" },
  { key: "location", label: "Location" },
  { key: "adjustmentType", label: "Adjustment type" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "totalAmountRecovered", label: "Total amount recovered" },
  { key: "reason", label: "Reason" },
  { key: "addedBy", label: "Added By" },
];

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ActionButton({
  icon: Icon,
  children,
  onClick,
  primary = false,
  danger = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20 disabled:cursor-not-allowed disabled:opacity-50 ${
        primary
          ? "border-transparent bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13]"
          : danger
            ? "border-[#FFD9D2] bg-white text-[#C43D32] hover:bg-[#FFF0ED]"
            : "border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
      }`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-semibold text-[#19366F]">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#E8EDF4] bg-white px-3.5 py-2.5 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

function AddAdjustmentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    date: "2025-01-22T17:06",
    referenceNo: "",
    location: "Multi-Service Center",
    adjustmentType: "Normal",
    totalAmount: "0",
    totalAmountRecovered: "0",
    reason: "",
    addedBy: "Mr pharmacy",
  });

  const update = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const submit = (event) => {
    event.preventDefault();

    const date = form.date
      ? (() => {
          const [day, time] = form.date.split("T");
          const [year, month, datePart] = day.split("-");
          return `${datePart}/${month}/${year} ${time}`;
        })()
      : "";

    onAdd({
      ...form,
      id: Date.now(),
      date,
      totalAmount: Number(form.totalAmount) || 0,
      totalAmountRecovered: Number(form.totalAmountRecovered) || 0,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-adjustment-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E6EAF0] bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-[#EDF0F5] px-5 py-4 sm:px-6">
          <div>
            <h2 id="add-adjustment-title" className="text-lg font-bold text-[#10234F]">
              Add stock adjustment
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the adjustment details below.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </header>

        <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Date and time">
              <input
                type="datetime-local"
                value={form.date}
                onChange={(event) => update("date", event.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Reference No">
              <input
                value={form.referenceNo}
                onChange={(event) => update("referenceNo", event.target.value)}
                placeholder="Enter reference number"
                className={inputClass}
                required
              />
            </Field>
            <Field label="Location">
              <input
                value={form.location}
                onChange={(event) => update("location", event.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Adjustment type">
              <select
                value={form.adjustmentType}
                onChange={(event) => update("adjustmentType", event.target.value)}
                className={inputClass}
              >
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
              </select>
            </Field>
            <Field label="Total amount (₹)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.totalAmount}
                onChange={(event) => update("totalAmount", event.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Total amount recovered (₹)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.totalAmountRecovered}
                onChange={(event) =>
                  update("totalAmountRecovered", event.target.value)
                }
                className={inputClass}
                required
              />
            </Field>
            <Field label="Added By">
              <input
                value={form.addedBy}
                onChange={(event) => update("addedBy", event.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Reason">
              <input
                value={form.reason}
                onChange={(event) => update("reason", event.target.value)}
                placeholder="Optional reason"
                className={inputClass}
              />
            </Field>
          </div>

          <footer className="flex flex-wrap justify-end gap-2 border-t border-[#EDF0F5] pt-4">
            <ActionButton onClick={onClose}>Cancel</ActionButton>
            <ActionButton icon={Plus} primary>
              Add adjustment
            </ActionButton>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default function ListStockAdjustments({ openAddOnMount = false, onAdd }) {
  const [adjustments, setAdjustments] = useState(initialAdjustments);
  const [search, setSearch] = useState("");
  const [showColumns, setShowColumns] = useState(false);
  const [showAddModal, setShowAddModal] = useState(openAddOnMount);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [sort, setSort] = useState({ key: "date", direction: "desc" });

  useEffect(() => {
    setShowAddModal(openAddOnMount);
  }, [openAddOnMount]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return adjustments
      .filter((row) => {
        const matchesSearch = [
          row.date,
          row.referenceNo,
          row.location,
          row.adjustmentType,
          row.totalAmount,
          row.totalAmountRecovered,
          row.reason,
          row.addedBy,
        ].some((value) => String(value ?? "").toLowerCase().includes(query));

        return matchesSearch;
      })
      .sort((a, b) => {
        let comparison;

        if (sort.key === "totalAmount" || sort.key === "totalAmountRecovered") {
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
  }, [adjustments, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredRows.length ? (safePage - 1) * pageSize : 0;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const toggleSort = (key) => {
    if (key === "action") return;
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

  const addAdjustment = (row) => {
    setAdjustments((previous) => [row, ...previous]);
    setCurrentPage(1);
  };

  const deleteAdjustment = () => {
    setAdjustments((previous) =>
      previous.filter((row) => row.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  const exportCSV = () => {
    const exportColumns = columns.filter(
      (column) =>
        visibleColumns.includes(column.key) && column.key !== "action"
    );

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      exportColumns.map((column) => escapeCSV(column.label)).join(","),
      ...filteredRows.map((row) =>
        exportColumns
          .map((column) => {
            const value =
              column.key === "totalAmount" ||
              column.key === "totalAmountRecovered"
                ? money(row[column.key])
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
    link.download = "ListStockAdjustments.csv";
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
        <h1 className="app-page-title text-[#10234F]">Stock Adjustments</h1>

        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#F47700] sm:text-2xl">
                All stock adjustments
              </h2>
            </div>
            <div className="no-print">
              <ActionButton
                icon={Plus}
                primary
                onClick={() => (onAdd ? onAdd() : setShowAddModal(true))}
              >
                Add Stock Transfer
              </ActionButton>
            </div>
          </div>

          <div className="no-print flex flex-col gap-4 px-5 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-[#19366F]">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#D8E0EB] bg-white px-3 py-2 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                entries
              </label>

              <ActionButton icon={Download} onClick={exportCSV}>
                Export CSV
              </ActionButton>
              <ActionButton icon={FileSpreadsheet} onClick={exportCSV}>
                Export Excel
              </ActionButton>
              <ActionButton icon={Printer} onClick={() => window.print()}>
                Print
              </ActionButton>
              <ActionButton icon={FileDown} onClick={() => window.print()}>
                Export PDF
              </ActionButton>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColumns((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
                >
                  <SlidersHorizontal size={15} />
                  Column visibility
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
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
                placeholder="Search..."
                className={`${inputClass} pl-9`}
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] border-collapse text-left text-sm">
              <thead>
                <tr                 className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                  {columns
                    .filter((column) => visibleColumns.includes(column.key))
                    .map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-4 text-[10px] font-extrabold uppercase tracking-wide text-[#19366F]"
                      >
                        {column.key === "action" ? (
                          column.label
                        ) : (
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
                        )}
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
                          {column.key === "action" ? (
                            <div className="flex min-w-[90px] flex-col items-start gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedAdjustment(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8E8FF] bg-white px-2.5 py-1.5 text-xs font-bold text-[#3478F6] transition hover:bg-[#EAF3FF]"
                              >
                                <Eye size={14} />
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFD9D2] bg-white px-2.5 py-1.5 text-xs font-bold text-[#C43D32] transition hover:bg-[#FFF0ED]"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          ) : column.key === "adjustmentType" ? (
                            <span
                              className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                row.adjustmentType === "Normal"
                                  ? "bg-[#EAF8F0] text-[#24804C]"
                                  : "bg-[#FFF0ED] text-[#C43D32]"
                              }`}
                            >
                              {row.adjustmentType}
                            </span>
                          ) : column.key === "date" ? (
                            <span className="inline-flex items-start gap-2 whitespace-nowrap font-medium text-[#19366F]">
                              <CalendarDays
                                size={14}
                                className="mt-0.5 shrink-0 text-[#8798AD]"
                              />
                              {row.date}
                            </span>
                          ) : column.key === "location" ? (
                            <span className="inline-flex items-center gap-2 text-[#577B9F]">
                              <MapPin size={14} className="shrink-0 text-[#8798AD]" />
                              {row.location}
                            </span>
                          ) : column.key === "totalAmount" ||
                            column.key === "totalAmountRecovered" ? (
                            <span className="whitespace-nowrap font-semibold tabular-nums text-[#19366F]">
                              {money(row[column.key])}
                            </span>
                          ) : (
                            <span className="break-words text-[#577B9F]">
                              {row[column.key] || "—"}
                            </span>
                          )}
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
                      <ClipboardList size={28} className="mx-auto text-[#D4DFEC]" />
                      <p className="mt-3 font-semibold text-[#19366F]">
                        No stock adjustments found
                      </p>
                      <p className="mt-1 text-sm text-[#577B9F]">
                        Try changing your search or filters.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 text-sm font-bold text-[#F04A13] hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#577B9F]">
              Showing{" "}
              <span className="font-semibold text-[#19366F]">
                {filteredRows.length ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#19366F]">
                {Math.min(startIndex + pageSize, filteredRows.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#19366F]">
                {filteredRows.length}
              </span>{" "}
              entries
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
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
                      <span className="px-1 text-slate-400">…</span>
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
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-[#8798AD] sm:flex-row sm:text-left">
          <p>Billomax · Stock Adjustments</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>

      {showAddModal && (
        <AddAdjustmentModal
          onClose={() => setShowAddModal(false)}
          onAdd={addAdjustment}
        />
      )}

      <ViewStockAdjustmentModal
        open={Boolean(selectedAdjustment)}
        adjustment={selectedAdjustment}
        onClose={() => setSelectedAdjustment(null)}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-[2px]">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-adjustment-title"
            className="w-full max-w-md rounded-2xl border border-[#F2E8DE] bg-white p-6 shadow-2xl"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0ED] text-[#C43D32]">
              <AlertTriangle size={23} />
            </span>
            <h2
              id="delete-adjustment-title"
              className="app-section-title mt-4 text-[#10234F]"
            >
              Delete this adjustment?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#577B9F]">
              This will remove adjustment reference{" "}
              <strong className="text-[#19366F]">{deleteTarget.referenceNo}</strong>{" "}
              from this page's current state. This demo does not delete the record
              from a backend database.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <ActionButton onClick={() => setDeleteTarget(null)}>
                Cancel
              </ActionButton>
              <ActionButton icon={Trash2} danger onClick={deleteAdjustment}>
                Delete
              </ActionButton>
            </div>
          </section>
        </div>
      )}

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
