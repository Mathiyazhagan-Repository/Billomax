import { useMemo, useState } from "react";
import { CalendarDays, FilePlus2, MapPin, Plus, Search, Trash2, Upload } from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleProducts,
} from "../../../utils/businessStorage.js";

const DRAFTS_KEY = "billomax-pos-drafts";
const QUOTATIONS_KEY = "billomax-pos-quotations";
const PRODUCTS_KEY = "billomax-products";
const sampleProducts = [
  { id: 1, name: "Amlodipine", sku: "0046", sellingPrice: 22.5, stock: 10 },
  { id: 2, name: "Baby Care Cream", sku: "SKU1325", sellingPrice: 12, stock: 5 },
  { id: 3, name: "Paracetamol 500mg", sku: "0038", sellingPrice: 22.5, stock: 197 },
  { id: 4, name: "Vitamin C Tablets", sku: "0056", sellingPrice: 22.5, stock: 0 },
  { id: 5, name: "Cetirizine 10mg", sku: "0061", sellingPrice: 10, stock: 84 },
  { id: 6, name: "Antiseptic Liquid", sku: "0067", sellingPrice: 55, stock: 32 },
];

function readArray(key) {
  try {
    const value = businessStorage.getItem(key);
    if (!value) return [];
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error(`Saved data for ${key} is not an array.`);
    return parsed;
  } catch (error) {
    console.error(`Could not load ${key}:`, error);
    return [];
  }
}

const money = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inputClass = "h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm text-[#33496F] outline-none transition placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10";

function Field({ label, children }) {
  return <label className="block min-w-0"><span className="mb-1.5 block text-xs font-semibold text-[#344B70]">{label}</span>{children}</label>;
}

function Panel({ children, className = "" }) {
  return <section className={`mb-4 rounded-2xl border border-[#F0EAE3] bg-white p-4 shadow-[0_7px_24px_rgba(40,57,97,0.06)] sm:p-6 ${className}`}>{children}</section>;
}

function FileField({ label, value, onChange, onError }) {
  return (
    <Field label={label}>
      <label className="flex h-10 cursor-pointer overflow-hidden rounded-lg border border-[#D6DFEA] bg-white">
        <span className="flex min-w-0 flex-1 items-center truncate px-3 text-sm text-[#8798AD]">{value?.name || "Choose a file"}</span>
        <span className="inline-flex items-center gap-1.5 bg-[#FF711A] px-3 text-xs font-semibold text-white"><Upload size={14} /> Browse</span>
        <input type="file" accept=".pdf,.csv,.zip,.doc,.docx,.jpeg,.jpg,.png" className="sr-only" onChange={(event) => {
          const file = event.target.files?.[0] || null;
          if (file && file.size > 5 * 1024 * 1024) {
            event.target.value = "";
            onError("Choose a file smaller than 5MB.");
            return;
          }
          onChange(file);
        }} />
      </label>
      <p className="mt-1 text-[11px] text-[#8798AD]">Max 5MB · PDF, CSV, ZIP, DOC, DOCX, JPEG, JPG, PNG</p>
    </Field>
  );
}

