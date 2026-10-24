 
import React, { useMemo, useState } from "react";
import {
  ReceiptText,
  Search,
  Printer,
  Pencil,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

// Keep your existing sales data here without changing its values.
const initialSales = [
  { id: 1, date: "22/10/2026 11:00", invoiceNo: "0041", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 2, date: "01/10/2026 17:00", invoiceNo: "0040", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 3, date: "24/09/2026 15:43", invoiceNo: "0039", customerName: "Walk-In Customer", total: 25.0, paymentStatus: "paid" },
  { id: 4, date: "17/09/2026 13:07", invoiceNo: "0038", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 5, date: "17/09/2026 13:07", invoiceNo: "0037", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 6, date: "04/09/2026 14:09", invoiceNo: "0036", customerName: "Walk-In Customer", total: 45.0, paymentStatus: "paid" },
  { id: 7, date: "03/09/2026 10:55", invoiceNo: "0035", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
];

const formatCurrency = (amount) =>
  `₹ ${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function StatusBadge({ status }) {
  const isPaid = String(status).toLowerCase() === "paid";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        isPaid
          ? "bg-[#EAF8F0] text-[#24804C] ring-1 ring-inset ring-[#CDEDDC]"
          : "bg-[#FFF1E5] text-[#F04A13] ring-1 ring-inset ring-[#F8EBDD]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPaid ? "bg-[#24804C]" : "bg-[#FF711A]"
        }`}
      />
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, children, onClick, variant = "blue" }) {
  const variants = {
    blue: "border-[#D8E8FF] bg-[#F3F8FF] text-[#3478F6] hover:bg-[#EAF3FF]",
    violet: "border-[#E4DDFB] bg-[#F7F4FF] text-[#7252B8] hover:bg-[#EEE9FF]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20 ${variants[variant]}`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

export default function ModifyBill({
  sales = initialSales,
  onEdit,
  onPrint,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredSales = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return sales;

    return sales.filter((sale) =>
      [
        sale.date,
        sale.invoiceNo,
        sale.customerName,
        sale.paymentStatus,
        sale.total,
      ].some((value) => String(value ?? "").toLowerCase().includes(query))
    );
  }, [sales, search]);

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleSales = filteredSales.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalShown = visibleSales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );

  const handlePrint = (sale) => {
    if (onPrint) {
      onPrint(sale);
      return;
    }

    window.print();
  };

  const handleEdit = (sale) => {
    if (onEdit) onEdit(sale);
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1500px] space-y-5">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <span className="text-[11px] font-extrabold">SALES · BILL MANAGEMENT</span>
            </div>

            <h1 className="app-page-title text-[#10234F]">
              Modify Bill
            </h1>

            <p className="app-description mt-1 text-[#577B9F]">
              Find a recent sale to print its bill or open it for editing.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-[#F2E8DE] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(224,133,65,0.07)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
              <ReceiptText size={21} />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#8798AD]">Sales records</p>
              <p className="text-lg font-extrabold text-[#19366F]">
                {sales.length}
              </p>
            </div>
          </div>
        </header>

        {/* Recent sales card */}
        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
                <FileText size={21} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  Recent Sales
                </h2>
                <p className="app-description mt-1 text-[#577B9F]">
                  Review invoices and manage existing bills.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg bg-[#FFF1E5] px-3 py-2 text-xs font-bold text-[#F04A13] sm:self-auto">
              <CalendarDays size={15} />
              Recent invoices
            </div>
          </div>

          {/* Search and page size */}
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#577B9F]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              >
                {[5, 10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              entries
            </label>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search invoices, customers..."
                className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-10 pr-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="px-5 pb-2 sm:px-6">
            <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#FFF7EF] text-[10px] font-extrabold uppercase tracking-wide text-[#19366F]">
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Invoice No.</th>
                    <th className="px-4 py-4">Customer name</th>
                    <th className="px-4 py-4 text-right">Total</th>
                    <th className="px-4 py-4">Payment Status</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2E8DE]">
                  {visibleSales.map((sale, index) => (
                    <tr
                      key={sale.id ?? sale.invoiceNo}
                      className={`transition hover:bg-[#FFF7EF] ${
                        index % 2 === 1 ? "bg-[#FFFCF8]" : "bg-white"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-[#577B9F]">
                        {sale.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center gap-2 font-semibold text-[#19366F]">
                          <span className="h-2 w-2 rounded-full bg-[#FFB37E]" />
                          {sale.invoiceNo}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-[#19366F]">
                        {sale.customerName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums text-[#19366F]">
                        {Number(sale.total || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={sale.paymentStatus} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <ActionButton
                            icon={Printer}
                            variant="blue"
                            onClick={() => handlePrint(sale)}
                          >
                            Print
                          </ActionButton>
                          <ActionButton
                            icon={Pencil}
                            variant="violet"
                            onClick={() => handleEdit(sale)}
                          >
                            Edit
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {visibleSales.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#F04A13]">
                          <Search size={21} />
                        </span>
                        <p className="mt-3 font-semibold text-[#19366F]">
                          No sales found
                        </p>
                        <p className="mt-1 text-sm text-[#577B9F]">
                          Try another invoice number or customer name.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer and pagination */}
          <div className="flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm text-[#577B9F]">
                Showing{" "}
                <span className="font-semibold text-[#19366F]">
                  {filteredSales.length === 0 ? 0 : startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-[#19366F]">
                  {Math.min(startIndex + pageSize, filteredSales.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#19366F]">
                  {filteredSales.length}
                </span>{" "}
                entries
              </p>
              <p className="mt-1 text-xs text-[#8798AD]">
                Total of visible page: {formatCurrency(totalShown)}
              </p>
            </div>

            <div className="flex items-center gap-1 self-start rounded-xl border border-[#F2E8DE] bg-white p-1 sm:self-auto">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF711A] px-3 text-sm font-bold text-white">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <footer className="pb-3 pt-1 text-center text-xs text-[#8798AD]">
          Billomax · Sales management
        </footer>
      </div>
    </main>
  );
}
