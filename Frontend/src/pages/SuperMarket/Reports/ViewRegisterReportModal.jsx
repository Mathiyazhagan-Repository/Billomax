
import React from "react";
import { X, Printer, Receipt, CalendarDays, UserRound, Mail, MapPin } from "lucide-react";

export default function ViewRegisterReportModal({
  isOpen = true,
  onClose = () => {},
  onPrint,
  register = {},
}) {
  if (!isOpen) return null;

  const paymentRows = [
    { method: "Cash in hand:", sell: 13, expense: "--" },
    { method: "Cash Payment:", sell: 1089, expense: 0 },
    { method: "Cheque Payment:", sell: 0, expense: 0 },
    { method: "Card Payment:", sell: 25, expense: 0 },
    { method: "Bank Transfer:", sell: 0, expense: 0 },
    { method: "Advance payment:", sell: 0, expense: 0 },
    { method: "Custom Payment 1:", sell: 0, expense: 0 },
    { method: "Custom Payment 2:", sell: 0, expense: 0 },
    { method: "Custom Payment 3:", sell: 0, expense: 0 },
    { method: "Custom Payment 4:", sell: 0, expense: 0 },
    { method: "Custom Payment 5:", sell: 0, expense: 0 },
    { method: "Custom Payment 6:", sell: 0, expense: 0 },
    { method: "Custom Payment 7:", sell: 0, expense: 0 },
    { method: "Other Payments:", sell: 0, expense: 0 },
  ];

  const products = [
    { sku: "0038", name: "Amoxicillin", qty: 11, amount: 247.50 },
    { sku: "0040", name: "Sertraline (Zoloft)", qty: 2, amount: 45.00 },
    { sku: "0041", name: "Fluoxetine (Prozac)", qty: 3, amount: 67.50 },
    { sku: "0043", name: "Oxycodone", qty: 2, amount: 45.00 },
    { sku: "0045", name: "Amlodipine", qty: 3, amount: 67.50 },
    { sku: "0047", name: "Atorvastatin (Lipitor)", qty: 5, amount: 112.50 },
    { sku: "0049", name: "Sertraline (Zoloft)", qty: 2, amount: 45.00 },
    { sku: "0050", name: "Amoxicillin", qty: 5, amount: 112.50 },
    { sku: "0051", name: "Fluoxetine (Prozac)", qty: 2, amount: 45.00 },
    { sku: "0054", name: "Budesonide", qty: 1, amount: 22.50 },
    { sku: "0056", name: "Amoxicillin", qty: 1, amount: 22.50 },
    { sku: "0057", name: "Azithromycin", qty: 2, amount: 45.00 },
    { sku: "0001", name: "Dolo 650", qty: 25, amount: 318.63 },
  ];

  const brands = [
    { name: "Dolo", qty: 25, amount: 318.63 },
    { name: "", qty: 39, amount: 877.50 },
  ];

  const summaryRows = [
    { label: "Total Sales:", value: 1114.00, tone: "normal" },
    { label: "Total Refund", value: 0, tone: "red" },
    { label: "Total Payment", value: 1102.00, tone: "green" },
    { label: "Credit Sales:", value: 230.50, tone: "green" },
    { label: "Total Sales:", value: 1344.50, tone: "green" },
    { label: "Total Expense:", value: 0, tone: "red" },
  ];

  const money = (value) => {
    if (value === "--" || value === null || value === undefined) return "--";
    return `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const details = {
    dateRange: "17th Oct, 2024 03:53 PM - 23rd Oct, 2026 12:22 PM",
    totalSales: 1114.0,
    totalRefund: 0,
    totalPayment: 1102.0,
    creditSales: 230.5,
    adjustedTotalSales: 1344.5,
    totalExpense: 0,
    orderTax: 105.05,
    discount: 24.11,
    shippingCharges: 60,
    grandTotal: 1337.07,
    user: "Mr pharmacy",
    email: "khanaiamit.m9@gmail.com",
    businessLocation: "Pharmacy",
    ...register,
  };

  const handlePrint = () => {
    if (onPrint) onPrint(details);
    else window.print();
  };

  const sectionTitle =
    "mb-4 flex items-center gap-2 text-lg font-bold text-[#10234F]";

  const th =
    "border-b border-[#E6EDF5] bg-[#F8FAFC] px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-[#10234F]";

  const td = "border-b border-[#EEF1F5] px-3 py-2 text-sm text-slate-700";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10234F]/65 p-2 backdrop-blur-sm sm:p-5 print:static print:block print:bg-white print:p-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-report-title"
        className="flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#E6EDF5] bg-[#FFFAF5] shadow-2xl print:max-h-none print:overflow-visible print:rounded-none print:border-0 print:shadow-none"
      >
        {/* Modal header */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E6EDF5] bg-white px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
              <Receipt size={21} />
            </div>
            <div className="min-w-0">
              <h2
                id="register-report-title"
                className="text-lg font-bold text-[#10234F] sm:text-xl"
              >
                Register Details
              </h2>
              <p className="mt-1 flex items-start gap-1.5 text-xs text-slate-500 sm:text-sm">
                <CalendarDays size={14} className="mt-0.5 shrink-0" />
                <span>{details.dateRange}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close register report"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#10234F] print:hidden"
          >
            <X size={20} />
          </button>
        </header>

        {/* Scrollable report content */}
        <main className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6 print:overflow-visible print:p-0">
          {/* Payment method breakdown */}
          <section className="rounded-xl border border-[#E6EDF5] bg-white p-3 sm:p-5">
            <div className="mb-3">
              <h3 className={sectionTitle}>Payment Method Breakdown</h3>
              <p className="text-sm text-slate-500">
                Sell and expense totals by payment method
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr>
                    <th className={th}>Payment Method</th>
                    <th className={th}>Sell</th>
                    <th className={th}>Expense</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((row) => (
                    <tr key={row.method} className="transition hover:bg-orange-50/40">
                      <td className={td}>{row.method}</td>
                      <td className={td}>{money(row.sell)}</td>
                      <td className={td}>{money(row.expense)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 border-t border-slate-300 pt-4">
              <div className="overflow-hidden rounded-lg border border-[#E6EDF5]">
                {summaryRows.map((row, index) => {
                  const tones = {
                    normal: "bg-white",
                    red: "bg-[#F4DEDE]",
                    green: "bg-[#E0F1D9]",
                  };

                  return (
                    <div
                      key={`${row.label}-${index}`}
                      className={`grid grid-cols-[1fr_auto] items-center gap-3 border-b border-white/80 px-3 py-2 last:border-b-0 sm:px-4 ${tones[row.tone]}`}
                    >
                      <span
                        className={`text-sm ${
                          row.tone === "normal"
                            ? "font-medium text-slate-600"
                            : "font-bold text-[#17212B]"
                        }`}
                      >
                        {row.label}
                      </span>
                      <span className="text-right text-sm font-bold text-[#17212B]">
                        {money(row.value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Products sold */}
          <section className="rounded-xl border border-[#E6EDF5] bg-white p-3 sm:p-5">
            <h3 className={sectionTitle}>Details of products sold</h3>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr>
                    <th className={th}>#</th>
                    <th className={th}>SKU/Code</th>
                    <th className={th}>Product</th>
                    <th className={th}>Quantity</th>
                    <th className={th}>Total amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.sku} className="hover:bg-orange-50/40">
                      <td className={td}>{index + 1}.</td>
                      <td className={td}>{product.sku}</td>
                      <td className={td}>{product.name}</td>
                      <td className={td}>{product.qty.toFixed(2)}</td>
                      <td className={td}>{money(product.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#E0F1D9]">
                    <td className={`${td} font-bold`} colSpan={3}>
                      Total
                    </td>
                    <td className={`${td} font-extrabold`}>64</td>
                    <td className={`${td} font-bold`}>
                      <div className="space-y-1">
                        <p>Order Tax: (+) {money(details.orderTax)}</p>
                        <p>Discount: (-) {money(details.discount)}</p>
                        <p>
                          Total Shipping Charges: (+){" "}
                          {money(details.shippingCharges)}
                        </p>
                        <p className="text-[#10234F]">
                          Grand Total: {money(details.grandTotal)}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Brand summary */}
          <section className="rounded-xl border border-[#E6EDF5] bg-white p-3 sm:p-5">
            <h3 className={sectionTitle}>
              Details of products sold (By Brand)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse">
                <thead>
                  <tr>
                    <th className={th}>#</th>
                    <th className={th}>Brands</th>
                    <th className={th}>Quantity</th>
                    <th className={th}>Total amount</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand, index) => (
                    <tr key={`${brand.name}-${index}`}>
                      <td className={td}>{index + 1}.</td>
                      <td className={td}>{brand.name || "—"}</td>
                      <td className={td}>{brand.qty.toFixed(2)}</td>
                      <td className={td}>{money(brand.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#E0F1D9]">
                    <td className={`${td} font-bold`}>#</td>
                    <td className={td}></td>
                    <td className={`${td} font-extrabold`}>64</td>
                    <td className={td}>
                      <div className="space-y-1 font-bold">
                        <p>Order Tax: (+) {money(details.orderTax)}</p>
                        <p>Discount: (-) {money(details.discount)}</p>
                        <p>
                          Total Shipping Charges: (+){" "}
                          {money(details.shippingCharges)}
                        </p>
                        <p>Grand Total: {money(details.grandTotal)}</p>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* User and business details */}
          <section className="grid grid-cols-1 gap-4 rounded-xl border border-[#E6EDF5] bg-white p-4 sm:grid-cols-3 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UserRound size={17} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </p>
                <p className="mt-1 text-sm font-semibold text-[#10234F]">
                  {details.user}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Mail size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </p>
                <p className="mt-1 break-all text-sm text-[#10234F]">
                  {details.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <MapPin size={17} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Business Location
                </p>
                <p className="mt-1 text-sm font-semibold text-[#10234F]">
                  {details.businessLocation}
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Actions */}
        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#E6EDF5] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-[#26313D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#17212B]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
          >
            <Printer size={17} />
            Print
          </button>
        </footer>
      </section>
    </div>
  );
}
