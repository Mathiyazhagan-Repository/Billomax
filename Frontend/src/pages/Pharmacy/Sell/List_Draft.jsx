import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Eye,
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
  getBusinessSampleQuotations,
} from "../../../utils/businessStorage.js";

const DRAFTS_KEY = "billomax-pos-drafts";
const QUOTATIONS_KEY = "billomax-pos-quotations";
const sampleQuotations = [
  { id: "quotation-0019", date: "03/09/2026", invoiceNo: "2026/0019", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 2, addedBy: "Mr pharmacy", total: 45, items: [{ id: "sample-19-a", name: "Amlodipine", quantity: 1, unitPrice: 22.5 }, { id: "sample-19-b", name: "Cetirizine 10mg", quantity: 1, unitPrice: 22.5 }] },
  { id: "quotation-0018", date: "21/08/2026", invoiceNo: "2026/0018", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 1, addedBy: "Mr pharmacy", total: 22.5, items: [{ id: "sample-18-a", name: "Amlodipine", quantity: 1, unitPrice: 22.5 }] },
  { id: "quotation-0017", date: "18/06/2026", invoiceNo: "2026/0017", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 2, addedBy: "Mr pharmacy", total: 45, items: [{ id: "sample-17-a", name: "Paracetamol 500mg", quantity: 2, unitPrice: 22.5 }] },
  { id: "quotation-0016", date: "25/05/2026", invoiceNo: "2026/0016", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 1, addedBy: "Mr pharmacy", total: 10, items: [{ id: "sample-16-a", name: "Cetirizine 10mg", quantity: 1, unitPrice: 10 }] },
  { id: "quotation-0015", date: "25/05/2026", invoiceNo: "2026/0015", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 1, addedBy: "Mr pharmacy", total: 12, items: [{ id: "sample-15-a", name: "Baby Care Cream", quantity: 1, unitPrice: 12 }] },
  { id: "quotation-0014", date: "25/05/2026", invoiceNo: "2026/0014", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 1, addedBy: "Mr pharmacy", total: 22.5, items: [{ id: "sample-14-a", name: "Vitamin C Tablets", quantity: 1, unitPrice: 22.5 }] },
  { id: "quotation-0013", date: "25/05/2026", invoiceNo: "2026/0013", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 1, addedBy: "Mr pharmacy", total: 55, items: [{ id: "sample-13-a", name: "Antiseptic Liquid", quantity: 1, unitPrice: 55 }] },
  { id: "quotation-0012", date: "24/04/2026", invoiceNo: "2026/0012", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 2, addedBy: "Mr pharmacy", total: 45, items: [{ id: "sample-12-a", name: "Amlodipine", quantity: 2, unitPrice: 22.5 }] },
  { id: "quotation-0011", date: "27/03/2026", invoiceNo: "2026/0011", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 3, addedBy: "Mr pharmacy", total: 67.5, items: [{ id: "sample-11-a", name: "Paracetamol 500mg", quantity: 3, unitPrice: 22.5 }] },
  { id: "quotation-0003", date: "11/03/2026", invoiceNo: "2026/0003", customerName: "Walk-In Customer", location: "Pharmacy", totalItems: 1, addedBy: "Mr pharmacy", total: 10, items: [{ id: "sample-03-a", name: "Cetirizine 10mg", quantity: 1, unitPrice: 10 }] },
];
const columns = [
  { key: "date", label: "Date" },
  { key: "reference", label: "Reference No" },
  { key: "customer", label: "Customer name" },
  { key: "contact", label: "Contact Number" },
  { key: "location", label: "Location" },
  { key: "items", label: "Total Items" },
  { key: "addedBy", label: "Added By" },
];

