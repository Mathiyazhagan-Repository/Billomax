import { useMemo, useState } from "react";
import {
  Barcode,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Info,
  Minus,
  Package,
  Plus,
  Printer,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleProducts,
} from "../../../utils/businessStorage.js";

const fallbackProducts = [
  { id: "sample-1", name: "Amlodipine", sku: "0046", sellingPrice: 22.5, unit: "piece", type: "Single" },
  { id: "sample-2", name: "Paracetamol 500mg", sku: "0038", sellingPrice: 22.5, unit: "piece", type: "Single" },
  { id: "sample-3", name: "Baby Care Cream", sku: "SKU1325", sellingPrice: 12, unit: "jar", type: "Single" },
  { id: "sample-4", name: "Vitamin C Tablets", sku: "0056", sellingPrice: 22.5, unit: "piece", type: "Single" },
  { id: "sample-5", name: "Cetirizine 10mg", sku: "0061", sellingPrice: 10, unit: "strip", type: "Single" },
];

const initialOptions = [
  { id: "productName", label: "Product Name", checked: true, size: 15 },
  { id: "variation", label: "Product Variation (recommended)", checked: true, size: 17 },
  { id: "price", label: "Product Price", checked: true, size: 17 },
  { id: "businessName", label: "Business name", checked: true, size: 20 },
  { id: "packingDate", label: "Print packing date", checked: true, size: 12 },
];

const labelFormats = [
  { value: "20", label: "20 Labels per Sheet, Sheet Size: 8.5” × 11”" },
  { value: "30", label: "30 Labels per Sheet, Sheet Size: 8.5” × 11”" },
  { value: "40", label: "40 Labels per Sheet, Sheet Size: 8.5” × 11”" },
  { value: "custom", label: "Custom label size" },
];

function readProducts() {
  try {
    const saved = businessStorage.getItem("billomax-products");
    const fallback = getBusinessSampleProducts(fallbackProducts);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error("Saved product list is not valid.");
    return [...fallback, ...parsed.map((product, index) => ({
      ...product,
      id: product.id ?? `saved-${index}`,
    }))];
  } catch (error) {
    console.error("Could not load products for labels:", error);
    return getBusinessSampleProducts(fallbackProducts);
  }
}

