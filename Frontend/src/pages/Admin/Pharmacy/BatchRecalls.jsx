
import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  List,
  Plus,
  Search,
  FileText,
  FileSpreadsheet,
  Printer,
  Columns3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  PackageSearch,
  X,
  ShieldAlert,
} from "lucide-react";
import InitiateBatchRecall from "./InitiateBatchRecall.jsx";

const INITIAL_BATCH_RECALLS = [];

export default function BatchRecalls({
  recalls: recallsProp,
  products = [],
  onInitiateRecall,
  onViewRecall,
  onExport,
}) {
  const recalls = recallsProp ?? INITIAL_BATCH_RECALLS;

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumns, setShowColumns] = useState(false);
  const [showRecallNotice, setShowRecallNotice] = useState(false);
  const [showInitiateRecall, setShowInitiateRecall] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
    product: true,
    lotNumber: true,
    status: true,
    action: true,
  });

  const [sortConfig, setSortConfig] = useState({
    key: "product",
    direction: "asc",
  });

  const columns = [
    { key: "product", label: "Product" },
    { key: "lotNumber", label: "Lot Number" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const filteredRecalls = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recalls
      .filter((recall) => {
        const product =
          typeof recall.product === "object"
            ? recall.product?.name ?? ""
            : recall.product ?? recall.productName ?? "";

        const lotNumber =
          recall.lotNumber ??
          recall.lot_number ??
          recall.batchNumber ??
          recall.batch_number ??
          "";

        const status = recall.status ?? "";

        return [product, lotNumber, status].some((value) =>
          String(value).toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortConfig.key === "action") return 0;

        const getValue = (recall) => {
          if (sortConfig.key === "product") {
            return typeof recall.product === "object"
              ? recall.product?.name ?? ""
              : recall.product ?? recall.productName ?? "";
          }

          if (sortConfig.key === "lotNumber") {
            return (
              recall.lotNumber ??
              recall.lot_number ??
              recall.batchNumber ??
              recall.batch_number ??
              ""
            );
          }

          return recall.status ?? "";
        };

        return (
          String(getValue(a)).localeCompare(String(getValue(b)), undefined, {
            numeric: true,
            sensitivity: "base",
          }) * (sortConfig.direction === "asc" ? 1 : -1)
        );
      });
  }, [recalls, search, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecalls.length / Number(pageSize))
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedRecalls = filteredRecalls.slice(
    (safePage - 1) * Number(pageSize),
    safePage * Number(pageSize)
  );

  const startEntry =
    filteredRecalls.length === 0
      ? 0
      : (safePage - 1) * Number(pageSize) + 1;

  const endEntry = Math.min(
    safePage * Number(pageSize),
    filteredRecalls.length
  );

  const handleSort = (key) => {
    if (key === "action") return;

    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleInitiateRecall = () => {
    setShowInitiateRecall(true);
  };

  const handleExport = (type) => {
    if (onExport) {
      onExport(type, filteredRecalls);
      return;
    }

    if (type === "Print") {
      window.print();
      return;
    }

    if (type === "CSV") {
      const escapeCsv = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

      const rows = [
        ["Product", "Lot Number", "Status"],
        ...filteredRecalls.map((recall) => [
          typeof recall.product === "object"
            ? recall.product?.name ?? ""
            : recall.product ?? recall.productName ?? "",
          recall.lotNumber ??
            recall.lot_number ??
            recall.batchNumber ??
            recall.batch_number ??
            "",
          recall.status ?? "",
        ]),
      ];

      const csv = rows
        .map((row) => row.map(escapeCsv).join(","))
        .join("\n");

      const url = URL.createObjectURL(
        new Blob(["\uFEFF", csv], {
          type: "text/csv;charset=utf-8;",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "batch-recalls.csv";
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    setShowRecallNotice(true);
  };

  const controlClass =
    "h-9 rounded-lg border border-[#E8EDF4] bg-white px-3 text-xs text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

  const exportButtons = [
    { label: "Export CSV", type: "CSV", icon: FileText },
    { label: "Export Excel", type: "Excel", icon: FileSpreadsheet },
    { label: "Print", type: "Print", icon: Printer },
  ];

  return (
    <main className="min-h-screen min-w-0 flex-1 bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1700px] space-y-5">
        {/* Page header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <AlertTriangle size={14} />
              <span className="text-[11px] font-extrabold">PHARMACY · SAFETY</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
                <AlertTriangle size={24} strokeWidth={2.5} />
              </span>

              <div>
                <h1 className="app-page-title text-[#10234F]">
                  Batch Recalls
                </h1>
                <p className="app-description mt-1 text-[#577B9F]">
                  Manage product batch recalls
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInitiateRecall}
            className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#FF711A] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F04A13] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/30 sm:self-center"
          >
            <Plus size={18} strokeWidth={2.8} />
            Initiate Recall
          </button>
        </header>

        {/* Main card */}
        <section className="overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          {/* Card heading */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
                <List size={19} />
              </span>

              <div>
                <h2 className="app-section-title text-[#10234F]">
                  All Batch Recalls
                </h2>
                <p className="app-description mt-0.5 text-[#577B9F]">
                  Product and lot recall records
                </p>
              </div>
            </div>

            <span className="rounded-full border border-[#F8EBDD] bg-[#FFF1E5] px-3 py-1.5 text-xs font-bold text-[#F04A13]">
              {recalls.length} records
            </span>
          </div>

          {/* Toolbar */}
          <div className="border-b border-[#F2E8DE] bg-[#FFFCF8] p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#577B9F]">
                  Show
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(event.target.value);
                      setCurrentPage(1);
                    }}
                    className={`${controlClass} min-w-[74px]`}
                    aria-label="Rows per page"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  entries
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  {exportButtons.map(({ label, type, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleExport(type)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E8EDF4] bg-white px-2.5 text-[11px] font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}

                  {/* Column visibility */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColumns((value) => !value)}
                      aria-expanded={showColumns}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E8EDF4] bg-white px-2.5 text-[11px] font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                    >
                      <Columns3 size={13} />
                      Column visibility
                      <ChevronDown size={13} />
                    </button>

                    {showColumns && (
                      <div className="absolute left-0 top-10 z-30 w-52 rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                        <p className="mb-2 text-xs font-bold text-[#10234F]">
                          Visible columns
                        </p>

                        {columns.map((column) => (
                          <label
                            key={column.key}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-[#577B9F] hover:bg-[#FFF1E5]"
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumns[column.key]}
                              onChange={() =>
                                setVisibleColumns((previous) => ({
                                  ...previous,
                                  [column.key]: !previous[column.key],
                                }))
                              }
                              className="accent-[#FF711A]"
                            />
                            {column.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExport("PDF")}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E8EDF4] bg-white px-2.5 text-[11px] font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                  >
                    <FileText size={13} />
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full xl:max-w-[240px]">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search ..."
                  aria-label="Search batch recalls"
                  className={`${controlClass} w-full pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Recall table */}
          <div className="px-4 pb-2 pt-2 sm:px-5">
            <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
              <table className="w-full min-w-[650px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#FFF7EF]">
                    {columns
                      .filter((column) => visibleColumns[column.key])
                      .map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="whitespace-nowrap border-b border-[#F2E8DE] px-3 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#526D8D] sm:px-4"
                        >
                          <button
                            type="button"
                            onClick={() => handleSort(column.key)}
                            className="flex w-full items-center justify-between gap-3 text-left"
                          >
                            {column.label}
                            <ArrowUpDown
                              size={14}
                              className={
                                sortConfig.key === column.key
                                  ? "text-[#F04A13]"
                                  : "text-[#A5B1C0]"
                              }
                            />
                          </button>
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2E8DE]">
                  {paginatedRecalls.length > 0 ? (
                    paginatedRecalls.map((recall, index) => {
                      const product =
                        typeof recall.product === "object"
                          ? recall.product?.name ?? "—"
                          : recall.product ?? recall.productName ?? "—";

                      const lotNumber =
                        recall.lotNumber ??
                        recall.lot_number ??
                        recall.batchNumber ??
                        recall.batch_number ??
                        "—";

                      const status = recall.status ?? "—";

                      return (
                        <tr
                          key={
                            recall.id ??
                            recall._id ??
                            `${lotNumber}-${index}`
                          }
                          className="transition hover:bg-[#FFF7EF]"
                        >
                          {visibleColumns.product && (
                            <td className="app-table-cell px-3 py-3 text-sm font-semibold text-[#19366F] sm:px-4">
                              {product}
                            </td>
                          )}

                          {visibleColumns.lotNumber && (
                            <td className="app-table-cell px-3 py-3 text-[#577B9F] sm:px-4">
                              {lotNumber}
                            </td>
                          )}

                          {visibleColumns.status && (
                            <td className="px-3 py-3.5 sm:px-4">
                              <span className="inline-flex rounded-full border border-[#FFD9D2] bg-[#FFF0ED] px-2.5 py-1 text-[11px] font-bold text-[#C43D32]">
                                {status}
                              </span>
                            </td>
                          )}

                          {visibleColumns.action && (
                            <td className="px-3 py-3.5 sm:px-4">
                              {onViewRecall ? (
                                <button
                                  type="button"
                                  onClick={() => onViewRecall(recall)}
                                  className="rounded-lg border border-[#FFCFAC] px-3 py-1.5 text-xs font-bold text-[#F04A13] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
                                >
                                  View Details
                                </button>
                              ) : (
                                <span className="text-xs text-[#A5B1C0]">
                                  —
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          columns.filter(
                            (column) => visibleColumns[column.key]
                          ).length
                        }
                        className="bg-[#FFFCF8] px-4 py-10 text-center"
                      >
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F8EBDD] bg-[#FFF1E5] text-[#F04A13]">
                            <PackageSearch size={22} />
                          </span>

                          <p className="mt-3 text-sm font-semibold text-[#19366F]">
                            {search
                              ? "No matching batch recalls found"
                              : "No data available in table"}
                          </p>

                          <p className="mt-1 text-xs text-[#8798AD]">
                            {search
                              ? "Try a different search term."
                              : "Batch recall records will appear here when available."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-[#F2E8DE] px-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#526D8D]">
                Showing{" "}
                <span                 className="font-semibold text-[#19366F]">
                  {startEntry}
                </span>{" "}
                to{" "}
                <span                 className="font-semibold text-[#19366F]">
                  {endEntry}
                </span>{" "}
                of{" "}
                <span                 className="font-semibold text-[#19366F]">
                  {filteredRecalls.length}
                </span>{" "}
                entries
              </p>

              <div className="flex items-center gap-1 self-start sm:self-auto">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                )
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - safePage) <= 1
                  )
                  .map((page, index, pages) => (
                    <React.Fragment key={page}>
                      {index > 0 && pages[index - 1] !== page - 1 && (
                        <span className="px-1 text-xs text-[#8798AD]">
                          …
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={
                          safePage === page ? "page" : undefined
                        }
                        className={`h-9 min-w-9 rounded-lg border px-2.5 text-xs font-semibold transition ${
                          safePage === page
                            ? "border-[#FF711A] bg-[#FF711A] text-white shadow-sm"
                            : "border-[#E8EDF4] bg-white text-[#19366F] hover:bg-[#FFF1E5]"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-2 pt-1 text-center text-[11px] leading-5 text-[#8798AD]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing
          {" · "}V6.3{" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>

      {/* Recall integration notice */}
      {showRecallNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/35 p-4 backdrop-blur-[3px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="recall-dialog-title"
            className="w-full max-w-md rounded-2xl border border-[#F2E8DE] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F47712]">
                <ShieldAlert size={23} />
              </span>

              <button
                type="button"
                onClick={() => setShowRecallNotice(false)}
                aria-label="Close"
                className="rounded-lg p-2 text-[#8798AD] hover:bg-[#FFF1E5]"
              >
                <X size={18} />
              </button>
            </div>

            <h2
              id="recall-dialog-title"
              className="app-section-title mt-4 text-[#10234F]"
            >
              Initiate Batch Recall
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#577B9F]">
              Connect your existing recall creation form using the{" "}
              <code className="rounded bg-[#F6F8FB] px-1 py-0.5 text-xs text-[#3478F6]">
                onInitiateRecall
              </code>{" "}
              callback. This component does not create or save recall records
              by itself.
            </p>

            <button
              type="button"
              onClick={() => setShowRecallNotice(false)}
              className="mt-5 w-full rounded-lg bg-[#FF711A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#F04A13]"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <InitiateBatchRecall
        isOpen={showInitiateRecall}
        onClose={() => setShowInitiateRecall(false)}
        onSubmit={onInitiateRecall}
        products={products}
      />
    </main>
  );
}
