import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  UserRound,
} from "lucide-react";

const businesses = [
  {
    name: "Admin",
    description: "Manage users, settings and full control",
    icon: "⚙️",
    theme: "blue",
  },
  {
    name: "Pharmacy",
    description: "Manage medicines, expiry and prescriptions",
    icon: "💊",
    theme: "green",
  },
  {
    name: "Multi-Service Center",
    description: "Handle services and customer records",
    icon: "🛠️",
    theme: "orange",
  },
  {
    name: "Electronics & MobileShop",
    description: "Manage products, brands and IMEI/serial numbers",
    icon: "🎧",
    theme: "purple",
  },
  {
    name: "Super Market",
    description: "Handle inventory, billing and multi-store",
    icon: "🛒",
    theme: "cyan",
  },
  {
    name: "Restaurant",
    description: "Quick billing, menu management and KOT",
    icon: "🍽️",
    theme: "amber",
  },
];

const businessThemes = {
  blue: {
    card: "border-blue-200 bg-blue-50/50",
    icon: "drop-shadow-[0_5px_5px_rgba(37,99,235,0.22)]",
    arrow: "bg-blue-100 text-blue-600",
  },
  green: {
    card: "border-emerald-200 bg-emerald-50/50",
    icon: "drop-shadow-[0_5px_5px_rgba(16,185,129,0.22)]",
    arrow: "bg-emerald-100 text-emerald-600",
  },
  orange: {
    card: "border-orange-200 bg-orange-50/50",
    icon: "drop-shadow-[0_5px_5px_rgba(249,115,22,0.22)]",
    arrow: "bg-orange-100 text-orange-600",
  },
  purple: {
    card: "border-purple-200 bg-purple-50/50",
    icon: "drop-shadow-[0_5px_5px_rgba(147,51,234,0.22)]",
    arrow: "bg-purple-100 text-purple-600",
  },
  cyan: {
    card: "border-cyan-200 bg-cyan-50/50",
    icon: "drop-shadow-[0_5px_5px_rgba(6,182,212,0.22)]",
    arrow: "bg-cyan-100 text-cyan-600",
  },
  amber: {
    card: "border-amber-200 bg-amber-50/50",
    icon: "drop-shadow-[0_5px_5px_rgba(245,158,11,0.22)]",
    arrow: "bg-amber-100 text-amber-600",
  },
};

