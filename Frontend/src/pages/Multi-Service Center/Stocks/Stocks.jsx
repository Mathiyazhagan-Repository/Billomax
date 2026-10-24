
import React from "react";
import {
  ArrowUpRight,
  Boxes,
  ClipboardList,
  PackageSearch,
  ArrowLeftRight,
  ChevronRight,
  CircleHelp,
} from "lucide-react";

const stockReports = [
  {
    id: "stock-report",
    title: "Stock Report",
    description: "Stock Report",
    icon: PackageSearch,
    accent: "blue",
    action: "View",
    onClickKey: "stockReport",
  },
  {
    id: "stock-expiry-report",
    title: "Stock Expiry Report",
    description: "Stock Expiry Report",
    icon: ClipboardList,
    accent: "orange",
    action: null,
    note: "lang_v1.not_applicable",
    onClickKey: "stockExpiryReport",
  },
  {
    id: "stock-adjustment",
    title: "Stock Adjustment",
    description: "Stock Adjustment",
    icon: ArrowLeftRight,
    accent: "green",
    action: "View",
    onClickKey: "stockAdjustment",
  },
];

const accents = {
  blue: {
    icon: "bg-[#EAF3FF] text-[#3478F6] ring-[#D8E8FF]",
    button: "bg-[#3478F6] hover:bg-[#2465DF]",
    glow: "bg-[#EAF3FF]",
    label: "text-[#3478F6]",
  },
  orange: {
    icon: "bg-[#FFF1E5] text-[#F04A13] ring-[#F8EBDD]",
    button: "bg-[#FF711A] hover:bg-[#F04A13]",
    glow: "bg-[#FFF1E5]",
    label: "text-[#F04A13]",
  },
  green: {
    icon: "bg-[#EAF8F0] text-[#24804C] ring-[#CDEDDC]",
    button: "bg-[#FF711A] hover:bg-[#F04A13]",
    glow: "bg-[#EAF8F0]",
    label: "text-[#24804C]",
  },
};

function ReportCard({ report, onNavigate }) {
  const Icon = report.icon;
  const theme = accents[report.accent];

  return (
    <article className="group relative flex min-h-[225px] flex-col overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/95 p-5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#FFB37E] hover:shadow-[0_14px_35px_rgba(224,133,65,0.14)] sm:p-6">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${theme.glow} opacity-60 blur-2xl transition group-hover:scale-125`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${theme.icon}`}
        >
          <Icon size={23} strokeWidth={1.9} />
        </span>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F2E8DE] bg-white text-[#8798AD] transition group-hover:border-[#FFB37E] group-hover:text-[#F04A13]">
          <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="relative mt-5">
        <h2 className="text-lg font-extrabold tracking-tight text-[#19366F] sm:text-xl">
          {report.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#577B9F]">
          {report.description}
        </p>
      </div>

      <div className="relative mt-auto pt-5">
        {report.action ? (
          <button
            type="button"
            onClick={() => onNavigate?.(report.onClickKey)}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg ${theme.button} px-4 py-2.5 text-sm font-bold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#FF8A37]/20 focus:ring-offset-2`}
          >
            <Icon size={16} />
            {report.action}
            <ChevronRight size={15} className="ml-1 opacity-80" />
          </button>
        ) : (
          <div className="flex items-start gap-2 rounded-xl border border-[#F8EBDD] bg-[#FFF7EF] px-3 py-2.5">
            <CircleHelp
              size={16}
              className="mt-0.5 shrink-0 text-[#F04A13]"
            />
            <p className="break-words text-xs leading-5 text-[#577B9F]">
              {report.note}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Stocks({ onNavigate }) {
  const handleNavigate = (key) => {
    if (key === "stockReport") {
      onNavigate?.("Stock Report");
      return;
    }

    if (key === "stockAdjustment") {
      onNavigate?.("List Stock Adjustments");
      return;
    }

    onNavigate?.(key);
  };

  return (
    <>
      <main className="min-h-screen bg-[#FFFAF5] px-4 py-4 font-sans text-[#10234F] sm:px-5">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <header>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#FFE9D9] px-3 py-2 text-[#F04A13]">
            <span className="text-[11px] font-extrabold">INVENTORY · STOCK MANAGEMENT</span>
          </div>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="app-page-title text-[#10234F]">
                Stocks
              </h1>
              <p className="app-description mt-1 text-[#577B9F]">
                Manage stock reports, expiry information, and stock adjustments.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#F2E8DE] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#577B9F] shadow-[0_4px_12px_rgba(224,133,65,0.07)]">
              <Boxes size={17} className="text-[#F04A13]" />
              Stock management
            </div>
          </div>
        </header>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-[#FF711A]" />
            <div>
              <h2 className="app-section-title text-[#10234F]">
                Stock reports & actions
              </h2>
              <p className="app-description mt-1 text-[#577B9F]">
                Select a section to continue.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stockReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </section>

        <footer className="mt-8 border-t border-[#F2E8DE] pt-5 text-center text-xs text-[#8798AD]">
          Billomax · Inventory management
        </footer>
      </div>
      </main>
    </>
  );
}
