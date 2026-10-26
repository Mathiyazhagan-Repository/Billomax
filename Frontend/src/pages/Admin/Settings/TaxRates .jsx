
import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  ArrowUpDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Printer,
  FileText,
  Columns3,
  X,
  Check,
  Info,
  ChevronDown,
} from "lucide-react";

const INITIAL_TAX_RATES = [
  { id: 1, name: "CGST", tax_rate: "8.00" },
  { id: 2, name: "SGST", tax_rate: "8.00" },
];

const INITIAL_TAX_GROUPS = [
  {
    id: 1,
    name: "GST",
    tax_rate: "16.00",
    sub_taxes: ["CGST", "SGST"],
  },
];

const PAGE_SIZES = [10, 25, 50, 100];

const DEFAULT_COLUMNS = {
  name: true,
  tax_rate: true,
  sub_taxes: true,
  action: true,
};

const formatRate = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : value;
};

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

function ExportButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#DCE4EF] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#7185A0] transition hover:border-[#FF812B] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
    >
      <Icon size={13} />
      {children}
    </button>
  );
}

function Pagination({ total, page, setPage, pageSize, setPageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pages);
  const start = total ? (safePage - 1) * pageSize + 1 : 0;
  const end = Math.min(safePage * pageSize, total);

  return (
    <div className="flex flex-col gap-4 px-4 pb-5 pt-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#19366F]">
          Showing <span className="font-semibold">{start} to {end}</span> of{" "}
          <span className="font-semibold">{total}</span> entries
        </p>

        <div className="flex items-center self-start overflow-hidden rounded-lg border border-[#DCE4EF] sm:self-auto">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage(Math.max(1, safePage - 1))}
            className="px-3 py-2 text-sm text-[#7185A0] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="flex min-w-9 items-center justify-center self-stretch bg-[#FF711A] px-3 text-sm font-bold text-white">
            {safePage}
          </span>
          <button
            type="button"
            disabled={safePage >= pages}
            onClick={() => setPage(Math.min(pages, safePage + 1))}
            className="px-3 py-2 text-sm text-[#7185A0] transition hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-[#577B9F]">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}
          className="h-9 rounded-lg border border-[#DCE4EF] bg-white px-2 text-sm text-[#19366F] outline-none focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>
    </div>
  );
}

