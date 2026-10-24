
import React, { useState } from "react";
import {
  MapPin,
  Building2,
  CreditCard,
  FileText,
  Info,
  Package,
  Save,
  X,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

const initialForm = {
  name: "",
  locationId: "",
  landmark: "",
  city: "",
  zipCode: "",
  state: "",
  country: "",
  mobile: "",
  alternateContactNumber: "",
  email: "",
  website: "",
  gstin: "",
  stateCode: "",
  bankAccountNo: "",
  ifscCode: "",
  bankName: "",
  branch: "",
  termsConditions: "",
  invoiceSchemePOS: "",
  invoiceSchemeSale: "",
  invoiceLayoutPOS: "",
  invoiceLayoutSale: "",
  defaultSellingPriceGroup: "",
  customField1: "",
  customField2: "",
  customField3: "",
  customField4: "",
  featuredProducts: "",
};

const paymentMethods = [
  "Cash",
  "Card",
  "Cheque",
  "Bank Transfer",
  "Other",
  "Custom Payment 1",
  "Custom Payment 2",
  "Custom Payment 3",
  "Custom Payment 4",
  "Custom Payment 5",
  "Custom Payment 6",
  "Custom Payment 7",
];

const initialPaymentOptions = paymentMethods.reduce((result, method) => {
  result[method] = true;
  return result;
}, {});

const inputClass =
  "w-full rounded-lg border border-[#DCE3EC] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-[#10234F]";

function Field({ label, required, hint, children, className = "" }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className={labelClass}>
        {label}
        {required && <span className="ml-1 text-orange-600">*</span>}
        {hint && (
          <span title={hint} className="ml-1 inline-flex align-middle text-cyan-500">
            <Info size={14} />
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}) {
  return (
    <Field label={label} required={required}>
      <input
        className={inputClass}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
      />
    </Field>
  );
}

function SelectInput({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  hint,
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <div className="relative">
        <select
          className={`${inputClass} appearance-none pr-9`}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">Please Select</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </Field>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
        <Icon size={19} />
      </div>
      <div>
        <h3 className="text-base font-bold text-[#10234F]">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function AddBusinessLocation({
  onSave,
  onClose,
  initialData,
  title = "Add a New Business Location",
  submitLabel = "Save Location",
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...(initialData ?? {}),
  }));
  const [paymentOptions, setPaymentOptions] = useState(() => ({
    ...initialPaymentOptions,
    ...(initialData?.paymentOptions ?? {}),
  }));
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));

    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: "" }));
    }

    setSaved(false);
  };

  const handlePaymentChange = (method) => {
    setPaymentOptions((previous) => ({
      ...previous,
      [method]: !previous[method],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = {
      name: "Name",
      city: "City",
      zipCode: "Zip Code",
      state: "State",
      country: "Country",
    };

    const nextErrors = {};

    Object.entries(requiredFields).forEach(([key, label]) => {
      if (!String(form[key] || "").trim()) {
        nextErrors[key] = `${label} is required`;
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = {
      ...form,
      paymentOptions: { ...paymentOptions },
    };

    if (onSave) {
      onSave(payload);
    }

    setSaved(true);
  };

  const fieldError = (name) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
    ) : null;

  const locationFields = [
    { label: "Name", name: "name", required: true },
    { label: "Location ID", name: "locationId" },
    { label: "Landmark", name: "landmark" },
    { label: "City", name: "city", required: true },
    { label: "Zip Code", name: "zipCode", required: true },
    { label: "State", name: "state", required: true },
    { label: "Country", name: "country", required: true },
    { label: "Mobile", name: "mobile", type: "tel" },
    {
      label: "Alternate contact number",
      name: "alternateContactNumber",
      type: "tel",
    },
    { label: "Email", name: "email", type: "email" },
    { label: "Website", name: "website", type: "url" },
    { label: "GSTIN", name: "gstin" },
    { label: "State Code", name: "stateCode", placeholder: "State Code (e.g. 29)" },
    { label: "Bank Account No", name: "bankAccountNo" },
    { label: "IFSC Code", name: "ifscCode" },
    { label: "Bank Name", name: "bankName" },
    { label: "Branch", name: "branch" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFAF5] p-3 sm:p-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_12px_35px_rgba(16,35,79,0.08)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#EEF1F5] bg-gradient-to-r from-[#FFF7EF] to-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6814] to-[#FF812B] text-white shadow-sm">
              <MapPin size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#10234F]">
                {title}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                Configure location details, invoice settings and payment methods.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-[#10234F]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8 p-5 sm:p-7">
            {/* Business location details */}
            <section>
              <SectionHeader
                icon={Building2}
                title="Business Location Details"
                description="Enter the business address and contact information."
              />

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                {locationFields.map((field) => (
                  <div key={field.name}>
                    <TextInput
                      {...field}
                      value={form[field.name]}
                      onChange={handleChange}
                    />
                    {fieldError(field.name)}
                  </div>
                ))}

                <Field label="Terms & Conditions" className="md:col-span-2">
                  <textarea
                    name="termsConditions"
                    value={form.termsConditions}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter terms and conditions"
                    className={`${inputClass} resize-y`}
                  />
                </Field>
              </div>
            </section>

            {/* Invoice configuration */}
            <section className="border-t border-[#EEF1F5] pt-7">
              <SectionHeader
                icon={FileText}
                title="Invoice & Pricing Settings"
                description="Select the invoice schemes, layouts and default selling price group for this location."
              />

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <SelectInput
                  label="Invoice scheme for POS:"
                  name="invoiceSchemePOS"
                  value={form.invoiceSchemePOS}
                  onChange={handleChange}
                  required
                  hint="Invoice numbering scheme used for POS sales."
                  options={["Default", "Location", "Yearly", "Monthly"]}
                />

                <SelectInput
                  label="Invoice scheme for sale:"
                  name="invoiceSchemeSale"
                  value={form.invoiceSchemeSale}
                  onChange={handleChange}
                  required
                  options={["Default", "Location", "Yearly", "Monthly"]}
                />

                <SelectInput
                  label="Invoice layout for POS:"
                  name="invoiceLayoutPOS"
                  value={form.invoiceLayoutPOS}
                  onChange={handleChange}
                  hint="Controls the invoice layout used at POS."
                  options={["Default", "Standard", "Compact"]}
                />

                <SelectInput
                  label="Invoice layout for sale:"
                  name="invoiceLayoutSale"
                  value={form.invoiceLayoutSale}
                  onChange={handleChange}
                  required
                  hint="Controls the invoice layout used for sales."
                  options={["Default", "Standard", "Compact"]}
                />

                <SelectInput
                  label="Default Selling Price Group:"
                  name="defaultSellingPriceGroup"
                  value={form.defaultSellingPriceGroup}
                  onChange={handleChange}
                  hint="Default price group applied at this location."
                  options={["Default Selling Price", "Retail", "Wholesale"]}
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((number) => (
                  <TextInput
                    key={number}
                    label={`Custom field ${number}:`}
                    name={`customField${number}`}
                    value={form[`customField${number}`]}
                    onChange={handleChange}
                    placeholder={`Custom field ${number}`}
                  />
                ))}
              </div>
            </section>

            {/* POS featured products */}
            <section className="border-t border-[#EEF1F5] pt-7">
              <SectionHeader
                icon={Package}
                title="POS Screen Featured Products"
                description="Enter the product identifiers to feature on the POS screen."
              />

              <Field
                label="POS screen Featured Products:"
                hint="Enter product names or SKUs separated by commas."
              >
                <input
                  className={inputClass}
                  name="featuredProducts"
                  value={form.featuredProducts}
                  onChange={handleChange}
                  placeholder="Enter product names or SKUs, separated by commas"
                />
              </Field>
            </section>

            {/* Payment methods */}
            <section className="border-t border-[#EEF1F5] pt-7">
              <SectionHeader
                icon={CreditCard}
                title="Payment Options"
                description="Choose which payment methods are available at this business location."
              />

              <div className="overflow-hidden rounded-xl border border-[#E6EDF5]">
                <div className="grid grid-cols-[1fr_100px] bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#10234F] sm:grid-cols-[1fr_160px]">
                  <span>Payment Method</span>
                  <span className="text-center">Enable</span>
                </div>

                {paymentMethods.map((method, index) => (
                  <div
                    key={method}
                    className={`grid grid-cols-[1fr_100px] items-center border-t border-[#EEF1F5] px-4 py-2.5 sm:grid-cols-[1fr_160px] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#FAFCFE]"
                    }`}
                  >
                    <span className="text-sm text-slate-700">{method}</span>
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={Boolean(paymentOptions[method])}
                        onChange={() => handlePaymentChange(method)}
                        aria-label={`Enable ${method}`}
                        className="h-4 w-4 cursor-pointer accent-[#FF6814]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {saved && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 size={18} />
                Location details validated. Connect the save handler to persist these settings.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#EEF1F5] bg-[#FCFCFD] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE3EC] bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <X size={16} />
              Close
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#E95A0B] hover:to-[#F46B19] focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <Save size={16} />
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
