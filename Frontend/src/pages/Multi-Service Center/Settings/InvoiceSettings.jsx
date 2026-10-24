
import React, { useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  Check,
  Info,
  X,
} from "lucide-react";
import AddInvoiceLayout from "./AddInvoiceLayout.jsx";
import AddInvoiceScheme from "./AddInvoiceScheme.jsx";

const initialSchemes = [
  {
    id: 1,
    name: "Default",
    prefix: "",
    numberingType: "Sequential",
    startFrom: 1,
    invoiceCount: 41,
    numberOfDigits: 4,
    isDefault: true,
  },
];

const initialLayouts = [
  {
    id: 1,
    name: "Default",
    type: "Default",
    isDefault: true,
    usedInLocations: [
      "WDM - Billing Software",
      "Palm Street",
      "DoubleTree by Hilton",
    ],
    includes: "",
  },
];

const schemeColumns = [
  { key: "name", label: "Name", info: true, width: "min-w-[150px]" },
  { key: "prefix", label: "Prefix", width: "min-w-[105px]" },
  {
    key: "numberingType",
    label: "Numbering Type",
    info: true,
    width: "min-w-[155px]",
  },
  { key: "startFrom", label: "Start from", info: true, width: "min-w-[115px]" },
  {
    key: "invoiceCount",
    label: "Invoice Count",
    info: true,
    width: "min-w-[125px]",
  },
  {
    key: "numberOfDigits",
    label: "Number of digits",
    info: true,
    width: "min-w-[155px]",
  },
];

