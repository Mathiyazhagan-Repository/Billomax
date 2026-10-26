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
  Trash2,
  X,
} from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleSales,
} from "../../../utils/businessStorage.js";

const SALES_KEY = "billomax-sales";

export const initialSales = [
  { id: 1, date: "22/10/2026 11:00", invoiceNo: "0041", customerName: "Walk-In Customer", total: 15, paymentStatus: "Paid" },
  { id: 2, date: "01/10/2026 17:00", invoiceNo: "0040", customerName: "Walk-In Customer", total: 15, paymentStatus: "Paid" },
  { id: 3, date: "24/09/2026 15:43", invoiceNo: "0039", customerName: "Walk-In Customer", total: 25, paymentStatus: "Paid" },
  { id: 4, date: "17/09/2026 13:07", invoiceNo: "0038", customerName: "Walk-In Customer", total: 15, paymentStatus: "Paid" },
  { id: 5, date: "17/09/2026 13:07", invoiceNo: "0037", customerName: "Walk-In Customer", total: 15, paymentStatus: "Paid" },
  { id: 6, date: "04/09/2026 14:09", invoiceNo: "0036", customerName: "Walk-In Customer", total: 45, paymentStatus: "Paid" },
  { id: 7, date: "03/09/2026 10:55", invoiceNo: "0035", customerName: "Walk-In Customer", total: 15, paymentStatus: "Paid" },
  { id: 8, date: "01/09/2026 17:37", invoiceNo: "0034", customerName: "Walk-In Customer", total: 15, paymentStatus: "Paid" },
  { id: 9, date: "21/08/2026 17:48", invoiceNo: "0033", customerName: "Walk-In Customer", total: 74, paymentStatus: "Paid" },
].map((sale) => ({
  contactNumber: "",
  location: getActiveBusinessStorage(),
  paymentMethod: "Cash",
  totalPaid: sale.paymentStatus === "Paid" ? sale.total : 0,
  sellDue: sale.paymentStatus === "Paid" ? 0 : sale.total,
  sellReturnDue: 0,
  shippingStatus: "",
  totalItems: 1,
  addedBy: "Mr pharmacy",
  sellNote: "",
  staffNote: "",
  shippingDetails: "",
  ...sale,
}));

const columns = [
  { key: "action", label: "Action" },
  { key: "date", label: "Date" },
  { key: "invoiceNo", label: "Invoice No." },
  { key: "customerName", label: "Customer name" },
  { key: "contactNumber", label: "Contact Number" },
  { key: "location", label: "Location" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "total", label: "Total amount", money: true },
  { key: "totalPaid", label: "Total paid", money: true },
  { key: "sellDue", label: "Sell Due", money: true },
  { key: "sellReturnDue", label: "Sell Return Due", money: true },
  { key: "shippingStatus", label: "Shipping Status" },
  { key: "totalItems", label: "Total Items" },
  { key: "addedBy", label: "Added By" },
  { key: "sellNote", label: "Sell note" },
  { key: "staffNote", label: "Staff note" },
  { key: "shippingDetails", label: "Shipping Details" },
];

function readSales() {
  try {
    const stored = businessStorage.getItem(SALES_KEY);
    if (!stored) return getBusinessSampleSales(initialSales);
    const sales = JSON.parse(stored);
    if (!Array.isArray(sales)) {
      throw new Error("Saved sales are not in the expected format.");
    }
    return sales;
  } catch (error) {
    console.error("Could not load saved sales:", error);
    return getBusinessSampleSales(initialSales);
  }
}

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function saleDateValue(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(
    String(value ?? ""),
  );
  if (!match) return Date.parse(value) || 0;
  return new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]),
    Number(match[4] || 0),
    Number(match[5] || 0),
  ).getTime();
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

function downloadFile(filename, content, mimeType) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function ToolButton({ icon: Icon, children, onClick, expanded }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#D7E0EB] bg-white px-2.5 text-[11px] font-medium text-[#8798AD] transition hover:border-[#F5A15D] hover:text-[#E87928]"
    >
      <Icon size={14} />
      {children}
      {expanded !== undefined && <ChevronDown size={12} />}
    </button>
  );
}

function SaleModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    invoiceNo: "",
    customerName: "",
    contactNumber: "",
    location: getActiveBusinessStorage(),
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    total: "",
    totalPaid: "",
    shippingStatus: "",
    totalItems: "1",
    addedBy: getActiveBusinessStorage().toLowerCase(),
  });
  const setValue = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172D45]/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-sale-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#F0EAE3] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#F1ECE6] px-5 py-4">
          <h2 id="add-sale-title" className="text-lg font-semibold text-[#283961]">
            Add Sale
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
            ["invoiceNo", "Invoice number", "text"],
            ["date", "Date", "datetime-local"],
            ["customerName", "Customer name", "text"],
            ["contactNumber", "Contact number", "tel"],
            ["location", "Location", "text"],
            ["total", "Total amount", "number"],
            ["totalPaid", "Total paid", "number"],
            ["totalItems", "Total items", "number"],
            ["addedBy", "Added by", "text"],
          ].map(([key, label, type]) => (
            <label key={key} className="text-xs font-semibold text-[#344B70]">
              {label}
              <input
                required={["invoiceNo", "customerName", "total"].includes(key)}
                type={type}
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "0.01" : undefined}
                value={form[key]}
                onChange={(event) => setValue(key, event.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
              />
            </label>
          ))}
          <label className="text-xs font-semibold text-[#344B70]">
            Payment status
            <select
              value={form.paymentStatus}
              onChange={(event) => setValue("paymentStatus", event.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D]"
            >
              <option>Paid</option>
              <option>Due</option>
              <option>Partial</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-[#344B70]">
            Payment method
            <select
              value={form.paymentMethod}
              onChange={(event) => setValue("paymentMethod", event.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D]"
            >
              <option>Cash</option>
              <option>Card</option>
              <option>Bank transfer</option>
              <option>UPI</option>
            </select>
          </label>
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
              className="h-10 rounded-lg bg-[#FF8627] px-4 text-sm font-semibold text-white hover:bg-[#EF7420]"
            >
              Save Sale
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function AllSales({
  pageTitle = "Sales",
  listTitle = "All sales",
  onAdd,
}) {
  const [sales, setSales] = useState(readSales);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    customer: "",
    location: "",
    paymentStatus: "",
    paymentMethod: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "date", direction: "desc" });
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key),
  );
  const [addingSale, setAddingSale] = useState(false);
  const [actionSale, setActionSale] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredSales = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sales
      .filter((sale) => {
        const matchesSearch = Object.values(sale)
          .join(" ")
          .toLowerCase()
          .includes(query);
        return (
          matchesSearch &&
          (!appliedFilters.customer ||
            sale.customerName === appliedFilters.customer) &&
          (!appliedFilters.location ||
            sale.location === appliedFilters.location) &&
          (!appliedFilters.paymentStatus ||
            sale.paymentStatus === appliedFilters.paymentStatus) &&
          (!appliedFilters.paymentMethod ||
            sale.paymentMethod === appliedFilters.paymentMethod)
        );
      })
      .sort((first, second) => {
        const firstValue = first[sort.key] ?? "";
        const secondValue = second[sort.key] ?? "";
        const comparison = sort.key === "date"
          ? saleDateValue(firstValue) - saleDateValue(secondValue)
          : typeof firstValue === "number" && typeof secondValue === "number"
            ? firstValue - secondValue
            : String(firstValue).localeCompare(String(secondValue), undefined, {
                numeric: true,
              });
        return sort.direction === "asc" ? comparison : -comparison;
      });
  }, [appliedFilters, sales, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredSales.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const firstEntry = filteredSales.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const lastEntry = Math.min(currentPage * pageSize, filteredSales.length);
  const visibleSales = filteredSales.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const shownColumns = columns.filter((column) =>
    visibleColumns.includes(column.key),
  );
  const totals = filteredSales.reduce(
    (summary, sale) => ({
      total: summary.total + Number(sale.total || 0),
      paid: summary.paid + Number(sale.totalPaid || 0),
      due: summary.due + Number(sale.sellDue || 0),
      returnDue: summary.returnDue + Number(sale.sellReturnDue || 0),
      items: summary.items + Number(sale.totalItems || 0),
    }),
    { total: 0, paid: 0, due: 0, returnDue: 0, items: 0 },
  );

  const persistSales = (updatedSales, successMessage) => {
    try {
      businessStorage.setItem(SALES_KEY, JSON.stringify(updatedSales));
      setSales(updatedSales);
      setNotice(successMessage);
      setActionSale(null);
      return true;
    } catch (error) {
      console.error("Could not save sales:", error);
      setNotice("Changes could not be saved. Please try again.");
      return false;
    }
  };

  const addSale = (form) => {
    const total = Number(form.total) || 0;
    const totalPaid =
      form.totalPaid === "" ? (form.paymentStatus === "Paid" ? total : 0) : Number(form.totalPaid);
    const sellDue = Math.max(total - totalPaid, 0);
    const date = new Date(form.date);
    const newSale = {
      ...form,
      id: `${Date.now()}`,
      date: Number.isNaN(date.getTime())
        ? form.date
        : `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
      total,
      totalPaid,
      sellDue,
      sellReturnDue: 0,
      totalItems: Number(form.totalItems) || 0,
      shippingStatus: form.shippingStatus || "",
      sellNote: "",
      staffNote: "",
      shippingDetails: "",
    };
    const updatedSales = [newSale, ...sales];
    if (persistSales(updatedSales, "Sale added.")) {
      setPage(1);
      setAddingSale(false);
    }
  };

  const deleteSale = (id) => {
    persistSales(
      sales.filter((sale) => sale.id !== id),
      "Sale deleted.",
    );
  };

  const exportCsv = () => {
    const rows = filteredSales.map((sale) =>
      shownColumns.map((column) =>
        column.key === "action" ? "" : sale[column.key] ?? "",
      ),
    );
    const csv = `\uFEFF${[
      shownColumns.map((column) => column.label),
      ...rows,
    ]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n")}`;
    downloadFile("sales.csv", csv, "text/csv;charset=utf-8");
  };

  const exportExcel = () => {
    const header = shownColumns
      .map((column) => `<th>${escapeHtml(column.label)}</th>`)
      .join("");
    const rows = filteredSales
      .map(
        (sale) =>
          `<tr>${shownColumns
            .map(
              (column) =>
                `<td>${escapeHtml(column.key === "action" ? "" : sale[column.key])}</td>`,
            )
            .join("")}</tr>`,
      )
      .join("");
    downloadFile(
      "sales.xls",
      `<html><head><meta charset="utf-8"></head><body><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></body></html>`,
      "application/vnd.ms-excel;charset=utf-8",
    );
  };

  const toggleColumn = (key) => {
    setVisibleColumns((current) =>
      current.includes(key)
        ? current.filter((column) => column !== key)
        : [...current, key],
    );
  };

  const resetFilters = () => {
    const cleared = {
      customer: "",
      location: "",
      paymentStatus: "",
      paymentMethod: "",
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setSearch("");
    setPage(1);
  };

  return (
    <main className="min-h-[calc(100vh-62px)] flex-1 bg-[#FFFAF5] px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="mb-5 text-2xl font-semibold tracking-[-0.03em] text-[#283961]">
          {pageTitle}
        </h1>

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

        <section className="mb-5 overflow-hidden rounded-2xl border border-[#E9EEF4] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.05)]">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="flex items-center gap-2.5 text-base font-semibold text-[#438DBB]">
              <Filter size={20} fill="currentColor" />
              Filters
            </span>
            <ChevronDown
              size={18}
              className={`text-[#8190A5] transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>
          {filtersOpen && (
            <div className="border-t border-[#F1ECE6] px-5 pb-5 pt-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["customer", "Customer", "All customers"],
                  ["location", "Location", "All locations"],
                ].map(([key, label, placeholder]) => (
                  <label key={key} className="text-xs font-semibold text-[#344B70]">
                    {label}
                    <input
                      value={filters[key]}
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      placeholder={placeholder}
                      className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D]"
                    />
                  </label>
                ))}
                {[
                  ["paymentStatus", "Payment status", ["Paid", "Due", "Partial"]],
                  ["paymentMethod", "Payment method", ["Cash", "Card", "Bank transfer", "UPI"]],
                ].map(([key, label, options]) => (
                  <label key={key} className="text-xs font-semibold text-[#344B70]">
                    {label}
                    <select
                      value={filters[key]}
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D]"
                    >
                      <option value="">All {label.toLowerCase()}s</option>
                      {options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-9 rounded-lg border border-[#D7E0EB] px-4 text-xs font-medium text-[#60738D] hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedFilters(filters);
                    setPage(1);
                  }}
                  className="h-9 rounded-lg bg-[#FF8627] px-4 text-xs font-semibold text-white hover:bg-[#EF7420]"
                >
                  Apply filters
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="text-lg font-semibold text-[#F5852A]">{listTitle}</h2>
            <button
              type="button"
              onClick={() => {
                setNotice("");
                if (onAdd) {
                  onAdd();
                } else {
                  setAddingSale(true);
                }
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              <Plus size={17} />
              Add
            </button>
          </div>

          <div className="flex flex-col gap-3 px-5 pb-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
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
                <ToolButton icon={FileText} onClick={exportCsv}>Export CSV</ToolButton>
                <ToolButton icon={FileSpreadsheet} onClick={exportExcel}>Export Excel</ToolButton>
                <ToolButton icon={Printer} onClick={() => window.print()}>Print</ToolButton>
                <div className="relative">
                  <ToolButton
                    icon={Columns3}
                    onClick={() => setColumnsOpen((open) => !open)}
                    expanded={columnsOpen}
                  >
                    Column visibility
                  </ToolButton>
                  {columnsOpen && (
                    <div className="absolute left-0 top-10 z-20 max-h-72 w-56 overflow-y-auto rounded-xl border border-[#E4E9EF] bg-white p-2 shadow-lg">
                      {columns.map((column) => (
                        <label
                          key={column.key}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#526783] hover:bg-[#FFFAF5]"
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
                <ToolButton icon={FileText} onClick={() => window.print()}>Export PDF</ToolButton>
              </div>
              <label className="relative flex h-9 w-full items-center xl:w-52">
                <Search size={14} className="absolute left-3 text-[#8190A5]" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search ..."
                  aria-label="Search sales"
                  className="h-full w-full border border-[#D6DFEA] bg-white pl-8 pr-3 text-xs text-[#42546E] outline-none placeholder:text-[#98A4B5] focus:border-[#F5A15D]"
                />
              </label>
            </div>

            <div className="overflow-auto">
              <table className="w-full min-w-[1950px] border-collapse text-left text-xs text-[#202B3B]">
                <thead>
                  <tr className="text-[#273449]">
                    {shownColumns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="border border-[#ECECEC] bg-white px-2.5 py-3 font-semibold"
                      >
                        {column.key === "action" ? (
                          column.label
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setSort((current) => ({
                                key: column.key,
                                direction:
                                  current.key === column.key &&
                                  current.direction === "asc"
                                    ? "desc"
                                    : "asc",
                              }))
                            }
                            className="flex w-full items-center justify-between gap-2 text-left"
                          >
                            {column.label}
                            <ArrowDownUp size={13} className="shrink-0 text-[#C7C9CC]" />
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleSales.length ? (
                    visibleSales.map((sale, index) => (
                      <tr
                        key={sale.id ?? sale.invoiceNo}
                        className={index % 2 === 0 ? "bg-[#FAFAFA]" : "bg-white"}
                      >
                        {shownColumns.map((column) => (
                          <td
                            key={column.key}
                            className="border border-[#EEEEEE] px-2.5 py-2.5 align-top"
                          >
                            {column.key === "action" ? (
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActionSale((active) =>
                                      active === sale.id ? null : sale.id,
                                    )
                                  }
                                  aria-expanded={actionSale === sale.id}
                                  className="inline-flex items-center gap-2 rounded-md border border-[#16B9F5] px-2.5 py-1.5 text-[11px] font-medium text-[#079AD2] hover:bg-[#ECFAFF]"
                                >
                                  Actions <ChevronDown size={12} />
                                </button>
                                {actionSale === sale.id && (
                                  <div className="absolute left-0 top-9 z-20 w-32 rounded-lg border border-[#E4E9EF] bg-white p-1 shadow-lg">
                                    <button
                                      type="button"
                                      onClick={() => window.print()}
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-[#526783] hover:bg-[#FFFAF5]"
                                    >
                                      <Printer size={13} /> Print
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteSale(sale.id)}
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 size={13} /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : column.key === "paymentStatus" ? (
                              <span
                                className={`inline-flex rounded px-2 py-0.5 text-[10px] font-semibold text-white ${
                                  String(sale.paymentStatus).toLowerCase() === "paid"
                                    ? "bg-[#8ED66A]"
                                    : "bg-[#FFAC46]"
                                }`}
                              >
                                {sale.paymentStatus || "Due"}
                              </span>
                            ) : column.money ? (
                              formatCurrency(sale[column.key])
                            ) : (
                              sale[column.key] || ""
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={Math.max(shownColumns.length, 1)}
                        className="border border-[#EEEEEE] bg-[#FAFAFA] px-4 py-6 text-center text-sm text-[#536781]"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                  {visibleSales.length > 0 && (
                    <tr className="bg-[#D5D9E1] font-semibold text-[#263247]">
                      {shownColumns.map((column) => (
                        <td key={column.key} className="border border-white px-2.5 py-3">
                          {column.key === "paymentStatus"
                            ? `Paid - ${filteredSales.filter((sale) => sale.paymentStatus === "Paid").length} / Due - ${filteredSales.filter((sale) => sale.paymentStatus !== "Paid").length}`
                            : column.key === "paymentMethod"
                              ? `Cash - ${filteredSales.filter((sale) => sale.paymentMethod === "Cash").length}`
                              : column.key === "total"
                                ? formatCurrency(totals.total)
                                : column.key === "totalPaid"
                                  ? formatCurrency(totals.paid)
                                  : column.key === "sellDue"
                                    ? formatCurrency(totals.due)
                                    : column.key === "sellReturnDue"
                                      ? formatCurrency(totals.returnDue)
                                      : column.key === "totalItems"
                                        ? totals.items.toFixed(2)
                                        : ""}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 pt-1 text-xs text-[#536781] sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {firstEntry} to {lastEntry} of {filteredSales.length} entries
              </p>
              <div className="flex items-center self-end">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex h-9 items-center gap-1 rounded-l-lg border border-[#D7E0EB] px-3 text-xs text-[#60738D] hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1)
                  .slice(Math.max(0, currentPage - 2), currentPage + 1)
                  .map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      aria-current={currentPage === pageNumber ? "page" : undefined}
                      className={`h-9 min-w-8 border-y border-[#D7E0EB] px-2 text-xs ${
                        currentPage === pageNumber
                          ? "bg-[#438DBB] text-white"
                          : "text-[#60738D] hover:bg-[#FFF7EF]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  disabled={currentPage >= pageCount}
                  className="inline-flex h-9 items-center gap-1 rounded-r-lg border border-[#D7E0EB] px-3 text-xs text-[#60738D] hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-7 text-center text-xs text-[#8798AD]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3 | Copyright © 2026 All rights reserved.
        </footer>
      </div>
      {addingSale && (
        <SaleModal onClose={() => setAddingSale(false)} onSave={addSale} />
      )}
    </main>
  );
}