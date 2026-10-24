
import { useMemo, useState } from "react";
import {
  MapPin,
  CalendarDays,
  ChevronDown,
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
  TrendingUp,
  Wallet,
  ChartNoAxesCombined,
  Boxes,
  RotateCcw,
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

const stockLeft = [
  { label: "Opening Stock", detail: "(By purchase price)", value: "₹ 723,712.00" },
  { label: "Opening Stock", detail: "(By sale price)", value: "₹ 904,625.75" },
  { label: "Total purchase", detail: "(Exc. tax, Discount)", value: "₹ 0.00" },
  { label: "Total Stock Adjustment", value: "₹ 0.00" },
  { label: "Total Expense", value: "₹ 0.00" },
  { label: "Total purchase shipping charge", value: "₹ 0.00" },
  { label: "Purchase additional expenses", value: "₹ 0.00" },
  { label: "Total transfer shipping charge", value: "₹ 100.00" },
  { label: "Total Sell discount", value: "₹ 23.17" },
  { label: "Total customer reward", value: "₹ 0.00" },
  { label: "Total Sell Return", value: "₹ 0.00" },
];

const stockRight = [
  { label: "Closing stock", detail: "(By purchase price)", value: "₹ 723,051.00" },
  { label: "Closing stock", detail: "(By sale price)", value: "₹ 903,799.50" },
  { label: "Total Sales", detail: "(Exc. tax, Discount)", value: "₹ 1,869.90" },
  { label: "Total sell shipping charge", value: "₹ 320.00" },
  { label: "Sell additional expenses", value: "₹ 0.00" },
  { label: "Total Stock Recovered", value: "₹ 0.00" },
  { label: "Total Purchase Return", value: "₹ 0.00" },
  { label: "Total Purchase discount", value: "₹ 0.00" },
  { label: "Total sell round off", value: "₹ 5.52" },
];

const initialProducts = [
  { product: "Amlodipine (0045)", profit: 9.0 },
  { product: "Amoxicillin (0038)", profit: 22.5 },
  { product: "Amoxicillin (0050)", profit: 22.5 },
  { product: "Amoxicillin (0056)", profit: 4.5 },
  { product: "Atorvastatin (Lipitor) (0047)", profit: 22.5 },
  { product: "Azithromycin (0057)", profit: 9.0 },
  { product: "Budesonide (0054)", profit: 4.5 },
  { product: "Dolo 650 (0001)", profit: 39.38 },
  { product: "Fluoxetine (Prozac) (0041)", profit: 13.5 },
  { product: "Fluoxetine (Prozac) (0051)", profit: 4.5 },
  { product: "Metformin (0055)", profit: 0 },
  { product: "Oxycodone (0043)", profit: 9.0 },
  { product: "Oxycodone (0081)", profit: 0 },
  { product: "Sertraline (Zoloft) (0040)", profit: 4.5 },
  { product: "Sertraline (Zoloft) (0049)", profit: 9.0 },
];

const categoryData = [
  { product: "Medicines", profit: 103.5 },
  { product: "Tablets", profit: 36.0 },
  { product: "Capsules", profit: 22.5 },
  { product: "Syrups", profit: 12.38 },
];

const brandData = [
  { product: "Dolo", profit: 39.38 },
  { product: "Amoxicillin", profit: 49.5 },
  { product: "Atorvastatin", profit: 22.5 },
  { product: "Sertraline", profit: 13.5 },
];

const locationData = [{ product: "Pharmacy", profit: 174.38 }];

const invoiceData = [
  { product: "Invoice #0004", profit: 72.0 },
  { product: "Invoice #0005", profit: 56.88 },
  { product: "Invoice #0006", profit: 45.5 },
];

const customerData = [
  { product: "Walk-In Customer", profit: 124.38 },
  { product: "Demo Customer", profit: 50.0 },
];

const dateData = [
  { product: "19/10/2026", profit: 45.0 },
  { product: "18/10/2026", profit: 64.38 },
  { product: "17/10/2026", profit: 65.0 },
];

const dayData = [
  { product: "Monday", profit: 24.5 },
  { product: "Tuesday", profit: 32.0 },
  { product: "Wednesday", profit: 18.0 },
  { product: "Thursday", profit: 27.5 },
  { product: "Friday", profit: 38.0 },
];

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

const money = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <h2 className="app-section-title text-[#10234F]">
          {title}
        </h2>
        {subtitle && (
          <p className="app-description mt-0.5 text-[#577B9F]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, rows, icon: Icon }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
      <div className="flex items-center gap-3 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-4 py-4 sm:px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
          <Icon size={18} />
        </div>
        <h2 className="text-sm font-extrabold text-[#10234F]">{title}</h2>
        <span className="ml-auto rounded-full bg-[#FFF1E5] px-2.5 py-1 text-[10px] font-bold text-[#E96B10]">
          {rows.length} items
        </span>
      </div>

      <div className="p-2 sm:p-3">
        {rows.map((row, index) => (
          <div
            key={`${row.label}-${index}`}
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2.5 ${
              index % 2 === 0 ? "bg-[#FFFCF8]" : "bg-white"
            }`}
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-4 text-[#19366F]">
                {row.label}
              </p>
              {row.detail && (
                <p className="mt-0.5 text-[10px] leading-4 text-[#577B9F]">
                  {row.detail}
                </p>
              )}
            </div>
            <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-[#10234F]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

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

function FilterSelect({ icon: Icon, value, onChange, children, accent = false }) {
  return (
    <label
      className={`relative flex h-10 min-w-0 items-center gap-2 rounded-xl border px-3 transition focus-within:ring-2 ${
        accent
          ? "border-[#FF8A37]/35 bg-[#FFF7EF] focus-within:ring-[#FF8A37]/15"
          : "border-[#E8EDF4] bg-white focus-within:ring-[#1475F8]/10"
      }`}
    >
      <Icon
        size={16}
        className={accent ? "shrink-0 text-[#F04A13]" : "shrink-0 text-[#577B9F]"}
      />
      <select
        value={value}
        onChange={onChange}
        className="h-full w-full min-w-0 appearance-none bg-transparent pr-5 text-xs font-semibold text-[#19366F] outline-none"
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 text-[#577B9F]"
      />
    </label>
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
    <main className="min-h-full min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      {/* Page header */}
      <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
            <ChartNoAxesCombined size={23} />
          </div>
          <div>
            <p className="mb-2 inline-flex rounded-lg bg-[#FFE9D9] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#F04A13]">
              Pharmacy · Reports
            </p>
            <h1 className="app-page-title text-[#10234F]">
              Profit / Loss Report
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Review stock valuation, sales and profit breakdowns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:w-[430px]">
          <FilterSelect
            icon={MapPin}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="all">All locations</option>
            <option value="main">Main Pharmacy</option>
            <option value="branch">Branch Pharmacy</option>
          </FilterSelect>

          <FilterSelect
            icon={CalendarDays}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            accent
          >
            <option value="all">Filter by date</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
          </FilterSelect>
        </div>
      </header>

      {/* Stock overview */}
      <section className="mb-6 grid grid-cols-1 items-start gap-3 xl:grid-cols-2">
        <SummaryCard
          title="Opening Stock & Expenses"
          rows={stockLeft}
          icon={Boxes}
        />
        <SummaryCard
          title="Closing Stock & Sales"
          rows={stockRight}
          icon={Package}
        />
      </section>

      {/* Profit summary */}
      <section className="mb-6">
        <SectionHeading
          icon={Wallet}
          title="Profit Calculation Summary"
          subtitle="A breakdown of the key values in your profit and loss report."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="relative overflow-hidden rounded-xl border border-[#F8EBDD] bg-white p-4 shadow-[0_3px_8px_rgba(25,43,80,0.04)]">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#FFF1E4]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#526D8D]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE5AD] text-[#F47700]">
                  <Boxes size={17} />
                </div>
                Cost of Goods Sold
              </div>
              <p className="mt-3 text-xl font-extrabold tracking-tight text-[#F47700] sm:text-2xl">
                ₹ 1,446,763.00
              </p>
              <p className="mt-2 text-xs leading-5 text-[#577B9F]">
                Cost of Goods Sold = Starting inventory (opening stock) +
                purchases − ending inventory (closing stock)
              </p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-xl border border-[#E6EDF5] bg-white p-4 shadow-[0_3px_8px_rgba(25,43,80,0.04)]">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#EFF5FF]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#526D8D]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#CDE6FF] text-[#087AF0]">
                  <TrendingUp size={17} />
                </div>
                Gross Profit
              </div>
              <p className="mt-3 text-xl font-extrabold tracking-tight text-[#087AF0] sm:text-2xl">
                ₹ 174.38
              </p>
              <p className="mt-2 text-xs leading-5 text-[#577B9F]">
                (Total sell price − Total purchase price)
              </p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-xl border border-[#E6EDF5] bg-white p-4 shadow-[0_3px_8px_rgba(25,43,80,0.04)]">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#EAF8F0]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#526D8D]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D1FBD1] text-[#13A52E]">
                  <ChartNoAxesCombined size={17} />
                </div>
                Net Profit
              </div>
              <p className="mt-3 text-xl font-extrabold tracking-tight text-[#13A52E] sm:text-2xl">
                ₹ 376.73
              </p>
              <div className="mt-2 space-y-1 text-[11px] leading-5 text-[#577B9F]">
                <p>
                  Gross Profit + (Total sell shipping charge + Sell additional
                  expenses + Total Stock Recovered + Total Purchase discount +
                  Total sell round off)
                </p>
                <p>
                  − (Total Stock Adjustment + Total Expense + Total purchase
                  shipping charge + Total transfer shipping charge + Purchase
                  additional expenses + Total Sell discount + Total customer
                  reward)
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Detailed report */}
      <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
        <div className="border-b border-[#F2E8DE] px-4 py-4 sm:px-5">
          <SectionHeading
            icon={FileSpreadsheet}
            title="Detailed Profit Report"
            subtitle="Switch between report views to review your profit breakdown."
          />
        </div>

        {/* Report tabs */}
        <div className="border-b border-[#F2E8DE] bg-[#FFFCF8]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-8">
            {reportTabs.map(({ name, icon: Icon }) => {
              const active = activeTab === name;

              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => handleTabChange(name)}
                  className={`relative flex min-h-[58px] items-center gap-2 border-b-2 px-3 py-3 text-left text-xs font-semibold transition ${
                    active
                      ? "border-[#FF711A] bg-[#FFF1E5] text-[#10234F]"
                      : "border-transparent text-[#577B9F] hover:bg-[#FFF7EF] hover:text-[#10234F]"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-[#FF711A] text-white"
                        : "bg-[#FFE9D9] text-[#F04A13]"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="leading-4">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table toolbar */}
        <div className="flex flex-col gap-4 border-b border-[#F2E8DE] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex h-9 items-center gap-2 text-xs text-[#577B9F]">
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
                placeholder="Search records..."
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
              <tr className="border-b border-[#F2E8DE] bg-[#FFF7EF] text-[#19366F]">
                {visibleColumns.name && (
                  <th className="px-4 py-4 font-bold sm:px-5">
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
                  <th className="px-4 py-4 font-bold sm:px-5">
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
                  className={`border-b border-[#F2E8DE] transition-colors hover:bg-[#FFF1E5]/70 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#FFFCF8]"
                  }`}
                >
                  {visibleColumns.name && (
                    <td                     className="app-table-cell px-4 py-4 font-medium text-[#19366F] sm:px-5">
                      {item.product}
                    </td>
                  )}

                  {visibleColumns.profit && (
                    <td className="app-table-cell px-4 py-4 font-semibold tabular-nums text-[#10234F] sm:px-5">
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
              <tr className="border-t border-[#F2E8DE] bg-[#FFF1E5]">
                {visibleColumns.name && (
                  <td className="px-4 py-4 font-extrabold text-[#10234F] sm:px-5">
                    Total
                  </td>
                )}
                {visibleColumns.profit && (
                  <td className="px-4 py-4 font-extrabold tabular-nums text-[#10234F] sm:px-5">
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
        className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1475F8] text-white shadow-[0_5px_14px_rgba(20,117,248,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0865DF] print:hidden"
      >
        <TrendingUp size={19} />
      </button>
    </main>
  );
}
