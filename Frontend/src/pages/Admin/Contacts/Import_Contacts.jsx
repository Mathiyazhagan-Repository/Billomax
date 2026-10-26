import { useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  Check,
  ChevronDown,
  CircleHelp,
  CloudUpload,
  FileCheck2,
  FileSpreadsheet,
  Info,
  Upload,
  X,
} from "lucide-react";

const fields = [
  { name: "Contact type", required: true, help: "1 = Customer, 2 = Supplier, 3 = Both" },
  { name: "Prefix", help: "Optional title, such as Mr, Ms, or Dr." },
  { name: "First Name", required: true, help: "Required for every contact." },
  { name: "Middle name", help: "Optional." },
  { name: "Last name", help: "Optional." },
  { name: "Business Name", required: true, conditional: true, help: "Required when Contact type is 2 (Supplier) or 3 (Both)." },
  { name: "Contact ID", help: "Optional. Leave blank to auto-generate the Contact ID." },
  { name: "Tax number", help: "Optional." },
  { name: "Opening Balance", help: "Optional numeric amount." },
  { name: "Pay term", required: true, conditional: true, help: "Required when Contact type is 2 (Supplier) or 3 (Both)." },
  { name: "Pay term period", required: true, conditional: true, help: "Required for suppliers and both. Use days or months." },
  { name: "Credit Limit", help: "Optional numeric amount." },
  { name: "Email", help: "Optional." },
  { name: "Mobile", required: true, help: "Required mobile phone number." },
  { name: "Alternate contact number", help: "Optional." },
  { name: "Landline", help: "Optional." },
  { name: "City", help: "Optional." },
  { name: "State", help: "Optional." },
  { name: "Country", help: "Optional." },
  { name: "Address line 1", help: "Optional." },
  { name: "Address line 2", help: "Optional." },
  { name: "Zip Code", help: "Optional." },
  { name: "Date of birth", help: "Optional. Use YYYY-MM-DD, for example 2026-10-22." },
  { name: "Custom Field 1", help: "Optional. Use the custom field configured for your contacts." },
  { name: "Custom Field 2", help: "Optional. Use the custom field configured for your contacts." },
  { name: "Custom Field 3", help: "Optional. Use the custom field configured for your contacts." },
  { name: "Custom Field 4", help: "Optional. Use the custom field configured for your contacts." },
];

const csvEscape = (value) => `"${String(value).replaceAll('"', '""')}"`;

