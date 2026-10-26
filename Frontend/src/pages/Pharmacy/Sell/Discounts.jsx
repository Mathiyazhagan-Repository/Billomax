import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Columns3,
  FileSpreadsheet,
  FileText,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleDiscounts,
} from "../../../utils/businessStorage.js";

const DISCOUNTS_KEY = "billomax-sales-discounts";
const columns = [
  { key: "name", label: "Name" },
  { key: "startsAt", label: "Starts At" },
  { key: "endsAt", label: "Ends At" },
  { key: "amount", label: "Discount Amount" },
  { key: "priority", label: "Priority" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "products", label: "Products" },
  { key: "location", label: "Location" },
];

const sampleDiscounts = [
  {
    id: "discount-001",
    name: "hdeekha",
    startsAt: "01/01/2025 17:06",
    endsAt: "11/01/2025 17:06",
    amount: "36.00",
    type: "Fixed",
    priority: 3,
    brand: "",
    category: "",
    products: "Amlodipine (SKU1325)",
    location: "Pharmacy",
    active: true,
  },
  {
    id: "discount-002",
    name: "komya",
    startsAt: "09/01/2025 17:05",
    endsAt: "03/01/2025 17:05",
    amount: "13.00",
    type: "Percentage",
    priority: 1,
    brand: "",
    category: "",
    products: "hair transplant (sku135)",
    location: "Pharmacy",
    active: true,
  },
];

function toDateTimeInput(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/.exec(String(value || ""));
  if (match) return `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}`;
  return value || "";
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

function readDiscounts() {
  try {
    const stored = businessStorage.getItem(DISCOUNTS_KEY);
    if (!stored) return getBusinessSampleDiscounts(sampleDiscounts);
    const discounts = JSON.parse(stored);
    if (!Array.isArray(discounts)) throw new Error("Saved discounts are not in the expected format.");
    return discounts;
  } catch (error) {
    console.error("Could not load discounts:", error);
    return getBusinessSampleDiscounts(sampleDiscounts);
  }
}

function saveDiscounts(discounts) {
  try {
    businessStorage.setItem(DISCOUNTS_KEY, JSON.stringify(discounts));
    return true;
  } catch (error) {
    console.error("Could not save discounts:", error);
    return false;
  }
}

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadCsv(rows) {
  const visible = columns;
  const content = [
    ["Name", ...visible.slice(1).map((column) => column.label), "Active"].map(escapeCsv).join(","),
    ...rows.map((row) => [row.name, ...visible.slice(1).map((column) => row[column.key]), row.active ? "Yes" : "No"].map(escapeCsv).join(",")),
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "discounts.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function downloadExcel(rows) {
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const headers = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
  const body = rows.map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(row[column.key])}</td>`).join("")}</tr>`).join("");
  const url = URL.createObjectURL(new Blob(
    [`<html><head><meta charset="utf-8"></head><body><table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table></body></html>`],
    { type: "application/vnd.ms-excel;charset=utf-8" },
  ));
  const link = document.createElement("a");
  link.href = url;
  link.download = "discounts.xls";
  link.click();
  URL.revokeObjectURL(url);
}

