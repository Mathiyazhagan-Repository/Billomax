
import React, { useMemo, useState } from "react";
import {
  Package,
  Boxes,
  IndianRupee,
  TrendingUp,
  Filter,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  History,
  X,
  MapPin,
  Eye,
} from "lucide-react";
import ProductStockHistory from "./ProductStockHistory.jsx";
import ViewGroupPrices from "./ViewGroupPrices.jsx";

const stockData = [
  {
    id: 1,
    sku: "0001",
    product: "Dolo 650",
    variation: "",
    category: "First Aid Supplies",
    location: "Pharmacy",
    sellingPrice: 13.75,
    currentStock: 12,
    unit: "Pc(s)",
    purchaseValue: 385,
    saleValue: 165,
    potentialProfit: -220,
    totalSold: 53,
    transferred: 0,
    adjusted: 0,
    custom1: "",
    custom2: "",
    custom3: "",
    custom4: "",
  },
  {
    id: 2,
    sku: "0038",
    product: "Amoxicillin",
    variation: "",
    category: "Health & Wellness Products",
    location: "Pharmacy",
    sellingPrice: 22.5,
    currentStock: 197,
    unit: "piece",
    purchaseValue: 10152,
    saleValue: 4432.5,
    potentialProfit: -5719.5,
    totalSold: 42,
    transferred: 0,
    adjusted: 0,
    custom1: "",
    custom2: "",
    custom3: "",
    custom4: "",
  },
  {
    id: 3,
    sku: "0039",
    product: "Azithromycin",
    variation: "",
    category: "First Aid Supplies",
    location: "",
    sellingPrice: 22.5,
    currentStock: 0,
    unit: "piece",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 0,
    transferred: 0,
    adjusted: 0,
    custom1: "",
    custom2: "",
    custom3: "",
    custom4: "",
  },
  {
    id: 4,
    sku: "0040",
    product: "Sertraline (Zoloft)",
    variation: "",
    category: "First Aid Supplies",
    location: "Pharmacy",
    sellingPrice: 22.5,
    currentStock: 298,
    unit: "piece",
    purchaseValue: 5364,
    saleValue: 6705,
    potentialProfit: 1341,
    totalSold: 3,
    transferred: 0,
    adjusted: 0,
    custom1: "",
    custom2: "",
    custom3: "",
    custom4: "",
  },
  {
    id: 5,
    sku: "0041",
    product: "Fluoxetine (Prozac)",
    variation: "",
    category: "",
    location: "Pharmacy",
    sellingPrice: 22.5,
    currentStock: 497,
    unit: "piece",
    purchaseValue: 8946,
    saleValue: 11182.5,
    potentialProfit: 2236.5,
    totalSold: 3,
    transferred: 0,
    adjusted: 0,
    custom1: "",
    custom2: "",
    custom3: "",
    custom4: "",
  },
];

const columnDefinitions = [
  { key: "action", label: "Action" },
  { key: "sku", label: "SKU" },
  { key: "product", label: "Product" },
  { key: "variation", label: "Variation" },
  { key: "category", label: "Category" },
  { key: "location", label: "Location" },
  { key: "sellingPrice", label: "Unit Selling Price" },
  { key: "currentStock", label: "Current stock" },
  {
    key: "purchaseValue",
    label: "Current Stock Value (By purchase price)",
  },
  {
    key: "saleValue",
    label: "Current Stock Value (By sale price)",
  },
  { key: "potentialProfit", label: "Potential profit" },
  { key: "totalSold", label: "Total unit sold" },
  { key: "transferred", label: "Total Unit Transferred" },
  { key: "adjusted", label: "Total Unit Adjusted" },
  { key: "custom1", label: "Custom Field1" },
  { key: "custom2", label: "Custom Field2" },
  { key: "custom3", label: "Custom Field3" },
  { key: "custom4", label: "Custom Field4" },
];

