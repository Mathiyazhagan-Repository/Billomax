
import React, { useState } from "react";
import { X, Info, Check, Save, FileText } from "lucide-react";

export default function AddInvoiceScheme({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [numberingType, setNumberingType] = useState("Sequential");
  const [format, setFormat] = useState("");
  const [error, setError] = useState("");

  const formats = [
    { id: "standard", label: "FORMAT:", example: "XXXX", value: "XXXX" },
    {
      id: "year",
      label: "FORMAT:",
      example: "2026-XXXX",
      value: "2026-XXXX",
    },
  ];

  const handleSave = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter an invoice scheme name.");
      return;
    }

    if (!format) {
      setError("Please select an invoice number format.");
      return;
    }

    const scheme = {
      name: name.trim(),
      numberingType,
      format,
    };

    onSave?.(scheme);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/60 p-3 backdrop-blur-[2px] sm:p-5">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEF1F5] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
              <FileText size={19} />
            </div>
            <h2 className="text-lg font-semibold text-[#10234F]">
              Add new invoice scheme
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="space-y-5 p-5">
            {/* Number format selection */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_1fr]">
              {formats.map((item) => {
                const selected = format === item.value;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFormat(item.value);
                      setError("");
                    }}
                    className={`relative flex min-h-[92px] flex-col items-start justify-center rounded-xl border-2 px-4 py-3 text-left transition ${
                      selected
                        ? "border-[#FF812B] bg-orange-50 ring-2 ring-orange-100"
                        : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-orange-200 hover:bg-orange-50/50"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF812B] text-white">
                        <Check size={12} />
                      </span>
                    )}

                    <span className="text-sm font-medium text-slate-500">
                      {item.label}
                    </span>
                    <span className="mt-1 text-lg font-semibold tracking-wide text-[#10234F]">
                      {item.example}
                    </span>
                  </button>
                );
              })}

              <div className="flex min-h-[92px] flex-col justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white px-3 py-3 sm:border-0 sm:px-1">
                <span className="text-sm font-bold text-[#10234F]">
                  Preview:
                </span>
                <span className="mt-2 break-all text-sm text-slate-600">
                  {format
                    ? format.replace("XXXX", "0001")
                    : "Not selected"}
                </span>
              </div>
            </div>

            {/* Scheme name */}
            <div>
              <label
                htmlFor="scheme-name"
                className="mb-2 block text-sm font-semibold text-[#10234F]"
              >
                Name:<span className="text-orange-600">*</span>
              </label>
              <input
                id="scheme-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                placeholder="Name"
                required
                className="w-full rounded-lg border border-[#DCE3EC] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Numbering type */}
            <div>
              <label
                htmlFor="numbering-type"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#10234F]"
              >
                Numbering Type:<span className="text-orange-600">*</span>
                <span
                  title="Choose how invoice numbers are generated."
                  className="text-cyan-500"
                >
                  <Info size={15} />
                </span>
              </label>

              <select
                id="numbering-type"
                value={numberingType}
                onChange={(event) => setNumberingType(event.target.value)}
                className="w-full rounded-lg border border-[#DCE3EC] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
              >
                <option value="Sequential">Sequential</option>
              </select>
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#EEF1F5] bg-[#FCFCFD] px-5 py-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <Save size={16} />
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#283341] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B2430]"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
