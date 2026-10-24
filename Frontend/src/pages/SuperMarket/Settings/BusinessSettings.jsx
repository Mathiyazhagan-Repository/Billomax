
import React, { useMemo, useState } from "react";
import {
  Building2,
  ReceiptText,
  Package,
  ContactRound,
  ShoppingCart,
  Monitor,
  CreditCard,
  LayoutDashboard,
  Settings,
  FileText,
  Mail,
  MessageSquare,
  Gift,
  Blocks,
  Tags,
  Search,
  Save,
  Upload,
  Info,
  ChevronDown,
  Check,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "business", label: "Business", icon: Building2 },
  { id: "tax", label: "Tax", icon: ReceiptText },
  { id: "product", label: "Product", icon: Package },
  { id: "contact", label: "Contact", icon: ContactRound },
  { id: "sale", label: "Sale", icon: ShoppingCart },
  { id: "pos", label: "POS", icon: Monitor },
  { id: "purchases", label: "Purchases", icon: ShoppingCart },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "system", label: "System", icon: Settings },
  { id: "prefixes", label: "Prefixes", icon: FileText },
  { id: "email", label: "Email Settings", icon: Mail },
  { id: "sms", label: "SMS Settings", icon: MessageSquare },
  { id: "reward", label: "Reward Point Settings", icon: Gift },
  { id: "modules", label: "Modules", icon: Blocks },
  { id: "custom", label: "Custom Labels", icon: Tags },
];

const CUSTOM_LABEL_GROUPS = [
  { id: "payments", title: "Labels for custom payments", count: 7, columns: 3, prefix: "Custom Payment" },
  { id: "contact", title: "Labels for contact custom fields", count: 10, columns: 4, prefix: "Custom Field" },
  { id: "product", title: "Labels for product custom fields", count: 20, columns: 3, prefix: "Custom Field", fieldType: true },
  { id: "location", title: "Labels for location custom fields", count: 4, columns: 4, prefix: "Custom field" },
  { id: "user", title: "Labels for user custom fields", count: 4, columns: 4, prefix: "Custom field" },
  { id: "purchase", title: "Label for purchase custom fields", count: 5, columns: 2, prefix: "Custom Field", required: true },
  { id: "purchaseShipping", title: "Labels for purchase shipping custom fields", count: 5, columns: 2, prefix: "Custom Field", required: true },
  { id: "sell", title: "Labels for sell custom fields", count: 4, columns: 2, prefix: "Custom Field", required: true },
  { id: "sellShipping", title: "Labels for sale shipping custom fields", count: 5, columns: 2, prefix: "Custom Field", required: true, defaultForContact: true },
  { id: "service", title: "Labels for types of service custom fields", count: 6, columns: 4, prefix: "Custom Field" },
];

const createInitialCustomSettings = () =>
  Object.fromEntries(
    CUSTOM_LABEL_GROUPS.map((group) => [
      group.id,
      Array.from({ length: group.count }, () => ({
        label: "",
        fieldType: "Text",
        required: false,
        defaultForContact: false,
      })),
    ])
  );

