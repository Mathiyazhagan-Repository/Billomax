
import React, { useRef, useState } from "react";
import {
  UploadCloud,
  X,
  FileCode2,
  Image as ImageIcon,
  Link2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ClipboardPaste,
  Upload,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#E5D4BA] bg-white px-3.5 py-3 text-sm text-[#10234F] outline-none transition placeholder:text-[#9BA7B8] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

export default function ImportBlogPost({
  onImport,
  onClose,
  onCancel,
}) {
  const [mode, setMode] = useState("upload");
  const [htmlFile, setHtmlFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const htmlInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const closeDialog = () => {
    if (onClose) return onClose();
    if (onCancel) return onCancel();
  };

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleHtmlFile = async (event) => {
    const file = event.target.files?.[0];
    setError("");
    setSuccess("");

    if (!file) {
      setHtmlFile(null);
      return;
    }

    if (!/\.html?$/i.test(file.name)) {
      setError("Only .html and .htm files are accepted. JSON files are not supported.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The HTML file must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    try {
      const content = await file.text();
      setHtmlFile(file);
      setHtmlContent(content);
      setSuccess("HTML file loaded and ready to import.");
    } catch {
      setError("Unable to read this file. Please try another HTML file.");
    }
  };

  const handleFeaturedImage = (event) => {
    const file = event.target.files?.[0];
    setError("");
    setSuccess("");

    if (!file) {
      setFeaturedImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("The featured image must be 4 MB or smaller.");
      event.target.value = "";
      return;
    }

    setFeaturedImage(file);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
  };

  const handleImport = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "upload" && !htmlFile) {
      setError("Please select an HTML file to import.");
      return;
    }

    if (mode === "paste" && !htmlContent.trim()) {
      setError("Please paste your HTML content before importing.");
      return;
    }

    const payload = {
      mode,
      file: mode === "upload" ? htmlFile : null,
      html: htmlContent,
      featuredImage,
      slug: slug.trim() || "",
    };

    if (!onImport) {
      setError(
        "Import is ready, but no onImport handler is connected. Connect your existing blog import API to save the imported post."
      );
      return;
    }

    try {
      setLoading(true);
      const result = await onImport(payload);

      setSuccess("Blog post imported successfully.");

      if (result !== false) {
        // The parent can close the modal after completing its own workflow.
      }
    } catch (err) {
      setError(err?.message || "Import failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] px-4 py-8 font-sans text-[#10234F] sm:px-6">
      <div className="mx-auto max-w-[960px]">
        {/* Page heading */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#F47721]">
            <span className="h-2 w-2 rounded-full bg-[#FF812B]" />
            Website Management
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
            Import Blog Posts
          </h1>

          <p className="mt-1.5 text-sm text-[#71839B]">
            Import existing HTML content into your Billomax website.
          </p>
        </div>

        {/* Import card */}
        <section className="mx-auto max-w-[640px] rounded-2xl border border-[#F0DEC3] bg-white p-5 shadow-[0_8px_30px_rgba(16,35,79,0.06)] sm:p-7">
          {/* Card heading */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E4] text-[#FF6814]">
                <UploadCloud size={23} />
              </div>

              <h2 className="text-xl font-extrabold text-[#10234F]">
                Import blog post
              </h2>

              <p className="mt-2 max-w-[470px] text-sm leading-6 text-[#71839B]">
                Upload or paste an HTML page and we&apos;ll create a draft post
                from it — title, content and slug are picked up automatically.
                JSON files are not accepted here.
              </p>
            </div>

            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close import form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5D4BA] bg-white text-[#71839B] transition hover:border-[#FF812B] hover:bg-[#FFF0E4] hover:text-[#FF6814]"
            >
              <X size={19} />
            </button>
          </div>

          <form onSubmit={handleImport} className="space-y-5">
            {/* Upload / Paste tabs */}
            <div className="inline-flex rounded-xl bg-[#FFF4E5] p-1">
              <button
                type="button"
                onClick={() => handleModeChange("upload")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                  mode === "upload"
                    ? "bg-[#C07828] text-white shadow-sm"
                    : "text-[#806F55] hover:bg-white/70"
                }`}
              >
                <Upload size={14} />
                Upload file
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("paste")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                  mode === "paste"
                    ? "bg-[#C07828] text-white shadow-sm"
                    : "text-[#806F55] hover:bg-white/70"
                }`}
              >
                <ClipboardPaste size={14} />
                Paste HTML
              </button>
            </div>

            {/* HTML file upload */}
            {mode === "upload" && (
              <div>
                <label className="mb-2 block text-xs font-bold text-[#263B60]">
                  HTML file
                </label>

                <div className="rounded-xl border border-[#E5D4BA] bg-white p-3 transition focus-within:border-[#FF812B]">
                  <input
                    ref={htmlInputRef}
                    type="file"
                    accept=".html,.htm,text/html"
                    onChange={handleHtmlFile}
                    className="block w-full text-xs text-[#526984] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F0E7D8] file:px-3 file:py-2 file:font-semibold file:text-[#6F5738] hover:file:bg-[#E9D8BE]"
                  />

                  {htmlFile && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F8FAFD] p-2.5">
                      <FileCode2
                        size={17}
                        className="shrink-0 text-[#C07828]"
                      />

                      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#263B60]">
                        {htmlFile.name}
                      </span>

                      <span className="shrink-0 text-[10px] text-[#8290A4]">
                        {(htmlFile.size / 1024).toFixed(0)} KB
                      </span>

                      <button
                        type="button"
                        aria-label="Remove HTML file"
                        onClick={() => {
                          setHtmlFile(null);
                          setHtmlContent("");
                          if (htmlInputRef.current) {
                            htmlInputRef.current.value = "";
                          }
                        }}
                        className="text-[#8290A4] hover:text-red-500"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-2 text-xs text-[#8290A4]">
                  Only .html / .htm files, up to 10 MB.
                </p>
              </div>
            )}

            {/* Paste HTML */}
            {mode === "paste" && (
              <div>
                <label
                  htmlFor="htmlContent"
                  className="mb-2 block text-xs font-bold text-[#263B60]"
                >
                  Paste HTML content
                </label>

                <textarea
                  id="htmlContent"
                  value={htmlContent}
                  onChange={(event) => {
                    setHtmlContent(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Paste your complete HTML document here..."
                  rows={9}
                  className={`${inputClass} resize-y font-mono text-xs leading-5`}
                />

                <p className="mt-2 text-xs text-[#8290A4]">
                  Paste the HTML document, including its title and body.
                </p>
              </div>
            )}

            {/* Featured image */}
            <div>
              <label className="mb-2 block text-xs font-bold text-[#263B60]">
                Featured image{" "}
                <span className="font-normal text-[#8290A4]">
                  (optional)
                </span>
              </label>

              <div className="rounded-xl border border-[#E5D4BA] bg-white p-3">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImage}
                  className="block w-full text-xs text-[#526984] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F0E7D8] file:px-3 file:py-2 file:font-semibold file:text-[#6F5738] hover:file:bg-[#E9D8BE]"
                />

                {featuredImage && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F8FAFD] p-2.5">
                    <ImageIcon
                      size={17}
                      className="shrink-0 text-[#C07828]"
                    />

                    <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#263B60]">
                      {featuredImage.name}
                    </span>

                    <button
                      type="button"
                      aria-label="Remove featured image"
                      onClick={() => {
                        setFeaturedImage(null);
                        if (imageInputRef.current) {
                          imageInputRef.current.value = "";
                        }
                      }}
                      className="text-[#8290A4] hover:text-red-500"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs text-[#8290A4]">
                Optional image for the imported blog post. Maximum 4 MB.
              </p>
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-xs font-bold text-[#263B60]"
              >
                Slug{" "}
                <span className="font-normal text-[#8290A4]">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <Link2
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA7B8]"
                />

                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(event) => {
                    setSlug(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Leave blank to generate one from the title"
                  className={`${inputClass} pl-10`}
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-[#8290A4]">
                Leave blank to generate a slug automatically from the imported
                page title.
              </p>
            </div>

            {/* Error / success */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#F0DEC3] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDialog}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#E5D4BA] bg-white px-6 text-sm font-bold text-[#6F5738] transition hover:bg-[#FFF8ED]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C07828] to-[#D18A38] px-7 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UploadCloud size={16} />
                {loading ? "Importing..." : "Import"}
              </button>
            </div>
          </form>
        </section>

        <footer className="mt-6 border-t border-[#E5EBF3] pt-4 text-center text-[11px] text-[#8290A4]">
          Billomax — Your Trusted Partner in Billing &amp; Invoicing
        </footer>
      </div>
    </main>
  );
}
