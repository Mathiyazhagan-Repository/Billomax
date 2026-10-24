// BarcodeSettings.jsx
import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  ArrowUpDown,
  Pencil,
  Trash2,
  Check,
  Barcode,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Settings2,
  FileText,
} from "lucide-react";
import AddBarcodeStickerSetting from "./AddBarcodeStickerSetting.jsx";

const initialSettings = [
  {
    id: 1,
    name: "BAERCODE1",
    description: "",
    isDefault: false,
  },
];

export default function BarcodeSettings({
  settings: suppliedSettings,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  const [localSettings, setLocalSettings] = useState(initialSettings);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddSetting, setShowAddSetting] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);

  const settings = suppliedSettings ?? localSettings;

  const getName = (setting) =>
    String(setting.name ?? setting.sticker_sheet_setting_name ?? "");

  const getDescription = (setting) =>
    String(
      setting.description ??
        setting.sticker_sheet_setting_description ??
        ""
    );

  const filteredSettings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return settings
      .filter((setting) => {
        return (
          getName(setting).toLowerCase().includes(query) ||
          getDescription(setting).toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const result = getName(a).localeCompare(getName(b));
        return sortDirection === "asc" ? result : -result;
      });
  }, [settings, search, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredSettings.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const displayedSettings = filteredSettings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const firstEntry =
    filteredSettings.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastEntry = Math.min(currentPage * pageSize, filteredSettings.length);

  const updateLocal = (updater) => {
    if (suppliedSettings === undefined) {
      setLocalSettings(updater);
    }
  };

  const openAddSettingPage = () => {
    setEditingSetting(null);
    setShowAddSetting(true);
  };

  const handleSaveStickerSetting = async (setting) => {
    if (editingSetting) {
      const payload = { ...editingSetting, ...setting };
      if (onEdit) {
        await onEdit(payload);
      } else {
        updateLocal((previous) =>
          previous.map((item) =>
            editingSetting.id != null
              ? item.id === editingSetting.id
                ? payload
                : item
              : item === editingSetting
                ? payload
                : item
          )
        );
      }
    } else if (onAdd) {
      await onAdd(setting);
    } else {
      updateLocal((previous) => [
        ...previous,
        { id: Date.now(), ...setting, isDefault: false },
      ]);
    }

    setEditingSetting(null);
    setShowAddSetting(false);
    setPage(1);
  };

  const openEditSettingPage = (setting) => {
    setEditingSetting(setting);
    setShowAddSetting(true);
  };

  const handleDelete = async (setting) => {
    const name = getName(setting) || "this setting";

    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    if (onDelete) {
      await onDelete(setting);
    } else {
      updateLocal((previous) =>
        previous.filter((item) => item.id !== setting.id)
      );
    }
  };

  const handleSetDefault = async (setting) => {
    const payload = { ...setting, isDefault: true };

    if (onSetDefault) {
      await onSetDefault(payload);
    } else {
      updateLocal((previous) =>
        previous.map((item) => ({
          ...item,
          isDefault: item.id === setting.id,
        }))
      );
    }
  };

  const actionButton =
    "inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition hover:shadow-sm";

  if (showAddSetting) {
    return (
      <AddBarcodeStickerSetting
        initialSetting={editingSetting}
        onSave={handleSaveStickerSetting}
        onClose={() => {
          setShowAddSetting(false);
          setEditingSetting(null);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[#FFE9D9] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#F04A13]">
              <Settings2 size={14} />
              Pharmacy · Settings
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              Barcodes
            </h1>
            <p className="mt-1 text-sm text-[#577B9F]">
              Manage your barcode settings and sticker sheet configurations.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddSettingPage}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-lg sm:self-auto"
          >
            <Plus size={18} />
            Add new setting
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_6px_24px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-[#FF6814]">
                <Barcode size={23} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#10234F] sm:text-xl">
                  All your barcode settings
                </h2>
                <p className="mt-1 text-sm text-[#577B9F]">
                  Manage sticker sheet setting names and descriptions.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-sm text-[#577B9F]">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  className="h-10 rounded-lg border border-[#E6EDF5] bg-white px-3 text-sm font-semibold text-[#10234F] outline-none focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </label>

              <label className="relative block w-full sm:w-64">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search..."
                  aria-label="Search barcode settings"
                  className="h-10 w-full rounded-lg border border-[#E6EDF5] bg-white pl-9 pr-3 text-sm text-[#10234F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                />
              </label>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="overflow-x-auto rounded-xl border border-[#E6EDF5]">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#10234F]">
                    <th className="border-b border-r border-[#E6EDF5] px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() =>
                          setSortDirection((previous) =>
                            previous === "asc" ? "desc" : "asc"
                          )
                        }
                        className="flex w-full items-center justify-between gap-2 text-left text-xs font-bold hover:text-[#FF6814]"
                      >
                        Sticker Sheet setting Name
                        <ArrowUpDown
                          size={15}
                          className="shrink-0 text-slate-400"
                        />
                      </button>
                    </th>
                    <th className="border-b border-r border-[#E6EDF5] px-4 py-3.5 text-xs font-bold">
                      <span className="inline-flex items-center gap-2">
                        Sticker Sheet setting Description
                        <ArrowUpDown size={15} className="text-slate-300" />
                      </span>
                    </th>
                    <th className="min-w-[300px] border-b border-[#E6EDF5] px-4 py-3.5 text-xs font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E6EDF5]">
                  {displayedSettings.map((setting, index) => {
                    const name = getName(setting);
                    const description = getDescription(setting);
                    const isDefault = Boolean(setting.isDefault ?? setting.is_default);

                    return (
                      <tr
                        key={setting.id ?? name ?? index}
                        className={`transition hover:bg-orange-50/60 ${
                          index % 2 === 0 ? "bg-white" : "bg-[#FFFCF8]"
                        }`}
                      >
                        <td className="border-r border-[#E6EDF5] px-4 py-4 font-medium text-[#19366F]">
                          <div className="flex items-center gap-2">
                            <span>{name || "—"}</span>
                            {isDefault && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                Default
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="border-r border-[#E6EDF5] px-4 py-4 leading-6 text-[#577B9F]">
                          {description || ""}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditSettingPage(setting)}
                              className={`${actionButton} border-indigo-200 text-indigo-600 hover:bg-indigo-50`}
                            >
                              <Pencil size={13} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(setting)}
                              className={`${actionButton} border-rose-200 text-rose-600 hover:bg-rose-50`}
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>

                            {isDefault ? (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                                <CheckCircle2 size={13} />
                                Default
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetDefault(setting)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-cyan-600"
                              >
                                <Check size={13} />
                                Set as default
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {displayedSettings.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center">
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6814]">
                          {search ? (
                            <Search size={22} />
                          ) : (
                            <FileText size={22} />
                          )}
                        </span>
                        <p className="mt-3 font-bold text-[#10234F]">
                          {search
                            ? "No matching barcode settings"
                            : "No barcode settings available"}
                        </p>
                        <p className="mt-1 text-sm text-[#577B9F]">
                          {search
                            ? "Try a different search term."
                            : "Add a sticker sheet setting to get started."}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#577B9F]">
                Showing{" "}
                <span className="font-semibold text-[#10234F]">
                  {firstEntry} to {lastEntry}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#10234F]">
                  {filteredSettings.length}
                </span>{" "}
                entries
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((previous) => previous - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E6EDF5] px-3 py-2 text-sm font-semibold text-[#19366F] transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-3 text-sm font-bold text-white">
                  {currentPage}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((previous) => previous + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E6EDF5] px-3 py-2 text-sm font-semibold text-[#19366F] transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-3 text-center text-xs leading-6 text-slate-400">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
          {" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>
    </main>
  );
}