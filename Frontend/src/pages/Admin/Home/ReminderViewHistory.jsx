
import React, { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpCircle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  Filter,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Printer,
  ScrollText,
  Search,
  StickyNote,
  UserRound,
  Users,
  Activity,
  Clock3,
  Plus,
  Download,
  RotateCcw,
  Percent,
} from "lucide-react";

const THEME = {
  navy: "#10234F",
  orange: "#FF6814",
  cream: "#FFFAF5",
};

const customers = [
  {
    id: "demo",
    name: "Demo Customer",
    email: "demo.customer@demo.test",
    mobile: "9988776655",
    address: "Demo Customer",
  },
  {
    id: "walkin",
    name: "Walk-In Customer",
    email: "",
    mobile: "",
    address: "Walk-In Customer",
  },
];

const invoices = [
  {
    date: "29/06/2026 15:47",
    reference: "0034",
    type: "Sell",
    location: "Pharmacy",
    status: "Due",
    debit: 97.5,
    credit: 0,
    method: "",
    items: "2.00",
    addedBy: "Demo Customer",
    note: "",
    shipping:
      "Amphitheatre Parkway, Mountain View, California, 560078",
  },
  {
    date: "06/07/2026 12:15",
    reference: "0035",
    type: "Sell",
    location: "Pharmacy",
    status: "Due",
    debit: 56.25,
    credit: 0,
    method: "",
    items: "2.00",
    addedBy: "Demo Customer",
    note: "",
    shipping:
      "Amphitheatre Parkway, Mountain View, California, 560078",
  },
  {
    date: "04/08/2026 10:33",
    reference: "0032",
    type: "Sell",
    location: "Pharmacy",
    status: "Due",
    debit: 33.75,
    credit: 0,
    method: "",
    items: "1.00",
    addedBy: "Demo Customer",
    note: "",
    shipping:
      "Amphitheatre Parkway, Mountain View, California, 560078",
  },
];

const billingHistory = [
  {
    invoice: "0032",
    date: "04/08/2026",
    products: "Dolo 650",
    billAmount: 13.75,
    discount: 0,
    finalPayable: 33.75,
    paymentStatus: "Due",
  },
];

const tabs = [
  { id: "ledger", label: "Ledger", Icon: ScrollText },
  { id: "sales", label: "Sales", Icon: ArrowUpCircle },
  { id: "insights", label: "Customer Insights", Icon: Users },
  { id: "documents", label: "Documents & Note", Icon: Paperclip },
  { id: "payments", label: "Payments", Icon: Banknote },
  { id: "activities", label: "Activities", Icon: Activity },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const inputClass =
  "w-full rounded-lg border border-[#E6DCCE] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition focus:border-[#FF6814] focus:ring-2 focus:ring-orange-100";

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E9E5DF] bg-white p-4 shadow-[0_4px_18px_rgba(16,35,79,0.045)] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children, subtitle, icon: Icon }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {Icon && (
        <div className="rounded-xl bg-[#FFF0E4] p-2.5 text-[#FF6814]">
          <Icon size={19} />
        </div>
      )}
      <div>
        <h2 className="text-base font-bold text-[#10234F]">{children}</h2>
        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-[#73809A]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-[#EEE9E2] bg-[#FFFCF8] p-4">
      <p className="text-xs font-medium text-[#73809A]">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#10234F]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#8791A5]">{hint}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const paid = status?.toLowerCase() === "paid";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        paid
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status || "—"}
    </span>
  );
}

function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#EAE6E0]">
      <table className="w-full min-w-[850px] border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <thead className="bg-[#10234F] text-white">
      <tr>{children}</tr>
    </thead>
  );
}

function TH({ children, className = "" }) {
  return (
    <th className={`whitespace-nowrap px-3 py-3 font-semibold ${className}`}>
      {children}
    </th>
  );
}

function TD({ children, className = "" }) {
  return (
    <td className={`border-t border-[#EEEAE4] px-3 py-3 align-top text-[#34415C] ${className}`}>
      {children}
    </td>
  );
}

