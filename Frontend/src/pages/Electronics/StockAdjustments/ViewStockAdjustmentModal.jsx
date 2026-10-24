
import React from "react";
import {
  X,
  Printer,
  CalendarDays,
  MapPin,
  FileText,
  Package,
  IndianRupee,
  UserRound,
  ClipboardList,
} from "lucide-react";

const read = (obj, ...keys) => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null) return value;
  }
  return "";
};

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const dateText = (value) => (value ? String(value) : "—");

const businessValue = (record) => {
  const business = read(record, "business", "location_details", "locationDetails");
  if (typeof business === "string") return business;
  return read(business, "name", "business_name", "businessName") ||
    read(record, "business_name", "businessName", "location", "location_name") ||
    "—";
};

const productName = (product) => {
  const name = read(product, "product_name", "productName", "name");
  const sku = read(product, "sku", "sub_sku", "sku_code", "product_code");
  if (name && sku && !String(name).toLowerCase().includes(String(sku).toLowerCase())) {
    return `${name} (${sku})`;
  }
  return name || sku || "—";
};

function InfoField({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#10234F]">
        {value === "" || value == null ? "—" : String(value)}
      </p>
    </div>
  );
}

function SectionHeading({ icon: Icon, children }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#10234F]">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-[#F07820]">
        <Icon size={16} />
      </span>
      {children}
    </h3>
  );
}

