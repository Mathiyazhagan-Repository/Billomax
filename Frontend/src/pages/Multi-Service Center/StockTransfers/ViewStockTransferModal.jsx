
import React from "react";
import { X, Printer, MapPin, CalendarDays, ArrowLeftRight, Package, FileText, History } from "lucide-react";

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const money = (value) =>
  `₹ ${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";
  if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-GB");
};

const getLocation = (transfer, side, suppliedDetails) => {
  const isFrom = side === "from";
  const location = suppliedDetails || (
    isFrom
      ? transfer.locationFromDetails || transfer.fromLocationDetails || transfer.location_from_details
      : transfer.locationToDetails || transfer.toLocationDetails || transfer.location_to_details
  ) || {};

  return {
    name: firstValue(
      location.name,
      location.businessName,
      location.business_location_name,
      isFrom ? transfer.locationFrom : transfer.locationTo,
      isFrom ? transfer.location_from : transfer.location_to,
      isFrom ? transfer.from_location : transfer.to_location,
      isFrom ? transfer.fromLocation : transfer.toLocation
    ),
    address: firstValue(location.address, location.fullAddress, location.addressLine),
    city: firstValue(location.city, location.town),
    state: location.state,
    country: location.country,
    mobile: firstValue(location.mobile, location.phone, location.mobileNumber),
    email: location.email,
  };
};

function SectionTitle({ icon: Icon, children, trailing }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
          <Icon size={18} />
        </span>
        <h3 className="text-sm font-bold text-[#10234F]">{children}</h3>
      </div>
      {trailing}
    </div>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      <div className="break-words text-sm font-semibold text-[#10234F]">
        {children || "—"}
      </div>
    </div>
  );
}

function LocationCard({ title, details, iconColor }) {
  return (
    <section className="rounded-xl border border-[#E6EAF0] bg-[#FCFCFD] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconColor}`}>
          <MapPin size={17} />
        </span>
        <h3 className="text-sm font-bold text-[#10234F]">{title}</h3>
      </div>

      <p className="text-sm font-bold text-[#10234F]">{details.name || "—"}</p>

      {[details.address, details.city, details.state, details.country]
        .filter(Boolean)
        .map((line, index) => (
          <p key={`${line}-${index}`} className="mt-1 text-xs leading-5 text-slate-600">
            {line}
          </p>
        ))}

      {details.mobile && (
        <p className="mt-2 break-words text-xs text-slate-600">
          <span className="font-semibold">Mobile:</span> {details.mobile}
        </p>
      )}
      {details.email && (
        <p className="mt-1 break-words text-xs text-slate-600">
          <span className="font-semibold">Email:</span> {details.email}
        </p>
      )}
    </section>
  );
}

