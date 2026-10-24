
import { useMemo, useState } from "react";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  FileSpreadsheet,
  Printer,
  Columns3,
  FileDown,
  ArrowUpDown,
  ArrowUp,
  UsersRound,
  ShoppingCart,
  TrendingUp,
  Wallet,
  ReceiptText,
  RotateCcw,
  X,
  Download,
  UserRound,
} from "lucide-react";

const initialCustomers = [
  { id: 1, contact: "anu", purchase: 0, purchaseReturn: 0, sale: 240, saleReturn: 0, openingDue: 0, due: 240 },
  { id: 2, contact: "Demo Customer", purchase: 0, purchaseReturn: 0, sale: 187.5, saleReturn: 0, openingDue: 0, due: 187.5 },
  { id: 3, contact: "dev", purchase: 0, purchaseReturn: 0, sale: 186.25, saleReturn: 0, openingDue: 0, due: 186.25 },
  { id: 4, contact: "poorna", purchase: 0, purchaseReturn: 0, sale: 20.02, saleReturn: 0, openingDue: 0, due: 20.02 },
  { id: 5, contact: "Ramesh Kumar", purchase: 0, purchaseReturn: 0, sale: 181.5, saleReturn: 0, openingDue: 0, due: 181.5 },
  { id: 6, contact: "swathi", purchase: 0, purchaseReturn: 0, sale: 47.5, saleReturn: 0, openingDue: 0, due: 47.5 },
  { id: 7, contact: "user", purchase: 0, purchaseReturn: 0, sale: 65, saleReturn: 0, openingDue: 0, due: 65 },
  { id: 8, contact: "user", purchase: 0, purchaseReturn: 0, sale: 281.25, saleReturn: 0, openingDue: 0, due: 281.25 },
  { id: 9, contact: "Walk-In Customer", purchase: 0, purchaseReturn: 0, sale: 1059, saleReturn: 0, openingDue: 0, due: 49 },
];

