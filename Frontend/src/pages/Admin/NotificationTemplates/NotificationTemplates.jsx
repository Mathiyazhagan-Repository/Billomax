
import React, { useRef, useState, useEffect } from "react";
import {
  BellRing, Mail, MessageSquare, MessageCircle, Save, Check, Copy,
  ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter,
  AlignRight, List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Eye, RotateCcw, Info, FileText, Send, Settings2, ClipboardCheck,
} from "lucide-react";

const customerTabs = [
  "New Sale",
  "Payment Received",
  "Payment Reminder",
  "New Booking",
  "New Quotation",
];

const supplierTabs = [
  "New Order",
  "Payment Paid",
  "Items Received",
  "Items Pending",
  "Purchase Order",
];

const customTags = (prefix, count) =>
  Array.from({ length: count }, (_, i) => `{${prefix}_${i + 1}}`);

const ledgerTags = [
  "{business_name}", "{business_logo}", "{balance_due}", "{contact_name}",
  ...customTags("contact_custom_field", 10),
];

const customerTags = [
  "{business_name}", "{business_logo}", "{invoice_number}", "{invoice_url}",
  "{total_amount}", "{paid_amount}", "{received_amount}", "{due_amount}",
  "{cumulative_due_amount}", "{due_date}", "{quote_url}",
  "{location_name}", "{location_address}", "{location_email}", "{location_phone}",
  ...customTags("location_custom_field", 4),
  "{contact_name}", ...customTags("contact_custom_field", 10),
  ...customTags("sell_custom_field", 4),
  ...customTags("shipping_custom_field", 5),
  "{table}", "{start_time}", "{end_time}", "{service_staff}",
  "{correspondent}", "{location}",
];

const supplierTags = [
  "{business_name}", "{business_logo}", "{order_ref_number}",
  "{payment_ref_number}", "{paid_amount}", "{total_amount}",
  "{received_amount}", "{due_amount}", "{location_name}",
  "{location_address}", "{location_email}", "{location_phone}",
  ...customTags("location_custom_field", 4),
  ...customTags("purchase_custom_field", 4),
  "{contact_business_name}", "{contact_name}",
  ...customTags("contact_custom_field", 10),
  ...customTags("shipping_custom_field", 5),
];

const blankTemplate = () => ({
  subject: "",
  cc: "",
  bcc: "",
  email: "",
  sms: "",
  whatsapp: "",
  autoEmail: false,
  autoSms: false,
  autoWhatsapp: false,
});

const initialTemplates = {
  ledger: {
    ...blankTemplate(),
  },
  customer: {
    "New Sale": {
      ...blankTemplate(),
      subject: "Thank you from {business_name}",
      email:
        "Dear {contact_name},\n\nYour invoice number is {invoice_number}\nTotal amount: {total_amount}\nPaid amount: {received_amount}\n\nThank you for shopping with us.\n\n{business_logo}",
      sms: "Dear {contact_name}, Thank you for shopping with us. {business_name}",
    },
    "Payment Received": {
      ...blankTemplate(),
      subject: "Payment Received, from {business_name}",
      email:
        "Dear {contact_name},\n\nWe have received a payment of {received_amount}\n\n{business_logo}",
      sms:
        "Dear {contact_name}, We have received a payment of {received_amount}. {business_name}",
    },
    "Payment Reminder": {
      ...blankTemplate(),
      subject: "Payment Reminder, from {business_name}",
      email:
        "Dear {contact_name},\n\nThis is to remind you that you have pending payment of {due_amount}. Kindly pay it as soon as possible.\n\n{business_logo}",
      sms:
        "Dear {contact_name}, You have pending payment of {due_amount}. Kindly pay it as soon as possible. {business_name}",
    },
    "New Booking": {
      ...blankTemplate(),
      subject: "Booking Confirmed - {business_name}",
      email:
        "Dear {contact_name},\n\nYour booking is confirmed\n\nDate: {start_time} to {end_time}\nTable: {table}\nLocation: {location}",
      sms:
        "Dear {contact_name}, Your booking is confirmed. Date: {start_time} to {end_time}, Table: {table}, Location: {location}",
    },
    "New Quotation": {
      ...blankTemplate(),
      subject: "Thank you from {business_name}",
      email:
        "Dear {contact_name},\n\nYour quotation number is {invoice_number}\nTotal amount: {total_amount}\n\nThank you for shopping with us.\n\n{business_logo}",
      sms:
        "Dear {contact_name}, Thank you for shopping with us. {business_name}",
    },
  },
  supplier: {
    "New Order": {
      ...blankTemplate(),
      subject: "New Order, from {business_name}",
      email:
        "Dear {contact_name},\n\nWe have a new order with reference number {order_ref_number}. Kindly process the products as soon as possible.\n\n{business_name}\n{business_logo}",
      sms:
        "Dear {contact_name}, We have a new order with reference number {order_ref_number}. Kindly process the products as soon as possible. {business_name}",
    },
    "Payment Paid": {
      ...blankTemplate(),
      subject: "Payment Paid, from {business_name}",
      email:
        "Dear {contact_name},\n\nWe have paid amount {paid_amount} against invoice number {order_ref_number}.\nKindly note it down.\n\n{business_name}\n{business_logo}",
      sms:
        "We have paid amount {paid_amount} against invoice number {order_ref_number}. Kindly note it down. {business_name}",
    },
    "Items Received": {
      ...blankTemplate(),
      subject: "Items received, from {business_name}",
      email:
        "Dear {contact_name},\n\nWe have received all items from invoice reference number {order_ref_number}. Thank you for processing it.\n\n{business_name}\n{business_logo}",
      sms:
        "We have received all items from invoice reference number {order_ref_number}. Thank you for processing it. {business_name}",
    },
    "Items Pending": {
      ...blankTemplate(),
      subject: "Items Pending, from {business_name}",
      email:
        "Dear {contact_name},\n\nThis is to remind you that we have not yet received some items from invoice reference number {order_ref_number}. Please process it as soon as possible.\n\n{business_name}\n{business_logo}",
      sms:
        "This is to remind you that we have not yet received some items from invoice reference number {order_ref_number}. Please process it as soon as possible. {business_name}",
    },
    "Purchase Order": {
      ...blankTemplate(),
      subject: "New Purchase Order, from {business_name}",
      email:
        "Dear {contact_name},\n\nWe have a new purchase order with reference number {order_ref_number}. The respective invoice is attached here with.\n\n{business_logo}",
      sms:
        "We have a new purchase order with reference number {order_ref_number}. {business_name}",
    },
  },
};