export default function ReminderViewHistory({ onBack }) {
  const [customerId, setCustomerId] = useState("demo");
  const [activeTab, setActiveTab] = useState("ledger");
  const [ledgerFormat, setLedgerFormat] = useState("Format 1");
  const [location, setLocation] = useState("All locations");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [quickRange, setQuickRange] = useState("Last 3 Months");
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-12-31");
  const [salesSearch, setSalesSearch] = useState("");
  const [salesPageSize, setSalesPageSize] = useState("25");
  const [noteSearch, setNoteSearch] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [notes, setNotes] = useState([]);
  const [activities] = useState([]);
  const [payments] = useState([]);
  const [appliedRange, setAppliedRange] = useState({
    from: "2026-01-01",
    to: "2026-12-31",
  });

  const customer =
    customers.find((item) => item.id === customerId) || customers[0];

  const totalInvoice = invoices.reduce((sum, item) => sum + item.debit, 0);
  const totalPaid = invoices.reduce((sum, item) => sum + item.credit, 0);
  const balanceDue = totalInvoice - totalPaid;

  const filteredInvoices = useMemo(() => {
    const query = salesSearch.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const invoiceDate = invoice.date.slice(6, 10) + "-" +
        invoice.date.slice(3, 5) + "-" + invoice.date.slice(0, 2);

      const withinRange =
        invoiceDate >= appliedRange.from && invoiceDate <= appliedRange.to;

      const matchesStatus =
        paymentStatus === "All" || invoice.status === paymentStatus;

      const matchesLocation =
        location === "All locations" || invoice.location === location;

      const matchesSearch =
        !query ||
        [
          invoice.reference,
          invoice.type,
          invoice.location,
          invoice.status,
          invoice.addedBy,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return withinRange && matchesStatus && matchesLocation && matchesSearch;
    });
  }, [appliedRange, paymentStatus, location, salesSearch]);

  const applyQuickRange = (range) => {
    setQuickRange(range);
    const today = new Date(2026, 9, 27);
    let start = new Date(today);

    if (range === "Last Month") {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      today.setDate(0);
    } else if (range === "Last 3 Months") {
      start = new Date(today);
      start.setMonth(start.getMonth() - 3);
    } else if (range === "Last 6 Months") {
      start = new Date(today);
      start.setMonth(start.getMonth() - 6);
    } else if (range === "This Year") {
      start = new Date(today.getFullYear(), 0, 1);
    }

    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

    setFromDate(formatDate(start));
    setToDate(formatDate(today));
  };

  const applyDateRange = () => {
    setAppliedRange({ from: fromDate, to: toDate });
  };

  const resetDateRange = () => {
    setQuickRange("Last 3 Months");
    setFromDate("2026-07-27");
    setToDate("2026-10-27");
    setAppliedRange({ from: "2026-07-27", to: "2026-10-27" });
  };

  const downloadCSV = (rows, filename) => {
    if (!rows.length) {
      window.alert("There are no records to export.");
      return;
    }

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = String(row[header] ?? "");
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addNote = (event) => {
    event.preventDefault();
    if (!noteTitle.trim() || !noteBody.trim()) return;

    setNotes((current) => [
      {
        id: Date.now(),
        heading: noteTitle.trim(),
        body: noteBody.trim(),
        createdAt: new Date().toLocaleString("en-IN"),
      },
      ...current,
    ]);
    setNoteTitle("");
    setNoteBody("");
    setShowAddNote(false);
  };

  const dateLabel = (value) => {
    if (!value) return "—";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-3 py-4 text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-3 rounded-lg border border-[#F2E8DE] bg-white px-3 py-2 text-xs font-semibold text-[#19366F] transition hover:bg-[#FFF1E5]"
              >
                Back to Dashboard
              </button>
            )}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6814]">
              Customer management
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#10234F]">
              View Contact
            </h1>
            <p className="mt-1 text-sm text-[#73809A]">
              Review customer account activity, invoices, payments and reminders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="customer" className="text-sm font-semibold">
              Customer
            </label>
            <select
              id="customer"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              className={`${inputClass} min-w-48`}
            >
              {customers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact summary */}
        <Card className="overflow-hidden">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E4] text-[#FF6814]">
                <UserRound size={27} />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-[#8791A5]">Customer</p>
                  <h2 className="mt-1 text-lg font-bold text-[#10234F]">
                    {customer.name}
                  </h2>
                </div>
                <div className="grid gap-2 text-sm text-[#5D6A83] sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 text-[#FF6814]" />
                    <div>
                      <p className="font-semibold text-[#10234F]">Address</p>
                      <p>{customer.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={16} className="mt-0.5 text-[#FF6814]" />
                    <div>
                      <p className="font-semibold text-[#10234F]">Mobile</p>
                      <p>{customer.mobile || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <Mail size={16} className="mt-0.5 text-[#FF6814]" />
                    <div>
                      <p className="font-semibold text-[#10234F]">Email</p>
                      <p>{customer.email || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("sales")}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              <Percent size={16} />
              Add Discount
            </button>
          </div>
        </Card>

        {/* Navigation */}
        <div className="overflow-x-auto rounded-2xl border border-[#E9E5DF] bg-white p-1.5 shadow-sm">
          <div className="flex min-w-[760px] gap-1">
            {tabs.map(({ id, label, Icon }) => {
              const selected = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    selected
                      ? "bg-[#FFF0E4] text-[#E95B0B] shadow-sm"
                      : "text-[#66738C] hover:bg-[#FFFAF5] hover:text-[#10234F]"
                  }`}
                >
                  <Icon size={17} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ledger tab */}
        {activeTab === "ledger" && (
          <div className="space-y-5">
            <Card>
              <SectionTitle
                icon={Filter}
                subtitle="Choose a reporting period, ledger layout and business location."
              >
                Ledger Filters
              </SectionTitle>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">
                    Date Range — From
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">
                    Date Range — To
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">
                    Ledger format
                  </label>
                  <select
                    value={ledgerFormat}
                    onChange={(event) => setLedgerFormat(event.target.value)}
                    className={inputClass}
                  >
                    <option>Format 1</option>
                    <option>Format 2</option>
                    <option>Format 3</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">
                    Business Location
                  </label>
                  <select
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className={inputClass}
                  >
                    <option>All locations</option>
                    <option>Pharmacy</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#73809A]">
                  Selected period: {dateLabel(fromDate)} – {dateLabel(toDate)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={applyDateRange}
                    className="rounded-lg bg-[#FF6814] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E95B0B]"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setFromDate("2026-01-01");
                      setToDate("2026-12-31");
                      setAppliedRange({
                        from: "2026-01-01",
                        to: "2026-12-31",
                      });
                      setLocation("All locations");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E6DCCE] px-4 py-2 text-sm font-semibold text-[#52617B] hover:bg-[#FFFAF5]"
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Total invoice" value={money(totalInvoice)} hint="3 invoices shown in the source data" />
              <Metric label="Total paid" value={money(totalPaid)} hint="Recorded payments" />
              <Metric label="Balance due" value={money(balanceDue)} hint="Outstanding customer balance" />
              <Metric label="Invoice count" value={filteredInvoices.length} hint="Based on the selected filters" />
            </div>

            <Card>
              <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
                <SectionTitle icon={ScrollText} subtitle="Account statement and invoice activity">
                  Account Ledger
                </SectionTitle>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => downloadCSV(filteredInvoices, "customer-ledger.csv")}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E6DCCE] px-3 py-2 text-xs font-semibold text-[#52617B] hover:bg-[#FFFAF5]"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E6DCCE] px-3 py-2 text-xs font-semibold text-[#52617B] hover:bg-[#FFFAF5]"
                  >
                    <Printer size={14} /> Print
                  </button>
                </div>
              </div>

              <div className="mb-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-[#E9E5DF] p-4">
                  <div className="mb-3 rounded-lg bg-[#10234F] px-3 py-2 text-xs font-semibold text-white">
                    To:
                  </div>
                  <p className="font-bold">{customer.name}</p>
                  <p className="mt-1 text-sm text-[#65718A]">{customer.address}</p>
                  <p className="text-sm text-[#65718A]">
                    Email: {customer.email || "—"}
                  </p>
                  <p className="text-sm text-[#65718A]">
                    Mobile: {customer.mobile || "—"}
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#E9E5DF]">
                  <div className="bg-[#10234F] px-4 py-3 text-right text-lg font-bold text-white">
                    Account Summary
                  </div>
                  <div className="space-y-3 p-4 text-sm">
                    <div className="flex justify-between gap-3 text-[#65718A]">
                      <span>Period</span>
                      <strong className="text-right text-[#10234F]">
                        {dateLabel(appliedRange.from)} to {dateLabel(appliedRange.to)}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total invoice</span>
                      <strong>{money(totalInvoice)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total paid</span>
                      <strong className="text-emerald-700">{money(totalPaid)}</strong>
                    </div>
                    <div className="flex justify-between border-t border-[#E9E5DF] pt-3 font-bold">
                      <span>Balance due</span>
                      <span className="text-[#FF6814]">{money(balanceDue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mb-3 text-center text-xs font-semibold text-[#52617B]">
                Showing invoices and payments between {dateLabel(appliedRange.from)} and {dateLabel(appliedRange.to)}
              </p>

              <TableWrap>
                <TableHead>
                  <TH>Date</TH>
                  <TH>Reference No</TH>
                  <TH>Type</TH>
                  <TH>Location</TH>
                  <TH>Payment Status</TH>
                  <TH>Debit</TH>
                  <TH>Credit</TH>
                  <TH>Payment Method</TH>
                  <TH>Others</TH>
                </TableHead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.reference} className="odd:bg-white even:bg-[#FFFCF8] hover:bg-[#FFF5EB]">
                      <TD>{invoice.date}</TD>
                      <TD className="font-semibold">{invoice.reference}</TD>
                      <TD>{invoice.type}</TD>
                      <TD>{invoice.location}</TD>
                      <TD><StatusBadge status={invoice.status} /></TD>
                      <TD className="font-semibold">{money(invoice.debit)}</TD>
                      <TD className="text-emerald-700">{money(invoice.credit)}</TD>
                      <TD>{invoice.method || "—"}</TD>
                      <TD className="max-w-48">{invoice.shipping}</TD>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <TD colSpan={9} className="py-10 text-center text-[#8791A5]">
                        No invoices match the selected filters.
                      </TD>
                    </tr>
                  )}
                  <tr className="bg-[#F2F4F8] font-bold">
                    <TD colSpan={4}>Total</TD>
                    <TD>Due · {filteredInvoices.length}</TD>
                    <TD>{money(filteredInvoices.reduce((sum, row) => sum + row.debit, 0))}</TD>
                    <TD>{money(filteredInvoices.reduce((sum, row) => sum + row.credit, 0))}</TD>
                    <TD colSpan={2}>Balance: {money(
                      filteredInvoices.reduce((sum, row) => sum + row.debit - row.credit, 0)
                    )}</TD>
                  </tr>
                </tbody>
              </TableWrap>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#73809A]">
                <span>Showing {filteredInvoices.length} of {invoices.length} entries</span>
                <span>{ledgerFormat} · {location}</span>
              </div>
            </Card>
          </div>
        )}

        {/* Sales tab */}
        {activeTab === "sales" && (
          <div className="space-y-5">
            <Card>
              <SectionTitle icon={ArrowUpCircle} subtitle="Filter and review this customer's sales invoices.">
                Sales Filters
              </SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(event) => setPaymentStatus(event.target.value)}
                    className={inputClass}
                  >
                    <option>All</option>
                    <option>Due</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Date Range — From</label>
                  <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Date Range — To</label>
                  <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className={inputClass} />
                </div>
                <div className="flex items-end">
                  <button onClick={applyDateRange} className="w-full rounded-lg bg-[#FF6814] px-4 py-2.5 text-sm font-semibold text-white">
                    Apply Filters
                  </button>
                </div>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-[#52617B]">
                <input type="checkbox" className="accent-[#FF6814]" />
                Subscriptions
              </label>
            </Card>

            <Card>
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <SectionTitle icon={ClipboardList} subtitle="Invoice-level payment details">
                  Sales Invoices
                </SectionTitle>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => downloadCSV(filteredInvoices, "customer-sales.csv")} className="rounded-lg border border-[#E6DCCE] px-3 py-2 text-xs font-semibold">
                    Export CSV
                  </button>
                  <button onClick={() => window.print()} className="rounded-lg border border-[#E6DCCE] px-3 py-2 text-xs font-semibold">
                    Print
                  </button>
                </div>
              </div>

              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 text-xs text-[#73809A]">
                  Show
                  <select value={salesPageSize} onChange={(event) => setSalesPageSize(event.target.value)} className="rounded-lg border border-[#E6DCCE] bg-white px-2 py-2 text-[#10234F]">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  entries
                </label>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8791A5]" />
                  <input value={salesSearch} onChange={(event) => setSalesSearch(event.target.value)} placeholder="Search invoices..." className={`${inputClass} pl-9 sm:w-64`} />
                </div>
              </div>

              <TableWrap>
                <TableHead>
                  <TH>Action</TH>
                  <TH>Date</TH>
                  <TH>Invoice No.</TH>
                  <TH>Customer name</TH>
                  <TH>Contact Number</TH>
                  <TH>Location</TH>
                  <TH>Payment Status</TH>
                  <TH>Payment Method</TH>
                  <TH>Total amount</TH>
                  <TH>Total paid</TH>
                  <TH>Sell Due</TH>
                  <TH>Sell Return Due</TH>
                  <TH>Shipping Status</TH>
                  <TH>Total Items</TH>
                  <TH>Added By</TH>
                  <TH>Sell note</TH>
                  <TH>Staff note</TH>
                  <TH>Shipping Details</TH>
                </TableHead>
                <tbody>
                  {filteredInvoices.slice(0, Number(salesPageSize)).map((invoice) => (
                    <tr key={invoice.reference} className="odd:bg-white even:bg-[#FFFCF8] hover:bg-[#FFF5EB]">
                      <TD>
                        <button
                          onClick={() => window.alert(`Invoice ${invoice.reference}`)}
                          className="rounded-md border border-[#FFB27D] px-2 py-1 font-semibold text-[#E95B0B]"
                        >
                          Actions <ChevronDown size={12} className="inline" />
                        </button>
                      </TD>
                      <TD>{invoice.date}</TD>
                      <TD>{invoice.reference}</TD>
                      <TD>{customer.name}</TD>
                      <TD>{customer.mobile || "—"}</TD>
                      <TD>{invoice.location}</TD>
                      <TD><StatusBadge status={invoice.status} /></TD>
                      <TD>{invoice.method || "—"}</TD>
                      <TD>{money(invoice.debit)}</TD>
                      <TD>{money(invoice.credit)}</TD>
                      <TD>{money(invoice.debit - invoice.credit)}</TD>
                      <TD>{money(0)}</TD>
                      <TD>—</TD>
                      <TD>{invoice.items}</TD>
                      <TD>{invoice.addedBy}</TD>
                      <TD>{invoice.note || "—"}</TD>
                      <TD>—</TD>
                      <TD>{invoice.shipping}</TD>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr><TD colSpan={18} className="py-8 text-center">No records found</TD></tr>
                  )}
                </tbody>
              </TableWrap>
              <div className="mt-3 flex justify-between text-xs text-[#73809A]">
                <span>Showing {filteredInvoices.length} entries</span>
                <span>Total due: {money(filteredInvoices.reduce((sum, row) => sum + row.debit - row.credit, 0))}</span>
              </div>
            </Card>
          </div>
        )}

        {/* Customer insights tab */}
        {activeTab === "insights" && (
          <div className="space-y-5">
            <Card>
              <SectionTitle icon={CalendarDays} subtitle="Review billing history over a selected period.">
                Customer Insights
              </SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto]">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Quick Range</label>
                  <select value={quickRange} onChange={(event) => applyQuickRange(event.target.value)} className={inputClass}>
                    <option>Last 3 Months</option>
                    <option>Last Month</option>
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">From Date</label>
                  <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">To Date</label>
                  <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className={inputClass} />
                </div>
                <div className="flex items-end">
                  <button onClick={applyDateRange} className="w-full rounded-lg bg-[#FF6814] px-4 py-2.5 text-sm font-semibold text-white">Apply</button>
                </div>
                <div className="flex items-end">
                  <button onClick={resetDateRange} className="w-full rounded-lg border border-[#E6DCCE] px-4 py-2.5 text-sm font-semibold">Reset</button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <SectionTitle icon={ClipboardList} subtitle="Product and invoice summary">
                  Customer Billing History
                </SectionTitle>
                <div className="flex gap-2">
                  <button onClick={() => downloadCSV(billingHistory, "customer-billing-history.csv")} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white">Export Excel / CSV</button>
                  <button onClick={() => window.print()} className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white">Export PDF / Print</button>
                </div>
              </div>
              <TableWrap>
                <TableHead>
                  <TH>Invoice No.</TH>
                  <TH>Date</TH>
                  <TH>Medicines / Products</TH>
                  <TH>Bill Amount</TH>
                  <TH>Discount</TH>
                  <TH>Final Payable</TH>
                  <TH>Payment Status</TH>
                </TableHead>
                <tbody>
                  {billingHistory.map((row) => (
                    <tr key={row.invoice} className="odd:bg-white even:bg-[#FFFCF8]">
                      <TD>{row.invoice}</TD>
                      <TD>{row.date}</TD>
                      <TD>{row.products}</TD>
                      <TD>{money(row.billAmount)}</TD>
                      <TD>{money(row.discount)}</TD>
                      <TD className="font-semibold">{money(row.finalPayable)}</TD>
                      <TD><StatusBadge status={row.paymentStatus} /></TD>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            </Card>

            <Card>
              <SectionTitle icon={Clock3} subtitle="Reminder information from the supplied customer record.">
                Reminder Insight
              </SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div><p className="text-xs font-semibold">Last Visit</p><p className="mt-1 text-sm">04/08/2026</p></div>
                <div><p className="text-xs font-semibold">Expected Completion</p><p className="mt-1 text-sm">05/08/2026</p></div>
                <div><p className="text-xs font-semibold">Days Since Completion</p><p className="mt-1 text-sm">83</p></div>
                <div><p className="text-xs font-semibold">Reminder Status</p><p className="mt-1"><StatusBadge status="Pending" /></p></div>
                <div><p className="text-xs font-semibold">Medicine</p><p className="mt-1 text-sm">Dolo 650</p></div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEAE4] pt-4">
                <p className="text-sm"><strong>Mobile:</strong> {customer.mobile || "Not provided"}</p>
                <button onClick={() => window.alert("Connect this button to your Reminder Report route.")} className="rounded-lg bg-[#1769E8] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                  View Reminder Report
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Documents and notes */}
        {activeTab === "documents" && (
          <div className="space-y-5">
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <SectionTitle icon={Paperclip} subtitle="Documents and notes saved for this customer.">
                  Documents & Note
                </SectionTitle>
                <button onClick={() => setShowAddNote((value) => !value)} className="inline-flex items-center gap-2 rounded-lg bg-[#FF6814] px-4 py-2.5 text-sm font-semibold text-white">
                  <Plus size={16} /> Add Note
                </button>
              </div>

              {showAddNote && (
                <form onSubmit={addNote} className="mb-5 space-y-4 rounded-xl border border-[#F2D9C5] bg-[#FFFCF8] p-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold">Heading *</label>
                    <input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} required className={inputClass} placeholder="Enter note heading" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold">Note *</label>
                    <textarea value={noteBody} onChange={(event) => setNoteBody(event.target.value)} required rows={4} className={inputClass} placeholder="Write a customer note..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddNote(false)} className="rounded-lg border border-[#E6DCCE] px-4 py-2 text-sm">Cancel</button>
                    <button type="submit" className="rounded-lg bg-[#FF6814] px-4 py-2 text-sm font-semibold text-white">Save Note</button>
                  </div>
                </form>
              )}

              <div className="mb-4 relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8791A5]" />
                <input value={noteSearch} onChange={(event) => setNoteSearch(event.target.value)} className={`${inputClass} pl-9`} placeholder="Search notes..." />
              </div>

              <TableWrap>
                <TableHead>
                  <TH>Action</TH>
                  <TH>Heading</TH>
                  <TH>Added By</TH>
                  <TH>Created At</TH>
                  <TH>Updated At</TH>
                </TableHead>
                <tbody>
                  {notes
                    .filter((note) => `${note.heading} ${note.body}`.toLowerCase().includes(noteSearch.toLowerCase()))
                    .map((note) => (
                      <tr key={note.id}>
                        <TD><button onClick={() => window.alert(note.body)} className="font-semibold text-[#E95B0B]">View</button></TD>
                        <TD>{note.heading}</TD>
                        <TD>{customer.name}</TD>
                        <TD>{note.createdAt}</TD>
                        <TD>{note.createdAt}</TD>
                      </tr>
                    ))}
                  {notes.length === 0 && (
                    <tr><TD colSpan={5} className="py-10 text-center text-[#8791A5]"><StickyNote className="mx-auto mb-2" size={22} />No data available in table</TD></tr>
                  )}
                </tbody>
              </TableWrap>
            </Card>
          </div>
        )}

        {/* Payments */}
        {activeTab === "payments" && (
          <Card>
            <SectionTitle icon={Banknote} subtitle="Payment transactions associated with this customer.">
              Payments
            </SectionTitle>
            <TableWrap>
              <TableHead>
                <TH>Paid on</TH>
                <TH>Reference No</TH>
                <TH>Amount</TH>
                <TH>Payment Method</TH>
                <TH>Payment For</TH>
                <TH>Action</TH>
              </TableHead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><TD colSpan={6} className="py-12 text-center text-[#8791A5]">No records found</TD></tr>
                ) : payments.map((payment, index) => (
                  <tr key={index}>
                    <TD>{payment.date}</TD>
                    <TD>{payment.reference}</TD>
                    <TD>{money(payment.amount)}</TD>
                    <TD>{payment.method}</TD>
                    <TD>{payment.for}</TD>
                    <TD>—</TD>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Card>
        )}

        {/* Activities */}
        {activeTab === "activities" && (
          <Card>
            <SectionTitle icon={Activity} subtitle="Customer actions and account history.">
              Activities
            </SectionTitle>
            <TableWrap>
              <TableHead>
                <TH>Date</TH>
                <TH>Action</TH>
                <TH>By</TH>
                <TH>Note</TH>
              </TableHead>
              <tbody>
                {activities.length === 0 ? (
                  <tr><TD colSpan={4} className="py-12 text-center text-[#8791A5]">No records found</TD></tr>
                ) : activities.map((activity, index) => (
                  <tr key={index}>
                    <TD>{activity.date}</TD>
                    <TD>{activity.action}</TD>
                    <TD>{activity.by}</TD>
                    <TD>{activity.note}</TD>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Card>
        )}

        <footer className="flex flex-col justify-between gap-2 border-t border-[#E9E5DF] py-4 text-xs text-[#8791A5] sm:flex-row">
          <span>Billomax — Your Trusted Partner in Billing & Invoicing</span>
          <span>Customer Management · Reminder View History</span>
        </footer>
      </div>
    </main>
  );
}
