import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  Check,
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleProducts,
} from "../../../utils/businessStorage.js";

const SALES_KEY = "billomax-sales";
const IMPORTS_KEY = "billomax-sales-import-history";
const fields = [
  { name: "Invoice No.", instruction: "Rows with the same invoice number are grouped into one sale." },
  { name: "Customer name", instruction: "Customer name. Leave blank to use Walk-In Customer." },
  { name: "Customer Phone number", instruction: "Phone or email is required for customers other than Walk-In Customer." },
  { name: "Customer Email", instruction: "Either customer email or phone number is required." },
  { name: "Sale Date", instruction: 'Use "Y-m-d H:i:s", for example 2026-07-15 17:45:32.' },
  { name: "Product Name", instruction: "Product name or product SKU/Code is required." },
  { name: "Product SKU/Code", instruction: "Product name or product SKU/Code is required." },
  { name: "Quantity", instruction: "Required; enter a positive number." },
  { name: "Product Unit", instruction: "Optional unit, for example piece or strip." },
  { name: "Unit Price", instruction: "Optional selling price; defaults to 0 when blank." },
  { name: "Item Tax", instruction: "Optional item tax amount." },
  { name: "Item Discount", instruction: "Optional item discount amount." },
  { name: "Item Description", instruction: "Optional product line description." },
  { name: "Order Total", instruction: "Optional sale total. If blank, calculated from imported lines." },
];
const headers = fields.map(({ name }) => name);

function escapeCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
      if (character === "\r" && text[index + 1] === "\n") index += 1;
    } else {
      value += character;
    }
  }
  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function downloadTemplate(product) {
  const item = product || {
    name: "Sample product",
    sku: "SKU-001",
    unit: "piece",
    sellingPrice: 0,
  };
  const unitPrice = Number(item.sellingPrice || 0);
  const example = [
    `${getActiveBusinessStorage().slice(0, 3).toUpperCase()}-1001`,
    "Walk-In Customer",
    "", "", "2026-10-26 10:30:00",
    item.name, item.sku || "", "2", item.unit || "piece",
    unitPrice.toFixed(2), "0", "0",
    `Sample ${getActiveBusinessStorage()} sale item`,
    (unitPrice * 2).toFixed(2),
  ];
  const csv = `\uFEFF${[headers, example].map((row) => row.map(escapeCell).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "sales_import_template.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function numeric(value, fallback = 0) {
  if (String(value ?? "").trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function getField(row, name) {
  return String(row[name] ?? "").trim();
}

function normalizeRows(rawRows, location) {
  return rawRows.map((raw, index) => {
    const row = Object.fromEntries(headers.map((header, column) => [header, String(raw[column] ?? "").trim()]));
    const errors = [];
    const invoiceNo = row["Invoice No."];
    const customerName = row["Customer name"] || "Walk-In Customer";
    const phone = row["Customer Phone number"];
    const email = row["Customer Email"];
    const productName = row["Product Name"];
    const sku = row["Product SKU/Code"];
    const quantity = numeric(row.Quantity, Number.NaN);
    const unitPrice = numeric(row["Unit Price"]);
    const itemTax = numeric(row["Item Tax"]);
    const itemDiscount = numeric(row["Item Discount"]);
    const orderTotal = numeric(row["Order Total"]);

    if (!invoiceNo) errors.push("Invoice No. is required.");
    if (customerName !== "Walk-In Customer" && !phone && !email) errors.push("Customer phone or email is required.");
    if (!productName && !sku) errors.push("Product Name or Product SKU/Code is required.");
    if (!Number.isFinite(quantity) || quantity <= 0) errors.push("Quantity must be greater than 0.");
    for (const [label, value] of [["Unit Price", unitPrice], ["Item Tax", itemTax], ["Item Discount", itemDiscount]]) {
      if (!Number.isFinite(value) || value < 0) errors.push(`${label} must be a non-negative number.`);
    }
    if (row["Order Total"] && (!Number.isFinite(orderTotal) || orderTotal < 0)) errors.push("Order Total must be a non-negative number.");
    if (row["Sale Date"] && Number.isNaN(Date.parse(row["Sale Date"].replace(" ", "T")))) errors.push("Sale Date must use YYYY-MM-DD HH:mm:ss format.");

    return {
      rowNumber: index + 2,
      invoiceNo,
      customerName,
      phone,
      email,
      date: row["Sale Date"],
      product: productName || sku,
      sku,
      quantity,
      unit: row["Product Unit"] || "piece",
      unitPrice,
      itemTax,
      itemDiscount,
      description: row["Item Description"],
      orderTotal,
      location,
      errors,
    };
  });
}

function readHistory() {
  try {
    const saved = JSON.parse(businessStorage.getItem(IMPORTS_KEY) || "[]");
    if (!Array.isArray(saved)) throw new Error("Sales import history is not an array.");
    return saved;
  } catch (error) {
    console.error("Could not load sales import history:", error);
    return [];
  }
}

function readSales() {
  try {
    const saved = JSON.parse(businessStorage.getItem(SALES_KEY) || "[]");
    if (!Array.isArray(saved)) throw new Error("Saved sales are not an array.");
    return saved;
  } catch (error) {
    console.error("Could not load existing sales:", error);
    throw new Error("Existing sales could not be loaded. Import was cancelled to avoid overwriting sales.");
  }
}

export default function ImportSales() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(getActiveBusinessStorage);
  const [groupBy, setGroupBy] = useState("Invoice No.");
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState(readHistory);
  const [isReading, setIsReading] = useState(false);
  const templateProduct = useMemo(() => {
    try {
      const stored = businessStorage.getItem("billomax-products");
      const products = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(products)) {
        throw new Error("Saved product list is not an array.");
      }
      return products[0] || getBusinessSampleProducts([])[0] || null;
    } catch (error) {
      console.error("Could not load a product for the sales import template:", error);
      return getBusinessSampleProducts([])[0] || null;
    }
  }, []);
  const validRows = useMemo(() => rows.filter((row) => !row.errors.length), [rows]);
  const errors = useMemo(() => rows.flatMap((row) => row.errors.map((error) => `Row ${row.rowNumber}: ${error}`)), [rows]);

  const clearFile = () => {
    setFile(null);
    setRows([]);
    setStatus(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const reviewSelectedFile = async (selected) => {
    if (!selected) return;
    setFile(selected);
    setRows([]);
    setStatus(null);
    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setStatus({ type: "error", text: "Please upload a CSV file. Download the template and save your spreadsheet as CSV UTF-8." });
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setStatus({ type: "error", text: "File exceeds the 10 MB upload limit." });
      return;
    }
    setIsReading(true);
    try {
      const parsed = parseCsv(await selected.text());
      const fileHeaders = parsed[0]?.map((cell, index) => index === 0 ? cell.replace(/^\uFEFF/, "").trim() : cell.trim()) || [];
      if (fileHeaders.length !== headers.length || headers.some((header, index) => fileHeaders[index] !== header)) {
        setStatus({ type: "error", text: "The column names or order do not match the sales template. Download the template and try again." });
        return;
      }
      const imported = normalizeRows(parsed.slice(1), location);
      if (!imported.length) {
        setStatus({ type: "error", text: "The file contains headers but no sales rows." });
        return;
      }
      setRows(imported);
      const invalidCount = imported.reduce((sum, row) => sum + row.errors.length, 0);
      setStatus(invalidCount
        ? { type: "error", text: `Review found ${invalidCount} validation issue(s). Invalid rows will be skipped during import.` }
        : { type: "success", text: `${imported.length} sale line(s) are ready to review and import.` });
    } catch (error) {
      console.error("Could not read sales file:", error);
      setStatus({ type: "error", text: "The selected file could not be read. Please check it and try again." });
    } finally {
      setIsReading(false);
    }
  };

  const reviewFile = async () => {
    if (!file) {
      setStatus({ type: "error", text: "Choose a sales CSV file first." });
      return;
    }
    await reviewSelectedFile(file);
  };

  const importRows = () => {
    if (!validRows.length) {
      setStatus({ type: "error", text: "There are no valid rows to import." });
      return;
    }
    try {
      const sales = readSales();
      const existingInvoices = new Set(sales.map((sale) => String(sale.invoiceNo || "")));
      const grouped = new Map();
      for (const row of validRows) {
        const groupKey = groupBy === "Invoice No."
          ? row.invoiceNo
          : groupBy === "Customer name"
            ? row.customerName
            : groupBy === "Customer Phone number"
              ? row.phone || row.invoiceNo
              : row.email || row.invoiceNo;
        const current = grouped.get(groupKey) || {
          id: `import-${Date.now()}-${grouped.size}`,
          date: row.date ? new Date(row.date.replace(" ", "T")).toLocaleString("en-GB") : new Date().toLocaleString("en-GB"),
          invoiceNo: row.invoiceNo,
          customerName: row.customerName,
          contactNumber: row.phone,
          customerEmail: row.email,
          location: row.location,
          paymentStatus: "Due",
          paymentMethod: "",
          total: 0,
          totalPaid: 0,
          sellDue: 0,
          sellReturnDue: 0,
          totalItems: 0,
          addedBy: `${getActiveBusinessStorage()} sales import`,
          shippingStatus: "",
          sellNote: "",
          staffNote: "",
          shippingDetails: "",
          items: [],
          importedOrderTotal: null,
        };
        const rowTotal = row.quantity * row.unitPrice - row.itemDiscount + row.itemTax;
        current.items.push({
          productId: row.sku || row.product,
          name: row.product,
          sku: row.sku,
          quantity: row.quantity,
          unit: row.unit,
          unitPrice: row.unitPrice,
          discount: row.itemDiscount,
          tax: row.itemTax,
          description: row.description,
        });
        current.totalItems += row.quantity;
        current.total += rowTotal;
        if (Number.isFinite(row.orderTotal) && row.orderTotal > 0) {
          current.importedOrderTotal = row.orderTotal;
        }
        grouped.set(groupKey, current);
      }
      const importedSales = [...grouped.values()].map((sale) => {
        const { importedOrderTotal, ...record } = sale;
        return { ...record, total: importedOrderTotal ?? record.total };
      });
      const duplicates = importedSales.filter((sale) => existingInvoices.has(String(sale.invoiceNo)));
      const finalSales = importedSales.map((sale) => {
        if (!existingInvoices.has(String(sale.invoiceNo))) return sale;
        const duplicateCount = existingInvoices.size;
        return { ...sale, invoiceNo: `${sale.invoiceNo}-IMP-${duplicateCount}` };
      });
      businessStorage.setItem(SALES_KEY, JSON.stringify([...finalSales, ...sales]));
      const batch = {
        id: `batch-${Date.now()}`,
        name: file?.name || "Sales import",
        importedAt: new Date().toLocaleString("en-GB"),
        createdBy: getActiveBusinessStorage(),
        invoices: finalSales.length,
      };
      const nextHistory = [batch, ...history];
      businessStorage.setItem(IMPORTS_KEY, JSON.stringify(nextHistory));
      setHistory(nextHistory);
      setStatus({ type: "success", text: `${finalSales.length} invoice(s) imported successfully${duplicates.length ? `. ${duplicates.length} duplicate invoice number(s) were given an import suffix` : ""}.` });
      setRows([]);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.error("Could not import sales:", error);
      setStatus({ type: "error", text: error.message || "Sales could not be imported. Please try again." });
    }
  };

  return (
    <main className="min-h-[calc(100vh-62px)] flex-1 bg-[#FFFAF5] px-3 py-5 sm:px-5 lg:px-7">
      <h1 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-[#283961]">Import Sales</h1>

      <section className="mb-4 rounded-2xl border border-[#F0EAE3] bg-white p-5 shadow-[0_7px_24px_rgba(40,57,97,0.06)] sm:p-6">
        <div className="grid items-end gap-4 md:grid-cols-[minmax(250px,1fr)_minmax(200px,1fr)_auto]">
          <label className="block text-xs font-semibold text-[#344B70]">
            File to import
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={(event) => { setFile(event.target.files?.[0] || null); setRows([]); setStatus(null); }} className="mt-2 block w-full text-sm font-normal text-[#536985] file:mr-3 file:rounded-lg file:border-0 file:bg-[#FFF1E5] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#D96D20] hover:file:bg-[#FFE7D2]" />
            <span className="mt-1.5 block text-[11px] font-normal text-[#8798AD]">CSV UTF-8 · Max file size 10 MB</span>
          </label>
          <label className="block text-xs font-semibold text-[#344B70]">
            Business location
            <select value={location} onChange={(event) => { setLocation(event.target.value); setRows((current) => current.map((row) => ({ ...row, location: event.target.value }))); }} className="mt-2 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536985] outline-none focus:border-[#F5A15D]">
              <option>{getActiveBusinessStorage()}</option><option>{getActiveBusinessStorage()} Main Branch</option>
            </select>
          </label>
          <button type="button" onClick={reviewFile} disabled={isReading} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6C70F5] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#595DE0] disabled:cursor-wait disabled:opacity-60">
            {isReading ? <span className="animate-pulse">Reading file...</span> : <><Upload size={16} /> Upload and review</>}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-[#344B70]">Group sale lines by
            <select value={groupBy} onChange={(event) => setGroupBy(event.target.value)} className="ml-2 h-9 rounded-lg border border-[#D6DFEA] bg-white px-3 text-xs font-normal text-[#536985]">
              <option>Invoice No.</option><option>Customer name</option><option>Customer Phone number</option><option>Customer Email</option>
            </select>
          </label>
          <button type="button" onClick={() => downloadTemplate(templateProduct)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#08A86B] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F5B]">
            <ArrowDownToLine size={16} /> Download template file
          </button>
          {file && <button type="button" onClick={clearFile} className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-[#A5412E] hover:bg-[#FFF3F0]"><X size={14} /> Clear file</button>}
        </div>
        <p className="mt-3 text-[11px] text-[#8798AD]">Excel files are not parsed directly. Save your spreadsheet as CSV UTF-8, then upload it here.</p>
      </section>

      <section className="mb-4 rounded-2xl border border-[#F0EAE3] bg-white p-5 shadow-[0_7px_24px_rgba(40,57,97,0.06)] sm:p-6">
        <h2 className="mb-3 text-lg font-semibold text-[#D96D20]">Instructions</h2>
        <ol className="mb-4 space-y-2 text-xs text-[#536985]">
          <li className="border-b border-[#F2E8DE] py-2"><span className="mr-4 font-semibold">1.</span>Upload sales data using the provided CSV template.</li>
          <li className="border-b border-[#F2E8DE] py-2"><span className="mr-4 font-semibold">2.</span>Choose the business location and the column used to group sale lines.</li>
          <li className="border-b border-[#F2E8DE] py-2"><span className="mr-4 font-semibold">3.</span>Check the preview and resolve required-field errors before importing.</li>
        </ol>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-xs">
            <thead><tr className="bg-[#FFF7EF] text-[#19366F]"><th className="px-3 py-2.5 font-semibold">Importable field</th><th className="px-3 py-2.5 font-semibold">Instructions</th></tr></thead>
            <tbody>{fields.map((field) => <tr key={field.name} className="border-b border-[#F2E8DE] even:bg-[#FFFCF8]"><td className="px-3 py-2 font-medium text-[#344B70]">{field.name}</td><td className="px-3 py-2 text-[#60738D]">{field.instruction}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      {status && <div role={status.type === "error" ? "alert" : "status"} className={`mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${status.type === "error" ? "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]" : "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"}`}>
        {status.type === "error" ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <Check size={17} className="mt-0.5 shrink-0" />}{status.text}
      </div>}

      {rows.length > 0 && <section className="mb-4 rounded-2xl border border-[#F0EAE3] bg-white p-5 shadow-[0_7px_24px_rgba(40,57,97,0.06)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-semibold text-[#283961]">Import review</h2><p className="mt-1 text-xs text-[#71839A]">{validRows.length} valid · {errors.length} issue(s) · {rows.length} rows found</p></div>
          <button type="button" onClick={importRows} disabled={!validRows.length} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF711A] px-4 text-sm font-semibold text-white hover:bg-[#EF5F0F] disabled:cursor-not-allowed disabled:opacity-50"><Check size={16} /> Import valid rows</button>
        </div>
        {errors.length > 0 && <div className="mb-3 max-h-28 overflow-auto rounded-lg border border-[#F2D2C9] bg-[#FFF7F4] p-3 text-xs text-[#A5412E]">{errors.map((error, index) => <p key={`${index}-${error}`}>{error}</p>)}</div>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead><tr className="bg-[#FFF7EF] text-[#19366F]">{["Row", "Invoice No.", "Customer", "Product", "Quantity", "Unit Price", "Location", "Review"].map((heading) => <th key={heading} className="px-3 py-2.5 font-semibold">{heading}</th>)}</tr></thead>
            <tbody>{rows.slice(0, 100).map((row) => <tr key={row.rowNumber} className={`border-b border-[#F2E8DE] ${row.errors.length ? "bg-[#FFF7F4]" : "even:bg-[#FFFCF8]"}`}>
              <td className="px-3 py-2.5">{row.rowNumber}</td><td className="px-3 py-2.5">{row.invoiceNo || "—"}</td><td className="px-3 py-2.5">{row.customerName}</td><td className="px-3 py-2.5">{row.product || "—"}</td><td className="px-3 py-2.5">{Number.isFinite(row.quantity) ? row.quantity : "—"}</td><td className="px-3 py-2.5">{Number.isFinite(row.unitPrice) ? row.unitPrice.toFixed(2) : "—"}</td><td className="px-3 py-2.5">{row.location}</td><td className={`px-3 py-2.5 font-semibold ${row.errors.length ? "text-[#A5412E]" : "text-[#287444]"}`}>{row.errors.length ? `${row.errors.length} issue(s)` : "Ready"}</td>
            </tr>)}</tbody>
          </table>
          {rows.length > 100 && <p className="mt-2 text-xs text-[#8798AD]">Showing the first 100 of {rows.length} rows in preview. All valid rows are included when imported.</p>}
        </div>
      </section>}

      <section className="rounded-2xl border border-[#F0EAE3] bg-white p-5 shadow-[0_7px_24px_rgba(40,57,97,0.06)] sm:p-6">
        <h2 className="mb-3 text-lg font-semibold text-[#D96D20]">Imports</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-xs">
            <thead><tr className="border-b border-[#F2E8DE] text-[#19366F]">{["Import batch", "Import time", "Created By", "Invoices"].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead>
            <tbody>{history.map((batch) => <tr key={batch.id} className="border-b border-[#F2E8DE] text-[#536985] even:bg-[#FFFCF8]"><td className="px-3 py-3">{batch.name}</td><td className="px-3 py-3">{batch.importedAt}</td><td className="px-3 py-3">{batch.createdBy}</td><td className="px-3 py-3">{batch.invoices}</td></tr>)}{!history.length && <tr><td colSpan={4} className="px-3 py-7 text-center text-sm text-[#8798AD]"><FileSpreadsheet size={18} className="mx-auto mb-2" />No import batches yet.</td></tr>}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}