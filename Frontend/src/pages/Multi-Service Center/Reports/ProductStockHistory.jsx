
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  ChevronDown,
  Download,
  Printer,
  Columns3,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

const INITIAL_PRODUCT = "Dolo 650 - 0001";
const INITIAL_LOCATION = "Pharmacy (BL0001)";

const stockTransactions = [
  { type: "Sell", change: -1, quantity: 7, date: "22/10/2026 11:00", reference: "0041", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 8, date: "01/10/2026 17:00", reference: "0040", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 9, date: "24/09/2026 15:43", reference: "0039", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 10, date: "17/09/2026 13:07", reference: "0038", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 11, date: "06/07/2026 12:15", reference: "0035", party: "Demo Customer" },
  { type: "Sell", change: -4, quantity: 21, date: "29/06/2026 15:47", reference: "0034", party: "Demo Customer" },
  { type: "Sell", change: -3, quantity: 25, date: "26/06/2026 11:19", reference: "0031", party: "user" },
  { type: "Sell", change: -16, quantity: 28, date: "17/06/2026 16:49", reference: "0030", party: "anu" },
  { type: "Sell", change: -1, quantity: 44, date: "25/05/2026 15:02", reference: "0026", party: "Walk-In Customer" },
  { type: "Sell", change: -3, quantity: 45, date: "18/04/2026 11:49", reference: "0021", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 48, date: "27/03/2026 12:01", reference: "0020", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 49, date: "23/03/2026 17:35", reference: "0017", party: "Walk-In Customer" },
  { type: "Sell", change: -3, quantity: 50, date: "17/03/2026 16:29", reference: "0016", party: "Walk-In Customer" },
  { type: "Sell", change: -4, quantity: 53, date: "17/03/2026 16:21", reference: "0015", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 57, date: "17/03/2026 16:19", reference: "0014", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 58, date: "11/03/2026 16:17", reference: "0013", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 59, date: "10/11/2025 15:16", reference: "0012", party: "Walk-In Customer" },
  { type: "Opening Stock", change: 60, quantity: 60, date: "01/01/2025 15:16", reference: "", party: "--" },
];

const extraTransactions = [
  { type: "Sell", change: -2, quantity: 17, date: "04/08/2026 10:33", reference: "0032", party: "Demo Customer" },
  { type: "Sell", change: -2, quantity: 19, date: "24/07/2026 15:08", reference: "0041", party: "swathi" },
  { type: "Sell", change: -1, quantity: 20, date: "08/07/2026 11:35", reference: "0038", party: "dev" },
  { type: "Sell", change: -3, quantity: 16, date: "18/06/2026 16:49", reference: "0030", party: "anu" },
  { type: "Sell", change: -1, quantity: 44, date: "25/05/2026 15:02", reference: "0026", party: "Walk-In Customer" },
  { type: "Sell", change: -1, quantity: 49, date: "23/03/2026 17:35", reference: "0017", party: "Walk-In Customer" },
];

const columns = [
  { key: "type", label: "Type" },
  { key: "change", label: "Quantity change" },
  { key: "quantity", label: "New Quantity" },
  { key: "date", label: "Date" },
  { key: "reference", label: "Reference No" },
  { key: "party", label: "Customer/Supplier information" },
];

