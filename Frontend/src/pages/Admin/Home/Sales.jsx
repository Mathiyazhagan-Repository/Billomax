
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CircleAlert,
  Info,
  MapPin,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Printer,
  Columns3,
  FileDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  CreditCard,
  Package,
  ShoppingCart,
  ReceiptText,
  CirclePlus,
  Wallet,
  X,
} from "lucide-react";

const salesPayments = [];

const purchasePayments = [
  {
    supplier: "Ravi",
    reference: "PO2024/0004",
    amount: 300,
  },
];

const stockItems = [
  {
    product: "hair transplant (sku135)",
    location: "Pharmacy",
    stock: "0.00 piece",
    low: true,
  },
  {
    product: "Amlodipine (SKU1325)",
    location: "Pharmacy",
    stock: "5.00 jar",
    low: false,
  },
];

const salesOrders = [];

const exportRows = (rows, filename) => {
  if (!rows.length) {
    alert("There is no data available to export.");
    return;
  }

  const csv = [
    Object.keys(rows[0]).join(","),
    ...rows.map((row) =>
      Object.values(row)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

function LocationSelect({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-[180px]">
      <MapPin
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#425779]"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full appearance-none rounded-lg border border-[#E8EDF5] bg-white pl-8 pr-8 text-xs font-medium text-[#253858] shadow-sm outline-none focus:border-blue-400"
      >
        <option value="">Select location</option>
        <option value="Pharmacy">Pharmacy</option>
        <option value="Main Branch">Main Branch</option>
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#253858]"
      />
    </div>
  );
}

function ExportToolbar({ color, rows, filename, onColumns, onPdf }) {
  const isOrange = color === "orange";

  const buttonClass = `inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-105 ${
    isOrange ? "bg-[#FF711A]" : "bg-[#1475F8]"
  }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => exportRows(rows, filename)}
        className={buttonClass}
      >
        <FileText size={15} />
        Export CSV
      </button>

      <button
        type="button"
        onClick={() => exportRows(rows, filename.replace(".csv", ".xls"))}
        className={buttonClass}
      >
        <FileSpreadsheet size={15} />
        Export Excel
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className={buttonClass}
      >
        <Printer size={15} />
        Print
      </button>

      <button
        type="button"
        onClick={onColumns}
        className={buttonClass}
      >
        <Columns3 size={15} />
        Column visibility
      </button>

      <button
        type="button"
        onClick={onPdf}
        className={buttonClass}
      >
        <FileDown size={15} />
        Export PDF
      </button>
    </div>
  );
}

function Pagination({ count, page, setPage, color }) {
  const pages = Math.max(1, Math.ceil(count / 5));
  const activeClass =
    color === "orange"
      ? "bg-[#FF711A]"
      : "bg-[#1475F8]";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-[#647DA0]">
      <span>
        Showing {count ? (page - 1) * 5 + 1 : 0} to{" "}
        {Math.min(page * 5, count)} of {count} entries
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="flex h-8 items-center gap-1 rounded-lg border border-[#DFE7F2] bg-white px-2.5 text-[#8A9BB8] disabled:opacity-60"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        {count > 0 && (
          <button
            type="button"
            className={`h-8 min-w-8 rounded-lg px-2.5 font-bold text-white ${activeClass}`}
          >
            {page}
          </button>
        )}

        <button
          type="button"
          disabled={page >= pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          className="flex h-8 items-center gap-1 rounded-lg border border-[#DFE7F2] bg-white px-2.5 text-[#8A9BB8] disabled:opacity-60"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ type, color, title, description }) {
  const isOrange = color === "orange";

  return (
    <div className="flex min-h-[125px] flex-col items-center justify-center rounded-b-[13px] border-x border-b border-[#E9EEF6] bg-white/90 px-3 py-4 text-center">
      <div
        className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full ${
          isOrange ? "bg-[#FFF1E3]" : "bg-[#EAF3FF]"
        }`}
      >
        {type === "stock" ? (
          <CirclePlus
            size={28}
            strokeWidth={1.8}
            className="text-[#FF9B45]"
          />
        ) : (
          <div className="relative">
            <ReceiptText
              size={26}
              strokeWidth={1.8}
              className={isOrange ? "text-[#FFB36B]" : "text-[#8BB9FF]"}
            />
            <X
              size={14}
              className={`absolute -bottom-1 -right-2 rounded-full text-white ${
                isOrange ? "bg-[#FF711A]" : "bg-[#1475F8]"
              }`}
            />
          </div>
        )}
      </div>

      <p className="text-[13px] font-bold text-[#152C53]">{title}</p>
      <p className="mt-1 text-[11px] text-[#6F86A8]">{description}</p>
    </div>
  );
}

function Panel({
  title,
  highlight,
  description,
  icon: Icon,
  color = "orange",
  children,
  location,
  setLocation,
  onColumns,
  onPdf,
  rows = [],
  filename,
}) {
  const isOrange = color === "orange";
  const [showColumns, setShowColumns] = useState(false);

  return (
    <section
      className={`relative min-w-0 overflow-hidden rounded-2xl border bg-gradient-to-br p-3.5 shadow-[0_6px_18px_rgba(33,53,85,0.035)] ${
        isOrange
          ? "border-[#FF7D31] from-[#FFFAF5] to-white"
          : "border-[#3989FF] from-[#F2F7FF] to-white"
      }`}
    >
      {/* Decorative background waves */}
      <div
        className={`pointer-events-none absolute -right-8 top-16 h-24 w-28 rounded-full opacity-40 blur-2xl ${
          isOrange ? "bg-[#FFD5B1]" : "bg-[#B9D6FF]"
        }`}
      />

      <div className="relative z-10">
        {/* Panel header */}
        <div className="mb-3 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isOrange ? "bg-[#FFE9D9]" : "bg-[#FFE3EA]"
              }`}
            >
              <Icon
                size={21}
                strokeWidth={2.4}
                className={isOrange ? "text-[#FF4C24]" : "text-[#FF315E]"}
              />
            </div>

            <div className="min-w-0">
              <h2 className="app-section-title flex flex-wrap items-center gap-1 text-[#10264D]">
                {title}
                <span className={isOrange ? "text-[#FF6814]" : "text-[#1475F8]"}>
                  {highlight}
                </span>
                <Info size={14} className="ml-1 text-[#0BB9E9]" />
              </h2>
              <p className="app-description mt-1 text-[#627C9E]">
                {description}
              </p>
            </div>
          </div>

          <LocationSelect value={location} onChange={setLocation} />
        </div>

        {/* Export toolbar */}
        <div className="mb-3">
          <ExportToolbar
            color={color}
            rows={rows}
            filename={filename}
            onColumns={() => setShowColumns(!showColumns)}
            onPdf={onPdf}
          />
        </div>

        {showColumns && (
          <div className="mb-3 rounded-xl border border-[#E3EAF4] bg-white p-2.5 text-[11px] text-[#526986]">
            <p className="font-semibold">Column visibility</p>
            <p className="mt-1">
              All available columns are currently displayed.
            </p>
            <button
              type="button"
              onClick={() => setShowColumns(false)}
              className="mt-2 font-semibold text-blue-600"
            >
              Done
            </button>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}

function DataTable({ columns, rows, color, empty, rowKey }) {
  const [page, setPage] = useState(1);
  const pageRows = rows.slice((page - 1) * 5, page * 5);

  return (
    <>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full min-w-[460px] border-collapse text-left">
          <thead>
            <tr className={color === "orange" ? "bg-[#FFF4E9]" : "bg-[#EEF5FF]"}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="app-table-heading whitespace-nowrap border border-[#E9EEF5] px-2.5 py-2.5 text-[#142B50]"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageRows.map((row, index) => (
              <tr
                key={rowKey ? row[rowKey] : index}
                className="bg-white/90 transition hover:bg-[#FAFCFF]"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="app-table-cell whitespace-nowrap border border-[#E9EEF5] px-2.5 py-2.5 text-[#29466E]"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <EmptyState
            type={empty.type}
            color={color}
            title={empty.title}
            description={empty.description}
          />
        )}
      </div>

      <Pagination
        count={rows.length}
        page={page}
        setPage={setPage}
        color={color}
      />
    </>
  );
}

export default function Sales({ onAddPayment }) {
  const [salesLocation, setSalesLocation] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [stockLocation, setStockLocation] = useState("");
  const [ordersLocation, setOrdersLocation] = useState("");
  const [paymentItem, setPaymentItem] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("300");
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");

  const [payments, setPayments] = useState(purchasePayments);

  const filteredStock = useMemo(
    () =>
      stockItems.filter(
        (item) => !stockLocation || item.location === stockLocation
      ),
    [stockLocation]
  );

  const filteredPayments = useMemo(
    () =>
      payments.filter(
        (item) => !purchaseLocation || item.location === purchaseLocation || !item.location
      ),
    [payments, purchaseLocation]
  );

  const filteredOrders = salesOrders.filter((order) =>
    Object.values(order).some((value) =>
      String(value).toLowerCase().includes(orderSearch.toLowerCase())
    )
  );

  const handlePayment = () => {
    if (!paymentAmount || Number(paymentAmount) <= 0) return;

    setPayments((current) =>
      current.filter((item) => item.reference !== paymentItem.reference)
    );
    setPaymentSaved(true);
    setPaymentItem(null);
  };

  const pdfNotice = () =>
    alert("Connect a PDF generation library to export this report as PDF.");

  return (
    <main className="bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="grid grid-cols-1 items-stretch gap-3 xl:grid-cols-2">
        {/* 1. Sales Payment Due */}
        <Panel
          title="Sales Payment"
          highlight="Due"
          description="Customers with pending sales payments."
          icon={AlertTriangle}
          color="orange"
          location={salesLocation}
          setLocation={setSalesLocation}
          rows={salesPayments}
          filename="sales-payments.csv"
          onPdf={pdfNotice}
        >
          <DataTable
            color="orange"
            rows={salesPayments}
            columns={[
              { key: "customer", label: "CUSTOMER" },
              { key: "invoice", label: "INVOICE NO." },
              { key: "amount", label: "DUE AMOUNT" },
              { key: "action", label: "ACTION" },
            ]}
            empty={{
              type: "payment",
              title: "No data available in table",
              description: "There are no pending sales payments at the moment.",
            }}
          />
        </Panel>

        {/* 2. Purchase Payment Due */}
        <Panel
          title="Purchase Payment"
          highlight="Due"
          description="Suppliers with pending purchase payments."
          icon={AlertTriangle}
          color="blue"
          location={purchaseLocation}
          setLocation={setPurchaseLocation}
          rows={filteredPayments}
          filename="purchase-payments.csv"
          onPdf={pdfNotice}
        >
          <DataTable
            color="blue"
            rows={filteredPayments}
            rowKey="reference"
            columns={[
              { key: "supplier", label: "SUPPLIER" },
              {
                key: "reference",
                label: "REFERENCE NO.",
                render: (row) => (
                  <span className="font-medium text-[#1475F8]">
                    {row.reference}
                  </span>
                ),
              },
              {
                key: "amount",
                label: "DUE AMOUNT",
                render: (row) => `₹ ${Number(row.amount).toFixed(2)}`,
              },
              {
                key: "action",
                label: "ACTION",
                render: (row) => (
                  <button
                    type="button"
                    onClick={() => {
                      if (onAddPayment) {
                        onAddPayment(row);
                        return;
                      }
                      setPaymentItem(row);
                      setPaymentAmount(String(row.amount));
                    }}
                    className="inline-flex items-center gap-2 rounded-[10px] border border-[#39D8BC] bg-[#F4FFFC] px-3 py-2 font-semibold text-[#12B99D] hover:bg-[#E4FFF8]"
                  >
                    <Wallet size={15} />
                    Add payment
                  </button>
                ),
              },
            ]}
            empty={{
              type: "payment",
              title: "No data available in table",
              description: "There are no pending purchase payments at the moment.",
            }}
          />
        </Panel>

        {/* 3. Product Stock Alert */}
        <Panel
          title="Product Stock"
          highlight="Alert"
          description="Low stock products that need attention."
          icon={CircleAlert}
          color="orange"
          location={stockLocation}
          setLocation={setStockLocation}
          rows={filteredStock}
          filename="stock-alerts.csv"
          onPdf={pdfNotice}
        >
          <DataTable
            color="orange"
            rows={filteredStock}
            rowKey="product"
            columns={[
              {
                key: "product",
                label: "PRODUCT",
                render: (row) => (
                  <span className="inline-flex items-center gap-2">
                    {row.low && (
                      <CircleAlert
                        size={23}
                        fill="#FF4B2D"
                        className="shrink-0 text-white"
                      />
                    )}
                    {row.product}
                  </span>
                ),
              },
              { key: "location", label: "LOCATION" },
              {
                key: "stock",
                label: "CURRENT STOCK",
                render: (row) => (
                  <span className={row.low ? "font-bold text-red-500" : ""}>
                    {row.stock}
                  </span>
                ),
              },
            ]}
            empty={{
              type: "stock",
              title: "No stock alerts",
              description: "All products are sufficiently stocked.",
            }}
          />
        </Panel>

        {/* 4. Sales Order */}
        <Panel
          title="Sales Order"
          description="Manage and view all sales orders."
          icon={FileText}
          color="blue"
          location={ordersLocation}
          setLocation={setOrdersLocation}
          rows={filteredOrders}
          filename="sales-orders.csv"
          onPdf={pdfNotice}
        >
          <div className="mb-2 flex h-9 max-w-[255px] items-center gap-2 rounded-lg border border-[#E0E9F5] bg-white px-3">
            <Search size={16} className="shrink-0 text-[#54719A]" />
            <input
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full bg-transparent text-[13px] text-[#19365F] outline-none placeholder:text-[#8397B6]"
            />
          </div>

          <DataTable
            color="blue"
            rows={filteredOrders}
            columns={[
              { key: "action", label: "ACTION" },
              {
                key: "date",
                label: "DATE ↕",
                render: (row) => row.date,
              },
              { key: "orderNo", label: "ORDER NO. ↕" },
              { key: "customer", label: "CUSTOMER NAME ↕" },
              { key: "contact", label: "CONTACT NUMBER ↕" },
            ]}
            empty={{
              type: "order",
              title: "No sales orders found",
              description: "There are no sales orders at the moment.",
            }}
          />
        </Panel>
      </div>

      {/* Add Payment Modal */}
      {paymentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#12284A]/40 p-4"
          onClick={() => setPaymentItem(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="payment-title"
                className="text-xl font-bold text-[#142B50]"
              >
                Add Purchase Payment
              </h2>
              <button
                type="button"
                onClick={() => setPaymentItem(null)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mb-4 text-sm text-[#637B99]">
              Supplier:{" "}
              <strong className="text-[#142B50]">
                {paymentItem.supplier}
              </strong>
            </p>
            <p className="mb-4 text-sm text-[#637B99]">
              Reference:{" "}
              <strong className="text-[#142B50]">
                {paymentItem.reference}
              </strong>
            </p>

            <label className="block text-sm font-semibold text-[#142B50]">
              Payment amount (₹)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#DDE6F2] px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <button
              type="button"
              onClick={handlePayment}
              className="mt-5 w-full rounded-xl bg-[#1475F8] px-4 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {paymentSaved && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-[#E8FFF5] px-5 py-3 text-sm font-semibold text-[#07966E] shadow-lg">
          Payment recorded in this session.
          <button
            type="button"
            onClick={() => setPaymentSaved(false)}
            className="ml-3 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </main>
  );
}
