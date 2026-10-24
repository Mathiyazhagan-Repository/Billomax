
import React, { useMemo, useState } from "react";
import {
  Sparkles,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Tag,
  Percent,
  IndianRupee,
  Save,
  X,
  ChevronDown,
  RotateCcw,
  Info,
  WandSparkles,
} from "lucide-react";
import AIOfferRules from "./AIOfferRules.jsx";

const initialSuggestions = [
  {
    id: 13,
    category: "Cross sell",
    title: "Cross-Sell Offer: Azithromycin with Amoxicillin",
    description: "Buy Amoxicillin and get 15% off on Azithromycin.",
    discount: 15,
    discountType: "percentage",
    status: "Pending",
    coupon: "-",
  },
  {
    id: 12,
    category: "Occasional",
    title: "Occasional Offer on Dolo 650",
    description: "Save $5 on Dolo 650 for a limited time.",
    discount: 5,
    discountType: "fixed",
    status: "Pending",
    coupon: "-",
  },
  {
    id: 11,
    category: "Regular",
    title: "Regular Offer on Amoxicillin",
    description: "Get 10% off on your next purchase of Amoxicillin.",
    discount: 10,
    discountType: "percentage",
    status: "Pending",
    coupon: "-",
  },
  {
    id: 10,
    category: "Cross sell",
    title: "Cross-Sell Offer: Antibiotic Bundle",
    description: "Purchase Azithromycin and receive $5 off on Amoxicillin.",
    discount: 5,
    discountType: "fixed",
    status: "Pending",
    coupon: "-",
  },
  {
    id: 9,
    category: "Occasional",
    title: "Occasional Offer: Pain Relief Combo",
    description: "Buy Dolo 650 and get 20% off on Budesonide.",
    discount: 20,
    discountType: "percentage",
    status: "Pending",
    coupon: "-",
  },
  {
    id: 8,
    category: "Regular",
    title: "Regular Offer: Amoxicillin Discount",
    description: "Get a 10% discount on Amoxicillin purchases.",
    discount: 10,
    discountType: "percentage",
    status: "Pending",
    coupon: "-",
  },
  {
    id: 7,
    category: "Cross sell",
    title: "Cross-Sell Offer on Budesonide",
    description: "Buy Amoxicillin and get 15% off on Budesonide.",
    discount: 15,
    discountType: "percentage",
    status: "Pending",
    coupon: "-",
  },
  {
    id: 6,
    category: "Occasional",
    title: "Occasional Offer on Dolo 650",
    description: "Save $5 on Dolo 650 for a limited time.",
    discount: 5,
    discountType: "fixed",
    status: "Pending",
    coupon: "-",
  },
  {
    id: 5,
    category: "Regular",
    title: "Regular Offer on Amoxicillin",
    description: "Get a 10% discount on your next purchase of Amoxicillin.",
    discount: 10,
    discountType: "percentage",
    status: "Pending",
    coupon: "-",
  },
];

const inputClass =
  "h-10 w-full min-w-0 rounded-lg border border-[#E8EDF4] bg-white px-3 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10";

const labelClass = "mb-1.5 block text-xs font-semibold text-[#526D8D]";

