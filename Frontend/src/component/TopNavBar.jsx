
import { useState } from "react";
import {
  Menu,
  Search,
  Calculator,
  Grid2X2,
  CalendarDays,
  Bell,
  UserCircle,
  ChevronDown,
} from "lucide-react";

export default function TopNavBar() {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  return (
    <header className="sticky top-0 z-30 flex h-[62px] w-full items-center gap-3 border-b border-[#E9EAF0] bg-white px-4 font-sans">
      {/* Menu */}
      <button
        type="button"
        aria-label="Toggle sidebar"
        className="flex h-[36px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-[#E9EAF0] bg-white text-[#172D67] shadow-sm transition hover:bg-[#F5F7FC]"
      >
        <Menu size={16} strokeWidth={2} />
      </button>

      {/* Search */}
      <div className="flex h-[38px] min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[#E6EAF3] bg-[#F2F5FC] px-3.5 shadow-sm">
        <Search size={18} className="shrink-0 text-[#49699F]" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice number, phone or name..."
          className="w-full min-w-0 border-none bg-transparent text-[14px] text-[#172D67] outline-none placeholder:text-[#8194B6] focus:ring-0"
        />
      </div>

      {/* Billing Calculator */}
      <button
        type="button"
        aria-label="Billing calculator"
        className="flex h-[38px] w-[46px] shrink-0 items-center justify-center rounded-lg border border-[#E9EAF0] bg-white text-[#18346E] shadow-sm transition hover:bg-[#F4F6FB]"
      >
        <Calculator size={19} strokeWidth={2} />
      </button>

      {/* POS */}
      <button
        type="button"
        className="flex h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FF650F] px-4 text-white shadow-sm transition hover:bg-[#ED5707]"
      >
        <Grid2X2 size={17} strokeWidth={2.5} />
        <span className="text-[13px] font-semibold">POS</span>
      </button>

      {/* Date */}
      <button
        type="button"
        className="flex h-[38px] shrink-0 items-center gap-2 rounded-lg border border-[#E9EAF0] bg-white px-3 text-[#1B326A] shadow-sm"
      >
        <CalendarDays size={16} />
        <span className="text-[12px] font-semibold">{formattedDate}</span>
      </button>

      {/* Notifications */}
      <div className="relative shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setNotifications(!notifications)}
          className="relative flex h-[38px] w-[34px] items-center justify-center rounded-lg border border-[#E9EAF0] bg-white text-[#1B326A] shadow-sm hover:bg-[#F5F7FC]"
        >
          <Bell size={17} />
          <span className="absolute right-[5px] top-[4px] h-[5px] w-[5px] rounded-full bg-[#FF6B35]" />
        </button>

        {notifications && (
          <div className="absolute right-0 top-9 w-52 rounded-lg border border-[#E9EAF0] bg-white p-3 text-xs text-[#263A6B] shadow-lg">
            <p className="font-semibold">Notifications</p>
            <p className="mt-2 text-[#7B87A2]">
              You&apos;re all caught up.
            </p>
          </div>
        )}
      </div>

      {/* Pharmacy Profile */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex h-[38px] items-center gap-2 rounded-lg border border-[#E9EAF0] bg-white px-3 text-[#192F68] shadow-sm transition hover:bg-[#F5F7FC]"
        >
          <UserCircle size={19} fill="#192F68" className="text-white" />
          <span className="text-[12px] font-semibold">pharmacy</span>
          <ChevronDown
            size={14}
            className={`transition-transform ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-9 w-40 rounded-lg border border-[#E9EAF0] bg-white p-1.5 shadow-lg">
            <button
              type="button"
              className="w-full rounded-md px-3 py-2 text-left text-xs text-[#192F68] hover:bg-[#F2F5FC]"
            >
              My Profile
            </button>
            <button
              type="button"
              className="w-full rounded-md px-3 py-2 text-left text-xs text-[#192F68] hover:bg-[#F2F5FC]"
            >
              Settings
            </button>
            <button
              type="button"
              className="w-full rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
