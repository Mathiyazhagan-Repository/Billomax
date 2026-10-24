
import React, { useMemo, useState } from "react";
import {
  Package,
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
  Plus,
} from "lucide-react";
import ProductStockHistory from "./ProductStockHistory.jsx";
import ViewGroupPrices from "./ViewGroupPrices.jsx";

const stockData = [
  {
    id: 63,
    sku: "0063",
    product: "Battery Kit Replacement",
    variation: "",
    category: "",
    location: "",
    sellingPrice: 918,
    currentStock: 0,
    unit: "piece",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 0,
    transferred: 0,
    adjusted: 0,
  },
  {
    id: 64,
    sku: "0064",
    product: "Bioschip Repair",
    variation: "",
    category: "",
    location: "",
    sellingPrice: 9018,
    currentStock: 0,
    unit: "Pc(s)",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 0,
    transferred: 0,
    adjusted: 0,
  },
  {
    id: 65,
    sku: "0065",
    product: "Coling Fan repair",
    variation: "",
    category: "",
    location: "",
    sellingPrice: 120.96,
    currentStock: 0,
    unit: "Pc(s)",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 0,
    transferred: 0,
    adjusted: 0,
  },
  {
    id: 66,
    sku: "0066",
    product: "CPU",
    variation: "",
    category: "",
    location: "",
    sellingPrice: 738.46,
    currentStock: 0,
    unit: "Pc(s)",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 0,
    transferred: 0,
    adjusted: 0,
  },
  {
    id: 67,
    sku: "0067",
    product: "Display",
    variation: "",
    category: "",
    location: "",
    sellingPrice: 1229.76,
    currentStock: 0,
    unit: "Pc(s)",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 0,
    transferred: 0,
    adjusted: 0,
  },
  {
    id: 68,
    sku: "0068",
    product: "Ac Repair",
    variation: "",
    category: "",
    location: "Multi-Service Center",
    sellingPrice: 120.96,
    currentStock: 0,
    unit: "Pc(s)",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 1,
    transferred: 0,
    adjusted: 0,
  },
  {
    id: 69,
    sku: "0069",
    product: "CPU",
    variation: "",
    category: "",
    location: "",
    sellingPrice: 7068.75,
    currentStock: 0,
    unit: "Pc(s)",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 0,
    transferred: 0,
    adjusted: 0,
  },
  {
    id: 70,
    sku: "0070",
    product: "CPU",
    variation: "",
    category: "",
    location: "",
    sellingPrice: 624.96,
    currentStock: 0,
    unit: "Pc(s)",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 0,
    transferred: 0,
    adjusted: 0,
  },
  {
    id: 71,
    sku: "0071",
    product: "CPU",
    variation: "",
    category: "",
    location: "Multi-Service Center",
    sellingPrice: 1028.16,
    currentStock: 0,
    unit: "piece",
    purchaseValue: 0,
    saleValue: 0,
    potentialProfit: 0,
    totalSold: 1,
    transferred: 0,
    adjusted: 0,
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

function SummaryCard({ label }) {
  return (
    <div className="min-h-[220px] rounded-[22px] border border-[#E8EDF3] bg-white px-5 py-6 shadow-[0_8px_20px_rgba(16,35,79,0.06)] sm:px-8">
      <p className="text-base font-normal text-[#182230]">{label}</p>
      <RotateCcw
        size={34}
        strokeWidth={3}
        className="mt-6 text-[#F0A02F]"
        aria-label="Loading stock summary"
      />
    </div>
  );
}

function ActionButton({
  children,
  icon: Icon,
  onClick,
  primary = false,
  type = "button",
}) {
  return (
    <button
      type={type}
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
  const [products, setProducts] = useState(stockData);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldName, setCustomFieldName] = useState("");
  const [showAddCustomField, setShowAddCustomField] = useState(false);
  const [customFieldError, setCustomFieldError] = useState("");
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

  const columns = useMemo(
    () => [
      ...columnDefinitions,
      ...customFields.map(({ key, label }) => ({ key, label })),
    ],
    [customFields]
  );

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
        ...customFields.map(({ key }) => product[key]),
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
  }, [products, search, locationFilter, sortConfig, customFields]);

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

  const addCustomField = (event) => {
    event.preventDefault();
    const label = customFieldName.trim();
    if (!label) return;

    if (
      columns.some(
        (column) => column.label.toLowerCase() === label.toLowerCase()
      )
    ) {
      setCustomFieldError("A field with this name already exists.");
      return;
    }

    const key = `custom-${customFields.length + 1}`;
    setCustomFields((current) => [...current, { key, label }]);
    setVisibleColumns((current) => [...current, key]);
    setCustomFieldName("");
    setCustomFieldError("");
    setShowAddCustomField(false);
  };

  const exportCSV = () => {
    const exportColumns = columns.filter(
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
        {
          const customField = customFields.find((field) => field.key === key);
          if (customField) {
            return (
              <input
                aria-label={`${customField.label} for ${row.product}`}
                value={row[key] ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setProducts((current) =>
                    current.map((product) =>
                      product.id === row.id
                        ? { ...product, [key]: value }
                        : product
                    )
                  );
                }}
                className="w-32 rounded-md border border-transparent bg-transparent px-2 py-1 text-xs text-[#19366F] outline-none focus:border-[#FF8A37] focus:bg-white"
              />
            );
          }
        }
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
        <header>
          <h1 className="text-3xl font-bold text-black">Stock Report</h1>
        </header>

        {/* Filters */}
        <section className="no-print overflow-visible rounded-[22px] border border-[#E8EDF3] bg-white shadow-[0_8px_20px_rgba(16,35,79,0.06)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left sm:px-8"
          >
            <div className="flex items-center gap-3">
              <Filter size={26} fill="currentColor" className="text-[#5793C1]" />
              <h2 className="text-2xl font-bold text-[#5793C1]">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-[#FFF1E5] px-2 py-0.5 text-xs font-bold text-[#E96B10]">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            {showFilters ? (
              <ChevronUp size={19} className="text-[#5793C1]" />
            ) : (
              <ChevronDown size={19} className="text-[#5793C1]" />
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

        {/* Summary metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Closing stock (By purchase price)" />
          <SummaryCard label="Closing stock (By sale price)" />
          <SummaryCard label="Potential profit" />
          <SummaryCard label="Profit Margin %" />
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
                  {columns.length} stock report columns
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

                    {columns.map((column) => (
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

              <ActionButton
                icon={Plus}
                onClick={() => {
                  setShowAddCustomField((visible) => !visible);
                  setCustomFieldError("");
                }}
              >
                Add Custom Field
              </ActionButton>
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

            {showAddCustomField && (
              <form
                onSubmit={addCustomField}
                className="flex flex-col gap-2 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-3 sm:flex-row sm:items-start"
              >
                <label className="flex-1">
                  <span className="mb-1 block text-xs font-semibold text-[#557493]">
                    Custom field name
                  </span>
                  <input
                    autoFocus
                    required
                    maxLength={40}
                    value={customFieldName}
                    onChange={(event) => {
                      setCustomFieldName(event.target.value);
                      setCustomFieldError("");
                    }}
                    placeholder="Enter field name"
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  />
                  {customFieldError && (
                    <span className="mt-1 block text-xs text-rose-600">
                      {customFieldError}
                    </span>
                  )}
                </label>
                <div className="flex gap-2 sm:pt-5">
                  <ActionButton icon={Plus} primary type="submit">
                    Add field
                  </ActionButton>
                  <ActionButton
                    icon={X}
                    onClick={() => {
                      setShowAddCustomField(false);
                      setCustomFieldName("");
                      setCustomFieldError("");
                    }}
                  >
                    Cancel
                  </ActionButton>
                </div>
              </form>
            )}

            {/* Horizontal scrolling supports the stock and added custom columns. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1900px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                  {columns
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
                    {columns
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
                    {columns
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
