import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Columns3,
  Eye,
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

const initialUsers = [
  {
    id: 1,
    username: "9876500004",
    name: "Pharmacy Vendor",
    role: "",
    email: "pharmacy.vendor@demo.test",
  },
  {
    id: 2,
    username: "admin-market-04",
    name: "poonam",
    role: "Sale man",
    email: "poonam@gmail.com",
  },
  {
    id: 3,
    username: "admin-pharmacy",
    name: "Mr pharmacy",
    role: "Admin",
    email: "khaniaamit.m9@gmail.com",
  },
  {
    id: 4,
    username: "admin-pharmacy-04",
    name: "Raj Narayan",
    role: "Sale man",
    email: "rajnarayan77be@gmail.com",
  },
  {
    id: 5,
    username: "Ambuja-04",
    name: "miss Ambuja P",
    role: "Admin",
    email: "ambuja@gmail.com",
  },
  {
    id: 6,
    username: "KARUNYA-04",
    name: "Mrs karunya devi",
    role: "Cashier",
    email: "karunya@gmail.com",
  },
  {
    id: 7,
    username: "narayana-04",
    name: "mr narayana deva",
    role: "Sale man",
    email: "naradeva@gmail.com",
  },
  {
    id: 8,
    username: "sales-04",
    name: "abc",
    role: "Sale man",
    email: "Abc@gmail.com",
  },
];

