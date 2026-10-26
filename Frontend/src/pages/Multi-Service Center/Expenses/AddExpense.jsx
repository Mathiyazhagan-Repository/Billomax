
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Info,
  Upload,
  Wallet,
  ChevronDown,
  Save,
  ArrowUp,
  ReceiptText,
  MapPin,
  RefreshCw,
  FileText,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

const inputClass =
  "h-10 w-full min-w-0 rounded-lg border border-[#E8EDF4] bg-white px-3 text-[13px] text-[#132653] outline-none transition placeholder:text-[#8798AD] hover:border-[#D8E1EB] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10 disabled:cursor-not-allowed disabled:bg-[#F5F7FA] disabled:text-[#94A3B8]";

const labelClass =
  "mb-1.5 flex items-center text-[12px] font-semibold text-[#19366F]";

function Field({ label, required, children, hint, info }) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>
        {label}
        {required && <span className="ml-0.5 text-[#FF711A]">*</span>}
        {info && (
          <span
            title={info}
            className="ml-1.5 inline-flex cursor-help text-[#1475F8]"
          >
            <Info size={14} />
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[11px] leading-4 text-[#577B9F]">
          {hint}
        </p>
      )}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder = "Please Select",
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none pr-9`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#577B9F]"
      />
    </div>
  );
}

function InputWithIcon({ icon: Icon, children }) {
  return (
    <div className="flex min-w-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-[#E8EDF4] bg-[#FFF7EF] text-[#F04A13]">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description, accent = "orange" }) {
  const isBlue = accent === "blue";

  return (
    <div className="mb-5 flex items-center gap-3 border-b border-[#F2E8DE] pb-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isBlue
            ? "bg-[#CDE6FF] text-[#087AF0]"
            : "bg-[#FFE9D9] text-[#F04A13]"
        }`}
      >
        <Icon size={19} />
      </div>
      <div>
        <h2 className="app-section-title text-[#10234F]">{title}</h2>
        {description && (
          <p className="app-description mt-0.5 text-[#577B9F]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AddExpense({ onBack }) {
  const [form, setForm] = useState({
    businessLocation: "msc",
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

  const handleDocumentChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5MB.");
      event.target.value = "";
      return;
    }

    setDocument(file);
  };

  return (
    <main className="min-h-full min-w-0 flex-1 bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      {/* Page heading */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
            <ReceiptText size={13} />
            <span className="text-[11px] font-extrabold">MULTI-SERVICE CENTER · EXPENSES</span>
          </div>

          <h1 className="app-page-title text-[#10234F]">
            Add Expense
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-[#577B9F] sm:text-sm">
            Record and manage your Multi-Service Center expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-4 py-2.5 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5]"
            >
              <ArrowLeft size={17} />
              Back
            </button>
          )}
          <div className="hidden items-center gap-2 rounded-xl border border-[#F2E8DE] bg-white px-3 py-2.5 shadow-[0_3px_8px_rgba(25,43,80,0.04)] sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#CDE6FF] text-[#087AF0]">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-[#577B9F]">
                Expense entry
              </p>
              <p className="text-xs font-bold text-[#10234F]">
                New transaction
              </p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={submit} className="space-y-5">
        {/* Expense details */}
        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="p-4 sm:p-5 lg:p-6">
            <SectionHeader
              icon={ReceiptText}
              title="Expense details"
              description="Enter the expense information and transaction details."
            />

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Business Location" required>
                <SelectField
                  value={form.businessLocation}
                  onChange={(e) =>
                    update("businessLocation", e.target.value)
                  }
                  options={[
                    { value: "msc", label: "Multi-Service Center" },
                    { value: "msc-branch", label: "Multi-Service Center Branch" },
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
                    className={`${inputClass} rounded-l-none`}
                  />
                </InputWithIcon>
              </Field>

              <Field
                label="Expense for"
                info="Select what this expense relates to."
              >
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

              <Field
                label="Attach Document"
                hint="Max 5MB. PDF, CSV, ZIP, DOC, DOCX, JPEG, JPG or PNG."
              >
                <div className="flex h-10 min-w-0">
                  <input
                    readOnly
                    value={document?.name || ""}
                    className={`${inputClass} min-w-0 rounded-r-none`}
                    aria-label="Selected document"
                  />
                  <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-r-lg bg-[#FF711A] px-3 text-[11px] font-bold text-white transition hover:bg-[#F04A13]">
                    <Upload size={14} />
                    Browse
                    <input
                      type="file"
                      accept=".pdf,.csv,.zip,.doc,.docx,.jpeg,.jpg,.png"
                      className="hidden"
                      onChange={handleDocumentChange}
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
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#FF711A]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                    placeholder="Total amount"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </Field>

              <div className="md:col-span-2 xl:col-span-2">
                <Field label="Expense note">
                  <textarea
                    value={form.note}
                    onChange={(e) => update("note", e.target.value)}
                    rows={3}
                    className="min-h-[82px] w-full resize-y rounded-lg border border-[#E8EDF4] bg-white px-3 py-2.5 text-[13px] text-[#132653] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  />
                </Field>
              </div>

              <div className="flex items-start pt-1 xl:pt-7">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#F2E8DE] bg-[#FFFAF5] px-4 py-3 text-[12px] font-semibold text-[#19366F] transition hover:border-[#FFB77C]">
                  <input
                    type="checkbox"
                    checked={form.isRefund}
                    onChange={(e) =>
                      update("isRefund", e.target.checked)
                    }
                    className="h-[17px] w-[17px] accent-[#FF711A]"
                  />
                  Is refund?
                  <Info size={14} className="text-[#1475F8]" />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Recurring expense settings */}
        <section className="overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white/95 shadow-[0_6px_18px_rgba(33,85,150,0.06)]">
          <div className="p-4 sm:p-5 lg:p-6">
            <SectionHeader
              icon={RefreshCw}
              title="Recurring expense settings"
              description="Configure whether this expense repeats automatically."
              accent="blue"
            />

            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3 md:gap-6">
              <div className="flex items-start">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E6EDF5] bg-[#F4F9FF] px-4 py-3 text-[12px] font-semibold text-[#19366F] transition hover:border-[#B8D9FF]">
                  <input
                    type="checkbox"
                    checked={form.isRecurring}
                    onChange={(e) =>
                      update("isRecurring", e.target.checked)
                    }
                    className="h-[17px] w-[17px] accent-[#FF711A]"
                  />
                  Is Recurring?
                  <Info size={14} className="text-[#1475F8]" />
                </label>
              </div>

              <Field
                label="Recurring interval"
                required={form.isRecurring}
              >
                <div className="flex min-w-0">
                  <input
                    type="number"
                    min="1"
                    disabled={!form.isRecurring}
                    value={form.recurringInterval}
                    onChange={(e) =>
                      update("recurringInterval", e.target.value)
                    }
                    className={`${inputClass} rounded-r-none`}
                  />
                  <select
                    disabled={!form.isRecurring}
                    value={form.recurringUnit}
                    onChange={(e) =>
                      update("recurringUnit", e.target.value)
                    }
                    className="h-10 w-[105px] shrink-0 rounded-r-lg border border-l-0 border-[#E8EDF4] bg-white px-2 text-[12px] text-[#19366F] outline-none focus:border-[#FF8A37] disabled:bg-[#F5F7FA]"
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
                  onChange={(e) =>
                    update("repetitions", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Add payment */}
        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="p-4 sm:p-5 lg:p-6">
            <SectionHeader
              icon={CreditCard}
              title="Add payment"
              description="Enter payment details for this expense."
            />

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <Field label="Amount" required>
                <InputWithIcon icon={Wallet}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.paymentAmount}
                    onChange={(e) =>
                      update("paymentAmount", e.target.value)
                    }
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
                    onChange={(e) =>
                      update("paymentMethod", e.target.value)
                    }
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
                    onChange={(e) =>
                      update("paymentNote", e.target.value)
                    }
                    className="min-h-[82px] w-full resize-y rounded-lg border border-[#E8EDF4] bg-white px-3 py-2.5 text-[13px] text-[#132653] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  />
                </Field>
              </div>
            </div>

            {/* Payment summary */}
            <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#F2E8DE] pt-5 sm:grid-cols-3">
              <div className="rounded-xl border border-[#E6EDF5] bg-[#F4F9FF] p-3.5">
                <p className="text-[11px] font-semibold text-[#577B9F]">
                  Total expense
                </p>
                <p className="mt-1 text-base font-bold text-[#10234F]">
                  ₹ {amount.toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl border border-[#DCEAFF] bg-[#EEF6FF] p-3.5">
                <p className="text-[11px] font-semibold text-[#577B9F]">
                  Payment amount
                </p>
                <p className="mt-1 text-base font-extrabold text-[#087AF0]">
                  ₹ {paymentAmount.toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl border border-[#F8EBDD] bg-[#FFF7EF] p-3.5">
                <p className="text-[11px] font-semibold text-[#577B9F]">
                  Payment due
                </p>
                <p className="mt-1 text-base font-extrabold text-[#FF711A]">
                  ₹ {paymentDue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Save action */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-[11px] leading-5 text-[#577B9F]">
            Fields marked with <span className="font-bold text-[#FF711A]">*</span>{" "}
            are required.
          </p>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FF711A] px-7 text-[13px] font-extrabold text-white shadow-[0_4px_10px_rgba(255,113,26,0.2)] transition hover:-translate-y-0.5 hover:bg-[#F04A13] active:translate-y-0"
          >
            <Save size={16} />
            Save Expense
          </button>
        </div>

        {saved && (
          <div className="flex items-start gap-3 rounded-xl border border-[#BDEBD1] bg-[#EEFBF4] p-4 text-[#168553]">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold">Expense saved</p>
              <p className="mt-1 text-xs leading-5">
                Expense added to the current page state.
              </p>
            </div>
          </div>
        )}
      </form>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="fixed bottom-5 right-5 z-40 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-[#1475F8] text-white shadow-[0_5px_14px_rgba(20,117,248,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0865DF]"
      >
        <ArrowUp size={22} strokeWidth={3} />
      </button>
    </main>
  );
}
