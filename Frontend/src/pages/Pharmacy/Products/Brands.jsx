import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  FileSpreadsheet,
  Info,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { getBusinessSampleBrands } from "../../../utils/businessStorage.js";

const initialBrands = [];
const columns = [
  { key: "name", label: "Brands" },
  { key: "note", label: "Note" },
];

function ExportButton({ icon: Icon, children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#D7E0EB] bg-white px-2.5 text-xs font-medium text-[#60738D] transition hover:border-[#F5A15D] hover:text-[#E87928]">
      <Icon size={14} />
      {children}
    </button>
  );
}

function BrandModal({ brand, onClose, onSave }) {
  const [name, setName] = useState(brand?.name ?? "");
  const [note, setNote] = useState(brand?.note ?? "");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName) {
      setError("Enter a brand name.");
      return;
    }
    onSave({
      id: brand?.id ?? Date.now(),
      name: normalizedName,
      note: note.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/45 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <form onSubmit={submit} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-[#F0E4D7] bg-white p-5 shadow-[0_18px_55px_rgba(25,43,80,0.2)] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium text-[#8798AD]">Product settings</p>
            <h2 className="text-lg font-semibold text-[#283961]">{brand ? "Edit brand" : "Add brand"}</h2>
            <p className="mt-1 text-sm text-[#71809A]">Give products a consistent brand name for cataloguing and search.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-[#8798AD] transition hover:bg-[#FFF0E3] hover:text-[#E87928]"><X size={18} /></button>
        </div>

        {error && <div role="alert" className="mb-4 rounded-lg border border-[#F2D2C9] bg-[#FFF7F4] px-3 py-2 text-sm text-[#A5412E]">{error}</div>}

        <label className="mb-4 block text-xs font-semibold text-[#344B70]">
          Brand name <span className="text-[#E87928]">*</span>
          <input autoFocus required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="For example: MediCare" className="mt-1.5 h-10 w-full rounded-lg border border-[#D6DFEA] px-3 text-sm font-normal text-[#33496F] outline-none placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10" />
        </label>
        <label className="block text-xs font-semibold text-[#344B70]">
          Note
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Optional note about this brand" className="mt-1.5 w-full resize-y rounded-lg border border-[#D6DFEA] px-3 py-2.5 text-sm font-normal leading-5 text-[#33496F] outline-none placeholder:text-[#9AA7B8] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10" />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-9 rounded-lg border border-[#D8E0EA] px-4 text-sm font-medium text-[#60738D] hover:bg-[#FFFCF8]">Cancel</button>
          <button type="submit" className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white transition hover:brightness-105">
            <Check size={15} /> {brand ? "Save changes" : "Add brand"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmation({ brand, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283961]/45 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="delete-brand-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-[#F0E4D7] bg-white p-5 shadow-[0_18px_55px_rgba(25,43,80,0.2)]">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1EF] text-[#C35445]"><Trash2 size={20} /></div>
        <h2 id="delete-brand-title" className="text-lg font-semibold text-[#283961]">Delete brand?</h2>
        <p className="mt-2 text-sm leading-6 text-[#71809A]">“{brand.name}” will be removed from this list.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-9 rounded-lg border border-[#D8E0EA] px-4 text-sm font-medium text-[#60738D] hover:bg-[#FFFCF8]">Cancel</button>
          <button type="button" onClick={onConfirm} className="h-9 rounded-lg bg-[#D75448] px-4 text-sm font-semibold text-white hover:bg-[#BE453B]">Delete</button>
        </div>
      </div>
    </div>
  );
}

function Brands() {
  const [brands, setBrands] = useState(() => getBusinessSampleBrands(initialBrands));
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "name", direction: "asc" });
  const [visibleColumns, setVisibleColumns] = useState(columns.map((column) => column.key));
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...brands]
      .filter((brand) => `${brand.name} ${brand.note}`.toLowerCase().includes(query))
      .sort((first, second) => {
        const comparison = String(first[sort.key] ?? "").localeCompare(String(second[sort.key] ?? ""), undefined, { numeric: true, sensitivity: "base" });
        return sort.direction === "asc" ? comparison : -comparison;
      });
  }, [brands, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredBrands.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageBrands = filteredBrands.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleTableColumns = columns.filter((column) => visibleColumns.includes(column.key));
  const firstEntry = filteredBrands.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastEntry = Math.min(currentPage * pageSize, filteredBrands.length);

  const saveBrand = (brand) => {
    const duplicate = brands.some((item) => item.id !== brand.id && item.name.toLowerCase() === brand.name.toLowerCase());
    if (duplicate) {
      setNotice(`A brand named "${brand.name}" already exists.`);
      setIsAdding(false);
      setEditingBrand(null);
      return;
    }
    setBrands((current) => current.some((item) => item.id === brand.id)
      ? current.map((item) => item.id === brand.id ? brand : item)
      : [...current, brand]);
    setIsAdding(false);
    setEditingBrand(null);
    setNotice("");
  };

  const toggleSort = (key) => setSort((current) => ({
    key,
    direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
  }));

  const exportCsv = () => {
    const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = `\uFEFF${[["Brands", "Note"], ...filteredBrands.map((brand) => [brand.name, brand.note])]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-brands.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="mb-1 text-xs font-medium text-[#8798AD]">Products <span className="px-1">/</span> Product settings</p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">Brands</h1>
            <p className="text-sm text-[#71809A]">Manage your brands</p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_8px_28px_rgba(40,57,97,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-7">
            <h2 className="text-lg font-semibold text-[#F5852A]">All your brands</h2>
            <button type="button" onClick={() => { setIsAdding(true); setNotice(""); }} className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF711A] to-[#F04A13] px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
              <Plus size={17} /> Add
            </button>
          </div>

          <div className="p-5 sm:p-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-[#60738D]">
                Show
                <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="h-9 rounded-lg border border-[#D8E0EA] bg-white px-2.5 text-sm text-[#536985] outline-none focus:border-[#F5A15D]">
                  {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
                entries
              </label>
              <label className="relative block w-full sm:w-52">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A6B8]" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search..." className="h-9 w-full rounded-lg border border-[#D8E0EA] bg-white pl-9 pr-3 text-sm text-[#33496F] outline-none placeholder:text-[#A2ADBA] focus:border-[#F5A15D] focus:ring-2 focus:ring-[#F5852A]/10" />
              </label>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <ExportButton icon={FileSpreadsheet} onClick={exportCsv}>Export CSV</ExportButton>
              <ExportButton icon={FileSpreadsheet} onClick={exportCsv}>Export Excel</ExportButton>
              <ExportButton icon={Printer} onClick={() => window.print()}>Print</ExportButton>
              <div className="relative">
                <button type="button" onClick={() => setColumnMenuOpen((open) => !open)} aria-expanded={columnMenuOpen} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#D7E0EB] bg-white px-2.5 text-xs font-medium text-[#60738D] transition hover:border-[#F5A15D] hover:text-[#E87928]">
                  <Columns3 size={14} /> Column visibility <ChevronDown size={13} />
                </button>
                {columnMenuOpen && (
                  <div className="absolute left-0 top-10 z-20 w-52 rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-xl">
                    {columns.map((column) => (
                      <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#536985] hover:bg-[#FFFCF8]">
                        <input type="checkbox" checked={visibleColumns.includes(column.key)} onChange={() => setVisibleColumns((current) => current.includes(column.key) ? current.filter((key) => key !== column.key) : [...current, column.key])} className="accent-[#F5852A]" />
                        {column.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <ExportButton icon={ArrowDownToLine} onClick={exportCsv}>Export PDF</ExportButton>
            </div>

            {notice && (
              <div role="status" className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-[#D9E6F5] bg-[#F3F7FC] px-3.5 py-2.5 text-sm text-[#536985]">
                <span className="flex items-center gap-2"><Info size={16} className="shrink-0 text-[#5584BC]" />{notice}</span>
                <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><X size={16} /></button>
              </div>
            )}

            <div className="app-themed-scrollbar overflow-x-auto rounded-xl border border-[#E8EDF2]">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead className="bg-[#FFFCF8] text-[#344B70]">
                  <tr>
                    {visibleTableColumns.map((column) => (
                      <th key={column.key} className="px-3 py-3.5 font-semibold">
                        <button type="button" onClick={() => toggleSort(column.key)} className="inline-flex items-center gap-2 text-left hover:text-[#E87928]">
                          {column.label}<ArrowUpDown size={14} className={sort.key === column.key ? "text-[#4B83BF]" : "text-[#B0BAC6]"} />
                        </button>
                      </th>
                    ))}
                    <th className="w-56 px-3 py-3.5 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageBrands.map((brand, index) => (
                    <tr key={brand.id} className={`border-t border-[#EDF0F3] transition hover:bg-[#FFFAF5] ${index % 2 ? "bg-[#FCFCFD]" : "bg-white"}`}>
                      {visibleTableColumns.map((column) => <td key={column.key} className="px-3 py-3.5 text-[#344B70]">{brand[column.key] || <span className="text-[#C3CBD5]">—</span>}</td>)}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => { setEditingBrand(brand); setNotice(""); }} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#9B8BFF] bg-white px-3 text-xs font-medium text-[#6959E8] transition hover:bg-[#F5F2FF]"><Pencil size={13} /> Edit</button>
                          <button type="button" onClick={() => setDeletingBrand(brand)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#F0A19C] bg-white px-3 text-xs font-medium text-[#C35445] transition hover:bg-[#FFF3F0]"><Trash2 size={13} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pageBrands.length === 0 && (
                    <tr>
                      <td colSpan={visibleTableColumns.length + 1} className="px-4 py-10 text-center">
                        <p className="text-sm font-semibold text-[#344B70]">{search ? "No brands found" : "No brands added yet"}</p>
                        <p className="mt-1 text-xs text-[#8798AD]">{search ? "Try a different search term." : "Add a brand to make it available when managing products."}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#60738D]">Showing <span className="font-medium text-[#344B70]">{firstEntry} to {lastEntry}</span> of <span className="font-medium text-[#344B70]">{filteredBrands.length}</span> entries</p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1} className="inline-flex h-9 items-center gap-1 rounded-l-lg border border-[#D8E0EA] px-3 text-sm text-[#60738D] hover:bg-[#FFFCF8] disabled:cursor-not-allowed disabled:opacity-50"><ChevronLeft size={15} /> Previous</button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={currentPage === pageNumber ? "page" : undefined} className={`h-9 min-w-9 border-y border-[#D8E0EA] px-2 text-sm ${currentPage === pageNumber ? "border-[#477FB8] bg-[#477FB8] font-semibold text-white" : "bg-white text-[#60738D] hover:bg-[#F1F6FC]"}`}>{pageNumber}</button>)}
                <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={currentPage === pageCount} className="inline-flex h-9 items-center gap-1 rounded-r-lg border border-[#D8E0EA] px-3 text-sm text-[#60738D] hover:bg-[#FFFCF8] disabled:cursor-not-allowed disabled:opacity-50">Next <ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {(isAdding || editingBrand) && <BrandModal brand={editingBrand} onClose={() => { setIsAdding(false); setEditingBrand(null); }} onSave={saveBrand} />}
      {deletingBrand && <DeleteConfirmation brand={deletingBrand} onClose={() => setDeletingBrand(null)} onConfirm={() => { setBrands((current) => current.filter((item) => item.id !== deletingBrand.id)); setDeletingBrand(null); }} />}
    </main>
  );
}

export default Brands;