import { useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  CircleHelp,
  Expand,
  FileText,
  ImagePlus,
  Info,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleProducts,
} from "../../../utils/businessStorage.js";

const initialForm = {
  name: "",
  sku: "",
  barcodeType: "Code 128 (C128)",
  unit: "",
  brand: "",
  category: "",
  subcategory: "",
  location: "",
  manageStock: true,
  alertQuantity: "",
  description: "",
  molecules: "",
  imei: false,
  notForSelling: false,
  weight: "",
  hsnCode: "",
  length: "",
  piecesPerBag: "",
  quantityInBags: false,
  color: "",
  serviceTime: "",
  applicableTax: "None",
  sellingPriceTaxType: "Exclusive",
  productType: "Single",
  purchasePriceExTax: "",
  purchasePriceIncTax: "",
  margin: "25",
  sellingPriceExTax: "",
  openingStock: "",
};

const unitOptions = ["Piece", "Box", "Bottle", "Strip", "Jar", "Bag"];
const pharmacyBrandOptions = ["MediCare", "HealthPlus", "CareWell", "Wellness"];
const pharmacyCategoryOptions = ["Health & Wellness Products", "First Aid Supplies", "Baby Care Products", "Medical Devices"];
const brochureExtensions = ".pdf,.csv,.zip,.doc,.docx,.jpeg,.jpg,.png";

function Field({ label, required, hint, children, className = "", headerAction }) {
  return (
    <div className={`block min-w-0 ${className}`}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#344B70]">
          {label}
          {required && <span className="text-[#E87928]">*</span>}
          {hint && (
            <span title={hint} className="inline-flex text-[#4DBFD0]">
              <CircleHelp size={14} />
            </span>
          )}
        </span>
        {headerAction}
      </div>
      <label className="block">{children}</label>
    </div>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#33496F] outline-none transition placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10 ${className}`}
    />
  );
}

function SelectInput({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal text-[#536985] outline-none transition focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10 ${className}`}
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange, children }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#344B70]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded border-[#C9D4E1] accent-[#4588D1]"
      />
      {children}
    </label>
  );
}

