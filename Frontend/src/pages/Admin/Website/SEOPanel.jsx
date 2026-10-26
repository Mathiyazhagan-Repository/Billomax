
import React, { useState } from "react";
import {
  Search,
  Globe,
  Settings2,
  Home,
  FileText,
  ShieldCheck,
  Bot,
  Code2,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
  ExternalLink,
} from "lucide-react";

const initialSEOSettings = {
  siteName: "Billomax - Your Trusted Partner in Billing & Invoicing",
  siteTagline: "Smart billing and business software",
  defaultMetaTitle: "Billomax - Your Trusted Partner in Billing & Invoicing",
  canonicalBaseUrl: "https://billomax.com",
  defaultMetaDescription: "",
  defaultMetaKeywords: "",

  homeMetaTitle: "",
  homeMetaKeywords: "",
  homeMetaDescription: "",

  blogIndexMetaTitle: "",
  blogMetaKeywords: "",
  blogIndexMetaDescription: "",

  googleSiteVerification: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  defaultOgImageUrl: "",

  robotsTxt: `User-agent: *
Allow: /
Sitemap: https://billomax.com/sitemap.xml`,

  organizationSchema: "",
  customHeadCode: "",
  customBodyCode: "",
};

const fieldClass =
  "w-full rounded-xl border border-[#F2E8DE] bg-white px-3.5 py-3 text-sm text-[#10234F] placeholder:text-[#8798AD] outline-none transition focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10 disabled:bg-[#FFFCF8]";

const labelClass =
  "mb-1.5 block text-xs font-bold text-[#19366F]";

