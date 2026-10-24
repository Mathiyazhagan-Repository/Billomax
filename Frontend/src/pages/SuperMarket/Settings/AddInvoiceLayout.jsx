
import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Save,
  X,
  Info,
  Upload,
  ChevronDown,
} from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-[#DCE3EC] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-1.5 block text-xs font-bold text-[#10234F]";

const initialForm = {
  layoutName: "",
  design: "Classic (For normal printer)",
  showLetterHead: false,
  invoiceLogo: null,
  showInvoiceLogo: false,
  headerText: "",
  subHeading1: "",
  subHeading2: "",
  subHeading3: "",
  subHeading4: "",
  subHeading5: "",
  invoiceHeading: "Invoice",
  headingSuffixNotPaid: "",
  headingSuffixPaid: "",
  proformaInvoiceHeading: "Proforma invoice",
  quotationHeading: "Quotation",
  salesOrderHeading: "Sales Order",
  invoiceNumberLabel: "Invoice No.",
  quotationNumberLabel: "Quotation number",
  dateLabel: "Date",
  dueDateLabel: "Due Date",
  showDueDate: false,
  dateTimeFormat: "",
  salesPersonLabel: "Sales Person",
  commissionAgentLabel: "Commission Agent",
  showBusinessName: false,
  showLocationName: true,
  showSalesPerson: false,
  showCommissionAgent: false,

  showCustomerInformation: true,
  customerLabel: "Customer",
  showClientId: false,
  clientIdLabel: "Client ID",
  clientTaxNumberLabel: "Client tax number",
  showRewardPoint: false,
  customerCustomField1: false,
  customerCustomField2: false,
  customerCustomField3: false,
  customerCustomField4: false,

  showLandmark: true,
  showCity: true,
  showState: true,
  showCountry: true,
  showZipCode: true,
  locationCustomField1: false,
  locationCustomField2: false,
  locationCustomField3: false,
  locationCustomField4: false,

  showMobileNumber: true,
  showAlternateNumber: false,
  showEmail: false,
  showTax1Details: true,
  showTax2Details: false,

  productLabel: "Product",
  quantityLabel: "Quantity",
  unitPriceLabel: "Unit Price",
  subtotalLabel: "Subtotal",
  categoryHsnLabel: "HSN",
  totalQuantityLabel: "Total Quantity",
  itemDiscountLabel: "Discount",
  discountedUnitPriceLabel: "Price after discount",

  showBrand: false,
  showSku: true,
  showCategoryHsn: false,
  showSaleDescription: false,
  showProductDescription: false,
  productCustomField1: false,
  productCustomField2: false,
  productCustomField3: false,
  productCustomField4: false,
  showProductImage: false,
  showWarrantyName: false,
  showWarrantyExpiryDate: false,
  showWarrantyDescription: false,
  showBaseUnitDetails: false,

  subtotalTotalLabel: "Subtotal",
  discountLabel: "Discount",
  taxLabel: "Tax",
  totalLabel: "Total",
  totalItemsLabel: "Total items",
  roundOffLabel: "Round Off",
  totalDueCurrentSaleLabel: "Due",
  amountPaidLabel: "Total paid",
  showPaymentInformation: true,
  showBarcode: false,
  totalDueAllSalesLabel: "Total Due",
  showTotalBalanceDue: false,
  changeReturnLabel: "Change Return",
  showTotalInWords: false,
  wordFormat: "International",
  taxSummaryLabel: "Tax summary",

  footerText: "",

  showQrCode: false,
  showQrLabels: false,
  showZatcaQrCode: false,
  qrBusinessName: false,
  qrBusinessAddress: false,
  qrBusinessTax1: false,
  qrBusinessTax2: false,
  qrInvoiceNumber: false,
  qrInvoiceDatetime: false,
  qrSubtotal: false,
  qrTotalAmountWithTax: false,
  qrTotalTax: false,
  qrCustomerName: false,
  qrInvoiceUrl: false,

  creditNoteHeading: "Credit Note",
  creditNoteReferenceNumber: "Reference No",
  creditNoteTotalAmount: "Credit Amount",
};

function Section({ title, description, children, className = "" }) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_5px_22px_rgba(16,35,79,0.045)] ${className}`}
    >
      <div className="border-b border-[#EEF1F5] px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-[#10234F]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      <div className="space-y-5 p-4 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  hint,
  children,
}) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children || (
        <input
          type={type}
          required={required}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder || label}
          className={inputClass}
        />
      )}
      {hint && <span className="mt-1.5 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

function ToggleField({ label, checked, onChange, info }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-[#34445D] transition hover:bg-orange-50/60">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-[#FF6814]"
      />
      <span>{label}</span>
      {info && (
        <span title={info} className="inline-flex text-cyan-500">
          <Info size={14} />
        </span>
      )}
    </label>
  );
}

function FieldGrid({ children, columns = 4 }) {
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
      : columns === 3
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4";

  return <div className={gridClass}>{children}</div>;
}

function ToggleGrid({ children, columns = 4 }) {
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 gap-1 sm:grid-cols-2"
      : columns === 3
      ? "grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-3"
      : "grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-4";

  return <div className={gridClass}>{children}</div>;
}

function Subsection({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[#243B73]">{title}</h3>
      {children}
    </div>
  );
}

export default function AddInvoiceLayout({
  onSave,
  onClose,
  initialData,
  isEditing = false,
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...(initialData ?? {}),
    layoutName: initialData?.layoutName ?? initialData?.name ?? "",
    design:
      initialData?.design ??
      initialData?.type ??
      initialForm.design,
  }));
  const [saving, setSaving] = useState(false);

  const set = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const textField = (key, label, options = {}) => (
    <Field
      key={key}
      label={label}
      value={form[key]}
      onChange={(event) => set(key, event.target.value)}
      {...options}
    />
  );

  const toggle = (key, label, info) => (
    <ToggleField
      key={key}
      label={label}
      checked={form[key]}
      onChange={(event) => set(key, event.target.checked)}
      info={info}
    />
  );

  const submit = async (event) => {
    event.preventDefault();
    if (!form.layoutName.trim()) return;

    setSaving(true);
    try {
      await onSave?.({
        ...form,
        name: form.layoutName.trim(),
        type: form.design,
      });
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-3 py-5 text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6814]">
              Billomax / Invoice Settings
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              {isEditing ? "Edit Invoice Layout" : "Add New Invoice Layout"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Customize invoice headings, customer details, product fields and printing options.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#E2E5EC] bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
        </header>

        <form onSubmit={submit} className="space-y-5">
          {/* Layout setup */}
          <Section
            title="Layout Configuration"
            description="Set the layout name, printing design, letterhead and invoice logo."
          >
            <FieldGrid columns={2}>
              {textField("layoutName", "Layout name", {
                required: true,
                placeholder: "Layout name",
              })}

              <Field label="Design" required>
                <select
                  required
                  value={form.design}
                  onChange={(event) => set("design", event.target.value)}
                  className={inputClass}
                >
                  <option>Classic (For normal printer)</option>
                  <option>Elegant</option>
                  <option>Modern</option>
                  <option>Compact</option>
                </select>
                <span className="mt-1.5 block text-xs text-slate-500">
                  Used for browser based printing
                </span>
              </Field>
            </FieldGrid>

            <ToggleGrid columns={2}>
              {toggle("showLetterHead", "Show letter head")}
            </ToggleGrid>

            <FieldGrid columns={2}>
              <div>
                <label className={labelClass}>Invoice Logo</label>
                <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#DCE3EC] bg-[#FFFCF8] px-3 py-2 text-sm text-slate-600 hover:border-orange-300">
                  <Upload size={16} className="text-[#FF6814]" />
                  <span className="truncate">
                    {form.invoiceLogo?.name || "Choose image"}
                  </span>
                  <input
                    type="file"
                    accept=".jpeg,.jpg,.gif,.png,image/jpeg,image/gif,image/png"
                    className="sr-only"
                    onChange={(event) =>
                      set("invoiceLogo", event.target.files?.[0] || null)
                    }
                  />
                </label>
                <p className="mt-1.5 text-xs text-slate-500">
                  Max 1 MB, jpeg, gif, png formats only.
                </p>
              </div>
              <div className="flex items-center pt-5">
                {toggle("showInvoiceLogo", "Show invoice Logo")}
              </div>
            </FieldGrid>

            <Field label="Header text">
              <textarea
                value={form.headerText}
                onChange={(event) => set("headerText", event.target.value)}
                placeholder="Header text"
                rows={5}
                className={inputClass}
              />
              <span className="mt-1 block text-xs text-slate-500">
                Enter the text you want printed in the invoice header.
              </span>
            </Field>

            <FieldGrid>
              {[1, 2, 3, 4, 5].map((n) =>
                textField(`subHeading${n}`, `Sub Heading Line ${n}`, {
                  placeholder: `Sub Heading Line ${n}`,
                })
              )}
            </FieldGrid>
          </Section>

          {/* Invoice heading and labels */}
          <Section
            title="Invoice Headings & Labels"
            description="Customize the text labels printed on invoices, quotations and sales orders."
          >
            <FieldGrid>
              {textField("invoiceHeading", "Invoice heading")}
              {textField("headingSuffixNotPaid", "Heading Suffix for not paid")}
              {textField("headingSuffixPaid", "Heading Suffix for paid")}
              {textField("proformaInvoiceHeading", "Proforma invoice heading")}
              {textField("quotationHeading", "Quotation Heading")}
              {textField("salesOrderHeading", "Sales Order Heading")}
              {textField("invoiceNumberLabel", "Invoice no. label")}
              {textField("quotationNumberLabel", "Quotation no. label")}
              {textField("dateLabel", "Date Label")}
              {textField("dueDateLabel", "Due date label")}
              <div className="flex items-center pt-5">
                {toggle("showDueDate", "Show due date")}
              </div>
              {textField("dateTimeFormat", "Date time format", {
                placeholder: "Date time format",
                hint: "Enter a PHP datetime format. If blank, the business date time format will be applied.",
              })}
              {textField("salesPersonLabel", "Sales Person Label")}
              {textField("commissionAgentLabel", "Commission agent label")}
            </FieldGrid>

            <ToggleGrid>
              {toggle("showBusinessName", "Show business name")}
              {toggle("showLocationName", "Show location name")}
              {toggle("showSalesPerson", "Show Sales Person")}
              {toggle("showCommissionAgent", "Show commission agent")}
            </ToggleGrid>
          </Section>

          {/* Customer fields */}
          <Section
            title="Customer Details"
            description="Choose which customer, address, communication and tax fields appear on the invoice."
          >
            <Subsection title="Fields for customer details">
              <FieldGrid>
                <div className="pt-5">
                  {toggle("showCustomerInformation", "Show Customer information")}
                </div>
                {textField("customerLabel", "Customer Label")}
                <div className="pt-5">
                  {toggle("showClientId", "Show client ID")}
                </div>
                {textField("clientIdLabel", "Client ID Label")}
                {textField("clientTaxNumberLabel", "Client tax number label")}
                <div className="pt-5">
                  {toggle("showRewardPoint", "Show reward point")}
                </div>
              </FieldGrid>

              <ToggleGrid>
                {toggle("customerCustomField1", "Custom Field 1")}
                {toggle("customerCustomField2", "Custom Field 2")}
                {toggle("customerCustomField3", "Custom Field 3")}
                {toggle("customerCustomField4", "Custom Field 4")}
              </ToggleGrid>
            </Subsection>

            <div className="border-t border-[#EEF1F5]" />

            <Subsection title="Fields to be shown in location address">
              <ToggleGrid>
                {toggle("showLandmark", "Landmark")}
                {toggle("showCity", "City")}
                {toggle("showState", "State")}
                {toggle("showCountry", "Country")}
                {toggle("showZipCode", "Zip Code")}
                {toggle("locationCustomField1", "Custom field 1")}
                {toggle("locationCustomField2", "Custom field 2")}
                {toggle("locationCustomField3", "Custom field 3")}
                {toggle("locationCustomField4", "Custom field 4")}
              </ToggleGrid>
            </Subsection>

            <div className="border-t border-[#EEF1F5]" />

            <Subsection title="Fields for Communication details">
              <ToggleGrid columns={3}>
                {toggle("showMobileNumber", "Mobile number")}
                {toggle("showAlternateNumber", "Alternate number")}
                {toggle("showEmail", "Email")}
              </ToggleGrid>
            </Subsection>

            <div className="border-t border-[#EEF1F5]" />

            <Subsection title="Fields for Tax details">
              <ToggleGrid columns={3}>
                {toggle("showTax1Details", "Tax 1 details")}
                {toggle("showTax2Details", "Tax 2 details")}
              </ToggleGrid>
            </Subsection>
          </Section>

          {/* Product fields */}
          <Section
            title="Product Details"
            description="Set product column labels and choose the product information to show."
          >
            <FieldGrid>
              {textField("productLabel", "Product Label")}
              {textField("quantityLabel", "Quantity Label")}
              {textField("unitPriceLabel", "Unit Price Label")}
              {textField("subtotalLabel", "Subtotal Label")}
              {textField("categoryHsnLabel", "Category or HSN code label")}
              {textField("totalQuantityLabel", "Total quantity label")}
              {textField("itemDiscountLabel", "Item discount label")}
              {textField("discountedUnitPriceLabel", "Discounted unit price label")}
            </FieldGrid>

            <div className="border-t border-[#EEF1F5]" />

            <Subsection title="Product details to be shown">
              <ToggleGrid>
                {toggle("showBrand", "Show brand")}
                {toggle("showSku", "Show SKU")}
                {toggle("showCategoryHsn", "Show category code or HSN code")}
                {toggle("showSaleDescription", "Show sale description (Product IMEI or Serial Number)")}
                {toggle("showProductDescription", "Show product description")}
                {toggle("productCustomField1", "Custom Field 1")}
                {toggle("productCustomField2", "Custom Field 2")}
                {toggle("productCustomField3", "Custom Field 3")}
                {toggle("productCustomField4", "Custom Field 4")}
                {toggle("showProductImage", "Show product image")}
                {toggle("showWarrantyName", "Show warranty name")}
                {toggle("showWarrantyExpiryDate", "Show warranty expiry date")}
                {toggle("showWarrantyDescription", "Show warranty description")}
                {toggle("showBaseUnitDetails", "Show base unit details (if applicable)")}
              </ToggleGrid>
            </Subsection>
          </Section>

          {/* Totals and payment */}
          <Section
            title="Totals, Payment & Tax Summary"
            description="Customize totals, payment information, due amounts and invoice footer labels."
          >
            <FieldGrid>
              {textField("subtotalTotalLabel", "Subtotal label")}
              {textField("discountLabel", "Discount label")}
              {textField("taxLabel", "Tax label")}
              {textField("totalLabel", "Total label")}
              {textField("totalItemsLabel", "Total items label")}
              {textField("roundOffLabel", "Round off label")}
              {textField("totalDueCurrentSaleLabel", "Total Due Label (Current sale)")}
              {textField("amountPaidLabel", "Amount Paid Label")}
            </FieldGrid>

            <ToggleGrid columns={2}>
              {toggle("showPaymentInformation", "Show Payment information")}
              {toggle("showBarcode", "Show Barcode")}
            </ToggleGrid>

            <FieldGrid columns={3}>
              {textField("totalDueAllSalesLabel", "Total Due Label (All sales)")}
              <div className="pt-5">
                {toggle("showTotalBalanceDue", "Show total balance due (All sales)")}
              </div>
              {textField("changeReturnLabel", "Change return label")}
            </FieldGrid>

            <FieldGrid columns={3}>
              <div className="pt-5">
                {toggle("showTotalInWords", "Show total in words")}
              </div>
              <Field label="Word Format">
                <select
                  value={form.wordFormat}
                  onChange={(event) => set("wordFormat", event.target.value)}
                  className={inputClass}
                >
                  <option>International</option>
                  <option>Indian</option>
                </select>
              </Field>
              {textField("taxSummaryLabel", "Tax summary label")}
            </FieldGrid>
          </Section>

          {/* Footer */}
          <Section
            title="Footer Text"
            description="Add a message or terms to print at the bottom of the invoice."
          >
            <Field label="Footer text">
              <textarea
                value={form.footerText}
                onChange={(event) => set("footerText", event.target.value)}
                placeholder="Footer text"
                rows={5}
                className={inputClass}
              />
            </Field>
          </Section>

          {/* QR code */}
          <Section
            title="QR Code"
            description="Configure QR code visibility and the invoice fields encoded or displayed alongside it."
          >
            <ToggleGrid columns={3}>
              {toggle("showQrCode", "Show QR Code")}
              {toggle("showQrLabels", "Show Labels")}
              {toggle("showZatcaQrCode", "ZATCA (Fatoora) QR code", "ZATCA QR code option")}
            </ToggleGrid>

            <Subsection title="Fields to be shown">
              <ToggleGrid columns={3}>
                {toggle("qrBusinessName", "Business Name")}
                {toggle("qrBusinessAddress", "Business location address")}
                {toggle("qrBusinessTax1", "Business tax 1")}
                {toggle("qrBusinessTax2", "Business tax 2")}
                {toggle("qrInvoiceNumber", "Invoice No.")}
                {toggle("qrInvoiceDatetime", "Invoice Datetime")}
                {toggle("qrSubtotal", "Subtotal")}
                {toggle("qrTotalAmountWithTax", "Total amount with tax")}
                {toggle("qrTotalTax", "Total Tax")}
                {toggle("qrCustomerName", "Customer name")}
                {toggle("qrInvoiceUrl", "Invoice URL")}
              </ToggleGrid>
            </Subsection>
          </Section>

          {/* Restaurant module */}
          <Section
            title="Restaurant Module Settings"
            description="Additional settings for restaurant invoices."
          >
            <p className="text-sm text-slate-500">
              Restaurant module settings
            </p>
          </Section>

          {/* Credit note */}
          <Section
            title="Credit Note / Sell Return Details"
            description="Customize labels used on credit notes and sales returns."
          >
            <FieldGrid columns={3}>
              {textField("creditNoteHeading", "Heading")}
              {textField("creditNoteReferenceNumber", "Reference Number")}
              {textField("creditNoteTotalAmount", "Total Amount")}
            </FieldGrid>
          </Section>

          {/* Actions */}
          <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-[#E6EDF5] bg-white/95 p-4 shadow-[0_-5px_20px_rgba(16,35,79,0.06)] backdrop-blur sm:flex-row sm:justify-end">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE3EC] bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={17} />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-8 py-3 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Layout"}
            </button>
          </div>
        </form>

        <footer className="py-2 text-center text-xs text-slate-500">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
        </footer>
      </div>
    </main>
  );
}
