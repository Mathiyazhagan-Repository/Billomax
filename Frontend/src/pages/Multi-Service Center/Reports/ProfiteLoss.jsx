
import { useMemo, useState } from "react";
import {
  MapPin,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDownWideNarrow,
  Search,
  FileSpreadsheet,
  FileText,
  Printer,
  Columns3,
  Package,
  Tags,
  MapPinned,
  Calendar,
  UserRound,
  ReceiptText,
  Boxes,
} from "lucide-react";

const reportTabs = [
  { name: "Profit by products", icon: Package },
  { name: "Profit by categories", icon: Tags },
  { name: "Profit by brands", icon: Boxes },
  { name: "Profit by locations", icon: MapPinned },
  { name: "Profit by invoice", icon: ReceiptText },
  { name: "Profit by date", icon: Calendar },
  { name: "Profit by customer", icon: UserRound },
  { name: "Profit by day", icon: CalendarDays },
];

const initialProducts = [
  { product: "Ac Repair (0060)", profit: 3856 },
  { product: "CPU (0073)", profit: 6250 },
  { product: "jan (12)", profit: 1404 },
];
const categoryData = [];
const brandData = [];
const locationData = [];
const invoiceData = [];
const customerData = [];
const dateData = [];
const dayData = [];

const tabData = {
  "Profit by products": initialProducts,
  "Profit by categories": categoryData,
  "Profit by brands": brandData,
  "Profit by locations": locationData,
  "Profit by invoice": invoiceData,
  "Profit by date": dateData,
  "Profit by customer": customerData,
  "Profit by day": dayData,
};

const profitSummary = {
  cogs: 37240,
  grossProfit: 11510,
  netProfit: 9337,
};

const openingStockRows = [
  { label: "Opening Stock", detail: "(By purchase price):", value: 37240 },
  { label: "Opening Stock", detail: "(By sale price):", value: 50370 },
  { label: "Total purchase:", detail: "(Exc. tax, Discount)", value: 0 },
  { label: "Total Stock Adjustment:", value: 0 },
  { label: "Total Expense:", value: 0 },
  { label: "Total purchase shipping charge:", value: 0 },
  { label: "Purchase additional expenses:", value: 0 },
  { label: "Total transfer shipping charge:", value: 0 },
  { label: "Total Sell discount:", value: 2273 },
  { label: "Total customer reward:", value: 0 },
  { label: "Total Sell Return:", value: 0 },
];

const closingStockRows = [
  { label: "Closing stock", detail: "(By purchase price):", value: 0 },
  { label: "Closing stock", detail: "(By sale price):", value: 0 },
  { label: "Total Sales:", detail: "(Exc. tax, Discount)", value: 48750 },
  { label: "Total sell shipping charge:", value: 100 },
  { label: "Sell additional expenses:", value: 0 },
  { label: "Total Stock Recovered:", value: 0 },
  { label: "Total Purchase Return:", value: 0 },
  { label: "Total Purchase discount:", value: 0 },
  { label: "Total sell round off:", value: 0 },
];

const money = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ExportButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] shadow-sm transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13] focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20"
    >
      <Icon size={15} />
      <span>{children}</span>
    </button>
  );
}

