
import React from "react";
import { X, UserRound, Globe, CalendarDays, IndianRupee } from "lucide-react";

export default function ClientDetailsModal({
  isOpen = true,
  onClose = () => {},
  client = {},
}) {
  if (!isOpen) return null;

  const details = [
    { label: "Client Name", value: client.clientName },
    { label: "Client No", value: client.clientNo },
    { label: "Email", value: client.email },
    { label: "Alternate Mob Number", value: client.alternateMobile },
    { label: "Alternate Mob Number 2", value: client.alternateMobile2 },
    { label: "Alternate Mob Number 3", value: client.alternateMobile3 },
    { label: "Project Name", value: client.projectName ?? "Soraship Website" },
    { label: "Domain Name", value: client.domainName ?? "Soraship.com" },
    { label: "Renewal Date", value: client.renewalDate },
    { label: "Renewal Amount", value: client.renewalAmount },
    { label: "GST 18%", value: client.gst },
    { label: "Total", value: client.total },
    { label: "Domain Booked By", value: client.domainBookedBy ?? "Company" },
  ];

  const hasValue = (value) =>
    value !== undefined && value !== null && value !== "";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10234F]/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-details-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E6EDF5] bg-[#FFFAF5] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
              <UserRound size={21} />
            </div>

            <div>
              <h2
                id="client-details-title"
                className="text-lg font-bold text-white"
              >
                Client Details
              </h2>
              <p className="mt-0.5 text-xs text-white/85">
                Client information and renewal details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close client details"
            className="rounded-lg p-2 text-white transition hover:bg-white/15"
          >
            <X size={21} />
          </button>
        </header>

        {/* Details */}
        <div className="overflow-y-auto p-5 sm:p-7">
          <section className="rounded-xl border border-[#E6EDF5] bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-[#EEF1F5] pb-4">
              <UserRound size={18} className="text-[#FF6814]" />
              <h3 className="text-sm font-bold text-[#10234F]">
                Client Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {details.map(({ label, value }) => (
                <div key={label} className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-[#10234F]">
                    {hasValue(value) ? value : "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Renewal Items */}
          <section className="mt-5 rounded-xl border border-[#E6EDF5] bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-[#EEF1F5] pb-4">
              <CalendarDays size={18} className="text-[#FF6814]" />
              <h3 className="text-sm font-bold text-[#10234F]">
                Renewal Items
              </h3>
            </div>

            {Array.isArray(client.renewalItems) &&
            client.renewalItems.length > 0 ? (
              <div className="space-y-3">
                {client.renewalItems.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className="flex flex-col justify-between gap-2 rounded-lg border border-[#EEF1F5] bg-[#FFFAF5] p-3 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#10234F]">
                        {item.name ?? item.description ?? "Renewal item"}
                      </p>
                      {hasValue(item.date) && (
                        <p className="mt-1 text-xs text-slate-500">
                          Date: {item.date}
                        </p>
                      )}
                    </div>

                    {hasValue(item.amount) && (
                      <p className="flex items-center gap-1 text-sm font-bold text-[#FF6814]">
                        <IndianRupee size={14} />
                        {item.amount}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                {hasValue(client.renewalItems)
                  ? client.renewalItems
                  : "No renewal items available."}
              </p>
            )}
          </section>

          {hasValue(client.domainName) && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3">
              <Globe size={17} className="shrink-0 text-[#FF6814]" />
              <p className="break-all text-sm text-[#10234F]">
                Domain: <span className="font-semibold">{client.domainName}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex justify-end border-t border-[#E6EDF5] bg-white px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#10234F] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B3470]"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}
