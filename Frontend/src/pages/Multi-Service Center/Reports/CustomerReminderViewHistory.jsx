
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  UserRound,
  MapPin,
  Phone,
  BookOpen,
  TrendingUp,
  UsersRound,
  Paperclip,
  CreditCard,
  Activity,
  CalendarDays,
  Download,
  Printer,
  ChevronDown,
  RotateCcw,
  Search,
  FileText,
  BellRing,
  Eye,
  Tag,
  Clock3,
} from "lucide-react";
import AddDiscount from "./AddDiscount.jsx";

const initialCustomer = {
  name: "swathi",
  type: "Customer",
  address: "swathi",
  mobile: "7975088071",
};

const initialBillingHistory = [
  {
    invoice: "0041",
    date: "24/07/2026",
    product: "Dolo 650",
    billAmount: 27.5,
    discount: 0,
    payable: 47.5,
    status: "Due",
  },
];

const initialReminder = {
  lastVisit: "24/07/2026",
  expectedCompletion: "26/07/2026",
  daysSinceCompletion: 89,
  status: "Pending",
  medicine: "Dolo 650",
  mobile: "7975088071",
};

const tabs = [
  { label: "Ledger", Icon: BookOpen },
  { label: "Sales", Icon: TrendingUp },
  { label: "Customer Insights", Icon: UsersRound },
  { label: "Documents & Note", Icon: Paperclip },
  { label: "Payments", Icon: CreditCard },
  { label: "Activities", Icon: Activity },
];

const money = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#D7DFEA] bg-white px-3 py-2.5 text-sm font-normal text-[#10234F] outline-none transition focus:border-[#1680FF] focus:ring-2 focus:ring-blue-100";

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E6EDF5] bg-white p-5 shadow-[0_8px_24px_rgba(16,35,79,0.06)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xl font-extrabold tracking-tight text-[#FF6814]">
      {children}
    </h2>
  );
}

