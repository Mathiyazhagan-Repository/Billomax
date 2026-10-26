
import React, { useMemo, useState } from "react";
import {
  Activity,
  BellRing,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Printer,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import CustomerReminderViewHistory from "./CustomerReminderViewHistory.jsx";

const initialReminders = [
  {
    id: 1,
    customer: "swathi",
    mobile: "7975088071",
    lastBillDate: "24/07/2026",
    expectedCompletion: "26/07/2026",
    daysSinceCompletion: 88,
    medicine: "Dolo 650",
    lastBillAmount: 47.5,
    reminderStatus: "Pending",
  },
  {
    id: 2,
    customer: "Demo Customer",
    mobile: "9988776655",
    lastBillDate: "04/08/2026",
    expectedCompletion: "05/08/2026",
    daysSinceCompletion: 78,
    medicine: "Dolo 650",
    lastBillAmount: 33.75,
    reminderStatus: "Pending",
  },
];

const columnDefinitions = [
  { key: "customer", label: "Customer" },
  { key: "mobile", label: "Mobile" },
  { key: "lastBillDate", label: "Last Bill Date" },
  { key: "expectedCompletion", label: "Expected Completion" },
  { key: "daysSinceCompletion", label: "Days Since Completion" },
  { key: "medicine", label: "Medicine" },
  { key: "lastBillAmount", label: "Last Bill Amount" },
  { key: "reminderStatus", label: "Reminder Status" },
  { key: "action", label: "Action" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const parseDate = (value) => {
  if (!value) return null;
  const [day, month, year] = value.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const toDateInput = (value) => {
  if (!value) return "";
  const date = parseDate(value);
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

function MetricCard({ icon: Icon, label, value, accent = "orange", hint }) {
  const accents = {
    orange: "bg-[#FFE9D9] text-[#F04A13] ring-[#F8EBDD]",
    blue: "bg-[#EDF4FF] text-[#4276B5] ring-[#E3ECF8]",
    green: "bg-[#EAF7ED] text-[#218838] ring-[#D9EEDB]",
  };

  return (
    <div className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="app-description">{label}</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#F04A13]">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-[#8798AD]">{hint}</p>}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${accents[accent]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, variant = "secondary", icon: Icon }) {
  const variants = {
    primary:
      "border-transparent bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13]",
    secondary:
      "border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20 ${variants[variant]}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export default function CustomerReminder() {
  const [reminders] = useState(initialReminders);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columnDefinitions.map((column) => column.key)
  );
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "daysSinceCompletion",
    direction: "desc",
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [historyCustomer, setHistoryCustomer] = useState(null);

  const filteredReminders = useMemo(() => {
    let rows = reminders.filter((row) => {
      const searchText = [
        row.customer,
        row.mobile,
        row.lastBillDate,
        row.expectedCompletion,
        row.medicine,
        row.reminderStatus,
        String(row.daysSinceCompletion),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || row.reminderStatus === statusFilter;

      const billDate = parseDate(row.lastBillDate);
      const from = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const to = endDate ? new Date(`${endDate}T23:59:59`) : null;

      const matchesStart = !from || (billDate && billDate >= from);
      const matchesEnd = !to || (billDate && billDate <= to);

      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });

    if (sortConfig.key) {
      rows = [...rows].sort((a, b) => {
        const key = sortConfig.key;
        let first = a[key] ?? "";
        let second = b[key] ?? "";

        if (key === "lastBillDate" || key === "expectedCompletion") {
          first = parseDate(first)?.getTime() ?? 0;
          second = parseDate(second)?.getTime() ?? 0;
        } else if (key === "lastBillAmount" || key === "daysSinceCompletion") {
          first = Number(first);
          second = Number(second);
        } else {
          first = String(first).toLowerCase();
          second = String(second).toLowerCase();
        }

        if (first < second) return sortConfig.direction === "asc" ? -1 : 1;
        if (first > second) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [
    reminders,
    search,
    statusFilter,
    startDate,
    endDate,
    sortConfig,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredReminders.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = filteredReminders.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const pendingCount = reminders.filter(
    (row) => row.reminderStatus === "Pending"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    if (key === "action") return;
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const toggleColumn = (key) => {
    setVisibleColumns((previous) =>
      previous.includes(key)
        ? previous.filter((column) => column !== key)
        : [...previous, key]
    );
  };

  const exportCSV = () => {
    const exportColumns = columnDefinitions.filter(
      (column) =>
        visibleColumns.includes(column.key) && column.key !== "action"
    );

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredReminders.map((row) =>
      exportColumns.map((column) => {
        const value =
          column.key === "lastBillAmount"
            ? formatCurrency(row.lastBillAmount)
            : row[column.key];
        return escapeCSV(value);
      })
    );

    const csv = [
      exportColumns.map((column) => escapeCSV(column.label)).join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Customer Reminder.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    // CSV opens directly in Excel and preserves the currently filtered rows.
    exportCSV();
  };

  const exportPDF = () => {
    window.print();
  };

  const printReport = () => {
    window.print();
  };

  const renderCell = (row, key) => {
    switch (key) {
      case "customer":
        return (
          <div className="flex min-w-[130px] items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE9D9] text-sm font-bold uppercase text-[#F04A13]">
              {row.customer.charAt(0)}
            </div>
            <span className="font-semibold text-[#10234F]">{row.customer}</span>
          </div>
        );

      case "mobile":
        return <span className="whitespace-nowrap">{row.mobile}</span>;

      case "lastBillDate":
      case "expectedCompletion":
        return (
          <span className="whitespace-nowrap text-[#577B9F]">
            {row[key]}
          </span>
        );

      case "daysSinceCompletion":
        return (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#FFF1E5] px-2.5 py-1.5 text-xs font-bold text-[#F04A13]">
            <Clock3 size={13} />
            {row.daysSinceCompletion} days
          </span>
        );

      case "medicine":
        return (
          <span className="whitespace-nowrap font-medium text-[#19366F]">
            {row.medicine}
          </span>
        );

      case "lastBillAmount":
        return (
          <span className="whitespace-nowrap font-semibold tabular-nums text-[#10234F]">
            {formatCurrency(row.lastBillAmount)}
          </span>
        );

      case "reminderStatus":
        return (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {row.reminderStatus}
          </span>
        );

      case "action":
        return (
          <button
            type="button"
            onClick={() => setHistoryCustomer(row)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#FF711A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#F04A13] focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20"
          >
            <History size={14} />
            View History
          </button>
        );

      default:
        return row[key];
    }
  };

  const activeFilters =
    Number(Boolean(startDate)) +
    Number(Boolean(endDate)) +
    Number(statusFilter !== "All");

  if (historyCustomer) {
    return (
      <CustomerReminderViewHistory
        customerRecord={historyCustomer}
        onBack={() => setHistoryCustomer(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 py-4 text-[#19366F] sm:px-5">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { border: 0 !important; box-shadow: none !important; }
          .print-area table { min-width: 100% !important; }
          .print-area th, .print-area td { padding: 8px !important; }
          .print-area { overflow: visible !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1500px] space-y-5">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <BellRing size={14} />
              <span className="text-[11px] font-extrabold">CUSTOMER MANAGEMENT · REPORTS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Customer Reminder Report
            </h1>
            <p className="app-description mt-1">
              Review customers who have not returned after their expected
              medicine completion date.
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2">
            <ActionButton icon={FileSpreadsheet} onClick={exportExcel}>
              Export Excel
            </ActionButton>
            <ActionButton
              icon={FileText}
              onClick={exportPDF}
              variant="primary"
            >
              Export PDF
            </ActionButton>
          </div>
        </header>

        {/* Summary metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            icon={Users}
            label="Customers in Report"
            value={reminders.length}
            accent="blue"
            hint="Total records in this report"
          />
          <MetricCard
            icon={BellRing}
            label="Pending Reminders"
            value={pendingCount}
            accent="orange"
            hint="Customers marked as pending"
          />
          <MetricCard
            icon={Activity}
            label="Filtered Results"
            value={filteredReminders.length}
            accent="green"
            hint="Records matching current filters"
          />
        </section>

        {/* Filter panel */}
        <section className="no-print overflow-visible rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            aria-expanded={showFilters}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <Filter size={19} />
              </div>
              <div>
                <h2 className="font-bold text-[#10234F]">Filters</h2>
                <p className="app-description mt-0.5">
                  Narrow the report by bill date or reminder status.
                </p>
              </div>
              {activeFilters > 0 && (
                <span className="rounded-full bg-[#FFF1E5] px-2 py-0.5 text-xs font-bold text-[#F04A13]">
                  {activeFilters} active
                </span>
              )}
            </div>
            {showFilters ? (
              <ChevronUp size={19} className="text-[#8798AD]" />
            ) : (
              <ChevronDown size={19} className="text-[#8798AD]" />
            )}
          </button>

          {showFilters && (
            <div className="border-t border-[#F2E8DE] px-5 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#577B9F]">
                    Last bill date — from
                  </span>
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                    />
                    <input
                      type="date"
                      value={startDate}
                      max={endDate || undefined}
                      onChange={(event) => {
                        setStartDate(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#577B9F]">
                    Last bill date — to
                  </span>
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                    />
                    <input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(event) => {
                        setEndDate(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#577B9F]">
                    Reminder status
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                  >
                    <option value="All">All statuses</option>
                    <option value="Pending">Pending</option>
                  </select>
                </label>

                <div className="flex items-end">
                  <ActionButton icon={RotateCcw} onClick={resetFilters}>
                    Reset filters
                  </ActionButton>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Main report table */}
        <section className="print-area overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                  <BellRing size={19} />
                </div>
                <h2 className="app-section-title text-[#10234F]">
                  Customers Who Did Not Return
                </h2>
              </div>
              <p className="app-description mt-2 max-w-3xl leading-6">
                Reminder estimates use prescription validity days when
                available; otherwise the sold quantity is used as a lightweight
                completion estimate.
              </p>
            </div>

            <div className="no-print flex shrink-0 flex-wrap gap-2">
              <ActionButton icon={Download} onClick={exportCSV}>
                Export CSV
              </ActionButton>
              <ActionButton icon={FileSpreadsheet} onClick={exportExcel}>
                Excel
              </ActionButton>
              <ActionButton icon={Printer} onClick={printReport}>
                Print
              </ActionButton>
              <ActionButton
                icon={FileText}
                onClick={exportPDF}
                variant="primary"
              >
                Export PDF
              </ActionButton>
            </div>
          </div>

          {/* Table controls */}
          <div className="no-print flex flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-[#577B9F]">
                Show
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-medium text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                entries
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColumns((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-medium text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
                >
                  <SlidersHorizontal size={15} />
                  Columns
                  <ChevronDown size={14} />
                </button>

                {showColumns && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-[#F8EBDD] bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between border-b border-[#F2E8DE] pb-2">
                      <span className="text-sm font-bold text-[#19366F]">
                        Visible columns
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowColumns(false)}
                        className="rounded-md p-1 text-[#8798AD] hover:bg-[#FFF1E5]"
                        aria-label="Close column menu"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    {columnDefinitions.map((column) => (
                      <label
                        key={column.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#577B9F] hover:bg-[#FFF1E5]"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => toggleColumn(column.key)}
                          className="h-4 w-4 accent-[#FF711A]"
                        />
                        {column.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="relative block w-full lg:max-w-xs">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search customers, medicine..."
                className="w-full rounded-lg border border-[#E8EDF4] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-[#E9EDF3] bg-[#F8FAFC]">
                  {columnDefinitions
                    .filter((column) => visibleColumns.includes(column.key))
                    .map((column) => (
                      <th
                        key={column.key}
                        className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide text-[#52617A]"
                      >
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className={`inline-flex items-center gap-2 transition hover:text-[#F04A13] ${
                            column.key === "action"
                              ? "cursor-default"
                              : "cursor-pointer"
                          }`}
                        >
                          {column.label}
                          {column.key !== "action" &&
                            (sortConfig.key === column.key ? (
                              sortConfig.direction === "asc" ? (
                                <ChevronUp size={14} className="text-[#F04A13]" />
                              ) : (
                                <ChevronDown
                                  size={14}
                                  className="text-[#F04A13]"
                                />
                              )
                            ) : (
                              <span className="text-[#D5DDE7]">
                                <ChevronUp size={12} />
                              </span>
                            ))}
                        </button>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EDF0F5]">
                {pageRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-[#FFF7EF] ${
                      index % 2 === 1 ? "bg-[#FCFDFE]" : "bg-white"
                    }`}
                  >
                    {columnDefinitions
                      .filter((column) => visibleColumns.includes(column.key))
                      .map((column) => (
                        <td
                          key={column.key}
                          className="px-4 py-4 align-middle text-[#577B9F]"
                        >
                          {renderCell(row, column.key)}
                        </td>
                      ))}
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={Math.max(1, visibleColumns.length)}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#8798AD]">
                        <Search size={21} />
                      </div>
                      <p className="mt-3 font-semibold text-[#10234F]">
                        No matching customers
                      </p>
                      <p className="app-description mt-1">
                        Try another search term or reset your filters.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 text-sm font-semibold text-[#F04A13] hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="no-print flex flex-col gap-4 border-t border-[#F2E8DE] px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="app-description">
              Showing{" "}
              <span className="font-semibold text-[#19366F]">
                {filteredReminders.length === 0
                  ? 0
                  : (safePage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#19366F]">
                {Math.min(safePage * pageSize, filteredReminders.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#19366F]">
                {filteredReminders.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-medium text-[#577B9F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                      safePage === page
                        ? "bg-[#FF711A] text-white shadow-sm"
                        : "border border-[#E8EDF4] bg-white text-[#577B9F] hover:bg-[#FFF1E5]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-sm font-medium text-[#577B9F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-[#8798AD] sm:flex-row sm:text-left">
          <p>Billomax · Customer Reminder Report</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>

    </div>
  );
}
