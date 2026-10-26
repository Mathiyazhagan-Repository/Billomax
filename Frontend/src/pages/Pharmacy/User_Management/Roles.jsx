import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { getBusinessSampleRoles } from "../../../utils/businessStorage.js";

const initialRoles = [
  { id: 1, name: "Admin", protected: true },
  { id: 2, name: "Cashier", protected: false },
  { id: 3, name: "Sale man", protected: false },
];

function RoleModal({ role, readOnly = false, onClose, onSave }) {
  const [name, setName] = useState(role?.name ?? "");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSave({
      id: role?.id ?? Date.now(),
      name: trimmedName,
      protected: false,
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
            {readOnly ? "Role details" : role ? "Edit role" : "Add role"}
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

        <label className="block text-xs font-semibold text-[#63768D]">
          Role name
          <input
            autoFocus={!readOnly}
            required
            readOnly={readOnly}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter role name"
            className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B] focus:ring-1 focus:ring-[#FF964B]/20 read-only:bg-[#F8FAFD]"
          />
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
          >
            {readOnly ? "Close" : "Cancel"}
          </button>
          {!readOnly && (
            <button
              type="submit"
              className="h-9 rounded-md bg-gradient-to-r from-[#5145EF] to-[#4D8FF7] px-4 text-xs font-semibold text-white hover:brightness-105"
            >
              {role ? "Save changes" : "Add role"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function Roles() {
  const [roles, setRoles] = useState(() => getBusinessSampleRoles(initialRoles));
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState(null);
  const [addingRole, setAddingRole] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewingRole, setViewingRole] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchingRoles = roles.filter((role) =>
      role.name.toLowerCase().includes(query)
    );

    if (!sortDirection) return matchingRoles;

    return [...matchingRoles].sort((first, second) => {
      const comparison = first.name.localeCompare(second.name, undefined, {
        sensitivity: "base",
      });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [roles, search, sortDirection]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRoles.length / Number(pageSize))
  );
  const pageRoles = filteredRoles.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize)
  );
  const firstEntry = filteredRoles.length
    ? (page - 1) * Number(pageSize) + 1
    : 0;
  const lastEntry = Math.min(page * Number(pageSize), filteredRoles.length);

  const saveRole = (role) => {
    setRoles((current) => {
      const exists = current.some((item) => item.id === role.id);
      return exists
        ? current.map((item) => (item.id === role.id ? role : item))
        : [...current, role];
    });
    setAddingRole(false);
    setEditingRole(null);
  };

  const deleteRole = () => {
    setRoles((current) =>
      current.filter((role) => role.id !== deletingRole.id)
    );
    setDeletingRole(null);
    setPage(1);
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#283961] sm:px-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-[24px] font-semibold leading-7 text-black">
          Roles
        </h1>
        <p className="text-[14px] text-[#63768D]">Manage roles</p>
      </div>

      <section className="min-w-0 overflow-visible rounded-[17px] border border-[#F0E0CF] bg-white p-4 shadow-[0_8px_24px_rgba(120,75,35,0.07)] sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[21px] font-semibold leading-7 text-[#FFA01A]">
            All roles
          </h2>
          <button
            type="button"
            onClick={() => setAddingRole(true)}
            className="inline-flex h-[38px] shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#5145EF] to-[#4D8FF7] px-4 text-xs font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
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

          <div className="relative w-full shrink-0 sm:w-[167px]">
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
              aria-label="Search roles"
              className="h-[30px] w-full border border-[#CFD7E2] bg-white pl-7 pr-2 text-[12px] outline-none focus:border-[#FF964B]"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[420px] table-fixed border-collapse text-left text-[13px]">
            <colgroup>
              <col style={{ width: "24%" }} />
              <col style={{ width: "76%" }} />
            </colgroup>
            <thead>
              <tr className="bg-white">
                <th
                  scope="col"
                  className="h-[37px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSortDirection((current) =>
                        current === "asc" ? "desc" : "asc"
                      )
                    }
                    className="flex w-full items-center justify-between gap-1 text-left"
                  >
                    Roles
                    <ArrowUpDown
                      size={13}
                      className={
                        sortDirection
                          ? "text-[#63768D]"
                          : "text-[#CDD1D7]"
                      }
                    />
                  </button>
                </th>
                <th
                  scope="col"
                  className="h-[37px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRoles.map((role) => (
                <tr
                  key={role.id}
                  className="odd:bg-[#F8F8F8] even:bg-white hover:bg-[#FFF8F0]"
                >
                  <td className="h-[47px] truncate border border-[#E9EAF0] px-2 text-[#283961]">
                    {role.name}
                  </td>
                  <td className="h-[47px] border border-[#E9EAF0] px-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewingRole(role)}
                        className="inline-flex h-[28px] items-center gap-1 rounded-md border border-[#20BFE0] px-2.5 text-[12px] text-[#1680B5] transition hover:bg-[#EAFBFF]"
                      >
                        <Eye size={13} />
                        View
                      </button>
                      {!role.protected && (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditingRole(role)}
                            className="inline-flex h-[28px] items-center gap-1 rounded-md border border-[#716BFF] px-2.5 text-[12px] text-[#625BFF] transition hover:bg-[#F2F1FF]"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingRole(role)}
                            className="inline-flex h-[28px] items-center gap-1 rounded-md border border-[#FF4D5A] px-2.5 text-[12px] text-[#F04452] transition hover:bg-[#FFF0F1]"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!pageRoles.length && (
                <tr>
                  <td
                    colSpan={2}
                    className="h-16 border border-[#E9EAF0] text-center text-xs text-[#63768D]"
                  >
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#283961]">
          <p>
            Showing {firstEntry} to {lastEntry} of {filteredRoles.length} entries
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

      {(addingRole || editingRole) && (
        <RoleModal
          role={editingRole}
          onClose={() => {
            setAddingRole(false);
            setEditingRole(null);
          }}
          onSave={saveRole}
        />
      )}
      {viewingRole && (
        <RoleModal
          role={viewingRole}
          readOnly
          onClose={() => setViewingRole(null)}
        />
      )}
      {deletingRole && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setDeletingRole(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-role-title"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-role-title"
              className="text-lg font-semibold text-[#283961]"
            >
              Delete role?
            </h2>
            <p className="mt-2 text-xs text-[#63768D]">
              This will permanently remove the {deletingRole.name} role.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingRole(null)}
                className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteRole}
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