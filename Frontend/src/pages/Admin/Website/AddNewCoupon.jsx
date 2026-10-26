
import React, { useState } from "react";
import {
  TicketPercent,
  CalendarDays,
  Percent,
  Package,
  Building2,
  CheckCircle2,
  Save,
  RotateCcw,
  Info,
  Tag,
  ArrowLeft,
} from "lucide-react";

const initialForm = {
  couponCode: "",
  discountType: "",
  discount: "",
  expiryDate: "",
  appliedPackages: "",
  appliedBusiness: "",
  isActive: true,
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#DCE5F0] bg-white px-3 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA8B9] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-2 block text-xs font-bold text-[#263B60]";

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  required = false,
  hint,
  children,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="flex min-w-0 overflow-hidden rounded-xl border border-[#DCE5F0] bg-white transition focus-within:border-[#FF812B] focus-within:ring-2 focus-within:ring-orange-100">
        {Icon && (
          <span className="flex w-11 shrink-0 items-center justify-center border-r border-[#E5EBF3] bg-[#F8FAFD] text-[#71839B]">
            <Icon size={16} />
          </span>
        )}

        {children || (
          <input
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            required={required}
            min={type === "number" ? 0 : undefined}
            step={type === "number" ? "any" : undefined}
            className="h-11 min-w-0 w-full bg-transparent px-3 text-sm text-[#10234F] outline-none placeholder:text-[#9AA8B9]"
          />
        )}
      </div>

      {hint && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-[#71839B]">
          <Info size={13} className="mt-0.5 shrink-0 text-[#20B8D3]" />
          {hint}
        </p>
      )}
    </div>
  );
}

