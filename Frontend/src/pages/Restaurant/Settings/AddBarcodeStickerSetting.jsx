
import React, { useState } from "react";
import {
  ArrowUp,
  ArrowLeft,
  MoveHorizontal,
  MoveVertical,
  Ruler,
  Grid3X3,
  MoreHorizontal,
  Save,
  Tag,
  Info,
} from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  continuousFeed: false,
  topMargin: "0",
  leftMargin: "0",
  stickerWidth: "",
  stickerHeight: "",
  paperWidth: "",
  paperHeight: "",
  stickersPerRow: "",
  rowDistance: "0",
  columnDistance: "0",
  stickersPerSheet: "",
  isDefault: false,
};

const fields = [
  {
    name: "topMargin",
    label: "Additional top margin (In Inches):",
    placeholder: "0",
    icon: ArrowUp,
    required: true,
    numeric: true,
  },
  {
    name: "leftMargin",
    label: "Additional left margin (In Inches):",
    placeholder: "0",
    icon: ArrowLeft,
    required: true,
    numeric: true,
  },
  {
    name: "stickerWidth",
    label: "Width of sticker (In Inches):",
    placeholder: "Width of sticker",
    icon: MoveHorizontal,
    required: true,
    numeric: true,
  },
  {
    name: "stickerHeight",
    label: "Height of sticker (In Inches):",
    placeholder: "Height of sticker",
    icon: MoveVertical,
    required: true,
    numeric: true,
  },
  {
    name: "paperWidth",
    label: "Paper width (In Inches):",
    placeholder: "Paper width",
    icon: Ruler,
    required: true,
    numeric: true,
  },
  {
    name: "paperHeight",
    label: "Paper height (In Inches):",
    placeholder: "Paper height",
    icon: MoveVertical,
    required: true,
    numeric: true,
  },
  {
    name: "stickersPerRow",
    label: "Stickers in one row:",
    placeholder: "Stickers in one row",
    icon: MoreHorizontal,
    required: true,
    numeric: true,
  },
  {
    name: "rowDistance",
    label: "Distance between two rows (In Inches):",
    placeholder: "0",
    icon: MoveVertical,
    required: true,
    numeric: true,
  },
  {
    name: "columnDistance",
    label: "Distance between two columns (In Inches):",
    placeholder: "0",
    icon: MoveHorizontal,
    required: true,
    numeric: true,
  },
  {
    name: "stickersPerSheet",
    label: "No. of Stickers per sheet:",
    placeholder: "No. of Stickers per sheet",
    icon: Grid3X3,
    required: true,
    numeric: true,
  },
];

const inputClass =
  "w-full min-w-0 bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none placeholder:text-slate-400";

function NumberField({ field, value, onChange }) {
  const Icon = field.icon;

  return (
    <label className="block min-w-0">
      <span className="mb-2 flex flex-wrap items-center gap-1 text-xs font-bold text-[#10234F] sm:text-sm">
        {field.label}
        {field.required && <span className="text-orange-600">*</span>}
      </span>

      <div className="flex overflow-hidden rounded-lg border border-[#DCE3EC] bg-white transition focus-within:border-[#FF812B] focus-within:ring-2 focus-within:ring-orange-100">
        <span className="flex w-10 shrink-0 items-center justify-center border-r border-[#DCE3EC] bg-[#F8FAFC] text-slate-600">
          <Icon size={16} />
        </span>

        <input
          type="number"
          min="0"
          step="any"
          required={field.required}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={inputClass}
        />
      </div>
    </label>
  );
}

export default function AddBarcodeStickerSetting({ onSave, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const updateField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter a sticker sheet setting name.");
      return;
    }

    const requiredNumericFields = fields.filter(
      (field) => field.required && form[field.name].trim() === ""
    );

    if (requiredNumericFields.length > 0) {
      setError("Please complete all required sticker dimensions and quantities.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    };

    onSave?.(payload);
    setSaved(true);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] p-3 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6814] to-[#FF812B] text-white shadow-sm">
              <Tag size={21} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#10234F] sm:text-2xl">
                Add barcode sticker setting
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Configure sticker sheet dimensions, spacing and printing options.
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DCE3EC] bg-white px-4 py-2 text-sm font-semibold text-[#10234F] transition hover:bg-orange-50"
            >
              <ArrowLeft size={16} />
              Back to Barcode Settings
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_12px_35px_rgba(16,35,79,0.07)]"
        >
          <div className="space-y-6 p-5 sm:p-8">
            {/* Name */}
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#10234F] sm:text-sm">
                Sticker Sheet setting Name:
                <span className="text-orange-600">*</span>
              </span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Sticker Sheet setting Name"
                className={`${inputClass} rounded-lg border border-[#DCE3EC] transition focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100`}
              />
            </label>

            {/* Description */}
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#10234F] sm:text-sm">
                Sticker Sheet setting Description
              </span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Sticker Sheet setting Description"
                className={`${inputClass} resize-y rounded-lg border border-[#DCE3EC] transition focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100`}
              />
            </label>

            {/* Continuous feed */}
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-[#10234F]">
              <input
                type="checkbox"
                checked={form.continuousFeed}
                onChange={(event) =>
                  updateField("continuousFeed", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 accent-[#FF6814]"
              />
              <span className="font-medium">Continuous feed or rolls</span>
            </label>

            {/* Dimensions and layout */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              {fields.map((field) => (
                <NumberField
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={updateField}
                />
              ))}
            </div>

            {/* Default setting */}
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-[#10234F]">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) =>
                  updateField("isDefault", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 accent-[#FF6814]"
              />
              <span className="font-medium">Set as default</span>
            </label>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {saved && (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Settings submitted successfully.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-center border-t border-[#EEF1F5] bg-[#FCFCFD] px-5 py-5">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <Save size={17} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
