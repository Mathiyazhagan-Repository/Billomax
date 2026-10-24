
import React, { useMemo, useState } from "react";
import ClientDetailsModal from "./ClientDetailsModal.jsx";

const importColumns = [
  "Sr. No.",
  "Business Month",
  "Year",
  "Client Name",
  "Client No.",
  "Alternate Mobile Number",
  "Alternate Mobile Number 2",
  "Alternate Mobile Number 3",
  "Client Email ID",
  "Email 2",
  "Project Name",
  "Domain Name",
  "Domain Booked By",
  "Renewal Month",
  "Renewal Date",
  "Renewal Items",
  "Renewal Amount",
  "GST 18%",
  "Total",
];

const tableColumns = [
  {
    label: "Sr. No.",
    keys: ["srNo", "sr_no", "serial_no", "serialNumber"],
  },
  {
    label: "Client Name",
    keys: ["clientName", "client_name", "name", "customer_name"],
  },
  {
    label: "Client No.",
    keys: ["clientNo", "client_no", "client_number", "mobile", "mobile_number"],
  },
  {
    label: "Email",
    keys: ["email", "clientEmail", "client_email", "client_email_id"],
  },
  {
    label: "Project Name",
    keys: ["projectName", "project_name", "project"],
  },
  {
    label: "Renewal Date",
    keys: ["renewalDate", "renewal_date"],
  },
  {
    label: "Total",
    keys: ["total", "total_amount", "renewalAmount", "renewal_amount"],
  },
  {
    label: "Transaction ID",
    keys: ["transactionId", "transaction_id", "transactionID"],
  },
  {
    label: "Status",
    keys: ["status", "clientStatus", "client_status"],
  },
];

const SAMPLE_CLIENTS = [
  {
    id: "sample-client-1",
    srNo: 1,
    projectName: "Soraship Website",
    renewalDate: "45743",
    total: "7080.00",
    status: "Need Follow-up",
  },
  {
    id: "sample-client-2",
    srNo: 2,
    clientName: "Sample Client 2",
    clientNo: "9000000002",
    email: "client2@example.com",
    projectName: "Techpro",
    renewalDate: "45743",
    total: "7080.00",
    status: "Need Follow-up",
  },
  {
    id: "sample-client-3",
    srNo: 3,
    clientName: "Sample Client 3",
    clientNo: "9000000003",
    email: "client3@example.com",
    projectName: "Sarasiddhi Website Project",
    renewalDate: "45743",
    total: "5900.00",
    status: "Need Follow-up",
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

function valueOf(row, keys) {
  for (const key of keys) {
    const value = row?.[key];

    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object") {
        return value.name ?? value.label ?? "";
      }

      return value;
    }
  }

  return "";
}

