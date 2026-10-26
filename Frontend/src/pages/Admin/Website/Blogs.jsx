
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  Eye,
  Pencil,
  Trash2,
  FileText,
  CalendarDays,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Newspaper,
  Filter,
} from "lucide-react";

const initialBlogs = [
  {
    id: 1,
    title: "POS Billing Software for Indian Shops: 2026 Buyer's Guide",
    slug: "pos-billing-software",
    status: "Published",
    published: "23 Oct 2026 06:58 PM",
    seoTitle: "POS Billing Software for Indian Shops: 2026 Buyer's Guide",
  },
  {
    id: 2,
    title: "GST Billing Software: 7 Checks Before You Buy (2026)",
    slug: "gst-billing-software-20261023182441-s019",
    status: "Published",
    published: "23 Oct 2026 06:24 PM",
    seoTitle: "GST Billing Software: 7 Checks Before You Buy (2026)",
  },
  {
    id: 3,
    title: "Restaurant Billing Software: Buyer's Guide | Billomax",
    slug: "restaurant-billing-software-buyers-guide",
    status: "Published",
    published: "15 Oct 2026 01:13 PM",
    seoTitle: "Restaurant Billing Software: Buyer's Guide | Billomax",
  },
  {
    id: 4,
    title:
      "Medical Invoicing Software: Simplify Healthcare Billing & Get Paid Faster",
    slug: "medical-invoicing-software",
    status: "Published",
    published: "04 Aug 2026 06:17 PM",
    seoTitle:
      "Medical Invoicing Software | Simplify Healthcare Billing | Billomax",
  },
  {
    id: 5,
    title: "Barcode Billing Software for Faster & Smarter Business Billing",
    slug: "barcode-billing-software",
    status: "Published",
    published: "03 Aug 2026 05:58 PM",
    seoTitle:
      "Barcode Billing Software | Fast & Accurate Billing Solution | Billomax",
  },
  {
    id: 6,
    title: "Supermarket Billing Software That Clears The Queue",
    slug: "supermarket-billing-software",
    status: "Published",
    published: "31 Jul 2026 04:43 PM",
    seoTitle: "Supermarket Billing Software: 10-Day Switch, 70% Faster",
  },
  {
    id: 7,
    title: "Restaurant Billing Software: 7 Features That Matter",
    slug: "restaurant-billing-software-india",
    status: "Published",
    published: "30 Jul 2026 05:17 PM",
    seoTitle: "Restaurant Billing Software: 7 Features That Matter",
  },
  {
    id: 8,
    title: "Billing Software for Medical Store Owners: 2026 Guide",
    slug: "billing-software-for-medical-store",
    status: "Published",
    published: "29 Jul 2026 04:00 PM",
    seoTitle: "Billing Software for Medical Store: 2026 Buyer Guide",
  },
  {
    id: 9,
    title: "Best Billing Software for Every Business",
    slug: "best-billing-software-for-every-business",
    status: "Published",
    published: "29 Jul 2026 08:53 AM",
    seoTitle:
      "Best Billing Software for Every Business | Billomax GST Billing Software",
  },
  {
    id: 10,
    title: "Billing Software | Complete GST & Cloud Accounting Guide",
    slug: "billing-software-complete-gst-cloud-accounting-guide",
    status: "Published",
    published: "28 Jul 2026 06:28 PM",
    seoTitle: "-",
  },
  {
    id: 11,
    title:
      "Billomax Billing Software: One Smart Solution for Every Business Need in 2026",
    slug: "billomax-billing-software-for-every-business",
    status: "Published",
    published: "28 Jul 2026 06:12 AM",
    seoTitle:
      "Billomax Billing Software | One Smart Solution for Every Business Need",
  },
  {
    id: 12,
    title:
      "Billomax Pharmacy Billing Software: Complete Guide for Medicine Stores 2026",
    slug: "billomax-pharmacy-billing-software-guide",
    status: "Published",
    published: "28 Jul 2026 03:29 PM",
    seoTitle:
      "Billomax Pharmacy Billing Software: Complete Guide 2026",
  },
  {
    id: 13,
    title: "Billing Software | Complete GST & Cloud Accounting Guide",
    slug: "billing-software-gst-accounting",
    status: "Published",
    published: "27 Jul 2026 06:14 PM",
    seoTitle: "Billing Software | Complete GST & Cloud Accounting Guide",
  },
  {
    id: 14,
    title: "Billing Software: A Guide to Streamlining Business Operations in 2026",
    slug: "billing-software-a-guide-to-streamlining-business-operations-in-2026",
    status: "Published",
    published: "27 Jul 2026 03:19 PM",
    seoTitle:
      "Billing Software: A Guide to Streamlining Business Operations",
  },
];

