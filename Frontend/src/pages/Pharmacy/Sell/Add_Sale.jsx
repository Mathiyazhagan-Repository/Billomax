import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Info,
  MapPin,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { initialSales } from "./All_Sales.jsx";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleProducts,
} from "../../../utils/businessStorage.js";

const SALES_KEY = "billomax-sales";
const PRODUCTS_KEY = "billomax-products";
const SALES_ORDERS_KEY = "billomax-sales-orders";
const today = new Date().toISOString().slice(0, 16);

const sampleProducts = [
  { id: 1, name: "Amlodipine", sku: "0046", sellingPrice: 22.5, stock: 0, unit: "piece" },
  { id: 2, name: "Baby Care Cream", sku: "SKU1325", sellingPrice: 12, stock: 5, unit: "jar" },
  { id: 3, name: "Paracetamol 500mg", sku: "0038", sellingPrice: 22.5, stock: 197, unit: "piece" },
  { id: 4, name: "Vitamin C Tablets", sku: "0056", sellingPrice: 22.5, stock: 0, unit: "piece" },
  { id: 5, name: "Cetirizine 10mg", sku: "0061", sellingPrice: 10, stock: 84, unit: "strip" },
  { id: 6, name: "Antiseptic Liquid", sku: "0067", sellingPrice: 55, stock: 32, unit: "bottle" },
];

function readArray(key, fallback = []) {
  try {
    const stored = businessStorage.getItem(key);
    if (!stored) return fallback;
    const value = JSON.parse(stored);
    if (!Array.isArray(value)) {
      throw new Error(`Saved data for ${key} is not in the expected format.`);
    }
    return value;
  } catch (error) {
    console.error(`Could not load ${key}:`, error);
    return fallback;
  }
}