const inputClass =
  "w-full rounded-xl border border-[#E6EDF5] bg-white px-3.5 py-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] hover:border-[#C7D3E1] focus:border-[#FF812B] focus:ring-2 focus:ring-orange-100";

const labelClass = "mb-2 block text-xs font-bold tracking-wide text-[#526D8D]";

const cardClass =
  "overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_6px_24px_rgba(16,35,79,0.05)]";

function SectionHeading({ icon: Icon, title, description, badge }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
          <Icon size={21} />
        </span>
        <div>
          <h2 className="text-lg font-extrabold text-[#10234F]">{title}</h2>
          <p className="mt-1 text-sm text-[#577B9F]">{description}</p>
        </div>
      </div>
      {badge && (
        <span className="w-fit rounded-full border border-[#F8EBDD] bg-[#FFF1E5] px-3 py-1.5 text-xs font-bold text-[#F04A13]">
          {badge}
        </span>
      )}
    </div>
  );
}

function TemplateTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="border-b border-[#F2E8DE] bg-[#FFFCF8]">
      <div className="flex gap-1 overflow-x-auto px-3 pt-2">
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`relative shrink-0 rounded-t-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-white text-[#F04A13]"
                  : "text-[#577B9F] hover:bg-[#FFF1E5] hover:text-[#10234F]"
              }`}
            >
              {tab}
              {active && (
                <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[#FF711A]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AvailableTags({ tags, onInsert }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState("");

  const copyTag = async (tag) => {
    onInsert(tag);
    setCopied(tag);
    try {
      await navigator.clipboard?.writeText(tag);
    } catch {
      // Tag insertion still works if clipboard permissions are unavailable.
    }
  };

  const shown = expanded ? tags : tags.slice(0, 12);

  return (
    <section className="rounded-xl border border-[#F2E8DE] bg-[#FFFCF8] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-[#10234F]">Available Tags</h3>
          <p className="mt-1 text-xs leading-5 text-[#577B9F]">
            Click a tag to insert it into the currently selected message field.
          </p>
        </div>
        <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-[#577B9F] ring-1 ring-[#E8EDF4]">
          {tags.length} tags
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {shown.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => copyTag(tag)}
            title={`Insert ${tag}`}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition ${
              copied === tag
                ? "border-[#CDEEDB] bg-[#E7F7EE] text-[#16824B]"
                : "border-[#E8EDF4] bg-white text-[#45617F] hover:border-[#FFB681] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
            }`}
          >
            {copied === tag ? <Check size={12} /> : <Copy size={12} />}
            {tag}
          </button>
        ))}
      </div>

      {tags.length > 12 && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#F04A13] hover:underline"
        >
          {expanded ? "Show fewer tags" : `View all ${tags.length} tags`}
          <ChevronDown size={14} className={expanded ? "rotate-180" : ""} />
        </button>
      )}
    </section>
  );
}

function RichTextEditor({ value, onChange, onFocus }) {
  const editorRef = useRef(null);
  const [activeTool, setActiveTool] = useState("");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const runCommand = (command, argument = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    setActiveTool(command);
    onChange(editorRef.current?.innerHTML || "");
  };

  const tools = [
    ["Bold", Bold, "bold"],
    ["Italic", Italic, "italic"],
    ["Underline", Underline, "underline"],
    ["Align left", AlignLeft, "justifyLeft"],
    ["Align center", AlignCenter, "justifyCenter"],
    ["Align right", AlignRight, "justifyRight"],
    ["Bulleted list", List, "insertUnorderedList"],
    ["Numbered list", ListOrdered, "insertOrderedList"],
  ];

  const insertLink = () => {
    const url = window.prompt("Enter URL");
    if (url) runCommand("createLink", url);
  };

  const insertImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) runCommand("insertImage", url);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#E6EDF5] bg-white transition focus-within:border-[#FF812B] focus-within:ring-2 focus-within:ring-orange-100">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#F2E8DE] bg-[#FFFCF8] px-3 py-2">
        <span className="mr-2 hidden text-xs font-bold text-[#577B9F] sm:inline">
          Format
        </span>
        {tools.map(([label, Icon, command]) => (
          <button
            key={command}
            type="button"
            title={label}
            aria-label={label}
            onClick={() => runCommand(command)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              activeTool === command
                ? "bg-[#FFE9D9] text-[#F04A13]"
                : "text-[#577B9F] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
            }`}
          >
            <Icon size={16} />
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-[#E8EDF4]" />
        <button
          type="button"
          title="Insert link"
          onClick={insertLink}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#577B9F] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          title="Insert image"
          onClick={insertImage}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#577B9F] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          title="Clear formatting"
          onClick={() => runCommand("removeFormat")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#577B9F] hover:bg-[#FFF1E5] hover:text-[#F04A13]"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Email body"
        aria-multiline="true"
        onFocus={onFocus}
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        className="min-h-[260px] whitespace-pre-wrap break-words px-4 py-4 text-sm leading-7 text-[#253858] outline-none sm:min-h-[320px] sm:px-5"
      />

      <div className="flex items-center justify-between border-t border-[#F2E8DE] bg-[#FFFCF8] px-4 py-2 text-[11px] text-[#8798AD]">
        <span>HTML email content</span>
        <span>
          {(editorRef.current?.innerText || "").trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
}

function TemplateEditor({ template, onUpdate, tags, showAutomation = true }) {
  const [activeField, setActiveField] = useState("email");
  const [preview, setPreview] = useState(false);

  const update = (key, value) => onUpdate({ ...template, [key]: value });

  const insertTag = (tag) => {
    if (activeField === "subject") {
      update("subject", `${template.subject || ""}${template.subject ? " " : ""}${tag}`);
    } else if (["email", "sms", "whatsapp"].includes(activeField)) {
      const current = template[activeField] || "";
      update(activeField, `${current}${current && !current.endsWith(" ") ? " " : ""}${tag}`);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-7">
      <AvailableTags tags={tags} onInsert={insertTag} />

      <div className="grid grid-cols-1 gap-5">
        <label>
          <span className={labelClass}>Email Subject</span>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8798AD]"
            />
            <input
              value={template.subject}
              onFocus={() => setActiveField("subject")}
              onChange={(event) => update("subject", event.target.value)}
              placeholder="Email Subject"
              className={`${inputClass} pl-10`}
            />
          </div>
        </label>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label>
            <span className={labelClass}>CC</span>
            <input
              value={template.cc}
              onFocus={() => setActiveField("cc")}
              onChange={(event) => update("cc", event.target.value)}
              placeholder="CC"
              className={inputClass}
            />
          </label>
          <label>
            <span className={labelClass}>BCC</span>
            <input
              value={template.bcc}
              onFocus={() => setActiveField("bcc")}
              onChange={(event) => update("bcc", event.target.value)}
              placeholder="BCC"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FF] text-[#3478F6]">
              <Mail size={17} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#10234F]">Email Body</h3>
              <p className="mt-0.5 text-xs text-[#577B9F]">
                Format your email and personalize it with available tags.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPreview((value) => !value)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] px-3 py-2 text-xs font-bold text-[#19366F] hover:bg-[#FFF1E5]"
          >
            <Eye size={15} />
            {preview ? "Edit email" : "Preview email"}
          </button>
        </div>

        {preview ? (
          <div className="min-h-[260px] rounded-xl border border-[#F2E8DE] bg-[#FFFCF8] p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8798AD]">
              Email preview
            </p>
            <div className="mb-4 border-b border-[#F2E8DE] pb-3">
              <p className="text-xs text-[#577B9F]">Subject</p>
              <p className="mt-1 font-semibold text-[#19366F]">
                {template.subject || "No subject"}
              </p>
            </div>
            <div
              className="prose prose-sm max-w-none break-words text-[#19366F]"
              dangerouslySetInnerHTML={{
                __html: template.email || "No email body",
              }}
            />
          </div>
        ) : (
          <RichTextEditor
            value={template.email}
            onFocus={() => setActiveField("email")}
            onChange={(value) => update("email", value)}
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E7F7EE] text-[#16824B]">
            <MessageSquare size={17} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-[#10234F]">SMS Body</h3>
            <p className="mt-0.5 text-xs text-[#577B9F]">
              Short message content for SMS notifications.
            </p>
          </div>
        </div>
        <textarea
          value={template.sms}
          onFocus={() => setActiveField("sms")}
          onChange={(event) => update("sms", event.target.value)}
          placeholder="SMS Body"
          rows={4}
          className={`${inputClass} min-h-[120px] resize-y leading-6`}
        />
        <div className="text-right text-xs text-[#8798AD]">
          {template.sms.length} characters
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E7F7EE] text-[#16824B]">
            <MessageCircle size={17} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-[#10234F]">WhatsApp Text</h3>
            <p className="mt-0.5 text-xs text-[#577B9F]">
              Message content for WhatsApp notifications.
            </p>
          </div>
        </div>
        <textarea
          value={template.whatsapp}
          onFocus={() => setActiveField("whatsapp")}
          onChange={(event) => update("whatsapp", event.target.value)}
          placeholder="WhatsApp Text"
          rows={4}
          className={`${inputClass} min-h-[120px] resize-y leading-6`}
        />
      </section>

      {showAutomation && (
        <section className="rounded-xl border border-[#F2E8DE] bg-[#FFFCF8] p-4 sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
              <Send size={17} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#10234F]">
                Automatic Notifications
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#577B9F]">
                Choose which channels should send this notification automatically.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["autoEmail", "Auto Send Email", Mail],
              ["autoSms", "Auto Send SMS", MessageSquare],
              ["autoWhatsapp", "Auto send WhatsApp notification", MessageCircle],
            ].map(([key, label, Icon]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-medium transition ${
                  template[key]
                    ? "border-[#FFCFAC] bg-[#FFF1E5] text-[#19366F]"
                    : "border-[#E8EDF4] bg-white text-[#577B9F] hover:border-[#C7D3E1]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={Boolean(template[key])}
                  onChange={(event) => update(key, event.target.checked)}
                  className="h-4 w-4 accent-[#FF711A]"
                />
                <Icon size={16} className="shrink-0 text-[#F04A13]" />
                {label}
              </label>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#EAF3FF] px-3 py-3 text-xs leading-5 text-[#275A9D]">
            <Info size={15} className="mt-0.5 shrink-0" />
            <p>
              Enabling a checkbox stores your preference in this template. Actual
              automatic delivery depends on your application's notification
              backend and messaging integration.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default function NotificationTemplates({ onSave, initialData }) {
  const [activeCustomerTab, setActiveCustomerTab] = useState("New Sale");
  const [activeSupplierTab, setActiveSupplierTab] = useState("New Order");
  const [templates, setTemplates] = useState(() => ({
    ...initialTemplates,
    ...initialData,
    ledger: {
      ...initialTemplates.ledger,
      ...(initialData?.ledger || {}),
    },
    customer: Object.fromEntries(
      customerTabs.map((tab) => [
        tab,
        {
          ...initialTemplates.customer[tab],
          ...(initialData?.customer?.[tab] || {}),
        },
      ])
    ),
    supplier: Object.fromEntries(
      supplierTabs.map((tab) => [
        tab,
        {
          ...initialTemplates.supplier[tab],
          ...(initialData?.supplier?.[tab] || {}),
        },
      ])
    ),
  }));
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const updateTemplate = (group, tab, updated) => {
    setTemplates((current) => {
      if (group === "ledger") {
        return { ...current, ledger: updated };
      }

      return {
        ...current,
        [group]: {
          ...current[group],
          [tab]: updated,
        },
      };
    });
    setSavedMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage("");

    try {
      if (onSave) {
        await onSave(templates);
        setSavedMessage("Notification templates saved successfully.");
      } else {
        setSavedMessage(
          "Changes are ready. Connect your save API to persist them."
        );
      }
    } catch (error) {
      setSavedMessage(error?.message || "Unable to save notification templates.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen min-w-0 flex-1 bg-[#FFFAF5] px-4 py-5 font-sans text-[#10234F] sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <BellRing size={14} />
              <span className="text-[11px] font-extrabold">BILLOMAX · SETTINGS</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#10234F] sm:text-3xl">
              Notification Templates
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#577B9F]">
              Manage email, SMS, and WhatsApp templates for customer and supplier
              transactions.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#F2E8DE] bg-white px-4 py-3 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFE9D9] text-[#F04A13]">
              <Settings2 size={20} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-[#10234F]">Notification settings</p>
              <p className="mt-1 text-xs text-[#577B9F]">Email · SMS · WhatsApp</p>
            </div>
          </div>
        </header>

        {/* Ledger notification */}
        <section className={cardClass}>
          <div className="border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-7">
            <SectionHeading
              icon={FileText}
              title="Ledger Notifications"
              description="Configure the statement and ledger notification template."
              badge="Ledger"
            />
          </div>
          <TemplateTabs
            tabs={["Send Ledger"]}
            activeTab="Send Ledger"
            onChange={() => {}}
          />
          <TemplateEditor
            template={templates.ledger}
            onUpdate={(updated) => updateTemplate("ledger", null, updated)}
            tags={ledgerTags}
            showAutomation={false}
          />
        </section>

        {/* All five customer templates */}
        <section className={cardClass}>
          <div className="border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-7">
            <SectionHeading
              icon={BellRing}
              title="Customer Notifications"
              description="Configure messages triggered by customer transactions."
              badge="5 templates"
            />
          </div>
          <TemplateTabs
            tabs={customerTabs}
            activeTab={activeCustomerTab}
            onChange={setActiveCustomerTab}
          />
          <TemplateEditor
            key={`customer-${activeCustomerTab}`}
            template={templates.customer[activeCustomerTab]}
            onUpdate={(updated) =>
              updateTemplate("customer", activeCustomerTab, updated)
            }
            tags={customerTags}
          />
        </section>

        {/* All five supplier templates */}
        <section className={cardClass}>
          <div className="border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-7">
            <SectionHeading
              icon={Mail}
              title="Supplier Notifications"
              description="Configure order, payment, and goods-receipt messages for suppliers."
              badge="5 templates"
            />
          </div>
          <TemplateTabs
            tabs={supplierTabs}
            activeTab={activeSupplierTab}
            onChange={setActiveSupplierTab}
          />
          <TemplateEditor
            key={`supplier-${activeSupplierTab}`}
            template={templates.supplier[activeSupplierTab]}
            onUpdate={(updated) =>
              updateTemplate("supplier", activeSupplierTab, updated)
            }
            tags={supplierTags}
          />

          <div className="mx-4 mb-5 flex items-start gap-3 rounded-xl border border-[#F8EBDD] bg-[#FFF7EF] px-4 py-3.5 sm:mx-7">
            <Info size={17} className="mt-0.5 shrink-0 text-[#F04A13]" />
            <p className="text-xs leading-5 text-[#8C542E]">
              Business logo will not work in SMS. Use supported text tags for SMS
              messages.
            </p>
          </div>
        </section>

        {/* Persistent save action */}
        <section className="sticky bottom-0 z-20 -mx-4 border-t border-[#F2E8DE] bg-[#FFFAF5]/95 px-4 py-4 backdrop-blur-md sm:-mx-5 sm:px-5">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-5 text-sm">
              {savedMessage && (
                <p
                  role="status"
                  className={`flex items-center gap-2 ${
                    savedMessage.toLowerCase().includes("unable")
                      ? "text-[#C43D32]"
                      : "text-[#16824B]"
                  }`}
                >
                  {savedMessage.toLowerCase().includes("unable") ? (
                    <Info size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                  {savedMessage}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-7 py-3 text-sm font-bold text-white shadow-[0_5px_14px_rgba(255,113,26,0.20)] transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-wait disabled:opacity-70"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Templates"}
            </button>
          </div>
        </section>

        <footer className="py-2 text-center text-xs text-[#8798AD]">
          Billomax · Billing &amp; Invoicing
        </footer>
      </div>
    </main>
  );
}
