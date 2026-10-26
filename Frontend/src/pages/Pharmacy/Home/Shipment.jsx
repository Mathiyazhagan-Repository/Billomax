
import { useMemo, useState } from "react";
import {
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  Printer,
  Columns2,
  FileDown,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Plus,
  Pill,
  UserRound,
  TriangleAlert,
  ArrowUp,
  Eye,
  PackageCheck,
  X,
} from "lucide-react";

const initialShipments = [
  {
    id: 1,
    date: "17/10/2024 10:18",
    invoice: "0004",
    customer: "Walk-In Customer",
    contact: "",
    location: "Pharmacy",
    shippingStatus: "Shipped",
    paymentStatus: "Paid",
  },
];

function exportCSV(rows) {
  if (!rows.length) {
    alert("No shipment data available to export.");
    return;
  }

  const headers = [
    "Date",
    "Invoice No.",
    "Customer Name",
    "Contact Number",
    "Location",
    "Shipping Status",
    "Payment Status",
  ];

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.date,
        row.invoice,
        row.customer,
        row.contact,
        row.location,
        row.shippingStatus,
        row.paymentStatus,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "pending-shipments.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function LocationSelect({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-[190px]">
      <MapPin
        size={20}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#304A6F]"
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full appearance-none rounded-lg border border-[#E2E9F2] bg-white pl-9 pr-8 text-xs font-semibold text-[#364D69] outline-none transition focus:border-orange-400"
      >
        <option value="">Select location</option>
        <option value="Pharmacy">Pharmacy</option>
        <option value="Main Branch">Main Branch</option>
      </select>

      <ChevronDown
        size={19}
        className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#304A6F]"
      />
    </div>
  );
}

function ExportButton({ icon: Icon, children, onClick, color = "orange" }) {
  const colors =
    color === "orange"
      ? "bg-[#FF7424] hover:bg-[#F16A1E]"
      : "bg-[#3084F9] hover:bg-[#2174E8]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[11px] font-semibold text-white shadow-sm transition ${colors}`}
    >
      <Icon size={15} strokeWidth={2.5} />
      {children}
    </button>
  );
}

