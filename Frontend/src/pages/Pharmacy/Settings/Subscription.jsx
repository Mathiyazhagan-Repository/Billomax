
import React, { useMemo, useState } from "react";

const INITIAL_SUBSCRIPTIONS = [
  {
    id: 1,
    packageName: "Basic",
    startDate: "15/10/2024",
    trialEndDate: "04/01/2025",
    endDate: "15/12/2024",
    price: "₹ 2,000.00",
    paidVia: "offline",
    transactionId: "987456321",
    status: "approved",
    createdAt: "15/10/2024",
    createdBy: "Mr Admin",
  },
  {
    id: 2,
    packageName: "Basic",
    startDate: "17/10/2025",
    trialEndDate: "17/11/2025",
    endDate: "17/11/2025",
    price: "₹ 5,000.00",
    paidVia: "offline",
    transactionId: "",
    status: "approved",
    createdAt: "17/10/2025",
    createdBy: "Mr pharmacy",
  },
  {
    id: 3,
    packageName: "Starter",
    startDate: "09/01/2025",
    trialEndDate: "06/03/2025",
    endDate: "09/02/2025",
    price: "₹ 0.00",
    paidVia: "",
    transactionId: "FREE",
    status: "approved",
    createdAt: "09/01/2025",
    createdBy: "Mr pharmacy",
  },
  {
    id: 4,
    packageName: "Starter",
    startDate: "05/04/2025",
    trialEndDate: "30/05/2025",
    endDate: "05/05/2025",
    price: "₹ 0.00",
    paidVia: "",
    transactionId: "FREE",
    status: "approved",
    createdAt: "05/04/2025",
    createdBy: "Mr pharmacy",
  },
  {
    id: 5,
    packageName: "Starter",
    startDate: "30/07/2025",
    trialEndDate: "24/09/2025",
    endDate: "30/08/2025",
    price: "₹ 0.00",
    paidVia: "",
    transactionId: "FREE",
    status: "approved",
    createdAt: "30/07/2025",
    createdBy: "Mr pharmacy",
  },
];

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: "Free for 7 Days",
    amount: 0,
    period: "",
    description:
      "Perfect for small businesses starting digital billing. Includes 1 Business Location, 3 Users, and 30 Products. Generate 100 invoices/month for smooth sales management. Enjoy a 15-day free trial with full access, no credit card needed. Start simple, grow confidently with tools designed to make billing effortless.",
    features: [
      "1 Business Locations",
      "3 Users",
      "30 Products",
      "100 Invoices",
    ],
    action: "Subscribe",
  },
  {
    id: "basic-monthly",
    name: "Basic",
    price: "₹ 5,000.00",
    period: "1 Months",
    amount: 5000,
    description:
      "Ideal for growing businesses with multiple locations and more staff. Includes 3 Business Locations, 5 Users, and 100 Products. Generate 2,000 invoices/month to keep operations smooth. Access advanced reports and enjoy priority email support, ensuring your team stays informed and your business runs efficiently at every step.",
    features: [
      "3 Business Locations",
      "5 Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
    action: "Pay & Subscribe",
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹ 10,000.00",
    period: "1 Months",
    amount: 10000,
    description:
      "A solid choice for established businesses needing more power and flexibility. Includes 5 Business Locations, 10 Users, and 500 Products. Generate 5,000 invoices/month with advanced inventory tracking for better control. Enjoy priority support and custom branding options to align the platform with your business identity and operations.",
    features: [
      "5 Business Locations",
      "10 Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
    action: "Pay & Subscribe",
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹ 15,000.00",
    period: "1 Months",
    amount: 15000,
    description:
      "Designed for fast-scaling businesses needing more capacity without going full enterprise. Includes 8 Business Locations, 20 Users, and 1,000 Products. Generate 10,000 invoices/month with AI-powered sales forecasts, smart expense tracking, and automated reminders. Gain premium reports, role-based access control, and faster support to boost productivity and efficiency.",
    features: [
      "Unlimited Business Locations",
      "Unlimited Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
    action: "Pay & Subscribe",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹ 25,000.00",
    period: "1 Months",
    amount: 25000,
    popular: true,
    description:
      "Our most advanced plan for enterprises demanding power, flexibility, and automation. Access via web or tablet from anywhere. Includes Unlimited Locations, Users, Products, and invoices. Leverage AI-driven insights, predictive forecasts, stock alerts, and automated follow-ups. Enjoy enterprise-grade security, dedicated account management, custom integrations, and 24/7 premium support.",
    features: [
      "Unlimited Business Locations",
      "Unlimited Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
    action: "Pay & Subscribe",
  },
  {
    id: "basic-yearly",
    name: "basic",
    price: "₹ 5,000.00",
    period: "1 Years",
    amount: 5000,
    description: "yearly plan",
    features: [
      "Unlimited Business Locations",
      "Unlimited Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
    action: "Pay & Subscribe",
  },
];

const PAGE_SIZES = [10, 25, 50, 100];

function downloadCSV(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function SectionHeading({ eyebrow, title, description, count }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F04A13]">
            {eyebrow}
          </p>
        )}
        <h2 className="app-section-title text-[#10234F]">
          {title}
        </h2>
        {description && (
          <p className="app-description mt-1 text-[#577B9F]">{description}</p>
        )}
      </div>
      {count !== undefined && (
        <span className="inline-flex w-fit items-center rounded-full border border-[#F8EBDD] bg-[#FFF1E5] px-3 py-1 text-xs font-bold text-[#F04A13]">
          {count}
        </span>
      )}
    </div>
  );
}

function SubscriptionStatus({ status }) {
  const approved = String(status).toLowerCase() === "approved";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        approved
          ? "border border-[#CDEDDC] bg-[#EAF8F0] text-[#24804C]"
          : "border border-[#F9E2B5] bg-[#FFF7E5] text-[#A86A12]"
      }`}
    >
      {status}
    </span>
  );
}

function ViewModal({ subscription, onClose }) {
  if (!subscription) return null;

  const details = [
    ["Package Name", subscription.packageName],
    ["Start Date", subscription.startDate],
    ["Trial End Date", subscription.trialEndDate],
    ["End Date", subscription.endDate],
    ["Price", subscription.price],
    ["Paid Via", subscription.paidVia || "—"],
    ["Transaction Id", subscription.transactionId || "—"],
    ["Status", subscription.status],
    ["Created At", subscription.createdAt],
    ["Created By", subscription.createdBy],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10234F]/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-5 py-5 sm:px-7">
          <div>
            <p className="inline-flex rounded-lg bg-[#FFE9D9] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#F04A13]">
              Subscription details
            </p>
            <h3 className="app-section-title mt-2 text-[#10234F]">
              {subscription.packageName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8EDF4] text-lg text-[#8798AD] transition hover:bg-[#FFF1E5] hover:text-[#19366F]"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-0 p-5 sm:grid-cols-2 sm:px-7 sm:py-6">
          {details.map(([label, value]) => (
            <div key={label} className="border-b border-[#F2E8DE] px-1 py-3">
              <p className="text-xs font-semibold text-[#8798AD]">{label}</p>
              <div className="mt-1 break-words text-sm font-semibold text-[#19366F]">
                {label === "Status" ? (
                  <SubscriptionStatus status={value} />
                ) : (
                  value
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-[#F2E8DE] px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#FF711A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#F04A13]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionHistory({
  subscriptions,
  onView,
  onExport,
}) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "id", direction: "asc" });
  const [visibleColumns, setVisibleColumns] = useState([
    "packageName",
    "startDate",
    "trialEndDate",
    "endDate",
    "price",
    "paidVia",
    "transactionId",
    "status",
    "createdAt",
    "createdBy",
    "action",
  ]);
  const [showColumns, setShowColumns] = useState(false);

  const columns = [
    { key: "packageName", label: "Package Name" },
    { key: "startDate", label: "Start Date" },
    { key: "trialEndDate", label: "Trial End Date" },
    { key: "endDate", label: "End Date" },
    { key: "price", label: "Price" },
    { key: "paidVia", label: "Paid Via" },
    { key: "transactionId", label: "Transaction Id" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "createdBy", label: "Created By" },
    { key: "action", label: "Action" },
  ];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subscriptions
      .filter((row) =>
        [
          row.packageName,
          row.startDate,
          row.trialEndDate,
          row.endDate,
          row.price,
          row.paidVia,
          row.transactionId,
          row.status,
          row.createdAt,
          row.createdBy,
        ].some((value) => String(value ?? "").toLowerCase().includes(query))
      )
      .sort((a, b) => {
        const first = String(a[sort.key] ?? "");
        const second = String(b[sort.key] ?? "");
        const result =
          sort.key === "id"
            ? a.id - b.id
            : first.localeCompare(second, undefined, { numeric: true });

        return sort.direction === "asc" ? result : -result;
      });
  }, [subscriptions, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = filtered.length ? (safePage - 1) * pageSize + 1 : 0;
  const end = Math.min(safePage * pageSize, filtered.length);
  const pageRows = filtered.slice(start - 1 < 0 ? 0 : start - 1, end);

  const changeSort = (key) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setPage(1);
  };

  const exportData = (type) => {
    const headings = columns
      .filter((column) => column.key !== "action")
      .map((column) => column.label);

    const rows = filtered.map((row) => [
      row.packageName,
      row.startDate,
      row.trialEndDate,
      row.endDate,
      row.price,
      row.paidVia,
      row.transactionId,
      row.status,
      row.createdAt,
      row.createdBy,
    ]);

    if (type === "csv") {
      downloadCSV("subscription-history.csv", [headings, ...rows]);
    } else if (type === "excel") {
      if (onExport) {
        onExport("excel", filtered);
      } else {
        window.alert(
          "Connect your existing Excel export utility to enable Excel export."
        );
      }
    } else if (type === "pdf") {
      if (onExport) {
        onExport("pdf", filtered);
      } else {
        window.alert(
          "Connect your existing PDF export utility to enable PDF export."
        );
      }
    }
  };

  const thClass =
    "border-b border-r border-[#F2E8DE] px-3 py-3 text-left align-bottom text-[10px] font-extrabold uppercase tracking-wide text-[#19366F] last:border-r-0";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
      <div className="border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6">
        <SectionHeading
          title="All Subscriptions"
          description="Review subscription history and transaction details."
          count={`${subscriptions.length} records`}
        />
      </div>

      <div className="flex flex-col gap-3 border-b border-[#F2E8DE] bg-[#FFFCF8] px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#577B9F]">
            Show
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="h-9 rounded-lg border border-[#E8EDF4] bg-white px-2 text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            entries
          </label>

          <button
            type="button"
            onClick={() => exportData("csv")}
            className="rounded-lg border border-[#E8EDF4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
          >
            ▤ Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportData("excel")}
            className="rounded-lg border border-[#E8EDF4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
          >
            ▣ Export Excel
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-[#E8EDF4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
          >
            ▤ Print
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumns((value) => !value)}
              className="rounded-lg border border-[#E8EDF4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
            >
              ▥ Column visibility
            </button>
            {showColumns && (
              <div className="absolute left-0 top-full z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border border-[#F2E8DE] bg-white p-3 shadow-xl">
                {columns.map((column) => (
                  <label
                    key={column.key}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-[#19366F] hover:bg-[#FFF1E5]"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(column.key)}
                      onChange={(event) =>
                        setVisibleColumns((previous) =>
                          event.target.checked
                            ? [...previous, column.key]
                            : previous.filter((key) => key !== column.key)
                        )
                      }
                      className="accent-[#FF711A]"
                    />
                    {column.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => exportData("pdf")}
            className="rounded-lg border border-[#E8EDF4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
          >
            ▤ Export PDF
          </button>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search ..."
          aria-label="Search subscriptions"
          className="h-10 w-full rounded-lg border border-[#E8EDF4] bg-white px-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10 sm:w-52"
        />
      </div>

      <div className="px-4 pb-2 sm:px-6">
        <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
          <table className="w-full min-w-[1150px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF7EF]">
                {columns.map((column) =>
                  visibleColumns.includes(column.key) ? (
                    <th key={column.key} className={thClass}>
                      {column.key === "action" ? (
                        column.label
                      ) : (
                        <button
                          type="button"
                          onClick={() => changeSort(column.key)}
                          className="flex w-full items-end justify-between gap-2 text-left hover:text-[#F04A13]"
                        >
                          <span>{column.label}</span>
                          <span className="text-xs text-[#A5B1C0]">
                            {sort.key === column.key
                              ? sort.direction === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        </button>
                      )}
                    </th>
                  ) : null
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2E8DE]">
              {pageRows.map((row) => (
                <tr
                  key={row.id}
                  className="transition odd:bg-white even:bg-[#FFFCF8] hover:bg-[#FFF7EF]"
                >
                  {visibleColumns.includes("packageName") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top font-semibold text-[#19366F]">
                      {row.packageName}
                    </td>
                  )}
                  {visibleColumns.includes("startDate") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top text-[#577B9F]">
                      {row.startDate}
                    </td>
                  )}
                  {visibleColumns.includes("trialEndDate") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top text-[#577B9F]">
                      {row.trialEndDate}
                    </td>
                  )}
                  {visibleColumns.includes("endDate") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top text-[#577B9F]">
                      {row.endDate}
                    </td>
                  )}
                  {visibleColumns.includes("price") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top font-semibold text-[#19366F]">
                      {row.price}
                    </td>
                  )}
                  {visibleColumns.includes("paidVia") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top text-[#577B9F]">
                      {row.paidVia || "—"}
                    </td>
                  )}
                  {visibleColumns.includes("transactionId") && (
                    <td className="max-w-40 break-words border-r border-[#F2E8DE] px-3 py-3 align-top text-[#577B9F]">
                      {row.transactionId || "—"}
                    </td>
                  )}
                  {visibleColumns.includes("status") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top">
                      <SubscriptionStatus status={row.status} />
                    </td>
                  )}
                  {visibleColumns.includes("createdAt") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top text-[#577B9F]">
                      {row.createdAt}
                    </td>
                  )}
                  {visibleColumns.includes("createdBy") && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3 align-top text-[#577B9F]">
                      {row.createdBy}
                    </td>
                  )}
                  {visibleColumns.includes("action") && (
                    <td className="px-3 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => onView(row)}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#D8E8FF] px-3 py-1.5 text-xs font-bold text-[#3478F6] transition hover:bg-[#EAF3FF]"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleColumns.length || 1}
                    className="bg-[#FFFCF8] px-4 py-12 text-center text-sm text-[#577B9F]"
                  >
                    {search
                      ? "No matching subscriptions found."
                      : "No data available in table"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#F2E8DE] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-[#577B9F]">
          Showing{" "}
          <strong className="text-[#19366F]">
            {start} to {end}
          </strong>{" "}
          of <strong className="text-[#19366F]">{filtered.length}</strong>{" "}
          entries
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage(safePage - 1)}
            className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="min-w-9 rounded-lg bg-[#FF711A] px-3 py-2 text-center text-sm font-bold text-white">
            {safePage}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount}
            onClick={() => setPage(safePage + 1)}
            className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function PackageCard({ plan, onSubscribe }) {
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
        plan.popular
          ? "border-[#FFB37E] shadow-[0_10px_35px_rgba(255,113,26,0.14)]"
          : "border-[#F2E8DE] shadow-[0_4px_12px_rgba(224,133,65,0.07)]"
      }`}
    >
      {plan.popular && (
        <div className="absolute left-4 top-4 rounded-full bg-[#FF711A] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
          Popular
        </div>
      )}

      <div
        className={`flex flex-1 flex-col px-5 pb-5 pt-7 sm:px-6 ${
          plan.popular ? "pt-14" : ""
        }`}
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#F04A13]">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 7h16M4 12h16M4 17h10" />
              <circle cx="18" cy="17" r="3" />
            </svg>
          </div>

          <h3 className="text-xl font-extrabold text-[#19366F]">
            {plan.name}
          </h3>

          <p className="mt-2 text-sm font-bold text-[#19366F]">
            {plan.price}
            {plan.period && (
              <span className="font-semibold text-[#8798AD]">
                {" "}/ {plan.period}
              </span>
            )}
          </p>

          <p className="mt-4 min-h-[115px] text-sm leading-6 text-[#577B9F]">
            {plan.description}
          </p>
        </div>

        <ul className="mt-5 space-y-2.5">
          {plan.features.map((feature, index) => (
            <li
              key={`${plan.id}-${index}`}
              className="flex items-start gap-2.5 text-sm text-[#19366F]"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF8F0] text-[#24804C]">
                <svg
                  viewBox="0 0 20 20"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="m4 10 4 4 8-8" />
                </svg>
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onSubscribe(plan)}
          className="mt-auto w-full rounded-lg bg-[#FFF1E5] px-4 py-3 text-sm font-bold text-[#F04A13] transition hover:bg-[#FF711A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20"
          style={{ marginTop: "auto", marginBottom: 0 }}
        >
          {plan.action}
        </button>
      </div>
    </article>
  );
}

