import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpDown,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Columns3,
  FileSpreadsheet,
  Filter,
  History,
  Package,
  Pencil,
  Plus,
  Printer,
  Search,
  SlidersHorizontal,
  Upload,
  X,
} from "lucide-react";
import {
  businessStorage,
  getBusinessSampleProducts,
} from "../../../utils/businessStorage.js";

const initialProducts = [
  { id: 1, name: "Amlodipine", location: "Pharmacy", purchasePrice: 18, sellingPrice: 22.5, stock: 0, unit: "piece", type: "Single", category: "", brand: "", tax: "", sku: "0046", molecules: "", notForSelling: false },
  { id: 2, name: "Amlodipine", location: "Pharmacy", purchasePrice: 18, sellingPrice: 22.5, stock: 4996, unit: "piece", type: "Single", category: "", brand: "", tax: "", sku: "0045", molecules: "", notForSelling: false },
  { id: 3, name: "Baby Care Cream", location: "Pharmacy", purchasePrice: 9.5, sellingPrice: 12, stock: 5, unit: "jar", type: "Single", category: "Baby Care Products", brand: "bartell drugs", tax: "", sku: "SKU1325", molecules: "", notForSelling: false },
  { id: 4, name: "Paracetamol 500mg", location: "Pharmacy", purchasePrice: 16, sellingPrice: 22.5, stock: 197, unit: "piece", type: "Single", category: "Health & Wellness Products", brand: "", tax: "", sku: "0038", molecules: "Paracetamol", notForSelling: false },
  { id: 5, name: "Vitamin C Tablets", location: "Pharmacy", purchasePrice: 15, sellingPrice: 22.5, stock: 0, unit: "piece", type: "Single", category: "Health & Wellness Products", brand: "HealthPlus", tax: "5%", sku: "0056", molecules: "Ascorbic acid", notForSelling: true },
  { id: 6, name: "Cetirizine 10mg", location: "Pharmacy", purchasePrice: 7, sellingPrice: 10, stock: 84, unit: "strip", type: "Single", category: "Allergy Relief", brand: "MediCare", tax: "5%", sku: "0061", molecules: "Cetirizine", notForSelling: false },
  { id: 7, name: "Antiseptic Liquid", location: "Pharmacy", purchasePrice: 42, sellingPrice: 55, stock: 32, unit: "bottle", type: "Single", category: "First Aid", brand: "CareWell", tax: "12%", sku: "0067", molecules: "", notForSelling: false },
  { id: 8, name: "Cough Syrup", location: "Pharmacy", purchasePrice: 58, sellingPrice: 72, stock: 19, unit: "bottle", type: "Single", category: "Cold & Cough", brand: "Wellness", tax: "12%", sku: "0072", molecules: "Dextromethorphan", notForSelling: false },
  { id: 9, name: "Ibuprofen 200mg", location: "Pharmacy", purchasePrice: 21, sellingPrice: 28, stock: 43, unit: "strip", type: "Single", category: "Pain Relief", brand: "MediCare", tax: "5%", sku: "0078", molecules: "Ibuprofen", notForSelling: false },
  { id: 10, name: "Digital Thermometer", location: "Pharmacy", purchasePrice: 110, sellingPrice: 149, stock: 12, unit: "piece", type: "Single", category: "Medical Devices", brand: "HealthPlus", tax: "12%", sku: "0081", molecules: "", notForSelling: false },
];

const columns = [
  { key: "name", label: "Product", sortable: true },
  { key: "location", label: "Business Location", sortable: true },
  { key: "purchasePrice", label: "Unit Purchase Price", sortable: true },
  { key: "sellingPrice", label: "Selling Price", sortable: true },
  { key: "stock", label: "Current stock", sortable: true },
  { key: "type", label: "Product Type", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "brand", label: "Brand", sortable: true },
  { key: "tax", label: "Tax", sortable: true },
  { key: "sku", label: "SKU/Code", sortable: true },
  { key: "molecules", label: "Molecules", sortable: true },
];

