
import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Search,
  Save,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Link2,
  Code2,
  Eye,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Globe,
  Images,
  FileCode2,
  CalendarDays,
  Settings2,
} from "lucide-react";

/* ============================================================
   BILL0MAX — ADD BLOG POST
   React + Tailwind CSS
   File: AddBlogPost.jsx

   Required dependency:
   npm install lucide-react

   Props:
   onSave(payload) — connect to your existing API
   onCancel()      — optional navigation callback
============================================================ */

const INITIAL_DATA = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImageUrl: "",
  publishedAt: "26-10-2026 15:58",
  menuOrder: "0",
  publishImmediately: true,
  metaTitle: "",
  canonicalUrl: "",
  metaKeywords: "",
  robotsDirectives: "index,follow",
  metaDescription: "",
  schemaMarkup: '{"@context":"https://schema.org"}',
};

const inputClass =
  "w-full rounded-xl border border-[#DCE5F0] bg-white px-3.5 py-3 text-sm text-[#10234F] outline-none transition placeholder:text-[#9AA8B9] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-2 block text-xs font-bold text-[#263B60]";

const cardClass =
  "rounded-2xl border border-[#E5EBF3] bg-white p-5 shadow-[0_5px_22px_rgba(16,35,79,0.035)] sm:p-6 lg:p-7";

const acceptedImages = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

function SectionHeader({ icon: Icon, title, description, number }) {
  return (
    <div className="mb-6 flex items-start gap-3 border-b border-[#EDF1F6] pb-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
        <Icon size={20} />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-extrabold text-[#10234F] sm:text-lg">
            {title}
          </h2>

          <span className="rounded-md bg-[#F1F5FA] px-2 py-0.5 text-[10px] font-bold text-[#71839B]">
            {number}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-[#8290A4]">
          {description}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  rows,
  hint,
  className = "",
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
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#71839B]">
          <Info
            size={13}
            className="mt-0.5 shrink-0 text-[#20B8D3]"
          />
          {hint}
        </p>
      )}
    </div>
  );
}

