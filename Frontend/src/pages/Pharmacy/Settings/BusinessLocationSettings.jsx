
import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Printer,
  Info,
  Save,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const initialSettings = {
  autoPrintInvoice: "Yes",
  receiptPrinterType: "Browser Based Printing",
  invoiceLayout: "Default",
  invoiceScheme: "Default",
};

const inputClass =
  "w-full appearance-none rounded-lg border border-[#DCE3EC] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

function SettingField({ label, icon: Icon, hint, required, value, onChange, options }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#10234F]">
        {label}
        {required && <span className="text-orange-600">*</span>}
        {hint && (
          <span className="text-cyan-500" title={hint}>
            <Info size={14} />
          </span>
        )}
      </span>

      <div className="flex overflow-hidden rounded-lg border border-[#DCE3EC] bg-white transition focus-within:border-[#FF812B] focus-within:ring-2 focus-within:ring-orange-100">
        {Icon && (
          <span className="flex w-10 shrink-0 items-center justify-center border-r border-[#DCE3EC] bg-[#F8FAFC] text-slate-600">
            <Icon size={16} />
          </span>
        )}

        <div className="relative min-w-0 flex-1">
          <select
            value={value}
            onChange={onChange}
            className="w-full appearance-none bg-transparent px-3 py-2.5 pr-9 text-sm text-[#10234F] outline-none"
          >
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
      </div>
    </label>
  );
}

export default function BusinessLocationSettings({
  location,
  onUpdate,
  onBack,
}) {
  const [settings, setSettings] = useState(() => ({
    ...initialSettings,
    ...(location?.settings ?? {}),
  }));
  const [updated, setUpdated] = useState(false);

  const updateField = (field) => (event) => {
    setSettings((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
    setUpdated(false);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    onUpdate?.({ ...settings });
    setUpdated(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] p-3 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DCE3EC] bg-white px-3 py-2 text-sm font-semibold text-[#10234F] transition hover:bg-orange-50"
            >
              <ArrowLeft size={16} />
              Back to Business Locations
            </button>
          )}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6814] to-[#FF812B] text-white shadow-sm">
            <Printer size={21} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#10234F] sm:text-2xl">
              Business Location Settings
              {location?.name ? ` - ${location.name}` : ""}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage receipt and invoice printing preferences for this location.
            </p>
          </div>
        </div>

        {/* Settings panel */}
        <div className="overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_12px_35px_rgba(16,35,79,0.07)]">
          {/* Tab bar */}
          <div className="border-b border-[#E6EDF5] bg-[#FCFCFD] px-5 pt-4 sm:px-7">
            <div className="inline-flex items-center gap-2 border-b-[3px] border-[#FF812B] px-4 pb-3 text-sm font-semibold text-[#10234F]">
              <FileText size={17} className="text-[#FF6814]" />
              Receipt Settings
            </div>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="p-5 sm:p-7">
              <div className="mb-7">
                <h2 className="text-base font-bold text-[#10234F]">
                  Receipt Settings
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  All receipt related settings for this location
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2 xl:max-w-4xl">
                <SettingField
                  label="Auto print invoice after finalizing"
                  icon={FileText}
                  hint="Automatically print the invoice after a sale is finalized."
                  required
                  value={settings.autoPrintInvoice}
                  onChange={updateField("autoPrintInvoice")}
                  options={["Yes", "No"]}
                />

                <SettingField
                  label="Receipt Printer Type"
                  icon={Printer}
                  hint="Choose how receipts should be printed."
                  required
                  value={settings.receiptPrinterType}
                  onChange={updateField("receiptPrinterType")}
                  options={[
                    "Browser Based Printing",
                    "Network Printer",
                    "Windows Printer",
                  ]}
                />

                <SettingField
                  label="Invoice layout"
                  icon={Info}
                  hint="Select the receipt invoice layout."
                  required
                  value={settings.invoiceLayout}
                  onChange={updateField("invoiceLayout")}
                  options={["Default", "Standard", "Compact"]}
                />

                <SettingField
                  label="Invoice scheme"
                  icon={Info}
                  hint="Select the invoice numbering scheme."
                  required
                  value={settings.invoiceScheme}
                  onChange={updateField("invoiceScheme")}
                  options={["Default"]}
                />
              </div>

              {updated && (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 size={18} />
                  Settings updated in the current form state.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-[#EEF1F5] bg-[#FCFCFD] px-5 py-4 sm:px-7">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#E95A0B] hover:to-[#F46B19] focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <Save size={17} />
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
