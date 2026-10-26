
import React, { useMemo, useState } from "react";
import {
  Users, Building2, Package, TicketPercent, Settings, MessageSquare,
  UserPlus, ChartNoAxesColumn, ArrowRight, ShoppingCart, Menu, X,
  CalendarDays, TrendingUp, RefreshCw, ShieldCheck, ChevronDown,
  Search, Plus, Download, Pencil, Trash2, CheckCircle2, Clock,
  Mail, CreditCard, Database, Code2, Bell, MapPin, Save, Send,
  Eye, Power, Filter, FileText, Globe, Briefcase, Wallet, LockKeyhole,
} from "lucide-react";
import AddBusiness from "../Website/AddBusiness.jsx";
import AddNewPackage from "../Website/AddNewPackage.jsx";
import AddNewCoupon from "../Website/AddNewCoupon.jsx";

const NAV_ITEMS = [
  { label: "Superadmin", icon: Users },
  { label: "All Businesses", icon: Building2 },
  { label: "Package Subscription", icon: Package },
  { label: "Packages", icon: Package },
  { label: "Coupons", icon: TicketPercent },
  { label: "Super Admin Settings", icon: Settings },
  { label: "Communicator", icon: MessageSquare },
];

const PERIODS = ["Today", "This Week", "This Month", "This Year"];

const SUBSCRIPTION_DATA = {
  Today: [{ month: "Today", value: 0 }],
  "This Week": [
    { month: "Mon", value: 0 }, { month: "Tue", value: 0 },
    { month: "Wed", value: 0 }, { month: "Thu", value: 0 },
    { month: "Fri", value: 0 }, { month: "Sat", value: 0 },
    { month: "Sun", value: 0 },
  ],
  "This Month": [
    { month: "Week 1", value: 0 }, { month: "Week 2", value: 0 },
    { month: "Week 3", value: 0 }, { month: "Week 4", value: 0 },
  ],
  "This Year": [
    { month: "Nov-2025", value: 10000 },
    { month: "Dec-2025", value: 40000 },
    { month: "Jan-2026", value: 5000 },
  ],
};

const BUSINESS_ROWS = [
  {
    registered: "09/10/2026 11:18",
    name: "fikron1995",
    owner: "fikron1995",
    email: "admin@admin.com",
    phone: "",
    address: "fikron1995, fikron1995, Indonesia fikron1995, fikron1",
    status: "Active",
    subscription: "",
    createdBy: "",
  },
  {
    registered: "07/03/2026 13:21",
    name: "Mache Bhate Bangali Hotel",
    owner: "Mr Jabair Ahmed",
    email: "machebhatebangalihotel@gmail.com",
    phone: "7204403123",
    address: "Bangalore, Karnataka, India No. 493/3, 2nd Floor, Old Airport Road, Opp G D Bar, Kodihalli, 560008",
    status: "Active",
    subscription: "",
    createdBy: "",
  },
  {
    registered: "10/15/2024 15:16",
    name: "Multi-Service Center",
    owner: "Mr Multi-Service Center",
    email: "multiservices@gmail.com",
    phone: "8574985868, 7485256359",
    address: "Bangalore, Karnataka, India JP Nagar, Kumarswamy Layout, Bangalore, 560078",
    status: "Active",
    subscription: "",
    createdBy: "Mr Admin",
  },
  {
    registered: "10/15/2024 15:08",
    name: "Pharmacy",
    owner: "Mr pharmacy",
    email: "khanaiamit.m9@gmail.com",
    phone: "7485968575, 7485768574",
    address: "Bengaluru, Karnataka, India JP Nagar, Kumarswamy Layout, Bengaluru, 591313",
    status: "Active",
    subscription: "",
    createdBy: "Mr Admin",
  },
  {
    registered: "10/15/2024 15:08",
    name: "Pharmacy",
    owner: "Mr pharmacy",
    email: "khanaiamit.m9@gmail.com",
    phone: "",
    address: ", , ,",
    status: "Active",
    subscription: "",
    createdBy: "Mr Admin",
  },
  {
    registered: "10/15/2024 15:08",
    name: "Pharmacy",
    owner: "Mr pharmacy",
    email: "khanaiamit.m9@gmail.com",
    phone: "",
    address: ", , ,",
    status: "Active",
    subscription: "",
    createdBy: "Mr Admin",
  },
];

const SUBSCRIPTION_ROWS = [
  {
    business: "Multi-Service Center",
    package: "Starter",
    status: "Approved",
    created: "01/27/2026 13:26",
    start: "01/27/2026",
    trialEnd: "02/18/2026",
    end: "02/03/2026",
    coupon: "",
    original: "₹ 0.00",
    paid: "₹ 0.00",
    via: "",
    transaction: "FREE",
  },
  {
    business: "Multi-Service Center",
    package: "Basic",
    status: "Waiting",
    created: "01/27/2026 13:27",
    start: "",
    trialEnd: "",
    end: "",
    coupon: "",
    original: "₹ 5,000.00",
    paid: "₹ 5,000.00",
    via: "offline",
    transaction: "",
  },
];