const columns = [
  { key: "username", label: "Username" },
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
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

function UserModal({ user, readOnly = false, onClose, onSave }) {
  const [form, setForm] = useState({
    username: user?.username ?? "",
    name: user?.name ?? "",
    role: user?.role ?? "",
    email: user?.email ?? "",
  });
  const fields = [
    ["username", "Username", "text"],
    ["name", "Name", "text"],
    ["role", "Role", "text"],
    ["email", "Email", "email"],
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      id: user?.id ?? Date.now(),
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
            {readOnly ? "User details" : user ? "Edit user" : "Add user"}
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
          {fields.map(([key, label, type]) => (
            <label
              key={key}
              className="block text-xs font-semibold text-[#63768D]"
            >
              {label}
              <input
                type={type}
                required={key !== "role"}
                readOnly={readOnly}
                value={form[key]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                placeholder={`Enter ${label.toLowerCase()}`}
                className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B] focus:ring-1 focus:ring-[#FF964B]/20 read-only:bg-[#F8FAFD]"
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
            {readOnly ? "Close" : "Cancel"}
          </button>
          {!readOnly && (
            <button
              type="submit"
              className="h-9 rounded-md bg-gradient-to-r from-[#5145EF] to-[#4D8FF7] px-4 text-xs font-semibold text-white hover:brightness-105"
            >
              {user ? "Save changes" : "Add user"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
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
  }, [users, search, sort]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredUsers.length / Number(pageSize))
  );
  const pageRows = filteredUsers.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize)
  );
  const visibleTableColumns = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );
  const firstEntry = filteredUsers.length
    ? (page - 1) * Number(pageSize) + 1
    : 0;
  const lastEntry = Math.min(page * Number(pageSize), filteredUsers.length);

  const saveUser = (user) => {
    setUsers((current) => {
      const exists = current.some((item) => item.id === user.id);
      return exists
        ? current.map((item) => (item.id === user.id ? user : item))
        : [...current, user];
    });
    setEditingUser(null);
    setAddingUser(false);
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
    if (!filteredUsers.length) {
      alert("No users available to export.");
      return;
    }

    const csv = [
      visibleTableColumns.map((column) => column.label).join(","),
      ...filteredUsers.map((user) =>
        visibleTableColumns
          .map(
            (column) =>
              `"${String(user[column.key] ?? "").replace(/"/g, '""')}"`
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
    link.download = "users.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const confirmDelete = () => {
    setUsers((current) =>
      current.filter((user) => user.id !== deletingUser.id)
    );
    setDeletingUser(null);
    setPage(1);
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#283961] sm:px-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-[24px] font-semibold leading-7 text-black">
          Users
        </h1>
        <p className="text-[14px] text-[#63768D]">Manage users</p>
      </div>

      <section className="min-w-0 overflow-visible rounded-[17px] border border-[#F0E0CF] bg-white p-4 shadow-[0_8px_24px_rgba(120,75,35,0.07)] sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[21px] font-semibold leading-7 text-[#FFA01A]">
            All users
          </h2>
          <button
            type="button"
            onClick={() => setAddingUser(true)}
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
                className="h-[30px] w-[60px] border border-[#CFD7E2] bg-white px-2 text-xs text-[#63768D] outline-none focus:border-[#FF964B]"
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
                <div className="absolute left-0 top-full z-30 mt-2 w-44 rounded-lg border border-[#F0E0CF] bg-white p-3 shadow-lg">
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
              aria-label="Search users"
              className="h-[30px] w-full border border-[#CFD7E2] bg-white pl-7 pr-2 text-[12px] outline-none focus:border-[#FF964B]"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] table-fixed border-collapse text-left text-[12px]">
            <colgroup>
              {visibleTableColumns.map((column) => (
                <col
                  key={column.key}
                  style={{
                    width:
                      column.key === "username"
                        ? "18%"
                        : column.key === "name"
                          ? "16%"
                          : column.key === "role"
                            ? "9%"
                            : "25%",
                  }}
                />
              ))}
              <col style={{ width: "32%" }} />
            </colgroup>
            <thead>
              <tr className="bg-white">
                {visibleTableColumns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="h-[31px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                  >
                    <button
                      type="button"
                      onClick={() => changeSort(column.key)}
                      className="flex w-full items-center justify-between gap-1 text-left"
                    >
                      {column.label}
                      <ArrowUpDown
                        size={12}
                        className={
                          sort?.key === column.key
                            ? "text-[#63768D]"
                            : "text-[#CDD1D7]"
                        }
                      />
                    </button>
                  </th>
                ))}
                <th
                  scope="col"
                  className="h-[31px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((user) => (
                <tr
                  key={user.id}
                  className="odd:bg-[#F8F8F8] even:bg-white hover:bg-[#FFF8F0]"
                >
                  {visibleTableColumns.map((column) => (
                    <td
                      key={column.key}
                      className="h-[37px] truncate border border-[#E9EAF0] px-2 text-[#283961]"
                    >
                      {user[column.key] || ""}
                    </td>
                  ))}
                  <td className="h-[37px] border border-[#E9EAF0] px-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingUser(user)}
                        className="inline-flex h-[20px] items-center gap-1 rounded-md border border-[#716BFF] px-2 text-[11px] text-[#625BFF] transition hover:bg-[#F2F1FF]"
                      >
                        <Pencil size={11} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewingUser(user)}
                        className="inline-flex h-[20px] items-center gap-1 rounded-md border border-[#20BFE0] px-2 text-[11px] text-[#1680B5] transition hover:bg-[#EAFBFF]"
                      >
                        <Eye size={11} />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingUser(user)}
                        className="inline-flex h-[20px] items-center gap-1 rounded-md border border-[#FF4D5A] px-2 text-[11px] text-[#F04452] transition hover:bg-[#FFF0F1]"
                      >
                        <Trash2 size={11} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!pageRows.length && (
                <tr>
                  <td
                    colSpan={visibleTableColumns.length + 1}
                    className="h-16 border border-[#E9EAF0] text-center text-xs text-[#63768D]"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#283961]">
          <p>
            Showing {firstEntry} to {lastEntry} of {filteredUsers.length} entries
          </p>
          <div className="flex items-center">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="h-7 rounded-l border border-[#D9E0E8] px-3 text-[#63768D] hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex h-7 min-w-7 items-center justify-center bg-[#3983F6] px-2 text-white">
              {page}
            </span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              className="h-7 rounded-r border border-[#D9E0E8] px-3 text-[#63768D] hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {(addingUser || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setAddingUser(false);
            setEditingUser(null);
          }}
          onSave={saveUser}
        />
      )}
      {viewingUser && (
        <UserModal
          user={viewingUser}
          readOnly
          onClose={() => setViewingUser(null)}
        />
      )}
      {deletingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setDeletingUser(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-user-title"
              className="text-lg font-semibold text-[#283961]"
            >
              Delete user?
            </h2>
            <p className="mt-2 text-xs text-[#63768D]">
              This will permanently remove{" "}
              {deletingUser.name || deletingUser.username}.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
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