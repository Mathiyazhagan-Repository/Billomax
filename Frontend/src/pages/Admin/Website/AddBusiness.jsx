
import React, { useState } from "react";
import {
  Building2,
  CalendarDays,
  Wallet,
  Globe,
  Phone,
  MapPin,
  Clock3,
  UserRound,
  Mail,
  LockKeyhole,
  Package,
  CreditCard,
  ReceiptText,
  Upload,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Save,
  ArrowLeft,
} from "lucide-react";

const initialForm = {
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
  timezone: "Asia/Kolkata",
  prefix: "",
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  package: "",
  paidVia: "",
  transactionId: "",
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#DCE5F0] bg-white px-3 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA8B9] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-1.5 block text-xs font-bold text-[#263B60]";

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  required = false,
  autoComplete,
  hint,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-[#F05B45]">*</span>}
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
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="h-11 min-w-0 w-full bg-transparent px-3 text-sm text-[#10234F] outline-none placeholder:text-[#9AA8B9]"
        />
      </div>

      {hint && <p className="mt-1 text-[11px] text-[#8290A4]">{hint}</p>}
    </div>
  );
}

function FormSelect({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  required = false,
  children,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-[#F05B45]">*</span>}
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
          {children}
        </select>
      </div>
    </div>
  );
}

function SectionCard({ title, description, icon: Icon, children }) {
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

export default function AddBusiness({ onBack }) {
  const [form, setForm] = useState(initialForm);
  const [logoPreview, setLogoPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file for the business logo.");
      return;
    }

    setForm((current) => ({ ...current, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const handleReset = () => {
    setForm(initialForm);
    setLogoPreview("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setSubmitting(true);

    try {
      // Connect this handler to your existing business-creation API.
      // Use FormData when sending the logo file.
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      console.log("Business form ready for API submission:", {
        ...form,
        password: "[REDACTED]",
        confirmPassword: "[REDACTED]",
      });

      // Example:
      // await axios.post("/api/businesses", payload);
      // setSuccess("Business created successfully.");

      setSuccess(
        "Form validated. Connect your business-creation API to submit and save these details."
      );
    } catch {
      setError("Unable to submit the business details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1450px]">
        {/* Page header */}
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F47721]">
              <span className="h-2 w-2 rounded-full bg-[#FF812B]" />
              Superadmin Portal
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
              Add New Business
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-[#71839B]">
              Create a business account and configure its owner, location, and
              subscription details.
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
                Back to All Businesses
              </button>
            )}
            <div className="flex items-center gap-2 rounded-xl border border-[#F4D9C4] bg-[#FFF0E4] px-3 py-2 text-xs font-semibold text-[#B95A1B]">
              <ShieldCheck size={16} />
              Business Registration
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Business details */}
          <SectionCard
            title="Business Details"
            description="Enter the business profile, contact details, address, and regional settings."
            icon={Building2}
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField
                  label="Business Name"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Business Name"
                  icon={Building2}
                  required
                  autoComplete="organization"
                />
              </div>

              <FormField
                label="Start Date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                icon={CalendarDays}
                type="date"
              />

              <FormSelect
                label="Currency"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                icon={Wallet}
                required
              >
                <option value="">Select Currency</option>
                <option value="INR">India - Rupees (INR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </FormSelect>

              {/* Logo upload */}
              <div className="min-w-0">
                <label htmlFor="logo" className={labelClass}>
                  Upload Logo
                </label>
                <div className="flex min-h-11 min-w-0 items-center gap-3 rounded-xl border border-[#DCE5F0] bg-white p-1.5">
                  <label
                    htmlFor="logo"
                    className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#1676ED] px-3 text-xs font-bold text-white transition hover:bg-[#1265D8]"
                  >
                    <Upload size={14} />
                    Browse
                  </label>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                  <span className="min-w-0 truncate text-xs text-[#8290A4]">
                    {form.logo?.name || "No file selected"}
                  </span>
                </div>

                {logoPreview && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={logoPreview}
                      alt="Business logo preview"
                      className="h-14 w-14 rounded-xl border border-[#E5EBF3] bg-white object-contain p-1"
                    />
                    <span className="text-xs text-[#71839B]">
                      Business logo preview
                    </span>
                  </div>
                )}
              </div>

              <FormField
                label="Website"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="Website"
                icon={Globe}
                type="url"
              />

              <FormField
                label="Business Contact Number"
                name="businessContact"
                value={form.businessContact}
                onChange={handleChange}
                placeholder="Business contact number"
                icon={Phone}
                type="tel"
              />

              <FormField
                label="Alternate Contact Number"
                name="alternateContact"
                value={form.alternateContact}
                onChange={handleChange}
                placeholder="Alternate contact number"
                icon={Phone}
                type="tel"
              />

              <FormField
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                icon={Globe}
                required
                autoComplete="country-name"
              />

              <FormField
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                icon={MapPin}
                required
                autoComplete="address-level1"
              />

              <FormField
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                icon={MapPin}
                required
                autoComplete="address-level2"
              />

              <FormField
                label="Zip Code"
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                placeholder="Zip/Postal Code"
                icon={MapPin}
                required
                autoComplete="postal-code"
              />

              <FormField
                label="Landmark"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                placeholder="Landmark"
                icon={MapPin}
                required
              />

              <FormSelect
                label="Time Zone"
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                icon={Clock3}
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
              </FormSelect>
            </div>
          </SectionCard>

          {/* Owner information */}
          <SectionCard
            title="Owner Information"
            description="Create the initial owner account for this business."
            icon={UserRound}
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="Prefix"
                name="prefix"
                value={form.prefix}
                onChange={handleChange}
                placeholder="Mr / Mrs / Miss"
                icon={UserRound}
              />

              <FormField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                icon={UserRound}
                required
                autoComplete="given-name"
              />

              <FormField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                icon={UserRound}
                autoComplete="family-name"
              />

              <FormField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                icon={UserRound}
                required
                autoComplete="username"
              />

              <FormField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                icon={Mail}
                type="email"
                required
                autoComplete="email"
              />

              <div className="hidden xl:block" />

              <FormField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                icon={LockKeyhole}
                type="password"
                required
                autoComplete="new-password"
              />

              <FormField
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                icon={LockKeyhole}
                type="password"
                required
                autoComplete="new-password"
              />
            </div>
          </SectionCard>

          {/* Subscription and payment */}
          <SectionCard
            title="Package & Payment Details"
            description="Select a subscription package and enter the payment reference, if applicable."
            icon={CreditCard}
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              <FormSelect
                label="Packages"
                name="package"
                value={form.package}
                onChange={handleChange}
                icon={Package}
              >
                <option value="">Please Select</option>
                <option value="Starter">Starter</option>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Professional">Professional</option>
                <option value="Premium">Premium</option>
              </FormSelect>

              <FormSelect
                label="Paid Via"
                name="paidVia"
                value={form.paidVia}
                onChange={handleChange}
                icon={CreditCard}
              >
                <option value="">Please Select</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
                <option value="UPI">UPI</option>
                <option value="FREE">FREE</option>
              </FormSelect>

              <FormField
                label="Transaction ID"
                name="transactionId"
                value={form.transactionId}
                onChange={handleChange}
                placeholder="Transaction Id"
                icon={ReceiptText}
              />
            </div>
          </SectionCard>

          {/* Form messages */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <ShieldCheck size={17} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs leading-5 text-[#8290A4]">
                Fields marked with <span className="text-red-500">*</span> are
                required.
              </p>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DCE5F0] bg-white px-5 text-sm font-bold text-[#526984] transition hover:bg-slate-50"
                >
                  <RotateCcw size={16} />
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-7 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  {submitting ? "Submitting..." : "Submit Business"}
                </button>
              </div>
            </div>
          </div>
        </form>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#E5EBF3] py-4 text-center text-[11px] text-[#8290A4] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span>Superadmin Portal · Add Business</span>
        </footer>
      </div>
    </main>
  );
}
