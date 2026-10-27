
import React, { useState } from "react";
import {
  X,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Percent,
  Save,
  RotateCcw,
} from "lucide-react";

const initialForm = {
  prefix: "",
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  address: "",
  salesCommissionPercentage: "",
};

const inputClass =
  "w-full rounded-xl border border-[#E6DCCE] bg-white px-3.5 py-2.5 text-sm text-[#10234F] placeholder:text-[#A0A8B7] outline-none transition focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-[#354563]";

function FormField({ label, icon: Icon, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default function AddSalesCommissionAgents({
  onSave,
  onClose,
  onBack,
  initialValues = {},
  isEditing = false,
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...initialValues,
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.salesCommissionPercentage !== "") {
      const percentage = Number(form.salesCommissionPercentage);

      if (
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 100
      ) {
        nextErrors.salesCommissionPercentage =
          "Enter a percentage between 0 and 100.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    if (!onSave) {
      window.alert(
        "Form validated. Connect the onSave prop to save the agent to your backend."
      );
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...initialValues,
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        contactNumber: form.contactNumber.trim(),
        address: form.address.trim(),
        salesCommissionPercentage:
          form.salesCommissionPercentage === ""
            ? ""
            : Number(form.salesCommissionPercentage),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({ ...initialForm, ...initialValues });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <div className="mb-5">
          {(onBack || onClose) && (
            <button
              type="button"
              onClick={onBack || onClose}
              className="mb-3 inline-flex items-center gap-2 rounded-lg border border-[#F2E8DE] bg-white px-3 py-2 text-xs font-semibold text-[#19366F] transition hover:bg-[#FFF1E5]"
            >
              <X size={14} />
              Back to Sales Commission Agents
            </button>
          )}
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#FF6814]">
            Team Management
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#10234F]">
            {isEditing
              ? "Edit Sales Commission Agent"
              : "Add Sales Commission Agent"}
          </h1>
          <p className="mt-1 text-sm text-[#8791A5]">
            {isEditing
              ? "Update the agent's contact information and commission percentage."
              : "Enter the agent's contact information and commission percentage."}
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#E8E5DF] bg-white shadow-[0_5px_24px_rgba(16,35,79,0.05)]"
        >
          <div className="h-1.5 bg-gradient-to-r from-[#FF6814] to-[#FFB16D]" />

          <div className="p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
                <UserRound size={21} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#10234F]">
                  Agent Information
                </h2>
                <p className="mt-0.5 text-xs text-[#8791A5]">
                  Fields marked with * are required.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-6">
              {/* Prefix */}
              <FormField
                label="Prefix"
                className="sm:col-span-1"
              >
                <select
                  name="prefix"
                  value={form.prefix}
                  onChange={updateField}
                  className={inputClass}
                >
                  <option value="">Mr / M</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </FormField>

              {/* First name */}
              <FormField
                label="First Name *"
                icon={UserRound}
                className="sm:col-span-2"
              >
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={updateField}
                  placeholder="First Name"
                  className={`${inputClass} pl-9`}
                  aria-invalid={Boolean(errors.firstName)}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </FormField>

              {/* Last name */}
              <FormField
                label="Last Name"
                icon={UserRound}
                className="sm:col-span-3"
              >
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={updateField}
                  placeholder="Last Name"
                  className={`${inputClass} pl-9`}
                />
              </FormField>

              {/* Email */}
              <FormField
                label="Email"
                icon={Mail}
                className="sm:col-span-3"
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
              </FormField>

              {/* Contact number */}
              <FormField
                label="Contact Number"
                icon={Phone}
                className="sm:col-span-3"
              >
                <input
                  type="tel"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={updateField}
                  placeholder="Contact Number"
                  className={`${inputClass} pl-9`}
                />
              </FormField>

              {/* Address */}
              <FormField
                label="Address"
                icon={MapPin}
                className="sm:col-span-6"
              >
                <textarea
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  placeholder="Address"
                  rows={3}
                  className={`${inputClass} resize-y pl-9`}
                />
              </FormField>

              {/* Commission */}
              <FormField
                label="Sales Commission Percentage (%)"
                icon={Percent}
                className="sm:col-span-3"
              >
                <div className="relative">
                  <input
                    type="number"
                    name="salesCommissionPercentage"
                    value={form.salesCommissionPercentage}
                    onChange={updateField}
                    placeholder="Sales Commission Percentage (%)"
                    min="0"
                    max="100"
                    step="0.01"
                    className={`${inputClass} pr-10`}
                    aria-invalid={Boolean(
                      errors.salesCommissionPercentage
                    )}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8791A5]">
                    %
                  </span>
                </div>
                {errors.salesCommissionPercentage && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.salesCommissionPercentage}
                  </p>
                )}
              </FormField>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#F0E9E0] bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E6DCCE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52617B] transition hover:bg-[#FFF5EB]"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              {onClose && !onBack && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E6DCCE] bg-white px-5 py-2.5 text-sm font-semibold text-[#52617B] transition hover:bg-[#F8F5F0]"
                >
                  <X size={15} />
                  Close
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Update Agent"
                    : "Save Agent"}
              </button>
            </div>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-[#8791A5]">
          Billomax — Your Trusted Partner in Billing & Invoicing
        </p>
      </div>
    </div>
  );
}
