
import React, { useMemo, useState } from "react";
import AddBusinessLocation from "./AddBusinessLocation.jsx";
import BusinessLocationSettings from "./BusinessLocationSettings.jsx";

const initialLocations = [
  {
    id: 1,
    name: "Pharmacy",
    locationId: "BL0001",
    landmark: "JP Nagar, Kumarswamy Layout, Bangaluru",
    city: "Bengaluru",
    zipCode: "591313",
    state: "Karnataka",
    country: "India",
    priceGroup: "",
    invoiceScheme: "Default",
    invoiceLayoutPOS: "Default",
    invoiceLayoutSale: "Default",
  },
  {
    id: 2,
    name: "Soujanya H V",
    locationId: "kumarswamy0001",
    landmark: "kumarswamy layout",
    city: "Banglore",
    zipCode: "560111",
    state: "Karnataka",
    country: "India",
    priceGroup: "",
    invoiceScheme: "Default",
    invoiceLayoutPOS: "Default",
    invoiceLayoutSale: "Default",
  },
];

const columns = [
  { key: "name", label: "Name", width: "min-w-[125px]" },
  { key: "locationId", label: "Location ID", width: "min-w-[150px]" },
  { key: "landmark", label: "Landmark", width: "min-w-[165px]" },
  { key: "city", label: "City", width: "min-w-[105px]" },
  { key: "zipCode", label: "Zip Code", width: "min-w-[95px]" },
  { key: "state", label: "State", width: "min-w-[115px]" },
  { key: "country", label: "Country", width: "min-w-[95px]" },
  { key: "priceGroup", label: "Price Group", width: "min-w-[105px]" },
  { key: "invoiceScheme", label: "Invoice scheme", width: "min-w-[115px]" },
  {
    key: "invoiceLayoutPOS",
    label: "Invoice layout for POS",
    width: "min-w-[125px]",
  },
  {
    key: "invoiceLayoutSale",
    label: "Invoice layout for sale",
    width: "min-w-[125px]",
  },
];

function ActionButton({ icon, children, color, onClick }) {
  const styles = {
    blue: "border-indigo-200 text-indigo-600 hover:bg-indigo-50",
    teal: "border-teal-200 text-teal-600 hover:bg-teal-50",
    red: "border-red-200 text-red-500 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition duration-200 hover:shadow-sm ${styles[color]}`}
    >
      <span aria-hidden="true">{icon}</span>
      {children}
    </button>
  );
}