const PACKAGES = [
  {
    name: "Starter", price: "Free for 7 Days", amount: 0, period: "",
    locations: "1 Business Locations", users: "3 Users",
    products: "30 Products", invoices: "100 Invoices", trial: "15 Trial Days",
    description: "Perfect for small businesses starting digital billing. Includes 1 Business Location, 3 Users, and 30 Products. Generate 100 invoices/month for smooth sales management. Enjoy a 15-day free trial with full access, no credit card needed. Start simple, grow confidently with tools designed to make billing effortless.",
  },
  {
    name: "Basic", price: "₹ 5,000.00", amount: 5000, period: "1 Months",
    locations: "3 Business Locations", users: "5 Users",
    products: "Unlimited Products", invoices: "Unlimited Invoices",
    description: "Ideal for growing businesses with multiple locations and more staff. Includes 3 Business Locations, 5 Users, and 100 Products. Generate 2,000 invoices/month to keep operations smooth. Access advanced reports and enjoy priority email support, ensuring your team stays informed and your business runs efficiently at every step.",
  },
  {
    name: "Standard", price: "₹ 10,000.00", amount: 10000, period: "1 Months",
    locations: "5 Business Locations", users: "10 Users",
    products: "Unlimited Products", invoices: "Unlimited Invoices",
    description: "A solid choice for established businesses needing more power and flexibility. Includes 5 Business Locations, 10 Users, and 500 Products. Generate 5,000 invoices/month with advanced inventory tracking for better control. Enjoy priority support and custom branding options to align the platform with your business identity and operations.",
  },
  {
    name: "Professional", price: "₹ 15,000.00", amount: 15000, period: "1 Months",
    locations: "Unlimited Business Locations", users: "Unlimited Users",
    products: "Unlimited Products", invoices: "Unlimited Invoices",
    description: "Designed for fast-scaling businesses needing more capacity without going full enterprise. Includes 8 Business Locations, 20 Users, and 1,000 Products. Generate 10,000 invoices/month with AI-powered sales forecasts, smart expense tracking, and automated reminders. Gain premium reports, role-based access control, and faster support to boost productivity and efficiency.",
  },
  {
    name: "Premium", price: "₹ 25,000.00", amount: 25000, period: "1 Months",
    locations: "Unlimited Business Locations", users: "Unlimited Users",
    products: "Unlimited Products", invoices: "Unlimited Invoices",
    popular: true,
    description: "Our most advanced plan for enterprises demanding power, flexibility, and automation. Access via web or tablet from anywhere. Includes Unlimited Locations, Users, Products, and invoices. Leverage AI-driven insights, predictive forecasts, smart stock alerts, and automated follow-ups. Enjoy enterprise-grade security, dedicated account management, custom integrations, and 24/7 premium support.",
  },
  {
    name: "basic", price: "₹ 5,000.00", amount: 5000, period: "1 Years",
    locations: "Unlimited Business Locations", users: "Unlimited Users",
    products: "Unlimited Products", invoices: "Unlimited Invoices",
    description: "yearly plan",
  },
];

const SETTINGS_TABS = [
  { label: "Super Admin Settings", icon: Briefcase },
  { label: "Application Settings", icon: Settings },
  { label: "Email/SMTP Settings", icon: Mail },
  { label: "Payment Gateways", icon: CreditCard },
  { label: "Backup", icon: Database },
  { label: "Cron Jobs", icon: Clock },
  { label: "Pusher Settings", icon: Bell },
  { label: "Additional Javascript and CSS", icon: Code2 },
];

