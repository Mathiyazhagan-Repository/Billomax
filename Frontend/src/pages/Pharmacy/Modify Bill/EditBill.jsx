
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Printer,
  Save,
  FileText,
  UserRound,
  Building2,
  CreditCard,
  Receipt,
  Package,
  MapPin,
  CalendarDays,
  Percent,
  Landmark,
  ChevronDown,
} from "lucide-react";

const initialBill = {
  invoiceNo: "0042",
  invoiceDate: "2026-10-28",
  businessName: "Pharmacy",
  address:
    "JP Nagar, Kumarswamy Layout, Bengaluru, Bengaluru, Karnataka, 591313, India",
  businessMobile: "7485968575",
  gstin: "29AACWC067A1ZB",
  customerName: "Walk-In Customer",
  customerMobile: "",
  customerGstin: "",
  shippingDetails: "",
  discountPercent: 1,
  gstRate: 10,
  paymentMethod: "Cash",
  paymentDate: "2026-10-28",
  amountPaid: 49,
  paymentNote: "",
  terms: `Goods once sold, cannot be taken back or exchanged in any circumstances.
We do not own any responsibility once the goods leaves out of our premises.
Firm does not hold any responsibility for any kind of damage or shortage of goods.
SUBJECT TO BANGALORE JURISDICTION.
This is Computer generated Invoice.`,
  accountNo: "502001057117061",
  ifsc: "HDFC0000103",
  bankName: "HDFC Bank",
  bankBranch: "Dommasandra",
};

const initialItems = [
  {
    id: 1,
    name: "Amoxicillin",
    hsn: "0050",
    quantity: 1,
    price: 22.5,
  },
  {
    id: 2,
    name: "Fluoxetine (Prozac)",
    hsn: "0041",
    quantity: 1,
    price: 22.5,
  },
];

