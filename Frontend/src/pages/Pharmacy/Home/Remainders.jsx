
import { useState } from "react";
import {
  BellRing,
  ArrowRight,
  History,
} from "lucide-react";

const initialReminders = [
  {
    id: 1,
    customer: "swathi",
    mobile: "7975088071",
    lastVisit: "24/07/2026",
    expectedCompletion: "26/07/2026",
    daysSinceCompletion: 85,
    medicine: "Dolo 650",
  },
  {
    id: 2,
    customer: "Demo Customer",
    mobile: "9988776655",
    lastVisit: "04/08/2026",
    expectedCompletion: "05/08/2026",
    daysSinceCompletion: 75,
    medicine: "Dolo 650",
  },
  {
    id: 3,
    customer: "Walk-In Customer",
    mobile: "--",
    lastVisit: "01/10/2026",
    expectedCompletion: "02/10/2026",
    daysSinceCompletion: 17,
    medicine: "Dolo 650",
  },
];

export default function Remainders({ onViewFullReport, onViewHistory }) {
  const [reminders] = useState(initialReminders);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showReport, setShowReport] = useState(false);

  return (
    <>
      <section className="w-full overflow-hidden rounded-2xl border border-[#F8EBDD] bg-white/90 p-3.5 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-4">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E4]">
              <BellRing
                size={24}
                strokeWidth={2.4}
                className="text-[#FF7827]"
              />
            </div>

            <div className="min-w-0">
              <h2 className="app-section-title text-[#283E61]">
                Customers{" "}
                <span className="text-[#FF772C]">
                  Due For Reminder
                </span>
              </h2>

              <p className="app-description mt-1 text-[#7A8EA7]">
                Customers who likely completed medicine and have not
                returned yet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onViewFullReport
                ? onViewFullReport()
                : setShowReport(true)
            }
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#FF772C] to-[#FF822E] px-3.5 text-[11px] font-semibold text-white shadow-[0_4px_10px_rgba(255,105,20,0.15)] transition hover:brightness-105 sm:text-[13px]"
          >
            View Full Report
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Customer table */}
        <div className="overflow-x-auto rounded-xl border border-[#F8EEE4]">
          <table className="w-full min-w-[850px] table-auto border-collapse text-left">
            <thead>
              <tr className="bg-[#FFF8F0] text-[#2C415E]">
                <th className="app-table-heading border-r border-[#F6EEE6] px-3.5 py-3.5">
                  Customer
                </th>
                <th className="app-table-heading border-r border-[#F6EEE6] px-3.5 py-3.5">
                  Mobile
                </th>
                <th className="app-table-heading border-r border-[#F6EEE6] px-3.5 py-3.5">
                  Last Visit
                </th>
                <th className="app-table-heading border-r border-[#F6EEE6] px-3.5 py-3.5">
                  Expected Completion
                </th>
                <th className="app-table-heading border-r border-[#F6EEE6] px-3.5 py-3.5">
                  Days Since Completion
                </th>
                <th className="app-table-heading border-r border-[#F6EEE6] px-3.5 py-3.5">
                  Medicine
                </th>
                <th className="app-table-heading px-3.5 py-3.5">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {reminders.map((item, index) => (
                <tr
                  key={item.id}
                  className={`transition hover:bg-[#FFF7EF] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#FFFCF8]"
                  }`}
                >
                  <td className="app-table-cell whitespace-nowrap border-r border-t border-[#F6EEE6] px-3.5 py-3.5 text-[#3E5A7D]">
                    {item.customer}
                  </td>

                  <td className="app-table-cell whitespace-nowrap border-r border-t border-[#F6EEE6] px-3.5 py-3.5 text-[#3E5A7D]">
                    {item.mobile}
                  </td>

                  <td className="app-table-cell whitespace-nowrap border-r border-t border-[#F6EEE6] px-3.5 py-3.5 text-[#3E5A7D]">
                    {item.lastVisit}
                  </td>

                  <td className="app-table-cell whitespace-nowrap border-r border-t border-[#F6EEE6] px-3.5 py-3.5 text-[#3E5A7D]">
                    {item.expectedCompletion}
                  </td>

                  <td className="app-table-cell whitespace-nowrap border-r border-t border-[#F6EEE6] px-3.5 py-3.5 text-[#3E5A7D]">
                    {item.daysSinceCompletion}
                  </td>

                  <td className="app-table-cell whitespace-nowrap border-r border-t border-[#F6EEE6] px-3.5 py-3.5 text-[#3E5A7D]">
                    {item.medicine}
                  </td>

                  <td className="border-t border-[#F6EEE6] px-3 py-2">
                    <button
                      type="button"
                      onClick={() =>
                        onViewHistory
                          ? onViewHistory(item)
                          : setSelectedCustomer(item)
                      }
                      className="inline-flex min-w-[120px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#FF8635] px-3 py-2 text-[11px] font-semibold text-[#FF772C] transition hover:bg-[#FFF0E4]"
                    >
                      <span>View History</span>
                    </button>
                  </td>
                </tr>
              ))}

              {reminders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-xs text-[#8798AD]"
                  >
                    No customers due for reminders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Customer history dialog */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283E61]/40 p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center gap-3">
              <History className="text-[#FF772C]" size={25} />
              <h3
                id="history-title"
                className="text-xl font-semibold text-[#283E61]"
              >
                Customer History
              </h3>
            </div>

            <div className="space-y-4 text-sm text-[#637A94]">
              <p>
                <strong className="text-[#283E61]">Customer:</strong>{" "}
                {selectedCustomer.customer}
              </p>
              <p>
                <strong className="text-[#283E61]">Mobile:</strong>{" "}
                {selectedCustomer.mobile}
              </p>
              <p>
                <strong className="text-[#283E61]">Last visit:</strong>{" "}
                {selectedCustomer.lastVisit}
              </p>
              <p>
                <strong className="text-[#283E61]">Medicine:</strong>{" "}
                {selectedCustomer.medicine}
              </p>
              <p>
                <strong className="text-[#283E61]">
                  Expected completion:
                </strong>{" "}
                {selectedCustomer.expectedCompletion}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="mt-6 w-full rounded-xl bg-[#FF772C] px-5 py-3 font-semibold text-white hover:bg-[#EF6A23]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Full report dialog */}
      {showReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#283E61]/40 p-4"
          onClick={() => setShowReport(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-[#283E61]">
              Customers Due For Reminder
            </h3>
            <p className="mt-3 text-sm text-[#7A8EA7]">
              Total customers requiring follow-up:{" "}
              <strong>{reminders.length}</strong>
            </p>
            <button
              type="button"
              onClick={() => setShowReport(false)}
              className="mt-6 w-full rounded-xl bg-[#FF772C] px-5 py-3 font-semibold text-white hover:bg-[#EF6A23]"
            >
              Close Report
            </button>
          </div>
        </div>
      )}
    </>
  );
}