function EditorButton({ icon: Icon, title, onClick, active = false }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
        active
          ? "bg-[#FFF0E4] text-[#FF6814]"
          : "text-[#526984] hover:bg-[#FFF0E4] hover:text-[#FF6814]"
      }`}
    >
      <Icon size={16} />
    </button>
  );
}

function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  minHeight = 160,
}) {
  const editorRef = useRef(null);
  const [sourceMode, setSourceMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const updateContent = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const command = (name, argument) => {
    editorRef.current?.focus();

    // Basic browser rich-text editing.
    // A production CMS can replace this with TinyMCE or Tiptap.
    document.execCommand(name, false, argument);
    updateContent();
  };

  const toggleSource = () => {
    setPreviewMode(false);
    setSourceMode((previous) => !previous);
  };

  const togglePreview = () => {
    setSourceMode(false);
    setPreviewMode((previous) => !previous);
  };

  const wordCount = value
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const toolbar = [
    { icon: Undo2, title: "Undo", action: "undo" },
    { icon: Redo2, title: "Redo", action: "redo" },
    { icon: Bold, title: "Bold", action: "bold" },
    { icon: Italic, title: "Italic", action: "italic" },
    { icon: Underline, title: "Underline", action: "underline" },
    {
      icon: Strikethrough,
      title: "Strikethrough",
      action: "strikeThrough",
    },
    {
      icon: AlignLeft,
      title: "Align left",
      action: "justifyLeft",
    },
    {
      icon: AlignCenter,
      title: "Align center",
      action: "justifyCenter",
    },
    {
      icon: AlignRight,
      title: "Align right",
      action: "justifyRight",
    },
    {
      icon: AlignJustify,
      title: "Justify",
      action: "justifyFull",
    },
    {
      icon: List,
      title: "Bullet list",
      action: "insertUnorderedList",
    },
    {
      icon: ListOrdered,
      title: "Numbered list",
      action: "insertOrderedList",
    },
  ];

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="overflow-hidden rounded-xl border border-[#DCE5F0] bg-white transition focus-within:border-[#FF812B]">
        {/* Menu labels */}
        <div className="flex flex-wrap gap-1 border-b border-[#E5EBF3] bg-[#FAFBFD] px-3 py-2">
          {["File", "Edit", "View", "Insert", "Format", "Tools", "Table"].map(
            (menu) => (
              <span
                key={menu}
                className="rounded-md px-2 py-1 text-[11px] font-medium text-[#526984]"
              >
                {menu}
              </span>
            )
          )}
        </div>

        {/* Formatting toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#E5EBF3] p-2">
          {toolbar.map((tool) => (
            <EditorButton
              key={tool.action}
              icon={tool.icon}
              title={tool.title}
              onClick={() => command(tool.action)}
            />
          ))}

          <span className="mx-1 h-6 w-px bg-[#E5EBF3]" />

          <EditorButton
            icon={Link2}
            title="Insert link"
            onClick={() => {
              const url = window.prompt("Enter URL");
              if (url) command("createLink", url);
            }}
          />

          <EditorButton
            icon={Code2}
            title="HTML source"
            onClick={toggleSource}
            active={sourceMode}
          />

          <EditorButton
            icon={Eye}
            title="Preview"
            onClick={togglePreview}
            active={previewMode}
          />
        </div>

        {previewMode ? (
          <div
            className="prose prose-sm max-w-none overflow-auto p-4 text-[#263B60]"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : sourceMode ? (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full resize-y border-0 bg-white p-4 font-mono text-xs leading-6 text-[#263B60] outline-none"
            style={{ minHeight }}
          />
        ) : (
          <div
            key={sourceMode ? "source" : "visual"}
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            onInput={updateContent}
            className="billomax-editor w-full overflow-auto p-4 text-sm leading-7 text-[#263B60] outline-none"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}

        <div className="flex items-center justify-between border-t border-[#E5EBF3] bg-[#FAFBFD] px-3 py-2 text-[10px] text-[#8290A4]">
          <span>
            {sourceMode
              ? "HTML SOURCE"
              : previewMode
              ? "PREVIEW"
              : "HTML SUPPORTED"}
          </span>
          <span>{wordCount} WORDS</span>
        </div>
      </div>
    </div>
  );
}

function UploadField({
  label,
  description,
  multiple = false,
  onChange,
  selectedNames = [],
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="rounded-xl border border-dashed border-[#C9D5E5] bg-[#FAFBFD] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#2878D4]">
              {multiple ? <Images size={19} /> : <Upload size={19} />}
            </div>

            <div>
              <p className="text-sm font-semibold text-[#263B60]">
                {selectedNames.length
                  ? selectedNames.join(", ")
                  : multiple
                  ? "Choose gallery images"
                  : "Choose file"}
              </p>
              <p className="mt-1 text-xs text-[#8290A4]">
                {multiple
                  ? "Multiple images supported"
                  : "Select a file from your device"}
              </p>
            </div>
          </div>

          <input
            type="file"
            multiple={multiple}
            accept=".jpg,.jpeg,.png,.webp,.gif,.svg,image/*"
            onChange={onChange}
            className="block w-full text-xs text-[#526984] file:mr-3 file:rounded-lg file:border-0 file:bg-[#FFF0E4] file:px-4 file:py-2.5 file:font-bold file:text-[#C65A18] hover:file:bg-[#FFE3D0] sm:w-auto"
          />
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-[#71839B]">
        {description}
      </p>
    </div>
  );
}

export default function AddBlogPost({
  onSave,
  onCancel,
  initialData,
  isEditing = false,
  cancelLabel = "Cancel",
}) {
  const [form, setForm] = useState(() => ({
    ...INITIAL_DATA,
    ...initialData,
  }));
  const [htmlFile, setHtmlFile] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const htmlInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const setValue = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setMessage("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "slug") setSlugEdited(true);

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && !slugEdited
        ? { slug: slugify(value) }
        : {}),
    }));

    setMessage("");
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const validateImage = (file) => {
    if (!acceptedImages.includes(file.type)) {
      return `${file.name}: unsupported image format.`;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return `${file.name}: image exceeds the 4MB limit.`;
    }

    return null;
  };

  const handleFeaturedImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFeaturedImage(null);
      return;
    }

    const error = validateImage(file);

    if (error) {
      showMessage(error, "error");
      event.target.value = "";
      return;
    }

    setFeaturedImage(file);
    setMessage("");
  };

  const handleGalleryImages = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      setGalleryImages([]);
      return;
    }

    const error = files.map(validateImage).find(Boolean);

    if (error) {
      showMessage(error, "error");
      event.target.value = "";
      return;
    }

    setGalleryImages(files);
    setMessage("");
  };

  const handleHtmlUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/\.html?$/i.test(file.name)) {
      showMessage("Please upload an HTML or HTM file.", "error");
      event.target.value = "";
      return;
    }

    try {
      const html = await file.text();

      setHtmlFile(file);
      setValue("content", html);

      showMessage(
        "HTML file imported. Review the blog content before saving."
      );
    } catch {
      showMessage("Unable to read the selected HTML file.", "error");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    setForm(INITIAL_DATA);
    setHtmlFile(null);
    setFeaturedImage(null);
    setGalleryImages([]);
    setSlugEdited(false);
    setMessage("");

    if (htmlInputRef.current) htmlInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      showMessage("Blog post title is required.", "error");
      return;
    }

    if (!form.slug.trim()) {
      showMessage("Blog post slug is required.", "error");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      showMessage(
        "Slug must contain lowercase letters, numbers, or hyphens.",
        "error"
      );
      return;
    }

    if (form.schemaMarkup.trim()) {
      try {
        JSON.parse(form.schemaMarkup);
      } catch {
        showMessage("Schema Markup must contain valid JSON.", "error");
        return;
      }
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      htmlFile,
      featuredImage,
      galleryImages,
    };

    if (!onSave) {
      console.log("Blog post payload:", payload);
      showMessage(
        "Form validated. Connect the onSave prop to your existing blog API to save the post."
      );
      return;
    }

    try {
      setSaving(true);
      await onSave(payload);
      showMessage("Blog post saved successfully.");
    } catch (error) {
      showMessage(
        error?.message || "Unable to save the blog post.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <style>{`
        .billomax-editor:empty::before {
          content: attr(data-placeholder);
          color: #9AA8B9;
          pointer-events: none;
        }
        .billomax-editor ul {
          list-style: disc;
          padding-left: 1.5rem;
        }
        .billomax-editor ol {
          list-style: decimal;
          padding-left: 1.5rem;
        }
        .billomax-editor a {
          color: #1675E8;
          text-decoration: underline;
        }
      `}</style>

      <div className="mx-auto max-w-[1440px]">
        {/* PAGE HEADER */}
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F47721]">
              <span className="h-2 w-2 rounded-full bg-[#FF812B]" />
              Website Management
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
              {isEditing ? "Edit Blog Post" : "Create Blog Post"}
            </h1>

            <p className="mt-1.5 text-sm text-[#71839B]">
              Create, format, publish, and optimize your website blog content.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#526984] transition hover:bg-[#F8FAFD]"
          >
            <ArrowLeft size={16} />
            {cancelLabel}
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 01 — BLOG CONTENT */}
          <section className={cardClass}>
            <SectionHeader
              icon={BookOpen}
              title="Blog Content"
              description="Add your blog title, slug, excerpt, and main article content."
              number="01"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <FormField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog post title"
                required
                className="md:col-span-2"
              />

              <FormField
                label="Slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="auto-from-title"
              />
            </div>

            <div className="mt-6 space-y-6">
              <RichTextEditor
                label="Excerpt"
                value={form.excerpt}
                onChange={(value) => setValue("excerpt", value)}
                placeholder="Short summary for blog cards and meta descriptions"
                minHeight={150}
              />

              <RichTextEditor
                label="Content"
                value={form.content}
                onChange={(value) => setValue("content", value)}
                placeholder="HTML is allowed"
                minHeight={280}
              />
            </div>
          </section>

          {/* SECTION 02 — MEDIA AND PUBLISHING */}
          <section className={cardClass}>
            <SectionHeader
              icon={Images}
              title="Media & Publishing"
              description="Upload HTML content, featured images, gallery images, and configure publication details."
              number="02"
            />

            {/* DIRECT HTML BLOG UPLOAD */}
            <div>
              <label className={labelClass}>
                Upload Direct HTML Blog Post
              </label>

              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#C9D5E5] bg-[#FAFBFD] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#2878D4]">
                    <FileCode2 size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#263B60]">
                      {htmlFile
                        ? htmlFile.name
                        : "Import HTML blog content"}
                    </p>
                    <p className="mt-1 text-xs text-[#8290A4]">
                      HTML and HTM files supported
                    </p>
                  </div>
                </div>

                <input
                  ref={htmlInputRef}
                  type="file"
                  accept=".html,.htm,text/html"
                  onChange={handleHtmlUpload}
                  className="block w-full text-xs text-[#526984] file:mr-3 file:rounded-lg file:border-0 file:bg-[#FFF0E4] file:px-4 file:py-2.5 file:font-bold file:text-[#C65A18] hover:file:bg-[#FFE3D0] sm:w-auto"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-[#71839B]">
                Already have a ready-made SEO HTML file for this blog post?
                Upload it here to replace the content above. You can still
                review and edit it before saving.
              </p>
            </div>

            {/* PUBLISHING DETAILS */}
            <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <FormField
                label="Featured Image URL"
                name="featuredImageUrl"
                value={form.featuredImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                hint="You can paste a direct image URL here or upload an image below."
                className="xl:col-span-2"
              />

              <FormField
                label="Published At"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleChange}
                placeholder="DD-MM-YYYY HH:mm"
              />

              <FormField
                label="Menu Order"
                name="menuOrder"
                value={form.menuOrder}
                onChange={handleChange}
                type="number"
                placeholder="0"
              />
            </div>

            {/* FEATURED IMAGE */}
            <div className="mt-6">
              <UploadField
                label="Upload Featured Image"
                selectedNames={
                  featuredImage ? [featuredImage.name] : []
                }
                onChange={handleFeaturedImage}
                description="Supported: JPG, PNG, WEBP, GIF, SVG. Max 4MB."
              />
            </div>

            {/* GALLERY IMAGES */}
            <div className="mt-6">
              <UploadField
                label="Gallery Images"
                multiple
                selectedNames={galleryImages.map((file) => file.name)}
                onChange={handleGalleryImages}
                description="Add one or more extra images for this post. They'll be shown in a gallery on the blog details page. Supported: JPG, PNG, WEBP, GIF. Max 4MB each."
              />

              {galleryImages.length > 0 && (
                <div className="mt-3 rounded-xl border border-[#DCE5F0] bg-[#FAFBFD] px-4 py-3 text-xs font-semibold text-[#526984]">
                  {galleryImages.length} gallery image
                  {galleryImages.length !== 1 ? "s" : ""} selected
                </div>
              )}
            </div>

            {/* PUBLISH CHECKBOX */}
            <div className="mt-6 rounded-xl border border-[#E5EBF3] bg-[#FCFDFE] p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="publishImmediately"
                  checked={form.publishImmediately}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-[#FF6814]"
                />

                <span>
                  <span className="block text-sm font-bold text-[#263B60]">
                    Publish immediately
                  </span>
                  <span className="mt-1 block text-xs text-[#8290A4]">
                    Publish this blog post as soon as it is saved.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* SECTION 03 — SEO SETTINGS */}
          <section className={cardClass}>
            <SectionHeader
              icon={Search}
              title="SEO Settings"
              description="Manage search metadata, canonical URLs, indexing directives, and structured data."
              number="03"
            />

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <FormField
                label="Meta Title"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="Enter meta title"
              />

              <FormField
                label="Canonical URL"
                name="canonicalUrl"
                value={form.canonicalUrl}
                onChange={handleChange}
                placeholder="https://billomax.com/blogs/post-slug"
              />

              <FormField
                label="Meta Keywords"
                name="metaKeywords"
                value={form.metaKeywords}
                onChange={handleChange}
                placeholder="keyword 1, keyword 2"
              />

              <FormField
                label="Robots Directives"
                name="robotsDirectives"
                value={form.robotsDirectives}
                onChange={handleChange}
                placeholder="index,follow"
              />

              <FormField
                label="Meta Description"
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="Enter the meta description"
                rows={4}
                className="md:col-span-2"
              />

              <FormField
                label="Schema Markup (JSON-LD)"
                name="schemaMarkup"
                value={form.schemaMarkup}
                onChange={handleChange}
                placeholder='{"@context":"https://schema.org"}'
                rows={7}
                className="md:col-span-2"
              />
            </div>

            {/* SEARCH RESULT PREVIEW */}
            <div className="mt-6 rounded-xl border border-[#E5EBF3] bg-[#FAFBFD] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#263B60]">
                <Globe size={16} className="text-[#FF6814]" />
                Search Result Preview
              </div>

              <p className="text-base font-semibold text-[#1769C2]">
                {form.metaTitle ||
                  form.title ||
                  "Your blog post title"}
              </p>

              <p className="mt-1 break-all text-xs text-emerald-700">
                {form.canonicalUrl ||
                  `https://billomax.com/blogs/${
                    form.slug || "post-slug"
                  }`}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#71839B]">
                {form.metaDescription ||
                  "Your blog post meta description will appear here."}
              </p>
            </div>
          </section>

          {/* VALIDATION / SAVE STATUS */}
          {message && (
            <div
              role={messageType === "error" ? "alert" : "status"}
              className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {messageType === "error" ? (
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                />
              ) : (
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0"
                />
              )}
              {message}
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col-reverse justify-between gap-4 rounded-2xl border border-[#E5EBF3] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
            <p className="text-xs leading-5 text-[#8290A4]">
              Review your blog content and SEO settings before saving.
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
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-7 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Update Blog Post"
                    : "Save Blog Post"}
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#E5EBF3] py-4 text-center text-[11px] text-[#8290A4] sm:flex-row sm:text-left">
          <span>
            Billomax — Your Trusted Partner in Billing &amp; Invoicing
          </span>
          <span>Website Management · Create Blog Post</span>
        </footer>
      </div>
    </main>
  );
}
