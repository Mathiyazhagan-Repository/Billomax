
import React, { useState } from "react";
import { ArrowLeft, Save, Sparkles, CalendarDays, ShoppingBag } from "lucide-react";

export default function AIOfferRules({ onBack }) {
  const [rules, setRules] = useState({
    panel: "Pharmacy",
    regularDays: "10",
    occasionalDays: "30",
    crossSellDays: "30",
    crossSellNotes: "",
  });

  const [saved, setSaved] = useState(false);

  const updateField = (field, value) => {
    setRules((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-[#DCE3ED] bg-white px-3 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#10234F]";

  const handleSave = () => {
    // Connect your existing save API here.
    // This UI-only handler does not persist rules to the backend.
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-[#FF6814]">
              <Sparkles size={16} />
              AI Configuration
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#10234F]">
              AI Offer Rules
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Configure regular offers, occasional offers and cross-sell timing.
            </p>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg border border-[#DCE3ED] bg-white px-4 py-2.5 text-sm font-semibold text-[#10234F] transition hover:bg-orange-50"
            >
              <ArrowLeft size={16} />
              Back to AI Offer Suggestions
            </button>
          )}
        </div>

        {/* Main card */}
        <section className="overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="border-b border-[#E6EDF5] px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
                <ShoppingBag size={21} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#FF812B]">
                  Panel Rules
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Set offer intervals for each business panel.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {/* Panel */}
            <div className="mb-6 max-w-sm">
              <label className={labelClass} htmlFor="panel">
                Panel
              </label>
              <select
                id="panel"
                value={rules.panel}
                onChange={(event) =>
                  updateField("panel", event.target.value)
                }
                className={inputClass}
              >
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>

            {/* Rule fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className={labelClass} htmlFor="regularDays">
                  <span className="mb-1 flex items-center gap-2">
                    <CalendarDays size={15} className="text-[#FF6814]" />
                    Regular Days
                  </span>
                </label>
                <input
                  id="regularDays"
                  type="number"
                  min="0"
                  value={rules.regularDays}
                  onChange={(event) =>
                    updateField("regularDays", event.target.value)
                  }
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Current value: 10 days
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="occasionalDays">
                  <span className="mb-1 flex items-center gap-2">
                    <CalendarDays size={15} className="text-[#FF6814]" />
                    Occasional Days
                  </span>
                </label>
                <input
                  id="occasionalDays"
                  type="number"
                  min="0"
                  value={rules.occasionalDays}
                  onChange={(event) =>
                    updateField("occasionalDays", event.target.value)
                  }
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Current value: 30 days
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="crossSellDays">
                  <span className="mb-1 flex items-center gap-2">
                    <CalendarDays size={15} className="text-[#FF6814]" />
                    Cross-Sell Days
                  </span>
                </label>
                <input
                  id="crossSellDays"
                  type="number"
                  min="0"
                  value={rules.crossSellDays}
                  onChange={(event) =>
                    updateField("crossSellDays", event.target.value)
                  }
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Current value: 30 days
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="crossSellNotes">
                  Cross-Sell Notes
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>
                <input
                  id="crossSellNotes"
                  type="text"
                  value={rules.crossSellNotes}
                  onChange={(event) =>
                    updateField("crossSellNotes", event.target.value)
                  }
                  placeholder="Example: Biryani → Mushroom Biryani"
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Add an optional cross-sell suggestion.
                </p>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-7 flex flex-col gap-3 border-t border-[#E6EDF5] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Review the rule values before saving your configuration.
              </p>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              >
                <Save size={17} />
                Save Rules
              </button>
            </div>

            {saved && (
              <p
                role="status"
                className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
              >
                Values are ready. Connect your existing backend save API to
                persist these rules.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
