import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  Check,
  ChevronDown,
  CircleHelp,
  CloudUpload,
  FileSpreadsheet,
  Info,
  Upload,
  X,
} from "lucide-react";

const fields = [
  { name: "Product Name", required: true, instruction: "Name of the product." },
  { name: "Brand", instruction: "Name of the brand. If it does not exist, a brand with this name will be created." },
  { name: "Unit", required: true, instruction: "Name of the unit." },
  { name: "Category", instruction: "Name of the category. If it does not exist, a category with this name will be created." },
  { name: "Sub category", instruction: "Name of the sub-category. A new sub-category is created under the parent category if needed." },
  { name: "SKU/Code", instruction: "Product SKU. If blank, an SKU will be automatically generated." },
  { name: "Barcode Type", instruction: "Optional; defaults to C128. Options: C128, C39, EAN-13, EAN-8, UPC-A, UPC-E, ITF-148." },
  { name: "Manage Stock?", required: true, instruction: "Enable or disable stock management: 1 = Yes, 0 = No." },
  { name: "Alert quantity", instruction: "Alert quantity. Numbers only." },
  { name: "Expires in", instruction: "Product expiry period. Numbers only." },
  { name: "Expiry Period Unit", instruction: "Use days or months." },
  { name: "Applicable Tax", instruction: "Name of the tax rate. Required when purchase prices including and excluding tax differ." },
  { name: "Selling Price Tax Type", required: true, instruction: "Use inclusive or exclusive." },
  { name: "Product Type", required: true, instruction: "Use single or variable." },
  { name: "Variation Name", conditional: true, instruction: "Required for variable products. For example: Size or Color." },
  { name: "Variation Values", conditional: true, instruction: "Required for variable products. Separate values with |, for example Red|Blue|Green." },
  { name: "Variation SKUs", instruction: "Optional SKUs for each variation, separated with | in the same order as Variation Values." },
  { name: "Purchase Price (Including Tax)", conditional: true, instruction: "Required if Purchase Price (Excluding Tax) is blank. Numbers only; variable prices separated with |." },
  { name: "Purchase Price (Excluding Tax)", conditional: true, instruction: "Required if Purchase Price (Including Tax) is blank. Numbers only; variable prices separated with |." },
  { name: "Profit Margin %", instruction: "Numbers only. If blank, the business default margin is used." },
  { name: "Selling Price", instruction: "Numbers only. If blank, calculated from purchase price and applicable tax." },
  { name: "Opening Stock", instruction: "Numbers only. Separate variable-product quantities with |." },
  { name: "Opening stock location", instruction: "Business location name. If blank, the first business location is used." },
  { name: "Expiry Date", instruction: "Use MM-DD-YYYY, for example 11-25-2026." },
  { name: "Enable Product description, IMEI or Serial Number", instruction: "Optional: 1 = Yes, 0 = No. Defaults to 0." },
  { name: "Weight", instruction: "Optional product weight." },
  { name: "Rack", instruction: "Rack details separated with | for each business location, for example R1|R5|R12." },
  { name: "Row", instruction: "Row details separated with | for each business location, for example ROW1|ROW2|ROW3." },
  { name: "Position", instruction: "Position details separated with | for each business location, for example POS1|POS2|POS3." },
  { name: "Image", instruction: "Image filename in public/uploads/img or an image URL." },
  { name: "Product Description", instruction: "Optional product description." },
  { name: "Custom Field1", instruction: "Optional custom field value." },
  { name: "Custom Field2", instruction: "Optional custom field value." },
  { name: "Custom Field3", instruction: "Optional custom field value." },
  { name: "Custom Field4", instruction: "Optional custom field value." },
  { name: "Not for selling", instruction: "Optional: 1 = Yes, 0 = No." },
  { name: "Product locations", instruction: "Comma-separated business location names where the product will be available." },
];

const headers = fields.map((field) => field.name);
const maxFileSize = 10 * 1024 * 1024;
const barcodeTypes = new Set(["C128", "C39", "EAN-13", "EAN-8", "UPC-A", "UPC-E", "ITF-148", "ITF-14"]);

