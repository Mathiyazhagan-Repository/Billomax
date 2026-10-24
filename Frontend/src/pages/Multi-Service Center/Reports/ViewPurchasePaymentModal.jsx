
import React from "react";
import {
  X,
  Printer,
  Receipt,
  UserRound,
  Building2,
  CalendarClock,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MapPin,
  Hash,
  IndianRupee,
} from "lucide-react";

export default function ViewPurchasePaymentModal({
  isOpen = true,
  onClose = () => {},
  onPrint,
  payment = {},
}) {
  if (!isOpen) return null;

  const details = {
    supplierName: "ramraj ramraj",
    supplierMobile: "1444188866",
    businessName: "Pharmacy",
    businessType: "Pharmacy",
    address:
      "JP Nagar, Kumarswamy Layout, Bangaluru\nBengaluru,Karnataka,India",
    gstin: "29AACW6067A1ZB",
    businessMobile: "7485968575",
    email: "khanaiamit.m9@gmail.com",
    amount: 500,
    paymentMethod: "Cash",
    paymentNote: "",
    referenceNo: "PP2024/0006",
    paidOn: "17/10/2024 16:37",
    ...payment,
  };

  const currency = (value) =>
    `₹ ${Number(value ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handlePrint = () => {
    if (onPrint) {
      onPrint(details);
      return;
    }
    window.print();
  };

  const InfoItem = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-3">
      {Icon && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={16} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <div className="mt-1 break-words text-sm leading-6 text-[#10234F]">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10234F]/60 p-3 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-payment-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#E6EDF5] bg-[#FFFAF5] shadow-[0_24px_70px_rgba(16,35,79,0.25)]"
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E6EDF5] bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF6814]">
              <Receipt size={20} />
            </div>
            <div className="min-w-0">
              <h2
                id="purchase-payment-title"
                className="text-base font-bold text-[#10234F] sm:text-lg"
              >
                View Payment
              </h2>
              <p className="mt-0.5 break-all text-xs text-slate-500 sm:text-sm">
                Reference No: {details.referenceNo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment details"
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#10234F]"
          >
            <X size={20} />
          </button>
        </header>

        {/* Details */}
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 rounded-xl border border-[#E6EDF5] bg-white p-4 sm:grid-cols-2 sm:gap-7 sm:p-5">
            <div className="space-y-4">
              <InfoItem icon={UserRound} label="Supplier">
                <p className="font-semibold">{details.supplierName}</p>
                <p className="mt-1 flex items-center gap-2 text-slate-600">
                  <Phone size={14} />
                  {details.supplierMobile}
                </p>
              </InfoItem>
            </div>

            <div className="space-y-4">
              <InfoItem icon={Building2} label="Business">
                <p className="font-semibold">
                  {details.businessName}{" "}
                  <span className="font-normal text-slate-500">
                    {details.businessType}
                  </span>
                </p>
                <p className="mt-1 flex items-start gap-2 whitespace-pre-line text-slate-600">
                  <MapPin className="mt-1 shrink-0" size={14} />
                  <span>{details.address}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  GSTIN: {details.gstin}
                </p>
                <p className="mt-1 flex items-center gap-2 text-slate-600">
                  <Phone size={14} />
                  {details.businessMobile}
                </p>
                <p className="mt-1 flex items-start gap-2 break-all text-slate-600">
                  <Mail className="mt-1 shrink-0" size={14} />
                  {details.email}
                </p>
              </InfoItem>
            </div>
          </div>

          {/* Payment summary */}
          <div className="overflow-hidden rounded-xl border border-[#F4D8C5] bg-white">
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-3 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <IndianRupee size={17} />
                Payment Summary
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                {details.paymentMethod}
              </span>
            </div>

            <div className="grid grid-cols-1 divide-y divide-[#E6EDF5] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="space-y-4 p-4 sm:p-5">
                <InfoItem icon={IndianRupee} label="Amount">
                  <p className="text-xl font-extrabold text-[#10234F]">
                    {currency(details.amount)}
                  </p>
                </InfoItem>

                <InfoItem icon={CreditCard} label="Payment Method">
                  <p className="font-semibold">{details.paymentMethod}</p>
                </InfoItem>

                <InfoItem icon={FileText} label="Payment Note">
                  <p>{details.paymentNote || "—"}</p>
                </InfoItem>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                <InfoItem icon={Hash} label="Reference No">
                  <p className="font-semibold">{details.referenceNo}</p>
                </InfoItem>

                <InfoItem icon={CalendarClock} label="Paid On">
                  <p className="font-semibold">{details.paidOn}</p>
                </InfoItem>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col-reverse gap-3 border-t border-[#E6EDF5] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-[#26313D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#17212B] focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <Printer size={17} />
            Print
          </button>
        </footer>
      </section>
    </div>
  );
}
