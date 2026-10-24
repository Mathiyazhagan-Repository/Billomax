
import { useState } from "react";
import {
  House,
  MapPin,
  ChevronDown,
  CalendarDays,
  ClipboardCheck,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Package,
  TriangleAlert,
  RotateCcw,
  CreditCard,
  ArrowUpRight,
  ArrowDown,
  ChevronRight,
} from "lucide-react";
import dashboardBackground from "../../../assets/Home/Dashboard_bg.png";

const stats = [
  {
    title: "ORDERS",
    value: "0",
    icon: ClipboardCheck,
    color: "blue",
    trend: "up",
  },
  {
    title: "REVENUE",
    value: "₹0",
    icon: IndianRupee,
    color: "purple",
    trend: "up",
  },
  {
    title: "TOTAL SELL",
    value: "0",
    icon: ShoppingCart,
    color: "teal",
    trend: "right",
  },
  {
    title: "NET PROFIT",
    value: "₹0",
    icon: TrendingUp,
    color: "green",
    trend: "right",
  },
  {
    title: "TOTAL PURCHASE",
    value: "₹ 0.00",
    icon: Package,
    color: "yellow",
    trend: "minus",
  },
  {
    title: "PURCHASE DUE",
    value: "₹ 0.00",
    icon: TriangleAlert,
    color: "pink",
    trend: "up",
  },
  {
    title: "TOTAL PURCHASE RETURN",
    value: "₹ 0.00",
    icon: RotateCcw,
    color: "blue",
    trend: "down",
  },
  {
    title: "EXPENSE",
    value: "₹ 5,969,901.00",
    icon: CreditCard,
    color: "pink",
    trend: "up",
  },
];

const themes = {
  blue: {
    card: "border-[#E6EDF5] bg-white",
    iconBox: "bg-[#CDE6FF]",
    icon: "text-[#087AF0]",
  },
  purple: {
    card: "border-[#E6EDF5] bg-white",
    iconBox: "bg-[#E8D8FF]",
    icon: "text-[#8219F5]",
  },
  teal: {
    card: "border-[#E6EDF5] bg-white",
    iconBox: "bg-[#C0F8E9]",
    icon: "text-[#0DBB83]",
  },
  green: {
    card: "border-[#E6EDF5] bg-white",
    iconBox: "bg-[#D1FBD1]",
    icon: "text-[#13A52E]",
  },
  yellow: {
    card: "border-[#E6EDF5] bg-white",
    iconBox: "bg-[#FFE5AD]",
    icon: "text-[#F47700]",
  },
  pink: {
    card: "border-[#E6EDF5] bg-white",
    iconBox: "bg-[#FFD5E3]",
    icon: "text-[#F31652]",
  },
};

function TrendIcon({ trend }) {
  if (trend === "right") return <ChevronRight size={13} strokeWidth={3} />;
  if (trend === "minus") return <span className="text-sm font-bold">−</span>;
  if (trend === "down") return <ArrowDown size={13} strokeWidth={2.8} />;
  return <ArrowUpRight size={13} strokeWidth={3} />;
}

function StatCard({ item }) {
  const Icon = item.icon;
  const theme = themes[item.color];

  return (
    <article
      className={`group relative flex min-h-[80px] min-w-0 items-center gap-2.5 overflow-hidden rounded-xl border p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${theme.card}`}
    >
      {/* Main icon */}
      <div
        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${theme.iconBox}`}
      >
        <Icon size={22} strokeWidth={2.8} className={theme.icon} />
      </div>

      {/* Text */}
      <div className="relative z-10 min-w-0 flex-1 self-center">
        <h3 className="mb-1 whitespace-nowrap text-[11px] font-bold tracking-[-0.2px] text-[#526D8D]">
          {item.title}
        </h3>

        <p className="whitespace-nowrap text-[18px] font-extrabold leading-none tracking-[-0.3px] text-[#101C3D]">
          {item.value}
        </p>

        <p className="mt-1 whitespace-nowrap text-[10px] font-medium text-[#587696]">
          Since last month
        </p>
      </div>

      {/* Trend button */}
      <button
        type="button"
        aria-label={`${item.title} details`}
        className={`absolute right-2 top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(35,58,90,0.08)] transition hover:scale-105 ${theme.icon}`}
      >
        <TrendIcon trend={item.trend} />
      </button>
    </article>
  );
}

export default function Dashboard() {
  const [location, setLocation] = useState("");
  const [dateFilter, setDateFilter] = useState("today");

  return (
    <main className="min-h-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      {/* Welcome section */}
      <section className="relative mb-4 overflow-hidden rounded-2xl">
        <img
          src={dashboardBackground}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-[40%] object-contain object-right"
        />
        {/* Soft background decoration */}
        <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-48 rounded-full bg-[#FFE8D1]/70 blur-3xl" />
        <div className="pointer-events-none absolute right-[23%] top-0 h-28 w-28 rounded-full bg-white/60 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-end gap-4 md:grid-cols-[1.15fr_1fr]">
          {/* Heading */}
          <div className="pb-1 pt-0.5">
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <House size={15} strokeWidth={2.5} />
              <span className="text-[11px] font-extrabold">
                PHARMACY DASHBOARD
              </span>
            </div>

            <h1 className="app-page-title text-[#10234F]">
              Welcome pharmacy, <span>👋</span>
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-[#577B9F] sm:text-sm">
              Here’s what’s happening with your pharmacy today.
            </p>
          </div>

          {/* Filters */}
          <div className="relative z-10 grid grid-cols-1 gap-2.5 pb-1 sm:grid-cols-2">
            <label className="block min-w-0">
              <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-[#557493]">
                <MapPin size={14} />
                Location
              </span>

              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-8 w-full appearance-none rounded-md border border-[#E8EDF4] bg-white px-2.5 pr-7 text-[11px] font-semibold text-[#132653] shadow-sm outline-none focus:border-[#FF8A37]"
                >
                  <option value="">Select location</option>
                  <option value="main">Main Pharmacy</option>
                  <option value="branch">Branch Pharmacy</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </label>

            <label className="block min-w-0">
              <span className="mb-1 block text-[11px] font-semibold text-transparent">
                Date filter
              </span>

              <div className="relative">
                <CalendarDays
                  size={15}
                  className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#19366F]"
                />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-8 w-full appearance-none rounded-md border border-[#E8EDF4] bg-white pl-8 pr-7 text-[11px] font-semibold text-[#132653] shadow-sm outline-none focus:border-[#FF8A37]"
                >
                  <option value="today">Filter by date</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="year">This year</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section
        aria-label="Pharmacy statistics"
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((item) => (
          <StatCard key={item.title} item={item} />
        ))}
      </section>
    </main>
  );
}