export default function ProfitLoss() {
  const [location, setLocation] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("Profit by products");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    profit: true,
  });

  const currentData = tabData[activeTab] || initialProducts;

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = currentData.filter((item) =>
      item.product.toLowerCase().includes(query)
    );

    return [...result].sort((a, b) =>
      sortDirection === "asc"
        ? a.product.localeCompare(b.product)
        : b.product.localeCompare(a.product)
    );
  }, [currentData, search, sortDirection]);

  const total = filteredData.reduce((sum, item) => sum + item.profit, 0);
  const pageCount = Math.max(
    1,
    Math.ceil(filteredData.length / Number(pageSize))
  );
  const safePage = Math.min(page, pageCount);
  const start = filteredData.length ? (safePage - 1) * Number(pageSize) : 0;
  const displayedData = filteredData.slice(
    start,
    start + Number(pageSize)
  );

  const handleTabChange = (name) => {
    setActiveTab(name);
    setSearch("");
    setPage(1);
  };

  const downloadCSV = () => {
    const csv = [
      ["Name", "Gross Profit"],
      ...filteredData.map((item) => [item.product, item.profit.toFixed(2)]),
      ["Total", total.toFixed(2)],
    ]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "profit-loss-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    // Retains the original behavior: CSV opens in spreadsheet applications.
    downloadCSV();
  };

  const printReport = () => window.print();

  const downloadPDF = () => {
    // Retains the original print-to-PDF behavior.
    window.print();
  };

  return (
    <main className="min-h-full min-w-0 flex-1 overflow-x-hidden bg-[#F7F7F7] px-3 py-4 font-sans text-[#4B4B4B] sm:px-4">
      <header className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-black">Profit / Loss Report</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-10 min-w-[260px] items-center rounded-md border border-[#D1D5DB] bg-white">
            <span className="flex h-full w-11 shrink-0 items-center justify-center bg-[#1475E8] text-white">
              <MapPin size={18} fill="currentColor" />
            </span>
            <select
              aria-label="Business location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="h-full min-w-0 flex-1 bg-white px-3 text-sm text-[#555555] outline-none"
            >
              <option value="all">All locations</option>
              <option value="msc">Multi-Service Center</option>
            </select>
          </label>

          <label className="relative flex h-10 min-w-[180px] items-center rounded-lg bg-[#7377FF] pl-3 pr-2 text-sm font-semibold text-white sm:ml-5">
            <CalendarDays size={17} className="mr-1.5 shrink-0" />
            <select
              aria-label="Filter by date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="h-full min-w-0 flex-1 appearance-none bg-transparent pr-5 text-white outline-none"
            >
              <option value="all" className="text-[#333333]">Filter by date</option>
              <option value="today" className="text-[#333333]">Today</option>
              <option value="week" className="text-[#333333]">This week</option>
              <option value="month" className="text-[#333333]">This month</option>
              <option value="year" className="text-[#333333]">This year</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3" />
          </label>
        </div>
      </header>

      <section className="mb-4 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2">
        {[
          { title: "Opening Stock", rows: openingStockRows },
          { title: "Closing stock", rows: closingStockRows },
        ].map(({ title, rows }) => (
          <article
            key={title}
            className="rounded-[22px] border border-[#E8E8E8] bg-white px-5 py-5 shadow-[0_8px_20px_rgba(0,0,0,0.07)] sm:px-10"
          >
            <div>
              {rows.map((row, index) => (
                <div
                  key={`${row.label}-${index}`}
                  className={`grid min-h-[43px] grid-cols-[minmax(0,1fr)_minmax(120px,28%)] items-center gap-3 px-2.5 py-2 text-sm ${
                    index % 2 === 0 ? "bg-[#F7F7F7]" : "bg-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-[#1F2937]">{row.label}</p>
                    {row.detail && (
                      <p className="mt-0.5 text-xs font-semibold text-[#7A7A7A]">
                        {row.detail}
                      </p>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-[#1F2937]">
                    {money(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-[#ECECEC] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(0,0,0,0.08)] sm:px-8">
        <div className="space-y-2">
          <div>
            <h1 className="text-lg font-bold text-[#FF9418]">
              COGS: {money(profitSummary.cogs)}
            </h1>
            <p className="text-xs text-[#929292]">
              Cost of Goods Sold = Starting inventory(opening stock) +
              purchases − ending inventory(closing stock)
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#FF9418]">
              Gross Profit: {money(profitSummary.grossProfit)}
            </h2>
            <p className="text-xs text-[#929292]">
              (Total sell price - Total purchase price)
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#FF9418]">
              Net Profit: {money(profitSummary.netProfit)}
            </h2>
            <div className="text-xs leading-4 text-[#929292]">
              <p>
                Gross Profit + (Total sell shipping charge + Sell additional
                expenses + Total Stock Recovered + Total Purchase discount +
                Total sell round off)
              </p>
              <p>
                - (Total Stock Adjustment + Total Expense + Total purchase
                shipping charge + Total transfer shipping charge + Purchase
                additional expenses + Total Sell discount + Total customer
                reward)
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#7377FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6266EB] print:hidden"
        >
          <Printer size={16} />
          Print
        </button>
      </div>

      {/* Detailed report */}
      <section className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
        {/* Report tabs */}
        <div className="border-b border-[#E8E8E8] bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {reportTabs.map(({ name, icon: Icon }) => {
              const active = activeTab === name;

              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => handleTabChange(name)}
                  className={`relative flex min-h-[48px] items-center gap-1.5 border-t-2 px-3 py-2 text-left text-xs font-semibold transition ${
                    active
                      ? "border-[#3F91C7] text-[#555555]"
                      : "border-transparent text-[#555555] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <Icon size={17} className="shrink-0" />
                  <span className="leading-4">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table toolbar */}
        <div className="flex flex-col gap-4 border-b border-[#E8E8E8] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex h-9 items-center gap-2 text-xs text-[#555555]">
                Show
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 rounded-lg border border-[#E8EDF4] bg-white px-3 font-semibold text-[#19366F] outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                entries
              </label>

              <ExportButton icon={FileText} onClick={downloadCSV}>
                Export CSV
              </ExportButton>
              <ExportButton icon={FileSpreadsheet} onClick={downloadExcel}>
                Export Excel
              </ExportButton>
              <ExportButton icon={Printer} onClick={printReport}>
                Print
              </ExportButton>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColumns((current) => !current)}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${
                    showColumns
                      ? "border-[#FF8A37] bg-[#FFF1E5] text-[#F04A13]"
                      : "border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                  }`}
                >
                  <Columns3 size={15} />
                  Columns
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${showColumns ? "rotate-180" : ""}`}
                  />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-11 z-30 w-56 rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-[0_12px_35px_rgba(16,35,79,0.14)]">
                    <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-[#8A98AA]">
                      Visible columns
                    </p>
                    {[
                      ["name", "Name column"],
                      ["profit", "Gross Profit column"],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-xs font-medium text-[#19366F] transition hover:bg-[#FFF7EF]"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns[key]}
                          onChange={(e) =>
                            setVisibleColumns((current) => ({
                              ...current,
                              [key]: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 accent-[#FF711A]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <ExportButton icon={FileText} onClick={downloadPDF}>
                Export PDF
              </ExportButton>
            </div>

            <label className="relative flex h-10 w-full items-center sm:max-w-[280px]">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 text-[#8A98AA]"
              />
              <input
                type="search"
                placeholder="Search ..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-full w-full rounded-lg border border-[#E8EDF4] bg-white pl-9 pr-3 text-xs text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>
        </div>

        {/* Data table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-white text-[#333333]">
                {visibleColumns.name && (
                  <th className="px-3 py-3 font-bold sm:px-4">
                    <button
                      type="button"
                      onClick={() =>
                        setSortDirection((current) =>
                          current === "asc" ? "desc" : "asc"
                        )
                      }
                      className="inline-flex items-center gap-2 transition hover:text-[#F04A13]"
                    >
                      {activeTab === "Profit by products"
                        ? "Product"
                        : activeTab
                            .replace("Profit by ", "")
                            .replace(/^./, (c) => c.toUpperCase())}
                      {sortDirection === "asc" ? (
                        <ArrowDownWideNarrow
                          size={14}
                          className="text-[#FF711A]"
                        />
                      ) : (
                        <ArrowUpDown size={14} className="text-[#FF711A]" />
                      )}
                    </button>
                  </th>
                )}

                {visibleColumns.profit && (
                  <th className="px-3 py-3 font-bold sm:px-4">
                    <span className="inline-flex items-center gap-2">
                      Gross Profit
                      <ArrowUpDown size={13} className="text-[#9AA7B8]" />
                    </span>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {displayedData.map((item, index) => (
                <tr
                  key={`${item.product}-${index}`}
                  className={`border-b border-[#EEEEEE] transition-colors hover:bg-[#F5F5F5] ${
                    index % 2 === 0 ? "bg-[#F8F8F8]" : "bg-white"
                  }`}
                >
                  {visibleColumns.name && (
                    <td className="app-table-cell px-3 py-3 font-medium text-[#4B5563] sm:px-4">
                      {item.product}
                    </td>
                  )}

                  {visibleColumns.profit && (
                    <td className="app-table-cell px-3 py-3 font-semibold tabular-nums text-[#4B5563] sm:px-4">
                      {money(item.profit)}
                    </td>
                  )}
                </tr>
              ))}

              {displayedData.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      Number(visibleColumns.name) +
                      Number(visibleColumns.profit)
                    }
                    className="h-36 px-4 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-[#8A98AA]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2F5F9]">
                        <Search size={18} />
                      </div>
                      <p className="font-semibold text-[#526581]">
                        No matching records found
                      </p>
                      <p className="text-[11px]">
                        Try another search term.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr className="border-t border-[#E3E5E8] bg-[#D4D7DE]">
                {visibleColumns.name && (
                  <td className="px-3 py-3 font-extrabold text-[#333333] sm:px-4">
                    Total:
                  </td>
                )}
                {visibleColumns.profit && (
                  <td className="px-3 py-3 font-extrabold tabular-nums text-[#333333] sm:px-4">
                    {money(total)}
                  </td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-[#577B9F]">
            Showing{" "}
            <span className="font-bold text-[#19366F]">
              {filteredData.length === 0 ? 0 : start + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-[#19366F]">
              {Math.min(start + Number(pageSize), filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#19366F]">
              {filteredData.length}
            </span>{" "}
            entries
          </p>

          <div className="flex items-center self-start sm:self-auto">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-l-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
              Previous
            </button>

            <span className="flex h-9 min-w-10 items-center justify-center border-y border-[#FF711A] bg-[#FF711A] px-3 text-xs font-bold text-white">
              {safePage}
            </span>

            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-r-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Report note */}
        <div className="border-t border-[#F2E8DE] bg-[#FFFCF8] px-4 py-3 sm:px-5">
          <p className="text-[11px] leading-5 text-[#577B9F]">
            <span className="font-bold text-[#19366F]">Note:</span> Profit by
            products/categories/brands only considers inline discount. Invoice
            discount is not considered.
          </p>
        </div>
      </section>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-[#3478F6] text-white shadow-[0_5px_14px_rgba(20,117,248,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0865DF] print:hidden"
      >
        <ChevronUp size={20} />
      </button>
    </main>
  );
}
