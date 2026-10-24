
import { useMemo, useState } from "react";
import {
  Filter,
  ArrowDownCircle,
  ArrowUpCircle,
  MinusCircle,
  Info,
  Search,
  FileText,
  FileSpreadsheet,
  Printer,
  Columns3,
  FileDown,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ReceiptText,
  CalendarDays,
  X,
  RotateCcw,
  Download,
} from "lucide-react";

const taxTabs = [
  { key: "input", label: "Input Tax (Purchase)", icon: ArrowDownCircle },
  { key: "output", label: "Output Tax (Sales)", icon: ArrowUpCircle },
  { key: "expense", label: "Expense Tax", icon: MinusCircle },
];

const initialRows = {
  input: [],
  output: [],
  expense: [],
};

const tableColumns = {
  input: [
    { key: "date", label: "Date" },
    { key: "reference", label: "Reference No" },
    { key: "supplier", label: "Supplier" },
    { key: "taxNumber", label: "Tax number" },
    { key: "amount", label: "Total amount" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "discount", label: "Discount" },
    { key: "gst", label: "GST" },
    { key: "cgst", label: "CGST" },
    { key: "sgst", label: "SGST" },
  ],
  output: [
    { key: "date", label: "Date" },
    { key: "reference", label: "Reference No" },
    { key: "customer", label: "Customer" },
    { key: "taxNumber", label: "Tax number" },
    { key: "amount", label: "Total amount" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "discount", label: "Discount" },
    { key: "gst", label: "GST" },
    { key: "cgst", label: "CGST" },
    { key: "sgst", label: "SGST" },
  ],
  expense: [
    { key: "date", label: "Date" },
    { key: "reference", label: "Reference No" },
    { key: "category", label: "Expense Category" },
    { key: "taxNumber", label: "Tax number" },
    { key: "amount", label: "Total amount" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "discount", label: "Discount" },
    { key: "gst", label: "GST" },
    { key: "cgst", label: "CGST" },
    { key: "sgst", label: "SGST" },
  ],
};

const money = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function InfoIcon({ text }) {
  return (
    <span
      title={text}
      aria-label={text}
      className="inline-flex shrink-0 cursor-help text-[#8A9AB0] transition hover:text-[#FF6814]"
    >
      <Info size={15} />
    </span>
  );
}

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

