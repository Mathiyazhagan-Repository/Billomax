
import React, { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  Printer,
  Columns3,
  Eye,
  Pencil,
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";
import ViewStockTransferModal from "./ViewStockTransferModal.jsx";

const initialTransfers = [
  {
    id: 1,
    date: "23/03/2026 18:50",
    referenceNo: "9090",
    locationFrom: "Pharmacy",
    locationTo: "Soujanya H V",
    status: "In Transit",
    shippingCharges: 100.0,
    totalAmount: 232.0,
    additionalNotes: "testing",
  },
];

const columns = [
  { key: "date", label: "Date" },
  { key: "referenceNo", label: "Reference No" },
  { key: "locationFrom", label: "Location (From)" },
  { key: "locationTo", label: "Location (To)" },
  { key: "status", label: "Status" },
  { key: "shippingCharges", label: "Shipping Charges" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "additionalNotes", label: "Additional Notes" },
  { key: "action", label: "Action" },
];

const currency = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  const styles =
    normalized === "completed" || normalized === "received"
    ? "bg-[#EAF8F0] text-[#24804C] ring-[#CDEDDC]"
      : normalized === "cancelled"
    ? "bg-[#FFF0ED] text-[#C43D32] ring-[#FFD9D2]"
    : "bg-[#FFF1E5] text-[#F04A13] ring-[#F8EBDD]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, children, onClick, tone }) {
  const tones = {
    view: "border-[#D5EEE8] bg-[#EFFAF7] text-[#277968] hover:bg-[#E0F4EF]",
    print: "border-[#D8E8FF] bg-[#F3F8FF] text-[#3478F6] hover:bg-[#EAF3FF]",
    edit: "border-[#E4DDFB] bg-[#F7F4FF] text-[#7252B8] hover:bg-[#EEE9FF]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20 ${tones[tone]}`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

export default function ListStockTransfers({
  transfers = initialTransfers,
  onAdd,
  onView,
  onPrint,
  onEdit,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [exportNotice, setExportNotice] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const filteredTransfers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return transfers;

    return transfers.filter((transfer) =>
      [
        transfer.date,
        transfer.referenceNo,
        transfer.locationFrom,
        transfer.locationTo,
        transfer.status,
        transfer.shippingCharges,
        transfer.totalAmount,
        transfer.additionalNotes,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [transfers, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransfers.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleTransfers = filteredTransfers.slice(
    startIndex,
    startIndex + pageSize
  );

  const displayedColumns = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );

  const toggleColumn = (key) => {
    setVisibleColumns((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  };

  const exportCSV = () => {
    const exportableColumns = displayedColumns.filter(
      (column) => column.key !== "action"
    );

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      exportableColumns.map((column) => column.label),
      ...filteredTransfers.map((transfer) =>
        exportableColumns.map((column) => {
          if (column.key === "shippingCharges" || column.key === "totalAmount") {
            return currency(transfer[column.key]);
          }
          return transfer[column.key] ?? "";
        })
      ),
    ];

    const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stock-transfers.csv";
    link.click();
    URL.revokeObjectURL(url);
    setExportNotice("CSV export started.");
  };

  const handlePrint = (transfer) => {
    if (onPrint) {
      onPrint(transfer);
    } else {
      window.print();
    }
  };

  const handleAction = (callback, transfer) => {
    if (callback) callback(transfer);
  };

  const handleView = (transfer) => {
    setSelectedTransfer(transfer);
    handleAction(onView, transfer);
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1500px] space-y-5">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <span className="text-[11px] font-extrabold">INVENTORY · STOCK TRANSFERS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Stock Transfers
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Track stock movement between business locations.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#FF711A] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:bg-[#F04A13] focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20 focus:ring-offset-2 sm:self-auto"
          >
            <Plus size={18} />
            Add Stock Transfer
          </button>
        </header>

        {/* Main card */}
        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
                <ArrowLeftRight size={21} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  All Stock Transfers
                </h2>
                <p className="app-description mt-1 text-[#577B9F]">
                  View, print, and edit transfer records.
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-[#F2E8DE] bg-[#FFFCF8] px-3 py-2 text-sm font-semibold text-[#577B9F]">
              <FileText size={16} className="text-[#F04A13]" />
              <span>
                {filteredTransfers.length}{" "}
                {filteredTransfers.length === 1 ? "transfer" : "transfers"}
              </span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-[#FFFCF8] px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#577B9F]">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                entries
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
                >
                  <Download size={14} />
                  Export CSV
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setExportNotice(
                      "Excel export is not connected. Use Export CSV for now."
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
                >
                  <FileSpreadsheet size={14} />
                  Export Excel
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
                >
                  <Printer size={14} />
                  Print
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColumns((previous) => !previous)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
                  >
                    <Columns3 size={14} />
                    Column visibility
                  </button>

                  {showColumns && (
                    <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-bold text-[#19366F]">
                          Table columns
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowColumns(false)}
                          aria-label="Close column menu"
                          className="rounded-md p-1 text-[#8798AD] hover:bg-[#FFF1E5]"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {columns.map((column) => (
                          <label
                            key={column.key}
                            className="flex cursor-pointer items-center gap-2 text-sm text-[#577B9F]"
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumns.includes(column.key)}
                              onChange={() => toggleColumn(column.key)}
                              className="rounded border-[#E8EDF4] accent-[#FF711A]"
                            />
                            {column.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setExportNotice(
                      "PDF export is not connected. Use Print and select Save as PDF."
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
                >
                  <FileText size={14} />
                  Export PDF
                </button>
              </div>

              <div className="relative w-full xl:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search transfers..."
                  className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                />
              </div>
            </div>

            {exportNotice && (
              <div
                role="status"
                className="flex items-center justify-between gap-3 rounded-lg border border-[#F8EBDD] bg-[#FFF1E5] px-3 py-2 text-sm text-[#9A4B13]"
              >
                <span>{exportNotice}</span>
                <button
                  type="button"
                  onClick={() => setExportNotice("")}
                  aria-label="Dismiss message"
                  className="rounded-md p-1 hover:bg-[#FFE9D9]"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Transfers table */}
          <div className="px-5 pb-2 sm:px-6">
            <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
              <table className="w-full min-w-[1150px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#FFF7EF] text-[10px] font-extrabold uppercase tracking-wide text-[#19366F]">
                    {displayedColumns.map((column) => (
                      <th key={column.key} className="px-4 py-4">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2E8DE]">
                  {visibleTransfers.map((transfer, index) => (
                    <tr
                      key={transfer.id ?? transfer.referenceNo}
                      className={`transition hover:bg-[#FFF7EF] ${
                        index % 2 === 1 ? "bg-[#FFFCF8]" : "bg-white"
                      }`}
                    >
                      {displayedColumns.map((column) => {
                        switch (column.key) {
                          case "date":
                            return (
                              <td
                                key={column.key}
                                className="whitespace-nowrap px-4 py-4 text-[#577B9F]"
                              >
                                <span className="inline-flex items-start gap-2">
                                  <CalendarDays
                                    size={15}
                                    className="mt-0.5 shrink-0 text-[#8798AD]"
                                  />
                                  {transfer.date}
                                </span>
                              </td>
                            );

                          case "referenceNo":
                            return (
                              <td
                                key={column.key}
                                className="whitespace-nowrap px-4 py-4 font-semibold text-[#19366F]"
                              >
                                {transfer.referenceNo}
                              </td>
                            );

                          case "locationFrom":
                          case "locationTo":
                            return (
                              <td
                                key={column.key}
                                className="px-4 py-4 text-[#577B9F]"
                              >
                                <span className="inline-flex items-start gap-2">
                                  <MapPin
                                    size={15}
                                    className="mt-0.5 shrink-0 text-[#8798AD]"
                                  />
                                  {transfer[column.key]}
                                </span>
                              </td>
                            );

                          case "status":
                            return (
                              <td key={column.key} className="px-4 py-4">
                                <StatusBadge status={transfer.status} />
                              </td>
                            );

                          case "shippingCharges":
                          case "totalAmount":
                            return (
                              <td
                                key={column.key}
                                className="whitespace-nowrap px-4 py-4 font-semibold tabular-nums text-[#19366F]"
                              >
                                {currency(transfer[column.key])}
                              </td>
                            );

                          case "additionalNotes":
                            return (
                              <td
                                key={column.key}
                                className="max-w-44 px-4 py-4 text-[#577B9F]"
                              >
                                <span className="block truncate">
                                  {transfer.additionalNotes || "—"}
                                </span>
                              </td>
                            );

                          case "action":
                            return (
                              <td key={column.key} className="px-4 py-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <ActionButton
                                    icon={Eye}
                                    tone="view"
                                    onClick={() => handleView(transfer)}
                                  >
                                    View
                                  </ActionButton>
                                  <ActionButton
                                    icon={Printer}
                                    tone="print"
                                    onClick={() => handlePrint(transfer)}
                                  >
                                    Print
                                  </ActionButton>
                                  <ActionButton
                                    icon={Pencil}
                                    tone="edit"
                                    onClick={() =>
                                      handleAction(onEdit, transfer)
                                    }
                                  >
                                    Edit
                                  </ActionButton>
                                </div>
                              </td>
                            );

                          default:
                            return (
                              <td key={column.key} className="px-4 py-4">
                                {transfer[column.key] ?? "—"}
                              </td>
                            );
                        }
                      })}
                    </tr>
                  ))}

                  {visibleTransfers.length === 0 && (
                    <tr>
                      <td
                        colSpan={Math.max(displayedColumns.length, 1)}
                        className="px-4 py-16 text-center"
                      >
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#F04A13]">
                          <Search size={21} />
                        </span>
                        <p className="mt-3 font-semibold text-[#19366F]">
                          No stock transfers found
                        </p>
                        <p className="mt-1 text-sm text-[#577B9F]">
                          Try changing your search term.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-[#577B9F]">
              Showing{" "}
              <span className="font-semibold text-[#19366F]">
                {filteredTransfers.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#19366F]">
                {Math.min(startIndex + pageSize, filteredTransfers.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#19366F]">
                {filteredTransfers.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1 self-start rounded-xl border border-[#F2E8DE] bg-white p-1 sm:self-auto">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() =>
                  setPage((previous) => Math.max(1, previous - 1))
                }
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF711A] px-3 text-sm font-bold text-white">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((previous) =>
                    Math.min(totalPages, previous + 1)
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <ViewStockTransferModal
          open={Boolean(selectedTransfer)}
          transfer={selectedTransfer ?? {}}
          onClose={() => setSelectedTransfer(null)}
          onPrint={onPrint}
        />

        <footer className="pb-3 pt-1 text-center text-xs text-[#8798AD]">
          Billomax · Inventory management
        </footer>
      </div>
    </main>
  );
}
