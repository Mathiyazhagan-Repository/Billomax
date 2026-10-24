
import React, { useState } from "react";
import { X, UserRound, Save, Stethoscope } from "lucide-react";

const initialForm = {
  doctorName: "",
  registrationNo: "",
  specialization: "",
  clinicName: "",
  phone: "",
  email: "",
  address: "",
  active: true,
};

export default function AddDoctorModal({
  isOpen = true,
  onClose = () => {},
  onSave,
  initialData,
  title = "Add Doctor",
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...(initialData || {}),
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.doctorName.trim()) {
      nextErrors.doctorName = "Doctor name is required.";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    if (!onSave) {
      setErrors({
        form: "Connect the existing save handler to save this doctor.",
      });
      return;
    }

    try {
      setSaving(true);
      await onSave({ ...form });
      onClose();
    } catch (error) {
      setErrors({
        form: error?.message || "Unable to save the doctor. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      name: "doctorName",
      label: "Doctor Name",
      placeholder: "Dr. Full Name",
      required: true,
    },
    {
      name: "registrationNo",
      label: "Registration No.",
      placeholder: "Medical council reg. no.",
    },
    {
      name: "specialization",
      label: "Specialization",
      placeholder: "e.g. General Physician",
    },
    {
      name: "clinicName",
      label: "Clinic Name",
      placeholder: "Clinic / Hospital name",
    },
    {
      name: "phone",
      label: "Phone",
      placeholder: "Phone number",
      type: "tel",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Email address",
      type: "email",
    },
  ];

  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-[#DCE3ED] bg-white px-3 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-wide text-slate-600";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10234F]/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
        className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
              <Stethoscope size={21} />
            </div>
            <div>
              <h2
                id="doctor-modal-title"
                className="text-lg font-bold text-white"
              >
                {title}
              </h2>
              <p className="mt-0.5 text-xs text-white/85">
                Enter doctor and clinic details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-white/90 transition hover:bg-white/15 hover:text-white disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto">
          <div className="space-y-6 p-5 sm:p-7">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#10234F]">
              <UserRound size={17} className="text-[#FF6814]" />
              Doctor Information
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className={labelClass} htmlFor={field.name}>
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-[#FF6814]">*</span>
                    )}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={form[field.name] ?? ""}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(event) =>
                      updateField(field.name, event.target.value)
                    }
                    aria-invalid={Boolean(errors[field.name])}
                    className={`${inputClass} ${
                      errors[field.name]
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : ""
                    }`}
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Address */}
            <div>
              <label className={labelClass} htmlFor="address">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={form.address}
                placeholder="Clinic address"
                onChange={(event) =>
                  updateField("address", event.target.value)
                }
                className={`${inputClass} h-auto min-h-20 resize-y py-3`}
              />
            </div>

            {/* Active */}
            <label className="flex w-fit cursor-pointer items-center gap-3 rounded-xl border border-[#E6EDF5] bg-[#FFFAF5] px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(form.active)}
                onChange={(event) =>
                  updateField("active", event.target.checked)
                }
                className="h-4 w-4 accent-[#FF6814]"
              />
              <span>
                <span className="block text-sm font-semibold text-[#10234F]">
                  Active
                </span>
                <span className="block text-xs text-slate-500">
                  Enable this doctor's status
                </span>
              </span>
            </label>

            {errors.form && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errors.form}
              </p>
            )}
          </div>

          {/* Footer */}
          <footer className="flex flex-col-reverse gap-3 border-t border-[#E6EDF5] bg-[#F8FAFC] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[#DCE3ED] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
