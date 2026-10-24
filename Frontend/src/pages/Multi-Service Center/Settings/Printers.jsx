
import React, { useMemo, useState } from "react";

const EMPTY_FORM = {
  printer_name: "",
  connection_type: "",
  capability_profile: "",
  characters_per_line: "",
  ip_address: "",
  port: "",
  path: "",
};

const getPrinterFields = (printer = {}) => ({
  printer_name: printer.printer_name ?? printer.name ?? "",
  connection_type: printer.connection_type ?? "",
  capability_profile: printer.capability_profile ?? "",
  characters_per_line: printer.characters_per_line ?? "",
  ip_address: printer.ip_address ?? "",
  port: printer.port ?? "",
  path: printer.path ?? "",
});

const columns = [
  { key: "printer_name", label: "Printer Name" },
  { key: "connection_type", label: "Connection Type" },
  { key: "capability_profile", label: "Capability Profile" },
  { key: "characters_per_line", label: "Characters per line" },
  { key: "ip_address", label: "IP Address" },
  { key: "port", label: "Port" },
  { key: "path", label: "Path" },
];

export default function Printer({
  printers: suppliedPrinters,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [localPrinters, setLocalPrinters] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({
    key: "printer_name",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const printers = suppliedPrinters ?? localPrinters;

  const filteredPrinters = useMemo(() => {
    const query = search.trim().toLowerCase();

    return printers
      .filter((printer) => {
        const values = [
          ...columns.map((column) => printer[column.key]),
          printer.name,
        ];

        return values.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const first = String(
          a[sort.key] ?? (sort.key === "printer_name" ? a.name : "") ?? ""
        );
        const second = String(
          b[sort.key] ?? (sort.key === "printer_name" ? b.name : "") ?? ""
        );

        const result = first.localeCompare(second, undefined, {
          numeric: true,
          sensitivity: "base",
        });

        return sort.direction === "asc" ? result : -result;
      });
  }, [printers, search, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPrinters.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visiblePrinters = filteredPrinters.slice(
    startIndex,
    startIndex + pageSize
  );

  const firstEntry = filteredPrinters.length ? startIndex + 1 : 0;
  const lastEntry = Math.min(
    startIndex + pageSize,
    filteredPrinters.length
  );

  const openAdd = () => {
    setEditingPrinter(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (printer) => {
    setEditingPrinter(printer);
    setForm(getPrinterFields(printer));
    setError("");
    setModalOpen(true);
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.printer_name.trim()) {
      setError("Printer Name is required.");
      return;
    }

    const payload = {
      ...form,
      printer_name: form.printer_name.trim(),
    };

    setSaving(true);

    try {
      if (editingPrinter) {
        const updated = { ...editingPrinter, ...payload };

        if (onEdit) {
          await onEdit(updated);
        } else if (suppliedPrinters === undefined) {
          setLocalPrinters((previous) =>
            previous.map((printer) =>
              printer.id === editingPrinter.id ? updated : printer
            )
          );
        }
      } else {
        if (onAdd) {
          await onAdd(payload);
        } else if (suppliedPrinters === undefined) {
          setLocalPrinters((previous) => [
            ...previous,
            { ...payload, id: Date.now() },
          ]);
        }
      }

      setModalOpen(false);
      setEditingPrinter(null);
      setForm(EMPTY_FORM);
      setPage(1);
    } catch (err) {
      setError(err?.message || "Unable to save printer settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (printer) => {
    const name = printer.printer_name ?? printer.name ?? "this printer";

    if (!window.confirm(`Delete "${name}"?`)) return;

    try {
      if (onDelete) {
        await onDelete(printer);
      } else if (suppliedPrinters === undefined) {
        setLocalPrinters((previous) =>
          previous.filter((item) => item.id !== printer.id)
        );
      }
    } catch (err) {
      window.alert(err?.message || "Unable to delete printer.");
    }
  };

  const toggleSort = (key) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setPage(1);
  };

  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-[#E8EDF4] bg-white px-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

  const actionClass =
    "inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-bold transition";

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1800px] space-y-5">
        {/* Page heading */}
        <header>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
            <span className="text-[11px] font-extrabold">PHARMACY · SETTINGS</span>
          </div>

          <h1 className="app-page-title text-[#10234F]">
            Printers
          </h1>

          <p className="app-description mt-1 text-[#577B9F]">
            Manage your configured printers and connection settings.
          </p>
        </header>

        {/* Main content */}
        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="app-section-title text-[#10234F]">
                All configured Printers
              </h2>
              <p className="app-description mt-1 text-[#577B9F]">
                View and manage your printer configurations.
              </p>
            </div>

            <button
              type="button"
              onClick={openAdd}
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#FF711A] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F04A13] hover:shadow-md md:self-auto"
            >
              <span className="text-xl font-normal leading-none">+</span>
              Add Printer
            </button>
          </div>

          {/* Search and page size */}
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-[#FFFCF8] px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#577B9F]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-[#E8EDF4] bg-white px-3 text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              entries
            </label>

            <label className="relative block w-full md:w-72">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#8798AD]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                aria-label="Search printers"
                className="h-10 w-full rounded-lg border border-[#E8EDF4] bg-white pl-9 pr-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          {/* Table */}
          <div className="px-4 pb-2 sm:px-6">
            <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
              <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#FFF7EF] text-[#19366F]">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="border-b border-r border-[#F2E8DE] px-3 py-4 text-[10px] font-extrabold uppercase tracking-wide last:border-r-0"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className="flex w-full items-center justify-between gap-2 text-left transition hover:text-[#F04A13]"
                        >
                          <span>{column.label}</span>
                          <span className="shrink-0 text-xs text-[#A5B1C0]">
                            {sort.key === column.key
                              ? sort.direction === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        </button>
                      </th>
                    ))}

                    <th className="min-w-[155px] border-b border-[#F2E8DE] px-3 py-4 text-[10px] font-extrabold uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2E8DE]">
                  {visiblePrinters.map((printer, index) => (
                    <tr
                      key={printer.id ?? printer.printer_name ?? index}
                      className="align-top transition hover:bg-[#FFF7EF]"
                    >
                      {columns.map((column) => {
                        const value =
                          printer[column.key] ??
                          (column.key === "printer_name"
                            ? printer.name
                            : undefined);

                        return (
                          <td
                            key={column.key}
                            className="break-words border-r border-[#F2E8DE] px-3 py-4 text-[#19366F] last:border-r-0"
                          >
                            {value === null ||
                            value === undefined ||
                            value === ""
                              ? "—"
                              : String(value)}
                          </td>
                        );
                      })}

                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(printer)}
                            className={`${actionClass} border-[#D8E8FF] text-[#3478F6] hover:bg-[#EAF3FF]`}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(printer)}
                            className={`${actionClass} border-[#FFD9D2] text-[#C43D32] hover:bg-[#FFF0ED]`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {visiblePrinters.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="bg-[#FFFCF8] px-4 py-1"
                      >
                        <div className="py-9 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#F04A13]">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              className="h-6 w-6"
                            >
                              <rect
                                x="4"
                                y="7"
                                width="16"
                                height="10"
                                rx="2"
                              />
                              <path d="M7 17v3h10v-3M8 10h8M8 13h5" />
                              <path d="M7 4h10v3H7z" />
                            </svg>
                          </div>

                          <p className="mt-3 font-semibold text-[#10234F]">
                            {search
                              ? "No matching printers found"
                              : "No printers configured yet"}
                          </p>

                          <p className="mt-1 text-sm text-[#577B9F]">
                            {search
                              ? "Try a different search term."
                              : "Add a printer to see its configuration here."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer and pagination */}
          <div className="flex flex-col gap-4 border-t border-[#F2E8DE] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-[#577B9F]">
              Showing{" "}
              <span className="font-semibold text-[#10234F]">
                {firstEntry} to {lastEntry}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredPrinters.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((previous) => previous - 1)}
                className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="min-w-10 rounded-lg bg-[#FF711A] px-3 py-2 text-center text-sm font-bold text-white">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
                className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <footer className="py-3 text-center text-xs leading-6 text-[#8798AD]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
          {" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>

      {/* Add / Edit printer modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10234F]/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="my-auto w-full max-w-2xl rounded-2xl border border-[#F2E8DE] bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-5 py-5 sm:px-6">
              <div>
                <p className="inline-flex rounded-lg bg-[#FFE9D9] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#F04A13]">
                  Printer configuration
                </p>
                <h2 className="app-section-title mt-2 text-[#10234F]">
                  {editingPrinter ? "Edit Printer" : "Add Printer"}
                </h2>
                <p className="mt-1 text-sm text-[#577B9F]">
                  Configure the printer connection and output settings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
                className="rounded-lg px-3 py-1 text-2xl text-[#8798AD] transition hover:bg-[#FFF1E5] hover:text-[#19366F]"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
              {columns.map((column) => (
                <label
                  key={column.key}
                  className={
                    column.key === "path" ||
                    column.key === "capability_profile"
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <span className="text-[13px] font-semibold text-[#19366F]">
                    {column.label}
                    {column.key === "printer_name" && (
                      <span className="text-[#C43D32]"> *</span>
                    )}
                  </span>

                  <input
                    name={column.key}
                    value={form[column.key]}
                    onChange={updateForm}
                    required={column.key === "printer_name"}
                    type={
                      column.key === "characters_per_line" ||
                      column.key === "port"
                        ? "number"
                        : "text"
                    }
                    min={
                      column.key === "characters_per_line" ||
                      column.key === "port"
                        ? "0"
                        : undefined
                    }
                    placeholder={`Enter ${column.label.toLowerCase()}`}
                    className={inputClass}
                  />
                </label>
              ))}

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-[#FFF0ED] px-3 py-2 text-sm text-[#C43D32] sm:col-span-2"
                >
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#F2E8DE] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[#E8EDF4] px-5 py-2.5 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#FF711A] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#F04A13] hover:shadow-md disabled:cursor-wait disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingPrinter
                    ? "Save Changes"
                    : "Add Printer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
