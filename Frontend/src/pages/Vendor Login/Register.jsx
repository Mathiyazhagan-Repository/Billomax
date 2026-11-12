
import React, { useRef, useState } from "react";

const initialValues = {
  businessName: "",
  startDate: "",
  currency: "",
  logo: null,
  website: "",
  businessContact: "",
  alternateContact: "",
  country: "",
  state: "",
  city: "",
  zipCode: "",
  landmark: "",
  timeZone: "Asia/Kolkata",
  tax1Name: "",
  tax1Number: "",
  tax2Name: "",
  tax2Number: "",
  financialYearStart: "January",
  stockAccountingMethod: "FIFO (First In First Out)",
  prefix: "",
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const steps = [
  { number: 1, title: "Business details", subtitle: "Business information" },
  { number: 2, title: "Business Settings", subtitle: "Accounting preferences" },
  { number: 3, title: "Owner", subtitle: "Account information" },
];

const currencies = [
  { value: "INR", label: "INR — Indian Rupee (₹)" },
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "EUR", label: "EUR — Euro (€)" },
  { value: "GBP", label: "GBP — British Pound (£)" },
  { value: "AED", label: "AED — UAE Dirham" },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const stockMethods = [
  "FIFO (First In First Out)",
  "LIFO (Last In First Out)",
  "Average Cost",
];

function Field({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  icon,
  optional = false,
  error,
  children,
  autoComplete,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#7C86AD]"
      >
        {icon && <span className="text-xs">{icon}</span>}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
        {optional && (
          <span className="ml-auto font-normal normal-case tracking-normal text-[#A2ABC3]">
            optional
          </span>
        )}
      </label>

      {children ? (
        children
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`h-[42px] w-full rounded-xl border bg-[#FFFDFB] px-3 text-sm text-[#28304F] outline-none transition placeholder:text-[#AAB3C9] focus:border-[#FF711A] focus:bg-white focus:ring-4 focus:ring-[#FF711A]/10 ${
            error ? "border-red-400" : "border-[#DFE4FA]"
          }`}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  icon,
  error,
}) {
  return (
    <Field
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      icon={icon}
      error={error}
    >
      <select
        id={name}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className={`h-[42px] w-full rounded-xl border bg-[#FFFDFB] px-3 text-sm text-[#28304F] outline-none transition focus:border-[#FF711A] focus:bg-white focus:ring-4 focus:ring-[#FF711A]/10 ${
          error ? "border-red-400" : "border-[#DFE4FA]"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </Field>
  );
}

function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E4] text-lg text-[#FF6814]">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-[#202544]">{title}</h2>
        <p className="mt-1 text-xs text-[#8992B4]">{subtitle}</p>
      </div>
    </div>
  );
}

function StepProgress({ currentStep, setCurrentStep }) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10">
      {steps.map((step) => {
        const active = currentStep === step.number;
        const completed = currentStep > step.number;

        return (
          <button
            type="button"
            key={step.number}
            onClick={() => {
              if (step.number < currentStep) setCurrentStep(step.number);
            }}
            disabled={step.number > currentStep}
            className={`flex min-w-0 items-center gap-2 border-r border-[#E4E7F4] px-2 py-4 text-left transition last:border-r-0 sm:gap-3 sm:px-4 ${
              active
                ? "bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white"
                : completed
                  ? "bg-[#ECFDF4] text-[#087A46]"
                  : "bg-white text-[#7A85A9]"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active
                  ? "bg-white text-[#E85D0A]"
                  : completed
                    ? "bg-[#20C875] text-white"
                    : "border border-[#F2E8DE] bg-[#FFF8F0]"
              }`}
            >
              {completed ? "✓" : step.number}
            </span>
            <span className="min-w-0">
              <span className="block text-[9px] font-semibold uppercase tracking-wider">
                Step {step.number}
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-bold sm:text-sm">
                {step.title}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Register({ onRegister, onBack }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef(null);

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setNotice("");
  };

  const handleLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        logo: "Please upload a PNG, JPG, or WebP image.",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        logo: "Logo must be 2 MB or smaller.",
      }));
      return;
    }

    setFormData((previous) => ({ ...previous, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
    setErrors((previous) => ({ ...previous, logo: "" }));
  };

  const validateStep = (step) => {
    const nextErrors = {};

    if (step === 1) {
      if (!formData.businessName.trim())
        nextErrors.businessName = "Business name is required.";
      if (!formData.currency)
        nextErrors.currency = "Please select a currency.";
      if (!formData.country.trim())
        nextErrors.country = "Country is required.";
      if (!formData.state.trim())
        nextErrors.state = "State is required.";
      if (!formData.city.trim())
        nextErrors.city = "City is required.";
      if (!formData.zipCode.trim())
        nextErrors.zipCode = "ZIP/postal code is required.";
      if (!formData.landmark.trim())
        nextErrors.landmark = "Landmark is required.";
      if (!formData.timeZone)
        nextErrors.timeZone = "Time zone is required.";
      if (formData.website && !/^https?:\/\/.+/i.test(formData.website))
        nextErrors.website = "Enter a complete URL, including https://.";
    }

    if (step === 2) {
      if (!formData.financialYearStart)
        nextErrors.financialYearStart = "Select a financial year start month.";
      if (!formData.stockAccountingMethod)
        nextErrors.stockAccountingMethod = "Select a stock accounting method.";
    }

    if (step === 3) {
      if (!formData.firstName.trim())
        nextErrors.firstName = "First name is required.";
      if (!formData.username.trim())
        nextErrors.username = "Username is required.";
      if (!formData.email.trim())
        nextErrors.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        nextErrors.email = "Enter a valid email address.";
      if (!formData.password)
        nextErrors.password = "Password is required.";
      else if (formData.password.length < 8)
        nextErrors.password = "Use at least 8 characters.";
      if (!formData.confirmPassword)
        nextErrors.confirmPassword = "Please confirm your password.";
      else if (formData.confirmPassword !== formData.password)
        nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors((previous) => ({ ...previous, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((step) => Math.min(step + 1, 3));
    setNotice("");
  };

  const goPrevious = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(3)) return;

    if (!onRegister) {
      setNotice(
        "Form validated. Connect the onRegister prop to your registration API to create the account."
      );
      return;
    }

    try {
      setSubmitting(true);
      setNotice("");
      await onRegister({ ...formData });
      setNotice("Registration request completed.");
    } catch (error) {
      setNotice(error?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFFAF5] px-4 py-8 font-sans text-[#10234F] sm:px-6 sm:py-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-40 h-[560px] w-[760px] rotate-[32deg] rounded-[100px] bg-gradient-to-br from-[#FFE9D9]/75 to-transparent" />
        <div className="absolute -bottom-40 -left-20 h-[290px] w-[720px] rounded-[50%] bg-gradient-to-r from-[#FFE9D9] via-white to-[#FFFAF5]" />
      </div>

      <div className="relative mx-auto max-w-[650px]">
        {onBack && (
          <div className="mb-5">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-[#E8E5DF] bg-white px-4 py-2 text-sm font-semibold text-[#19366F] transition hover:border-[#FFB17B] hover:bg-[#FFF8F0]"
            >
              Back to Login
            </button>
          </div>
        )}

        <header className="mb-7 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F2E8DE] bg-white/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E85D0A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF711A]" />
            Get started free
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#10234F] sm:text-4xl">
            Register Your{" "}
            <span className="bg-gradient-to-r from-[#FF6814] to-[#FF9A57] bg-clip-text text-transparent">
              Business
            </span>
          </h1>

          <p className="mt-2 text-xs leading-5 text-[#758198] sm:text-sm">
            Billomax - Your Trusted Partner in Billing &amp; Invoicing
            {" — "}Register and Get Started in minutes
          </p>
        </header>

        <StepProgress
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <form
          onSubmit={handleSubmit}
          className="mt-6 overflow-hidden rounded-[24px] border border-[#F2E8DE] bg-white shadow-[0_12px_38px_rgba(16,35,79,0.10)]"
        >
          <div className="h-[3px] bg-gradient-to-r from-[#FF6814] via-[#FF812B] to-[#FFB16D]" />

          <div className="p-5 sm:p-8">
            {currentStep === 1 && (
              <>
                <SectionHeading
                  icon="▦"
                  title="Business details"
                  subtitle="Tell us about your business — this will appear on your invoices"
                />

                <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      label="Business name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={updateField}
                      placeholder="Business Name"
                      required
                      icon="▣"
                      error={errors.businessName}
                    />
                  </div>

                  <Field
                    label="Start date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={updateField}
                    type="date"
                    icon="▦"
                  />

                  <SelectField
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={updateField}
                    required
                    icon="▣"
                    options={[
                      { value: "", label: "Select Currency" },
                      ...currencies,
                    ]}
                    error={errors.currency}
                  />

                  <div>
                    <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-[#7C86AD]">
                      <label htmlFor="logo">▧ Upload logo</label>
                      <span className="font-normal normal-case tracking-normal text-[#A2ABC3]">
                        PNG, JPG up to 2MB
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex min-h-[126px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#E8E5DF] bg-[#FFFDFB] px-4 py-4 text-center transition hover:border-[#FFB17B] hover:bg-[#FFF8F0]"
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Business logo preview"
                          className="mb-2 h-12 w-12 rounded-lg object-contain"
                        />
                      ) : (
                        <span className="mb-2 text-3xl text-[#FF6814]">☁</span>
                      )}
                      <span className="text-xs font-semibold text-[#E85D0A]">
                        {formData.logo ? formData.logo.name : "Click to upload logo"}
                      </span>
                      <span className="mt-1 text-[10px] text-[#8992B4]">
                        or drag &amp; drop here
                      </span>
                    </button>

                    <input
                      ref={fileInputRef}
                      id="logo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogo}
                      className="hidden"
                    />
                    {errors.logo && (
                      <p className="mt-1 text-xs text-red-500">{errors.logo}</p>
                    )}
                  </div>

                  <Field
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={updateField}
                    placeholder="Website"
                    icon="◎"
                    optional
                    error={errors.website}
                  />

                  <Field
                    label="Business contact number"
                    name="businessContact"
                    value={formData.businessContact}
                    onChange={updateField}
                    placeholder="Business contact number"
                    icon="☎"
                  />

                  <Field
                    label="Alternate contact number"
                    name="alternateContact"
                    value={formData.alternateContact}
                    onChange={updateField}
                    placeholder="Alternate contact number"
                    icon="☎"
                    optional
                  />
                </div>

                <div className="my-7 h-px bg-[#EEF0FA]" />

                <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                  <Field
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={updateField}
                    placeholder="Country"
                    icon="◎"
                    required
                    error={errors.country}
                  />

                  <Field
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={updateField}
                    placeholder="State"
                    icon="♦"
                    required
                    error={errors.state}
                  />

                  <Field
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={updateField}
                    placeholder="City"
                    icon="♦"
                    required
                    error={errors.city}
                  />

                  <Field
                    label="ZIP code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={updateField}
                    placeholder="Zip/Postal Code"
                    icon="♦"
                    required
                    error={errors.zipCode}
                  />

                  <Field
                    label="Landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={updateField}
                    placeholder="Landmark"
                    icon="⚑"
                    required
                    error={errors.landmark}
                  />

                  <SelectField
                    label="Time zone"
                    name="timeZone"
                    value={formData.timeZone}
                    onChange={updateField}
                    required
                    icon="◷"
                    options={[
                      { value: "Asia/Kolkata", label: "Asia/Kolkata" },
                      { value: "Asia/Dubai", label: "Asia/Dubai" },
                      { value: "Europe/London", label: "Europe/London" },
                      { value: "America/New_York", label: "America/New_York" },
                      { value: "UTC", label: "UTC" },
                    ]}
                    error={errors.timeZone}
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <SectionHeading
                  icon="⚙"
                  title="Business Settings"
                  subtitle="Configure tax settings and accounting preferences"
                />

                <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                  <Field
                    label="Tax 1 name"
                    name="tax1Name"
                    value={formData.tax1Name}
                    onChange={updateField}
                    placeholder="GST/VAT/Other"
                    icon="ⓘ"
                  />

                  <Field
                    label="Tax 1 No."
                    name="tax1Number"
                    value={formData.tax1Number}
                    onChange={updateField}
                    placeholder=""
                    icon="ⓘ"
                  />

                  <Field
                    label="Tax 2 name"
                    name="tax2Name"
                    value={formData.tax2Name}
                    onChange={updateField}
                    placeholder="GST/VAT/Other"
                    icon="ⓘ"
                  />

                  <Field
                    label="Tax 2 No."
                    name="tax2Number"
                    value={formData.tax2Number}
                    onChange={updateField}
                    placeholder=""
                    icon="ⓘ"
                  />
                </div>

                <div className="my-8 h-px bg-[#EEF0FA]" />

                <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                  <SelectField
                    label="Financial year start month"
                    name="financialYearStart"
                    value={formData.financialYearStart}
                    onChange={updateField}
                    required
                    icon="▦"
                    options={months.map((month) => ({
                      value: month,
                      label: month,
                    }))}
                    error={errors.financialYearStart}
                  />

                  <SelectField
                    label="Stock accounting method"
                    name="stockAccountingMethod"
                    value={formData.stockAccountingMethod}
                    onChange={updateField}
                    required
                    icon="▦"
                    options={stockMethods.map((method) => ({
                      value: method,
                      label: method,
                    }))}
                    error={errors.stockAccountingMethod}
                  />
                </div>

                <div className="mt-8 rounded-xl border border-[#F2E8DE] bg-[#FFF8F0] p-4">
                  <p className="text-sm font-semibold text-[#19366F]">
                    Accounting preferences
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#8992B4]">
                    Choose the tax details and inventory valuation method that
                    match your business. You can configure additional settings
                    after registration.
                  </p>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <SectionHeading
                  icon="♟"
                  title="Owner information"
                  subtitle="This will be your login account"
                />

                <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                  <Field
                    label="Prefix"
                    name="prefix"
                    value={formData.prefix}
                    onChange={updateField}
                    placeholder="Mr / Mrs / Miss"
                    icon="♟"
                    optional
                  />

                  <Field
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={updateField}
                    placeholder="First Name"
                    icon="♟"
                    required
                    error={errors.firstName}
                    autoComplete="given-name"
                  />

                  <Field
                    label="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={updateField}
                    placeholder="Last Name"
                    icon="♟"
                    autoComplete="family-name"
                  />

                  <div className="hidden sm:block" />

                  <Field
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={updateField}
                    placeholder="Username"
                    icon="♟"
                    required
                    error={errors.username}
                    autoComplete="username"
                  />

                  <Field
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={updateField}
                    placeholder="Email"
                    icon="✉"
                    type="email"
                    required
                    error={errors.email}
                    autoComplete="email"
                  />

                  <Field
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={updateField}
                    placeholder="Password"
                    icon="♙"
                    type="password"
                    required
                    error={errors.password}
                    autoComplete="new-password"
                  />

                  <Field
                    label="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={updateField}
                    placeholder="Confirm Password"
                    icon="♙"
                    type="password"
                    required
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                  />
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF0FA]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      formData.password.length >= 12
                        ? "w-full bg-[#20C875]"
                        : formData.password.length >= 8
                          ? "w-2/3 bg-[#F3B33D]"
                          : formData.password.length > 0
                            ? "w-1/3 bg-[#F16B6B]"
                            : "w-0"
                    }`}
                  />
                </div>
                <p className="mt-2 text-[10px] text-[#8992B4]">
                  Enter a password with at least 8 characters.
                </p>
              </>
            )}

            {notice && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-[#D9E7FF] bg-[#F2F7FF] px-4 py-3 text-sm text-[#354563]"
              >
                {notice}
              </div>
            )}

            <div className="mt-7 flex items-center justify-between border-t border-[#E6E8F6] pt-5">
              <div className="flex items-center gap-1.5" aria-label={`Step ${currentStep} of 3`}>
                {steps.map((step) => (
                  <span
                    key={step.number}
                    className={`h-2 rounded-full transition-all ${
                      step.number === currentStep
                        ? "w-7 bg-[#FF711A]"
                        : step.number < currentStep
                          ? "w-2 bg-[#20C875]"
                          : "w-2 bg-[#E0E4F5]"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2.5">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goPrevious}
                    className="rounded-xl border border-[#DDE2F5] bg-white px-4 py-3 text-xs font-bold text-[#68739E] transition hover:bg-[#F7F8FE] sm:px-5"
                  >
                    ← Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-orange-200/60 transition hover:brightness-105 sm:px-7"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-orange-200/60 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:px-7"
                  >
                    {submitting ? "Registering..." : "✓ Register"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        <p className="mt-5 text-center text-[10px] text-[#758198]">
          © {new Date().getFullYear()} Billomax. Your Trusted Partner in Billing &amp; Invoicing.
        </p>
      </div>
    </main>
  );
}