export default function TaxReport() {
  const [activeTab, setActiveTab] = useState("input");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    key: "date",
    direction: "asc",
  });
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    tableColumns.input.map((column) => column.key)
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  // Connect these values to your tax report API when available.
  const [rowsByTab] = useState(initialRows);

  const rows = rowsByTab[activeTab] || [];
  const columns = tableColumns[activeTab];

  const visibleTableColumns = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );

  const filteredRows = useMemo(() => {
    const filtered = rows.filter((row) => {
      const matchesSearch = Object.values(row).some((value) =>
        String(value ?? "").toLowerCase().includes(search.toLowerCase())
      );

      const matchesStart =
        !appliedStartDate || !row.date || row.date >= appliedStartDate;

      const matchesEnd =
        !appliedEndDate || !row.date || row.date <= appliedEndDate;

      return matchesSearch && matchesStart && matchesEnd;
    });

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
  }, [rows, search, appliedStartDate, appliedEndDate, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRows.length / Number(pageSize))
  );

  const safePage = Math.min(page, pageCount);

  const pageRows = filteredRows.slice(
    (safePage - 1) * Number(pageSize),
    safePage * Number(pageSize)
  );

  const totalAmount = filteredRows.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );

  const totalGst = filteredRows.reduce(
    (sum, row) => sum + Number(row.gst || 0),
    0
  );
  const totalCgst = filteredRows.reduce(
    (sum, row) => sum + Number(row.cgst || 0),
    0
  );
  const totalSgst = filteredRows.reduce(
    (sum, row) => sum + Number(row.sgst || 0),
    0
  );

  const changeTab = (key) => {
    setActiveTab(key);
    setVisibleColumns(tableColumns[key].map((column) => column.key));
    setPage(1);
    setSearch("");
    setSort({ key: "date", direction: "asc" });
    setColumnsOpen(false);
  };

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
      window.alert("No tax records available to export.");
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
    link.download = `tax-report-${activeTab}.csv`;
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

  const applyFilters = () => {
    if (startDate && endDate && startDate > endDate) {
      window.alert("End date must be on or after the start date.");
      return;
    }

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setPage(1);
    setFiltersOpen(false);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setAppliedStartDate("");
    setAppliedEndDate("");
    setSearch("");
    setPage(1);
  };

  const activeTabLabel =
    taxTabs.find((tab) => tab.key === activeTab)?.label || "Input Tax";

  const hasActiveDateFilter = Boolean(appliedStartDate || appliedEndDate);

  return (
    <main className="min-h-screen min-w-0 flex-1 bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 sm:py-6 lg:px-7">
      {/* Page header */}
      <header className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6814] to-[#FF812B] text-white shadow-[0_5px_12px_rgba(255,104,20,0.2)]">
            <ReceiptText size={23} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[24px] font-bold leading-8 tracking-[-0.7px] text-[#10234F] sm:text-[27px]">
                Tax Report
              </h1>
              <span className="rounded-full border border-[#FBE1CE] bg-[#FFF0E5] px-2.5 py-1 text-[10px] font-semibold text-[#E96012]">
                Tax overview
              </span>
            </div>

            <p className="mt-1 text-[12px] leading-5 text-[#71839B] sm:text-[13px]">
              Review input tax, output tax and expense tax details
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-[#E6EDF5] bg-white px-4 text-[12px] font-semibold text-[#526D8D] shadow-sm transition hover:border-[#FFD0B1] hover:bg-[#FFF6EF] hover:text-[#FF6814]"
        >
          <Printer size={16} />
          Print report
        </button>
      </header>

      {/* Filter panel */}
      <section className="mb-5 overflow-visible rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_4px_18px_rgba(16,35,79,0.035)]">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((current) => !current)}
          className="flex min-h-[65px] w-full items-center gap-3 rounded-2xl px-4 text-left transition hover:bg-[#FFFCF9] sm:px-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E5] text-[#FF6814]">
            <Filter size={19} />
          </span>

          <span className="min-w-0">
            <span className="block text-[14px] font-bold text-[#10234F]">
              Filters
            </span>
            <span className="mt-0.5 block text-[11px] text-[#8796AA]">
              Narrow the report by transaction date
            </span>
          </span>

          {hasActiveDateFilter && (
            <span className="hidden rounded-full border border-[#FBE1CE] bg-[#FFF0E5] px-2.5 py-1 text-[10px] font-semibold text-[#E96012] sm:inline-flex">
              Date filter active
            </span>
          )}

          <span className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8F9FB] text-[#71839B]">
            {filtersOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </span>
        </button>

        {filtersOpen && (
          <div className="border-t border-[#E6EDF5] px-4 py-4 sm:px-5 sm:py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto] xl:items-end">
              <label className="block text-[11px] font-semibold text-[#526D8D]">
                Start date
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-[#E6EDF5] bg-[#FFFCF9] px-3 text-[12px] font-medium text-[#10234F] outline-none transition focus:border-[#FF9C5C] focus:ring-2 focus:ring-[#FF6814]/10"
                />
              </label>

              <label className="block text-[11px] font-semibold text-[#526D8D]">
                End date
                <input
                  type="date"
                  min={startDate || undefined}
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-[#E6EDF5] bg-[#FFFCF9] px-3 text-[12px] font-medium text-[#10234F] outline-none transition focus:border-[#FF9C5C] focus:ring-2 focus:ring-[#FF6814]/10"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={applyFilters}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 text-[11px] font-semibold text-white shadow-sm transition hover:brightness-105 sm:flex-none"
                >
                  <Filter size={14} />
                  Apply filters
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E6EDF5] bg-white px-4 text-[11px] font-semibold text-[#526D8D] transition hover:bg-[#F8F9FB] sm:flex-none"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Tax summary */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_5px_20px_rgba(16,35,79,0.035)]">
        <div className="h-1 bg-gradient-to-r from-[#FF6814] via-[#FF812B] to-[#FFC18D]" />

        <div className="p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E5] text-[#FF6814]">
                <ReceiptText size={21} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[16px] font-bold tracking-[-0.3px] text-[#10234F] sm:text-[18px]">
                    Overall tax summary
                  </h2>
                  <InfoIcon text="Output tax minus input tax and expense tax." />
                </div>

                <p className="mt-1 text-[11px] leading-5 text-[#71839B] sm:text-[12px]">
                  Overall (Input - Output - Expense)
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full border border-[#D7F1E3] bg-[#EDFAF3] px-3 py-1.5 text-[10px] font-semibold text-[#168451]">
              Summary
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-[#F3E7DB] bg-[#FFFCF9] p-4 sm:p-5">
            <p className="text-[11px] font-medium text-[#71839B]">
              Output Tax - Input Tax - Expense Tax
            </p>
            <p className="mt-2 break-words text-[26px] font-bold tracking-[-0.8px] text-[#16A36A] sm:text-[30px]">
              {money(95.77)}
            </p>
          </div>
        </div>
      </section>

      {/* Tax records */}
      <section className="mb-6 min-w-0 overflow-visible rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_5px_20px_rgba(16,35,79,0.035)]">
        {/* Tabs */}
        <div className="border-b border-[#E6EDF5] px-2 pt-2 sm:px-4">
          <div className="flex flex-wrap gap-1">
            {taxTabs.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;

              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => changeTab(key)}
                  className={`relative flex min-h-[48px] items-center gap-2 rounded-t-xl px-3 text-left text-[11px] font-semibold transition sm:px-4 sm:text-[12px] ${
                    active
                      ? "bg-[#FFF6EF] text-[#E96012]"
                      : "text-[#71839B] hover:bg-[#FFFCF9] hover:text-[#10234F]"
                  }`}
                >
                  <Icon
                    size={17}
                    className={active ? "text-[#FF6814]" : "text-[#8796AA]"}
                  />
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full bg-[#FF6814] sm:left-4 sm:right-4" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table heading */}
        <div className="flex flex-col gap-3 border-b border-[#F0F2F5] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-[#10234F]">
              {activeTabLabel}
            </h2>
            <p className="mt-1 text-[10px] text-[#8796AA]">
              {filteredRows.length} records found
            </p>
          </div>

          <div className="relative w-full sm:max-w-[260px]">
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
              placeholder="Search tax records..."
              className="h-10 w-full rounded-xl border border-[#E6EDF5] bg-[#FFFCF9] pl-9 pr-3 text-[11px] text-[#10234F] outline-none transition placeholder:text-[#A0ADBD] focus:border-[#FF9C5C] focus:ring-2 focus:ring-[#FF6814]/10"
            />
          </div>
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

            <ExportButton icon={FileText} onClick={exportCSV}>
              Export CSV
            </ExportButton>

            <ExportButton icon={FileSpreadsheet} onClick={exportExcel}>
              Export Excel
            </ExportButton>

            <ExportButton icon={Printer} onClick={() => window.print()}>
              Print
            </ExportButton>

            <div className="relative">
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

                  <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-[240px] overflow-y-auto rounded-2xl border border-[#E6EDF5] bg-white p-3 shadow-[0_12px_32px_rgba(16,35,79,0.12)]">
                    <div className="mb-2 flex items-center justify-between border-b border-[#F0F2F5] pb-3">
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

                    <div className="mb-2 flex gap-2">
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
                          onChange={() =>
                            setVisibleColumns((current) =>
                              current.includes(column.key)
                                ? current.filter((key) => key !== column.key)
                                : [...current, column.key]
                            )
                          }
                          className="h-3.5 w-3.5 accent-[#FF6814]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            <ExportButton icon={FileDown} onClick={exportPDF}>
              Export PDF
            </ExportButton>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 w-fit items-center gap-2 rounded-xl px-2 text-[11px] font-medium text-[#71839B] transition hover:text-[#FF6814]"
          >
            <RotateCcw size={13} />
            Clear filters
          </button>
        </div>

        {/* Table */}
        <div className="mx-3 overflow-x-auto rounded-xl border border-[#E6EDF5] sm:mx-4">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-[#FFFAF5]">
                {visibleTableColumns.map((column) => (
                  <th
                    key={column.key}
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
                    className="border-b border-[#E6EDF5] px-4 py-14 text-center"
                  >
                    <div className="mx-auto flex max-w-xs flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E5] text-[#FF6814]">
                        <ReceiptText size={23} />
                      </div>
                      <p className="mt-3 text-[13px] font-semibold text-[#10234F]">
                        No tax records found
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-[#8796AA]">
                        There are no records to display for this tab or search.
                        Try clearing your filters.
                      </p>
                      {(search || hasActiveDateFilter) && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#FF6814] hover:underline"
                        >
                          <RotateCcw size={13} />
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((row, index) => (
                  <tr
                    key={row.id ?? `${row.reference}-${index}`}
                    className="transition hover:bg-[#FFFCF9]"
                  >
                    {visibleTableColumns.map((column) => (
                      <td
                        key={column.key}
                        className="border-b border-[#F0F2F5] px-3 py-3 text-[11px] text-[#526D8D]"
                      >
                        {["amount", "discount", "gst", "cgst", "sgst"].includes(
                          column.key
                        ) ? (
                          <span className="whitespace-nowrap font-semibold tabular-nums text-[#10234F]">
                            {money(row[column.key])}
                          </span>
                        ) : column.key === "date" ? (
                          <span className="whitespace-nowrap">
                            {row[column.key] || "—"}
                          </span>
                        ) : column.key === "reference" ? (
                          <span className="whitespace-nowrap font-semibold text-[#10234F]">
                            {row[column.key] || "—"}
                          </span>
                        ) : (
                          row[column.key] || "—"
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
                    className="border-r border-white px-3 py-3 text-[11px] font-bold text-[#10234F] last:border-r-0"
                  >
                    {index === 0
                      ? "Total:"
                      : column.key === "amount"
                        ? money(totalAmount)
                        : column.key === "gst"
                          ? money(totalGst)
                          : column.key === "cgst"
                            ? money(totalCgst)
                            : column.key === "sgst"
                              ? money(totalSgst)
                          : ""}
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