function Pagination({ total, page, setPage }) {
  const pageCount = Math.max(1, Math.ceil(total / 5));

  return (
    <div className="mt-3 flex flex-col items-start gap-2">
      <p className="text-xs font-medium text-[#2F4A6F]">
        Showing {total ? (page - 1) * 5 + 1 : 0} to{" "}
        {Math.min(page * 5, total)} of {total} entries
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="flex h-8 items-center gap-1 rounded-lg border border-[#E0E7F0] bg-white px-3 text-[11px] font-semibold text-[#98AAC4] transition hover:bg-[#F8FAFD] disabled:opacity-70"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        {total > 0 && (
          <button
            type="button"
            className="h-8 min-w-8 rounded-lg bg-[#FF7424] px-3 text-xs font-semibold text-white"
          >
            {page}
          </button>
        )}

        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          className="flex h-8 items-center gap-1 rounded-lg border border-[#E0E7F0] bg-white px-3 text-[11px] font-semibold text-[#98AAC4] transition hover:bg-[#F8FAFD] disabled:opacity-70"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ type, value }) {
  const isPaid = type === "payment";
  const isShipped = value === "Shipped";

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] px-3 py-2 text-[13px] font-semibold ${
        isPaid
          ? "bg-[#A3F9AC] text-[#087D2B]"
          : isShipped
            ? "bg-[#2A4D73] text-white"
            : "bg-[#FFF0CF] text-[#A5741A]"
      }`}
    >
      {isPaid ? (
        <CheckCircle2 size={17} fill="#16863C" className="text-white" />
      ) : (
        <Truck size={17} />
      )}
      {value}
    </span>
  );
}

function ShipmentModal({ shipment, onClose, onUpdate }) {
  const [status, setStatus] = useState(shipment.shippingStatus);

  if (!shipment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#293E5C]/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shipment-dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3
            id="shipment-dialog-title"
            className="text-xl font-semibold text-[#293E5C]"
          >
            Shipment Details
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 text-sm text-[#62768F]">
          <p>
            Invoice:{" "}
            <strong className="text-[#2C4262]">{shipment.invoice}</strong>
          </p>
          <p>
            Customer:{" "}
            <strong className="text-[#2C4262]">{shipment.customer}</strong>
          </p>
          <p>
            Location:{" "}
            <strong className="text-[#2C4262]">{shipment.location}</strong>
          </p>
          <p>
            Payment:{" "}
            <strong className="text-[#2C4262]">{shipment.paymentStatus}</strong>
          </p>
        </div>

        <label className="mt-5 block text-sm font-semibold text-[#2C4262]">
          Shipping status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#DFE7F1] bg-white px-3 outline-none focus:border-orange-400"
          >
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            onUpdate(shipment.id, status);
            onClose();
          }}
          className="mt-5 w-full rounded-xl bg-[#FF7424] px-4 py-3 font-semibold text-white hover:bg-[#F16A1E]"
        >
          Save Status
        </button>
      </div>
    </div>
  );
}

export default function Shipment() {
  const [shipments, setShipments] = useState(initialShipments);
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "date", direction: "asc" });
  const [activeShipment, setActiveShipment] = useState(null);
  const [menuShipment, setMenuShipment] = useState(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([
    "date",
    "invoice",
    "customer",
    "contact",
    "location",
    "shippingStatus",
    "paymentStatus",
  ]);
  const [quickAction, setQuickAction] = useState("");

  const columns = [
    { key: "action", label: "ACTION" },
    { key: "date", label: "DATE" },
    { key: "invoice", label: "INVOICE NO." },
    { key: "customer", label: "CUSTOMER NAME" },
    { key: "contact", label: "CONTACT NUMBER" },
    { key: "location", label: "LOCATION" },
    { key: "shippingStatus", label: "SHIPPING STATUS" },
    { key: "paymentStatus", label: "PAYMENT STATUS" },
  ];

  const filteredShipments = useMemo(() => {
    const result = shipments.filter((shipment) => {
      const matchesLocation =
        !location || shipment.location === location;

      const matchesSearch = Object.values(shipment).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      );

      return matchesLocation && matchesSearch;
    });

    return result.sort((a, b) => {
      const first = String(a[sort.key] ?? "");
      const second = String(b[sort.key] ?? "");

      const comparison = first.localeCompare(second, undefined, {
        numeric: true,
      });

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [shipments, location, search, sort]);

  const pageRows = filteredShipments.slice((page - 1) * 5, page * 5);

  const updateStatus = (id, status) => {
    setShipments((current) =>
      current.map((shipment) =>
        shipment.id === id
          ? { ...shipment, shippingStatus: status }
          : shipment
      )
    );
  };

  const changeSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setPage(1);
  };

  return (
    <main className="space-y-4 bg-[#FFFAF5] px-4 py-4 font-sans sm:px-5">
      {/* Pending Shipments */}
      <section className="relative rounded-2xl border border-[#FF9656]/50 bg-gradient-to-br from-[#FFFAF5] to-white p-3.5 shadow-[0_6px_18px_rgba(235,127,51,0.06)]">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFEBDD]">
              <Truck
                size={22}
                strokeWidth={2.5}
                className="text-[#FF8225]"
              />
            </div>

            <h1 className="app-section-title text-[#284062]">
              Pending <span className="text-[#FF7424]">Shipments</span>
            </h1>
          </div>

          <LocationSelect value={location} onChange={(value) => {
            setLocation(value);
            setPage(1);
          }} />
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            <ExportButton
              icon={FileText}
              onClick={() => exportCSV(filteredShipments)}
            >
              Export CSV
            </ExportButton>

            <ExportButton
              icon={FileSpreadsheet}
              onClick={() => alert("Connect an Excel export library for .xlsx files.")}
            >
              Export Excel
            </ExportButton>

            <ExportButton icon={Printer} onClick={() => window.print()}>
              Print
            </ExportButton>

            <div className="relative">
              <ExportButton
                icon={Columns2}
                onClick={() => setColumnsOpen((value) => !value)}
              >
                Column visibility
              </ExportButton>

              {columnsOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-64 overflow-y-auto rounded-xl border border-[#E3E9F1] bg-white p-3 shadow-xl">
                  <p className="mb-2 text-sm font-semibold text-[#2C4262]">
                    Show columns
                  </p>

                  {columns
                    .filter((column) => column.key !== "action")
                    .map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-[#485D77] hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() =>
                            setVisibleColumns((current) =>
                              current.includes(column.key)
                                ? current.filter((key) => key !== column.key)
                                : [...current, column.key]
                            )
                          }
                          className="accent-orange-500"
                        />
                        {column.label}
                      </label>
                    ))}
                </div>
              )}
            </div>

            <ExportButton
              icon={FileDown}
              onClick={() => alert("Connect a PDF library to generate PDF reports.")}
            >
              Export PDF
            </ExportButton>
          </div>

          <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-[#DFE7F1] bg-white px-3 lg:max-w-[250px]">
            <Search size={17} className="shrink-0 text-[#304A6F]" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search ..."
              className="w-full bg-transparent text-xs text-[#324A6C] outline-none placeholder:text-[#8CA0BA]"
            />
          </div>
        </div>

        {/* Shipments table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-[#E3E9F0]">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="bg-[#FFF5EA]">
                {columns
                  .filter(
                    (column) =>
                      column.key === "action" ||
                      visibleColumns.includes(column.key)
                  )
                  .map((column) => (
                    <th
                      key={column.key}
                      className="app-table-heading whitespace-nowrap border-r border-[#E9E9E9] px-3 py-3 text-[#2F4664] last:border-r-0"
                    >
                      {column.key === "action" ? (
                        column.label
                      ) : (
                        <button
                          type="button"
                          onClick={() => changeSort(column.key)}
                          className="inline-flex items-center gap-2"
                        >
                          {column.label}
                          <ArrowUpDown
                            size={15}
                            className={
                              sort.key === column.key
                                ? "text-[#FF7F31]"
                                : "text-[#9AADC4]"
                            }
                          />
                        </button>
                      )}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {pageRows.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="bg-white/90 transition hover:bg-[#FFFCF7]"
                >
                  <td className="border-r border-t border-[#E9EDF3] px-3 py-3">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setMenuShipment(
                            menuShipment === shipment.id ? null : shipment.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#FF863D] px-2.5 py-1.5 text-[11px] font-semibold text-[#FF7424] hover:bg-[#FFF1E5]"
                      >
                        Actions
                        <ChevronDown size={16} />
                      </button>

                      {menuShipment === shipment.id && (
                        <div className="absolute left-0 top-full z-30 mt-2 w-44 rounded-xl border border-[#E5EAF1] bg-white p-1.5 shadow-xl">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveShipment(shipment);
                              setMenuShipment(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-[#3A506D] hover:bg-[#FFF4EA]"
                          >
                            <Eye size={15} />
                            View details
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveShipment(shipment);
                              setMenuShipment(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-[#3A506D] hover:bg-[#FFF4EA]"
                          >
                            <PackageCheck size={15} />
                            Update shipment
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {visibleColumns.includes("date") && (
                    <td className="app-table-cell whitespace-nowrap border-r border-t border-[#E9EDF3] px-3 py-3 text-[#3E5879]">
                      {shipment.date.split(" ")[0]}
                      <br />
                      {shipment.date.split(" ")[1]}
                    </td>
                  )}

                  {visibleColumns.includes("invoice") && (
                    <td className="app-table-cell border-r border-t border-[#E9EDF3] px-3 py-3 text-[#3E5879]">
                      {shipment.invoice}
                    </td>
                  )}

                  {visibleColumns.includes("customer") && (
                    <td className="app-table-cell whitespace-nowrap border-r border-t border-[#E9EDF3] px-3 py-3 text-[#3E5879]">
                      {shipment.customer}
                    </td>
                  )}

                  {visibleColumns.includes("contact") && (
                    <td className="app-table-cell border-r border-t border-[#E9EDF3] px-3 py-3 text-[#3E5879]">
                      {shipment.contact || "--"}
                    </td>
                  )}

                  {visibleColumns.includes("location") && (
                    <td className="app-table-cell border-r border-t border-[#E9EDF3] px-3 py-3 text-[#3E5879]">
                      {shipment.location}
                    </td>
                  )}

                  {visibleColumns.includes("shippingStatus") && (
                    <td className="border-r border-t border-[#E9EDF3] px-3 py-3">
                      <StatusBadge
                        type="shipping"
                        value={shipment.shippingStatus}
                      />
                    </td>
                  )}

                  {visibleColumns.includes("paymentStatus") && (
                    <td className="border-t border-[#E9EDF3] px-3 py-3">
                      <StatusBadge
                        type="payment"
                        value={shipment.paymentStatus}
                      />
                    </td>
                  )}
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      columns.filter(
                        (column) =>
                          column.key === "action" ||
                          visibleColumns.includes(column.key)
                      ).length
                    }
                    className="px-4 py-7 text-center text-xs text-[#8899B1]"
                  >
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          total={filteredShipments.length}
          page={page}
          setPage={setPage}
        />
      </section>

      {/* Pharmacy Quick Actions */}
      <section className="relative overflow-hidden rounded-2xl border border-[#549FFF]/70 bg-gradient-to-br from-[#F4F9FF] to-white p-3.5 shadow-[0_6px_18px_rgba(43,120,220,0.05)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#50D7AE] to-[#36C69D] text-white">
            <Plus size={22} strokeWidth={3} />
          </div>

          <h2 className="app-section-title text-[#284062]">
            Pharmacy{" "}
            <span className="text-[#468FF6]">Quick Actions</span>
          </h2>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setQuickAction("Prescriptions")}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#438AF2] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2E7AE3]"
          >
            <Pill size={16} />
            Prescriptions
          </button>

          <button
            type="button"
            onClick={() => setQuickAction("Doctors")}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#9650F4] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#8339E8]"
          >
            <UserRound size={17} fill="currentColor" />
            Doctors
          </button>

          <button
            type="button"
            onClick={() => setQuickAction("Batch Recalls")}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#F44750] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#DF333D]"
          >
            <TriangleAlert size={16} fill="currentColor" />
            Batch Recalls
          </button>
        </div>

        {quickAction && (
          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#DFEAF8] bg-white p-4 text-sm text-[#3A5574]">
            <span>
              <strong>{quickAction}</strong> selected. Connect this action to
              the corresponding pharmacy page.
            </span>
            <button
              type="button"
              onClick={() => setQuickAction("")}
              aria-label="Dismiss"
              className="ml-3 text-[#7F92AB] hover:text-[#2E4A6E]"
            >
              <X size={17} />
            </button>
          </div>
        )}
      </section>

      {/* Scroll to top */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-[#428CF5] text-white shadow-[0_6px_18px_rgba(45,127,244,0.3)] transition hover:bg-[#2E7AE3]"
      >
        <ChevronUp size={21} strokeWidth={3} />
      </button>

      {/* Shipment details modal */}
      {activeShipment && (
        <ShipmentModal
          shipment={activeShipment}
          onClose={() => setActiveShipment(null)}
          onUpdate={updateStatus}
        />
      )}
    </main>
  );
}
