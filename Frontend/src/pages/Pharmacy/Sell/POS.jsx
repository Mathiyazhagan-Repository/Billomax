import { useMemo, useState } from "react";
import {
  Banknote,
  Briefcase,
  CalendarDays,
  Check,
  CreditCard,
  Edit2,
  FileEdit,
  FileText,
  History,
  Home,
  Info,
  Maximize2,
  Minimize2,
  Minus,
  Package,
  Pause,
  Pill,
  Plus,
  RotateCw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Undo2,
  UserRound,
  Wallet,
  X,
  Calculator as CalculatorIcon,
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
  { id: "pos-1", name: "Amlodipine 5mg", sku: "0046", sellingPrice: 22.5, stock: 10, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-2", name: "Amlodipine 10mg", sku: "0045", sellingPrice: 35.0, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-3", name: "Amoxicillin 250mg", sku: "0052", sellingPrice: 28.5, stock: 12, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-4", name: "Amoxicillin 500mg", sku: "0053", sellingPrice: 45.0, stock: 5, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-5", name: "Amoxicillin Drops", sku: "0054", sellingPrice: 52.0, stock: 0, unit: "bottle", category: "Baby Care Products", brand: "MediCare" },
  { id: "pos-6", name: "Atorvastatin (Lipitor)", sku: "0060", sellingPrice: 72.0, stock: 9, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-7", name: "Azithromycin 250mg", sku: "0064", sellingPrice: 65.0, stock: 3, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-8", name: "Azithromycin 500mg", sku: "0065", sellingPrice: 110.0, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-9", name: "Budesonide Inhaler", sku: "0071", sellingPrice: 185.0, stock: 0, unit: "bottle", category: "Homeopathic & Herbal Remedies", brand: "Wellness" },
  { id: "pos-10", name: "Budesonide Respules", sku: "0072", sellingPrice: 95.0, stock: 0, unit: "pack", category: "Homeopathic & Herbal Remedies", brand: "Wellness" },
  { id: "pos-11", name: "Dolo 650 Tablets", sku: "SKU1325", sellingPrice: 13.75, stock: 14, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-12", name: "Fluoxetine (Prozac)", sku: "0080", sellingPrice: 85.0, stock: 26, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-13", name: "Fluoxetine 20mg", sku: "0081", sellingPrice: 95.0, stock: 8, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-14", name: "Lisinopril 5mg", sku: "0086", sellingPrice: 32.0, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-15", name: "Metformin 500mg", sku: "0090", sellingPrice: 18.5, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-16", name: "Oxycodone 10mg", sku: "0094", sellingPrice: 120.0, stock: 0, unit: "bottle", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-17", name: "Oxycodone 20mg", sku: "0095", sellingPrice: 210.0, stock: 6, unit: "bottle", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-18", name: "Sertraline (Zoloft)", sku: "0099", sellingPrice: 65.0, stock: 11, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-19", name: "Sertraline 50mg", sku: "0100", sellingPrice: 90.0, stock: 4, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pos-20", name: "Shingrix Vaccine", sku: "0104", sellingPrice: 420.0, stock: 0, unit: "vial", category: "Medical Devices", brand: "Wellness" },
  { id: "pos-21", name: "Simvastatin 20mg", sku: "0110", sellingPrice: 48.0, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "Dolo" },
  { id: "pos-22", name: "Tramadol 50mg", sku: "0114", sellingPrice: 55.0, stock: 0, unit: "strip", category: "Health & Wellness Products", brand: "MediCare" },
];

function readArray(key, fallback = []) {
  try {
    const saved = businessStorage.getItem(key);
    if (!saved) return fallback;
    const value = JSON.parse(saved);
    if (!Array.isArray(value)) return fallback;
    return value;
  } catch {
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
  } catch {
    return false;
  }
}

// Payment modal styled with site theme
function PaymentDialog({ total, allowCredit, onClose, onComplete }) {
  const [amount, setAmount] = useState(total.toFixed(2));
  const [method, setMethod] = useState("Cash");
  const [error, setError] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-xs">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="pos-payment-title"
        className="w-full max-w-md rounded-2xl border border-[#F0EAE3] bg-white p-6 shadow-2xl font-sans animate-in fade-in zoom-in-95"
      >
        <div className="mb-5 flex items-center justify-between border-b border-[#F0EAE3] pb-3">
          <div>
            <h2 id="pos-payment-title" className="text-base font-bold text-[#10234F]">
              Complete Payment
            </h2>
            <p className="mt-0.5 text-xs text-[#71839A]">
              Amount due: <strong className="text-[#FF711A] font-bold">{money(total)}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment dialog"
            className="rounded-lg p-1.5 text-[#71839A] hover:bg-[#FFF1E5] hover:text-[#FF711A] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#344B70] mb-1">
              Amount Tendered (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#D6DFEA] px-3.5 text-sm font-semibold text-[#10234F] outline-none transition focus:border-[#FF711A] focus:ring-2 focus:ring-[#FF711A]/10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#344B70] mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["Cash", "Card", "UPI", "Bank"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`h-9 rounded-lg text-xs font-bold border transition ${
                    method === m
                      ? "border-[#FF711A] bg-[#FFF1E5] text-[#FF711A] shadow-xs"
                      : "border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-xs font-semibold text-[#DC2626]">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-[#D7E0EB] px-4 text-xs font-bold text-[#60738D] hover:bg-[#F8FAFC] transition"
          >
            Cancel
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
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#08A86B] to-[#059669] px-5 text-xs font-bold text-white shadow-sm hover:brightness-105 transition"
          >
            <Check size={16} /> Complete Sale
          </button>
        </div>
      </section>
    </div>
  );
}

// Compact, theme-aligned calculator modal
function POSCalculatorModal({ onClose }) {
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcStoredValue, setCalcStoredValue] = useState(null);
  const [calcOperator, setCalcOperator] = useState(null);
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);

  const enterDigit = (digit) => {
    setCalcDisplay((current) => {
      if (calcWaitingForOperand || current === "0") {
        return digit === "." ? "0." : digit;
      }
      if (digit === "." && current.includes(".")) return current;
      return `${current}${digit}`;
    });
    setCalcWaitingForOperand(false);
  };

  const calculateResult = (left, right, operator) => {
    switch (operator) {
      case "+": return left + right;
      case "-": return left - right;
      case "×": return left * right;
      case "÷": return right === 0 ? null : left / right;
      default: return right;
    }
  };

  const chooseOp = (operator) => {
    const val = Number(calcDisplay);
    if (!Number.isFinite(val)) return;
    if (calcOperator && !calcWaitingForOperand) {
      const result = calculateResult(calcStoredValue ?? val, val, calcOperator);
      if (result === null) {
        setCalcDisplay("Error");
        setCalcStoredValue(null);
        setCalcOperator(null);
        setCalcWaitingForOperand(true);
        return;
      }
      setCalcDisplay(String(result));
      setCalcStoredValue(result);
    } else {
      setCalcStoredValue(val);
    }
    setCalcOperator(operator);
    setCalcWaitingForOperand(true);
  };

  const runEquals = () => {
    if (!calcOperator || calcStoredValue === null) return;
    const res = calculateResult(calcStoredValue, Number(calcDisplay), calcOperator);
    setCalcDisplay(res === null ? "Error" : String(res));
    setCalcStoredValue(null);
    setCalcOperator(null);
    setCalcWaitingForOperand(true);
  };

  const keys = [
    { label: "AC", action: () => { setCalcDisplay("0"); setCalcStoredValue(null); setCalcOperator(null); setCalcWaitingForOperand(false); }, style: "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] font-bold text-[11px]" },
    { label: "CE", action: () => { setCalcDisplay("0"); setCalcWaitingForOperand(false); }, style: "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] font-bold text-[11px]" },
    { label: "%", action: () => { const v = Number(calcDisplay); if (Number.isFinite(v)) { setCalcDisplay(String(v / 100)); setCalcWaitingForOperand(true); } }, style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] font-semibold text-[13px]" },
    { label: "÷", action: () => chooseOp("÷"), style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] font-semibold text-[15px]" },
    { label: "7", action: () => enterDigit("7") },
    { label: "8", action: () => enterDigit("8") },
    { label: "9", action: () => enterDigit("9") },
    { label: "×", action: () => chooseOp("×"), style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] font-semibold text-[15px]" },
    { label: "4", action: () => enterDigit("4") },
    { label: "5", action: () => enterDigit("5") },
    { label: "6", action: () => enterDigit("6") },
    { label: "-", action: () => chooseOp("-"), style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] font-semibold text-[15px]" },
    { label: "1", action: () => enterDigit("1") },
    { label: "2", action: () => enterDigit("2") },
    { label: "3", action: () => enterDigit("3") },
    { label: "+", action: () => chooseOp("+"), style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] font-semibold text-[15px]" },
    { label: "0", action: () => enterDigit("0") },
    { label: ".", action: () => enterDigit(".") },
    { label: "=", action: runEquals, span: "col-span-2", style: "bg-[#FF711A] text-white border border-[#E8620E] font-bold text-[15px] shadow-sm" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs">
      <div className="w-[270px] overflow-hidden rounded-2xl border border-[#E6EAF3] bg-white shadow-2xl font-sans animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#F0F2F7] bg-[#FAFBFD] px-3.5 py-2.5">
          <div className="flex items-center gap-1.5">
            <CalculatorIcon size={14} className="text-[#FF711A]" />
            <span className="text-[12px] font-bold text-[#15336E]">Calculator</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#8E9FBD] hover:bg-[#EEF2F9] hover:text-[#15336E] transition"
          >
            <X size={14} />
          </button>
        </div>
        <div className="p-3 pb-2">
          <div className="rounded-xl border border-[#E3E8F3] bg-[#F7F9FC] px-3 py-2 text-right shadow-inner">
            <div className="h-4 font-mono text-[11px] font-medium text-[#7B90B2] truncate">
              {calcStoredValue !== null && calcOperator ? `${calcStoredValue} ${calcOperator}` : "\u00A0"}
            </div>
            <div className="font-mono text-[22px] font-bold tracking-tight text-[#15336E] truncate">
              {calcDisplay}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1.5 p-3 pt-0">
          {keys.map(({ label, action, span = "", style = "" }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className={`flex h-[36px] items-center justify-center rounded-lg text-[14px] font-semibold transition active:scale-95 select-none ${
                style || "border border-[#E5EAF3] bg-white text-[#15336E] shadow-xs hover:border-[#CCD8ED] hover:bg-[#F8FAFC]"
              } ${span}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function POS({ onNavigate }) {
  const currentBusiness = getActiveBusinessStorage() || "Pharmacy";

  const [products] = useState(() => {
    const saved = readArray(PRODUCTS_KEY);
    return saved.length ? saved : getBusinessSampleProducts(sampleProducts);
  });

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [location, setLocation] = useState(
    () => `${currentBusiness} (BL0001)`,
  );
  const [customer, setCustomer] = useState("Walk-In Customer");
  const [discount, setDiscount] = useState("0");
  const [orderTax, setOrderTax] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [creditSale, setCreditSale] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [expenses, setExpenses] = useState([]);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [customersList, setCustomersList] = useState([
    "Walk-In Customer",
    "Soujanya H V",
    "Mr pharmacy",
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const brands = useMemo(() => {
    const list = [...new Set(products.map((p) => p.brand).filter(Boolean))];
    if (list.length > 0) return list;
    return ["bartell drugs", "Dolo", "longs drugs", "Telma", "walgreens"];
  }, [products]);

  const categories = useMemo(() => {
    const list = [...new Set(products.map((p) => p.category).filter(Boolean))];
    if (list.length > 0) return list;
    return [
      "Baby Care Products",
      "First Aid Supplies",
      "Health & Wellness Products",
      "Homeopathic & Herbal Remedies",
      "Medical Devices",
    ];
  }, [products]);

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
    if (text) {
      setTimeout(() => setNotice(""), 3500);
    }
  };

  const addToCart = (product) => {
    if (Number(product.stock) <= 0) {
      updateNotice(`${product.name} is out of stock.`, "error");
      return;
    }
    setCart((current) => {
      const existing = current.find(
        (item) => String(item.productId) === String(product.id),
      );
      if (existing) {
        if (existing.quantity >= Number(product.stock)) {
          updateNotice(`Only ${product.stock} ${product.unit || "unit"} available.`, "error");
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
          updateNotice(`Only ${item.stock} ${item.unit} available.`, "error");
          return item;
        }
        return { ...item, quantity };
      }),
    );
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
      updateNotice(`${status} saved successfully.`);
    } else {
      updateNotice(`${status} could not be saved.`, "error");
    }
  };

  const completeSale = (method, paid) => {
    if (!cart.length) {
      updateNotice("Add at least one product before completing sale.", "error");
      setPaymentOpen(false);
      return;
    }
    const sales = readArray(
      SALES_KEY,
      currentBusiness === "Pharmacy" ? initialSales : [],
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
      addedBy: currentBusiness.toLowerCase(),
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
      updateNotice("Sale could not be saved.", "error");
      return;
    }
    setCart([]);
    setExpenses([]);
    setPaymentOpen(false);
    updateNotice(`Sale #${sale.invoiceNo} completed successfully!`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpenseName.trim() || !newExpenseAmount) return;
    setExpenses((cur) => [
      ...cur,
      { id: `${Date.now()}`, name: newExpenseName.trim(), amount: newExpenseAmount },
    ]);
    setNewExpenseName("");
    setNewExpenseAmount("");
    setExpenseModalOpen(false);
    updateNotice("Expense added to sale.");
  };

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;
    const name = newCustomerName.trim();
    if (!customersList.includes(name)) {
      setCustomersList((cur) => [...cur, name]);
    }
    setCustomer(name);
    setNewCustomerName("");
    setCustomerModalOpen(false);
    updateNotice(`Customer "${name}" selected.`);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#FFFAF5] font-sans text-[#19366F] select-none">
      {/* Toast Notification */}
      {notice && (
        <div
          role={noticeType === "error" ? "alert" : "status"}
          className={`fixed top-4 right-4 z-50 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
            noticeType === "error"
              ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#B91C1C]"
              : "border-[#86EFAC] bg-[#F0FDF4] text-[#15803D]"
          }`}
        >
          {notice}
        </div>
      )}

      {/* Top Header Bar (Billomax Site Theme) */}
      <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-[#F0EAE3] bg-white px-4 shadow-[0_2px_8px_rgba(40,57,97,0.03)]">
        {/* Left: Location & Date Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#19366F]">Location:</span>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-8 rounded-lg border border-[#E0E8F2] bg-[#FFFCF8] px-3 pr-7 text-xs font-semibold text-[#19366F] outline-none transition hover:border-[#FF711A] focus:border-[#FF711A]"
              >
                <option>{currentBusiness} (BL0001)</option>
                <option>{currentBusiness} (BL0002)</option>
              </select>
            </div>
          </div>

          <div className="flex h-8 items-center gap-1.5 rounded-lg bg-[#5551FF] px-3 text-xs font-bold text-white shadow-xs">
            <CalendarDays size={13} />
            <span>
              {new Date().toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Center / Right: Quick Tool Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Home button */}
          <button
            type="button"
            onClick={() => onNavigate?.("Home")}
            title="Dashboard / Home"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E8F2] bg-white text-[#19366F] shadow-xs transition hover:border-[#FF711A] hover:bg-[#FFF1E5] hover:text-[#FF711A]"
          >
            <Home size={15} strokeWidth={2.2} />
          </button>

          {/* Undo / Back */}
          <button
            type="button"
            onClick={() => {
              if (cart.length > 0) {
                setCart((cur) => cur.slice(0, -1));
                updateNotice("Removed last item from cart.");
              }
            }}
            title="Undo last item"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E8F2] bg-white text-[#2563EB] shadow-xs transition hover:bg-[#EFF6FF]"
          >
            <Undo2 size={15} strokeWidth={2.2} />
          </button>

          {/* Clear Cart */}
          <button
            type="button"
            onClick={() => {
              if (cart.length > 0) {
                setCart([]);
                updateNotice("Cart cleared.");
              }
            }}
            title="Clear Cart"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E8F2] bg-white text-[#DC2626] shadow-xs transition hover:bg-[#FEF2F2]"
          >
            <X size={15} strokeWidth={2.5} />
          </button>

          {/* Cash Register Box */}
          <button
            type="button"
            onClick={() => updateNotice(`Register open for ${currentBusiness}.`)}
            title="Register Details"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E8F2] bg-white text-[#08A86B] shadow-xs transition hover:bg-[#ECFDF5]"
          >
            <Briefcase size={15} strokeWidth={2.2} />
          </button>

          {/* Calculator */}
          <button
            type="button"
            onClick={() => setCalcOpen((o) => !o)}
            title="Calculator"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E8F2] bg-white text-[#059669] shadow-xs transition hover:bg-[#ECFDF5]"
          >
            <CalculatorIcon size={15} strokeWidth={2.2} />
          </button>

          {/* Reset / Reload */}
          <button
            type="button"
            onClick={() => {
              setCart([]);
              setExpenses([]);
              setDiscount("0");
              setOrderTax("0");
              setShipping("0");
              setSearch("");
              setActiveCategory("");
              setActiveBrand("");
              updateNotice("Register refreshed.");
            }}
            title="Reset register"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E8F2] bg-white text-[#DC2626] shadow-xs transition hover:bg-[#FEF2F2]"
          >
            <RotateCw size={15} strokeWidth={2.2} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E8F2] bg-white text-[#2563EB] shadow-xs transition hover:bg-[#EFF6FF]"
          >
            {isFullscreen ? (
              <Minimize2 size={15} strokeWidth={2.2} />
            ) : (
              <Maximize2 size={15} strokeWidth={2.2} />
            )}
          </button>

          {/* Suspend */}
          <button
            type="button"
            onClick={() => persistTransaction(SUSPENDED_KEY, "Suspended sale")}
            title="Suspend Sale"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E0E8F2] bg-white text-[#64748B] shadow-xs transition hover:bg-[#F1F5F9]"
          >
            <Pause size={15} strokeWidth={2.2} />
          </button>

          {/* Add Expense Button */}
          <button
            type="button"
            onClick={() => setExpenseModalOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[#19366F] bg-white px-3 text-xs font-bold text-[#19366F] shadow-xs transition hover:bg-[#FFF7EF] hover:border-[#FF711A] hover:text-[#FF711A]"
          >
            <Minus size={13} strokeWidth={3} className="rotate-90 text-[#FF711A]" />
            <span>Add Expense</span>
          </button>
        </div>
      </header>

      {/* Main POS Workspace */}
      <div className="flex flex-1 min-h-0 gap-3 p-3 overflow-hidden bg-[#FFFAF5]">
        {/* Left: Product Catalogue Container */}
        <section className="flex flex-1 min-w-0 flex-col rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_4px_16px_rgba(40,57,97,0.04)] overflow-hidden">
          {/* Search Row */}
          <div className="flex items-center gap-2 border-b border-[#F0EAE3] p-3 bg-[#FFFCF8]">
            <div className="relative flex flex-1 items-center">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 text-[#8EA3BE]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter Product name / SKU / Scan bar code"
                className="h-10 w-full rounded-xl border border-[#E0E8F2] bg-white pl-10 pr-10 text-xs font-medium text-[#19366F] outline-none transition placeholder:text-[#8EA3BE] focus:border-[#FF711A] focus:ring-2 focus:ring-[#FF711A]/10"
              />
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute right-3.5 text-[#8EA3BE]"
              />
            </div>
            <button
              type="button"
              onClick={() => filteredProducts[0] && addToCart(filteredProducts[0])}
              title="Add first match to cart"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E0E8F2] bg-white text-[#FF711A] shadow-xs transition hover:border-[#FF711A] hover:bg-[#FFF1E5]"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Categories Pill Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#F0EAE3] px-3 py-2 bg-white app-themed-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className={`shrink-0 rounded-full px-4 py-1 text-xs font-bold transition ${
                !activeCategory
                  ? "bg-[#19366F] text-white shadow-xs"
                  : "border border-[#E0E8F2] bg-[#FFFCF8] text-[#557199] hover:bg-[#FFF1E5] hover:text-[#19366F]"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  setActiveCategory((current) => (current === cat ? "" : cat))
                }
                className={`shrink-0 rounded-full border px-3.5 py-1 text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "border-[#FF711A] bg-[#FF711A] text-white shadow-xs"
                    : "border-[#E0E8F2] bg-[#FFFCF8] text-[#557199] hover:border-[#FF711A] hover:bg-[#FFF1E5] hover:text-[#19366F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Brands Pill Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#F0EAE3] px-3 py-1.5 bg-[#FFFCF8] app-themed-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setActiveBrand("")}
              className={`shrink-0 rounded-full px-3 py-0.5 text-[11px] font-bold transition ${
                !activeBrand
                  ? "bg-[#08A86B] text-white shadow-xs"
                  : "border border-[#E0E8F2] bg-white text-[#7085A3] hover:bg-[#F8FAFC]"
              }`}
            >
              All
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() =>
                  setActiveBrand((cur) => (cur === brand ? "" : brand))
                }
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition ${
                  activeBrand === brand
                    ? "border-[#08A86B] bg-[#08A86B] text-white"
                    : "border-[#E0E8F2] bg-white text-[#7085A3] hover:border-[#08A86B] hover:text-[#08A86B]"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 app-themed-scrollbar bg-[#FFFAF5]/40">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2.5">
              {filteredProducts.map((product) => {
                const outOfStock = Number(product.stock) <= 0;
                return (
                  <button
                    key={product.id ?? product.sku ?? product.name}
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={outOfStock}
                    className={`flex flex-col items-center justify-between rounded-xl border border-[#F0EAE3] bg-white p-3 text-center transition min-h-[112px] shadow-xs ${
                      outOfStock
                        ? "cursor-not-allowed bg-[#FAF8F5] opacity-60"
                        : "hover:-translate-y-0.5 hover:border-[#FF711A] hover:shadow-[0_4px_12px_rgba(255,113,26,0.12)] active:scale-95"
                    }`}
                  >
                    {/* Product Icon Illustration */}
                    <div className="flex h-10 w-12 items-center justify-center rounded-xl bg-[#FFF4EB] border border-[#FFE4D3] text-[#FF711A] mb-1.5 shadow-2xs">
                      {currentBusiness === "Pharmacy" ? (
                        <Pill size={20} className="rotate-[-42deg]" />
                      ) : (
                        <Package size={20} />
                      )}
                    </div>

                    {/* Product Name */}
                    <span className="w-full text-[11px] font-bold text-[#19366F] line-clamp-1 leading-tight">
                      {product.name}
                    </span>

                    {/* Price or Out of Stock */}
                    <span
                      className={`mt-1 text-[11px] font-extrabold ${
                        outOfStock ? "text-[#DC2626]" : "text-[#08A86B]"
                      }`}
                    >
                      {outOfStock ? "Out of Stock" : money(product.sellingPrice ?? product.sellingPriceExTax)}
                    </span>
                  </button>
                );
              })}

              {!filteredProducts.length && (
                <div className="col-span-full flex h-48 flex-col items-center justify-center text-[#8EA3BE]">
                  <Package size={36} strokeWidth={1.5} className="mb-2 text-[#CBD5E1]" />
                  <p className="text-sm font-bold text-[#19366F]">No products found</p>
                  <p className="text-xs text-[#8EA3BE]">Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right: Cart / Register Container */}
        <aside className="flex w-[380px] xl:w-[420px] shrink-0 flex-col rounded-2xl border border-[#F0EAE3] bg-white shadow-[0_4px_16px_rgba(40,57,97,0.04)] overflow-hidden">
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-[#F0EAE3] bg-[#FFF7EF] px-3.5 py-2.5">
            {/* POS Logo + Amount Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-black tracking-tight text-[#19366F]">
                POS
              </span>
              <span className="rounded-full bg-[#19366F] px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow-xs">
                {total.toFixed(2)}
              </span>
            </div>

            {/* Customer Dropdown + Add Customer */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E0E8F2] bg-white px-2.5">
                <UserRound size={13} className="text-[#FF711A]" />
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-[#19366F] outline-none max-w-[130px] truncate"
                >
                  {customersList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setCustomerModalOpen(true)}
                title="Add new customer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FF711A] bg-[#FFF1E5] text-[#FF711A] transition hover:bg-[#FF711A] hover:text-white"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Cart Table Header (Styled like pharmacy-report-table-theme) */}
          <div className="grid grid-cols-[1fr_80px_70px_26px] items-center border-b border-[#F2E8DE] bg-[#FFF7EF] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#19366F]">
            <span>PRODUCT</span>
            <span className="text-center">QUANTITY</span>
            <span className="text-right">SUBTOTAL</span>
            <button
              type="button"
              onClick={() => {
                if (cart.length > 0) {
                  setCart([]);
                  updateNotice("Cart cleared.");
                }
              }}
              title="Clear all items"
              className="flex items-center justify-center text-[#9BB5D1] hover:text-[#DC2626] transition"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#F2E8DE]/60 px-3 app-themed-scrollbar">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="grid grid-cols-[1fr_80px_70px_26px] items-center py-2.5 text-xs transition hover:bg-[#FFF1E5]/40"
              >
                <div className="min-w-0 pr-1">
                  <p className="truncate font-bold text-[#19366F]">{item.name}</p>
                  <p className="text-[10px] text-[#8EA3BE]">{money(item.unitPrice)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.productId, item.quantity - 1)}
                    className="flex h-5 w-5 items-center justify-center rounded-md border border-[#E0E8F2] bg-white text-[#19366F] hover:bg-[#FFF1E5] hover:border-[#FF711A] transition"
                  >
                    <Minus size={10} strokeWidth={2.5} />
                  </button>
                  <span className="w-5 text-center text-[11px] font-bold text-[#19366F]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.productId, item.quantity + 1)}
                    className="flex h-5 w-5 items-center justify-center rounded-md border border-[#E0E8F2] bg-white text-[#19366F] hover:bg-[#FFF1E5] hover:border-[#FF711A] transition"
                  >
                    <Plus size={10} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="text-right font-bold text-[#19366F]">
                  {money(item.quantity * item.unitPrice)}
                </span>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() =>
                    setCart((cur) => cur.filter((e) => e.productId !== item.productId))
                  }
                  className="flex items-center justify-center text-[#9BB5D1] hover:text-[#DC2626] transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {!cart.length && (
              <div className="flex h-44 flex-col items-center justify-center text-[#8EA3BE]">
                <ShoppingCart size={30} strokeWidth={1.5} className="mb-2 text-[#CBD5E1]" />
                <p className="text-xs font-bold text-[#19366F]">No items in cart</p>
                <p className="text-[10px] text-[#8EA3BE]">Click any product from the catalogue</p>
              </div>
            )}
          </div>

          {/* Cart Summary & Adjustments */}
          <div className="border-t border-[#F0EAE3] bg-[#FFFCF8] p-3 text-xs">
            {/* Items count & Subtotal */}
            <div className="flex items-center justify-between font-bold text-[#557199] mb-2 pb-2 border-b border-[#F0EAE3]">
              <span>Items: <strong className="text-[#19366F]">{itemCount.toFixed(2)}</strong></span>
              <span>Total: <strong className="text-[#19366F]">{money(subtotal)}</strong></span>
            </div>

            {/* Adjustments row */}
            <div className="grid grid-cols-4 gap-2 text-[10px] font-semibold text-[#557199]">
              {/* Discount */}
              <div>
                <span className="flex items-center gap-0.5 text-[#7085A3]">
                  Discount <Info size={10} /> (-):
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Edit2 size={10} className="text-[#FF711A]" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="h-5 w-14 rounded border border-[#E0E8F2] bg-white px-1 text-[10px] font-bold text-[#19366F] outline-none focus:border-[#FF711A]"
                  />
                </div>
              </div>

              {/* Order Tax */}
              <div>
                <span className="flex items-center gap-0.5 text-[#7085A3]">
                  Order Tax(+): <Info size={10} />
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Edit2 size={10} className="text-[#FF711A]" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={orderTax}
                    onChange={(e) => setOrderTax(e.target.value)}
                    className="h-5 w-14 rounded border border-[#E0E8F2] bg-white px-1 text-[10px] font-bold text-[#19366F] outline-none focus:border-[#FF711A]"
                  />
                </div>
              </div>

              {/* Shipping */}
              <div>
                <span className="flex items-center gap-0.5 text-[#7085A3]">
                  Shipping(+): <Info size={10} />
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Edit2 size={10} className="text-[#FF711A]" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                    className="h-5 w-14 rounded border border-[#E0E8F2] bg-white px-1 text-[10px] font-bold text-[#19366F] outline-none focus:border-[#FF711A]"
                  />
                </div>
              </div>

              {/* Round Off */}
              <div>
                <span className="flex items-center gap-0.5 text-[#7085A3]">
                  Round Off:
                </span>
                <div className="mt-0.5 text-[11px] font-bold text-[#19366F]">
                  0.00
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Action Footer Bar (Matching Site Theme & Screenshot) */}
      <footer className="flex h-[62px] shrink-0 items-center justify-between gap-2 border-t border-[#F0EAE3] bg-white px-4 shadow-[0_-4px_16px_rgba(40,57,97,0.05)] overflow-x-auto">
        {/* Left Actions */}
        <div className="flex items-center gap-1.5">
          {/* Draft */}
          <button
            type="button"
            onClick={() => persistTransaction(DRAFTS_KEY, "Draft")}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E0E8F2] bg-white px-3.5 text-xs font-bold text-[#19366F] shadow-2xs transition hover:border-[#2563EB] hover:bg-[#EFF6FF]"
          >
            <FileEdit size={14} className="text-[#2563EB]" />
            <span>Draft</span>
          </button>

          {/* Quotation */}
          <button
            type="button"
            onClick={() => persistTransaction(QUOTATIONS_KEY, "Quotation")}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E0E8F2] bg-white px-3.5 text-xs font-bold text-[#19366F] shadow-2xs transition hover:border-[#FF711A] hover:bg-[#FFF1E5]"
          >
            <FileText size={14} className="text-[#FF711A]" />
            <span>Quotation</span>
          </button>

          {/* Suspend */}
          <button
            type="button"
            onClick={() => persistTransaction(SUSPENDED_KEY, "Suspended sale")}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E0E8F2] bg-white px-3.5 text-xs font-bold text-[#19366F] shadow-2xs transition hover:border-[#DC2626] hover:bg-[#FEF2F2]"
          >
            <Pause size={14} className="text-[#DC2626]" />
            <span>Suspend</span>
          </button>

          {/* Credit Sale */}
          <button
            type="button"
            onClick={() => {
              setCreditSale(true);
              setPaymentOpen(true);
            }}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E0E8F2] bg-white px-3.5 text-xs font-bold text-[#19366F] shadow-2xs transition hover:border-[#7C3AED] hover:bg-[#F5F3FF]"
          >
            <Check size={14} className="text-[#7C3AED]" />
            <span>Credit Sale</span>
          </button>

          {/* Card */}
          <button
            type="button"
            onClick={() => {
              setCreditSale(false);
              setPaymentOpen(true);
            }}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E0E8F2] bg-white px-3.5 text-xs font-bold text-[#19366F] shadow-2xs transition hover:border-[#DB2777] hover:bg-[#FDF2F8]"
          >
            <CreditCard size={14} className="text-[#DB2777]" />
            <span>Card</span>
          </button>

          {/* Multiple Pay */}
          <button
            type="button"
            onClick={() => {
              setCreditSale(false);
              setPaymentOpen(true);
            }}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#19366F] px-4 text-xs font-bold text-white shadow-xs transition hover:bg-[#10234F]"
          >
            <Wallet size={14} />
            <span>Multiple Pay</span>
          </button>

          {/* Cash */}
          <button
            type="button"
            onClick={() => {
              setCreditSale(false);
              setPaymentOpen(true);
            }}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#08A86B] to-[#059669] px-4.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(8,168,107,0.2)] transition hover:brightness-105"
          >
            <Banknote size={15} />
            <span>Cash</span>
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={() => {
              setCart([]);
              setExpenses([]);
              updateNotice("Sale cancelled.");
            }}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#DC2626] px-4 text-xs font-bold text-white shadow-xs transition hover:bg-[#B91C1C]"
          >
            <X size={14} strokeWidth={2.5} />
            <span>Cancel</span>
          </button>
        </div>

        {/* Right: Total Payable & Recent Transactions */}
        <div className="flex items-center gap-2.5">
          {/* Total Payable Card */}
          <div className="flex h-10 flex-col items-center justify-center rounded-xl border border-[#93C5FD] bg-[#F0FDF4] px-5 shadow-xs">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#557199]">
              TOTAL PAYABLE
            </span>
            <span className="text-sm font-black leading-tight text-[#08A86B]">
              {total.toFixed(2)}
            </span>
          </div>

          {/* Recent Transactions Button */}
          <button
            type="button"
            onClick={() => onNavigate?.("All Sales")}
            className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF711A] to-[#FF8627] px-4 text-xs font-bold text-white shadow-[0_4px_12px_rgba(255,113,26,0.25)] transition hover:brightness-105"
          >
            <History size={15} />
            <span>Recent Transactions</span>
          </button>
        </div>
      </footer>

      {/* Payment Dialog Modal */}
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

      {/* POS Calculator Modal */}
      {calcOpen && (
        <POSCalculatorModal onClose={() => setCalcOpen(false)} />
      )}

      {/* Add Expense Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-sm rounded-2xl border border-[#F0EAE3] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0EAE3] pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#19366F]">Add Expense to Sale</h3>
              <button
                type="button"
                onClick={() => setExpenseModalOpen(false)}
                className="rounded-lg p-1 text-[#7085A3] hover:bg-[#FFF1E5] hover:text-[#FF711A] transition"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#344B70] block mb-1">
                  Expense Note / Title
                </label>
                <input
                  type="text"
                  required
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  placeholder="e.g. Delivery fee, packaging"
                  className="h-10 w-full rounded-xl border border-[#E0E8F2] px-3 text-xs font-semibold text-[#19366F] outline-none focus:border-[#FF711A]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#344B70] block mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-10 w-full rounded-xl border border-[#E0E8F2] px-3 text-xs font-semibold text-[#19366F] outline-none focus:border-[#FF711A]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExpenseModalOpen(false)}
                  className="h-10 rounded-xl border border-[#E0E8F2] px-4 text-xs font-bold text-[#7085A3] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-gradient-to-r from-[#FF711A] to-[#FF8627] px-4 text-xs font-bold text-white shadow-xs hover:brightness-105"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {customerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-sm rounded-2xl border border-[#F0EAE3] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0EAE3] pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#19366F]">Add New Customer</h3>
              <button
                type="button"
                onClick={() => setCustomerModalOpen(false)}
                className="rounded-lg p-1 text-[#7085A3] hover:bg-[#FFF1E5] hover:text-[#FF711A] transition"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddCustomerSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#344B70] block mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="h-10 w-full rounded-xl border border-[#E0E8F2] px-3 text-xs font-semibold text-[#19366F] outline-none focus:border-[#FF711A]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomerModalOpen(false)}
                  className="h-10 rounded-xl border border-[#E0E8F2] px-4 text-xs font-bold text-[#7085A3] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-[#19366F] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#10234F]"
                >
                  Save &amp; Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
