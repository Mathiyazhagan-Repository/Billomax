
import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  UtensilsCrossed,
  IndianRupee,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Layers3,
} from "lucide-react";

const initialItems = [
  { id: 1, name: "Chicken Biryani", category: "Main Course", price: 200, available: true },
  { id: 2, name: "Mutton Curry", category: "Main Course", price: 250, available: false },
  { id: 3, name: "Paneer Butter Masala", category: "Main Course", price: 160, available: true },
  { id: 4, name: "Green Garden Salad", category: "Salads", price: 90, available: true },
  { id: 5, name: "Chicken Caesar Salad", category: "Salads", price: 140, available: false },
  { id: 6, name: "Gulab Jamun", category: "Desserts", price: 60, available: false },
  { id: 7, name: "Chocolate Brownie", category: "Salads", price: 120, available: false },
  { id: 8, name: "Chicken", category: "Grill", price: 180, available: true },
];

const initialCategories = [
  "Main Course",
  "Starters",
  "Beverages",
  "Desserts",
  "Salads",
  "Soups",
  "Seafood",
  "Chinese",
  "Grill",
];

const inputClass =
  "w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA7B8] focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70";

const formatPrice = (price) =>
  `₹${Number(price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function MenuItems() {
  const [items, setItems] = useState(initialItems);
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Main Course",
    price: "",
    available: true,
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.category.toLowerCase().includes(search.toLowerCase().trim());

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    const matchesAvailability =
      availabilityFilter === "All" ||
      (availabilityFilter === "Available" && item.available) ||
      (availabilityFilter === "Unavailable" && !item.available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleItems = filteredItems.slice(startIndex, startIndex + pageSize);

  const availableCount = items.filter((item) => item.available).length;
  const unavailableCount = items.length - availableCount;

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: categories[0] || "Main Course",
      price: "",
      available: true,
    });
    setEditingItem(null);
    setFormError("");
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
      category: item.category,
      price: String(item.price),
      available: item.available,
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSave = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);

    if (!name) {
      setFormError("Please enter a menu item name.");
      return;
    }

    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      setFormError("Please enter a valid price.");
      return;
    }

    const duplicate = items.some(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.id !== editingItem?.id
    );

    if (duplicate) {
      setFormError("A menu item with this name already exists.");
      return;
    }

    if (editingItem) {
      setItems((previous) =>
        previous.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name,
                description: form.description,
                category: form.category,
                price,
                available: form.available,
              }
            : item
        )
      );
    } else {
      const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;

      setItems((previous) => [
        ...previous,
        {
          id: nextId,
          name,
          description: form.description,
          category: form.category,
          price,
          available: form.available,
        },
      ]);

      setCurrentPage(Math.ceil((filteredItems.length + 1) / pageSize));
    }

    closeModal();
  };

  const toggleAvailability = (id) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setItems((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setAvailabilityFilter("All");
    setCurrentPage(1);
  };

  const updateFilter = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6814]">
              <UtensilsCrossed size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#10234F] sm:text-3xl">
                Menu Items
              </h1>
              <p className="mt-1 text-sm text-[#718096]">
                Manage your menu, categories, prices and availability.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Menu Items"
            value={items.length}
            icon={Layers3}
            iconClass="bg-orange-100 text-[#FF6814]"
          />
          <SummaryCard
            title="Available Items"
            value={availableCount}
            icon={CheckCircle2}
            iconClass="bg-emerald-100 text-emerald-600"
          />
          <SummaryCard
            title="Unavailable Items"
            value={unavailableCount}
            icon={UtensilsCrossed}
            iconClass="bg-slate-100 text-slate-500"
          />
          <SummaryCard
            title="Average Price"
            value={formatPrice(
              items.length
                ? items.reduce((sum, item) => sum + Number(item.price), 0) /
                    items.length
                : 0
            )}
            icon={IndianRupee}
            iconClass="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Menu table */}
        <section className="overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#EEF1F5] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#10234F]">
                All Menu Items
              </h2>
              <p className="mt-1 text-sm text-[#8491A5]">
                Update product details or switch availability instantly.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    updateFilter(setSearch, event.target.value)
                  }
                  placeholder="Search menu items..."
                  className={`${inputClass} min-w-0 pl-10 sm:w-56`}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  updateFilter(setCategoryFilter, event.target.value)
                }
                className={`${inputClass} sm:w-44`}
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={availabilityFilter}
                onChange={(event) =>
                  updateFilter(setAvailabilityFilter, event.target.value)
                }
                className={`${inputClass} sm:w-40`}
                aria-label="Filter by availability"
              >
                <option value="All">All Availability</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <label className="flex items-center gap-2 text-[#65758D]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setCurrentPage(1);
                }}
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
              className="self-start rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-bold text-[#60728D] transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#FF6814] sm:self-auto"
            >
              Reset filters
            </button>
          </div>

          <div className="overflow-x-auto px-5 pb-2 sm:px-6">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="bg-[#FFF5EB] text-xs uppercase tracking-wide text-[#53647D]">
                  <th className="rounded-l-lg border-y border-l border-[#F3E6D8] px-4 py-4 text-center font-extrabold">
                    #
                  </th>
                  <th className="border-y border-[#F3E6D8] px-4 py-4 font-extrabold">
                    Name
                  </th>
                  <th className="border-y border-[#F3E6D8] px-4 py-4 text-center font-extrabold">
                    Category
                  </th>
                  <th className="border-y border-[#F3E6D8] px-4 py-4 text-center font-extrabold">
                    Price
                  </th>
                  <th className="border-y border-[#F3E6D8] px-4 py-4 text-center font-extrabold">
                    Available
                  </th>
                  <th className="rounded-r-lg border-y border-r border-[#F3E6D8] px-4 py-4 text-center font-extrabold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[#FFFAF5]"
                  >
                    <td className="border-b border-[#EEF1F5] px-4 py-4 text-center text-[#8A98AA]">
                      {startIndex + index + 1}
                    </td>

                    <td className="border-b border-[#EEF1F5] px-4 py-4 font-semibold text-[#243957]">
                      {item.name}
                    </td>

                    <td className="border-b border-[#EEF1F5] px-4 py-4 text-center">
                      <span className="inline-flex rounded-lg bg-[#F5F7FA] px-3 py-1.5 text-xs font-semibold text-[#53647D]">
                        {item.category}
                      </span>
                    </td>

                    <td className="border-b border-[#EEF1F5] px-4 py-4 text-center font-bold tabular-nums text-[#10234F]">
                      {formatPrice(item.price)}
                    </td>

                    <td className="border-b border-[#EEF1F5] px-4 py-4 text-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.available}
                        aria-label={`Toggle availability for ${item.name}`}
                        onClick={() => toggleAvailability(item.id)}
                        className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                          item.available ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            item.available ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="border-b border-[#EEF1F5] px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          aria-label={`Edit ${item.name}`}
                          title="Edit"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${item.name}`}
                          title="Delete"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:border-red-400 hover:bg-red-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Search size={22} />
                      </div>
                      <p className="mt-3 font-bold text-[#344761]">
                        No menu items found
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
                {filteredItems.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#10234F]">
                {Math.min(startIndex + pageSize, filteredItems.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#10234F]">
                {filteredItems.length}
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
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-5 py-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#10234F]">
                  {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                </h3>
                <p className="mt-1 text-xs text-[#8491A5]">
                  Enter the product details below.
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
                Product Name <span className="text-red-500">*</span>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter product name"
                  className={`${inputClass} mt-2`}
                />
              </label>

              <label className="block text-sm font-bold text-[#33445F]">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Enter product description"
                  rows={3}
                  className={`${inputClass} mt-2 resize-y`}
                />
              </label>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block text-sm font-bold text-[#33445F]">
                  Category <span className="text-red-500">*</span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-2`}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-bold text-[#33445F]">
                  Price (₹) <span className="text-red-500">*</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        price: event.target.value,
                      }))
                    }
                    placeholder="Enter price"
                    className={`${inputClass} mt-2`}
                  />
                </label>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E8EDF4] bg-[#FAFCFE] p-4">
                <div>
                  <p className="text-sm font-bold text-[#33445F]">
                    Available for ordering
                  </p>
                  <p className="mt-1 text-xs text-[#8491A5]">
                    Allow customers to order this menu item.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={form.available}
                  aria-label="Toggle product availability"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      available: !previous.available,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                    form.available ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      form.available ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
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
                  {editingItem ? <Pencil size={15} /> : <Plus size={17} />}
                  {editingItem ? "Save Changes" : "Add Product"}
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
              Delete menu item?
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
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#718096]">{title}</p>
          <p className="mt-2 truncate text-2xl font-black tracking-tight text-[#10234F] sm:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}