export default function Login({ onSelectBusiness }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState("");

  const fillDemoCredentials = () => {
    setUsername("demo@billomax.com");
    setPassword("demo123");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSelectBusiness?.(selectedBusiness || "Pharmacy");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fbff] font-sans text-[#101d4a]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-24 -top-40 h-[560px] w-[760px] rotate-[32deg] rounded-[100px] bg-gradient-to-br from-[#d8edff]/75 to-transparent" />
        <div className="absolute right-[22%] top-[-110px] h-[650px] w-[360px] rotate-[-52deg] rounded-[100px] bg-gradient-to-b from-white/80 to-[#eaf5ff]/50" />
        <div className="absolute -bottom-40 -left-20 h-[290px] w-[720px] rounded-[50%] bg-gradient-to-r from-[#fff0e8] via-white to-[#e6f4ff]" />
      </div>

      <header className="relative z-10 flex h-[69px] items-center justify-between border-b border-[#dce9f6] bg-white/55 px-6 sm:px-10 lg:px-[4.4%]">
        <a
          href="#"
          aria-label="Billomax home"
          className="flex flex-col leading-none no-underline"
        >
          <span className="text-[26px] font-extrabold tracking-[-1.5px] text-[#0b9e62]">
            ◉Bill<span className="text-[#1687de]">omax</span>
          </span>
          <span className="ml-9 mt-0.5 text-[9px] font-semibold text-[#ef541f]">
            Your Trusted Partner in Billing &amp; Invoicing
          </span>
        </a>
        <nav className="flex items-center gap-7 text-sm font-semibold">
          <a href="#pricing" className="text-blue-600 hover:text-blue-800">
            Pricing
          </a>
          <a
            href="#register"
            className="rounded-lg bg-[#ff520e] px-7 py-3 text-white shadow-sm transition hover:bg-[#e94a0c]"
          >
            Register
          </a>
        </nav>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-69px)] max-w-[1480px] grid-cols-1 items-center gap-8 px-5 py-8 sm:px-10 lg:grid-cols-[minmax(0,1fr)_416px] lg:gap-6 lg:px-[4.5%] lg:py-10">
        <section className="min-w-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#e8f0ff] px-4 py-2 text-xs font-extrabold tracking-[0.08em] text-[#1260ff]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6a15]" />
            TRUSTED BILLING &amp; INVOICING
          </div>

          <h1 className="max-w-[650px] text-[clamp(2.65rem,4.25vw,3.85rem)] font-extrabold leading-[0.99] tracking-[-0.055em] text-[#101a46]">
            One Platform for
            <br />
            Every <span className="text-[#ff5611]">Business</span>
          </h1>

          <p className="mt-5 max-w-[620px] text-[15px] leading-[1.55] text-[#52698f] sm:text-base">
            Billomax handles your billing, invoicing, inventory and GST —
            whether you run a pharmacy, restaurant, supermarket or any business.
            Pick your business below to get started.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {businesses.map((business) => {
              const theme = businessThemes[business.theme];
              const isSelected = selectedBusiness === business.name;

              return (
                <button
                  key={business.name}
                  type="button"
                  onClick={() => {
                    setSelectedBusiness(business.name);
                    fillDemoCredentials();
                    if (
                      business.name === "Admin" ||
                      business.name === "Pharmacy" ||
                      business.name === "Multi-Service Center" ||
                      business.name === "Restaurant" ||
                      business.name === "Super Market" ||
                      business.name === "Electronics & MobileShop"
                    ) {
                      onSelectBusiness?.(business.name);
                    }
                  }}
                  aria-pressed={isSelected}
                  className={`flex min-h-[112px] min-w-0 items-center gap-3 rounded-[15px] border px-3.5 py-3 text-left shadow-[0_4px_14px_rgba(40,81,132,0.035)] transition hover:-translate-y-0.5 hover:shadow-md ${
                    theme.card
                  } ${isSelected ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex w-[72px] shrink-0 items-center justify-center text-[46px] leading-none ${theme.icon}`}
                  >
                    {business.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-extrabold leading-tight tracking-[-0.03em] text-[#13204b]">
                      {business.name}
                    </span>
                    <span className="mt-1.5 block text-[10px] leading-[1.45] text-[#596d8d]">
                      {business.description}
                    </span>
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${theme.arrow}`}
                  >
                    <ChevronRight size={19} strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-[#18346b]">
            {["GST Compliant", "7-Day Free Trial", "No Credit Card Required"].map(
              (benefit) => (
                <span key={benefit} className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1764f5] text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {benefit}
                </span>
              ),
            )}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[440px] rounded-[20px] border border-white/80 bg-white/90 p-7 shadow-[0_18px_55px_rgba(48,100,159,0.10)] backdrop-blur-sm sm:p-8">
          <h2 className="text-[27px] font-extrabold tracking-[-0.055em] text-[#101a46]">
            Welcome Back <span aria-hidden="true">👋</span>
          </h2>
          <p className="mt-1 text-sm leading-5 text-[#64799a]">
            Sign in to your Billomax account and manage your business billing
            from one place.
          </p>

          <form onSubmit={handleSubmit} className="mt-7">
            <label
              htmlFor="username"
              className="mb-1.5 block text-[11px] font-extrabold text-[#26365e]"
            >
              USERNAME
            </label>
            <div className="flex h-12 items-center gap-3 rounded-[10px] border border-[#dce3ed] bg-white px-3.5 shadow-[0_2px_5px_rgba(26,54,93,0.05)] focus-within:border-blue-400">
              <UserRound size={19} className="shrink-0 fill-[#a7b5ca] text-[#a7b5ca]" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1b2b51] outline-none placeholder:text-[#a4b1c5]"
              />
            </div>

            <div className="mb-1.5 mt-5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-extrabold text-[#26365e]"
              >
                PASSWORD
              </label>
              <a
                href="#forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </a>
            </div>
            <div className="flex h-12 items-center gap-3 rounded-[10px] border border-[#dce3ed] bg-white px-3.5 shadow-[0_2px_5px_rgba(26,54,93,0.05)] focus-within:border-blue-400">
              <LockKeyhole size={18} className="shrink-0 fill-[#a7b5ca] text-[#a7b5ca]" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1b2b51] outline-none placeholder:text-[#a4b1c5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-[#90a0b8] hover:text-[#52698f]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs text-[#435778]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-[18px] w-[18px] accent-[#1764f5]"
              />
              Remember me
            </label>

            <button
              type="submit"
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#ff510c] to-[#ff4b05] text-sm font-bold text-white shadow-[0_5px_12px_rgba(255,81,12,0.17)] transition hover:brightness-95"
            >
              Login to Dashboard
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="my-3 flex items-center gap-3 text-xs text-[#8392aa]">
            <span className="h-px flex-1 bg-[#e4eaf2]" />
            or
            <span className="h-px flex-1 bg-[#e4eaf2]" />
          </div>

          <button
            type="button"
            onClick={fillDemoCredentials}
            className="flex min-h-[65px] w-full items-center gap-2.5 rounded-[11px] border border-[#e5f0fb] bg-[#f0f8ff] px-3.5 text-left transition hover:bg-[#e8f4ff]"
          >
            <KeyRound size={22} className="shrink-0 text-amber-500" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#34517f]">
                Demo Access
              </span>
              <span className="mt-0.5 block text-[10px] leading-4 text-[#7386a4]">
                Click any business to explore (credentials auto-fill)
              </span>
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-blue-500">
              <ChevronRight size={17} strokeWidth={3} />
            </span>
          </button>

          <p className="mt-6 text-center text-xs text-[#8292ad]">
            Not registered yet?{" "}
            <a
              href="#register"
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              Create account
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}