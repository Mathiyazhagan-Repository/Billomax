
import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Search,
  Settings2,
  Upload,
  Save,
  X,
  CheckCircle2,
  Info,
  Link2,
  Code2,
  Eye,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  ChevronDown,
  Globe,
  CalendarDays,
  Menu,
  FileCode2,
} from "lucide-react";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImageUrl: "",
  publishedAt: "26-10-2026 15:49",
  menuOrder: "0",
  publishImmediately: true,
  showInNavigation: true,
  metaTitle: "",
  canonicalUrl: "",
  metaKeywords: "",
  robotsDirectives: "index,follow",
  metaDescription: "",
  schemaMarkup: '{"@context":"https://schema.org"}',
};

const inputClass =
  "w-full rounded-xl border border-[#DCE5F0] bg-white px-3 py-2.5 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA8B9] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-2 block text-xs font-bold tracking-wide text-[#263B60]";

function Field({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  hint,
  className = "",
  rows,
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {rows ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          required={required}
          className={inputClass}
        />
      )}

      {hint && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-[#71839B]">
          <Info size={13} className="mt-0.5 shrink-0 text-[#20B8D3]" />
          {hint}
        </p>
      )}
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description, number }) {
  return (
    <div className="mb-5 flex items-start gap-3 border-b border-[#EDF1F6] pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-extrabold text-[#10234F]">
            {title}
          </h2>
          {number && (
            <span className="rounded-md bg-[#F1F5FA] px-2 py-0.5 text-[10px] font-bold text-[#71839B]">
              {number}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs leading-5 text-[#8290A4]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  editorRef,
  showHtml = false,
}) {
  const [sourceMode, setSourceMode] = useState(false);

  const runCommand = (command, argument = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    onChange(editorRef.current?.innerHTML || "");
  };

  const tools = [
    { icon: Undo2, action: "undo", label: "Undo" },
    { icon: Redo2, action: "redo", label: "Redo" },
    { icon: Bold, action: "bold", label: "Bold" },
    { icon: Italic, action: "italic", label: "Italic" },
    { icon: Underline, action: "underline", label: "Underline" },
    { icon: AlignLeft, action: "justifyLeft", label: "Align left" },
    { icon: AlignCenter, action: "justifyCenter", label: "Align center" },
    { icon: AlignRight, action: "justifyRight", label: "Align right" },
    { icon: List, action: "insertUnorderedList", label: "Bullet list" },
    { icon: ListOrdered, action: "insertOrderedList", label: "Numbered list" },
  ];

  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>

      <div className="overflow-hidden rounded-xl border border-[#DCE5F0] bg-white focus-within:border-[#FF812B]">
        <div className="flex flex-wrap items-center gap-1 border-b border-[#E5EBF3] bg-[#FAFBFD] px-2 py-2">
          {["File", "Edit", "View", "Insert", "Format", "Tools", "Table"].map(
            (item) => (
              <span
                key={item}
                className="rounded px-2 py-1 text-[11px] text-[#526984]"
              >
                {item}
              </span>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1 border-b border-[#E5EBF3] px-2 py-2">
          {tools.map(({ icon: Icon, action, label: toolLabel }) => (
            <button
              key={action}
              type="button"
              title={toolLabel}
              onClick={() => runCommand(action)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#526984] transition hover:bg-[#FFF0E4] hover:text-[#FF6814]"
            >
              <Icon size={16} />
            </button>
          ))}

          <span className="mx-1 h-6 w-px bg-[#E5EBF3]" />

          <button
            type="button"
            title="Insert link"
            onClick={() => {
              const url = window.prompt("Enter link URL");
              if (url) runCommand("createLink", url);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#526984] hover:bg-[#FFF0E4] hover:text-[#FF6814]"
          >
            <Link2 size={16} />
          </button>

          <button
            type="button"
            title="Insert HTML"
            onClick={() => setSourceMode((current) => !current)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              sourceMode
                ? "bg-[#FFF0E4] text-[#FF6814]"
                : "text-[#526984] hover:bg-[#FFF0E4]"
            }`}
          >
            <Code2 size={16} />
          </button>

          <button
            type="button"
            title="Preview content"
            onClick={() =>
              window.alert(
                "Preview the content in the editor before saving the page."
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#526984] hover:bg-[#FFF0E4] hover:text-[#FF6814]"
          >
            <Eye size={16} />
          </button>
        </div>

        {sourceMode ? (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={label === "Content" ? 12 : 6}
            className="w-full resize-y border-0 px-4 py-4 text-sm text-[#10234F] outline-none focus:ring-0"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(event) => onChange(event.currentTarget.innerHTML)}
            data-placeholder={placeholder}
            className={`rich-editor min-h-[140px] w-full overflow-auto px-4 py-4 text-sm leading-7 text-[#263B60] outline-none ${
              label === "Content" ? "min-h-[260px]" : "min-h-[140px]"
            }`}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}

        <div className="flex items-center justify-between border-t border-[#EDF1F6] bg-[#FAFBFD] px-3 py-1.5 text-[10px] text-[#8290A4]">
          <span>{showHtml ? "HTML supported" : "Rich text editor"}</span>
          <span>
            {value.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean)
              .length}{" "}
            WORDS
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CreatePage({
  onBack,
  onSave,
  initialData,
  isEditing = false,
  backLabel = "Back",
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...initialData,
  }));
  const [featuredImage, setFeaturedImage] = useState("");
  const [htmlFileName, setHtmlFileName] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const excerptEditorRef = useRef(null);
  const contentEditorRef = useRef(null);
  const htmlFileRef = useRef(null);
  const imageFileRef = useRef(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => {
      const updated = {
        ...current,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title" && !current.slug) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }

      return updated;
    });

    setNotice("");
  };

  const handleHtmlUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/\.html?$/i.test(file.name)) {
      setNoticeType("error");
      setNotice("Please upload an HTML file (.html or .htm).");
      event.target.value = "";
      return;
    }

    try {
      const html = await file.text();
      setForm((current) => ({ ...current, content: html }));
      setHtmlFileName(file.name);
      setNoticeType("success");
      setNotice("HTML file loaded into the content field. Review it before saving.");

      if (contentEditorRef.current) {
        contentEditorRef.current.innerHTML = html;
      }
    } catch {
      setNoticeType("error");
      setNotice("Unable to read this HTML file.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setNoticeType("error");
      setNotice("Supported image formats: JPG, PNG, WEBP, GIF, and SVG.");
      event.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setNoticeType("error");
      setNotice("Featured image must be no larger than 4 MB.");
      event.target.value = "";
      return;
    }

    if (featuredImage.startsWith("blob:")) {
      URL.revokeObjectURL(featuredImage);
    }

    const previewUrl = URL.createObjectURL(file);
    setFeaturedImage(previewUrl);
    setNoticeType("success");
    setNotice("Featured image selected. Upload it to your server when saving.");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice("");

    if (!form.title.trim()) {
      setNoticeType("error");
      setNotice("Page title is required.");
      return;
    }

    if (!form.slug.trim()) {
      setNoticeType("error");
      setNotice("Page slug is required.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      setNoticeType("error");
      setNotice("Use lowercase letters, numbers, and hyphens in the slug.");
      return;
    }

    if (form.schemaMarkup.trim()) {
      try {
        JSON.parse(form.schemaMarkup);
      } catch {
        setNoticeType("error");
        setNotice("Schema Markup must contain valid JSON.");
        return;
      }
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      featuredImageFileSelected: Boolean(featuredImage),
      htmlFileName: htmlFileName || null,
    };

    if (onSave) {
      onSave(payload);
      return;
    }

    setNoticeType("success");
    setNotice(
      "Validation successful. Connect your existing page-creation API to save this page."
    );
  };

  const handleCancel = () => {
    setForm(initialForm);
    setFeaturedImage("");
    setHtmlFileName("");
    setNotice("");
    if (htmlFileRef.current) htmlFileRef.current.value = "";
    if (imageFileRef.current) imageFileRef.current.value = "";
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <style>{`
        .rich-editor:empty:before {
          content: attr(data-placeholder);
          color: #9AA8B9;
          pointer-events: none;
        }
        .rich-editor h1 { font-size: 1.8rem; font-weight: 800; }
        .rich-editor h2 { font-size: 1.4rem; font-weight: 700; }
        .rich-editor ul { list-style: disc; padding-left: 1.5rem; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5rem; }
        .rich-editor a { color: #1675E8; text-decoration: underline; }
        .rich-editor table { border-collapse: collapse; width: 100%; }
        .rich-editor td, .rich-editor th { border: 1px solid #DCE5F0; padding: 6px; }
      `}</style>

      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F47721]">
              <span className="h-2 w-2 rounded-full bg-[#FF812B]" />
              Website Management
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
              {isEditing ? "Edit Page" : "Create Page"}
            </h1>
            <p className="mt-1.5 text-sm text-[#71839B]">
              Create a website page, publish content, and configure search
              engine settings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#526984] transition hover:bg-[#F8FAFD]"
              >
                <ArrowLeft size={16} />
                {backLabel}
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#526984] transition hover:bg-[#F8FAFD]"
            >
              <ArrowLeft size={16} />
              Reset Form
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main page content */}
          <section className="rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-[0_5px_20px_rgba(16,35,79,0.035)] sm:p-6 lg:p-7">
            <SectionHeading
              icon={FileText}
              title="Page Content"
              description="Add your page title, URL, excerpt, and main HTML content."
              number="01"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Field
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter page title"
                required
                className="md:col-span-2"
              />
              <Field
                label="Slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="auto-from-title"
                required
                hint="Used in the page URL."
              />
            </div>

            <div className="mt-5 space-y-5">
              <RichTextEditor
                label="Excerpt"
                value={form.excerpt}
                onChange={(value) =>
                  setForm((current) => ({ ...current, excerpt: value }))
                }
                placeholder="Short summary for blog cards and meta descriptions"
                editorRef={excerptEditorRef}
              />

              <RichTextEditor
                label="Content"
                value={form.content}
                onChange={(value) =>
                  setForm((current) => ({ ...current, content: value }))
                }
                placeholder="HTML is allowed"
                editorRef={contentEditorRef}
                showHtml
              />
            </div>
          </section>

          {/* HTML upload and publishing */}
          <section className="rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-[0_5px_20px_rgba(16,35,79,0.035)] sm:p-6 lg:p-7">
            <SectionHeading
              icon={ImageIcon}
              title="Publishing & Media"
              description="Import an HTML page, choose a featured image, and control publication settings."
              number="02"
            />

            <div>
              <label className={labelClass}>Upload Direct HTML Page</label>
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#C9D5E5] bg-[#FAFBFD] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#2878D4]">
                    <FileCode2 size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#263B60]">
                      {htmlFileName || "Import an HTML file"}
                    </p>
                    <p className="mt-1 text-xs text-[#8290A4]">
                      Upload a ready-made SEO HTML file for this page.
                    </p>
                  </div>
                </div>
                <input
                  ref={htmlFileRef}
                  type="file"
                  accept=".html,.htm,text/html"
                  onChange={handleHtmlUpload}
                  className="block w-full text-xs text-[#526984] file:mr-3 file:rounded-lg file:border-0 file:bg-[#FFF0E4] file:px-4 file:py-2 file:font-bold file:text-[#C65A18] hover:file:bg-[#FFE3D0] sm:w-auto"
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-[#71839B]">
                Already have a ready-made SEO HTML file for this page? Upload
                it here to replace the content above. You can still review and
                edit it before saving.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <Field
                  label="Featured Image URL"
                  name="featuredImageUrl"
                  value={form.featuredImageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  hint="You can paste a direct image URL here or upload an image below."
                />
              </div>

              <Field
                label="Published At"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleChange}
                placeholder="DD-MM-YYYY HH:mm"
                icon={CalendarDays}
              />

              <Field
                label="Menu Order"
                name="menuOrder"
                value={form.menuOrder}
                onChange={handleChange}
                type="number"
                placeholder="0"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Upload Featured Image</label>
                <div className="rounded-xl border border-[#DCE5F0] bg-white p-3">
                  <input
                    ref={imageFileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,.svg,image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-xs text-[#526984] file:mr-3 file:rounded-lg file:border-0 file:bg-[#FFF0E4] file:px-4 file:py-2 file:font-bold file:text-[#C65A18] hover:file:bg-[#FFE3D0]"
                  />
                </div>
                <p className="mt-2 text-xs text-[#71839B]">
                  Supported: JPG, PNG, WEBP, GIF, SVG. Max 4MB.
                </p>

                {(featuredImage || form.featuredImageUrl) && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-[#E5EBF3] bg-[#FAFBFD] p-2">
                    <img
                      src={featuredImage || form.featuredImageUrl}
                      alt="Featured page preview"
                      className="max-h-56 w-full rounded-lg object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-xl border border-[#E5EBF3] bg-[#FCFDFE] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#71839B]">
                  Publication Options
                </p>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-white">
                  <input
                    type="checkbox"
                    name="publishImmediately"
                    checked={form.publishImmediately}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 accent-[#FF6814]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#263B60]">
                      Publish immediately
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#8290A4]">
                      Make the page available immediately after saving.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-white">
                  <input
                    type="checkbox"
                    name="showInNavigation"
                    checked={form.showInNavigation}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 accent-[#FF6814]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#263B60]">
                      Show this page in navigation menus
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#8290A4]">
                      Include this page in the website navigation.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* SEO settings */}
          <section className="rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-[0_5px_20px_rgba(16,35,79,0.035)] sm:p-6 lg:p-7">
            <SectionHeading
              icon={Search}
              title="SEO Settings"
              description="Configure search snippets, canonical URLs, crawler directives, and structured data."
              number="03"
            />

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <Field
                label="Meta Title"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="Enter meta title"
              />
              <Field
                label="Canonical URL"
                name="canonicalUrl"
                value={form.canonicalUrl}
                onChange={handleChange}
                placeholder="https://billomax.com/page-url"
              />
              <Field
                label="Meta Keywords"
                name="metaKeywords"
                value={form.metaKeywords}
                onChange={handleChange}
                placeholder="keyword 1, keyword 2, keyword 3"
              />
              <Field
                label="Robots Directives"
                name="robotsDirectives"
                value={form.robotsDirectives}
                onChange={handleChange}
                placeholder="index,follow"
              />
              <Field
                label="Meta Description"
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="Write a description for search engine results"
                rows={4}
                className="md:col-span-2"
              />
              <Field
                label="Schema Markup (JSON-LD)"
                name="schemaMarkup"
                value={form.schemaMarkup}
                onChange={handleChange}
                placeholder='{"@context":"https://schema.org"}'
                rows={6}
                className="md:col-span-2"
                hint="Enter valid JSON-LD structured data. The form validates JSON syntax before submission."
              />
            </div>

            <div className="mt-5 rounded-xl border border-[#E5EBF3] bg-[#FAFBFD] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#263B60]">
                <Globe size={15} className="text-[#FF6814]" />
                Search Preview
              </div>
              <p className="truncate text-base font-semibold text-[#1769C2]">
                {form.metaTitle || form.title || "Page title"}
              </p>
              <p className="mt-1 break-all text-xs text-emerald-700">
                {form.canonicalUrl || `https://billomax.com/${form.slug || "page-url"}`}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#71839B]">
                {form.metaDescription ||
                  "Your meta description will appear here as a search preview."}
              </p>
            </div>
          </section>

          {/* Feedback */}
          {notice && (
            <div
              role={noticeType === "error" ? "alert" : "status"}
              className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                noticeType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {noticeType === "error" ? (
                <Info size={17} className="mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              )}
              <span>{notice}</span>
            </div>
          )}

          {/* Form actions */}
          <div className="flex flex-col-reverse justify-between gap-3 rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
            <p className="text-xs leading-5 text-[#8290A4]">
              Review the content and SEO fields before saving your page.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DCE5F0] bg-white px-5 text-sm font-bold text-[#526984] transition hover:bg-[#F8FAFD]"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-7 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Save size={16} />
                {isEditing ? "Update Page" : "Save Page"}
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#E5EBF3] py-4 text-center text-[11px] text-[#8290A4] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span>Website Management · Create Page</span>
        </footer>
      </div>
    </main>
  );
}
