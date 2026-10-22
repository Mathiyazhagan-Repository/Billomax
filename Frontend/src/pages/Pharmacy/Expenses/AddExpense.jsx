
import { useState } from "react";
import {
  CalendarDays,
  Info,
  Upload,
  Wallet,
  ChevronDown,
  Save,
  ArrowUp,
} from "lucide-react";

const inputClass =
  "h-[35px] w-full min-w-0 rounded-[2px] border border-[#CFD7E2] bg-white px-3 text-[12px] text-[#10234F] outline-none transition focus:border-[#FF8A37] focus:ring-1 focus:ring-[#FF8A37]/20";

const labelClass =
  "mb-1.5 block text-[12px] font-bold text-[#10234F]";

function Field({ label, required, children, hint, info }) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>
        {label}
        {required && <span className="text-[#F04A13]">*</span>}
        {info && (
          <span
            title={info}
            className="ml-1 inline-flex align-middle text-[#20BFE0]"
          >
            <Info size={14} fill="currentColor" className="text-[#20BFE0]" />
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[11px] leading-4 text-[#71839A]">{hint}</p>
      )}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder = "Please Select" }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none pr-8`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#888888]"
      />
    </div>
  );
}

function InputWithIcon({ icon: Icon, children }) {
  return (
    <div className="flex min-w-0">
      <span className="flex h-[35px] w-[37px] shrink-0 items-center justify-center border border-r-0 border-[#CFD7E2] bg-white text-[#526780]">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function AddExpense() {
  const [form, setForm] = useState({
    businessLocation: "",
    category: "",
    subcategory: "",
    reference: "",
    date: "2026-10-19T17:08",
    expenseFor: "None",
    contact: "",
    tax: "None",
    amount: "",
    note: "",
    isRefund: false,
    isRecurring: false,
    recurringInterval: "",
    recurringUnit: "Days",
    repetitions: "",
    paymentAmount: "0.00",
    paidOn: "2026-10-19T05:08",
    paymentMethod: "Cash",
    paymentNote: "",
  });

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const [document, setDocument] = useState(null);
  const [saved, setSaved] = useState(false);

  const [expenses, setExpenses] = useState([]);

  const amount = Number(form.amount) || 0;
  const paymentAmount = Number(form.paymentAmount) || 0;
  const paymentDue = Math.max(0, amount - paymentAmount);

  const submit = (event) => {
    event.preventDefault();

    const expense = {
      ...form,
      id: Date.now(),
      documentName: document?.name || "",
      amount,
      paymentAmount,
      paymentDue,
    };

    setExpenses((current) => [...current, expense]);
    setSaved(true);

    console.log("Expense created:", expense);
  };

  return (
    <main className="min-h-full min-w-0 flex-1 bg-[#FFFAF5] px-3 py-4 font-sans text-[#10234F] sm:px-4">
      <h1 className="mb-4 text-[24px] font-semibold leading-7 text-black">
        Add Expense
      </h1>

      <form onSubmit={submit} className="space-y-5">
        {/* Expense details */}
        <section className="rounded-[5px] border border-[#F0E8E0] bg-white p-4 shadow-[0_5px_18px_rgba(25,43,80,0.04)] sm:p-5">
          <div className="grid grid-cols-1 gap-x-7 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Business Location" required>
              <SelectField
                value={form.businessLocation}
                onChange={(e) => update("businessLocation", e.target.value)}
                options={[
                  { value: "main", label: "Main Pharmacy" },
                  { value: "branch", label: "Branch Pharmacy" },
                ]}
              />
            </Field>

            <Field label="Expense Category">
              <SelectField
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                options={[
                  { value: "rent", label: "Rent" },
                  { value: "salary", label: "Salary" },
                  { value: "utilities", label: "Utilities" },
                  { value: "transport", label: "Transportation" },
                  { value: "maintenance", label: "Maintenance" },
                  { value: "other", label: "Other" },
                ]}
              />
            </Field>

            <Field label="Sub category">
              <SelectField
                value={form.subcategory}
                onChange={(e) => update("subcategory", e.target.value)}
                options={[
                  { value: "electricity", label: "Electricity" },
                  { value: "water", label: "Water" },
                  { value: "internet", label: "Internet" },
                  { value: "other", label: "Other" },
                ]}
              />
            </Field>

            <Field
              label="Reference No"
              hint="Leave empty to autogenerate"
            >
              <input
                value={form.reference}
                onChange={(e) => update("reference", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Date" required>
              <InputWithIcon icon={CalendarDays}>
                <input
                  type="datetime-local"
                  required
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className={`${inputClass} bg-white`}
                />
              </InputWithIcon>
            </Field>

            <Field label="Expense for" info="Select what this expense relates to.">
              <SelectField
                value={form.expenseFor}
                onChange={(e) => update("expenseFor", e.target.value)}
                placeholder="None"
                options={[
                  { value: "customer", label: "Customer" },
                  { value: "supplier", label: "Supplier" },
                  { value: "employee", label: "Employee" },
                ]}
              />
            </Field>

            <Field label="Attach Document" hint="Max file size: 5MB. Allowed: PDF, CSV, ZIP, DOC, DOCX, JPEG, JPG, PNG.">
              <div className="flex h-[35px] min-w-0">
                <input
                  readOnly
                  value={document?.name || ""}
                  className={`${inputClass} min-w-0 rounded-r-none`}
                  aria-label="Selected document"
                />
                <label className="flex shrink-0 cursor-pointer items-center gap-1 rounded-r-[3px] bg-[#1877F2] px-3 text-[11px] font-semibold text-white transition hover:bg-[#1265D6]">
                  <Upload size={14} />
                  Browse...
                  <input
                    type="file"
                    accept=".pdf,.csv,.zip,.doc,.docx,.jpeg,.jpg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        alert("File size must not exceed 5MB.");
                        e.target.value = "";
                        return;
                      }

                      setDocument(file);
                    }}
                  />
                </label>
              </div>
            </Field>

            <Field label="Applicable Tax">
              <SelectField
                value={form.tax}
                onChange={(e) => update("tax", e.target.value)}
                placeholder="None"
                options={[
                  { value: "5", label: "GST 5%" },
                  { value: "12", label: "GST 12%" },
                  { value: "18", label: "GST 18%" },
                  { value: "28", label: "GST 28%" },
                ]}
              />
            </Field>

            <Field label="Total amount" required>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                placeholder="Total amount"
                className={inputClass}
              />
            </Field>

            <Field label="Expense note">
              <textarea
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                rows={3}
                className="min-h-[74px] w-full resize-y rounded-[2px] border border-[#CFD7E2] bg-white px-3 py-2 text-[12px] text-[#10234F] outline-none focus:border-[#FF8A37] focus:ring-1 focus:ring-[#FF8A37]/20"
              />
            </Field>

            <div className="flex items-start pt-2 md:pt-8">
              <label className="flex cursor-pointer items-center gap-3 text-[12px] font-bold text-[#10234F]">
                <input
                  type="checkbox"
                  checked={form.isRefund}
                  onChange={(e) => update("isRefund", e.target.checked)}
                  className="h-[22px] w-[22px] accent-[#5145EF]"
                />
                Is refund?
                <Info size={14} className="text-[#20BFE0]" />
              </label>
            </div>
          </div>
        </section>

        {/* Recurring expense settings */}
        <section className="rounded-[5px] border border-[#F0E8E0] bg-white p-4 shadow-[0_5px_18px_rgba(25,43,80,0.04)] sm:p-5">
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3 md:gap-7">
            <div className="flex items-center pt-1 md:pt-4">
              <label className="flex cursor-pointer items-center gap-3 text-[12px] font-bold text-[#10234F]">
                <input
                  type="checkbox"
                  checked={form.isRecurring}
                  onChange={(e) => update("isRecurring", e.target.checked)}
                  className="h-[22px] w-[22px] accent-[#5145EF]"
                />
                Is Recurring?
                <Info size={14} className="text-[#20BFE0]" />
              </label>
            </div>

            <Field label="Recurring interval" required={form.isRecurring}>
              <div className="flex">
                <input
                  type="number"
                  min="1"
                  disabled={!form.isRecurring}
                  value={form.recurringInterval}
                  onChange={(e) =>
                    update("recurringInterval", e.target.value)
                  }
                  className={`${inputClass} rounded-r-none disabled:bg-[#F3F4F6]`}
                />
                <select
                  disabled={!form.isRecurring}
                  value={form.recurringUnit}
                  onChange={(e) => update("recurringUnit", e.target.value)}
                  className="h-[35px] w-[105px] shrink-0 border border-l-0 border-[#CFD7E2] bg-white px-2 text-[12px] text-[#526780] outline-none disabled:bg-[#F3F4F6]"
                >
                  <option>Days</option>
                  <option>Weeks</option>
                  <option>Months</option>
                  <option>Years</option>
                </select>
              </div>
            </Field>

            <Field
              label="No. of Repetitions"
              hint="If blank, the expense will be generated indefinitely."
            >
              <input
                type="number"
                min="1"
                disabled={!form.isRecurring}
                value={form.repetitions}
                onChange={(e) => update("repetitions", e.target.value)}
                className={`${inputClass} disabled:bg-[#F3F4F6]`}
              />
            </Field>
          </div>
        </section>

        {/* Add payment */}
        <section className="rounded-[17px] border border-[#F0E8E0] bg-white p-4 shadow-[0_8px_24px_rgba(25,43,80,0.07)] sm:p-6">
          <h2 className="mb-5 text-[21px] font-extrabold leading-7 text-[#FF9500]">
            Add payment
          </h2>

          <div className="grid grid-cols-1 gap-x-7 gap-y-4 md:grid-cols-2">
            <Field label="Amount" required>
              <InputWithIcon icon={Wallet}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.paymentAmount}
                  onChange={(e) => update("paymentAmount", e.target.value)}
                  className={`${inputClass} rounded-l-none`}
                />
              </InputWithIcon>
            </Field>

            <Field label="Paid on" required>
              <InputWithIcon icon={CalendarDays}>
                <input
                  type="datetime-local"
                  required
                  value={form.paidOn}
                  onChange={(e) => update("paidOn", e.target.value)}
                  className={`${inputClass} rounded-l-none`}
                />
              </InputWithIcon>
            </Field>

            <Field label="Payment Method" required>
              <InputWithIcon icon={Wallet}>
                <select
                  required
                  value={form.paymentMethod}
                  onChange={(e) => update("paymentMethod", e.target.value)}
                  className={`${inputClass} rounded-l-none`}
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                </select>
              </InputWithIcon>
            </Field>

            <div className="hidden md:block" />

            <div className="md:col-span-2">
              <Field label="Payment note">
                <textarea
                  rows={3}
                  value={form.paymentNote}
                  onChange={(e) => update("paymentNote", e.target.value)}
                  className="min-h-[74px] w-full resize-y rounded-[2px] border border-[#CFD7E2] bg-white px-3 py-2 text-[12px] text-[#10234F] outline-none focus:border-[#FF8A37] focus:ring-1 focus:ring-[#FF8A37]/20"
                />
              </Field>
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-[#D8D8D8] pt-5">
            <p className="text-[12px] font-bold text-[#10234F]">
              Payment due:{" "}
              <span className="font-normal">{paymentDue.toFixed(2)}</span>
            </p>
          </div>
        </section>

        {/* Save action */}
        <div className="flex flex-col items-center justify-center gap-3 pb-2">
          <button
            type="submit"
            className="inline-flex h-[48px] min-w-[88px] items-center justify-center gap-2 rounded-[9px] bg-[#716BFF] px-6 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#5D56F2]"
          >
            <Save size={15} />
            Save
          </button>

          {saved && (
            <p className="text-[12px] font-medium text-green-700">
              Expense added to the current page state.
            </p>
          )}
        </div>
      </form>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-40 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-[#3478F6] text-white shadow-[0_5px_14px_rgba(52,120,246,0.35)] transition hover:bg-[#2164E0]"
      >
        <ArrowUp size={22} strokeWidth={3} />
      </button>
    </main>
  );
}