function DiscountForm({ discount, onClose, onSave }) {
  const [form, setForm] = useState(() => discount ? {
    ...discount,
    startsAt: toDateTimeInput(discount.startsAt),
    endsAt: toDateTimeInput(discount.endsAt),
  } : {
    name: "",
    startsAt: "",
    endsAt: "",
    amount: "",
    type: "Percentage",
    priority: "1",
    brand: "",
    category: "",
    products: "",
    location: getActiveBusinessStorage(),
    active: true,
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172D45]/40 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="discount-form-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#F0EAE3] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F1ECE6] px-5 py-4">
          <h2 id="discount-form-title" className="text-lg font-semibold text-[#283961]">{discount ? "Edit discount" : "Add discount"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-[#71809A] hover:bg-[#FFF3E8] hover:text-[#E87928]"><X size={18} /></button>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="grid gap-4 p-5 sm:grid-cols-2">
          {[
            ["name", "Name", "text"],
            ["startsAt", "Starts at", "datetime-local"],
            ["endsAt", "Ends at", "datetime-local"],
            ["amount", "Discount amount", "number"],
            ["priority", "Priority", "number"],
            ["brand", "Brand", "text"],
            ["category", "Category", "text"],
            ["products", "Products", "text"],
            ["location", "Location", "text"],
          ].map(([key, label, type]) => (
            <label key={key} className="text-xs font-semibold text-[#344B70]">
              {label}
              <input required={["name", "amount"].includes(key)} type={type} min={type === "number" ? "0" : undefined} step={key === "amount" ? "0.01" : undefined} value={form[key] ?? ""} onChange={(event) => update(key, event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10" />
            </label>
          ))}
          <label className="text-xs font-semibold text-[#344B70]">
            Discount type
            <select value={form.type || "Percentage"} onChange={(event) => update("type", event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536781] outline-none focus:border-[#F5A15D]">
              <option>Percentage</option><option>Fixed</option>
            </select>
          </label>
          <div className="flex items-end justify-end gap-2 sm:col-span-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#E6D8CA] px-4 text-xs font-semibold text-[#526783] hover:bg-[#FFF7EF]">Cancel</button>
            <button type="submit" className="h-10 rounded-lg bg-[#FF711A] px-5 text-xs font-semibold text-white hover:bg-[#EF5F0F]">{discount ? "Save changes" : "Add discount"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ToolButton({ icon: Icon, children, onClick, active }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition ${active ? "border-[#F5A15D] bg-[#FFF7EF] text-[#D96D20]" : "border-[#D7E0EB] bg-white text-[#71839A] hover:border-[#F5A15D] hover:text-[#E87928]"}`}>
      <Icon size={14} /> {children}
    </button>
  );
}

export default function Discounts() {
  const [discounts, setDiscounts] = useState(readDiscounts);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns.map((column) => column.key));
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredDiscounts = useMemo(() => discounts.filter((discount) =>
    [
      discount.name,
      discount.startsAt,
      discount.endsAt,
      discount.amount,
      discount.type,
      discount.priority,
      discount.brand,
      discount.category,
      discount.products,
      discount.location,
    ].join(" ").toLowerCase().includes(search.trim().toLowerCase()),
  ), [discounts, search]);
  const pageCount = Math.max(1, Math.ceil(filteredDiscounts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleDiscounts = filteredDiscounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allVisibleSelected = visibleDiscounts.length > 0 && visibleDiscounts.every((discount) => selectedIds.includes(discount.id));
  const shownColumns = columns.filter((column) => visibleColumns.includes(column.key));

  const persist = (next, successMessage) => {
    if (saveDiscounts(next)) {
      setDiscounts(next);
      setNotice(successMessage);
      return true;
    }
    setNotice("Changes could not be saved. Please try again.");
    return false;
  };

  const saveDiscount = (form) => {
    const next = editingDiscount
      ? discounts.map((discount) => discount.id === editingDiscount.id ? { ...form, id: discount.id, active: discount.active } : discount)
      : [{ ...form, id: `${Date.now()}`, active: true }, ...discounts];
    if (persist(next, editingDiscount ? "Discount updated." : "Discount added.")) {
      setFormOpen(false);
      setEditingDiscount(null);
      setPage(1);
    }
  };

  const deleteDiscount = (discount) => {
    if (persist(discounts.filter((item) => item.id !== discount.id), "Discount deleted.")) {
      setSelectedIds((current) => current.filter((id) => id !== discount.id));
    }
  };

  const deactivateSelected = () => {
    if (!selectedIds.length) {
      setNotice("Select at least one discount first.");
      return;
    }
    if (persist(discounts.map((discount) => selectedIds.includes(discount.id) ? { ...discount, active: false } : discount), "Selected discounts deactivated.")) {
      setSelectedIds([]);
    }
  };

  const toggleSelection = (id) => setSelectedIds((current) =>
    current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
  );

  return (
    <main className="min-h-[calc(100vh-62px)] flex-1 bg-[#FFFAF5] px-3 py-5 sm:px-5 lg:px-7">
      <h1 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-[#283961]">Discount</h1>
      <section className="rounded-2xl border border-[#F0EAE3] bg-white p-3 shadow-[0_7px_24px_rgba(40,57,97,0.06)] sm:p-5">
        <div className="mb-4 flex justify-end">
          <button type="button" onClick={() => { setEditingDiscount(null); setFormOpen(true); }} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF711A] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#EF5F0F]">
            <Plus size={16} /> Add
          </button>
        </div>
        {notice && <div role="status" className="mb-3 rounded-lg border border-[#F2D2C9] bg-[#FFF7F4] px-3 py-2 text-xs text-[#A5412E]">{notice}</div>}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-[#536985]">Show
            <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="h-9 rounded-lg border border-[#D6DFEA] bg-white px-2 text-xs text-[#344B70]">{[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}</select>
            entries
          </label>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-1.5">
            <ToolButton icon={FileSpreadsheet} onClick={() => downloadCsv(filteredDiscounts)}>Export CSV</ToolButton>
            <ToolButton icon={FileText} onClick={() => downloadExcel(filteredDiscounts)}>Export Excel</ToolButton>
            <ToolButton icon={Printer} onClick={() => window.print()}>Print</ToolButton>
            <div className="relative">
              <ToolButton icon={Columns3} onClick={() => setColumnsOpen((open) => !open)} active={columnsOpen}>Column visibility</ToolButton>
              {columnsOpen && <div className="absolute left-0 top-10 z-20 min-w-44 rounded-xl border border-[#E4E9EF] bg-white p-2 shadow-xl">{columns.map((column) => <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#536985] hover:bg-[#FFF7EF]"><input type="checkbox" checked={visibleColumns.includes(column.key)} onChange={(event) => setVisibleColumns((current) => event.target.checked ? [...current, column.key] : current.filter((key) => key !== column.key))} className="accent-[#FF711A]" />{column.label}</label>)}</div>}
            </div>
            <ToolButton icon={FileText} onClick={() => window.print()}>Export PDF</ToolButton>
          </div>
          <label className="relative w-full sm:w-44"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search..." className="h-9 w-full rounded-lg border border-[#D6DFEA] pl-9 pr-3 text-xs text-[#344B70] outline-none focus:border-[#F5A15D]" /></label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
            <thead><tr className="border-y border-[#F2E8DE] bg-[#FFF7EF] text-[#19366F]">
              <th className="w-9 px-2 py-3"><input type="checkbox" aria-label="Select visible discounts" checked={allVisibleSelected} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...new Set([...current, ...visibleDiscounts.map((item) => item.id)])] : current.filter((id) => !visibleDiscounts.some((item) => item.id === id)))} className="accent-[#FF711A]" /></th>
              {shownColumns.map((column) => <th key={column.key} className="whitespace-nowrap px-3 py-3 font-semibold">{column.label}</th>)}
              <th className="w-36 px-3 py-3 font-semibold">Action</th>
            </tr></thead>
            <tbody>
              {visibleDiscounts.map((discount) => <tr key={discount.id} className={`border-b border-[#F2E8DE] text-[#344B70] even:bg-[#FFFCF8] hover:bg-[#FFF7EF] ${discount.active === false ? "opacity-55" : ""}`}>
                <td className="px-2 py-3"><input type="checkbox" aria-label={`Select ${discount.name}`} checked={selectedIds.includes(discount.id)} onChange={() => toggleSelection(discount.id)} className="accent-[#FF711A]" /></td>
                {shownColumns.map((column) => <td key={column.key} className="px-3 py-3">
                  {["startsAt", "endsAt"].includes(column.key)
                    ? formatDateTime(discount[column.key])
                    : column.key === "products" && discount[column.key]
                    ? <span className="inline-flex rounded bg-[#438BC0] px-2 py-0.5 text-[10px] font-semibold text-white">{discount[column.key]}</span>
                    : column.key === "amount"
                      ? `${discount.amount}${discount.type === "Percentage" ? " %" : ""}`
                      : discount[column.key] || "—"}
                </td>)}
                <td className="px-3 py-2">
                  <div className="flex flex-col items-start gap-1">
                    <button type="button" onClick={() => { setEditingDiscount(discount); setFormOpen(true); }} className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-[#A9A7FF] px-2.5 text-[11px] font-semibold text-[#6965D8] hover:bg-[#F5F4FF]"><Pencil size={12} /> Edit</button>
                    <button type="button" onClick={() => deleteDiscount(discount)} className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-[#FF9C9C] px-2.5 text-[11px] font-semibold text-[#E15C5C] hover:bg-[#FFF3F0]"><Trash2 size={12} /> Delete</button>
                  </div>
                </td>
              </tr>)}
              {!visibleDiscounts.length && <tr><td colSpan={shownColumns.length + 2} className="px-4 py-7 text-center text-sm text-[#536985]">No data available in table</td></tr>}
              <tr className="border-t border-[#F2E8DE] bg-white"><td colSpan={shownColumns.length + 2} className="px-2 py-2.5"><button type="button" onClick={deactivateSelected} className="rounded-lg bg-[#FFB900] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#E6A700]">Deactivate Selected</button></td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#60738D]">
          <span>Showing {filteredDiscounts.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredDiscounts.length)} of {filteredDiscounts.length} entries</span>
          <nav aria-label="Discount pagination" className="flex items-center gap-1">
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 disabled:opacity-45"><ChevronLeft size={14} /> Previous</button>
            {filteredDiscounts.length > 0 && <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#FF711A] px-2 text-white">{currentPage}</span>}
            <button type="button" disabled={currentPage >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 disabled:opacity-45">Next <ChevronRight size={14} /></button>
          </nav>
        </div>
      </section>
      {formOpen && <DiscountForm discount={editingDiscount} onClose={() => { setFormOpen(false); setEditingDiscount(null); }} onSave={saveDiscount} />}
    </main>
  );
}