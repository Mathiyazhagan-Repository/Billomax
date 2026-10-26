
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
  CalendarDays,
  Hash,
  MapPin,
  Search,
  Package,
  Trash2,
  Truck,
  FileText,
  Info,
  Plus,
  Save,
  IndianRupee,
} from "lucide-react";

const initialForm = {
  date: "2026-10-22T18:00",
  referenceNo: "",
  status: "",
  locationFrom: "",
  locationTo: "",
  shippingCharges: "0",
  additionalNotes: "",
};

const locations = ["Pharmacy", "Soujanya H V"];

const statusOptions = ["Pending", "In Transit", "Completed", "Cancelled"];

// Connect this list to your existing product API/catalog.
const productCatalog = [];

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function AddStockTransfer({
  products = productCatalog,
  locationOptions = locations,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter((product) =>
        [
          product.name,
          product.productName,
          product.sku,
          product.code,
          product.variation,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      )
      .slice(0, 8);
  }, [products, search]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const shippingCharges = Math.max(0, Number(form.shippingCharges) || 0);
  const totalAmount = subtotal + shippingCharges;

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setError("");
  };

  const addProduct = (product) => {
    const id = product.id ?? product._id ?? product.sku ?? product.code;

    setItems((previous) => {
      const existing = previous.find((item) => item.id === id);

      if (existing) {
        return previous.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previous,
        {
          id,
          name: product.name ?? product.productName ?? "Product",
          sku: product.sku ?? product.code ?? "",
          quantity: 1,
          unitPrice: Number(
            product.unitPrice ??
              product.purchasePrice ??
              product.price ??
              0
          ),
        },
      ];
    });

    setSearch("");
  };

  const updateItem = (id, key, value) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: Math.max(
                0,
                key === "quantity"
                  ? Number.parseFloat(value) || 0
                  : Number.parseFloat(value) || 0
              ),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.date || !form.locationFrom || !form.locationTo || !form.status) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.locationFrom === form.locationTo) {
      setError("From and To locations must be different.");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one product before saving.");
      return;
    }

    const payload = {
      ...form,
      items,
      shippingCharges,
      subtotal,
      totalAmount,
    };

    try {
      setSaving(true);
      if (onSave) await onSave(payload);
    } catch (saveError) {
      setError(saveError?.message || "Unable to save the stock transfer.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#E8EDF4] bg-white px-3.5 py-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

  const labelClass =
    "mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#19366F]";

    return (
      <main className="min-h-screen bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
        <div className="mx-auto max-w-[1400px] space-y-5">
          {/* Page heading */}
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
                <span className="text-[11px] font-extrabold">INVENTORY · STOCK TRANSFERS</span>
              </div>

              <h1 className="app-page-title text-[#10234F]">
                Add Stock Transfer
              </h1>
              <p className="app-description mt-1 text-[#577B9F]">
                Transfer products between business locations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-5 py-3 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5]"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>
              )}
              <div className="flex h-12 w-fit items-center gap-3 rounded-xl border border-[#F2E8DE] bg-white px-4 shadow-[0_4px_12px_rgba(224,133,65,0.07)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF1E5] text-[#F04A13]">
                  <ArrowLeftRight size={19} />
                </span>
                <span className="text-sm font-semibold text-[#19366F]">
                  New transfer
                </span>
              </div>
            </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transfer details */}
          <section className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6 lg:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-[#F2E8DE] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
                <FileText size={20} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  Transfer details
                </h2>
                <p className="app-description mt-0.5 text-[#577B9F]">
                  Enter the transfer information below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className={labelClass}>
                  <CalendarDays size={15} className="text-[#F04A13]" />
                  Date <span className="text-[#C43D32]">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.date}
                  onChange={(event) => updateForm("date", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Hash size={15} className="text-[#F04A13]" />
                  Reference No.
                </label>
                <input
                  type="text"
                  value={form.referenceNo}
                  onChange={(event) =>
                    updateForm("referenceNo", event.target.value)
                  }
                  placeholder="Enter reference number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Status <span className="text-[#C43D32]">*</span>
                  <span title="Select the current transfer status">
                    <Info size={14} className="text-[#3478F6]" />
                  </span>
                </label>
                <select
                  required
                  value={form.status}
                  onChange={(event) => updateForm("status", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Please Select</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <MapPin size={15} className="text-[#F04A13]" />
                  Location (From) <span className="text-[#C43D32]">*</span>
                </label>
                <select
                  required
                  value={form.locationFrom}
                  onChange={(event) =>
                    updateForm("locationFrom", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Please Select</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <MapPin size={15} className="text-[#F04A13]" />
                  Location (To) <span className="text-[#C43D32]">*</span>
                </label>
                <select
                  required
                  value={form.locationTo}
                  onChange={(event) =>
                    updateForm("locationTo", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Please Select</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Product selection */}
          <section className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6 lg:p-7">
            <div className="mb-5 flex items-center gap-3 border-b border-[#F2E8DE] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
                <Package size={20} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">Transfer products</h2>
                <p className="app-description mt-0.5 text-[#577B9F]">
                  Search the product catalog and add quantities.
                </p>
              </div>
            </div>

            <div className="relative mx-auto mb-6 max-w-2xl">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8798AD]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products for stock transfer..."
                className={`${inputClass} pl-11`}
              />

              {search.trim() && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-[#F2E8DE] bg-white shadow-xl">
                  {filteredProducts.length ? (
                    filteredProducts.map((product, index) => (
                      <button
                        key={product.id ?? product._id ?? product.sku ?? index}
                        type="button"
                        onClick={() => addProduct(product)}
                        className="flex w-full items-center justify-between gap-3 border-b border-[#F2E8DE] px-4 py-3 text-left last:border-b-0 hover:bg-[#FFF7EF]"
                      >
                        <span>
                          <span className="block text-sm font-semibold text-[#19366F]">
                            {product.name ?? product.productName}
                          </span>
                          <span className="mt-0.5 block text-xs text-[#8798AD]">
                            {product.sku ?? product.code ?? "No SKU"}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-[#F04A13]">
                          ₹
                          {money(
                            product.unitPrice ??
                              product.purchasePrice ??
                              product.price ??
                              0
                          )}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-4 text-sm text-[#577B9F]">
                      No matching products in the supplied catalog.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FFF7EF] text-[10px] font-extrabold uppercase tracking-wide text-[#19366F]">
                    <th className="px-4 py-4 text-left">Product</th>
                    <th className="px-4 py-4 text-left">Quantity</th>
                    <th className="px-4 py-4 text-right">Unit Price</th>
                    <th className="px-4 py-4 text-right">Subtotal</th>
                    <th className="w-16 px-4 py-4 text-center">
                      <Trash2 size={16} className="mx-auto" />
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2E8DE]">
                  {items.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#FFF7EF]">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#19366F]">
                          {item.name}
                        </p>
                        {item.sku && (
                          <p className="mt-1 text-xs text-[#8798AD]">
                            SKU: {item.sku}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(item.id, "quantity", event.target.value)
                          }
                          className="w-24 rounded-lg border border-[#E8EDF4] px-3 py-2 text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                        />
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right text-[#577B9F]">
                        ₹{money(item.unitPrice)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-[#19366F]">
                        ₹{money(item.quantity * item.unitPrice)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded-lg p-2 text-[#C43D32] transition hover:bg-[#FFF0ED]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
                          <Package size={20} />
                        </span>
                        <p className="mt-3 font-semibold text-[#19366F]">
                          No products added yet
                        </p>
                        <p className="mt-1 text-xs text-[#577B9F]">
                          Search for a product above to add it to this transfer.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>

                <tfoot>
                  <tr className="border-t border-[#F2E8DE] bg-[#FFFCF8]">
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-right font-bold text-[#19366F]"
                    >
                      Subtotal
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-[#19366F]">
                      ₹{money(subtotal)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Shipping and totals */}
          <section className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6 lg:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-[#F2E8DE] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
                <Truck size={20} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  Shipping & additional details
                </h2>
                <p className="app-description mt-0.5 text-[#577B9F]">
                  Add delivery charges and any notes for this transfer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className={labelClass}>
                  <IndianRupee size={15} className="text-[#F04A13]" />
                  Shipping Charges
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.shippingCharges}
                  onChange={(event) =>
                    updateForm("shippingCharges", event.target.value)
                  }
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-[#8798AD]">
                  Shipping charges are added to the product subtotal.
                </p>
              </div>

              <div>
                <label className={labelClass}>Additional Notes</label>
                <textarea
                  rows={4}
                  value={form.additionalNotes}
                  onChange={(event) =>
                    updateForm("additionalNotes", event.target.value)
                  }
                  placeholder="Add any notes for this stock transfer..."
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-sm rounded-xl border border-[#F8EBDD] bg-[#FFFCF8] p-5">
              <div className="flex items-center justify-between gap-4 text-sm text-[#577B9F]">
                  <span>Product subtotal</span>
                  <span className="font-medium text-[#19366F]">
                    ₹{money(subtotal)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 text-sm text-[#577B9F]">
                  <span>Shipping charges</span>
                  <span className="font-medium text-[#19366F]">
                    ₹{money(shippingCharges)}
                  </span>
                </div>
                <div className="mt-4 border-t border-[#F2E8DE] pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-[#19366F]">
                      Total Amount
                    </span>
                    <span className="text-xl font-extrabold tabular-nums text-[#F04A13]">
                      ₹{money(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-[#FFD9D2] bg-[#FFF0ED] px-4 py-3 text-sm font-medium text-[#C43D32]"
              >
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#F2E8DE] pt-6 sm:flex-row sm:justify-end">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-5 py-3 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5]"
                >
                  <ArrowLeft size={17} />
                  Back
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF711A] px-7 py-3 text-sm font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:bg-[#F04A13] focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Stock Transfer"}
              </button>
            </div>
          </section>
        </form>

        <footer className="pb-3 pt-1 text-center text-xs text-[#8798AD]">
          Billomax · Inventory management
        </footer>
      </div>
    </main>
  );
}
