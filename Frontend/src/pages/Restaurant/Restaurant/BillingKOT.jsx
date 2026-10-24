
import React, { useState } from "react";
import {
  Utensils,
  Users,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  X,
  IndianRupee,
  ChevronRight,
} from "lucide-react";
import TableOccupied from "./TableOccupied.jsx";
import TableAvailable from "./TableAvailable.jsx";

const initialTables = Array.from({ length: 18 }, (_, index) => {
  const number = index + 1;

  return {
    id: number,
    name: `Table ${number}`,
    status: [1, 10].includes(number) ? "Occupied" : "Available",
    amount: number === 1 ? 288 : number === 10 ? 598 : 0,
    guests: 0,
    orderTime: "",
  };
});

const inputClass =
  "w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA7B8] focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70";

export default function BillingKOT() {
  const [tables, setTables] = useState(initialTables);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTable, setSelectedTable] = useState(null);
  const [occupiedTable, setOccupiedTable] = useState(null);
  const [availableTable, setAvailableTable] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const occupiedCount = tables.filter(
    (table) => table.status === "Occupied"
  ).length;

  const availableCount = tables.filter(
    (table) => table.status === "Available"
  ).length;

  const occupiedValue = tables
    .filter((table) => table.status === "Occupied")
    .reduce((sum, table) => sum + table.amount, 0);

  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesStatus =
      statusFilter === "All" || table.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openTable = (table) => {
    if (table.status === "Occupied") {
      setOccupiedTable(table);
      return;
    }

    setAvailableTable(table);
  };

  const updateTableStatus = (id, status) => {
    setTables((previous) =>
      previous.map((table) =>
        table.id === id
          ? {
              ...table,
              status,
              amount: status === "Available" ? 0 : table.amount,
            }
          : table
      )
    );

    setSelectedTable(null);
  };

  const saveTable = () => {
    if (!selectedTable) return;

    setTables((previous) =>
      previous.map((table) =>
        table.id === selectedTable.id
          ? {
              ...table,
              status: selectedTable.status,
              amount: Number(selectedTable.amount) || 0,
              guests: Number(selectedTable.guests) || 0,
            }
          : table
      )
    );

    setSelectedTable(null);
  };

  const formatCurrency = (amount) =>
    `₹ ${Number(amount).toLocaleString("en-IN")}`;

  if (occupiedTable) {
    return (
      <TableOccupied
        table={occupiedTable}
        onBack={() => setOccupiedTable(null)}
        onEditOrder={(order) => {
          setOccupiedTable(null);
          setAvailableTable(order);
        }}
      />
    );
  }

  if (availableTable) {
    return (
      <TableAvailable
        initialOrder={availableTable}
        onBack={() => setAvailableTable(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6814]">
              <Utensils size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#10234F] sm:text-3xl">
                Dine In Tables
              </h1>
              <p className="mt-1 text-sm text-[#718096]">
                Manage table availability and current orders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-[#F0E4D8] bg-white px-4 py-2.5 text-sm font-semibold text-[#60728D] shadow-sm">
            <Clock size={16} className="text-[#FF812B]" />
            Table Overview
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Tables"
            value={tables.length}
            icon={Utensils}
            iconClass="bg-orange-100 text-[#FF6814]"
          />

          <SummaryCard
            title="Available Tables"
            value={availableCount}
            icon={CheckCircle2}
            iconClass="bg-emerald-100 text-emerald-600"
          />

          <SummaryCard
            title="Occupied Tables"
            value={occupiedCount}
            icon={Users}
            iconClass="bg-rose-100 text-rose-600"
          />

          <SummaryCard
            title="Occupied Amount"
            value={formatCurrency(occupiedValue)}
            icon={IndianRupee}
            iconClass="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Table management */}
        <section className="overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#EEF1F5] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#10234F]">
                Table Management
              </h2>
              <p className="mt-1 text-sm text-[#8491A5]">
                Select a table to view or update its status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search table..."
                  className={`${inputClass} pl-10 sm:w-56`}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                  showFilters
                    ? "border-orange-200 bg-orange-50 text-[#FF6814]"
                    : "border-[#E2E8F0] bg-white text-[#60728D] hover:bg-slate-50"
                }`}
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="border-b border-[#EEF1F5] bg-[#FFFCF8] px-5 py-4 sm:px-6">
              <label className="block max-w-xs text-xs font-bold uppercase tracking-wide text-[#718096]">
                Table Status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={`${inputClass} mt-2`}
                >
                  <option value="All">All Tables</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </label>
            </div>
          )}

          {/* Status legend */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-[#60728D]">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              Available
            </div>

            <div className="flex items-center gap-2 text-sm text-[#60728D]">
              <span className="h-3 w-3 rounded-full bg-[#FF6814]" />
              Occupied
            </div>

            <div className="ml-auto text-sm text-[#8491A5]">
              Showing{" "}
              <span className="font-bold text-[#10234F]">
                {filteredTables.length}
              </span>{" "}
              of {tables.length} tables
            </div>
          </div>

          {/* Table grid */}
          <div className="px-5 pb-6 sm:px-6">
            {filteredTables.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6">
                {filteredTables.map((table) => {
                  const occupied = table.status === "Occupied";

                  return (
                    <button
                      key={table.id}
                      type="button"
                      onClick={() => openTable(table)}
                      className={`group relative flex min-h-[170px] flex-col items-center justify-center overflow-hidden rounded-2xl border p-4 text-center transition duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                        occupied
                          ? "border-orange-200 bg-gradient-to-br from-orange-50 to-[#FFF1E6] hover:border-orange-400"
                          : "border-[#DFEAF8] bg-gradient-to-br from-white to-[#F1F7FF] hover:border-blue-300"
                      }`}
                    >
                      <div
                        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105 ${
                          occupied
                            ? "bg-orange-100 text-[#FF6814]"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Utensils size={25} strokeWidth={1.8} />
                      </div>

                      <h3 className="text-base font-extrabold text-[#10234F]">
                        {table.name}
                      </h3>

                      <span
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          occupied
                            ? "bg-orange-100 text-[#C84B0C]"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            occupied ? "bg-[#FF6814]" : "bg-emerald-500"
                          }`}
                        />
                        {table.status}
                      </span>

                      {occupied && (
                        <p className="mt-2 text-sm font-extrabold tabular-nums text-[#C84B0C]">
                          {formatCurrency(table.amount)}
                        </p>
                      )}

                      <span className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100">
                        <ArrowUpRight size={16} className="text-[#718096]" />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E2E8F0] py-16 text-center">
                <Search className="mx-auto text-[#94A3B8]" size={28} />
                <h3 className="mt-3 font-bold text-[#10234F]">
                  No tables found
                </h3>
                <p className="mt-1 text-sm text-[#8491A5]">
                  Try changing your search or status filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 text-sm font-bold text-[#FF6814] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Table details modal */}
      {selectedTable && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTable(null);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-5 py-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#10234F]">
                  {selectedTable.name}
                </h3>
                <p className="mt-1 text-sm text-[#8491A5]">
                  Table details and status
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTable(null)}
                className="rounded-lg p-2 text-[#8290A4] hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-xl bg-[#FFFAF5] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8491A5]">
                  Current status
                </p>
                <p
                  className={`mt-2 text-lg font-extrabold ${
                    selectedTable.status === "Occupied"
                      ? "text-[#FF6814]"
                      : "text-emerald-600"
                  }`}
                >
                  {selectedTable.status}
                </p>
              </div>

              <label className="block text-sm font-bold text-[#33445F]">
                Status
                <select
                  value={selectedTable.status}
                  onChange={(event) =>
                    setSelectedTable((previous) => ({
                      ...previous,
                      status: event.target.value,
                      amount:
                        event.target.value === "Available"
                          ? 0
                          : previous.amount,
                    }))
                  }
                  className={`${inputClass} mt-2`}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </label>

              {selectedTable.status === "Occupied" && (
                <>
                  <label className="block text-sm font-bold text-[#33445F]">
                    Current order amount (₹)
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={selectedTable.amount}
                      onChange={(event) =>
                        setSelectedTable((previous) => ({
                          ...previous,
                          amount: event.target.value,
                        }))
                      }
                      className={`${inputClass} mt-2`}
                    />
                  </label>

                  <label className="block text-sm font-bold text-[#33445F]">
                    Number of guests
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={selectedTable.guests}
                      onChange={(event) =>
                        setSelectedTable((previous) => ({
                          ...previous,
                          guests: event.target.value,
                        }))
                      }
                      className={`${inputClass} mt-2`}
                    />
                  </label>
                </>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-[#EEF1F5] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTable(null)}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-bold text-[#60728D] hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveTable}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200/60 hover:shadow-lg"
                >
                  Save Changes
                  <ChevronRight size={16} />
                </button>
              </div>

              {selectedTable.status === "Occupied" && (
                <button
                  type="button"
                  onClick={() =>
                    updateTableStatus(selectedTable.id, "Available")
                  }
                  className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Mark Table Available
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-[#F0E4D8] bg-white p-5 shadow-[0_5px_20px_rgba(16,35,79,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#718096]">{title}</p>
          <p className="mt-2 truncate text-2xl font-black tracking-tight text-[#10234F] sm:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}
