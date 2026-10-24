
import React, { useState } from "react";
import { X, ArrowLeft, CalendarDays, IndianRupee, FileText } from "lucide-react";

export default function AddDiscount({
  isOpen = true,
  onClose = () => {},
  onSubmit = () => {},
  fullPage = false,
}) {
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    note: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.date) {
      nextErrors.date = "Date is required.";
    }

    if (
      formData.amount === "" ||
      !Number.isFinite(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      nextErrors.amount = "Enter an amount greater than zero.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      date: formData.date,
      amount: Number(formData.amount),
      note: formData.note,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={
        fullPage
          ? "min-h-screen bg-[#FFFAF5] px-4 py-5 text-[#10234F] sm:px-6 sm:py-6"
          : "fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[2px] sm:p-6"
      }
      onMouseDown={(event) => {
        if (!fullPage && event.target === event.currentTarget) onClose();
      }}
    >
      {fullPage && (
        <div className="mx-auto mb-4 w-full max-w-3xl">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D7DFEA] bg-white px-4 py-2.5 text-sm font-semibold text-[#10234F] transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Customer History
          </button>
        </div>
      )}
      <section
        role={fullPage ? undefined : "dialog"}
        aria-modal={fullPage ? undefined : "true"}
        aria-labelledby="add-discount-title"
        className={`w-full overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white ${
          fullPage
            ? "mx-auto max-w-3xl shadow-[0_8px_28px_rgba(16,35,79,0.07)]"
            : "max-w-[600px] shadow-[0_24px_80px_rgba(16,35,79,0.22)]"
        }`}
      >
        {/* Modal header */}
        <header className="flex items-center justify-between border-b border-[#E9EDF3] bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF6814]">
              Customer Management
            </p>
            <h2
              id="add-discount-title"
              className="mt-1 text-xl font-bold tracking-tight text-[#10234F]"
            >
              Add Discount
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Add Discount"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#10234F]"
          >
            <X size={20} />
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-5 py-6 sm:px-6">
            {/* Date */}
            <div>
              <label
                htmlFor="discount-date"
                className="flex items-center gap-2 text-sm font-semibold text-[#10234F]"
              >
                <CalendarDays size={16} className="text-[#FF6814]" />
                Date:<span className="text-rose-500">*</span>
              </label>

              <input
                id="discount-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={`mt-2 w-full rounded-lg border bg-white px-3 py-3 text-sm text-[#10234F] outline-none transition focus:border-[#1680FF] focus:ring-2 focus:ring-blue-100 ${
                  errors.date ? "border-rose-400" : "border-[#D7DFEA]"
                }`}
                aria-invalid={Boolean(errors.date)}
              />

              {errors.date && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">
                  {errors.date}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="discount-amount"
                className="flex items-center gap-2 text-sm font-semibold text-[#10234F]"
              >
                <IndianRupee size={16} className="text-[#FF6814]" />
                Amount:<span className="text-rose-500">*</span>
              </label>

              <div
                className={`mt-2 flex overflow-hidden rounded-lg border bg-white transition focus-within:border-[#1680FF] focus-within:ring-2 focus-within:ring-blue-100 ${
                  errors.amount ? "border-rose-400" : "border-[#D7DFEA]"
                }`}
              >
                <span className="flex items-center border-r border-[#E6EDF5] bg-[#F7F9FC] px-3 text-sm font-semibold text-[#65728A]">
                  ₹
                </span>

                <input
                  id="discount-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="min-w-0 flex-1 px-3 py-3 text-sm text-[#10234F] outline-none"
                  aria-invalid={Boolean(errors.amount)}
                />
              </div>

              {errors.amount && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Note */}
            <div>
              <label
                htmlFor="discount-note"
                className="flex items-center gap-2 text-sm font-semibold text-[#10234F]"
              >
                <FileText size={16} className="text-[#FF6814]" />
                Note:
              </label>

              <textarea
                id="discount-note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Note"
                rows={4}
                className="mt-2 w-full resize-y rounded-lg border border-[#D7DFEA] bg-white px-3 py-3 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#1680FF] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Footer actions */}
          <footer className="flex flex-col-reverse justify-end gap-3 border-t border-[#E9EDF3] bg-[#FCFCFE] px-5 py-4 sm:flex-row sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg bg-[#273444] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#172231]"
            >
              Close
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#7775FF] to-[#5D70F5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#6462F4] hover:to-[#4B5FE5] focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              Submit
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
