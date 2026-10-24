
import React, { useMemo, useState } from "react";
import {
  Wallet,
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
  X,
  ArrowUpDown,
  CalendarDays,
  IndianRupee,
  ReceiptText,
  Eye,
  Users,
} from "lucide-react";
import ViewSellPaymentModal from "./ViewSellPaymentModal.jsx";

const initialPayments = [];

const columns = [
  { key: "referenceNo", label: "Reference No." },
  { key: "paidOn", label: "Paid on" },
  { key: "amount", label: "Amount" },
  { key: "customer", label: "Customer" },
  { key: "customerGroup", label: "Customer Group" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "sale", label: "Sell" },
  { key: "action", label: "Action", sortable: false },
];

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ActionButton({ icon: Icon, children, onClick, primary = false }) {
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
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

function SummaryCard({ title, value, caption, icon: Icon }) {
  return (
    <div className="flex min-h-[84px] items-center gap-2.5 rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FFE5AD] text-[#F47700]">
        <Icon size={22} strokeWidth={2.8} />
      </span>
      <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold leading-4 text-[#526D8D]">{title}</p>
          <p className="break-words text-[18px] font-extrabold leading-none tracking-tight text-[#101C3D]">
            {value}
          </p>
          <p className="mt-1 text-[10px] text-[#577B9F]">{caption}</p>
      </div>
    </div>
  );
}

export default function SellPaymentReport() {
  const [payments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sort, setSort] = useState({ key: "paidOn", direction: "desc" });
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [selectedPayment, setSelectedPayment] = useState(null);

  const toISODate = (value) => {
    const [day, month, year] = String(value || "").split(" ")[0].split("/");
    if (!day || !month || !year) return "";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const customers = useMemo(
    () => [...new Set(payments.map((payment) => payment.customer).filter(Boolean))],
    [payments]
  );

  const methods = useMemo(
    () => [...new Set(payments.map((payment) => payment.paymentMethod).filter(Boolean))],
    [payments]
  );

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = payments.filter((payment) => {
      const matchesSearch = columns
        .filter((column) => column.key !== "action")
        .some((column) =>
          String(payment[column.key] ?? "")
            .toLowerCase()
            .includes(query)
        );

      const paymentDate = toISODate(payment.paidOn);
      const matchesFrom = !dateFrom || paymentDate >= dateFrom;
      const matchesTo = !dateTo || paymentDate <= dateTo;
      const matchesCustomer =
        customerFilter === "all" || payment.customer === customerFilter;
      const matchesMethod =
        methodFilter === "all" || payment.paymentMethod === methodFilter;

      return (
        matchesSearch &&
        matchesFrom &&
        matchesTo &&
        matchesCustomer &&
        matchesMethod
      );
    });

    result = [...result].sort((a, b) => {
      let comparison;

      if (sort.key === "amount") {
        comparison = Number(a.amount || 0) - Number(b.amount || 0);
      } else if (sort.key === "paidOn") {
        comparison = `${toISODate(a.paidOn)} ${a.paidOn.slice(11)}`.localeCompare(
          `${toISODate(b.paidOn)} ${b.paidOn.slice(11)}`
        );
      } else {
        comparison = String(a[sort.key] ?? "").localeCompare(
          String(b[sort.key] ?? ""),
          undefined,
          { numeric: true, sensitivity: "base" }
        );
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [payments, search, dateFrom, dateTo, customerFilter, methodFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredPayments.length ? (safePage - 1) * pageSize : 0;
  const pagePayments = filteredPayments.slice(startIndex, startIndex + pageSize);
  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const resetFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setCustomerFilter("all");
    setMethodFilter("all");
    setCurrentPage(1);
  };

  const toggleSort = (key) => {
    if (key === "action") return;

    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleColumn = (key) => {
    setVisibleColumns((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  };

  const exportCSV = () => {
    const exportColumns = columns.filter(
      (column) =>
        visibleColumns.includes(column.key) && column.key !== "action"
    );

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      exportColumns.map((column) => escapeCSV(column.label)).join(","),
      ...filteredPayments.map((payment) =>
        exportColumns
          .map((column) => {
            const value =
              column.key === "amount"
                ? money(payment.amount)
                : payment[column.key] ?? "";
            return escapeCSV(value);
          })
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SellPaymentReport.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderCell = (payment, key) => {
    if (key === "amount") {
      return (
        <span className="whitespace-nowrap font-semibold tabular-nums text-[#10234F]">
          {money(payment.amount)}
        </span>
      );
    }

    if (key === "referenceNo") {
      return (
        <span className="font-semibold text-[#10234F]">
          {payment.referenceNo}
        </span>
      );
    }

    if (key === "sale") {
      return (
        <span className="font-semibold text-[#1475F8]">
          {payment.sale}
        </span>
      );
    }

    if (key === "paymentMethod") {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-[#E7F7E9] px-2.5 py-1 text-xs font-semibold text-[#25813A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#38A858]" />
          {payment.paymentMethod || "—"}
        </span>
      );
    }

    return <span className="text-[#577B9F]">{payment[key] || "—"}</span>;
  };

  return (
    <main className="min-h-screen min-w-0 bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { border: 0 !important; box-shadow: none !important; overflow: visible !important; }
          .print-area table { min-width: 100% !important; }
          .print-area th, .print-area td { padding: 5px !important; font-size: 9px !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1700px] space-y-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <Wallet size={14} />
              <span className="text-[11px] font-extrabold">MULTI-SERVICE CENTER · REPORTS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Sell Payment Report
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Review customer payments, sale references, and payment totals.
            </p>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <ActionButton icon={Download} onClick={exportCSV}>Export CSV</ActionButton>
            <ActionButton icon={FileSpreadsheet} onClick={exportCSV}>Export Excel</ActionButton>
            <ActionButton icon={Printer} onClick={() => window.print()}>Print</ActionButton>
            <ActionButton icon={FileText} onClick={() => window.print()} primary>Export PDF</ActionButton>
          </div>
        </header>

        <section className="no-print overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
                <Filter size={19} />
              </span>
              <span>
                <span className="app-section-title block text-[#10234F]">Filters</span>
                <span className="app-description mt-0.5 block text-[#577B9F]">
                  Filter customer payments by date, customer, or method.
                </span>
              </span>
            </div>
            {showFilters ? <ChevronUp size={18} className="text-[#577B9F]" /> : <ChevronDown size={18} className="text-[#577B9F]" />}
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 border-t border-[#F2E8DE] bg-[#FFFEFC] px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-[#557493]">Paid from</span>
                <span className="relative block">
                  <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => { setDateFrom(event.target.value); setCurrentPage(1); }}
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  />
                </span>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-[#557493]">Paid to</span>
                <span className="relative block">
                  <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => { setDateTo(event.target.value); setCurrentPage(1); }}
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  />
                </span>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-[#557493]">Customer</span>
                <select
                  value={customerFilter}
                  onChange={(event) => { setCustomerFilter(event.target.value); setCurrentPage(1); }}
                  className="w-full rounded-lg border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  <option value="all">All customers</option>
                  {customers.map((customer) => <option key={customer} value={customer}>{customer}</option>)}
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-[#557493]">Payment method</span>
                <select
                  value={methodFilter}
                  onChange={(event) => { setMethodFilter(event.target.value); setCurrentPage(1); }}
                  className="w-full rounded-lg border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  <option value="all">All methods</option>
                  {methods.map((method) => <option key={method} value={method}>{method}</option>)}
                </select>
              </label>

              <div className="sm:col-span-2 xl:col-span-4">
                <ActionButton icon={RotateCcw} onClick={resetFilters}>Reset filters</ActionButton>
              </div>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Payment Records"
            value={filteredPayments.length}
            caption="Payments matching current filters"
            icon={ReceiptText}
          />
          <SummaryCard
            title="Total Amount Received"
            value={money(totalAmount)}
            caption="Total of matching payments"
            icon={IndianRupee}
          />
          <SummaryCard
            title="Customers"
            value={new Set(filteredPayments.map((payment) => payment.customer).filter(Boolean)).size}
            caption="Distinct customers in current results"
            icon={Users}
          />
        </section>

        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <Wallet size={19} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">Customer Payment Details</h2>
                <p className="app-description mt-0.5 text-[#577B9F]">References, payment amounts, customers, and linked sales</p>
              </div>
            </div>
          </div>

          <div className="no-print flex flex-col gap-4 px-5 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-[#577B9F]">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}
                  className="rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-semibold text-[#19366F] outline-none focus:border-[#FF8A37]"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] shadow-sm hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
                >
                  <SlidersHorizontal size={15} />
                  Column visibility
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-30 mt-2 max-h-80 w-72 overflow-y-auto rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-[#F2E8DE] pb-2">
                      <span className="text-sm font-bold text-[#10234F]">Visible columns</span>
                      <button type="button" onClick={() => setShowColumns(false)} aria-label="Close column visibility" className="rounded-md p-1 text-[#577B9F] hover:bg-[#FFF1E5]"><X size={15} /></button>
                    </div>
                    {columns.map((column) => (
                      <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-[#19366F] hover:bg-[#FFF7EF]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="h-4 w-4 accent-[#FF711A]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="relative block w-full xl:max-w-sm">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#577B9F]" />
              <input
                type="search"
                value={search}
                onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }}
                placeholder="Search payments..."
                className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                  {columns.filter((column) => visibleColumns.includes(column.key)).map((column) => (
                    <th key={column.key} className="app-table-heading px-4 py-4 uppercase tracking-wide text-[#19366F]">
                      {column.sortable === false ? column.label : (
                        <button type="button" onClick={() => toggleSort(column.key)} className="inline-flex items-center gap-2 text-left leading-5 hover:text-[#F04A13]">
                          {column.label}
                          {sort.key === column.key ? (
                            sort.direction === "asc" ? <ChevronUp size={14} className="shrink-0 text-[#FF711A]" /> : <ChevronDown size={14} className="shrink-0 text-[#FF711A]" />
                          ) : <ArrowUpDown size={13} className="shrink-0 text-[#A7B5C5]" />}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F2E8DE]">
                {pagePayments.map((payment, index) => (
                  <tr key={payment.id} className={`transition-colors hover:bg-[#FFF1E5]/70 ${index % 2 ? "bg-[#FFFCF8]" : "bg-white"}`}>
                    {columns.filter((column) => visibleColumns.includes(column.key)).map((column) => (
                      <td key={column.key} className="app-table-cell px-4 py-4 align-middle text-[#19366F]">
                        {column.key === "action" ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPayment(payment)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFD6B8] bg-[#FFF7EF] px-3 py-1.5 text-xs font-semibold text-[#E96B10] transition hover:bg-[#FF711A] hover:text-white"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        ) : renderCell(payment, column.key)}
                      </td>
                    ))}
                  </tr>
                ))}

                {pagePayments.length === 0 && (
                  <tr>
                    <td colSpan={Math.max(visibleColumns.length, 1)} className="px-6 py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE9D9] text-[#F04A13]"><Wallet size={21} /></div>
                      <p className="mt-3 font-semibold text-[#10234F]">No data available in table</p>
                      <p className="mt-1 text-xs text-[#577B9F]">Payment records matching your filters will appear here.</p>
                      {(search || dateFrom || dateTo || customerFilter !== "all" || methodFilter !== "all") && (
                        <button type="button" onClick={resetFilters} className="mt-4 text-sm font-semibold text-[#E96B10] hover:underline">Clear filters</button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr className="border-t border-[#F2E8DE] bg-[#FFF1E5]">
                  {columns.filter((column) => visibleColumns.includes(column.key)).map((column, index) => (
                    <td key={column.key} className="whitespace-nowrap px-4 py-3 font-bold text-[#10234F]">
                      {index === 0 ? "Total:" : column.key === "amount" ? money(totalAmount) : ""}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-[#577B9F]">
              Showing <span className="font-semibold text-[#10234F]">{filteredPayments.length ? startIndex + 1 : 0}</span> to{" "}
              <span className="font-semibold text-[#10234F]">{Math.min(startIndex + pageSize, filteredPayments.length)}</span> of{" "}
              <span className="font-semibold text-[#10234F]">{filteredPayments.length}</span> entries
            </p>

            <div className="flex items-center gap-1.5">
              <button type="button" disabled={safePage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft size={15} /> Previous
              </button>
              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF711A] px-3 text-sm font-semibold text-white">{safePage}</span>
              <button type="button" disabled={safePage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40">
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-[11px] text-[#577B9F] sm:flex-row sm:text-left">
          <p>Billomax · Sell Payment Report</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>

      <ViewSellPaymentModal
        isOpen={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        payment={
          selectedPayment
            ? {
                ...selectedPayment,
                customerName: selectedPayment.customer,
                customerDisplayName: selectedPayment.customer,
              }
            : {}
        }
      />

      <div className="no-print fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3478F6] text-white shadow-[0_6px_18px_rgba(52,120,246,0.35)] transition hover:bg-[#2563EB]">
          <ChevronUp size={22} strokeWidth={3} />
        </button>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-[#7778FF] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#6667F0]">
          <Printer size={17} /> Print
        </button>
      </div>
    </main>
  );
}
