
import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronUp,
  Code2,
  ExternalLink,
  FileText,
  Globe,
  LayoutDashboard,
  Link2,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const WEBSITE_URL = "https://billomax.com";

const INITIAL_SECTIONS = [
  {
    id: 1,
    title: "Smart Billing & Inventory for Modern Business",
    description:
      "Manage billing, GST reports, inventory, customers, and sales from one platform built for pharmacies, supermarkets, restaurants, and more.",
    slug: "home",
    status: "Published",
  },
  {
    id: 2,
    title: "Features",
    description: "Everything Your Business Needs to Grow",
    slug: "features",
    status: "Published",
  },
  {
    id: 3,
    title: "Modules",
    description: "Powerful Modules for Every Operation",
    slug: "modules",
    status: "Published",
  },
  {
    id: 4,
    title: "Solutions",
    description: "Built for Your Industry",
    slug: "solutions",
    status: "Published",
  },
  {
    id: 5,
    title: "Pricing",
    description: "Simple, Transparent Pricing",
    slug: "pricing",
    status: "Published",
  },
  {
    id: 6,
    title: "Contact",
    description: "",
    slug: "contact",
    status: "Published",
  },
];

const INITIAL_BLOGS = [
  {
    id: 1,
    title: "POS Billing Software for Indian Shops: 2026 Buyer's Guide",
    slug: "pos-billing-software",
    type: "Blog",
    status: "Published",
    updated: "23 Oct 2026 06:58 PM",
  },
  {
    id: 2,
    title: "GST Billing Software: 7 Checks Before You Buy (2026)",
    slug: "gst-billing-software-20261023182441-s019",
    type: "Blog",
    status: "Published",
    updated: "23 Oct 2026 06:24 PM",
  },
  {
    id: 3,
    title: "Restaurant Billing Software: Buyer's Guide | Billomax",
    slug: "restaurant-billing-software-buyers-guide",
    type: "Blog",
    status: "Published",
    updated: "15 Oct 2026 01:13 PM",
  },
  {
    id: 4,
    title: "Medical Invoicing Software: Simplify Healthcare Billing & Get Paid Faster",
    slug: "medical-invoicing-software",
    type: "Blog",
    status: "Published",
    updated: "04 Aug 2026 06:31 PM",
  },
  {
    id: 5,
    title: "Best Billing Software for Every Business",
    slug: "best-billing-software-for-every-business",
    type: "Blog",
    status: "Published",
    updated: "04 Aug 2026 12:47 PM",
  },
  {
    id: 6,
    title: "Barcode Billing Software for Faster & Smarter Business Billing",
    slug: "barcode-billing-software",
    type: "Blog",
    status: "Published",
    updated: "03 Aug 2026 06:19 PM",
  },
  {
    id: 7,
    title: "Supermarket Billing Software That Clears The Queue",
    slug: "supermarket-billing-software",
    type: "Blog",
    status: "Published",
    updated: "31 Jul 2026 05:03 PM",
  },
  {
    id: 8,
    title: "Restaurant Billing Software: 7 Features That Matter",
    slug: "restaurant-billing-software-india",
    type: "Blog",
    status: "Published",
    updated: "30 Jul 2026 05:50 PM",
  },
];

const INITIAL_HEALTH_ITEMS = [
  {
    id: 1,
    title: "Billing Software | Complete GST & Cloud Accounting Guide",
    type: "Blog",
    slug: "billing-software-complete-gst-cloud-accounting-guide",
    issues: ["Missing meta title", "Missing meta description"],
  },
];

const WEBSITE_LINKS = [
  {
    title: "Homepage",
    path: "/",
    url: WEBSITE_URL,
  },
  {
    title: "Blogs",
    path: "/blogs",
    url: `${WEBSITE_URL}/blogs`,
  },
  {
    title: "Robots.txt",
    path: "/robots.txt",
    url: `${WEBSITE_URL}/robots.txt`,
  },
  {
    title: "Sitemap.xml",
    path: "/sitemap.xml",
    url: `${WEBSITE_URL}/sitemap.xml`,
  },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13] hover:shadow-md",
    blue: "bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13] hover:shadow-md",
    green: "bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13] hover:shadow-md",
    secondary:
      "border border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5]",
    dark: "bg-[#19366F] text-white hover:bg-[#10234F]",
    ghost: "text-[#577B9F] hover:bg-[#FFF1E5]",
  };

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-5",
        className
      )}
    >
      {children}
    </section>
  );
}