function escapeCsvCell(value) {
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

function createSampleRow() {
  const sample = Object.fromEntries(headers.map((header) => [header, ""]));
  Object.assign(sample, {
    "Product Name": "Sample Medicine",
    Brand: "MediCare",
    Unit: "Piece",
    Category: "Health & Wellness Products",
    "Sub category": "Tablets",
    "SKU/Code": "SAMPLE-001",
    "Barcode Type": "C128",
    "Manage Stock?": "1",
    "Alert quantity": "10",
    "Expiry Period Unit": "months",
    "Selling Price Tax Type": "exclusive",
    "Product Type": "single",
    "Purchase Price (Including Tax)": "10.50",
    "Profit Margin %": "25",
    "Selling Price": "13.13",
    "Opening Stock": "0",
    "Opening stock location": "Pharmacy",
    "Enable Product description, IMEI or Serial Number": "0",
    Weight: "0.1",
    "Product Description": "Sample product description",
    "Not for selling": "0",
    "Product locations": "Pharmacy",
  });
  return headers.map((header) => sample[header]);
}

function downloadCsv(rows, filename) {
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function validateRow(row, rowNumber) {
  const errors = [];
  const product = Object.fromEntries(headers.map((header, index) => [header, (row[index] ?? "").trim()]));
  const requireValue = (column, label = column) => {
    if (!product[column]) errors.push(`Row ${rowNumber}: ${label} is required.`);
  };
  const validateFlag = (column) => {
    if (product[column] && !["0", "1"].includes(product[column])) {
      errors.push(`Row ${rowNumber}: ${column} must be 1 or 0.`);
    }
  };
  const validateNumber = (column, { allowPipe = false } = {}) => {
    if (!product[column]) return;
    const values = allowPipe ? product[column].split("|") : [product[column]];
    if (values.some((value) => value.trim() === "" || !Number.isFinite(Number(value)) || Number(value) < 0)) {
      errors.push(`Row ${rowNumber}: ${column} must contain non-negative numbers${allowPipe ? " separated by |" : ""}.`);
    }
  };

  requireValue("Product Name");
  requireValue("Unit");
  requireValue("Manage Stock?");
  requireValue("Selling Price Tax Type");
  requireValue("Product Type");
  validateFlag("Manage Stock?");
  validateFlag("Enable Product description, IMEI or Serial Number");
  validateFlag("Not for selling");

  if (product["Selling Price Tax Type"] && !["inclusive", "exclusive"].includes(product["Selling Price Tax Type"].toLowerCase())) {
    errors.push(`Row ${rowNumber}: Selling Price Tax Type must be inclusive or exclusive.`);
  }
  const type = product["Product Type"].toLowerCase();
  if (product["Product Type"] && !["single", "variable"].includes(type)) {
    errors.push(`Row ${rowNumber}: Product Type must be single or variable.`);
  }
  if (type === "variable") {
    requireValue("Variation Name");
    requireValue("Variation Values");
    if (product["Variation Values"] && !product["Variation Values"].split("|").every((value) => value.trim())) {
      errors.push(`Row ${rowNumber}: Variation Values must not contain empty values.`);
    }
  }
  if (product["Barcode Type"] && !barcodeTypes.has(product["Barcode Type"].toUpperCase())) {
    errors.push(`Row ${rowNumber}: Barcode Type must be one of ${[...barcodeTypes].join(", ")}.`);
  }
  if (product["Expiry Period Unit"] && !["days", "months"].includes(product["Expiry Period Unit"].toLowerCase())) {
    errors.push(`Row ${rowNumber}: Expiry Period Unit must be days or months.`);
  }
  validateNumber("Alert quantity");
  validateNumber("Expires in");
  validateNumber("Profit Margin %");
  validateNumber("Selling Price");
  validateNumber("Opening Stock", { allowPipe: type === "variable" });
  validateNumber("Weight");
  validateNumber("Purchase Price (Including Tax)", { allowPipe: type === "variable" });
  validateNumber("Purchase Price (Excluding Tax)", { allowPipe: type === "variable" });
  if (!product["Purchase Price (Including Tax)"] && !product["Purchase Price (Excluding Tax)"]) {
    errors.push(`Row ${rowNumber}: Enter Purchase Price (Including Tax) or Purchase Price (Excluding Tax).`);
  }
  if (product["Expiry Date"] && !/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/.test(product["Expiry Date"])) {
    errors.push(`Row ${rowNumber}: Expiry Date must use MM-DD-YYYY.`);
  } else if (product["Expiry Date"]) {
    const [month, day, year] = product["Expiry Date"].split("-").map(Number);
    const expiry = new Date(year, month - 1, day);
    if (expiry.getFullYear() !== year || expiry.getMonth() !== month - 1 || expiry.getDate() !== day) {
      errors.push(`Row ${rowNumber}: Expiry Date is not a valid calendar date.`);
    }
  }
  if (product["Purchase Price (Including Tax)"] && product["Purchase Price (Excluding Tax)"] && !product["Applicable Tax"]) {
    const includingTax = product["Purchase Price (Including Tax)"].split("|").map(Number);
    const excludingTax = product["Purchase Price (Excluding Tax)"].split("|").map(Number);
    if (includingTax.some((price, index) => Math.abs(price - excludingTax[index]) > 0.000001)) {
      errors.push(`Row ${rowNumber}: Applicable Tax is required when including-tax and excluding-tax purchase prices differ.`);
    }
  }
  if (type === "variable" && product["Variation Values"]) {
    const variationCount = product["Variation Values"].split("|").length;
    ["Variation SKUs", "Purchase Price (Including Tax)", "Purchase Price (Excluding Tax)", "Opening Stock"].forEach((column) => {
      if (!product[column]) return;
      const values = product[column].split("|");
      if (values.length !== variationCount) {
        errors.push(`Row ${rowNumber}: ${column} must have one value per Variation Value.`);
      }
    });
  }

  return { product, errors };
}

function mapProduct(product, index) {
  const variable = product["Product Type"].toLowerCase() === "variable";
  const purchasePrice = Number((product["Purchase Price (Excluding Tax)"] || product["Purchase Price (Including Tax)"]).split("|")[0]) || 0;
  const sellingPrice = Number(product["Selling Price"]) || (
    purchasePrice * (1 + (Number(product["Profit Margin %"]) || 0) / 100)
  );
  const sku = product["SKU/Code"] || `PR-${Date.now()}-${index + 1}`;
  return {
    id: `import-${Date.now()}-${index}`,
    name: product["Product Name"],
    location: product["Opening stock location"] || product["Product locations"].split(",")[0]?.trim() || "Pharmacy",
    purchasePrice,
    sellingPrice,
    stock: Number(product["Opening Stock"].split("|")[0]) || 0,
    unit: product.Unit.toLowerCase(),
    type: variable ? "Variable" : "Single",
    category: product.Category,
    brand: product.Brand,
    tax: product["Applicable Tax"],
    sku,
    molecules: "",
    notForSelling: product["Not for selling"] === "1",
    barcodeType: product["Barcode Type"] || "C128",
    productDescription: product["Product Description"],
    variationName: product["Variation Name"],
    variationValues: product["Variation Values"] ? product["Variation Values"].split("|") : [],
    variationSkus: product["Variation SKUs"] ? product["Variation SKUs"].split("|") : [],
    customFields: headers.filter((header) => header.startsWith("Custom Field")).map((header) => product[header]),
  };
}

function ImportProducts() {
  const inputRef = useRef(null);
  const [uploadType, setUploadType] = useState("csv");
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [notice, setNotice] = useState(null);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  const validRows = useMemo(() => rows.filter((row) => row.errors.length === 0), [rows]);
  const invalidRows = rows.length - validRows.length;

  const clearFile = () => {
    setFile(null);
    setRows([]);
    setErrors([]);
    setNotice(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = async (selectedFile) => {
    setNotice(null);
    setErrors([]);
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setRows([]);
      setNotice({ type: "error", text: "Please select a CSV file. Download the sample CSV to ensure the required column order." });
      return;
    }
    if (selectedFile.size > maxFileSize) {
      setFile(null);
      setRows([]);
      setNotice({ type: "error", text: "The selected file exceeds the 10 MB upload limit." });
      return;
    }

    try {
      const parsedRows = parseCsv(await selectedFile.text());
      const actualHeaders = parsedRows[0]?.map((cell, index) => index === 0 ? cell.replace(/^\uFEFF/, "").trim() : cell.trim()) ?? [];
      const missing = headers.filter((header) => !actualHeaders.includes(header));
      const unexpected = actualHeaders.filter((header) => !headers.includes(header));
      const orderMismatch = headers.length !== actualHeaders.length || headers.some((header, index) => actualHeaders[index] !== header);
      if (missing.length || unexpected.length || orderMismatch) {
        const details = [
          missing.length ? `Missing: ${missing.join(", ")}.` : "",
          unexpected.length ? `Unexpected: ${unexpected.join(", ")}.` : "",
          !missing.length && !unexpected.length && orderMismatch ? "The columns are not in the required order." : "",
        ].filter(Boolean).join(" ");
        setFile(selectedFile);
        setRows([]);
        setNotice({ type: "error", text: `The column headers do not match the product template. ${details}` });
        return;
      }

      const dataRows = parsedRows.slice(1);
      const validated = dataRows.map((row, index) => {
        if (row.length !== headers.length) {
          return { product: null, errors: [`Row ${index + 2} has ${row.length} columns; expected ${headers.length}.`], raw: row };
        }
        const result = validateRow(row, index + 2);
        return { ...result, raw: row };
      });
      const validationErrors = validated.flatMap((item) => item.errors);
      setFile(selectedFile);
      setRows(validated);
      setErrors(validationErrors);
      if (!dataRows.length) {
        setNotice({ type: "error", text: "The file contains the header but no product rows." });
      } else if (validationErrors.length) {
        setNotice({ type: "error", text: `Validation complete: ${validated.filter((row) => !row.errors.length).length} valid row(s), ${validated.length - validated.filter((row) => !row.errors.length).length} row(s) need attention. No products have been imported yet.` });
      } else {
        setNotice({ type: "success", text: `${validated.length} product row(s) passed validation. Review the preview, then import them.` });
      }
    } catch (error) {
      console.error("Could not read product import file:", error);
      setFile(null);
      setRows([]);
      setNotice({ type: "error", text: "The selected CSV could not be read. Check the file and try again." });
    }
  };

  const importValidProducts = () => {
    if (!file || !validRows.length) {
      setNotice({ type: "error", text: "There are no valid product rows to import." });
      return;
    }
    setIsImporting(true);
    try {
      const stored = window.localStorage.getItem("billomax-products");
      const existing = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(existing)) throw new Error("Saved product data is not in the expected format.");
      const existingSkus = new Set(existing.map((product) => String(product.sku ?? "").trim()).filter(Boolean));
      const incoming = validRows.map((row, index) => mapProduct(row.product, index));
      const duplicateSkus = incoming.filter((product) => existingSkus.has(product.sku)).map((product) => product.sku);
      if (duplicateSkus.length) {
        setNotice({ type: "error", text: `Import stopped. These SKU/Code values already exist in locally saved products: ${[...new Set(duplicateSkus)].join(", ")}.` });
        return;
      }
      window.localStorage.setItem("billomax-products", JSON.stringify([...existing, ...incoming]));
      setNotice({ type: "success", text: `Successfully imported ${incoming.length} product${incoming.length === 1 ? "" : "s"} into this browser's product list.` });
      setRows([]);
      setErrors([]);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("Could not import products:", error);
      setNotice({ type: "error", text: error.message || "Products could not be saved in this browser." });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="mb-1 text-xs font-medium text-[#8798AD]">Products <span className="px-1">/</span> Bulk management</p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">Bulk Product Management</h1>
          <p className="mt-1 text-sm text-[#71809A]">Import products in bulk using the provided 37-column CSV template.</p>
        </div>

        <section className="mb-5 overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_8px_28px_rgba(40,57,97,0.06)]">
          <div className="grid gap-6 px-5 py-5 sm:px-7 sm:py-6 lg:grid-cols-[0.85fr_1.35fr_auto] lg:items-start">
            <label className="block text-xs font-semibold text-[#344B70]">
              Upload type
              <select value={uploadType} onChange={(event) => setUploadType(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536985] outline-none focus:border-[#F5A15D]">
                <option value="csv">CSV Upload</option>
              </select>
              <span className="mt-1.5 block text-xs font-normal text-[#8798AD]">CSV is supported for template-ordered structured imports.</span>
            </label>

            <div>
              <label htmlFor="product-import-file" className="mb-1.5 block text-xs font-semibold text-[#344B70]">File to import</label>
              <input ref={inputRef} id="product-import-file" type="file" accept=".csv,text/csv" onChange={(event) => handleFile(event.target.files?.[0])} className="block w-full cursor-pointer rounded-lg border border-[#D6DFEA] bg-[#FFFCF8] text-sm text-[#536985] file:mr-3 file:cursor-pointer file:border-0 file:bg-[#EEF4FB] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-[#4773A4] hover:file:bg-[#E3EDF8]" />
              <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#8798AD]"><Info size={14} className="mt-0.5 shrink-0 text-[#5584BC]" />Upload CSV with the exact 37 headers and column order. Maximum 10 MB.</p>
              {file && <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-[#F5F8FC] px-3 py-2"><span className="truncate text-xs font-medium text-[#536985]">{file.name}</span><button type="button" onClick={clearFile} aria-label="Remove selected file" className="rounded p-1 text-[#8798AD] hover:bg-[#FFF0E3] hover:text-[#E87928]"><X size={15} /></button></div>}
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-col">
              <button type="button" disabled={!validRows.length || invalidRows > 0 || isImporting} onClick={importValidProducts} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6250EF] to-[#397FF1] px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">
                <Upload size={16} /> {isImporting ? "Importing..." : "Submit import"}
              </button>
              <button type="button" onClick={() => downloadCsv([createSampleRow()], "sample_products.csv")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#08A878] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078E66]">
                <ArrowDownToLine size={16} /> Download sample CSV
              </button>
              <button type="button" onClick={() => downloadCsv([], "products_legacy_template.csv")} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-[#4773A4] transition hover:bg-[#EEF4FB]">
                <FileSpreadsheet size={14} /> Download header-only template
              </button>
            </div>
          </div>

          <div className="border-t border-[#F2EAE2] bg-[#FFFCF8] px-5 py-3.5 text-sm text-[#71809A] sm:px-7">
            Imported products are saved to the current browser product list and are not sent to a server.
          </div>
        </section>

        {notice && (
          <div className={`mb-5 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${notice.type === "error" ? "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]" : "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"}`} role="status">
            <span className="flex items-start gap-2">{notice.type === "error" ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <Check size={17} className="mt-0.5 shrink-0" />}{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message"><X size={16} /></button>
          </div>
        )}

        {rows.length > 0 && (
          <section className="mb-5 overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDF0F3] px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-[#283961]">Import preview</h2>
                <p className="mt-1 text-xs text-[#8798AD]">Showing up to five rows from {file?.name}</p>
              </div>
              <div className="flex gap-2 text-xs font-semibold">
                <span className="rounded-full bg-[#F0FAF3] px-3 py-1.5 text-[#287444]">{validRows.length} valid</span>
                {invalidRows > 0 && <span className="rounded-full bg-[#FFF3F0] px-3 py-1.5 text-[#A5412E]">{invalidRows} need attention</span>}
              </div>
            </div>
            {errors.length > 0 && (
              <div className="app-themed-scrollbar max-h-36 overflow-y-auto border-b border-[#F2EAE2] bg-[#FFF9F7] px-5 py-3">
                <ul className="space-y-1 text-xs text-[#A5412E]">{errors.slice(0, 10).map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul>
                {errors.length > 10 && <p className="mt-1 text-xs text-[#A5412E]">And {errors.length - 10} more issue(s).</p>}
              </div>
            )}
            <div className="app-themed-scrollbar overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#FFFCF8] text-xs uppercase tracking-wide text-[#71809A]">
                  <tr><th className="px-4 py-3 font-semibold">Row</th><th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">SKU/Code</th><th className="px-4 py-3 font-semibold">Unit</th><th className="px-4 py-3 font-semibold">Product type</th><th className="px-4 py-3 font-semibold">Opening stock</th><th className="px-4 py-3 font-semibold">Status</th></tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-t border-[#EDF0F3]">
                      <td className="px-4 py-3 text-[#8798AD]">{index + 2}</td>
                      <td className="px-4 py-3 font-medium text-[#344B70]">{row.product?.["Product Name"] || "—"}</td>
                      <td className="px-4 py-3 text-[#536985]">{row.product?.["SKU/Code"] || "Auto-generate"}</td>
                      <td className="px-4 py-3 text-[#536985]">{row.product?.Unit || "—"}</td>
                      <td className="px-4 py-3 text-[#536985]">{row.product?.["Product Type"] || "—"}</td>
                      <td className="px-4 py-3 text-[#536985]">{row.product?.["Opening Stock"] || "—"}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${row.errors.length ? "bg-[#FFF3F0] text-[#A5412E]" : "bg-[#F0FAF3] text-[#287444]"}`}>{row.errors.length ? "Needs attention" : "Ready"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_8px_28px_rgba(40,57,97,0.06)]">
          <button type="button" onClick={() => setInstructionsOpen((open) => !open)} aria-expanded={instructionsOpen} className="flex w-full items-center justify-between gap-3 px-5 py-5 text-left sm:px-7">
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#F5852A]"><CircleHelp size={19} /></span>
              <span><span className="block text-lg font-semibold text-[#F5852A]">Import instructions</span><span className="mt-1 block text-sm text-[#71809A]">Required columns, allowed values, and field-specific guidance</span></span>
            </span>
            <ChevronDown size={18} className={`shrink-0 text-[#8798AD] transition-transform ${instructionsOpen ? "rotate-180" : ""}`} />
          </button>

          {instructionsOpen && (
            <>
              <div className="border-y border-[#F2EAE2] bg-[#FFFCF8] px-5 py-4 sm:px-7">
                <p className="text-sm font-semibold text-[#344B70]">Follow the instructions carefully before importing the file.</p>
                <p className="mt-1 text-sm text-[#71809A]">The CSV must contain these 37 columns in the exact order shown below. Required and conditional columns are marked.</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
                  <span className="rounded-full bg-[#FFF0E3] px-2.5 py-1 text-[#D86D22]">Required</span>
                  <span className="rounded-full bg-[#EEF4FB] px-2.5 py-1 text-[#4773A4]">Conditional requirement</span>
                  <span className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-[#71809A]">Optional</span>
                </div>
              </div>
              <div className="app-themed-scrollbar max-h-[620px] overflow-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-[#F7F8FA] text-xs uppercase tracking-wide text-[#60738D]">
                    <tr><th className="w-24 px-5 py-3.5 font-semibold">Column #</th><th className="w-[30%] px-4 py-3.5 font-semibold">Column name</th><th className="w-40 px-4 py-3.5 font-semibold">Requirement</th><th className="px-4 py-3.5 font-semibold">Instruction</th></tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.name} className="border-t border-[#EDF0F3] even:bg-[#FFFCF8]">
                        <td className="px-5 py-3 text-[#8798AD]">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-[#344B70]">{field.name}</td>
                        <td className="px-4 py-3">
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${field.required ? "bg-[#FFF0E3] text-[#D86D22]" : field.conditional ? "bg-[#EEF4FB] text-[#4773A4]" : "bg-[#F2F4F7] text-[#71809A]"}`}>
                            {field.required ? "Required" : field.conditional ? "Conditional" : "Optional"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px] leading-5 text-[#71809A]">{field.instruction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <p className="mt-4 text-center text-xs text-[#8798AD]">Imports are processed in your browser in this demo. Backend synchronization is not configured.</p>
      </div>
    </main>
  );
}

export default ImportProducts;