function downloadTemplate() {
  const headers = fields.map((field) => csvEscape(field.name)).join(",");
  const csv = `\uFEFF${headers}\r\n`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "contacts_import_template.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
      if (character === "\r" && text[index + 1] === "\n") index += 1;
    } else {
      value += character;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function ImportContacts() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const clearFile = () => {
    setFile(null);
    setStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setStatus({ type: "error", message: "Please choose a CSV file. Download the template below to get started." });
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setStatus({ type: "error", message: "The file is larger than 10 MB. Please choose a smaller CSV file." });
      return;
    }

    try {
      const text = await selectedFile.text();
      const rows = parseCsvRows(text);
      const header = rows[0]?.map((cell, index) =>
        index === 0 ? cell.replace(/^\uFEFF/, "").trim() : cell.trim()
      ) ?? [];
      const expected = fields.map((field) => field.name);
      const missing = expected.filter((name) => !header.includes(name));
      const extra = header.filter((name) => !expected.includes(name));
      const firstOrderMismatch = expected.findIndex((name, index) => header[index] !== name);
      setFile(selectedFile);

      if (missing.length || extra.length || header.length !== expected.length || firstOrderMismatch !== -1) {
        const details = [
          missing.length ? `Missing columns: ${missing.join(", ")}.` : "",
          extra.length ? `Unexpected columns: ${extra.join(", ")}.` : "",
          !missing.length && !extra.length && (header.length !== expected.length || firstOrderMismatch !== -1)
            ? "The columns are not in the template order."
            : "",
        ].filter(Boolean).join(" ");
        setStatus({ type: "error", message: `The column headers don't match the template. ${details}` });
        return;
      }

      setStatus({
        type: "success",
        message: `Template columns verified. ${Math.max(rows.length - 1, 0)} contact row${rows.length === 2 ? "" : "s"} found. This page currently provides a local preview; importing records requires backend support.`,
      });
    } catch {
      setFile(null);
      setStatus({ type: "error", message: "The selected file could not be read. Please check the file and try again." });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium text-[#8798AD]">Contacts <span className="px-1">/</span> Import</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">Import Contacts</h1>
            <p className="mt-1 text-sm text-[#71809A]">Prepare your contact spreadsheet and check it against the required format.</p>
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#FF8C30] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#F27D20] focus:outline-none focus:ring-2 focus:ring-[#FFB36F] focus:ring-offset-2"
          >
            <ArrowDownToLine size={17} />
            Download CSV template
          </button>
        </div>

        <section className="mb-5 overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_3px_12px_rgba(40,57,97,0.04)]">
          <div className="flex items-start gap-3 border-b border-[#F2EAE2] px-5 py-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E4] text-[#F5852A]">
              <Upload size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#283961]">Upload your contact file</h2>
              <p className="mt-0.5 text-sm text-[#71809A]">Use a CSV file with the same 27 columns as the template.</p>
            </div>
          </div>

          <div className="p-5">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E6D5C4] bg-[#FFFCF8] px-4 py-6 text-center transition hover:border-[#F5A15D] hover:bg-[#FFFAF5] focus:outline-none focus:ring-2 focus:ring-[#FFB36F]"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#F5852A] shadow-sm">
                <CloudUpload size={24} />
              </span>
              <p className="text-sm font-semibold text-[#283961]">Drop your CSV file here, or <span className="text-[#F5852A]">browse</span></p>
              <p className="mt-1 text-xs text-[#8798AD]">CSV files only · Maximum file size 10 MB</p>
            </div>

            {file && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E7EDF5] bg-[#FAFCFF] px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileSpreadsheet size={19} className="shrink-0 text-[#5584BC]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#283961]">{file.name}</p>
                    <p className="text-xs text-[#8798AD]">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button type="button" onClick={clearFile} className="rounded-md p-1.5 text-[#8798AD] transition hover:bg-[#FFF0E3] hover:text-[#E16B32]" aria-label="Remove selected file">
                  <X size={17} />
                </button>
              </div>
            )}

            {status && (
              <div className={`mt-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                status.type === "success"
                  ? "border-[#CDE9D5] bg-[#F3FBF5] text-[#287444]"
                  : "border-[#F2D2C9] bg-[#FFF7F4] text-[#A5412E]"
              }`}>
                {status.type === "success" ? <Check size={17} className="mt-0.5 shrink-0" /> : <AlertCircle size={17} className="mt-0.5 shrink-0" />}
                <p>{status.message}</p>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#F3F7FC] px-3 py-2.5 text-xs leading-5 text-[#536985]">
              <Info size={16} className="mt-0.5 shrink-0 text-[#5584BC]" />
              <p>We’ll check the column headers in your file. Contact records are not saved by this screen yet; connect the import API to complete an actual import.</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_3px_12px_rgba(40,57,97,0.04)]">
          <button
            type="button"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-expanded={isExpanded}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF4FB] text-[#5584BC]">
                <FileCheck2 size={18} />
              </span>
              <span>
                <span className="block text-base font-semibold text-[#283961]">Template fields</span>
                <span className="mt-0.5 block text-sm text-[#71809A]">27 columns · Required fields are marked</span>
              </span>
            </span>
            <ChevronDown size={19} className={`shrink-0 text-[#71809A] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>

          {isExpanded && (
            <>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[#F2EAE2] bg-[#FFFCF8] px-5 py-3 text-xs text-[#71809A]">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#F5852A]" /> Required</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#5584BC]" /> Required for suppliers / both</span>
                <span className="inline-flex items-center gap-1.5"><CircleHelp size={14} className="text-[#8798AD]" /> Optional</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-white text-xs uppercase tracking-wide text-[#8798AD]">
                      <th className="w-16 px-5 py-3 font-semibold">No.</th>
                      <th className="w-[28%] px-4 py-3 font-semibold">Column name</th>
                      <th className="w-36 px-4 py-3 font-semibold">Requirement</th>
                      <th className="px-4 py-3 font-semibold">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.name} className="border-t border-[#F2EAE2] even:bg-[#FFFCF8]">
                        <td className="px-5 py-3 text-[#8798AD]">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-[#33496F]">{field.name}</td>
                        <td className="px-4 py-3">
                          {field.conditional ? (
                            <span className="whitespace-nowrap rounded-full bg-[#EEF4FB] px-2.5 py-1 text-[11px] font-medium text-[#4773A4]">Conditional</span>
                          ) : field.required ? (
                            <span className="whitespace-nowrap rounded-full bg-[#FFF0E3] px-2.5 py-1 text-[11px] font-medium text-[#D86D22]">Required</span>
                          ) : (
                            <span className="text-xs text-[#8798AD]">Optional</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[13px] leading-5 text-[#71809A]">{field.help}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-start gap-2 border-t border-[#F2EAE2] px-5 py-3 text-xs leading-5 text-[#71809A]">
                <Info size={15} className="mt-0.5 shrink-0 text-[#5584BC]" />
                <p>Keep the header row unchanged. For supplier or both contacts, fill in Business Name, Pay term, and Pay term period. Date of birth must use YYYY-MM-DD.</p>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default ImportContacts;