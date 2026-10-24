
import React, { useMemo, useState } from "react";
import {
  Filter,
  Search,
  FileSpreadsheet,
  FileText,
  Printer,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CalendarDays,
  Package,
  MapPin,
  Download,
  RotateCcw,
  X,
} from "lucide-react";

const initialStockData = [
  {
    id: 1,
    product: "Accessories (8200)",
    sku: "8200",
    location: "Palm Street",
    stock: 7985,
    lotNumber: "",
    expDate: "",
    mfgDate: "--",
    unit: "Pc(s)",
  },
  {
    id: 2,
    product: "Asus TUF F15 (0001)",
    sku: "0001",
    location: "Palm Street",
    stock: 1788,
    lotNumber: "",
    expDate: "",
    mfgDate: "--",
    unit: "Pc(s)",
  },
  {
    id: 3,
    product: "Smsung J7 Pro (AS0016)",
    sku: "AS0016",
    location: "WDM - Billing Software",
    stock: 4650,
    lotNumber: "",
    expDate: "",
    mfgDate: "--",
    unit: "Pc(s)",
  },
  {
    id: 4,
    product: "IMAC (4520)",
    sku: "4520",
    location: "WDM - Billing Software",
    stock: 5000,
    lotNumber: "",
    expDate: "2024-10-10",
    mfgDate: "--",
    unit: "Pc(s)",
  },
  {
    id: 5,
    product: "T Shirt (5200)",
    sku: "5200",
    location: "WDM - Billing Software",
    stock: 14019,
    lotNumber: "",
    expDate: "",
    mfgDate: "--",
    unit: "Pc(s)",
  },
  {
    id: 6,
    product: "IMAC (4520)",
    sku: "4520",
    location: "WDM - Billing Software",
    stock: 525,
    lotNumber: "",
    expDate: "",
    mfgDate: "--",
    unit: "Pc(s)",
  },
  {
    id: 7,
    product: "Samsung F41 (6000)",
    sku: "6000",
    location: "WDM - Billing Software",
    stock: 11,
    lotNumber: "",
    expDate: "",
    mfgDate: "--",
    unit: "Pc(s)",
  },
];

const columns = [
  { key: "product", label: "Product" },
  { key: "sku", label: "SKU" },
  { key: "location", label: "Location" },
  { key: "stock", label: "Stock Left" },
  { key: "lotNumber", label: "Lot Number" },
  { key: "expDate", label: "EXP Date" },
  { key: "mfgDate", label: "MFG Date" },
];

const numberFormat = (value) =>
  Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const controlClass =
  "rounded-lg border border-[#E0E7F0] bg-white px-3 py-2 text-sm text-[#19366F] outline-none transition placeholder:text-[#93A1B3] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105";

const exportButtonClass =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#DCE4EE] bg-white px-3 py-2 text-xs font-semibold text-[#526D8D] transition hover:border-[#FFB17E] hover:bg-[#FFF7EF] hover:text-[#F04A13]";