const sections = [
  { id: "general", label: "Site Defaults", icon: Globe },
  { id: "homepage", label: "Homepage SEO", icon: Home },
  { id: "blog", label: "Blog SEO Defaults", icon: FileText },
  { id: "verification", label: "Verification & Tracking", icon: ShieldCheck },
  { id: "robots", label: "Robots & Sitemap", icon: Bot },
  { id: "schema", label: "Organization Schema", icon: Settings2 },
  { id: "custom-code", label: "Custom Code Injection", icon: Code2 },
];

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
        <Icon size={19} />
      </span>
      <div>
        <h2 className="app-section-title text-[#10234F]">{title}</h2>
        {description && (
          <p className="app-description mt-1 text-[#577B9F]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  hint,
  rows,
  className = "",
}) {
  const Control = rows ? "textarea" : "input";

  return (
    <label className={`block min-w-0 ${className}`}>
      <span className={labelClass}>{label}</span>
      <Control
        name={name}
        type={rows ? undefined : type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck={rows ? false : undefined}
        className={`${fieldClass} ${rows ? "min-h-[100px] resize-y leading-6" : "h-[43px]"}`}
      />
      {hint && (
        <span className="mt-1.5 block text-[11px] leading-4 text-[#577B9F]">
          {hint}
        </span>
      )}
    </label>
  );
}

function PanelCard({ id, title, description, icon, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6"
    >
      <SectionHeading icon={icon} title={title} description={description} />
      {children}
    </section>
  );
}

export default function SEOPanel() {
  const [settings, setSettings] = useState(initialSEOSettings);
  const [savedSettings, setSavedSettings] = useState(initialSEOSettings);
  const [activeSection, setActiveSection] = useState("general");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const updateField = (name, value) => {
    setSettings((current) => ({ ...current, [name]: value }));
    setNotice("");
  };

  const goToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const filteredSections = sections.filter((section) =>
    section.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleSave = (event) => {
    event.preventDefault();
    setSavedSettings({ ...settings });
    setNotice(
      "Settings saved in the current page state. Connect your API to persist them on the server."
    );
  };

  const handleReset = () => {
    if (!window.confirm("Reset all fields to their original values?")) return;
    setSettings({ ...initialSEOSettings });
    setNotice("Fields have been reset to their original values.");
  };

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  return (
    <main className="min-h-0 flex-1 bg-[#FFFAF5] px-3 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1500px]">
        {/* Page header */}
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="app-page-title text-[#10234F]">
              Website SEO Panel
            </p>
            <p className="app-description mt-1.5 max-w-2xl">
              Manage search metadata, website verification, structured data,
              robots.txt, sitemap references, and custom code.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F2E8DE] bg-white px-4 py-2.5 text-xs font-bold text-[#19366F] transition hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
            >
              <RotateCcw size={15} />
              Reset
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById("seo-save-button")?.click()
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF711A] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#F04A13] hover:shadow-md"
            >
              <Save size={15} />
              Save SEO Settings
            </button>
          </div>
        </header>

        {/* Information banner */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#FFD1B0] bg-[#FFF1E5] p-4 sm:p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#B85D0A] shadow-sm">
            <Info size={18} />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[#19366F]">
              SEO and code configuration
            </p>
            <p className="app-description mt-1 text-[#577B9F]">
              Blog and page body editors use rich text. SEO fields like meta
              description, robots.txt, schema, and custom code stay plain
              text/code so search tags and markup do not break.
            </p>
          </div>
        </div>

        {/* Section navigation */}
        <div className="mb-6 rounded-2xl border border-[#F8EBDD] bg-white/95 p-3 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="mb-3 flex items-center gap-2 px-1">
            <Settings2 size={16} className="text-[#F04A13]" />
            <h2 className="text-xs font-extrabold text-[#19366F]">
              SEO Configuration Sections
            </h2>
          </div>

          <label className="relative mb-3 block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a settings section..."
              className={`${fieldClass} h-10 pl-9 text-xs`}
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              const selected = activeSection === section.id;

              return (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => goToSection(section.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                    selected
                      ? "bg-[#FFE9D9] text-[#B85D0A] ring-1 ring-[#FFD1B0]"
                      : "bg-[#FFFCF8] text-[#577B9F] hover:bg-[#FFF1E5]"
                  }`}
                >
                  <Icon size={15} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {notice && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-[#CBE9D1] bg-[#EAF7ED] px-4 py-3 text-xs leading-5 text-[#218838]">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="ml-auto text-[#218838]"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Site defaults */}
          <PanelCard
            id="general"
            icon={Globe}
            title="Site Defaults"
            description="Default website identity, metadata, and canonical URL."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Site Name"
                name="siteName"
                value={settings.siteName}
                onChange={updateField}
              />
              <Field
                label="Site Tagline"
                name="siteTagline"
                value={settings.siteTagline}
                onChange={updateField}
              />
              <Field
                label="Default Meta Title"
                name="defaultMetaTitle"
                value={settings.defaultMetaTitle}
                onChange={updateField}
              />
              <Field
                label="Canonical Base URL"
                name="canonicalBaseUrl"
                value={settings.canonicalBaseUrl}
                onChange={updateField}
                placeholder="https://example.com"
                type="url"
              />
              <Field
                label="Default Meta Description"
                name="defaultMetaDescription"
                value={settings.defaultMetaDescription}
                onChange={updateField}
                rows={3}
                className="md:col-span-2"
              />
              <Field
                label="Default Meta Keywords"
                name="defaultMetaKeywords"
                value={settings.defaultMetaKeywords}
                onChange={updateField}
                rows={2}
                className="md:col-span-2"
              />
            </div>
          </PanelCard>

          {/* Homepage SEO */}
          <PanelCard
            id="homepage"
            icon={Home}
            title="Homepage SEO"
            description="Metadata used for the main Billomax homepage."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Home Meta Title"
                name="homeMetaTitle"
                value={settings.homeMetaTitle}
                onChange={updateField}
              />
              <Field
                label="Home Meta Keywords"
                name="homeMetaKeywords"
                value={settings.homeMetaKeywords}
                onChange={updateField}
              />
              <Field
                label="Home Meta Description"
                name="homeMetaDescription"
                value={settings.homeMetaDescription}
                onChange={updateField}
                rows={3}
                className="md:col-span-2"
              />
            </div>
          </PanelCard>

          {/* Blog SEO defaults */}
          <PanelCard
            id="blog"
            icon={FileText}
            title="Blog SEO Defaults"
            description="Default search metadata for the blog index and blog listings."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Blog Index Meta Title"
                name="blogIndexMetaTitle"
                value={settings.blogIndexMetaTitle}
                onChange={updateField}
              />
              <Field
                label="Blog Meta Keywords"
                name="blogMetaKeywords"
                value={settings.blogMetaKeywords}
                onChange={updateField}
              />
              <Field
                label="Blog Index Meta Description"
                name="blogIndexMetaDescription"
                value={settings.blogIndexMetaDescription}
                onChange={updateField}
                rows={3}
                className="md:col-span-2"
              />
            </div>
          </PanelCard>

          {/* Verification */}
          <PanelCard
            id="verification"
            icon={ShieldCheck}
            title="Verification and Tracking"
            description="Connect search verification, analytics, tag management, and social sharing imagery."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field
                label="Google Site Verification"
                name="googleSiteVerification"
                value={settings.googleSiteVerification}
                onChange={updateField}
                placeholder="Verification token"
              />
              <Field
                label="Google Analytics Measurement ID"
                name="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={updateField}
                placeholder="G-XXXXXXXXXX"
              />
              <Field
                label="Google Tag Manager ID"
                name="googleTagManagerId"
                value={settings.googleTagManagerId}
                onChange={updateField}
                placeholder="GTM-XXXXXXX"
              />
              <Field
                label="Default OG Image URL"
                name="defaultOgImageUrl"
                value={settings.defaultOgImageUrl}
                onChange={updateField}
                placeholder="https://billomax.com/image.png"
                type="url"
                className="md:col-span-2 xl:col-span-3"
              />
            </div>
          </PanelCard>

          {/* Robots and sitemap */}
          <PanelCard
            id="robots"
            icon={Bot}
            title="Robots and Sitemap"
            description="Control crawler instructions and identify the public sitemap endpoint."
          >
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <a
                href="https://billomax.com/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-[#F2E8DE] bg-[#FFFCF8] p-3 transition hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
              >
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-[#577B9F]">
                    Public endpoint
                  </span>
                  <span className="mt-1 block text-xs font-bold text-[#4276B5]">
                    https://billomax.com/robots.txt
                  </span>
                </div>
                <ExternalLink size={15} className="shrink-0 text-[#577B9F]" />
              </a>

              <a
                href="https://billomax.com/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-[#F2E8DE] bg-[#FFFCF8] p-3 transition hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
              >
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-[#577B9F]">
                    Public endpoint
                  </span>
                  <span className="mt-1 block text-xs font-bold text-[#4276B5]">
                    https://billomax.com/sitemap.xml
                  </span>
                </div>
                <ExternalLink size={15} className="shrink-0 text-[#577B9F]" />
              </a>
            </div>

            <Field
              label="robots.txt Content"
              name="robotsTxt"
              value={settings.robotsTxt}
              onChange={updateField}
              rows={6}
              hint="Plain text only. Keep crawler directives and sitemap URLs valid."
            />
          </PanelCard>

          {/* Organization schema */}
          <PanelCard
            id="schema"
            icon={Code2}
            title="Organization Schema (JSON-LD)"
            description="Add structured organization data to help search engines understand your business."
          >
            <Field
              label="Organization Schema (JSON-LD)"
              name="organizationSchema"
              value={settings.organizationSchema}
              onChange={updateField}
              rows={7}
              placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Organization"\n}'}
              hint="Enter valid JSON-LD. This field is intentionally left blank because no schema content was visible in the reference."
            />
          </PanelCard>

          {/* Custom code */}
          <PanelCard
            id="custom-code"
            icon={Code2}
            title="Custom Code Injection"
            description="Add custom code for advanced integrations. Only trusted, reviewed code should be added here."
          >
            <div className="space-y-4">
              <Field
                label="Custom Head Code"
                name="customHeadCode"
                value={settings.customHeadCode}
                onChange={updateField}
                rows={7}
                placeholder="<!-- Custom code placed inside the document head -->"
              />
              <Field
                label="Custom Body Code"
                name="customBodyCode"
                value={settings.customBodyCode}
                onChange={updateField}
                rows={7}
                placeholder="<!-- Custom code placed in the document body -->"
              />
            </div>
          </PanelCard>

          {/* Save footer */}
          <div className="sticky bottom-3 z-20 rounded-2xl border border-[#F8EBDD] bg-white/95 p-3 shadow-[0_8px_30px_rgba(224,133,65,0.12)] backdrop-blur sm:p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-[#577B9F]">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    hasChanges ? "bg-[#FF711A]" : "bg-[#218838]"
                  }`}
                />
                {hasChanges
                  ? "You have unsaved changes."
                  : "No unsaved changes since the last local save."}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F2E8DE] bg-white px-4 py-2.5 text-xs font-bold text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5]"
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
                <button
                  id="seo-save-button"
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF711A] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#F04A13] hover:shadow-md"
                >
                  <Save size={15} />
                  Save SEO Settings
                </button>
              </div>
            </div>
          </div>
        </form>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#F2E8DE] py-4 text-center text-[11px] text-[#577B9F] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span>Website Admin · SEO Configuration</span>
        </footer>
      </div>
    </main>
  );
}