export default function AddDraft({ onNavigate, mode = "Draft" }) {
  const isQuotation = mode === "Quotation";
  const storageKey = isQuotation ? QUOTATIONS_KEY : DRAFTS_KEY;
  const [products] = useState(() => {
    const stored = readArray(PRODUCTS_KEY);
    return stored.length ? stored : getBusinessSampleProducts(sampleProducts);
  });
  const [form, setForm] = useState({
    location: `${getActiveBusinessStorage()} (BL0001)`, customer: "Walk-In Customer", payTerm: "",
    payTermUnit: "", commissionAgent: "None", saleDate: new Date().toISOString().slice(0, 16),
    invoiceScheme: "Default", invoiceNo: "", salesOrder: "", discountType: "Percentage",
    discountAmount: "1.00", orderTax: "GST", orderTaxRate: "0", sellNote: "",
    shippingDetails: "", shippingAddress: "", shippingCharges: "0.00",
    shippingStatus: "", deliveredTo: "", deliveryPerson: "Please Select",
  });
  const [lines, setLines] = useState([]);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [document, setDocument] = useState(null);
  const [shippingDocument, setShippingDocument] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expensesOpen, setExpensesOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => !product.notForSelling &&
      (!term || `${product.name} ${product.sku || ""}`.toLowerCase().includes(term))).slice(0, 8);
  }, [products, query]);
  const itemCount = lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0);
  const subtotal = lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0) * (1 - Number(line.discount || 0) / 100), 0);
  const discount = form.discountType === "Percentage" ? subtotal * Number(form.discountAmount || 0) / 100 : Number(form.discountAmount || 0);
  const tax = Math.max(0, subtotal - discount) * Number(form.orderTaxRate || 0) / 100;
  const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const total = Math.max(0, subtotal - discount + tax + Number(form.shippingCharges || 0) + expenseTotal);
  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const addProduct = (product) => {
    const existing = lines.find((line) => String(line.productId) === String(product.id));
    setLines((current) => existing
      ? current.map((line) => String(line.productId) === String(product.id) ? { ...line, quantity: Number(line.quantity) + 1 } : line)
      : [...current, {
          id: `${product.id ?? product.sku}-${Date.now()}`, productId: product.id,
          name: product.name, sku: product.sku || "", quantity: 1,
          unitPrice: Number(product.sellingPrice ?? product.sellingPriceExTax ?? 0), discount: 0,
        }]);
    setQuery("");
    setMenuOpen(false);
  };

  const updateFile = (setter) => (file) => setter(file);
  const fileError = (error) => { setMessage(error); setIsError(true); };

  const saveDraft = (event) => {
    event.preventDefault();
    if (!lines.length) {
      setMessage(`Add at least one product before saving this ${mode.toLowerCase()}.`);
      setIsError(true);
      return;
    }
    const record = {
      id: `${Date.now()}`, date: new Date(form.saleDate).toLocaleString("en-GB"),
      customer: form.customer, customerName: form.customer,
      location: form.location.replace(/\s*\([^)]*\)/, ""), status: mode,
      items: lines, subtotal, total, totalItems: itemCount, discount, tax,
      shipping: Number(form.shippingCharges || 0), expenses, invoiceNo: form.invoiceNo,
      salesOrder: form.salesOrder, sellNote: form.sellNote,
      shippingDetails: form.shippingDetails, shippingAddress: form.shippingAddress,
      shippingStatus: form.shippingStatus, deliveredTo: form.deliveredTo,
      attachedDocument: document?.name || "", shippingDocument: shippingDocument?.name || "",
    };
    try {
      businessStorage.setItem(storageKey, JSON.stringify([record, ...readArray(storageKey)]));
      setMessage(`${mode} saved successfully.`);
      setIsError(false);
      setLines([]);
    } catch (error) {
      console.error(`Could not save ${mode.toLowerCase()}:`, error);
      setMessage(`${mode} could not be saved. Please try again.`);
      setIsError(true);
    }
  };

  return (
    <main className="min-h-[calc(100vh-62px)] flex-1 bg-[#FFFAF5] px-3 py-5 sm:px-5 lg:px-7">
      <form onSubmit={saveDraft}>
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#283961]">Add {mode}</h1><p className="mt-1 text-xs text-[#8798AD]">Prepare a sale and save it without completing checkout.</p></div>
          <label className="flex items-center gap-2 text-xs font-medium text-[#536985]"><MapPin size={15} className="text-[#E87928]" /> Location
            <select value={form.location} onChange={(event) => updateForm("location", event.target.value)} className={`${inputClass} w-auto min-w-48`}><option>{getActiveBusinessStorage()} (BL0001)</option><option>{getActiveBusinessStorage()} (BL0002)</option></select>
          </label>
        </header>
        {message && <div role={isError ? "alert" : "status"} className={`mb-4 rounded-xl border px-4 py-3 text-sm ${isError ? "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]" : "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"}`}>{message}</div>}

        <Panel>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Selling price group"><select className={inputClass}><option>Default Selling Price</option></select></Field>
            <Field label="Customer"><select value={form.customer} onChange={(event) => updateForm("customer", event.target.value)} className={inputClass}><option>Walk-In Customer</option><option>Demo Customer</option></select></Field>
            <Field label="Pay term"><span className="flex gap-2"><input value={form.payTerm} onChange={(event) => updateForm("payTerm", event.target.value)} placeholder="Pay term" className={inputClass} /><select value={form.payTermUnit} onChange={(event) => updateForm("payTermUnit", event.target.value)} className={`${inputClass} min-w-32`}><option value="">Please Select</option><option>Days</option><option>Months</option></select></span></Field>
            <Field label="Commission agent"><select value={form.commissionAgent} onChange={(event) => updateForm("commissionAgent", event.target.value)} className={inputClass}><option>None</option></select></Field>
            <Field label="Billing address"><div className="rounded-lg bg-[#FFFCF8] px-3 py-2.5 text-sm text-[#536985]">Walk-In Customer</div></Field>
            <Field label="Invoice scheme"><select value={form.invoiceScheme} onChange={(event) => updateForm("invoiceScheme", event.target.value)} className={inputClass}><option>Default</option></select></Field>
            <Field label="Invoice number"><input value={form.invoiceNo} onChange={(event) => updateForm("invoiceNo", event.target.value)} placeholder="Leave blank to auto-generate" className={inputClass} /></Field>
            <Field label="Sale date"><span className="relative block"><CalendarDays size={15} className="pointer-events-none absolute left-3 top-3 text-[#8798AD]" /><input type="datetime-local" value={form.saleDate} onChange={(event) => updateForm("saleDate", event.target.value)} className={`${inputClass} pl-9`} /></span></Field>
            <Field label="Shipping address"><input value={form.shippingAddress} onChange={(event) => updateForm("shippingAddress", event.target.value)} placeholder="Shipping address" className={inputClass} /></Field>
            <Field label="Sales order"><input value={form.salesOrder} onChange={(event) => updateForm("salesOrder", event.target.value)} placeholder="Sales order number" className={inputClass} /></Field>
            <FileField label="Attach document" value={document} onChange={updateFile(setDocument)} onError={fileError} />
          </div>
        </Panel>

        <Panel>
          <div className="relative mx-auto mb-4 flex max-w-3xl">
            <Search size={16} className="absolute left-3 top-3 text-[#8798AD]" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setMenuOpen(true); }} onFocus={() => setMenuOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) { event.preventDefault(); addProduct(matches[0]); } }} placeholder="Enter product name / SKU / scan barcode" aria-label="Search products" className={`${inputClass} rounded-r-none pl-10`} />
            {menuOpen && query && <div className="absolute left-0 right-11 top-11 z-20 max-h-64 overflow-auto rounded-xl border border-[#E4E9EF] bg-white p-1.5 shadow-xl">{matches.length ? matches.map((product) => <button key={product.id ?? product.sku ?? product.name} type="button" onClick={() => addProduct(product)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[#FFF7EF]"><span><span className="block text-sm font-medium text-[#19366F]">{product.name}</span><span className="text-xs text-[#8798AD]">{product.sku || "No SKU"} · Stock {Number(product.stock || 0)}</span></span><span className="text-sm font-semibold text-[#10234F]">{money(product.sellingPrice ?? product.sellingPriceExTax)}</span></button>) : <p className="px-3 py-4 text-center text-xs text-[#8798AD]">No matching products found.</p>}</div>}
            <button type="button" onClick={() => matches[0] && addProduct(matches[0])} aria-label="Add first matching product" className="flex h-10 w-11 shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-[#D6DFEA] text-[#E87928] hover:bg-[#FFF1E5]"><Plus size={18} /></button>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead><tr className="border-b border-[#F2E8DE] bg-[#FFF7EF] text-[#19366F]">{["Product", "Quantity", "Unit price", "Discount %", "Subtotal", "Remove"].map((heading) => <th key={heading} className="px-3 py-3 text-center font-semibold">{heading}</th>)}</tr></thead>
            <tbody>
              {lines.map((line) => <tr key={line.id} className="border-b border-[#F2E8DE] even:bg-[#FFFCF8]">
                <td className="px-3 py-3"><span className="block font-medium text-[#19366F]">{line.name}</span><span className="text-[10px] text-[#8798AD]">{line.sku}</span></td>
                {["quantity", "unitPrice", "discount"].map((key) => <td key={key} className="w-32 px-3 py-2"><input type="number" min="0" step={key === "quantity" ? "any" : "0.01"} value={line[key]} onChange={(event) => setLines((current) => current.map((item) => item.id === line.id ? { ...item, [key]: event.target.value } : item))} aria-label={`${key} for ${line.name}`} className={`${inputClass} h-9`} /></td>)}
                <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-[#10234F]">{money(Number(line.quantity || 0) * Number(line.unitPrice || 0) * (1 - Number(line.discount || 0) / 100))}</td>
                <td className="text-center"><button type="button" aria-label={`Remove ${line.name}`} onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} className="rounded-lg p-2 text-[#A5412E] hover:bg-[#FFF3F0]"><Trash2 size={16} /></button></td>
              </tr>)}
              {!lines.length && <tr><td colSpan={6} className="px-3 py-9 text-center text-sm text-[#8798AD]">Search above to add products to this {mode.toLowerCase()}.</td></tr>}
            </tbody>
            <tfoot><tr className="border-t border-[#F2E8DE] bg-[#FFF1E5] text-[#10234F]"><td colSpan={3} className="px-3 py-3 font-semibold">Items: {itemCount.toFixed(2)}</td><td className="px-3 py-3 text-right font-semibold">Subtotal</td><td className="px-3 py-3 text-right font-extrabold">{money(subtotal)}</td><td /></tr></tfoot>
          </table></div>
        </Panel>

        <Panel>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Discount type"><select value={form.discountType} onChange={(event) => updateForm("discountType", event.target.value)} className={inputClass}><option>Percentage</option><option>Fixed</option></select></Field>
            <Field label="Discount amount"><input type="number" min="0" step="0.01" value={form.discountAmount} onChange={(event) => updateForm("discountAmount", event.target.value)} className={inputClass} /></Field>
            <p className="self-end pb-2 text-sm font-semibold text-[#344B70]">Discount: <span className="font-normal">{money(discount)}</span></p>
            <Field label="Order tax"><select value={form.orderTax} onChange={(event) => updateForm("orderTax", event.target.value)} className={inputClass}><option>GST</option><option>None</option></select></Field>
            <Field label="Order tax rate (%)"><input type="number" min="0" step="0.01" value={form.orderTaxRate} onChange={(event) => updateForm("orderTaxRate", event.target.value)} className={inputClass} /></Field>
            <p className="self-end pb-2 text-sm font-semibold text-[#344B70]">Order tax: <span className="font-normal">{money(tax)}</span></p>
            <Field label="Sell note"><textarea value={form.sellNote} onChange={(event) => updateForm("sellNote", event.target.value)} rows={3} className={`${inputClass} h-auto py-2`} /></Field>
          </div>
        </Panel>

        <Panel>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Shipping details"><textarea value={form.shippingDetails} onChange={(event) => updateForm("shippingDetails", event.target.value)} placeholder="Shipping details" rows={3} className={`${inputClass} h-auto py-2`} /></Field>
            <Field label="Shipping address"><textarea value={form.shippingAddress} onChange={(event) => updateForm("shippingAddress", event.target.value)} placeholder="Shipping address" rows={3} className={`${inputClass} h-auto py-2`} /></Field>
            <Field label="Shipping charges"><input type="number" min="0" step="0.01" value={form.shippingCharges} onChange={(event) => updateForm("shippingCharges", event.target.value)} className={inputClass} /></Field>
            <Field label="Shipping status"><select value={form.shippingStatus} onChange={(event) => updateForm("shippingStatus", event.target.value)} className={inputClass}><option value="">Please Select</option><option>Ordered</option><option>Packed</option><option>Shipped</option><option>Delivered</option></select></Field>
            <Field label="Delivered to"><input value={form.deliveredTo} onChange={(event) => updateForm("deliveredTo", event.target.value)} placeholder="Recipient name" className={inputClass} /></Field>
            <Field label="Delivery person"><select value={form.deliveryPerson} onChange={(event) => updateForm("deliveryPerson", event.target.value)} className={inputClass}><option>Please Select</option><option>None</option></select></Field>
            <FileField label="Shipping documents" value={shippingDocument} onChange={updateFile(setShippingDocument)} onError={fileError} />
          </div>
          <div className="mt-5 border-t border-[#F2E8DE] pt-4">
            <button type="button" onClick={() => { setExpensesOpen((open) => !open); if (!expenses.length) setExpenses([{ id: `${Date.now()}`, name: "", amount: "0.00" }]); }} className="inline-flex items-center gap-2 rounded-lg border border-[#F3D5BE] bg-[#FFF7EF] px-3 py-2 text-xs font-semibold text-[#D96D20] hover:bg-[#FFF1E5]"><Plus size={14} /> {expensesOpen ? "Hide additional expenses" : "Add additional expenses"}</button>
            {expensesOpen && <div className="mt-3 grid gap-2 sm:grid-cols-2">{expenses.map((expense) => <div key={expense.id} className="flex gap-2"><input value={expense.name} onChange={(event) => setExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, name: event.target.value } : item))} placeholder="Expense name" className={inputClass} /><input type="number" min="0" step="0.01" value={expense.amount} onChange={(event) => setExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, amount: event.target.value } : item))} aria-label="Expense amount" className={`${inputClass} max-w-36`} /><button type="button" aria-label="Remove expense" onClick={() => setExpenses((current) => current.filter((item) => item.id !== expense.id))} className="rounded-lg p-2 text-[#A5412E]"><Trash2 size={16} /></button></div>)}<button type="button" onClick={() => setExpenses((current) => [...current, { id: `${Date.now()}-${current.length}`, name: "", amount: "0.00" }])} className="text-left text-xs font-semibold text-[#D96D20]">+ Add another expense</button></div>}
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-6 border-t border-[#F2E8DE] pt-4 text-sm text-[#60738D]"><span>Round off: 0.00</span><strong className="text-[#10234F]">Total payable: {money(total)}</strong></div>
        </Panel>
        <div className="flex flex-wrap justify-center gap-3 pb-6">
          <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#FF711A] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#EF5F0F]"><FilePlus2 size={17} /> Save {mode.toLowerCase()}</button>
          <button type="button" onClick={() => onNavigate?.(isQuotation ? "List Quotations" : "List Draft")} className="h-12 rounded-xl border border-[#E6D8CA] bg-white px-6 text-sm font-semibold text-[#526783] hover:bg-[#FFF7EF]">Cancel</button>
        </div>
      </form>
    </main>
  );
}