const money = (value) =>
  `₹ ${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const quantity = (value, unit) =>
  `${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${unit || "Pc(s)"}`;

function SummaryCard({ label, value, icon: Icon, accent, detail }) {
  const accents = {
    orange: "bg-[#FFE5AD] text-[#F47700]",
    blue: "bg-[#CDE6FF] text-[#087AF0]",
    green: "bg-[#D1FBD1] text-[#13A52E]",
    purple: "bg-[#E8D8FF] text-[#8219F5]",
  };

  return (
    <div className="flex min-h-[84px] items-center gap-2.5 rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accents[accent]}`}>
        <Icon size={22} strokeWidth={2.8} />
      </div>
      <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold leading-4 text-[#526D8D]">
            {label}
          </p>
          <p className="break-words text-[18px] font-extrabold leading-none tracking-tight text-[#101C3D]">
            {value}
          </p>
          {detail && <p className="mt-1 text-[10px] text-[#577B9F]">{detail}</p>}
      </div>
    </div>
  );
}

function ActionButton({ children, icon: Icon, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-orange-200 ${
        primary
          ? "border-transparent bg-[#FF711A] text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] hover:bg-[#F04A13]"
          : "border-[#E8EDF4] bg-white text-[#19366F] shadow-sm hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
      }`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export default function StockReport() {
  const [products] = useState(stockData);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "sku",
    direction: "asc",
  });
  const [visibleColumns, setVisibleColumns] = useState(
    columnDefinitions.map((column) => column.key)
  );
  const [historyProduct, setHistoryProduct] = useState(null);
  const [groupPriceProduct, setGroupPriceProduct] = useState(null);

  const locations = useMemo(
    () => [...new Set(products.map((item) => item.location).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchable = [
        product.sku,
        product.product,
        product.variation,
        product.category,
        product.location,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(search.toLowerCase());
      const matchesLocation =
        locationFilter === "all" || product.location === locationFilter;

      return matchesSearch && matchesLocation;
    });

    if (sortConfig.key !== "action") {
      result = [...result].sort((a, b) => {
        const first = a[sortConfig.key] ?? "";
        const second = b[sortConfig.key] ?? "";
        const numericKeys = [
          "sellingPrice",
          "currentStock",
          "purchaseValue",
          "saleValue",
          "potentialProfit",
          "totalSold",
          "transferred",
          "adjusted",
        ];

        let comparison;

        if (numericKeys.includes(sortConfig.key)) {
          comparison = Number(first) - Number(second);
        } else {
          comparison = String(first).localeCompare(String(second), undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [products, search, locationFilter, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / pageSize)
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredProducts.length
    ? (safePage - 1) * pageSize
    : 0;

  const pageRows = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  const totals = useMemo(
    () =>
      filteredProducts.reduce(
        (sum, row) => ({
          purchaseValue: sum.purchaseValue + row.purchaseValue,
          saleValue: sum.saleValue + row.saleValue,
          potentialProfit: sum.potentialProfit + row.potentialProfit,
          currentStock: sum.currentStock + row.currentStock,
          totalSold: sum.totalSold + row.totalSold,
          transferred: sum.transferred + row.transferred,
          adjusted: sum.adjusted + row.adjusted,
        }),
        {
          purchaseValue: 0,
          saleValue: 0,
          potentialProfit: 0,
          currentStock: 0,
          totalSold: 0,
          transferred: 0,
          adjusted: 0,
        }
      ),
    [filteredProducts]
  );

  const resetFilters = () => {
    setSearch("");
    setLocationFilter("all");
    setCurrentPage(1);
  };

  const sortBy = (key) => {
    if (key === "action") return;

    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setCurrentPage(1);
  };

  const toggleColumn = (key) => {
    setVisibleColumns((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  };

  const exportCSV = () => {
    const exportColumns = columnDefinitions.filter(
      (column) =>
        visibleColumns.includes(column.key) && column.key !== "action"
    );

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvRows = [
      exportColumns.map((column) => escapeCSV(column.label)).join(","),
      ...filteredProducts.map((row) =>
        exportColumns
          .map((column) => {
            let value = row[column.key];

            if (
              ["sellingPrice", "purchaseValue", "saleValue", "potentialProfit"].includes(
                column.key
              )
            ) {
              value = money(value);
            }

            if (
              ["currentStock", "totalSold", "transferred", "adjusted"].includes(
                column.key
              )
            ) {
              value = quantity(value, row.unit);
            }

            return escapeCSV(value);
          })
          .join(",")
      ),
    ];

    const blob = new Blob(["\uFEFF" + csvRows.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "StockReport.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderCell = (row, key) => {
    switch (key) {
      case "action":
        return (
          <button
            type="button"
            onClick={() => setHistoryProduct(row)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
          >
            <History size={14} />
            Stock history
          </button>
        );

      case "sku":
        return (
          <span className="font-medium tabular-nums text-slate-600">
            {row.sku}
          </span>
        );

      case "product":
        return (
          <span className="min-w-[125px] font-semibold leading-5 text-[#10234F]">
            {row.product}
          </span>
        );

      case "variation":
      case "category":
      case "location":
      case "custom1":
      case "custom2":
      case "custom3":
      case "custom4":
        return (
          <span className="block min-w-[90px] max-w-[180px] whitespace-normal leading-5 text-slate-600">
            {row[key] || "—"}
          </span>
        );

      case "sellingPrice":
        return (
          <div className="min-w-[130px] space-y-2">
            <span className="whitespace-nowrap font-semibold text-[#10234F]">
              {money(row.sellingPrice)}
            </span>
            <button
              type="button"
              onClick={() => setGroupPriceProduct(row)}
              className="block whitespace-nowrap rounded-lg border border-[#FFD6B8] bg-[#FFF1E5] px-2.5 py-1.5 text-xs font-semibold text-[#E96B10] transition hover:bg-[#FFE5D1]"
            >
              View group prices
            </button>
          </div>
        );

      case "currentStock":
        return (
          <span className="whitespace-nowrap font-medium text-slate-700">
            {quantity(row.currentStock, row.unit)}
          </span>
        );

      case "purchaseValue":
      case "saleValue":
        return (
          <span className="whitespace-nowrap font-medium tabular-nums text-slate-700">
            {money(row[key])}
          </span>
        );

      case "potentialProfit":
        return (
          <span
            className={`whitespace-nowrap font-semibold tabular-nums ${
              row.potentialProfit < 0
                ? "text-rose-600"
                : row.potentialProfit > 0
                  ? "text-emerald-700"
                  : "text-slate-600"
            }`}
          >
            {money(row.potentialProfit)}
          </span>
        );

      case "totalSold":
      case "transferred":
      case "adjusted":
        return (
          <span className="whitespace-nowrap tabular-nums text-slate-700">
            {quantity(row[key], row.unit)}
          </span>
        );

      default:
        return row[key] ?? "—";
    }
  };

  const activeFilterCount = Number(locationFilter !== "all");

  if (historyProduct) {
    return (
      <ProductStockHistory
        productRecord={historyProduct}
        onBack={() => setHistoryProduct(null)}
      />
    );
  }

  if (groupPriceProduct) {
    return (
      <ViewGroupPrices
        fullPage
        productName={groupPriceProduct.product}
        defaultSellingPrice={groupPriceProduct.sellingPrice}
        onClose={() => setGroupPriceProduct(null)}
      />
    );
  }

  return (
    <main className="min-h-screen min-w-0 bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { border: 0 !important; box-shadow: none !important; overflow: visible !important; }
          .print-area table { min-width: 100% !important; }
          .print-area th, .print-area td { padding: 6px !important; font-size: 9px !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1800px] space-y-5">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <Package size={14} />
              <span className="text-[11px] font-extrabold">PHARMACY · REPORTS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Stock Report
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Monitor inventory valuation, stock quantities, and potential profit.
            </p>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <ActionButton icon={FileSpreadsheet} onClick={exportCSV}>
              Export Excel
            </ActionButton>
            <ActionButton icon={FileText} onClick={() => window.print()} primary>
              Export PDF
            </ActionButton>
          </div>
        </header>

        {/* Summary metrics — original screenshot values */}
        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Closing stock (By purchase price)"
            value="₹ 723,040.00"
            icon={Boxes}
            accent="blue"
            detail="Inventory purchase valuation"
          />
          <SummaryCard
            label="Closing stock (By sale price)"
            value="₹ 903,785.75"
            icon={Package}
            accent="orange"
            detail="Inventory sale valuation"
          />
          <SummaryCard
            label="Potential profit"
            value="₹ 180,745.75"
            icon={TrendingUp}
            accent="green"
            detail="Estimated stock margin"
          />
          <SummaryCard
            label="Profit Margin %"
            value="20.00%"
            icon={IndianRupee}
            accent="purple"
            detail="Reported margin"
          />
        </section>

        {/* Filters */}
        <section className="no-print overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
                <Filter size={19} />
              </div>
              <div>
                <h2 className="app-section-title text-[#10234F]">Filters</h2>
                <p className="app-description mt-0.5 text-[#577B9F]">
                  Filter stock records by location.
                </p>
              </div>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-[#FFF1E5] px-2 py-0.5 text-xs font-bold text-[#E96B10]">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            {showFilters ? (
              <ChevronUp size={19} className="text-[#577B9F]" />
            ) : (
              <ChevronDown size={19} className="text-[#577B9F]" />
            )}
          </button>

          {showFilters && (
            <div className="border-t border-[#F2E8DE] bg-[#FFFEFC] px-5 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#557493]">
                    Location
                  </span>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]"
                    />
                    <select
                      value={locationFilter}
                      onChange={(event) => {
                        setLocationFilter(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                    >
                      <option value="all">All locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <div className="flex items-end">
                  <ActionButton icon={RotateCcw} onClick={resetFilters}>
                    Reset filters
                  </ActionButton>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Main table */}
        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <Package size={19} />
              </div>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  Stock Details
                </h2>
                <p className="app-description mt-0.5 text-[#577B9F]">
                  All 18 stock report columns
                </p>
              </div>
            </div>

            <div className="no-print flex flex-wrap gap-2">
              <ActionButton icon={Download} onClick={exportCSV}>
                Export CSV
              </ActionButton>
              <ActionButton icon={FileSpreadsheet} onClick={exportCSV}>
                Export Excel
              </ActionButton>
              <ActionButton icon={Printer} onClick={() => window.print()}>
                Print
              </ActionButton>
              <ActionButton icon={FileText} onClick={() => window.print()}>
                Export PDF
              </ActionButton>
            </div>
          </div>

          {/* Table controls */}
          <div className="no-print flex flex-col gap-4 px-5 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-[#577B9F]">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-semibold text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                entries
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColumns((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] shadow-sm transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                >
                  <SlidersHorizontal size={15} />
                  Column visibility
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-30 mt-2 max-h-[420px] w-72 overflow-y-auto rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-[#F2E8DE] pb-2">
                      <span className="text-sm font-bold text-[#10234F]">
                        Visible columns
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowColumns(false)}
                        aria-label="Close column menu"
                        className="rounded-md p-1 text-[#577B9F] hover:bg-[#FFF1E5]"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {columnDefinitions.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-2 text-xs text-[#19366F] hover:bg-[#FFF7EF]"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="mt-0.5 h-4 w-4 accent-[#FF711A]"
                        />
                        <span>{column.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="relative block w-full xl:max-w-sm">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search SKU, product, category..."
                className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          {/* Horizontal scrolling is intentional for all 18 columns */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[2400px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                  {columnDefinitions
                    .filter((column) =>
                      visibleColumns.includes(column.key)
                    )
                    .map((column) => (
                      <th
                        key={column.key}
                        className="app-table-heading max-w-[220px] px-4 py-4 uppercase tracking-wide text-[#19366F]"
                      >
                        <button
                          type="button"
                          onClick={() => sortBy(column.key)}
                          className={`inline-flex items-center gap-2 text-left leading-5 transition hover:text-[#F04A13] ${
                            column.key === "action" ? "cursor-default" : ""
                          }`}
                        >
                          {column.label}
                          {column.key !== "action" &&
                            (sortConfig.key === column.key ? (
                              sortConfig.direction === "asc" ? (
                                <ChevronUp
                                  size={14}
                                  className="shrink-0 text-[#FF711A]"
                                />
                              ) : (
                                <ChevronDown
                                  size={14}
                                  className="shrink-0 text-[#FF711A]"
                                />
                              )
                            ) : (
                              <span className="shrink-0 text-slate-300">
                                <ChevronUp size={12} />
                              </span>
                            ))}
                        </button>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F2E8DE]">
                {pageRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-[#FFF1E5]/70 ${
                      row.currentStock === 0
                        ? "bg-[#FFF1EF]"
                        : index % 2 === 1
                          ? "bg-[#FFFCF8]"
                          : "bg-white"
                    }`}
                  >
                    {columnDefinitions
                      .filter((column) =>
                        visibleColumns.includes(column.key)
                      )
                      .map((column) => (
                        <td
                          key={column.key}
                          className="app-table-cell px-4 py-4 align-middle text-[#19366F]"
                        >
                          {renderCell(row, column.key)}
                        </td>
                      ))}
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={Math.max(1, visibleColumns.length)}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE9D9] text-[#F04A13]">
                        <Search size={21} />
                      </div>
                      <p className="mt-3 font-semibold text-[#10234F]">
                        No stock records found
                      </p>
                      <p className="mt-1 text-xs text-[#577B9F]">
                        Try a different search term or reset your filters.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 text-sm font-semibold text-[#E96B10] hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>

              {pageRows.length > 0 && (
                <tfoot>
                  <tr className="border-t border-[#F2E8DE] bg-[#FFF1E5]">
                    {columnDefinitions
                      .filter((column) =>
                        visibleColumns.includes(column.key)
                      )
                      .map((column, index) => {
                        let value = "";

                        if (index === 0) value = "Total:";
                        if (column.key === "currentStock") {
                          value = quantity(totals.currentStock, "Pc(s)");
                        }
                        if (column.key === "purchaseValue") {
                          value = money(totals.purchaseValue);
                        }
                        if (column.key === "saleValue") {
                          value = money(totals.saleValue);
                        }
                        if (column.key === "potentialProfit") {
                          value = money(totals.potentialProfit);
                        }
                        if (column.key === "totalSold") {
                          value = quantity(totals.totalSold, "Pc(s)");
                        }
                        if (column.key === "transferred") {
                          value = quantity(totals.transferred, "Pc(s)");
                        }
                        if (column.key === "adjusted") {
                          value = quantity(totals.adjusted, "Pc(s)");
                        }

                        return (
                          <td
                            key={column.key}
                            className="whitespace-nowrap px-4 py-4 font-bold text-[#10234F]"
                          >
                            {value}
                          </td>
                        );
                      })}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-[#577B9F]">
              Showing{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredProducts.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#10234F]">
                {Math.min(startIndex + pageSize, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredProducts.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                      safePage === page
                        ? "bg-[#FF711A] text-white shadow-sm"
                        : "border border-[#E8EDF4] bg-white text-[#19366F] hover:bg-[#FFF1E5]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-[11px] text-[#577B9F] sm:flex-row sm:text-left">
          <p>Billomax · Stock Report</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>

    </main>
  );
}
