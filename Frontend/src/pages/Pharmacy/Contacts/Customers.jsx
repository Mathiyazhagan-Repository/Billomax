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

const CUSTOMERS_KEY = "billomax-customers";
const CUSTOMER_SAMPLE_SEEDED_KEY = "billomax-customers-sample-seeded";

const initialCustomers = [
  {
    id: 1,
    contactId: "CO0065",
    businessName: "",
    name: "",
    email: "cv@gmail.com",
    taxNumber: "",
    creditLimit: 10000,
    payTerm: "",
    openingBalance: 50000,
    advanceBalance: 0,
    addedOn: "22/01/2025",
    customerGroup: "",
    address: "",
    mobile: "",
    saleDue: 0,
    saleReturnDue: 0,
    lastSaleOn: "",
    assignedTo: "None",
    status: "Active",
    customValues: {},
  },
  {
    id: 2,
    contactId: "CO0018",
    businessName: "",
    name: "Miss Ranuka Devi",
    email: "",
    taxNumber: "",
    creditLimit: null,
    payTerm: "",
    openingBalance: 0,
    advanceBalance: 0,
    addedOn: "17/10/2024",
    customerGroup: "",
    address: "",
    mobile: "",
    saleDue: 0,
    saleReturnDue: 0,
    lastSaleOn: "",
    assignedTo: "None",
    status: "Active",
    customValues: {},
  },
  {
    id: 3,
    contactId: "CO0018",
    businessName: "",
    name: "Miss Ranuka Devi",
    email: "",
    taxNumber: "",
    creditLimit: null,
    payTerm: "",
    openingBalance: 0,
    advanceBalance: 0,
    addedOn: "17/10/2024",
    customerGroup: "",
    address: "",
    mobile: "",
    saleDue: 0,
    saleReturnDue: 0,
    lastSaleOn: "",
    assignedTo: "None",
    status: "Active",
    customValues: {},
  },
];

const baseColumns = [
  { key: "contactId", label: "Contact ID", width: "90px" },
  { key: "businessName", label: "Business Name", width: "95px" },
  { key: "name", label: "Name", width: "80px" },
  { key: "email", label: "Email", width: "115px" },
  { key: "taxNumber", label: "Tax number", width: "80px" },
  { key: "creditLimit", label: "Credit Limit", width: "75px" },
  { key: "payTerm", label: "Pay term", width: "55px" },
  { key: "openingBalance", label: "Opening Balance", width: "85px" },
  { key: "advanceBalance", label: "Advance Balance", width: "85px" },
  { key: "addedOn", label: "Added On", width: "75px" },
  { key: "customerGroup", label: "Customer Group", width: "85px" },
  { key: "address", label: "Address", width: "110px" },
  { key: "mobile", label: "Mobile", width: "75px" },
  { key: "saleDue", label: "Total Sale Due", width: "85px" },
  { key: "saleReturnDue", label: "Total Sell Return Due", width: "95px" },
];

const currencyKeys = new Set([
  "openingBalance",
  "advanceBalance",
  "saleDue",
  "saleReturnDue",
]);

