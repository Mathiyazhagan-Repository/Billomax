import React, { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  FileText,
  ShoppingBag,
  Printer,
  Download,
  ReceiptText,
  CheckCircle2,
} from "lucide-react";

const initialItems = [
  { sno: 1, description: "Paneer Butter Masala", qty: 1, rate: 160.0 },
  { sno: 2, description: "Green Garden Salad", qty: 1, rate: 90.0 },
];

const money = (value) =>
  value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function TableOccupied({
  table,
  bill,
  onBack,
  onEditOrder,
}) {
  const [items] = useState(() =>
    bill
      ? (bill.items || []).map((item, index) => ({
          sno: index + 1,
          description: item.description || item.name,
          qty: Number(item.qty ?? item.quantity) || 1,
          rate: Number(item.rate ?? item.price) || 0,
        }))
      : initialItems
  );
  const tableName = bill?.table || table?.name || "Table 1";
  const billNo = bill?.billNo || "BILL-0020";
  const steward = bill?.steward || "FFF";
  const paidAmount = Number(bill?.paid) || 0;
  const billStatus = bill?.status;
  const billPaymentMode = bill?.paymentMode;

  const [showCheckout, setShowCheckout] = useState(false);
  const [showOnlineOrders, setShowOnlineOrders] = useState(false);
  const [notice, setNotice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customerPaid, setCustomerPaid] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  const itemTotal = items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0
  );
  const hasCashierBill = Boolean(bill);
  const totalAmount = hasCashierBill ? Number(bill.amount) || 0 : itemTotal;
  const serviceCharge = hasCashierBill ? 0 : 25;
  const stateGST = hasCashierBill ? 0 : 6.25;
  const centralGST = hasCashierBill ? 0 : 6.25;
  const netAmount = hasCashierBill
    ? Number(bill.amount) || 0
    : totalAmount + serviceCharge + stateGST + centralGST;
  const amountToSettle = hasCashierBill
    ? Math.max(0, netAmount - paidAmount)
    : Number(table?.amount) || netAmount;
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const settleBill = () => {
    const paidAmount = Number(customerPaid);

    if (customerPaid === "" || !Number.isFinite(paidAmount) || paidAmount <= 0) {
      setCheckoutError("Enter the amount received from the customer.");
      return;
    }

    if (paymentMethod !== "Part Payment" && paidAmount < amountToSettle) {
      setCheckoutError(
        "Customer payment is less than the amount due. Select Part Payment to record a partial settlement."
      );
      return;
    }

    setCheckoutError("");
    setShowCheckout(false);
    setNotice(
      `${paymentMethod} settlement recorded: ₹${money(paidAmount)} received for ₹${money(amountToSettle)}.`
    );
  };

  const handleDownload = () => {
    const bill = [
      "Restaurant",
      "JP Nagar, Kumaraswamy Layout, Bengaluru, Karnataka - 591313",
      "Ph: 8574857896",
      "GSTIN: 29AACCV6067A1ZB",
      "",
      `Bill No: ${billNo}`,
      "Date: 24-10-26",
      "Time: 10:18",
      `Steward: ${steward}`,
      `Table No: ${tableName}`,
      "Covers: 1",
      "",
      "SNO,DESCRIPTION,QTY,RATE,AMOUNT",
      ...items.map(
        (item) =>
          `${item.sno},"${item.description}",${item.qty},${money(
            item.rate
          )},${money(item.qty * item.rate)}`
      ),
      "",
      `Total Amount,${money(totalAmount)}`,
      ...(hasCashierBill
        ? [`Paid Amount,${money(paidAmount)}`, `Status,${billStatus}`]
        : [
            `SERC @ 10%,${money(serviceCharge)}`,
            `State GST @ 2.5%,${money(stateGST)}`,
            `Central GST @ 2.5%,${money(centralGST)}`,
          ]),
      `Net Amount,${money(netAmount)}`,
      "",
      `Total Items: ${totalItems}`,
      "Thank You — Visit Again!",
    ].join("\n");

    const blob = new Blob([bill], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${billNo}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] font-sans text-[#10234F]">
      {/* Top navigation */}
      <header className="sticky top-0 z-20 border-b border-[#E8EDF4] bg-white/95 px-4 py-3 backdrop-blur print:hidden sm:px-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onBack) {
                  onBack();
                  return;
                }

                window.history.back();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              <ArrowLeft size={15} />
              Back
            </button>

            <button
              type="button"
              onClick={() => {
                if (onEditOrder) {
                  onEditOrder({
                    table: tableName,
                    billNo,
                    steward,
                    covers: 1,
                    items: items.map((item) => ({
                      name: item.description,
                      quantity: item.qty,
                      price: item.rate,
                    })),
                  });
                  return;
                }

                setNotice("Connect your edit-order screen here.");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-semibold text-[#60728D] transition hover:bg-slate-50"
            >
              <Pencil size={14} />
              Edit Order
            </button>
          </div>

          <h1 className="hidden text-lg font-black text-[#10234F] sm:block">
            Cart
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Bill details"
              onClick={() => setNotice(`Current bill: ${billNo}`)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-blue-600 hover:bg-blue-50"
            >
              <FileText size={17} />
            </button>

            <button
              type="button"
              onClick={() => setShowOnlineOrders((value) => !value)}
              className="rounded-lg bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md"
            >
              Online Orders
            </button>
          </div>
        </div>
      </header>

      {/* Main bill */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.08)] print:max-w-none print:border-0 print:shadow-none">
          <div className="p-5 sm:p-8">
            {/* Restaurant details */}
            <div className="border-b border-dashed border-[#DDE4EE] pb-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6814] print:hidden">
                <ReceiptText size={25} />
              </div>

              <h2 className="text-xl font-black tracking-tight">
                Restaurant
              </h2>
              <p className="mt-2 text-xs leading-5 text-[#718096]">
                JP Nagar, Kumaraswamy Layout, Bengaluru, Karnataka - 591313
                <br />
                Ph: 8574857896
                <br />
                GSTIN: 29AACCV6067A1ZB
              </p>
            </div>

            {/* Bill metadata */}
            <div className="grid grid-cols-2 gap-4 py-5 text-xs">
              <div className="space-y-2">
                <p>
                  <span className="font-bold">Bill No:</span> {billNo}
                </p>
                <p>
                  <span className="font-bold">Date:</span> 24-10-26
                </p>
                <p>
                  <span className="font-bold">Time:</span> 10:18
                </p>
              </div>

              <div className="space-y-2 text-right">
                <p>
                  <span className="font-bold">Stw:</span> {steward}
                </p>
                <p>
                  <span className="font-bold">Table No:</span> {tableName}
                </p>
                <p>
                  <span className="font-bold">Covers:</span> 1
                </p>
                {hasCashierBill && (
                  <>
                    <p>
                      <span className="font-bold">Status:</span> {billStatus}
                    </p>
                    <p>
                      <span className="font-bold">Payment:</span>{" "}
                      {billPaymentMode}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Items table */}
            <div className="overflow-x-auto rounded-xl border border-[#E8EDF4]">
              <table className="w-full min-w-[440px] text-left text-xs">
                <thead>
                  <tr className="bg-[#F5F8FC] text-[#60728D]">
                    <th className="px-3 py-3 text-center font-extrabold">SNO</th>
                    <th className="px-3 py-3 font-extrabold">DESCRIPTION</th>
                    <th className="px-3 py-3 text-center font-extrabold">QTY</th>
                    <th className="px-3 py-3 text-right font-extrabold">RATE</th>
                    <th className="px-3 py-3 text-right font-extrabold">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.sno}
                      className="border-t border-[#EEF1F5] transition hover:bg-orange-50/40"
                    >
                      <td className="px-3 py-3 text-center">{item.sno}</td>
                      <td className="px-3 py-3 font-semibold">
                        {item.description}
                      </td>
                      <td className="px-3 py-3 text-center">{item.qty}</td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {money(item.rate)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {money(item.qty * item.rate)}
                      </td>
                    </tr>
                  ))}
                  {hasCashierBill && items.length === 0 && (
                    <tr className="border-t border-[#EEF1F5]">
                      <td
                        colSpan={5}
                        className="px-3 py-5 text-center text-[#8491A5]"
                      >
                        Item details are not available for this bill.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bill totals */}
            <div className="mt-5 space-y-3 border-b border-dashed border-[#DDE4EE] pb-5 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-[#60728D]">Total Amount</span>
                <span className="font-semibold tabular-nums">
                  {money(totalAmount)}
                </span>
              </div>

              {!hasCashierBill && (
                <>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#60728D]">SERC @ 10%</span>
                    <span className="tabular-nums">{money(serviceCharge)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#60728D]">State GST @ 2.5%</span>
                    <span className="tabular-nums">{money(stateGST)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#60728D]">Central GST @ 2.5%</span>
                    <span className="tabular-nums">{money(centralGST)}</span>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between gap-4 border-t border-[#EEF1F5] pt-4 text-base">
                <span className="font-black">Net Amount</span>
                <span className="font-black text-[#FF6814] tabular-nums">
                  ₹{money(netAmount)}
                </span>
              </div>
              {hasCashierBill && (
                <>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#60728D]">Paid Amount</span>
                    <span className="tabular-nums">{money(paidAmount)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#60728D]">Balance Due</span>
                    <span className="font-bold tabular-nums">
                      {money(amountToSettle)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="py-5 text-center text-xs text-[#718096]">
              <p>
                Total Items:{" "}
                <span className="font-bold text-[#10234F]">{totalItems}</span>
              </p>
              <p className="mt-3 font-semibold">Thank You — Visit Again!</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 print:hidden">
              <button
                type="button"
                onClick={() => setShowCheckout(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <ShoppingBag size={16} />
                Proceed to Checkout
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              >
                <Download size={16} />
                Save & Download Bill
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10234F] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1B376C]"
              >
                <Printer size={16} />
                Thermal Print
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Checkout dialog */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/50 p-4 print:hidden">
          <form
            className="w-full max-w-sm rounded-2xl border border-[#F0E4D8] bg-white p-5 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault();
              settleBill();
            }}
          >
            <h2 className="text-base font-extrabold text-[#10234F]">
              Settle &amp; Save
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {["Cash", "Card", "Others", "Part Payment"].map((method) => (
                <button
                  key={method}
                  type="button"
                  aria-pressed={paymentMethod === method}
                  onClick={() => {
                    setPaymentMethod(method);
                    setCheckoutError("");
                  }}
                  className={`h-9 rounded-lg border text-xs font-medium transition ${
                    paymentMethod === method
                      ? "border-[#FF6814] bg-[#FF6814] text-white shadow-sm"
                      : "border-[#F0E4D8] bg-white text-[#60728D] hover:bg-[#FFFAF5]"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-xs font-bold text-[#33445F]">
              Amount to be settled
              <input
                type="text"
                readOnly
                value={money(amountToSettle)}
                className="mt-2 h-[30px] w-full rounded-lg border border-[#F0E4D8] bg-[#FFFAF5] px-3 text-xs font-semibold text-[#10234F] outline-none"
              />
            </label>

            <label className="mt-3 block text-xs font-bold text-[#33445F]">
              Customer Paid
              <input
                autoFocus
                type="number"
                min="0.01"
                step="0.01"
                value={customerPaid}
                onChange={(event) => {
                  setCustomerPaid(event.target.value);
                  setCheckoutError("");
                }}
                placeholder="Enter amount paid"
                className="mt-2 h-[34px] w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs font-normal text-[#10234F] outline-none placeholder:text-[#9AA7B8] focus:border-[#FF9B5B] focus:ring-2 focus:ring-orange-100"
              />
            </label>

            {checkoutError && (
              <p role="alert" className="mt-3 text-xs text-red-600">
                {checkoutError}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCheckoutError("");
                  setShowCheckout(false);
                }}
                className="rounded-lg border border-[#F0E4D8] px-4 py-2 text-xs font-bold text-[#60728D] transition hover:bg-[#FFFAF5]"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:shadow-md"
              >
                SETTLE &amp; SAVE
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Online orders panel */}
      {showOnlineOrders && (
        <div className="fixed inset-0 z-40 flex justify-end bg-[#10234F]/30 print:hidden">
          <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Online Orders</h2>
              <button
                type="button"
                onClick={() => setShowOnlineOrders(false)}
                className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-[#DDE4EE] p-8 text-center">
              <ShoppingBag className="mx-auto text-[#FF6814]" size={30} />
              <p className="mt-3 font-bold">Online order list</p>
              <p className="mt-1 text-sm text-[#8491A5]">
                Connect your order API to display incoming online orders here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {notice && (
        <div className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-xl border border-blue-100 bg-white p-4 shadow-xl print:hidden">
          <CheckCircle2 className="mt-0.5 shrink-0 text-blue-600" size={18} />
          <p className="text-sm text-[#10234F]">{notice}</p>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="ml-2 text-[#8491A5] hover:text-[#10234F]"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 4mm;
          }
          body {
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          section,
          section * {
            visibility: visible;
          }
          section {
            position: absolute;
            inset: 0 auto auto 0;
            width: 100%;
            max-width: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </main>
  );
}