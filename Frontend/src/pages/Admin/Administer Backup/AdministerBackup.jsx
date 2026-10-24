
import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Download,
  Trash2,
  DatabaseBackup,
  FileArchive,
  CalendarDays,
  HardDrive,
  Clock3,
  ShieldCheck,
  X,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const initialBackups = [
  {
    id: 1,
    file: "2025-10-27-17-11-34.zip",
    size: "15.92MB",
    date: "2025-11-13 16:52:09",
    age: "11 months before",
  },
  {
    id: 2,
    file: "2024-10-08-17-27-06.zip",
    size: "685.35kB",
    date: "2025-11-13 16:52:09",
    age: "11 months before",
  },
  {
    id: 3,
    file: "2024-10-08-17-27-02.zip",
    size: "685.34kB",
    date: "2025-11-13 16:52:09",
    age: "11 months before",
  },
];

const cronCommand =
  "* * * * * php /var/www/vhosts/billomax.com/httpdocs/artisan schedule:run >> /dev/null 2>&1";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#00CDBA] bg-white px-4 py-2 text-sm font-semibold text-[#00A99A] transition hover:bg-[#E9FFFC] disabled:opacity-50";

export default function AdministerBackup({
  onCreateBackup,
  onDownloadBackup,
  onDeleteBackup,
}) {
  const [backups, setBackups] = useState(initialBackups);
  const [creating, setCreating] = useState(false);
  const [showAddBackup, setShowAddBackup] = useState(false);
  const [backupName, setBackupName] = useState("");
  const [backupDescription, setBackupDescription] = useState("");
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const objectUrlsRef = useRef(new Set());

  useEffect(
    () => () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );

  const filteredBackups = backups.filter((backup) =>
    backup.file.toLowerCase().includes(search.trim().toLowerCase())
  );

  const notify = (message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 4000);
  };

  const handleCreateBackup = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);

      if (onCreateBackup) {
        const result = await onCreateBackup({
          name: backupName.trim(),
          description: backupDescription.trim(),
        });

        if (result && result.file) {
          setBackups((current) => [
            {
              id: Date.now(),
              file: result.file,
              size: result.size || "—",
              date: result.date || new Date().toLocaleString(),
              age: result.age || "Just now",
              downloadUrl: result.downloadUrl,
            },
            ...current,
          ]);
        }

        notify("Backup request completed.");
      } else {
        const createdAt = new Date();
        const timestamp = createdAt.toISOString().replace(/[:.]/g, "-");
        const safeName = backupName
          .trim()
          .replace(/[^a-zA-Z0-9_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .toLowerCase();
        const file = `${safeName || "sample-backup"}-${timestamp}.json`;
        const sampleData = {
          createdAt: createdAt.toISOString(),
          type: "frontend-sample-data",
          note:
            "This file contains the sample backup records shown in the Administer Backup page. It is not a database backup.",
          name: backupName.trim(),
          description: backupDescription.trim(),
          backups: backups.map(({ id, file, size, date, age }) => ({
            id,
            file,
            size,
            date,
            age,
          })),
        };
        const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
          type: "application/json",
        });
        const downloadUrl = URL.createObjectURL(blob);
        objectUrlsRef.current.add(downloadUrl);

        setBackups((current) => [
          {
            id: Date.now(),
            file,
            size:
              blob.size >= 1024 * 1024
                ? `${(blob.size / (1024 * 1024)).toFixed(2)}MB`
                : `${(blob.size / 1024).toFixed(2)}kB`,
            date: createdAt.toLocaleString(),
            age: "Just now",
            downloadUrl,
          },
          ...current,
        ]);
        setSearch("");
        notify("Sample backup created. You can download it from the list.");
      }

      setShowAddBackup(false);
      setBackupName("");
      setBackupDescription("");
    } catch (error) {
      notify(error?.message || "Unable to create the backup.", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (backup) => {
    try {
      if (onDownloadBackup) {
        await onDownloadBackup(backup);
        return;
      }

      if (backup.downloadUrl) {
        const link = document.createElement("a");
        link.href = backup.downloadUrl;
        link.download = backup.file;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }

      notify(
        "Connect your download API or provide a downloadUrl for this backup.",
        "info"
      );
    } catch (error) {
      notify(error?.message || "Unable to download this backup.", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (onDeleteBackup) {
        await onDeleteBackup(deleteTarget);
      } else {
        setBackups((current) =>
          current.filter((backup) => backup.id !== deleteTarget.id)
        );
        if (deleteTarget.downloadUrl) {
          URL.revokeObjectURL(deleteTarget.downloadUrl);
          objectUrlsRef.current.delete(deleteTarget.downloadUrl);
        }
      }

      notify(`${deleteTarget.file} was removed from the list.`);
    } catch (error) {
      notify(error?.message || "Unable to delete this backup.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(cronCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify("Clipboard access is unavailable in this browser.", "error");
    }
  };

  const totalSize = backups.reduce((sum, backup) => {
    const match = backup.size.match(/^([\d.]+)\s*(MB|kB|KB|GB)$/i);
    if (!match) return sum;

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === "gb") return sum + amount * 1024;
    if (unit === "mb") return sum + amount;
    return sum + amount / 1024;
  }, 0);

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[#FFE9D9] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#F04A13]">
              <ShieldCheck size={14} />
              System administration
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
              Administer Backup
            </h1>
            <p className="mt-1 text-sm text-[#577B9F]">
              Create, download, and manage your database backup archives.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddBackup(true)}
            disabled={creating}
            className={primaryButton}
          >
            <Plus size={18} />
            Add Backup
          </button>
        </header>

        {/* Status notification */}
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
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
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

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<FileArchive size={20} />}
            label="Available backups"
            value={backups.length}
            detail="Backup archives in this list"
            iconClass="bg-[#FFF0E5] text-[#F04A13]"
          />
          <SummaryCard
            icon={<HardDrive size={20} />}
            label="Combined listed size"
            value={
              totalSize >= 1024
                ? `${(totalSize / 1024).toFixed(2)} GB`
                : `${totalSize.toFixed(2)} MB`
            }
            detail="Estimated from the displayed file sizes"
            iconClass="bg-[#EAF2FF] text-[#3977E8]"
          />
          <SummaryCard
            icon={<CalendarDays size={20} />}
            label="Backup management"
            value="Manual"
            detail="Create or manage an archive below"
            iconClass="bg-[#E8F8EF] text-[#16824B]"
          />
        </section>

        {/* Backup table */}
        <section className="overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="text-lg font-extrabold text-[#10234F]">
                Backup archives
              </h2>
              <p className="mt-1 text-sm text-[#577B9F]">
                Manage the backup files available on your server.
              </p>
            </div>

            <div className="w-full sm:max-w-xs">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search backup files..."
                aria-label="Search backup files"
                className="w-full rounded-xl border border-[#E6EDF5] bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-[#8798AD] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-7">
            <div className="overflow-x-auto rounded-xl border border-[#E6EDF5]">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#FFF7EF] text-[#19366F]">
                    <th className="px-4 py-4 font-extrabold">File</th>
                    <th className="px-4 py-4 font-extrabold">Size</th>
                    <th className="px-4 py-4 font-extrabold">Date</th>
                    <th className="px-4 py-4 font-extrabold">Age</th>
                    <th className="px-4 py-4 font-extrabold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBackups.map((backup) => (
                    <tr
                      key={backup.id}
                      className="border-t border-[#EDF0F4] transition odd:bg-white even:bg-[#FFFCF8] hover:bg-[#FFF4E9]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF0E5] text-[#F04A13]">
                            <FileArchive size={18} />
                          </span>
                          <span className="font-semibold text-[#19366F]">
                            {backup.file}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#405775]">
                        {backup.size}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#405775]">
                        {backup.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-3 py-1.5 text-xs font-medium text-[#526D8D]">
                          <Clock3 size={13} />
                          {backup.age}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownload(backup)}
                            className={secondaryButton}
                          >
                            <Download size={14} />
                            Download
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(backup)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredBackups.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-sm text-[#8798AD]"
                      >
                        <FileArchive
                          size={30}
                          className="mx-auto mb-2 opacity-50"
                        />
                        No backup files match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-[#577B9F]">
              Showing {filteredBackups.length ? 1 : 0} to{" "}
              {filteredBackups.length} of {filteredBackups.length} entries
            </p>
          </div>
        </section>

        {/* Cron instructions */}
        <section className="overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex items-start gap-3 border-b border-[#F2E8DE] px-5 py-5 sm:px-7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E5] text-[#F04A13]">
              <DatabaseBackup size={20} />
            </span>
            <div>
              <h2 className="font-extrabold text-[#10234F]">
                Automatic backup and cleanup
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#577B9F]">
                To enable automatic backup and backup cleanup, configure a cron
                job on your server using the command below.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-3 rounded-xl border border-[#F3D7D7] bg-[#FFF8F8] p-4 sm:flex-row sm:items-center sm:justify-between">
              <code className="break-all font-mono text-xs leading-6 text-[#C43D55] sm:text-sm">
                {cronCommand}
              </code>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E6EDF5] bg-white px-3 py-2 text-sm font-semibold text-[#19366F] transition hover:bg-[#FFF7EF]"
              >
                {copied ? (
                  <CheckCircle2 size={15} className="text-green-600" />
                ) : (
                  <FileArchive size={15} />
                )}
                {copied ? "Copied" : "Copy command"}
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#8798AD]">
              Add this command to the server's crontab only after confirming
              the PHP path and application directory are correct for your
              deployment.
            </p>
          </div>
        </section>

        {/* Add backup form */}
        {showAddBackup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10234F]/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !creating) {
                setShowAddBackup(false);
              }
            }}
          >
            <form
              onSubmit={handleCreateBackup}
              aria-labelledby="add-backup-title"
              className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] to-white px-5 py-5 sm:px-6">
                <div>
                  <span className="inline-flex rounded-lg bg-[#FFE9D9] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F04A13]">
                    Sample backup
                  </span>
                  <h2
                    id="add-backup-title"
                    className="mt-2 text-xl font-bold text-[#10234F]"
                  >
                    Add Backup
                  </h2>
                  <p className="mt-1 text-sm text-[#577B9F]">
                    Enter the backup details before creating the sample file.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBackup(false)}
                  disabled={creating}
                  aria-label="Close add backup form"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <label className="block">
                  <span className="text-sm font-semibold text-[#19366F]">
                    Backup name <span className="text-red-500">*</span>
                  </span>
                  <input
                    autoFocus
                    required
                    maxLength={80}
                    value={backupName}
                    onChange={(event) => setBackupName(event.target.value)}
                    placeholder="Enter backup name"
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#E6EDF5] bg-white px-3 text-sm text-[#19366F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-[#19366F]">
                    Description
                  </span>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={backupDescription}
                    onChange={(event) =>
                      setBackupDescription(event.target.value)
                    }
                    placeholder="Add a description (optional)"
                    className="mt-1.5 w-full rounded-xl border border-[#E6EDF5] bg-white px-3 py-2.5 text-sm text-[#19366F] outline-none transition placeholder:text-slate-400 focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs leading-5 text-blue-800">
                  This creates a downloadable sample-data file, not a full
                  database backup.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-[#F2E8DE] bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setShowAddBackup(false)}
                  disabled={creating}
                  className="rounded-xl border border-[#E6EDF5] px-5 py-2.5 text-sm font-bold text-[#19366F] transition hover:bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className={primaryButton}
                >
                  {creating ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <Plus size={17} />
                  )}
                  {creating ? "Creating backup..." : "Create Backup"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete confirmation */}
        {deleteTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setDeleteTarget(null);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-backup-title"
              className="w-full max-w-md rounded-2xl border border-[#F2E8DE] bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Trash2 size={22} />
              </div>
              <h2
                id="delete-backup-title"
                className="text-lg font-extrabold text-[#10234F]"
              >
                Delete backup?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#577B9F]">
                Are you sure you want to delete{" "}
                <strong className="break-all text-[#19366F]">
                  {deleteTarget.file}
                </strong>
                ?
              </p>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="inline-flex items-center justify-center rounded-xl border border-[#E6EDF5] bg-white px-4 py-2.5 text-sm font-semibold text-[#19366F] hover:bg-[#FFF7EF]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  <Trash2 size={15} />
                  Delete backup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({ icon, label, value, detail, iconClass }) {
  return (
    <div className="rounded-2xl border border-[#F2E8DE] bg-white p-5 shadow-[0_5px_20px_rgba(16,35,79,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#577B9F]">{label}</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#10234F]">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#8798AD]">{detail}</p>
    </div>
  );
}
