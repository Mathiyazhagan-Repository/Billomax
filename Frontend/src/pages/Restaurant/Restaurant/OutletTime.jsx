
import React, { useState } from "react";
import {
  Clock3,
  CalendarDays,
  CheckCircle2,
  Pencil,
  Save,
  X,
  Sun,
  Moon,
  CalendarOff,
} from "lucide-react";

const initialSchedule = [
  { day: "Monday", open: "10:00", close: "22:00", enabled: true },
  { day: "Tuesday", open: "09:00", close: "16:00", enabled: true },
  { day: "Wednesday", open: "09:00", close: "22:00", enabled: true },
  { day: "Thursday", open: "09:00", close: "22:00", enabled: true },
  { day: "Friday", open: "10:00", close: "22:00", enabled: true },
  { day: "Saturday", open: "10:07", close: "22:00", enabled: true },
  { day: "Sunday", open: "", close: "", enabled: false },
];

const formatTime = (time) => {
  if (!time) return "Holiday";

  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

export default function OutletTime() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSchedule, setSavedSchedule] = useState(initialSchedule);
  const [message, setMessage] = useState("");

  const activeDays = schedule.filter((day) => day.enabled).length;

  const updateDay = (index, field, value) => {
    setSchedule((previous) =>
      previous.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      )
    );
    setMessage("");
  };

  const toggleDay = (index) => {
    setSchedule((previous) =>
      previous.map((day, i) => {
        if (i !== index) return day;

        const enabled = !day.enabled;

        return {
          ...day,
          enabled,
          open: enabled ? day.open || "09:00" : "",
          close: enabled ? day.close || "22:00" : "",
        };
      })
    );
    setMessage("");
  };

  const handleSave = () => {
    const invalidDay = schedule.find(
      (day) =>
        day.enabled &&
        (!day.open ||
          !day.close ||
          day.open >= day.close)
    );

    if (invalidDay) {
      setMessage(
        `Please check the opening and closing times for ${invalidDay.day}. Closing time must be later than opening time.`
      );
      return;
    }

    setSavedSchedule(schedule.map((day) => ({ ...day })));
    setIsEditing(false);
    setMessage("Outlet timings saved for this session.");
  };

  const handleCancel = () => {
    setSchedule(savedSchedule.map((day) => ({ ...day })));
    setIsEditing(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 py-6 font-sans text-[#10234F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6814]">
              <Clock3 size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Outlet Time
              </h1>
              <p className="mt-1 text-sm text-[#718096]">
                Set restaurant opening hours and manage weekly holidays.
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setMessage("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Pencil size={16} />
              Edit Timings
            </button>
          )}
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <OverviewCard
            icon={CalendarDays}
            title="Weekly Schedule"
            value="7 Days"
            description="Monday to Sunday"
            iconStyle="bg-blue-50 text-blue-600"
          />
          <OverviewCard
            icon={Sun}
            title="Operating Days"
            value={`${activeDays} Days`}
            description="Days currently enabled"
            iconStyle="bg-orange-50 text-[#FF6814]"
          />
          <OverviewCard
            icon={CalendarOff}
            title="Weekly Holidays"
            value={`${7 - activeDays} Day${7 - activeDays === 1 ? "" : "s"}`}
            description="Days marked as closed"
            iconStyle="bg-rose-50 text-rose-600"
          />
        </div>

        {/* Schedule card */}
        <section className="overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-[0_8px_28px_rgba(16,35,79,0.06)]">
          <div className="flex flex-col gap-3 border-b border-[#EEF1F5] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-extrabold">
                Weekly Opening Hours
              </h2>
              <p className="mt-1 text-sm text-[#8491A5]">
                {isEditing
                  ? "Update the opening times and switch days on or off."
                  : "Your current restaurant opening schedule."}
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {activeDays} active days
            </span>
          </div>

          <div className="overflow-x-auto p-4 sm:p-6">
            <table className="w-full min-w-[680px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-[#F5F8FC] text-left text-xs uppercase tracking-wide text-[#60728D]">
                  <th className="rounded-l-xl border-y border-l border-[#E8EDF4] px-4 py-4 font-extrabold">
                    Day
                  </th>
                  <th className="border-y border-[#E8EDF4] px-4 py-4 font-extrabold">
                    Open Time
                  </th>
                  <th className="border-y border-[#E8EDF4] px-4 py-4 font-extrabold">
                    Close Time
                  </th>
                  <th className="rounded-r-xl border-y border-r border-[#E8EDF4] px-4 py-4 font-extrabold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {schedule.map((day, index) => (
                  <tr
                    key={day.day}
                    className="transition hover:bg-orange-50/40"
                  >
                    <td className="border-b border-[#EEF1F5] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            day.enabled
                              ? "bg-orange-50 text-[#FF6814]"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {day.enabled ? (
                            <Sun size={17} />
                          ) : (
                            <Moon size={17} />
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-[#10234F]">
                            {day.day}
                          </p>
                          <p className="mt-0.5 text-xs text-[#8491A5]">
                            {day.enabled ? "Operating day" : "Weekly holiday"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-[#EEF1F5] px-4 py-4">
                      {isEditing && day.enabled ? (
                        <input
                          type="time"
                          value={day.open}
                          onChange={(event) =>
                            updateDay(index, "open", event.target.value)
                          }
                          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70"
                          aria-label={`${day.day} opening time`}
                        />
                      ) : day.enabled ? (
                        <span className="inline-flex items-center gap-2 font-semibold tabular-nums text-[#33445F]">
                          <Clock3 size={15} className="text-[#94A3B8]" />
                          {isEditing ? day.open : formatTime(day.open)}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 ring-1 ring-inset ring-rose-200">
                          Holiday
                        </span>
                      )}
                    </td>

                    <td className="border-b border-[#EEF1F5] px-4 py-4">
                      {isEditing && day.enabled ? (
                        <input
                          type="time"
                          value={day.close}
                          onChange={(event) =>
                            updateDay(index, "close", event.target.value)
                          }
                          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70"
                          aria-label={`${day.day} closing time`}
                        />
                      ) : day.enabled ? (
                        <span className="inline-flex items-center gap-2 font-semibold tabular-nums text-[#33445F]">
                          <Clock3 size={15} className="text-[#94A3B8]" />
                          {isEditing ? day.close : formatTime(day.close)}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 ring-1 ring-inset ring-rose-200">
                          Holiday
                        </span>
                      )}
                    </td>

                    <td className="border-b border-[#EEF1F5] px-4 py-4">
                      {isEditing ? (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={day.enabled}
                          aria-label={`${day.day} operating status`}
                          onClick={() => toggleDay(index)}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                            day.enabled ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                              day.enabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                            day.enabled
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {day.enabled ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <CalendarOff size={14} />
                          )}
                          {day.enabled ? "Open" : "Closed"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {message && (
            <div
              role="status"
              className={`mx-5 mb-4 rounded-xl border px-4 py-3 text-sm sm:mx-6 ${
                message.startsWith("Please")
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {message}
            </div>
          )}

          {isEditing && (
            <div className="flex flex-col-reverse gap-3 border-t border-[#EEF1F5] bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs leading-5 text-[#8491A5]">
                Changes are kept in this page's React state. Connect the save
                handler to your backend to persist timings.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#60728D] transition hover:bg-slate-50 sm:flex-none"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200/50 transition hover:shadow-lg sm:flex-none"
                >
                  <Save size={16} />
                  Save Timings
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <div className="mt-0.5 text-blue-600">
            <Clock3 size={19} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#10234F]">
              Outlet schedule information
            </p>
            <p className="mt-1 text-sm leading-6 text-[#60728D]">
              Sunday is configured as a weekly holiday. The opening and closing
              times for the other six days match your original schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ icon: Icon, title, value, description, iconStyle }) {
  return (
    <div className="rounded-2xl border border-[#F0E4D8] bg-white p-5 shadow-[0_5px_20px_rgba(16,35,79,0.04)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#718096]">{title}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-[#10234F]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[#8491A5]">{description}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconStyle}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}
