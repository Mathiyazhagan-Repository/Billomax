    
import React, { useMemo, useRef, useState } from "react";
import {
  Upload,
  RefreshCw,
  Info,
  ThumbsUp,
  Trash2,
  ShoppingCart,
  Package,
  Search,
  X,
  Check,
  ShieldCheck,
  Layers3,
  FileArchive,
  AlertCircle,
} from "lucide-react";

const initialModules = [
  {
    id: 1,
    name: "Superadmin",
    description:
      "Turn your POS to SaaS application and start earning by selling subscriptions. Direct install by AnNguyen",
    version: "6.0",
    installed: true,
    canUninstall: true,
    canDelete: true,
  },
  {
    id: 2,
    name: "Essentials Module",
    description: "Essentials features for every growing businesses.",
    installed: false,
  },
  {
    id: 3,
    name: "Woocommerce Module",
    description: "Sync your Woocommerce store with POS",
    installed: false,
  },
  {
    id: 4,
    name: "Manufacturing Module",
    description:
      "Manufacture products from raw materials, organise recipe & ingredients",
    installed: false,
  },
  {
    id: 5,
    name: "Project Module",
    description:
      "Manage Projects, tasks, tasks time logs, activities and much more.",
    installed: false,
  },
  {
    id: 6,
    name: "ProductCatalogue",
    description: "Digital Product catalogue Module",
    installed: false,
  },
  {
    id: 7,
    name: "Accounting Module",
    description: "Accounting & Book keeping module for UltimatePOS",
    installed: false,
  },
  {
    id: 8,
    name: "AiAssistance Module",
    description:
      "AI Assistant module for UltimatePOS. This module used openAI API to help with in copywriting & reporting",
    installed: false,
  },
  {
    id: 9,
    name: "AssetManagement Module",
    description: "Useful for managing all kinds of assets.",
    installed: false,
  },
  {
    id: 10,
    name: "Cms Module",
    description:
      "Mini CMS (content management system) Module for UltimatePOS to help manage all frontend contents like Landing page, Blogs, Contact us & many other pages.",
    installed: false,
  },
  {
    id: 11,
    name: "Connector/API Module",
    description: "Provide the API for POS.",
    installed: false,
  },
  {
    id: 12,
    name: "Spreadsheet Module",
    description:
      "Allows you to create spreadsheet and share with employees, roles & todos",
    installed: false,
  },
];