function PrintLabels() {
  const [products] = useState(readProducts);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [options, setOptions] = useState(initialOptions);
  const [priceType, setPriceType] = useState("inclusive");
  const [labelFormat, setLabelFormat] = useState("20");
  const [barcodeType, setBarcodeType] = useState("Code 128");
  const [customWidth, setCustomWidth] = useState("50");
  const [customHeight, setCustomHeight] = useState("30");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const matches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return products
      .filter((product) => (
        `${product.name ?? ""} ${product.sku ?? ""}`.toLowerCase().includes(query) &&
        !selectedProducts.some((selected) => selected.id === product.id)
      ))
      .slice(0, 6);
  }, [products, search, selectedProducts]);

  const updateSelection = (id, key, value) => {
    setSelectedProducts((current) => current.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };

  const addProduct = (product) => {
    setSelectedProducts((current) => [...current, {
      ...product,
      labelCount: 1,
      packingDate: new Date().toISOString().slice(0, 10),
      sellingPriceGroup: "",
    }]);
    setSearch("");
    setShowResults(false);
  };

  const toggleOption = (id, checked) => {
    setOptions((current) => current.map((option) => option.id === id ? { ...option, checked } : option));
  };

  const updateOptionSize = (id, size) => {
    setOptions((current) => current.map((option) => option.id === id ? { ...option, size } : option));
  };

  const totalLabels = selectedProducts.reduce((total, product) => total + (Number(product.labelCount) || 0), 0);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .label-print-area, .label-print-area * { visibility: visible !important; }
          .label-print-area { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; padding: 0 !important; background: white !important; }
          .label-grid { display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 4mm !important; }
          .print-label { break-inside: avoid !important; border: 1px solid #bbb !important; box-shadow: none !important; }
        }
      `}</style>
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium text-[#8798AD]">Products <span className="px-1">/</span> Label printing</p>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">Print Labels</h1>
              <span title="Add products, choose label information and barcode settings, preview the labels, then print." className="inline-flex text-[#4DBFD0]"><CircleHelp size={17} /></span>
            </div>
            <p className="mt-1 text-sm text-[#71809A]">Build a clean, print-ready sheet for your products.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#E4EAF2] bg-white px-3.5 py-2 text-sm text-[#536985] shadow-sm">
            <Barcode size={17} className="text-[#5584BC]" />
            <span><strong className="font-semibold text-[#283961]">{totalLabels}</strong> labels selected</span>
          </div>
        </div>

        <section className="mb-5 rounded-2xl border border-[#F0E4D7] bg-white p-5 shadow-[0_8px_28px_rgba(40,57,97,0.06)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#F5852A]"><Package size={19} /></span>
            <div>
              <h2 className="text-lg font-semibold text-[#F5852A]">Add products to generate labels</h2>
              <p className="mt-1 text-sm text-[#71809A]">Search by product name or SKU and add one or more products.</p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              <div className="flex h-11 overflow-hidden rounded-xl border border-[#C8D8EB] bg-white shadow-sm focus-within:border-[#5791D2] focus-within:ring-2 focus-within:ring-[#5584BC]/15">
                <span className="flex w-11 shrink-0 items-center justify-center border-r border-[#E5EAF0] bg-[#F7FAFD] text-[#5584BC]"><Search size={17} /></span>
                <input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setShowResults(true); }}
                  onFocus={() => setShowResults(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setShowResults(false);
                    if (event.key === "Enter" && matches[0]) {
                      event.preventDefault();
                      addProduct(matches[0]);
                    }
                  }}
                  placeholder="Enter product name or SKU to print labels"
                  className="min-w-0 flex-1 px-3 text-sm text-[#33496F] outline-none placeholder:text-[#98A6B8]"
                />
                {search && <button type="button" onClick={() => { setSearch(""); setShowResults(false); }} aria-label="Clear search" className="px-3 text-[#8798AD] hover:text-[#E87928]"><X size={16} /></button>}
              </div>
              {showResults && matches.length > 0 && (
                <div className="app-themed-scrollbar absolute left-0 right-0 top-12 z-20 max-h-64 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl">
                  {matches.map((product) => (
                    <button key={product.id} type="button" onClick={() => addProduct(product)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#FFFAF5]">
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F2F6FB] text-[#5584BC]"><Package size={17} /></span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-[#344B70]">{product.name}</span>
                          <span className="mt-0.5 block text-xs text-[#8798AD]">SKU: {product.sku || "—"} · {product.unit || "piece"}</span>
                        </span>
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF4FB] text-[#5584BC]"><Plus size={15} /></span>
                    </button>
                  ))}
                </div>
              )}
              {showResults && search.trim() && matches.length === 0 && (
                <div className="absolute left-0 right-0 top-12 z-20 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#71809A] shadow-xl">No matching products found.</div>
              )}
            </div>
          </div>

          <div className="app-themed-scrollbar mt-5 overflow-x-auto rounded-xl border border-[#E8EDF2]">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-[#FFFCF8] text-xs uppercase tracking-wide text-[#71809A]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Products</th>
                  <th className="w-40 px-4 py-3 font-semibold">No. of labels</th>
                  <th className="w-48 px-4 py-3 font-semibold">Packing Date</th>
                  <th className="px-4 py-3 font-semibold">Selling Price Group</th>
                  <th className="w-12 px-3 py-3" aria-label="Remove product" />
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr key={product.id} className="border-t border-[#EDF0F3]">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#344B70]">{product.name}</div>
                      <div className="mt-0.5 text-xs text-[#8798AD]">SKU: {product.sku || "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex h-9 w-32 items-center overflow-hidden rounded-lg border border-[#D6DFEA]">
                        <button type="button" onClick={() => updateSelection(product.id, "labelCount", Math.max(1, Number(product.labelCount) - 1))} aria-label={`Decrease ${product.name} label count`} className="flex h-full w-9 items-center justify-center bg-[#F7FAFD] text-[#60738D] hover:bg-[#EEF4FB]"><Minus size={14} /></button>
                        <input type="number" min="1" value={product.labelCount} onChange={(event) => updateSelection(product.id, "labelCount", Math.max(1, Number(event.target.value) || 1))} className="h-full min-w-0 flex-1 text-center text-sm text-[#344B70] outline-none" />
                        <button type="button" onClick={() => updateSelection(product.id, "labelCount", Number(product.labelCount) + 1)} aria-label={`Increase ${product.name} label count`} className="flex h-full w-9 items-center justify-center bg-[#F7FAFD] text-[#60738D] hover:bg-[#EEF4FB]"><Plus size={14} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex h-9 w-44 items-center gap-2 rounded-lg border border-[#D6DFEA] px-2.5 text-[#60738D] focus-within:border-[#F5A15D]">
                        <CalendarDays size={15} className="shrink-0 text-[#8798AD]" />
                        <input type="date" value={product.packingDate} onChange={(event) => updateSelection(product.id, "packingDate", event.target.value)} className="min-w-0 flex-1 text-xs text-[#536985] outline-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select value={product.sellingPriceGroup} onChange={(event) => updateSelection(product.id, "sellingPriceGroup", event.target.value)} className="h-9 w-full max-w-xs rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm text-[#536985] outline-none focus:border-[#F5A15D]">
                        <option value="">Default selling price</option>
                        <option value="Retail">Retail</option>
                        <option value="Wholesale">Wholesale</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button type="button" onClick={() => setSelectedProducts((current) => current.filter((item) => item.id !== product.id))} aria-label={`Remove ${product.name}`} className="rounded-lg p-2 text-[#9AA7B8] transition hover:bg-[#FFF1EF] hover:text-[#C35445]"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {selectedProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F6FB] text-[#7B9CC0]"><Package size={19} /></span>
                        <span className="text-sm font-medium text-[#536985]">No products added yet</span>
                        <span className="mt-1 text-xs text-[#98A6B8]">Search above to add products to the label sheet.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-[#F0E4D7] bg-white p-5 shadow-[0_8px_28px_rgba(40,57,97,0.06)] sm:p-6">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FB] text-[#5584BC]"><Settings2 size={19} /></span>
              <div>
                <h2 className="text-lg font-semibold text-[#F5852A]">Information to show in labels</h2>
                <p className="mt-1 text-sm text-[#71809A]">Choose label content and text sizes for the printed sheet.</p>
              </div>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-xl border border-[#E8EDF2] sm:grid-cols-2 xl:grid-cols-4">
            {options.map((option) => (
              <div key={option.id} className="min-h-[104px] border-b border-r border-[#E8EDF2] p-3.5">
                <label className="flex min-h-7 cursor-pointer items-start gap-2 text-xs font-semibold leading-5 text-[#344B70]">
                  <input type="checkbox" checked={option.checked} onChange={(event) => toggleOption(option.id, event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#5584BC]" />
                  {option.label}
                </label>
                <div className="mt-2 flex h-9 overflow-hidden rounded-lg border border-[#D6DFEA]">
                  <span className="flex items-center border-r border-[#D6DFEA] bg-[#F7FAFD] px-3 text-xs text-[#71809A]">Size</span>
                  <input type="number" min="6" max="36" value={option.size} onChange={(event) => updateOptionSize(option.id, Math.min(36, Math.max(6, Number(event.target.value) || 6)))} disabled={!option.checked} className="min-w-0 flex-1 px-3 text-sm text-[#536985] outline-none disabled:bg-[#FAFBFC] disabled:text-[#AAB5C2]" />
                </div>
              </div>
            ))}
            <div className="min-h-[104px] p-3.5">
              <label className="mb-2 block text-xs font-semibold text-[#344B70]">Show Price</label>
              <select value={priceType} onChange={(event) => setPriceType(event.target.value)} className="h-9 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm text-[#536985] outline-none focus:border-[#F5A15D]">
                <option value="inclusive">Inc. tax</option>
                <option value="exclusive">Exc. tax</option>
                <option value="none">Hide price</option>
              </select>
            </div>
          </div>

          <div className="mt-5 border-t border-[#EDF0F3] pt-5">
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#344B70]"><Barcode size={15} className="text-[#5584BC]" /> Barcode setting</label>
            <div className="grid gap-3 sm:grid-cols-[minmax(240px,360px)_minmax(220px,1fr)]">
              <div className="flex h-10 items-center overflow-hidden rounded-lg border border-[#D6DFEA]">
                <span className="flex h-full w-10 items-center justify-center border-r border-[#D6DFEA] bg-[#F7FAFD] text-[#5584BC]"><Settings2 size={15} /></span>
                <select value={labelFormat} onChange={(event) => setLabelFormat(event.target.value)} className="h-full min-w-0 flex-1 bg-white px-3 text-xs text-[#536985] outline-none focus:ring-2 focus:ring-[#F5852A]/10">
                  {labelFormats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}
                </select>
              </div>
              <select value={barcodeType} onChange={(event) => setBarcodeType(event.target.value)} className="h-10 rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm text-[#536985] outline-none focus:border-[#F5A15D]">
                <option>Code 128</option>
                <option>Code 39</option>
                <option>EAN-13</option>
                <option>UPC-A</option>
                <option>No barcode</option>
              </select>
            </div>
            {labelFormat === "custom" && (
              <div className="mt-3 grid max-w-md grid-cols-2 gap-3">
                <label className="text-xs font-medium text-[#63768D]">Width (mm)<input type="number" min="10" value={customWidth} onChange={(event) => setCustomWidth(event.target.value)} className="mt-1.5 h-9 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm text-[#536985] outline-none focus:border-[#F5A15D]" /></label>
                <label className="text-xs font-medium text-[#63768D]">Height (mm)<input type="number" min="10" value={customHeight} onChange={(event) => setCustomHeight(event.target.value)} className="mt-1.5 h-9 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm text-[#536985] outline-none focus:border-[#F5A15D]" /></label>
              </div>
            )}
            <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-[#8798AD]"><Info size={14} className="mt-0.5 shrink-0 text-[#5584BC]" />Choose the label sheet that matches your paper stock. Preview before printing to avoid wasting labels.</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF0F3] pt-5">
            <p className="text-sm text-[#71809A]">Selected <span className="font-semibold text-[#344B70]">{selectedProducts.length}</span> products · <span className="font-semibold text-[#344B70]">{totalLabels}</span> labels</p>
            <button type="button" disabled={!selectedProducts.length} onClick={() => setPreviewOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-7 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">
              Preview labels <ChevronDown size={15} className="-rotate-90" />
            </button>
          </div>
        </section>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/50 p-3 backdrop-blur-[2px] sm:p-6" onClick={() => setPreviewOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="label-preview-heading" onClick={(event) => event.stopPropagation()} className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_20px_60px_rgba(25,43,80,0.24)]">
            <header className="flex items-center justify-between gap-3 border-b border-[#F0EAE3] px-5 py-4">
              <div>
                <p className="text-xs font-medium text-[#8798AD]">Print setup</p>
                <h2 id="label-preview-heading" className="text-lg font-semibold text-[#283961]">Label preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white"><Printer size={15} /> Print</button>
                <button type="button" onClick={() => setPreviewOpen(false)} aria-label="Close preview" className="rounded-lg p-2 text-[#8798AD] hover:bg-[#FFF0E3] hover:text-[#E87928]"><X size={18} /></button>
              </div>
            </header>
            <div className="label-print-area app-themed-scrollbar overflow-y-auto bg-[#F4F6F9] p-5 sm:p-8">
              <div className={`label-grid mx-auto grid max-w-5xl gap-3 ${labelFormat === "30" ? "grid-cols-3" : labelFormat === "40" ? "grid-cols-4" : "grid-cols-2"} ${labelFormat === "custom" ? "grid-cols-2" : ""}`}>
                {selectedProducts.flatMap((product) => Array.from({ length: Number(product.labelCount) || 1 }, (_, index) => (
                  <article key={`${product.id}-${index}`} className="print-label relative flex min-h-32 flex-col items-center justify-center rounded-xl border border-[#DCE3EC] bg-white p-4 text-center shadow-sm" style={labelFormat === "custom" ? { minHeight: `${Math.max(20, Number(customHeight) || 30) * 2}px` } : undefined}>
                    {options.find((option) => option.id === "businessName")?.checked && <span className="mb-1 text-[#283961]" style={{ fontSize: `${options.find((option) => option.id === "businessName").size}px` }}>{getActiveBusinessStorage()}</span>}
                    {options.find((option) => option.id === "productName")?.checked && <strong className="line-clamp-2 text-[#283961]" style={{ fontSize: `${options.find((option) => option.id === "productName").size}px` }}>{product.name}</strong>}
                    {options.find((option) => option.id === "variation")?.checked && <span className="mt-1 text-xs text-[#71809A]" style={{ fontSize: `${options.find((option) => option.id === "variation").size}px` }}>{product.variation || product.unit || "Product"}</span>}
                    {options.find((option) => option.id === "packingDate")?.checked && <span className="mt-1 text-[10px] text-[#71809A]">{product.packingDate}</span>}
                    {priceType !== "none" && options.find((option) => option.id === "price")?.checked && <span className="mt-1 font-semibold text-[#344B70]" style={{ fontSize: `${options.find((option) => option.id === "price").size}px` }}>₹ {Number(product.sellingPrice ?? 0).toFixed(2)}{priceType === "inclusive" ? " incl. tax" : " excl. tax"}</span>}
                    {barcodeType !== "No barcode" && (
                      <div className="mt-2 w-full">
                        <div className="mx-auto flex h-8 max-w-[180px] items-end justify-center gap-[2px] overflow-hidden">
                          {Array.from({ length: 36 }, (_, barIndex) => <span key={barIndex} className="bg-[#283961]" style={{ width: barIndex % 3 === 0 ? 3 : 1, height: `${12 + ((barIndex * 7 + String(product.sku).length) % 18)}px` }} />)}
                        </div>
                        <span className="mt-0.5 block text-[10px] tracking-widest text-[#344B70]">{product.sku || product.id}</span>
                      </div>
                    )}
                  </article>
                )))}
              </div>
            </div>
            <footer className="flex items-center justify-between border-t border-[#F0EAE3] bg-white px-5 py-3 text-xs text-[#71809A]">
              <span>{totalLabels} label{totalLabels === 1 ? "" : "s"} · {labelFormats.find((format) => format.value === labelFormat)?.label ?? `${customWidth} × ${customHeight} mm`}</span>
              <button type="button" onClick={() => setPreviewOpen(false)} className="h-9 rounded-lg border border-[#D8E0EA] px-4 text-sm font-medium text-[#60738D] hover:bg-[#FFFCF8]">Close preview</button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

export default PrintLabels;