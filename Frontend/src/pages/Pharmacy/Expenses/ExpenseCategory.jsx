
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
} from "lucide-react";

const initialCategories = [
  { id: 1, name: "House rent", code: "House rent" },
  { id: 2, name: "medical", code: "26444" },
  { id: 3, name: "misliense", code: "misliense" },
  { id: 4, name: "school", code: "251school" },
  { id: 5, name: "Tea", code: "tea" },
];

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

function CategoryModal({ category, onClose, onSave }) {
  const [name, setName] = useState(category?.name || "");
  const [code, setCode] = useState(category?.code || "");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !code.trim()) return;

    onSave({
      id: category?.id ?? Date.now(),
      name: name.trim(),
      code: code.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#10234F]">
            {category ? "Edit Expense Category" : "Add Expense Category"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#71839A] hover:bg-[#FFF0E3]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#10234F]">
            Category name <span className="text-[#F04A13]">*</span>
            <input
              required
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter category name"
              className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal outline-none focus:border-[#FF8A37] focus:ring-1 focus:ring-[#FF8A37]/20"
            />
          </label>

          <label className="block text-xs font-bold text-[#10234F]">
            Category code <span className="text-[#F04A13]">*</span>
            <input
              required
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter category code"
              className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal outline-none focus:border-[#FF8A37] focus:ring-1 focus:ring-[#FF8A37]/20"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#526780] hover:bg-[#FFF5EA]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="h-9 rounded-md bg-gradient-to-r from-[#5145EF] to-[#3983F6] px-4 text-xs font-semibold text-white hover:brightness-105"
          >
            {category ? "Update Category" : "Save Category"}
          </button>
        </div>
      </form>
    </div>
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
  const [visibleColumns, setVisibleColumns] = useState([
    "name",
    "code",
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const columns = [
    { key: "name", label: "Category name" },
    { key: "code", label: "Category code" },
  ];

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

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      {/* Page heading */}
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-[24px] font-semibold leading-7 text-black">
          Expense Categories
        </h1>

        <p className="text-[14px] text-[#526780]">
          Manage your expense categories
        </p>
      </div>

      {/* Main categories card */}
      <section className="min-w-0 rounded-[17px] border border-[#F0E0CF] bg-white p-4 shadow-[0_8px_24px_rgba(120,75,35,0.07)] sm:p-5">
        {/* Section heading and Add button */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[21px] font-extrabold leading-7 text-[#FF9500]">
            All your expense categories
          </h2>

          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setModalOpen(true);
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
                className="h-[30px] w-[75px] border border-[#CFD7E2] bg-white px-2 text-xs text-[#526780] outline-none focus:border-[#FF8A37]"
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
                <div className="absolute left-0 top-full z-30 mt-2 w-48 rounded-lg border border-[#F0E0CF] bg-white p-3 shadow-lg">
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

          {/* Search */}
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
              className="h-[30px] w-full border border-[#CFD7E2] bg-white pl-7 pr-2 text-[11px] outline-none focus:border-[#FF8A37]"
            />
          </div>
        </div>

        {/* Categories table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[520px] table-fixed border-collapse text-left">
            <colgroup>
              <col style={{ width: "32%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "38%" }} />
            </colgroup>

            <thead>
              <tr className="bg-white">
                {columns.map(
                  (column) =>
                    visibleColumns.includes(column.key) && (
                      <th
                        key={column.key}
                        className="h-[38px] border border-[#F0E8E0] px-2 text-[12px] font-bold text-black"
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
                                ? "shrink-0 text-[#8A929C]"
                                : "shrink-0 text-[#CDD1D7]"
                            }
                          />
                        </button>
                      </th>
                    )
                )}

                <th className="h-[38px] border border-[#F0E8E0] px-2 text-[12px] font-bold text-black">
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
                    className="h-[45px] border border-[#F0E8E0] bg-[#FBF9F6] px-3 text-center text-[12px] text-[#526780]"
                  >
                    No data available in table
                  </td>
                </tr>
              ) : (
                pageRows.map((category, index) => (
                  <tr
                    key={category.id}
                    className={`transition hover:bg-[#FFF5EA] ${
                      index % 2 === 0 ? "bg-[#FAFAFA]" : "bg-white"
                    }`}
                  >
                    {visibleColumns.includes("name") && (
                      <td className="h-[45px] border border-[#F0E8E0] px-2 text-[12px] text-[#10234F]">
                        {category.name}
                      </td>
                    )}

                    {visibleColumns.includes("code") && (
                      <td className="h-[45px] border border-[#F0E8E0] px-2 text-[12px] text-[#10234F]">
                        {category.code}
                      </td>
                    )}

                    <td className="border border-[#F0E8E0] px-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(category);
                            setModalOpen(true);
                          }}
                          className="inline-flex h-[25px] items-center gap-1 rounded-lg border border-[#716BFF] px-2 text-[11px] font-medium text-[#625BFF] transition hover:bg-[#716BFF] hover:text-white"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingCategory(category)}
                          className="inline-flex h-[25px] items-center gap-1 rounded-lg border border-[#FF4D5A] px-2 text-[11px] font-medium text-[#FF3F4D] transition hover:bg-[#FF4D5A] hover:text-white"
                        >
                          <Trash2 size={12} />
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
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[12px] text-[#10234F]">
            Showing{" "}
            {filteredCategories.length
              ? (page - 1) * Number(pageSize) + 1
              : 0}{" "}
            to {Math.min(page * Number(pageSize), filteredCategories.length)}{" "}
            of {filteredCategories.length} entries
          </p>

          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="h-[34px] rounded-l-sm border border-[#E1D7CC] bg-white px-3 text-[12px] text-[#64748B] hover:bg-[#FFF8F0] disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {filteredCategories.length > 0 && (
              <span className="flex h-[34px] min-w-[34px] items-center justify-center border-y border-[#3983F6] bg-[#3983F6] px-2 text-xs text-white">
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

      {/* Add / edit modal */}
      {modalOpen && (
        <CategoryModal
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4"
          onClick={() => setDeletingCategory(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-base font-bold text-[#10234F]">
              Delete expense category?
            </h2>

            <p className="mt-2 text-xs text-[#64748B]">
              Are you sure you want to delete "{deletingCategory.name}"?
              This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="rounded-md border border-[#D9C7B3] px-3 py-2 text-xs text-[#526780]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteCategory}
                className="rounded-md bg-[#FF4D5A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#E63D49]"
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
