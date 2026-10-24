
import { useState } from "react";
import {
  MapPin,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  Info,
  Printer,
  ArrowUp,
  ShoppingCart,
  TrendingUp,
  Wallet,
  ReceiptText,
  Building2,
  X,
} from "lucide-react";

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const reportData = {
  purchases: {
    total: 0,
    includingTax: 0,
    returns: 0,
    due: 0,
  },
  sales: {
    total: 1869.9,
    includingTax: 2268.02,
    returns: 0,
    due: 1258.02,
  },
};

const dateOptions = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom range" },
];

function InfoIcon({ text }) {
  return (
    <span
      title={text}
      className="inline-flex shrink-0 cursor-help text-[#8A9AB0] transition hover:text-[#FF6814]"
      aria-label={text}
    >
      <Info size={15} />
    </span>
  );
}

function SummaryCard({ title, subtitle, items, icon: Icon, accent }) {
  return (
    <section className="group min-w-0 overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_5px_20px_rgba(16,35,79,0.035)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,35,79,0.07)]">
      <div className="h-1 w-full" style={{ background: accent }} />

      <div className="p-4 sm:p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold tracking-[-0.3px] text-[#10234F]">
              {title}
            </h2>
            <p className="mt-1 text-[11px] text-[#8796AA]">{subtitle}</p>
          </div>

          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${accent}14`,
              color: accent,
            }}
          >
            <Icon size={20} strokeWidth={1.8} />
          </div>
        </div>

        <div className="space-y-0.5">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`flex min-h-[46px] items-center justify-between gap-3 rounded-lg px-3 py-2 ${
                index % 2 === 0 ? "bg-[#F8F9FB]" : "bg-white"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-[12px] font-medium leading-5 text-[#526D8D]">
                  {item.label}
                </span>
                {item.info && <InfoIcon text={item.info} />}
              </div>

              <span className="whitespace-nowrap text-right text-[12px] font-semibold tabular-nums text-[#10234F]">
                {money(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, icon: Icon, description, accent }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#E6EDF5] bg-white p-4 shadow-[0_3px_12px_rgba(16,35,79,0.025)]">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}14`, color: accent }}
      >
        <Icon size={19} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium text-[#71839B]">{label}</p>
        <p className="mt-1 break-words text-[17px] font-bold tracking-[-0.4px] text-[#10234F]">
          {value}
        </p>
        <p className="mt-1 text-[10px] leading-4 text-[#8A9AB0]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Purchase() {
  const [location, setLocation] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState({
    location: "all",
    dateRange: "today",
    startDate: "",
    endDate: "",
  });

  const purchases = reportData.purchases;
  const sales = reportData.sales;

  const saleAfterReturns = sales.includingTax - sales.returns;
  const purchaseAfterReturns =
    purchases.includingTax - purchases.returns;

  const netDifference = saleAfterReturns - purchaseAfterReturns;
  const dueAmount = sales.due - purchases.due;

  const applyDateFilter = () => {
    if (
      dateRange === "custom" &&
      customStartDate &&
      customEndDate &&
      customStartDate > customEndDate
    ) {
      return;
    }

    setAppliedFilter({
      location,
      dateRange,
      startDate: customStartDate,
      endDate: customEndDate,
    });
    setDateFilterOpen(false);
  };

  const resetFilters = () => {
    setLocation("all");
    setDateRange("today");
    setCustomStartDate("");
    setCustomEndDate("");
    setAppliedFilter({
      location: "all",
      dateRange: "today",
      startDate: "",
      endDate: "",
    });
    setDateFilterOpen(false);
  };

  const activeDateLabel =
    appliedFilter.dateRange === "custom"
      ? appliedFilter.startDate && appliedFilter.endDate
        ? `${appliedFilter.startDate} – ${appliedFilter.endDate}`
        : "Custom range"
      : dateOptions.find(
          (option) => option.value === appliedFilter.dateRange
        )?.label || "Today";

  const activeLocationLabel =
    appliedFilter.location === "pharmacy" ? "Pharmacy" : "All locations";

  const hasCustomDateError =
    dateRange === "custom" &&
    customStartDate &&
    customEndDate &&
    customStartDate > customEndDate;

  return (
    <main className="min-h-screen min-w-0 flex-1 bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 sm:py-6 lg:px-7">
      {/* Page header */}
      <header className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6814] to-[#FF812B] text-white shadow-[0_5px_12px_rgba(255,104,20,0.2)]">
            <ReceiptText size={23} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[23px] font-bold leading-8 tracking-[-0.8px] text-[#10234F] sm:text-[26px]">
                Purchase &amp; Sale Report
              </h1>
              <span className="rounded-full border border-[#FBE1CE] bg-[#FFF0E5] px-2.5 py-1 text-[10px] font-semibold text-[#E96012]">
                Financial overview
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-5 text-[#71839B] sm:text-[13px]">
              Purchase and sale details for the selected date range
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Location selector */}
          <div className="flex h-10 min-w-[175px] flex-1 items-center rounded-xl border border-[#E6EDF5] bg-white shadow-sm transition focus-within:border-[#FFB17E] sm:flex-none">
            <span className="flex h-full w-10 shrink-0 items-center justify-center text-[#FF6814]">
              <MapPin size={17} />
            </span>

            <select
              aria-label="Business location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="h-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-1 text-[12px] font-medium text-[#10234F] outline-none"
            >
              <option value="all">All locations</option>
              <option value="pharmacy">Pharmacy</option>
            </select>

            <ChevronDown
              size={14}
              className="mr-3 shrink-0 text-[#8798AD]"
            />
          </div>

          {/* Date filter */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={dateFilterOpen}
              onClick={() => setDateFilterOpen((open) => !open)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 text-[12px] font-semibold text-white shadow-[0_4px_10px_rgba(255,104,20,0.17)] transition hover:brightness-105 active:scale-[0.98]"
            >
              <CalendarDays size={16} />
              Filter by date
              <ChevronDown
                size={14}
                className={`transition-transform ${dateFilterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dateFilterOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close date filter"
                  className="fixed inset-0 z-20 cursor-default"
                  onClick={() => setDateFilterOpen(false)}
                />

                <div className="absolute right-0 top-full z-30 mt-2 w-[min(320px,calc(100vw-24px))] rounded-2xl border border-[#E6EDF5] bg-white p-4 shadow-[0_16px_45px_rgba(16,35,79,0.14)] sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E5] text-[#FF6814]">
                        <CalendarRange size={18} />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-[#10234F]">
                          Date filter
                        </h3>
                        <p className="text-[10px] text-[#8796AA]">
                          Choose a reporting period
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDateFilterOpen(false)}
                      aria-label="Close"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8796AA] transition hover:bg-[#F5F7FA] hover:text-[#10234F]"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <label className="block text-[11px] font-semibold text-[#526D8D]">
                    Date range
                    <div className="relative mt-1.5">
                      <select
                        value={dateRange}
                        onChange={(event) =>
                          setDateRange(event.target.value)
                        }
                        className="h-10 w-full appearance-none rounded-xl border border-[#E6EDF5] bg-[#FFFCF9] px-3 pr-9 text-[12px] font-medium text-[#10234F] outline-none transition focus:border-[#FF9C5C] focus:ring-2 focus:ring-[#FF6814]/10"
                      >
                        {dateOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8796AA]"
                      />
                    </div>
                  </label>

                  {dateRange === "custom" && (
                    <div className="mt-3 space-y-3">
                      <label className="block text-[11px] font-semibold text-[#526D8D]">
                        Start date
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(event) =>
                            setCustomStartDate(event.target.value)
                          }
                          className="mt-1.5 h-10 w-full rounded-xl border border-[#E6EDF5] bg-white px-3 text-[12px] text-[#10234F] outline-none transition focus:border-[#FF9C5C] focus:ring-2 focus:ring-[#FF6814]/10"
                        />
                      </label>

                      <label className="block text-[11px] font-semibold text-[#526D8D]">
                        End date
                        <input
                          type="date"
                          min={customStartDate || undefined}
                          value={customEndDate}
                          onChange={(event) =>
                            setCustomEndDate(event.target.value)
                          }
                          className="mt-1.5 h-10 w-full rounded-xl border border-[#E6EDF5] bg-white px-3 text-[12px] text-[#10234F] outline-none transition focus:border-[#FF9C5C] focus:ring-2 focus:ring-[#FF6814]/10"
                        />
                      </label>

                      {hasCustomDateError && (
                        <p className="text-[11px] font-medium text-red-600">
                          End date must be on or after the start date.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E6EDF5] px-3 text-[11px] font-semibold text-[#526D8D] transition hover:bg-[#F8F9FB]"
                    >
                      <X size={14} />
                      Reset
                    </button>

                    <button
                      type="button"
                      disabled={Boolean(hasCustomDateError)}
                      onClick={applyDateFilter}
                      className="inline-flex h-10 flex-[1.5] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-3 text-[11px] font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Apply filter
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Print */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E6EDF5] bg-white text-[#526D8D] shadow-sm transition hover:border-[#FFD3B8] hover:bg-[#FFF5ED] hover:text-[#FF6814]"
            title="Print report"
            aria-label="Print report"
          >
            <Printer size={17} />
          </button>
        </div>
      </header>

      {/* Current selection */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F3E7DB] bg-white/75 px-3.5 py-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF0E5] text-[#FF6814]">
            <CalendarDays size={14} />
          </span>
          <span className="text-[11px] font-semibold text-[#526D8D]">
            Report period
          </span>
          <span className="rounded-lg bg-[#FFF0E5] px-2.5 py-1 text-[11px] font-semibold text-[#E96012]">
            {activeDateLabel}
          </span>
          <span className="hidden h-4 w-px bg-[#E6EDF5] sm:block" />
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#71839B]">
            <Building2 size={13} />
            {activeLocationLabel}
          </span>
        </div>

        <span className="text-[10px] text-[#8796AA]">
          Purchase &amp; sales summary
        </span>
      </div>

      {/* Key metrics */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-[#FF6814]" />
          <h2 className="text-[14px] font-bold text-[#10234F]">
            Financial snapshot
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total purchase"
            value={money(purchases.total)}
            description="Purchase amount before tax"
            icon={ShoppingCart}
            accent="#FF6814"
          />
          <MetricCard
            label="Total sales"
            value={money(sales.total)}
            description="Sales amount before tax"
            icon={TrendingUp}
            accent="#16A36A"
          />
          <MetricCard
            label="Purchase due"
            value={money(purchases.due)}
            description="Outstanding purchase payments"
            icon={Wallet}
            accent="#7C62D6"
          />
          <MetricCard
            label="Sales due"
            value={money(sales.due)}
            description="Outstanding sales payments"
            icon={ReceiptText}
            accent="#1475F8"
          />
        </div>
      </section>

      {/* Purchases and sales */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-[#FF6814]" />
          <h2 className="text-[14px] font-bold text-[#10234F]">
            Purchase &amp; sales breakdown
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <SummaryCard
            title="Purchases"
            subtitle="Purchase totals, tax and outstanding balance"
            icon={ShoppingCart}
            accent="#FF6814"
            items={[
              {
                label: "Total Purchase:",
                value: purchases.total,
              },
              {
                label: "Purchase Including tax:",
                value: purchases.includingTax,
              },
              {
                label: "Total Purchase Return Including Tax:",
                value: purchases.returns,
              },
              {
                label: "Purchase Due:",
                value: purchases.due,
                info: "Outstanding purchase payment due.",
              },
            ]}
          />

          <SummaryCard
            title="Sales"
            subtitle="Sales totals, tax and outstanding balance"
            icon={TrendingUp}
            accent="#16A36A"
            items={[
              {
                label: "Total Sale:",
                value: sales.total,
              },
              {
                label: "Sale Including tax:",
                value: sales.includingTax,
              },
              {
                label: "Total Sell Return Including Tax:",
                value: sales.returns,
              },
              {
                label: "Sale Due:",
                value: sales.due,
                info: "Outstanding sales payment due.",
              },
            ]}
          />
        </div>
      </section>

      {/* Overall summary */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_5px_20px_rgba(16,35,79,0.035)]">
        <div className="h-1 bg-gradient-to-r from-[#FF6814] via-[#FF812B] to-[#FFC18D]" />

        <div className="p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E5] text-[#FF6814]">
                <TrendingUp size={21} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[16px] font-bold leading-6 tracking-[-0.3px] text-[#10234F] sm:text-[18px]">
                    Overall financial summary
                  </h2>
                  <InfoIcon text="Net sales after returns minus purchases after returns." />
                </div>
                <p className="mt-1 max-w-2xl text-[11px] leading-5 text-[#71839B] sm:text-[12px]">
                  (Sale − Sell Return) − (Purchase − Purchase Return)
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full border border-[#D7F1E3] bg-[#EDFAF3] px-3 py-1.5 text-[10px] font-semibold text-[#168451]">
              Net comparison
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#F3E7DB] bg-[#FFFCF9] p-4">
              <p className="text-[11px] font-medium text-[#71839B]">
                Sale - Purchase
              </p>
              <p className="mt-2 break-words text-[22px] font-bold tracking-[-0.7px] text-[#16A36A] sm:text-[25px]">
                {money(netDifference)}
              </p>
              <p className="mt-1 text-[10px] text-[#8796AA]">
                Sales after returns minus purchases after returns
              </p>
            </div>

            <div className="rounded-xl border border-[#E6EDF5] bg-[#F8FAFD] p-4">
              <p className="text-[11px] font-medium text-[#71839B]">
                Due amount
              </p>
              <p className="mt-2 break-words text-[22px] font-bold tracking-[-0.7px] text-[#10234F] sm:text-[25px]">
                {money(dueAmount)}
              </p>
              <p className="mt-1 text-[10px] text-[#8796AA]">
                Sales due minus purchase due
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative -mx-3 border-t border-[#E6EDF5] bg-white px-4 pb-5 pt-5 sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7 print:hidden">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-[11px] font-semibold text-[#526D8D]">
            Billomax
            <span className="mx-1.5 text-[#FF6814]">·</span>
            Your Trusted Partner in Billing &amp; Invoicing
          </p>
          <p className="text-[10px] leading-5 text-[#8796AA]">
            V6.3 | Copyright © 2026 All rights reserved.
          </p>
        </div>
      </footer>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-[0_5px_14px_rgba(255,104,20,0.25)] transition hover:-translate-y-0.5 hover:brightness-105 print:hidden"
      >
        <ArrowUp size={21} strokeWidth={2.5} />
      </button>
    </main>
  );
}