function AddProduct({ onNavigate }) {
  const serviceProducts = getBusinessSampleProducts([]);
  const brandOptions = getActiveBusinessStorage() === "Pharmacy"
    ? pharmacyBrandOptions
    : [...new Set(serviceProducts.map((product) => product.brand).filter(Boolean))];
  const categoryOptions = getActiveBusinessStorage() === "Pharmacy"
    ? pharmacyCategoryOptions
    : [...new Set(serviceProducts.map((product) => product.category).filter(Boolean))];
  const locationOptions = [getActiveBusinessStorage()];
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [productImage, setProductImage] = useState(null);
  const [brochure, setBrochure] = useState(null);
  const [variantImage, setVariantImage] = useState(null);
  const [quickAdd, setQuickAdd] = useState(null);
  const [quickAddValue, setQuickAddValue] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [customOptions, setCustomOptions] = useState({
    units: [],
    brands: [],
    categories: [],
  });
  const imageInputRef = useRef(null);
  const brochureInputRef = useRef(null);
  const variantImageRef = useRef(null);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updatePurchasePrice = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      const taxRate = current.applicableTax === "None" ? 0 : Number.parseFloat(current.applicableTax) || 0;
      if (key === "purchasePriceExTax" && value !== "") {
        next.purchasePriceIncTax = (Number(value) * (1 + taxRate / 100)).toFixed(2);
      }
      if (key === "purchasePriceIncTax" && value !== "") {
        next.purchasePriceExTax = (Number(value) / (1 + taxRate / 100)).toFixed(2);
      }
      if (next.purchasePriceExTax !== "") {
        next.sellingPriceExTax = (
          Number(next.purchasePriceExTax) *
          (1 + (Number.parseFloat(next.margin) || 0) / 100)
        ).toFixed(2);
      }
      return next;
    });
  };

  const acceptImage = (file, setFile) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      setMessageType("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Images must be 5 MB or smaller.");
      setMessageType("error");
      return;
    }
    setFile(file);
    setMessage("");
  };

  const acceptBrochure = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage("The brochure must be 5 MB or smaller.");
      setMessageType("error");
      return;
    }
    setBrochure(file);
    setMessage("");
  };

  const addQuickOption = (event) => {
    event.preventDefault();
    const value = quickAddValue.trim();
    if (!value || !quickAdd) return;
    const optionKey = quickAdd.optionKey;
    setCustomOptions((current) => ({
      ...current,
      [optionKey]: [...new Set([...current[optionKey], value])],
    }));
    update(quickAdd.formKey, value);
    setQuickAdd(null);
    setQuickAddValue("");
  };

  const saveProduct = (event, action) => {
    event.preventDefault();
    if (
      !form.name.trim() ||
      !form.unit ||
      form.purchasePriceExTax === "" ||
      form.purchasePriceIncTax === "" ||
      form.sellingPriceExTax === ""
    ) {
      setMessage("Complete the required product name, unit, purchase price, and selling price fields before saving.");
      setMessageType("error");
      return;
    }

    const product = {
      id: Date.now(),
      name: form.name.trim(),
      location: form.location || getActiveBusinessStorage(),
      purchasePrice: Number(form.purchasePriceExTax) || 0,
      purchasePriceIncTax: Number(form.purchasePriceIncTax) || 0,
      margin: Number(form.margin) || 0,
      sellingPrice: Number(form.sellingPriceExTax) || 0,
      sellingPriceIncTax: form.sellingPriceTaxType === "Inclusive"
        ? Number(form.sellingPriceExTax) || 0
        : (Number(form.sellingPriceExTax) || 0) * (1 + (Number.parseFloat(form.applicableTax) || 0) / 100),
      stock: form.manageStock ? Number(form.openingStock) || 0 : 0,
      unit: form.unit.toLowerCase() || "piece",
      type: form.productType,
      category: form.category,
      brand: form.brand,
      tax: form.applicableTax === "None" ? "" : form.applicableTax,
      sku: form.sku || `PR-${Date.now().toString().slice(-6)}`,
      molecules: form.molecules,
      notForSelling: form.notForSelling,
    };

    try {
      const stored = businessStorage.getItem("billomax-products");
      const savedProducts = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(savedProducts)) {
        throw new Error("Saved product data is not in the expected format.");
      }
      businessStorage.setItem("billomax-products", JSON.stringify([...savedProducts, product]));
    } catch (error) {
      console.error("Could not save product locally:", error);
      setMessage("The product could not be saved in this browser. Check available storage and try again.");
      setMessageType("error");
      return;
    }

    if (action === "another") {
      setForm(initialForm);
      setProductImage(null);
      setBrochure(null);
      setVariantImage(null);
      setMessage("Product saved. You can add another product now.");
      setMessageType("success");
      return;
    }

    setMessage("Product saved successfully.");
    setMessageType("success");
    if (action === "opening-stock" || action === "selling-price-group") {
      setMessage(action === "opening-stock"
        ? "Product saved. Opening stock can be entered from the product list."
        : "Product saved. Selling-price-group prices can be configured from the product list.");
      return;
    }
    onNavigate?.("List Products");
  };

  const cardClass = "rounded-2xl border border-[#F0E4D7] bg-white p-5 shadow-[0_5px_18px_rgba(40,57,97,0.05)] sm:p-7";
  const optionButton = (formKey, optionKey, label) => (
    <button
      type="button"
      onClick={() => {
        setQuickAdd({ formKey, optionKey, label });
        setQuickAddValue("");
      }}
      aria-label={`Add ${label.toLowerCase()}`}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D6DFEA] bg-[#F7FAFD] text-[#4385C7] transition hover:border-[#F5A15D] hover:bg-[#FFF5EA] hover:text-[#E87928]"
    >
      <Plus size={17} />
    </button>
  );

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-1 text-xs font-medium text-[#8798AD]">Products <span className="px-1">/</span> Add Product</div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">Add new product</h1>
            <p className="mt-1 text-sm text-[#71809A]">Add product details, inventory settings, and pricing.</p>
          </div>
          <button type="button" onClick={() => onNavigate?.("List Products")} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D8E0EA] bg-white px-3.5 text-sm font-medium text-[#60738D] transition hover:border-[#F5A15D] hover:text-[#E87928]">
            <ArrowLeft size={16} /> Back to products
          </button>
        </div>

        {message && (
          <div role="status" className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${messageType === "error" ? "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]" : "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"}`}>
            <span className="flex items-start gap-2">{messageType === "error" ? <Info size={17} className="mt-0.5 shrink-0" /> : <Check size={17} className="mt-0.5 shrink-0" />}{message}</span>
            <button type="button" onClick={() => setMessage("")} aria-label="Dismiss message"><X size={16} /></button>
          </div>
        )}

        <form onSubmit={(event) => saveProduct(event, "save")} className="space-y-5">
          <section className={cardClass}>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#F5852A]"><FileText size={19} /></span>
              <div>
                <h2 className="text-base font-semibold text-[#283961]">Product information</h2>
                <p className="mt-0.5 text-xs text-[#8798AD]">Name, classification, stock controls, and product media.</p>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Product Name" required>
                <TextInput required autoFocus value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Product name" />
              </Field>
              <Field label="SKU/Code" hint="Leave blank to generate a SKU automatically.">
                <TextInput value={form.sku} onChange={(event) => update("sku", event.target.value)} placeholder="SKU/Code" />
              </Field>
              <Field label="Barcode Type" required>
                <SelectInput value={form.barcodeType} onChange={(event) => update("barcodeType", event.target.value)}>
                  <option>Code 128 (C128)</option>
                  <option>Code 39</option>
                  <option>EAN-13</option>
                  <option>UPC-A</option>
                </SelectInput>
              </Field>

              <Field label="Unit" required>
                <div className="flex gap-2">
                  <SelectInput required value={form.unit} onChange={(event) => update("unit", event.target.value)}>
                    <option value="">Please Select</option>
                    {[...unitOptions, ...customOptions.units].map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                  </SelectInput>
                  {optionButton("unit", "units", "Unit")}
                </div>
              </Field>
              <Field label="Brand">
                <div className="flex gap-2">
                  <SelectInput value={form.brand} onChange={(event) => update("brand", event.target.value)}>
                    <option value="">Please Select</option>
                    {[...brandOptions, ...customOptions.brands].map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                  </SelectInput>
                  {optionButton("brand", "brands", "Brand")}
                </div>
              </Field>
              <Field label="Category">
                <div className="flex gap-2">
                  <SelectInput value={form.category} onChange={(event) => update("category", event.target.value)}>
                    <option value="">Please Select</option>
                    {[...categoryOptions, ...customOptions.categories].map((category) => <option key={category} value={category}>{category}</option>)}
                  </SelectInput>
                  {optionButton("category", "categories", "Category")}
                </div>
              </Field>

              <Field label="Sub category">
                <SelectInput value={form.subcategory} onChange={(event) => update("subcategory", event.target.value)}>
                  <option value="">Please Select</option>
                  {form.category && <option value={`${form.category} - General`}>{form.category} - General</option>}
                </SelectInput>
              </Field>
              <Field label="Business Locations" hint="Choose the location where this product will be available.">
                <SelectInput value={form.location} onChange={(event) => update("location", event.target.value)}>
                  <option value="">Please Select</option>
                  {locationOptions.map((location) => <option key={location} value={location}>{location}</option>)}
                </SelectInput>
              </Field>
              <div className="flex flex-col justify-end gap-2 pb-1">
                <Toggle checked={form.manageStock} onChange={(event) => update("manageStock", event.target.checked)}>Manage Stock?</Toggle>
                <p className="text-xs italic text-[#8798AD]">Enable stock management at product level</p>
              </div>

              {form.manageStock && (
                <Field label="Alert quantity" hint="Receive a low-stock alert when inventory reaches this amount.">
                  <TextInput min="0" type="number" value={form.alertQuantity} onChange={(event) => update("alertQuantity", event.target.value)} placeholder="Alert quantity" />
                </Field>
              )}

              <Field
                label="Product Description"
                className="md:col-span-2"
                headerAction={form.description.trim().length > 180 && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription(true)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-[#4779B8] transition hover:bg-[#EEF4FB] hover:text-[#315F9A]"
                  >
                    <Expand size={13} />
                    View full description
                  </button>
                )}
              >
                <textarea
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  rows={2}
                  placeholder="Describe the product, its use, or other helpful information..."
                  className="app-themed-scrollbar h-12 min-h-12 max-h-32 w-full resize-y rounded-lg border border-[#D6DFEA] bg-white px-3 py-2.5 text-sm leading-5 text-[#33496F] outline-none placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
                />
              </Field>
              <div className="space-y-5">
                <Field label="Molecules">
                  <TextInput value={form.molecules} onChange={(event) => update("molecules", event.target.value)} placeholder="Molecules / active ingredient" />
                </Field>
                <Field label="Product image" hint="Square image recommended. Maximum file size: 5 MB.">
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={(event) => acceptImage(event.target.files?.[0], setProductImage)} className="hidden" />
                  <button type="button" onClick={() => imageInputRef.current?.click()} className="flex min-h-24 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#D6DFEA] bg-[#FFFCF8] px-3 py-4 text-center transition hover:border-[#F5A15D] hover:bg-[#FFF8F0]">
                    <ImagePlus size={21} className="text-[#5584BC]" />
                    <span className="text-xs font-medium text-[#536985]">{productImage?.name ?? "Choose a product image"}</span>
                    <span className="text-[11px] text-[#98A6B8]">PNG, JPG or WEBP · up to 5 MB</span>
                  </button>
                </Field>
                <Field label="Product brochure" hint="PDF, CSV, ZIP, DOC, DOCX, JPEG, JPG, or PNG. Maximum file size: 5 MB.">
                  <input ref={brochureInputRef} type="file" accept={brochureExtensions} onChange={(event) => acceptBrochure(event.target.files?.[0])} className="hidden" />
                  <button type="button" onClick={() => brochureInputRef.current?.click()} className="flex h-10 w-full items-center gap-2 rounded-lg border border-[#D6DFEA] bg-white px-3 text-left text-sm text-[#536985] hover:border-[#F5A15D]">
                    <Upload size={15} className="text-[#5584BC]" />
                    <span className="truncate">{brochure?.name ?? "Choose brochure file"}</span>
                  </button>
                  <span className="mt-1 block text-[11px] text-[#98A6B8]">Allowed files: PDF, CSV, ZIP, DOC, DOCX, JPEG, JPG, PNG · Max 5 MB</span>
                </Field>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#283961]">Additional product details</h2>
                <p className="mt-1 text-xs text-[#8798AD]">Optional identifiers, packaging, and service settings.</p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <Toggle checked={form.imei} onChange={(event) => update("imei", event.target.checked)}>Enable product description, IMEI or serial number</Toggle>
                <Toggle checked={form.notForSelling} onChange={(event) => update("notForSelling", event.target.checked)}>Not for selling</Toggle>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
              <Field label="WT/Mts">
                <TextInput type="number" min="0" step="0.01" value={form.weight} onChange={(event) => update("weight", event.target.value)} placeholder="WT/Mts" />
              </Field>
              <Field label="HSN Code">
                <TextInput value={form.hsnCode} onChange={(event) => update("hsnCode", event.target.value)} placeholder="HSN Code" />
              </Field>
              <Field label="Length">
                <TextInput type="number" min="0" step="0.01" value={form.length} onChange={(event) => update("length", event.target.value)} placeholder="Length (in meters)" />
              </Field>
              <Field label="PCS/BAG">
                <TextInput type="number" min="0" value={form.piecesPerBag} onChange={(event) => update("piecesPerBag", event.target.value)} placeholder="PCS/BAG" />
              </Field>
              <div className="sm:col-span-2">
                <Toggle checked={form.quantityInBags} onChange={(event) => update("quantityInBags", event.target.checked)}>Qty entered in Bags</Toggle>
                <p className="mt-1.5 max-w-sm text-xs italic leading-5 text-[#8798AD]">Use this when purchase quantity 1 means 1 bag, so total pieces = quantity × PCS/BAG.</p>
              </div>
              <Field label="Color">
                <TextInput value={form.color} onChange={(event) => update("color", event.target.value)} placeholder="Color" />
              </Field>
              <Field label="Service staff timer/Preparation time (In minutes)">
                <TextInput type="number" min="0" value={form.serviceTime} onChange={(event) => update("serviceTime", event.target.value)} placeholder="Preparation time" />
              </Field>
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-6">
              <h2 className="text-base font-semibold text-[#283961]">Tax and pricing</h2>
              <p className="mt-1 text-xs text-[#8798AD]">Choose how tax is applied, then enter purchase and selling prices.</p>
            </div>

            <div className="mb-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
              <Field label="Applicable Tax">
                <SelectInput value={form.applicableTax} onChange={(event) => update("applicableTax", event.target.value)}>
                  <option>None</option>
                  <option>5%</option>
                  <option>12%</option>
                  <option>18%</option>
                  <option>28%</option>
                </SelectInput>
              </Field>
              <Field label="Selling Price Tax Type" required>
                <SelectInput required value={form.sellingPriceTaxType} onChange={(event) => update("sellingPriceTaxType", event.target.value)}>
                  <option>Exclusive</option>
                  <option>Inclusive</option>
                </SelectInput>
              </Field>
              <Field label="Product Type" required hint="Select the structure of this product.">
                <SelectInput required value={form.productType} onChange={(event) => update("productType", event.target.value)}>
                  <option>Single</option>
                  <option>Variable</option>
                  <option>Combo</option>
                </SelectInput>
              </Field>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E5EAF0]">
              <div className="grid min-w-[860px] grid-cols-[1.3fr_0.8fr_1fr_1fr] bg-[#59B85D] text-xs font-semibold text-white">
                <div className="border-r border-white/30 px-4 py-3">Default Purchase Price</div>
                <div className="border-r border-white/30 px-4 py-3">× Margin (%) <span title="Margin is calculated from the purchase price." className="ml-1 inline-flex align-middle text-white/90"><CircleHelp size={13} /></span></div>
                <div className="border-r border-white/30 px-4 py-3">Default Selling Price</div>
                <div className="px-4 py-3">Product image</div>
              </div>
              <div className="grid min-w-[860px] grid-cols-[1.3fr_0.8fr_1fr_1fr]">
                <div className="grid grid-cols-2 gap-3 border-r border-[#E5EAF0] p-4">
                  <Field label="Exc. tax" required>
                    <TextInput required type="number" min="0" step="0.01" value={form.purchasePriceExTax} onChange={(event) => updatePurchasePrice("purchasePriceExTax", event.target.value)} placeholder="Exc. tax" />
                  </Field>
                  <Field label="Inc. tax" required>
                    <TextInput required type="number" min="0" step="0.01" value={form.purchasePriceIncTax} onChange={(event) => updatePurchasePrice("purchasePriceIncTax", event.target.value)} placeholder="Inc. tax" />
                  </Field>
                </div>
                <div className="border-r border-[#E5EAF0] p-4">
                  <Field label="Margin (%)">
                    <TextInput type="number" step="0.01" value={form.margin} onChange={(event) => {
                      const margin = event.target.value;
                      setForm((current) => ({
                        ...current,
                        margin,
                        sellingPriceExTax: current.purchasePriceExTax === ""
                          ? current.sellingPriceExTax
                          : (Number(current.purchasePriceExTax) * (1 + (Number.parseFloat(margin) || 0) / 100)).toFixed(2),
                      }));
                    }} />
                  </Field>
                </div>
                <div className="border-r border-[#E5EAF0] p-4">
                  <Field label="Exc. Tax" required>
                    <TextInput required type="number" min="0" step="0.01" value={form.sellingPriceExTax} onChange={(event) => update("sellingPriceExTax", event.target.value)} placeholder="Exc. tax" />
                  </Field>
                  <Field label="Opening stock" className="mt-4">
                    <TextInput disabled={!form.manageStock} type="number" min="0" step="0.01" value={form.openingStock} onChange={(event) => update("openingStock", event.target.value)} placeholder="Optional quantity" />
                  </Field>
                </div>
                <div className="p-4">
                  <Field label="Product image" hint="Square image recommended. Maximum file size: 5 MB.">
                    <input ref={variantImageRef} type="file" accept="image/*" onChange={(event) => acceptImage(event.target.files?.[0], setVariantImage)} className="hidden" />
                    <button type="button" onClick={() => variantImageRef.current?.click()} className="flex min-h-20 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#D6DFEA] bg-[#FFFCF8] px-2 text-center hover:border-[#F5A15D]">
                      <ImagePlus size={18} className="text-[#5584BC]" />
                      <span className="max-w-full truncate text-xs text-[#536985]">{variantImage?.name ?? "Choose image"}</span>
                    </button>
                    <span className="mt-1 block text-[11px] text-[#98A6B8]">Image should be square · Max 5 MB</span>
                  </Field>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-2 rounded-2xl border border-[#F0E4D7] bg-white p-4 shadow-[0_5px_18px_rgba(40,57,97,0.05)]">
            <button type="button" onClick={(event) => saveProduct(event, "selling-price-group")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5A900] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E69D00]">
              <Save size={16} /> Save &amp; Add Selling-Price-Group Prices
            </button>
            <button type="button" onClick={(event) => saveProduct(event, "opening-stock")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#625CA8] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#514B96]">
              <Save size={16} /> Save &amp; Add Opening Stock
            </button>
            <button type="button" onClick={(event) => saveProduct(event, "another")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D81B60] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C2185B]">
              <Plus size={16} /> Save And Add Another
            </button>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
              <Check size={16} /> Save
            </button>
          </div>
        </form>
      </div>

      {showFullDescription && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/45 p-4 backdrop-blur-[2px]"
          onClick={() => setShowFullDescription(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="full-product-description-title"
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[min(80vh,640px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_20px_60px_rgba(25,43,80,0.24)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#F0EAE3] px-5 py-4 sm:px-6">
              <div>
                <p className="mb-1 text-xs font-medium text-[#8798AD]">Product details</p>
                <h2 id="full-product-description-title" className="text-lg font-semibold text-[#283961]">Full product description</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowFullDescription(false)}
                aria-label="Close full description"
                className="rounded-lg p-2 text-[#8798AD] transition hover:bg-[#FFF0E3] hover:text-[#E87928]"
              >
                <X size={19} />
              </button>
            </header>
            <div className="app-themed-scrollbar overflow-y-auto px-5 py-5 sm:px-6">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#536985]">
                {form.description}
              </p>
            </div>
            <footer className="flex justify-end border-t border-[#F0EAE3] bg-[#FFFCF8] px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => setShowFullDescription(false)}
                className="h-9 rounded-lg bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white transition hover:brightness-105"
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}

      {quickAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4" onClick={() => setQuickAdd(null)}>
          <form onSubmit={addQuickOption} onClick={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-[#F0E4D7] bg-white p-5 shadow-[0_18px_55px_rgba(25,43,80,0.2)]">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#283961]">Add {quickAdd.label}</h2>
                <p className="mt-1 text-sm text-[#71809A]">Add an option and select it for this product.</p>
              </div>
              <button type="button" onClick={() => setQuickAdd(null)} aria-label="Close" className="rounded-lg p-1.5 text-[#8798AD] hover:bg-[#FFF0E3] hover:text-[#E87928]"><X size={18} /></button>
            </div>
            <TextInput autoFocus required value={quickAddValue} onChange={(event) => setQuickAddValue(event.target.value)} placeholder={`Enter ${quickAdd.label.toLowerCase()} name`} />
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setQuickAdd(null)} className="h-9 rounded-lg border border-[#D8E0EA] px-4 text-sm font-medium text-[#60738D]">Cancel</button>
              <button type="submit" className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white"><Plus size={15} /> Add option</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default AddProduct;