function formatCell(column, customer) {
  if (column.key === "creditLimit") {
    return customer.creditLimit == null
      ? "No Limit"
      : `₹ ${Number(customer.creditLimit).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
  }
  if (currencyKeys.has(column.key)) {
    return `₹ ${Number(customer[column.key] || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (column.customFieldId) {
    return customer.customValues?.[column.customFieldId] ?? "";
  }
  return customer[column.key] ?? "";
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

function CustomerModal({ customer, customFields, onClose, onSave }) {
  const [form, setForm] = useState(customer);
  const fields = [
    ["contactId", "Contact ID", "text"],
    ["businessName", "Business Name", "text"],
    ["name", "Name", "text"],
    ["email", "Email", "email"],
    ["taxNumber", "Tax number", "text"],
    ["creditLimit", "Credit Limit", "number"],
    ["payTerm", "Pay term", "text"],
    ["openingBalance", "Opening Balance", "number"],
    ["advanceBalance", "Advance Balance", "number"],
    ["customerGroup", "Customer Group", "text"],
    ["address", "Address", "text"],
    ["mobile", "Mobile", "tel"],
  ];

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      creditLimit:
        form.creditLimit === "" || form.creditLimit == null
          ? null
          : Number(form.creditLimit),
      openingBalance: Number(form.openingBalance) || 0,
      advanceBalance: Number(form.advanceBalance) || 0,
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
            {customer.id ? "Edit customer" : "Add customer"}
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
                value={form[key] ?? ""}
                onChange={(event) => updateField(key, event.target.value)}
                className="mt-1.5 h-9 w-full rounded-md border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#283961] outline-none focus:border-[#FF964B] focus:ring-1 focus:ring-[#FF964B]/20"
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
            {customer.id ? "Save changes" : "Add customer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState(() => {
    try {
      const stored = businessStorage.getItem(CUSTOMERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) throw new Error("Saved customers are not an array.");
        if (
          parsed.length === 0 &&
          businessStorage.getItem(CUSTOMER_SAMPLE_SEEDED_KEY) !== "true"
        ) {
          return getBusinessSampleContacts("customers", initialCustomers);
        }
        return parsed;
      }
      return getBusinessSampleContacts("customers", initialCustomers);
    } catch (error) {
      console.error("Could not load saved customers:", error);
      return getBusinessSampleContacts("customers", initialCustomers);
    }
  });

  useEffect(() => {
    try {
      businessStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
      businessStorage.setItem(CUSTOMER_SAMPLE_SEEDED_KEY, "true");
    } catch (error) {
      console.error("Could not save customers:", error);
    }
  }, [customers]);
  const [customFields, setCustomFields] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [balanceFilters, setBalanceFilters] = useState({
    saleDue: false,
    saleReturnDue: false,
    advanceBalance: false,
    openingBalance: false,
  });
  const [noSaleDuration, setNoSaleDuration] = useState("");
  const [noSaleCutoff, setNoSaleCutoff] = useState(0);
  const [customerGroupFilter, setCustomerGroupFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    baseColumns.map((column) => column.key)
  );
  const [customFieldName, setCustomFieldName] = useState("");
  const [customFieldDialogOpen, setCustomFieldDialogOpen] = useState(false);
  const [openActionsId, setOpenActionsId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [selectedCustomerAction, setSelectedCustomerAction] = useState(null);

  const allColumns = useMemo(
    () => [
      ...baseColumns,
      ...customFields.map((field) => ({
        key: `custom-${field.id}`,
        customFieldId: field.id,
        label: field.label,
        width: "95px",
      })),
    ],
    [customFields]
  );

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = customers.filter((customer) => {
      const matchesSearch =
        !query ||
        Object.values(customer).some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        ) ||
        customFields.some((field) =>
          String(customer.customValues?.[field.id] ?? "")
            .toLowerCase()
            .includes(query)
        );
      return (
        matchesSearch &&
        (!balanceFilters.saleDue || Number(customer.saleDue) > 0) &&
        (!balanceFilters.saleReturnDue ||
          Number(customer.saleReturnDue) > 0) &&
        (!balanceFilters.advanceBalance ||
          Number(customer.advanceBalance) > 0) &&
        (!balanceFilters.openingBalance ||
          Number(customer.openingBalance) > 0) &&
        (!noSaleDuration ||
          !customer.lastSaleOn ||
          Date.parse(customer.lastSaleOn) < noSaleCutoff) &&
        (!customerGroupFilter ||
          customer.customerGroup === customerGroupFilter) &&
        (!assignedToFilter || customer.assignedTo === assignedToFilter) &&
        (!statusFilter || customer.status === statusFilter)
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
    customers,
    search,
    balanceFilters,
    noSaleDuration,
    noSaleCutoff,
    customerGroupFilter,
    assignedToFilter,
    statusFilter,
    sort,
    customFields,
  ]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredCustomers.length / Number(pageSize))
  );
  const pageCustomers = filteredCustomers.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize)
  );
  const visibleTableColumns = allColumns.filter((column) =>
    visibleColumns.includes(column.key)
  );
  const firstEntry = filteredCustomers.length
    ? (page - 1) * Number(pageSize) + 1
    : 0;
  const lastEntry = Math.min(page * Number(pageSize), filteredCustomers.length);

  const saveCustomer = (customer) => {
    setCustomers((current) => {
      const exists = current.some((item) => item.id === customer.id);
      return exists
        ? current.map((item) => (item.id === customer.id ? customer : item))
        : [
            ...current,
            {
              ...customer,
              id: Date.now(),
              addedOn: new Date().toLocaleDateString("en-GB"),
              saleDue: 0,
              saleReturnDue: 0,
              lastSaleOn: "",
              assignedTo: "None",
              status: "Active",
            },
          ];
    });
    setAddingCustomer(false);
    setEditingCustomer(null);
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

  const resetFilters = () => {
    setBalanceFilters({
      saleDue: false,
      saleReturnDue: false,
      advanceBalance: false,
      openingBalance: false,
    });
    setNoSaleDuration("");
    setNoSaleCutoff(0);
    setCustomerGroupFilter("");
    setAssignedToFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const exportCSV = () => {
    if (!filteredCustomers.length) {
      alert("No customers available to export.");
      return;
    }

    const exportColumns = [
      { key: "action", label: "Action" },
      ...visibleTableColumns,
    ];
    const csv = [
      exportColumns.map((column) => column.label).join(","),
      ...filteredCustomers.map((customer) =>
        exportColumns
          .map((column) => {
            const value =
              column.key === "action" ? "" : formatCell(column, customer);
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
    link.download = "customers.csv";
    link.click();
    URL.revokeObjectURL(url);
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

  const deleteCustomer = () => {
    setCustomers((current) =>
      current.filter((customer) => customer.id !== deletingCustomer.id)
    );
    setDeletingCustomer(null);
    setPage(1);
  };

  const toggleCustomerStatus = (customer) => {
    setCustomers((current) =>
      current.map((item) =>
        item.id === customer.id
          ? {
              ...item,
              status: item.status === "Inactive" ? "Active" : "Inactive",
            }
          : item
      )
    );
    setOpenActionsId(null);
  };

  const emptyCustomer = {
    id: null,
    contactId: "",
    businessName: "",
    name: "",
    email: "",
    taxNumber: "",
    creditLimit: "",
    payTerm: "",
    openingBalance: "",
    advanceBalance: "",
    customerGroup: "",
    address: "",
    mobile: "",
    saleDue: "",
    saleReturnDue: "",
    lastSaleOn: "",
    assignedTo: "None",
    status: "Active",
    customValues: {},
    ...Object.fromEntries(customFields.map((field) => [field.id, ""])),
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#FFFAF5] px-4 py-4 font-sans text-[#283961] sm:px-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-[24px] font-semibold leading-7 text-black">
          Customers
        </h1>
        <p className="text-[14px] text-[#63768D]">Manage your Customers</p>
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
                ["saleDue", "Sell Due"],
                ["saleReturnDue", "Sell Return"],
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
                Has no sell from:
                <select
                  value={noSaleDuration}
                  onChange={(event) => {
                    const duration = event.target.value;
                    setNoSaleDuration(duration);
                    setNoSaleCutoff(
                      duration
                        ? Date.now() -
                            Number(duration) * 24 * 60 * 60 * 1000
                        : 0
                    );
                    setPage(1);
                  }}
                  className="mt-1.5 h-9 w-full border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#63768D] outline-none focus:border-[#FF964B]"
                >
                  <option value="">Please Select</option>
                  <option value="30">1 month</option>
                  <option value="90">3 months</option>
                  <option value="180">6 months</option>
                  <option value="365">1 year</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-[#283961]">
                Customer Group:
                <select
                  value={customerGroupFilter}
                  onChange={(event) => {
                    setCustomerGroupFilter(event.target.value);
                    setPage(1);
                  }}
                  className="mt-1.5 h-9 w-full border border-[#CFD7E2] bg-white px-3 text-xs font-normal text-[#63768D] outline-none focus:border-[#FF964B]"
                >
                  <option value="">None</option>
                  {[...new Set(customers.map((customer) => customer.customerGroup))]
                    .filter(Boolean)
                    .map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                </select>
              </label>

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
                  <option value="">None</option>
                  {[...new Set(customers.map((customer) => customer.assignedTo))]
                    .filter((value) => value && value !== "None")
                    .map((value) => (
                      <option key={value} value={value}>
                        {value}
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
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="h-8 rounded-md border border-[#D9C7B3] px-3 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
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
            All your Customers
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
              onClick={() => setAddingCustomer(true)}
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
                <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-56 overflow-y-auto rounded-lg border border-[#F0E0CF] bg-white p-3 shadow-lg">
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
                  <button
                    type="button"
                    onClick={() => {
                      setCustomFieldName("");
                      setCustomFieldDialogOpen(true);
                      setColumnsOpen(false);
                    }}
                    className="mt-2 flex w-full items-center gap-2 border-t border-[#E9EDF3] pt-2 text-left text-xs font-semibold text-[#4D9AC6] hover:text-[#347FA8]"
                  >
                    <Plus size={14} />
                    Add custom field
                  </button>
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
              aria-label="Search customers"
              className="h-[30px] w-full border border-[#CFD7E2] bg-white pl-7 pr-2 text-[12px] outline-none focus:border-[#FF964B]"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1450px] table-fixed border-collapse text-left text-[12px]">
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
              {pageCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="odd:bg-[#F8F8F8] even:bg-white hover:bg-[#FFF8F0]"
                >
                  <td className="relative h-[47px] border border-[#E9EAF0] px-2 py-2 align-top">
                    <button
                      type="button"
                      aria-expanded={openActionsId === customer.id}
                      onClick={() =>
                        setOpenActionsId((current) =>
                          current === customer.id ? null : customer.id
                        )
                      }
                      className="inline-flex h-[25px] items-center gap-1 rounded-md border border-[#20BFE0] px-2 text-[11px] text-[#1680B5] transition hover:bg-[#EAFBFF]"
                    >
                      Actions
                      <ChevronDown size={12} />
                    </button>
                    {openActionsId === customer.id && (
                      <div className="absolute left-2 top-10 z-20 min-w-44 rounded-md border border-[#E9EAF0] bg-white p-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCustomerAction("Pay");
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
                            setViewingCustomer(customer);
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
                            setEditingCustomer(customer);
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
                            setDeletingCustomer(customer);
                            setOpenActionsId(null);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-[#F04452] hover:bg-[#FFF0F1]"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCustomerStatus(customer)}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#F8FAFD]"
                        >
                          <Power size={13} />
                          {customer.status === "Inactive" ? "Activate" : "Deactivate"}
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
                              setSelectedCustomerAction(label);
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
                      {formatCell(column, customer)}
                    </td>
                  ))}
                </tr>
              ))}
              {!pageCustomers.length && (
                <tr>
                  <td
                    colSpan={visibleTableColumns.length + 1}
                    className="h-16 border border-[#E9EAF0] text-center text-xs text-[#63768D]"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#283961]">
          <p>
            Showing {firstEntry} to {lastEntry} of {filteredCustomers.length} entries
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

      {(addingCustomer || editingCustomer) && (
        <CustomerModal
          customer={editingCustomer ?? emptyCustomer}
          customFields={customFields}
          onClose={() => {
            setAddingCustomer(false);
            setEditingCustomer(null);
          }}
          onSave={saveCustomer}
        />
      )}
      {viewingCustomer && (
        <CustomerModal
          customer={viewingCustomer}
          customFields={customFields}
          onClose={() => setViewingCustomer(null)}
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
            <h2 className="mb-4 text-lg font-semibold text-[#283961]">
              Add custom field
            </h2>
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
      {selectedCustomerAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setSelectedCustomerAction(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-action-title"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="customer-action-title"
              className="text-lg font-semibold text-[#283961]"
            >
              {selectedCustomerAction}
            </h2>
            <p className="mt-2 text-xs text-[#63768D]">
              {selectedCustomerAction} is not available for customers yet.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomerAction(null)}
                className="h-9 rounded-md bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-xs font-semibold text-white hover:brightness-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {deletingCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/40 p-4"
          onClick={() => setDeletingCustomer(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-customer-title"
            className="w-full max-w-sm rounded-2xl border border-[#F0E0CF] bg-white p-5 shadow-[0_15px_50px_rgba(25,43,80,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-customer-title"
              className="text-lg font-semibold text-[#283961]"
            >
              Delete customer?
            </h2>
            <p className="mt-2 text-xs text-[#63768D]">
              This will permanently remove{" "}
              {deletingCustomer.name || deletingCustomer.contactId}.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="h-9 rounded-md border border-[#D9C7B3] px-4 text-xs text-[#63768D] hover:bg-[#FFF5EA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteCustomer}
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