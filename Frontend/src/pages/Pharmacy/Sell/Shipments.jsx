import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  FileSpreadsheet,
  FileText,
  Filter,
  Printer,
  Search,
} from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleSales,
} from "../../../utils/businessStorage.js";

const SALES_KEY = "billomax-sales";
const columns = [
  { key: "date", label: "Date" },
  { key: "invoiceNo", label: "Invoice No." },
  { key: "customer", label: "Customer name" },
  { key: "contact", label: "Contact Number" },
  { key: "location", label: "Location" },
  { key: "deliveryPerson", label: "Delivery Person" },
  { key: "shippingStatus", label: "Shipping Status" },
  { key: "paymentStatus", label: "Payment Status" },
];

function readShipments() {
  try {
    const stored = businessStorage.getItem(SALES_KEY);
    if (!stored) return getBusinessSampleSales().filter((sale) => sale.shippingStatus);
    const sales = JSON.parse(stored);
    if (!Array.isArray(sales)) throw new Error("Saved sales are not in the expected format.");
    return sales
      .filter((sale) => sale.shippingStatus || sale.shippingDetails || sale.shippingAddress)
      .map((sale) => ({
        id: sale.id,
        date: sale.date || "—",
        invoiceNo: sale.invoiceNo || "—",
        customer: sale.customerName || sale.customer || "Walk-In Customer",
        contact: sale.contactNumber || "—",
        location: sale.location || getActiveBusinessStorage(),
        deliveryPerson: sale.deliveryPerson || sale.deliveredTo || "—",
        shippingStatus: sale.shippingStatus || "Pending",
        paymentStatus: sale.paymentStatus || "Due",
      }));
  } catch (error) {
    console.error("Could not load shipments:", error);
    return [];
  }
}

