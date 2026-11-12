
import React, { useState } from "react";
import {
  UserRound,
  Building2,
  ContactRound,
  Smartphone,
  Phone,
  Mail,
  BriefcaseBusiness,
  ChevronDown,
  Save,
  X,
  Info,
  MapPin,
  FileText,
  CreditCard,
  Globe,
  RotateCcw,
} from "lucide-react";

const initialForm = {
  contactType: "Suppliers",
  contactCategory: "Individual",
  contactId: "",
  mobile: "",
  alternateContactNumber: "",
  landline: "",
  email: "",
  assignedTo: "",
  prefix: "",
  firstName: "",
  middleName: "",
  lastName: "",
  businessName: "",
  taxNumber: "",
  openingBalance: "",
  payTerm: "",
  payTermPeriod: "Days",
  creditLimit: "",
  dateOfBirth: "",
  gender: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  shippingAddress: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-[#E6DCCE] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#A0A8B7] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-[#354563]";

function Field({
  label,
  icon: Icon,
  children,
  hint,
  className = "",
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
          />
        )}
        {children}
      </div>
      {hint && (
        <p className="mt-1 text-[11px] text-[#8791A5]">{hint}</p>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#10234F]">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-[#8791A5]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AddSuppliers({
  onSave,
  onClose,
  onBack,
  assignedUsers = [],
  initialValues = {},
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...initialValues,
  }));
  const [showMore, setShowMore] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (
      form.contactId.trim() &&
      !/^[a-zA-Z0-9_-]+$/.test(form.contactId.trim())
    ) {
      nextErrors.contactId =
        "Use letters, numbers, hyphens, or underscores.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    if (!onSave) {
      window.alert(
        "Form validated. Connect onSave to your existing backend to save this contact."
      );
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...form,
        contactId: form.contactId.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ ...initialForm, ...initialValues });
    setErrors({});
    setShowMore(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-3 inline-flex items-center gap-2 rounded-lg border border-[#F2E8DE] bg-white px-3 py-2 text-xs font-semibold text-[#19366F] transition hover:bg-[#FFF1E5]"
            >
              Back to Suppliers
            </button>
          )}
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#FF6814]">
            Contact Management
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
            {form.contactType === "Customers"
              ? "Add a New Customer"
              : "Add a New Contact"}
          </h1>
          <p className="mt-1 text-sm text-[#8791A5]">
            Create a supplier or business contact and manage their details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#E8E5DF] bg-white shadow-[0_5px_24px_rgba(16,35,79,0.05)]"
        >
          <div className="h-1.5 bg-gradient-to-r from-[#FF6814] to-[#FFB16D]" />

          {/* Primary contact information */}
          <div className="p-5 sm:p-7">
            <SectionTitle
              icon={ContactRound}
              title="Contact Information"
              description="Enter the essential contact details below."
            />

            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-6">
              {/* Contact type */}
              <Field
                label="Contact type *"
                icon={UserRound}
                className="md:col-span-2"
              >
                <select
                  name="contactType"
                  value={form.contactType}
                  onChange={updateField}
                  className={`${inputClass} pl-9`}
                  required
                >
                  <option value="Suppliers">Suppliers</option>
                  <option value="Customers">Customers</option>
                  <option value="Both">Both (Customer and Supplier)</option>
                </select>
              </Field>

              {/* Individual / Business */}
              <div className="flex flex-col justify-end gap-3 pb-2 md:col-span-2">
                <span className={labelClass}>Contact category</span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#52617B]">
                    <input
                      type="radio"
                      name="contactCategory"
                      value="Individual"
                      checked={form.contactCategory === "Individual"}
                      onChange={updateField}
                      className="accent-[#FF6814]"
                    />
                    Individual
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#52617B]">
                    <input
                      type="radio"
                      name="contactCategory"
                      value="Business"
                      checked={form.contactCategory === "Business"}
                      onChange={updateField}
                      className="accent-[#FF6814]"
                    />
                    Business
                  </label>
                </div>
              </div>

              {/* Contact ID */}
              <Field
                label="Contact ID"
                icon={CreditCard}
                hint="Leave empty to autogenerate"
                className="md:col-span-2"
              >
                <input
                  name="contactId"
                  value={form.contactId}
                  onChange={updateField}
                  placeholder="Contact ID"
                  className={`${inputClass} pl-9`}
                  aria-invalid={Boolean(errors.contactId)}
                />
                {errors.contactId && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.contactId}
                  </p>
                )}
              </Field>

              {/* Mobile */}
              <Field
                label="Mobile *"
                icon={Smartphone}
                className="md:col-span-1"
              >
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={updateField}
                  placeholder="Mobile"
                  className={`${inputClass} pl-9`}
                  required
                  aria-invalid={Boolean(errors.mobile)}
                />
                {errors.mobile && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.mobile}
                  </p>
                )}
              </Field>

              {/* Alternate contact */}
              <Field
                label="Alternate contact number"
                icon={Phone}
                className="md:col-span-2"
              >
                <input
                  type="tel"
                  name="alternateContactNumber"
                  value={form.alternateContactNumber}
                  onChange={updateField}
                  placeholder="Alternate contact number"
                  className={`${inputClass} pl-9`}
                />
              </Field>

              {/* Landline */}
              <Field
                label="Landline"
                icon={Phone}
                className="md:col-span-1"
              >
                <input
                  type="tel"
                  name="landline"
                  value={form.landline}
                  onChange={updateField}
                  placeholder="Landline"
                  className={`${inputClass} pl-9`}
                />
              </Field>

              {/* Email */}
              <Field
                label="Email"
                icon={Mail}
                className="md:col-span-2"
              >
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="Email"
                  className={`${inputClass} pl-9`}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </Field>

              {/* Assigned to */}
              <Field
                label="Assigned to"
                icon={BriefcaseBusiness}
                className="md:col-span-3"
              >
                {assignedUsers.length > 0 ? (
                  <select
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={updateField}
                    className={`${inputClass} pl-9`}
                  >
                    <option value="">Select user</option>
                    {assignedUsers.map((user) => (
                      <option
                        key={user.id ?? user.value}
                        value={user.id ?? user.value}
                      >
                        {user.name ?? user.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={updateField}
                    placeholder="Assigned to"
                    className={`${inputClass} pl-9`}
                  />
                )}
              </Field>
            </div>

            {/* Expand details */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowMore((previous) => !previous)}
                aria-expanded={showMore}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
              >
                {showMore ? "Hide Informations" : "More Informations"}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showMore ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Additional contact details */}
          {showMore && (
            <div className="border-t border-[#F0E9E0] bg-[#FFFCF8] p-5 sm:p-7">
              <SectionTitle
                icon={Info}
                title="More Informations"
                description="Optional details for contact records."
              />

              {form.contactCategory === "Individual" ? (
                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field label="Prefix">
                    <select
                      name="prefix"
                      value={form.prefix}
                      onChange={updateField}
                      className={inputClass}
                    >
                      <option value="">Please select</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </Field>

                  <Field label="First Name">
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={updateField}
                      placeholder="First Name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Middle Name">
                    <input
                      name="middleName"
                      value={form.middleName}
                      onChange={updateField}
                      placeholder="Middle Name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Last Name">
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={updateField}
                      placeholder="Last Name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Date of Birth">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={updateField}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Gender">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={updateField}
                      className={inputClass}
                    >
                      <option value="">Please select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </Field>
                </div>
              ) : (
                <div className="mb-5">
                  <Field
                    label="Business Name"
                    icon={Building2}
                  >
                    <input
                      name="businessName"
                      value={form.businessName}
                      onChange={updateField}
                      placeholder="Business Name"
                      className={`${inputClass} pl-9`}
                    />
                  </Field>
                </div>
              )}

              <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field label="Tax Number">
                  <input
                    name="taxNumber"
                    value={form.taxNumber}
                    onChange={updateField}
                    placeholder="Tax / GST Number"
                    className={inputClass}
                  />
                </Field>

                <Field label="Opening Balance">
                  <input
                    type="number"
                    name="openingBalance"
                    value={form.openingBalance}
                    onChange={updateField}
                    placeholder="0.00"
                    step="0.01"
                    className={inputClass}
                  />
                </Field>

                <Field label="Credit Limit">
                  <input
                    type="number"
                    name="creditLimit"
                    value={form.creditLimit}
                    onChange={updateField}
                    placeholder="Credit Limit"
                    min="0"
                    step="0.01"
                    className={inputClass}
                  />
                </Field>

                <Field label="Pay Term">
                  <input
                    type="number"
                    name="payTerm"
                    value={form.payTerm}
                    onChange={updateField}
                    placeholder="Payment term"
                    min="0"
                    className={inputClass}
                  />
                </Field>

                <Field label="Pay Term Period">
                  <select
                    name="payTermPeriod"
                    value={form.payTermPeriod}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="Days">Days</option>
                    <option value="Months">Months</option>
                  </select>
                </Field>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Address Line 1" icon={MapPin}>
                  <input
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={updateField}
                    placeholder="Address Line 1"
                    className={`${inputClass} pl-9`}
                  />
                </Field>

                <Field label="Address Line 2" icon={MapPin}>
                  <input
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={updateField}
                    placeholder="Address Line 2"
                    className={`${inputClass} pl-9`}
                  />
                </Field>

                <Field label="City">
                  <input
                    name="city"
                    value={form.city}
                    onChange={updateField}
                    placeholder="City"
                    className={inputClass}
                  />
                </Field>

                <Field label="State">
                  <input
                    name="state"
                    value={form.state}
                    onChange={updateField}
                    placeholder="State"
                    className={inputClass}
                  />
                </Field>

                <Field label="Country" icon={Globe}>
                  <input
                    name="country"
                    value={form.country}
                    onChange={updateField}
                    placeholder="Country"
                    className={`${inputClass} pl-9`}
                  />
                </Field>

                <Field label="Postal Code">
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={updateField}
                    placeholder="Postal Code"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Shipping Address" icon={MapPin}>
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={updateField}
                  placeholder="Shipping Address"
                  rows={2}
                  className={`${inputClass} resize-y pl-9`}
                />
              </Field>

              <div className="mt-5">
                <Field label="Notes" icon={FileText}>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={updateField}
                    placeholder="Additional notes"
                    rows={3}
                    className={`${inputClass} resize-y pl-9`}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#F0E9E0] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E6DCCE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52617B] transition hover:bg-[#FFF5EB]"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              {(onClose || onBack) && (
                <button
                  type="button"
                  onClick={onBack || onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E6DCCE] bg-white px-5 py-2.5 text-sm font-semibold text-[#52617B] transition hover:bg-[#F8F5F0]"
                >
                  <X size={15} />
                  {onBack ? "Back to Suppliers" : "Close"}
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Contact"}
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-5 border-t border-[#E8E5DF] py-4 text-center text-xs text-[#8791A5]">
          Billomax — Your Trusted Partner in Billing & Invoicing
        </footer>
      </div>
    </div>
  );
}
