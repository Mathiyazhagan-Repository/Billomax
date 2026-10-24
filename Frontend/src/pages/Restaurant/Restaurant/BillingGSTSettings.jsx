import React, { useState } from "react";
import { ReceiptText, Percent, Save, CheckCircle2 } from "lucide-react";

export default function BillingGSTSettings() {
  const [gst, setGst] = useState("5");
  const [serviceCharge, setServiceCharge] = useState("10");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    // Connect your API here to persist these settings.
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#10234F] outline-none transition placeholder:text-[#94A3B8] focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70";

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-6 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page heading */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6814]">
            <ReceiptText size={25} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Billing & GST Settings
            </h1>
            <p className="mt-1 text-sm text-[#718096]">
              Configure tax and service charges for restaurant bills.
            </p>
          </div>
        </div>

        {/* Settings card */}
        <form
          onSubmit={handleSave}
          className="overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]"
        >
          <div className="border-b border-[#EEF1F5] bg-gradient-to-r from-white to-orange-50/60 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-2">
              <Percent size={19} className="text-[#FF6814]" />
              <h2 className="text-lg font-extrabold">
                Tax & Service Charges
              </h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718096]">
              Set the GST and service-charge percentages applied to every
              restaurant bill. Set GST to 0 if you are not charging GST — no
              GST line will appear on the bill.
            </p>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            {/* GST */}
            <div>
              <label
                htmlFor="gst"
                className="block text-sm font-bold text-[#10234F]"
              >
                GST (%)
                <span className="ml-1 font-medium text-[#718096]">
                  — total, split evenly into CGST + SGST
                </span>
              </label>

              <div className="relative">
                <input
                  id="gst"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={gst}
                  onChange={(e) => {
                    setGst(e.target.value);
                    setSaved(false);
                  }}
                  className={inputClass}
                  required
                />
                <span className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-sm font-bold text-[#8491A5]">
                  %
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#8491A5]">
                e.g. 5 → 2.5% CGST + 2.5% SGST on every bill.
              </p>

              {Number(gst) > 0 && Number(gst) <= 100 && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                  <span className="text-sm text-[#60728D]">
                    CGST / SGST split
                  </span>
                  <span className="text-sm font-extrabold text-blue-700">
                    {(Number(gst) / 2).toLocaleString("en-IN")}% each
                  </span>
                </div>
              )}
            </div>

            {/* Service charge */}
            <div>
              <label
                htmlFor="serviceCharge"
                className="block text-sm font-bold text-[#10234F]"
              >
                Service Charge (%)
              </label>

              <div className="relative">
                <input
                  id="serviceCharge"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={serviceCharge}
                  onChange={(e) => {
                    setServiceCharge(e.target.value);
                    setSaved(false);
                  }}
                  className={inputClass}
                  required
                />
                <span className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-sm font-bold text-[#8491A5]">
                  %
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#8491A5]">
                Set 0 to not apply a service charge.
              </p>
            </div>

            {/* Save */}
            <div className="flex flex-col gap-3 border-t border-[#EEF1F5] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#8491A5]">
                Changes should be saved to apply to future bills.
              </p>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200"
              >
                <Save size={17} />
                Save Settings
              </button>
            </div>

            {saved && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
              >
                <CheckCircle2 size={18} />
                Settings validated. Connect your backend API to save them
                permanently.
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}