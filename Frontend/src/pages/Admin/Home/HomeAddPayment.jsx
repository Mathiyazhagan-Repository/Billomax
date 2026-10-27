
import React, { useState } from "react";
import {
  X,
  Building2,
  FileText,
  MapPin,
  Wallet,
  CalendarDays,
  Paperclip,
  IndianRupee,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const initialPayment = {
  paymentMethod: "Cash",
  paidOn: "2026-10-27T10:22",
  amount: "300.00",
  paymentNote: "",
  document: null,
};

const fieldClass =
  "w-full min-w-0 rounded-lg border border-[#E6DCCE] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA3B4] focus:border-[#FF6814] focus:ring-2 focus:ring-orange-100";

function SummaryCard({ label, children, icon: Icon }) {
  return (
    <div className="rounded-xl border border-[#E9E5DF] bg-[#FFFCF8] p-3">
      <div className="mb-2 flex items-center gap-2 text-[#FF6814]">
        <Icon size={16} />
        <span className="text-xs font-semibold text-[#66738C]">{label}</span>
      </div>
      <div className="text-sm leading-5 text-[#10234F]">{children}</div>
    </div>
  );
}

function Field({ label, required, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-[#10234F]">
        {label}
        {required && <span className="ml-1 text-[#FF6814]">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function HomeAddPayment({
  isOpen = true,
  onClose,
  onSave,
  paymentDetails = {},
}) {
  const [payment, setPayment] = useState({
    ...initialPayment,
    ...paymentDetails,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const supplier = paymentDetails.supplier ?? "Ravi";
  const referenceNo = paymentDetails.referenceNo ?? "PO2024/0004";
  const location = paymentDetails.location ?? "Pharmacy";
  const totalAmount = paymentDetails.totalAmount ?? "10,30,300.00";
  const paymentNote = paymentDetails.existingPaymentNote ?? "--";
  const advanceBalance = paymentDetails.advanceBalance ?? "0.00";

  const updateField = (name, value) => {
    setPayment((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      updateField("document", null);
      return;
    }

    const allowedExtensions = [
      "pdf", "csv", "zip", "doc", "docx", "jpeg", "jpg", "png",
    ];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setErrors((current) => ({
        ...current,
        document: "File type not supported. Please select an allowed file.",
      }));
      event.target.value = "";
      return;
    }

    updateField("document", file);
  };

  const validate = () => {
    const nextErrors = {};

    if (!payment.paymentMethod) {
      nextErrors.paymentMethod = "Select a payment method.";
    }

    if (!payment.paidOn) {
      nextErrors.paidOn = "Select the payment date.";
    }

    if (
      payment.amount === "" ||
      !Number.isFinite(Number(payment.amount)) ||
      Number(payment.amount) <= 0
    ) {
      nextErrors.amount = "Enter an amount greater than zero.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      ...payment,
      amount: Number(payment.amount),
      supplier,
      referenceNo,
      location,
      totalAmount,
      paymentNote,
    };

    if (!onSave) {
      console.info("Payment form payload:", payload);
      window.alert("Payment details validated. Connect onSave to persist this payment.");
      return;
    }

    try {
      setSaving(true);
      await onSave(payload);
      onClose?.();
    } catch (error) {
      setErrors((current) => ({
        ...current,
        submit: error?.message || "Unable to save payment. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10234F]/45 p-3 backdrop-blur-[2px] sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-payment-title"
    >
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E9E5DF] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEEAE4] bg-[#FFFCF8] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
              <Wallet size={20} />
            </div>
            <div>
              <h2
                id="add-payment-title"
                className="text-lg font-bold text-[#10234F]"
              >
                Add Payment
              </h2>
              <p className="text-xs text-[#73809A]">
                Record a supplier payment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment form"
            className="rounded-lg p-2 text-[#73809A] transition hover:bg-[#FFF0E4] hover:text-[#FF6814]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-180px)] space-y-5 overflow-y-auto p-5 sm:p-6">
            {/* Purchase details */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryCard label="Supplier" icon={Building2}>
                <p className="font-semibold">{supplier}</p>
                <p className="text-xs text-[#73809A]">Business</p>
              </SummaryCard>

              <SummaryCard label="Reference No." icon={FileText}>
                <p className="font-semibold">{referenceNo}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#73809A]">
                  <MapPin size={12} />
                  Location: {location}
                </p>
              </SummaryCard>

              <SummaryCard label="Total amount" icon={IndianRupee}>
                <p className="font-semibold">₹ {totalAmount}</p>
                <p className="mt-1 text-xs text-[#73809A]">
                  Payment Note: {paymentNote}
                </p>
              </SummaryCard>
            </div>

            {/* Balance */}
            <div className="flex items-center justify-between rounded-xl border border-[#F5D9C3] bg-[#FFFCF8] px-4 py-3">
              <span className="text-sm font-medium text-[#52617B]">
                Advance Balance
              </span>
              <span className="text-sm font-bold text-[#10234F]">
                ₹ {advanceBalance}
              </span>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Payment Method" required>
                <div className="relative">
                  <Wallet
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6814]"
                  />
                  <select
                    value={payment.paymentMethod}
                    onChange={(event) =>
                      updateField("paymentMethod", event.target.value)
                    }
                    className={`${fieldClass} pl-9 pr-8`}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-xs text-red-600">{errors.paymentMethod}</p>
                )}
              </Field>

              <Field label="Paid on" required>
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6814]"
                  />
                  <input
                    type="datetime-local"
                    value={payment.paidOn}
                    onChange={(event) => updateField("paidOn", event.target.value)}
                    className={`${fieldClass} pl-9`}
                  />
                </div>
                {errors.paidOn && (
                  <p className="mt-1 text-xs text-red-600">{errors.paidOn}</p>
                )}
              </Field>

              <Field label="Amount" required>
                <div className="relative">
                  <IndianRupee
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6814]"
                  />
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={payment.amount}
                    onChange={(event) => updateField("amount", event.target.value)}
                    className={`${fieldClass} pl-9`}
                    placeholder="300.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
                )}
              </Field>
            </div>

            {/* Attachment */}
            <Field label="Attach Document">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#E6DCCE] bg-[#FFFCF8] p-3 transition hover:border-[#FF6814] hover:bg-[#FFF7EF]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF0E4] text-[#FF6814]">
                  <Upload size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#10234F]">
                    {payment.document?.name || "Choose a document"}
                  </span>
                  <span className="mt-1 block text-xs text-[#8791A5]">
                    PDF, CSV, ZIP, DOC, DOCX, JPEG, JPG or PNG
                  </span>
                </span>
                <input
                  type="file"
                  accept=".pdf,.csv,.zip,.doc,.docx,.jpeg,.jpg,.png"
                  onChange={handleFile}
                  className="sr-only"
                />
                <Paperclip size={17} className="shrink-0 text-[#73809A]" />
              </label>
              <p className="mt-2 text-xs text-[#8791A5]">
                Allowed File: .pdf, .csv, .zip, .doc, .docx, .jpeg, .jpg, .png
              </p>
              {errors.document && (
                <p className="mt-1 text-xs text-red-600">{errors.document}</p>
              )}
            </Field>

            {/* Payment note */}
            <Field label="Payment Note">
              <textarea
                rows={4}
                value={payment.paymentNote}
                onChange={(event) => updateField("paymentNote", event.target.value)}
                className={`${fieldClass} resize-y`}
                placeholder="Add any notes about this payment..."
              />
            </Field>

            {errors.submit && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                {errors.submit}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex flex-col-reverse justify-end gap-2 border-t border-[#EEEAE4] bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E2DDD5] bg-white px-5 py-2.5 text-sm font-semibold text-[#52617B] transition hover:bg-[#F7F4EF]"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 size={16} />
              {saving ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