const columns = [
  { key: "contact", label: "Contact", width: "180px", type: "text" },
  { key: "purchase", label: "Total Purchase", width: "150px", type: "money" },
  { key: "purchaseReturn", label: "Total Purchase Return", width: "190px", type: "money" },
  { key: "sale", label: "Total Sale", width: "135px", type: "money" },
  { key: "saleReturn", label: "Total Sell Return", width: "165px", type: "money" },
  { key: "openingDue", label: "Opening Balance Due", width: "180px", type: "money" },
  { key: "due", label: "Due", width: "125px", type: "money" },
];

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ExportButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E6EDF5] bg-white px-3 text-[11px] font-semibold text-[#526D8D] transition hover:border-[#FFD0B1] hover:bg-[#FFF6EF] hover:text-[#FF6814] active:scale-[0.98]"
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function MetricCard({ label, value, icon: Icon, accent, description }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E6EDF5] bg-white p-4 shadow-[0_4px_16px_rgba(16,35,79,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(16,35,79,0.06)]">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}14`, color: accent }}
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium text-[#71839B]">{label}</p>
        <p className="mt-1 break-words text-[19px] font-bold tracking-[-0.5px] text-[#10234F]">
          {value}
        </p>
        <p className="mt-1 text-[10px] leading-4 text-[#8796AA]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function CustomersSuppliersReports() {
  const [customers] = useState(initialCustomers);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [contactType, setContactType] = useState("all");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    key: "contact",
    direction: "asc",
  });
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );

  const filteredRows = useMemo(() => {
    const filtered = customers.filter((customer) =>
      Object.values(customer).some((value) =>
        String(value ?? "").toLowerCase().includes(search.toLowerCase())
      )
    );

    return [...filtered].sort((a, b) => {
      const first = a[sort.key] ?? "";
      const second = b[sort.key] ?? "";

      const comparison =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second), undefined, {
              numeric: true,
            });

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [customers, search, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRows.length / Number(pageSize))
  );

  const safePage = Math.min(page, pageCount);

  const pageRows = filteredRows.slice(
    (safePage - 1) * Number(pageSize),
    safePage * Number(pageSize)
  );

  const visibleTableColumns = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );

  const totals = filteredRows.reduce(
    (sum, row) => ({
      purchase: sum.purchase + row.purchase,
      purchaseReturn: sum.purchaseReturn + row.purchaseReturn,
      sale: sum.sale + row.sale,
      saleReturn: sum.saleReturn + row.saleReturn,
      openingDue: sum.openingDue + row.openingDue,
      due: sum.due + row.due,
    }),
    {
      purchase: 0,
      purchaseReturn: 0,
      sale: 0,
      saleReturn: 0,
      openingDue: 0,
      due: 0,
    }
  );

  const changeSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const exportCSV = () => {
    if (!filteredRows.length) {
      window.alert("No records available to export.");
      return;
    }

    const csv = [
      visibleTableColumns.map((column) => column.label).join(","),
      ...filteredRows.map((row) =>
        visibleTableColumns
          .map(
            (column) =>
              `"${String(row[column.key] ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "customers-suppliers-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    window.alert("Connect an Excel export library to generate .xlsx files.");
  };

  const exportPDF = () => {
    window.alert("Connect a PDF export library to generate PDF reports.");
  };

  const resetFilters = () => {
    setContactType("all");
    setSearch("");
    setPage(1);
  };

  const toggleColumn = (key) => {
    setVisibleColumns((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  return (
    <main className="min-h-screen min-w-0 flex-1 bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 sm:py-6 lg:px-7">
      {/* Header */}
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6814] to-[#FF812B] text-white shadow-[0_5px_12px_rgba(255,104,20,0.2)]">
            <UsersRound size={23} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[23px] font-bold leading-8 tracking-[-0.7px] text-[#10234F] sm:text-[27px]">
                Customers &amp; Suppliers Reports
              </h1>
              <span className="rounded-full border border-[#FBE1CE] bg-[#FFF0E5] px-2.5 py-1 text-[10px] font-semibold text-[#E96012]">
                Contact report
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-5 text-[#71839B] sm:text-[13px]">
              Review purchases, sales, returns and outstanding balances
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E6EDF5] bg-white px-4 text-[12px] font-semibold text-[#526D8D] shadow-sm transition hover:border-[#FFD0B1] hover:bg-[#FFF6EF] hover:text-[#FF6814] print:hidden"
        >
          <Printer size={16} />
          Print report
        </button>
      </header>

      {/* Filters */}
      <section className="mb-5 overflow-visible rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_4px_18px_rgba(16,35,79,0.035)] print:hidden">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((current) => !current)}
          className="flex min-h-[65px] w-full items-center gap-3 rounded-2xl px-4 text-left transition hover:bg-[#FFFCF9] sm:px-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E5] text-[#FF6814]">
            <Filter size={19} />
          </span>

          <span>
            <span className="block text-[14px] font-bold text-[#10234F]">
              Filters
            </span>
            <span className="mt-0.5 block text-[11px] text-[#8796AA]">
              Choose a contact category and refine your report
            </span>
          </span>

          <span className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8F9FB] text-[#71839B]">
            {filtersOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </span>
        </button>

        {filtersOpen && (
          <div className="grid grid-cols-1 gap-4 border-t border-[#E6EDF5] p-4 sm:grid-cols-2 sm:items-end sm:p-5">
            <label className="block text-[11px] font-semibold text-[#526D8D]">
              Contact type
              <div className="relative mt-1.5">
                <select
                  value={contactType}
                  onChange={(event) => {
                    setContactType(event.target.value);
                    setPage(1);
                  }}
                  className="h-10 w-full appearance-none rounded-xl border border-[#E6EDF5] bg-[#FFFCF9] px-3 pr-9 text-[12px] font-medium text-[#10234F] outline-none transition focus:border-[#FF9C5C] focus:ring-2 focus:ring-[#FF6814]/10"
                >
                  <option value="all">All contacts</option>
                  <option value="customer">Customers</option>
                  <option value="supplier">Suppliers</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8796AA]"
                />
              </div>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E6EDF5] bg-white px-4 text-[11px] font-semibold text-[#526D8D] transition hover:bg-[#F8F9FB]"
              >
                <RotateCcw size={14} />
                Reset filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Summary cards */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-[#FF6814]" />
          <h2 className="text-[14px] font-bold text-[#10234F]">
            Report overview
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total contacts"
            value={filteredRows.length}
            icon={UsersRound}
            accent="#FF6814"
            description="Contacts in the current report"
          />
          <MetricCard
            label="Total sales"
            value={money(totals.sale)}
            icon={TrendingUp}
            accent="#16A36A"
            description="Total sale amount"
          />
          <MetricCard
            label="Total purchases"
            value={money(totals.purchase)}
            icon={ShoppingCart}
            accent="#1475F8"
            description="Total purchase amount"
          />
          <MetricCard
            label="Outstanding due"
            value={money(totals.due)}
            icon={Wallet}
            accent="#7C62D6"
            description="Total due across listed contacts"
          />
        </div>
      </section>

      {/* Report table */}
      <section className="min-w-0 overflow-visible rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_5px_20px_rgba(16,35,79,0.035)]">
        {/* Report title */}
        <div className="flex flex-col gap-3 border-b border-[#F0F2F5] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E5] text-[#FF6814]">
              <ReceiptText size={19} />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-[#10234F]">
                Contact transactions
              </h2>
              <p className="mt-1 text-[10px] text-[#8796AA]">
                Purchases, returns and balances by contact
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-[#E6EDF5] bg-[#F8F9FB] px-3 py-1.5 text-[10px] font-semibold text-[#526D8D]">
            {filteredRows.length} records
          </span>
        </div>

        {/* Export actions */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#F0F2F5] p-3 sm:p-4 print:hidden">
          <ExportButton icon={FileText} onClick={exportCSV}>
            Export CSV
          </ExportButton>

          <ExportButton icon={FileSpreadsheet} onClick={exportExcel}>
            Export Excel
          </ExportButton>

          <ExportButton icon={FileDown} onClick={exportPDF}>
            Export PDF
          </ExportButton>

          <ExportButton icon={Printer} onClick={() => window.print()}>
            Print
          </ExportButton>
        </div>

        {/* Table toolbar */}
        <div className="flex flex-col justify-between gap-3 p-3 sm:p-4 xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex h-9 items-center gap-2 rounded-xl border border-[#E6EDF5] bg-white px-3 text-[11px] text-[#526D8D]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value);
                  setPage(1);
                }}
                className="cursor-pointer bg-transparent font-semibold text-[#10234F] outline-none"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
            </label>

            <div className="relative print:hidden">
              <ExportButton
                icon={Columns3}
                onClick={() => setColumnsOpen((current) => !current)}
              >
                Columns
                <ChevronDown size={12} />
              </ExportButton>

              {columnsOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close column visibility"
                    onClick={() => setColumnsOpen(false)}
                    className="fixed inset-0 z-20 cursor-default"
                  />

                  <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-[250px] overflow-y-auto rounded-2xl border border-[#E6EDF5] bg-white p-3 shadow-[0_12px_32px_rgba(16,35,79,0.12)]">
                    <div className="mb-3 flex items-center justify-between border-b border-[#F0F2F5] pb-3">
                      <p className="text-[12px] font-bold text-[#10234F]">
                        Column visibility
                      </p>
                      <button
                        type="button"
                        onClick={() => setColumnsOpen(false)}
                        aria-label="Close"
                        className="rounded-lg p-1 text-[#8796AA] hover:bg-[#F8F9FB]"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="mb-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleColumns(columns.map((column) => column.key))
                        }
                        className="text-[10px] font-semibold text-[#FF6814] hover:underline"
                      >
                        Select all
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisibleColumns([])}
                        className="text-[10px] font-semibold text-[#71839B] hover:underline"
                      >
                        Clear all
                      </button>
                    </div>

                    {columns.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-[11px] text-[#526D8D] transition hover:bg-[#FFFAF5]"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="h-3.5 w-3.5 accent-[#FF6814]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="relative w-full sm:max-w-[280px]">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8796AA]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search contacts..."
              className="h-10 w-full rounded-xl border border-[#E6EDF5] bg-[#FFFCF9] pl-9 pr-3 text-[11px] text-[#10234F] outline-none transition placeholder:text-[#A0ADBD] focus:border-[#FF9C5C] focus:ring-2 focus:ring-[#FF6814]/10"
            />
          </div>
        </div>

        {/* Data table */}
        <div className="mx-3 overflow-x-auto rounded-xl border border-[#E6EDF5] sm:mx-4">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="bg-[#FFFAF5]">
                {visibleTableColumns.map((column) => (
                  <th
                    key={column.key}
                    style={{ width: column.width }}
                    className="border-b border-[#E6EDF5] px-3 py-3.5 text-[11px] font-bold text-[#526D8D]"
                  >
                    <button
                      type="button"
                      onClick={() => changeSort(column.key)}
                      className="flex w-full items-center justify-between gap-2 text-left transition hover:text-[#FF6814]"
                    >
                      {column.label}
                      <ArrowUpDown
                        size={13}
                        className={
                          sort.key === column.key
                            ? "shrink-0 text-[#FF6814]"
                            : "shrink-0 text-[#B0BBC9]"
                        }
                      />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={Math.max(visibleTableColumns.length, 1)}
                    className="px-4 py-14 text-center"
                  >
                    <div className="mx-auto flex max-w-xs flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E5] text-[#FF6814]">
                        <UsersRound size={23} />
                      </div>
                      <p className="mt-3 text-[13px] font-semibold text-[#10234F]">
                        No contacts found
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-[#8796AA]">
                        Try another search term or clear the current search.
                      </p>
                      {search && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setPage(1);
                          }}
                          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#FF6814] hover:underline"
                        >
                          <RotateCcw size={13} />
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition odd:bg-white even:bg-[#FCFCFD] hover:bg-[#FFF7F1]"
                  >
                    {visibleTableColumns.map((column) => (
                      <td
                        key={column.key}
                        className="border-b border-r border-[#F0F2F5] px-3 py-3 text-[11px] last:border-r-0"
                      >
                        {column.key === "contact" ? (
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0E5] text-[#FF6814]">
                              <UserRound size={15} />
                            </span>
                            <span className="font-semibold text-[#10234F]">
                              {row.contact}
                            </span>
                          </div>
                        ) : (
                          <span
                            className={`whitespace-nowrap tabular-nums ${
                              column.key === "due"
                                ? "font-bold text-[#E96012]"
                                : "font-medium text-[#526D8D]"
                            }`}
                          >
                            {money(row[column.key])}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}

              <tr className="bg-[#F8F9FB]">
                {visibleTableColumns.map((column, index) => (
                  <td
                    key={column.key}
                    className="border-r border-[#E6EDF5] px-3 py-3 text-[11px] last:border-r-0"
                  >
                    {index === 0 ? (
                      <span className="font-bold text-[#10234F]">Total</span>
                    ) : (
                      <span className="whitespace-nowrap font-bold tabular-nums text-[#10234F]">
                        {money(totals[column.key])}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
          <p className="text-[11px] leading-5 text-[#71839B]">
            Showing{" "}
            {filteredRows.length
              ? (safePage - 1) * Number(pageSize) + 1
              : 0}{" "}
            to {Math.min(safePage * Number(pageSize), filteredRows.length)} of{" "}
            <span className="font-semibold text-[#10234F]">
              {filteredRows.length}
            </span>{" "}
            entries
          </p>

          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#E6EDF5] bg-white px-3 text-[11px] font-semibold text-[#526D8D] transition hover:border-[#FFD0B1] hover:text-[#FF6814] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronUp size={13} className="-rotate-90" />
              Previous
            </button>

            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-3 text-[11px] font-bold text-white shadow-sm">
              {safePage}
            </span>

            <span className="px-1 text-[10px] text-[#8796AA]">
              of {pageCount}
            </span>

            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#E6EDF5] bg-white px-3 text-[11px] font-semibold text-[#526D8D] transition hover:border-[#FFD0B1] hover:text-[#FF6814] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronDown size={13} className="-rotate-90" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative -mx-3 mt-6 border-t border-[#E6EDF5] bg-white px-4 pb-5 pt-5 sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7 print:hidden">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-[11px] font-semibold text-[#526D8D]">
            Billomax
            <span className="mx-1.5 text-[#FF6814]">·</span>
            Your Trusted Partner in Billing &amp; Invoicing
          </p>
          <p className="text-[10px] leading-5 text-[#8796AA]">
            V6.3 | Copyright © 2026 All rights reserved.
          </p>
        </div>
      </footer>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-[0_5px_14px_rgba(255,104,20,0.25)] transition hover:-translate-y-0.5 hover:brightness-105 print:hidden"
      >
        <ArrowUp size={21} strokeWidth={2.5} />
      </button>
    </main>
  );
}
