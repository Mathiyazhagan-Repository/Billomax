
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
  CalendarDays,
  Check,
  FileText,
  LoaderCircle,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
  Truck,
  Info,
} from "lucide-react";

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getValue = (object, ...keys) => {
  for (const key of keys) {
    if (object?.[key] !== undefined && object[key] !== null) {
      return object[key];
    }
  }
  return "";
};

const getProductName = (product) =>
  getValue(product, "name", "productName", "product_name", "product") || "";

const getProductPrice = (product) =>
  Number(getValue(product, "unitPrice", "unit_price", "price") || 0);

const getProductQuantity = (product) =>
  Number(getValue(product, "quantity", "qty") || 0);

const getProductSubtotal = (product) => {
  const stored = getValue(product, "subtotal", "lineTotal", "line_total");
  return stored !== "" ? Number(stored) : getProductQuantity(product) * getProductPrice(product);
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#DCE3EC] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "text-sm font-semibold text-[#10234F]";

function Field({ label, required, children, hint }) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function Card({ title, subtitle, icon: Icon, action, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E8EDF3] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
      <div className="flex flex-col gap-3 border-b border-[#EDF0F5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
            <Icon size={19} />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#10234F]">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/**
 * EditStockTransfer
 *
 * Props:
 * - transfer: complete transfer object from your existing detail API
 * - locations: optional list of locations
 * - products: optional list of searchable products
 * - onSave: async (updatedTransfer) => Promise<void>
 * - onCancel: close/navigate back
 * - onSearchProducts: optional async (searchText) => product[]
 *
 * The parent component should supply the real API data and save handler.
 */
export default function EditStockTransfer({
  transfer,
  locations = [],
  products: productCatalog = [],
  onSave,
  onCancel,
  onSearchProducts,
}) {
  const [form, setForm] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!transfer) {
      setForm(null);
      return;
    }

    const originalProducts = getValue(
      transfer,
      "items",
      "products",
      "stockTransferProducts",
      "stock_transfer_products",
      "transferItems",
      "transfer_items"
    ) || [];

    setForm({
      ...transfer,
      date: getValue(transfer, "date", "transferDate", "transfer_date") || "",
      referenceNo: getValue(transfer, "referenceNo", "reference_no", "refNo", "ref_no") || "",
      status: getValue(transfer, "status", "transferStatus", "transfer_status") || "",
      locationFrom: getValue(transfer, "locationFrom", "location_from", "fromLocation", "from_location") || "",
      locationTo: getValue(transfer, "locationTo", "location_to", "toLocation", "to_location") || "",
      shippingCharges: Number(
        getValue(transfer, "shippingCharges", "shipping_charges", "additionalShippingCharges", "additional_shipping_charges") || 0
      ),
      additionalNotes: getValue(transfer, "additionalNotes", "additional_notes", "notes") || "",
      items: originalProducts.map((item) => ({
        ...item,
        quantity: getProductQuantity(item),
        unitPrice: getProductPrice(item),
        subtotal: getProductSubtotal(item),
        unit: getValue(item, "unit", "unitName", "unit_name") || "",
      })),
    });

    setError("");
    setSuccess("");
  }, [transfer]);

  const subtotal = useMemo(
    () => (form?.items || []).reduce((sum, item) => sum + getProductSubtotal(item), 0),
    [form?.items]
  );

  const totalAmount = subtotal + Number(form?.shippingCharges || 0);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setSuccess("");
  };

  const updateProduct = (index, key, value) => {
    setForm((current) => {
      const items = [...current.items];
      const item = { ...items[index], [key]: value };

      if (key === "quantity" || key === "unitPrice") {
        const quantity = Number(item.quantity || 0);
        const price = Number(item.unitPrice || 0);
        item.subtotal = quantity * price;
      }

      items[index] = item;
      return { ...current, items };
    });
    setError("");
    setSuccess("");
  };

  const removeProduct = (index) => {
    setForm((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const searchProducts = async (value) => {
    setProductSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    if (onSearchProducts) {
      try {
        const result = await onSearchProducts(value);
        setSearchResults(Array.isArray(result) ? result : []);
      } catch {
        setSearchResults([]);
      }
      return;
    }

    const query = value.toLowerCase();
    setSearchResults(
      productCatalog.filter((product) =>
        [
          getProductName(product),
          getValue(product, "sku", "code", "productCode", "product_code"),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    );
  };

  const addProduct = (product) => {
    const id = getValue(product, "productId", "product_id", "id", "_id");
    const existingIndex = form.items.findIndex((item) => {
      const existingId = getValue(item, "productId", "product_id", "id", "_id");
      return id && existingId && String(id) === String(existingId);
    });

    if (existingIndex >= 0) {
      const existing = form.items[existingIndex];
      updateProduct(existingIndex, "quantity", Number(existing.quantity || 0) + 1);
    } else {
      const price = getProductPrice(product);
      setForm((current) => ({
        ...current,
        items: [
          ...current.items,
          {
            ...product,
            productId: id,
            name: getProductName(product),
            sku: getValue(product, "sku", "code", "productCode", "product_code") || "",
            quantity: 1,
            unitPrice: price,
            subtotal: price,
            unit: getValue(product, "unit", "unitName", "unit_name") || "",
          },
        ],
      }));
    }

    setProductSearch("");
    setSearchResults([]);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.locationFrom || !form.locationTo) {
      setError("Please select both the source and destination locations.");
      return;
    }

    if (String(form.locationFrom) === String(form.locationTo)) {
      setError("Source and destination locations must be different.");
      return;
    }

    if (!form.items.length) {
      setError("Add at least one product before saving.");
      return;
    }

    if (form.items.some((item) => Number(item.quantity) <= 0)) {
      setError("Each product quantity must be greater than zero.");
      return;
    }

    if (typeof onSave !== "function") {
      setError("Connect your existing stock-transfer update API using the onSave prop.");
      return;
    }

    const payload = {
      ...form,
      items: form.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        subtotal: getProductSubtotal(item),
      })),
      shippingCharges: Number(form.shippingCharges || 0),
      netTotalAmount: subtotal,
      totalAmount,
    };

    try {
      setSaving(true);
      await onSave(payload);
      setSuccess("Stock transfer updated successfully.");
    } catch (saveError) {
      setError(saveError?.response?.data?.message || saveError?.message || "Unable to update the stock transfer.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="rounded-2xl border border-[#E8EDF3] bg-white p-8 text-center text-sm text-slate-500">
        No stock transfer selected. Open Edit from a stock transfer record.
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="min-h-full space-y-5 bg-[#FFFAF5] p-4 sm:p-6 lg:p-7">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E3E8F0] bg-white text-[#10234F] transition hover:bg-orange-50"
              aria-label="Back"
            >
              <ArrowLeft size={19} />
            </button>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E86A20]">
              Inventory management
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#10234F]">
              Edit Stock Transfer
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update transfer details and product quantities.
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-2 text-xs font-semibold text-[#E86A20]">
          <ArrowLeftRight size={15} />
          Reference #{form.referenceNo || "—"}
        </span>
      </div>

      {/* Transfer details */}
      <Card
        title="Transfer Information"
        subtitle="Date, reference, status and inventory locations"
        icon={Truck}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Date" required>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="datetime-local"
                className={`${inputClass} pl-10`}
                value={form.date ? String(form.date).slice(0, 16) : ""}
                onChange={(event) => updateField("date", event.target.value)}
                required
              />
            </div>
          </Field>

          <Field label="Reference No.">
            <input
              className={inputClass}
              value={form.referenceNo}
              readOnly
              aria-readonly="true"
            />
          </Field>

          <Field label="Status" required>
            <select
              className={inputClass}
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              required
            >
              <option value="">Please Select</option>
              {["Pending", "In Transit", "Completed", "Received", "Cancelled"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
              {form.status && !["Pending", "In Transit", "Completed", "Received", "Cancelled"].includes(form.status) && (
                <option value={form.status}>{form.status}</option>
              )}
            </select>
          </Field>

          <Field label="Location (From)" required>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                className={`${inputClass} pl-10`}
                value={form.locationFrom}
                onChange={(event) => updateField("locationFrom", event.target.value)}
                required
              >
                <option value="">Please Select</option>
                {locations.map((location, index) => {
                  const id = getValue(location, "id", "_id", "businessLocationId", "business_location_id");
                  const name = getValue(location, "name", "businessLocation", "business_location", "locationName");
                  const code = getValue(location, "code", "locationCode", "location_code");
                  return (
                    <option key={`${id ?? name}-${index}`} value={id ?? name}>
                      {name}{code ? ` (${code})` : ""}
                    </option>
                  );
                })}
                {form.locationFrom && !locations.some((location) =>
                  String(getValue(location, "id", "_id", "businessLocationId", "business_location_id", "name")) === String(form.locationFrom)
                ) && <option value={form.locationFrom}>{form.locationFrom}</option>}
              </select>
            </div>
          </Field>

          <Field label="Location (To)" required>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                className={`${inputClass} pl-10`}
                value={form.locationTo}
                onChange={(event) => updateField("locationTo", event.target.value)}
                required
              >
                <option value="">Please Select</option>
                {locations.map((location, index) => {
                  const id = getValue(location, "id", "_id", "businessLocationId", "business_location_id");
                  const name = getValue(location, "name", "businessLocation", "business_location", "locationName");
                  const code = getValue(location, "code", "locationCode", "location_code");
                  return (
                    <option key={`${id ?? name}-${index}`} value={id ?? name}>
                      {name}{code ? ` (${code})` : ""}
                    </option>
                  );
                })}
                {form.locationTo && !locations.some((location) =>
                  String(getValue(location, "id", "_id", "businessLocationId", "business_location_id", "name")) === String(form.locationTo)
                ) && <option value={form.locationTo}>{form.locationTo}</option>}
              </select>
            </div>
          </Field>
        </div>
      </Card>

      {/* Product editor */}
      <Card
        title="Search Products"
        subtitle="Edit quantities, units and unit prices"
        icon={Package}
      >
        <div className="relative mx-auto mb-5 max-w-2xl">
          <div className="flex overflow-hidden rounded-xl border border-[#DCE3EC] bg-white focus-within:border-[#FF812B] focus-within:ring-2 focus-within:ring-orange-100">
            <span className="flex items-center px-4 text-slate-500">
              <Search size={18} />
            </span>
            <input
              className="min-w-0 flex-1 py-3 pr-3 text-sm text-[#10234F] outline-none placeholder:text-slate-400"
              placeholder="Search products by name or SKU..."
              value={productSearch}
              onChange={(event) => searchProducts(event.target.value)}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#E6EAF0] bg-white shadow-xl">
              {searchResults.map((product, index) => (
                <button
                  key={getValue(product, "id", "_id", "productId", "product_id") ?? index}
                  type="button"
                  onClick={() => addProduct(product)}
                  className="flex w-full items-center justify-between gap-4 border-b border-[#EDF0F5] px-4 py-3 text-left last:border-0 hover:bg-orange-50"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#10234F]">
                      {getProductName(product)}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      SKU: {getValue(product, "sku", "code", "productCode", "product_code") || "—"}
                    </span>
                  </span>
                  <span className="whitespace-nowrap text-sm font-bold text-[#E86A20]">
                    {money(getProductPrice(product))}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {productSearch.trim() && searchResults.length === 0 && (
          <p className="mb-4 text-center text-xs text-slate-500">
            No matching products. Confirm your product catalogue or search API is connected.
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-[#E6EAF0]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] text-xs font-bold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">Subtotal</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF0F5]">
              {form.items.map((item, index) => (
                <tr key={item.id ?? item._id ?? item.productId ?? index} className="hover:bg-orange-50/30">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[#10234F]">{getProductName(item) || "—"}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {getValue(item, "sku", "code", "productCode", "product_code") || "—"}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      className="w-28 rounded-lg border border-[#DCE3EC] px-3 py-2 text-sm outline-none focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                      value={item.quantity}
                      onChange={(event) => updateProduct(index, "quantity", event.target.value)}
                      required
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      className="w-28 rounded-lg border border-[#DCE3EC] px-3 py-2 text-sm outline-none focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                      value={item.unit}
                      onChange={(event) => updateProduct(index, "unit", event.target.value)}
                      placeholder="Unit"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="w-32 rounded-lg border border-[#DCE3EC] px-3 py-2 text-sm outline-none focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                      value={item.unitPrice}
                      onChange={(event) => updateProduct(index, "unitPrice", event.target.value)}
                      required
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#10234F]">
                    {money(getProductSubtotal(item))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50"
                      aria-label={`Remove ${getProductName(item)}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {form.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Package className="mx-auto mb-2 text-slate-300" size={30} />
                    <p className="text-sm font-semibold text-slate-600">No products added</p>
                    <p className="mt-1 text-xs text-slate-400">Search for a product above to add it to this transfer.</p>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E6EAF0] bg-[#F8FAFC]">
                <td colSpan={4} className="px-4 py-4 text-right font-bold text-[#10234F]">
                  Net Total:
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-extrabold text-[#E86A20]">
                  {money(subtotal)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Shipping and notes */}
      <Card
        title="Shipping & Notes"
        subtitle="Additional charges and transfer notes"
        icon={FileText}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Field label="Shipping Charges">
            <input
              type="number"
              min="0"
              step="any"
              className={inputClass}
              value={form.shippingCharges}
              onChange={(event) => updateField("shippingCharges", event.target.value)}
            />
          </Field>

          <Field label="Additional Notes">
            <textarea
              rows={4}
              className={`${inputClass} resize-y`}
              value={form.additionalNotes}
              onChange={(event) => updateField("additionalNotes", event.target.value)}
              placeholder="Enter additional notes..."
            />
          </Field>
        </div>

        <div className="mt-6 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-white p-5 sm:ml-auto sm:max-w-md">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-600">Net Total Amount</span>
            <span className="font-semibold text-[#10234F]">{money(subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-600">Shipping Charges</span>
            <span className="font-semibold text-[#10234F]">{money(form.shippingCharges)}</span>
          </div>
          <div className="my-4 border-t border-orange-100" />
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-[#10234F]">Total Amount</span>
            <span className="text-xl font-extrabold text-[#E86A20]">{money(totalAmount)}</span>
          </div>
        </div>
      </Card>

      {/* Form feedback */}
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Info size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check size={18} />
          {success}
        </div>
      )}

      {/* Actions */}
      <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-[#E8EDF3] bg-white/95 p-4 shadow-[0_-5px_20px_rgba(16,35,79,0.04)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-slate-500">
          Review the details before saving the transfer.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-[#DCE3EC] px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-7 py-3 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <LoaderCircle size={17} className="animate-spin" /> : <Check size={17} />}
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