function Status({ value }) {
  const status = value || "—";
  const normalized = String(status).toLowerCase();
  const color =
    ["completed", "received"].includes(normalized)
      ? "bg-emerald-50 text-emerald-700"
      : normalized === "cancelled"
      ? "bg-rose-50 text-rose-700"
      : "bg-cyan-50 text-cyan-700";

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${color}`}>
      {status}
    </span>
  );
}

export default function ViewStockTransferModal({
  open,
  transfer,
  onClose,
  onPrint,
  fromLocationDetails,
  toLocationDetails,
  activities: activitiesProp,
}) {
  if (!open) return null;

  const record = transfer || {};

  const from = getLocation(record, "from", fromLocationDetails);
  const to = getLocation(record, "to", toLocationDetails);

  const reference = firstValue(
    record.referenceNo,
    record.reference_no,
    record.refNo,
    record.ref_no,
    record.reference,
    record.id
  );

  const date = firstValue(record.date, record.transferDate, record.transfer_date);
  const status = firstValue(record.status, record.transferStatus, record.transfer_status);

  const products = firstValue(
    record.items,
    record.products,
    record.stockTransferProducts,
    record.stock_transfer_products,
    record.transferItems,
    record.transfer_items,
    []
  );

  const shipping = Number(firstValue(
    record.shippingCharges,
    record.shipping_charges,
    record.additionalShippingCharges,
    record.additional_shipping_charges,
    0
  ));

  const productSubtotal = products.reduce((sum, item) => {
    const quantity = Number(firstValue(item.quantity, item.qty, 0));
    const unitPrice = Number(firstValue(item.unitPrice, item.unit_price, item.price, 0));
    const subtotal = firstValue(item.subtotal, item.lineTotal, item.line_total);
    return sum + Number(subtotal ?? quantity * unitPrice);
  }, 0);

  const netTotal = Number(firstValue(
    record.netTotalAmount,
    record.net_total_amount,
    record.subtotal,
    record.netTotal,
    record.net_total,
    productSubtotal
  ));

  const total = Number(firstValue(
    record.totalAmount,
    record.total_amount,
    record.purchaseTotal,
    record.purchase_total,
    record.grandTotal,
    record.grand_total,
    netTotal + shipping
  ));

  const notes = firstValue(
    record.additionalNotes,
    record.additional_notes,
    record.notes,
    record.note,
    ""
  );

  const activities = firstValue(
    activitiesProp,
    record.activities,
    record.activityHistory,
    record.activity_history,
    record.stockTransferActivities,
    record.stock_transfer_activities,
    []
  );

  const handlePrint = () => {
    if (onPrint) onPrint(record);
    else window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-[2px] sm:p-6 print:static print:block print:bg-white print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-transfer-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="my-auto flex max-h-[95vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl border border-white bg-white shadow-2xl print:my-0 print:max-h-none print:max-w-none print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-[#E8EDF3] px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20] sm:flex">
              <ArrowLeftRight size={20} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E86A20]">
                Inventory management
              </p>
              <h2 id="stock-transfer-title" className="mt-1 text-base font-bold text-[#10234F] sm:text-lg">
                Stock Transfer Details{" "}
                <span className="font-medium text-slate-500">
                  (Reference No: #{reference ?? "—"})
                </span>
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 print:hidden"
          >
            <X size={20} />
          </button>
        </header>

        <main className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 print:overflow-visible">
          {/* Locations and transfer metadata */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <LocationCard
              title="Location (From)"
              details={from}
              iconColor="bg-sky-50 text-sky-700"
            />
            <LocationCard
              title="Location (To)"
              details={to}
              iconColor="bg-emerald-50 text-emerald-700"
            />
            <section className="rounded-xl border border-[#E6EAF0] bg-[#FCFCFD] p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[#E86A20]">
                  <FileText size={17} />
                </span>
                <h3 className="text-sm font-bold text-[#10234F]">Transfer information</h3>
              </div>
              <div className="space-y-4">
                <InfoBlock label="Reference No.">#{reference ?? "—"}</InfoBlock>
                <InfoBlock label="Date">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} className="text-slate-400" />
                    {date ? `${formatDate(date)}${String(date).match(/\d{1,2}:\d{2}/) ? "" : ""}` : "—"}
                  </span>
                </InfoBlock>
                <InfoBlock label="Status"><Status value={status} /></InfoBlock>
              </div>
            </section>
          </div>

          {/* Products */}
          <section>
            <SectionTitle
              icon={Package}
              trailing={
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#E86A20]">
                  {products.length} {products.length === 1 ? "item" : "items"}
                </span>
              }
            >
              Transferred products
            </SectionTitle>

            <div className="overflow-x-auto rounded-xl border border-[#E6EAF0]">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="bg-emerald-500 text-xs font-bold text-white">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF0F5]">
                  {products.map((item, index) => {
                    const quantity = Number(firstValue(item.quantity, item.qty, 0));
                    const price = Number(firstValue(item.unitPrice, item.unit_price, item.price, 0));
                    const subtotal = Number(firstValue(
                      item.subtotal,
                      item.lineTotal,
                      item.line_total,
                      quantity * price
                    ));

                    return (
                      <tr key={item.id ?? item._id ?? index} className={index % 2 ? "bg-[#FCFCFD]" : "bg-[#F1F3F7]"}>
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#10234F]">
                            {firstValue(item.name, item.productName, item.product_name, item.product, item.product_name_with_sku, "—")}
                          </p>
                          {(item.sku || item.code) && (
                            <p className="mt-1 text-xs text-slate-500">{item.sku || item.code}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {quantity.toFixed(2)}{" "}
                          {firstValue(item.unit, item.unitName, item.unit_name, "")}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{money(price)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#10234F]">
                          {money(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No product records were returned. Check the stock-transfer details response.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Totals: same three rows as the reference */}
          <div className="flex justify-end">
            <div className="w-full overflow-hidden rounded-xl border border-[#E6EAF0] sm:max-w-[570px]">
              <div className="flex items-center justify-between gap-4 border-b border-[#EDF0F5] px-4 py-3">
                <span className="text-sm font-bold text-[#10234F]">Net Total Amount:</span>
                <span className="text-sm font-medium text-[#10234F]">{money(netTotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#EDF0F5] px-4 py-3">
                <span className="text-sm font-bold text-[#10234F]">Additional Shipping charges:</span>
                <span className="flex items-center gap-5 text-sm font-medium text-[#10234F]">
                  <span className="text-xs font-bold text-slate-500">{shipping >= 0 ? "(+)" : "(-)"}</span>
                  {money(Math.abs(shipping))}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 bg-orange-50/70 px-4 py-3">
                <span className="text-sm font-extrabold text-[#10234F]">Purchase Total:</span>
                <span className="text-sm font-extrabold text-[#E86A20]">{money(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <section>
            <SectionTitle icon={FileText}>Additional Notes</SectionTitle>
            <div className="min-h-10 whitespace-pre-wrap rounded-xl border border-[#E6EAF0] bg-[#F1F3F7] px-4 py-3 text-sm text-slate-700">
              {notes || "—"}
            </div>
          </section>

          {/* Activities */}
          <section>
            <SectionTitle
              icon={History}
              trailing={
                <span className="text-xs text-slate-500">
                  {activities.length} {activities.length === 1 ? "record" : "records"}
                </span>
              }
            >
              Activities
            </SectionTitle>

            <div className="overflow-x-auto rounded-xl border border-[#E6EAF0]">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E6EAF0] bg-[#F8FAFC] text-xs font-bold uppercase tracking-wide text-slate-600">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">By</th>
                    <th className="px-4 py-3">Note</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF0F5]">
                  {activities.map((activity, index) => (
                    <tr key={activity.id ?? activity._id ?? index} className="hover:bg-orange-50/30">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {firstValue(activity.date, activity.createdAt, activity.created_at, "—")}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#10234F]">
                        {firstValue(activity.action, activity.type, "—")}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {firstValue(activity.by, activity.user, activity.username, activity.createdBy, activity.created_by, "—")}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {firstValue(activity.note, activity.description, "—")}
                      </td>
                      <td className="px-4 py-3">
                        {firstValue(activity.status, activity.newStatus) ? (
                          <Status value={firstValue(activity.status, activity.newStatus)} />
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-7 text-center text-slate-500">
                        No activity records were returned. Check the stock-transfer details response.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="flex flex-col-reverse gap-3 border-t border-[#E8EDF3] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-[#DFE5EE] px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
          >
            <Printer size={17} />
            Print
          </button>
        </footer>
      </div>
    </div>
  );
}