function TaxModal({ mode, initial, rates, onClose, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [rate, setRate] = useState(initial?.tax_rate ?? "");
  const [subTaxes, setSubTaxes] = useState(
    Array.isArray(initial?.sub_taxes)
      ? initial.sub_taxes
      : initial?.sub_taxes
        ? String(initial.sub_taxes).split(",").map((item) => item.trim())
        : []
  );
  const [error, setError] = useState("");

  const isGroup = mode === "group";
  const editing = Boolean(initial);

  const inputClass =
    "mt-1.5 h-11 w-full rounded-xl border border-[#DCE4EF] bg-white px-3.5 text-sm text-[#102454] outline-none transition placeholder:text-slate-400 focus:border-[#FF711A] focus:ring-[3px] focus:ring-[#FF711A]/15";

  const submit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (
      rate === "" ||
      !Number.isFinite(Number(rate)) ||
      Number(rate) < 0 ||
      Number(rate) > 100
    ) {
      setError("Enter a tax rate between 0 and 100.");
      return;
    }

    if (
      isGroup &&
      subTaxes.length > 0 &&
      subTaxes.some((taxName) => !rates.some((tax) => tax.name === taxName))
    ) {
      setError("Select valid tax rates from the available tax rates.");
      return;
    }

    onSave({
      ...(initial ?? {}),
      name: name.trim(),
      tax_rate: formatRate(rate),
      ...(isGroup ? { sub_taxes: subTaxes } : {}),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10234F]/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-5 py-5 sm:px-6">
          <div>
            <span className="inline-flex rounded-lg bg-[#FFE9D9] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F04A13]">
              Tax configuration
            </span>
            <h2 className="mt-2 text-xl font-bold text-[#10234F]">
              {editing ? "Edit" : "Add"} {isGroup ? "Tax Group" : "Tax Rate"}
            </h2>
            <p className="mt-1 text-sm text-[#577B9F]">
              Enter the tax details below.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <label className="block">
            <span className="text-sm font-semibold text-[#19366F]">
              Name <span className="text-red-500">*</span>
            </span>
            <input
              autoFocus
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder={isGroup ? "Tax group name" : "Tax name"}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#19366F]">
              Tax Rate %
            </span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(event.target.value)}
              className={inputClass}
              placeholder="0.00"
              required
            />
          </label>

          {isGroup && (
            <fieldset>
              <legend className="text-sm font-semibold text-[#19366F]">
                Sub taxes
              </legend>
              <p className="mt-1 text-xs text-[#7185A0]">
                Select the tax rates that make up this group.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-[#E6EDF5] p-3 sm:grid-cols-2">
                {rates.map((tax) => (
                  <label
                    key={tax.id ?? tax.name}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#19366F] hover:bg-[#FFF7EF]"
                  >
                    <input
                      type="checkbox"
                      checked={subTaxes.includes(tax.name)}
                      onChange={(event) => {
                        setSubTaxes((previous) =>
                          event.target.checked
                            ? [...previous, tax.name]
                            : previous.filter((item) => item !== tax.name)
                        );
                      }}
                      className="h-4 w-4 accent-[#FF711A]"
                    />
                    <span>{tax.name}</span>
                    <span className="ml-auto text-xs text-[#7185A0]">
                      {formatRate(tax.tax_rate)}%
                    </span>
                  </label>
                ))}
                {rates.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Add tax rates before creating a tax group.
                  </p>
                )}
              </div>
            </fieldset>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#F2E8DE] bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] border border-[#DCE4EF] bg-white px-6 py-2.5 text-sm font-bold text-[#102454] transition-all hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
          >
            Close
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#FF621F] px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,98,31,0.25)] transition-all hover:bg-[#E95510] hover:shadow-[0_6px_18px_rgba(255,98,31,0.35)]"
          >
            <Check size={16} />
            {editing ? "Save Changes" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TaxTable({
  title,
  rows,
  mode,
  rates,
  onAdd,
  onEdit,
  onDelete,
  onExport,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState({ key: "name", direction: "asc" });
  const [modal, setModal] = useState(null);
  const [showColumns, setShowColumns] = useState(false);
  const [columns, setColumns] = useState({
    name: true,
    tax_rate: true,
    sub_taxes: true,
    action: true,
  });

  const isGroup = mode === "group";

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows
      .filter((row) => {
        const subTaxes = Array.isArray(row.sub_taxes)
          ? row.sub_taxes.join(", ")
          : row.sub_taxes ?? "";

        return [row.name, row.tax_rate, subTaxes].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const first = String(a[sort.key] ?? "");
        const second = String(b[sort.key] ?? "");

        const comparison =
          sort.key === "tax_rate"
            ? Number(first) - Number(second)
            : first.localeCompare(second, undefined, { sensitivity: "base" });

        return sort.direction === "asc" ? comparison : -comparison;
      });
  }, [rows, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const toggleSort = (key) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const exportRows = (format) => {
    const headings = isGroup
      ? ["Name", "Tax Rate %", "Sub taxes"]
      : ["Name", "Tax Rate %"];

    const data = filtered.map((row) =>
      isGroup
        ? [
            row.name,
            formatRate(row.tax_rate),
            Array.isArray(row.sub_taxes)
              ? row.sub_taxes.join(" + ")
              : row.sub_taxes,
          ]
        : [row.name, formatRate(row.tax_rate)]
    );

    if (format === "csv") {
      downloadCSV(
        `${isGroup ? "tax-groups" : "tax-rates"}.csv`,
        [headings, ...data]
      );
      return;
    }

    if (format === "excel") {
      if (onExport) {
        onExport(mode, "excel", filtered);
      } else {
        // Spreadsheet-compatible CSV fallback.
        downloadCSV(
          `${isGroup ? "tax-groups" : "tax-rates"}.csv`,
          [headings, ...data]
        );
      }
    }
  };

  const saveRow = async (row) => {
    if (modal?.row) {
      await onEdit(mode, row);
    } else {
      await onAdd(mode, row);
    }
    setModal(null);
  };

  const sortButton = (key, label) => (
    <button
      type="button"
      onClick={() => toggleSort(key)}
      className="flex w-full items-center justify-between gap-2 text-left text-xs font-bold text-[#19366F] transition hover:text-[#F04A13]"
    >
      {label}
      <ArrowUpDown
        size={15}
        className={
          sort.key === key ? "shrink-0 text-[#FF812B]" : "shrink-0 text-slate-300"
        }
      />
    </button>
  );

  const hasVisibleColumn = (key) => columns[key];

  return (
    <section className="overflow-visible rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_3px_8px_rgba(25,43,80,0.04)]">
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="app-section-title text-[#10234F]">
            {title}
            {isGroup && (
              <span className="ml-2 inline-flex align-middle text-[#FF812B]" title="Combination of multiple taxes">
                <Info size={16} />
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-[#577B9F]">
            {isGroup
              ? "Combination of multiple taxes"
              : "Manage the tax rates applied to your products."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ row: null })}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-[14px] bg-[#FF621F] px-6 py-2.5 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(255,98,31,0.28)] transition-all hover:bg-[#E95510] hover:shadow-[0_6px_18px_rgba(255,98,31,0.38)] active:translate-y-px lg:self-auto"
        >
          <Plus size={17} />
          Add
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 sm:px-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 whitespace-nowrap text-sm text-[#19366F]">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-[#DCE4EF] bg-white px-2 text-sm outline-none focus:border-[#FF812B]"
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </label>

            <ExportButton
              icon={Download}
              onClick={() => exportRows("csv")}
            >
              Export CSV
            </ExportButton>
            <ExportButton
              icon={FileSpreadsheet}
              onClick={() => exportRows("excel")}
            >
              Export Excel
            </ExportButton>
            <ExportButton
              icon={Printer}
              onClick={() => window.print()}
            >
              Print
            </ExportButton>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColumns((previous) => !previous)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  showColumns
                    ? "border-[#FF812B] bg-[#FFF7EF] text-[#F04A13]"
                    : "border-[#DCE4EF] bg-white text-[#7185A0] hover:border-[#FF812B] hover:bg-[#FFF7EF]"
                }`}
              >
                <Columns3 size={13} />
                Column visibility
                <ChevronDown size={12} />
              </button>

              {showColumns && (
                <div className="absolute left-0 top-full z-30 mt-2 w-52 rounded-xl border border-[#E6EDF5] bg-white p-3 shadow-xl">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[#7185A0]">
                    Show columns
                  </p>
                  {[
                    ["name", "Name"],
                    ["tax_rate", "Tax Rate %"],
                    ...(isGroup ? [["sub_taxes", "Sub taxes"]] : []),
                    ["action", "Action"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-[#19366F] hover:bg-[#FFF7EF]"
                    >
                      <input
                        type="checkbox"
                        checked={columns[key]}
                        onChange={(event) =>
                          setColumns((previous) => ({
                            ...previous,
                            [key]: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 accent-[#FF711A]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <ExportButton
              icon={FileText}
              onClick={() => {
                if (onExport) {
                  onExport(mode, "pdf", filtered);
                } else {
                  window.print();
                }
              }}
            >
              Export PDF
            </ExportButton>
          </div>

          <label className="relative block w-full xl:w-52">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search ..."
              aria-label={`Search ${title}`}
              className="h-10 w-full rounded-lg border border-[#DCE4EF] bg-white pl-9 pr-3 text-sm text-[#19366F] outline-none placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
            />
          </label>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E6EDF5]">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFFCF8]">
                {hasVisibleColumn("name") && (
                  <th className="border-b border-r border-[#E6EDF5] px-3 py-3.5 text-left">
                    {sortButton("name", "Name")}
                  </th>
                )}
                {hasVisibleColumn("tax_rate") && (
                  <th className="border-b border-r border-[#E6EDF5] px-3 py-3.5 text-left">
                    {sortButton("tax_rate", "Tax Rate %")}
                  </th>
                )}
                {isGroup && hasVisibleColumn("sub_taxes") && (
                  <th className="border-b border-r border-[#E6EDF5] px-3 py-3.5 text-left text-xs font-bold text-[#19366F]">
                    Sub taxes
                  </th>
                )}
                {hasVisibleColumn("action") && (
                  <th className="border-b border-[#E6EDF5] px-3 py-3.5 text-left text-xs font-bold text-[#19366F]">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E6EDF5]">
              {pageRows.map((row, index) => (
                <tr
                  key={row.id ?? `${row.name}-${index}`}
                  className={`transition hover:bg-[#FFF7EF] ${
                    index % 2 === 0 ? "bg-[#FFFCF8]" : "bg-white"
                  }`}
                >
                  {hasVisibleColumn("name") && (
                    <td className="border-r border-[#E6EDF5] px-3 py-3.5 font-medium text-[#19366F]">
                      {row.name || "—"}
                    </td>
                  )}
                  {hasVisibleColumn("tax_rate") && (
                    <td className="border-r border-[#E6EDF5] px-3 py-3.5 text-[#19366F]">
                      {formatRate(row.tax_rate)}
                    </td>
                  )}
                  {isGroup && hasVisibleColumn("sub_taxes") && (
                    <td className="border-r border-[#E6EDF5] px-3 py-3.5 text-[#19366F]">
                      {Array.isArray(row.sub_taxes)
                        ? row.sub_taxes.join(" + ") || "—"
                        : row.sub_taxes || "—"}
                    </td>
                  )}
                  {hasVisibleColumn("action") && (
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setModal({ row })}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF812B] px-3 py-1.5 text-xs font-semibold text-[#F04A13] transition hover:bg-[#FFF7EF]"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(mode, row)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      (columns.name ? 1 : 0) +
                      (columns.tax_rate ? 1 : 0) +
                      (isGroup && columns.sub_taxes ? 1 : 0) +
                      (columns.action ? 1 : 0) || 1
                    }
                    className="px-4 py-12 text-center"
                  >
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
                      <Search size={20} />
                    </div>
                    <p className="mt-3 font-semibold text-[#19366F]">
                      {search ? "No matching records found" : "No data available in table"}
                    </p>
                    {search && (
                      <p className="mt-1 text-xs text-[#8798AD]">
                        Try a different search term.
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        total={filtered.length}
        page={safePage}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      {modal && (
        <TaxModal
          mode={mode}
          initial={modal.row}
          rates={rates}
          onClose={() => setModal(null)}
          onSave={saveRow}
        />
      )}
    </section>
  );
}

export default function TaxRates({
  taxRates: suppliedTaxRates,
  taxGroups: suppliedTaxGroups,
  onAdd,
  onEdit,
  onDelete,
  onExport,
}) {
  const [localRates, setLocalRates] = useState(INITIAL_TAX_RATES);
  const [localGroups, setLocalGroups] = useState(INITIAL_TAX_GROUPS);

  const rates = suppliedTaxRates ?? localRates;
  const groups = suppliedTaxGroups ?? localGroups;

  const addRow = async (mode, row) => {
    if (onAdd) {
      await onAdd(mode, row);
      return;
    }

    const newRow = { ...row, id: row.id ?? Date.now() };

    if (mode === "rate" && suppliedTaxRates === undefined) {
      setLocalRates((previous) => [...previous, newRow]);
    } else if (mode === "group" && suppliedTaxGroups === undefined) {
      setLocalGroups((previous) => [...previous, newRow]);
    }
  };

  const editRow = async (mode, row) => {
    if (onEdit) {
      await onEdit(mode, row);
      return;
    }

    if (mode === "rate" && suppliedTaxRates === undefined) {
      setLocalRates((previous) =>
        previous.map((item) => (item.id === row.id ? row : item))
      );
    } else if (mode === "group" && suppliedTaxGroups === undefined) {
      setLocalGroups((previous) =>
        previous.map((item) => (item.id === row.id ? row : item))
      );
    }
  };

  const deleteRow = async (mode, row) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return;

    if (onDelete) {
      await onDelete(mode, row);
      return;
    }

    if (mode === "rate" && suppliedTaxRates === undefined) {
      setLocalRates((previous) =>
        previous.filter((item) => item.id !== row.id)
      );
    } else if (mode === "group" && suppliedTaxGroups === undefined) {
      setLocalGroups((previous) =>
        previous.filter((item) => item.id !== row.id)
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1800px] space-y-5">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <h1 className="app-page-title text-[#10234F]">
            Tax Rates
          </h1>
          <p className="text-sm text-[#577B9F]">
            Manage your tax rates
          </p>
        </header>

        <TaxTable
          title="All your tax rates"
          mode="rate"
          rows={rates}
          rates={rates}
          onAdd={addRow}
          onEdit={editRow}
          onDelete={deleteRow}
          onExport={onExport}
        />

        <TaxTable
          title="Tax groups (Combination of multiple taxes)"
          mode="group"
          rows={groups}
          rates={rates}
          onAdd={addRow}
          onEdit={editRow}
          onDelete={deleteRow}
          onExport={onExport}
        />

        <footer className="py-3 text-center text-xs leading-6 text-[#8798AD]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
          {" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>
    </main>
  );
}