function InfoIcon({ text = "More information" }) {
  return (
    <span className="group relative inline-flex align-middle">
      <Info
        size={15}
        className="ml-1 cursor-help text-cyan-500"
        aria-label={text}
      />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-48 -translate-x-1/2 rounded-lg bg-[#10234F] px-3 py-2 text-xs font-normal leading-5 text-white shadow-lg group-hover:block">
        {text}
      </span>
    </span>
  );
}

function ActionButton({ children, onClick, disabled = false, variant = "edit" }) {
  const styles = {
    edit: "border-blue-200 text-blue-600 hover:bg-blue-50",
    delete: "border-red-200 text-red-500 hover:bg-red-50",
    default: "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${styles[variant]} disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400`}
    >
      {children}
    </button>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="px-4 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6814]">
        <FileText size={26} />
      </div>
      <p className="mt-3 font-semibold text-[#10234F]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function InvoiceSettings({
  schemes: suppliedSchemes,
  layouts: suppliedLayouts,
  onAddScheme,
  onEditScheme,
  onDeleteScheme,
  onSetDefaultScheme,
  onAddLayout,
  onEditLayout,
  onDeleteLayout,
}) {
  const [activeTab, setActiveTab] = useState("schemes");
  const [schemeSearch, setSchemeSearch] = useState("");
  const [layoutSearch, setLayoutSearch] = useState("");
  const [localSchemes, setLocalSchemes] = useState(initialSchemes);
  const [localLayouts, setLocalLayouts] = useState(initialLayouts);
  const [editingScheme, setEditingScheme] = useState(null);
  const [showAddScheme, setShowAddScheme] = useState(false);
  const [showAddLayout, setShowAddLayout] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);

  const schemes = suppliedSchemes ?? localSchemes;
  const layouts = suppliedLayouts ?? localLayouts;

  const filteredSchemes = useMemo(() => {
    const query = schemeSearch.trim().toLowerCase();
    return schemes.filter((scheme) =>
      schemeColumns.some(({ key }) =>
        String(scheme[key] ?? "").toLowerCase().includes(query)
      )
    );
  }, [schemes, schemeSearch]);

  const filteredLayouts = useMemo(() => {
    const query = layoutSearch.trim().toLowerCase();
    return layouts.filter((layout) =>
      [
        layout.name,
        layout.type,
        layout.includes,
        ...(Array.isArray(layout.usedInLocations)
          ? layout.usedInLocations
          : []),
      ].some((value) => String(value ?? "").toLowerCase().includes(query))
    );
  }, [layouts, layoutSearch]);

  const handleEditScheme = (scheme) => {
    if (onEditScheme) onEditScheme(scheme);
    else setEditingScheme({ ...scheme });
  };

  const handleSaveScheme = (event) => {
    event.preventDefault();
    if (!editingScheme) return;

    if (onEditScheme) {
      onEditScheme(editingScheme);
    } else if (suppliedSchemes === undefined) {
      setLocalSchemes((previous) =>
        previous.map((scheme) =>
          scheme.id === editingScheme.id ? editingScheme : scheme
        )
      );
    }
    setEditingScheme(null);
  };

  const handleAddScheme = (scheme) => {
    if (onAddScheme) {
      onAddScheme(scheme);
    } else if (suppliedSchemes === undefined) {
      setLocalSchemes((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...scheme,
          prefix: scheme.format,
          startFrom: 1,
          invoiceCount: 0,
          numberOfDigits: 4,
          isDefault: false,
        },
      ]);
    }
    setShowAddScheme(false);
  };

  const handleDeleteScheme = async (scheme) => {
    if (scheme.isDefault) return;
    if (
      !window.confirm(
        `Are you sure you want to delete the "${scheme.name}" invoice scheme?`
      )
    ) return;

    if (onDeleteScheme) await onDeleteScheme(scheme);
    else if (suppliedSchemes === undefined) {
      setLocalSchemes((previous) =>
        previous.filter((item) => item.id !== scheme.id)
      );
    }
  };

  const handleSetDefault = async (scheme) => {
    if (scheme.isDefault) return;

    if (onSetDefaultScheme) await onSetDefaultScheme(scheme);
    else if (suppliedSchemes === undefined) {
      setLocalSchemes((previous) =>
        previous.map((item) => ({
          ...item,
          isDefault: item.id === scheme.id,
        }))
      );
    }
  };

  const handleDeleteLayout = async (layout) => {
    if (!window.confirm(`Delete invoice layout "${layout.name}"?`)) return;

    if (onDeleteLayout) {
      await onDeleteLayout(layout);
    } else if (suppliedLayouts === undefined) {
      setLocalLayouts((previous) =>
        previous.filter((item) => item.id !== layout.id)
      );
    }
  };

  const handleAddLayout = async (layout) => {
    if (onAddLayout) {
      await onAddLayout(layout);
    } else if (suppliedLayouts === undefined) {
      setLocalLayouts((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...layout,
          usedInLocations: [],
          includes: "",
          isDefault: false,
        },
      ]);
    }

    setShowAddLayout(false);
  };

  const handleEditLayout = async (layout) => {
    if (onEditLayout) {
      await onEditLayout(layout);
    } else if (suppliedLayouts === undefined) {
      setLocalLayouts((previous) =>
        previous.map((item) =>
          item.id === layout.id ? { ...item, ...layout } : item
        )
      );
    }

    setEditingLayout(null);
  };

  if (showAddLayout || editingLayout) {
    const isEditing = Boolean(editingLayout);

    return (
      <AddInvoiceLayout
        initialData={editingLayout}
        isEditing={isEditing}
        onSave={isEditing ? handleEditLayout : handleAddLayout}
        onClose={() => {
          setShowAddLayout(false);
          setEditingLayout(null);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-3 py-5 text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1800px] space-y-5">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6814]">
            Billomax / Configuration
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
            Invoice Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage invoice numbering schemes and invoice layouts.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          {/* Tabs */}
          <div className="border-b border-[#E9E4DE] px-4 pt-4 sm:px-6">
            <div
              role="tablist"
              aria-label="Invoice settings sections"
              className="flex flex-wrap gap-2"
            >
              {[
                { id: "schemes", label: "Invoice Schemes" },
                { id: "layouts", label: "Invoice Layouts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`${tab.id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-t-xl border px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                    activeTab === tab.id
                      ? "border-[#E9E4DE] border-b-white bg-white text-[#FF6814]"
                      : "border-transparent text-slate-500 hover:bg-orange-50 hover:text-[#10234F]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Invoice schemes */}
          {activeTab === "schemes" ? (
            <div role="tabpanel" aria-labelledby="schemes-tab">
              <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#FF812B]">
                    All your invoice schemes
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Configure invoice numbering and reference formats.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative block w-full sm:w-60">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="search"
                      value={schemeSearch}
                      onChange={(event) => setSchemeSearch(event.target.value)}
                      placeholder="Search schemes..."
                      aria-label="Search invoice schemes"
                      className="h-10 w-full rounded-lg border border-[#E2E5EC] bg-[#FFFCF8] pl-9 pr-3 text-sm outline-none transition focus:border-[#FF812B] focus:bg-white focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowAddScheme(true)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5"
                  >
                    <Plus size={17} />
                    Add
                  </button>
                </div>
              </div>

              <div className="px-4 pb-2 sm:px-6">
                <div className="overflow-x-auto rounded-xl border border-[#EDE9E4]">
                  <table className="w-full min-w-[950px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-[#FFF7ED] text-[#10234F]">
                        {schemeColumns.map((column) => (
                          <th
                            key={column.key}
                            className={`${column.width} border-b border-r border-[#F0E6DA] px-3 py-4 font-bold last:border-r-0`}
                          >
                            {column.label}
                            {column.info && (
                              <InfoIcon
                                text={`Information about ${column.label.toLowerCase()}`}
                              />
                            )}
                          </th>
                        ))}
                        <th className="min-w-[220px] border-b border-[#F0E6DA] px-3 py-4 font-bold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#F0EBE5]">
                      {filteredSchemes.map((scheme) => (
                        <tr
                          key={scheme.id}
                          className="align-top transition hover:bg-orange-50/40"
                        >
                          {schemeColumns.map((column) => (
                            <td
                              key={column.key}
                              className="border-r border-[#F3EFEA] px-3 py-3.5 text-[#34445D] last:border-r-0"
                            >
                              {column.key === "name" ? (
                                <div className="flex flex-col items-start gap-1">
                                  <span>{scheme.name}</span>
                                  {scheme.isDefault && (
                                    <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                      Default
                                    </span>
                                  )}
                                </div>
                              ) : (
                                scheme[column.key] ?? ""
                              )}
                            </td>
                          ))}

                          <td className="px-3 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <ActionButton onClick={() => handleEditScheme(scheme)}>
                                <Pencil size={13} />
                                Edit
                              </ActionButton>
                              <ActionButton
                                variant="delete"
                                disabled={scheme.isDefault}
                                onClick={() => handleDeleteScheme(scheme)}
                              >
                                <Trash2 size={13} />
                                Delete
                              </ActionButton>
                              {scheme.isDefault ? (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                  <Check size={13} />
                                  Default
                                </span>
                              ) : (
                                <ActionButton
                                  variant="default"
                                  onClick={() => handleSetDefault(scheme)}
                                >
                                  Set Default
                                </ActionButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredSchemes.length === 0 && (
                        <tr>
                          <td colSpan={schemeColumns.length + 1}>
                            <EmptyState
                              title="No invoice schemes found"
                              description="Try a different search term or add an invoice scheme."
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-4 py-4 text-sm text-slate-500 sm:px-6">
                Showing{" "}
                <span className="font-semibold text-[#10234F]">
                  {filteredSchemes.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#10234F]">
                  {schemes.length}
                </span>{" "}
                entries
              </div>
            </div>
          ) : (
            /* Invoice layouts */
            <div role="tabpanel" aria-labelledby="layouts-tab">
              <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#FF812B]">
                    All your invoice layouts
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage the layouts used for invoices and sales documents.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative block w-full sm:w-60">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="search"
                      value={layoutSearch}
                      onChange={(event) => setLayoutSearch(event.target.value)}
                      placeholder="Search layouts..."
                      aria-label="Search invoice layouts"
                      className="h-10 w-full rounded-lg border border-[#E2E5EC] bg-[#FFFCF8] pl-9 pr-3 text-sm outline-none focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingLayout(null);
                      setShowAddLayout(true);
                    }}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5"
                  >
                    <Plus size={17} />
                    Add
                  </button>
                </div>
              </div>

              {filteredLayouts.length === 0 ? (
                <EmptyState
                  title="No invoice layouts available"
                  description="Add an invoice layout or connect your existing layout records to display them here."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 px-4 pb-6 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
                  {filteredLayouts.map((layout, index) => {
                    const locations = Array.isArray(layout.usedInLocations)
                      ? layout.usedInLocations
                      : [];

                    return (
                      <article
                        key={layout.id ?? index}
                        className="group rounded-xl border border-[#E6EDF5] bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EEF6FF] text-[#3288B8]">
                            <FileText size={36} strokeWidth={1.6} />
                          </div>

                          {layout.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              <Check size={12} />
                              Default
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 font-semibold text-[#10234F]">
                          {layout.name || "Untitled layout"}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {layout.type || "Invoice layout"}
                        </p>

                        <div className="mt-4 border-t border-[#EEF1F5] pt-3">
                          <p className="text-xs font-bold text-[#10234F]">
                            Used in locations:
                          </p>

                          {locations.length > 0 ? (
                            <ul className="mt-1 space-y-1 text-sm text-slate-600">
                              {locations.map((location, locationIndex) => (
                                <li key={`${location}-${locationIndex}`}>
                                  {location}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-1 text-sm text-slate-400">
                              No location information provided
                            </p>
                          )}

                          {layout.includes && (
                            <p className="mt-3 text-sm text-slate-600">
                              <span className="font-semibold">Includes:</span>{" "}
                              {layout.includes}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#EEF1F5] pt-3">
                          <ActionButton
                            onClick={() => {
                              setShowAddLayout(false);
                              setEditingLayout(layout);
                            }}
                          >
                            <Pencil size={13} />
                            Edit
                          </ActionButton>
                          <ActionButton
                            variant="delete"
                            onClick={() => handleDeleteLayout(layout)}
                          >
                            <Trash2 size={13} />
                            Delete
                          </ActionButton>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="py-3 text-center text-xs leading-6 text-slate-500">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
          {" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>

      {/* Edit invoice scheme */}
      {editingScheme && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#10234F]/40 p-2 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditingScheme(null);
          }}
        >
          <form
            onSubmit={handleSaveScheme}
            className="my-auto max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#EEE6DC] bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#FF6814]">
                  Invoice configuration
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#10234F]">
                  Edit Invoice Scheme
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setEditingScheme(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {schemeColumns.map((column) => (
                <label key={column.key} className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[#10234F]">
                    {column.label}
                  </span>

                  {column.key === "numberingType" ? (
                    <select
                      value={editingScheme.numberingType ?? "Sequential"}
                      onChange={(event) =>
                        setEditingScheme((previous) => ({
                          ...previous,
                          numberingType: event.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-[#DCE2EB] bg-white px-3 text-sm outline-none focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="Sequential">Sequential</option>
                      <option value="Random">Random</option>
                    </select>
                  ) : (
                    <input
                      type={
                        ["startFrom", "invoiceCount", "numberOfDigits"].includes(
                          column.key
                        )
                          ? "number"
                          : "text"
                      }
                      min={
                        ["startFrom", "numberOfDigits"].includes(column.key)
                          ? 1
                          : 0
                      }
                      value={editingScheme[column.key] ?? ""}
                      onChange={(event) =>
                        setEditingScheme((previous) => ({
                          ...previous,
                          [column.key]: [
                            "startFrom",
                            "invoiceCount",
                            "numberOfDigits",
                          ].includes(column.key)
                            ? event.target.value === ""
                              ? ""
                              : Number(event.target.value)
                            : event.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-[#DCE2EB] bg-white px-3 text-sm outline-none focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingScheme(null)}
                className="rounded-lg border border-[#E2E5EC] px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddScheme && (
        <AddInvoiceScheme
          onSave={handleAddScheme}
          onClose={() => setShowAddScheme(false)}
        />
      )}
    </main>
  );
}