function SectionHeading({ title, description, action, icon: Icon }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
            <Icon size={19} />
          </span>
        )}
        <div>
          <h2 className="app-section-title text-[#10234F]">{title}</h2>
          {description && (
            <p className="app-description mt-1 max-w-2xl leading-5">
              {description}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ children, tone = "green" }) {
  const tones = {
    green: "bg-[#EAF7ED] text-[#218838] ring-[#CBE9D1]",
    blue: "bg-[#EDF4FF] text-[#4276B5] ring-[#C9DCF5]",
    orange: "bg-[#FFE9D9] text-[#B85D0A] ring-[#FFD1B0]",
    red: "bg-[#FFF1EC] text-[#C34B34] ring-[#F3D5CE]",
    gray: "bg-[#F4F6F8] text-[#577B9F] ring-[#E8EDF4]",
  };

  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset",
        tones[tone] || tones.gray
      )}
    >
      {children}
    </span>
  );
}

function StatCard({ label, value, description, icon: Icon, tone }) {
  const iconTones = {
    blue: "bg-[#EDF4FF] text-[#4276B5]",
    orange: "bg-[#FFE9D9] text-[#F04A13]",
    green: "bg-[#EAF7ED] text-[#218838]",
    purple: "bg-[#E8D8FF] text-[#8219F5]",
  };

  return (
    <article className="relative isolate overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute -bottom-10 -right-7 -z-10 h-24 w-24 rounded-full bg-[#FFF7EF]" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#577B9F]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#10234F]">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconTones[tone] || iconTones.blue
          )}
        >
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-[#577B9F]">
        {description}
      </p>
    </article>
  );
}

