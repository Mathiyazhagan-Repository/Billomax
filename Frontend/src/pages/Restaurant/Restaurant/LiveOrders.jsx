
import React, { useMemo, useState } from "react";
import {
  ShoppingBag,
  Search,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Utensils,
  Bike,
  Store,
  SlidersHorizontal,
  IndianRupee,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const initialOrders = [
  { id: "BILL-0020", customer: "Fff", type: "Dine", items: 2, amount: 288, time: "10:18 AM", status: "Pending", source: "Dine-In" },
  { id: "BILL-0019", customer: "Dytt", type: "Dine", items: 2, amount: 598, time: "03:52 PM", status: "Pending", source: "Dine-In" },
  { id: "BILL-0018", customer: "Ram", type: "Dine", items: 1, amount: 460, time: "06:33 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0017", customer: "Ram", type: "Dine", items: 1, amount: 920, time: "06:32 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0016", customer: "Nalla", type: "Dine", items: 1, amount: 2300, time: "06:12 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0015", customer: "Nalla", type: "Dine", items: 1, amount: 1035, time: "05:45 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0008", customer: "Ram", type: "Dine", items: 1, amount: 3565, time: "04:30 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0007", customer: "Nalla", type: "Dine", items: 1, amount: 1173, time: "03:20 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0006", customer: "Ram", type: "Dine", items: 1, amount: 621, time: "02:15 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0005", customer: "Ram", type: "Dine", items: 1, amount: 2921, time: "01:45 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0004", customer: "Raja", type: "Dine", items: 1, amount: 2749, time: "12:30 PM", status: "Paid", source: "Dine-In" },
  { id: "BILL-0001", customer: "Ram", type: "Dine", items: 1, amount: 3220, time: "11:20 AM", status: "Paid", source: "Dine-In" },
];

const sourceTabs = [
  { label: "All Orders", value: "All", icon: ClipboardList, color: "bg-[#10234F]" },
  { label: "Swiggy Orders", value: "Swiggy", icon: Bike, color: "bg-[#FF6814]" },
  { label: "Zomato Orders", value: "Zomato", icon: Store, color: "bg-rose-600" },
  { label: "Dine-In Orders", value: "Dine-In", icon: Utensils, color: "bg-emerald-600" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold text-[#60728D]">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 pr-9 text-sm text-[#10234F] outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8491A5]"
        />
      </div>
    </label>
  );
}

function SummaryCard({ icon: Icon, title, value, subtitle, iconClass }) {
  return (
    <div className="rounded-2xl border border-[#F0E4D8] bg-white p-4 shadow-[0_5px_20px_rgba(16,35,79,0.04)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#718096]">{title}</p>
          <p className="mt-2 truncate text-xl font-black text-[#10234F] sm:text-2xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-[#8491A5]">{subtitle}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function LiveOrders() {
  const [orders] = useState(initialOrders);
  const [orderStatus, setOrderStatus] = useState("All Status");
  const [orderType, setOrderType] = useState("All Types");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeSource, setActiveSource] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        orderStatus === "All Status" || order.status === orderStatus;

      const matchesType =
        orderType === "All Types" || order.type === orderType;

      const matchesSource =
        activeSource === "All" || order.source === activeSource;

      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.type.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query);

      // The screenshot provides order times but no order dates.
      // Date filters are therefore left unapplied until real dates are available.
      const matchesDate = true;

      return (
        matchesStatus &&
        matchesType &&
        matchesSource &&
        matchesSearch &&
        matchesDate
      );
    });
  }, [orders, orderStatus, orderType, activeSource, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleOrders = filteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );

  const pendingCount = filteredOrders.filter(
    (order) => order.status === "Pending"
  ).length;

  const paidTotal = filteredOrders
    .filter((order) => order.status === "Paid")
    .reduce((sum, order) => sum + order.amount, 0);

  const resetPage = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-6 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6814]">
              <ShoppingBag size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Live Orders
              </h1>
              <p className="mt-1 text-sm text-[#718096]">
                Monitor orders, payment status, and order channels.
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Order overview
          </span>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={ClipboardList}
            title="Total Orders"
            value={filteredOrders.length}
            subtitle="Orders matching current filters"
            iconClass="bg-blue-50 text-blue-600"
          />
          <SummaryCard
            icon={Clock3}
            title="Pending Orders"
            value={pendingCount}
            subtitle="Awaiting payment"
            iconClass="bg-orange-50 text-[#FF6814]"
          />
          <SummaryCard
            icon={CheckCircle2}
            title="Paid Orders"
            value={filteredOrders.length - pendingCount}
            subtitle="Payment completed"
            iconClass="bg-emerald-50 text-emerald-600"
          />
          <SummaryCard
            icon={IndianRupee}
            title="Paid Amount"
            value={formatCurrency(paidTotal)}
            subtitle="Total for paid orders"
            iconClass="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-[#F0E4D8] bg-white p-5 shadow-[0_5px_20px_rgba(16,35,79,0.04)] sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal size={19} className="text-[#FF6814]" />
            <h2 className="text-base font-extrabold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SelectField
              label="Order Status"
              value={orderStatus}
              onChange={(value) => resetPage(setOrderStatus, value)}
              options={[
                { label: "All Status", value: "All Status" },
                { label: "Pending", value: "Pending" },
                { label: "Paid", value: "Paid" },
              ]}
            />

            <SelectField
              label="Order Type"
              value={orderType}
              onChange={(value) => resetPage(setOrderType, value)}
              options={[
                { label: "All Types", value: "All Types" },
                { label: "Dine", value: "Dine" },
              ]}
            />

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#60728D]">
                Date From
              </span>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => {
                    setDateFrom(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70"
                />
                <CalendarDays
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8491A5]"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#60728D]">
                Date To
              </span>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(event) => {
                    setDateTo(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70"
                />
                <CalendarDays
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8491A5]"
                />
              </div>
            </label>
          </div>

          {(dateFrom || dateTo) && (
            <p className="mt-3 text-xs text-amber-700">
              Date values are selected, but filtering by date requires each
              order to include its actual order date.
            </p>
          )}
        </section>

        {/* Orders table */}
        <section className="overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#EEF1F5] p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-extrabold">Recent Orders</h2>
              <p className="mt-1 text-sm text-[#8491A5]">
                Search and review orders by source and payment status.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {sourceTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeSource === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setActiveSource(tab.value);
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                      active
                        ? `${tab.color} border-transparent text-white shadow-md`
                        : "border-[#F0E4D8] bg-[#FFFCF8] text-[#33445F] hover:bg-[#FFF1E6]"
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-sm">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="search"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#FFFCF8] py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#9AA6B6] focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70"
                />
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#718096]">
                Rows
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#E2E8F0] bg-white px-2 py-2 text-sm text-[#10234F] outline-none focus:border-blue-400"
                >
                  {[5, 10, 25].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                per page
              </label>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#F5F8FC] text-[11px] uppercase tracking-wide text-[#60728D]">
                  {[
                    "Order ID",
                    "Customer",
                    "Type",
                    "Items",
                    "Amount",
                    "Order Time",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="border-b border-[#E8EDF4] px-5 py-4 font-extrabold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-orange-50/40"
                  >
                    <td className="border-b border-[#EEF1F5] px-5 py-4 font-bold text-[#315B9D]">
                      #{order.id}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-5 py-4 font-semibold">
                      {order.customer}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700">
                        <Utensils size={13} />
                        {order.type}
                      </span>
                    </td>
                    <td className="border-b border-[#EEF1F5] px-5 py-4 text-[#60728D]">
                      {order.items} {order.items === 1 ? "Item" : "Items"}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-5 py-4 font-extrabold tabular-nums">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-5 py-4 text-[#60728D]">
                      {order.time}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                          order.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status === "Paid" ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {visibleOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <Search size={22} />
                        </div>
                        <p className="mt-3 font-bold">No orders found</p>
                        <p className="mt-1 text-sm text-[#8491A5]">
                          Try changing your filters or search term.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#EEF1F5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-[#718096]">
              Showing{" "}
              <span className="font-bold text-[#10234F]">
                {filteredOrders.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#10234F]">
                {Math.min(startIndex + pageSize, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#10234F]">
                {filteredOrders.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#60728D] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                    className={`h-9 min-w-9 rounded-lg px-3 text-xs font-bold transition ${
                      safePage === page
                        ? "bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-sm"
                        : "border border-[#E2E8F0] text-[#60728D] hover:bg-orange-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#60728D] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
