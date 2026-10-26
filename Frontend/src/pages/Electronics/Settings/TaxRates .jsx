
import React, { useMemo, useState } from "react";

const INITIAL_TAX_RATES = [{ id: 1, name: "GST", tax_rate: "10.00" }];
const INITIAL_TAX_GROUPS = [];

const PAGE_SIZES = [10, 25, 50, 100];

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

function ExportControls({ onExport, onPrint }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => onExport("csv")}
        className="rounded-lg border border-[#E8EDF4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]">
        ▤ Export CSV
      </button>
      <button type="button" onClick={() => onExport("excel")}
        className="rounded-lg border border-[#E8EDF4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]">
        ▣ Export Excel
      </button>
      <button type="button" onClick={onPrint}
        className="rounded-lg border border-[#E8EDF4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] transition hover:border-[#FF8A37] hover:bg-[#FFF7EF] hover:text-[#F04A13]">
        ▤ Print
      </button>
    </div>
  );
}

function Pagination({ total, page, setPage, pageSize, setPageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-4 border-t border-[#F2E8DE] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#577B9F]">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="h-9 rounded-lg border border-[#E8EDF4] bg-white px-2 text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span>entries</span>
        <span className="ml-1">
          Showing           <strong className="text-[#19366F]">{start} to {end}</strong> of{" "}
          <strong className="text-[#19366F]">{total}</strong> entries
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="min-w-9 rounded-lg bg-[#FF711A] px-3 py-2 text-center text-sm font-bold text-white">
          {page}
        </span>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
          className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function TaxModal({ mode, initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [rate, setRate] = useState(initial?.tax_rate ?? "");
  const [subTaxes, setSubTaxes] = useState(
    Array.isArray(initial?.sub_taxes)
      ? initial.sub_taxes.join(", ")
      : initial?.sub_taxes ?? ""
  );
  const [error, setError] = useState("");

  const isGroup = mode === "group";
  const editing = Boolean(initial);

  const submit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (rate === "" || !Number.isFinite(Number(rate)) || Number(rate) < 0) {
      setError("Enter a valid, non-negative tax rate.");
      return;
    }

    if (Number(rate) > 100) {
      setError("Tax rate cannot exceed 100%.");
      return;
    }

    onSave({
      ...(initial ?? {}),
      name: name.trim(),
      tax_rate: formatRate(rate),
      ...(isGroup
        ? {
            sub_taxes: subTaxes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          }
        : {}),
    });
  };

  const inputClass =
    "mt-1.5 h-11 w-full rounded-xl border border-[#DCE4EF] bg-white px-3.5 text-sm text-[#102454] outline-none transition focus:border-[#FF711A] focus:ring-[3px] focus:ring-[#FF711A]/15";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10234F]/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-2xl"
      >
        <div className="border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-6 py-5">
          <p className="inline-flex rounded-lg bg-[#FFE9D9] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#F04A13]">
            Tax configuration
          </p>
          <h2 className="app-section-title mt-2 text-[#10234F]">
            {editing ? "Edit" : "Add"} {isGroup ? "Tax Group" : "Tax Rate"}
          </h2>
          <p className="mt-1 text-sm text-[#577B9F]">
            Enter the tax details below.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <label className="block">
            <span className="text-[13px] font-semibold text-[#19366F]">Name *</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder={isGroup ? "Tax group name" : "Tax name"}
              required
            />
          </label>

          <label className="block">
            <span className="text-[13px] font-semibold text-[#19366F]">
              Tax Rate %
            </span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className={inputClass}
              placeholder="0.00"
              required
            />
          </label>

          {isGroup && (
            <label className="block">
              <span className="text-[13px] font-semibold text-[#19366F]">
                Sub taxes
              </span>
              <input
                value={subTaxes}
                onChange={(e) => setSubTaxes(e.target.value)}
                className={inputClass}
                placeholder="Tax A, Tax B"
              />
              <p className="mt-1.5 text-xs text-[#577B9F]">
                Enter existing tax names separated by commas.
              </p>
            </label>
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-[#FFF0ED] px-3 py-2 text-sm text-[#C43D32]">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#F2E8DE] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] border border-[#DCE4EF] bg-white px-6 py-2.5 text-sm font-bold text-[#102454] transition-all hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-[12px] bg-[#FF621F] px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,98,31,0.25)] transition-all hover:bg-[#E95510] hover:shadow-[0_6px_18px_rgba(255,98,31,0.35)]"
          >
            {editing ? "Save Changes" : "Add"}
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
  onAdd,
  onEdit,
  onDelete,
  initialPageSize = 25,
  onExport,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState({ key: "name", direction: "asc" });
  const [modal, setModal] = useState(null);

  const isGroup = mode === "group";

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows
      .filter((row) => {
        const subTaxes = Array.isArray(row.sub_taxes)
          ? row.sub_taxes.join(", ")
          : row.sub_taxes ?? "";

        return [
          row.name,
          row.tax_rate,
          subTaxes,
        ].some((value) => String(value ?? "").toLowerCase().includes(query));
      })
      .sort((a, b) => {
        const first = String(a[sort.key] ?? "");
        const second = String(b[sort.key] ?? "");
        const comparison = sort.key === "tax_rate"
          ? Number(first) - Number(second)
          : first.localeCompare(second, undefined, { sensitivity: "base" });

        return sort.direction === "asc" ? comparison : -comparison;
      });
  }, [rows, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const exportRows = (format) => {
    if (format === "csv") {
      const headings = isGroup
        ? ["Name", "Tax Rate %", "Sub taxes"]
        : ["Name", "Tax Rate %"];

      downloadCSV(
        `${isGroup ? "tax-groups" : "tax-rates"}.csv`,
        [headings, ...filtered.map((row) =>
          isGroup
            ? [
                row.name,
                row.tax_rate,
                Array.isArray(row.sub_taxes)
                  ? row.sub_taxes.join(", ")
                  : row.sub_taxes,
              ]
            : [row.name, row.tax_rate]
        )]
      );
      return;
    }

    if (format === "excel") {
      onExport?.(mode, "excel", filtered);
      if (!onExport) {
        window.alert("Connect your existing Excel export utility to enable Excel export.");
      }
    }
  };

  const toggleSort = (key) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const saveRow = async (row) => {
    if (modal?.row) {
      await onEdit?.(mode, row);
    } else {
      await onAdd?.(mode, row);
    }
    setModal(null);
  };

  const thClass =
    "border-b border-r border-[#F2E8DE] px-3 py-3 text-left text-[10px] font-extrabold uppercase tracking-wide last:border-r-0";

  const sortButton = (key, label) => (
    <button
      type="button"
      onClick={() => toggleSort(key)}
      className="flex w-full items-center justify-between gap-2 text-left hover:text-[#F04A13]"
    >
      <span>{label}</span>
      <span className="shrink-0 text-xs text-[#A5B1C0]">
        {sort.key === key ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
      <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="app-section-title text-[#10234F]">
            {title}
            {isGroup && (
              <span className="ml-2 align-middle text-sm text-[#3478F6]" title="Combination of multiple taxes">
                ⓘ
              </span>
            )}
          </h2>
          <p className="app-description mt-1 text-[#577B9F]">
            {isGroup
              ? "Combine existing tax rates into reusable tax groups."
              : "Review and manage the tax rates applied to your products."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ row: null })}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-[14px] bg-[#FF621F] px-6 py-2.5 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(255,98,31,0.28)] transition-all hover:bg-[#E95510] hover:shadow-[0_6px_18px_rgba(255,98,31,0.38)] active:translate-y-px sm:self-auto"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="flex flex-col gap-3 border-b border-[#F2E8DE] bg-[#FFFCF8] px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#577B9F]">
            Show
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-9 rounded-lg border border-[#E8EDF4] bg-white px-2 text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            entries
          </label>
          <ExportControls
            onExport={exportRows}
            onPrint={() => window.print()}
          />
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search ..."
          aria-label={`Search ${title}`}
          className="h-10 w-full rounded-lg border border-[#E8EDF4] bg-white px-3 text-sm text-[#19366F] outline-none placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10 sm:w-52"
        />
      </div>

      <div className="px-4 pb-2 sm:px-6">
        <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF7EF] text-[#19366F]">
                <th className={thClass}>{sortButton("name", "Name")}</th>
                <th className={thClass}>{sortButton("tax_rate", "Tax Rate %")}</th>
                {isGroup && <th className={thClass}>Sub taxes</th>}
                <th className={thClass}>Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F2E8DE]">
              {pageRows.map((row, index) => (
                <tr
                  key={row.id ?? `${row.name}-${index}`}
                  className="transition odd:bg-white even:bg-[#FFFCF8] hover:bg-[#FFF7EF]"
                >
                  <td className="border-r border-[#F2E8DE] px-3 py-3.5 font-semibold text-[#19366F]">
                    {row.name || "—"}
                  </td>
                  <td className="border-r border-[#F2E8DE] px-3 py-3.5 text-[#577B9F]">
                    {formatRate(row.tax_rate)}
                  </td>
                  {isGroup && (
                    <td className="border-r border-[#F2E8DE] px-3 py-3.5 text-[#577B9F]">
                      {Array.isArray(row.sub_taxes)
                        ? row.sub_taxes.join(", ") || "—"
                        : row.sub_taxes || "—"}
                    </td>
                  )}
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setModal({ row })}
                        className="rounded-lg border border-[#D8E8FF] px-3 py-1.5 text-xs font-bold text-[#3478F6] transition hover:bg-[#EAF3FF]"
                      >
                        ✎ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(mode, row)}
                        className="rounded-lg border border-[#FFD9D2] px-3 py-1.5 text-xs font-bold text-[#C43D32] transition hover:bg-[#FFF0ED]"
                      >
                        ▣ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={isGroup ? 4 : 3}
                    className="bg-[#FFFCF8] px-4 py-1"
                  >
                    <div className="py-8 text-center">
                      <p className="font-semibold text-[#19366F]">
                        {search ? "No matching records found" : "No data available in table"}
                      </p>
                      {search && (
                        <p className="mt-1 text-xs text-[#8798AD]">
                          Try a different search term.
                        </p>
                      )}
                    </div>
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
        previous.map((item) => item.id === row.id ? row : item)
      );
    } else if (mode === "group" && suppliedTaxGroups === undefined) {
      setLocalGroups((previous) =>
        previous.map((item) => item.id === row.id ? row : item)
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
      setLocalRates((previous) => previous.filter((item) => item.id !== row.id));
    } else if (mode === "group" && suppliedTaxGroups === undefined) {
      setLocalGroups((previous) => previous.filter((item) => item.id !== row.id));
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1800px] space-y-5">
        <header>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
            <span className="text-[11px] font-extrabold">PHARMACY · SETTINGS</span>
          </div>
          <h1 className="app-page-title text-[#10234F]">
            Tax Rates
          </h1>
          <p className="app-description mt-1 text-[#577B9F]">
            Manage your tax rates and tax groups.
          </p>
        </header>

        <TaxTable
          title="All your tax rates"
          mode="rate"
          rows={rates}
          onAdd={addRow}
          onEdit={editRow}
          onDelete={deleteRow}
          onExport={onExport}
        />

        <TaxTable
          title="Tax groups (Combination of multiple taxes)"
          mode="group"
          rows={groups}
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
