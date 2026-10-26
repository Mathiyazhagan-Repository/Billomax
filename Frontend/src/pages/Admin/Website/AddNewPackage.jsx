
import React, { useState } from "react";
import {
  Package,
  CreditCard,
  Info,
  CalendarDays,
  Users,
  Boxes,
  FileText,
  IndianRupee,
  Clock3,
  ArrowDownUp,
  ShieldCheck,
  Link2,
  Star,
  Building2,
  CheckCircle2,
  Save,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  locations: "0",
  activeUsers: "0",
  products: "0",
  invoices: "0",
  priceInterval: "",
  interval: "",
  trialDays: "0",
  price: "0",
  sortOrder: "1",
  privateSuperadmin: false,
  oneTimeSubscription: false,
  customSubscriptionLink: false,
  isActive: true,
  isPopular: false,
  onlyForBusinesses: "",
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#DCE5F0] bg-white px-3 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA8B9] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-1.5 block text-xs font-bold text-[#263B60]";

function Field({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  icon: Icon,
  type = "text",
  hint,
  required = false,
  min,
  step,
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

        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
          className="h-11 min-w-0 w-full bg-transparent px-3 text-sm text-[#10234F] outline-none placeholder:text-[#9AA8B9]"
        />
      </div>

      {hint && <p className="mt-1.5 text-xs text-[#8290A4]">{hint}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  icon: Icon,
  required = false,
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

        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="h-11 min-w-0 w-full bg-white px-3 text-sm text-[#10234F] outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Section({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-[0_5px_20px_rgba(16,35,79,0.035)] sm:p-6">
      <div className="mb-5 flex items-center gap-3 border-b border-[#EDF1F6] pb-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
          <Icon size={19} />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-[#10234F]">{title}</h2>
          {description && (
            <p className="mt-1 text-xs leading-5 text-[#8290A4]">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function ToggleOption({ label, name, checked, onChange, icon: Icon, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5EBF3] bg-[#FCFDFE] p-3.5 transition hover:border-[#F5C7A6] hover:bg-[#FFFAF5]">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#FF6814]"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-semibold text-[#263B60]">
          {Icon && <Icon size={15} className="text-[#8290A4]" />}
          {label}
        </span>
        {hint && (
          <span className="mt-1 block text-xs leading-5 text-[#8290A4]">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

export default function AddNewPackage({
  onBack,
  initialData,
  isEditing = false,
  onSave,
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...initialData,
  }));
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
    setForm({ ...initialForm, ...initialData });
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    const numericFields = [
      ["locations", "Number of Locations"],
      ["activeUsers", "Number of active users"],
      ["products", "Number of products"],
      ["invoices", "Number of Invoices"],
      ["trialDays", "Trial Days"],
      ["price", "Price"],
      ["sortOrder", "Sort Order"],
    ];

    for (const [key, label] of numericFields) {
      const value = Number(form[key]);

      if (!Number.isFinite(value) || value < 0) {
        setMessageType("error");
        setMessage(`${label} must be a valid non-negative number.`);
        return;
      }
    }

    if (!form.name.trim()) {
      setMessageType("error");
      setMessage("Please enter a package name.");
      return;
    }

    if (Number(form.price) > 0 && (!form.priceInterval || !form.interval)) {
      setMessageType("error");
      setMessage(
        "Select the Price Interval and enter the Interval for a paid package."
      );
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      locations: Number(form.locations),
      activeUsers: Number(form.activeUsers),
      products: Number(form.products),
      invoices: Number(form.invoices),
      trialDays: Number(form.trialDays),
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
    };

    onSave?.(payload);

    setMessageType("success");
    setMessage(
      isEditing
        ? "Package details updated."
        : "Validation successful. Connect your package-creation API to save this package."
    );
  };

  const priceIntervalOptions = [
    { value: "", label: "Please Select" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
    { value: "years", label: "Years" },
  ];

  const priceNumber = Number(form.price) || 0;

  return (
    <main className="min-h-0 flex-1 bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1400px]">
        {/* Page heading */}
        <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F47721]">
              <span className="h-2 w-2 rounded-full bg-[#FF812B]" />
              Superadmin Portal
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
                Packages
              </h1>
              <span className="text-sm font-medium text-[#71839B]">
                {isEditing ? "Edit Package" : "Add New Package"}
              </span>
            </div>

            <p className="mt-1.5 text-sm leading-6 text-[#71839B]">
              Configure package limits, subscription pricing, trial access, and
              availability.
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
                Back to Packages
              </button>
            )}
            <div className="flex items-center gap-2 rounded-xl border border-[#F4D9C4] bg-[#FFF0E4] px-3 py-2 text-xs font-semibold text-[#B95A1B]">
              <Package size={16} />
              Package Configuration
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Package details */}
          <Section
            title="Package Details"
            description="Define the package name, description, usage limits, and subscription pricing."
            icon={Package}
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <Field
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter package name"
                icon={Package}
                required
              />

              <Field
                label="Package Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter package description"
                icon={FileText}
              />

              <Field
                label="Number of Locations"
                name="locations"
                value={form.locations}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                icon={Building2}
                hint="0 = infinite"
              />

              <Field
                label="Number of active users"
                name="activeUsers"
                value={form.activeUsers}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                icon={Users}
                hint="0 = infinite"
              />

              <Field
                label="Number of products"
                name="products"
                value={form.products}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                icon={Boxes}
                hint="0 = infinite"
              />

              <Field
                label="Number of Invoices"
                name="invoices"
                value={form.invoices}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                icon={FileText}
                hint="0 = infinite"
              />

              <SelectField
                label="Price Interval"
                name="priceInterval"
                value={form.priceInterval}
                onChange={handleChange}
                options={priceIntervalOptions}
                icon={CalendarDays}
              />

              <Field
                label="Interval"
                name="interval"
                value={form.interval}
                onChange={handleChange}
                placeholder="Enter interval"
                icon={Clock3}
                type="number"
                min="1"
                step="1"
              />

              <Field
                label="Trial Days"
                name="trialDays"
                value={form.trialDays}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                icon={CalendarDays}
              />

              <div>
                <Field
                  label="Price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="0.01"
                  icon={IndianRupee}
                />
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8290A4]">
                  <Info size={14} className="text-[#20B8D3]" />
                  0 = Free Package
                </p>
              </div>

              <Field
                label="Sort Order"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                icon={ArrowDownUp}
              />
            </div>
          </Section>

          {/* Package settings */}
          <Section
            title="Package Settings"
            description="Control package visibility, subscription behavior, and business availability."
            icon={ShieldCheck}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <ToggleOption
                label="Private Superadmin only"
                name="privateSuperadmin"
                checked={form.privateSuperadmin}
                onChange={handleChange}
                icon={ShieldCheck}
                hint="Restrict this package to superadmin use."
              />

              <ToggleOption
                label="One time only subscription"
                name="oneTimeSubscription"
                checked={form.oneTimeSubscription}
                onChange={handleChange}
                icon={CreditCard}
                hint="Make the subscription a one-time purchase."
              />

              <ToggleOption
                label="Enable custom subscription link"
                name="customSubscriptionLink"
                checked={form.customSubscriptionLink}
                onChange={handleChange}
                icon={Link2}
                hint="Allow a custom subscription link."
              />

              <ToggleOption
                label="Is active"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                icon={CheckCircle2}
                hint="Enable or disable this package."
              />

              <ToggleOption
                label="Mark Package as Popular"
                name="isPopular"
                checked={form.isPopular}
                onChange={handleChange}
                icon={Star}
                hint="Highlight this package as a popular choice."
              />

              <div className="rounded-xl border border-[#E5EBF3] bg-[#FCFDFE] p-3.5">
                <Field
                  label="Only for Businesses"
                  name="onlyForBusinesses"
                  value={form.onlyForBusinesses}
                  onChange={handleChange}
                  placeholder="Enter business restriction"
                  icon={Building2}
                />
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8290A4]">
                  <Info size={13} className="shrink-0 text-[#20B8D3]" />
                  Leave empty if there is no business restriction.
                </p>
              </div>
            </div>
          </Section>

          {/* Price summary */}
          <section className="overflow-hidden rounded-2xl border border-[#F4D9C4] bg-gradient-to-r from-white via-white to-[#FFF2E7] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
                  <IndianRupee size={21} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#71839B]">
                    Package Price Preview
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#10234F]">
                    {priceNumber === 0
                      ? "Free Package"
                      : `${form.priceInterval || "Interval not selected"} subscription`}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-2xl font-extrabold tabular-nums text-[#FF6814]">
                  ₹
                  {priceNumber.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="mt-1 text-xs text-[#8290A4]">
                  {priceNumber === 0
                    ? "No package price"
                    : `Interval: ${form.interval || "Not entered"} ${
                        form.priceInterval || ""
                      }`}
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

          {/* Form actions */}
          <div className="rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs leading-5 text-[#8290A4]">
                Review the package limits and subscription settings before
                saving.
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
                  {isEditing ? "Update Package" : "Save Package"}
                </button>
              </div>
            </div>
          </div>
        </form>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#E5EBF3] py-4 text-center text-[11px] text-[#8290A4] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span>Superadmin Portal · Packages</span>
        </footer>
      </div>
    </main>
  );
}
