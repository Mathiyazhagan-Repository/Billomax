
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  IndianRupee,
  MapPin,
  PackageSearch,
  Plus,
  Search,
  Save,
  Trash2,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-[#E8EDF4] bg-white px-3.5 py-2.5 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getLocalDateTime = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const defaultLocations = [
  { id: "BL0001", name: "Multi-Service Center", code: "BL0001" },
  { id: "soujanya-h-v", name: "Soujanya H V" },
];

function SectionCard({ title, subtitle, icon: Icon, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#F8EBDD] bg-white/95 p-5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6 ${className}`}
    >
      {(title || Icon) && (
        <div className="mb-5 flex items-start gap-3">
          {Icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
              <Icon size={19} />
            </span>
          )}
          <div>
            {title && (
              <h2 className="app-section-title text-[#10234F]">{title}</h2>
            )}
            {subtitle && (
              <p className="app-description mt-1 leading-5 text-[#577B9F]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

function FormField({ label, required, help, children }) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-[#19366F]">
        {label}
        {required && <span className="text-[#C43D32]">*</span>}
        {help && (
          <span title={help} className="cursor-help text-[#3478F6]">
            <CircleHelp size={15} />
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function PrimaryButton({ children, icon: Icon = Save, ...props }) {
  return (
    <button
      type="submit"
      {...props}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FF711A] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:bg-[#F04A13] focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon size={17} />
      {children}
    </button>
  );
}

export default function AddStockAdjustment({
  locations = [],
  products = [],
  onSave,
  onCancel,
}) {
  const [businessLocation, setBusinessLocation] = useState("BL0001");
  const [referenceNo, setReferenceNo] = useState("");
  const [date, setDate] = useState(getLocalDateTime);
  const [adjustmentType, setAdjustmentType] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [items, setItems] = useState([]);
  const [amountRecovered, setAmountRecovered] = useState("0");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showProductResults, setShowProductResults] = useState(false);
  const [notice, setNotice] = useState("");
  const locationOptions = locations.length > 0 ? locations : defaultLocations;

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0) * Number(item.unitPrice || 0),
        0
      ),
    [items]
  );

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter((product) => {
        const name = String(product.name ?? product.product ?? "").toLowerCase();
        const sku = String(product.sku ?? product.skuCode ?? "").toLowerCase();
        return name.includes(query) || sku.includes(query);
      })
      .slice(0, 8);
  }, [products, productSearch]);

  const addProduct = (product) => {
    const productId = product.id ?? product._id ?? product.sku ?? product.skuCode;
    const existing = items.find(
      (item) => String(item.productId) === String(productId)
    );

    if (existing) {
      setItems((previous) =>
        previous.map((item) =>
          String(item.productId) === String(productId)
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item
        )
      );
    } else {
      setItems((previous) => [
        ...previous,
        {
          productId,
          name: product.name ?? product.product ?? "Product",
          sku: product.sku ?? product.skuCode ?? "",
          quantity: 1,
          unitPrice: Number(
            product.unitPrice ??
              product.purchasePrice ??
              product.purchase_price ??
              product.price ??
              0
          ),
        },
      ]);
    }

    setProductSearch("");
    setShowProductResults(false);
  };

  const updateItem = (productId, key, value) => {
    setItems((previous) =>
      previous.map((item) =>
        String(item.productId) === String(productId)
          ? {
              ...item,
              [key]: key === "quantity" || key === "unitPrice"
                ? value
                : item[key],
            }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setItems((previous) =>
      previous.filter(
        (item) => String(item.productId) !== String(productId)
      )
    );
  };

  const validate = () => {
    const nextErrors = {};

    if (!businessLocation) nextErrors.businessLocation = "Select a business location.";
    if (!date) nextErrors.date = "Select a date.";
    if (!adjustmentType) nextErrors.adjustmentType = "Select an adjustment type.";
    if (items.length === 0) nextErrors.items = "Add at least one product.";
    if (
      items.some(
        (item) =>
          item.quantity === "" ||
          Number(item.quantity) <= 0 ||
          !Number.isFinite(Number(item.quantity)) ||
          item.unitPrice === "" ||
          Number(item.unitPrice) < 0 ||
          !Number.isFinite(Number(item.unitPrice))
      )
    ) {
      nextErrors.items = "Enter a valid quantity and unit price for each product.";
    }
    if (
      amountRecovered === "" ||
      !Number.isFinite(Number(amountRecovered)) ||
      Number(amountRecovered) < 0
    ) {
      nextErrors.amountRecovered = "Enter a valid recovered amount.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");

    if (!validate()) return;

    const payload = {
      businessLocation,
      referenceNo,
      date,
      adjustmentType,
      products: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        subtotal: Number(item.quantity) * Number(item.unitPrice),
      })),
      totalAmount,
      amountRecovered: Number(amountRecovered),
      reason,
    };

    if (!onSave) {
      setNotice("The form is valid, but no onSave handler is connected yet.");
      return;
    }

    try {
      setSaving(true);
      await onSave(payload);
      setNotice("Stock adjustment saved successfully.");
    } catch (error) {
      setNotice(
        error?.message || "Could not save the stock adjustment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen min-w-0 bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <span className="text-[11px] font-extrabold">INVENTORY · STOCK ADJUSTMENTS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Add Stock Adjustment
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Record stock changes and the amount recovered.
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#E8EDF4] bg-white px-4 py-2.5 text-sm font-bold text-[#19366F] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] sm:self-auto"
            >
              <ArrowLeft size={16} />
              Back to adjustments
            </button>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionCard
            title="Adjustment details"
            subtitle="Select the business location and specify the adjustment."
            icon={ClipboardList}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <FormField label="Business Location" required>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                  />
                  <select
                    value={businessLocation}
                    onChange={(event) => setBusinessLocation(event.target.value)}
                    className={`${inputClass} appearance-none pl-9 pr-9`}
                  >
                    <option value="">Please Select</option>
                    {locationOptions.map((location, index) => {
                      const value =
                        typeof location === "string"
                          ? location
                          : String(location.id ?? location._id ?? location.name);
                      const name =
                        typeof location === "string"
                          ? location
                          : location.name ?? location.label ?? value;
                      const code =
                        typeof location === "string"
                          ? ""
                          : location.code ?? location.locationCode;
                      const displayLabel = code ? `${name} (${code})` : name;

                      return (
                        <option key={`${value}-${index}`} value={value}>
                          {displayLabel}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                  />
                </div>
                {errors.businessLocation && (
                  <p className="text-xs text-[#C43D32]">{errors.businessLocation}</p>
                )}
              </FormField>

              <FormField label="Reference No">
                <input
                  value={referenceNo}
                  onChange={(event) => setReferenceNo(event.target.value)}
                  placeholder="Enter reference number"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Date" required>
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                  />
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
                {errors.date && (
                  <p className="text-xs text-[#C43D32]">{errors.date}</p>
                )}
              </FormField>

              <FormField
                label="Adjustment type"
                required
                help="Choose Normal or Abnormal according to your inventory adjustment."
              >
                <div className="relative">
                  <select
                    value={adjustmentType}
                    onChange={(event) => setAdjustmentType(event.target.value)}
                    className={`${inputClass} appearance-none pr-9`}
                  >
                    <option value="">Please Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                {errors.adjustmentType && (
                <p className="text-xs text-[#C43D32]">{errors.adjustmentType}</p>
                )}
              </FormField>
            </div>
          </SectionCard>

          <SectionCard
            title="Products"
            subtitle="Search for products and enter the adjustment quantities."
            icon={PackageSearch}
          >
            <div className="mx-auto max-w-3xl">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8798AD]"
                />
                <input
                  value={productSearch}
                  onChange={(event) => {
                    setProductSearch(event.target.value);
                    setShowProductResults(true);
                  }}
                  onFocus={() => setShowProductResults(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setShowProductResults(false);
                    if (
                      event.key === "Enter" &&
                      filteredProducts.length === 1
                    ) {
                      event.preventDefault();
                      addProduct(filteredProducts[0]);
                    }
                  }}
                  placeholder="Search products for stock adjustment"
                  className={`${inputClass} py-3 pl-11`}
                />

                {showProductResults && productSearch.trim() && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-[#F2E8DE] bg-white shadow-xl">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => {
                        const productId =
                          product.id ??
                          product._id ??
                          product.sku ??
                          product.skuCode;
                        const name = product.name ?? product.product ?? "Product";
                        const sku = product.sku ?? product.skuCode ?? "";
                        const price = Number(
                          product.unitPrice ??
                            product.purchasePrice ??
                            product.purchase_price ??
                            product.price ??
                            0
                        );

                        return (
                          <button
                            type="button"
                            key={productId}
                            onClick={() => addProduct(product)}
                            className="flex w-full items-center justify-between gap-3 border-b border-[#F2E8DE] px-4 py-3 text-left last:border-b-0 hover:bg-[#FFF7EF]"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-[#19366F]">
                                {name}
                              </span>
                              {sku && (
                                <span className="mt-0.5 block text-xs text-[#8798AD]">
                                  SKU: {sku}
                                </span>
                              )}
                            </span>
                            <span className="shrink-0 text-sm font-semibold text-[#F04A13]">
                              {money(price)}
                            </span>
                            <Plus size={16} className="shrink-0 text-[#E86A20]" />
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-4 py-4 text-sm text-[#577B9F]">
                        {products.length
                          ? "No matching products found."
                          : "Connect your product list to enable product search."}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {errors.items && (
                <p className="mt-2 text-xs text-rose-600">{errors.items}</p>
              )}
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-[#F2E8DE]">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FFF7EF] text-[#19366F]">
                    <th className="px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-wide">
                      Product
                    </th>
                    <th className="w-36 px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-wide">
                      Quantity
                    </th>
                    <th className="w-40 px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-wide">
                      Unit Price
                    </th>
                    <th className="w-40 px-4 py-3.5 text-right text-[10px] font-extrabold uppercase tracking-wide">
                      Subtotal
                    </th>
                    <th className="w-16 px-4 py-3.5 text-center">
                      <Trash2 size={16} className="mx-auto text-[#8798AD]" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2E8DE]">
                  {items.map((item) => (
                    <tr key={item.productId} className="transition hover:bg-[#FFF7EF]">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-[#19366F]">{item.name}</p>
                        {item.sku && (
                          <p className="mt-1 text-xs text-[#8798AD]">
                            SKU: {item.sku}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          aria-label={`Quantity for ${item.name}`}
                          type="number"
                          min="0.01"
                          step="any"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(item.productId, "quantity", event.target.value)
                          }
                          className={`${inputClass} min-w-24 px-2.5 py-2`}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          aria-label={`Unit price for ${item.name}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateItem(item.productId, "unitPrice", event.target.value)
                          }
                          className={`${inputClass} min-w-28 px-2.5 py-2`}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-[#10234F]">
                        {money(Number(item.quantity || 0) * Number(item.unitPrice || 0))}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded-lg p-2 text-[#8798AD] transition hover:bg-[#FFF0ED] hover:text-[#C43D32]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <PackageSearch size={27} className="mx-auto text-[#D4DFEC]" />
                        <p className="mt-3 font-semibold text-[#19366F]">
                          No products added yet
                        </p>
                        <p className="mt-1 text-xs text-[#577B9F]">
                          Search for a product above to add it to this adjustment.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#F2E8DE] bg-[#FFF7EF]">
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-right font-bold text-[#19366F]"
                    >
                      Total Amount
                    </td>
                    <td className="px-4 py-4 text-right text-base font-bold tabular-nums text-[#F04A13]">
                      {money(totalAmount)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </SectionCard>

          <SectionCard
            title="Recovery and notes"
            subtitle="Record the amount recovered and the reason for the adjustment."
            icon={IndianRupee}
          >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="space-y-5">
                <FormField
                  label="Total amount recovered"
                  help="Enter the amount recovered for this stock adjustment."
                >
                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountRecovered}
                      onChange={(event) => setAmountRecovered(event.target.value)}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                  {errors.amountRecovered && (
                    <p className="text-xs text-[#C43D32]">{errors.amountRecovered}</p>
                  )}
                </FormField>

                <div className="rounded-xl border border-[#F8EBDD] bg-[#FFFCF8] p-4">
                  <p className="text-sm font-semibold text-[#577B9F]">
                    Adjustment total
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-[#F04A13]">
                    {money(totalAmount)}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-[#F2E8DE] pt-3 text-sm">
                    <span className="text-[#577B9F]">Amount recovered</span>
                    <span className="font-semibold text-[#19366F]">
                      {money(amountRecovered)}
                    </span>
                  </div>
                </div>
              </div>

              <FormField label="Reason">
                <textarea
                  rows={5}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Enter the reason for this stock adjustment..."
                  className={`${inputClass} min-h-[130px] resize-y`}
                />
              </FormField>
            </div>
          </SectionCard>

          {notice && (
            <div
              role="status"
              className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                notice.includes("successfully")
                  ? "border-[#CDEDDC] bg-[#EAF8F0] text-[#24804C]"
                  : "border-[#F8EBDD] bg-[#FFF1E5] text-[#9A4B13]"
              }`}
            >
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              {notice}
            </div>
          )}

          <div className="flex flex-col-reverse justify-end gap-3 rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:flex-row sm:items-center sm:p-5">
            <p className="mr-auto text-xs leading-5 text-[#8798AD]">
              Fields marked with * are required.
            </p>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-5 py-2.5 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5]"
              >
                <X size={16} />
                Cancel
              </button>
            )}
            <PrimaryButton disabled={saving}>
              {saving ? "Saving..." : "Save adjustment"}
            </PrimaryButton>
          </div>
        </form>

        <footer className="pb-3 pt-1 text-center text-xs text-[#8798AD]">
          Billomax · Inventory management
        </footer>
      </div>
    </main>
  );
}