const stockColumns = [
  { key: "sku", label: "SKU", sortable: true },
  { key: "name", label: "Product", sortable: true },
  { key: "variation", label: "Variation", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "location", label: "Location", sortable: true },
  { key: "unitSellingPrice", label: "Unit Selling Price", sortable: true },
  { key: "currentStock", label: "Current stock", sortable: true },
  { key: "stockPurchaseValue", label: "Current Stock Value (By purchase price)", sortable: true },
  { key: "stockSaleValue", label: "Current Stock Value (By sale price)", sortable: true },
  { key: "potentialProfit", label: "Potential profit", sortable: true },
  { key: "totalSold", label: "Total unit sold", sortable: true },
  { key: "transferred", label: "Total Unit Transferred", sortable: true },
  { key: "adjusted", label: "Total Unit Adjusted", sortable: true },
];

const stockMetricDefaults = [
  { sold: 53, transferred: 0, adjusted: 0 },
  { sold: 42, transferred: 0, adjusted: 0 },
  { sold: 0, transferred: 0, adjusted: 0 },
  { sold: 3, transferred: 0, adjusted: 2 },
  { sold: 18, transferred: 0, adjusted: 0 },
  { sold: 12, transferred: 0, adjusted: 0 },
  { sold: 8, transferred: 0, adjusted: 0 },
  { sold: 7, transferred: 0, adjusted: 0 },
  { sold: 21, transferred: 0, adjusted: 0 },
  { sold: 9, transferred: 0, adjusted: 0 },
];

const money = (amount) => `₹ ${Number(amount).toFixed(2)}`;

function getStockValues(product, index) {
  const metrics = stockMetricDefaults[product.id - 1] ?? stockMetricDefaults[index] ?? { sold: 0, transferred: 0, adjusted: 0 };
  const stockPurchaseValue = product.stock * product.purchasePrice;
  const stockSaleValue = product.stock * product.sellingPrice;
  return {
    ...product,
    variation: product.variation ?? "",
    unitSellingPrice: product.sellingPrice,
    currentStock: product.stock,
    stockPurchaseValue,
    stockSaleValue,
    potentialProfit: stockSaleValue - stockPurchaseValue,
    totalSold: product.totalSold ?? metrics.sold,
    transferred: product.transferred ?? metrics.transferred,
    adjusted: product.adjusted ?? metrics.adjusted,
  };
}

