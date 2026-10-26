
import React, { useEffect, useState } from "react";
import { X, Tags, Save, FolderTree } from "lucide-react";

export default function EditExpenseCategoryModal({
  open,
  category,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    isSubCategory: false,
    parentId: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFormData({
      name: category?.name ?? category?.category_name ?? "",
      code: category?.code ?? category?.category_code ?? "",
      isSubCategory: Boolean(
        category?.isSubCategory ??
          category?.is_sub_category ??
          category?.parent_id
      ),
      parentId: category?.parentId ?? category?.parent_id ?? "",
    });
  }, [open, category]);

  if (!open) return null;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) return;

    try {
      setSaving(true);

      await onSave?.({
        ...category,
        id: category?.id ?? Date.now(),
        name: formData.name.trim(),
        code: formData.code.trim(),
        isSubCategory: formData.isSubCategory,
        parentId: formData.isSubCategory ? formData.parentId : "",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-[#DCE4EF] bg-white px-3.5 py-2.5 text-sm text-[#102454] outline-none transition placeholder:text-slate-400 focus:border-[#FF711A] focus:ring-[3px] focus:ring-[#FF711A]/15";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-expense-category-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/70 bg-[#FFFAF5] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#F07820]">
              <Tags size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#F07820]">
                Multi-Service Center · Expenses
              </p>
              <h2
                id="edit-expense-category-title"
                className="text-lg font-bold text-[#10234F]"
              >
                {category ? "Edit Expense Category" : "Add Expense Category"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <label
                htmlFor="expense-category-name"
                className="text-sm font-semibold text-[#10234F]"
              >
                Category name: <span className="text-rose-500">*</span>
              </label>
              <input
                id="expense-category-name"
                type="text"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Category name"
                className={inputClass}
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="expense-category-code"
                className="text-sm font-semibold text-[#10234F]"
              >
                Category code:
              </label>
              <input
                id="expense-category-code"
                type="text"
                value={formData.code}
                onChange={(event) => updateField("code", event.target.value)}
                placeholder="Category code"
                className={inputClass}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-orange-200">
              <input
                type="checkbox"
                checked={formData.isSubCategory}
                onChange={(event) =>
                  updateField("isSubCategory", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 accent-[#FF6814] focus:ring-orange-200"
              />
              <span className="text-sm font-medium text-[#10234F]">
                Add as sub-category
              </span>
              <FolderTree size={17} className="ml-auto text-slate-400" />
            </label>

            {formData.isSubCategory && (
              <div>
                <label
                  htmlFor="expense-category-parent"
                  className="text-sm font-semibold text-[#10234F]"
                >
                  Parent category ID
                </label>
                <input
                  id="expense-category-parent"
                  type="text"
                  value={formData.parentId}
                  onChange={(event) =>
                    updateField("parentId", event.target.value)
                  }
                  placeholder="Enter parent category ID"
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Use the parent category selector from your existing page or
                  API if one is already available.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
            <button
              type="submit"
              disabled={saving || !formData.name.trim()}
              className="inline-flex items-center gap-2 rounded-[12px] bg-[#FF621F] px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,98,31,0.25)] transition-all hover:bg-[#E95510] hover:shadow-[0_6px_18px_rgba(255,98,31,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving
                ? "Saving..."
                : category
                  ? "Save Changes"
                  : "Add Category"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-[12px] border border-[#DCE4EF] bg-white px-6 py-2.5 text-sm font-bold text-[#102454] transition-all hover:bg-[#F8FAFC] hover:border-[#CBD5E1] disabled:opacity-50"
            >
              Cancel
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