function downloadTemplate() {
  const csv = [
    importColumns,
    importColumns.map(() => ""),
  ]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "client_import_template.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function Button({ children, onClick, type = "button", variant = "orange" }) {
  const variants = {
    orange: "bg-orange-500 text-white hover:bg-orange-600",
    outline:
      "border border-slate-200 bg-white text-slate-600 hover:border-orange-400 hover:text-orange-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default function ImportClients({
  clients = SAMPLE_CLIENTS,
  onImport,
  onStatusChange,
  onViewDetails,
  onSearch,
}) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("All");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [clientNo, setClientNo] = useState("");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const records = Array.isArray(clients) ? clients : [];

  const statuses = useMemo(
    () => [
      "All",
      ...new Set(
        records
          .map((row) => String(valueOf(row, ["status", "clientStatus", "client_status"])))
          .filter(Boolean)
      ),
    ],
    [records]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return records.filter((row) => {
      const rowStatus = String(
        valueOf(row, ["status", "clientStatus", "client_status"])
      );
      const name = String(valueOf(row, tableColumns[1].keys));
      const project = String(valueOf(row, tableColumns[4].keys));
      const number = String(valueOf(row, tableColumns[2].keys));

      const matchesStatus = status === "All" || rowStatus === status;
      const matchesName = name.toLowerCase().includes(clientName.toLowerCase());
      const matchesProject = project.toLowerCase().includes(projectName.toLowerCase());
      const matchesNumber = number.toLowerCase().includes(clientNo.toLowerCase());

      const matchesSearch =
        !q ||
        [...tableColumns, {
          keys: [
            "email2",
            "email_2",
            "alternateMobileNumber",
            "alternate_mobile_number",
            "alternateMobileNumber2",
            "alternate_mobile_number_2",
            "alternateMobileNumber3",
            "alternate_mobile_number_3",
            "domainName",
            "domain_name",
            "domainBookedBy",
            "domain_booked_by",
            "renewalMonth",
            "renewal_month",
            "renewalItems",
            "renewal_items",
            "businessMonth",
            "business_month",
            "year",
          ],
        }].some((column) =>
          String(valueOf(row, column.keys)).toLowerCase().includes(q)
        );

      return (
        matchesStatus &&
        matchesName &&
        matchesProject &&
        matchesNumber &&
        matchesSearch
      );
    });
  }, [records, status, clientName, projectName, clientNo, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleRecords = filtered.slice(start, start + pageSize);

  const reset = () => {
    setStatus("All");
    setClientName("");
    setProjectName("");
    setClientNo("");
    setSearch("");
    setPage(1);
  };

  const submitImport = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please choose an Excel or CSV file.");
      return;
    }

    if (!onImport) {
      setMessage(
        "File selected. Connect onImport to your existing import API."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await onImport(file);
      setMessage("Import request completed.");
    } catch (error) {
      setMessage(error?.message || "Import failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-3 py-5 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        {/* Page heading */}
        <header>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
            Billomax · Client Management
          </div>
          <h1 className="app-page-title mt-2 text-slate-900">
            Import Clients
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Import client records and manage existing clients.
          </p>
        </header>

        {message && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-800"
          >
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Import section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white px-5 py-5 sm:px-7">
            <h2 className="app-section-title text-slate-900">
              Import Client Data
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a spreadsheet containing the required columns.
            </p>
          </div>

          <form onSubmit={submitImport} className="space-y-6 p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  File to Import
                </span>
                <input
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  className={inputClass}
                />
                {file && (
                  <span className="mt-2 block break-all text-xs text-slate-500">
                    Selected: {file.name}
                  </span>
                )}
              </label>

              <Button type="submit" variant="orange">
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>

            <div className="rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 bg-[#FFFAF5] p-4">
                <h3 className="font-bold text-slate-900">Instructions</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Ensure your Excel file contains the following columns in
                  exactly this order.
                </p>
              </div>

              <div className="max-h-[420px] overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-[#FFFAF5]">
                    <tr>
                      <th className="w-16 border-b border-slate-200 px-4 py-3">
                        #
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3">
                        Column Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {importColumns.map((column, index) => (
                      <tr
                        key={column}
                        className="border-b border-slate-100 last:border-0 hover:bg-orange-50/50"
                      >
                        <td className="px-4 py-2.5 text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2.5 font-medium">{column}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center">
                <p className="text-xs text-slate-500">
                  All columns are mandatory. Supported formats: .xls, .xlsx,
                  .csv.
                </p>
                <Button onClick={downloadTemplate}>
                  ↓ Download Template
                </Button>
              </div>
            </div>
          </form>
        </section>

        {/* Client list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <h2 className="app-section-title text-slate-900">Client List</h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and manage client records.
              </p>
            </div>
            <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              {filtered.length} records
            </span>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            {/* Filters */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Filter by Status
                </span>
                <select
                  className={inputClass}
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              {[
                {
                  label: "Client Name",
                  value: clientName,
                  setValue: setClientName,
                  placeholder: "Search by Client Name",
                },
                {
                  label: "Project Name",
                  value: projectName,
                  setValue: setProjectName,
                  placeholder: "Search by Project Name",
                },
                {
                  label: "Client No.",
                  value: clientNo,
                  setValue: setClientNo,
                  placeholder: "Search by Client No.",
                },
              ].map((field) => (
                <label key={field.label} className="block">
                  <span className="mb-2 block text-xs font-bold">
                    {field.label}
                  </span>
                  <input
                    className={inputClass}
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(event) => {
                      field.setValue(event.target.value);
                      setPage(1);
                    }}
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="orange"
                onClick={() =>
                  onSearch?.({
                    status,
                    clientName,
                    projectName,
                    clientNo,
                  })
                }
              >
                Search
              </Button>
              <Button variant="outline" onClick={reset}>
                Reset
              </Button>
            </div>

            {/* Table toolbar */}
            <div className="flex flex-col justify-between gap-3 border-y border-slate-100 py-4 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-sm text-slate-500">
                Show
                <select
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700"
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                >
                  {[10, 20, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                entries
              </label>

              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500 sm:max-w-xs"
                value={search}
                placeholder="Search all fields..."
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Exact client-list columns from the reference screenshot */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[980px] table-fixed border-collapse text-left text-[13px]">
                <colgroup>
                  <col className="w-[5%]" />
                  <col className="w-[14%]" />
                  <col className="w-[9%]" />
                  <col className="w-[18%]" />
                  <col className="w-[11%]" />
                  <col className="w-[8%]" />
                  <col className="w-[7%]" />
                  <col className="w-[12%]" />
                  <col className="w-[8%]" />
                  <col className="w-[14%]" />
                </colgroup>

                <thead className="bg-[#FFF3E8] text-slate-800">
                  <tr>
                    {[
                      "Sr. No.",
                      "Client Name",
                      "Client No.",
                      "Email",
                      "Project Name",
                      "Renewal Date",
                      "Total",
                      "Transaction ID",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="app-table-heading border-b border-slate-200 px-2 py-3 text-slate-700 sm:px-3"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {visibleRecords.map((row, index) => (
                    <tr
                      key={
                        row.id ??
                        row._id ??
                        `${start + index}-${valueOf(row, tableColumns[0].keys)}`
                      }
                      className={`transition hover:bg-orange-50/70 ${
                        index % 2 === 0 ? "bg-white" : "bg-[#FFFAF5]"
                      }`}
                    >
                      {tableColumns.slice(0, 8).map((column) => (
                        <td
                          key={column.label}
                          className="app-table-cell break-words border-b border-slate-100 px-2 py-3 align-top leading-5 sm:px-3"
                        >
                          {valueOf(row, column.keys) || "—"}
                        </td>
                      ))}

                      <td className="border-b border-slate-100 px-2 py-3 align-top">
                        <select
                          aria-label={`Status for ${valueOf(row, tableColumns[1].keys) || "client"}`}
                          className="w-full min-w-[76px] rounded-md border border-slate-200 bg-white px-1 py-2 text-xs"
                          value={String(
                            valueOf(row, tableColumns[8].keys) || "New"
                          )}
                          onChange={(event) => {
                            if (onStatusChange) {
                              onStatusChange(row, event.target.value);
                            } else {
                              setMessage(
                                "Connect onStatusChange to your existing status-update API."
                              );
                            }
                          }}
                        >
                          {[...new Set([
                            String(valueOf(row, tableColumns[8].keys) || "New"),
                            "New",
                            "Active",
                            "Pending",
                            "Completed",
                            "Inactive",
                          ])].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="border-b border-slate-100 px-2 py-3 align-top">
                        <button
                          type="button"
                          onClick={() => {
                            onViewDetails?.(row);
                            setSelectedClient({
                              ...row,
                              clientName: valueOf(row, [
                                "clientName",
                                "client_name",
                                "name",
                                "customer_name",
                              ]),
                              clientNo: valueOf(row, [
                                "clientNo",
                                "client_no",
                                "client_number",
                              ]),
                              alternateMobile: valueOf(row, [
                                "alternateMobile",
                                "alternate_mobile",
                                "alternateMobileNumber",
                                "alternate_mobile_number",
                              ]),
                              alternateMobile2: valueOf(row, [
                                "alternateMobile2",
                                "alternate_mobile_2",
                                "alternateMobileNumber2",
                                "alternate_mobile_number_2",
                              ]),
                              alternateMobile3: valueOf(row, [
                                "alternateMobile3",
                                "alternate_mobile_3",
                                "alternateMobileNumber3",
                                "alternate_mobile_number_3",
                              ]),
                              projectName: valueOf(row, [
                                "projectName",
                                "project_name",
                                "project",
                              ]),
                              domainName: valueOf(row, [
                                "domainName",
                                "domain_name",
                              ]),
                              renewalDate: valueOf(row, [
                                "renewalDate",
                                "renewal_date",
                              ]),
                              renewalAmount: valueOf(row, [
                                "renewalAmount",
                                "renewal_amount",
                              ]),
                              gst: valueOf(row, ["gst", "gst18", "gst_18"]),
                              total: valueOf(row, [
                                "total",
                                "total_amount",
                              ]),
                              domainBookedBy: valueOf(row, [
                                "domainBookedBy",
                                "domain_booked_by",
                              ]),
                              renewalItems: valueOf(row, [
                                "renewalItems",
                                "renewal_items",
                              ]),
                            });
                          }}
                          className="w-full whitespace-nowrap rounded-md bg-orange-500 px-2 py-2 font-semibold text-white transition hover:bg-orange-600 sm:px-3"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {visibleRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-12 text-center text-sm text-slate-500"
                      >
                        {records.length === 0
                          ? "No client data available."
                          : "No matching records. Try changing your filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Showing {filtered.length ? start + 1 : 0} to{" "}
                {Math.min(start + pageSize, filtered.length)} of{" "}
                {filtered.length} entries
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white">
                  {currentPage}
                </span>
                <span className="text-sm text-slate-500">of {totalPages}</span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-3 pt-1 text-center text-xs leading-6 text-slate-500">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
          {" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>
      <ClientDetailsModal
        isOpen={Boolean(selectedClient)}
        client={selectedClient ?? {}}
        onClose={() => setSelectedClient(null)}
      />
    </main>
  );
}