export default function BusinessLocations({
  locations: suppliedLocations,
  onAdd,
  onEdit,
  onSettings,
  onDeactivate,
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({
    key: "name",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [localLocations, setLocalLocations] = useState(initialLocations);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [settingsLocation, setSettingsLocation] = useState(null);

  const locations = suppliedLocations ?? localLocations;

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = locations.filter((location) =>
      columns.some(({ key }) =>
        String(location[key] ?? "").toLowerCase().includes(query)
      )
    );

    return [...filtered].sort((a, b) => {
      const first = String(a[sort.key] ?? "").toLowerCase();
      const second = String(b[sort.key] ?? "").toLowerCase();

      const result = first.localeCompare(second, undefined, {
        numeric: true,
      });

      return sort.direction === "asc" ? result : -result;
    });
  }, [locations, search, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLocations.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const displayedLocations = filteredLocations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (showAddLocation || editingLocation) {
    const isEditing = Boolean(editingLocation);

    return (
      <AddBusinessLocation
        title={isEditing ? "Edit Business Location" : undefined}
        submitLabel={isEditing ? "Update Location" : undefined}
        initialData={
          editingLocation
            ? {
                ...editingLocation,
                locationId:
                  editingLocation.locationId ??
                  editingLocation.location_id ??
                  "",
                zipCode:
                  editingLocation.zipCode ??
                  editingLocation.zip_code ??
                  "",
                alternateContactNumber:
                  editingLocation.alternateContactNumber ??
                  editingLocation.alternate_contact_number ??
                  "",
                invoiceSchemePOS:
                  editingLocation.invoiceSchemePOS ??
                  editingLocation.invoiceScheme ??
                  editingLocation.invoice_scheme ??
                  "",
                invoiceSchemeSale:
                  editingLocation.invoiceSchemeSale ??
                  editingLocation.invoiceScheme ??
                  editingLocation.invoice_scheme ??
                  "",
                defaultSellingPriceGroup:
                  editingLocation.defaultSellingPriceGroup ??
                  editingLocation.priceGroup ??
                  editingLocation.price_group ??
                  "",
              }
            : undefined
        }
        onSave={(payload) => {
          if (!editingLocation) {
            onAdd?.(payload);
            return;
          }

          if (onEdit) {
            onEdit(editingLocation, payload);
          } else {
            setLocalLocations((previous) =>
              previous.map((location) =>
                location === editingLocation
                  ? { ...location, ...payload }
                  : location
              )
            );
          }

          setEditingLocation(null);
        }}
        onClose={() => {
          setShowAddLocation(false);
          setEditingLocation(null);
        }}
      />
    );
  }

  if (settingsLocation) {
    return (
      <BusinessLocationSettings
        location={settingsLocation}
        onBack={() => setSettingsLocation(null)}
        onUpdate={(settings) => onSettings?.(settingsLocation, settings)}
      />
    );
  }

  const toggleSort = (key) => {
    setSort((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleDeactivate = async (location) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${location.name}"?`
    );

    if (!confirmed) return;

    if (onDeactivate) {
      await onDeactivate(location);
      return;
    }

    // Connect onDeactivate to your existing API to persist this action.
  };

  const firstEntry =
    filteredLocations.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const lastEntry = Math.min(
    currentPage * pageSize,
    filteredLocations.length
  );

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-3 py-5 text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1800px] space-y-5">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6814]">
              Billomax / Configuration
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              Business Locations
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your business locations, invoice settings and location details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingLocation(null);
              setShowAddLocation(true);
            }}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-[14px] bg-[#FF621F] px-6 py-2.5 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(255,98,31,0.28)] transition-all hover:bg-[#E95510] hover:shadow-[0_6px_18px_rgba(255,98,31,0.38)] active:translate-y-px sm:self-auto"
          >
            <span className="text-lg leading-none">+</span>
            Add Location
          </button>
        </header>

        {/* Main table card */}
        <section className="overflow-hidden rounded-2xl border border-[#EEE6DC] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#F0EBE5] px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#FF812B]">
                All your business locations
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View and manage all registered locations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="relative block w-full sm:w-64">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
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
                  placeholder="Search locations..."
                  aria-label="Search business locations"
                  className="h-10 w-full rounded-lg border border-[#E2E5EC] bg-[#FFFCF8] pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1680FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
          </div>

          {/* Table toolbar */}
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <label htmlFor="location-page-size">Show</label>
              <select
                id="location-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-[#DCE2EB] bg-white px-3 text-sm outline-none focus:border-[#1680FF]"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <p className="text-xs text-slate-400">
              {columns.length + 1} columns · Horizontal scrolling enabled
            </p>
          </div>

          {/* Keep every column accessible on small screens */}
          <div className="px-4 pb-2 sm:px-6">
            <div className="overflow-x-auto rounded-xl border border-[#EDE9E4]">
              <table className="w-full min-w-[1450px] table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#FFF7ED] text-[#10234F]">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`${column.width} border-b border-r border-[#F0E6DA] px-3 py-4 align-bottom last:border-r-0`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className="flex w-full items-end justify-between gap-2 text-left font-bold leading-5 hover:text-[#FF6814]"
                        >
                          <span>{column.label}</span>
                          <span className="shrink-0 text-xs text-slate-400">
                            {sort.key === column.key
                              ? sort.direction === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        </button>
                      </th>
                    ))}

                    <th className="min-w-[175px] border-b border-[#F0E6DA] px-3 py-4 align-bottom font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0EBE5]">
                  {displayedLocations.map((location, index) => (
                    <tr
                      key={location.id ?? location.locationId ?? index}
                      className="align-top transition hover:bg-orange-50/40"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="break-words border-r border-[#F3EFEA] px-3 py-4 leading-6 text-[#34445D] last:border-r-0"
                        >
                          {location[column.key] || (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      ))}

                      <td className="px-3 py-3">
                        <div className="flex min-w-[145px] flex-col items-start gap-1.5">
                          <ActionButton
                            icon="↗"
                            color="blue"
                            onClick={() => {
                              setSettingsLocation(null);
                              setShowAddLocation(false);
                              setEditingLocation(location);
                            }}
                          >
                            Edit
                          </ActionButton>

                          <ActionButton
                            icon="⚙"
                            color="teal"
                            onClick={() => {
                              setSettingsLocation(location);
                              onSettings?.(location);
                            }}
                          >
                            Settings
                          </ActionButton>

                          <ActionButton
                            icon="⏻"
                            color="red"
                            onClick={() => handleDeactivate(location)}
                          >
                            Deactivate Location
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {displayedLocations.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="px-4 py-14 text-center"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-xl text-[#FF6814]">
                          ⌕
                        </div>
                        <p className="mt-3 font-semibold text-[#10234F]">
                          No locations found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Try another search term.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-[#10234F]">
                {firstEntry} to {lastEntry}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredLocations.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((previous) => previous - 1)}
                className="rounded-lg border border-[#E2E5EC] px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="min-w-10 rounded-lg bg-[#FF6814] px-3 py-2 text-center text-sm font-bold text-white">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
                className="rounded-lg border border-[#E2E5EC] px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <footer className="py-3 text-center text-xs leading-6 text-slate-500">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
          {" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>
    </main>
  );
}
