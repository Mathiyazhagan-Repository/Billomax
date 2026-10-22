
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
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const initialExpenses = [];

const columns = [
  { key: "date", label: "Date", width: "70px" },
  { key: "reference", label: "Reference No", width: "105px" },
  { key: "recurring", label: "Recurring details", width: "82px" },
  { key: "category", label: "Expense Category", width: "100px" },
  { key: "subcategory", label: "Sub category", width: "98px" },
  { key: "location", label: "Location", width: "95px" },
  { key: "paymentStatus", label: "Payment Status", width: "100px" },
  { key: "tax", label: "Tax", width: "60px" },
  { key: "amount", label: "Total amount", width: "90px" },
  { key: "due", label: "Payment due", width: "90px" },
  { key: "expenseFor", label: "Expense for", width: "75px" },
];

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ExportButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[25px] shrink-0 items-center gap-1 rounded-md border border-[#AAB9CC] bg-white px-2 text-[10px] font-medium text-[#8798AD] transition hover:border-[#FF8A37] hover:text-[#F47712]"
    >
      <Icon size={11} />
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(100,65,30,0.16)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#10234F]">
            {expense ? "Edit Expense" : "Add Expense"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#71839A] hover:bg-[#FFF0E3]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map(([key, label, type]) => (
            <label
              key={key}
              className="text-xs font-semibold text-[#526780]"
            >
              {label}
              <input
                type={type}
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "0.01" : undefined}
                required={["date", "category", "amount"].includes(key)}
                value={form[key] ?? ""}
                onChange={(event) => update(key, event.target.value)}
                className="mt-1.5 h-9 w-full rounded-md border border-[#D9C7B3] bg-white px-3 text-xs font-normal text-[#10234F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          ))}

          <label className="text-xs font-semibold text-[#526780]">
            Payment Status
            <select
              value={form.paymentStatus}
              onChange={(event) =>
                update("paymentStatus", event.target.value)
              }
              className="mt-1.5 h-9 w-full rounded-md border border-[#D9C7B3] bg-white px-3 text-xs font-normal text-[#10234F] outline-none focus:border-[#FF8A37]"
            >
              <option>Paid</option>
              <option>Partial</option>
              <option>Pending</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#526780] hover:bg-[#FFF5EA]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="h-9 rounded-md bg-[#5145EF] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#4338CA]"
          >
            Save Expense
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Expences() {
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

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      {/* Page heading */}
      <h1 className="mb-4 text-[24px] font-semibold leading-7 text-black">
        Expenses
      </h1>

      {/* Filters card */}
      <section className="mb-4 overflow-visible rounded-[17px] border border-[#F0E0CF] bg-white shadow-[0_7px_20px_rgba(120,75,35,0.07)]">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((current) => !current)}
          className="flex h-[57px] w-full items-center gap-2 rounded-[17px] px-4 text-left text-[20px] font-bold text-[#398FC0]"
        >
          <Filter size={21} fill="currentColor" />
          Filters

          <span className="ml-auto text-[#9BA8B7]">
            {filtersOpen && <ChevronUp size={16} />}
          </span>
        </button>

        {filtersOpen && (
          <div className="grid grid-cols-1 gap-3 border-t border-[#F0E0CF] p-4 sm:grid-cols-3">
            <label className="text-xs font-semibold text-[#526780]">
              Expense Category
              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setPage(1);
                }}
                className="mt-1.5 h-9 w-full rounded-md border border-[#D9C7B3] bg-white px-2 text-xs outline-none focus:border-[#FF8A37]"
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

            <label className="text-xs font-semibold text-[#526780]">
              Payment Status
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="mt-1.5 h-9 w-full rounded-md border border-[#D9C7B3] bg-white px-2 text-xs outline-none focus:border-[#FF8A37]"
              >
                <option value="">All statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#526780] hover:bg-[#FFF5EA]"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* All expenses card */}
      <section className="min-w-0 overflow-visible rounded-[17px] border border-[#F0E0CF] bg-white p-4 shadow-[0_8px_24px_rgba(120,75,35,0.07)] sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[21px] font-extrabold leading-7 text-[#FF9500]">
            All expenses
          </h2>

          <button
            type="button"
            onClick={() => {
              setEditingExpense(null);
              setFormOpen(true);
            }}
            className="inline-flex h-[48px] shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#5145EF] to-[#3983F6] px-4 text-xs font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            <Plus size={17} />
            Add
          </button>
        </div>

        {/* Toolbar */}
        <div className="mb-5 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 whitespace-nowrap text-xs">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value);
                  setPage(1);
                }}
                className="h-[30px] w-[75px] border border-[#D9C7B3] bg-white px-2 text-xs outline-none focus:border-[#FF8A37]"
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
              onClick={() =>
                alert("Connect an Excel export library to generate .xlsx files.")
              }
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
                <div className="absolute left-0 top-full z-30 mt-2 max-h-64 w-52 overflow-y-auto rounded-lg border border-[#F0E0CF] bg-white p-3 shadow-[0_8px_25px_rgba(120,75,35,0.12)]">
                  <p className="mb-2 text-xs font-semibold text-[#10234F]">
                    Show columns
                  </p>

                  {columns.map((column) => (
                    <label
                      key={column.key}
                      className="flex cursor-pointer items-center gap-2 py-1.5 text-xs text-[#526780]"
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
                        className="accent-[#5145EF]"
                      />
                      {column.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <ExportButton
              icon={FileDown}
              onClick={() =>
                alert("Connect a PDF export library to generate PDF reports.")
              }
            >
              Export PDF
            </ExportButton>
          </div>

          <div className="relative w-full shrink-0 xl:w-[167px]">
            <Search
              size={12}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-[#91A0B3]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search ..."
              className="h-[30px] w-full border border-[#D9C7B3] bg-white pl-7 pr-2 text-[11px] outline-none focus:border-[#FF8A37]"
            />
          </div>
        </div>

        {/* Expense table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
            <colgroup>
              <col style={{ width: "60px" }} />
              {visibleTableColumns.map((column) => (
                <col key={column.key} style={{ width: column.width }} />
              ))}
            </colgroup>

            <thead>
              <tr className="bg-white">
                <th className="h-[57px] border border-[#F0E0CF] px-2 py-2 text-[12px] font-bold text-black">
                  Action
                </th>

                {visibleTableColumns.map((column) => (
                  <th
                    key={column.key}
                    className="h-[57px] border border-[#F0E0CF] px-2 py-2 text-[12px] font-bold leading-[17px] text-black"
                  >
                    <button
                      type="button"
                      onClick={() => changeSort(column.key)}
                      className="flex w-full items-center justify-between gap-1 text-left"
                    >
                      <span className="break-words">{column.label}</span>
                      <ArrowUpDown
                        size={13}
                        className={
                          sort.key === column.key
                            ? "shrink-0 text-[#8798AD]"
                            : "shrink-0 text-[#D0D4D9]"
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
                    className="h-[39px] border-x border-[#F0E0CF] bg-[#FBF5ED] px-3 text-center text-[12px] text-[#10234F]"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                pageRows.map((expense) => (
                  <tr
                    key={expense.id}
                    className="bg-white transition hover:bg-[#FFFCF8]"
                  >
                    <td className="border border-[#F0E0CF] px-2 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title="Edit expense"
                          onClick={() => {
                            setEditingExpense(expense);
                            setFormOpen(true);
                          }}
                          className="text-[#398FC0] hover:text-blue-700"
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          title="Delete expense"
                          onClick={() => setDeleteExpense(expense)}
                          className="text-[#D65D43] hover:text-red-700"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>

                    {visibleTableColumns.map((column) => (
                      <td
                        key={column.key}
                        className="break-words border border-[#F0E0CF] px-2 py-2 text-[12px] text-[#10234F]"
                      >
                        {["amount", "due", "tax"].includes(column.key) ? (
                          money(expense[column.key])
                        ) : column.key === "paymentStatus" ? (
                          <span
                            className={`rounded px-1.5 py-1 text-[10px] font-medium ${
                              expense.paymentStatus === "Paid"
                                ? "bg-green-50 text-green-700"
                                : expense.paymentStatus === "Partial"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            {expense.paymentStatus}
                          </span>
                        ) : (
                          expense[column.key] || "—"
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}

              {/* Totals row */}
              <tr className="h-[41px] bg-[#D2D6DE]">
                <td
                  colSpan={
                    Math.max(
                      1,
                      visibleTableColumns.findIndex(
                        (column) => column.key === "amount"
                      ) + 1
                    )
                  }
                  className="border border-white px-3 text-center text-[14px] font-bold text-black"
                >
                  Total:
                </td>

                {visibleTableColumns.map((column, index) => {
                  const amountIndex = visibleTableColumns.findIndex(
                    (item) => item.key === "amount"
                  );

                  if (index < amountIndex) return null;

                  if (column.key === "amount") {
                    return (
                      <td
                        key={column.key}
                        className="border border-white px-2 text-center text-[13px] text-black"
                      >
                        {money(totalAmount)}
                      </td>
                    );
                  }

                  if (column.key === "due") {
                    return (
                      <td
                        key={column.key}
                        className="border border-white px-2 text-center text-[13px] text-black"
                      >
                        {money(totalDue)}
                      </td>
                    );
                  }

                  return (
                    <td key={column.key} className="border border-white" />
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[12px] text-[#10234F]">
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
              className="h-[34px] rounded-l-sm border border-[#E1D7CC] bg-white px-3 text-[12px] text-[#64748B] hover:bg-[#FFF8F0] disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {filteredExpenses.length > 0 && (
              <span className="flex h-[34px] min-w-[34px] items-center justify-center border-y border-[#5145EF] bg-[#5145EF] px-2 text-xs text-white">
                {page}
              </span>
            )}

            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              className="h-[34px] rounded-r-sm border border-[#E1D7CC] bg-white px-3 text-[12px] text-[#64748B] hover:bg-[#FFF8F0] disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </section>

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4"
          onClick={() => setDeleteExpense(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-base font-bold text-[#10234F]">
              Delete expense?
            </h2>

            <p className="mt-2 text-xs text-[#64748B]">
              This will remove the selected expense from the current page state.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteExpense(null)}
                className="rounded-md border border-[#D9C7B3] px-3 py-2 text-xs"
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
                className="rounded-md bg-[#E45138] px-3 py-2 text-xs font-semibold text-white hover:bg-[#C83D2B]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