const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E6EDF5] bg-white px-4 py-2.5 text-sm font-semibold text-[#19366F] transition hover:border-[#FFB681] hover:bg-[#FFF7EF] disabled:cursor-not-allowed disabled:opacity-50";

export default function ManageModules({ onUpload, onRegenerate, onBuy, onUninstall, onDelete }) {
  const [modules, setModules] = useState(initialModules);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [notice, setNotice] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const fileInputRef = useRef(null);

  const filteredModules = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return modules;

    return modules.filter(
      (module) =>
        module.name.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query)
    );
  }, [modules, search]);

  const installedCount = modules.filter((module) => module.installed).length;

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 4000);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (onUpload) {
      try {
        setUploading(true);
        await onUpload(file);
        showNotice(`Module file "${file.name}" submitted successfully.`);
      } catch (error) {
        showNotice(error?.message || "Unable to upload the module.", "error");
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    } else {
      showNotice(
        `Selected "${file.name}". Connect your module upload API to install it.`,
        "info"
      );
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      if (onRegenerate) {
        await onRegenerate();
        showNotice("Module list regenerated successfully.");
      } else {
        showNotice(
          "Connect your regenerate API to refresh modules from the server.",
          "info"
        );
      }
    } catch (error) {
      showNotice(error?.message || "Unable to regenerate modules.", "error");
    } finally {
      setRegenerating(false);
    }
  };

  const handleBuy = async (module) => {
    try {
      if (onBuy) {
        await onBuy(module);
      } else {
        showNotice(
          `Connect your purchase flow to buy ${module.name}.`,
          "info"
        );
      }
    } catch (error) {
      showNotice(error?.message || "Unable to open the purchase flow.", "error");
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const { module, action } = confirmAction;

    try {
      if (action === "uninstall") {
        if (onUninstall) {
          await onUninstall(module);
        } else {
          setModules((current) =>
            current.map((item) =>
              item.id === module.id ? { ...item, installed: false } : item
            )
          );
        }
        showNotice(`${module.name} uninstall action completed.`);
      } else if (action === "delete") {
        if (onDelete) {
          await onDelete(module);
        } else {
          setModules((current) =>
            current.filter((item) => item.id !== module.id)
          );
        }
        showNotice(`${module.name} deleted from this list.`);
      }
    } catch (error) {
      showNotice(error?.message || `Unable to ${action} this module.`, "error");
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <main className="min-h-screen min-w-0 flex-1 bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[#FFE9D9] px-3 py-1.5 text-xs font-extrabold text-[#F04A13]">
              <Layers3 size={14} />
              BILLOMAX · ADMINISTRATION
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
              Manage Modules
            </h1>
            <p className="mt-1 text-sm text-[#577B9F]">
              Manage, install, and maintain your business modules.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#F2E8DE] bg-white px-4 py-3 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-[#10234F]">
                Superadmin access
              </p>
              <p className="mt-1 text-xs text-[#577B9F]">
                Only superadmin can access manage modules
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className={buttonPrimary}
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Module"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.module,.php"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            className={buttonPrimary}
          >
            <RefreshCw
              size={16}
              className={regenerating ? "animate-spin" : ""}
            />
            {regenerating ? "Regenerating..." : "Regenerate"}
            <Info size={15} className="text-cyan-200" />
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              notice.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : notice.type === "info"
                ? "border-blue-200 bg-blue-50 text-blue-800"
                : "border-green-200 bg-green-50 text-green-800"
            }`}
          >
            {notice.type === "error" ? (
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
            ) : (
              <Check size={18} className="mt-0.5 shrink-0" />
            )}
            <span className="flex-1">{notice.message}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 hover:bg-black/5"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#10234F]">
                  All Modules
                </h2>
                <p className="mt-1 text-sm text-[#577B9F]">
                  View installed modules and available add-ons.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl border border-[#F2E8DE] bg-white px-4 py-2.5">
                  <p className="text-xs text-[#577B9F]">Total modules</p>
                  <p className="mt-1 text-lg font-extrabold text-[#10234F]">
                    {modules.length}
                  </p>
                </div>
                <div className="rounded-xl border border-[#D5EBDD] bg-[#F0FBF4] px-4 py-2.5">
                  <p className="text-xs text-[#16824B]">Installed</p>
                  <p className="mt-1 text-lg font-extrabold text-[#16824B]">
                    {installedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-[#F2E8DE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h3 className="text-base font-extrabold text-[#10234F]">
                Module directory
              </h3>
              <p className="mt-1 text-xs text-[#8798AD]">
                {filteredModules.length} of {modules.length} modules shown
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8798AD]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search modules..."
                aria-label="Search modules"
                className={`${"w-full rounded-xl border border-[#E6EDF5] bg-white py-2.5 pl-10 pr-10 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"}`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8798AD] hover:text-[#10234F]"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-7">
            <div className="hidden overflow-hidden rounded-xl border border-[#E6EDF5] md:block">
              <table className="w-full table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#E8F4E3] text-[#19366F]">
                    <th className="w-[7%] px-4 py-4 font-extrabold">#</th>
                    <th className="w-[33%] px-4 py-4 font-extrabold">Modules</th>
                    <th className="px-4 py-4 font-extrabold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((module, index) => (
                    <tr
                      key={module.id}
                      className="border-t border-[#EDF0F4] align-top transition hover:bg-[#FFFCF8]"
                    >
                      <td className="px-4 py-5 text-[#577B9F]">
                        {module.installed ? module.id : (
                          <span className="inline-flex items-center justify-center text-[#10234F]">
                            <ThumbsUp size={22} fill="currentColor" />
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-5">
                        <div className="font-extrabold text-[#10234F]">
                          {module.name}
                        </div>

                        {module.version && (
                          <span className="mt-2 inline-flex rounded-md bg-[#EEF2F7] px-2 py-1 text-[11px] font-bold text-[#526D8D]">
                            Version {module.version}
                          </span>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          {module.installed ? (
                            <>
                              {module.canUninstall && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      module,
                                      action: "uninstall",
                                    })
                                  }
                                  className="rounded-lg bg-[#FFB347] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#F59E0B]"
                                >
                                  Uninstall
                                </button>
                              )}
                              {module.canDelete && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      module,
                                      action: "delete",
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                >
                                  <Trash2 size={13} />
                                  Delete
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleBuy(module)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#11CDBA] bg-white px-3 py-1.5 text-xs font-bold text-[#00A99A] transition hover:bg-[#E9FFFC]"
                            >
                              <ShoppingCart size={13} />
                              Buy
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5 leading-6 text-[#405775]">
                        {module.description}
                      </td>
                    </tr>
                  ))}
                  {filteredModules.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-12 text-center text-sm text-[#8798AD]"
                      >
                        <Package size={28} className="mx-auto mb-2 opacity-50" />
                        No modules match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {filteredModules.map((module) => (
                <article
                  key={module.id}
                  className="rounded-xl border border-[#E6EDF5] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        module.installed
                          ? "bg-[#E7F7EE] text-[#16824B]"
                          : "bg-[#FFF1E5] text-[#F04A13]"
                      }`}
                    >
                      {module.installed ? (
                        <ShieldCheck size={20} />
                      ) : (
                        <Package size={20} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-[#10234F]">
                        {module.name}
                      </h3>
                      {module.version && (
                        <span className="mt-1 inline-flex rounded-md bg-[#EEF2F7] px-2 py-1 text-[11px] font-bold text-[#526D8D]">
                          Version {module.version}
                        </span>
                      )}
                      <p className="mt-2 text-sm leading-6 text-[#577B9F]">
                        {module.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {module.installed ? (
                          <>
                            {module.canUninstall && (
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({
                                    module,
                                    action: "uninstall",
                                  })
                                }
                                className="rounded-lg bg-[#FFB347] px-3 py-2 text-xs font-bold text-white"
                              >
                                Uninstall
                              </button>
                            )}
                            {module.canDelete && (
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({
                                    module,
                                    action: "delete",
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-500"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleBuy(module)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#11CDBA] px-3 py-2 text-xs font-bold text-[#00A99A]"
                          >
                            <ShoppingCart size={13} /> Buy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {filteredModules.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#E6EDF5] px-4 py-10 text-center text-sm text-[#8798AD]">
                  No modules match your search.
                </div>
              )}
            </div>
          </div>
        </section>

        {confirmAction && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setConfirmAction(null);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="module-confirm-title"
              className="w-full max-w-md rounded-2xl border border-[#F2E8DE] bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                {confirmAction.action === "delete" ? (
                  <Trash2 size={22} />
                ) : (
                  <FileArchive size={22} />
                )}
              </div>
              <h2
                id="module-confirm-title"
                className="text-lg font-extrabold text-[#10234F]"
              >
                {confirmAction.action === "delete"
                  ? "Delete module?"
                  : "Uninstall module?"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#577B9F]">
                Are you sure you want to{" "}
                {confirmAction.action === "delete" ? "delete" : "uninstall"}{" "}
                <strong>{confirmAction.module.name}</strong>?
              </p>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className={buttonSecondary}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  <Check size={15} />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