const initialSettings = {
  business: {
    businessName: "Pharmacy",
    startDate: "2024-10-01",
    defaultProfitPercent: "25.00",
    currency: "India - Rupees(INR)",
    currencySymbolPlacement: "Before amount",
    timeZone: "Asia/Kolkata",
    logo: null,
    financialYearStartMonth: "January",
    stockAccountingMethod: "FIFO (First In First Out)",
    transactionEditDays: "30",
    dateFormat: "dd/mm/yyyy",
    timeFormat: "24 Hour",
    currencyPrecision: "2",
    quantityPrecision: "2",
  },
  tax: {
    tax1Name: "GSTIN",
    tax1No: "29AACW6067A1ZB",
    tax2Name: "",
    tax2No: "",
    enableInlineTax: false,
  },
  product: {
    skuPrefix: "",
    enableProductExpiry: false,
    expiryAction: "Add item expiry",
    enableBrands: true,
    enableCategories: true,
    enableSubCategories: true,
    enablePriceTaxInfo: true,
    defaultUnit: "",
    enableSubUnits: false,
    enableRacks: false,
    enableRow: false,
    enablePosition: false,
    enableWarranty: false,
    requireProductImage: false,
  },
  contact: { defaultCreditLimit: "10000" },
  sale: {
    defaultSaleDiscount: "1.00",
    defaultSaleTax: "GST",
    salesItemAdditionMethod: "Increase item quantity if it already exists",
    amountRoundingMethod: "Round to nearest whole number",
    salesPriceMinimum: false,
    allowOverselling: false,
    enableSalesOrder: true,
    paymentTermRequired: false,
    salesCommissionAgent: "Select from user's list",
    commissionCalculationType: "Invoice value",
    commissionAgentRequired: false,
    enablePaymentLink: false,
    razorpayKeyId: "",
    razorpayKeySecret: "",
    stripePublicKey: "",
    stripeSecretKey: "",
  },
  pos: {
    shortcuts: {
      "Express Checkout": "shift+e",
      "Pay & Checkout": "shift+p",
      Draft: "shift+d",
      Cancel: "shift+c",
      "Go to product quantity": "f2",
      "Weighing Scale": "",
      "Edit Discount": "shift+i",
      "Edit Order Tax": "shift+t",
      "Add Payment Row": "shift+r",
      "Finalize Payment": "shift+f",
      "Add new product": "f4",
    },
    disableMultiplePay: false,
    disableDraft: false,
    disableExpressCheckout: false,
    hideProductSuggestion: false,
    hideRecentTransactions: false,
    disableDiscount: false,
    disableOrderTax: false,
    subtotalEditable: false,
    disableSuspendSale: false,
    enableTransactionDate: false,
    enableServiceStaffProductLine: false,
    serviceStaffRequired: false,
    disableCreditSaleButton: false,
    enableWeighingScale: false,
    showInvoiceScheme: false,
    showInvoiceLayoutDropdown: false,
    printInvoiceOnSuspend: false,
    showPricingTooltip: false,
    weighingPrefix: "",
    productSkuLength: "5",
    quantityIntegerLength: "4",
    quantityFractionalLength: "3",
  },
  purchases: {
    enableEditProductPrice: true,
    enablePurchaseStatus: true,
    enableLotNumber: false,
    enablePurchaseOrder: false,
    enablePurchaseRequisition: false,
  },
  payment: {
    cashDenominations: "",
    cashDenominationScreen: "POS screen",
    cashDenominationMethods: "Cash",
    strictCashCheck: false,
  },
  dashboard: { stockExpiryDays: "30" },
  system: {
    themeColor: "Red",
    defaultPageEntries: "25",
    showHelpText: true,
  },
  prefixes: {
    purchase: "PO",
    purchaseReturn: "",
    purchaseRequisition: "",
    purchaseOrder: "",
    stockTransfer: "ST",
    stockAdjustment: "SA",
    sellReturn: "CN",
    expenses: "EP",
    contacts: "CO",
    purchasePayment: "PP",
    sellPayment: "SP",
    expensePayment: "",
    businessLocation: "BL",
    username: "",
    subscriptionNo: "",
    draft: "",
    salesOrder: "",
  },
  email: {
    mailDriver: "SMTP",
    host: "smpt.gmail.com",
    port: "587",
    username: "get2virendra@gmail.com",
    password: "••••••••••••",
    encryption: "tsl",
    fromAddress: "get2virendra@gmail.com",
    fromName: "Pharmacy Billing software",
  },
  sms: {
    service: "Other",
    url: "",
    sendToParameter: "to",
    messageParameter: "text",
    requestMethod: "POST",
    headers: Array.from({ length: 3 }, () => ({ key: "", value: "" })),
    parameters: Array.from({ length: 10 }, () => ({ key: "", value: "" })),
    testNumber: "",
  },
  reward: {
    enabled: false,
    displayName: "",
    amountSpendPerPoint: "1.00",
    minimumOrderToEarn: "1.00",
    maximumPointsPerOrder: "",
    redeemAmountPerPoint: "1.00",
    minimumOrderToRedeem: "1.00",
    minimumRedeemPoint: "",
    maximumRedeemPointPerOrder: "",
    expiryPeriod: "",
    expiryUnit: "Year",
  },
  modules: {
    purchases: true,
    addSale: true,
    pos: true,
    stockTransfers: true,
    stockAdjustment: true,
    expenses: true,
    account: false,
    tables: false,
    modifiers: false,
    serviceStaff: false,
    bookings: false,
    kitchen: false,
    subscription: false,
    typesOfService: false,
  },
  custom: createInitialCustomSettings(),
};

