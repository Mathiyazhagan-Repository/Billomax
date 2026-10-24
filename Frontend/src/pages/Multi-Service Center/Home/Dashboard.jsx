import { useState } from "react";
import SalesData from "./SalesData.jsx";
import Sales from "./Sales.jsx";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Columns3,
  ClipboardCheck,
  CreditCard,
  FileDown,
  FileSpreadsheet,
  FileText,
  House,
  Info,
  IndianRupee,
  MapPin,
  Package,
  Printer,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
  TriangleAlert,
  Wallet,
  X,
} from "lucide-react";

const statistics = [
  {
    title: "ORDERS",
    value: "0",
    icon: ClipboardCheck,
    trend: "up",
    theme: "blue",
  },
  {
    title: "REVENUE",
    value: "₹0",
    icon: IndianRupee,
    trend: "up",
    theme: "purple",
  },
  {
    title: "TOTAL SELL",
    value: "0",
    icon: ShoppingCart,
    trend: "right",
    theme: "cyan",
  },
  {
    title: "NET PROFIT",
    value: "₹0",
    icon: BadgeDollarSign,
    trend: "up",
    theme: "green",
  },
  {
    title: "Total purchase",
    value: "₹ 0.00",
    icon: Package,
    trend: "down",
    theme: "yellow",
  },
  {
    title: "Purchase due",
    value: "₹ 0.00",
    icon: TriangleAlert,
    trend: "up",
    theme: "coral",
  },
  {
    title: "Total Purchase Return",
    value: "₹ 0.00",
    icon: RotateCcw,
    trend: "down",
    theme: "blue",
  },
  {
    title: "Expense",
    value: "₹ 0.00",
    icon: CreditCard,
    trend: "up",
    theme: "pink",
  },
];

const themes = {
  blue: {
    tile: "bg-[#D7E9FF]",
    icon: "text-[#087AF0]",
  },
  purple: {
    tile: "bg-[#EFE2FF]",
    icon: "text-[#8219F5]",
  },
  cyan: {
    tile: "bg-[#D0F4EA]",
    icon: "text-[#0DBB83]",
  },
  green: {
    tile: "bg-[#D9F5D8]",
    icon: "text-[#13A52E]",
  },
  yellow: {
    tile: "bg-[#FFF0D2]",
    icon: "text-[#F28A00]",
  },
  coral: {
    tile: "bg-[#FFD9E2]",
    icon: "text-[#F31652]",
  },
  pink: {
    tile: "bg-[#FBD9E9]",
    icon: "text-[#F31678]",
  },
};

const salesPaymentRows = [];
const purchasePaymentRows = [
  {
    supplier: "Ravi",
    reference: "PO2024/0004",
    amount: 300,
    location: "Multi-Service Center",
  },
];

const paymentColumns = {
  sales: [
    { key: "customer", label: "CUSTOMER" },
    { key: "invoice", label: "INVOICE NO." },
    { key: "amount", label: "DUE AMOUNT" },
    { key: "action", label: "ACTION" },
  ],
  purchase: [
    { key: "supplier", label: "SUPPLIER" },
    { key: "reference", label: "REFERENCE NO." },
    { key: "amount", label: "DUE AMOUNT" },
    { key: "action", label: "ACTION" },
  ],
};

function TrendIcon({ trend }) {
  if (trend === "right") return <ChevronRight size={16} strokeWidth={3} />;
  if (trend === "down") return <ArrowDown size={16} strokeWidth={2.8} />;
  return <ArrowUpRight size={16} strokeWidth={2.8} />;
}

function StatCard({ item }) {
  const Icon = item.icon;
  const theme = themes[item.theme];

  return (
    <article
      className="relative flex min-h-[136px] min-w-0 items-center gap-4 rounded-2xl border border-[#E8EDF4] bg-white/90 px-4 py-0 shadow-[0_3px_9px_rgba(19,38,83,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_7px_16px_rgba(19,38,83,0.12)] sm:min-h-[154px] sm:gap-5 sm:px-5 sm:py-0"
    >
      <div
        className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-xl sm:h-[74px] sm:w-[74px] ${theme.tile}`}
      >
        <Icon
          aria-hidden="true"
          size={34}
          strokeWidth={2.3}
          className={theme.icon}
        />
      </div>

      <div className="min-w-0 flex-1 pr-7">
        <h2 className="truncate text-[11px] font-bold tracking-[-0.2px] text-[#7186A8]">
          {item.title}
        </h2>
        <p className="mt-1 text-[18px] font-extrabold leading-none tracking-[-0.3px] text-[#102A53]">
          {item.value}
        </p>
        <p className="mt-1 text-[10px] font-medium text-[#7186A8]">
          Since last month
        </p>
      </div>

      <span
        aria-hidden="true"
        className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#E4EAF2] bg-white ${theme.icon} sm:right-5 sm:top-4`}
      >
        <TrendIcon trend={item.trend} />
      </span>
    </article>
  );
}