export default function ViewStockAdjustmentModal({
  open,
  adjustment,
  onClose,
  onPrint,
}) {
  if (!open || !adjustment) return null;

  const reference = read(
    adjustment,
    "referenceNo",
    "reference_no",
    "ref_no",
    "reference",
    "id"
  );
  const date = read(adjustment, "date", "transaction_date", "created_at");
  const type = read(adjustment, "adjustmentType", "adjustment_type", "type");
  const reason = read(adjustment, "reason", "note", "notes");
  const amount = read(adjustment, "totalAmount", "total_amount", "total");
  const recovered = read(
    adjustment,
    "totalAmountRecovered",
    "total_amount_recovered",
    "amount_recovered"
  );

  const business = read(adjustment, "business", "location_details", "locationDetails");
  const address =
    typeof business === "object"
      ? read(business, "address", "landmark", "city")
      : read(adjustment, "business_address", "address");
  const mobile =
    typeof business === "object"
      ? read(business, "mobile", "mobile_number", "phone")
      : read(adjustment, "mobile", "phone");
  const email =
    typeof business === "object"
      ? read(business, "email", "email_address")
      : read(adjustment, "email");
  const businessName = businessValue(adjustment);
  const addedBy = read(adjustment, "addedBy", "added_by", "createdBy", "created_by", "user");

  const products = read(
    adjustment,
    "products",
    "items",
    "adjustmentProducts",
    "adjustment_products",
    "stock_adjustment_lines"
  );
  const activities = read(adjustment, "activities", "activity_log", "logs");

  const handlePrint = () => {
    if (onPrint) onPrint(adjustment);
    else window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5 print:static print:bg-white print:p-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-adjustment-title"
        className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#FFFAF5] shadow-2xl print:max-h-none print:max-w-none print:overflow-visible print:rounded-none print:border-0 print:shadow-none"
      >
        {/* Modal header */}
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#F07820]">
              <ClipboardList size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-[#F07820]">
                Inventory
              </p>
              <h2
                id="stock-adjustment-title"
                className="text-lg font-bold text-[#10234F] sm:text-xl"
              >
                Stock Adjustment Details
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Reference No: <strong className="text-[#10234F]">#{reference || "—"}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 print:hidden"
          >
            <X size={20} />
          </button>
        </header>

        {/* Scrollable details */}
        <main className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-7 print:overflow-visible print:p-4">
          {/* Business and adjustment details */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="min-w-0">
              <SectionHeading icon={MapPin}>Business</SectionHeading>
              <div className="space-y-1 text-sm leading-5 text-slate-600">
                <p className="font-bold text-[#10234F]">{businessName}</p>
                {typeof business === "object" && (
                  <p className="font-medium text-[#10234F]">
                    {read(business, "business_name", "businessName")}
                  </p>
                )}
                {address && <p>{String(address)}</p>}
                {mobile && <p>Mobile: {String(mobile)}</p>}
                {email && <p className="break-all">Email: {String(email)}</p>}
                {typeof business === "object" &&
                  ["address_line_1", "address_line_2", "city", "state", "country"]
                    .map((key) => business[key])
                    .filter(Boolean)
                    .map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeading icon={FileText}>Adjustment information</SectionHeading>
              <InfoField label="Reference No" value={`#${reference || "—"}`} />
              <InfoField label="Date" value={dateText(date)} />
              <InfoField label="Adjustment type" value={type} />
              <InfoField label="Reason" value={reason} />
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDays size={16} />
                <span className="text-xs font-medium">Transaction date</span>
              </div>
              <p className="text-sm font-semibold text-[#10234F]">
                {dateText(date)}
              </p>
              {addedBy && (
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
                  <UserRound size={16} className="text-[#F07820]" />
                  <span>
                    Added by:{" "}
                    <strong className="text-[#10234F]">
                      {typeof addedBy === "object"
                        ? read(addedBy, "name", "username", "full_name") || "—"
                        : String(addedBy)}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Products table */}
          <section>
            <SectionHeading icon={Package}>Adjusted products</SectionHeading>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Quantity</th>
                    <th className="px-4 py-3 font-semibold">Unit Price</th>
                    <th className="px-4 py-3 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.isArray(products) && products.length > 0 ? (
                    products.map((product, index) => {
                      const quantity = read(
                        product,
                        "quantity",
                        "qty",
                        "adjusted_quantity"
                      );
                      const price = read(
                        product,
                        "unitPrice",
                        "unit_price",
                        "price"
                      );
                      const subtotal = read(
                        product,
                        "subtotal",
                        "line_total",
                        "total",
                        "amount"
                      );

                      return (
                        <tr
                          key={product.id || product._id || index}
                          className="odd:bg-white even:bg-[#F8FAFC]"
                        >
                          <td className="px-4 py-3 font-medium text-[#10234F]">
                            {productName(product)}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {quantity === "" ? "—" : String(quantity)}
                            {read(product, "unit_name", "unitName", "unit") &&
                              ` ${read(product, "unit_name", "unitName", "unit")}`}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {money(price)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#10234F]">
                            {money(subtotal)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        No product details are available in this record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Totals */}
          <section className="ml-auto w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-bold text-[#10234F]">
                Total Amount:
              </span>
              <span className="text-sm font-semibold text-[#10234F]">
                {money(amount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm font-bold text-[#10234F]">
                Total amount recovered:
              </span>
              <span className="text-sm font-semibold text-[#10234F]">
                {money(recovered)}
              </span>
            </div>
          </section>

          {/* Activity history */}
          {Array.isArray(activities) && (
            <section>
              <SectionHeading icon={ClipboardList}>Activities</SectionHeading>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-[#F4F6FA] text-[#10234F]">
                    <tr>
                      <th className="px-4 py-3 font-bold">Date</th>
                      <th className="px-4 py-3 font-bold">Action</th>
                      <th className="px-4 py-3 font-bold">By</th>
                      <th className="px-4 py-3 font-bold">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activities.length > 0 ? (
                      activities.map((activity, index) => (
                        <tr key={activity.id || activity._id || index}>
                          <td className="px-4 py-3 text-slate-600">
                            {read(activity, "date", "created_at", "timestamp") || "—"}
                          </td>
                          <td className="px-4 py-3 font-medium text-[#10234F]">
                            {read(activity, "action", "event") || "—"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {read(activity, "by", "user", "username", "created_by") || "—"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {read(activity, "note", "description", "details") || "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-5 text-center text-slate-500">
                          No activity history available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7 print:hidden">
          <p className="text-xs text-slate-500">
            Billomax · Stock Adjustments
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
            >
              <Printer size={16} /> Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#10234F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B376E]"
            >
              Close
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