function dateValue(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(value ?? ""));
  if (match) return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])).getTime();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function downloadCsv(rows, shownColumns) {
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const content = [
    shownColumns.map((column) => escape(column.label)).join(","),
    ...rows.map((row) => shownColumns.map((column) => escape(row[column.key])).join(",")),
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "shipments.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function downloadExcel(rows, shownColumns) {
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const headings = shownColumns.map((column) => `<th>${escape(column.label)}</th>`).join("");
  const body = rows.map((row) => `<tr>${shownColumns.map((column) => `<td>${escape(row[column.key])}</td>`).join("")}</tr>`).join("");
  const url = URL.createObjectURL(new Blob(
    [`<html><head><meta charset="utf-8"></head><body><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table></body></html>`],
    { type: "application/vnd.ms-excel;charset=utf-8" },
  ));
  const link = document.createElement("a");
  link.href = url;
  link.download = "shipments.xls";
  link.click();
  URL.revokeObjectURL(url);
}

function ToolButton({ icon: Icon, children, onClick, active }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition ${active ? "border-[#F5A15D] bg-[#FFF7EF] text-[#D96D20]" : "border-[#D7E0EB] bg-white text-[#71839A] hover:border-[#F5A15D] hover:text-[#E87928]"}`}>
      <Icon size={14} /> {children}
    </button>
  );
}

export default function Shipments() {
  const [shipments] = useState(readShipments);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [shippingFilter, setShippingFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(columns.map((column) => column.key));
  const [columnsOpen, setColumnsOpen] = useState(false);

  const filteredShipments = useMemo(() => shipments.filter((shipment) => {
    const query = search.trim().toLowerCase();
    const searchable = [shipment.invoiceNo, shipment.customer, shipment.contact, shipment.location, shipment.deliveryPerson, shipment.shippingStatus, shipment.paymentStatus].join(" ").toLowerCase();
    const timestamp = dateValue(shipment.date);
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;
    return (!query || searchable.includes(query)) &&
      (!locationFilter || shipment.location === locationFilter) &&
      (!shippingFilter || shipment.shippingStatus === shippingFilter) &&
      (!paymentFilter || shipment.paymentStatus === paymentFilter) &&
      (from === null || (timestamp > 0 && timestamp >= from)) &&
      (to === null || (timestamp > 0 && timestamp <= to));
  }), [dateFrom, dateTo, locationFilter, paymentFilter, search, shipments, shippingFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredShipments.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleShipments = filteredShipments.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const shownColumns = columns.filter((column) => visibleColumns.includes(column.key));
  const locations = [...new Set(shipments.map((shipment) => shipment.location).filter(Boolean))];
  const shippingStatuses = [...new Set(shipments.map((shipment) => shipment.shippingStatus).filter(Boolean))];
  const paymentStatuses = [...new Set(shipments.map((shipment) => shipment.paymentStatus).filter(Boolean))];

  return (
    <main className="min-h-[calc(100vh-62px)] flex-1 bg-[#FFFAF5] px-3 py-5 sm:px-5 lg:px-7">
      <h1 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-[#283961]">Shipments</h1>
      <section className="mb-4 overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_7px_24px_rgba(40,57,97,0.06)]">
        <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-[#D96D20] hover:bg-[#FFFCF8]">
          <Filter size={16} /> Filters <ChevronDown size={15} className={`ml-auto transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>
        {filtersOpen && <div className="grid gap-3 border-t border-[#F2E8DE] p-4 sm:grid-cols-2 xl:grid-cols-5">
          <label className="text-xs font-semibold text-[#344B70]">Date from<input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal outline-none focus:border-[#F5A15D]" /></label>
          <label className="text-xs font-semibold text-[#344B70]">Date to<input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal outline-none focus:border-[#F5A15D]" /></label>
          <label className="text-xs font-semibold text-[#344B70]">Location<select value={locationFilter} onChange={(event) => { setLocationFilter(event.target.value); setPage(1); }} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal outline-none focus:border-[#F5A15D]"><option value="">All locations</option>{locations.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-xs font-semibold text-[#344B70]">Shipping status<select value={shippingFilter} onChange={(event) => { setShippingFilter(event.target.value); setPage(1); }} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal outline-none focus:border-[#F5A15D]"><option value="">All statuses</option>{shippingStatuses.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-xs font-semibold text-[#344B70]">Payment status<select value={paymentFilter} onChange={(event) => { setPaymentFilter(event.target.value); setPage(1); }} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal outline-none focus:border-[#F5A15D]"><option value="">All statuses</option>{paymentStatuses.map((value) => <option key={value}>{value}</option>)}</select></label>
          <button type="button" onClick={() => { setDateFrom(""); setDateTo(""); setLocationFilter(""); setShippingFilter(""); setPaymentFilter(""); setSearch(""); setPage(1); }} className="h-10 w-fit self-end rounded-lg border border-[#E6D8CA] px-4 text-xs font-semibold text-[#526783] hover:bg-[#FFF7EF]">Clear filters</button>
        </div>}
      </section>

      <section className="rounded-2xl border border-[#F0EAE3] bg-white p-3 shadow-[0_7px_24px_rgba(40,57,97,0.06)] sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-[#536985]">Show
            <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="h-9 rounded-lg border border-[#D6DFEA] bg-white px-2 text-xs text-[#344B70]">{[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}</select>
            entries
          </label>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-1.5">
            <ToolButton icon={FileSpreadsheet} onClick={() => downloadCsv(filteredShipments, shownColumns)}>Export CSV</ToolButton>
            <ToolButton icon={FileText} onClick={() => downloadExcel(filteredShipments, shownColumns)}>Export Excel</ToolButton>
            <ToolButton icon={Printer} onClick={() => window.print()}>Print</ToolButton>
            <div className="relative">
              <ToolButton icon={Columns3} onClick={() => setColumnsOpen((open) => !open)} active={columnsOpen}>Column visibility</ToolButton>
              {columnsOpen && <div className="absolute left-0 top-10 z-20 min-w-48 rounded-xl border border-[#E4E9EF] bg-white p-2 shadow-xl">{columns.map((column) => <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[#536985] hover:bg-[#FFF7EF]"><input type="checkbox" checked={visibleColumns.includes(column.key)} onChange={(event) => setVisibleColumns((current) => event.target.checked ? [...current, column.key] : current.filter((key) => key !== column.key))} className="accent-[#FF711A]" />{column.label}</label>)}</div>}
            </div>
            <ToolButton icon={FileText} onClick={() => window.print()}>Export PDF</ToolButton>
          </div>
          <label className="relative w-full sm:w-44"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search..." className="h-9 w-full rounded-lg border border-[#D6DFEA] pl-9 pr-3 text-xs text-[#344B70] outline-none focus:border-[#F5A15D]" /></label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
            <thead><tr className="border-y border-[#F2E8DE] bg-[#FFF7EF] text-[#19366F]"><th className="w-20 px-3 py-3 font-semibold">Action</th>{shownColumns.map((column) => <th key={column.key} className="whitespace-nowrap px-3 py-3 font-semibold">{column.label}</th>)}</tr></thead>
            <tbody>
              {visibleShipments.map((shipment) => <tr key={shipment.id} className="border-b border-[#F2E8DE] text-[#344B70] even:bg-[#FFFCF8] hover:bg-[#FFF7EF]"><td className="px-3 py-3 text-[#8798AD]">—</td>{shownColumns.map((column) => <td key={column.key} className="whitespace-nowrap px-3 py-3">{shipment[column.key] || "—"}</td>)}</tr>)}
              {!visibleShipments.length && <tr><td colSpan={shownColumns.length + 1} className="px-4 py-5 text-center text-sm text-[#536985]">{shipments.length ? "No shipments match the selected filters." : "No data available in table"}</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#60738D]">
          <span>Showing {filteredShipments.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredShipments.length)} of {filteredShipments.length} entries</span>
          <nav aria-label="Shipments pagination" className="flex items-center gap-1">
            <button type="button" disabled={currentPage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 disabled:opacity-45"><ChevronLeft size={14} /> Previous</button>
            {filteredShipments.length > 0 && <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#FF711A] px-2 text-white">{currentPage}</span>}
            <button type="button" disabled={currentPage >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 disabled:opacity-45">Next <ChevronRight size={14} /></button>
          </nav>
        </div>
      </section>
    </main>
  );
}