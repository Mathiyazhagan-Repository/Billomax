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
import { getBusinessSampleAgents } from "../../../utils/businessStorage.js";

const initialAgents = [
  {
    id: 1,
    name: "miss pallavi P",
    email: "pallavi@gmail.com",
    contactNumber: "9110442392",
    address: "srinager",
    commission: "15.00",
  },
  {
    id: 2,
    name: "mr manyatha tanya",
    email: "manyatha@gmail.com",
    contactNumber: "9110442096",
    address: "3443 Gopal Nager Najafgarh Delhi 110043",
    commission: "15.00",
  },
  {
    id: 3,
    name: "ms bhumi pal",
    email: "pal@gmail.com",
    contactNumber: "9844756289",
    address: "2nd Main Road, 6th Cross, byatarayanapura,banglore",
    commission: "23.00",
  },
];

const columns = [
  { key: "name", label: "Name", width: "11%" },
  { key: "email", label: "Email", width: "15%" },
  { key: "contactNumber", label: "Contact Number", width: "11%" },
  { key: "address", label: "Address", width: "28%" },
  { key: "commission", label: "Sales Commission Percentage (%)", width: "20%" },
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

function AgentModal({ agent, onClose, onSave }) {
  const [form, setForm] = useState({
    name: agent?.name ?? "",
    email: agent?.email ?? "",
    contactNumber: agent?.contactNumber ?? "",
    address: agent?.address ?? "",
    commission: agent?.commission ?? "",
  });

  const fields = [
    ["name", "Name", "text"],
    ["email", "Email", "email"],
    ["contactNumber", "Contact Number", "tel"],
    ["address", "Address", "text"],
    ["commission", "Sales Commission Percentage (%)", "number"],
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      id: agent?.id ?? Date.now(),
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
        className="w-full max-w-lg rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#283961]">
            {agent ? "Edit sales commission agent" : "Add sales commission agent"}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(([key, label, type]) => (
            <label
              key={key}
              className={`block text-xs font-semibold text-[#63768D] ${
                key === "address" ? "sm:col-span-2" : ""
              }`}
            >
              {label}
              <input
                type={type}
                required
                min={type === "number" ? "0" : undefined}
                max={type === "number" ? "100" : undefined}
                step={type === "number" ? "0.01" : undefined}
                value={form[key]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                placeholder={`Enter ${label.toLowerCase()}`}
                className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B] focus:ring-1 focus:ring-[#FF964B]/20"
              />
            </label>
          ))}
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
            className="h-9 rounded-md bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-xs font-semibold text-white hover:brightness-105"
          >
            {agent ? "Save changes" : "Add agent"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SCA({
  onAddAgent,
  onEditAgent,
  editedAgents = [],
}) {
  const [agents, setAgents] = useState(() =>
    editedAgents.reduce((currentAgents, editedAgent) => {
      const exists = currentAgents.some(
        (agent) => agent.id === editedAgent.id
      );
      return exists
        ? currentAgents.map((agent) =>
            agent.id === editedAgent.id
              ? { ...agent, ...editedAgent.data }
              : agent
          )
        : [...currentAgents, editedAgent.data];
    }, getBusinessSampleAgents(initialAgents))
  );
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [editingAgent, setEditingAgent] = useState(null);
  const [addingAgent, setAddingAgent] = useState(false);
  const [deletingAgent, setDeletingAgent] = useState(null);

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchingAgents = agents.filter((agent) =>
      Object.values(agent).some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );

    if (!sort) return matchingAgents;

    return [...matchingAgents].sort((first, second) => {
      const comparison = String(first[sort.key] ?? "").localeCompare(
        String(second[sort.key] ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" }
      );
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [agents, search, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredAgents.length / Number(pageSize))
  );
  const pageAgents = filteredAgents.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize)
  );
  const visibleTableColumns = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );
  const firstEntry = filteredAgents.length
    ? (page - 1) * Number(pageSize) + 1
    : 0;
  const lastEntry = Math.min(page * Number(pageSize), filteredAgents.length);

  const saveAgent = (agent) => {
    setAgents((current) => {
      const exists = current.some((item) => item.id === agent.id);
      return exists
        ? current.map((item) => (item.id === agent.id ? agent : item))
        : [...current, agent];
    });
    setAddingAgent(false);
    setEditingAgent(null);
  };

  const toggleSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const deleteAgent = () => {
    setAgents((current) =>
      current.filter((agent) => agent.id !== deletingAgent.id)
    );
    setDeletingAgent(null);
    setPage(1);
  };

  const exportCSV = () => {
    if (!filteredAgents.length) {
      alert("No sales commission agents available to export.");
      return;
    }

    const csv = [
      visibleTableColumns.map((column) => column.label).join(","),
      ...filteredAgents.map((agent) =>
        visibleTableColumns
          .map(
            (column) =>
              `"${String(agent[column.key] ?? "").replace(/"/g, '""')}"`
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
    link.download = "sales-commission-agents.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#283961] sm:px-5">
      <h1 className="mb-4 text-[24px] font-semibold leading-7 text-black">
        Sales Commission Agents
      </h1>

      <section className="min-w-0 overflow-visible rounded-[17px] border border-[#F0E0CF] bg-white p-4 shadow-[0_8px_24px_rgba(120,75,35,0.07)] sm:p-5">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() =>
              onAddAgent ? onAddAgent() : setAddingAgent(true)
            }
            className="inline-flex h-[38px] shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-xs font-semibold text-white shadow-sm transition hover:brightness-105"
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
                className="h-[30px] w-[75px] border border-[#CFD7E2] bg-white px-2 text-xs text-[#63768D] outline-none focus:border-[#FF964B]"
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
                <div className="absolute left-0 top-full z-30 mt-2 w-48 rounded-lg border border-[#F0E0CF] bg-white p-3 shadow-lg">
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
                        className="accent-[#FF711A]"
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
              aria-label="Search sales commission agents"
              className="h-[30px] w-full border border-[#CFD7E2] bg-white pl-7 pr-2 text-[12px] outline-none focus:border-[#FF964B]"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px] table-fixed border-collapse text-left text-[13px]">
            <colgroup>
              {visibleTableColumns.map((column) => (
                <col key={column.key} style={{ width: column.width }} />
              ))}
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr className="bg-white">
                {visibleTableColumns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="h-[48px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
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
                  className="h-[48px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageAgents.map((agent) => (
                <tr
                  key={agent.id}
                  className="odd:bg-[#F8F8F8] even:bg-white hover:bg-[#FFF8F0]"
                >
                  {visibleTableColumns.map((column) => (
                    <td
                      key={column.key}
                      className="h-[47px] break-words border border-[#E9EAF0] px-2 py-2 align-top text-[#283961]"
                    >
                      {column.key === "commission"
                        ? Number(agent.commission).toFixed(2)
                        : agent[column.key]}
                    </td>
                  ))}
                  <td className="h-[47px] border border-[#E9EAF0] px-2 py-2 align-top">
                    <div className="flex flex-col items-start gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          onEditAgent
                            ? onEditAgent(agent)
                            : setEditingAgent(agent)
                        }
                        className="inline-flex h-[25px] items-center gap-1 rounded-md border border-[#716BFF] px-2 text-[11px] text-[#625BFF] transition hover:bg-[#F2F1FF]"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingAgent(agent)}
                        className="inline-flex h-[25px] items-center gap-1 rounded-md border border-[#FF4D5A] px-2 text-[11px] text-[#F04452] transition hover:bg-[#FFF0F1]"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!pageAgents.length && (
                <tr>
                  <td
                    colSpan={visibleTableColumns.length + 1}
                    className="h-16 border border-[#E9EAF0] text-center text-xs text-[#63768D]"
                  >
                    No sales commission agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#283961]">
          <p>
            Showing {firstEntry} to {lastEntry} of {filteredAgents.length} entries
          </p>
          <div className="flex items-center">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="h-[34px] rounded-l border border-[#D9E0E8] px-3 text-[#63768D] hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex h-[34px] min-w-8 items-center justify-center bg-[#3983F6] px-2 text-white">
              {page}
            </span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              className="h-[34px] rounded-r border border-[#D9E0E8] px-3 text-[#63768D] hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {(addingAgent || editingAgent) && (
        <AgentModal
          agent={editingAgent}
          onClose={() => {
            setAddingAgent(false);
            setEditingAgent(null);
          }}
          onSave={saveAgent}
        />
      )}
      {deletingAgent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setDeletingAgent(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-agent-title"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-agent-title"
              className="text-lg font-semibold text-[#283961]"
            >
              Delete sales commission agent?
            </h2>
            <p className="mt-2 text-xs text-[#63768D]">
              This will permanently remove {deletingAgent.name}.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingAgent(null)}
                className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteAgent}
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