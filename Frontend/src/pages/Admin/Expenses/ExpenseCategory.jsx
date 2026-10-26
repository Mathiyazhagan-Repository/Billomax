
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  FileSpreadsheet,
  Printer,
  Columns3,
  FileDown,
  ArrowUpDown,
  Pencil,
  Trash2,
  X,
  ArrowUp,
  ReceiptText,
  Tags,
  Hash,
} from "lucide-react";
import EditExpenseCategoryModal from "./EditExpenseCategoryModal.jsx";

const initialCategories = [
  { id: 1, name: "House rent", code: "House rent" },
  { id: 2, name: "medical", code: "26444" },
  { id: 3, name: "misliense", code: "misliense" },
  { id: 4, name: "school", code: "251school" },
  { id: 5, name: "Tea", code: "tea" },
];

const columns = [
  { key: "name", label: "Category name" },
  { key: "code", label: "Category code" },
];

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border border-[#E8EDF4] bg-white px-3 text-[13px] font-normal text-[#132653] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

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

export default function ExpenseCategory() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    key: "name",
    direction: "asc",
  });
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(["name", "code"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.code.toLowerCase().includes(query)
    );

    return [...result].sort((a, b) => {
      const comparison = a[sort.key].localeCompare(b[sort.key], undefined, {
        numeric: true,
        sensitivity: "base",
      });

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [categories, search, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredCategories.length / Number(pageSize))
  );

  const pageRows = filteredCategories.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize)
  );

  const saveCategory = (category) => {
    setCategories((current) => {
      const exists = current.some((item) => item.id === category.id);

      return exists
        ? current.map((item) =>
            item.id === category.id ? category : item
          )
        : [...current, category];
    });

    setModalOpen(false);
    setEditingCategory(null);
  };

  const deleteCategory = () => {
    setCategories((current) =>
      current.filter((item) => item.id !== deletingCategory.id)
    );

    setDeletingCategory(null);
    setPage((current) => Math.min(current, pageCount));
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

  const exportCSV = () => {
    if (!filteredCategories.length) {
      alert("No expense categories available to export.");
      return;
    }

    const activeColumns = columns.filter((column) =>
      visibleColumns.includes(column.key)
    );

    const csv = [
      activeColumns.map((column) => column.label).join(","),
      ...filteredCategories.map((category) =>
        activeColumns
          .map(
            (column) =>
              `"${String(category[column.key] ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expense-categories.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPlaceholder = (format) =>
    alert(
      `${format} export needs to be connected to an export library. CSV export is available.`
    );

  const resetSearch = () => {
    setSearch("");
    setPage(1);
  };

  const startIndex = filteredCategories.length
    ? (page - 1) * Number(pageSize) + 1
    : 0;

  const endIndex = Math.min(
    page * Number(pageSize),
    filteredCategories.length
  );

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      {/* Page heading */}
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
            <ReceiptText size={13} />
            <span className="text-[11px] font-extrabold">PHARMACY · EXPENSES</span>
          </div>

          <h1 className="app-page-title text-[#10234F]">
            Expense Categories
          </h1>

          <p className="mt-1 text-xs leading-relaxed text-[#577B9F] sm:text-sm">
            Manage your expense categories and category codes.
          </p>
        </div>

        {/* <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#FF711A] px-4 text-sm font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.2)] transition hover:-translate-y-0.5 hover:bg-[#F04A13]"
        >
          <Plus size={17} />
          Add Category
        </button> */}
      </header>

      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="flex min-h-[84px] items-center rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFE5AD] text-[#F47700]">
              <Tags size={21} />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-bold text-[#577B9F]">
                Total Categories
              </p>
              <p className="text-[18px] font-extrabold leading-none text-[#101C3D]">
                {categories.length}
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-[84px] items-center rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-[0_3px_8px_rgba(25,43,80,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#CDE6FF] text-[#087AF0]">
              <Hash size={21} />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-bold text-[#577B9F]">
                Matching Categories
              </p>
              <p className="text-[18px] font-extrabold leading-none text-[#101C3D]">
                {filteredCategories.length}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Main categories card */}
      <section className="min-w-0 overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
              <Tags size={20} />
            </div>
            <div>
              <h2 className="app-section-title text-[#10234F]">
                All your <span className="text-[#FF711A]">expense categories</span>
              </h2>
              <p className="mt-0.5 text-xs text-[#577B9F]">
                View, search, and manage category records.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setModalOpen(true);
            }}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[14px] bg-[#FF621F] px-6 py-2.5 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(255,98,31,0.28)] transition-all hover:bg-[#E95510] hover:shadow-[0_6px_18px_rgba(255,98,31,0.38)] active:translate-y-px"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-3 p-4 sm:p-5 xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-[#577B9F]">
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
                <div className="absolute left-0 top-full z-30 mt-2 w-56 rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-[0_8px_25px_rgba(16,35,79,0.12)]">
                  <p className="mb-2 text-xs font-semibold text-[#10234F]">
                    Show columns
                  </p>

                  {columns.map((column) => (
                    <label
                      key={column.key}
                      className="flex cursor-pointer items-center gap-2 py-1.5 text-xs text-[#577B9F]"
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

          {/* Search */}
          <div className="relative w-full shrink-0 xl:w-[230px]">
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
              placeholder="Search categories..."
              className="h-10 w-full rounded-lg border border-[#E8EDF4] bg-white pl-9 pr-9 text-xs text-[#132653] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={resetSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#8798AD] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Categories table */}
        <div className="mx-4 overflow-x-auto rounded-xl border border-[#E8EDF4] sm:mx-5">
          <table className="w-full min-w-[650px] table-fixed border-collapse text-left">
            <colgroup>
              {visibleColumns.includes("name") && (
                <col style={{ width: "36%" }} />
              )}
              {visibleColumns.includes("code") && (
                <col style={{ width: "30%" }} />
              )}
              <col style={{ width: "34%" }} />
            </colgroup>

            <thead>
              <tr className="bg-[#FFF7EF]">
                {columns.map(
                  (column) =>
                    visibleColumns.includes(column.key) && (
                      <th
                        key={column.key}
                        className="app-table-heading h-12 border-b border-r border-[#F2E8DE] px-4 text-[#19366F] last:border-r-0"
                      >
                        <button
                          type="button"
                          onClick={() => changeSort(column.key)}
                          className="flex w-full items-center justify-between gap-2 text-left"
                        >
                          {column.label}
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
                    )
                )}
                <th className="app-table-heading h-12 border-b border-[#F2E8DE] px-4 text-[#19366F]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      visibleColumns.filter((key) =>
                        columns.some((column) => column.key === key)
                      ).length + 1
                    }
                    className="h-36 border-b border-[#F2E8DE] bg-white px-3 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                        <Tags size={21} />
                      </div>
                      <p className="text-sm font-bold text-[#10234F]">
                        No data available in table
                      </p>
                      <p className="text-xs text-[#8798AD]">
                        Try another search or add a new expense category.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((category, index) => (
                  <tr
                    key={category.id}
                    className={`app-table-cell transition hover:bg-[#FFF1E5]/70 ${
                      index % 2 === 0 ? "bg-white" : "bg-[#FFFCF8]"
                    }`}
                  >
                    {visibleColumns.includes("name") && (
                      <td className="h-[54px] border-b border-r border-[#F2E8DE] px-4 font-medium text-[#19366F]">
                        {category.name}
                      </td>
                    )}

                    {visibleColumns.includes("code") && (
                      <td className="h-[54px] border-b border-r border-[#F2E8DE] px-4 text-[#577B9F]">
                        <span className="inline-flex rounded-md border border-[#E8EDF4] bg-[#F4F9FF] px-2.5 py-1 font-medium text-[#19366F]">
                          {category.code}
                        </span>
                      </td>
                    )}

                    <td className="border-b border-[#F2E8DE] px-4 py-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(category);
                            setModalOpen(true);
                          }}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#DCEAFF] bg-[#EEF6FF] px-3 text-[11px] font-bold text-[#087AF0] transition hover:border-[#1475F8] hover:bg-[#1475F8] hover:text-white"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingCategory(category)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#FAD9D4] bg-[#FFF5F3] px-3 text-[11px] font-semibold text-[#D94A3A] transition hover:border-[#D94A3A] hover:bg-[#D94A3A] hover:text-white"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex flex-col justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <p className="text-xs text-[#577B9F]">
            Showing {startIndex} to {endIndex} of {filteredCategories.length}{" "}
            entries
          </p>

          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="h-9 rounded-l-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {filteredCategories.length > 0 && (
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
              className="h-9 rounded-r-lg border border-[#E8EDF4] bg-white px-3 text-xs font-bold text-[#19366F] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative -mx-4 mt-5 border-t border-[#F2E8DE] bg-[#FFFAF5] px-4 pb-4 pt-5 sm:-mx-5 sm:px-5">
        <p className="text-center text-[11px] leading-5 text-[#577B9F]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - Your
          Trusted Partner in Billing &amp; Invoicing - V6.3 | Copyright ©
          2026 All rights reserved.
        </p>
      </footer>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-40 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-[#1475F8] text-white shadow-[0_5px_14px_rgba(20,117,248,0.25)] transition hover:bg-[#0865DF]"
      >
        <ArrowUp size={22} strokeWidth={3} />
      </button>

      {/* Add / edit modal */}
      {modalOpen && (
        <EditExpenseCategoryModal
          open={modalOpen}
          category={editingCategory}
          onClose={() => {
            setModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={saveCategory}
        />
      )}

      {/* Delete confirmation */}
      {deletingCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/45 p-4 backdrop-blur-sm"
          onClick={() => setDeletingCategory(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_20px_60px_rgba(16,35,79,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#F2E8DE] bg-[#FFF7EF] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#D94A3A]">
                <Trash2 size={19} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#10234F]">
                  Delete expense category?
                </h2>
                <p className="mt-0.5 text-xs text-[#577B9F]">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="px-5 py-4 text-sm leading-6 text-[#577B9F]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#10234F]">
                "{deletingCategory.name}"
              </span>
              ?
            </p>

            <div className="flex justify-end gap-2 border-t border-[#F2E8DE] bg-[#FFFAF5]/70 px-5 py-4">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="h-9 rounded-lg border border-[#E8EDF4] bg-white px-4 text-xs font-bold text-[#19366F] transition hover:bg-[#FFFAF5]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteCategory}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#D94A3A] px-4 text-xs font-semibold text-white transition hover:bg-[#C83D2B]"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