function readDrafts(storageKey) {
  try {
    const saved = businessStorage.getItem(storageKey);
    if (!saved) {
      return storageKey === QUOTATIONS_KEY
        ? getBusinessSampleQuotations(sampleQuotations)
        : [];
    }
    const drafts = JSON.parse(saved);
    if (!Array.isArray(drafts)) throw new Error(`Saved records for ${storageKey} are not in the expected format.`);
    return drafts;
  } catch (error) {
    console.error(`Could not load ${storageKey}:`, error);
    return [];
  }
}

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadCsv(rows, singular) {
  const data = [
    columns.map((column) => escapeCsv(column.label)).join(","),
    ...rows.map((draft) => columns.map((column) => escapeCsv(cellValue(draft, column.key))).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([data], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `billomax-${singular}s.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadExcel(rows, singular) {
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
  const headers = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
  const body = rows.map((draft) =>
    `<tr>${columns.map((column) => `<td>${escapeHtml(cellValue(draft, column.key))}</td>`).join("")}</tr>`,
  ).join("");
  const url = URL.createObjectURL(new Blob(
    [`<table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>`],
    { type: "application/vnd.ms-excel;charset=utf-8" },
  ));
  const link = document.createElement("a");
  link.href = url;
  link.download = `billomax-${singular}s.xls`;
  link.click();
  URL.revokeObjectURL(url);
}

function cellValue(draft, key) {
  if (key === "reference") return draft.invoiceNo || String(draft.id || "").slice(-6) || "—";
  if (key === "customer") return draft.customerName || draft.customer || "Walk-In Customer";
  if (key === "contact") return draft.contactNumber || "—";
  if (key === "items") return Number(draft.totalItems ?? draft.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ?? 0).toFixed(2);
  if (key === "addedBy") return draft.addedBy || getActiveBusinessStorage().toLowerCase();
  if (key === "location") return draft.location || getActiveBusinessStorage();
  return draft.date || "—";
}

function draftDateValue(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(value ?? ""));
  if (match) return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])).getTime();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function ToolButton({ icon: Icon, children, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition ${
        active
          ? "border-[#F5A15D] bg-[#FFF7EF] text-[#D96D20]"
          : "border-[#D7E0EB] bg-white text-[#71839A] hover:border-[#F5A15D] hover:text-[#E87928]"
      }`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function DraftDetails({ draft, onClose, mode }) {
  const items = Array.isArray(draft.items) ? draft.items : [];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172D45]/40 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="draft-details-title" className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl border border-[#F0EAE3] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F1ECE6] px-5 py-4">
          <div>
            <h2 id="draft-details-title" className="text-lg font-semibold text-[#283961]">{mode} details</h2>
            <p className="mt-1 text-xs text-[#8798AD]">Reference {cellValue(draft, "reference")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close details" className="rounded-lg p-2 text-[#71809A] hover:bg-[#FFF3E8] hover:text-[#E87928]"><X size={18} /></button>
        </div>
        <div className="grid gap-3 p-5 text-sm sm:grid-cols-2">
          <p><span className="text-[#8798AD]">Customer:</span> <strong className="text-[#344B70]">{cellValue(draft, "customer")}</strong></p>
          <p><span className="text-[#8798AD]">Location:</span> <strong className="text-[#344B70]">{cellValue(draft, "location")}</strong></p>
          <p><span className="text-[#8798AD]">Date:</span> <strong className="text-[#344B70]">{cellValue(draft, "date")}</strong></p>
          <p><span className="text-[#8798AD]">Total items:</span> <strong className="text-[#344B70]">{cellValue(draft, "items")}</strong></p>
        </div>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead><tr className="bg-[#FFF7EF] text-[#19366F]"><th className="px-3 py-2.5">Product</th><th className="px-3 py-2.5 text-right">Quantity</th><th className="px-3 py-2.5 text-right">Unit price</th></tr></thead>
            <tbody>
              {items.map((item, index) => <tr key={item.id ?? `${item.name}-${index}`} className="border-b border-[#F2E8DE] even:bg-[#FFFCF8]">
                <td className="px-3 py-2.5 font-medium text-[#344B70]">{item.name || "Product"}</td>
                <td className="px-3 py-2.5 text-right text-[#536985]">{Number(item.quantity || 0).toFixed(2)}</td>
                <td className="px-3 py-2.5 text-right text-[#536985]">₹ {Number(item.unitPrice || 0).toFixed(2)}</td>
              </tr>)}
              {!items.length && <tr><td colSpan={3} className="px-3 py-6 text-center text-[#8798AD]">No product details were saved for this draft.</td></tr>}
            </tbody>
            <tfoot><tr className="bg-[#FFF1E5] font-semibold text-[#10234F]"><td colSpan={2} className="px-3 py-3 text-right">Total</td><td className="px-3 py-3 text-right">₹ {Number(draft.total || 0).toFixed(2)}</td></tr></tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function ListDraft({ onNavigate, mode = "Draft" }) {
  const isQuotation = mode === "Quotation";
  const storageKey = isQuotation ? QUOTATIONS_KEY : DRAFTS_KEY;
  const singular = mode.toLowerCase();
  const plural = isQuotation ? "Quotations" : "Drafts";
  const addPage = isQuotation ? "Add Quotation" : "Add Draft";
  const [drafts, setDrafts] = useState(() => readDrafts(storageKey));
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(columns.map((column) => column.key));
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [activeDraft, setActiveDraft] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredDrafts = useMemo(() => drafts.filter((draft) => {
    const query = search.trim().toLowerCase();
    const searchable = [
      cellValue(draft, "reference"),
      cellValue(draft, "customer"),
      cellValue(draft, "contact"),
      cellValue(draft, "location"),
      cellValue(draft, "addedBy"),
    ].join(" ").toLowerCase();
    const draftDate = draftDateValue(draft.date);
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
    const inRange = (!from || (draftDate > 0 && draftDate >= from.getTime())) &&
      (!to || (draftDate > 0 && draftDate <= to.getTime()));
    return (!query || searchable.includes(query)) &&
      (!customerFilter || cellValue(draft, "customer") === customerFilter) && inRange;
  }), [customerFilter, dateFrom, dateTo, drafts, search]);
  const pages = Math.max(1, Math.ceil(filteredDrafts.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visibleDrafts = filteredDrafts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const customers = [...new Set(drafts.map((draft) => cellValue(draft, "customer")))];

  const removeDraft = (draft) => {
    const next = drafts.filter((item) => String(item.id) !== String(draft.id));
    try {
      businessStorage.setItem(storageKey, JSON.stringify(next));
      setDrafts(next);
      setActionId(null);
      setNotice(`${singular} removed.`);
    } catch (error) {
      console.error(`Could not remove ${singular}:`, error);
      setNotice(`${mode} could not be removed. Please try again.`);
    }
  };

  return (
    <main className="min-h-[calc(100vh-62px)] flex-1 bg-[#FFFAF5] px-3 py-5 sm:px-5 lg:px-7">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#283961]">{plural}</h1>
          <p className="mt-1 text-xs text-[#8798AD]">Review and manage saved sale {plural.toLowerCase()}.</p>
        </div>
        <button type="button" onClick={() => onNavigate?.(addPage)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF711A] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#EF5F0F]">
          <Plus size={16} /> Add {singular}
        </button>
      </header>

      <section className="mb-3 overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_7px_24px_rgba(40,57,97,0.06)]">
        <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-[#D96D20] hover:bg-[#FFFCF8]">
          <Filter size={16} /> Filters <ChevronDown size={15} className={`ml-auto transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>
        {filtersOpen && <div className="grid gap-3 border-t border-[#F2E8DE] p-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-semibold text-[#344B70]">Date from<input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal outline-none focus:border-[#F5A15D]" /></label>
          <label className="text-xs font-semibold text-[#344B70]">Date to<input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal outline-none focus:border-[#F5A15D]" /></label>
          <label className="text-xs font-semibold text-[#344B70]">Customer<select value={customerFilter} onChange={(event) => { setCustomerFilter(event.target.value); setPage(1); }} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal outline-none focus:border-[#F5A15D]"><option value="">All customers</option>{customers.map((customer) => <option key={customer}>{customer}</option>)}</select></label>
          <div className="flex items-end"><button type="button" onClick={() => { setDateFrom(""); setDateTo(""); setCustomerFilter(""); setPage(1); }} className="h-10 rounded-lg border border-[#E6D8CA] px-4 text-xs font-semibold text-[#526783] hover:bg-[#FFF7EF]">Clear filters</button></div>
        </div>}
      </section>

      <section className="rounded-2xl border border-[#F0EAE3] bg-white p-3 shadow-[0_7px_24px_rgba(40,57,97,0.06)] sm:p-5">
        {notice && <div role="status" className="mb-3 rounded-lg border border-[#F2D2C9] bg-[#FFF7F4] px-3 py-2 text-xs text-[#A5412E]">{notice}</div>}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-[#536985]">
            Show
            <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="h-9 rounded-lg border border-[#D6DFEA] bg-white px-2 text-xs text-[#344B70]">
              {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
            entries
          </label>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-1.5">
            <ToolButton icon={FileSpreadsheet} onClick={() => downloadCsv(filteredDrafts, singular)}>Export CSV</ToolButton>
            <ToolButton icon={FileText} onClick={() => downloadExcel(filteredDrafts, singular)}>Export Excel</ToolButton>
            <ToolButton icon={Printer} onClick={() => window.print()}>Print</ToolButton>
            <div className="relative">
              <ToolButton icon={Columns3} onClick={() => setColumnsOpen((open) => !open)} active={columnsOpen}>Column visibility</ToolButton>
              {columnsOpen && <div className="absolute right-0 top-10 z-20 min-w-44 rounded-xl border border-[#E4E9EF] bg-white p-2 shadow-xl">
                {columns.map((column) => <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#536985] hover:bg-[#FFF7EF]"><input type="checkbox" checked={visibleColumns.includes(column.key)} onChange={(event) => setVisibleColumns((current) => event.target.checked ? [...current, column.key] : current.filter((key) => key !== column.key))} className="accent-[#FF711A]" />{column.label}</label>)}
              </div>}
            </div>
            <ToolButton icon={FileText} onClick={() => window.print()}>Export PDF</ToolButton>
          </div>
          <label className="relative w-full sm:w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]" />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={`Search ${plural.toLowerCase()}...`} className="h-9 w-full rounded-lg border border-[#D6DFEA] pl-9 pr-3 text-xs text-[#344B70] outline-none focus:border-[#F5A15D]" />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-xs">
            <thead><tr className="border-y border-[#F2E8DE] bg-[#FFF7EF] text-[#19366F]">
              {visibleColumns.map((key) => <th key={key} className="whitespace-nowrap px-3 py-3 font-semibold">{columns.find((column) => column.key === key)?.label}</th>)}
              <th className="w-28 px-3 py-3 font-semibold">Action</th>
            </tr></thead>
            <tbody>
              {visibleDrafts.map((draft) => <tr key={draft.id} className="border-b border-[#F2E8DE] text-[#344B70] even:bg-[#FFFCF8] hover:bg-[#FFF7EF]">
                {visibleColumns.map((key) => <td key={key} className="whitespace-nowrap px-3 py-3">{cellValue(draft, key)}</td>)}
                <td className="relative px-3 py-2">
                  <button type="button" aria-expanded={actionId === draft.id} onClick={() => setActionId((current) => current === draft.id ? null : draft.id)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#F5A15D] bg-white px-2.5 text-[11px] font-semibold text-[#D96D20] hover:bg-[#FFF1E5]">
                    Actions <ChevronDown size={13} />
                  </button>
                  {actionId === draft.id && <div className="absolute right-3 top-10 z-20 min-w-36 rounded-xl border border-[#E4E9EF] bg-white p-1 shadow-xl">
                    <button type="button" onClick={() => { setActiveDraft(draft); setActionId(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#536985] hover:bg-[#FFF7EF]"><Eye size={14} /> View details</button>
                    <button type="button" onClick={() => removeDraft(draft)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#A5412E] hover:bg-[#FFF3F0]"><Trash2 size={14} /> Delete {singular}</button>
                  </div>}
                </td>
              </tr>)}
              {!visibleDrafts.length && <tr><td colSpan={visibleColumns.length + 1} className="px-4 py-12 text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center">
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#D96D20]"><FileText size={20} /></span>
                  <p className="text-sm font-semibold text-[#344B70]">{drafts.length ? `No ${plural.toLowerCase()} match your search or filters` : `No saved ${plural.toLowerCase()} yet`}</p>
                  <p className="mt-1 text-xs text-[#8798AD]">{drafts.length ? "Try changing your filters or search terms." : `Create a ${singular} and it will appear here.`}</p>
                  {!drafts.length && <button type="button" onClick={() => onNavigate?.(addPage)} className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#FF711A] px-3 text-xs font-semibold text-white hover:bg-[#EF5F0F]"><Plus size={14} /> Add {singular}</button>}
                </div>
              </td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#60738D]">
          <span>Showing {filteredDrafts.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredDrafts.length)} of {filteredDrafts.length} entries</span>
          <nav aria-label="Draft list pagination" className="flex items-center gap-1">
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 disabled:opacity-45"><ChevronLeft size={14} /> Previous</button>
            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#FF711A] px-2 text-white">{currentPage}</span>
            <button type="button" disabled={currentPage >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 disabled:opacity-45">Next <ChevronRight size={14} /></button>
          </nav>
        </div>
      </section>
      {activeDraft && <DraftDetails draft={activeDraft} mode={singular} onClose={() => setActiveDraft(null)} />}
    </main>
  );
}