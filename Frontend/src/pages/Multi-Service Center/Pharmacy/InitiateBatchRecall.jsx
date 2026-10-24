
import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  PackageSearch,
  CalendarDays,
  Hash,
  ShieldAlert,
  Save,
} from "lucide-react";

const initialForm = {
  product: "",
  lotNumber: "",
  recallDate: "2026-10-23",
  affectedQuantity: "0",
  status: "Initiated",
  recallReason: "",
};

export default function InitiateBatchRecall({
  isOpen = true,
  onClose = () => {},
  onSubmit,
  products = [],
  initialData,
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

    if (!form.product) {
      setError("Please select a product.");
      return;
    }

    if (!form.lotNumber.trim()) {
      setError("Lot / batch number is required.");
      return;
    }

    if (!form.recallDate) {
      setError("Recall date is required.");
      return;
    }

    if (!form.recallReason.trim()) {
      setError("Recall reason is required.");
      return;
    }

    if (
      form.affectedQuantity === "" ||
      Number(form.affectedQuantity) < 0
    ) {
      setError("Affected quantity must be zero or greater.");
      return;
    }

    if (!onSubmit) {
      setError("Connect your existing batch recall submit handler.");
      return;
    }

    try {
      setSaving(true);
      await onSubmit({ ...form });
      onClose();
    } catch (err) {
      setError(err?.message || "Unable to initiate the batch recall.");
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
        aria-labelledby="batch-recall-title"
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#E6EDF5] bg-[#FFFAF5] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
              <AlertTriangle size={21} />
            </div>

            <div>
              <h2
                id="batch-recall-title"
                className="text-lg font-bold text-white sm:text-xl"
              >
                Initiate Batch Recall
              </h2>
              <p className="mt-0.5 text-xs text-white/85">
                Product batch and recall information
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
            <section className="rounded-xl border border-[#E6EDF5] bg-white p-4 sm:p-6">
              <div className="mb-5 flex items-center gap-2 border-b border-[#EEF1F5] pb-4">
                <ShieldAlert size={18} className="text-[#FF6814]" />
                <h3 className="text-sm font-bold text-[#10234F]">
                  Recall Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-6">
                {/* Product */}
                <div className="md:col-span-3">
                  <label className={labelClass} htmlFor="recall-product">
                    <PackageSearch size={14} className="text-[#FF6814]" />
                    Product <span className="text-[#FF6814]">*</span>
                  </label>

                  <select
                    id="recall-product"
                    required
                    value={form.product}
                    onChange={(event) =>
                      updateField("product", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Search product by name or SKU...</option>
                    {products.map((product) => (
                      <option
                        key={product.id ?? product.value ?? product.sku}
                        value={product.id ?? product.value ?? product.sku}
                      >
                        {product.name ?? product.label}
                        {product.sku ? ` (${product.sku})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lot / Batch Number */}
                <div className="md:col-span-3">
                  <label className={labelClass} htmlFor="recall-lot">
                    <Hash size={14} className="text-[#FF6814]" />
                    Lot / Batch Number <span className="text-[#FF6814]">*</span>
                  </label>

                  <input
                    id="recall-lot"
                    required
                    value={form.lotNumber}
                    onChange={(event) =>
                      updateField("lotNumber", event.target.value)
                    }
                    placeholder="Enter lot number"
                    className={inputClass}
                  />
                </div>

                {/* Recall Date */}
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="recall-date">
                    <CalendarDays size={14} className="text-[#FF6814]" />
                    Recall Date <span className="text-[#FF6814]">*</span>
                  </label>

                  <input
                    id="recall-date"
                    type="date"
                    required
                    value={form.recallDate}
                    onChange={(event) =>
                      updateField("recallDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                {/* Affected Quantity */}
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="affected-quantity">
                    Affected Quantity
                  </label>

                  <input
                    id="affected-quantity"
                    type="number"
                    min="0"
                    step="any"
                    value={form.affectedQuantity}
                    onChange={(event) =>
                      updateField("affectedQuantity", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="recall-status">
                    Status
                  </label>

                  <select
                    id="recall-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="Initiated">Initiated</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Recall Reason */}
                <div className="md:col-span-6">
                  <label className={labelClass} htmlFor="recall-reason">
                    Recall Reason <span className="text-[#FF6814]">*</span>
                  </label>

                  <textarea
                    id="recall-reason"
                    required
                    rows={3}
                    value={form.recallReason}
                    onChange={(event) =>
                      updateField("recallReason", event.target.value)
                    }
                    placeholder="Reason for recalling this batch..."
                    className="mt-1.5 min-h-24 w-full resize-y rounded-lg border border-[#DCE3ED] bg-white px-3 py-3 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
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
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AlertTriangle size={16} />
              {saving ? "Initiating..." : "Initiate Recall"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