const fieldClass =
  "mt-1.5 w-full min-w-0 rounded-lg border border-[#DCE3EC] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass = "flex items-center gap-1.5 text-xs font-semibold text-[#10234F]";

function Field({ label, children, hint }) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>
        {label}
        {hint && (
          <span title={hint} className="inline-flex text-cyan-500">
            <Info size={14} />
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text", hint }) {
  return (
    <Field label={label} hint={hint}>
      <input
        className={fieldClass}
        type={type}
        value={value ?? ""}
        placeholder={placeholder ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

function SelectField({ label, value, onChange, options, hint }) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <select
          className={`${fieldClass} appearance-none pr-9`}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option || "Please Select"}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </Field>
  );
}

function CheckField({ label, checked, onChange, hint }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-start gap-2.5 rounded-lg px-2 py-2 transition hover:bg-[#FFFAF5]">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF6814]"
      />
      <span className="text-sm text-[#10234F]">
        {label}
        {hint && (
          <span title={hint} className="ml-1 inline-flex align-middle text-cyan-500">
            <Info size={14} />
          </span>
        )}
      </span>
    </label>
  );
}

function SectionTitle({ children, description }) {
  return (
    <div className="mb-5 border-b border-[#EEF1F5] pb-3">
      <h3 className="text-base font-bold text-[#10234F]">{children}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

function SettingsGrid({ children, columns = 3 }) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 ${
        columns === 4 ? "xl:grid-cols-4" : columns === 2 ? "xl:grid-cols-2" : "xl:grid-cols-3"
      }`}
    >
      {children}
    </div>
  );
}

function BusinessTab({ data, update, setLogo }) {
  return (
    <SettingsGrid>
      <TextField label="Business Name:*" value={data.businessName} onChange={(v) => update("businessName", v)} />
      <TextField label="Start Date:" type="date" value={data.startDate} onChange={(v) => update("startDate", v)} />
      <TextField label="Default profit percent:*" type="number" value={data.defaultProfitPercent} onChange={(v) => update("defaultProfitPercent", v)} />
      <SelectField label="Currency:" value={data.currency} onChange={(v) => update("currency", v)} options={["India - Rupees(INR)", "US Dollar(USD)", "Euro(EUR)", "Pound Sterling(GBP)"]} />
      <SelectField label="Currency Symbol Placement:" value={data.currencySymbolPlacement} onChange={(v) => update("currencySymbolPlacement", v)} options={["Before amount", "After amount"]} />
      <SelectField label="Time zone:" value={data.timeZone} onChange={(v) => update("timeZone", v)} options={["Asia/Kolkata", "UTC", "Asia/Dubai", "Europe/London", "America/New_York"]} />
      <Field label="Upload Logo:">
        <div className="mt-1.5 flex gap-2">
          <input readOnly value={data.logo?.name ?? ""} className={`${fieldClass} mt-0`} placeholder="Choose a logo file" />
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#FF6814] px-3 text-sm font-semibold text-white hover:bg-[#E95A0B]">
            <Upload size={15} /> Browse
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <p className="mt-1.5 text-xs italic text-slate-500">Previous logo (if exists) will be replaced.</p>
      </Field>
      <SelectField label="Financial year start month:" value={data.financialYearStartMonth} onChange={(v) => update("financialYearStartMonth", v)} options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]} hint="Select the first month of your financial year." />
      <SelectField label="Stock Accounting Method:*" value={data.stockAccountingMethod} onChange={(v) => update("stockAccountingMethod", v)} options={["FIFO (First In First Out)", "LIFO (Last In First Out)", "Average Cost"]} hint="Determines how inventory cost is calculated." />
      <TextField label="Transaction Edit Days:*" type="number" value={data.transactionEditDays} onChange={(v) => update("transactionEditDays", v)} hint="Number of days transactions can be edited." />
      <SelectField label="Date Format:*" value={data.dateFormat} onChange={(v) => update("dateFormat", v)} options={["dd/mm/yyyy", "mm/dd/yyyy", "yyyy-mm-dd"]} />
      <SelectField label="Time Format:*" value={data.timeFormat} onChange={(v) => update("timeFormat", v)} options={["24 Hour", "12 Hour"]} />
      <SelectField label="Currency precision:*" value={data.currencyPrecision} onChange={(v) => update("currencyPrecision", v)} options={["0", "1", "2", "3", "4"]} />
      <SelectField label="Quantity precision:*" value={data.quantityPrecision} onChange={(v) => update("quantityPrecision", v)} options={["0", "1", "2", "3", "4"]} />
    </SettingsGrid>
  );
}

function TaxTab({ data, update }) {
  return (
    <SettingsGrid>
      <TextField label="Tax 1 Name:" value={data.tax1Name} onChange={(v) => update("tax1Name", v)} />
      <TextField label="Tax 1 No:" value={data.tax1No} onChange={(v) => update("tax1No", v)} />
      <TextField label="Tax 2 Name:" value={data.tax2Name} onChange={(v) => update("tax2Name", v)} placeholder="GST / VAT / Other" />
      <TextField label="Tax 2 No:" value={data.tax2No} onChange={(v) => update("tax2No", v)} />
      <div className="flex items-end">
        <CheckField label="Enable inline tax in purchase and sell" checked={data.enableInlineTax} onChange={(v) => update("enableInlineTax", v)} />
      </div>
    </SettingsGrid>
  );
}

function ProductTab({ data, update }) {
  const checks = [
    ["enableBrands", "Enable Brands"],
    ["enableCategories", "Enable Categories"],
    ["enableSubCategories", "Enable Sub-Categories"],
    ["enablePriceTaxInfo", "Enable Price & Tax info"],
    ["enableSubUnits", "Enable Sub Units"],
    ["enableRacks", "Enable Racks"],
    ["enableRow", "Enable Row"],
    ["enablePosition", "Enable Position"],
    ["enableWarranty", "Enable Warranty"],
    ["requireProductImage", "Is product image required?"],
  ];

  return (
    <div className="space-y-6">
      <SettingsGrid>
        <TextField label="SKU prefix:" value={data.skuPrefix} onChange={(v) => update("skuPrefix", v)} />
        <div className="space-y-2">
          <CheckField label="Enable Product Expiry" hint="Configure product expiry tracking." checked={data.enableProductExpiry} onChange={(v) => update("enableProductExpiry", v)} />
          <SelectField label="Expiry action:" value={data.expiryAction} onChange={(v) => update("expiryAction", v)} options={["Add item expiry", "Enable expiry tracking"]} />
        </div>
        <SelectField label="Default Unit:" value={data.defaultUnit} onChange={(v) => update("defaultUnit", v)} options={["", "Please Select", "Pieces", "Pc(s)", "Kg", "Box", "Bottle", "Jar"]} />
      </SettingsGrid>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {checks.map(([key, label]) => <CheckField key={key} label={label} checked={data[key]} onChange={(v) => update(key, v)} />)}
      </div>
    </div>
  );
}

function ContactTab({ data, update }) {
  return <div className="max-w-md"><TextField label="Default credit limit:" type="number" value={data.defaultCreditLimit} onChange={(v) => update("defaultCreditLimit", v)} /></div>;
}

function SaleTab({ data, update }) {
  return (
    <div className="space-y-7">
      <SettingsGrid>
        <TextField label="Default Sale Discount:*" value={data.defaultSaleDiscount} onChange={(v) => update("defaultSaleDiscount", v)} />
        <SelectField label="Default Sale Tax:" value={data.defaultSaleTax} onChange={(v) => update("defaultSaleTax", v)} options={["GST", "None", "Tax 1", "Tax 2"]} />
        <SelectField label="Sales Item Addition Method:" value={data.salesItemAdditionMethod} onChange={(v) => update("salesItemAdditionMethod", v)} options={["Increase item quantity if it already exists", "Add as a new line"]} />
        <SelectField label="Amount rounding method:" value={data.amountRoundingMethod} onChange={(v) => update("amountRoundingMethod", v)} options={["Round to nearest whole number", "Round up", "Round down", "No rounding"]} hint="Choose how amounts are rounded." />
        <CheckField label="Sales price is minimum selling price" checked={data.salesPriceMinimum} onChange={(v) => update("salesPriceMinimum", v)} />
        <CheckField label="Allow Overselling" hint="Allow sales when stock is insufficient." checked={data.allowOverselling} onChange={(v) => update("allowOverselling", v)} />
        <CheckField label="Enable Sales Order" hint="Allow sales orders." checked={data.enableSalesOrder} onChange={(v) => update("enableSalesOrder", v)} />
        <CheckField label="Is pay term required?" checked={data.paymentTermRequired} onChange={(v) => update("paymentTermRequired", v)} />
      </SettingsGrid>
      <div className="border-t border-[#E6EDF5] pt-5">
        <SectionTitle>Commission Agent</SectionTitle>
        <SettingsGrid>
          <SelectField label="Sales Commission Agent:" value={data.salesCommissionAgent} onChange={(v) => update("salesCommissionAgent", v)} options={["Select from user's list", "Logged-in user", "None"]} />
          <SelectField label="Commission Calculation Type:" value={data.commissionCalculationType} onChange={(v) => update("commissionCalculationType", v)} options={["Invoice value", "Payment received", "Fixed amount"]} />
          <CheckField label="Is commission agent required?" checked={data.commissionAgentRequired} onChange={(v) => update("commissionAgentRequired", v)} />
        </SettingsGrid>
      </div>
      <div className="border-t border-[#E6EDF5] pt-5">
        <SectionTitle>Payment Link</SectionTitle>
        <CheckField label="Enable payment link" checked={data.enablePaymentLink} onChange={(v) => update("enablePaymentLink", v)} />
        <h4 className="mb-4 mt-5 text-sm font-semibold text-[#10234F]">Razorpay <span className="font-normal text-slate-500">(For INR India)</span></h4>
        <SettingsGrid columns={2}>
          <TextField label="Key ID:" value={data.razorpayKeyId} onChange={(v) => update("razorpayKeyId", v)} />
          <TextField label="Key Secret:" value={data.razorpayKeySecret} onChange={(v) => update("razorpayKeySecret", v)} type="password" />
        </SettingsGrid>
        <h4 className="mb-4 mt-5 text-sm font-semibold text-[#10234F]">Stripe</h4>
        <SettingsGrid columns={2}>
          <TextField label="Stripe public key:" value={data.stripePublicKey} onChange={(v) => update("stripePublicKey", v)} />
          <TextField label="Stripe secret key:" value={data.stripeSecretKey} onChange={(v) => update("stripeSecretKey", v)} type="password" />
        </SettingsGrid>
      </div>
    </div>
  );
}

function PosTab({ data, update }) {
  const shortcutEntries = Object.entries(data.shortcuts);
  const firstHalf = shortcutEntries.slice(0, 6);
  const secondHalf = shortcutEntries.slice(6);
  const checks = [
    ["disableMultiplePay", "Disable Multiple Pay"],
    ["disableDraft", "Disable Draft"],
    ["disableExpressCheckout", "Disable Express Checkout"],
    ["hideProductSuggestion", "Don't show product suggestion"],
    ["hideRecentTransactions", "Don't show recent transactions"],
    ["disableDiscount", "Disable Discount"],
    ["disableOrderTax", "Disable order tax"],
    ["subtotalEditable", "Subtotal Editable"],
    ["disableSuspendSale", "Disable Suspend Sale"],
    ["enableTransactionDate", "Enable transaction date on POS screen"],
    ["enableServiceStaffProductLine", "Enable service staff in product line"],
    ["serviceStaffRequired", "Is service staff required"],
    ["disableCreditSaleButton", "Disable credit sale button"],
    ["enableWeighingScale", "Enable Weighing Scale"],
    ["showInvoiceScheme", "Show invoice scheme"],
    ["showInvoiceLayoutDropdown", "Show invoice layout dropdown"],
    ["printInvoiceOnSuspend", "Print invoice on suspend"],
    ["showPricingTooltip", "Show pricing on product suggestion tooltip"],
  ];

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle>Add keyboard shortcuts</SectionTitle>
        <p className="mb-2 text-sm text-slate-500">Shortcut names are separated by +. Example: ctrl+shift+b, ctrl+h.</p>
        <p className="mb-4 text-xs text-slate-500">Available keys: shift, ctrl, alt, backspace, tab, enter, return, capslock, esc, escape, space, pageup, pagedown, end, home, left, up, right, down, ins, del, and plus.</p>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {[firstHalf, secondHalf].map((group, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-[#E6EDF5]">
              <div className="grid grid-cols-2 bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#10234F]"><span>Operations</span><span>Keyboard Shortcut</span></div>
              {group.map(([operation, shortcut], i) => (
                <div key={operation} className={`grid grid-cols-2 items-center gap-3 px-4 py-2 ${i % 2 ? "bg-white" : "bg-[#FFFAF5]"}`}>
                  <span className="text-sm text-[#10234F]">{operation}:</span>
                  <input className={`${fieldClass} mt-0`} value={shortcut} onChange={(e) => update("shortcuts", { ...data.shortcuts, [operation]: e.target.value })} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>POS settings</SectionTitle>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 xl:grid-cols-3">
          {checks.map(([key, label]) => <CheckField key={key} label={label} checked={data[key]} onChange={(v) => update(key, v)} hint={key === "subtotalEditable" ? "Allow the subtotal to be edited." : undefined} />)}
        </div>
      </div>
      <div className="border-t border-[#E6EDF5] pt-5">
        <SectionTitle>Weighing Scale barcode Setting</SectionTitle>
        <p className="mb-4 text-sm text-slate-500">Configure barcode as per your weighing scale.</p>
        <SettingsGrid columns={4}>
          <TextField label="Prefix:" value={data.weighingPrefix} onChange={(v) => update("weighingPrefix", v)} />
          <SelectField label="Product sku length:" value={data.productSkuLength} onChange={(v) => update("productSkuLength", v)} options={["3", "4", "5", "6", "7", "8"]} />
          <SelectField label="Quantity integer part length:" value={data.quantityIntegerLength} onChange={(v) => update("quantityIntegerLength", v)} options={["2", "3", "4", "5", "6"]} />
          <SelectField label="Quantity fractional part length:" value={data.quantityFractionalLength} onChange={(v) => update("quantityFractionalLength", v)} options={["0", "1", "2", "3", "4"]} />
        </SettingsGrid>
      </div>
    </div>
  );
}

function PurchasesTab({ data, update }) {
  const checks = [
    ["enableEditProductPrice", "Enable editing product price from purchase screen"],
    ["enablePurchaseStatus", "Enable Purchase Status"],
    ["enableLotNumber", "Enable Lot number"],
    ["enablePurchaseOrder", "Enable purchase order"],
    ["enablePurchaseRequisition", "Enable Purchase Requisition"],
  ];
  return <div className="grid grid-cols-1 gap-2 md:grid-cols-2">{checks.map(([key, label]) => <CheckField key={key} label={label} checked={data[key]} onChange={(v) => update(key, v)} hint="Purchase workflow setting." />)}</div>;
}

function PaymentTab({ data, update }) {
  return (
    <div className="space-y-6">
      <TextField label="Cash Denominations:" value={data.cashDenominations} onChange={(v) => update("cashDenominations", v)} placeholder="Comma separated values. Example: 100,200,500,2000" />
      <SettingsGrid>
        <SelectField label="Enable cash denomination on:" value={data.cashDenominationScreen} onChange={(v) => update("cashDenominationScreen", v)} options={["POS screen", "Payment screen", "Both"]} />
        <TextField label="Enable cash denomination for payment methods:" value={data.cashDenominationMethods} onChange={(v) => update("cashDenominationMethods", v)} />
        <CheckField label="Strict check" checked={data.strictCashCheck} onChange={(v) => update("strictCashCheck", v)} hint="Require the denomination totals to match." />
      </SettingsGrid>
    </div>
  );
}

function DashboardTab({ data, update }) {
  return <div className="max-w-md"><TextField label="View Stock Expiry Alert For:*" type="number" value={data.stockExpiryDays} onChange={(v) => update("stockExpiryDays", v)} /><p className="mt-2 text-xs text-slate-500">Days before expiry to show the stock expiry alert.</p></div>;
}

function SystemTab({ data, update }) {
  return (
    <SettingsGrid>
      <SelectField label="Theme Color" value={data.themeColor} onChange={(v) => update("themeColor", v)} options={["Red", "Blue", "Green", "Orange", "Purple"]} />
      <SelectField label="Default datatable page entries" value={data.defaultPageEntries} onChange={(v) => update("defaultPageEntries", v)} options={["10", "25", "50", "100"]} />
      <CheckField label="Show help text" checked={data.showHelpText} onChange={(v) => update("showHelpText", v)} />
    </SettingsGrid>
  );
}

function PrefixesTab({ data, update }) {
  const fields = [
    ["purchase", "Purchase:"], ["purchaseReturn", "Purchase Return:"],
    ["purchaseRequisition", "Purchase Requisition:"], ["purchaseOrder", "Purchase Order:"],
    ["stockTransfer", "Stock Transfer:"], ["stockAdjustment", "Stock Adjustment:"],
    ["sellReturn", "Sell Return:"], ["expenses", "Expenses:"], ["contacts", "Contacts:"],
    ["purchasePayment", "Purchase Payment:"], ["sellPayment", "Sell Payment:"],
    ["expensePayment", "Expense Payment:"], ["businessLocation", "Business Location:"],
    ["username", "Username:"], ["subscriptionNo", "Subscription No.:"],
    ["draft", "Draft:"], ["salesOrder", "Sales Order:"],
  ];
  return <SettingsGrid>{fields.map(([key, label]) => <TextField key={key} label={label} value={data[key]} onChange={(v) => update(key, v)} />)}</SettingsGrid>;
}

function EmailTab({ data, update, onTest }) {
  return (
    <div className="space-y-6">
      <SettingsGrid>
        <SelectField label="Mail Driver:" value={data.mailDriver} onChange={(v) => update("mailDriver", v)} options={["SMTP", "Sendmail", "Mail"]} />
        <TextField label="Host:" value={data.host} onChange={(v) => update("host", v)} />
        <TextField label="Port:" value={data.port} onChange={(v) => update("port", v)} />
        <TextField label="Username:" value={data.username} onChange={(v) => update("username", v)} />
        <TextField label="Password:" type="password" value={data.password} onChange={(v) => update("password", v)} />
        <TextField label="Encryption:" value={data.encryption} onChange={(v) => update("encryption", v)} />
        <TextField label="From Address:" value={data.fromAddress} onChange={(v) => update("fromAddress", v)} />
        <TextField label="From Name:" value={data.fromName} onChange={(v) => update("fromName", v)} />
      </SettingsGrid>
      <div className="flex justify-end"><button onClick={onTest} type="button" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Send test email</button></div>
    </div>
  );
}

function SmsTab({ data, update, onTest }) {
  const updatePair = (group, index, field, value) => {
    update(group, data[group].map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-6">
      <SettingsGrid>
        <SelectField label="SMS Service:" value={data.service} onChange={(v) => update("service", v)} options={["Other", "Twilio", "Vonage", "Custom"]} />
        <TextField label="URL:" value={data.url} onChange={(v) => update("url", v)} placeholder="URL" />
        <TextField label="Send to parameter name:" value={data.sendToParameter} onChange={(v) => update("sendToParameter", v)} />
        <TextField label="Message parameter name:" value={data.messageParameter} onChange={(v) => update("messageParameter", v)} />
        <SelectField label="Request Method:" value={data.requestMethod} onChange={(v) => update("requestMethod", v)} options={["POST", "GET", "PUT"]} />
      </SettingsGrid>
      <div className="border-t border-[#E6EDF5] pt-5">
        <SectionTitle>Headers</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.headers.map((header, index) => (
            <React.Fragment key={`header-${index}`}>
              <TextField label={`Header ${index + 1} key:`} value={header.key} onChange={(v) => updatePair("headers", index, "key", v)} placeholder={`Header ${index + 1} key`} />
              <TextField label={`Header ${index + 1} value:`} value={header.value} onChange={(v) => updatePair("headers", index, "value", v)} placeholder={`Header ${index + 1} value`} />
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="border-t border-[#E6EDF5] pt-5">
        <SectionTitle>Parameters</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.parameters.map((parameter, index) => (
            <React.Fragment key={`parameter-${index}`}>
              <TextField label={`Parameter ${index + 1} key:`} value={parameter.key} onChange={(v) => updatePair("parameters", index, "key", v)} placeholder={`Parameter ${index + 1} key`} />
              <TextField label={`Parameter ${index + 1} value:`} value={parameter.value} onChange={(v) => updatePair("parameters", index, "value", v)} placeholder={`Parameter ${index + 1} value`} />
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-[#E6EDF5] pt-5 sm:flex-row">
        <input className={`${fieldClass} mt-0`} value={data.testNumber} onChange={(e) => update("testNumber", e.target.value)} placeholder="Test Number" />
        <button type="button" onClick={onTest} className="shrink-0 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Send test SMS</button>
      </div>
    </div>
  );
}

function RewardTab({ data, update }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E6EDF5] bg-[#FFFAF5] p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <CheckField label="Enable Reward Point" checked={data.enabled} onChange={(v) => update("enabled", v)} />
          <TextField label="Reward Point Display Name:" value={data.displayName} onChange={(v) => update("displayName", v)} placeholder="Reward Point Display Name" />
        </div>
        <h4 className="mb-4 mt-6 text-sm font-semibold text-[#10234F]">Earning Points Settings</h4>
        <SettingsGrid>
          <TextField label="Amount spend for unit point:" value={data.amountSpendPerPoint} onChange={(v) => update("amountSpendPerPoint", v)} hint="Amount required to earn one point." />
          <TextField label="Minimum order total to earn reward:" value={data.minimumOrderToEarn} onChange={(v) => update("minimumOrderToEarn", v)} />
          <TextField label="Maximum points per order:" value={data.maximumPointsPerOrder} onChange={(v) => update("maximumPointsPerOrder", v)} />
        </SettingsGrid>
      </div>
      <div className="rounded-xl border border-[#E6EDF5] bg-[#FFFAF5] p-5">
        <h4 className="mb-4 text-sm font-semibold text-[#10234F]">Redeem Points Settings</h4>
        <SettingsGrid>
          <TextField label="Redeem amount per unit point:" value={data.redeemAmountPerPoint} onChange={(v) => update("redeemAmountPerPoint", v)} />
          <TextField label="Minimum order total to redeem points:" value={data.minimumOrderToRedeem} onChange={(v) => update("minimumOrderToRedeem", v)} />
          <TextField label="Minimum redeem point:" value={data.minimumRedeemPoint} onChange={(v) => update("minimumRedeemPoint", v)} />
          <TextField label="Maximum redeem point per order:" value={data.maximumRedeemPointPerOrder} onChange={(v) => update("maximumRedeemPointPerOrder", v)} />
          <TextField label="Reward Point expiry period:" value={data.expiryPeriod} onChange={(v) => update("expiryPeriod", v)} />
          <SelectField label="Expiry unit:" value={data.expiryUnit} onChange={(v) => update("expiryUnit", v)} options={["Year", "Month", "Day"]} />
        </SettingsGrid>
      </div>
    </div>
  );
}

function ModulesTab({ data, update }) {
  const modules = [
    ["purchases", "Purchases"], ["addSale", "Add Sale"], ["pos", "POS"],
    ["stockTransfers", "Stock Transfers"], ["stockAdjustment", "Stock Adjustment"],
    ["expenses", "Expenses"], ["account", "Account"], ["tables", "Tables"],
    ["modifiers", "Modifiers"], ["serviceStaff", "Service staff"],
    ["bookings", "Enable Bookings"], ["kitchen", "Kitchen (For restaurants)"],
    ["subscription", "Enable Subscription"], ["typesOfService", "Types of service"],
  ];
  return (
    <div>
      <SectionTitle>Enable/Disable Modules</SectionTitle>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(([key, label]) => <CheckField key={key} label={label} checked={data[key]} onChange={(v) => update(key, v)} />)}
      </div>
    </div>
  );
}

function CustomLabelsTab({ data, update }) {
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showAddLabel, setShowAddLabel] = useState(false);
  const fieldTypes = ["Text", "Date", "Date & Time", "Dropdown", "Checkbox", "Textarea", "Radio", "File", "Number"];

  const updateCustomField = (groupId, index, property, value) => {
    const currentGroup = data[groupId] ?? [];
    update(
      groupId,
      currentGroup.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, [property]: value } : field
      )
    );
  };

  const addLabel = () => {
    if (!newLabel.trim()) return;
    update("extraLabels", [...(data.extraLabels ?? []), { key: newLabel.trim(), value: newValue.trim() }]);
    setNewLabel("");
    setNewValue("");
    setShowAddLabel(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionTitle>Custom Labels</SectionTitle>
          <p className="text-sm text-slate-500">Configure labels and field options for different parts of the application.</p>
        </div>
        <button type="button" onClick={() => setShowAddLabel((value) => !value)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95">
          <Plus size={16} /> Add custom label
        </button>
      </div>

      {showAddLabel && (
        <div className="grid grid-cols-1 items-end gap-4 rounded-xl border border-orange-100 bg-[#FFFAF5] p-4 md:grid-cols-[1fr_1fr_auto]">
          <TextField label="Label key:" value={newLabel} onChange={setNewLabel} placeholder="Enter label key" />
          <TextField label="Display name:" value={newValue} onChange={setNewValue} placeholder="Enter display name" />
          <button type="button" onClick={addLabel} className="rounded-lg bg-[#FF6814] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#E95A0B]">Add Label</button>
        </div>
      )}

      {CUSTOM_LABEL_GROUPS.map((group) => {
        const fields = data[group.id] ?? [];
        return (
          <section key={group.id} className="border-b border-[#EEF1F5] pb-7 last:border-b-0 last:pb-0">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#10234F]">{group.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{group.count} configurable fields</p>
            </div>
            <div className={`grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 ${group.columns === 4 ? "xl:grid-cols-4" : group.columns === 3 ? "xl:grid-cols-3" : "xl:grid-cols-2"}`}>
              {fields.map((field, index) => (
                <div key={`${group.id}-${index}`} className="min-w-0">
                  <label className="mb-1.5 block text-xs font-semibold text-[#10234F]">
                    {group.prefix} {index + 1}
                  </label>
                  <div className="flex min-w-0 flex-col gap-2">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(event) => updateCustomField(group.id, index, "label", event.target.value)}
                      placeholder={`Enter ${group.prefix.toLowerCase()} ${index + 1}`}
                      aria-label={`${group.title}, ${group.prefix} ${index + 1}`}
                      className="min-w-0 w-full rounded-lg border border-[#DCE3EC] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                    />
                    {group.fieldType && (
                      <SelectField
                        label="Field Type"
                        value={field.fieldType}
                        onChange={(value) => updateCustomField(group.id, index, "fieldType", value)}
                        options={fieldTypes}
                      />
                    )}
                    {group.required && (
                      <CheckField label="Is required" checked={field.required} onChange={(value) => updateCustomField(group.id, index, "required", value)} />
                    )}
                    {group.defaultForContact && (
                      <CheckField label="Is default for contact" checked={field.defaultForContact} onChange={(value) => updateCustomField(group.id, index, "defaultForContact", value)} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {(data.extraLabels ?? []).length > 0 && (
        <section className="border-t border-[#EEF1F5] pt-6">
          <SectionTitle>Additional custom labels</SectionTitle>
          <div className="space-y-3">
            {data.extraLabels.map((item, index) => (
              <div key={`${item.key}-${index}`} className="grid grid-cols-1 items-end gap-3 rounded-xl border border-[#E6EDF5] p-3 sm:grid-cols-[1fr_1fr_auto]">
                <TextField label="Label key:" value={item.key} onChange={(value) => update("extraLabels", data.extraLabels.map((row, i) => i === index ? { ...row, key: value } : row))} />
                <TextField label="Display name:" value={item.value} onChange={(value) => update("extraLabels", data.extraLabels.map((row, i) => i === index ? { ...row, value } : row))} />
                <button type="button" onClick={() => update("extraLabels", data.extraLabels.filter((_, i) => i !== index))} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                  <Trash2 size={15} /> Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function BusinessSettings() {
  const [activeTab, setActiveTab] = useState("business");
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState(initialSettings);
  const [savedMessage, setSavedMessage] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const filteredTabs = useMemo(
    () => NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const updateField = (section, key, value) => {
    setSettings((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [key]: value,
      },
    }));
    setSavedMessage("");
  };

  const saveSettings = () => {
    setSavedMessage("Settings updated in this session. Connect your API to persist changes.");
    console.log("Business settings:", settings);
  };

  const handleTest = (kind) => {
    window.alert(`${kind} test requires your existing backend/API integration. No message has been sent.`);
  };

  const renderTab = () => {
    const data = settings[activeTab];
    const update = (key, value) => updateField(activeTab, key, value);

    switch (activeTab) {
      case "business": return <BusinessTab data={data} update={update} setLogo={(file) => { setLogoFile(file); update("logo", file); }} />;
      case "tax": return <TaxTab data={data} update={update} />;
      case "product": return <ProductTab data={data} update={update} />;
      case "contact": return <ContactTab data={data} update={update} />;
      case "sale": return <SaleTab data={data} update={update} />;
      case "pos": return <PosTab data={data} update={update} />;
      case "purchases": return <PurchasesTab data={data} update={update} />;
      case "payment": return <PaymentTab data={data} update={update} />;
      case "dashboard": return <DashboardTab data={data} update={update} />;
      case "system": return <SystemTab data={data} update={update} />;
      case "prefixes": return <PrefixesTab data={data} update={update} />;
      case "email": return <EmailTab data={data} update={update} onTest={() => handleTest("Email")} />;
      case "sms": return <SmsTab data={data} update={update} onTest={() => handleTest("SMS")} />;
      case "reward": return <RewardTab data={data} update={update} />;
      case "modules": return <ModulesTab data={data} update={update} />;
      case "custom": return <CustomLabelsTab data={data} update={update} />;
      default: return null;
    }
  };

  const ActiveIcon = NAV_ITEMS.find((item) => item.id === activeTab)?.icon ?? Settings;

  return (
    <main className="min-h-screen bg-[#FFFAF5] p-3 text-[#10234F] sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-[#FF6814]"><Settings size={22} /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#10234F]">Business Settings</h1>
              <p className="mt-1 text-sm text-slate-500">Configure your business, sales, inventory, and system preferences.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-xs font-semibold text-[#10234F]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Configuration
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-[#E6EDF5] bg-white p-3 shadow-sm sm:p-4">
          <div className="relative mx-auto max-w-2xl">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className={`${fieldClass} mt-0 py-3 pl-11 pr-4`} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search settings sections..." />
          </div>
          {search && <p className="mt-2 text-center text-xs text-slate-500">Showing {filteredTabs.length} matching section(s).</p>}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_8px_30px_rgba(16,35,79,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="border-b border-[#E6EDF5] bg-[#FFFCF9] p-3 lg:border-b-0 lg:border-r lg:p-4">
              <div className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">Settings sections</div>
              <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-1.5">
                {filteredTabs.map((item) => {
                  const Icon = item.icon;
                  const selected = activeTab === item.id;
                  return (
                    <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${selected ? "bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-md shadow-orange-200" : "border border-transparent text-slate-600 hover:border-orange-100 hover:bg-white hover:text-[#10234F]"}`}>
                      <Icon size={17} className="shrink-0" />
                      <span>{item.label}</span>
                      {selected && <Check size={15} className="ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </nav>
              {filteredTabs.length === 0 && <p className="px-2 py-4 text-sm text-slate-500">No settings sections found.</p>}
            </aside>

            <section className="min-w-0 p-4 sm:p-6 lg:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]"><ActiveIcon size={20} /></div>
                <div>
                  <h2 className="text-lg font-bold text-[#10234F]">{NAV_ITEMS.find((item) => item.id === activeTab)?.label}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Manage {NAV_ITEMS.find((item) => item.id === activeTab)?.label.toLowerCase()} preferences</p>
                </div>
              </div>
              {renderTab()}
            </section>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E6EDF5] bg-[#FFFCF9] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="text-sm">
              {savedMessage ? <p className="text-emerald-700">{savedMessage}</p> : <p className="text-slate-500">Review your changes before updating the settings.</p>}
              {logoFile && <p className="mt-1 text-xs text-slate-500">Selected logo: {logoFile.name}</p>}
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => { setSettings(initialSettings); setLogoFile(null); setSavedMessage("Settings reset to the initial values in this component."); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE3EC] bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                <RotateCcw size={16} /> Reset
              </button>
              <button type="button" onClick={saveSettings} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-lg">
                <Save size={17} /> Update Settings
              </button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">Billomax · Business configuration</p>
      </div>
    </main>
  );
}
