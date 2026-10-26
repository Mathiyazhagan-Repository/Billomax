
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Download,
  FileText,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Menu,
} from "lucide-react";

const initialPages = [
  { id: 1, title: "Features", slug: "features", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Homepage Features Section", homepageSection: true },
  { id: 2, title: "Modules", slug: "modules", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Homepage Modules Section", homepageSection: true },
  { id: 3, title: "Solutions", slug: "solutions", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Homepage Solutions Section", homepageSection: true },
  { id: 4, title: "Pricing", slug: "pricing", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Homepage Pricing Section", homepageSection: true },
  { id: 5, title: "Contact", slug: "contact-section", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Homepage Contact Section", homepageSection: true },
  { id: 6, title: "About Us", slug: "about-us", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "About BilloMax", navbar: true },
  { id: 7, title: "Careers", slug: "careers", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Careers at BilloMax" },
  { id: 8, title: "Privacy Policy", slug: "privacy-policy", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Privacy Policy - BilloMax" },
  { id: 9, title: "Terms & Conditions", slug: "terms-and-conditions", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Terms & Conditions - BilloMax" },
  { id: 10, title: "Refund Policy", slug: "refund-policy", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Refund Policy - BilloMax" },
  { id: 11, title: "Contact Us", slug: "contact-us", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Contact BilloMax" },
  { id: 12, title: "Smart Billing & Inventory for Modern Business", slug: "home-page", status: "Published", published: "24 Jul 2026 12:25 PM", seoTitle: "Homepage Hero Content", homepageSection: true },
];

const fieldClass =
  "w-full rounded-xl border border-[#F2E8DE] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

function ActionButton({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13] hover:shadow-md",
    blue: "bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13]",
    cyan: "border border-[#FFD1B0] bg-[#FFE9D9] text-[#B85D0A] hover:bg-[#FFF1E5]",
    danger: "bg-[#C34B34] text-white hover:bg-[#A83E2B]",
    secondary: "border border-[#F2E8DE] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5]",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Badge({ children, color = "green" }) {
  const styles = {
    green: "bg-[#EAF7ED] text-[#218838] ring-1 ring-[#CBE9D1]",
    orange: "bg-[#FFE9D9] text-[#B85D0A] ring-1 ring-[#FFD1B0]",
    blue: "bg-[#EDF4FF] text-[#4276B5] ring-1 ring-[#C9DCF5]",
    gray: "bg-[#F4F6F8] text-[#577B9F] ring-1 ring-[#E8EDF4]",
  };

  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[color]}`}>
      {children}
    </span>
  );
}

function PageModal({ page, onClose, onSave, readOnly = false }) {
  const [form, setForm] = useState(
    page || {
      title: "",
      slug: "",
      status: "Published",
      published: "—",
      seoTitle: "",
      homepageSection: false,
      navbar: false,
    }
  );

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const makeSlug = (value) =>
    value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#F8EBDD] bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#10234F]">
              {readOnly ? "Page Details" : page ? "Edit Website Page" : "Add Website Page"}
            </h2>
            <p className="app-description mt-1 text-[#577B9F]">
              Manage page content identifiers and SEO metadata.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-[#577B9F] hover:bg-[#FFF1E5]" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (readOnly) return;
            onSave({
              ...form,
              id: form.id || Date.now(),
              published:
                form.published === "—" && form.status === "Published"
                  ? new Date().toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : form.published,
            });
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">Page Title *</span>
            <input
              required
              readOnly={readOnly}
              value={form.title}
              onChange={(event) => {
                update("title", event.target.value);
                if (!page) update("slug", makeSlug(event.target.value));
              }}
              className={fieldClass}
              placeholder="Enter page title"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">Slug *</span>
            <input
              required
              readOnly={readOnly}
              value={form.slug}
              onChange={(event) => update("slug", event.target.value)}
              className={fieldClass}
              placeholder="page-url-slug"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">SEO Title</span>
            <input
              readOnly={readOnly}
              value={form.seoTitle}
              onChange={(event) => update("seoTitle", event.target.value)}
              className={fieldClass}
              placeholder="Enter SEO title"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">Status</span>
            <select
              disabled={readOnly}
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
              className={fieldClass}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`flex items-center gap-2 rounded-xl border border-[#F2E8DE] p-3 text-xs font-semibold ${readOnly ? "opacity-80" : ""}`}>
              <input
                type="checkbox"
                disabled={readOnly}
                checked={Boolean(form.homepageSection)}
                onChange={(event) => update("homepageSection", event.target.checked)}
                className="accent-orange-500"
              />
              Homepage Section
            </label>

            <label className={`flex items-center gap-2 rounded-xl border border-[#F2E8DE] p-3 text-xs font-semibold ${readOnly ? "opacity-80" : ""}`}>
              <input
                type="checkbox"
                disabled={readOnly}
                checked={Boolean(form.navbar)}
                onChange={(event) => update("navbar", event.target.checked)}
                className="accent-orange-500"
              />
              Navbar Page
            </label>
          </div>

          {readOnly && (
            <div className="rounded-xl bg-[#FFF7EF] p-3 text-xs text-[#577B9F]">
              <span className="font-bold">Published:</span> {form.published}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-[#F2E8DE] pt-4">
            <ActionButton type="button" variant="secondary" onClick={onClose}>
              {readOnly ? "Close" : "Cancel"}
            </ActionButton>
            {!readOnly && (
              <ActionButton type="submit">
                <CheckCircle2 size={15} /> Save Page
              </ActionButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Pages({ onAddPage, onEditPage, editedPage }) {
  const [pages, setPages] = useState(() => {
    if (editedPage?.source !== "pages") return initialPages;

    return initialPages.map((page) =>
      page.id === editedPage.id
        ? {
            ...page,
            title: editedPage.data.title,
            slug: editedPage.data.slug,
            seoTitle: editedPage.data.metaTitle || "",
            status: editedPage.data.publishImmediately ? "Published" : "Draft",
            navbar: editedPage.data.showInNavigation,
          }
        : page
    );
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPage, setModalPage] = useState(null);
  const [modalMode, setModalMode] = useState("edit");
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState("");

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const filteredPages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pages.filter((item) => {
      const matchesSearch = [
        item.title,
        item.slug,
        item.status,
        item.published,
        item.seoTitle,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesStatus = statusFilter === "All" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        (categoryFilter === "Homepage Section" && item.homepageSection) ||
        (categoryFilter === "Navbar" && item.navbar);

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [pages, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPages.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const visiblePages = filteredPages.slice(start, start + pageSize);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setModalPage(item);
    setShowModal(true);
  };

  const savePage = (item) => {
    setPages((current) => {
      const exists = current.some((page) => page.id === item.id);
      return exists
        ? current.map((page) => (page.id === item.id ? item : page))
        : [item, ...current];
    });
    setShowModal(false);
    setCurrentPage(1);
    notify("Page updated in the current page state.");
  };

  const deletePage = (item) => {
    if (!window.confirm(`Delete "${item.title}" from this list?`)) return;
    setPages((current) => current.filter((page) => page.id !== item.id));
    notify("Page removed from the current page state.");
  };

  const exportCsv = () => {
    const headers = ["Title", "Slug", "Status", "Published", "SEO Title", "Homepage Section", "Navbar"];
    const keys = ["title", "slug", "status", "published", "seoTitle", "homepageSection", "navbar"];
    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCsv).join(","),
      ...filteredPages.map((item) =>
        keys.map((key) => escapeCsv(
          key === "homepageSection" || key === "navbar"
            ? item[key] ? "Yes" : "No"
            : item[key]
        )).join(",")
      ),
    ].join("\r\n");

    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "billomax-website-pages.csv";
    link.click();
    URL.revokeObjectURL(url);
    notify("CSV export downloaded.");
  };

  const publishedCount = pages.filter((item) => item.status === "Published").length;
  const homepageCount = pages.filter((item) => item.homepageSection).length;
  const navbarCount = pages.filter((item) => item.navbar).length;

  return (
    <main className="min-h-0 flex-1 bg-[#FFFAF5] px-3 py-4 font-sans text-[#10234F] sm:px-5 sm:py-6 lg:px-7">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="app-page-title text-[#10234F]">
              Website Pages
            </p>
            <p className="app-description mt-1.5">
              Manage website pages, homepage sections, navigation and SEO titles.
            </p>
          </div>
          <ActionButton onClick={onAddPage || (() => openModal("add"))}>
            <Plus size={16} /> Add Page
          </ActionButton>
        </header>

        {notice && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#FFD1B0] bg-[#FFF1E5] px-4 py-3 text-xs font-semibold text-[#B85D0A]">
            <CheckCircle2 size={16} />
            {notice}
            <button onClick={() => setNotice("")} className="ml-auto" aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        )}

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Pages", value: pages.length, icon: FileText, tint: "bg-[#FFE9D9] text-[#F04A13]" },
            { label: "Published Pages", value: publishedCount, icon: CheckCircle2, tint: "bg-[#EAF7ED] text-[#218838]" },
            { label: "Homepage Sections", value: homepageCount, icon: LayoutGrid, tint: "bg-[#EDF4FF] text-[#4276B5]" },
            { label: "Navbar Pages", value: navbarCount, icon: Menu, tint: "bg-[#FFF1E5] text-[#B85D0A]" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#577B9F]">
                  {stat.label}
                </p>
                <span className={`rounded-xl p-2.5 ${stat.tint}`}>
                  <stat.icon size={18} />
                </span>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-[#10234F]">{stat.value}</p>
              <p className="app-description mt-1 text-[#577B9F]">Website content records</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#F2E8DE] p-4 sm:p-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="app-section-title text-[#10234F]">Manage Pages</h2>
              <p className="app-description mt-1 text-[#577B9F]">
                All 12 website page records from your reference screenshot.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <label className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]" />
                <input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }}
                  placeholder="Search pages or SEO..."
                  className={`${fieldClass} py-2.5 pl-9 text-xs sm:w-56`}
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}
                className={`${fieldClass} py-2.5 text-xs sm:w-36`}
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(event) => { setCategoryFilter(event.target.value); setCurrentPage(1); }}
                className={`${fieldClass} py-2.5 text-xs sm:w-44`}
              >
                <option value="All">All Categories</option>
                <option value="Homepage Section">Homepage Section</option>
                <option value="Navbar">Navbar</option>
              </select>

              <ActionButton variant="secondary" onClick={exportCsv}>
                <Download size={14} /> Export CSV
              </ActionButton>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <label className="flex items-center gap-2 text-xs text-[#577B9F]">
              Show
              <select
                value={pageSize}
                onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}
                className="rounded-lg border border-[#F2E8DE] bg-white px-2 py-1.5 text-xs outline-none focus:border-[#FF8A37]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              entries
            </label>
            <p className="text-xs text-[#577B9F]">
              {filteredPages.length} matching record{filteredPages.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                  {["Title", "Slug", "Status", "Published", "SEO Title", "Action"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#19366F]">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visiblePages.map((item, index) => (
                  <tr key={item.id} className={`border-b border-[#F2E8DE] align-top transition hover:bg-[#FFF7EF] ${index % 2 ? "bg-[#FFFCF8]" : "bg-white"}`}>
                    <td className="w-[26%] px-4 py-4">
                      <p className="text-xs font-bold leading-5 text-[#10234F]">{item.title}</p>
                    </td>
                    <td className="w-[16%] px-4 py-4">
                      <code className="break-all rounded-md bg-[#FFF1E5] px-2 py-1 text-[10px] leading-5 text-[#B85D0A]">{item.slug}</code>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge>{item.status}</Badge>
                        {item.homepageSection && <Badge color="orange">Homepage Section</Badge>}
                        {item.navbar && <Badge color="blue">Navbar</Badge>}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs leading-5 text-[#577B9F]">{item.published}</td>
                    <td className="w-[20%] px-4 py-4 text-xs leading-5 text-[#577B9F]">{item.seoTitle || "—"}</td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-[150px] flex-wrap gap-1.5">
                        <ActionButton variant="cyan" className="px-2.5 py-1.5" onClick={() => openModal("view", item)}>
                          <Eye size={12} /> View
                        </ActionButton>
                        <ActionButton
                          variant="blue"
                          className="px-2.5 py-1.5"
                          onClick={() =>
                            onEditPage
                              ? onEditPage(item)
                              : openModal("edit", item)
                          }
                        >
                          <Pencil size={12} /> Edit
                        </ActionButton>
                        <ActionButton variant="danger" className="px-2.5 py-1.5" onClick={() => deletePage(item)}>
                          <Trash2 size={12} /> Delete
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}

                {visiblePages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#B85D0A]">
                        <Search size={21} />
                      </span>
                      <p className="mt-3 text-sm font-bold text-[#19366F]">No pages found</p>
                      <p className="app-description mt-1 text-[#577B9F]">Change your search or filters and try again.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#F2E8DE] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-[#577B9F]">
              Showing <span className="font-bold text-[#19366F]">{filteredPages.length ? start + 1 : 0}</span> to{" "}
              <span className="font-bold text-[#19366F]">{Math.min(start + pageSize, filteredPages.length)}</span> of{" "}
              <span className="font-bold text-[#19366F]">{filteredPages.length}</span> entries
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <ActionButton variant="secondary" disabled={safePage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft size={14} /> Previous
              </ActionButton>
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter((number) => number === 1 || number === totalPages || Math.abs(number - safePage) <= 1)
                .map((number, index, numbers) => (
                  <React.Fragment key={number}>
                    {index > 0 && number - numbers[index - 1] > 1 && <span className="px-1 text-xs text-[#577B9F]">…</span>}
                    <button
                      onClick={() => setCurrentPage(number)}
                      className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${safePage === number ? "bg-[#FF711A] text-white shadow-sm" : "border border-[#F2E8DE] bg-white text-[#19366F] hover:bg-[#FFF1E5]"}`}
                    >
                      {number}
                    </button>
                  </React.Fragment>
                ))}
              <ActionButton variant="secondary" disabled={safePage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                Next <ChevronRight size={14} />
              </ActionButton>
            </div>
          </div>
        </section>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#F2E8DE] py-4 text-center text-[11px] text-[#577B9F] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span>Website Admin · Page Management</span>
        </footer>
      </div>

      {showModal && (
        <PageModal
          page={modalPage}
          readOnly={modalMode === "view"}
          onClose={() => setShowModal(false)}
          onSave={savePage}
        />
      )}
    </main>
  );
}