function PaymentDuePanel({ type, title, highlight, description, color, rows }) {
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [showColumns, setShowColumns] = useState(false);
  const columns = paymentColumns[type];
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() =>
    columns.map((column) => column.key)
  );
  const displayColumns = columns.filter((column) =>
    visibleColumnKeys.includes(column.key)
  );
  const isOrange = color === "orange";
  const theme = isOrange
    ? {
        border: "border-[#FF762E]",
        tint: "from-[#FFFAF5] to-white",
        iconWrap: "bg-[#FFF0E4]",
        icon: "text-[#FF5C32]",
        title: "text-[#172B53]",
        highlight: "text-[#F4772E]",
        button: "bg-[#F47A32] hover:bg-[#E96924]",
        tableHead: "bg-[#FFF5EB]",
      }
    : {
        border: "border-[#397DFF]",
        tint: "from-[#F3F7FF] to-white",
        iconWrap: "bg-[#FFE8EE]",
        icon: "text-[#F34364]",
        title: "text-[#172B53]",
        highlight: "text-[#397DFF]",
        button: "bg-[#3472F3] hover:bg-[#2863DF]",
        tableHead: "bg-[#EEF4FF]",
      };
  const filteredRows = rows.filter(
    (row) => !location || row.location === location
  );
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <article
      className={`relative flex min-w-0 flex-col overflow-hidden rounded-[26px] border bg-gradient-to-br p-4 shadow-[0_8px_22px_rgba(22,42,75,0.06)] sm:p-6 ${theme.border} ${theme.tint}`}
    >
      <header className="mb-5 grid grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[18px] ${theme.iconWrap}`}
          >
            <TriangleAlert size={29} strokeWidth={2.5} className={theme.icon} />
          </span>
          <div className="min-w-0">
            <h2 className={`flex flex-wrap items-center gap-x-1.5 text-base font-extrabold leading-tight tracking-[-0.04em] sm:text-lg ${theme.title}`}>
              {title}
              <span className={theme.highlight}>{highlight}</span>
              <Info size={19} className="ml-1 shrink-0 text-[#17BCE0]" />
            </h2>
            <p className="mt-1.5 text-xs text-[#6C83A8] sm:text-sm">
              {description}
            </p>
          </div>
        </div>

        <label className="relative block w-full">
          <span className="sr-only">Filter by location</span>
          <MapPin
            size={19}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#485E80]"
          />
          <select
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setPage(1);
            }}
            className="h-[46px] w-full appearance-none rounded-xl border border-[#E1E6EE] bg-white pl-10 pr-10 text-[11px] font-medium text-[#344766] shadow-[0_2px_5px_rgba(20,40,70,0.12)] outline-none focus:border-[#5387F5]"
          >
            <option value="">Select location</option>
            <option value="Multi-Service Center">Multi-Service Center</option>
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#344766]"
          />
        </label>
      </header>

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        {[
          { label: "Export CSV", icon: FileText, action: "csv" },
          { label: "Export Excel", icon: FileSpreadsheet, action: "excel" },
          { label: "Print", icon: Printer, action: "print" },
          { label: "Column visibility", icon: Columns3, action: "columns" },
          { label: "Export PDF", icon: FileDown, action: "pdf" },
        ].map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              if (action === "columns") setShowColumns((current) => !current);
              if (action === "print") window.print();
              if (action === "pdf") {
                window.alert("PDF export is not available yet.");
              }
              if (action === "csv" || action === "excel") {
                if (filteredRows.length === 0) {
                  window.alert("There is no data available to export.");
                  return;
                }
                const exportColumns = displayColumns.filter(
                  (column) => column.key !== "action"
                );
                const csv = [
                  exportColumns.map((column) => column.label).join(","),
                  ...filteredRows.map((row) =>
                    exportColumns
                      .map((column) => `"${String(row[column.key]).replaceAll('"', '""')}"`)
                      .join(",")
                  ),
                ].join("\n");
                const blob = new Blob([csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${type}-payments.${action === "csv" ? "csv" : "xls"}`;
                link.click();
                URL.revokeObjectURL(url);
              }
            }}
            className={`inline-flex h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-[11px] font-bold text-white shadow-[0_5px_12px_rgba(35,80,170,0.16)] transition hover:-translate-y-px hover:brightness-105 sm:px-4 ${theme.button}`}
          >
            <Icon size={18} strokeWidth={2.2} />
            {label}
          </button>
        ))}
      </div>

      {showColumns && (
        <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 rounded-xl border border-[#E4EAF2] bg-white p-3 text-[11px] text-[#344766]">
          {columns.map((column) => (
            <label key={column.key} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={visibleColumnKeys.includes(column.key)}
                onChange={() =>
                  setVisibleColumnKeys((current) =>
                    current.includes(column.key)
                      ? current.filter((key) => key !== column.key)
                      : [...current, column.key]
                  )
                }
                className="accent-[#3472F3]"
              />
              {column.label}
            </label>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {displayColumns.map((column, index) => (
                <th
                  key={column.key}
                  className={`border-y border-[#E6EAF0] px-3.5 py-3.5 text-[11px] font-extrabold tracking-wide text-[#1B3159] sm:px-4 ${theme.tableHead} ${
                    index === 0 ? "rounded-tl-[18px] border-l" : ""
                  } ${
                    index === columns.length - 1
                      ? "rounded-tr-[18px] border-r"
                      : ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length > 0 ? (
              pageRows.map((row) => (
                <tr key={row.reference} className="bg-white/80">
                  {displayColumns.map((column, index) => (
                    <td
                      key={column.key}
                      className={`border-b border-[#E6EAF0] px-3.5 py-3.5 text-xs text-[#3A5279] sm:px-4 ${
                        index === 0 ? "border-l" : ""
                      } ${
                        index === columns.length - 1
                          ? "border-r"
                          : ""
                      }`}
                    >
                      {column.key === "reference" ? (
                        <span className="font-semibold text-[#3478FF]">
                          {row.reference}
                        </span>
                      ) : column.key === "amount" ? (
                        `₹ ${Number(row.amount).toFixed(2)}`
                      ) : column.key === "action" ? (
                        <button
                          type="button"
                          onClick={() =>
                            window.alert("Payment entry is not available yet.")
                          }
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#43D2B0] bg-[#F7FFFC] px-3.5 py-2.5 font-semibold text-[#4AB99F] transition hover:bg-[#E9FFF8]"
                        >
                          <Wallet size={18} />
                          Add payment
                        </button>
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={displayColumns.length || 1}
                  className="border-x border-b border-[#E6EAF0] bg-white/85 px-4 py-6 text-center"
                >
                  <span
                    className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full ${
                      isOrange ? "bg-[#FFF0E1]" : "bg-[#EAF2FF]"
                    }`}
                  >
                    <span className="relative">
                      <ReceiptText
                        size={31}
                        className={isOrange ? "text-[#FFB36B]" : "text-[#86B4FF]"}
                      />
                      <X
                        size={15}
                        className={`absolute -bottom-1 -right-2 rounded-full text-white ${
                          isOrange ? "bg-[#F4772E]" : "bg-[#3472F3]"
                        }`}
                      />
                    </span>
                  </span>
                  <p className="text-xs font-extrabold text-[#1B3159]">
                    No data available in table
                  </p>
                  <p className="mt-1.5 text-[11px] text-[#7186A8]">
                    {isOrange
                      ? "There are no pending sales payments at the moment."
                      : "There are no pending purchase payments at the moment."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 flex flex-col gap-3 text-xs text-[#6F83A6] sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing{" "}
          {filteredRows.length ? (page - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(page * pageSize, filteredRows.length)} of{" "}
          {filteredRows.length} entries
        </span>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#E1E8F2] bg-white px-3 text-xs text-[#AAB8CE] disabled:cursor-default"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          {filteredRows.length > 0 && (
            <span
              className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 font-bold text-white ${
                isOrange ? "bg-[#F4772E]" : "bg-[#3472F3]"
              }`}
            >
              {page}
            </span>
          )}
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
            className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#E1E8F2] bg-white px-3 text-xs text-[#AAB8CE] disabled:cursor-default"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </article>
  );
}

export default function Dashboard() {
  const [dateFilter, setDateFilter] = useState("all");

  return (
    <main className="min-h-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-5 sm:py-7 lg:px-8">
      <header className="mb-6 flex flex-col gap-5 sm:mb-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-xl bg-[#FFF0E4] px-3.5 py-2 text-[#F05A0A]">
            <House size={17} strokeWidth={2.6} />
            <span className="text-[11px] font-extrabold tracking-wide">
              MULTI-SERVICE DASHBOARD
            </span>
          </div>
          <h1 className="app-page-title text-[#10234F]">
            Welcome Multi-Service, <span>👋</span>
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-[#7186A8] sm:text-sm">
            Here’s what’s happening with your business today.
          </p>
        </div>

        <label className="relative block w-full shrink-0 sm:mt-6 sm:w-auto">
          <span className="sr-only">Filter statistics by date</span>
          <CalendarDays
            aria-hidden="true"
            size={19}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#19366F]"
          />
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-[#E4EAF2] bg-white pl-11 pr-10 text-[11px] font-semibold text-[#19366F] shadow-sm outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/20 sm:w-[200px]"
          >
            <option value="all">Filter by date</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
          </select>
          <ChevronDown
            aria-hidden="true"
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#19366F]"
          />
        </label>
      </header>

      <section
        aria-label="Multi-Service Center statistics"
        className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statistics.map((item) => (
          <StatCard key={item.title} item={item} />
        ))}
      </section>

      <SalesData />

      <section
        aria-label="Payment due summaries"
        className="mt-5 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2"
      >
        <PaymentDuePanel
          type="sales"
          title="Sales Payment"
          highlight="Due"
          description="Customers with pending sales payments."
          color="orange"
          rows={salesPaymentRows}
        />
        <PaymentDuePanel
          type="purchase"
          title="Purchase Payment"
          highlight="Due"
          description="Suppliers with pending purchase payments."
          color="blue"
          rows={purchasePaymentRows}
        />
      </section>
      <Sales showPaymentPanels={false} />
    </main>
  );
}