const inputClass =
  "w-full rounded-lg border border-[#E3E8F1] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#93A0B5] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-[#52627D]";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function Field({ label, value, onChange, type = "text", placeholder = "", ...props }) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>{label}</span>
      <textarea
        className={`${inputClass} resize-y`}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SectionCard({ title, icon: Icon, description, children, className = "" }) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#E7EAF0] bg-white shadow-[0_4px_18px_rgba(16,35,79,0.045)] ${className}`}
    >
      <div className="flex items-start gap-3 border-b border-[#EEF0F4] px-5 py-4 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="font-bold text-[#10234F]">{title}</h2>
          {description && (
            <p className="mt-1 text-xs leading-5 text-[#75839B]">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function EditBill({ onBack }) {
  const [bill, setBill] = useState(initialBill);
  const [items, setItems] = useState(initialItems);
  const [savedMessage, setSavedMessage] = useState("");

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    window.history.back();
  };

  const updateBill = (key, value) => {
    setBill((current) => ({ ...current, [key]: value }));
    setSavedMessage("");
  };

  const updateItem = (id, key, value) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
    setSavedMessage("");
  };

  const totals = useMemo(() => {
    const subtotal = roundMoney(
      items.reduce(
        (sum, item) =>
          sum + Math.max(0, Number(item.quantity) || 0) *
            Math.max(0, Number(item.price) || 0),
        0
      )
    );
    const discount = roundMoney(
      subtotal * (Math.max(0, Number(bill.discountPercent) || 0) / 100)
    );
    const taxableAmount = roundMoney(subtotal - discount);
    const tax = roundMoney(
      taxableAmount * (Math.max(0, Number(bill.gstRate) || 0) / 100)
    );
    const total = roundMoney(taxableAmount + tax);
    const paid = Math.max(0, Number(bill.amountPaid) || 0);

    return {
      subtotal,
      discount,
      taxableAmount,
      tax,
      total,
      paid,
      balance: roundMoney(Math.max(0, total - paid)),
    };
  }, [items, bill.discountPercent, bill.gstRate, bill.amountPaid]);

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        name: "",
        hsn: "",
        quantity: 1,
        price: 0,
      },
    ]);
    setSavedMessage("");
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setSavedMessage("");
  };

  const handleSave = (event) => {
    event.preventDefault();

    // Connect this handler to your existing backend/API to persist changes.
    // No API endpoint was provided, so this component does not pretend to save.
    setSavedMessage(
      "Form validated. Connect handleSave to your bill update API to save changes."
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-3 py-5 text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Page heading */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7EAF0] bg-white text-[#52627D] transition hover:border-orange-200 hover:text-[#FF6814]"
              aria-label="Go back"
            >
              <ArrowLeft size={19} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Edit Bill
                </h1>
                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#D95A0B]">
                  Invoice
                </span>
              </div>
              <p className="mt-1 text-sm text-[#75839B]">
                Update invoice details, items, payment and tax information.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E0E5EE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52627D] transition hover:bg-[#F7F8FA]"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              type="submit"
              form="edit-bill-form"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:brightness-105"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Invoice status strip */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#F4D9C5] bg-[#FFF4EB] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9B694B]">
              Invoice number
            </p>
            <p className="mt-1 text-xl font-bold text-[#10234F]">
              #{bill.invoiceNo}
            </p>
          </div>
          <div className="rounded-xl border border-[#E7EAF0] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#75839B]">
              Invoice date
            </p>
            <p className="mt-1 text-lg font-bold">
              {bill.invoiceDate
                ? new Date(`${bill.invoiceDate}T00:00:00`).toLocaleDateString(
                    "en-GB"
                  )
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-[#D8EFE4] bg-[#F0FBF5] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#39845D]">
              Current invoice total
            </p>
            <p className="mt-1 text-xl font-bold text-[#147D4D]">
              {money(totals.total)}
            </p>
          </div>
        </div>

        <form id="edit-bill-form" onSubmit={handleSave} className="space-y-5">
          {/* Business details */}
          <SectionCard
            title="Business Details"
            icon={Building2}
            description="Business identity and contact information shown on the invoice."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Business name"
                value={bill.businessName}
                onChange={(v) => updateBill("businessName", v)}
                required
              />
              <Field
                label="Business mobile"
                value={bill.businessMobile}
                onChange={(v) => updateBill("businessMobile", v)}
              />
              <Field
                label="GSTIN"
                value={bill.gstin}
                onChange={(v) => updateBill("gstin", v)}
              />
              <div className="sm:col-span-2 lg:col-span-3">
                <TextAreaField
                  label="Business address"
                  value={bill.address}
                  onChange={(v) => updateBill("address", v)}
                  rows={2}
                />
              </div>
            </div>
          </SectionCard>

          {/* Invoice and customer */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <SectionCard
              title="Invoice Details"
              icon={FileText}
              description="Invoice number and billing date."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Invoice number"
                  value={bill.invoiceNo}
                  onChange={(v) => updateBill("invoiceNo", v)}
                  required
                />
                <Field
                  label="Invoice date"
                  type="date"
                  value={bill.invoiceDate}
                  onChange={(v) => updateBill("invoiceDate", v)}
                  required
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Customer Details"
              icon={UserRound}
              description="Customer information for this invoice."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Customer name"
                  value={bill.customerName}
                  onChange={(v) => updateBill("customerName", v)}
                  required
                />
                <Field
                  label="Customer mobile"
                  value={bill.customerMobile}
                  onChange={(v) => updateBill("customerMobile", v)}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Customer GSTIN"
                    value={bill.customerGstin}
                    onChange={(v) => updateBill("customerGstin", v)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextAreaField
                    label="Shipping details"
                    value={bill.shippingDetails}
                    onChange={(v) => updateBill("shippingDetails", v)}
                    rows={2}
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Products */}
          <SectionCard
            title="Products & Items"
            icon={Package}
            description="Edit medicine descriptions, HSN/SAC codes, quantities and unit prices."
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#75839B]">
                {items.length} line item{items.length === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-lg bg-[#FFF0E4] px-3.5 py-2 text-sm font-bold text-[#E65D0A] transition hover:bg-[#FFE4D0]"
              >
                <Plus size={16} />
                Add item
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E7EAF0]">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-[#F6F8FC] text-xs uppercase tracking-wide text-[#52627D]">
                  <tr>
                    <th className="px-4 py-3">Product / Description</th>
                    <th className="w-28 px-3 py-3">HSN/SAC</th>
                    <th className="w-24 px-3 py-3">Quantity</th>
                    <th className="w-36 px-3 py-3">Unit price (₹)</th>
                    <th className="w-36 px-3 py-3 text-right">Subtotal</th>
                    <th className="w-14 px-3 py-3 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const lineTotal = roundMoney(
                      (Number(item.quantity) || 0) * (Number(item.price) || 0)
                    );

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-[#EEF0F4] align-middle"
                      >
                        <td className="p-2.5">
                          <input
                            className={inputClass}
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
                            aria-label="Product description"
                            required
                          />
                        </td>
                        <td className="p-2">
                          <input
                            className={inputClass}
                            value={item.hsn}
                            onChange={(e) =>
                              updateItem(item.id, "hsn", e.target.value)
                            }
                            aria-label="HSN or SAC code"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            className={inputClass}
                            type="number"
                            min="0"
                            step="any"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", e.target.value)
                            }
                            aria-label="Quantity"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            className={inputClass}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(item.id, "price", e.target.value)
                            }
                            aria-label="Unit price"
                          />
                        </td>
                        <td className="px-3 py-3 text-right font-bold tabular-nums">
                          {money(lineTotal)}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-2 text-[#B45353] transition hover:bg-red-50"
                            aria-label={`Remove ${item.name || "item"}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-[#75839B]"
                      >
                        No items added. Select “Add item” to add a product.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Payment and summary */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.85fr]">
            <SectionCard
              title="Payment Details"
              icon={CreditCard}
              description="Payment method, date and amount received."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Payment method</span>
                  <div className="relative">
                    <select
                      className={`${inputClass} appearance-none pr-9`}
                      value={bill.paymentMethod}
                      onChange={(e) =>
                        updateBill("paymentMethod", e.target.value)
                      }
                    >
                      <option>Cash</option>
                      <option>Card</option>
                      <option>UPI</option>
                      <option>Bank Transfer</option>
                      <option>Cheque</option>
                      <option>Credit</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#75839B]"
                    />
                  </div>
                </label>
                <Field
                  label="Payment date"
                  type="date"
                  value={bill.paymentDate}
                  onChange={(v) => updateBill("paymentDate", v)}
                />
                <Field
                  label="Amount paid (₹)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={bill.amountPaid}
                  onChange={(v) => updateBill("amountPaid", v)}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Payment note"
                    value={bill.paymentNote}
                    onChange={(v) => updateBill("paymentNote", v)}
                    placeholder="Optional payment note"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Invoice Summary"
              icon={Receipt}
              description="Amounts update when you edit the items or tax settings."
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#75839B]">Subtotal</span>
                  <span className="font-semibold tabular-nums">
                    {money(totals.subtotal)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_100px] items-center gap-3">
                  <label className="text-sm text-[#75839B]">
                    Discount (%)
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={bill.discountPercent}
                    onChange={(e) =>
                      updateBill("discountPercent", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#75839B]">Discount amount</span>
                  <span className="font-semibold text-[#C45A32] tabular-nums">
                    − {money(totals.discount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-dashed border-[#E3E8F1] pt-3 text-sm">
                  <span className="text-[#75839B]">Taxable amount</span>
                  <span className="font-semibold tabular-nums">
                    {money(totals.taxableAmount)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_100px] items-center gap-3">
                  <label className="text-sm text-[#75839B]">GST (%)</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.01"
                    value={bill.gstRate}
                    onChange={(e) => updateBill("gstRate", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#75839B]">Tax (GST)</span>
                  <span className="font-semibold tabular-nums">
                    + {money(totals.tax)}
                  </span>
                </div>
                <div className="rounded-xl bg-[#10234F] p-4 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-white/80">
                      Total invoice
                    </span>
                    <span className="text-2xl font-bold tabular-nums">
                      {money(totals.total)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3 text-sm">
                    <span className="text-white/70">Total paid</span>
                    <span className="font-semibold tabular-nums">
                      {money(totals.paid)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-white/70">Balance due</span>
                    <span className="font-bold tabular-nums">
                      {money(totals.balance)}
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Terms and bank */}
          <SectionCard
            title="Terms & Conditions"
            icon={FileText}
            description="These terms appear at the bottom of the invoice."
          >
            <TextAreaField
              label="Terms and conditions"
              value={bill.terms}
              onChange={(v) => updateBill("terms", v)}
              rows={6}
            />
          </SectionCard>

          <SectionCard
            title="Bank Details"
            icon={Landmark}
            description="Bank information printed on the original invoice."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Account number"
                value={bill.accountNo}
                onChange={(v) => updateBill("accountNo", v)}
              />
              <Field
                label="IFSC code"
                value={bill.ifsc}
                onChange={(v) => updateBill("ifsc", v)}
              />
              <Field
                label="Bank name"
                value={bill.bankName}
                onChange={(v) => updateBill("bankName", v)}
              />
              <Field
                label="Bank branch"
                value={bill.bankBranch}
                onChange={(v) => updateBill("bankBranch", v)}
              />
            </div>
          </SectionCard>

          {/* Actions */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#E7EAF0] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="text-sm text-[#75839B]">
              <p className="font-semibold text-[#10234F]">
                Invoice #{bill.invoiceNo}
              </p>
              Review the changes before saving.
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-[#E0E5EE] px-4 py-2.5 text-sm font-semibold text-[#52627D] hover:bg-[#F7F8FA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E0E5EE] px-4 py-2.5 text-sm font-semibold text-[#52627D] hover:bg-[#F7F8FA]"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200/60 hover:brightness-105"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>

          {savedMessage && (
            <div
              role="status"
              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
            >
              {savedMessage}
            </div>
          )}
        </form>

        <footer className="mt-6 flex flex-col gap-2 border-t border-[#E7EAF0] py-5 text-xs text-[#8792A5] sm:flex-row sm:items-center sm:justify-between">
          <span>Billomax — Your Trusted Partner in Billing & Invoicing</span>
          <span>Invoice #{bill.invoiceNo}</span>
        </footer>
      </div>
    </div>
  );
}