function money(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#F0EAE3] bg-white p-5 shadow-[0_7px_24px_rgba(40,57,97,0.07)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function Field({ label, required = false, hint, children, className = "" }) {
  return (
    <div className={`block min-w-0 ${className}`}>
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#344B70]">
        {label}
        {required && <span className="text-[#E87928]">*</span>}
        {hint && (
          <span title={hint} className="text-[#4DBFD0]">
            <CircleHelp size={14} />
          </span>
        )}
      </span>
      {children}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm text-[#33496F] outline-none transition placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10 ${className}`}
    />
  );
}

function Select({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm text-[#536985] outline-none transition focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10 ${className}`}
    >
      {children}
    </select>
  );
}

function IconInput({ icon: Icon, children }) {
  return (
    <div className="flex min-w-0 items-center overflow-hidden rounded-lg border border-[#D6DFEA] bg-white focus-within:border-[#F5A15D]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border-r border-[#E6EAF0] bg-[#FFFCF8] text-[#6F8198]">
        <Icon size={15} />
      </span>
      {children}
    </div>
  );
}

function initialForm() {
  return {
    location: "Pharmacy (BL0001)",
    priceGroup: "Default Selling Price",
    customer: "Walk-In Customer",
    payTerm: "",
    commissionAgent: "None",
    saleDate: today,
    status: "",
    invoiceScheme: "Default",
    invoiceNo: "",
    salesOrder: "",
    discountType: "Percentage",
    discountAmount: "1.00",
    orderTax: "GST",
    orderTaxRate: "0",
    sellNote: "",
    shippingDetails: "",
    shippingAddress: "",
    shippingCharges: "0.00",
    shippingStatus: "",
    deliveredTo: "",
    deliveryPerson: "",
    paymentAmount: "0.00",
    paymentMethod: "Cash",
    paymentNote: "",
  };
}

export default function AddSale({ onNavigate }) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    location: `${getActiveBusinessStorage()} (BL0001)`,
  }));
  const [products] = useState(() => {
    const stored = readArray(PRODUCTS_KEY);
    return stored.length ? stored : getBusinessSampleProducts(sampleProducts);
  });
  const [salesOrders] = useState(() => readArray(SALES_ORDERS_KEY));
  const [lines, setLines] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [attachedDocument, setAttachedDocument] = useState(null);
  const [shippingDocument, setShippingDocument] = useState(null);
  const [expensesOpen, setExpensesOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const productMatches = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    return products
      .filter(
        (product) =>
          !product.notForSelling &&
          (!query ||
            `${product.name} ${product.sku || ""}`.toLowerCase().includes(query)),
      )
      .slice(0, 8);
  }, [productQuery, products]);

  const itemCount = lines.reduce(
    (sum, line) => sum + Number(line.quantity || 0),
    0,
  );
  const subtotal = lines.reduce(
    (sum, line) =>
      sum +
      Number(line.quantity || 0) *
        Number(line.unitPrice || 0) *
        (1 - Number(line.discount || 0) / 100),
    0,
  );
  const discount = form.discountType === "Percentage"
    ? subtotal * (Number(form.discountAmount || 0) / 100)
    : Number(form.discountAmount || 0);
  const orderTax = Math.max(0, subtotal - discount) *
    (Number(form.orderTaxRate || 0) / 100);
  const expenseTotal = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );
  const shippingCharges = Number(form.shippingCharges || 0);
  const totalPayable = Math.max(
    0,
    subtotal - discount + orderTax + shippingCharges + expenseTotal,
  );
  const paymentAmount = Number(form.paymentAmount || 0);
  const balance = Math.max(0, totalPayable - paymentAmount);
  const changeReturn = Math.max(0, paymentAmount - totalPayable);

  const updateForm = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const addProduct = (product) => {
    setLines((current) => [
      ...current,
      {
        id: `${product.id ?? product.sku}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        sku: product.sku || "",
        unit: product.unit || "piece",
        quantity: 1,
        unitPrice: Number(product.sellingPrice ?? product.sellingPriceExTax ?? 0),
        discount: 0,
      },
    ]);
    setProductQuery("");
    setProductMenuOpen(false);
  };

  const updateLine = (id, key, value) =>
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, [key]: value } : line,
      ),
    );

  const saveSale = (event, shouldPrint = false) => {
    event.preventDefault();
    if (!form.location) {
      setMessage("Select a business location before saving.");
      setMessageType("error");
      return;
    }
    if (!form.customer.trim()) {
      setMessage("Select a customer before saving.");
      setMessageType("error");
      return;
    }
    if (!form.status) {
      setMessage("Select a sale status before saving.");
      setMessageType("error");
      return;
    }
    if (!lines.length || lines.some((line) => !line.name || Number(line.quantity) <= 0)) {
      setMessage("Add at least one product with a quantity greater than zero.");
      setMessageType("error");
      return;
    }
    if (paymentAmount > totalPayable) {
      setMessage("The payment amount cannot be greater than the total payable.");
      setMessageType("error");
      return;
    }

    const date = new Date(form.saleDate);
    const sale = {
      id: `${Date.now()}`,
      date: Number.isNaN(date.getTime())
        ? form.saleDate
        : `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
      invoiceNo: form.invoiceNo.trim() || `${Date.now()}`.slice(-6),
      customerName: form.customer,
      contactNumber: "",
      location: form.location.replace(/\s*\([^)]*\)/, ""),
      paymentStatus:
        balance === 0 ? "Paid" : paymentAmount > 0 ? "Partial" : "Due",
      paymentMethod: form.paymentMethod,
      total: totalPayable,
      totalPaid: paymentAmount,
      sellDue: balance,
      sellReturnDue: 0,
      shippingStatus: form.shippingStatus,
      totalItems: itemCount,
      addedBy: getActiveBusinessStorage().toLowerCase(),
      sellNote: form.sellNote,
      staffNote: "",
      shippingDetails: form.shippingDetails,
      shippingAddress: form.shippingAddress,
      shippingCharges,
      items: lines,
      discount,
      tax: orderTax,
      paymentNote: form.paymentNote,
      salesOrder: form.salesOrder,
      attachedDocument: attachedDocument?.name || "",
      shippingDocument: shippingDocument?.name || "",
      expenses,
    };

    try {
      const existing = readArray(
        SALES_KEY,
        getActiveBusinessStorage() === "Pharmacy" ? initialSales : [],
      );
      businessStorage.setItem(SALES_KEY, JSON.stringify([sale, ...existing]));
      setMessage(`Sale ${sale.invoiceNo} saved successfully.`);
      setMessageType("success");
      if (shouldPrint) window.print();
      else onNavigate?.("All Sales");
    } catch (error) {
      console.error("Could not save sale:", error);
      setMessage("Sale could not be saved. Please try again.");
      setMessageType("error");
    }
  };

  const addExpense = () =>
    setExpenses((current) => [
      ...current,
      { id: `${Date.now()}`, name: "", amount: "0.00" },
    ]);

  const fileInput = (file, setFile, label) => (
    <div>
      <label className="flex h-10 cursor-pointer overflow-hidden rounded-lg border border-[#D6DFEA] bg-white">
        <span className="flex min-w-0 flex-1 items-center truncate px-3 text-sm text-[#8798AD]">
          {file?.name || "Choose a file"}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 bg-[#3983F6] px-3 text-xs font-medium text-white hover:bg-[#286FD8]">
          <Upload size={14} />
          Browse
        </span>
        <input
          type="file"
          accept=".pdf,.csv,.zip,.doc,.docx,.jpeg,.jpg,.png"
          onChange={(event) => {
            const selected = event.target.files?.[0] || null;
            if (selected && selected.size > 5 * 1024 * 1024) {
              setFile(null);
              event.target.value = "";
              setMessage("Choose a file smaller than 5MB.");
              setMessageType("error");
              return;
            }
            setFile(selected);
          }}
          className="sr-only"
          aria-label={label}
        />
      </label>
      <p className="mt-1.5 text-[11px] leading-4 text-[#8798AD]">
        Max file size: 5MB · PDF, CSV, ZIP, DOC, DOCX, JPEG, JPG, PNG
      </p>
    </div>
  );

  return (
    <main className="min-h-[calc(100vh-62px)] flex-1 bg-[#FFFAF5] px-3 py-5 sm:px-5 lg:px-7">
      <form onSubmit={(event) => saveSale(event)}>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#283961]">
            Add Sale
          </h1>
          <p className="mt-1 text-xs text-[#8798AD]">
            Create a sale, add products, and record payment details.
          </p>
        </div>

        {message && (
          <div
            role={messageType === "error" ? "alert" : "status"}
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              messageType === "error"
                ? "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]"
                : "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(240px,320px)_1fr] sm:items-end">
          <Field label="Business location" required>
            <IconInput icon={MapPin}>
              <Select
                value={form.location}
                onChange={(event) => updateForm("location", event.target.value)}
                className="min-w-0 border-0 focus:ring-0"
              >
                <option>{getActiveBusinessStorage()} (BL0001)</option>
                <option>{getActiveBusinessStorage()} (BL0002)</option>
              </Select>
            </IconInput>
          </Field>
          <p className="flex items-center gap-1 text-xs text-[#577B9F] sm:justify-end">
            <Info size={14} className="text-[#4DBFD0]" />
            Sale details are saved to All Sales.
          </p>
        </div>

        <Panel className="mb-4">
          <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Selling price group">
              <Select
                value={form.priceGroup}
                onChange={(event) => updateForm("priceGroup", event.target.value)}
              >
                <option>Default Selling Price</option>
              </Select>
            </Field>
            <Field label="Customer" required>
              <div className="flex gap-2">
                <Select
                  value={form.customer}
                  onChange={(event) => updateForm("customer", event.target.value)}
                >
                  <option>Walk-In Customer</option>
                  <option>Demo Customer</option>
                </Select>
                <button
                  type="button"
                  title="Add a new customer"
                  onClick={() =>
                    setMessage("Create customers from Contacts before adding them to a sale.")
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D6DFEA] text-[#3983F6] hover:bg-[#F3F8FF]"
                >
                  <Plus size={17} />
                </button>
              </div>
            </Field>
            <Field label="Pay term" hint="Optional credit term">
              <div className="flex gap-2">
                <Input
                  value={form.payTerm}
                  onChange={(event) => updateForm("payTerm", event.target.value)}
                  placeholder="Pay term"
                />
                <Select
                  aria-label="Pay term unit"
                  className="min-w-[120px]"
                  defaultValue=""
                >
                  <option value="">Please Select</option>
                  <option>Days</option>
                  <option>Months</option>
                </Select>
              </div>
            </Field>
            <Field label="Commission Agent">
              <Select
                value={form.commissionAgent}
                onChange={(event) => updateForm("commissionAgent", event.target.value)}
              >
                <option>None</option>
              </Select>
            </Field>
            <Field label="Billing address">
              <div className="min-h-10 rounded-lg bg-[#FFFCF8] px-3 py-2 text-sm text-[#536985]">
                {form.customer}
              </div>
            </Field>
            <Field label="Status" required>
              <Select
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value)}
              >
                <option value="">Please Select</option>
                <option>Ordered</option>
                <option>Pending</option>
                <option>Completed</option>
              </Select>
            </Field>
            <Field label="Invoice scheme">
              <Select
                value={form.invoiceScheme}
                onChange={(event) => updateForm("invoiceScheme", event.target.value)}
              >
                <option>Default</option>
              </Select>
            </Field>
            <Field label="Sale date" required>
              <IconInput icon={CalendarDays}>
                <Input
                  type="datetime-local"
                  required
                  value={form.saleDate}
                  onChange={(event) => updateForm("saleDate", event.target.value)}
                  className="min-w-0 border-0 focus:ring-0"
                />
              </IconInput>
            </Field>
            <Field label="Shipping address">
              <textarea
                value={form.shippingAddress}
                onChange={(event) => updateForm("shippingAddress", event.target.value)}
                placeholder="Shipping address"
                rows={2}
                className="w-full rounded-lg border border-[#D6DFEA] px-3 py-2 text-sm text-[#536985] outline-none focus:border-[#F5A15D]"
              />
            </Field>
            <Field label="Invoice No." hint="Keep blank to auto-generate">
              <Input
                value={form.invoiceNo}
                onChange={(event) => updateForm("invoiceNo", event.target.value)}
                placeholder="Invoice No."
              />
              <span className="mt-1 block text-[11px] text-[#8798AD]">
                Keep blank to auto-generate
              </span>
            </Field>
            <Field label="Attach document">
              {fileInput(attachedDocument, setAttachedDocument, "Attach document")}
            </Field>
            <Field label="Sales Order">
              <Select
                value={form.salesOrder}
                onChange={(event) => updateForm("salesOrder", event.target.value)}
              >
                <option value="">Select sales order</option>
                {salesOrders.map((order) => (
                  <option key={order.id} value={order.orderNo}>
                    {order.orderNo} · {order.customer}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Panel>

        <Panel className="mb-4 min-h-[340px]">
          <div className="mx-auto mb-4 flex max-w-4xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-lg border border-r-0 border-[#D6DFEA] bg-[#FFFCF8] text-[#6F8198]">
              <Search size={16} />
            </div>
            <div className="relative min-w-0 flex-1">
              <input
                value={productQuery}
                onFocus={() => setProductMenuOpen(true)}
                onChange={(event) => {
                  setProductQuery(event.target.value);
                  setProductMenuOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && productMatches[0]) {
                    event.preventDefault();
                    addProduct(productMatches[0]);
                  }
                }}
                placeholder="Enter Product name / SKU / Scan bar code"
                aria-label="Search products"
                className="h-10 w-full border border-[#D6DFEA] px-3 text-sm text-[#536985] outline-none focus:border-[#F5A15D]"
              />
              {productMenuOpen && productQuery && (
                <div className="absolute left-0 right-0 top-11 z-20 max-h-64 overflow-y-auto rounded-xl border border-[#E4E9EF] bg-white p-1.5 shadow-xl">
                  {productMatches.length ? (
                    productMatches.map((product) => (
                      <button
                        key={product.id ?? product.sku ?? product.name}
                        type="button"
                        onClick={() => addProduct(product)}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[#FFF7EF]"
                      >
                        <span>
                          <span className="block text-sm font-medium text-[#19366F]">
                            {product.name}
                          </span>
                          <span className="text-xs text-[#8798AD]">
                            {product.sku || "No SKU"} · Stock{" "}
                            {Number(product.stock || 0)}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-[#10234F]">
                          {money(product.sellingPrice ?? product.sellingPriceExTax)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-4 text-center text-xs text-[#8798AD]">
                      No products match this search.
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label="Add the first matching product"
              onClick={() => productMatches[0] && addProduct(productMatches[0])}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-[#D6DFEA] text-[#3983F6] hover:bg-[#F3F8FF]"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#F2E8DE] bg-[#FFF7EF] text-[#19366F]">
                  {["Product", "Quantity", "Unit Price", "Discount %", "Subtotal", ""].map(
                    (heading) => (
                      <th key={heading || "remove"} className="px-3 py-3 text-center font-semibold">
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-b border-[#F2E8DE] even:bg-[#FFFCF8]">
                    <td className="px-3 py-3">
                      <span className="block font-medium text-[#19366F]">{line.name}</span>
                      <span className="text-[10px] text-[#8798AD]">{line.sku}</span>
                    </td>
                    <td className="w-32 px-3 py-2">
                      <Input
                        aria-label={`Quantity for ${line.name}`}
                        type="number"
                        min="0.01"
                        step="any"
                        value={line.quantity}
                        onChange={(event) =>
                          updateLine(line.id, "quantity", event.target.value)
                        }
                        className="h-9 text-center"
                      />
                    </td>
                    <td className="w-36 px-3 py-2">
                      <Input
                        aria-label={`Unit price for ${line.name}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.unitPrice}
                        onChange={(event) =>
                          updateLine(line.id, "unitPrice", event.target.value)
                        }
                        className="h-9"
                      />
                    </td>
                    <td className="w-32 px-3 py-2">
                      <Input
                        aria-label={`Discount percentage for ${line.name}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={line.discount}
                        onChange={(event) =>
                          updateLine(line.id, "discount", event.target.value)
                        }
                        className="h-9"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-[#10234F]">
                      {money(
                        Number(line.quantity || 0) *
                          Number(line.unitPrice || 0) *
                          (1 - Number(line.discount || 0) / 100),
                      )}
                    </td>
                    <td className="w-12 px-2 py-2 text-center">
                      <button
                        type="button"
                        aria-label={`Remove ${line.name}`}
                        onClick={() =>
                          setLines((current) =>
                            current.filter((item) => item.id !== line.id),
                          )
                        }
                        className="rounded-lg p-2 text-[#A5412E] hover:bg-[#FFF3F0]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!lines.length && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-[#8798AD]">
                      Search for a product above to add it to this sale.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#F2E8DE] bg-[#FFF1E5] text-[#10234F]">
                  <td colSpan={3} className="px-3 py-3 font-semibold">Items: {itemCount.toFixed(2)}</td>
                  <td className="px-3 py-3 text-right font-semibold">Total</td>
                  <td className="px-3 py-3 text-right font-extrabold">{money(subtotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </Panel>

        <Panel className="mb-4">
          <div className="grid gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Discount Type" required>
              <Select
                value={form.discountType}
                onChange={(event) => updateForm("discountType", event.target.value)}
              >
                <option>Percentage</option>
                <option>Fixed</option>
              </Select>
            </Field>
            <Field label="Discount Amount" required>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.discountAmount}
                onChange={(event) => updateForm("discountAmount", event.target.value)}
              />
            </Field>
            <div className="flex items-center text-sm font-semibold text-[#344B70]">
              Discount: <span className="ml-2 font-normal">{money(discount)}</span>
            </div>
            <Field label="Order Tax" required>
              <Select
                value={form.orderTax}
                onChange={(event) => {
                  updateForm("orderTax", event.target.value);
                  updateForm(
                    "orderTaxRate",
                    event.target.value === "GST" ? "0" : event.target.value,
                  );
                }}
              >
                <option value="GST">GST (0%)</option>
                <option value="0">No tax</option>
                <option value="5">GST 5%</option>
                <option value="12">GST 12%</option>
                <option value="18">GST 18%</option>
              </Select>
            </Field>
            <div className="flex items-center text-sm font-semibold text-[#344B70]">
              Order Tax: <span className="ml-2 font-normal">{money(orderTax)}</span>
            </div>
            <Field label="Sell note" className="md:col-span-2 xl:col-span-3">
              <textarea
                rows={3}
                value={form.sellNote}
                onChange={(event) => updateForm("sellNote", event.target.value)}
                className="w-full rounded-lg border border-[#D6DFEA] px-3 py-2 text-sm text-[#536985] outline-none focus:border-[#F5A15D]"
              />
            </Field>
          </div>
        </Panel>

        <Panel className="mb-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Shipping Details">
              <textarea
                rows={3}
                value={form.shippingDetails}
                onChange={(event) => updateForm("shippingDetails", event.target.value)}
                placeholder="Shipping Details"
                className="w-full rounded-lg border border-[#D6DFEA] px-3 py-2 text-sm text-[#536985] outline-none focus:border-[#F5A15D]"
              />
            </Field>
            <Field label="Shipping Address">
              <textarea
                rows={3}
                value={form.shippingAddress}
                onChange={(event) => updateForm("shippingAddress", event.target.value)}
                placeholder="Shipping Address"
                className="w-full rounded-lg border border-[#D6DFEA] px-3 py-2 text-sm text-[#536985] outline-none focus:border-[#F5A15D]"
              />
            </Field>
            <Field label="Shipping Charges">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.shippingCharges}
                onChange={(event) => updateForm("shippingCharges", event.target.value)}
              />
            </Field>
            <Field label="Shipping Status">
              <Select
                value={form.shippingStatus}
                onChange={(event) => updateForm("shippingStatus", event.target.value)}
              >
                <option value="">Please Select</option>
                <option>Ordered</option>
                <option>Packed</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </Select>
            </Field>
            <Field label="Delivered To">
              <Input
                value={form.deliveredTo}
                onChange={(event) => updateForm("deliveredTo", event.target.value)}
                placeholder="Delivered To"
              />
            </Field>
            <Field label="Delivery Person">
              <Select
                value={form.deliveryPerson}
                onChange={(event) => updateForm("deliveryPerson", event.target.value)}
              >
                <option value="">Please Select</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Shipping Documents" className="md:col-span-2 xl:col-span-3">
              {fileInput(shippingDocument, setShippingDocument, "Shipping documents")}
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#F2E8DE] pt-5">
            <button
              type="button"
              onClick={() => {
                setExpensesOpen((open) => !open);
                if (!expenses.length) addExpense();
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-xs font-semibold text-white hover:brightness-105"
            >
              <Plus size={15} />
              Add additional expenses
              <ChevronDown size={14} />
            </button>
            <div className="text-right text-sm text-[#344B70]">
              <p className="text-xs text-[#71839A]">(Round Off: 0)</p>
              <p className="font-semibold">
                Total Payable: <span className="text-[#10234F]">{money(totalPayable)}</span>
              </p>
            </div>
          </div>
          {expensesOpen && (
            <div className="mt-4 space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="grid gap-3 sm:grid-cols-[1fr_200px_auto]">
                  <Input
                    aria-label="Additional expense name"
                    value={expense.name}
                    onChange={(event) =>
                      setExpenses((current) =>
                        current.map((item) =>
                          item.id === expense.id
                            ? { ...item, name: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Expense name"
                  />
                  <Input
                    aria-label="Additional expense amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={expense.amount}
                    onChange={(event) =>
                      setExpenses((current) =>
                        current.map((item) =>
                          item.id === expense.id
                            ? { ...item, amount: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExpenses((current) =>
                        current.filter((item) => item.id !== expense.id),
                      )
                    }
                    aria-label="Remove additional expense"
                    className="flex h-10 items-center justify-center rounded-lg border border-[#F1B6B1] px-3 text-[#C35445] hover:bg-[#FFF3F0]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExpense}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#E87928] hover:underline"
              >
                <Plus size={13} /> Add another expense
              </button>
            </div>
          )}
        </Panel>

        <Panel className="mb-5">
          <h2 className="mb-4 text-lg font-semibold text-[#F5852A]">Add payment</h2>
          <p className="mb-4 text-xs text-[#60738D]">
            <span className="font-semibold text-[#344B70]">Advance Balance:</span>{" "}
            ₹ 0.00
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Amount" required>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.paymentAmount}
                onChange={(event) => updateForm("paymentAmount", event.target.value)}
              />
            </Field>
            <Field label="Paid on" required>
              <Input
                type="datetime-local"
                value={today}
                readOnly
                className="bg-[#F3F4F6]"
              />
            </Field>
            <Field label="Payment Method" required>
              <Select
                value={form.paymentMethod}
                onChange={(event) => updateForm("paymentMethod", event.target.value)}
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Bank transfer</option>
                <option>UPI</option>
              </Select>
            </Field>
            <Field label="Payment note">
              <Input
                value={form.paymentNote}
                onChange={(event) => updateForm("paymentNote", event.target.value)}
                placeholder="Payment note"
              />
            </Field>
          </div>
          <div className="mt-5 grid gap-3 border-y border-[#F2E8DE] py-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-[#344B70]">Change Return</p>
              <p className="mt-1 text-lg font-semibold text-[#10234F]">
                {money(changeReturn)}
              </p>
            </div>
            <p className="self-end text-right text-sm text-[#60738D]">
              <span className="font-semibold text-[#344B70]">Balance:</span>{" "}
              {money(balance)}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => onNavigate?.("All Sales")}
              className="h-10 rounded-lg border border-[#D7E0EB] px-5 text-sm font-medium text-[#60738D] hover:bg-[#FFFCF8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#7479FF] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6268EB]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={(event) => saveSale(event, true)}
              className="h-10 rounded-lg bg-[#08A86B] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F5B]"
            >
              Save and print
            </button>
          </div>
        </Panel>
      </form>

      <footer className="pb-6 text-center text-xs text-[#8798AD]">
        Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3 |
        Copyright © 2026 All rights reserved.
      </footer>
    </main>
  );
}