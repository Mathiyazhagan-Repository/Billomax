
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  Printer,
  Columns3,
  FileDown,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  X,
  ReceiptText,
  ArrowUp,
  CalendarDays,
  Wallet,
} from "lucide-react";

const initialExpenses = [];

const columns = [
  { key: "date", label: "Date", width: "105px" },
  { key: "reference", label: "Reference No", width: "130px" },
  { key: "recurring", label: "Recurring details", width: "145px" },
  { key: "category", label: "Expense Category", width: "150px" },
  { key: "subcategory", label: "Sub category", width: "140px" },
  { key: "location", label: "Location", width: "125px" },
  { key: "paymentStatus", label: "Payment Status", width: "130px" },
  { key: "tax", label: "Tax", width: "100px" },
  { key: "amount", label: "Total amount", width: "130px" },
  { key: "due", label: "Payment due", width: "130px" },
  { key: "expenseFor", label: "Expense for", width: "130px" },
  { key: "contact", label: "Contact", width: "140px" },
  { key: "expenseNote", label: "Expense note", width: "155px" },
  { key: "addedBy", label: "Added By", width: "120px" },
];

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border border-[#E8EDF4] bg-white px-3 text-sm font-normal text-[#132653] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

const labelClass = "block text-xs font-semibold text-[#557493]";

function ExportButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 text-xs font-semibold text-[#19366F] shadow-sm transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function ExpenseForm({ expense, onClose, onSave }) {
  const [form, setForm] = useState(
    expense || {
      date: new Date().toISOString().slice(0, 10),
      reference: "",
      recurring: "",
      category: "",
      subcategory: "",
      location: "Pharmacy",
      paymentStatus: "Paid",
      tax: 0,
      amount: "",
      due: 0,
      expenseFor: "",
      contact: "",
      expenseNote: "",
      addedBy: "",
    }
  );

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const fields = [
    ["date", "Date", "date"],
    ["reference", "Reference No", "text"],
    ["recurring", "Recurring details", "text"],
    ["category", "Expense Category", "text"],
    ["subcategory", "Sub category", "text"],
    ["location", "Location", "text"],
    ["amount", "Total amount (₹)", "number"],
    ["tax", "Tax (₹)", "number"],
    ["due", "Payment due (₹)", "number"],
    ["expenseFor", "Expense for", "text"],
    ["contact", "Contact", "text"],
    ["expenseNote", "Expense note", "text"],
    ["addedBy", "Added By", "text"],
  ];

  const submit = (event) => {
    event.preventDefault();

    onSave({
      ...form,
      id: expense?.id ?? Date.now(),
      amount: Number(form.amount) || 0,
      tax: Number(form.tax) || 0,
      due: Number(form.due) || 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_20px_60px_rgba(16,35,79,0.18)]"
      >
        <div className="flex items-center gap-3 rounded-t-2xl border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-5 py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
            <ReceiptText size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[#10234F]">
              {expense ? "Edit Expense" : "Add Expense"}
            </h2>
            <p className="mt-0.5 text-xs text-[#6B829D]">
              Enter the expense details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-[#577B9F] transition hover:bg-[#FFF1E5] hover:text-[#F04A13]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          {fields.map(([key, label, type]) => (
            <label key={key} className={labelClass}>
              {label}
              <input
                type={type}
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "0.01" : undefined}
                required={["date", "category", "amount"].includes(key)}
                value={form[key] ?? ""}
                onChange={(event) => update(key, event.target.value)}
                className={inputClass}
              />
            </label>
          ))}

          <label className={labelClass}>
            Payment Status
            <select
              value={form.paymentStatus}
              onChange={(event) =>
                update("paymentStatus", event.target.value)
              }
              className={inputClass}
            >
              <option>Paid</option>
              <option>Partial</option>
              <option>Pending</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#F2E8DE] bg-[#FFFAF5]/70 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-[#E8EDF4] bg-white px-4 text-sm font-semibold text-[#19366F] transition hover:bg-[#FFFAF5]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#FF711A] px-5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:bg-[#F04A13]"
          >
            <Plus size={15} />
            Save Expense
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Expences({ onNavigate }) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    key: "date",
    direction: "asc",
  });
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);

  const filteredExpenses = useMemo(() => {
    const result = expenses.filter((expense) => {
      const matchesSearch = Object.values(expense).some((value) =>
        String(value ?? "").toLowerCase().includes(search.toLowerCase())
      );

      return (
        matchesSearch &&
        (!categoryFilter || expense.category === categoryFilter) &&
        (!statusFilter || expense.paymentStatus === statusFilter)
      );
    });

    return [...result].sort((a, b) => {
      const first = a[sort.key] ?? "";
      const second = b[sort.key] ?? "";

      const comparison =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second), undefined, {
              numeric: true,
            });

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [expenses, search, categoryFilter, statusFilter, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredExpenses.length / Number(pageSize))
  );

  const pageRows = filteredExpenses.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize)
  );

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const totalDue = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.due || 0),
    0
  );

  const visibleTableColumns = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );

  const saveExpense = (expense) => {
    setExpenses((current) => {
      const exists = current.some((item) => item.id === expense.id);

      return exists
        ? current.map((item) => (item.id === expense.id ? expense : item))
        : [...current, expense];
    });

    setFormOpen(false);
    setEditingExpense(null);
  };

  const exportCSV = () => {
    if (!filteredExpenses.length) {
      alert("No expense records available to export.");
      return;
    }

    const csvColumns = [
      { key: "action", label: "Action" },
      ...visibleTableColumns,
    ];

    const csv = [
      csvColumns.map((column) => column.label).join(","),
      ...filteredExpenses.map((expense) =>
        csvColumns
          .map((column) => {
            const value =
              column.key === "action" ? "" : expense[column.key] ?? "";

            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const changeSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setCategoryFilter("");
    setStatusFilter("");
    setSearch("");
    setPage(1);
  };

  const openAddExpense = () => {
    if (onNavigate) {
      onNavigate("Add Expense");
      return;
    }

    setEditingExpense(null);
    setFormOpen(true);
  };

  const exportPlaceholder = (format) =>
    alert(
      `${format} export needs to be connected to an export library. CSV export is available.`
    );

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      {/* Page heading */}
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
            <ReceiptText size={14} strokeWidth={2.5} />
            <span className="text-[11px] font-extrabold">PHARMACY · EXPENSES</span>
          </div>

          <h1 className="app-page-title text-[#10234F]">
            Expenses
          </h1>

          <p className="mt-1 text-xs leading-relaxed text-[#577B9F] sm:text-sm">
            Manage and track your pharmacy expenses.
          </p>
        </div>

      </header>

      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="group relative flex min-h-[84px] items-center gap-2.5 overflow-hidden rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FFE5AD] text-[#F47700]">
              <Wallet size={22} strokeWidth={2.8} />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-bold tracking-[-0.2px] text-[#526D8D]">
                Total Expenses
              </p>
              <p className="text-[18px] font-extrabold leading-none tracking-[-0.3px] text-[#101C3D]">
                {money(totalAmount)}
              </p>
            </div>
          </div>
        </section>

        <section className="group relative flex min-h-[84px] items-center gap-2.5 overflow-hidden rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#CDE6FF] text-[#087AF0]">
              <CalendarDays size={22} strokeWidth={2.8} />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-bold tracking-[-0.2px] text-[#526D8D]">
                Total Payment Due
              </p>
              <p className="text-[18px] font-extrabold leading-none tracking-[-0.3px] text-[#101C3D]">
                {money(totalDue)}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Filters */}
      <section className="mb-5 overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/90 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((current) => !current)}
          className="flex h-[57px] w-full items-center gap-2 rounded-2xl px-4 text-left text-base font-extrabold text-[#10234F] transition hover:bg-[#FFFAF5]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
            <Filter size={17} />
          </span>
          Filters
          <span className="ml-auto text-[#577B9F]">
            {filtersOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </span>
        </button>

        {filtersOpen && (
          <div className="grid grid-cols-1 gap-4 border-t border-[#F2E8DE] bg-[#FFFEFC] p-4 sm:grid-cols-3">
            <label className={labelClass}>
              Expense Category
              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="">All categories</option>
                {[...new Set(expenses.map((expense) => expense.category))]
                  .filter(Boolean)
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </label>

            <label className={labelClass}>
              Payment Status
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className={inputClass}
              >
                <option value="">All statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </label>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 rounded-lg border border-[#E8EDF4] bg-white px-4 text-xs font-bold text-[#19366F] shadow-sm transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* All expenses */}
      <section className="min-w-0 overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
              <ReceiptText size={20} />
            </div>
            <div>
              <h2 className="app-section-title text-[#10234F]">
                All <span className="text-[#FF711A]">expenses</span>
              </h2>
              <p className="mt-0.5 text-xs text-[#6B829D]">
                Review, search, and manage expense records.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddExpense}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#FF711A] px-4 text-xs font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:bg-[#F04A13]"
          >
            <Plus size={15} />
            Add Expense
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-3 p-4 sm:p-5 xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-[#526D8D]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value);
                  setPage(1);
                }}
                className="h-9 w-[75px] rounded-lg border border-[#E8EDF4] bg-white px-2 text-xs text-[#132653] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
            </label>

            <ExportButton icon={FileText} onClick={exportCSV}>
              Export CSV
            </ExportButton>

            <ExportButton
              icon={FileSpreadsheet}
              onClick={() => exportPlaceholder("Excel")}
            >
              Export Excel
            </ExportButton>

            <ExportButton icon={Printer} onClick={() => window.print()}>
              Print
            </ExportButton>

            <div className="relative">
              <ExportButton
                icon={Columns3}
                onClick={() => setColumnsOpen((current) => !current)}
              >
                Column visibility
              </ExportButton>

              {columnsOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 max-h-64 w-56 overflow-y-auto rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-[0_8px_25px_rgba(16,35,79,0.12)]">
                  <p className="mb-2 text-xs font-semibold text-[#10234F]">
                    Show columns
                  </p>

                  {columns.map((column) => (
                    <label
                      key={column.key}
                      className="flex cursor-pointer items-center gap-2 py-1.5 text-xs text-[#526D8D]"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(column.key)}
                        onChange={() =>
                          setVisibleColumns((current) =>
                            current.includes(column.key)
                              ? current.filter((key) => key !== column.key)
                              : [...current, column.key]
                          )
                        }
                        className="accent-[#FF711A]"
                      />
                      {column.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <ExportButton
              icon={FileDown}
              onClick={() => exportPlaceholder("PDF")}
            >
              Export PDF
            </ExportButton>
          </div>

          <div className="relative w-full shrink-0 xl:w-[210px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search expenses..."
              className="h-10 w-full rounded-lg border border-[#E8EDF4] bg-white pl-9 pr-3 text-xs text-[#132653] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            />
          </div>
        </div>

        {/* Table: Action + 14 expense columns */}
        <div className="mx-4 overflow-x-auto rounded-xl border border-[#E8EDF4] sm:mx-5">
          <table className="w-full min-w-[1900px] table-fixed border-collapse text-left">
            <colgroup>
              <col style={{ width: "82px" }} />
              {visibleTableColumns.map((column) => (
                <col key={column.key} style={{ width: column.width }} />
              ))}
            </colgroup>

            <thead>
              <tr className="bg-[#FFF7EF]">
                <th className="app-table-heading h-12 border-b border-[#F2E8DE] px-3 py-2 text-[#19366F]">
                  Action
                </th>

                {visibleTableColumns.map((column) => (
                  <th
                    key={column.key}
                    className="app-table-heading h-12 border-b border-[#F2E8DE] px-3 py-2 leading-4 text-[#19366F]"
                  >
                    <button
                      type="button"
                      onClick={() => changeSort(column.key)}
                      className="flex w-full items-center justify-between gap-2 text-left"
                    >
                      <span>{column.label}</span>
                      <ArrowUpDown
                        size={13}
                        className={
                          sort.key === column.key
                            ? "shrink-0 text-[#FF711A]"
                            : "shrink-0 text-[#A3B1C2]"
                        }
                      />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleTableColumns.length + 1}
                    className="h-32 border-b border-[#F2E8DE] bg-white px-3 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE9D9] text-[#F04A13]">
                        <ReceiptText size={23} />
                      </div>
                      <p className="text-sm font-bold text-[#10234F]">
                        No data available in table
                      </p>
                      <p className="text-xs text-[#8798AD]">
                        There are no expense records available at the moment.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((expense) => (
                  <tr
                    key={expense.id}
                    className="transition odd:bg-white even:bg-[#FFFCF8] hover:bg-[#FFF1E5]/70"
                  >
                    <td className="border-b border-r border-[#F2E8DE] px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="Edit expense"
                          onClick={() => {
                            setEditingExpense(expense);
                            setFormOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-[#1475F8] transition hover:bg-[#EAF3FF] hover:text-[#10234F]"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          title="Delete expense"
                          onClick={() => setDeleteExpense(expense)}
                          className="rounded-lg p-1.5 text-[#E45138] transition hover:bg-red-50 hover:text-[#C83D2B]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>

                    {visibleTableColumns.map((column) => (
                      <td
                        key={column.key}
                        className="app-table-cell break-words border-b border-r border-[#F2E8DE] px-3 py-3 text-[#19366F] last:border-r-0"
                      >
                        {["amount", "due", "tax"].includes(column.key) ? (
                          money(expense[column.key])
                        ) : column.key === "paymentStatus" ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              expense.paymentStatus === "Paid"
                                ? "bg-[#E9F9F1] text-[#168553]"
                                : expense.paymentStatus === "Partial"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {expense.paymentStatus || "—"}
                          </span>
                        ) : column.key === "date" && expense.date ? (
                          expense.date
                        ) : (
                          expense[column.key] || "—"
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}

              {/* Totals row */}
              <tr className="h-12 bg-[#FFF1E5]">
                {(() => {
                  const amountIndex = visibleTableColumns.findIndex(
                    (column) => column.key === "amount"
                  );
                  const dueIndex = visibleTableColumns.findIndex(
                    (column) => column.key === "due"
                  );
                  const firstTotalIndex = Math.min(
                    amountIndex < 0 ? Infinity : amountIndex,
                    dueIndex < 0 ? Infinity : dueIndex
                  );

                  if (firstTotalIndex === Infinity) {
                    return (
                      <td
                        colSpan={visibleTableColumns.length + 1}
                        className="border-b border-r border-white px-3 text-center text-sm font-bold text-[#10234F]"
                      >
                        Total:
                      </td>
                    );
                  }

                  return (
                    <>
                      <td
                        colSpan={firstTotalIndex + 1}
                        className="border-b border-r border-white px-3 text-center text-sm font-bold text-[#10234F]"
                      >
                        Total:
                      </td>

                      {visibleTableColumns
                        .slice(firstTotalIndex)
                        .map((column) => (
                          <td
                            key={column.key}
                            className="border-b border-r border-white px-3 text-center text-xs font-bold text-[#10234F]"
                          >
                            {column.key === "amount"
                              ? money(totalAmount)
                              : column.key === "due"
                                ? money(totalDue)
                                : ""}
                          </td>
                        ))}
                    </>
                  );
                })()}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex flex-col justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <p className="text-xs text-[#526D8D]">
            Showing{" "}
            {filteredExpenses.length
              ? (page - 1) * Number(pageSize) + 1
              : 0}{" "}
            to {Math.min(page * Number(pageSize), filteredExpenses.length)} of{" "}
            {filteredExpenses.length} entries
          </p>

          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="h-9 rounded-l-lg border border-[#E8EDF4] bg-white px-3 text-xs font-semibold text-[#577B9F] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {filteredExpenses.length > 0 && (
              <span className="flex h-9 min-w-9 items-center justify-center border-y border-[#FF711A] bg-[#FF711A] px-2 text-xs font-bold text-white">
                {page}
              </span>
            )}

            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              className="h-9 rounded-r-lg border border-[#E8EDF4] bg-white px-3 text-xs font-semibold text-[#577B9F] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Print button */}
      <div className="mb-4 mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#FF711A] px-4 text-xs font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:bg-[#F04A13]"
        >
          <Printer size={15} />
          Print
        </button>
      </div>

      {/* Footer */}
      <footer className="relative -mx-4 mt-5 border-t border-[#F2E8DE] bg-[#FFFAF5] px-4 pb-4 pt-5 sm:-mx-5 sm:px-5">
        <p className="text-center text-[11px] leading-5 text-[#526D8D]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - Your
          Trusted Partner in Billing &amp; Invoicing - V6.3 | Copyright ©
          2026 All rights reserved.
        </p>

        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 z-40 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-[#1475F8] text-white shadow-[0_5px_14px_rgba(20,117,248,0.25)] transition hover:bg-[#0865DF]"
        >
          <ArrowUp size={23} strokeWidth={3} />
        </button>
      </footer>

      {/* Add / Edit modal */}
      {formOpen && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => {
            setFormOpen(false);
            setEditingExpense(null);
          }}
          onSave={saveExpense}
        />
      )}

      {/* Delete confirmation */}
      {deleteExpense && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/45 p-4 backdrop-blur-sm"
          onClick={() => setDeleteExpense(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_20px_60px_rgba(16,35,79,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#F2E8DE] bg-[#FFF7EF] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E45138]">
                <Trash2 size={19} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#10234F]">
                  Delete expense?
                </h2>
                <p className="mt-0.5 text-xs text-[#6B829D]">
                  This action removes the selected record.
                </p>
              </div>
            </div>

            <p className="px-5 py-4 text-sm leading-6 text-[#526D8D]">
              This will remove the selected expense from the current page state.
            </p>

            <div className="flex justify-end gap-2 border-t border-[#F2E8DE] bg-[#FFFAF5]/70 px-5 py-4">
              <button
                type="button"
                onClick={() => setDeleteExpense(null)}
                className="rounded-lg border border-[#E8EDF4] bg-white px-4 py-2 text-xs font-bold text-[#19366F] transition hover:bg-[#FFFAF5]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setExpenses((current) =>
                    current.filter((item) => item.id !== deleteExpense.id)
                  );
                  setDeleteExpense(null);
                }}
                className="rounded-lg bg-[#E45138] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#C83D2B]"
              >
                Delete Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
