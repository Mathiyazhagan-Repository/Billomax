
import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Utensils,
  CheckCircle2,
  Layers3,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const initialCategories = [
  { id: 1, name: "Main Course", status: "Active" },
  { id: 2, name: "Starters", status: "Active" },
  { id: 3, name: "Beverages", status: "Active" },
  { id: 4, name: "Desserts", status: "Active" },
  { id: 5, name: "Salads", status: "Active" },
  { id: 6, name: "Soups", status: "Active" },
  { id: 7, name: "Seafood", status: "Active" },
  { id: 9, name: "Chinese", status: "Active" },
  { id: 10, name: "Grill", status: "Active" },
];

const inputClass =
  "w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA7B8] focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70";

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "All" || category.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleCategories = filteredCategories.slice(
    startIndex,
    startIndex + pageSize
  );

  const activeCount = categories.filter(
    (category) => category.status === "Active"
  ).length;
  const inactiveCount = categories.filter(
    (category) => category.status === "Inactive"
  ).length;

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormStatus("Active");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormStatus(category.status);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormError("");
  };

  const handleSave = (event) => {
    event.preventDefault();
    const trimmedName = formName.trim();

    if (!trimmedName) {
      setFormError("Please enter a category name.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedName.toLowerCase() &&
        category.id !== editingCategory?.id
    );

    if (duplicate) {
      setFormError("A category with this name already exists.");
      return;
    }

    if (editingCategory) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingCategory.id
            ? { ...category, name: trimmedName, status: formStatus }
            : category
        )
      );
    } else {
      const nextId = Math.max(0, ...categories.map((item) => item.id)) + 1;
      setCategories((previous) => [
        ...previous,
        { id: nextId, name: trimmedName, status: formStatus },
      ]);
      setCurrentPage(
        Math.max(1, Math.ceil((filteredCategories.length + 1) / pageSize))
      );
    }

    closeModal();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setCategories((previous) =>
      previous.filter((category) => category.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const changePageSize = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6814]">
                <Utensils size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#10234F] sm:text-3xl">
                  Categories
                </h1>
                <p className="mt-1 text-sm text-[#718096]">
                  Manage your menu categories and their status.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total Categories"
            value={categories.length}
            icon={Layers3}
            iconClass="bg-orange-100 text-[#FF6814]"
          />
          <SummaryCard
            title="Active Categories"
            value={activeCount}
            icon={CheckCircle2}
            iconClass="bg-emerald-100 text-emerald-600"
          />
          <SummaryCard
            title="Inactive Categories"
            value={inactiveCount}
            icon={RotateCcw}
            iconClass="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#EEF1F5] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#10234F]">
                All Categories
              </h2>
              <p className="mt-1 text-sm text-[#8491A5]">
                View, search, edit, or remove categories.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search categories..."
                  className={`${inputClass} min-w-0 pl-10 sm:w-60`}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className={`${inputClass} sm:w-36`}
                aria-label="Filter by status"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <label className="flex items-center gap-2 text-[#65758D]">
              Show
              <select
                value={pageSize}
                onChange={(event) => changePageSize(event.target.value)}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[#10234F] outline-none focus:border-blue-400"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              entries
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-bold text-[#60728D] transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#FF6814] sm:self-auto"
            >
              <RotateCcw size={14} />
              Reset filters
            </button>
          </div>

          <div className="overflow-x-auto px-5 pb-2 sm:px-6">
            <table className="w-full min-w-[620px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="bg-[#FFF5EB] text-xs uppercase tracking-wide text-[#53647D]">
                  <th className="rounded-l-lg border-y border-l border-[#F3E6D8] px-4 py-4 font-extrabold">
                    #
                  </th>
                  <th className="border-y border-[#F3E6D8] px-4 py-4 font-extrabold">
                    Name
                  </th>
                  <th className="border-y border-[#F3E6D8] px-4 py-4 font-extrabold">
                    Status
                  </th>
                  <th className="rounded-r-lg border-y border-r border-[#F3E6D8] px-4 py-4 font-extrabold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleCategories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="group transition hover:bg-[#FFFAF5]"
                  >
                    <td className="border-b border-[#EEF1F5] px-4 py-4 text-[#8A98AA]">
                      {startIndex + index + 1}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-4 py-4 font-semibold text-[#243957]">
                      {category.name}
                    </td>
                    <td className="border-b border-[#EEF1F5] px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          category.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                            : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            category.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {category.status}
                      </span>
                    </td>
                    <td className="border-b border-[#EEF1F5] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(category)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:border-red-400 hover:bg-red-100"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleCategories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Search size={22} />
                      </div>
                      <p className="mt-3 font-bold text-[#344761]">
                        No categories found
                      </p>
                      <p className="mt-1 text-sm text-[#8491A5]">
                        Try another search term or reset the filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-[#718096]">
              Showing{" "}
              <span className="font-bold text-[#10234F]">
                {filteredCategories.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#10234F]">
                {Math.min(startIndex + pageSize, filteredCategories.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#10234F]">
                {filteredCategories.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1 self-start sm:self-auto">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E2E8F0] px-3 text-xs font-bold text-[#64748B] transition hover:bg-[#FFF5EB] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-3 text-xs font-extrabold text-white">
                {safePage}
              </span>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#E2E8F0] px-3 text-xs font-bold text-[#64748B] transition hover:bg-[#FFF5EB] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-5 py-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#10234F]">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h3>
                <p className="mt-1 text-xs text-[#8491A5]">
                  Enter the category details below.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-[#8290A4] transition hover:bg-slate-100 hover:text-[#10234F]"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5">
              <label className="block text-sm font-bold text-[#33445F]">
                Category Name <span className="text-red-500">*</span>
                <input
                  autoFocus
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  placeholder="Enter category name"
                  className={`${inputClass} mt-2`}
                />
              </label>

              <label className="block text-sm font-bold text-[#33445F]">
                Status
                <select
                  value={formStatus}
                  onChange={(event) => setFormStatus(event.target.value)}
                  className={`${inputClass} mt-2`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              {formError && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-[#EEF1F5] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#E2E8F0] px-5 py-2.5 text-sm font-bold text-[#60728D] transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:shadow-lg"
                >
                  {editingCategory ? <Pencil size={15} /> : <Plus size={17} />}
                  {editingCategory ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-[#10234F]">
              Delete category?
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#718096]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#10234F]">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold text-[#60728D] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-[#F0E4D8] bg-white p-5 shadow-[0_5px_20px_rgba(16,35,79,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#718096]">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-[#10234F]">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}