const DEFAULT_SETTINGS = {
  "Super Admin Settings": {
    "Business Name": "WDM - Billing Software",
    Email: "superadmin@example.com",
    Currency: "India - Rupees(INR)",
    Landmark: "Kumarswamy Layout, Banglore - 560078",
    "Zip Code": "560078",
    State: "Karnataka",
    City: "Bangalore",
    Country: "India",
    "Min days for subscription expiry alert": "10",
  },
  "Application Settings": {
    "App Name": "Billomax - Your Trusted Partner in Billing & Invoicing",
    "App Title": "Billomax - Your Trusted Partner in Billing & Invoicing",
    "App Default Language": "English",
    "Allow Registration": true,
    "Enable Terms & Conditions in Registration": false,
    "Registration Terms & Conditions": "",
    "Google map api key": "",
  },
  "Email/SMTP Settings": {
    "Mail Driver": "SMTP",
    Host: "smtp.gmail.com",
    Port: "587",
    Username: "info.billomax@gmail.com",
    Password: "",
    Encryption: "tls",
    "From Address": "info.billomax@gmail.com",
    "From Name": "Billomax - Your Trusted Partner in Billing & Invoicing",
    "Allow businesses to use Superadmin email configuration": false,
    "Enable new business registration email": false,
    "Enable new subscription email": false,
    "Enable welcome email to new business": false,
    "Welcome email subject": "",
    "Welcome email body": "",
  },
  "Payment Gateways": {
    "Enable Offline Payment": true,
    "Offline payment details": "",
    "Stripe Pub Key": "",
    "Stripe Secret Key": "",
    "PayPal Mode": "Sandbox",
    "Paypal client id": "",
    "Paypal app secret": "",
    "Razorpay Key ID": "",
    "Razorpay Key Secret": "",
    "Pesapal Consumer Key": "",
    "Pesapal Consumer Secret": "",
    "Paystack Public key": "",
    "Paystack Secret key": "",
    "Flutterwave Public key": "",
    "Flutterwave Secret key": "",
    "Flutterwave Encryption key": "",
    "Myfatoorah Api key": "",
    "Myfatoorah Country iso": "KWT",
    "Myfatoorah Is Test?": "False",
  },
  Backup: { "Backup Disk": "Local" },
  "Cron Jobs": {},
  "Pusher Settings": {
    "PUSHER APP ID": "",
    "PUSHER APP KEY": "",
    "PUSHER APP SECRET": "",
    "PUSHER APP CLUSTER": "",
  },
  "Additional Javascript and CSS": {
    "Additional Javascript": "",
    "Additional CSS": "",
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");
const currency = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
const toDateInputValue = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : "";
};
const toDisplayDate = (value) => {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[2]}/${match[3]}/${match[1]}` : value;
};

function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-[#FF711A] text-white shadow-sm hover:bg-[#F04A13] hover:shadow-md",
    secondary: "border border-[#E8EDF4] bg-white text-[#19366F] hover:border-[#FF8A37] hover:bg-[#FFF1E5]",
    danger: "border border-[#F3D5CE] bg-white text-[#C34B34] hover:bg-[#FFF1EC]",
    success: "bg-[#218838] text-white hover:bg-[#176B2A]",
    blue: "bg-[#4276B5] text-white hover:bg-[#345F94]",
  };
  return (
    <button
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={cx(
        "rounded-2xl border border-[#F8EBDD] bg-white/95 p-4 shadow-[0_6px_18px_rgba(224,133,65,0.07)] sm:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}

function PageHeading({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h1 className="app-page-title text-[#10234F]">
          {title}
        </h1>
        {description && (
          <p className="app-description mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", ...props }) {
  return (
    <label className="block min-w-0">
      {label && (
        <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
          {label}
        </span>
      )}
      <input
        {...props}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm text-[#19366F] outline-none transition placeholder:text-[#8798AD] focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, ...props }) {
  return (
    <label className="block min-w-0">
      {label && (
        <span className="mb-1.5 block text-xs font-bold text-[#19366F]">
          {label}
        </span>
      )}
      <select
        {...props}
        value={value ?? ""}
        onChange={onChange}
        className="w-full rounded-xl border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm text-[#19366F] outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
      >
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetricCard({ icon: Icon, value, label, subtitle, tone = "blue", onClick }) {
  const tones = {
    blue: "bg-[#EDF4FF] text-[#4276B5]",
    orange: "bg-[#FFE9D9] text-[#F04A13]",
    green: "bg-[#EAF7ED] text-[#218838]",
    red: "bg-[#FFF1EC] text-[#C34B34]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[124px] w-full items-center gap-4 rounded-2xl border border-[#F8EBDD] bg-white/95 p-5 text-left shadow-[0_6px_18px_rgba(224,133,65,0.07)] transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", tones[tone])}>
        <Icon size={21} />
      </span>
      <span className="min-w-0">
        <span className="block text-2xl font-extrabold text-[#F04A13]">{value}</span>
        <span className="mt-1 block text-sm font-semibold text-[#19366F]">{label}</span>
        <span className="mt-1 block text-xs text-[#577B9F]">{subtitle} →</span>
      </span>
    </button>
  );
}

function SubscriptionChart({ data }) {
  const maxValue = 50000;
  const ticks = [0, 10000, 20000, 30000, 40000, 50000];
  return (
    <div className="mt-5">
      <div className="flex h-[280px] gap-3">
        <div className="flex w-10 shrink-0 flex-col justify-between pb-1 text-right text-[10px] text-[#577B9F]">
          {[...ticks].reverse().map((tick) => (
            <span key={tick}>{tick === 0 ? "0" : `${tick / 1000}k`}</span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute inset-x-0 border-t border-[#F2E8DE]"
              style={{ bottom: `${(tick / maxValue) * 100}%` }}
            />
          ))}
          <div className="absolute inset-0 flex items-end justify-around gap-2 px-2">
            {data.map((item, index) => {
              const height = (item.value / maxValue) * 100;
              return (
                <div key={`${item.month}-${index}`} className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                  {item.value > 0 && (
                    <span
                      className="absolute z-10 whitespace-nowrap rounded-md bg-[#10234F] px-2 py-1 text-[10px] font-semibold text-white"
                      style={{ bottom: `${height}%`, transform: "translateY(-5px)" }}
                    >
                      {currency(item.value)}
                    </span>
                  )}
                  <div
                    title={`${item.month}: ${currency(item.value)}`}
                    className="w-full max-w-[150px] rounded-t-md bg-[#FF9B59] transition-colors hover:bg-[#F04A13]"
                    style={{ height: `${height}%`, minHeight: item.value > 0 ? "3px" : "0px" }}
                  />
                  <span className="absolute top-full mt-3 w-full truncate text-center text-[10px] text-[#577B9F]">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-9 flex items-center justify-center gap-2 text-xs font-semibold text-[#577B9F]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF9B59]" />
        Total Subscriptions (Rupees)
      </div>
    </div>
  );
}

function DashboardHome({ onNavigate }) {
  const [period, setPeriod] = useState("This Year");
  return (
    <>
      <PageHeading
        title="Welcome Superadmin"
        description="Monitor subscriptions, business registrations, and platform revenue."
        action={
          <div className="flex flex-wrap gap-1 rounded-xl border border-[#F2E8DE] bg-white p-1">
            {PERIODS.map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={cx(
                  "rounded-lg px-3 py-2 text-xs font-bold transition",
                  period === item
                    ? "bg-[#FF711A] text-white"
                    : "text-[#577B9F] hover:bg-[#FFF1E5]"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={RefreshCw}
          value="₹ 0.00"
          label="New Subscriptions"
          subtitle="More Information"
          tone="blue"
          onClick={() => onNavigate("Package Subscription")}
        />
        <MetricCard
          icon={UserPlus}
          value="0"
          label="New Business Registrations"
          subtitle="More Information"
          tone="green"
          onClick={() => onNavigate("All Businesses")}
        />
        <MetricCard
          icon={ChartNoAxesColumn}
          value="17"
          label="Not Subscribed"
          subtitle="More Information"
          tone="red"
          onClick={() => onNavigate("All Businesses")}
        />
      </div>
      <Card className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E8DE] pb-4">
          <div>
            <h2 className="app-section-title flex items-center gap-2 text-[#10234F]">
              <span className="rounded-xl bg-[#FFE9D9] p-2 text-[#F04A13]">
                <ShoppingCart size={19} />
              </span>
              Sale - Monthly for 12 months
            </h2>
            <p className="app-description mt-1">Subscription revenue overview</p>
          </div>
          <span className="rounded-full bg-[#FFE9D9] px-3 py-2 text-xs font-bold text-[#F04A13]">
            <CalendarDays size={13} className="mr-1 inline" /> {period}
          </span>
        </div>
        <SubscriptionChart data={SUBSCRIPTION_DATA[period]} />
        <div className="mt-5 flex items-center justify-between border-t border-[#F2E8DE] pt-4 text-xs text-[#577B9F]">
          <span>Subscription overview</span>
          <span className="flex items-center gap-2 font-semibold text-[#577B9F]">
            <TrendingUp size={15} className="text-[#F04A13]" /> Showing: {period}
          </span>
        </div>
      </Card>
    </>
  );
}

function DataToolbar({ search, setSearch, onAdd, addLabel = "Add", children }) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[190px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..."
            className="w-full rounded-xl border border-[#E8EDF4] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10"
          />
        </label>
        {onAdd && <Button onClick={onAdd}><Plus size={15} /> {addLabel}</Button>}
      </div>
    </div>
  );
}

function StatusPill({ children, color = "green" }) {
  const styles = {
    green: "bg-[#EAF7ED] text-[#218838] ring-[#CBE9D1]",
    orange: "bg-[#FFE9D9] text-[#B85D0A] ring-[#FFD1B0]",
    blue: "bg-[#EDF4FF] text-[#4276B5] ring-[#C9DCF5]",
    red: "bg-[#FFF1EC] text-[#C34B34] ring-[#F3D5CE]",
    cyan: "bg-[#EDF4FF] text-[#4276B5] ring-[#C9DCF5]",
  };
  return (
    <span className={cx("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset", styles[color] || styles.green)}>
      {children}
    </span>
  );
}

function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#F2E8DE]">
      <table className="w-full min-w-[850px] border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  );
}

function AllBusinesses({ notify, onAddBusiness }) {
  const [rows, setRows] = useState(BUSINESS_ROWS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => rows.filter((row) => {
    const haystack = Object.values(row).join(" ").toLowerCase();
    return haystack.includes(search.toLowerCase()) &&
      (statusFilter === "All" || row.status === statusFilter);
  }), [rows, search, statusFilter]);

  return (
    <>
      <PageHeading title="All Businesses" description="Manage registered businesses and their subscriptions." />
      <Card>
        <DataToolbar
          search={search}
          setSearch={setSearch}
          onAdd={onAddBusiness}
          addLabel="Add Business"
        >
          <SelectField
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={["All", "Active", "Inactive"].map((value) => ({ value, label: `${value} Status` }))}
          />
          <Button variant="secondary" onClick={() => notify("CSV export can be connected to your API.")}>
            <Download size={14} /> Export CSV
          </Button>
        </DataToolbar>

        <TableWrap>
          <thead className="bg-[#FFF7EF] text-[#19366F]">
            <tr>
              {["Registered on", "Business Name", "Owner", "Email", "Owner number", "Business contact numbers / Address", "Status", "Current Subscription", "Created By", "Action"].map((title) => (
                <th key={title} className="border-b border-[#F2E8DE] px-3 py-3 font-bold">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, index) => (
              <tr key={`${row.name}-${index}`} className="border-b border-[#F2E8DE] align-top last:border-0 hover:bg-[#FFF7EF]">
                <td className="px-3 py-3 text-[#577B9F]">{row.registered}</td>
                <td className="px-3 py-3 font-bold text-[#10234F]">{row.name}</td>
                <td className="px-3 py-3">{row.owner}</td>
                <td className="px-3 py-3">{row.email}</td>
                <td className="px-3 py-3">{row.phone || "—"}</td>
                <td className="max-w-[220px] whitespace-normal px-3 py-3">{row.address}</td>
                <td className="px-3 py-3"><StatusPill>{row.status}</StatusPill></td>
                <td className="px-3 py-3">{row.subscription || "—"}</td>
                <td className="px-3 py-3">{row.createdBy || "—"}</td>
                <td className="px-3 py-3">
                  <div className="flex min-w-[210px] flex-wrap gap-1.5">
                    <Button variant="secondary" onClick={() => notify(`Manage ${row.name}`)}>Manage</Button>
                    <Button variant="secondary" onClick={() => notify(`Add subscription for ${row.name}`)}>Add Subscription</Button>
                    <Button variant="danger" onClick={() => setRows((prev) => prev.map((item, i) => i === index ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item))}>
                      {row.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="danger" onClick={() => {
                      if (window.confirm(`Delete ${row.name}?`)) {
                        setRows((prev) => prev.filter((_, i) => i !== index));
                      }
                    }}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="px-3 py-10 text-center text-[#8798AD]">No matching businesses found.</td></tr>
            )}
          </tbody>
        </TableWrap>
        <p className="app-description mt-3">
          Showing {filtered.length ? 1 : 0} to {filtered.length} of {filtered.length} displayed records.
          The screenshots indicate 28 businesses overall; only the visible records are included here.
        </p>
      </Card>
    </>
  );
}

function PackageSubscriptions({ notify }) {
  const [rows, setRows] = useState(SUBSCRIPTION_ROWS);
  const [search, setSearch] = useState("");
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const filtered = rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()));

  const openEditor = (row) => {
    setEditingSubscription({
      row,
      start: toDateInputValue(row.start),
      trialEnd: toDateInputValue(row.trialEnd),
      end: toDateInputValue(row.end),
    });
  };

  const saveDates = (event) => {
    event.preventDefault();
    setRows((currentRows) =>
      currentRows.map((row) =>
        row === editingSubscription.row
          ? {
              ...row,
              start: toDisplayDate(editingSubscription.start),
              trialEnd: toDisplayDate(editingSubscription.trialEnd),
              end: toDisplayDate(editingSubscription.end),
            }
          : row
      )
    );
    setEditingSubscription(null);
    notify("Subscription dates updated.");
  };

  const saveStatus = (event) => {
    event.preventDefault();
    setRows((currentRows) =>
      currentRows.map((row) =>
        row === editingStatus.row
          ? {
              ...row,
              status: editingStatus.status,
              transaction: editingStatus.transaction,
            }
          : row
      )
    );
    setEditingStatus(null);
    notify("Subscription status and transaction ID updated.");
  };

  return (
    <>
      <PageHeading title="Package Subscription" description="Review package assignments, billing status, and subscription periods." />
      <Card>
        <DataToolbar search={search} setSearch={setSearch}>
          <Button variant="secondary" onClick={() => notify("CSV export can be connected to your API.")}><Download size={14} /> Export CSV</Button>
          <Button variant="secondary" onClick={() => window.print()}><FileText size={14} /> Print</Button>
        </DataToolbar>
        <TableWrap>
          <thead className="bg-[#FFF7EF] text-[#19366F]">
            <tr>
              {["Business Name", "Package Name", "Status", "Created At", "Start Date", "Trial End Date", "End Date", "Coupon code", "Original price", "Paid Amount", "Paid Via", "Transaction Id", "Action"].map((title) => (
                <th key={title} className="border-b border-[#F2E8DE] px-3 py-3 font-bold">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, index) => (
              <tr key={`${row.business}-${row.package}`} className="border-b border-[#F2E8DE] align-top last:border-0 hover:bg-[#FFF7EF]">
                <td className="px-3 py-3 font-semibold">{row.business}</td>
                <td className="px-3 py-3">{row.package}</td>
                <td className="px-3 py-3">
                  <StatusPill
                    color={
                      row.status === "Approved"
                        ? "green"
                        : row.status === "Declined"
                          ? "red"
                          : "orange"
                    }
                  >
                    {row.status}
                  </StatusPill>
                </td>
                <td className="px-3 py-3">{row.created}</td>
                <td className="px-3 py-3">{row.start || "—"}</td>
                <td className="px-3 py-3">{row.trialEnd || "—"}</td>
                <td className="px-3 py-3">{row.end || "—"}</td>
                <td className="px-3 py-3">{row.coupon || "—"}</td>
                <td className="px-3 py-3">{row.original}</td>
                <td className="px-3 py-3">{row.paid}</td>
                <td className="px-3 py-3">{row.via || "—"}</td>
                <td className="px-3 py-3">{row.transaction || "—"}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-1.5">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setEditingStatus({
                          row,
                          status: row.status,
                          transaction: row.transaction || "",
                        })
                      }
                    >
                      <CheckCircle2 size={13} /> Status
                    </Button>
                    <Button variant="primary" onClick={() => openEditor(row)}><Pencil size={13} /> Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <p className="app-description mt-3">Showing {filtered.length} of {rows.length} displayed subscriptions.</p>
      </Card>
      {editingStatus && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingStatus(null);
            }
          }}
        >
          <form
            onSubmit={saveStatus}
            className="w-full max-w-lg rounded-2xl border border-[#F8EBDD] bg-white p-5 shadow-2xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-subscription-status-title"
          >
            <div className="mb-5">
              <h2 id="edit-subscription-status-title" className="app-section-title text-[#10234F]">
                Update Subscription Status
              </h2>
              <p className="app-description mt-1 text-[#577B9F]">
                {editingStatus.row.business} · {editingStatus.row.package}
              </p>
            </div>
            <div className="space-y-4">
              <SelectField
                label="Status"
                value={editingStatus.status}
                onChange={(event) =>
                  setEditingStatus((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                options={["Approved", "Declined", "Waiting"]}
              />
              <Input
                label="Transaction ID"
                value={editingStatus.transaction}
                onChange={(event) =>
                  setEditingStatus((current) => ({
                    ...current,
                    transaction: event.target.value,
                  }))
                }
                placeholder="Enter transaction ID"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-[#F2E8DE] pt-4">
              <Button variant="secondary" type="button" onClick={() => setEditingStatus(null)}>
                Cancel
              </Button>
              <Button type="submit"><Save size={14} /> Save Changes</Button>
            </div>
          </form>
        </div>
      )}
      {editingSubscription && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingSubscription(null);
            }
          }}
        >
          <form
            onSubmit={saveDates}
            className="w-full max-w-lg rounded-2xl border border-[#F8EBDD] bg-white p-5 shadow-2xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-subscription-title"
          >
            <div className="mb-5">
              <h2 id="edit-subscription-title" className="app-section-title text-[#10234F]">
                Edit Subscription Dates
              </h2>
              <p className="app-description mt-1 text-[#577B9F]">
                {editingSubscription.row.business} · {editingSubscription.row.package}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Date"
                type="date"
                value={editingSubscription.start}
                onChange={(event) =>
                  setEditingSubscription((current) => ({
                    ...current,
                    start: event.target.value,
                  }))
                }
              />
              <Input
                label="Trial End Date"
                type="date"
                value={editingSubscription.trialEnd}
                onChange={(event) =>
                  setEditingSubscription((current) => ({
                    ...current,
                    trialEnd: event.target.value,
                  }))
                }
              />
              <Input
                label="End Date"
                type="date"
                value={editingSubscription.end}
                onChange={(event) =>
                  setEditingSubscription((current) => ({
                    ...current,
                    end: event.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-[#F2E8DE] pt-4">
              <Button variant="secondary" type="button" onClick={() => setEditingSubscription(null)}>
                Cancel
              </Button>
              <Button type="submit"><Save size={14} /> Save Dates</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function PackagesPage({ packages, setPackages, onAddPackage, onEditPackage }) {

  return (
    <>
      <PageHeading
        title="Packages"
        description="Manage subscription plans, prices, limits, and included features."
        action={<Button onClick={onAddPackage}><Plus size={15} /> Add Package</Button>}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((item, index) => (
          <article key={`${item.name}-${index}`} className="overflow-hidden rounded-2xl border border-[#F8EBDD] border-t-4 border-t-[#218838] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)] transition hover:-translate-y-1 hover:shadow-md">
            <div className="border-b border-[#F2E8DE] p-5 text-center">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg font-extrabold text-[#10234F]">{item.name}</h2>
                {item.popular && <StatusPill color="orange">Popular</StatusPill>}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2">
                <StatusPill>Active</StatusPill>
                <button title="Edit package" onClick={() => onEditPackage(item, index)} className="rounded-lg p-1.5 text-[#8798AD] hover:bg-[#FFF1E5] hover:text-[#F04A13]"><Pencil size={14} /></button>
                <button title="Delete package" onClick={() => {
                  if (window.confirm(`Delete package ${item.name}?`)) setPackages((prev) => prev.filter((_, i) => i !== index));
                }} className="rounded-lg p-1.5 text-[#8798AD] hover:bg-[#FFF1EC] hover:text-[#C34B34]"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="border-b border-[#F2E8DE] p-5 text-center">
              <ul className="space-y-1 text-xs text-[#577B9F]">
                {[item.locations, item.users, item.products, item.invoices, item.trial].filter(Boolean).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="mt-4 text-xl font-extrabold text-[#F04A13]">{item.price}</p>
              {item.period && <p className="text-[11px] text-[#8798AD]">/ {item.period}</p>}
            </div>
            <p className="p-5 text-center text-xs leading-5 text-[#577B9F]">{item.description}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function CouponsPage({ coupons, setCoupons, notify, onAddCoupon }) {
  const [search, setSearch] = useState("");
  const filtered = coupons.filter((item) => Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeading title="All Coupons" description="Create and manage discount coupons for packages and businesses." action={<Button onClick={onAddCoupon}><Plus size={15} /> Add Coupon</Button>} />
      <Card>
        <DataToolbar search={search} setSearch={setSearch}>
          <Button variant="secondary" onClick={() => notify("CSV export can be connected to your API.")}><Download size={14} /> Export CSV</Button>
        </DataToolbar>
        <TableWrap>
          <thead className="bg-[#FFF7EF] text-[#19366F]">
            <tr>
              {["Coupon code", "Discount type", "Discount", "Expiry date", "Applied on packages", "Applied on business", "Status", "Created at", "Action"].map((title) => (
                <th key={title} className="border-b border-[#F2E8DE] px-3 py-3 font-bold">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, index) => (
              <tr key={`${row.code}-${index}`} className="border-b border-[#F2E8DE] last:border-0 hover:bg-[#FFF7EF]">
                <td className="px-3 py-3 font-bold">{row.code}</td>
                <td className="px-3 py-3">{row.type}</td>
                <td className="px-3 py-3">{row.discount}</td>
                <td className="px-3 py-3">{row.expiry}</td>
                <td className="px-3 py-3">{row.packages}</td>
                <td className="px-3 py-3">{row.business}</td>
                <td className="px-3 py-3"><StatusPill>{row.status}</StatusPill></td>
                <td className="px-3 py-3">{row.created}</td>
                <td className="px-3 py-3"><Button variant="danger" onClick={() => setCoupons((prev) => prev.filter((_, i) => i !== index))}><Trash2 size={13} /> Delete</Button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="px-3 py-10 text-center text-[#8798AD]">No data available in table</td></tr>}
          </tbody>
        </TableWrap>
        <p className="app-description mt-3">Showing {filtered.length} to {filtered.length} of {filtered.length} entries</p>
      </Card>
    </>
  );
}

function SettingsPage({ notify }) {
  const [activeTab, setActiveTab] = useState("Super Admin Settings");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingSearch, setSettingSearch] = useState("");

  const current = settings[activeTab] || {};
  const entries = Object.entries(current).filter(([key]) => key.toLowerCase().includes(settingSearch.toLowerCase()));

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value },
    }));
  };

  const renderSettingField = ([key, value]) => {
    if (typeof value === "boolean") {
      return (
        <label key={key} className="flex items-center gap-3 rounded-xl border border-[#F2E8DE] p-3 text-sm font-medium text-[#19366F]">
          <input type="checkbox" checked={value} onChange={(event) => updateSetting(key, event.target.checked)} className="h-4 w-4 accent-[#FF711A]" />
          {key}
        </label>
      );
    }

    if (key === "Registration Terms & Conditions" || key.includes("body") || key.includes("details") || key.includes("Javascript") || key.includes("CSS")) {
      return (
        <label key={key} className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#19366F]">{key}</span>
          <textarea value={value} onChange={(event) => updateSetting(key, event.target.value)} rows={key.includes("Javascript") || key.includes("CSS") ? 7 : 4} className="w-full rounded-xl border border-[#E8EDF4] px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10" />
        </label>
      );
    }

    if (key === "Currency") {
      return <SelectField key={key} label={key} value={value} onChange={(event) => updateSetting(key, event.target.value)} options={["India - Rupees(INR)", "US Dollar(USD)", "Euro(EUR)", "British Pound(GBP)"]} />;
    }

    if (key === "Mail Driver") {
      return <SelectField key={key} label={key} value={value} onChange={(event) => updateSetting(key, event.target.value)} options={["SMTP", "Sendmail", "Mailgun", "Postmark"]} />;
    }

    if (key === "PayPal Mode") {
      return <SelectField key={key} label={key} value={value} onChange={(event) => updateSetting(key, event.target.value)} options={["Sandbox", "Live"]} />;
    }

    if (key.includes("Country iso")) {
      return <SelectField key={key} label={key} value={value} onChange={(event) => updateSetting(key, event.target.value)} options={["KWT", "IND", "USA", "GBR"]} />;
    }

    const isSecret = /password|secret|key/i.test(key);
    return (
      <Input
        key={key}
        label={key}
        type={isSecret ? "password" : "text"}
        value={value}
        onChange={(event) => updateSetting(key, event.target.value)}
        placeholder={key}
      />
    );
  };

  return (
    <>
      <PageHeading title="Super Admin Settings" description="Manage platform identity, email, payment, backups, and integrations." />
      <div className="mb-4 flex items-center gap-2">
        <Search size={16} className="text-[#8798AD]" />
        <input value={settingSearch} onChange={(event) => setSettingSearch(event.target.value)} placeholder="Search settings..." className="w-full max-w-2xl rounded-xl border border-[#E8EDF4] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10" />
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
        <Card className="p-2">
          <nav className="space-y-1" aria-label="Settings sections">
            {SETTINGS_TABS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={cx(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition",
                  activeTab === label ? "bg-[#FF711A] text-white shadow-sm" : "text-[#577B9F] hover:bg-[#FFF1E5] hover:text-[#19366F]"
                )}
              >
                <Icon size={17} /> {label}
              </button>
            ))}
          </nav>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-3 border-b border-[#F2E8DE] pb-4">
            <span className="rounded-xl bg-[#FFE9D9] p-2.5 text-[#F04A13]">
              {React.createElement(SETTINGS_TABS.find((item) => item.label === activeTab)?.icon || Settings, { size: 20 })}
            </span>
            <div>
              <h2 className="font-extrabold text-[#10234F]">{activeTab}</h2>
              <p className="app-description text-xs">Edit configuration values and save your changes.</p>
            </div>
          </div>

          {activeTab === "Cron Jobs" ? (
            <div className="rounded-xl border border-[#F8EBDD] bg-[#FFF7EF] p-4 text-sm leading-6 text-[#577B9F]">
              <p className="font-semibold text-[#10234F]">To send subscription expiry alerts and run automated application backups, set up a cron job with this command:</p>
              <code className="my-3 block overflow-x-auto rounded-lg bg-white p-3 text-xs text-[#C34B34]">
                * * * * * php /var/www/vhosts/billomax.com/httpdocs/artisan schedule:run &gt;&gt; /dev/null 2&gt;&amp;1
              </code>
              <p>Set it in the cron jobs tab in cPanel or DirectAdmin or a similar panel.</p>
              <p>Or edit crontab if using cloud/dedicated hosting.</p>
              <p>Contact hosting for help with cron job settings.</p>
            </div>
          ) : activeTab === "Payment Gateways" ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#F8EBDD] bg-[#FFF7EF] p-3 text-xs leading-5 text-[#577B9F]">
                Configure offline payment, Stripe, PayPal, Razorpay, Pesapal, Paystack, Flutterwave, and Myfatoorah.
                Use the provider's official dashboard to obtain keys. Secret values are left blank where they were not provided.
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{entries.map(renderSettingField)}</div>
              <div className="rounded-xl border border-[#F3D5CE] bg-[#FFF1EC] p-3 text-xs text-[#C34B34]">
                Important: set PayPal to Live for actual payments. Sandbox is for testing only.
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {entries.map(renderSettingField)}
            </div>
          )}

          <div className="mt-6 flex justify-end border-t border-[#F2E8DE] pt-4">
            <Button onClick={() => notify("Settings are updated in the current page state. Connect your backend API to persist them.")}>
              <Save size={15} /> Update Settings
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

function CommunicatorPage({ notify }) {
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const sendMessage = () => {
    if (!recipients.length || !subject.trim() || !message.trim()) {
      notify("Select at least one recipient and enter a subject and message.");
      return;
    }
    setHistory((prev) => [{
      subject,
      message,
      date: new Date().toLocaleString(),
      recipients: recipients.join(", "),
    }, ...prev]);
    setSubject("");
    setMessage("");
    setRecipients([]);
    notify("Message added to the page history. Connect your mail/API service to send it externally.");
  };

  const toggleRecipient = (name) => {
    setRecipients((prev) => prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]);
  };

  const filteredHistory = history.filter((item) => `${item.subject} ${item.message} ${item.date}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeading title="Communicator" description="Compose announcements and review message history." />
      <Card className="mb-5">
        <h2 className="app-section-title mb-4 flex items-center gap-2 text-[#F04A13]">
          <MessageSquare size={19} /> Compose Message
        </h2>
        <div className="rounded-xl border border-[#F2E8DE] p-4">
          <div className="mb-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#19366F]">Recipients: *</span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setRecipients(["All Businesses"])}>Select all</Button>
                <Button variant="secondary" onClick={() => setRecipients([])}>Deselect all</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All Businesses", "Active Businesses", "Unsubscribed Businesses"].map((item) => (
                <button key={item} onClick={() => toggleRecipient(item)} className={cx("rounded-full border px-3 py-1.5 text-xs font-semibold", recipients.includes(item) ? "border-[#FFD1B0] bg-[#FFE9D9] text-[#B85D0A]" : "border-[#E8EDF4] text-[#577B9F]")}>{item}</button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Input label="Subject: *" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Enter message subject" />
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#19366F]">Message: *</span>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={9} placeholder="Write your message here..." className="w-full rounded-xl border border-[#E8EDF4] px-3 py-3 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10" />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={sendMessage}><Send size={15} /> Send</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="app-section-title flex items-center gap-2 text-[#F04A13]">
            <Clock size={19} /> Message History
          </h2>
          <label className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8798AD]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search..." className="rounded-xl border border-[#E8EDF4] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FF8A37] focus:ring-2 focus:ring-[#FF8A37]/10" />
          </label>
        </div>
        <TableWrap>
          <thead className="bg-[#FFF7EF] text-[#19366F]">
            <tr>
              {["Subject", "Message", "Recipients", "Date"].map((title) => (
                <th key={title} className="border-b border-[#F2E8DE] px-3 py-3 font-bold">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item, index) => (
              <tr key={`${item.subject}-${index}`} className="border-b border-[#F2E8DE] hover:bg-[#FFF7EF]">
                <td className="px-3 py-3 font-semibold">{item.subject}</td>
                <td className="max-w-md whitespace-pre-wrap px-3 py-3">{item.message}</td>
                <td className="px-3 py-3">{item.recipients}</td>
                <td className="px-3 py-3">{item.date}</td>
              </tr>
            ))}
            {filteredHistory.length === 0 && <tr><td colSpan={4} className="px-3 py-10 text-center text-[#8798AD]">No data available in table</td></tr>}
          </tbody>
        </TableWrap>
        <p className="app-description mt-3">Showing {filteredHistory.length} to {filteredHistory.length} of {filteredHistory.length} entries</p>
      </Card>
    </>
  );
}

