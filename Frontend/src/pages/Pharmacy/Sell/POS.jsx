import { useMemo, useState } from "react";
import {
  Banknote,
  BriefcaseMedical,
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard,
  FilePlus2,
  Home,
  Minus,
  Package,
  Pause,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  Trash2,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { initialSales } from "./All_Sales.jsx";
import {
  businessStorage,
  getActiveBusinessStorage,
  getBusinessSampleProducts,
} from "../../../utils/businessStorage.js";

const SALES_KEY = "billomax-sales";
const PRODUCTS_KEY = "billomax-products";
const DRAFTS_KEY = "billomax-pos-drafts";
const QUOTATIONS_KEY = "billomax-pos-quotations";
const SUSPENDED_KEY = "billomax-pos-suspended";

const sampleProducts = [
  { id: "pos-1", name: "Amlodipine", sku: "0046", sellingPrice: 22.5, stock: 10, unit: "piece", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-2", name: "Amlodipine", sku: "0045", sellingPrice: 22.5, stock: 0, unit: "piece", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-3", name: "Amoxicillin", sku: "0052", sellingPrice: 22.5, stock: 12, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-4", name: "Amoxicillin", sku: "0053", sellingPrice: 22.5, stock: 5, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-5", name: "Amoxicillin", sku: "0054", sellingPrice: 22.5, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-6", name: "Atorvastatin", sku: "0060", sellingPrice: 22.5, stock: 9, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-7", name: "Azithromycin", sku: "0064", sellingPrice: 22.5, stock: 3, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-8", name: "Azithromycin", sku: "0065", sellingPrice: 22.5, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-9", name: "Budesonide", sku: "0071", sellingPrice: 22.5, stock: 0, unit: "bottle", category: "Homeopathic & Herbal Remedies", brand: "Wellness" },
  { id: "pos-10", name: "Budesonide", sku: "0072", sellingPrice: 22.5, stock: 0, unit: "bottle", category: "Homeopathic & Herbal Remedies", brand: "Wellness" },
  { id: "pos-11", name: "Dolo 650", sku: "SKU1325", sellingPrice: 13.75, stock: 14, unit: "piece", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-12", name: "Fluoxetine", sku: "0080", sellingPrice: 22.5, stock: 26, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-13", name: "Fluoxetine", sku: "0081", sellingPrice: 22.5, stock: 8, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-14", name: "Lisinopril", sku: "0086", sellingPrice: 22.5, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-15", name: "Metformin", sku: "0090", sellingPrice: 22.5, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-16", name: "Oxycodone", sku: "0094", sellingPrice: 22.5, stock: 0, unit: "bottle", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-17", name: "Oxycodone", sku: "0095", sellingPrice: 22.5, stock: 6, unit: "bottle", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-18", name: "Sertraline", sku: "0099", sellingPrice: 22.5, stock: 11, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-19", name: "Sertraline", sku: "0100", sellingPrice: 22.5, stock: 4, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-20", name: "Shingrix", sku: "0104", sellingPrice: 22.5, stock: 0, unit: "piece", category: "Medical Devices", brand: "Wellness" },
  { id: "pos-21", name: "Simvastatin", sku: "0110", sellingPrice: 22.5, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-22", name: "Tramadol", sku: "0114", sellingPrice: 22.5, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
];

function readArray(key, fallback = []) {
  try {
    const saved = businessStorage.getItem(key);
    if (!saved) return fallback;
    const value = JSON.parse(saved);
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

function saveLocal(key, value) {
  try {
    businessStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not save ${key}:`, error);
    return false;
  }
}

function PaymentDialog({ total, allowCredit, onClose, onComplete }) {
  const [amount, setAmount] = useState(total.toFixed(2));
  const [method, setMethod] = useState("Cash");
  const [error, setError] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="pos-payment-title"
        className="w-full max-w-md rounded-2xl border border-[#F0EAE3] bg-white p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="pos-payment-title" className="text-lg font-semibold text-[#10234F]">
              Complete payment
            </h2>
            <p className="mt-1 text-xs text-[#71839A]">
              Amount due: {money(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment dialog"
            className="rounded-lg p-2 text-[#71839A] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
          >
            <X size={18} />
          </button>
        </div>
        <label className="mb-4 block text-xs font-semibold text-[#344B70]">
          Amount tendered
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal outline-none focus:border-[#F5A15D]"
          />
        </label>
        <label className="block text-xs font-semibold text-[#344B70]">
          Payment method
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] bg-white px-3 text-sm font-normal outline-none focus:border-[#F5A15D]"
          >
            <option>Cash</option>
            <option>Card</option>
            <option>UPI</option>
            <option>Bank transfer</option>
          </select>
        </label>
        {error && (
          <p role="alert" className="mt-3 text-xs text-[#B04435]">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-[#D7E0EB] px-4 text-sm text-[#60738D] hover:bg-[#FFFCF8]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              const tendered = Number(amount);
              if (
                !Number.isFinite(tendered) ||
                tendered < 0 ||
                (!allowCredit && tendered < total)
              ) {
                setError(
                  allowCredit
                    ? "Enter a valid payment amount."
                    : "Amount tendered must cover the total payable.",
                );
                return;
              }
              onComplete(method, tendered);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#08A86B] px-4 text-sm font-semibold text-white hover:bg-[#078F5B]"
          >
            <Check size={16} /> Complete sale
          </button>
        </div>
      </section>
    </div>
  );
}

export default function POS({ onNavigate }) {
  const [products] = useState(() => {
    const saved = readArray(PRODUCTS_KEY);
    return saved.length ? saved : getBusinessSampleProducts(sampleProducts);
  });
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [location, setLocation] = useState(
    () => `${getActiveBusinessStorage()} (BL0001)`,
  );
  const [customer, setCustomer] = useState("Walk-In Customer");
  const [discount, setDiscount] = useState("0");
  const [orderTax, setOrderTax] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [creditSale, setCreditSale] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [expenses, setExpenses] = useState([]);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))],
    [products],
  );
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))],
    [products],
  );
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        `${product.name} ${product.sku || ""} ${product.brand || ""}`
          .toLowerCase()
          .includes(query);
      const matchesCategory =
        !activeCategory || product.category === activeCategory;
      const matchesBrand = !activeBrand || product.brand === activeBrand;
      return matchesQuery && matchesCategory && matchesBrand;
    });
  }, [activeBrand, activeCategory, products, search]);

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const discountAmount = Math.min(subtotal, Number(discount || 0));
  const taxAmount =
    Math.max(0, subtotal - discountAmount) * (Number(orderTax || 0) / 100);
  const expenseTotal = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );
  const total = Math.max(
    0,
    subtotal - discountAmount + taxAmount + Number(shipping || 0) + expenseTotal,
  );
  const updateNotice = (text, type = "success") => {
    setNotice(text);
    setNoticeType(type);
  };

  const addToCart = (product) => {
    if (Number(product.stock) <= 0) {
      updateNotice(`${product.name} is out of stock.`, "error");
      return;
    }
    setNotice("");
    setCart((current) => {
      const existing = current.find(
        (item) => String(item.productId) === String(product.id),
      );
      if (existing) {
        if (existing.quantity >= Number(product.stock)) {
          updateNotice(`Only ${product.stock} ${product.unit || "unit"} are available.`, "error");
          return current;
        }
        return current.map((item) =>
          String(item.productId) === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku || "",
          unit: product.unit || "piece",
          quantity: 1,
          unitPrice: Number(product.sellingPrice ?? product.sellingPriceExTax ?? 0),
          stock: Number(product.stock),
        },
      ];
    });
  };

  const changeQuantity = (productId, nextQuantity) => {
    const quantity = Math.floor(Number(nextQuantity));
    if (quantity <= 0) {
      setCart((current) =>
        current.filter((item) => String(item.productId) !== String(productId)),
      );
      return;
    }
    setCart((current) =>
      current.map((item) => {
        if (String(item.productId) !== String(productId)) return item;
        if (quantity > item.stock) {
          updateNotice(`Only ${item.stock} ${item.unit} are available.`, "error");
          return item;
        }
        return { ...item, quantity };
      }),
    );
    setNotice("");
  };

  const persistTransaction = (key, status) => {
    if (!cart.length) {
      updateNotice("Add at least one product first.", "error");
      return;
    }
    const record = {
      id: `${Date.now()}`,
      date: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      customer,
      location: location.replace(/\s*\([^)]*\)/, ""),
      status,
      items: cart,
      subtotal,
      total,
      discount: discountAmount,
      tax: taxAmount,
      shipping: Number(shipping || 0),
      expenses,
    };
    const saved = readArray(key);
    if (saveLocal(key, [record, ...saved])) {
      setCart([]);
      setExpenses([]);
      updateNotice(`${status} saved.`);
    } else {
      updateNotice(`${status} could not be saved. Please try again.`, "error");
    }
  };

  const completeSale = (method, paid) => {
    if (!cart.length) {
      updateNotice("Add at least one product before completing the sale.", "error");
      setPaymentOpen(false);
      return;
    }
    const sales = readArray(
      SALES_KEY,
      getActiveBusinessStorage() === "Pharmacy" ? initialSales : [],
    );
    const amountPaid = Math.min(total, paid);
    const sale = {
      id: `${Date.now()}`,
      date: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      invoiceNo: `${Date.now()}`.slice(-6),
      customerName: customer,
      contactNumber: "",
      location: location.replace(/\s*\([^)]*\)/, ""),
      paymentStatus:
        amountPaid >= total ? "Paid" : amountPaid > 0 ? "Partial" : "Due",
      paymentMethod: method,
      total,
      totalPaid: amountPaid,
      sellDue: Math.max(total - amountPaid, 0),
      sellReturnDue: 0,
      shippingStatus: "",
      totalItems: itemCount,
      addedBy: getActiveBusinessStorage().toLowerCase(),
      sellNote: "",
      staffNote: "",
      shippingDetails: "",
      items: cart,
      discount: discountAmount,
      tax: taxAmount,
      shipping: Number(shipping || 0),
      changeReturn: Math.max(0, paid - total),
      expenses,
    };
    if (!saveLocal(SALES_KEY, [sale, ...sales])) {
      updateNotice("Sale could not be saved. Please try again.", "error");
      return;
    }
    setCart([]);
    setExpenses([]);
    setPaymentOpen(false);
    updateNotice(`Sale ${sale.invoiceNo} completed successfully.`);
  };

  const addExpense = () => {
    setExpenses((current) => [
      ...current,
      { id: `${Date.now()}`, name: "", amount: "0" },
    ]);
    setExpenseOpen(true);
  };

  const toolbarButtons = [
    { label: "Home", icon: Home, onClick: () => onNavigate?.("Home") },
    { label: "Suspend", icon: Pause, onClick: () => persistTransaction(SUSPENDED_KEY, "Suspended sale") },
    { label: "Clear cart", icon: X, onClick: () => setCart([]) },
    { label: "Add expense", icon: BriefcaseMedical, onClick: addExpense },
    { label: "Recent transactions", icon: RotateCcw, onClick: () => onNavigate?.("All Sales") },
  ];

  return (
    <main className="flex min-h-[calc(100vh-62px)] min-w-0 flex-1 flex-col bg-[#FFFAF5] font-sans text-[#283961]">
      {notice && (
        <div
          role={noticeType === "error" ? "alert" : "status"}
          className={`mx-3 mt-2 rounded-xl border px-4 py-2.5 text-xs shadow-sm sm:mx-4 ${
            noticeType === "error"
              ? "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]"
              : "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"
          }`}
        >
          {notice}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[#F0EAE3] bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(40,57,97,0.04)] sm:px-4">
        <span className="text-xs font-semibold text-[#344B70]">Location</span>
        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="h-9 max-w-48 rounded-lg border border-[#E8EDF4] bg-white px-2.5 text-xs font-medium text-[#344B70] outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
        >
          <option>{getActiveBusinessStorage()} (BL0001)</option>
          <option>{getActiveBusinessStorage()} (BL0002)</option>
        </select>
        <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#FFF1E5] px-3 text-xs font-semibold text-[#D96D20]">
          <CalendarDays size={13} />
          {new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          {toolbarButtons.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              title={label}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F0EAE3] bg-white text-[#577B9F] shadow-sm transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4 lg:flex-row">
        <section className="flex min-h-[520px] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.05)] lg:min-h-0">
          <div className="flex items-center justify-between gap-3 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-[#10234F]">Product catalogue</h2>
              <p className="mt-0.5 text-[10px] text-[#71839A]">Search, filter, and add products to this sale.</p>
            </div>
            <span className="hidden rounded-full bg-[#FFF1E5] px-2.5 py-1 text-[10px] font-semibold text-[#D96D20] sm:inline-flex">
              {filteredProducts.length} products
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 pt-3 sm:px-4">
            <div className="relative min-w-0 flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9BB0]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Enter Product name / SKU / Scan bar code"
                aria-label="Search products"
                className="h-10 w-full rounded-lg border border-[#D6DFEA] bg-white pl-9 pr-3 text-xs text-[#42546E] outline-none placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10"
              />
            </div>
            <button
              type="button"
              onClick={() => filteredProducts[0] && addToCart(filteredProducts[0])}
              aria-label="Add first matching product"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#F0EAE3] bg-white text-[#E87928] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF]"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 pt-2 pb-2 sm:px-4">
            <label
              htmlFor="pos-category-filter"
              className="shrink-0 text-[11px] font-semibold text-[#577B9F]"
            >
              Category
            </label>
            <div className="relative min-w-0 flex-1 sm:max-w-sm">
              <select
                id="pos-category-filter"
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-[#F0EAE3] bg-[#FFFCF8] px-3 pr-9 text-xs font-medium text-[#344B70] outline-none transition hover:border-[#FF8A37] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#D96D20]"
              />
            </div>
            {activeCategory && (
              <button
                type="button"
                onClick={() => setActiveCategory("")}
                className="shrink-0 rounded-lg px-2 py-1.5 text-[11px] font-medium text-[#D96D20] hover:bg-[#FFF1E5]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="app-themed-scrollbar flex gap-1.5 overflow-x-auto px-3 py-1.5 sm:px-4">
            <button
              type="button"
              onClick={() => setActiveBrand("")}
              className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold ${
                !activeBrand
                  ? "border-[#FF8627] bg-[#FF8627] text-white"
                  : "border-[#D8E0EA] bg-white text-[#71839A]"
              }`}
            >
              All
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() =>
                  setActiveBrand((current) => (current === brand ? "" : brand))
                }
                className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-medium ${
                  activeBrand === brand
                    ? "border-[#14A99A] bg-[#14A99A] text-white"
                    : "border-[#E8EDF4] bg-white text-[#71839A] hover:border-[#FF8A37]"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="app-themed-scrollbar grid min-h-0 flex-1 auto-rows-[88px] grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
            {filteredProducts.map((product) => {
              const outOfStock = Number(product.stock) <= 0;
              return (
                <button
                  key={product.id ?? product.sku ?? product.name}
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={outOfStock}
                  className={`flex min-w-0 flex-col items-center justify-center rounded-xl border border-[#F0EAE3] bg-[#FFFCF8] px-2 py-2 text-center shadow-[0_2px_5px_rgba(40,57,97,0.04)] transition ${
                    outOfStock
                      ? "cursor-not-allowed bg-[#F7F7F7] opacity-60"
                      : "hover:-translate-y-0.5 hover:border-[#F5A15D] hover:shadow-md"
                  }`}
                >
                  <span className="mb-1 flex h-8 w-9 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
                    <Package size={19} />
                  </span>
                  <span className="w-full truncate text-[10px] font-semibold text-[#344B70]">
                    {product.name}
                  </span>
                  <span
                    className={`mt-0.5 text-[10px] font-semibold ${
                      outOfStock ? "text-[#D77B74]" : "text-[#16A05D]"
                    }`}
                  >
                    {outOfStock
                      ? "Out of Stock"
                      : money(product.sellingPrice ?? product.sellingPriceExTax)}
                  </span>
                </button>
              );
            })}
            {!filteredProducts.length && (
              <div className="col-span-full flex min-h-32 items-center justify-center text-sm text-[#8798AD]">
                No products match your search.
              </div>
            )}
          </div>
        </section>

        <aside className="flex min-h-[560px] w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_5px_18px_rgba(40,57,97,0.05)] lg:min-h-0 lg:w-[370px] xl:w-[410px]">
          <div className="flex items-center justify-between border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]"><ShoppingCart size={16} /></span>
              <div>
                <h1 className="text-base font-semibold tracking-wide text-[#10234F]">Current sale</h1>
                <p className="text-[10px] text-[#8798AD]">POS checkout</p>
              </div>
              <span className="rounded-full bg-[#FFF1E5] px-2 py-0.5 text-[10px] font-semibold text-[#D96D20]">
                {money(total)}
              </span>
            </div>
            <label className="flex max-w-48 items-center gap-1 rounded-lg border border-[#F0EAE3] bg-white px-2">
              <UserRound size={13} className="shrink-0 text-[#71839A]" />
              <select
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                aria-label="Customer"
                className="h-8 min-w-0 flex-1 bg-transparent text-[10px] text-[#536985] outline-none"
              >
                <option>Walk-In Customer</option>
                <option>Demo Customer</option>
              </select>
              <button
                type="button"
                onClick={() => updateNotice("Manage customers from Contacts.", "error")}
                aria-label="Add customer"
                className="text-[#E87928]"
              >
                <Plus size={14} />
              </button>
            </label>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_72px_78px_24px] border-b border-[#F2E8DE] bg-[#FFFCF8] px-3 py-3 text-[9px] font-semibold uppercase tracking-wide text-[#71839A]">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Subtotal</span>
            <span />
          </div>

          <div className="app-themed-scrollbar min-h-32 flex-1 overflow-y-auto px-3">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="grid grid-cols-[minmax(0,1fr)_72px_78px_24px] items-center gap-1 border-b border-[#F0EAE3] py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#19366F]">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-[#8798AD]">{money(item.unitPrice)}</p>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.productId, item.quantity - 1)}
                    aria-label={`Remove one ${item.name}`}
                    className="flex h-6 w-6 items-center justify-center rounded border border-[#F0EAE3] text-[#60738D] hover:bg-[#FFF1E5]"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-4 text-center text-[11px] font-semibold text-[#344B70]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.productId, item.quantity + 1)}
                    aria-label={`Add one ${item.name}`}
                    className="flex h-6 w-6 items-center justify-center rounded border border-[#F0EAE3] text-[#60738D] hover:bg-[#FFF1E5]"
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <span className="text-right text-[11px] font-semibold text-[#19366F]">
                  {money(item.quantity * item.unitPrice)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCart((current) =>
                      current.filter(
                        (entry) => entry.productId !== item.productId,
                      ),
                    )
                  }
                  aria-label={`Remove ${item.name}`}
                  className="text-[#A5412E] hover:text-red-700"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            {!cart.length && (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-[#9AA7B8]">
                <ShoppingCart size={27} strokeWidth={1.5} />
                <p className="text-xs">Add products to begin a sale</p>
              </div>
            )}
          </div>

          {expenseOpen && (
            <div className="max-h-32 space-y-2 overflow-y-auto border-t border-[#F2E8DE] bg-[#FFFCF8] px-3 py-2">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex gap-2">
                  <input
                    value={expense.name}
                    onChange={(event) =>
                      setExpenses((current) =>
                        current.map((entry) =>
                          entry.id === expense.id
                            ? { ...entry, name: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    placeholder="Expense name"
                    aria-label="Expense name"
                    className="h-8 min-w-0 flex-1 rounded-md border border-[#D6DFEA] px-2 text-xs"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={expense.amount}
                    onChange={(event) =>
                      setExpenses((current) =>
                        current.map((entry) =>
                          entry.id === expense.id
                            ? { ...entry, amount: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    aria-label="Expense amount"
                    className="h-8 w-24 rounded-md border border-[#D6DFEA] px-2 text-xs"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-[#F2E8DE] bg-[#FFFCF8] px-3 py-3">
            <div className="mb-3 flex items-center justify-between text-[11px] text-[#60738D]">
              <span>
                Items: <strong className="text-[#344B70]">{itemCount.toFixed(2)}</strong>
              </span>
              <span>
                Total: <strong className="text-[#10234F]">{money(total)}</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-[#F2E8DE] pt-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <label className="text-[10px] text-[#60738D]">
                Discount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(event) => setDiscount(event.target.value)}
                  aria-label="Discount amount"
                  className="mt-1 h-7 w-full rounded border border-[#D6DFEA] bg-white px-1.5 text-[10px]"
                />
              </label>
              <label className="text-[10px] text-[#60738D]">
                Order tax %
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={orderTax}
                  onChange={(event) => setOrderTax(event.target.value)}
                  aria-label="Order tax percentage"
                  className="mt-1 h-7 w-full rounded border border-[#D6DFEA] bg-white px-1.5 text-[10px]"
                />
              </label>
              <label className="text-[10px] text-[#60738D]">
                Shipping
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shipping}
                  onChange={(event) => setShipping(event.target.value)}
                  aria-label="Shipping charges"
                  className="mt-1 h-7 w-full rounded border border-[#D6DFEA] bg-white px-1.5 text-[10px]"
                />
              </label>
              <span className="flex flex-col justify-end text-[10px] text-[#60738D]">
                Round off: <strong className="mt-1 text-[#344B70]">0.00</strong>
              </span>
            </div>
          </div>

          <div className="border-t border-[#F2E8DE] bg-white px-3 pt-3 pb-2.5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#8798AD]">
              Other options
            </p>
            <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Draft", icon: FilePlus2, onClick: () => persistTransaction(DRAFTS_KEY, "Draft") },
              { label: "Quotation", icon: FilePlus2, onClick: () => persistTransaction(QUOTATIONS_KEY, "Quotation") },
              { label: "Suspend", icon: Pause, onClick: () => persistTransaction(SUSPENDED_KEY, "Suspended sale") },
              { label: "Credit Sale", icon: Check, onClick: () => {
                setCreditSale(true);
                setPaymentOpen(true);
              } },
              { label: "Card", icon: CreditCard, onClick: () => {
                setCreditSale(false);
                setPaymentOpen(true);
              } },
              { label: "Multiple Pay", icon: Wallet, onClick: () => {
                setCreditSale(false);
                setPaymentOpen(true);
              } },
            ].map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="flex min-h-10 items-center justify-center gap-1 rounded-lg border border-[#F0EAE3] bg-[#FFFCF8] px-2 text-[10px] font-semibold text-[#526783] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 border-t border-[#F2E8DE] bg-white p-3">
            <button
              type="button"
              onClick={() => {
                setCreditSale(false);
                setPaymentOpen(true);
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#08A86B] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078F5B]"
            >
              <Banknote size={17} /> Cash
            </button>
            <button
              type="button"
              onClick={() => {
                setCart([]);
                setExpenses([]);
                updateNotice("Current sale cancelled.");
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#F1B6B1] bg-white px-3 text-sm font-semibold text-[#C35445] transition hover:bg-[#FFF3F0]"
            >
              <X size={17} /> Cancel
            </button>
            <div className="flex min-h-12 flex-col items-center justify-center rounded-xl border border-[#F8EBDD] bg-[#FFF7EF] px-3 text-center">
              <span className="text-[10px] font-medium uppercase tracking-wide text-[#8798AD]">Total payable</span>
              <strong className="text-base text-[#F04A13]">{money(total)}</strong>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("All Sales")}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF711A] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#EF5F0F]"
            >
              <RotateCcw size={17} /> Recent Transactions
            </button>
          </div>
        </aside>
      </div>

      {paymentOpen && (
        <PaymentDialog
          total={total}
          allowCredit={creditSale}
          onClose={() => setPaymentOpen(false)}
          onComplete={(method, amount) =>
            completeSale(creditSale ? "Credit" : method, amount)
          }
        />
      )}
    </main>
  );
}
