import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  Check,
  ChevronDown,
  CircleHelp,
  FileSpreadsheet,
  Info,
  PackageOpen,
  Upload,
  X,
} from "lucide-react";

const fields = [
  { name: "SKU/Code", required: true, instruction: "SKU of an existing product. This value is used to match the opening stock to the product." },
  { name: "Location", instruction: "Optional business location name. If blank, the first business location is used." },
  { name: "Quantity", required: true, instruction: "Opening stock quantity. Enter a non-negative number." },
  { name: "Unit Cost (Before Tax)", required: true, instruction: "Unit cost before tax. Enter a non-negative number." },
  { name: "Lot Number", instruction: "Optional batch or lot number." },
  { name: "Expiry Date", instruction: "Optional stock expiry date as text in dd/mm/yyyy format, for example 22/10/2026." },
];

const headers = fields.map((field) => field.name);

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
    } else if ((character === "\r" || character === "\n") && !quoted) {
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

function downloadTemplate(withExample) {
  const exampleRow = ["SKU-001", "Pharmacy", "25", "12.50", "LOT-2026-01", "22/10/2026"];
  const rows = withExample ? [headers, exampleRow] : [headers];
  const content = `\uFEFF${rows.map((row) => row.map(escapeCell).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = withExample ? "opening_stock_sample.csv" : "opening_stock_template.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function isValidDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function validateRow(row, rowNumber) {
  const stock = Object.fromEntries(headers.map((header, index) => [header, (row[index] ?? "").trim()]));
  const errors = [];
  if (!stock["SKU/Code"]) errors.push(`Row ${rowNumber}: SKU/Code is required.`);
  for (const column of ["Quantity", "Unit Cost (Before Tax)"]) {
    const value = stock[column];
    if (!value) {
      errors.push(`Row ${rowNumber}: ${column} is required.`);
    } else if (!Number.isFinite(Number(value)) || Number(value) < 0) {
      errors.push(`Row ${rowNumber}: ${column} must be a non-negative number.`);
    }
  }
  if (stock["Expiry Date"] && !isValidDate(stock["Expiry Date"])) {
    errors.push(`Row ${rowNumber}: Expiry Date must be a valid date in dd/mm/yyyy format.`);
  }
  return { stock, errors };
}

function ImportOpeningStock() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);

  const validRows = useMemo(() => rows.filter((row) => row.errors.length === 0), [rows]);

  const clearFile = () => {
    setFile(null);
    setRows([]);
    setErrors([]);
    setNotice(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    setNotice(null);
    setErrors([]);
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setRows([]);
      setNotice({ type: "error", text: "Please select a CSV file using the opening-stock template." });
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setRows([]);
      setNotice({ type: "error", text: "The selected file exceeds the 10 MB upload limit." });
      return;
    }

    try {
      const parsed = parseCsv(await selectedFile.text());
      const fileHeaders = parsed[0]?.map((cell, index) => index === 0 ? cell.replace(/^\uFEFF/, "").trim() : cell.trim()) ?? [];
      const orderMatches = fileHeaders.length === headers.length && headers.every((header, index) => header === fileHeaders[index]);
      if (!orderMatches) {
        setFile(selectedFile);
        setRows([]);
        setNotice({ type: "error", text: "The file must use the exact six template columns in the required order. Download the template and try again." });
        return;
      }

      const dataRows = parsed.slice(1);
      const validated = dataRows.map((row, index) => {
        if (row.length !== headers.length) {
          return { stock: null, errors: [`Row ${index + 2}: Expected ${headers.length} columns, but found ${row.length}.`] };
        }
        return validateRow(row, index + 2);
      });
      const validationErrors = validated.flatMap((row) => row.errors);
      setFile(selectedFile);
      setRows(validated);
      setErrors(validationErrors);
      setNotice(dataRows.length
        ? validationErrors.length
          ? { type: "error", text: `Validation found ${validationErrors.length} issue(s). Correct the highlighted rows before submitting.` }
          : { type: "success", text: `${validated.length} row(s) are valid and ready to import.` }
        : { type: "error", text: "This file contains the header but no stock rows." });
    } catch (error) {
      console.error("Could not read opening stock file:", error);
      setFile(null);
      setRows([]);
      setNotice({ type: "error", text: "The CSV file could not be read. Check the file and try again." });
    }
  };

  const submitImport = () => {
    if (!file || !validRows.length || errors.length) {
      setNotice({ type: "error", text: "Choose a valid file and fix all row issues before submitting." });
      return;
    }
    setIsSubmitting(true);
    try {
      const stored = window.localStorage.getItem("billomax-products");
      const products = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(products)) throw new Error("Saved product data is not in the expected format.");
      const previousLots = JSON.parse(window.localStorage.getItem("billomax-opening-stock-imports") || "[]");
      if (!Array.isArray(previousLots)) throw new Error("Saved opening-stock history is not in the expected format.");
      const productsBySku = new Map(products.map((product, index) => [String(product.sku ?? "").trim(), index]));
      const unknownSkus = [...new Set(validRows.map(({ stock }) => stock["SKU/Code"]).filter((sku) => !productsBySku.has(sku)))];
      if (unknownSkus.length) {
        setNotice({ type: "error", text: `No matching locally saved product was found for SKU(s): ${unknownSkus.join(", ")}.` });
        return;
      }

      const updatedProducts = products.map((product) => ({ ...product }));
      const importedLots = [];
      validRows.forEach(({ stock }) => {
        const productIndex = productsBySku.get(stock["SKU/Code"]);
        const product = updatedProducts[productIndex];
        product.stock = (Number(product.stock) || 0) + Number(stock.Quantity);
        importedLots.push({
          sku: stock["SKU/Code"],
          location: stock.Location || product.location || "",
          quantity: Number(stock.Quantity),
          unitCostBeforeTax: Number(stock["Unit Cost (Before Tax)"]),
          lotNumber: stock["Lot Number"],
          expiryDate: stock["Expiry Date"],
        });
      });

      window.localStorage.setItem("billomax-products", JSON.stringify(updatedProducts));
      window.localStorage.setItem("billomax-opening-stock-imports", JSON.stringify([...previousLots, ...importedLots]));
      setNotice({ type: "success", text: `Opening stock imported for ${importedLots.length} row(s) and saved in this browser.` });
      setFile(null);
      setRows([]);
      setErrors([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("Could not import opening stock:", error);
      setNotice({ type: "error", text: error.message || "Opening stock could not be saved." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="mb-1 text-xs font-medium text-[#8798AD]">Products <span className="px-1">/</span> Inventory</p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">Import Opening Stock</h1>
          <p className="mt-1 text-sm text-[#71809A]">Upload opening quantities, unit costs, and lot expiry details in one go.</p>
        </div>

        <section className="mb-5 overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_8px_28px_rgba(40,57,97,0.06)]">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <label htmlFor="opening-stock-file" className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#344B70]">
                  File to import <span title="Use a CSV file with the six required columns in the exact order." className="inline-flex text-[#4DBFD0]"><CircleHelp size={15} /></span>
                </label>
                <input
                  ref={inputRef}
                  id="opening-stock-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                  className="block w-full cursor-pointer rounded-lg border border-[#D6DFEA] bg-[#FFFCF8] text-sm text-[#536985] file:mr-3 file:cursor-pointer file:border-0 file:bg-[#EEF4FB] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-[#4773A4] hover:file:bg-[#E3EDF8]"
                />
                <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#8798AD]"><Info size={14} className="mt-0.5 shrink-0 text-[#5584BC]" />CSV only · Maximum 10 MB · Expiry dates must be text in dd/mm/yyyy format.</p>
                {file && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-[#E6EAF0] bg-[#FFFCF8] px-3 py-2">
                    <span className="truncate text-xs font-medium text-[#536985]">{file.name}</span>
                    <button type="button" onClick={clearFile} aria-label="Remove selected file" className="rounded p-1 text-[#8798AD] hover:bg-[#FFF0E3] hover:text-[#E87928]"><X size={15} /></button>
                  </div>
                )}
              </div>
              <button type="button" disabled={!validRows.length || errors.length > 0 || isSubmitting} onClick={submitImport} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6250EF] to-[#397FF1] px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">
                <Upload size={16} /> {isSubmitting ? "Importing..." : "Submit"}
              </button>
            </div>

            <button type="button" onClick={() => downloadTemplate(false)} className="inline-flex h-11 items-center justify-center gap-2 justify-self-start rounded-xl bg-[#08A878] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078E66] lg:justify-self-end">
              <ArrowDownToLine size={16} /> Download template file
            </button>
          </div>

          {notice && (
            <div className={`mx-5 mb-5 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm sm:mx-7 ${notice.type === "error" ? "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]" : "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"}`} role="status">
              <span className="flex items-start gap-2">{notice.type === "error" ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <Check size={17} className="mt-0.5 shrink-0" />}{notice.text}</span>
              <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message"><X size={16} /></button>
            </div>
          )}
        </section>

        {rows.length > 0 && (
          <section className="mb-5 overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDF0F3] px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-[#283961]">Opening stock preview</h2>
                <p className="mt-1 text-xs text-[#8798AD]">Review product, quantity, cost, lot, and expiry before submitting.</p>
              </div>
              <span className="rounded-full bg-[#F0FAF3] px-3 py-1.5 text-xs font-semibold text-[#287444]">{validRows.length} valid row(s)</span>
            </div>
            {errors.length > 0 && (
              <div className="app-themed-scrollbar max-h-32 overflow-y-auto border-b border-[#F2EAE2] bg-[#FFF9F7] px-5 py-3">
                <ul className="space-y-1 text-xs text-[#A5412E]">{errors.slice(0, 8).map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul>
                {errors.length > 8 && <p className="mt-1 text-xs text-[#A5412E]">And {errors.length - 8} more issue(s).</p>}
              </div>
            )}
            <div className="app-themed-scrollbar overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-[#FFFCF8] text-xs uppercase tracking-wide text-[#71809A]">
                  <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}<th className="px-4 py-3 font-semibold">Status</th></tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, index) => (
                    <tr key={index} className="border-t border-[#EDF0F3]">
                      {headers.map((header) => <td key={header} className="px-4 py-3 text-[#536985]">{row.stock?.[header] || <span className="text-[#C3CBD5]">—</span>}</td>)}
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${row.errors.length ? "bg-[#FFF3F0] text-[#A5412E]" : "bg-[#F0FAF3] text-[#287444]"}`}>{row.errors.length ? "Needs attention" : "Ready"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_8px_28px_rgba(40,57,97,0.06)]">
          <button type="button" onClick={() => setInstructionsOpen((open) => !open)} aria-expanded={instructionsOpen} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-7">
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#F5852A]"><FileSpreadsheet size={18} /></span>
              <span><span className="block text-base font-semibold text-[#F5852A]">File instructions</span><span className="mt-1 block text-sm text-[#71809A]">Use the exact six-column order shown below.</span></span>
            </span>
            <ChevronDown size={18} className={`shrink-0 text-[#8798AD] transition-transform ${instructionsOpen ? "rotate-180" : ""}`} />
          </button>
          {instructionsOpen && (
            <>
              <div className="border-y border-[#F2EAE2] bg-[#FFFCF8] px-5 py-3.5 text-sm text-[#536985] sm:px-7">
                <p className="font-semibold text-[#344B70]">Follow these instructions carefully before importing the file.</p>
                <p className="mt-1 text-xs leading-5 text-[#71809A]">Do not rename, remove, or reorder the headers. Expiry Date must be entered as text in dd/mm/yyyy format.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                  <thead className="bg-[#F7F8FA] text-xs uppercase tracking-wide text-[#60738D]">
                    <tr><th className="w-24 px-5 py-3 font-semibold">Column #</th><th className="w-[32%] px-4 py-3 font-semibold">Column name</th><th className="w-32 px-4 py-3 font-semibold">Requirement</th><th className="px-4 py-3 font-semibold">Instruction</th></tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.name} className="border-t border-[#EDF0F3] even:bg-[#FFFCF8]">
                        <td className="px-5 py-3 text-[#8798AD]">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-[#344B70]">{field.name}</td>
                        <td className="px-4 py-3">{field.required ? <span className="rounded-full bg-[#FFF0E3] px-2.5 py-1 text-[11px] font-medium text-[#D86D22]">Required</span> : <span className="text-xs text-[#8798AD]">Optional</span>}</td>
                        <td className="px-4 py-3 text-[13px] leading-5 text-[#71809A]">{field.instruction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <footer className="py-5 text-center text-xs text-[#8798AD]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3 | Copyright © 2026 All rights reserved.
        </footer>
      </div>
    </main>
  );
}

export default ImportOpeningStock;