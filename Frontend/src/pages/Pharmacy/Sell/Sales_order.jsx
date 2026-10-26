import { useMemo, useState } from "react";
import {
  ArrowDownUp,
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
  X,
} from "lucide-react";
import { businessStorage } from "../../../utils/businessStorage.js";

const SALES_ORDERS_KEY = "billomax-sales-orders";

const columns = [
  { key: "action", label: "Action" },
  { key: "date", label: "Date" },
  { key: "orderNo", label: "Order No." },
  { key: "customer", label: "Customer name" },
  { key: "contact", label: "Contact Number" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
  { key: "shippingStatus", label: "Shipping Status" },
  { key: "quantityRemaining", label: "Quantity Remaining" },
  { key: "addedBy", label: "Added By" },
];

function readSalesOrders() {
  try {
    const stored = businessStorage.getItem(SALES_ORDERS_KEY);
    const orders = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(orders)) {
      throw new Error("Saved sales orders are not in the expected format.");
    }
    return orders;
  } catch (error) {
    console.error("Could not load saved sales orders:", error);
    return [];
  }
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

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

function SalesOrderModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    orderNo: "",
    customer: "",
    contact: "",
    location: "",
    status: "Pending",
    shippingStatus: "Pending",
    quantityRemaining: "0",
    addedBy: "Admin",
  });

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172D45]/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sales-order-modal-title"
        className="w-full max-w-2xl rounded-2xl border border-[#F0EAE3] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#F1ECE6] px-5 py-4">
          <h2
            id="sales-order-modal-title"
            className="text-lg font-semibold text-[#283961]"
          >
            Add Sales Order
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-[#71809A] hover:bg-[#FFF3E8] hover:text-[#E87928]"
          >
            <X size={18} />
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave(form);
          }}
          className="grid gap-4 p-5 sm:grid-cols-2"
        >
          {[
            ["orderNo", "Order number", "text"],
            ["date", "Date", "date"],
            ["customer", "Customer name", "text"],
            ["contact", "Contact number", "tel"],
            ["location", "Business location", "text"],
            ["quantityRemaining", "Quantity remaining", "number"],
          ].map(([key, label, type]) => (
            <label
              key={key}
              className="text-xs font-semibold text-[#344B70]"
            >
              {label}
              <input
                required={["orderNo", "customer"].includes(key)}
                type={type}
                min={type === "number" ? "0" : undefined}
                value={form[key]}
                onChange={(event) => update(key, event.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
              />
            </label>
          ))}
          <div className="flex justify-end gap-2 border-t border-[#F1ECE6] pt-4 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-[#D7E0EB] px-4 text-sm font-medium text-[#60738D] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#FF8627] px-4 text-sm font-semibold text-white transition hover:bg-[#EF7420]"
            >
              Save Sales Order
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function SalesOrder() {
  const [orders, setOrders] = useState(readSalesOrders);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ location: "", status: "" });
  const [appliedFilters, setAppliedFilters] = useState({
    location: "",
    status: "",
  });
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key),
  );
  const [addingOrder, setAddingOrder] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch = Object.values(order)
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesLocation =
        !appliedFilters.location ||
        order.location === appliedFilters.location;
      const matchesStatus =
        !appliedFilters.status || order.status === appliedFilters.status;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [appliedFilters, orders, search]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const firstEntry = filteredOrders.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const lastEntry = Math.min(currentPage * pageSize, filteredOrders.length);
  const visibleOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const shownColumns = columns.filter((column) =>
    visibleColumns.includes(column.key),
  );

  const saveOrder = (form) => {
    const updatedOrders = [
      ...orders,
      {
        ...form,
        id: `${Date.now()}`,
        date: new Date(`${form.date}T00:00:00`).toLocaleDateString("en-GB"),
      },
    ];
    try {
      businessStorage.setItem(
        SALES_ORDERS_KEY,
        JSON.stringify(updatedOrders),
      );
      setOrders(updatedOrders);
      setPage(Math.ceil(updatedOrders.length / pageSize));
      setAddingOrder(false);
      setNotice("Sales order added.");
    } catch (error) {
      console.error("Could not save sales order:", error);
      setNotice("Sales order could not be saved. Please try again.");
    }
  };

  const exportCsv = () => {
    const rows = filteredOrders.map((order) =>
      shownColumns.map((column) =>
        column.key === "action" ? "" : order[column.key] ?? "",
      ),
    );
    const csv = `\uFEFF${[
      shownColumns.map((column) => column.label),
      ...rows,
    ]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n")}`;
    downloadFile("sales-orders.csv", csv, "text/csv;charset=utf-8");
  };

  const exportExcel = () => {
    const header = shownColumns
      .map((column) => `<th>${escapeHtml(column.label)}</th>`)
      .join("");
    const rows = filteredOrders
      .map(
        (order) =>
          `<tr>${shownColumns
            .map(
              (column) =>
                `<td>${escapeHtml(column.key === "action" ? "" : order[column.key])}</td>`,
            )
            .join("")}</tr>`,
      )
      .join("");
    downloadFile(
      "sales-orders.xls",
      `<html><head><meta charset="utf-8"></head><body><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></body></html>`,
      "application/vnd.ms-excel;charset=utf-8",
    );
  };

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const toggleColumn = (key) => {
    setVisibleColumns((current) =>
      current.includes(key)
        ? current.filter((column) => column !== key)
        : [...current, key],
    );
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex-1 bg-[#FFFAF5] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8798AD]">
            Sales management
          </p>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#F5852A]">
            Sales Order
          </h1>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-[#F4D5B8] bg-[#FFF8F0] px-4 py-3 text-sm text-[#8B5A32]"
          >
            {notice}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-[#344B70]">
                  Business location
                  <input
                    value={filters.location}
                    onChange={(event) =>
                      updateFilter("location", event.target.value)
                    }
                    placeholder="All locations"
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D]"
                  />
                </label>
                <label className="text-xs font-semibold text-[#344B70]">
                  Status
                  <select
                    value={filters.status}
                    onChange={(event) =>
                      updateFilter("status", event.target.value)
                    }
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D]"
                  >
                    <option value="">All statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAppliedFilters(filters);
                    setPage(1);
                  }}
                  className="h-9 rounded-lg bg-[#FF8627] px-4 text-xs font-semibold text-white transition hover:bg-[#EF7420]"
                >
                  Apply filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cleared = { location: "", status: "" };
                    setFilters(cleared);
                    setAppliedFilters(cleared);
                    setPage(1);
                  }}
                  className="h-9 rounded-lg border border-[#D7E0EB] px-4 text-xs font-medium text-[#60738D] hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.04)]">
          <div className="flex justify-end border-b border-[#F1ECE6] px-5 py-4">
            <button
              type="button"
              onClick={() => {
                setNotice("");
                setAddingOrder(true);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#FF8627] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#EF7420]"
            >
              <Plus size={17} />
              Add Sales Order
            </button>
          </div>

          <div className="flex flex-col gap-4 px-5 py-4 xl:flex-row xl:items-center">
            <label className="flex items-center gap-2 text-sm text-[#42546E]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-[#D6DFEA] bg-white px-2 text-sm text-[#536781] outline-none focus:border-[#F5A15D]"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              entries
            </label>

            <div className="flex flex-wrap gap-2">
              <ToolButton icon={FileText} onClick={exportCsv}>
                Export CSV
              </ToolButton>
              <ToolButton icon={FileSpreadsheet} onClick={exportExcel}>
                Export Excel
              </ToolButton>
              <ToolButton icon={Printer} onClick={() => window.print()}>
                Print
              </ToolButton>
              <div className="relative">
                <ToolButton
                  icon={Columns3}
                  onClick={() => setColumnsOpen((open) => !open)}
                  aria-expanded={columnsOpen}
                >
                  Column visibility
                </ToolButton>
                {columnsOpen && (
                  <div className="absolute left-0 top-10 z-20 max-h-72 w-56 overflow-y-auto rounded-xl border border-[#E5EAF1] bg-white p-2 shadow-lg">
                    {columns.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-[#42546E] hover:bg-[#FFF7EF]"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="accent-[#F5852A]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <ToolButton icon={FileText} onClick={() => window.print()}>
                Export PDF
              </ToolButton>
            </div>

            <label className="relative flex h-10 w-full items-center xl:ml-auto xl:w-64">
              <Search
                size={15}
                className="absolute left-3 text-[#8190A5]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                aria-label="Search sales orders"
                className="h-full w-full rounded-lg border border-[#D6DFEA] bg-white pl-9 pr-3 text-sm text-[#42546E] outline-none placeholder:text-[#98A4B5] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
              />
            </label>
          </div>

          <div className="overflow-x-auto px-5">
            <table className="w-full min-w-[1050px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#FFF8F0] text-[#344B70]">
                  {shownColumns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="border-y border-[#F0EAE3] px-3 py-3 font-semibold"
                    >
                      <span className="flex items-center justify-between gap-2">
                        {column.label}
                        <ArrowDownUp
                          size={13}
                          className="shrink-0 text-[#AAB6C4]"
                          aria-hidden="true"
                        />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleOrders.length ? (
                  visibleOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#F0EAE3] text-[#536985] hover:bg-[#FFFCF8]"
                    >
                      {shownColumns.map((column) => (
                        <td key={column.key} className="px-3 py-3">
                          {column.key === "action" ? (
                            <span className="text-[#98A4B5]">—</span>
                          ) : (
                            order[column.key] || "—"
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Math.max(shownColumns.length, 1)}
                      className="bg-[#FAFAFA] px-4 py-5 text-center text-sm text-[#536781]"
                    >
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 px-5 py-4 text-sm text-[#536781] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {firstEntry} to {lastEntry} of {filteredOrders.length}{" "}
              entries
            </p>
            <div className="flex items-center self-end">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage <= 1}
                className="inline-flex h-9 items-center gap-1 rounded-l-lg border border-[#D7E0EB] px-3 text-xs font-medium text-[#60738D] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <span className="inline-flex h-9 items-center border-y border-[#D7E0EB] px-3 text-xs text-[#60738D]">
                {currentPage} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
                disabled={currentPage >= pageCount}
                className="inline-flex h-9 items-center gap-1 rounded-r-lg border border-[#D7E0EB] px-3 text-xs font-medium text-[#60738D] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        <footer className="py-7 text-center text-xs text-[#8798AD]">
          Billomax · Your Trusted Partner in Billing &amp; Invoicing
        </footer>
      </div>

      {addingOrder && (
        <SalesOrderModal
          onClose={() => setAddingOrder(false)}
          onSave={saveOrder}
        />
      )}
    </main>
  );
}