function EditModal({ item, onClose, onSave }) {
  const [title, setTitle] = useState(item.title || "");
  const [description, setDescription] = useState(item.description || "");
  const [slug, setSlug] = useState(item.slug || "");
  const [metaTitle, setMetaTitle] = useState(item.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    item.metaDescription || ""
  );

  if (!item) return null;

  const isBlog = item.type === "Blog";
  const isHealthItem = Array.isArray(item.issues);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#F8EBDD] bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#10234F]">
              {isHealthItem ? "Fix Content Health" : `Edit ${isBlog ? "Blog" : "Homepage Section"}`}
            </h2>
            <p className="app-description mt-1">
              Update the selected record's content and metadata.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#8798AD] hover:bg-[#FFF1E5]"
            aria-label="Close edit dialog"
          >
            <X size={19} />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave({
              ...item,
              title,
              description,
              slug,
              metaTitle,
              metaDescription,
              issues: isHealthItem
                ? [
                    ...(metaTitle.trim() ? [] : ["Missing meta title"]),
                    ...(metaDescription.trim()
                      ? []
                      : ["Missing meta description"]),
                  ]
                : item.issues,
            });
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              Title
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            />
          </label>

          {!isHealthItem && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
                Description
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              URL slug
            </span>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
                Meta title
              </span>
              <input
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                placeholder="Enter SEO meta title"
                className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
                Meta description
              </span>
              <textarea
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                rows={2}
                placeholder="Enter SEO meta description"
                className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-[#F2E8DE] pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <CheckCircle2 size={15} /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HomepageSections({ sections, onEdit, onPreview, onViewAll }) {
  return (
    <Card className="h-full">
      <SectionHeading
        title="Homepage Section Records"
        description="These entries drive the main landing page areas visitors see. Edit the copy here to update homepage messaging."
        icon={LayoutDashboard}
        action={
          <Button variant="secondary" onClick={onViewAll}>
            Open All Pages
          </Button>
        }
      />

      <div className="space-y-2.5">
        {sections.map((section) => (
          <article
            key={section.id}
            className="rounded-2xl border border-[#F2E8DE] bg-white p-3 transition hover:border-[#FFD1B0] hover:shadow-sm sm:p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-extrabold leading-5 text-[#10234F]">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="app-description mt-1 leading-5">
                    {section.description}
                  </p>
                )}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <StatusBadge tone="blue">
                    {section.slug.toUpperCase().replaceAll("-", " ")}
                  </StatusBadge>
                  <StatusBadge>{section.status}</StatusBadge>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                <Button
                  variant="blue"
                  className="px-2.5 py-1.5"
                  onClick={() => onEdit(section)}
                >
                  <Pencil size={12} /> Edit
                </Button>
                <Button
                  variant="secondary"
                  className="px-2.5 py-1.5"
                  onClick={() => onPreview(section)}
                >
                  Preview
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function PublicWebsiteLinks({ onOpen }) {
  return (
    <Card className="h-full">
      <SectionHeading
        title="Public Website Links"
        description="Verify the live endpoints the SEO team usually needs during review and submission work."
        icon={Globe}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {WEBSITE_LINKS.map((link) => (
          <button
            type="button"
            key={link.title}
            onClick={() => onOpen(link.url)}
            className="group rounded-2xl border border-[#F2E8DE] p-4 text-left transition hover:border-[#FFD1B0] hover:bg-[#FFF7EF]"
          >
            <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#577B9F]">
              {link.title}
            </span>
            <span className="mt-2 block text-sm font-extrabold text-[#10234F]">
              {link.path}
            </span>
            <span className="mt-1 flex items-center gap-1 break-all text-xs font-semibold text-[#4276B5]">
              {link.url}
              <ExternalLink
                size={12}
                className="shrink-0 opacity-0 transition group-hover:opacity-100"
              />
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 border-t border-[#F2E8DE] pt-4">
        <p className="text-xs leading-5 text-[#577B9F]">
          <span className="font-bold text-[#10234F]">Canonical Base URL:</span>{" "}
          {WEBSITE_URL}
        </p>
        <p className="app-description mt-2 leading-5">
          Use the SEO panel when you need to change default metadata, blog
          defaults, canonical settings, schema, or crawler rules.
        </p>
      </div>
    </Card>
  );
}

function RecentWebsiteContent({ blogs, onEdit }) {
  return (
    <Card className="h-full">
      <SectionHeading
        title="Recent Website Content"
        description="The latest content records edited across pages and blogs."
        icon={BookOpen}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#F2E8DE] text-[10px] font-bold uppercase tracking-[0.08em] text-[#577B9F]">
              <th className="px-2 py-3">Content</th>
              <th className="px-2 py-3">Type</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Updated</th>
              <th className="px-2 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-b border-[#F2E8DE] last:border-0 hover:bg-[#FFF7EF]"
              >
                <td className="max-w-[330px] px-2 py-3">
                  <p className="text-xs font-bold leading-5 text-[#10234F]">
                    {blog.title}
                  </p>
                  <p className="mt-1 break-all text-[10px] leading-4 text-[#577B9F]">
                    {blog.slug}
                  </p>
                </td>
                <td className="px-2 py-3 text-xs text-[#577B9F]">{blog.type}</td>
                <td className="px-2 py-3">
                  <StatusBadge>{blog.status}</StatusBadge>
                </td>
                <td className="whitespace-nowrap px-2 py-3 text-[10px] text-[#577B9F]">
                  {blog.updated}
                </td>
                <td className="px-2 py-3">
                  <Button
                    variant="blue"
                    className="px-2.5 py-1.5"
                    onClick={() => onEdit(blog)}
                  >
                    <Pencil size={11} /> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="app-description mt-3 text-[11px] leading-5">
        8 visible blog records are shown from the provided screenshot. The
        dashboard summary reports 14 published blogs.
      </p>
    </Card>
  );
}

function ContentHealth({ items, onFix }) {
  return (
    <Card className="h-full">
      <SectionHeading
        title="Content Health"
        description="Records that may need SEO or content attention because key copy fields are still empty."
        icon={Activity}
      />

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-[#F2E8DE] bg-[#FFFCF8] p-4"
          >
            <h3 className="text-xs font-extrabold leading-5 text-[#10234F]">
              {item.title}
            </h3>
            <p className="app-description mt-1.5 break-words text-[11px] leading-5">
              {item.type} · {item.slug} · {item.issues.join(" / ")}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <StatusBadge tone="blue">Fix</StatusBadge>
              <Button
                variant="secondary"
                className="py-1.5"
                onClick={() => onFix(item)}
              >
                <Pencil size={12} /> Fix SEO
              </Button>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <div className="rounded-xl border border-[#CBE9D1] bg-[#EAF7ED] p-4 text-sm text-[#218838]">
            No outstanding content-health issues in the current list.
          </div>
        )}
      </div>
    </Card>
  );
}

function QuickPublishActions({ onCreatePage, onCreateBlog, onOpenSeo }) {
  return (
    <div className="rounded-2xl border border-[#F8EBDD] bg-gradient-to-br from-[#FFF1E5] to-[#FFF7EF] p-4 text-[#19366F] sm:p-5">
      <h2 className="text-sm font-extrabold text-[#10234F]">Quick Publish Actions</h2>
      <p className="mt-1.5 text-xs leading-5 text-[#577B9F]">
        Jump straight into the most common SEO and website tasks without
        digging through the sidebar.
      </p>
      <div className="mt-3 space-y-2">
        <Button
          variant="blue"
          className="w-full"
          onClick={onCreatePage}
        >
          <Plus size={14} /> Create Website Page
        </Button>
        <Button
          variant="green"
          className="w-full"
          onClick={onCreateBlog}
        >
          <Plus size={14} /> Create Blog Post
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onOpenSeo}
        >
          <Settings2 size={14} /> Edit Metadata, Sitemap, Robots
        </Button>
      </div>
    </div>
  );
}

function CreateModal({ type, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");

  if (!type) return null;

  const isBlog = type === "Blog";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#F8EBDD] bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#10234F]">
              Create {isBlog ? "Blog Post" : "Website Page"}
            </h2>
            <p className="app-description mt-1">
              Add a new content record to the current page.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#8798AD] hover:bg-[#FFF1E5]"
            aria-label="Close create dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onCreate({ title, description, slug });
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              Title
            </span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={isBlog ? "Enter blog title" : "Enter page title"}
              className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Enter a short description"
              className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
              URL slug
            </span>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="example-page"
              className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
            />
          </label>

          <div className="flex justify-end gap-2 border-t border-[#F2E8DE] pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus size={14} /> Create Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard({
  onNavigate,
  onCreatePage,
  onCreateBlog,
  onOpenSeo,
  onEditPage,
  editedPage,
  onEditBlog,
  editedBlog,
}) {
  const [sections, setSections] = useState(() => {
    if (editedPage?.source !== "dashboard") return INITIAL_SECTIONS;

    return INITIAL_SECTIONS.map((section) =>
      section.id === editedPage.id
        ? {
            ...section,
            title: editedPage.data.title,
            slug: editedPage.data.slug,
            description:
              editedPage.data.excerpt || editedPage.data.content || "",
            status: editedPage.data.publishImmediately ? "Published" : "Draft",
          }
        : section
    );
  });
  const [blogs, setBlogs] = useState(() => {
    if (editedBlog?.source !== "dashboard") return INITIAL_BLOGS;

    return INITIAL_BLOGS.map((blog) =>
      blog.id === editedBlog.id
        ? {
            ...blog,
            ...editedBlog.data,
            status: editedBlog.data.publishImmediately
              ? "Published"
              : "Draft",
            updated: editedBlog.data.publishedAt || blog.updated,
          }
        : blog
    );
  });
  const [healthItems, setHealthItems] = useState(INITIAL_HEALTH_ITEMS);
  const [editingItem, setEditingItem] = useState(null);
  const [creatingType, setCreatingType] = useState("");
  const [notice, setNotice] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [showAllPages, setShowAllPages] = useState(false);

  const publishedPagesCount = 12;
  const publishedBlogsCount = 14;
  const homepageSectionsCount = 6;
  const navbarPagesCount = 1;
  const draftBlogsCount = 0;

  const filteredSections = useMemo(
    () =>
      sections.filter((item) =>
        `${item.title} ${item.description} ${item.slug}`
          .toLowerCase()
          .includes(pageSearch.toLowerCase())
      ),
    [sections, pageSearch]
  );

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  };

  const openExternal = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const saveEditedItem = (updatedItem) => {
    if (Array.isArray(updatedItem.issues)) {
      setHealthItems((items) =>
        items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    } else if (updatedItem.type === "Blog") {
      setBlogs((items) =>
        items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    } else {
      setSections((items) =>
        items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    }

    setEditingItem(null);
    showNotice("Changes updated in the current page state.");
  };

  const createRecord = ({ title, description, slug }) => {
    const safeSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    if (creatingType === "Blog") {
      setBlogs((items) => [
        {
          id: Math.max(0, ...items.map((item) => item.id)) + 1,
          title,
          description,
          slug: safeSlug,
          type: "Blog",
          status: "Draft",
          updated: new Date().toLocaleString(),
        },
        ...items,
      ]);
    } else {
      setSections((items) => [
        ...items,
        {
          id: Math.max(0, ...items.map((item) => item.id)) + 1,
          title,
          description,
          slug: safeSlug,
          status: "Draft",
        },
      ]);
    }

    setCreatingType("");
    showNotice(`${creatingType} record added to the current page state.`);
  };

  return (
    <main className="min-h-0 flex-1 bg-[#FFFAF5] px-3 py-4 font-sans text-[#10234F] sm:px-5 sm:py-6 lg:px-7">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="app-page-title text-[#10234F]">
              Website Admin Dashboard
            </p>
            <p className="app-description mt-1">
              Manage public website content and search visibility.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#F2E8DE] bg-white px-3 py-2 text-xs font-semibold text-[#577B9F]">
            <span className="h-2 w-2 rounded-full bg-[#218838]" />
            Website Operations
          </div>
        </div>

        {notice && (
          <div role="status" className="mb-4 flex items-start gap-2 rounded-xl border border-[#FFD1B0] bg-[#FFF1E5] px-4 py-3 text-sm text-[#B85D0A]">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="ml-auto" aria-label="Dismiss notification">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Hero and quick actions */}
        <section className="mb-5 grid gap-5 overflow-hidden rounded-2xl border border-[#F8EBDD] bg-gradient-to-br from-white via-white to-[#FFF7EF] p-5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6 lg:grid-cols-[1.5fr_0.95fr] lg:items-center lg:p-7">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFE9D9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#B85D0A]">
              <span className="h-2 w-2 rounded-full bg-[#218838] ring-4 ring-[#EAF7ED]" />
              Website Operations
            </div>

            <h1 className="mt-5 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-[#10234F] sm:text-3xl">
              Manage homepage sections, content pages, blogs, and SEO settings
              from one panel.
            </h1>

            <p className="app-description mt-3 max-w-3xl text-sm leading-6">
              The public website is no longer just a static landing page. This
              workspace gives your SEO team direct control over homepage
              section copy, content pages, blog publishing, and search indexing
              assets like robots.txt and sitemap.xml.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button variant="blue" onClick={() => onNavigate?.("Website Pages")}>
                <FileText size={15} /> Manage Website Pages
              </Button>
              <Button variant="secondary" onClick={() => onNavigate?.("Website Blogs")}>
                <BookOpen size={15} /> Manage Blogs
              </Button>
              <Button onClick={() => onNavigate?.("Website SEO Panel")}>
                <Settings2 size={15} /> Open SEO Panel
              </Button>
            </div>
          </div>

          <QuickPublishActions
            onCreatePage={() => onCreatePage?.()}
            onCreateBlog={
              onCreateBlog || (() => onNavigate?.("Website Add Blog Post"))
            }
            onOpenSeo={
              onOpenSeo || (() => onNavigate?.("Website SEO Panel"))
            }
          />
        </section>

        {/* Summary cards */}
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Published Pages"
            value={publishedPagesCount}
            description="12 total page records available for the public website."
            icon={FileText}
            tone="blue"
          />
          <StatCard
            label="Published Blogs"
            value={publishedBlogsCount}
            description={`${draftBlogsCount} draft blog entries still waiting for review or publish.`}
            icon={BookOpen}
            tone="green"
          />
          <StatCard
            label="Homepage Sections"
            value={homepageSectionsCount}
            description="Home, Features, Modules, Solutions, Pricing, and Contact."
            icon={LayoutDashboard}
            tone="orange"
          />
          <StatCard
            label="Navbar Pages"
            value={navbarPagesCount}
            description="Pages flagged to appear in dynamic navigation menus outside homepage section anchors."
            icon={Link2}
            tone="purple"
          />
        </div>

        {/* Homepage sections and public links */}
        <div className="mb-5 grid items-stretch gap-4 xl:grid-cols-[1.35fr_0.95fr]">
          <div id="homepage-sections" className="scroll-mt-5">
            <HomepageSections
              sections={filteredSections}
              onEdit={(item) =>
                onEditPage ? onEditPage(item) : setEditingItem(item)
              }
              onPreview={(item) => {
                if (item.slug === "home") {
                  openExternal(WEBSITE_URL);
                } else {
                  openExternal(`${WEBSITE_URL}/#${item.slug}`);
                }
              }}
              onViewAll={() => {
                setShowAllPages((value) => !value);
                setPageSearch("");
              }}
            />
          </div>
          <PublicWebsiteLinks onOpen={openExternal} />
        </div>

        {showAllPages && (
          <Card className="mb-5">
            <SectionHeading
              title="Website Page Records"
              description="Search the homepage section records shown in this dashboard."
              icon={Search}
            />
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <label className="relative block max-w-lg flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]" />
                <input
                  value={pageSearch}
                  onChange={(event) => setPageSearch(event.target.value)}
                  placeholder="Search section title, description or slug..."
                  className="w-full rounded-xl border border-[#E8EDF4] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
                />
              </label>
              <Button onClick={() => onCreatePage?.()}>
                <Plus size={14} /> Add Page
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead className="bg-[#FFF7EF] text-[#19366F]">
                  <tr>
                    {["Page / Section", "Slug", "Status", "Actions"].map((title) => (
                      <th key={title} className="px-3 py-3 font-bold">{title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSections.map((item) => (
                    <tr key={item.id} className="border-b border-[#F2E8DE] last:border-0 hover:bg-[#FFF7EF]">
                      <td className="px-3 py-3">
                        <p className="font-bold text-[#10234F]">{item.title}</p>
                        <p className="app-description mt-1">{item.description}</p>
                      </td>
                      <td className="px-3 py-3">{item.slug}</td>
                      <td className="px-3 py-3"><StatusBadge>{item.status}</StatusBadge></td>
                      <td className="px-3 py-3">
                        <Button
                          variant="blue"
                          onClick={() =>
                            onEditPage ? onEditPage(item) : setEditingItem(item)
                          }
                        >
                          <Pencil size={12} /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredSections.length === 0 && (
                    <tr><td colSpan={4} className="px-3 py-8 text-center text-[#8798AD]">No matching sections found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Recent content and content health */}
        <div className="grid items-stretch gap-4 xl:grid-cols-[1.4fr_0.95fr]">
          <div id="recent-content" className="scroll-mt-5">
            <RecentWebsiteContent
              blogs={blogs}
              onEdit={(item) =>
                onEditBlog ? onEditBlog(item) : setEditingItem(item)
              }
            />
          </div>
          <ContentHealth
            items={healthItems}
            onFix={(item) => setEditingItem(item)}
          />
        </div>

        <footer className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-[#F2E8DE] py-4 text-center text-[11px] text-[#8798AD] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} /> Website Admin
          </span>
        </footer>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF711A] text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#F04A13]"
        >
          <ChevronUp size={21} />
        </button>
      </div>

      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={saveEditedItem}
        />
      )}

      {creatingType && (
        <CreateModal
          type={creatingType}
          onClose={() => setCreatingType("")}
          onCreate={createRecord}
        />
      )}

    </main>
  );
}
