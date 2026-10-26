
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import {
  Home,
  Users,
  Contact,
  Building2,
  Boxes,
  ShoppingCart,
  Truck,
  ArrowLeftRight,
  SquarePen,
  Warehouse,
  SlidersHorizontal,
  Banknote,
  ChartNoAxesColumn,
  ChevronRight,
  ChevronDown,
  Mail,
  Lightbulb,
  BriefcaseMedical,
  RefreshCw,
  Settings,
  List,
  Plus,
  Tags,
} from "lucide-react";
import {
  contactsChildren,
  productChildren,
  purchaseChildren,
  salesChildren,
  userManagementChildren,
} from "./businessOperationalMenus.js";

const reportItems = [
  "Profit / Loss Report",
  "Sales Report",
  "Purchase & Sale",
  "Tax Report",
  "Customers & Suppliers Reports",
  "Customer Reminders",
  "Customer Groups Report",
  "Stock Report",
  "Stock Adjustment Report",
  "Rack-wise Report",
  "Rack Inventory Insights",
  "Trending Products",
  "Items Report",
  "Product Purchase Report",
  "Product Sell Report",
  "Purchase Payment Report",
  "Sell Payment Report",
  "Discount-wise Report",
  "Expense Report",
  "Register Report",
  "Sales Representative Report",
  "Activity Log",
];

const menuItems = [
  { name: "Home", icon: Home },
  { name: "User Management", icon: Users, children: userManagementChildren },
  { name: "Contacts", icon: Contact, children: contactsChildren },
  { name: "Wishes", icon: Building2, expandable: true },
  { name: "Products", icon: Boxes, children: productChildren },
  { name: "Purchases", icon: ShoppingCart, children: purchaseChildren },
  { name: "Sales", icon: Truck, children: salesChildren },
  {
    name: "Stock Transfers",
    icon: Truck,
    children: [
      { name: "List Stock Transfers", icon: List },
      { name: "Add Stock Transfers", icon: Plus },
    ],
  },
  { name: "E-Way Bill", icon: ArrowLeftRight },
  { name: "Modify Bill", icon: SquarePen },
  { name: "Stocks (Expiry/Dump/Faulty)", icon: Warehouse },
  {
    name: "Stock Adjustment",
    icon: SlidersHorizontal,
    children: [
      { name: "List Stock Adjustments", icon: List },
      { name: "Add Stock Adjustments", icon: Plus },
    ],
  },
  {
    name: "Expenses",
    icon: Banknote,
    children: [
      { name: "List Expenses", icon: List },
      { name: "Add Expense", icon: Plus },
      { name: "Expense Categories", icon: Tags },
    ],
  },
  {
    name: "Reports",
    icon: ChartNoAxesColumn,
    children: reportItems.map((name) => ({ name })),
  },
  { name: "Notification Templates", icon: Mail },
  { name: "AI Offer Suggestions", icon: Lightbulb },
  {
    name: "Multi-Service Center",
    icon: BriefcaseMedical,
    children: [
      { name: "Doctors" },
      { name: "Prescriptions" },
      { name: "Batch Recalls" },
    ],
  },
  { name: "Yearly renewal", icon: RefreshCw },
  {
    name: "Settings",
    icon: Settings,
    children: [
      { name: "Business Settings" },
      { name: "Business Locations" },
      { name: "Invoice Settings" },
      { name: "Barcode Settings" },
      { name: "Receipt Printers" },
      { name: "Tax Rates" },
      { name: "Package Subscription" },
    ],
  },
];