function ActionButton({
  children,
  onClick,
  color = "blue",
  type = "button",
}) {
  const colors = {
    blue: "bg-[#1680FF] hover:bg-blue-700",
    green: "bg-emerald-500 hover:bg-emerald-600",
    rose: "bg-rose-500 hover:bg-rose-600",
    violet: "bg-[#7775FF] hover:bg-[#605EF0]",
    neutral:
      "border border-[#D7DFEA] bg-white text-[#10234F] hover:bg-slate-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        colors[color]
      } ${
        color === "neutral" ? "" : "text-white"
      }`}
    >
      {children}
    </button>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      {Icon && (
        <Icon size={17} className="mt-0.5 shrink-0 text-[#FF6814]" />
      )}
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#10234F]">{label}</p>
        <p className="mt-1 break-words text-sm text-[#65728A]">{value}</p>
      </div>
    </div>
  );
}

function InsightItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-bold leading-5 text-[#10234F]">{label}</p>
      <p className="mt-1 break-words text-sm text-[#52627A]">{value}</p>
    </div>
  );
}

function EmptyTab({ activeTab }) {
  const descriptions = {
    Ledger: "View this customer's ledger entries.",
    Sales: "View this customer's sales records.",
    "Documents & Note": "View this customer's documents and notes.",
    Payments: "View this customer's payment records.",
    Activities: "View this customer's activity history.",
  };

  return (
    <Panel className="py-12 text-center shadow-none">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1680FF]">
        <FileText size={23} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#10234F]">{activeTab}</h3>
      <p className="mt-2 text-sm text-[#65728A]">
        {descriptions[activeTab]}
      </p>
      <p className="mt-1 text-xs text-[#8A95A7]">
        Connect your existing data source to display these records.
      </p>
    </Panel>
  );
}

export default function CustomerReminderViewHistory({
  customerRecord,
  onBack,
}) {
  const customer = {
    ...initialCustomer,
    name: customerRecord?.customer ?? initialCustomer.name,
    mobile: customerRecord?.mobile ?? initialCustomer.mobile,
  };
  const reminder = {
    ...initialReminder,
    lastVisit: customerRecord?.lastBillDate ?? initialReminder.lastVisit,
    expectedCompletion:
      customerRecord?.expectedCompletion ?? initialReminder.expectedCompletion,
    daysSinceCompletion:
      customerRecord?.daysSinceCompletion ?? initialReminder.daysSinceCompletion,
    status: customerRecord?.reminderStatus ?? initialReminder.status,
    medicine: customerRecord?.medicine ?? initialReminder.medicine,
    mobile: customerRecord?.mobile ?? initialReminder.mobile,
  };
  const [billingHistory] = useState(initialBillingHistory);

  const [activeTab, setActiveTab] = useState("Customer Insights");
  const [quickRange, setQuickRange] = useState("Last 3 Months");
  const [fromDate, setFromDate] = useState("2026-07-23");
  const [toDate, setToDate] = useState("2026-10-23");
  const [appliedRange, setAppliedRange] = useState({
    from: "2026-07-23",
    to: "2026-10-23",
  });
  const [search, setSearch] = useState("");
  const [showAddDiscount, setShowAddDiscount] = useState(false);

  const filteredRows = useMemo(() => {
    return billingHistory.filter((row) => {
      const [day, month, year] = row.date.split("/");
      const rowDate = `${year}-${month}-${day}`;
      const query =
        `${row.invoice} ${row.date} ${row.product} ${row.status}`.toLowerCase();

      return (
        query.includes(search.toLowerCase()) &&
        rowDate >= appliedRange.from &&
        rowDate <= appliedRange.to
      );
    });
  }, [billingHistory, search, appliedRange]);

  const updateQuickRange = (range) => {
    setQuickRange(range);

    const end = new Date(2026, 9, 23);
    const start = new Date(end);

    if (range === "Last 30 Days") {
      start.setDate(start.getDate() - 30);
    } else if (range === "Last 3 Months") {
      start.setMonth(start.getMonth() - 3);
    } else if (range === "Last 6 Months") {
      start.setMonth(start.getMonth() - 6);
    } else if (range === "Last 12 Months") {
      start.setFullYear(start.getFullYear() - 1);
    }

    const formatInputDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setFromDate(formatInputDate(start));
    setToDate(formatInputDate(end));
  };

  const applyFilters = () => {
    if (fromDate > toDate) {
      window.alert("From Date cannot be later than To Date.");
      return;
    }

    setAppliedRange({ from: fromDate, to: toDate });
  };

  const resetFilters = () => {
    setQuickRange("Last 3 Months");
    setFromDate("2026-07-23");
    setToDate("2026-10-23");
    setAppliedRange({ from: "2026-07-23", to: "2026-10-23" });
    setSearch("");
  };

  const exportCsv = () => {
    const headers = [
      "Invoice No.",
      "Date",
      "Medicines / Products",
      "Bill Amount",
      "Discount",
      "Final Payable",
      "lang_v1.payment_status",
    ];

    const rows = filteredRows.map((row) => [
      row.invoice,
      row.date,
      row.product,
      row.billAmount.toFixed(2),
      row.discount.toFixed(2),
      row.payable.toFixed(2),
      row.status,
    ]);

    const escapeCsv = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "customer-billing-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const openReminderReport = () => {
    onBack?.();
  };

  const addDiscount = () => {
    setShowAddDiscount(true);
  };

  if (showAddDiscount) {
    return (
      <AddDiscount
        fullPage
        onClose={() => setShowAddDiscount(false)}
        onSubmit={() => setShowAddDiscount(false)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFAF5] p-4 text-[#10234F] sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            {onBack && (
              <ActionButton color="neutral" onClick={onBack}>
                <ArrowLeft size={16} />
                Back
              </ActionButton>
            )}
            <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6814]">
              Customer Management
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              View Contact
            </h1>
            </div>
          </div>

          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Select customer</span>
            <select className={inputClass + " appearance-none pr-10"}>
              <option value={customer.name}>{customer.name}</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-4 text-slate-500"
            />
          </label>
        </header>

        {/* Contact details */}
        <Panel>
          <div className="flex flex-col justify-between gap-6 lg:flex-row">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1680FF]">
                <UserRound size={24} />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-[#65728A]">
                  {customer.type}
                </p>

                <h2 className="text-xl font-bold">{customer.name}</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Address"
                    value={customer.address}
                    icon={MapPin}
                  />
                  <InfoItem
                    label="Mobile"
                    value={customer.mobile}
                    icon={Phone}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <ActionButton color="violet" onClick={addDiscount}>
                <Tag size={16} />
                Add Discount
              </ActionButton>
            </div>
          </div>
        </Panel>

        {/* Navigation tabs */}
        <section className="overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-sm">
          <nav className="flex overflow-x-auto border-b border-[#E6EDF5]">
            {tabs.map(({ label, Icon }) => {
              const active = activeTab === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(label)}
                  className={`flex min-h-[64px] min-w-[145px] flex-1 items-center justify-center gap-2 border-b-[3px] px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-[#1680FF] bg-blue-50/40 text-[#10234F]"
                      : "border-transparent text-[#65728A] hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="space-y-5 p-4 sm:p-6">
            {activeTab !== "Customer Insights" ? (
              <EmptyTab activeTab={activeTab} />
            ) : (
              <>
                {/* Date filters */}
                <Panel className="bg-[#FFFCF8] shadow-none">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1fr_auto] xl:items-end">
                    <label className="block text-sm font-semibold">
                      Quick Range
                      <select
                        value={quickRange}
                        onChange={(event) =>
                          updateQuickRange(event.target.value)
                        }
                        className={inputClass}
                      >
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>Last 12 Months</option>
                      </select>
                    </label>

                    <label className="block text-sm font-semibold">
                      From Date
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(event) => setFromDate(event.target.value)}
                        className={inputClass}
                      />
                    </label>

                    <label className="block text-sm font-semibold">
                      To Date
                      <input
                        type="date"
                        value={toDate}
                        onChange={(event) => setToDate(event.target.value)}
                        className={inputClass}
                      />
                    </label>

                    <div className="flex gap-2">
                      <ActionButton onClick={applyFilters}>
                        Apply
                      </ActionButton>
                      <ActionButton
                        color="neutral"
                        onClick={resetFilters}
                      >
                        <RotateCcw size={14} />
                        Reset
                      </ActionButton>
                    </div>
                  </div>
                </Panel>

                {/* Customer billing history */}
                <Panel>
                  <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <SectionTitle>Customer Billing History</SectionTitle>

                    <div className="flex flex-wrap gap-2">
                      <ActionButton color="green" onClick={exportCsv}>
                        <Download size={15} />
                        Export Excel
                      </ActionButton>
                      <ActionButton
                        color="rose"
                        onClick={() => window.print()}
                      >
                        <Printer size={15} />
                        Export PDF
                      </ActionButton>
                    </div>
                  </div>

                  <div className="mb-4 max-w-sm">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-3 text-slate-400"
                      />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search billing history..."
                        className="w-full rounded-lg border border-[#D7DFEA] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#1680FF] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#E9EDF3]">
                    <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                      <thead className="bg-[#F5F8FC]">
                        <tr>
                          {[
                            "Invoice No.",
                            "Date",
                            "Medicines / Products",
                            "Bill Amount",
                            "Discount",
                            "Final Payable",
                            "lang_v1.payment_status",
                          ].map((heading) => (
                            <th
                              key={heading}
                              className="border-b border-[#E6EDF5] px-3 py-3 font-bold text-[#10234F]"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRows.length > 0 ? (
                          filteredRows.map((row) => (
                            <tr
                              key={row.invoice}
                              className="border-b border-[#EEF1F5] last:border-0 hover:bg-orange-50/30"
                            >
                              <td className="px-3 py-3">{row.invoice}</td>
                              <td className="px-3 py-3">{row.date}</td>
                              <td className="px-3 py-3 font-medium">
                                {row.product}
                              </td>
                              <td className="px-3 py-3">
                                {money(row.billAmount)}
                              </td>
                              <td className="px-3 py-3">
                                {money(row.discount)}
                              </td>
                              <td className="px-3 py-3 font-semibold">
                                {money(row.payable)}
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                    row.status === "Due"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-10 text-center text-sm text-[#65728A]"
                            >
                              No billing history found for the selected
                              filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-3 text-xs text-[#65728A]">
                    Showing {filteredRows.length} of {billingHistory.length}{" "}
                    entries
                  </p>
                </Panel>

                {/* Reminder insights */}
                <Panel>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
                      <BellRing size={20} />
                    </div>
                    <SectionTitle>Reminder Insight</SectionTitle>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    <InsightItem
                      label="Last Visit:"
                      value={reminder.lastVisit}
                    />
                    <InsightItem
                      label="Expected Completion:"
                      value={reminder.expectedCompletion}
                    />
                    <InsightItem
                      label="Days Since Completion:"
                      value={reminder.daysSinceCompletion}
                    />
                    <div>
                      <p className="text-sm font-bold">Reminder Status:</p>
                      <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        <Clock3 size={13} />
                        {reminder.status}
                      </span>
                    </div>
                    <InsightItem
                      label="Medicine:"
                      value={reminder.medicine}
                    />
                  </div>

                  <div className="my-5 border-t border-[#E6EDF5]" />

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-sm">
                      <span className="font-bold">Mobile:</span>{" "}
                      {reminder.mobile}
                    </p>

                    <ActionButton onClick={openReminderReport}>
                      <Eye size={16} />
                      View Reminder Report
                    </ActionButton>
                  </div>
                </Panel>
              </>
            )}
          </div>
        </section>

        <footer className="pb-2 pt-1 text-center text-xs text-[#7A8799]">
          Billomax · Customer Management
        </footer>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          button,
          nav,
          input,
          select,
          footer {
            display: none !important;
          }
          main {
            padding: 0 !important;
            background: white !important;
          }
          section {
            break-inside: avoid;
            box-shadow: none !important;
          }
        }
      `}</style>
    </main>
  );
}
