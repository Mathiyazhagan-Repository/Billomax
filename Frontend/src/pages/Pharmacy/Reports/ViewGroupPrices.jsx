
import React from "react";
import { ArrowLeft, X, IndianRupee, Tag, Store } from "lucide-react";

const groupPrices = [
  { name: "varuna clinic", price: 0 },
  { name: "bavana clinic", price: 0 },
];

export default function ViewGroupPrices({
  isOpen = true,
  onClose = () => {},
  productName = "Dolo 650",
  defaultSellingPrice = 13.75,
  prices = groupPrices,
  fullPage = false,
}) {
  if (!isOpen) return null;

  const formatCurrency = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div
      className={
        fullPage
          ? "min-h-screen bg-[#FFFAF5] px-4 py-5 sm:px-6 sm:py-6"
          : "fixed inset-0 z-[100] flex items-center justify-center bg-[#10234F]/65 p-4 backdrop-blur-[2px]"
      }
    >
      {fullPage && (
        <div className="mx-auto mb-4 w-full max-w-3xl">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D7DFEA] bg-white px-4 py-2.5 text-sm font-semibold text-[#10234F] transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Stock Report
          </button>
        </div>
      )}
      <section
        role={fullPage ? undefined : "dialog"}
        aria-modal={fullPage ? undefined : "true"}
        aria-labelledby="group-prices-title"
        className={`w-full overflow-hidden rounded-2xl border border-[#E6EDF5] bg-white ${
          fullPage
            ? "mx-auto max-w-3xl shadow-[0_8px_28px_rgba(16,35,79,0.07)]"
            : "max-w-xl shadow-[0_24px_70px_rgba(16,35,79,0.25)]"
        }`}
      >
        {/* Modal header */}
        <header className="flex items-center justify-between border-b border-[#E6EDF5] bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
              <Tag size={19} />
            </div>

            <div className="min-w-0">
              <h2
                id="group-prices-title"
                className="truncate text-lg font-bold text-[#10234F]"
              >
                {productName}
              </h2>
              <p className="mt-0.5 text-xs text-[#7A8799]">
                Product pricing details
              </p>
            </div>
          </div>

          {!fullPage && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close group prices"
              className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#10234F]"
            >
              <X size={20} />
            </button>
          )}
        </header>

        {/* Modal content */}
        <div className="p-5 sm:p-6">
          <div className="mb-5 rounded-xl border border-[#F4D8C5] bg-[#FFFAF5] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8799]">
              Default selling price (including tax)
            </p>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-[#FF6814]">
                <IndianRupee size={19} />
              </div>
              <p className="text-2xl font-extrabold text-[#10234F]">
                {formatCurrency(defaultSellingPrice)}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E6EDF5]">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-3 text-sm font-bold text-white">
              <Store size={17} />
              Group Prices
              <span className="ml-auto rounded-full bg-white/20 px-2.5 py-1 text-xs">
                {prices.length} groups
              </span>
            </div>

            <div className="divide-y divide-[#E6EDF5]">
              {prices.map((group, index) => (
                <div
                  key={`${group.name}-${index}`}
                  className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-orange-50/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                      {group.name.charAt(0).toUpperCase()}
                    </span>

                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-[#10234F]">
                        {group.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#7A8799]">
                        Group-specific selling price
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-lg border border-[#DDE6F0] bg-[#F5F8FC] px-3 py-2 text-sm font-bold tabular-nums text-[#10234F]">
                    {formatCurrency(group.price)}
                  </span>
                </div>
              ))}

              {prices.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <Tag className="mx-auto mb-2 text-slate-300" size={28} />
                  <p className="text-sm font-semibold text-[#10234F]">
                    No group prices available
                  </p>
                  <p className="mt-1 text-xs text-[#7A8799]">
                    No group-specific pricing records were provided.
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-[#7A8799]">
            Prices are displayed as configured for this product. No pricing
            values are modified by this dialog.
          </p>
        </div>

        {/* Modal footer */}
        {!fullPage && (
          <footer className="flex justify-end border-t border-[#E6EDF5] bg-[#FCFDFE] px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#10234F] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1B3671] focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Close
            </button>
          </footer>
        )}
      </section>
    </div>
  );
}
