import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Banknote,
  BookOpen,
  CircleArrowUp,
  ChevronDown,
  ChevronUp,
  Columns3,
  Eye,
  FileDown,
  FileSpreadsheet,
  FileText,
  Filter,
  Hourglass,
  Paperclip,
  Pencil,
  Plus,
  Power,
  Printer,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import {
  businessStorage,
  getBusinessSampleContacts,
} from "../../../utils/businessStorage.js";

const SUPPLIERS_KEY = "billomax-suppliers";
const SUPPLIER_SAMPLE_SEEDED_KEY = "billomax-suppliers-sample-seeded";

const initialSuppliers = [
  {
    id: 1,
    contactId: "CO0065",
    businessName: "",
    name: "",
    email: "cv@gmail.com",
    taxNumber: "",
    payTerm: "",
    openingBalance: 50000,
    advanceBalance: 0,
    addedOn: "22/01/2025",
    address: "",
    mobile: "922014398",
    purchaseDue: 0,
    purchaseReturnDue: 0,
    assignedTo: "None",
    status: "Active",
    customValues: {},
  },
  {
    id: 2,
    contactId: "CO0056",
    businessName: "netmeds",
    name: "",
    email: "cs@netmeds.com",
    taxNumber: "1218797354",
    payTerm: "15 Months",
    openingBalance: 12333,
    advanceBalance: 0,
    addedOn: "22/01/2025",
    address: "srinagar, girinagar, banglore, karnataka, india, 560029",
    mobile: "7200712345",
    purchaseDue: 0,
    purchaseReturnDue: 0,
    assignedTo: "None",
    status: "Active",
    customValues: {},
  },
  {
    id: 3,
    contactId: "CO0019",
    businessName: "",
    name: "lokesh",
    email: "",
    taxNumber: "",
    payTerm: "",
    openingBalance: 0,
    advanceBalance: 0,
    addedOn: "18/10/2024",
    address: "",
    mobile: "1414145457",
    purchaseDue: 0,
    purchaseReturnDue: 0,
    assignedTo: "None",
    status: "Active",
    customValues: {},
  },
];

const columns = [
  { key: "contactId", label: "Contact ID", width: "100px" },
  { key: "businessName", label: "Business Name", width: "110px" },
  { key: "name", label: "Name", width: "80px" },
  { key: "email", label: "Email", width: "115px" },
  { key: "taxNumber", label: "Tax number", width: "85px" },
  { key: "payTerm", label: "Pay term", width: "65px" },
  { key: "openingBalance", label: "Opening Balance", width: "90px" },
  { key: "advanceBalance", label: "Advance Balance", width: "90px" },
  { key: "addedOn", label: "Added On", width: "80px" },
  { key: "address", label: "Address", width: "115px" },
  { key: "mobile", label: "Mobile", width: "80px" },
  { key: "purchaseDue", label: "Total Purchase Due", width: "95px" },
  {
    key: "purchaseReturnDue",
    label: "Total Purchase Return Due",
    width: "105px",
  },
];

const currencyKeys = new Set([
  "openingBalance",
  "advanceBalance",
  "purchaseDue",
  "purchaseReturnDue",
]);