function downloadStockCsv(products, customFields) {
  const headers = [
    ...stockColumns.map((column) => column.label),
    ...customFields.map((field) => field.name),
  ];
  const rows = products.map((product, index) => {
    const stock = getStockValues(product, index);
    return [
      stock.sku,
      stock.name,
      stock.variation,
      stock.category,
      stock.location,
      stock.unitSellingPrice,
      `${stock.currentStock} ${stock.unit}`,
      stock.stockPurchaseValue,
      stock.stockSaleValue,
      stock.potentialProfit,
      `${stock.totalSold} ${stock.unit}`,
      `${stock.transferred} ${stock.unit}`,
      `${stock.adjusted} ${stock.unit}`,
      ...customFields.map((field) => product.customValues?.[field.id] ?? ""),
    ];
  });
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "stock-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function ExportButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#D7E0EB] bg-white px-2.5 text-xs font-medium text-[#60738D] transition hover:border-[#F5A15D] hover:text-[#E87928]"
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function downloadCsv(products) {
  const headers = ["Product", "Business Location", "Unit Purchase Price", "Selling Price", "Current stock", "Product Type", "Category", "Brand", "Tax", "SKU/Code", "Molecules"];
  const rows = products.map((product) => [
    product.name,
    product.location,
    product.purchasePrice,
    product.sellingPrice,
    `${product.stock} ${product.unit}`,
    product.type,
    product.category,
    product.brand,
    product.tax,
    product.sku,
    product.molecules,
  ]);
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "products.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function ListProducts({ onNavigate }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = businessStorage.getItem("billomax-products");
      const savedProducts = stored ? JSON.parse(stored) : [];
      const storedOverrides = businessStorage.getItem("billomax-product-price-overrides");
      const priceOverrides = storedOverrides ? JSON.parse(storedOverrides) : {};
      if (!Array.isArray(savedProducts) || !priceOverrides || typeof priceOverrides !== "object" || Array.isArray(priceOverrides)) {
        throw new Error("Saved product data is not in the expected format.");
      }
      const defaults = getBusinessSampleProducts(initialProducts);
      return [...defaults, ...savedProducts].map((product) => ({
        ...product,
        ...(priceOverrides[String(product.sku ?? "").trim()] ?? {}),
      }));
    } catch (error) {
      console.error("Could not load locally saved products:", error);
      return getBusinessSampleProducts(initialProducts);
    }
  });
  const [activeTab, setActiveTab] = useState("products");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [productType, setProductType] = useState("");
  const [unit, setUnit] = useState("");
  const [tax, setTax] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [notForSelling, setNotForSelling] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sort, setSort] = useState({ key: "name", direction: "asc" });
  const [visibleColumns, setVisibleColumns] = useState(columns.map((column) => column.key));
  const [visibleStockColumns, setVisibleStockColumns] = useState(stockColumns.map((column) => column.key));
  const [customFields, setCustomFields] = useState([]);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [customFieldName, setCustomFieldName] = useState("");
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [actionsFor, setActionsFor] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = !query || Object.values(product).some((value) => String(value).toLowerCase().includes(query));
      const matchesCategory = !category || product.category === category;
      const matchesBrand = !brand || product.brand === brand;
      const matchesType = !productType || product.type === productType;
      const matchesUnit = !unit || product.unit === unit;
      const matchesTax = !tax || product.tax === tax;
      const matchesLocation = !businessLocation || product.location === businessLocation;
      const matchesNotForSelling = !notForSelling || product.notForSelling;
      return matchesSearch && matchesCategory && matchesBrand && matchesType && matchesUnit && matchesTax && matchesLocation && matchesNotForSelling;
    });

    return [...filtered].sort((a, b) => {
      const left = a[sort.key] ?? getStockValues(a)[sort.key];
      const right = b[sort.key] ?? getStockValues(b)[sort.key];
      const comparison = typeof left === "number"
        ? left - right
        : String(left).localeCompare(String(right), undefined, { numeric: true });
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [products, search, category, brand, productType, unit, tax, businessLocation, notForSelling, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allPageSelected = pageItems.length > 0 && pageItems.every((item) => selectedIds.includes(item.id));
  const visibleColumnsData = columns.filter((column) => visibleColumns.includes(column.key));
  const stockColumnsData = [
    ...stockColumns,
    ...customFields.map((field) => ({ key: field.id, label: field.name, customFieldId: field.id })),
  ].filter((column) => visibleStockColumns.includes(column.key));
  const stockRows = pageItems.map((product, index) => getStockValues(product, index));
  const stockTotals = filteredProducts.reduce((totals, product, index) => {
    const stock = getStockValues(product, index);
    return {
      currentStock: totals.currentStock + stock.currentStock,
      stockPurchaseValue: totals.stockPurchaseValue + stock.stockPurchaseValue,
      stockSaleValue: totals.stockSaleValue + stock.stockSaleValue,
      potentialProfit: totals.potentialProfit + stock.potentialProfit,
      totalSold: totals.totalSold + stock.totalSold,
      transferred: totals.transferred + stock.transferred,
      adjusted: totals.adjusted + stock.adjusted,
    };
  }, { currentStock: 0, stockPurchaseValue: 0, stockSaleValue: 0, potentialProfit: 0, totalSold: 0, transferred: 0, adjusted: 0 });
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))];
  const productTypes = [...new Set(products.map((product) => product.type).filter(Boolean))];
  const units = [...new Set(products.map((product) => product.unit).filter(Boolean))];
  const taxes = [...new Set(products.map((product) => product.tax).filter(Boolean))];
  const businessLocations = [...new Set(products.map((product) => product.location).filter(Boolean))];
  const hasActiveFilters = Boolean(category || brand || productType || unit || tax || businessLocation || notForSelling);
  const startEntry = filteredProducts.length ? (currentPage - 1) * pageSize + 1 : 0;
  const endEntry = Math.min(currentPage * pageSize, filteredProducts.length);

  const toggleSelectAll = () => {
    setSelectedIds((current) => allPageSelected
      ? current.filter((id) => !pageItems.some((item) => item.id === id))
      : [...new Set([...current, ...pageItems.map((item) => item.id)])]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
  };

  const handleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleProductAction = (action, product) => {
    setActionsFor(null);
    if (action === "Delete") {
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setSelectedIds((current) => current.filter((id) => id !== product.id));
      return;
    }
    setNotice(`${action} is not connected to a product workflow yet.`);
  };

  const handleBulkAction = (action) => {
    if (action === "Delete Selected") {
      setProducts((current) => current.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      return;
    }
    setNotice(`${action} is not connected to a product workflow yet.`);
  };

  const addCustomField = (event) => {
    event.preventDefault();
    const name = customFieldName.trim();
    if (!name) return;
    if (customFields.some((field) => field.name.toLowerCase() === name.toLowerCase())) {
      setNotice(`A custom field named "${name}" already exists.`);
      return;
    }
    const id = `custom-${Date.now()}`;
    setCustomFields((current) => [...current, { id, name }]);
    setVisibleStockColumns((current) => [...current, id]);
    setCustomFieldName("");
    setIsCustomFieldModalOpen(false);
    setNotice(`Custom field "${name}" added to the stock report.`);
  };

  const removeCustomField = (field) => {
    setCustomFields((current) => current.filter((item) => item.id !== field.id));
    setVisibleStockColumns((current) => current.filter((key) => key !== field.id));
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-1 text-xs font-medium text-[#8798AD]">Products <span className="px-1">/</span> Inventory</div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">Products</h1>
            <p className="mt-1 text-sm text-[#71809A]">Manage your product catalogue and stock in one place.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#E4EAF2] bg-white px-3.5 py-2 text-sm text-[#536985] shadow-sm">
            <Boxes size={17} className="text-[#5584BC]" />
            <span><strong className="font-semibold text-[#283961]">{products.length}</strong> products</span>
          </div>
        </div>

        <section className="mb-5 overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.05)]">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="flex min-h-[58px] w-full items-center justify-between gap-3 px-5 text-left transition hover:bg-[#FFFCF8]"
          >
            <span className="flex items-center gap-2.5 text-base font-semibold text-[#5584BC]">
              <Filter size={19} />
              Filters
              {hasActiveFilters && <span className="rounded-full bg-[#EEF4FB] px-2 py-0.5 text-[11px] text-[#4773A4]">Active</span>}
            </span>
            <ChevronDown size={18} className={`text-[#8798AD] transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
          </button>
          {filtersOpen && (
            <div className="grid gap-x-6 gap-y-4 border-t border-[#F0EAE3] bg-[#FFFCF8] p-5 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block text-xs font-semibold text-[#344B70]">
                Product Type
                <select value={productType} onChange={(event) => { setProductType(event.target.value); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-[#CCD6E3] bg-white px-3 text-sm font-normal text-[#536985] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10">
                  <option value="">All</option>
                  {productTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-[#344B70]">
                Category
                <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-[#CCD6E3] bg-white px-3 text-sm font-normal text-[#536985] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10">
                  <option value="">All</option>
                  {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-[#344B70]">
                Unit
                <select value={unit} onChange={(event) => { setUnit(event.target.value); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-[#CCD6E3] bg-white px-3 text-sm font-normal text-[#536985] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10">
                  <option value="">All</option>
                  {units.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-[#344B70]">
                Tax
                <select value={tax} onChange={(event) => { setTax(event.target.value); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-[#CCD6E3] bg-white px-3 text-sm font-normal text-[#536985] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10">
                  <option value="">All</option>
                  {taxes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-[#344B70]">
                Brand
                <select value={brand} onChange={(event) => { setBrand(event.target.value); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-[#CCD6E3] bg-white px-3 text-sm font-normal text-[#536985] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10">
                  <option value="">All</option>
                  {brands.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-[#344B70]">
                Business Location
                <select value={businessLocation} onChange={(event) => { setBusinessLocation(event.target.value); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-[#CCD6E3] bg-white px-3 text-sm font-normal text-[#536985] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10">
                  <option value="">All</option>
                  {businessLocations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="flex min-h-[58px] cursor-pointer items-center gap-3 pt-4 text-sm font-semibold text-[#344B70]">
                <input checked={notForSelling} onChange={(event) => { setNotForSelling(event.target.checked); setPage(1); }} type="checkbox" className="h-5 w-5 accent-[#F5852A]" />
                Not for selling
              </label>
              <div className="flex items-center justify-end">
                {hasActiveFilters && (
                  <button type="button" onClick={() => { setCategory(""); setBrand(""); setProductType(""); setUnit(""); setTax(""); setBusinessLocation(""); setNotForSelling(false); setSearch(""); setPage(1); }} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D8E0EA] bg-white px-3 text-xs font-medium text-[#60738D] hover:border-[#F5A15D] hover:text-[#E87928]">
                    <X size={14} /> Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.05)]">
          <div className="flex border-b border-[#E9EDF2]" role="tablist" aria-label="Product views">
            <button type="button" role="tab" aria-selected={activeTab === "products"} onClick={() => setActiveTab("products")} className={`inline-flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-semibold transition ${activeTab === "products" ? "border-[#F5852A] bg-[#FFFCF8] text-[#283961]" : "border-transparent text-[#71809A] hover:bg-[#FFFCF8] hover:text-[#283961]"}`}>
              <Package size={16} /> All Products
            </button>
            <button type="button" role="tab" aria-selected={activeTab === "stock"} onClick={() => setActiveTab("stock")} className={`inline-flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-semibold transition ${activeTab === "stock" ? "border-[#F5852A] bg-[#FFFCF8] text-[#283961]" : "border-transparent text-[#71809A] hover:bg-[#FFFCF8] hover:text-[#283961]"}`}>
              <SlidersHorizontal size={16} /> Stock Report
            </button>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-[#60738D]">
                <span>Show</span>
                <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="h-9 rounded-lg border border-[#D8E0EA] bg-white px-2.5 text-sm text-[#33496F] outline-none focus:border-[#F5A15D]">
                  {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
                <span>entries</span>
              </div>
              {activeTab === "products" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => onNavigate?.("Add Product")} className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                    <Plus size={17} /> Add
                  </button>
                  <button type="button" onClick={() => setNotice("Bulk upload is not connected to an import workflow yet.")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#273445] px-4 text-sm font-semibold text-white transition hover:bg-[#1D2938]">
                    <Upload size={16} /> Bulk Upload
                  </button>
                  <button type="button" onClick={() => downloadCsv(filteredProducts)} className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                    <ArrowDownToLine size={16} /> Download Excel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => { setCustomFieldName(""); setIsCustomFieldModalOpen(true); }} className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                  <Plus size={17} /> Add Custom Field
                </button>
              )}
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <ExportButton icon={FileSpreadsheet} onClick={() => activeTab === "stock" ? downloadStockCsv(filteredProducts, customFields) : downloadCsv(filteredProducts)}>Export CSV</ExportButton>
                <ExportButton icon={FileSpreadsheet} onClick={() => activeTab === "stock" ? downloadStockCsv(filteredProducts, customFields) : downloadCsv(filteredProducts)}>Export Excel</ExportButton>
                <ExportButton icon={Printer} onClick={() => window.print()}>Print</ExportButton>
                <div className="relative">
                  <button type="button" onClick={() => setColumnMenuOpen((open) => !open)} aria-expanded={columnMenuOpen} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#D7E0EB] bg-white px-2.5 text-xs font-medium text-[#60738D] hover:border-[#F5A15D] hover:text-[#E87928]">
                    <Columns3 size={14} /> Column visibility <ChevronDown size={13} />
                  </button>
                  {columnMenuOpen && (
                    <div className="app-themed-scrollbar absolute left-0 top-10 z-20 max-h-72 w-56 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-xl">
                      {(activeTab === "stock"
                        ? [...stockColumns, ...customFields.map((field) => ({ key: field.id, label: field.name }))]
                        : columns).map((column) => (
                        <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#536985] hover:bg-[#FFFCF8]">
                          <input type="checkbox" checked={activeTab === "stock" ? visibleStockColumns.includes(column.key) : visibleColumns.includes(column.key)} onChange={() => activeTab === "stock"
                            ? setVisibleStockColumns((current) => current.includes(column.key) ? current.filter((key) => key !== column.key) : [...current, column.key])
                            : setVisibleColumns((current) => current.includes(column.key) ? current.filter((key) => key !== column.key) : [...current, column.key])} className="accent-[#F5852A]" />
                          {column.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <ExportButton icon={FileSpreadsheet} onClick={() => activeTab === "stock" ? downloadStockCsv(filteredProducts, customFields) : downloadCsv(filteredProducts)}>Export PDF</ExportButton>
              </div>
              <label className="relative block w-full sm:w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A6B8]" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search products..." className="h-9 w-full rounded-lg border border-[#D8E0EA] bg-white pl-9 pr-3 text-sm text-[#33496F] outline-none placeholder:text-[#A2ADBA] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10" />
              </label>
            </div>

            {notice && (
              <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-[#D9E6F5] bg-[#F3F7FC] px-3.5 py-2.5 text-sm text-[#536985]" role="status">
                <span className="flex items-center gap-2"><CircleHelp size={16} className="shrink-0 text-[#5584BC]" />{notice}</span>
                <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><X size={16} /></button>
              </div>
            )}

            {activeTab === "stock" ? (
              <div className="app-themed-scrollbar overflow-x-auto rounded-xl border border-[#E8EDF2]">
                <table className="w-full min-w-[1700px] border-collapse text-left text-[13px]">
                  <thead className="bg-[#FFFCF8] text-[#344B70]">
                    <tr>
                      <th className="min-w-40 px-3 py-3.5 font-semibold">Action</th>
                      {stockColumnsData.map((column) => (
                        <th key={column.key} className="min-w-28 max-w-48 px-3 py-3.5 font-semibold">
                          <button type="button" onClick={() => column.sortable && handleSort(column.key)} className="inline-flex items-center gap-1.5 text-left leading-5 hover:text-[#E87928]">
                            {column.label}
                            {column.sortable && <ArrowUpDown size={13} className="shrink-0 text-[#B0BAC6]" />}
                          </button>
                          {column.customFieldId && (
                            <button type="button" onClick={() => removeCustomField(customFields.find((field) => field.id === column.customFieldId))} aria-label={`Remove ${column.label}`} className="ml-1 rounded p-0.5 text-[#A2ADBA] hover:bg-[#FFF0E3] hover:text-[#D86D22]">
                              <X size={12} />
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stockRows.map((product, index) => (
                      <tr key={product.id} className={`border-t border-[#EDF0F3] ${product.potentialProfit < 0 ? "bg-[#FFF2F1]" : index % 2 ? "bg-[#FCFCFD]" : "bg-white"} transition hover:bg-[#FFFAF5]`}>
                        <td className="px-3 py-3">
                          <button type="button" onClick={() => setNotice(`Stock history for ${product.name} is not connected yet.`)} className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#64B9E7] bg-[#F5FBFF] px-2.5 text-xs font-medium text-[#2585BB] hover:bg-[#EAF7FF]">
                            <History size={14} /> Product stock history
                          </button>
                        </td>
                        {stockColumnsData.map((column) => {
                          const value = column.customFieldId
                            ? product.customValues?.[column.customFieldId] ?? ""
                            : product[column.key];
                          return (
                            <td key={column.key} className="max-w-48 px-3 py-3 align-middle text-[#344B70]">
                              {column.key === "unitSellingPrice" ? (
                                <div className="flex min-w-28 flex-col items-start gap-1.5">
                                  <span>{money(value)}</span>
                                  <button type="button" onClick={() => setNotice(`Group prices for ${product.name} are not connected yet.`)} className="rounded-md border border-[#9B8BFF] px-2 py-0.5 text-[11px] font-medium text-[#6959E8] hover:bg-[#F5F2FF]">View group prices</button>
                                </div>
                              ) : column.key === "currentStock" ||
                                column.key === "totalSold" ||
                                column.key === "transferred" ||
                                column.key === "adjusted" ? (
                                  <span>{Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {product.unit === "piece" ? "Pc(s)" : product.unit}</span>
                                ) : ["stockPurchaseValue", "stockSaleValue", "potentialProfit"].includes(column.key) ? (
                                  money(value)
                                ) : (
                                  value || <span className="text-[#C3CBD5]">—</span>
                                )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {stockRows.length === 0 && (
                      <tr>
                        <td colSpan={stockColumnsData.length + 1} className="px-4 py-12 text-center text-sm text-[#8798AD]">No products match your search or filters.</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-[#D7DEE8] bg-[#E8EBF1] font-semibold text-[#344B70]">
                      <td className="px-3 py-3 text-right">Total:</td>
                      {stockColumnsData.map((column) => (
                        <td key={column.key} className="px-3 py-3">
                          {Object.hasOwn(stockTotals, column.key)
                            ? Number(stockTotals[column.key]).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : ""}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
            <div className="app-themed-scrollbar overflow-x-auto rounded-xl border border-[#E8EDF2]">
              <table className="w-full min-w-[1480px] border-collapse text-left text-[13px]">
                <thead className="bg-[#FFFCF8] text-[#344B70]">
                  <tr>
                    <th className="w-10 px-3 py-3.5">
                      <input aria-label="Select all visible products" type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} className="accent-[#F5852A]" />
                    </th>
                    <th className="w-24 px-3 py-3.5 font-semibold">Product image</th>
                    <th className="w-28 px-3 py-3.5 font-semibold">Action</th>
                    {visibleColumnsData.map((column) => (
                      <th key={column.key} className="min-w-28 px-3 py-3.5 font-semibold">
                        <button type="button" onClick={() => handleSort(column.key)} className="inline-flex items-center gap-1.5 text-left leading-5 hover:text-[#E87928]">
                          {column.label}
                          {column.sortable && (sort.key === column.key ? <ArrowUpDown size={13} className="shrink-0 text-[#4B83BF]" /> : <ArrowUpDown size={13} className="shrink-0 text-[#B0BAC6]" />)}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((product, index) => (
                    <tr key={product.id} className={`border-t border-[#EDF0F3] transition hover:bg-[#FFFAF5] ${index % 2 ? "bg-[#FCFCFD]" : "bg-white"}`}>
                      <td className="px-3 py-3 align-middle">
                        <input aria-label={`Select ${product.name}`} type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} className="accent-[#F5852A]" />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex h-12 w-14 items-center justify-center rounded-lg border border-[#E8EDF2] bg-gradient-to-br from-[#F6F9FC] to-[#EDF3FA] text-[#83A1C2]">
                          <Package size={23} strokeWidth={1.6} />
                        </div>
                      </td>
                      <td className="relative px-3 py-3">
                        <button type="button" onClick={() => setActionsFor((current) => current === product.id ? null : product.id)} aria-expanded={actionsFor === product.id} className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#67B9E9] bg-[#F5FBFF] px-2.5 text-xs font-medium text-[#2585BB] hover:bg-[#EAF7FF]">
                          Actions <ChevronDown size={13} />
                        </button>
                        {actionsFor === product.id && (
                          <div className="absolute left-3 top-11 z-20 w-36 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl">
                            {["View", "Edit", "Delete"].map((action) => (
                              <button key={action} type="button" onClick={() => handleProductAction(action, product)} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs ${action === "Delete" ? "text-[#C35445] hover:bg-[#FFF3F0]" : "text-[#536985] hover:bg-[#FFFAF5]"}`}>
                                {action === "Edit" ? <Pencil size={13} /> : action === "View" ? <Search size={13} /> : <X size={13} />}
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      {visibleColumnsData.map((column) => {
                        const value = product[column.key];
                        return (
                          <td key={column.key} className="max-w-48 px-3 py-3 align-middle text-[#344B70]">
                            {column.key === "purchasePrice" || column.key === "sellingPrice"
                              ? money(value)
                              : column.key === "stock"
                                ? <span className={product.stock === 0 ? "text-[#A2ADBA]" : ""}>{Number(value).toLocaleString("en-IN")} {product.unit}</span>
                                : value || <span className="text-[#C3CBD5]">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={visibleColumnsData.length + 3} className="px-4 py-12 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F7FC] text-[#7B9CC0]"><Package size={22} /></span>
                          <p className="text-sm font-semibold text-[#344B70]">No products found</p>
                          <p className="mt-1 text-xs text-[#8798AD]">Try changing your search or filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}

            {activeTab === "products" && selectedIds.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#E5EAF0] bg-[#FFFCF8] p-3">
                <span className="mr-1 text-xs font-medium text-[#60738D]">{selectedIds.length} selected</span>
                <button type="button" onClick={() => handleBulkAction("Delete Selected")} className="rounded-lg border border-[#F1B6B1] bg-white px-3 py-1.5 text-xs font-medium text-[#C35445] hover:bg-[#FFF3F0]">Delete Selected</button>
                <button type="button" onClick={() => handleBulkAction("Add to location")} className="rounded-lg border border-[#87D7C8] bg-white px-3 py-1.5 text-xs font-medium text-[#278B7B] hover:bg-[#F0FCF9]">Add to location</button>
                <button type="button" onClick={() => handleBulkAction("Remove from location")} className="rounded-lg border border-[#D7E0EB] bg-white px-3 py-1.5 text-xs font-medium text-[#60738D] hover:bg-white">Remove from location</button>
                <button type="button" onClick={() => handleBulkAction("Deactivate Selected")} className="rounded-lg border border-[#F4CB83] bg-white px-3 py-1.5 text-xs font-medium text-[#B8791E] hover:bg-[#FFFAF0]">Deactivate Selected</button>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#60738D]">
                Showing <span className="font-medium text-[#344B70]">{startEntry} to {endEntry}</span> of <span className="font-medium text-[#344B70]">{filteredProducts.length}</span> entries
              </p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1} className="inline-flex h-9 items-center gap-1 rounded-l-lg border border-[#D8E0EA] px-3 text-sm text-[#60738D] hover:bg-[#FFFCF8] disabled:cursor-not-allowed disabled:opacity-50"><ChevronLeft size={15} /> Previous</button>
                <span className="flex h-9 min-w-9 items-center justify-center border-y border-[#D8E0EA] bg-[#F1F6FC] px-2 text-sm font-semibold text-[#4773A4]">{currentPage}</span>
                <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages} className="inline-flex h-9 items-center gap-1 rounded-r-lg border border-[#D8E0EA] px-3 text-sm text-[#60738D] hover:bg-[#FFFCF8] disabled:cursor-not-allowed disabled:opacity-50">Next <ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {isCustomFieldModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setIsCustomFieldModalOpen(false)}
        >
          <form
            onSubmit={addCustomField}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-[#F0E4D7] bg-white p-5 shadow-[0_18px_55px_rgba(25,43,80,0.2)]"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#283961]">Add stock custom field</h2>
                <p className="mt-1 text-sm text-[#71809A]">Create a column for information specific to your products.</p>
              </div>
              <button type="button" onClick={() => setIsCustomFieldModalOpen(false)} aria-label="Close" className="rounded-lg p-1.5 text-[#8798AD] hover:bg-[#FFF0E3] hover:text-[#E87928]">
                <X size={18} />
              </button>
            </div>
            <label className="block text-xs font-semibold text-[#63768D]">
              Field name
              <input
                autoFocus
                required
                maxLength={40}
                value={customFieldName}
                onChange={(event) => setCustomFieldName(event.target.value)}
                placeholder="For example: Batch note"
                className="mt-1.5 h-10 w-full rounded-lg border border-[#D8E0EA] px-3 text-sm font-normal text-[#33496F] outline-none focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCustomFieldModalOpen(false)} className="h-9 rounded-lg border border-[#D8E0EA] px-4 text-sm font-medium text-[#60738D] hover:bg-[#FFFCF8]">Cancel</button>
              <button type="submit"               className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white hover:brightness-105">
                <Plus size={15} /> Add field
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default ListProducts;