export default function SuperAdminDashboard() {
  const [activeNav, setActiveNav] = useState("Superadmin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [addingBusiness, setAddingBusiness] = useState(false);
  const [addingPackage, setAddingPackage] = useState(false);
  const [addingCoupon, setAddingCoupon] = useState(false);
  const [packages, setPackages] = useState(PACKAGES);
  const [coupons, setCoupons] = useState([]);
  const [editingPackageIndex, setEditingPackageIndex] = useState(null);

  const navigateTo = (label) => {
    setActiveNav(label);
    setMobileMenuOpen(false);
    setNotice("");
  };

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4000);
  };

  const activeItem = NAV_ITEMS.find((item) => item.label === activeNav) || NAV_ITEMS[0];

  if (addingBusiness) {
    return (
      <AddBusiness
        onBack={() => {
          window.scrollTo(0, 0);
          setAddingBusiness(false);
        }}
      />
    );
  }

  if (addingPackage) {
    const packageToEdit =
      editingPackageIndex === null ? null : packages[editingPackageIndex];
    const numberFromLabel = (value) => {
      const match = value?.match(/\d+/);
      return match ? match[0] : "0";
    };
    const intervalMatch = packageToEdit?.period?.match(
      /^\s*(\d+)\s+(days|weeks|months|years)\s*$/i
    );

    return (
      <AddNewPackage
        initialData={
          packageToEdit
            ? {
                name: packageToEdit.name,
                description: packageToEdit.description,
                locations: packageToEdit.locations.toLowerCase().includes("unlimited")
                  ? "0"
                  : numberFromLabel(packageToEdit.locations),
                activeUsers: packageToEdit.users.toLowerCase().includes("unlimited")
                  ? "0"
                  : numberFromLabel(packageToEdit.users),
                products: packageToEdit.products.toLowerCase().includes("unlimited")
                  ? "0"
                  : numberFromLabel(packageToEdit.products),
                invoices: packageToEdit.invoices.toLowerCase().includes("unlimited")
                  ? "0"
                  : numberFromLabel(packageToEdit.invoices),
                priceInterval: intervalMatch?.[2]?.toLowerCase() || "",
                interval: intervalMatch?.[1] || "",
                trialDays: numberFromLabel(packageToEdit.trial),
                price: String(packageToEdit.amount ?? 0),
                isPopular: Boolean(packageToEdit.popular),
              }
            : undefined
        }
        isEditing={editingPackageIndex !== null}
        onSave={(formData) => {
          if (editingPackageIndex === null) return;
          const formatLimit = (value, label) =>
            Number(value) === 0 ? `Unlimited ${label}` : `${value} ${label}`;
          const updatedPackage = {
            ...packageToEdit,
            name: formData.name,
            description: formData.description,
            amount: formData.price,
            price:
              formData.price === 0
                ? "Free"
                : `₹ ${formData.price.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
            period: formData.interval
              ? `${formData.interval} ${formData.priceInterval}`
              : "",
            locations: formatLimit(formData.locations, "Business Locations"),
            users: formatLimit(formData.activeUsers, "Users"),
            products: formatLimit(formData.products, "Products"),
            invoices: formatLimit(formData.invoices, "Invoices"),
            trial: formData.trialDays
              ? `${formData.trialDays} Trial Days`
              : "",
            popular: formData.isPopular,
          };
          setPackages((current) =>
            current.map((item, index) =>
              index === editingPackageIndex ? updatedPackage : item
            )
          );
          setAddingPackage(false);
          setEditingPackageIndex(null);
          window.scrollTo(0, 0);
        }}
        onBack={() => {
          window.scrollTo(0, 0);
          setAddingPackage(false);
          setEditingPackageIndex(null);
        }}
      />
    );
  }

  if (addingCoupon) {
    return (
      <AddNewCoupon
        onBack={() => {
          window.scrollTo(0, 0);
          setAddingCoupon(false);
        }}
        onSave={(coupon) => {
          setCoupons((current) => [
            {
              code: coupon.couponCode,
              type:
                coupon.discountType === "percentage"
                  ? "Percentage"
                  : "Fixed Amount",
              discount: coupon.discount,
              expiry: coupon.expiryDate || "—",
              packages: coupon.appliedPackages || "—",
              business: coupon.appliedBusiness || "—",
              status: coupon.isActive ? "Active" : "Inactive",
              created: new Date().toLocaleDateString("en-GB"),
            },
            ...current,
          ]);
          setAddingCoupon(false);
          window.scrollTo(0, 0);
          notify("Coupon added to this page.");
        }}
      />
    );
  }

  return (
    <main className="min-h-0 flex-1 bg-[#FFFAF5] p-3 font-sans text-[#10234F] sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="relative z-20 rounded-2xl border border-[#F8EBDD] bg-white/95 shadow-[0_6px_18px_rgba(224,133,65,0.07)]">
          <div className="flex min-h-[64px] items-center justify-between gap-3 px-3 sm:px-4">
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#F04A13]">
                <ShieldCheck size={21} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-[#10234F]">Billomax</p>
                <p className="text-[10px] text-[#577B9F]">Superadmin Portal</p>
              </div>
            </div>

            <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto lg:flex" aria-label="Superadmin navigation">
              {NAV_ITEMS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigateTo(label)}
                  aria-current={activeNav === label ? "page" : undefined}
                  className={cx(
                    "flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition",
                    activeNav === label ? "bg-[#FFF1E5] font-bold text-[#F04A13]" : "text-[#577B9F] hover:bg-[#FFF7EF] hover:text-[#19366F]"
                  )}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-xl border border-[#E8EDF4] px-3 py-2 text-sm font-semibold text-[#577B9F] lg:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              <span className="max-w-[130px] truncate">{activeNav}</span>
              {!mobileMenuOpen && <ChevronDown size={14} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="grid grid-cols-1 gap-1 border-t border-[#F2E8DE] p-3 sm:grid-cols-2 lg:hidden" aria-label="Mobile superadmin navigation">
              {NAV_ITEMS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => navigateTo(label)}
                  className={cx(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition",
                    activeNav === label ? "bg-[#FFF1E5] font-bold text-[#F04A13]" : "text-[#577B9F] hover:bg-[#FFF7EF]"
                  )}
                >
                  <Icon size={17} /> {label}
                </button>
              ))}
            </nav>
          )}
        </header>

        <div className="mb-5 mt-6 flex items-center gap-2 text-xs text-[#8798AD]">
          <span>Superadmin</span>
          <ArrowRight size={12} />
          <span className="font-bold text-[#F04A13]">{activeNav}</span>
        </div>

        {notice && (
          <div role="status" className="mb-4 flex items-start gap-2 rounded-xl border border-[#FFD1B0] bg-[#FFF1E5] px-4 py-3 text-sm text-[#B85D0A]">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="ml-auto text-[#F04A13]" aria-label="Dismiss notification"><X size={16} /></button>
          </div>
        )}

        {activeNav === "Superadmin" && <DashboardHome onNavigate={navigateTo} />}
        {activeNav === "All Businesses" && (
          <AllBusinesses
            notify={notify}
            onAddBusiness={() => {
              window.scrollTo(0, 0);
              setAddingBusiness(true);
            }}
          />
        )}
        {activeNav === "Package Subscription" && <PackageSubscriptions notify={notify} />}
        {activeNav === "Packages" && (
          <PackagesPage
            packages={packages}
            setPackages={setPackages}
            onAddPackage={() => {
              window.scrollTo(0, 0);
              setEditingPackageIndex(null);
              setAddingPackage(true);
            }}
            onEditPackage={(_item, index) => {
              window.scrollTo(0, 0);
              setEditingPackageIndex(index);
              setAddingPackage(true);
            }}
          />
        )}
        {activeNav === "Coupons" && (
          <CouponsPage
            coupons={coupons}
            setCoupons={setCoupons}
            notify={notify}
            onAddCoupon={() => {
              window.scrollTo(0, 0);
              setAddingCoupon(true);
            }}
          />
        )}
        {activeNav === "Super Admin Settings" && <SettingsPage notify={notify} />}
        {activeNav === "Communicator" && <CommunicatorPage notify={notify} />}

        <footer className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-[#F2E8DE] py-4 text-center text-[11px] text-[#8798AD] sm:flex-row sm:text-left">
          <span>Billomax — Your Trusted Partner in Billing &amp; Invoicing</span>
          <span>Superadmin Portal</span>
        </footer>
      </div>
    </main>
  );
}
