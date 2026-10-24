
import React, { useMemo, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  Clock3,
  Wallet,
  CreditCard,
  Banknote,
  X,
  ReceiptText,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TableOccupied from "./TableOccupied.jsx";

const initialBills = [
  { billNo: "BILL-0020", table: "Table 1", steward: "fff", amount: 288, paid: 0, status: "Pending", paymentMode: "—", action: "Settle" },
  { billNo: "BILL-0019", table: "Table 10", steward: "dytt", amount: 598, paid: 0, status: "Pending", paymentMode: "—", action: "Settle" },
  { billNo: "BILL-0018", table: "Table 1", steward: "ram", amount: 460, paid: 460, status: "Paid", paymentMode: "Cash" },
  { billNo: "BILL-0017", table: "Table 1", steward: "ram", amount: 920, paid: 920, status: "Paid", paymentMode: "Card" },
  { billNo: "BILL-0016", table: "Table 1", steward: "nalla", amount: 2300, paid: 2300, status: "Paid", paymentMode: "Card" },
  { billNo: "BILL-0015", table: "Table 1", steward: "nalla", amount: 1035, paid: 1035, status: "Paid", paymentMode: "Card" },
  { billNo: "BILL-0008", table: "Table 1", steward: "ram", amount: 3565, paid: 3565, status: "Paid", paymentMode: "Part Payment" },
  { billNo: "BILL-0007", table: "Table 2", steward: "nalla", amount: 1173, paid: 1180, status: "Paid", paymentMode: "Cash" },
  { billNo: "BILL-0006", table: "Table 4", steward: "ram", amount: 621, paid: 621, status: "Paid", paymentMode: "Card" },
  { billNo: "BILL-0005", table: "Table 1", steward: "ram", amount: 2921, paid: 2921, status: "Paid", paymentMode: "Card" },
  { billNo: "BILL-0004", table: "Table 2", steward: "raja", amount: 2749, paid: 2749, status: "Paid", paymentMode: "Cash" },
  { billNo: "BILL-0001", table: "Table 1", steward: "ram", amount: 3220, paid: 3220, status: "Paid", paymentMode: "Cash" },
];

const money = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const inputClass =
  "w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA7B8] focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70";

export default function Cashier() {
  const [bills, setBills] = useState(initialBills);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [viewedBill, setViewedBill] = useState(null);
  const [settleBill, setSettleBill] = useState(null);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const pendingCount = bills.filter((bill) => bill.status === "Pending").length;
  const paidCount = bills.filter((bill) => bill.status === "Paid").length;
  const pendingAmount = bills
    .filter((bill) => bill.status === "Pending")
    .reduce((sum, bill) => sum + bill.amount - bill.paid, 0);
  const totalBilled = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = bills.reduce((sum, bill) => sum + bill.paid, 0);

  const filteredBills = useMemo(() => {
    const query = search.toLowerCase().trim();

    return bills.filter((bill) => {
      const matchesSearch = [
        bill.billNo,
        bill.table,
        bill.steward,
        bill.paymentMode,
        bill.status,
      ].some((value) => String(value).toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || bill.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || bill.paymentMode === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bills, search, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBills.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleBills = filteredBills.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const openSettlement = (bill) => {
    setSettleBill(bill);
    setPaymentAmount(String(Math.max(0, bill.amount - bill.paid)));
    setPaymentMode("Cash");
  };

  const settlePayment = (event) => {
    event.preventDefault();
    if (!settleBill) return;

    const received = Number(paymentAmount);
    if (!Number.isFinite(received) || received <= 0) return;

    setBills((previous) =>
      previous.map((bill) => {
        if (bill.billNo !== settleBill.billNo) return bill;

        const newPaid = bill.paid + received;
        return {
          ...bill,
          paid: newPaid,
          status: newPaid >= bill.amount ? "Paid" : "Pending",
          paymentMode,
          action: newPaid >= bill.amount ? undefined : "Settle",
        };
      })
    );

    setSettleBill(null);
  };

  const exportCsv = () => {
    const headers = [
      "Bill No",
      "Table",
      "Steward",
      "Net Amount (INR)",
      "Paid (INR)",
      "Status",
      "Payment Mode",
    ];

    const rows = filteredBills.map((bill) => [
      bill.billNo,
      bill.table,
      bill.steward,
      bill.amount.toFixed(2),
      bill.paid.toFixed(2),
      bill.status,
      bill.paymentMode,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "cashier-bills.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (viewedBill) {
    return (
      <TableOccupied
        bill={viewedBill}
        onBack={() => setViewedBill(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6814]">
              <ReceiptText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Cashier Dashboard
              </h1>
              <p className="mt-1 text-sm text-[#718096]">
                Review bills, track payments, and settle outstanding balances.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={exportCsv}
            className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#60728D] shadow-sm transition hover:bg-slate-50"
          >
            Export CSV
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Billed"
            value={money(totalBilled)}
            icon={ReceiptText}
            iconClass="bg-orange-100 text-[#FF6814]"
          />
          <SummaryCard
            title="Total Paid"
            value={money(totalPaid)}
            icon={Wallet}
            iconClass="bg-emerald-100 text-emerald-600"
          />
          <SummaryCard
            title="Pending Bills"
            value={pendingCount}
            subtitle={money(pendingAmount) + " outstanding"}
            icon={Clock3}
            iconClass="bg-amber-100 text-amber-600"
          />
          <SummaryCard
            title="Paid Bills"
            value={paidCount}
            icon={CheckCircle2}
            iconClass="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Bills table */}
        <section className="overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#EEF1F5] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Bills & Payments</h2>
              <p className="mt-1 text-sm text-[#8491A5]">
                {filteredBills.length} bill{filteredBills.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search bills..."
                  className={`${inputClass} pl-10 sm:w-64`}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                  showFilters
                    ? "border-orange-200 bg-orange-50 text-[#FF6814]"
                    : "border-[#E2E8F0] bg-white text-[#60728D] hover:bg-slate-50"
                }`}
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 border-b border-[#EEF1F5] bg-[#FFFCF8] px-5 py-4 sm:grid-cols-2 sm:px-6">
              <label className="text-xs font-bold uppercase tracking-wide text-[#718096]">
                Bill Status
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className={`${inputClass} mt-2`}
                >
                  <option value="All">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </label>

              <label className="text-xs font-bold uppercase tracking-wide text-[#718096]">
                Payment Mode
                <select
                  value={paymentFilter}
                  onChange={(event) => {
                    setPaymentFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className={`${inputClass} mt-2`}
                >
                  <option value="All">All payment modes</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Part Payment">Part Payment</option>
                  <option value="—">Not recorded</option>
                </select>
              </label>
            </div>
          )}

          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <label className="flex items-center gap-2 text-sm text-[#60728D]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              entries
            </label>
            <p className="text-sm text-[#8491A5]">
              Page {safePage} of {totalPages}
            </p>
          </div>

          <div className="overflow-x-auto px-5 pb-5 sm:px-6">
            <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="bg-[#F5F8FC] text-xs uppercase tracking-wide text-[#60728D]">
                  {[
                    "Bill No",
                    "Table",
                    "Steward",
                    "Net Amount (₹)",
                    "Paid (₹)",
                    "Status",
                    "Payment Mode",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="border-y border-[#E8EDF4] px-3.5 py-4 font-extrabold first:rounded-l-xl first:border-l last:rounded-r-xl last:border-r"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleBills.map((bill, index) => (
                  <tr
                    key={bill.billNo}
                    className={`transition hover:bg-orange-50/40 ${
                      index % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                    }`}
                  >
                    <td className="border-b border-[#EEF1F5] px-3.5 py-4 font-bold text-[#315A91]">
                      {bill.billNo}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-3.5 py-4">
                      {bill.table}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-3.5 py-4">
                      {bill.steward}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-3.5 py-4 font-extrabold tabular-nums text-[#10234F]">
                      {money(bill.amount)}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-3.5 py-4 font-semibold tabular-nums text-emerald-600">
                      {money(bill.paid)}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-3.5 py-4">
                      <StatusBadge status={bill.status} />
                    </td>
                    <td className="border-b border-[#EEF1F5] px-3.5 py-4 text-[#60728D]">
                      {bill.paymentMode}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-3.5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewedBill(bill)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        {bill.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => openSettlement(bill)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                          >
                            <CheckCircle2 size={14} />
                            Settle
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleBills.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center">
                      <Search
                        size={28}
                        className="mx-auto text-[#A0AEC0]"
                      />
                      <p className="mt-3 font-bold text-[#10234F]">
                        No bills found
                      </p>
                      <p className="mt-1 text-sm text-[#8491A5]">
                        Change your search or filters and try again.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#EEF1F5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-[#718096]">
              Showing{" "}
              <span className="font-bold text-[#10234F]">
                {filteredBills.length === 0
                  ? 0
                  : (safePage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#10234F]">
                {Math.min(safePage * pageSize, filteredBills.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#10234F]">
                {filteredBills.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#60728D] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-3 text-sm font-bold text-white">
                {safePage}
              </span>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#60728D] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* View bill modal */}
      {selectedBill && (
        <Modal
          title={`Bill ${selectedBill.billNo}`}
          subtitle="Bill summary and payment details"
          onClose={() => setSelectedBill(null)}
        >
          <div className="grid grid-cols-2 gap-3">
            <DetailItem label="Table" value={selectedBill.table} />
            <DetailItem label="Steward" value={selectedBill.steward} />
            <DetailItem label="Net Amount" value={money(selectedBill.amount)} />
            <DetailItem label="Paid Amount" value={money(selectedBill.paid)} />
            <DetailItem label="Payment Mode" value={selectedBill.paymentMode} />
            <div className="rounded-xl border border-[#EEF1F5] bg-white p-3">
              <p className="text-xs font-semibold text-[#8491A5]">Status</p>
              <div className="mt-2">
                <StatusBadge status={selectedBill.status} />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-[#FFFAF5] p-4">
            <p className="text-sm font-semibold text-[#718096]">
              Remaining Balance
            </p>
            <p className="mt-1 text-2xl font-black text-[#FF6814]">
              {money(Math.max(0, selectedBill.amount - selectedBill.paid))}
            </p>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setSelectedBill(null)}
              className="rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold text-[#60728D] hover:bg-slate-50"
            >
              Close
            </button>
            {selectedBill.status === "Pending" && (
              <button
                type="button"
                onClick={() => {
                  openSettlement(selectedBill);
                  setSelectedBill(null);
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Settle Bill
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Settle bill modal */}
      {settleBill && (
        <Modal
          title={`Settle ${settleBill.billNo}`}
          subtitle="Record a payment for this bill"
          onClose={() => setSettleBill(null)}
        >
          <form onSubmit={settlePayment} className="space-y-4">
            <div className="rounded-xl bg-[#FFFAF5] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#718096]">Bill total</span>
                <span className="font-bold">{money(settleBill.amount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm text-[#718096]">Already paid</span>
                <span className="font-bold text-emerald-600">
                  {money(settleBill.paid)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#F0E4D8] pt-3">
                <span className="text-sm font-bold">Balance due</span>
                <span className="text-lg font-black text-[#FF6814]">
                  {money(Math.max(0, settleBill.amount - settleBill.paid))}
                </span>
              </div>
            </div>

            <label className="block text-sm font-bold text-[#33445F]">
              Payment amount (₹)
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                className={`${inputClass} mt-2`}
              />
            </label>

            <label className="block text-sm font-bold text-[#33445F]">
              Payment mode
              <select
                value={paymentMode}
                onChange={(event) => setPaymentMode(event.target.value)}
                className={`${inputClass} mt-2`}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Part Payment">Part Payment</option>
              </select>
            </label>

            <div className="flex flex-col-reverse gap-2 border-t border-[#EEF1F5] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSettleBill(null)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold text-[#60728D] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200/60 hover:shadow-lg"
              >
                Record Payment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-[#F0E4D8] bg-white p-5 shadow-[0_5px_20px_rgba(16,35,79,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#718096]">{title}</p>
          <p className="mt-2 truncate text-2xl font-black tracking-tight text-[#10234F]">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs font-semibold text-[#FF6814]">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const paid = status === "Paid";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        paid
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
          : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          paid ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {status}
    </span>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[#EEF1F5] bg-white p-3">
      <p className="text-xs font-semibold text-[#8491A5]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[#10234F]">
        {value}
      </p>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#EEF1F5] px-5 py-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#10234F]">{title}</h3>
            <p className="mt-1 text-sm text-[#8491A5]">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#8290A4] hover:bg-slate-100"
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