function StatusBadge({ status }) {
  const styles = {
    Pending: "border-[#FFE3AD] bg-[#FFF7E8] text-[#B8750C]",
    Approved: "border-[#CDEEDB] bg-[#E7F7EE] text-[#16824B]",
    Rejected: "border-[#FFD9D2] bg-[#FFF0ED] text-[#C43D32]",
  };

  const icons = {
    Pending: Clock3,
    Approved: CheckCircle2,
    Rejected: XCircle,
  };

  const Icon = icons[status] || Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        styles[status] || styles.Pending
      }`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function CategoryBadge({ category }) {
  const styles = {
    "Cross sell": "bg-[#EAF3FF] text-[#3478F6] border-[#D8E8FF]",
    Occasional: "bg-[#FFF1E5] text-[#D96A19] border-[#F8EBDD]",
    Regular: "bg-[#F2ECFF] text-[#7152B8] border-[#E5DAFF]",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${
        styles[category] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {category}
    </span>
  );
}

function ActionButton({
  children,
  icon: Icon,
  variant = "secondary",
  onClick,
  disabled = false,
}) {
  const styles = {
    primary:
      "border-transparent bg-[#FF711A] text-white shadow-[0_4px_10px_rgba(255,113,26,0.18)] hover:bg-[#F04A13]",
    secondary:
      "border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5] hover:text-[#F04A13]",
    success:
      "border-transparent bg-[#16824B] text-white hover:bg-[#116B3D]",
    danger:
      "border-[#FFD9D2] bg-white text-[#C43D32] hover:border-[#EBA79D] hover:bg-[#FFF0ED]",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

function SuggestionRow({
  suggestion,
  onUpdate,
  onApprove,
  onReject,
  busy,
}) {
  return (
    <tr className="group align-top transition hover:bg-[#FFF7EF]">
      <td className="whitespace-nowrap px-4 py-5 text-xs font-semibold text-[#577B9F]">
        #{suggestion.id}
      </td>

      <td className="px-4 py-5">
        <CategoryBadge category={suggestion.category} />
      </td>

      <td className="min-w-[230px] max-w-[340px] px-4 py-5">
        <p className="text-sm font-bold leading-5 text-[#19366F]">
          {suggestion.title}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-[#577B9F]">
          {suggestion.description}
        </p>
      </td>

      <td className="whitespace-nowrap px-4 py-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold tabular-nums text-[#19366F]">
            {suggestion.discountType === "percentage"
              ? `${suggestion.discount.toFixed(2)}%`
              : `${suggestion.discount.toFixed(2)}`}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8798AD]">
            {suggestion.discountType === "percentage"
              ? "Percentage"
              : "Fixed amount"}
          </span>
        </div>
      </td>

      <td className="px-4 py-5">
        <StatusBadge status={suggestion.status} />
      </td>

      <td className="px-4 py-5 text-sm text-[#577B9F]">
        {suggestion.coupon || "-"}
      </td>

      <td className="min-w-[330px] px-4 py-4">
        <div className="space-y-3 rounded-xl border border-[#F2E8DE] bg-[#FFFEFC] p-3.5 shadow-sm transition group-hover:border-[#FFCFAC]">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1.5fr)_100px_120px]">
            <label>
              <span className={`${labelClass} sr-only`}>Offer title</span>
              <input
                aria-label={`Edit title for offer ${suggestion.id}`}
                value={suggestion.title}
                onChange={(event) =>
                  onUpdate(suggestion.id, "title", event.target.value)
                }
                className="h-9 w-full min-w-0 rounded-lg border border-[#E8EDF4] px-2.5 text-xs text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>

            <label>
              <span className={`${labelClass} sr-only`}>Discount value</span>
              <input
                aria-label={`Edit discount for offer ${suggestion.id}`}
                type="number"
                min="0"
                step="0.01"
                value={suggestion.discount}
                onChange={(event) =>
                  onUpdate(
                    suggestion.id,
                    "discount",
                    event.target.value === ""
                      ? ""
                      : Math.max(0, Number(event.target.value))
                  )
                }
                className="h-9 w-full min-w-0 rounded-lg border border-[#E8EDF4] px-2.5 text-xs text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              />
            </label>

            <label className="relative">
              <span className={`${labelClass} sr-only`}>Discount type</span>
              <select
                aria-label={`Edit discount type for offer ${suggestion.id}`}
                value={suggestion.discountType}
                onChange={(event) =>
                  onUpdate(suggestion.id, "discountType", event.target.value)
                }
                className="h-9 w-full appearance-none rounded-lg border border-[#E8EDF4] bg-white px-2.5 pr-7 text-xs text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8798AD]"
              />
            </label>
          </div>

          <textarea
            aria-label={`Edit description for offer ${suggestion.id}`}
            value={suggestion.description}
            onChange={(event) =>
              onUpdate(suggestion.id, "description", event.target.value)
            }
            rows={2}
            className="w-full resize-y rounded-lg border border-[#E8EDF4] px-3 py-2.5 text-xs leading-5 text-[#526D8D] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-[#8798AD]">
              Offer ID: {suggestion.id}
            </span>
            <div className="flex flex-wrap gap-2">
              <ActionButton
                variant="success"
                icon={CheckCircle2}
                disabled={busy || suggestion.status === "Approved"}
                onClick={() => onApprove(suggestion.id)}
              >
                Approve
              </ActionButton>
              <ActionButton
                variant="danger"
                icon={XCircle}
                disabled={busy || suggestion.status === "Rejected"}
                onClick={() => onReject(suggestion.id)}
              >
                Reject
              </ActionButton>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function AIOfferSuggestions({
  initialData = initialSuggestions,
  panelName = "Pharmacy",
  onGenerate,
  onApprove,
  onReject,
  onSave,
}) {
  const [suggestions, setSuggestions] = useState(initialData);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showRules, setShowRules] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const pendingCount = suggestions.filter(
    (item) => item.status === "Pending"
  ).length;

  const filteredSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suggestions.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.id,
          item.title,
          item.description,
          item.category,
          item.coupon,
        ].some((value) => String(value ?? "").toLowerCase().includes(query));

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [suggestions, search, categoryFilter, statusFilter]);

  const updateSuggestion = (id, key, value) => {
    setSuggestions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
    setMessage("");
  };

  const handleDecision = async (id, status) => {
    const suggestion = suggestions.find((item) => item.id === id);
    if (!suggestion) return;

    try {
      const callback = status === "Approved" ? onApprove : onReject;

      if (callback) {
        await callback(suggestion);
      }

      setSuggestions((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item))
      );

      setMessage(
        callback
          ? `Offer #${id} ${status.toLowerCase()} successfully.`
          : `Offer #${id} marked ${status.toLowerCase()} locally. Connect your API to persist this decision.`
      );
      setMessageType(callback ? "success" : "info");
    } catch (error) {
      setMessage(error?.message || `Could not ${status.toLowerCase()} offer.`);
      setMessageType("error");
    }
  };

  const handleGenerate = async () => {
    if (!onGenerate) {
      setMessage(
        "Connect onGenerate to your AI suggestion service. Existing offers have not been changed."
      );
      setMessageType("info");
      return;
    }

    setGenerating(true);
    setMessage("");

    try {
      const result = await onGenerate({ panelName });

      if (Array.isArray(result)) {
        setSuggestions(result);
        setMessage(`${result.length} suggestions loaded successfully.`);
        setMessageType("success");
      } else {
        setMessage(
          "Generation completed. Refresh the list from your existing service if needed."
        );
        setMessageType("success");
      }
    } catch (error) {
      setMessage(error?.message || "Unable to generate suggestions.");
      setMessageType("error");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) {
      setMessage(
        "Changes are currently local only. Connect onSave to persist the updated offers."
      );
      setMessageType("info");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await onSave(suggestions);
      setMessage("Offer suggestions saved successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error?.message || "Unable to save offer suggestions.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
  };

  const cardClass =
    "rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]";

  if (showRules) {
    return <AIOfferRules onBack={() => setShowRules(false)} />;
  }

  return (
    <main className="min-h-screen min-w-0 flex-1 bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1700px] space-y-5">
        {/* Page header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
              <Sparkles size={14} />
              <span className="text-[11px] font-extrabold">PHARMACY · AI OFFERS</span>
            </div>
            <h1 className="app-page-title text-[#10234F]">
              AI Offer Suggestions
            </h1>
            <p className="app-description mt-1 max-w-2xl text-[#577B9F]">
              Review, customize, and approve AI-generated promotional offers
              for your business.
            </p>
          </div>

          <ActionButton
            variant="secondary"
            icon={SlidersHorizontal}
            onClick={() => setShowRules(true)}
          >
            Edit Rules
          </ActionButton>
        </header>

        {/* Generate panel */}
        <section className={`${cardClass} overflow-hidden`}>
          <div className="h-1 bg-gradient-to-r from-[#FF711A] via-[#FFB36E] to-[#3478F6]" />
          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <WandSparkles size={23} />
              </span>
              <div>
                <h2 className="app-section-title text-[#10234F]">
                  Generate Suggestions
                </h2>
                <p className="app-description mt-1.5 max-w-xl text-[#577B9F]">
                  Discover cross-sell, regular, and occasional offers for
                  your selected business panel.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-[#FFFCF8] px-3 py-2 text-xs text-[#577B9F]">
                  <span className="h-2 w-2 rounded-full bg-[#16824B]" />
                  Active panel:
                  <span className="font-bold text-[#19366F]">{panelName}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <ActionButton
                variant="primary"
                icon={Sparkles}
                disabled={generating}
                onClick={handleGenerate}
              >
                {generating ? "Generating..." : "Generate AI Suggestions"}
              </ActionButton>
              <ActionButton
                icon={Save}
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Saving..." : "Save Changes"}
              </ActionButton>
            </div>
          </div>
        </section>

        {/* Message */}
        {message && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              messageType === "error"
                ? "border-[#FFD9D2] bg-[#FFF0ED] text-[#C43D32]"
                : messageType === "success"
                  ? "border-[#CDEEDB] bg-[#E7F7EE] text-[#16824B]"
                  : "border-[#D8E8FF] bg-[#F3F8FF] text-[#275A9D]"
            }`}
          >
            {messageType === "error" ? (
              <XCircle size={17} className="mt-0.5 shrink-0" />
            ) : messageType === "success" ? (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            ) : (
              <Info size={17} className="mt-0.5 shrink-0" />
            )}
            <p>{message}</p>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              className="ml-auto shrink-0 rounded p-1 opacity-70 hover:opacity-100"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Suggestions table */}
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex flex-col gap-4 border-b border-[#F2E8DE] bg-gradient-to-r from-[#FFF7EF] via-white to-white px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="app-section-title text-[#10234F]">
                  Suggestions
                </h2>
                <span className="rounded-full border border-[#F8EBDD] bg-[#FFF1E5] px-2.5 py-1 text-xs font-bold text-[#F04A13]">
                  {filteredSuggestions.length} offers
                </span>
              </div>
              <p className="mt-1.5 text-xs text-[#577B9F]">
                Review offer details and take action on each suggestion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-lg border border-[#FFE3AD] bg-[#FFF7E8] px-3 py-2 text-xs font-bold text-[#B8750C]">
                <Clock3 size={14} />
                {pendingCount} pending
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-[#E8EDF4] bg-white px-3 py-2 text-xs font-semibold text-[#577B9F]">
                <Tag size={14} />
                {suggestions.length} total
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 border-b border-[#F2E8DE] bg-[#FFFCF8] p-4 sm:p-5 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1 xl:max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, description, category, ID..."
                aria-label="Search offer suggestions"
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
              <label className="relative">
                <span className={`${labelClass} sr-only`}>Category filter</span>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className={`${inputClass} appearance-none pr-9 xl:w-44`}
                >
                  <option value="All">All categories</option>
                  <option value="Cross sell">Cross sell</option>
                  <option value="Occasional">Occasional</option>
                  <option value="Regular">Regular</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                />
              </label>

              <label className="relative">
                <span className={`${labelClass} sr-only`}>Status filter</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={`${inputClass} appearance-none pr-9 xl:w-40`}
                >
                  <option value="All">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8798AD]"
                />
              </label>

              <ActionButton icon={RotateCcw} onClick={resetFilters}>
                Reset
              </ActionButton>
            </div>
          </div>

          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#F2E8DE] bg-[#FFF7EF]">
                  {[
                    "ID",
                    "Category",
                    "Offer details",
                    "Discount",
                    "Status",
                    "Coupon",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#526D8D]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F2E8DE]">
                {filteredSuggestions.map((suggestion) => (
                  <SuggestionRow
                    key={suggestion.id}
                    suggestion={suggestion}
                    onUpdate={updateSuggestion}
                    onApprove={(id) => handleDecision(id, "Approved")}
                    onReject={(id) => handleDecision(id, "Rejected")}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredSuggestions.length === 0 && (
            <div className="flex flex-col items-center px-5 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#F04A13]">
                <Search size={23} />
              </span>
              <h3 className="mt-4 text-sm font-bold text-[#10234F]">
                No suggestions found
              </h3>
              <p className="mt-1 text-xs text-[#577B9F]">
                Try another search term or reset your filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-xs font-bold text-[#F04A13] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-[#F2E8DE] bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#577B9F]">
              Showing{" "}
              <span className="font-bold text-[#10234F]">
                {filteredSuggestions.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#10234F]">
                {suggestions.length}
              </span>{" "}
              suggestions
            </p>
            <p className="text-xs text-[#8798AD]">
              Changes are local until saved through your backend.
            </p>
          </div>
        </section>
      </div>

    </main>
  );
}
