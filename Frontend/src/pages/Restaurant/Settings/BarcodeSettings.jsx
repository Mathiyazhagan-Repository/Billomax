
import React, { useMemo, useState } from "react";
import AddBarcodeStickerSetting from "./AddBarcodeStickerSetting.jsx";

const initialSettings = [];

export default function BarcodeSettings({
  settings: suppliedSettings,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [localSettings, setLocalSettings] = useState(initialSettings);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showAddSetting, setShowAddSetting] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const settings = suppliedSettings ?? localSettings;

  const filteredSettings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return settings
      .filter((setting) => {
        const name = String(
          setting.name ?? setting.sticker_sheet_setting_name ?? ""
        ).toLowerCase();

        const description = String(
          setting.description ??
            setting.sticker_sheet_setting_description ??
            ""
        ).toLowerCase();

        return name.includes(query) || description.includes(query);
      })
      .sort((a, b) => {
        const first = String(
          a.name ?? a.sticker_sheet_setting_name ?? ""
        ).toLowerCase();

        const second = String(
          b.name ?? b.sticker_sheet_setting_name ?? ""
        ).toLowerCase();

        const result = first.localeCompare(second);

        return sortDirection === "asc" ? result : -result;
      });
  }, [settings, search, sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSettings.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const displayedSettings = filteredSettings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const firstEntry =
    filteredSettings.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const lastEntry = Math.min(
    currentPage * pageSize,
    filteredSettings.length
  );

  const openAddSettingPage = () => {
    setShowAddSetting(true);
  };

  const handleAddStickerSetting = async (setting) => {
    if (onAdd) {
      await onAdd(setting);
    } else if (suppliedSettings === undefined) {
      setLocalSettings((previous) => [
        ...previous,
        { id: Date.now(), ...setting },
      ]);
    }

    setShowAddSetting(false);
    setPage(1);
  };

  const openEditModal = (setting) => {
    setEditingSetting(setting);
    setForm({
      name: String(
        setting.name ?? setting.sticker_sheet_setting_name ?? ""
      ),
      description: String(
        setting.description ??
          setting.sticker_sheet_setting_description ??
          ""
      ),
    });
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) return;

    const payload = {
      ...(editingSetting ?? {}),
      name,
      description,
    };

    if (editingSetting) {
      if (onEdit) {
        await onEdit(payload);
      } else if (suppliedSettings === undefined) {
        setLocalSettings((previous) =>
          previous.map((setting) =>
            setting.id === editingSetting.id ? payload : setting
          )
        );
      }
    } else {
      if (onAdd) {
        await onAdd({ name, description });
      } else if (suppliedSettings === undefined) {
        setLocalSettings((previous) => [
          ...previous,
          {
            id: Date.now(),
            name,
            description,
          },
        ]);
      }
    }

    setShowModal(false);
    setEditingSetting(null);
    setForm({ name: "", description: "" });
    setPage(1);
  };

  const handleDelete = async (setting) => {
    const name =
      setting.name ?? setting.sticker_sheet_setting_name ?? "this setting";

    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    if (onDelete) {
      await onDelete(setting);
    } else if (suppliedSettings === undefined) {
      setLocalSettings((previous) =>
        previous.filter((item) => item.id !== setting.id)
      );
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const iconButtonClass =
    "inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition hover:shadow-sm";

  if (showAddSetting) {
    return (
      <AddBarcodeStickerSetting
        onSave={handleAddStickerSetting}
        onClose={() => setShowAddSetting(false)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1800px] space-y-5">
        {/* Page heading */}
        <header>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
            <span className="text-[11px] font-extrabold">PHARMACY · SETTINGS</span>
          </div>

          <h1 className="app-page-title text-[#10234F]">
            Barcodes
          </h1>

          <p className="app-description mt-1 text-[#577B9F]">
            Manage your barcode settings and sticker sheet configurations.
          </p>
        </header>

        {/* Main card */}
        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          {/* Card header */}
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="app-section-title text-[#10234F]">
                All your barcode settings
              </h2>
              <p className="app-description mt-1 text-[#577B9F]">
                Manage sticker sheet setting names and descriptions.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddSettingPage}
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#FF711A] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F04A13] hover:shadow-md md:self-auto"
            >
              <span className="text-xl font-normal leading-none">+</span>
              Add new setting
            </button>
          </div>

          {/* Table controls */}
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-[#FFFCF8] px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#577B9F]">
              <label htmlFor="barcode-page-size">Show</label>

              <select
                id="barcode-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-[#E8EDF4] bg-white px-3 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              <span>entries</span>
            </div>

            <label className="relative block w-full md:w-72">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#8798AD]">
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
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search..."
                aria-label="Search barcode settings"
                className="h-10 w-full rounded-lg border border-[#E8EDF4] bg-white pl-9 pr-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          {/* Settings table */}
          <div className="px-4 pb-2 sm:px-6">
            <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#FFF7EF] text-[#19366F]">
                    <th className="border-b border-r border-[#F2E8DE] px-4 py-4 text-[10px] font-extrabold uppercase tracking-wide">
                      <button
                        type="button"
                        onClick={() =>
                          setSortDirection((previous) =>
                            previous === "asc" ? "desc" : "asc"
                          )
                        }
                        className="flex w-full items-center justify-between gap-2 text-left hover:text-[#F04A13]"
                      >
                        Sticker Sheet setting Name
                        <span className="text-xs text-[#A5B1C0]">
                          {sortDirection === "asc" ? "↕" : "↕"}
                        </span>
                      </button>
                    </th>

                    <th className="min-w-[300px] border-b border-r border-[#F2E8DE] px-4 py-4 text-[10px] font-extrabold uppercase tracking-wide">
                      Sticker Sheet setting Description
                    </th>

                    <th className="min-w-[175px] border-b border-[#F2E8DE] px-4 py-4 text-[10px] font-extrabold uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F2E8DE]">
                  {displayedSettings.map((setting, index) => {
                    const name =
                      setting.name ??
                      setting.sticker_sheet_setting_name ??
                      "";

                    const description =
                      setting.description ??
                      setting.sticker_sheet_setting_description ??
                      "";

                    return (
                      <tr
                        key={setting.id ?? setting.name ?? index}
                        className="align-top transition hover:bg-[#FFF7EF]"
                      >
                        <td className="border-r border-[#F2E8DE] px-4 py-4 font-semibold text-[#19366F]">
                          {name || "—"}
                        </td>

                        <td className="border-r border-[#F2E8DE] px-4 py-4 leading-6 text-[#577B9F]">
                          {description || "—"}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (onEdit) {
                                  onEdit(setting);
                                } else {
                                  openEditModal(setting);
                                }
                              }}
                              className={`${iconButtonClass} border-[#D8E8FF] text-[#3478F6] hover:bg-[#EAF3FF]`}
                            >
                              <span aria-hidden="true">↗</span>
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(setting)}
                              className={`${iconButtonClass} border-[#FFD9D2] text-[#C43D32] hover:bg-[#FFF0ED]`}
                            >
                              <span aria-hidden="true">×</span>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {displayedSettings.length === 0 && (
                    <tr>
                      <td colSpan={3} className="bg-[#FFFCF8] px-4 py-1">
                        <div className="py-8 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#F04A13]">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              className="h-6 w-6"
                            >
                              <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                rx="3"
                              />
                              <path d="M8 9h8M8 12h8M8 15h5" />
                            </svg>
                          </div>

                          <p className="mt-3 font-semibold text-[#10234F]">
                            {search
                              ? "No matching barcode settings"
                              : "No barcode settings available"}
                          </p>

                          <p className="mt-1 text-sm text-[#577B9F]">
                            {search
                              ? "Try a different search term."
                              : "Add a sticker sheet setting to get started."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Entry count and pagination */}
          <div className="flex flex-col gap-4 border-t border-[#F2E8DE] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((previous) => previous - 1)}
                className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="min-w-10 rounded-lg bg-[#FF711A] px-3 py-2 text-center text-sm font-bold text-white">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
                className="rounded-lg border border-[#E8EDF4] px-3 py-2 text-sm font-bold text-[#19366F] transition hover:bg-[#FFF1E5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-3 text-center text-xs leading-6 text-[#8798AD]">
          Billomax - Your Trusted Partner in Billing &amp; Invoicing - V6.3
          {" | "}Copyright © 2026 All rights reserved.
        </footer>
      </div>

      {/* Add / Edit modal for standalone use */}
      {showModal && !onAdd && !onEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl border border-[#F2E8DE] bg-white p-6 shadow-2xl"
          >
            <p className="inline-flex rounded-lg bg-[#FFE9D9] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#F04A13]">
              Barcode configuration
            </p>

            <h2 className="app-section-title mt-2 text-[#10234F]">
              {editingSetting ? "Edit Barcode Setting" : "Add New Setting"}
            </h2>

            <p className="mt-1 text-sm text-[#577B9F]">
              Enter the sticker sheet setting details.
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">
                  Sticker Sheet setting Name
                  <span className="text-[#C43D32]"> *</span>
                </span>
                <input
                  autoFocus
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter setting name"
                  className="h-11 w-full rounded-lg border border-[#E8EDF4] px-3 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">
                  Sticker Sheet setting Description
                </span>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Enter setting description"
                  className="w-full resize-y rounded-lg border border-[#E8EDF4] px-3 py-2.5 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[#E8EDF4] px-4 py-2.5 text-sm font-bold text-[#19366F] hover:bg-[#FFF1E5]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-[#FF711A] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#F04A13] hover:shadow-md"
              >
                {editingSetting ? "Save Changes" : "Add Setting"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