function formatCell(column, supplier) {
  const value = column.customFieldId
    ? supplier.customValues?.[column.customFieldId] ?? ""
    : supplier[column.key] ?? "";
  if (currencyKeys.has(column.key)) {
    return `₹ ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return value;
}

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

function SupplierModal({
  supplier,
  customFields,
  readOnly = false,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(supplier);
  const fields = [
    ["contactId", "Contact ID", "text"],
    ["businessName", "Business Name", "text"],
    ["name", "Name", "text"],
    ["email", "Email", "email"],
    ["taxNumber", "Tax number", "text"],
    ["payTerm", "Pay term", "text"],
    ["openingBalance", "Opening Balance", "number"],
    ["advanceBalance", "Advance Balance", "number"],
    ["addedOn", "Added On", "text"],
    ["address", "Address", "text"],
    ["mobile", "Mobile", "tel"],
    ["purchaseDue", "Total Purchase Due", "number"],
    ["purchaseReturnDue", "Total Purchase Return Due", "number"],
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      openingBalance: Number(form.openingBalance) || 0,
      advanceBalance: Number(form.advanceBalance) || 0,
      purchaseDue: Number(form.purchaseDue) || 0,
      purchaseReturnDue: Number(form.purchaseReturnDue) || 0,
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
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#283961]">
            {readOnly
              ? "Supplier details"
              : supplier.id
                ? "Edit supplier"
                : "Add supplier"}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "0.01" : undefined}
                readOnly={readOnly}
                value={form[key] ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B] focus:ring-1 focus:ring-[#FF964B]/20 read-only:bg-[#F8FAFD]"
              />
            </label>
          ))}
          {customFields.map((field) => (
            <label
              key={field.id}
              className="block text-xs font-semibold text-[#63768D]"
            >
              {field.label}
              <input
                readOnly={readOnly}
                value={form.customValues?.[field.id] ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customValues: {
                      ...current.customValues,
                      [field.id]: event.target.value,
                    },
                  }))
                }
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
              className="h-9 rounded-md bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-xs font-semibold text-white hover:brightness-105"
            >
              {supplier.id ? "Save changes" : "Add supplier"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(() => {
    try {
      const stored = businessStorage.getItem(SUPPLIERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) throw new Error("Saved suppliers are not an array.");
        if (
          parsed.length === 0 &&
          businessStorage.getItem(SUPPLIER_SAMPLE_SEEDED_KEY) !== "true"
        ) {
          return getBusinessSampleContacts("suppliers", initialSuppliers);
        }
        return parsed;
      }
      return getBusinessSampleContacts("suppliers", initialSuppliers);
    } catch (error) {
      console.error("Could not load saved suppliers:", error);
      return getBusinessSampleContacts("suppliers", initialSuppliers);
    }
  });

  useEffect(() => {
    try {
      businessStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
      businessStorage.setItem(SUPPLIER_SAMPLE_SEEDED_KEY, "true");
    } catch (error) {
      console.error("Could not save suppliers:", error);
    }
  }, [suppliers]);
  const [customFields, setCustomFields] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [balanceFilters, setBalanceFilters] = useState({
    purchaseDue: false,
    purchaseReturnDue: false,
    advanceBalance: false,
    openingBalance: false,
  });
  const [assignedToFilter, setAssignedToFilter] = useState("None");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );
  const [customFieldName, setCustomFieldName] = useState("");
  const [customFieldDialogOpen, setCustomFieldDialogOpen] = useState(false);
  const [openActionsId, setOpenActionsId] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingSupplier, setViewingSupplier] = useState(null);
  const [addingSupplier, setAddingSupplier] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [selectedSupplierAction, setSelectedSupplierAction] = useState(null);

  const allColumns = useMemo(
    () => [
      ...columns,
      ...customFields.map((field) => ({
        key: `custom-${field.id}`,
        customFieldId: field.id,
        label: field.label,
        width: "95px",
      })),
    ],
    [customFields]
  );

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = suppliers.filter((supplier) => {
      const matchesSearch =
        !query ||
        Object.values(supplier).some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        ) ||
        customFields.some((field) =>
          String(supplier.customValues?.[field.id] ?? "")
            .toLowerCase()
            .includes(query)
        );
      return (
        matchesSearch &&
        (!balanceFilters.purchaseDue || Number(supplier.purchaseDue) > 0) &&
        (!balanceFilters.purchaseReturnDue ||
          Number(supplier.purchaseReturnDue) > 0) &&
        (!balanceFilters.advanceBalance || Number(supplier.advanceBalance) > 0) &&
        (!balanceFilters.openingBalance || Number(supplier.openingBalance) > 0) &&
        (!assignedToFilter || supplier.assignedTo === assignedToFilter) &&
        (!statusFilter || supplier.status === statusFilter)
      );
    });

    if (!sort) return result;
    return [...result].sort((first, second) => {
      const firstValue = sort.customFieldId
        ? first.customValues?.[sort.customFieldId] ?? ""
        : first[sort.key] ?? "";
      const secondValue = sort.customFieldId
        ? second.customValues?.[sort.customFieldId] ?? ""
        : second[sort.key] ?? "";
      const comparison =
        typeof firstValue === "number" && typeof secondValue === "number"
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue), undefined, {
              numeric: true,
              sensitivity: "base",
            });
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [
    suppliers,
    search,
    balanceFilters,
    assignedToFilter,
    statusFilter,
    sort,
    customFields,
  ]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredSuppliers.length / Number(pageSize))
  );
  const pageSuppliers = filteredSuppliers.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize)
  );
  const visibleTableColumns = allColumns.filter((column) =>
    visibleColumns.includes(column.key)
  );
  const firstEntry = filteredSuppliers.length
    ? (page - 1) * Number(pageSize) + 1
    : 0;
  const lastEntry = Math.min(page * Number(pageSize), filteredSuppliers.length);

  const saveSupplier = (supplier) => {
    setSuppliers((current) => {
      const exists = current.some((item) => item.id === supplier.id);
      return exists
        ? current.map((item) => (item.id === supplier.id ? supplier : item))
        : [
            ...current,
            {
              ...supplier,
              id: supplier.id ?? Date.now(),
              addedOn:
                supplier.addedOn ||
                new Date().toLocaleDateString("en-GB"),
            },
          ];
    });
    setAddingSupplier(false);
    setEditingSupplier(null);
  };

  const toggleSort = (column) => {
    setSort((current) => ({
      key: column.key,
      customFieldId: column.customFieldId,
      direction:
        current?.key === column.key && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setPage(1);
  };

  const addCustomField = (event) => {
    event.preventDefault();
    const label = customFieldName.trim();
    if (!label) return;

    const id = `custom-${Date.now()}`;
    setCustomFields((current) => [...current, { id, label }]);
    setVisibleColumns((current) => [...current, `custom-${id}`]);
    setCustomFieldName("");
    setCustomFieldDialogOpen(false);
  };

  const resetFilters = () => {
    setBalanceFilters({
      purchaseDue: false,
      purchaseReturnDue: false,
      advanceBalance: false,
      openingBalance: false,
    });
    setAssignedToFilter("None");
    setStatusFilter("");
    setPage(1);
  };

  const exportCSV = () => {
    if (!filteredSuppliers.length) {
      alert("No suppliers available to export.");
      return;
    }

    const exportColumns = [
      { key: "action", label: "Action" },
      ...visibleTableColumns,
    ];
    const csv = [
      exportColumns.map((column) => column.label).join(","),
      ...filteredSuppliers.map((supplier) =>
        exportColumns
          .map((column) => {
            const value =
              column.key === "action"
                ? ""
                : formatCell(column, supplier);
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suppliers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteSupplier = () => {
    setSuppliers((current) =>
      current.filter((supplier) => supplier.id !== deletingSupplier.id)
    );
    setDeletingSupplier(null);
    setPage(1);
  };

  const toggleSupplierStatus = (supplier) => {
    setSuppliers((current) =>
      current.map((item) =>
        item.id === supplier.id
          ? {
              ...item,
              status: item.status === "Inactive" ? "Active" : "Inactive",
            }
          : item
      )
    );
    setOpenActionsId(null);
  };

  const emptySupplier = {
    id: null,
    contactId: "",
    businessName: "",
    name: "",
    email: "",
    taxNumber: "",
    payTerm: "",
    openingBalance: "",
    advanceBalance: "",
    addedOn: "",
    address: "",
    mobile: "",
    purchaseDue: "",
    purchaseReturnDue: "",
    assignedTo: "None",
    status: "Active",
    customValues: {},
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#283961] sm:px-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-[24px] font-semibold leading-7 text-black">
          Suppliers
        </h1>
        <p className="text-[14px] text-[#63768D]">Manage your Suppliers</p>
      </div>

      <section className="mb-3 overflow-visible rounded-[17px] border border-[#E9EDF3] bg-white shadow-[0_7px_20px_rgba(25,43,80,0.07)]">
        <div className="flex h-[52px] items-center gap-2 rounded-[17px] px-4 text-[#4D9AC6]">
          <Filter size={20} fill="currentColor" />
          <span className="text-[20px] font-semibold">Filters</span>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-label={filtersOpen ? "Collapse filters" : "Expand filters"}
            onClick={() => setFiltersOpen((current) => !current)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#4D9AC6] transition hover:bg-[#F2F8FC]"
          >
            {filtersOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </button>
        </div>
        {filtersOpen && (
          <div className="border-t border-[#E9EDF3] p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["purchaseDue", "Purchase Due"],
                ["purchaseReturnDue", "Purchase Return"],
                ["advanceBalance", "Advance Balance"],
                ["openingBalance", "Opening Balance"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex min-h-8 cursor-pointer items-center gap-2 text-xs font-semibold text-[#283961]"
                >
                  <input
                    type="checkbox"
                    checked={balanceFilters[key]}
                    onChange={(event) => {
                      setBalanceFilters((current) => ({
                        ...current,
                        [key]: event.target.checked,
                      }));
                      setPage(1);
                    }}
                    className="h-4 w-4 accent-[#3983F6]"
                  />
                  {label}
                </label>
              ))}

              <label className="text-xs font-semibold text-[#283961]">
                Assigned to:
                <select
                  value={assignedToFilter}
                  onChange={(event) => {
                    setAssignedToFilter(event.target.value);
                    setPage(1);
                  }}
                  className="mt-1.5 h-9 w-full border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#63768D] outline-none focus:border-[#FF964B]"
                >
                  <option value="None">None</option>
                  {[...new Set(suppliers.map((supplier) => supplier.assignedTo))]
                    .filter((assignedTo) => assignedTo && assignedTo !== "None")
                    .map((assignedTo) => (
                      <option key={assignedTo} value={assignedTo}>
                        {assignedTo}
                      </option>
                    ))}
                </select>
              </label>

              <label className="text-xs font-semibold text-[#283961]">
                Status:
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                  className="mt-1.5 h-9 w-full border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#63768D] outline-none focus:border-[#FF964B]"
                >
                  <option value="">None</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <button
                type="button"
                onClick={resetFilters}
                className="h-9 self-end rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="min-w-0 overflow-visible rounded-[17px] border border-[#F0E0CF] bg-white p-4 shadow-[0_8px_24px_rgba(120,75,35,0.07)] sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[21px] font-semibold leading-7 text-[#FFA01A]">
            All your Suppliers
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCustomFieldName("");
                setCustomFieldDialogOpen(true);
              }}
              className="inline-flex h-[38px] shrink-0 items-center gap-2 rounded-full border border-[#4D9AC6] bg-white px-3 text-xs font-semibold text-[#347FA8] shadow-sm transition hover:bg-[#F2F8FC]"
            >
              <Plus size={15} />
              Add Custom Field
            </button>
            <button
              type="button"
              onClick={() => setAddingSupplier(true)}
              className="inline-flex h-[38px] shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-xs font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
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
                <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-52 overflow-y-auto rounded-lg border border-[#F0E0CF] bg-white p-3 shadow-lg">
                  <p className="mb-2 text-xs font-semibold text-[#283961]">
                    Show columns
                  </p>
                  {allColumns.map((column) => (
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
              aria-label="Search suppliers"
              className="h-[30px] w-full border border-[#CFD7E2] bg-white pl-7 pr-2 text-[12px] outline-none focus:border-[#FF964B]"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1700px] table-fixed border-collapse text-left text-[12px]">
            <colgroup>
              <col style={{ width: "86px" }} />
              {visibleTableColumns.map((column) => (
                <col key={column.key} style={{ width: column.width }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-white">
                <th
                  scope="col"
                  className="h-[48px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                >
                  Action
                </th>
                {visibleTableColumns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="h-[48px] border border-[#E9EAF0] px-2 font-semibold text-[#283961]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(column)}
                      className="flex w-full items-end justify-between gap-1 text-left"
                    >
                      <span>{column.label}</span>
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
              </tr>
            </thead>
            <tbody>
              {pageSuppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="odd:bg-[#F8F8F8] even:bg-white hover:bg-[#FFF8F0]"
                >
                  <td className="relative h-[47px] border border-[#E9EAF0] px-2 py-2 align-top">
                    <button
                      type="button"
                      aria-expanded={openActionsId === supplier.id}
                      onClick={() =>
                        setOpenActionsId((current) =>
                          current === supplier.id ? null : supplier.id
                        )
                      }
                      className="inline-flex h-[25px] items-center gap-1 rounded-md border border-[#20BFE0] px-2 text-[11px] text-[#1680B5] transition hover:bg-[#EAFBFF]"
                    >
                      Actions
                      <ChevronDown size={12} />
                    </button>
                    {openActionsId === supplier.id && (
                      <div className="absolute left-2 top-10 z-20 min-w-44 rounded-md border border-[#E9EAF0] bg-white p-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSupplierAction("Pay");
                            setOpenActionsId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#F8FAFD]"
                        >
                          <Banknote size={13} />
                          Pay
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingSupplier(supplier);
                            setOpenActionsId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#F8FAFD]"
                        >
                          <Eye size={13} />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSupplier(supplier);
                            setOpenActionsId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#F8FAFD]"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingSupplier(supplier);
                            setOpenActionsId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-[#F04452] hover:bg-[#FFF0F1]"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSupplierStatus(supplier)}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#F8FAFD]"
                        >
                          <Power size={13} />
                          {supplier.status === "Inactive" ? "Activate" : "Deactivate"}
                        </button>
                        <div className="my-1 border-t border-[#E9EAF0]" />
                        {[
                          { label: "Ledger", Icon: BookOpen },
                          { label: "Purchases", Icon: ShoppingCart },
                          { label: "Stock Report", Icon: Hourglass },
                          { label: "Sales", Icon: CircleArrowUp },
                          { label: "Documents & Note", Icon: Paperclip },
                        ].map(({ label, Icon }) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              setSelectedSupplierAction(label);
                              setOpenActionsId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#F8FAFD]"
                          >
                            <Icon size={13} />
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  {visibleTableColumns.map((column) => (
                    <td
                      key={column.key}
                      className="h-[47px] break-words border border-[#E9EAF0] px-2 py-2 align-top text-[#283961]"
                    >
                      {formatCell(column, supplier)}
                    </td>
                  ))}
                </tr>
              ))}
              {!pageSuppliers.length && (
                <tr>
                  <td
                    colSpan={visibleTableColumns.length + 1}
                    className="h-16 border border-[#E9EAF0] text-center text-xs text-[#63768D]"
                  >
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#283961]">
          <p>
            Showing {firstEntry} to {lastEntry} of {filteredSuppliers.length} entries
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

      {(addingSupplier || editingSupplier) && (
        <SupplierModal
          supplier={editingSupplier ?? emptySupplier}
          customFields={customFields}
          onClose={() => {
            setAddingSupplier(false);
            setEditingSupplier(null);
          }}
          onSave={saveSupplier}
        />
      )}
      {viewingSupplier && (
        <SupplierModal
          supplier={viewingSupplier}
          customFields={customFields}
          readOnly
          onClose={() => setViewingSupplier(null)}
        />
      )}
      {customFieldDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setCustomFieldDialogOpen(false)}
        >
          <form
            onSubmit={addCustomField}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#283961]">
                Add custom field
              </h2>
              <button
                type="button"
                onClick={() => setCustomFieldDialogOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-[#7F8FA4] hover:bg-[#FFF0E3]"
              >
                <X size={19} />
              </button>
            </div>
            <label className="block text-xs font-semibold text-[#63768D]">
              Field name
              <input
                autoFocus
                required
                value={customFieldName}
                onChange={(event) => setCustomFieldName(event.target.value)}
                placeholder="Enter field name"
                className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B]"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCustomFieldDialogOpen(false)}
                className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 rounded-md bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-xs font-semibold text-white hover:brightness-105"
              >
                Add field
              </button>
            </div>
          </form>
        </div>
      )}
      {selectedSupplierAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setSelectedSupplierAction(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="supplier-action-title"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="supplier-action-title"
              className="text-lg font-semibold text-[#283961]"
            >
              {selectedSupplierAction}
            </h2>
            <p className="mt-2 text-xs text-[#63768D]">
              {selectedSupplierAction} is not available for suppliers yet.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSupplierAction(null)}
                className="h-9 rounded-md bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-xs font-semibold text-white hover:brightness-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {deletingSupplier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setDeletingSupplier(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-supplier-title"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-supplier-title"
              className="text-lg font-semibold text-[#283961]"
            >
              Delete supplier?
            </h2>
            <p className="mt-2 text-xs text-[#63768D]">
              This will permanently remove supplier {deletingSupplier.contactId}.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingSupplier(null)}
                className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteSupplier}
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