export default function StockExpiryReport() {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });
  const [filters, setFilters] = useState({
    location: "",
    product: "",
    expiryFrom: "",
    expiryTo: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    location: "",
    product: "",
    expiryFrom: "",
    expiryTo: "",
  });

  const locations = [...new Set(initialStockData.map((item) => item.location))];

  const filteredData = useMemo(() => {
    let data = initialStockData.filter((item) => {
      const searchText = [
        item.product,
        item.sku,
        item.location,
        item.lotNumber,
        item.expDate,
        item.mfgDate,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesLocation =
        !appliedFilters.location || item.location === appliedFilters.location;
      const matchesProduct =
        !appliedFilters.product ||
        item.product.toLowerCase().includes(appliedFilters.product.toLowerCase());

      const matchesExpiryFrom =
        !appliedFilters.expiryFrom ||
        (item.expDate && item.expDate >= appliedFilters.expiryFrom);

      const matchesExpiryTo =
        !appliedFilters.expiryTo ||
        (item.expDate && item.expDate <= appliedFilters.expiryTo);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesProduct &&
        matchesExpiryFrom &&
        matchesExpiryTo
      );
    });

    if (sortConfig.key) {
      data = [...data].sort((a, b) => {
        const first = a[sortConfig.key];
        const second = b[sortConfig.key];

        const comparison =
          typeof first === "number"
            ? first - second
            : String(first ?? "").localeCompare(String(second ?? ""));

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return data;
  }, [search, appliedFilters, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / Number(pageSize))
  );

  const pageData = filteredData.slice(
    (currentPage - 1) * Number(pageSize),
    currentPage * Number(pageSize)
  );

  const totalStock = filteredData.reduce((sum, item) => sum + item.stock, 0);

  const startEntry = filteredData.length
    ? (currentPage - 1) * Number(pageSize) + 1
    : 0;

  const endEntry = Math.min(currentPage * Number(pageSize), filteredData.length);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const emptyFilters = {
      location: "",
      product: "",
      expiryFrom: "",
      expiryTo: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSearch("");
    setCurrentPage(1);
  };

  const toggleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const selectedColumns = columns.filter((column) =>
      visibleColumns.includes(column.key)
    );

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      selectedColumns.map((column) => escapeCSV(column.label)),
      ...filteredData.map((item) =>
        selectedColumns.map((column) =>
          escapeCSV(
            column.key === "stock"
              ? `${numberFormat(item.stock)} ${item.unit}`
              : item[column.key]
          )
        )
      ),
    ];

    rows.push([
      ...selectedColumns.map((column) =>
        escapeCSV(
          column.key === "product"
            ? "Total:"
            : column.key === "stock"
            ? `${numberFormat(totalStock)} Pc(s)`
            : ""
        )
      ),
    ]);

    const csv = rows.map((row) => row.join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "StockExpiryReport.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    // CSV is provided as a compatible spreadsheet export without extra libraries.
    exportCSV();
  };

  const printReport = () => {
    window.print();
  };

  const exportPDF = () => {
    // The browser's Print dialog supports saving this report as PDF.
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[#FFE9D9] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#F04A13]">
              <Package size={14} />
              Inventory reports
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
              Stock Expiry Report
            </h1>
            <p className="mt-1 text-sm text-[#577B9F]">
              Review stock quantities, batch details, and product expiry dates.
            </p>
          </div>
        </header>

        {/* Filters */}
        <section className="overflow-visible rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition hover:bg-[#FFFCF8] sm:px-6"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E5] text-[#F04A13]">
                <Filter size={19} />
              </span>
              <span>
                <span className="block text-base font-extrabold text-[#10234F]">
                  Filters
                </span>
                <span className="mt-0.5 block text-xs text-[#8798AD]">
                  Narrow the report by product, location, or expiry date
                </span>
              </span>
            </span>
            <ChevronDown
              size={19}
              className={`text-[#577B9F] transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilters && (
            <form
              onSubmit={applyFilters}
              className="grid grid-cols-1 gap-4 border-t border-[#F2E8DE] bg-[#FFFCF8] p-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              <label className="space-y-1.5 text-sm font-semibold">
                Product
                <input
                  value={filters.product}
                  onChange={(event) =>
                    updateFilter("product", event.target.value)
                  }
                  placeholder="Search product name"
                  className={`${controlClass} w-full`}
                />
              </label>

              <label className="space-y-1.5 text-sm font-semibold">
                Location
                <select
                  value={filters.location}
                  onChange={(event) =>
                    updateFilter("location", event.target.value)
                  }
                  className={`${controlClass} w-full`}
                >
                  <option value="">All locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1.5 text-sm font-semibold">
                Expiry date from
                <input
                  type="date"
                  value={filters.expiryFrom}
                  onChange={(event) =>
                    updateFilter("expiryFrom", event.target.value)
                  }
                  className={`${controlClass} w-full`}
                />
              </label>

              <label className="space-y-1.5 text-sm font-semibold">
                Expiry date to
                <input
                  type="date"
                  value={filters.expiryTo}
                  onChange={(event) =>
                    updateFilter("expiryTo", event.target.value)
                  }
                  className={`${controlClass} w-full`}
                />
              </label>

              <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-4">
                <button type="submit" className={primaryButton}>
                  <Filter size={16} />
                  Apply filters
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E0E7F0] bg-white px-4 py-3 text-sm font-semibold text-[#526D8D] transition hover:bg-[#FFF7EF]"
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Report table */}
        <section className="overflow-visible rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#10234F]">
                  Stock details
                </h2>
                <p className="mt-1 text-sm text-[#577B9F]">
                  {filteredData.length} matching{" "}
                  {filteredData.length === 1 ? "record" : "records"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <button type="button" onClick={exportCSV} className={exportButtonClass}>
                  <FileText size={14} />
                  Export CSV
                </button>
                <button type="button" onClick={exportExcel} className={exportButtonClass}>
                  <FileSpreadsheet size={14} />
                  Export Excel
                </button>
                <button type="button" onClick={printReport} className={exportButtonClass}>
                  <Printer size={14} />
                  Print
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColumnMenu((current) => !current)}
                    className={exportButtonClass}
                    aria-expanded={showColumnMenu}
                  >
                    <Eye size={14} />
                    Columns
                    <ChevronDown size={13} />
                  </button>

                  {showColumnMenu && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-xl">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-extrabold text-[#10234F]">
                          Visible columns
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowColumnMenu(false)}
                          aria-label="Close column menu"
                          className="rounded p-1 text-[#8798AD] hover:bg-[#FFF7EF]"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {columns.map((column) => (
                        <label
                          key={column.key}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#405775] hover:bg-[#FFFCF8]"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(column.key)}
                            onChange={(event) => {
                              setVisibleColumns((current) =>
                                event.target.checked
                                  ? [...current, column.key]
                                  : current.filter((key) => key !== column.key)
                              );
                            }}
                            className="h-4 w-4 accent-[#FF6814]"
                          />
                          {column.label}
                        </label>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          setVisibleColumns(columns.map((column) => column.key))
                        }
                        className="mt-2 w-full rounded-lg border border-[#E6EDF5] px-3 py-2 text-xs font-semibold text-[#526D8D] hover:bg-[#FFF7EF]"
                      >
                        Show all columns
                      </button>
                    </div>
                  )}
                </div>

                <button type="button" onClick={exportPDF} className={exportButtonClass}>
                  <Download size={14} />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
              <label className="flex items-center gap-2 text-sm text-[#526D8D]">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(event.target.value);
                    setCurrentPage(1);
                  }}
                  className={`${controlClass} py-1.5`}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                entries
              </label>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search..."
                  aria-label="Search stock expiry report"
                  className={`${controlClass} w-full pl-9`}
                />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="overflow-x-auto rounded-xl border border-[#E6EDF5]">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#FFF7EF] text-[#19366F]">
                    {columns
                      .filter((column) =>
                        visibleColumns.includes(column.key)
                      )
                      .map((column) => (
                        <th key={column.key} className="px-3 py-3.5">
                          <button
                            type="button"
                            onClick={() => toggleSort(column.key)}
                            className="flex items-center gap-2 whitespace-nowrap font-extrabold transition hover:text-[#F04A13]"
                          >
                            {column.label}
                            <ArrowUpDown
                              size={13}
                              className={
                                sortConfig.key === column.key
                                  ? "text-[#FF6814]"
                                  : "text-[#A0ADBC]"
                              }
                            />
                          </button>
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {pageData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#EDF0F4] transition odd:bg-white even:bg-[#FFFCF8] hover:bg-[#FFF4E9]"
                    >
                      {visibleColumns.includes("product") && (
                        <td className="px-3 py-3.5 font-medium text-[#19366F]">
                          {item.product}
                        </td>
                      )}
                      {visibleColumns.includes("sku") && (
                        <td className="px-3 py-3.5 text-[#405775]">
                          {item.sku}
                        </td>
                      )}
                      {visibleColumns.includes("location") && (
                        <td className="px-3 py-3.5">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#405775]">
                            <MapPin
                              size={13}
                              className="shrink-0 text-[#8798AD]"
                            />
                            {item.location}
                          </span>
                        </td>
                      )}
                      {visibleColumns.includes("stock") && (
                        <td className="whitespace-nowrap px-3 py-3.5 font-medium tabular-nums text-[#19366F]">
                          {numberFormat(item.stock)} {item.unit}
                        </td>
                      )}
                      {visibleColumns.includes("lotNumber") && (
                        <td className="px-3 py-3.5 text-[#8798AD]">
                          {item.lotNumber}
                        </td>
                      )}
                      {visibleColumns.includes("expDate") && (
                        <td className="whitespace-nowrap px-3 py-3.5">
                          {item.expDate ? (
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFF0E5] px-2 py-1 text-xs font-semibold text-[#C94A0B]">
                              <CalendarDays size={12} />
                              {item.expDate}
                            </span>
                          ) : (
                            <span className="text-[#A3AFBD]">—</span>
                          )}
                        </td>
                      )}
                      {visibleColumns.includes("mfgDate") && (
                        <td className="px-3 py-3.5 text-[#8798AD]">
                          {item.mfgDate}
                        </td>
                      )}
                    </tr>
                  ))}

                  {pageData.length === 0 && (
                    <tr>
                      <td
                        colSpan={Math.max(visibleColumns.length, 1)}
                        className="px-4 py-12 text-center text-sm text-[#8798AD]"
                      >
                        <Package
                          size={30}
                          className="mx-auto mb-2 opacity-50"
                        />
                        No stock records match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>

                {visibleColumns.includes("stock") && (
                  <tfoot>
                    <tr className="border-t-2 border-[#E0E7F0] bg-[#F3F5F9] font-extrabold text-[#10234F]">
                      {visibleColumns.map((key) => {
                        if (key === "product") {
                          return (
                            <td
                              key={key}
                              className="px-3 py-3.5 text-right"
                            >
                              Total:
                            </td>
                          );
                        }

                        if (key === "stock") {
                          return (
                            <td
                              key={key}
                              className="whitespace-nowrap px-3 py-3.5 tabular-nums"
                            >
                              {numberFormat(totalStock)} Pc(s)
                            </td>
                          );
                        }

                        return <td key={key} className="px-3 py-3.5" />;
                      })}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#577B9F]">
                Showing{" "}
                <span className="font-semibold text-[#19366F]">
                  {startEntry} to {endEntry}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#19366F]">
                  {filteredData.length}
                </span>{" "}
                entries
              </p>

              <div className="flex items-center gap-1 print:hidden">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E0E7F0] bg-white px-3 py-2 text-sm font-medium text-[#526D8D] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, pages) => (
                    <React.Fragment key={page}>
                      {index > 0 && page - pages[index - 1] > 1 && (
                        <span className="px-1 text-[#8798AD]">…</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={
                          currentPage === page ? "page" : undefined
                        }
                        className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                          currentPage === page
                            ? "border-[#FF6814] bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-sm"
                            : "border-[#E0E7F0] bg-white text-[#526D8D] hover:bg-[#FFF7EF]"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E0E7F0] bg-white px-3 py-2 text-sm font-medium text-[#526D8D] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <p className="px-1 text-xs leading-5 text-[#8798AD]">
          Report data shown here is based on the records supplied in the
          reference screenshot. Connect your inventory API to load live stock
          and expiry information.
        </p>
      </div>
    </main>
  );
}