export default function Sidebar({ activePage = "Home", onNavigate }) {
  const [expandedItems, setExpandedItems] = useState(["Expenses"]);

  useEffect(() => {
    const activeParent = menuItems.find(({ children }) =>
      children?.some(({ name }) => name === activePage)
    );

    if (activeParent) {
      setExpandedItems([activeParent.name]);
    }
  }, [activePage]);

  const navigateTo = (name) => {
    onNavigate?.(name);
  };

  const toggleExpanded = (name) => {
    setExpandedItems((current) => (current.includes(name) ? [] : [name]));
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[224px] shrink-0 flex-col self-start border-r border-[#F0EAE3] bg-[#FFFCF8] px-3 py-4 font-sans">
      {/* Multi-Service Center Header */}
      <div className="mb-5 flex h-[40px] items-center gap-2 px-1">
        <img
          src={logo}
          alt="Web Digital Mantra Logo"
          className="h-8 w-auto shrink-0 object-contain"
        />

        <span
          className="min-w-0 flex-1 truncate text-[12px] font-extrabold tracking-[-0.3px] text-[#10265F]"
          title="Multi-Service Center"
        >
          Multi-Service Center
        </span>
      </div>

      {/* Navigation */}
      <nav
        className="flex min-h-0 flex-1 flex-col gap-[2px] overflow-y-auto overflow-x-hidden pb-2"
        aria-label="Main navigation"
      >
        {menuItems.map(({ name, icon: Icon, expandable, children }) => {
          const isActive = activePage === name;
          const isExpanded = expandedItems.includes(name);
          const hasChildren = Boolean(children?.length);
          const hasActiveChild = children?.some(
            ({ name: childName }) => activePage === childName
          );

          return (
            <div key={name} className="shrink-0">
              <div
                className={`group flex min-h-[40px] w-full items-center rounded-[9px] transition-colors duration-150 ${
                  isActive
                    ? "bg-[#FF711A] text-white shadow-[0_3px_8px_rgba(255,113,26,0.18)]"
                    : hasActiveChild
                    ? "bg-[#FFF1E5] text-[#19366F]"
                    : "text-[#15336E] hover:bg-[#FFF0E3]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                  if (name === "Expenses") {
                    setExpandedItems([name]);
                    navigateTo("List Expenses");
                    return;
                  }

                  if (name === "Reports") {
                    setExpandedItems([name]);
                    navigateTo("Profit / Loss Report");
                    return;
                  }

                  if (name === "Pharmacy") {
                    setExpandedItems([name]);
                    navigateTo("Doctors");
                    return;
                  }

                  if (name === "Settings") {
                    setExpandedItems([name]);
                    navigateTo("Business Settings");
                    return;
                  }

                  if (name === "Stock Adjustment") {
                    setExpandedItems([name]);
                    navigateTo("List Stock Adjustments");
                    return;
                  }

                  if (name === "Stock Transfers") {
                    setExpandedItems([name]);
                    navigateTo("List Stock Transfers");
                    return;
                  }

                  if (expandable || hasChildren) {
                    toggleExpanded(name);
                  }
                  navigateTo(name);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-l-[9px] py-2.5 pl-[11px] text-left"
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive || hasActiveChild ? 2.4 : 2.2}
                    className={`shrink-0 ${
                      isActive ? "text-white" : "text-[#4276B5]"
                    }`}
                  />

                  <span className={`min-w-0 flex-1 whitespace-nowrap text-[12px] tracking-[-0.2px] ${
                    isActive || hasActiveChild ? "font-semibold" : "font-medium"
                  }`}>
                    {name}
                  </span>
                </button>

                {(expandable || hasChildren) && (
                  <button
                    type="button"
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${name}`}
                    aria-expanded={isExpanded}
                    onClick={() => toggleExpanded(name)}
                    className="flex min-h-[40px] shrink-0 items-center rounded-r-[9px] px-[11px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-orange-300"
                  >
                    {isExpanded ? (
                      <ChevronDown
                        size={12}
                        strokeWidth={1.7}
                        className={`shrink-0 ${
                          isActive ? "text-white/80" : hasActiveChild ? "text-[#F04A13]" : "text-[#8DAACB]"
                        }`}
                      />
                    ) : (
                      <ChevronRight
                        size={12}
                        strokeWidth={1.7}
                        className={`shrink-0 ${
                          isActive ? "text-white/80" : hasActiveChild ? "text-[#F04A13]" : "text-[#8DAACB]"
                        }`}
                      />
                    )}
                  </button>
                )}
              </div>

              {/* All submenu rows use the original Expenses styling */}
              {hasChildren && isExpanded && (
                <div className="ml-[18px] mt-1 mb-1 space-y-0.5 border-l border-[#F1D8C5] pl-2">
                  {children.map(({ name: childName, icon: ChildIcon }) => {
                    const isChildActive = activePage === childName;

                    return (
                      <button
                        key={childName}
                        type="button"
                        onClick={() => navigateTo(childName)}
                        aria-current={isChildActive ? "page" : undefined}
                        className={`flex min-h-[34px] w-full items-center gap-2 rounded-md px-2.5 text-left text-[11px] transition-colors ${
                          isChildActive
                            ? "bg-[#FFF1E5] font-bold text-[#F04A13]"
                            : "text-[#19366F] hover:bg-[#FFF7EF] hover:text-[#F04A13]"
                        }`}
                      >
                        {ChildIcon ? (
                          <ChildIcon
                            size={13}
                            className={`shrink-0 ${
                              isChildActive ? "text-[#F04A13]" : "text-[#6C91B9]"
                            }`}
                          />
                        ) : (
                          <span
                            className={`shrink-0 text-[13px] leading-none ${
                              isChildActive
                                ? "text-[#F04A13]"
                                : "text-[#8DAACB]"
                            }`}
                          >
                            •
                          </span>
                        )}

                        <span className="whitespace-nowrap">
                          {childName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
// idjfld