
import React, { useState } from "react";
import {
  X,
  Save,
  FilePlus2,
  UserRound,
  CalendarDays,
  Stethoscope,
  ImagePlus,
  ClipboardList,
} from "lucide-react";

const initialForm = {
  prescriptionNo: "",
  prescriptionDate: "2026-10-23",
  doctor: "",
  patient: "",
  validityDays: "30",
  maxRefills: "0",
  status: "Active",
  prescriptionImage: null,
  notes: "",
};

export default function AddPrescriptionModal({
  isOpen = true,
  onClose = () => {},
  onSave,
  doctors = [],
  patients = [],
  initialData,
  title = "Add Prescription",
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...(initialData || {}),
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
  };

  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-[#DCE3ED] bg-white px-3 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

  const labelClass =
    "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.prescriptionDate) {
      setError("Prescription date is required.");
      return;
    }

    if (Number(form.validityDays) < 0 || Number(form.maxRefills) < 0) {
      setError("Validity and maximum refills cannot be negative.");
      return;
    }

    if (!onSave) {
      setError("Connect your existing save handler to save this prescription.");
      return;
    }

    try {
      setSaving(true);
      await onSave({ ...form });
      onClose();
    } catch (err) {
      setError(err?.message || "Unable to save the prescription.");
    } finally {
      setSaving(false);
    }
  };

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
        aria-labelledby="prescription-title"
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#E6EDF5] bg-[#FFFAF5] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
              <FilePlus2 size={21} />
            </div>
            <div>
              <h2
                id="prescription-title"
                className="text-lg font-bold text-white sm:text-xl"
              >
                {title}
              </h2>
              <p className="mt-0.5 text-xs text-white/85">
                Prescription and patient information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-white transition hover:bg-white/15 disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto">
          <div className="space-y-6 p-5 sm:p-7">
            {/* Prescription details */}
            <section className="rounded-xl border border-[#E6EDF5] bg-white p-4 sm:p-5">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-[#10234F]">
                <ClipboardList size={17} className="text-[#FF6814]" />
                Prescription Details
              </h3>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="prescriptionNo">
                    Prescription No.
                  </label>
                  <input
                    id="prescriptionNo"
                    value={form.prescriptionNo}
                    onChange={(event) =>
                      updateField("prescriptionNo", event.target.value)
                    }
                    placeholder="Rx Number"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="prescriptionDate"
                  >
                    <CalendarDays size={14} className="text-[#FF6814]" />
                    Prescription Date <span className="text-[#FF6814]">*</span>
                  </label>
                  <input
                    id="prescriptionDate"
                    type="date"
                    required
                    value={form.prescriptionDate}
                    onChange={(event) =>
                      updateField("prescriptionDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="doctor">
                    <Stethoscope size={14} className="text-[#FF6814]" />
                    Doctor
                  </label>
                  <select
                    id="doctor"
                    value={form.doctor}
                    onChange={(event) =>
                      updateField("doctor", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">None</option>
                    {doctors.map((doctor) => (
                      <option
                        key={doctor.id ?? doctor.value ?? doctor.name}
                        value={doctor.id ?? doctor.value ?? doctor.name}
                      >
                        {doctor.name ?? doctor.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="patient">
                    <UserRound size={14} className="text-[#FF6814]" />
                    Patient (Customer)
                  </label>
                  <select
                    id="patient"
                    value={form.patient}
                    onChange={(event) =>
                      updateField("patient", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Search patient by name or mobile...</option>
                    {patients.map((patient) => (
                      <option
                        key={patient.id ?? patient.value ?? patient.name}
                        value={patient.id ?? patient.value ?? patient.name}
                      >
                        {patient.name ?? patient.label}
                        {patient.mobile ? ` — ${patient.mobile}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="validityDays">
                    Validity (Days)
                  </label>
                  <input
                    id="validityDays"
                    type="number"
                    min="0"
                    value={form.validityDays}
                    onChange={(event) =>
                      updateField("validityDays", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="maxRefills">
                    Max Refills
                  </label>
                  <input
                    id="maxRefills"
                    type="number"
                    min="0"
                    value={form.maxRefills}
                    onChange={(event) =>
                      updateField("maxRefills", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="prescriptionImage">
                    <ImagePlus size={14} className="text-[#FF6814]" />
                    Prescription Image
                  </label>
                  <input
                    id="prescriptionImage"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      updateField(
                        "prescriptionImage",
                        event.target.files?.[0] ?? null
                      )
                    }
                    className="mt-1.5 block h-10 w-full rounded-lg border border-[#DCE3ED] bg-white text-sm text-slate-600 file:mr-3 file:h-full file:border-0 file:bg-orange-50 file:px-3 file:font-semibold file:text-[#C94E0C] hover:file:bg-orange-100"
                  />
                  {form.prescriptionImage?.name && (
                    <p className="mt-1.5 truncate text-xs text-slate-500">
                      Selected: {form.prescriptionImage.name}
                    </p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <label className={labelClass} htmlFor="notes">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(event) =>
                      updateField("notes", event.target.value)
                    }
                    placeholder="Additional notes..."
                    className={`${inputClass} h-auto min-h-20 resize-y py-3`}
                  />
                </div>
              </div>
            </section>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <footer className="flex flex-col-reverse gap-3 border-t border-[#E6EDF5] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
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
