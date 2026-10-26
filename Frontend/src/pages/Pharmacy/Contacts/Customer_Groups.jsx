import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Columns3,
  FileDown,
  FileSpreadsheet,
  FileText,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { getBusinessSampleCustomerGroups } from "../../../utils/businessStorage.js";

const initialGroups = [
  {
    id: 1,
    name: "health",
    calculationPercentage: "",
    sellingPriceGroup: "",
  },
  {
    id: 2,
    name: "pills",
    calculationPercentage: "50",
    sellingPriceGroup: "--",
  },
];

const columns = [
  { key: "name", label: "Customer Group Name" },
  { key: "calculationPercentage", label: "Calculation Percentage (%)" },
  { key: "sellingPriceGroup", label: "Selling Price Group" },
];

function ExportButton({ icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[25px] shrink-0 items-center gap-1 rounded-md border border-[#AAB9CC] bg-white px-2 text-[11px] font-medium text-[#8798AD] transition hover:border-[#FF964B] hover:text-[#F5852A]"
    >
      <Icon size={11} />
      {children}
    </button>
  );
}

function CustomerGroupModal({ group, onClose, onSave }) {
  const [form, setForm] = useState({
    name: group?.name ?? "",
    calculationPercentage: group?.calculationPercentage ?? "",
    sellingPriceGroup: group?.sellingPriceGroup ?? "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      id: group?.id ?? Date.now(),
      name: form.name.trim(),
      calculationPercentage: form.calculationPercentage,
      sellingPriceGroup: form.sellingPriceGroup.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#283961]">
            {group ? "Edit Customer Group" : "Add Customer Group"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#7F8FA4] hover:bg-[#FFF0E3]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-semibold text-[#63768D]">
            Customer Group Name
            <input
              required
              autoFocus
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Enter customer group name"
              className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B] focus:ring-1 focus:ring-[#FF964B]/20"
            />
          </label>
          <label className="block text-xs font-semibold text-[#63768D]">
            Calculation Percentage (%)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.calculationPercentage}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  calculationPercentage: event.target.value,
                }))
              }
              placeholder="Optional"
              className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B] focus:ring-1 focus:ring-[#FF964B]/20"
            />
          </label>
          <label className="block text-xs font-semibold text-[#63768D]">
            Selling Price Group
            <input
              value={form.sellingPriceGroup}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sellingPriceGroup: event.target.value,
                }))
              }
              placeholder="Optional"
              className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B] focus:ring-1 focus:ring-[#FF964B]/20"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-9 rounded-md bg-gradient-to-r from-[#5145EF] to-[#4D8FF7] px-4 text-xs font-semibold text-white hover:brightness-105"
          >
            {group ? "Save changes" : "Add group"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Customer_Groups() {
  const [groups, setGroups] = useState(() => getBusinessSampleCustomerGroups(initialGroups));
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [editingGroup, setEditingGroup] = useState(null);
  const [addingGroup, setAddingGroup] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(null);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = groups.filter((group) =>
      Object.values(group).some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );

    if (!sort) return filtered;

    return [...filtered].sort((first, second) => {
      const comparison = String(first[sort.key] ?? "").localeCompare(
        String(second[sort.key] ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" }
      );
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [groups, search, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredGroups.length / Number(pageSize))
  );
  const pageGroups = filteredGroups.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize)
  );
  const visibleTableColumns = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );
  const firstEntry = filteredGroups.length
    ? (page - 1) * Number(pageSize) + 1
    : 0;
  const lastEntry = Math.min(page * Number(pageSize), filteredGroups.length);

  const saveGroup = (group) => {
    setGroups((current) => {
      const exists = current.some((item) => item.id === group.id);
      return exists
        ? current.map((item) => (item.id === group.id ? group : item))
        : [...current, group];
    });
    setAddingGroup(false);
    setEditingGroup(null);
  };

  const toggleSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const exportCSV = () => {
    if (!filteredGroups.length) {
      alert("No customer groups available to export.");
      return;
    }

    const csv = [
      visibleTableColumns.map((column) => column.label).join(","),
      ...filteredGroups.map((group) =>
        visibleTableColumns
          .map(
            (column) =>
              `"${String(group[column.key] ?? "--").replace(/"/g, '""')}"`
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
    link.download = "customer-groups.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteGroup = () => {
    setGroups((current) =>
      current.filter((group) => group.id !== deletingGroup.id)
    );
    setDeletingGroup(null);
    setPage(1);
  };

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#283961] sm:px-5">
      <h1 className="mb-4 text-[24px] font-semibold leading-7 text-black">
        Customer Groups
      </h1>

      <section className="min-w-0 flex-1 overflow-visible rounded-[17px] border border-[#F0E0CF] bg-white p-4 shadow-[0_8px_24px_rgba(120,75,35,0.07)] sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[21px] font-semibold leading-7 text-[#FFA01A]">
            All Customer Groups
          </h2>
          <button
            type="button"
            onClick={() => setAddingGroup(true)}
            className="inline-flex h-[38px] shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#5145EF] to-[#4D8FF7] px-4 text-xs font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="mb-5 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 whitespace-nowrap text-xs">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value);
                  setPage(1);
                }}
                className="h-[30px] w-[68px] border border-[#CFD7E2] bg-white px-2 text-xs text-[#63768D] outline-none focus:border-[#FF964B]"
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
            <ExportButton
              icon={FileSpreadsheet}
              onClick={() =>
                alert("Excel export is not configured yet. Use Export CSV.")
              }
            >
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
                Column visibility
              </ExportButton>
              {columnsOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 w-56 rounded-lg border border-[#F0E0CF] bg-white p-3 shadow-lg">
                  <p className="mb-2 text-xs font-semibold text-[#283961]">
                    Show columns
                  </p>
                  {columns.map((column) => (
                    <label
                      key={column.key}
                      className="flex cursor-pointer items-center gap-2 py-1.5 text-xs text-[#63768D]"
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
                        className="accent-[#5145EF]"
                      />
                      {column.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <ExportButton
              icon={FileDown}
              onClick={() =>
                alert("PDF export is not configured yet. Use Print to save as PDF.")
              }
            >
              Export PDF
            </ExportButton>
          </div>

          <div className="relative w-full shrink-0 xl:w-[167px]">
            <Search
              size={12}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-[#91A0B3]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search ..."
              aria-label="Search customer groups"
              className="h-[30px] w-full border border-[#CFD7E2] bg-white pl-7 pr-2 text-[12px] outline-none focus:border-[#FF964B]"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[680px] table-fixed border-collapse text-left text-[12px]">
            <colgroup>
              {visibleTableColumns.map((column) => (
                <col
                  key={column.key}
                  style={{
                    width:
                      column.key === "name"
                        ? "27%"
                        : column.key === "calculationPercentage"
                          ? "30%"
                          : column.key === "sellingPriceGroup"
                            ? "20%"
                            : "23%",
                  }}
                />
              ))}
              <col style={{ width: "23%" }} />
            </colgroup>
            <thead>
              <tr className="bg-white">
                {visibleTableColumns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="h-[34px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="flex w-full items-center justify-between gap-1 text-left"
                    >
                      {column.label}
                      <ArrowUpDown
                        size={13}
                        className={
                          sort?.key === column.key
                            ? "shrink-0 text-[#63768D]"
                            : "shrink-0 text-[#CDD1D7]"
                        }
                      />
                    </button>
                  </th>
                ))}
                <th
                  scope="col"
                  className="h-[34px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageGroups.map((group) => (
                <tr
                  key={group.id}
                  className="odd:bg-[#F8F8F8] even:bg-white hover:bg-[#FFF8F0]"
                >
                  {visibleTableColumns.map((column) => (
                    <td
                      key={column.key}
                      className="h-[40px] break-words border border-[#E9EAF0] px-2 text-[#283961]"
                    >
                      {group[column.key] || "--"}
                    </td>
                  ))}
                  <td className="h-[40px] border border-[#E9EAF0] px-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingGroup(group)}
                        className="inline-flex h-[25px] items-center gap-1 rounded-md border border-[#716BFF] px-2 text-[11px] text-[#625BFF] transition hover:bg-[#F2F1FF]"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingGroup(group)}
                        className="inline-flex h-[25px] items-center gap-1 rounded-md border border-[#FF4D5A] px-2 text-[11px] text-[#F04452] transition hover:bg-[#FFF0F1]"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!pageGroups.length && (
                <tr>
                  <td
                    colSpan={visibleTableColumns.length + 1}
                    className="h-16 border border-[#E9EAF0] text-center text-xs text-[#63768D]"
                  >
                    No customer groups found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#283961]">
          <p>
            Showing {firstEntry} to {lastEntry} of {filteredGroups.length} entries
          </p>
          <div className="flex items-center">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="h-[30px] rounded-l border border-[#D9E0E8] px-3 text-[#63768D] hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex h-[30px] min-w-[30px] items-center justify-center bg-[#3983F6] px-2 text-white">
              {page}
            </span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              className="h-[30px] rounded-r border border-[#D9E0E8] px-3 text-[#63768D] hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <footer className="mt-auto pt-6 text-center text-[11px] text-[#71839A]">
        Billomax - Your Trusted Partner in Billing & Invoicing - Version 6.3 |
        Copyright © 2026 All rights reserved.
      </footer>

      {(addingGroup || editingGroup) && (
        <CustomerGroupModal
          group={editingGroup}
          onClose={() => {
            setAddingGroup(false);
            setEditingGroup(null);
          }}
          onSave={saveGroup}
        />
      )}
      {deletingGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setDeletingGroup(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-customer-group-title"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-customer-group-title"
              className="text-lg font-semibold text-[#283961]"
            >
              Delete customer group?
            </h2>
            <p className="mt-2 text-xs text-[#63768D]">
              This will permanently remove {deletingGroup.name}.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingGroup(null)}
                className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteGroup}
                className="h-9 rounded-md bg-[#F04452] px-4 text-xs font-semibold text-white hover:bg-[#DF333D]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}