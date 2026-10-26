import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  FileSpreadsheet,
  Paperclip,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleProducts,
  getBusinessSupplierNames,
} from "../../../utils/businessStorage.js";

const PURCHASES_KEY = "billomax-purchases";
const PRODUCTS_KEY = "billomax-products";
const today = new Date().toISOString().slice(0, 10);

const blankLine = () => ({
  id: `${Date.now()}-${Math.random()}`,
  name: "",
  sku: "",
  quantity: 1,
  unitCost: 0,
  discount: 0,
  margin: 25,
  sellingPrice: 0,
});

function readStorage(key, fallback) {
  try {
    const stored = businessStorage.getItem(key);
    if (!stored) return fallback;
    const value = JSON.parse(stored);
    return Array.isArray(value) ? value : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from local storage:`, error);
    return fallback;
  }
}

function Field({ label, required, children, hint }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#344B70]">
        {label}
        {required && <span className="text-[#E87928]">*</span>}
        {hint && <span className="font-normal text-[#8A9AAF]">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#33496F] outline-none transition placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10 ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536985] outline-none transition focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10 ${className}`}
    >
      {children}
    </select>
  );
}

function Section({ title, description, action, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1ECE6] px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-[#283961]">{title}</h2>
          {description && <p className="mt-1 text-xs text-[#8798AD]">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function AddPurchase({ onNavigate }) {
  const [form, setForm] = useState({
    supplier: "",
    reference: "",
    date: today,
    status: "Received",
    address: "",
    location: getActiveBusinessStorage(),
    payTerm: "",
    attachedDocument: null,
    discountType: "Fixed",
    discountAmount: "0",
    purchaseTax: "0",
    notes: "",
    shippingDetails: "",
    shippingCharges: "0",
    shippingStatus: "",
    deliveredTo: "",
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    eWayBill: "",
    irn: "",
    acknowledgementNumber: "",
    acknowledgementDate: "",
    paymentAmount: "0",
    paymentDate: today,
    paymentMethod: "Cash",
    paymentNote: "",
  });
  const [lines, setLines] = useState([]);
  const [products, setProducts] = useState(() => readStorage(
    PRODUCTS_KEY,
    getBusinessSampleProducts([]),
  ));
  const [productSearch, setProductSearch] = useState("");
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [extraExpenses, setExtraExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [step, setStep] = useState(0);

  const subtotal = lines.reduce((sum, line) => {
    const netUnitCost = Math.max(0, Number(line.unitCost) - Number(line.discount || 0));
    return sum + netUnitCost * Number(line.quantity || 0);
  }, 0);
  const lineDiscountTotal = lines.reduce(
    (sum, line) => sum + Number(line.discount || 0) * Number(line.quantity || 0),
    0,
  );
  const purchaseDiscount = form.discountType === "Percentage"
    ? subtotal * (Number(form.discountAmount || 0) / 100)
    : Number(form.discountAmount || 0);
  const taxAmount = Math.max(0, subtotal - purchaseDiscount) * (Number(form.purchaseTax || 0) / 100);
  const expenseTotal = extraExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const grandTotal = Math.max(0, subtotal - purchaseDiscount + taxAmount + Number(form.shippingCharges || 0) + expenseTotal);
  const amountPaid = Number(form.paymentAmount || 0);
  const due = Math.max(0, grandTotal - amountPaid);

  const matchedProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    return products
      .filter((product) =>
        !product.notForSelling &&
        (!query || `${product.name} ${product.sku}`.toLowerCase().includes(query)),
      )
      .slice(0, 8);
  }, [products, productSearch]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateLine = (id, key, value) => {
    setLines((current) =>
      current.map((line) => {
        if (line.id !== id) return line;
        const updated = { ...line, [key]: value };
        if (key === "unitCost" || key === "margin") {
          updated.sellingPrice =
            (Number(updated.unitCost) - Number(updated.discount || 0)) *
            (1 + Number(updated.margin || 0) / 100);
        }
        return updated;
      }),
    );
  };

  const addProduct = (product) => {
    const line = {
      ...blankLine(),
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      unitCost: Number(product?.purchasePrice ?? product?.purchasePriceIncTax ?? 0),
      sellingPrice: Number(product?.sellingPrice ?? 0),
      margin: Number(product?.margin ?? 25),
    };
    setLines((current) => [...current, line]);
    setProductSearch("");
    setProductMenuOpen(false);
  };

  const resetForm = () => {
    setForm({
      supplier: "",
      reference: "",
      date: today,
      status: "Received",
      address: "",
      location: getActiveBusinessStorage(),
      payTerm: "",
      attachedDocument: null,
      discountType: "Fixed",
      discountAmount: "0",
      purchaseTax: "0",
      notes: "",
      shippingDetails: "",
      shippingCharges: "0",
      shippingStatus: "",
      deliveredTo: "",
      vehicleNumber: "",
      driverName: "",
      driverPhone: "",
      eWayBill: "",
      irn: "",
      acknowledgementNumber: "",
      acknowledgementDate: "",
      paymentAmount: "0",
      paymentDate: today,
      paymentMethod: "Cash",
      paymentNote: "",
    });
    setLines([]);
    setExtraExpenses([]);
    setMessage("");
  };

  const savePurchase = (event) => {
    event.preventDefault();
    if (!form.supplier.trim()) {
      setMessage("Enter a supplier before saving this purchase.");
      setMessageType("error");
      return;
    }
    if (!lines.length || lines.some((line) => !line.name.trim() || Number(line.quantity) <= 0)) {
      setMessage("Add at least one product and check that each product has a name and quantity greater than zero.");
      setMessageType("error");
      return;
    }
    if (amountPaid > grandTotal) {
      setMessage("The payment amount cannot be greater than the purchase total.");
      setMessageType("error");
      return;
    }

    const record = {
      id: Date.now(),
      date: form.date,
      reference: form.reference.trim() || `PO-${Date.now().toString().slice(-6)}`,
      location: form.location,
      supplier: form.supplier.trim(),
      purchaseStatus: form.status,
      paymentStatus: amountPaid >= grandTotal ? "Paid" : amountPaid > 0 ? "Partial" : "Due",
      grandTotal,
      paymentDue: due,
      addedBy: "You",
      items: lines,
      notes: form.notes,
      amountPaid,
      paymentMethod: form.paymentMethod,
    };
    try {
      const savedPurchases = readStorage(PURCHASES_KEY, []);
      businessStorage.setItem(PURCHASES_KEY, JSON.stringify([record, ...savedPurchases]));
    } catch (error) {
      console.error("Could not save purchase locally:", error);
      setMessage("This purchase could not be saved in this browser. Check available storage and try again.");
      setMessageType("error");
      return;
    }
    setMessage("Purchase saved in this browser. It is available in List Purchases on this device.");
    setMessageType("success");
    setStep(1);
  };

  const onDocumentChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      update("attachedDocument", null);
      setMessage("The attachment must be 5 MB or smaller.");
      setMessageType("error");
      event.target.value = "";
      return;
    }
    update("attachedDocument", file);
    setMessage("");
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex-1 bg-[#FFFAF5] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8798AD]">Inventory management</p>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#F5852A]">Add Purchase</h1>
            <p className="mt-1 text-sm text-[#71839A]">Record supplier, product, shipping and payment details.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("List Purchases")}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D7E0EB] bg-white px-3.5 text-sm font-medium text-[#536985] transition hover:border-[#F5A15D] hover:text-[#E87928]"
          >
            <ArrowLeft size={15} /> Back to purchases
          </button>
        </div>

        <div className="mb-5 grid grid-cols-1 overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white sm:grid-cols-3">
          {["Select Supplier", "Payment Mode", "Upload File"].map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`flex items-center gap-3 border-b border-[#F1ECE6] px-5 py-4 text-left last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${step === index ? "bg-[#FFF7EF]" : "bg-white"}`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${step >= index ? "bg-[#F5852A] text-white" : "bg-[#EDF1F6] text-[#8090A4]"}`}>
                {step > index ? <Check size={16} /> : index + 1}
              </span>
              <span className={`text-sm font-semibold ${step === index ? "text-[#D96D20]" : "text-[#536985]"}`}>{label}</span>
            </button>
          ))}
        </div>

        {message && (
          <div role={messageType === "error" ? "alert" : "status"} className={`mb-4 rounded-xl border px-4 py-3 text-sm ${messageType === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-[#F4D5B8] bg-[#FFF8F0] text-[#8B5A32]"}`}>
            {message}
          </div>
        )}

        <form onSubmit={savePurchase} className="space-y-5">
          <Section
            title="Purchase details"
            description="Choose the supplier and enter the purchase reference and delivery details."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Field label="Supplier" required>
                <Input value={form.supplier} onChange={(event) => update("supplier", event.target.value)} placeholder="Supplier name" list="purchase-supplier-options" />
                <datalist id="purchase-supplier-options">
                  {getBusinessSupplierNames().map((supplier) => <option key={supplier} value={supplier} />)}
                </datalist>
              </Field>
              <Field label="Reference number">
                <Input value={form.reference} onChange={(event) => update("reference", event.target.value)} placeholder="Auto-generated if blank" />
              </Field>
              <Field label="Purchase date" required>
                <Input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
              </Field>
              <Field label="Purchase status" required>
                <Select value={form.status} onChange={(event) => update("status", event.target.value)}>
                  {["Received", "Pending", "Ordered"].map((status) => <option key={status}>{status}</option>)}
                </Select>
              </Field>
              <Field label="Supplier address">
                <Input value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Address" />
              </Field>
              <Field label="Business location" required>
                <Select value={form.location} onChange={(event) => update("location", event.target.value)}>
                  <option>{getActiveBusinessStorage()}</option>
                </Select>
              </Field>
              <Field label="Pay term" hint="(optional)">
                <div className="flex gap-2">
                  <Input type="number" min="0" value={form.payTerm} onChange={(event) => update("payTerm", event.target.value)} placeholder="0" />
                  <Select aria-label="Pay term unit" className="max-w-[118px]" defaultValue="Days">
                    <option>Days</option>
                    <option>Months</option>
                  </Select>
                </div>
              </Field>
              <Field label="Attach document" hint="(max 5 MB)">
                <label className="flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-lg border border-dashed border-[#D6DFEA] bg-[#FCFDFE] px-3 text-sm text-[#71839A] hover:border-[#F5A15D]">
                  <Paperclip size={15} className="shrink-0 text-[#E87928]" />
                  <span className="truncate">{form.attachedDocument?.name || "Choose file"}</span>
                  <input type="file" className="sr-only" onChange={onDocumentChange} />
                </label>
              </Field>
            </div>
          </Section>

          <Section
            title="Purchase items"
            description="Search saved products or add a blank line to enter an item manually."
            action={
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setLines((current) => [...current, blankLine()])} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#F2C49E] bg-[#FFF8F0] px-3 text-xs font-semibold text-[#D96D20] hover:bg-[#FFF0E1]">
                  <Plus size={14} /> Add product
                </button>
                <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#D7E0EB] bg-white px-3 text-xs font-medium text-[#536985] hover:border-[#F5A15D] hover:text-[#E87928]">
                  <Upload size={14} /> Import products
                  <input type="file" accept=".csv" className="sr-only" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setMessage(`Selected ${file.name}. Add items with the product search or Add product controls.`);
                    setMessageType("success");
                    event.target.value = "";
                  }} />
                </label>
              </div>
            }
          >
            <div className="relative mb-4 max-w-xl">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A2B4]" />
              <Input
                value={productSearch}
                onChange={(event) => { setProductSearch(event.target.value); setProductMenuOpen(true); }}
                onFocus={() => setProductMenuOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && productSearch.trim()) {
                    event.preventDefault();
                    addProduct({ name: productSearch.trim() });
                  }
                }}
                placeholder="Search by product name or SKU, or type a name and press Enter"
                className="pl-9"
              />
              {productMenuOpen && productSearch.trim() && (
                <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-[#E1E7EF] bg-white p-1 shadow-lg">
                  {matchedProducts.map((product) => (
                    <button key={product.id ?? product.sku ?? product.name} type="button" onClick={() => addProduct(product)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-[#344B70] hover:bg-[#FFF7EF]">
                      <span className="truncate font-medium">{product.name}</span>
                      <span className="shrink-0 text-xs text-[#8798AD]">{product.sku || "No SKU"} · {formatMoney(product.purchasePrice ?? product.purchasePriceIncTax)}</span>
                    </button>
                  ))}
                  <button type="button" onClick={() => addProduct({ name: productSearch.trim() })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#D96D20] hover:bg-[#FFF7EF]">
                    <Plus size={14} /> Add “{productSearch.trim()}” as a new line
                  </button>
                  <button type="button" aria-label="Close product suggestions" onClick={() => setProductMenuOpen(false)} className="sr-only">Close suggestions</button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E7ECF2]">
              <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#60738D]">
                  <tr>
                    {["Product", "Quantity", "Unit cost", "Discount / unit", "Line total", "Margin %", "Selling price", ""].map((heading) => (
                      <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1F5]">
                  {lines.map((line) => {
                    const lineTotal = Math.max(0, Number(line.unitCost) - Number(line.discount || 0)) * Number(line.quantity || 0);
                    return (
                      <tr key={line.id}>
                        <td className="min-w-[220px] px-3 py-2.5">
                          <Input value={line.name} onChange={(event) => updateLine(line.id, "name", event.target.value)} placeholder="Product name" className="h-9" />
                          <Input value={line.sku} onChange={(event) => updateLine(line.id, "sku", event.target.value)} placeholder="SKU / code" className="mt-1 h-8 text-xs" />
                        </td>
                        <td className="w-28 px-3 py-2.5"><Input type="number" min="0.01" step="any" value={line.quantity} onChange={(event) => updateLine(line.id, "quantity", event.target.value)} className="h-9" /></td>
                        <td className="w-36 px-3 py-2.5"><Input type="number" min="0" step="any" value={line.unitCost} onChange={(event) => updateLine(line.id, "unitCost", event.target.value)} className="h-9" /></td>
                        <td className="w-36 px-3 py-2.5"><Input type="number" min="0" step="any" value={line.discount} onChange={(event) => updateLine(line.id, "discount", event.target.value)} className="h-9" /></td>
                        <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-[#344B70]">{formatMoney(lineTotal)}</td>
                        <td className="w-28 px-3 py-2.5"><Input type="number" min="0" step="any" value={line.margin} onChange={(event) => updateLine(line.id, "margin", event.target.value)} className="h-9" /></td>
                        <td className="w-36 px-3 py-2.5"><Input type="number" min="0" step="any" value={line.sellingPrice} onChange={(event) => updateLine(line.id, "sellingPrice", event.target.value)} className="h-9" /></td>
                        <td className="px-3 py-2.5"><button type="button" aria-label={`Remove ${line.name || "product"}`} onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} className="rounded-lg p-2 text-[#A0AABA] hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></td>
                      </tr>
                    );
                  })}
                  {!lines.length && (
                    <tr><td colSpan="8" className="px-4 py-10 text-center text-sm text-[#8A9AAF]">No products added yet. Search for an item or use Add product.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Purchase discount">
                  <div className="flex gap-2">
                    <Select value={form.discountType} onChange={(event) => update("discountType", event.target.value)} className="max-w-[130px]">
                      <option>Fixed</option><option>Percentage</option>
                    </Select>
                    <Input type="number" min="0" step="any" value={form.discountAmount} onChange={(event) => update("discountAmount", event.target.value)} />
                  </div>
                </Field>
                <Field label="Purchase tax" hint="(%)">
                  <Input type="number" min="0" step="any" value={form.purchaseTax} onChange={(event) => update("purchaseTax", event.target.value)} />
                </Field>
                <Field label="Additional notes">
                  <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows="3" placeholder="Add a note about this purchase" className="w-full rounded-lg border border-[#D6DFEA] bg-white px-3 py-2 text-sm text-[#33496F] outline-none placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10" />
                </Field>
              </div>
              <div className="rounded-xl border border-[#F1ECE6] bg-[#FFFCF9] p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3 text-[#60738D]"><span>Items subtotal</span><span>{formatMoney(subtotal + lineDiscountTotal)}</span></div>
                  <div className="flex justify-between gap-3 text-[#60738D]"><span>Item discounts</span><span>- {formatMoney(lineDiscountTotal)}</span></div>
                  <div className="flex justify-between gap-3 text-[#60738D]"><span>Purchase discount</span><span>- {formatMoney(purchaseDiscount)}</span></div>
                  <div className="flex justify-between gap-3 text-[#60738D]"><span>Purchase tax</span><span>{formatMoney(taxAmount)}</span></div>
                  <div className="flex justify-between gap-3 text-[#60738D]"><span>Shipping & expenses</span><span>{formatMoney(Number(form.shippingCharges || 0) + expenseTotal)}</span></div>
                  <div className="flex justify-between border-t border-[#E8E1DA] pt-3 text-base font-semibold text-[#283961]"><span>Grand total</span><span>{formatMoney(grandTotal)}</span></div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Shipping details" description="Optional delivery, carrier and invoice reference details.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Field label="Shipping details"><Input value={form.shippingDetails} onChange={(event) => update("shippingDetails", event.target.value)} placeholder="Carrier / shipping notes" /></Field>
              <Field label="Shipping charges"><Input type="number" min="0" step="any" value={form.shippingCharges} onChange={(event) => update("shippingCharges", event.target.value)} /></Field>
              <Field label="Shipping status"><Select value={form.shippingStatus} onChange={(event) => update("shippingStatus", event.target.value)}><option value="">Select status</option><option>Ordered</option><option>Shipped</option><option>Delivered</option></Select></Field>
              <Field label="Delivered to"><Input value={form.deliveredTo} onChange={(event) => update("deliveredTo", event.target.value)} placeholder="Recipient name" /></Field>
              <Field label="Vehicle number"><Input value={form.vehicleNumber} onChange={(event) => update("vehicleNumber", event.target.value)} placeholder="Vehicle number" /></Field>
              <Field label="Driver name"><Input value={form.driverName} onChange={(event) => update("driverName", event.target.value)} placeholder="Driver name" /></Field>
              <Field label="Driver phone"><Input type="tel" value={form.driverPhone} onChange={(event) => update("driverPhone", event.target.value)} placeholder="Phone number" /></Field>
              <Field label="E-Way Bill number"><Input value={form.eWayBill} onChange={(event) => update("eWayBill", event.target.value)} placeholder="E-Way Bill number" /></Field>
              <Field label="IRN"><Input value={form.irn} onChange={(event) => update("irn", event.target.value)} placeholder="Invoice reference number" /></Field>
              <Field label="Acknowledgement number"><Input value={form.acknowledgementNumber} onChange={(event) => update("acknowledgementNumber", event.target.value)} placeholder="Acknowledgement number" /></Field>
              <Field label="Acknowledgement date"><Input type="date" value={form.acknowledgementDate} onChange={(event) => update("acknowledgementDate", event.target.value)} /></Field>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#F1ECE6] pt-4">
              <div>
                <p className="text-sm font-semibold text-[#344B70]">Additional expenses</p>
                <p className="mt-1 text-xs text-[#8798AD]">Add any other charges to the purchase total.</p>
              </div>
              <button type="button" onClick={() => setExtraExpenses((current) => [...current, { id: `${Date.now()}-${Math.random()}`, name: "", amount: 0 }])} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D7E0EB] bg-white px-3 text-xs font-medium text-[#536985] hover:border-[#F5A15D] hover:text-[#E87928]"><Plus size={14} /> Add expense</button>
            </div>
            {extraExpenses.length > 0 && (
              <div className="mt-3 space-y-2">
                {extraExpenses.map((expense) => (
                  <div key={expense.id} className="flex gap-2">
                    <Input aria-label="Expense name" value={expense.name} onChange={(event) => setExtraExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, name: event.target.value } : item))} placeholder="Expense name" />
                    <Input aria-label="Expense amount" type="number" min="0" step="any" value={expense.amount} onChange={(event) => setExtraExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, amount: event.target.value } : item))} className="max-w-[180px]" />
                    <button type="button" aria-label="Remove expense" onClick={() => setExtraExpenses((current) => current.filter((item) => item.id !== expense.id))} className="rounded-lg px-3 text-[#A0AABA] hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Add payment" description="Enter the payment made against this purchase.">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F5FAFF] px-4 py-3">
              <span className="text-sm font-medium text-[#60738D]">Supplier advance balance</span>
              <span className="text-sm font-semibold text-[#344B70]">{formatMoney(0)}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Field label="Amount"><Input type="number" min="0" step="any" value={form.paymentAmount} onChange={(event) => update("paymentAmount", event.target.value)} /></Field>
              <Field label="Paid on"><Input type="date" value={form.paymentDate} onChange={(event) => update("paymentDate", event.target.value)} /></Field>
              <Field label="Payment method"><Select value={form.paymentMethod} onChange={(event) => update("paymentMethod", event.target.value)}>{["Cash", "Card", "Bank transfer", "Cheque", "Other"].map((method) => <option key={method}>{method}</option>)}</Select></Field>
              <Field label="Payment note"><Input value={form.paymentNote} onChange={(event) => update("paymentNote", event.target.value)} placeholder="Optional note" /></Field>
            </div>
            <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-[#F1ECE6] pt-4 text-sm">
              <span className="text-[#60738D]">Outstanding after payment <strong className="ml-2 font-semibold text-[#344B70]">{formatMoney(due)}</strong></span>
              <button type="button" onClick={() => setProducts(readStorage(PRODUCTS_KEY, []))} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#60738D] hover:text-[#E87928]"><FileSpreadsheet size={14} /> Refresh product list</button>
            </div>
          </Section>

          <div className="sticky bottom-0 z-[1] flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F0EAE3] bg-white/95 p-4 shadow-[0_-5px_20px_rgba(40,57,97,0.05)] backdrop-blur">
            <p className="text-xs text-[#8798AD]">Purchase data is saved locally in this browser; no server API is connected.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={resetForm} className="h-10 rounded-lg border border-[#D7E0EB] bg-white px-4 text-sm font-medium text-[#536985] hover:bg-[#F8FAFC]">Reset bill</button>
              <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#F29A4A] to-[#E87928] px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                <Check size={16} /> Save purchase
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddPurchase;