const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40";

function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary:
      "bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13] hover:shadow-md",
    blue: "bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13]",
    cyan: "border border-[#FFD1B0] bg-[#FFE9D9] text-[#B85D0A] hover:bg-[#FFF1E5]",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    secondary:
      "border border-[#F2E8DE] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5]",
    ghost: "text-[#577B9F] hover:bg-[#FFF1E5]",
  };

  return (
    <button
      {...props}
      className={`${buttonBase} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const published = status === "Published";

  return (
    <span
      className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        published
          ? "bg-[#EAF7ED] text-[#218838] ring-1 ring-[#CBE9D1]"
          : "bg-[#FFF1E5] text-[#B85D0A] ring-1 ring-[#FFD1B0]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published ? "bg-[#218838]" : "bg-[#FF8A37]"
        }`}
      />
      {status}
    </span>
  );
}

function BlogModal({ blog, onClose, onSave }) {
  const [form, setForm] = useState(
    blog || {
      title: "",
      slug: "",
      status: "Draft",
      published: "—",
      seoTitle: "",
    }
  );

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const createSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#F8EBDD] bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#10234F]">
              {blog ? "Edit Blog Post" : "Add Blog Post"}
            </h2>
            <p className="app-description mt-1 text-[#577B9F]">
              Manage the blog title, URL slug, publishing status and SEO title.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#577B9F] hover:bg-[#FFF1E5]"
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave({
              ...form,
              id: form.id || Date.now(),
              slug: form.slug || createSlug(form.title),
              published:
                form.status === "Published" && form.published === "—"
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
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              Blog Title *
            </span>
            <input
              required
              value={form.title}
              onChange={(event) => {
                update("title", event.target.value);
                if (!blog) update("slug", createSlug(event.target.value));
              }}
              className="w-full rounded-xl border border-[#F2E8DE] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              placeholder="Enter blog title"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              URL Slug *
            </span>
            <input
              required
              value={form.slug}
              onChange={(event) => update("slug", event.target.value)}
              className="w-full rounded-xl border border-[#F2E8DE] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              placeholder="blog-url-slug"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              SEO Title
            </span>
            <input
              value={form.seoTitle}
              onChange={(event) => update("seoTitle", event.target.value)}
              className="w-full rounded-xl border border-[#F2E8DE] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              placeholder="Enter SEO title"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              Status
            </span>
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
              className="w-full rounded-xl border border-[#F2E8DE] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37]"
            >
              <option>Draft</option>
              <option>Published</option>
            </select>
          </label>

          <div className="flex flex-wrap justify-end gap-2 border-t border-[#F2E8DE] pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <CheckCircle2 size={15} />
              Save Blog
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BlogPreview({ blog, onClose }) {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-[#F8EBDD] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#F47721]">
              <Newspaper size={20} />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[#10234F]">
                Blog Details
              </h2>
              <p className="app-description text-[#577B9F]">Record preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#577B9F] hover:bg-[#FFF1E5]"
            aria-label="Close preview"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#577B9F]">
              Title
            </p>
            <p className="mt-1 text-sm font-bold text-[#10234F]">
              {blog.title}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#577B9F]">
              Slug
            </p>
            <p className="mt-1 break-all font-mono text-xs text-[#577B9F]">
              {blog.slug}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#577B9F]">
              SEO Title
            </p>
            <p className="mt-1 text-sm text-[#577B9F]">{blog.seoTitle}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#FFF7EF] p-3">
              <p className="text-[10px] text-[#577B9F]">Status</p>
              <div className="mt-2">
                <StatusBadge status={blog.status} />
              </div>
            </div>
            <div className="rounded-xl bg-[#FFF7EF] p-3">
              <p className="text-[10px] text-[#577B9F]">Published</p>
              <p className="mt-2 text-xs font-semibold text-[#19366F]">
                {blog.published}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  );
}

export default function Blogs({
  onAddBlog,
  onImportBlog,
  onEditBlog,
  editedBlog,
}) {
  const [blogs, setBlogs] = useState(() => {
    if (editedBlog?.source !== "blogs") return initialBlogs;

    return initialBlogs.map((blog) =>
      blog.id === editedBlog.id
        ? {
            ...blog,
            ...editedBlog.data,
            seoTitle:
              editedBlog.data.metaTitle || editedBlog.data.seoTitle || "",
            status: editedBlog.data.publishImmediately
              ? "Published"
              : "Draft",
            published:
              editedBlog.data.publishedAt || blog.published,
          }
        : blog
    );
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingBlog, setEditingBlog] = useState(null);
  const [addingBlog, setAddingBlog] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [notice, setNotice] = useState("");
  const filteredBlogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return blogs.filter((blog) => {
      const matchesSearch = [
        blog.title,
        blog.slug,
        blog.status,
        blog.published,
        blog.seoTitle,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || blog.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + pageSize
  );

  const publishedCount = blogs.filter(
    (blog) => blog.status === "Published"
  ).length;
  const draftCount = blogs.filter((blog) => blog.status === "Draft").length;

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4000);
  };

  const saveBlog = (blog) => {
    setBlogs((current) => {
      const exists = current.some((item) => item.id === blog.id);
      return exists
        ? current.map((item) => (item.id === blog.id ? blog : item))
        : [blog, ...current];
    });

    setEditingBlog(null);
    setAddingBlog(false);
    setPage(1);
    notify("Blog record updated in the current page state.");
  };

  const deleteBlog = (blog) => {
    if (!window.confirm(`Delete "${blog.title}" from this page?`)) return;

    setBlogs((current) => current.filter((item) => item.id !== blog.id));
    notify("Blog removed from the current page state.");
  };

  const exportCsv = () => {
    const columns = [
      ["Title", "title"],
      ["Slug", "slug"],
      ["Status", "status"],
      ["Published", "published"],
      ["SEO Title", "seoTitle"],
    ];

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      columns.map(([label]) => escapeCsv(label)).join(","),
      ...filteredBlogs.map((blog) =>
        columns.map(([, key]) => escapeCsv(blog[key])).join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "billomax-blog-posts.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("CSV export downloaded.");
  };

  const openBlogUrl = (blog) => {
    window.open(
      `https://billomax.com/blogs/${encodeURIComponent(blog.slug)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-0 flex-1 bg-[#FFFAF5] px-3 py-4 font-sans text-[#10234F] sm:px-5 sm:py-6 lg:px-7">
      <div className="mx-auto max-w-[1600px]">
        {/* Page heading */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="app-page-title text-[#10234F]">
              Website Blog Posts
            </p>
            <p className="app-description mt-1.5">
              Manage blog titles, URLs, publishing status and SEO metadata.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={onImportBlog}
            >
              <Upload size={15} /> Import
            </Button>
            <Button onClick={onAddBlog || (() => setAddingBlog(true))}>
              <Plus size={16} /> Add Blog Post
            </Button>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-4 flex items-center gap-2 rounded-xl border border-[#FFD1B0] bg-[#FFF1E5] px-4 py-3 text-xs font-semibold text-[#B85D0A]"
          >
            <CheckCircle2 size={16} />
            <span>{notice}</span>
            <button
              className="ml-auto"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#577B9F]">
                Total Blog Records
              </p>
              <span className="rounded-xl bg-[#EDF4FF] p-2.5 text-[#4276B5]">
                <FileText size={18} />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#10234F]">
              {blogs.length}
            </p>
            <p className="app-description mt-1 text-[#577B9F]">
              Blog records currently loaded
            </p>
          </div>

          <div className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#577B9F]">
                Published
              </p>
              <span className="rounded-xl bg-[#EAF7ED] p-2.5 text-[#218838]">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#10234F]">
              {publishedCount}
            </p>
            <p className="app-description mt-1 text-[#577B9F]">
              Published status records
            </p>
          </div>

          <div className="rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#577B9F]">
                Drafts
              </p>
              <span className="rounded-xl bg-[#FFE9D9] p-2.5 text-[#F04A13]">
                <Pencil size={18} />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#10234F]">
              {draftCount}
            </p>
            <p className="app-description mt-1 text-[#577B9F]">
              Draft records awaiting publication
            </p>
          </div>
        </div>

        {/* Main table card */}
        <section className="overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#F2E8DE] p-4 sm:p-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="app-section-title text-[#10234F]">
                Manage Blog Posts
              </h2>
              <p className="app-description mt-1 text-[#577B9F]">
                Search, review and manage your website blog records.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title, slug, SEO..."
                  className="w-full rounded-xl border border-[#F2E8DE] bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10 sm:w-64"
                />
              </label>

              <label className="relative">
                <Filter
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                />
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-[#F2E8DE] bg-white py-2.5 pl-9 pr-8 text-xs outline-none focus:border-[#FF8A37] sm:w-36"
                >
                  <option value="All">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>

              <Button variant="secondary" onClick={exportCsv}>
                <Download size={14} /> Export CSV
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <label className="flex items-center gap-2 text-xs text-[#577B9F]">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
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
              {filteredBlogs.length} matching record
              {filteredBlogs.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="border-y border-[#F2E8DE] bg-[#FFF7EF]">
                  {[
                    "Title",
                    "Slug",
                    "Status",
                    "Published",
                    "SEO Title",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#19366F]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleBlogs.map((blog, index) => (
                  <tr
                    key={blog.id}
                    className={`border-b border-[#F2E8DE] align-top transition hover:bg-[#FFF7EF] ${
                      index % 2 === 1 ? "bg-[#FFFCF8]" : "bg-white"
                    }`}
                  >
                    <td className="w-[25%] px-4 py-4">
                      <p className="text-xs font-bold leading-5 text-[#10234F]">
                        {blog.title}
                      </p>
                    </td>

                    <td className="w-[25%] px-4 py-4">
                      <code className="break-all rounded-md bg-[#FFF1E5] px-2 py-1 text-[10px] leading-5 text-[#B85D0A]">
                        {blog.slug}
                      </code>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={blog.status} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs leading-5 text-[#577B9F]">
                      {blog.published}
                    </td>

                    <td className="w-[23%] px-4 py-4">
                      <p className="text-xs leading-5 text-[#577B9F]">
                        {blog.seoTitle || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex min-w-[180px] flex-wrap gap-1.5">
                        <Button
                          variant="cyan"
                          className="px-2.5 py-1.5"
                          onClick={() => setPreviewBlog(blog)}
                          title="View blog details"
                        >
                          <Eye size={12} /> View
                        </Button>

                        <Button
                          variant="secondary"
                          className="px-2.5 py-1.5"
                          onClick={() => {
                            const blob = new Blob(
                              [JSON.stringify(blog, null, 2)],
                              { type: "application/json" }
                            );
                            const url = URL.createObjectURL(blob);
                            const anchor = document.createElement("a");
                            anchor.href = url;
                            anchor.download = `${blog.slug || "blog"}.json`;
                            anchor.click();
                            URL.revokeObjectURL(url);
                          }}
                          title="Export this blog record"
                        >
                          <Download size={12} /> Export
                        </Button>

                        <Button
                          variant="blue"
                          className="px-2.5 py-1.5"
                          onClick={() =>
                            onEditBlog
                              ? onEditBlog(blog)
                              : setEditingBlog(blog)
                          }
                          title="Edit blog"
                        >
                          <Pencil size={12} /> Edit
                        </Button>

                        <Button
                          variant="danger"
                          className="px-2.5 py-1.5"
                          onClick={() => deleteBlog(blog)}
                          title="Delete blog"
                        >
                          <Trash2 size={12} /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleBlogs.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-14 text-center"
                    >
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#B85D0A]">
                        <Search size={21} />
                      </span>
                      <p className="mt-3 text-sm font-bold text-[#19366F]">
                        No blog posts found
                      </p>
                      <p className="app-description mt-1 text-[#577B9F]">
                        Try changing the search term or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-[#F2E8DE] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-[#577B9F]">
              Showing{" "}
              <span className="font-bold text-[#19366F]">
                {filteredBlogs.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#19366F]">
                {Math.min(startIndex + pageSize, filteredBlogs.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#19366F]">
                {filteredBlogs.length}
              </span>{" "}
              entries
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="secondary"
                className="px-3 py-2"
                disabled={safePage <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft size={14} /> Previous
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (number) =>
                    number === 1 ||
                    number === totalPages ||
                    Math.abs(number - safePage) <= 1
                )
                .map((number, index, numbers) => (
                  <React.Fragment key={number}>
                    {index > 0 && number - numbers[index - 1] > 1 && (
                      <span className="px-1 text-xs text-[#577B9F]">…</span>
                    )}
                    <button
                      onClick={() => setPage(number)}
                      className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${
                        safePage === number
                          ? "bg-[#FF711A] text-white shadow-sm"
                          : "border border-[#F2E8DE] bg-white text-[#19366F] hover:bg-[#FFF1E5]"
                      }`}
                    >
                      {number}
                    </button>
                  </React.Fragment>
                ))}

              <Button
                variant="secondary"
                className="px-3 py-2"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </section>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#F2E8DE] py-4 text-center text-[11px] text-[#577B9F] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span>Website Admin · Blog Management</span>
        </footer>
      </div>

      {addingBlog && (
        <BlogModal
          onClose={() => setAddingBlog(false)}
          onSave={saveBlog}
        />
      )}

      {editingBlog && (
        <BlogModal
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onSave={saveBlog}
        />
      )}

      {previewBlog && (
        <BlogPreview
          blog={previewBlog}
          onClose={() => setPreviewBlog(null)}
        />
      )}
    </main>
  );
}