export default function AddNewCoupon({ onBack, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  };

  const handleReset = () => {
    setForm(initialForm);
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!form.couponCode.trim()) {
      setMessageType("error");
      setMessage("Please enter a coupon code.");
      return;
    }

    if (!form.discountType) {
      setMessageType("error");
      setMessage("Please select a discount type.");
      return;
    }

    if (form.discount === "" || !Number.isFinite(Number(form.discount))) {
      setMessageType("error");
      setMessage("Please enter a valid discount amount.");
      return;
    }

    if (Number(form.discount) <= 0) {
      setMessageType("error");
      setMessage("Discount must be greater than zero.");
      return;
    }

    if (
      form.discountType === "percentage" &&
      Number(form.discount) > 100
    ) {
      setMessageType("error");
      setMessage("Percentage discount cannot exceed 100%.");
      return;
    }

    if (
      form.expiryDate &&
      form.expiryDate < new Date().toLocaleDateString("en-CA")
    ) {
      setMessageType("error");
      setMessage("Expiry date cannot be in the past.");
      return;
    }

    const payload = {
      couponCode: form.couponCode.trim(),
      discountType: form.discountType,
      discount: Number(form.discount),
      expiryDate: form.expiryDate || null,
      appliedPackages: form.appliedPackages,
      appliedBusiness: form.appliedBusiness,
      isActive: form.isActive,
    };

    onSave?.(payload);

    setMessageType("success");
    setMessage(
      onSave
        ? "Coupon added successfully."
        : "Validation successful. Connect your coupon-creation API to save this coupon."
    );
  };

  return (
    <main className="min-h-0 flex-1 bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1200px]">
        {/* Page heading */}
        <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F47721]">
              <span className="h-2 w-2 rounded-full bg-[#FF812B]" />
              Superadmin Portal
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
                Add New Coupon
              </h1>
              <span className="text-sm text-[#71839B]">
                Create and manage discount coupons
              </span>
            </div>

            <p className="mt-1.5 text-sm leading-6 text-[#71839B]">
              Configure coupon discounts, expiry dates, package access, and
              business applicability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-xl border border-[#F2E8DE] bg-white px-3 py-2 text-xs font-bold text-[#19366F] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
              >
                <ArrowLeft size={15} />
                Back to Coupons
              </button>
            )}
            <div className="flex items-center gap-2 rounded-xl border border-[#F4D9C4] bg-[#FFF0E4] px-3 py-2 text-xs font-semibold text-[#B95A1B]">
              <TicketPercent size={16} />
              Coupon Configuration
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-[0_5px_20px_rgba(16,35,79,0.035)] sm:p-6 lg:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-[#EDF1F6] pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
                <TicketPercent size={20} />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-[#10234F]">
                  Coupon Details
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#8290A4]">
                  Fields marked with * are required.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              {/* Coupon code */}
              <div className="md:col-span-2">
                <FormField
                  label="Coupon code"
                  name="couponCode"
                  value={form.couponCode}
                  onChange={handleChange}
                  placeholder="Enter coupon code"
                  icon={Tag}
                  required
                />
              </div>

              {/* Discount type */}
              <FormField
                label="Discount type"
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                icon={TicketPercent}
                required
              >
                <select
                  id="discountType"
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  required
                  className="h-11 min-w-0 w-full bg-white px-3 text-sm text-[#10234F] outline-none"
                >
                  <option value="">Please Select</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </FormField>

              {/* Discount */}
              <FormField
                label="Discount"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="Enter discount"
                icon={Percent}
                type="number"
                required
              />

              {/* Expiry date */}
              <FormField
                label="Expiry date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                icon={CalendarDays}
                type="date"
              />

              {/* Applied packages */}
              <div className="md:col-span-2">
                <FormField
                  label="Applied on packages"
                  name="appliedPackages"
                  value={form.appliedPackages}
                  onChange={handleChange}
                  placeholder="Enter or select package IDs"
                  icon={Package}
                  hint="If no packages are selected it can be applied to all"
                />
              </div>

              {/* Applied business */}
              <div className="md:col-span-2">
                <FormField
                  label="Applied on business"
                  name="appliedBusiness"
                  value={form.appliedBusiness}
                  onChange={handleChange}
                  placeholder="Enter or select business IDs"
                  icon={Building2}
                  hint="If no business is selected it can be applied to all"
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="mt-6 rounded-xl border border-[#E5EBF3] bg-[#FCFDFE] p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 cursor-pointer accent-[#FF6814]"
                />
                <span className="flex items-center gap-2 text-sm font-semibold text-[#263B60]">
                  <CheckCircle2
                    size={17}
                    className={
                      form.isActive ? "text-emerald-500" : "text-[#9AA8B9]"
                    }
                  />
                  Is active
                </span>
                <span
                  className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                    form.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {form.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </label>
            </div>
          </section>

          {/* Coupon preview */}
          <section className="rounded-2xl border border-[#F4D9C4] bg-gradient-to-r from-white via-white to-[#FFF2E7] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
                  <TicketPercent size={19} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#71839B]">
                    Coupon Preview
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-[#10234F]">
                    {form.couponCode.trim() || "YOUR-COUPON-CODE"}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-xl font-extrabold text-[#FF6814]">
                  {form.discount !== "" && Number(form.discount) > 0
                    ? form.discountType === "percentage"
                      ? `${form.discount}% OFF`
                      : form.discountType === "fixed"
                        ? `₹${Number(form.discount).toLocaleString("en-IN")} OFF`
                        : "Discount type not selected"
                    : "Discount not set"}
                </p>
                <p className="mt-1 text-xs text-[#8290A4]">
                  {form.expiryDate
                    ? `Expires ${form.expiryDate}`
                    : "No expiry date selected"}
                </p>
              </div>
            </div>
          </section>

          {message && (
            <div
              role={messageType === "error" ? "alert" : "status"}
              className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {messageType === "error" ? (
                <Info size={17} className="mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              )}
              {message}
            </div>
          )}

          {/* Actions */}
          <section className="rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs leading-5 text-[#8290A4]">
                Check the coupon details before submitting.
              </p>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DCE5F0] bg-white px-5 text-sm font-bold text-[#526984] transition hover:bg-slate-50"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-7 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Save size={16} />
                  Submit Coupon
                </button>
              </div>
            </div>
          </section>
        </form>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#E5EBF3] py-4 text-center text-[11px] text-[#8290A4] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span>Superadmin Portal · Coupons</span>
        </footer>
      </div>
    </main>
  );
}
