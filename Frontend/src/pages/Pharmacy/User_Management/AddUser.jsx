
import React, { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  MapPin,
  Percent,
  BriefcaseBusiness,
  Landmark,
  Save,
  Info,
  ChevronDown,
} from "lucide-react";

const locations = [
  "Pharmacy (BL0001)",
  "Soujanya H V (kumarswamy0001)",
];

const initialForm = {
  prefix: "",
  firstName: "",
  lastName: "",
  email: "",
  isActive: true,
  serviceStaffPin: false,
  allowLogin: true,
  username: "",
  usernameSuffix: "-04",
  password: "",
  confirmPassword: "",
  role: "Admin",
  allLocations: true,
  locations: [],
  salesCommission: "",
  maxSalesDiscount: "",
  allowSelectedContacts: false,
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  bloodGroup: "",
  mobileNumber: "",
  alternateContactNumber: "",
  familyContactNumber: "",
  facebookLink: "",
  twitterLink: "",
  socialMedia1: "",
  socialMedia2: "",
  customField1: "",
  customField2: "",
  customField3: "",
  customField4: "",
  guardianName: "",
  idProofName: "",
  idProofNumber: "",
  permanentAddress: "",
  currentAddress: "",
  accountHolderName: "",
  accountNumber: "",
  bankName: "",
  bankIdentifierCode: "",
  branch: "",
  taxPayerId: "",
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  icon: Icon,
  disabled = false,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#10234F]"
      >
        {label}
        {required && <span className="text-[#FF6814]">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8995A9]"
          />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder || label}
          required={required}
          disabled={disabled}
          className={`w-full rounded-lg border border-[#E6DCCE] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA3B4] focus:border-[#FF6814] focus:ring-2 focus:ring-orange-100 disabled:bg-[#F3F0EB] ${
            Icon ? "pl-9" : ""
          }`}
        />
      </div>
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
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#10234F]"
      >
        {label}
        {required && <span className="text-[#FF6814]">*</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full appearance-none rounded-lg border border-[#E6DCCE] bg-white px-3 py-2.5 pr-9 text-sm text-[#10234F] outline-none transition focus:border-[#FF6814] focus:ring-2 focus:ring-orange-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8995A9]"
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, rows = 3 }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-[#10234F]"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        placeholder={label}
        className="w-full resize-y rounded-lg border border-[#E6DCCE] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none placeholder:text-[#9AA3B4] focus:border-[#FF6814] focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}

function CheckField({ label, name, checked, onChange, info = false }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#52617B]">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[#D8D0C5] accent-[#FF6814] focus:ring-orange-200"
      />
      <span>{label}</span>
      {info && <Info size={14} className="text-sky-500" />}
    </label>
  );
}

function SectionCard({ title, icon: Icon, children, description }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_20px_rgba(16,35,79,0.045)]">
      <div className="flex items-center gap-3 border-b border-[#F0E9E0] px-5 py-4 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#10234F]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-[#8791A5]">{description}</p>
          )}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function AddUser({
  onSave,
  onBack,
  initialValues = {},
  isEditing = false,
}) {
  const [form, setForm] = useState({
    ...initialForm,
    ...initialValues,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setForm((current) => {
      const updated = { ...current, [name]: nextValue };

      if (name === "allLocations" && checked) {
        updated.locations = [];
      }

      if (name === "allLocations" && !checked) {
        updated.locations = [];
      }

      return updated;
    });

    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const updateLocation = (location, checked) => {
    setForm((current) => {
      const nextLocations = checked
        ? [...current.locations, location]
        : current.locations.filter((item) => item !== location);

      return {
        ...current,
        allLocations: false,
        locations: nextLocations,
      };
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (form.allowLogin && !form.password && !isEditing) {
      nextErrors.password = "Password is required when login is enabled.";
    }
    if (form.allowLogin && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      if (onSave) {
        await onSave(form);
      } else {
        console.info("Add user form data:", form);
        window.alert(
          "Form validated. Connect the onSave prop to your existing API to create the user."
        );
      }
    } catch (error) {
      setErrors((current) => ({
        ...current,
        submit: error?.message || "Unable to save the user.",
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-3 inline-flex items-center gap-2 rounded-lg border border-[#F2E8DE] bg-white px-3 py-2 text-xs font-semibold text-[#19366F] transition hover:bg-[#FFF1E5]"
              >
                Back to Users
              </button>
            )}
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#FF6814]">
              User Management
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              {isEditing ? "Edit User" : "Add User"}
            </h1>
            <p className="mt-1 text-sm text-[#73809A]">
              {isEditing
                ? "Update user details and access permissions."
                : "Create a user account and configure access permissions."}
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F5D9C3] bg-[#FFF0E4] px-3 py-2 text-xs font-semibold text-[#B94D0A]">
            <ShieldCheck size={15} />
            User profile setup
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {/* User details */}
          <SectionCard
            title="User Details"
            icon={UserRound}
            description="Basic identity and account status"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-2">
                <Field
                  label="Prefix"
                  name="prefix"
                  value={form.prefix}
                  onChange={update}
                  placeholder="Mr / Mrs / Miss"
                />
              </div>
              <div className="md:col-span-5">
                <Field
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={update}
                  required
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div className="md:col-span-5">
                <Field
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={update}
                  placeholder="Last Name"
                />
              </div>

              <div className="md:col-span-4">
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-8">
                <CheckField
                  label="Is active?"
                  name="isActive"
                  checked={form.isActive}
                  onChange={update}
                  info
                />
                <CheckField
                  label="Enable service staff pin"
                  name="serviceStaffPin"
                  checked={form.serviceStaffPin}
                  onChange={update}
                  info
                />
              </div>
            </div>
          </SectionCard>

          {/* Roles and permissions */}
          <SectionCard
            title="Roles and Permissions"
            icon={ShieldCheck}
            description="Configure login credentials, role, and business location access"
          >
            <div className="space-y-5">
              <CheckField
                label="Allow login"
                name="allowLogin"
                checked={form.allowLogin}
                onChange={update}
              />

              {form.allowLogin && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Field
                      label="Username"
                      name="username"
                      value={form.username}
                      onChange={update}
                      placeholder="Username"
                    />
                    <p className="mt-1.5 text-xs text-[#8791A5]">
                      Leave blank to auto generate username
                    </p>
                    <p className="mt-1 text-xs text-[#8791A5]">
                      Username suffix: {form.usernameSuffix}
                    </p>
                  </div>

                  <div>
                    <Field
                      label="Password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={update}
                      required
                      placeholder="Password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <Field
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={update}
                      required
                      placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="max-w-xl">
                <SelectField
                  label="Role"
                  name="role"
                  value={form.role}
                  onChange={update}
                  required
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "Cashier", label: "Cashier" },
                    { value: "Manager", label: "Manager" },
                    { value: "Sales", label: "Sales" },
                    { value: "Staff", label: "Staff" },
                  ]}
                />
              </div>

              <div className="border-t border-[#F0E9E0] pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#10234F]">
                  <MapPin size={16} className="text-[#FF6814]" />
                  Access locations
                  <Info size={14} className="text-sky-500" />
                </h3>

                <div className="space-y-3 pl-1">
                  <CheckField
                    label="All Locations"
                    name="allLocations"
                    checked={form.allLocations}
                    onChange={update}
                    info
                  />

                  <div className="grid grid-cols-1 gap-3 pl-6 sm:grid-cols-2">
                    {locations.map((location) => (
                      <CheckField
                        key={location}
                        label={location}
                        name={`location-${location}`}
                        checked={
                          form.allLocations || form.locations.includes(location)
                        }
                        onChange={(event) =>
                          updateLocation(location, event.target.checked)
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Sales settings */}
          <SectionCard
            title="Sales"
            icon={Percent}
            description="Commission and sales discount permissions"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Sales Commission Percentage (%)"
                name="salesCommission"
                type="number"
                value={form.salesCommission}
                onChange={update}
                placeholder="Sales Commission Percentage (%)"
              />
              <Field
                label="Max sales discount percent"
                name="maxSalesDiscount"
                type="number"
                value={form.maxSalesDiscount}
                onChange={update}
                placeholder="Max sales discount percent"
              />
              <div className="md:col-span-2">
                <CheckField
                  label="Allow Selected Contacts"
                  name="allowSelectedContacts"
                  checked={form.allowSelectedContacts}
                  onChange={update}
                  info
                />
              </div>
            </div>
          </SectionCard>

          {/* More information */}
          <SectionCard
            title="More Informations"
            icon={BriefcaseBusiness}
            description="Personal information, contact details, and custom fields"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={update}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={update}
                options={[
                  { value: "", label: "Please Select" },
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
              />
              <SelectField
                label="Marital Status"
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={update}
                options={[
                  { value: "", label: "Marital Status" },
                  { value: "Single", label: "Single" },
                  { value: "Married", label: "Married" },
                  { value: "Divorced", label: "Divorced" },
                  { value: "Widowed", label: "Widowed" },
                ]}
              />
              <Field
                label="Blood Group"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={update}
                placeholder="Blood Group"
              />

              <Field
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                value={form.mobileNumber}
                onChange={update}
                placeholder="Mobile Number"
              />
              <Field
                label="Alternate contact number"
                name="alternateContactNumber"
                type="tel"
                value={form.alternateContactNumber}
                onChange={update}
                placeholder="Alternate contact number"
              />
              <Field
                label="Family contact number"
                name="familyContactNumber"
                type="tel"
                value={form.familyContactNumber}
                onChange={update}
                placeholder="Family contact number"
              />
              <Field
                label="Facebook Link"
                name="facebookLink"
                value={form.facebookLink}
                onChange={update}
                placeholder="Facebook Link"
              />

              <Field
                label="Twitter Link"
                name="twitterLink"
                value={form.twitterLink}
                onChange={update}
                placeholder="Twitter Link"
              />
              <Field
                label="Social Media 1"
                name="socialMedia1"
                value={form.socialMedia1}
                onChange={update}
                placeholder="Social Media 1"
              />
              <Field
                label="Social Media 2"
                name="socialMedia2"
                value={form.socialMedia2}
                onChange={update}
                placeholder="Social Media 2"
              />
              <Field
                label="Custom field 1"
                name="customField1"
                value={form.customField1}
                onChange={update}
                placeholder="Custom field 1"
              />

              <Field
                label="Custom field 2"
                name="customField2"
                value={form.customField2}
                onChange={update}
                placeholder="Custom field 2"
              />
              <Field
                label="Custom field 3"
                name="customField3"
                value={form.customField3}
                onChange={update}
                placeholder="Custom field 3"
              />
              <Field
                label="Custom field 4"
                name="customField4"
                value={form.customField4}
                onChange={update}
                placeholder="Custom field 4"
              />
              <Field
                label="Guardian Name"
                name="guardianName"
                value={form.guardianName}
                onChange={update}
                placeholder="Guardian Name"
              />

              <Field
                label="ID proof name"
                name="idProofName"
                value={form.idProofName}
                onChange={update}
                placeholder="ID proof name"
              />
              <Field
                label="ID proof number"
                name="idProofNumber"
                value={form.idProofNumber}
                onChange={update}
                placeholder="ID proof number"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TextAreaField
                label="Permanent Address"
                name="permanentAddress"
                value={form.permanentAddress}
                onChange={update}
                rows={3}
              />
              <TextAreaField
                label="Current Address"
                name="currentAddress"
                value={form.currentAddress}
                onChange={update}
                rows={3}
              />
            </div>
          </SectionCard>

          {/* Bank details */}
          <SectionCard
            title="Bank Details"
            icon={Landmark}
            description="Bank account and tax identification information"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Account Holder's Name"
                name="accountHolderName"
                value={form.accountHolderName}
                onChange={update}
                placeholder="Account Holder's Name"
              />
              <Field
                label="Account Number"
                name="accountNumber"
                value={form.accountNumber}
                onChange={update}
                placeholder="Account Number"
              />
              <Field
                label="Bank Name"
                name="bankName"
                value={form.bankName}
                onChange={update}
                placeholder="Bank Name"
              />
              <Field
                label="Bank Identifier Code"
                name="bankIdentifierCode"
                value={form.bankIdentifierCode}
                onChange={update}
                placeholder="Bank Identifier Code"
              />
              <Field
                label="Branch"
                name="branch"
                value={form.branch}
                onChange={update}
                placeholder="Branch"
              />
              <Field
                label="Tax Payer ID"
                name="taxPayerId"
                value={form.taxPayerId}
                onChange={update}
                placeholder="Tax Payer ID"
              />
            </div>
          </SectionCard>

          {errors.submit && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errors.submit}
            </p>
          )}

          {/* Sticky-style form actions */}
          <div className="flex flex-col-reverse justify-end gap-3 rounded-2xl border border-[#E6EAF0] bg-white p-4 shadow-sm sm:flex-row sm:px-6">
            <button
              type="button"
              onClick={() =>
                setForm({ ...initialForm, ...initialValues })
              }
              className="rounded-xl border border-[#E2DDD5] bg-white px-5 py-3 text-sm font-semibold text-[#52617B] transition hover:bg-[#F7F4EF]"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update User"
                  : "Save User"}
            </button>
          </div>
        </form>

        <footer className="py-2 text-center text-xs text-[#8791A5]">
          Billomax — Your Trusted Partner in Billing & Invoicing
        </footer>
      </div>
    </div>
  );
}