export default function Subscription({
  subscriptions: suppliedSubscriptions,
  packages: suppliedPackages,
  onView,
  onSubscribe,
  onExport,
}) {
  const [localSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const subscriptions = suppliedSubscriptions ?? localSubscriptions;
  const packages = suppliedPackages ?? PACKAGES;

  const handleView = (row) => {
    setSelectedSubscription(row);
    onView?.(row);
  };

  const handleSubscribe = (plan) => {
    if (onSubscribe) {
      onSubscribe(plan);
      return;
    }

    window.alert(
      `Selected package: ${plan.name}\n\nConnect your existing subscription/payment handler to continue.`
    );
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1800px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <span className="text-[11px] font-extrabold">PHARMACY · ACCOUNT</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              Subscription
            </h1>
            <p className="app-description mt-1 text-[#577B9F]">
              Manage your subscription, review billing history, and explore packages.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-[#F2E8DE] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(224,133,65,0.07)] sm:self-auto">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF1E5] text-[#F04A13]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18M7 15h4" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-[#8798AD]">Total subscriptions</p>
              <p className="text-lg font-extrabold text-[#19366F]">
                {subscriptions.length}
              </p>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-7">
            <SectionHeading
              eyebrow="Account overview"
              title="Active Subscription"
            />
          </div>
          <div className="flex flex-col gap-4 bg-[#FFFCF8] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#F04A13]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#19366F]">
                  No active subscription found
                </h3>
                <p className="mt-1 text-sm text-[#577B9F]">
                  Choose a package below to get started.
                </p>
              </div>
            </div>
            <a
              href="#subscription-packages"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#FF711A] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#F04A13] hover:shadow-md"
            >
              Explore Packages
            </a>
          </div>
        </section>

        <SubscriptionHistory
          subscriptions={subscriptions}
          onView={handleView}
          onExport={onExport}
        />

        <section
          id="subscription-packages"
          className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6 lg:p-7"
        >
          <SectionHeading
            eyebrow="Plans & pricing"
            title="Packages"
            description="Choose the package that fits your business needs."
            count={`${packages.length} packages`}
          />

          <div className="mt-6 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {packages.map((plan) => (
              <PackageCard
                key={plan.id ?? `${plan.name}-${plan.period}`}
                plan={plan}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </section>

        <footer className="py-3 text-center text-xs leading-6 text-[#8798AD]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
          {" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>

      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#3986FF] to-[#2563EB] text-white shadow-lg shadow-blue-300/50 transition hover:-translate-y-1 hover:shadow-xl print:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 14 6-6 6 6" />
        </svg>
      </button>

      <ViewModal
        subscription={selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
      />
    </main>
  );
}
