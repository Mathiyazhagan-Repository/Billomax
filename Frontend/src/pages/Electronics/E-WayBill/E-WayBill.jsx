
import React, { useMemo, useState } from "react";
import {
  ReceiptText,
  Search,
  Printer,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Truck,
} from "lucide-react";

// Example rows visible in the provided screenshot.
// For your complete original data, pass the existing sales array via the sales prop.
const initialSales = [
  { id: 1, date: "22/10/2026 11:00", invoiceNo: "0041", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 2, date: "01/10/2026 17:00", invoiceNo: "0040", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 3, date: "24/09/2026 15:43", invoiceNo: "0039", customerName: "Walk-In Customer", total: 25.0, paymentStatus: "paid" },
  { id: 4, date: "17/09/2026 13:07", invoiceNo: "0038", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 5, date: "17/09/2026 13:07", invoiceNo: "0037", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 6, date: "04/09/2026 14:09", invoiceNo: "0036", customerName: "Walk-In Customer", total: 45.0, paymentStatus: "paid" },
  { id: 7, date: "03/09/2026 10:55", invoiceNo: "0035", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 8, date: "01/09/2026 17:37", invoiceNo: "0034", customerName: "Walk-In Customer", total: 15.0, paymentStatus: "paid" },
  { id: 9, date: "21/08/2026 17:48", invoiceNo: "0033", customerName: "Walk-In Customer", total: 74.0, paymentStatus: "paid" },
];

function StatusBadge({ status }) {
  const paid = String(status).toLowerCase() === "paid";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        paid
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
          : "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          paid ? "bg-emerald-500" : "bg-orange-500"
        }`}
      />
      {status}
    </span>
  );
}

export default function EWayBill({
  sales = initialSales,
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
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [sales, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSales.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  const visibleSales = filteredSales.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePrint = (sale) => {
    if (onPrint) {
      onPrint(sale);
    } else {
      window.print();
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-5 text-slate-700 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* Page header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E86A20]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6814]" />
              Sales management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              E-Way Bill
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              View sales invoices and print the relevant bill.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-[#E6EAF0] bg-white px-4 py-3 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
              <Truck size={21} />
            </span>
            <div>
              <p className="text-xs text-slate-500">Sales records</p>
              <p className="text-lg font-bold text-[#10234F]">
                {sales.length}
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <section className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_8px_30px_rgba(16,35,79,0.055)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EDF0F5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
                <ReceiptText size={21} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#E86A20] sm:text-xl">
                  Sales Ready for E-Way Bill
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review invoices and print sales records.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Sales list
            </span>
          </div>

          {/* Search and pagination size */}
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-[#DFE5EE] bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
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
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search invoices, customers..."
                className="w-full rounded-xl border border-[#DFE5EE] bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Sales table */}
          <div className="px-5 pb-2 sm:px-6">
            <div className="overflow-x-auto rounded-xl border border-[#E7EBF1]">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] text-xs font-bold uppercase tracking-wide text-[#52617A]">
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Invoice No.</th>
                    <th className="px-4 py-4">Customer name</th>
                    <th className="px-4 py-4 text-right">Total</th>
                    <th className="px-4 py-4">Payment Status</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EDF0F5]">
                  {visibleSales.map((sale, index) => (
                    <tr
                      key={sale.id ?? sale.invoiceNo}
                      className={`transition hover:bg-orange-50/50 ${
                        index % 2 === 1 ? "bg-[#FCFCFD]" : "bg-white"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {sale.date}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#10234F]">
                        {sale.invoiceNo}
                      </td>

                      <td className="px-4 py-4 font-medium text-[#34445E]">
                        {sale.customerName}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums text-[#10234F]">
                        {Number(sale.total || 0).toFixed(2)}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={sale.paymentStatus} />
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handlePrint(sale)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-200"
                        >
                          <Printer size={14} />
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}

                  {visibleSales.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <Search size={21} />
                        </span>
                        <p className="mt-3 font-semibold text-[#10234F]">
                          No sales found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Try a different invoice number or customer name.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table footer */}
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredSales.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#10234F]">
                {Math.min(startIndex + pageSize, filteredSales.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredSales.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1 self-start rounded-xl border border-[#E6EAF0] bg-white p-1 sm:self-auto">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-[#E86A20] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-3 text-sm font-bold text-white">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-[#E86A20] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <footer className="pb-3 pt-1 text-center text-xs text-slate-400">
          Billomax · Sales management
        </footer>
      </div>
    </main>
  );
}
