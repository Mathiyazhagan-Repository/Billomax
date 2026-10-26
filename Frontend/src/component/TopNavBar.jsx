
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  Calculator,
  Grid2X2,
  CalendarDays,
  Bell,
  UserCircle,
  ChevronDown,
  X,
} from "lucide-react";

export default function TopNavBar({
  businessName,
  onNavigate,
  onLogout,
}) {
  const [search, setSearch] = useState("");
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorDisplay, setCalculatorDisplay] = useState("0");
  const [calculatorStoredValue, setCalculatorStoredValue] = useState(null);
  const [calculatorOperator, setCalculatorOperator] = useState(null);
  const [calculatorWaitingForOperand, setCalculatorWaitingForOperand] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const calculatorRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calculatorRef.current && !calculatorRef.current.contains(event.target)) {
        setCalculatorOpen(false);
      }
    }
    if (calculatorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calculatorOpen]);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  const enterCalculatorDigit = (digit) => {
    setCalculatorDisplay((current) => {
      if (calculatorWaitingForOperand || current === "0") {
        return digit === "." ? "0." : digit;
      }
      if (digit === "." && current.includes(".")) return current;
      return `${current}${digit}`;
    });
    setCalculatorWaitingForOperand(false);
  };

  const calculate = (left, right, operator) => {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "×":
        return left * right;
      case "÷":
        return right === 0 ? null : left / right;
      default:
        return right;
    }
  };

  const chooseCalculatorOperator = (operator) => {
    const currentValue = Number(calculatorDisplay);
    if (!Number.isFinite(currentValue)) return;
    if (calculatorOperator && !calculatorWaitingForOperand) {
      const result = calculate(
        calculatorStoredValue ?? currentValue,
        currentValue,
        calculatorOperator,
      );
      if (result === null) {
        setCalculatorDisplay("Cannot divide by zero");
        setCalculatorStoredValue(null);
        setCalculatorOperator(null);
        setCalculatorWaitingForOperand(true);
        return;
      }
      setCalculatorDisplay(String(result));
      setCalculatorStoredValue(result);
    } else {
      setCalculatorStoredValue(currentValue);
    }
    setCalculatorOperator(operator);
    setCalculatorWaitingForOperand(true);
  };

  const runCalculatorEquals = () => {
    if (!calculatorOperator || calculatorStoredValue === null) return;
    const result = calculate(
      calculatorStoredValue,
      Number(calculatorDisplay),
      calculatorOperator,
    );
    setCalculatorDisplay(result === null ? "Cannot divide by zero" : String(result));
    setCalculatorStoredValue(null);
    setCalculatorOperator(null);
    setCalculatorWaitingForOperand(true);
  };

  const clearCalculator = () => {
    setCalculatorDisplay("0");
    setCalculatorStoredValue(null);
    setCalculatorOperator(null);
    setCalculatorWaitingForOperand(false);
  };

  const clearCalculatorEntry = () => {
    setCalculatorDisplay("0");
    setCalculatorWaitingForOperand(false);
  };

  const applyCalculatorPercent = () => {
    const value = Number(calculatorDisplay);
    if (!Number.isFinite(value)) return;
    setCalculatorDisplay(String(value / 100));
    setCalculatorWaitingForOperand(true);
  };

  const calculatorKeys = [
    {
      label: "AC",
      action: clearCalculator,
      style: "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] hover:bg-[#FCA5A5]/40 font-bold text-[12px]",
    },
    {
      label: "CE",
      action: clearCalculatorEntry,
      style: "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] hover:bg-[#FCD34D]/40 font-bold text-[12px]",
    },
    {
      label: "%",
      action: applyCalculatorPercent,
      style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] hover:bg-[#DBEAFE] font-semibold text-[14px]",
    },
    {
      label: "÷",
      action: () => chooseCalculatorOperator("÷"),
      style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] hover:bg-[#DBEAFE] font-semibold text-[16px]",
    },
    { label: "7", action: () => enterCalculatorDigit("7") },
    { label: "8", action: () => enterCalculatorDigit("8") },
    { label: "9", action: () => enterCalculatorDigit("9") },
    {
      label: "×",
      action: () => chooseCalculatorOperator("×"),
      style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] hover:bg-[#DBEAFE] font-semibold text-[16px]",
    },
    { label: "4", action: () => enterCalculatorDigit("4") },
    { label: "5", action: () => enterCalculatorDigit("5") },
    { label: "6", action: () => enterCalculatorDigit("6") },
    {
      label: "-",
      action: () => chooseCalculatorOperator("-"),
      style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] hover:bg-[#DBEAFE] font-semibold text-[16px]",
    },
    { label: "1", action: () => enterCalculatorDigit("1") },
    { label: "2", action: () => enterCalculatorDigit("2") },
    { label: "3", action: () => enterCalculatorDigit("3") },
    {
      label: "+",
      action: () => chooseCalculatorOperator("+"),
      style: "bg-[#EEF3FC] text-[#2563EB] border border-[#D8E4F8] hover:bg-[#DBEAFE] font-semibold text-[16px]",
    },
    { label: "0", action: () => enterCalculatorDigit("0") },
    { label: ".", action: () => enterCalculatorDigit(".") },
    {
      label: "=",
      action: runCalculatorEquals,
      span: "col-span-2",
      style: "bg-[#FF711A] text-white border border-[#E8620E] hover:bg-[#E8610C] active:bg-[#D55305] shadow-[0_2px_8px_rgba(255,113,26,0.32)] font-bold text-[16px]",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-[62px] w-full items-center gap-3 border-b border-[#E9EAF0] bg-white px-4 font-sans">
      {/* Menu */}
      <button
        type="button"
        aria-label="Toggle sidebar"
        className="flex h-[36px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-[#E9EAF0] bg-white text-[#2E4276] shadow-sm transition hover:bg-[#F5F7FC]"
      >
        <Menu size={16} strokeWidth={2} />
      </button>

      {/* Search */}
      <div className="flex h-[38px] min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[#E6EAF3] bg-[#F2F5FC] px-3.5 shadow-sm">
        <Search size={18} className="shrink-0 text-[#5B78A9]" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice number, phone or name..."
          className="w-full min-w-0 border-none bg-transparent text-[14px] text-[#2E4276] outline-none placeholder:text-[#8E9FBD] focus:ring-0"
        />
      </div>

      {/* Billing Calculator */}
      <div ref={calculatorRef} className="relative shrink-0">
        <button
          type="button"
          aria-label="Billing calculator"
          aria-expanded={calculatorOpen}
          onClick={() => setCalculatorOpen((open) => !open)}
          className={`flex h-[38px] w-[46px] items-center justify-center rounded-lg border transition shadow-sm ${
            calculatorOpen
              ? "border-[#FF711A] bg-[#FFF0E3] text-[#FF711A]"
              : "border-[#E9EAF0] bg-white text-[#2F487C] hover:bg-[#F4F6FB]"
          }`}
        >
          <Calculator size={19} strokeWidth={2} />
        </button>
        {calculatorOpen && (
          <section
            aria-label="Calculator"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[270px] overflow-hidden rounded-2xl border border-[#E6EAF3] bg-white shadow-[0_12px_32px_rgba(21,51,110,0.14)] font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0F2F7] bg-[#FAFBFD] px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <Calculator size={14} className="text-[#FF711A]" />
                <span className="text-[12px] font-bold text-[#15336E]">
                  Calculator
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCalculatorOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-[#8E9FBD] transition hover:bg-[#EEF2F9] hover:text-[#15336E]"
                aria-label="Close calculator"
              >
                <X size={14} />
              </button>
            </div>

            {/* Display Screen */}
            <div className="p-3 pb-2">
              <div className="rounded-xl border border-[#E3E8F3] bg-[#F7F9FC] px-3 py-2 text-right shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="h-4 overflow-hidden truncate font-mono text-[11px] font-medium text-[#7B90B2]">
                  {calculatorStoredValue !== null && calculatorOperator
                    ? `${calculatorStoredValue} ${calculatorOperator}`
                    : "\u00A0"}
                </div>
                <output
                  aria-live="polite"
                  className="block overflow-hidden truncate font-mono text-[22px] font-bold tracking-tight text-[#15336E]"
                >
                  {calculatorDisplay}
                </output>
              </div>
            </div>

            {/* Keys */}
            <div className="grid grid-cols-4 gap-1.5 p-3 pt-0">
              {calculatorKeys.map(({ label, action, span = "", style = "" }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className={`flex h-[36px] items-center justify-center rounded-lg text-[14px] font-semibold transition-all active:scale-95 select-none ${
                    style ||
                    "border border-[#E5EAF3] bg-white text-[#15336E] shadow-sm hover:border-[#CCD8ED] hover:bg-[#F8FAFC]"
                  } ${span}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* POS */}
      <button
        type="button"
        onClick={() => onNavigate?.("POS")}
        className="flex h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FF7427] px-4 text-white shadow-sm transition hover:bg-[#EF6820]"
      >
        <Grid2X2 size={17} strokeWidth={2.5} />
        <span className="text-[13px] font-semibold">POS</span>
      </button>

      {/* Date */}
      <button
        type="button"
        className="flex h-[38px] shrink-0 items-center gap-2 rounded-lg border border-[#E9EAF0] bg-white px-3 text-[#324679] shadow-sm"
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
          className="relative flex h-[38px] w-[34px] items-center justify-center rounded-lg border border-[#E9EAF0] bg-white text-[#324679] shadow-sm hover:bg-[#F5F7FC]"
        >
          <Bell size={17} />
          <span className="absolute right-[5px] top-[4px] h-[5px] w-[5px] rounded-full bg-[#FF7A49]" />
        </button>

        {notifications && (
          <div className="absolute right-0 top-9 w-52 rounded-lg border border-[#E9EAF0] bg-white p-3 text-xs text-[#3C4E7A] shadow-lg">
            <p className="font-semibold">Notifications</p>
            <p className="mt-2 text-[#7B87A2]">
              You&apos;re all caught up.
            </p>
          </div>
        )}
      </div>

      {/* Business Profile */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex h-[38px] items-center gap-2 rounded-lg border border-[#E9EAF0] bg-white px-3 text-[#304477] shadow-sm transition hover:bg-[#F5F7FC]"
        >
          <UserCircle size={19} fill="#304477" className="text-white" />
          <span className="text-[12px] font-semibold">{businessName || "Pharmacy"}</span>
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
              className="w-full rounded-md px-3 py-2 text-left text-xs text-[#304477] hover:bg-[#F2F5FC]"
            >
              My Profile
            </button>
            <button
              type="button"
              className="w-full rounded-md px-3 py-2 text-left text-xs text-[#304477] hover:bg-[#F2F5FC]"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                onLogout?.();
              }}
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