const money = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E6EDF5] bg-white p-5 shadow-[0_8px_24px_rgba(16,35,79,0.06)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function Metric({ label, value, icon: Icon, color = "orange", helper }) {
  const colors = {
    orange: "bg-orange-50 text-[#FF6814]",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-xl border border-[#E8EDF4] bg-white p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={19} />
        </div>
        <p className="text-sm font-medium text-[#65728A]">{label}</p>
      </div>
      <p className="mt-3 text-lg font-bold text-[#10234F]">{value}</p>
      {helper && <p className="mt-1 text-xs text-[#7D899B]">{helper}</p>}
    </div>
  );
}

function downloadCsv(rows, filename) {
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map((row) => row.map(escape).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ProductStockHistory({ productRecord, onBack }) {
  const initialProduct = productRecord
    ? `${productRecord.product} - ${productRecord.sku}`
    : INITIAL_PRODUCT;
  const initialLocation =
    productRecord?.location && productRecord.location !== "Pharmacy"
      ? productRecord.location
      : INITIAL_LOCATION;
  const [product, setProduct] = useState(initialProduct);
  const [location, setLocation] = useState(initialLocation);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(columns.map((c) => c.key));
  const [showColumns, setShowColumns] = useState(false);
  const [sort, setSort] = useState({ key: "date", direction: "desc" });

  // The screenshot shows 24 transactions. Only 18 transaction details are
  // fully legible across the screenshots, so the displayed records are kept
  // as supplied rather than fabricating missing transaction values.
  const allTransactions = useMemo(() => {
    const combined = [...stockTransactions];
    for (const item of extraTransactions) {
      if (!combined.some((row) => row.date === item.date && row.reference === item.reference && row.party === item.party)) {
        combined.push(item);
      }
    }
    return combined;
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    const result = allTransactions.filter((row) =>
      [row.type, row.change, row.quantity, row.date, row.reference, row.party]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );

    return result.sort((a, b) => {
      const left = a[sort.key];
      const right = b[sort.key];
      let comparison;

      if (typeof left === "number" && typeof right === "number") {
        comparison = left - right;
      } else {
        comparison = String(left ?? "").localeCompare(String(right ?? ""));
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [allTransactions, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changeSort = (key) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const toggleColumn = (key) => {
    setVisibleColumns((previous) =>
      previous.includes(key)
        ? previous.filter((column) => column !== key)
        : [...previous, key]
    );
  };

  const handleExport = () => {
    const headers = columns
      .filter((column) => visibleColumns.includes(column.key))
      .map((column) => column.label);

    const rows = filtered.map((row) =>
      columns
        .filter((column) => visibleColumns.includes(column.key))
        .map((column) =>
          column.key === "change"
            ? `${row.change > 0 ? "+" : ""}${row.change.toFixed(2)}`
            : column.key === "quantity"
              ? row.quantity.toFixed(2)
              : row[column.key]
        )
    );

    downloadCsv([headers, ...rows], "product-stock-history.csv");
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] p-4 text-[#10234F] sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6814]">
              Inventory Management
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Product Stock History
            </h1>
            <p className="mt-1 text-sm text-[#65728A]">
              Review stock movement, quantities in and out, and transaction references.
            </p>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-[#D7DFEA] bg-white px-4 py-2.5 text-sm font-semibold text-[#10234F] transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Stock Report
            </button>
          )}
        </header>

        <Panel>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#FF6814]">
                {productRecord?.product || product.replace(/ - .*$/, "")}
              </h2>
              <p className="mt-1 text-xs text-[#65728A]">
                Product and business location
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold">
              Product
              <div className="relative">
                <select
                  value={product}
                  onChange={(event) => setProduct(event.target.value)}
                  className="mt-2 w-full appearance-none rounded-lg border border-[#D7DFEA] bg-white px-3 py-3 pr-10 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Dolo 650 - 0001</option>
                  <option>Amoxicillin - 0038</option>
                  <option>Azithromycin - 0039</option>
                  <option>Sertraline (Zoloft) - 0040</option>
                  <option>Fluoxetine (Prozac) - 0041</option>
                  {![
                    "Dolo 650 - 0001",
                    "Amoxicillin - 0038",
                    "Azithromycin - 0039",
                    "Sertraline (Zoloft) - 0040",
                    "Fluoxetine (Prozac) - 0041",
                  ].includes(product) && <option>{product}</option>}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-5 text-slate-400" />
              </div>
            </label>

            <label className="block text-sm font-semibold md:max-w-sm">
              Business Location
              <div className="relative">
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="mt-2 w-full appearance-none rounded-lg border border-[#D7DFEA] bg-white px-3 py-3 pr-10 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Pharmacy (BL0001)</option>
                  {location !== "Pharmacy" &&
                    location !== "Pharmacy (BL0001)" && <option>{location}</option>}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-5 text-slate-400" />
              </div>
            </label>
          </div>
        </Panel>

        <Panel>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#10234F]">
              {product.replace(" - ", " (") + ")"}
            </h2>
            <p className="mt-1 text-sm text-[#65728A]">
              Stock movement summary · {location}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-[#E8EDF4] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <ArrowDownToLine size={17} className="text-emerald-600" />
                Quantities In
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3 border-b border-[#EEF1F5] pb-2">
                  <span>Total Purchase</span><span>0.00 Pc(s)</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-[#EEF1F5] pb-2">
                  <span>Opening Stock</span><span>60.00 Pc(s)</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-[#EEF1F5] pb-2">
                  <span>Total Sell Return</span><span>0.00 Pc(s)</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Stock Transfers (In)</span><span>0.00 Pc(s)</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E8EDF4] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <ArrowUpFromLine size={17} className="text-orange-500" />
                Quantities Out
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3 border-b border-[#EEF1F5] pb-2">
                  <span>Total Sold</span><span>53.00 Pc(s)</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-[#EEF1F5] pb-2">
                  <span>Total Stock Adjustment</span><span>0.00 Pc(s)</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-[#EEF1F5] pb-2">
                  <span>Total Purchase Return</span><span>0.00 Pc(s)</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Stock Transfers (Out)</span><span>0.00 Pc(s)</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E8EDF4] bg-gradient-to-br from-orange-50/70 to-white p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <History size={17} className="text-[#FF6814]" />
                Totals
              </h3>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">Current stock</span>
                <span className="text-lg font-extrabold text-[#FF6814]">7.00 Pc(s)</span>
              </div>
            </div>
          </div>

          <div className="my-6 border-t border-[#E6EDF5]" />

          <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#10234F]">Stock Movement History</h3>
              <p className="mt-1 text-xs text-[#65728A]">
                Transaction-by-transaction quantity changes
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg border border-[#D7DFEA] bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <Download size={15} /> Export CSV
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg border border-[#D7DFEA] bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <FileSpreadsheet size={15} /> Export Excel
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg border border-[#D7DFEA] bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <Printer size={15} /> Print
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowColumns((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#D7DFEA] bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  <Columns3 size={15} /> Column visibility
                </button>

                {showColumns && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-xl">
                    {columns.map((column) => (
                      <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="accent-[#1680FF]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg border border-[#D7DFEA] bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <FileText size={15} /> Export PDF
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-[#65728A]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-[#D7DFEA] bg-white px-3 py-2 text-sm text-[#10234F] outline-none focus:border-blue-500"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              entries
            </label>

            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search stock history..."
                className="w-full rounded-lg border border-[#D7DFEA] py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E8EDF4]">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-[#F5F8FC]">
                <tr>
                  {columns.filter((column) => visibleColumns.includes(column.key)).map((column) => (
                    <th key={column.key} className="border-b border-[#E6EDF5] px-4 py-3 font-bold text-[#10234F]">
                      <button onClick={() => changeSort(column.key)} className="inline-flex items-center gap-2 text-left">
                        {column.label}
                        <span className="text-xs text-slate-400">
                          {sort.key === column.key ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length ? visibleRows.map((row, index) => (
                  <tr key={`${row.date}-${row.reference}-${index}`} className="border-b border-[#EEF1F5] last:border-0 hover:bg-orange-50/30">
                    {columns.filter((column) => visibleColumns.includes(column.key)).map((column) => {
                      const value = row[column.key];
                      return (
                        <td key={column.key} className="px-4 py-3 text-[#334155]">
                          {column.key === "change" ? (
                            <span className={value < 0 ? "font-semibold text-rose-500" : "font-semibold text-emerald-600"}>
                              {value > 0 ? "+" : ""}{value.toFixed(2)}
                            </span>
                          ) : column.key === "quantity" ? (
                            value.toFixed(2)
                          ) : (
                            value || "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={visibleColumns.length} className="px-4 py-10 text-center text-sm text-[#65728A]">
                      No stock transactions match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#65728A]">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="rounded-lg border border-[#D7DFEA] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="rounded-lg bg-[#1680FF] px-4 py-2 text-sm font-semibold text-white">
                {currentPage}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                className="rounded-lg border border-[#D7DFEA] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </Panel>

        <footer className="pb-2 pt-1 text-center text-xs text-[#7A8799]">
          Billomax · Inventory Management
        </footer>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          button, input, select, footer { display: none !important; }
          main { padding: 0 !important; background: white !important; }
          section { box-shadow: none !important; break-inside: avoid; }
        }
      `}</style>
    </main>
  );
}
