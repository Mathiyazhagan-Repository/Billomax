import { useRef, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  CircleHelp,
  FileSpreadsheet,
  Info,
  Upload,
  X,
} from "lucide-react";

const columns = [
  "Product Name",
  "SKU/Code",
  "Purchase Price Exc. Tax",
  "Purchase Price Inc. Tax",
  "Margin (%)",
  "Selling Price Exc. Tax",
  "Selling Price Inc. Tax",
  "Selling Price Group Prices",
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\r" || character === "\n") && !quoted) {
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
      if (character === "\r" && text[index + 1] === "\n") index += 1;
    } else {
      cell += character;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

function downloadCsv(rows) {
  const csv = `\uFEFF${[columns, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "product_prices.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getStoredProducts() {
  try {
    const value = window.localStorage.getItem("billomax-products");
    if (!value) return [];
    const products = JSON.parse(value);
    if (!Array.isArray(products)) {
      throw new Error("Saved products are not in the expected format.");
    }
    return products;
  } catch (error) {
    console.error("Could not read products for price export:", error);
    throw new Error("Product data could not be read from this browser.");
  }
}

function UpdatePrice({ onNavigate }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isImporting, setIsImporting] = useState(false);
  const inputRef = useRef(null);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleExport = () => {
    try {
      const products = getStoredProducts();
      const rows = products.map((product) => [
        product.name ?? "",
        product.sku ?? "",
        product.purchasePrice ?? "",
        product.purchasePriceIncTax ?? "",
        product.margin ?? "",
        product.sellingPrice ?? "",
        product.sellingPriceIncTax ?? "",
        Object.entries(product.priceGroups ?? {})
          .map(([group, price]) => `${group}:${price}`)
          .join("; "),
      ]);
      downloadCsv(rows);
      showMessage(
        products.length
          ? `Exported prices for ${products.length} locally saved product${products.length === 1 ? "" : "s"}. Keep Product Name, SKU/Code, and column headers unchanged.`
          : "Downloaded the product-price CSV template. Product rows appear after products have been saved in this browser.",
        "success",
      );
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleFileChange = (selectedFile) => {
    setMessage("");
    if (!selectedFile) {
      setFile(null);
      return;
    }
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      showMessage("Please select a CSV file exported from this page.", "error");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      showMessage("The file is larger than 10 MB. Please choose a smaller file.", "error");
      return;
    }
    setFile(selectedFile);
  };

  const handleImport = async (event) => {
    event.preventDefault();
    if (!file) {
      showMessage("Choose a product-price CSV file before submitting.", "error");
      return;
    }

    setIsImporting(true);
    try {
      const rows = parseCsv(await file.text());
      const header = rows[0]?.map((value, index) =>
        index === 0 ? value.replace(/^\uFEFF/, "").trim() : value.trim(),
      ) ?? [];
      if (header.length !== columns.length || columns.some((column, index) => header[index] !== column)) {
        showMessage("The CSV headers or column order do not match the exported product-price template.", "error");
        return;
      }

      const products = getStoredProducts();
      const bySku = new Map(products.map((product) => [String(product.sku ?? "").trim(), product]));
      const updatedProducts = [...products];
      const overrides = {};
      const errors = [];
      let updatedCount = 0;

      rows.slice(1).forEach((row, rowIndex) => {
        if (row.length !== columns.length) {
          errors.push(`Row ${rowIndex + 2} has ${row.length} columns; expected ${columns.length}.`);
          return;
        }
        const [productName, skuRaw, purchaseEx, purchaseInc, marginRaw, sellingEx, sellingInc, groupPricesRaw] = row;
        const sku = skuRaw.trim();
        if (!sku) {
          errors.push(`Row ${rowIndex + 2} is missing SKU/Code.`);
          return;
        }
        const product = bySku.get(sku);
        if (!product) {
          errors.push(`Row ${rowIndex + 2}: SKU "${sku}" was not found in locally saved products.`);
          return;
        }
        if (productName.trim() !== String(product.name ?? "").trim()) {
          errors.push(`Row ${rowIndex + 2}: Product Name for SKU "${sku}" was changed. Restore the original name.`);
          return;
        }

        const prices = { ...overrides[sku] };
        const priceColumns = [
          ["purchasePrice", purchaseEx, "Purchase Price Exc. Tax"],
          ["purchasePriceIncTax", purchaseInc, "Purchase Price Inc. Tax"],
          ["sellingPrice", sellingEx, "Selling Price Exc. Tax"],
          ["sellingPriceIncTax", sellingInc, "Selling Price Inc. Tax"],
        ];
        let invalidPrice = false;
        priceColumns.forEach(([key, value, label]) => {
          if (value.trim() === "") return;
          const amount = Number(value);
          if (!Number.isFinite(amount) || amount < 0) {
            errors.push(`Row ${rowIndex + 2}: ${label} must be a valid non-negative amount.`);
            invalidPrice = true;
          } else {
            prices[key] = amount;
          }
        });
        if (marginRaw.trim() !== "") {
          const margin = Number(marginRaw);
          if (!Number.isFinite(margin)) {
            errors.push(`Row ${rowIndex + 2}: Margin (%) must be a valid number.`);
            invalidPrice = true;
          } else {
            prices.margin = margin;
          }
        }
        if (invalidPrice) return;

        if (groupPricesRaw.trim()) {
          const groupPrices = {};
          groupPricesRaw.split(";").forEach((entry) => {
            const separator = entry.lastIndexOf(":");
            if (separator <= 0) {
              errors.push(`Row ${rowIndex + 2}: Group prices should use "Group name:price" entries separated by semicolons.`);
              invalidPrice = true;
              return;
            }
            const groupName = entry.slice(0, separator).trim();
            const groupPrice = Number(entry.slice(separator + 1).trim());
            if (!groupName || !Number.isFinite(groupPrice) || groupPrice < 0) {
              errors.push(`Row ${rowIndex + 2}: Group prices must have a name and non-negative amount.`);
              invalidPrice = true;
              return;
            }
            groupPrices[groupName] = groupPrice;
          });
          if (!invalidPrice) prices.priceGroups = groupPrices;
        }
        if (invalidPrice) return;

        overrides[sku] = prices;
        updatedCount += 1;
      });

      if (errors.length) {
        showMessage(`No price changes were applied. ${errors.slice(0, 3).join(" ")}${errors.length > 3 ? ` Plus ${errors.length - 3} more issue(s).` : ""}`, "error");
        return;
      }
      if (!updatedCount) {
        showMessage("The CSV contains no product price rows to import.", "error");
        return;
      }

      const updated = updatedProducts.map((product) => {
        const priceChanges = overrides[String(product.sku ?? "").trim()];
        return priceChanges ? { ...product, ...priceChanges } : product;
      });
      window.localStorage.setItem("billomax-products", JSON.stringify(updated));
      window.localStorage.setItem("billomax-product-price-overrides", JSON.stringify(overrides));
      showMessage(`Successfully updated prices for ${updatedCount} product${updatedCount === 1 ? "" : "s"}. Product names and SKUs were left unchanged.`, "success");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("Could not import product prices:", error);
      showMessage(error.message || "The CSV file could not be processed.", "error");
    } finally {
      setIsImporting(false);
    }
  };

  const noticeClass = messageType === "error"
    ? "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]"
    : messageType === "success"
      ? "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"
      : "border-[#D9E6F5] bg-[#F3F7FC] text-[#536985]";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium text-[#8798AD]">Products <span className="px-1">/</span> Price management</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">Update Price</h1>
            <p className="mt-1 text-sm text-[#71809A]">Export your product prices, update the spreadsheet, and import it back.</p>
          </div>
          <button type="button" onClick={() => onNavigate?.("List Products")} className="h-9 rounded-lg border border-[#D8E0EA] bg-white px-3.5 text-sm font-medium text-[#60738D] transition hover:border-[#F5A15D] hover:text-[#E87928]">
            Back to products
          </button>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_8px_28px_rgba(40,57,97,0.06)]">
          <div className="border-b border-[#F2EAE2] px-5 py-5 sm:px-8">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#F5852A]">
                <FileSpreadsheet size={19} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#F5852A]">Import / Export Product Price</h2>
                <p className="mt-1 text-sm text-[#71809A]">Update purchase, selling, tax-inclusive, and selling-price-group prices using a CSV file.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-2 lg:gap-12">
            <div className="rounded-xl border border-[#E6EAF0] bg-[#FFFCF8] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <ArrowDownToLine size={17} className="text-[#5584BC]" />
                <h3 className="text-sm font-semibold text-[#283961]">Export current prices</h3>
              </div>
              <p className="mb-5 text-sm leading-6 text-[#71809A]">Download a spreadsheet containing saved product prices. Edit price values only; keep product names, SKUs, headers, and column order unchanged.</p>
              <button type="button" onClick={handleExport} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#6250EF] to-[#397FF1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                <ArrowDownToLine size={17} /> Export product prices
              </button>
            </div>

            <form onSubmit={handleImport} className="rounded-xl border border-[#E6EAF0] bg-white p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Upload size={17} className="text-[#5584BC]" />
                <h3 className="text-sm font-semibold text-[#283961]">Import updated prices</h3>
              </div>
              <label className="mb-2 block text-xs font-semibold text-[#344B70]" htmlFor="product-price-file">File to import</label>
              <input
                ref={inputRef}
                id="product-price-file"
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
                className="block w-full cursor-pointer rounded-lg border border-[#D6DFEA] bg-[#FFFCF8] text-sm text-[#536985] file:mr-3 file:cursor-pointer file:border-0 file:bg-[#EEF4FB] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-[#4773A4] hover:file:bg-[#E3EDF8]"
              />
              <p className="mt-2 text-xs text-[#8798AD]">CSV file only · Maximum size 10 MB</p>
              {file && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-[#E6EAF0] bg-[#FFFCF8] px-3 py-2">
                  <span className="truncate text-xs font-medium text-[#536985]">{file.name}</span>
                  <button type="button" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }} aria-label="Remove selected file" className="rounded p-1 text-[#8798AD] hover:bg-[#FFF0E3] hover:text-[#E87928]"><X size={15} /></button>
                </div>
              )}
              <button disabled={isImporting} type="submit" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#6250EF] to-[#397FF1] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
                <Upload size={15} /> {isImporting ? "Validating..." : "Submit"}
              </button>
            </form>
          </div>

          {message && (
            <div className={`mx-5 mb-5 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm sm:mx-8 ${noticeClass}`} role="status">
              <span className="flex items-start gap-2">
                {messageType === "success" ? <Check size={17} className="mt-0.5 shrink-0" /> : <Info size={17} className="mt-0.5 shrink-0" />}
                {message}
              </span>
              <button type="button" onClick={() => setMessage("")} aria-label="Dismiss message"><X size={16} /></button>
            </div>
          )}

          <div className="border-t border-[#F2EAE2] bg-[#FFFCF8] px-5 py-5 sm:px-8 sm:py-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#283961]">
              <CircleHelp size={17} className="text-[#5584BC]" />
              Instructions
            </h3>
            <ol className="grid gap-x-8 gap-y-2 text-sm leading-6 text-[#60738D] md:grid-cols-2">
              <li className="flex gap-2"><span className="font-semibold text-[#F5852A]">1.</span> Export product prices to download the editable CSV.</li>
              <li className="flex gap-2"><span className="font-semibold text-[#F5852A]">2.</span> Update purchase, selling, tax-inclusive, or group prices.</li>
              <li className="flex gap-2"><span className="font-semibold text-[#F5852A]">3.</span> Do not change product names, SKU/Code values, headers, or column order.</li>
              <li className="flex gap-2"><span className="font-semibold text-[#F5852A]">4.</span> Save as CSV and select the file above to validate and import.</li>
            </ol>
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-[#F2F6FB] px-3 py-2.5 text-xs leading-5 text-[#60738D]">
              <Info size={15} className="mt-0.5 shrink-0 text-[#5584BC]" />
              Selling-price-group values use <span className="font-medium">Group name:price</span>, separated by semicolons. Price changes are stored locally in this browser; a server-side import is not connected.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default UpdatePrice;