
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

const reportItems = [
  "Profit / Loss Report",
  "Sale Report",
  "Purchase & Sale",
  "Tax Report",
  "Supplier & Customer Report",
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
  {
    name: "User Management",
    icon: Users,
    children: [
      { name: "Users" },
      { name: "Roles" },
      { name: "Sales Commission Agents" },
    ],
  },
  {
    name: "Contacts",
    icon: Contact,
    children: [
      { name: "Suppliers" },
      { name: "Customers" },
      { name: "Customer Groups" },
      { name: "Import Contacts" },
    ],
  },
  { name: "Wishes", icon: Building2 },
  {
    name: "Products",
    icon: Boxes,
    children: [
      { name: "List Products" },
      { name: "Add Product" },
      { name: "Update Price" },
      { name: "Print Labels" },
      { name: "Variations" },
      { name: "Import Products" },
      { name: "Import Opening Stock" },
      { name: "Selling Price Group" },
      { name: "Units" },
      { name: "Categories" },
      { name: "Brands" },
      { name: "Warranties" },
    ],
  },
  {
    name: "Purchases",
    icon: ShoppingCart,
    children: [
      { name: "List Purchases" },
      { name: "Add Purchase" },
      { name: "List Purchase Return" },
    ],
  },
  {
    name: "Sales",
    icon: Truck,
    children: [
      { name: "Sales Order" },
      { name: "All Sales" },
      { name: "Add Sale" },
      { name: "List POS" },
      { name: "POS" },
      { name: "Add Draft" },
      { name: "List Draft" },
      { name: "Add Quotation" },
      { name: "List Quotations" },
      { name: "List Sell Return" },
      { name: "Shipments" },
      { name: "Discounts" },
      { name: "Import Sales" },
    ],
  },
  { name: "Stock Transfers", icon: Truck, expandable: true },
  { name: "E-Way Bill", icon: ArrowLeftRight, expandable: true },
  { name: "Modify Bill", icon: SquarePen },
  { name: "Stocks (Expiry/Dump/Faulty)", icon: Warehouse },
  { name: "Stock Adjustment", icon: SlidersHorizontal, expandable: true },
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
  { name: "Pharmacy", icon: BriefcaseMedical, expandable: true },
  { name: "Yearly renewal", icon: RefreshCw },
  { name: "Settings", icon: Settings, expandable: true },
];

export default function Sidebar({ activePage = "Home", onNavigate }) {
  const [expandedItems, setExpandedItems] = useState(["Expenses"]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllSales, setShowAllSales] = useState(false);

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
      {/* Pharmacy Header */}
      <div className="mb-5 flex h-[40px] items-center gap-2.5 px-1">
        <img
          src={logo}
          alt="Web Digital Mantra Logo"
          className="h-8 w-auto shrink-0 object-contain"
        />

        <span className="min-w-0 truncate text-[16px] font-bold tracking-[-0.3px] text-[#283C6F]">
          Pharmacy
        </span>
      </div>

      {/* Navigation */}
      <nav
        className="app-themed-scrollbar flex min-h-0 flex-1 flex-col gap-[2px] overflow-y-auto overflow-x-hidden pb-2"
        aria-label="Main navigation"
      >
        {menuItems.map(({ name, icon: Icon, expandable, children }) => {
          const hasChildren = Boolean(children?.length);
          const isActive = activePage === name;
          const hasActiveChild = children?.some(
            ({ name: childName }) => activePage === childName
          );
          const isExpanded = expandedItems.includes(name);
          const showAllChildren =
            name === "Products" ? showAllProducts : showAllSales;
          const visibleChildren =
            (name === "Products" || name === "Sales") && !showAllChildren
              ? children.slice(0, 5)
              : children;

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
                  aria-expanded={
                    expandable || hasChildren ? isExpanded : undefined
                  }
                  className="flex min-h-[38px] min-w-0 flex-1 items-center gap-[13px] rounded-[8px] px-[11px] text-left"
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2.8}
                    className={`shrink-0 ${
                      isActive ? "text-white" : "text-[#5584BC]"
                    }`}
                  />

                  <span className="min-w-0 flex-1 whitespace-nowrap text-[12px] font-medium tracking-[-0.2px]">
                    {name}
                  </span>
                </button>

                {(expandable || hasChildren) && (
                  (isExpanded ? (
                    <ChevronDown
                      size={12}
                      strokeWidth={1.7}
                      className="ml-auto shrink-0 text-[#98B2D0]"
                    />
                  ) : (
                    <ChevronRight
                      size={12}
                      strokeWidth={1.7}
                      className={`ml-auto shrink-0 ${
                        isActive ? "text-white/80" : "text-[#98B2D0]"
                      }`}
                    />
                  ))
                )}
              </div>

              {/* All submenu rows use the original Expenses styling */}
              {hasChildren && isExpanded && (
                <div className="ml-5 border-l border-[#E0E8F2] pl-2">
                  {visibleChildren.map(({ name: childName, icon: ChildIcon }) => {
                    const isChildActive = activePage === childName;

                    return (
                      <button
                        key={childName}
                        type="button"
                        onClick={() => navigateTo(childName)}
                        aria-current={isChildActive ? "page" : undefined}
                        className={`flex min-h-[34px] w-full items-center gap-2 rounded-md px-2 text-left text-[11px] transition-colors ${
                          isChildActive
                            ? "bg-[#FFF0E3] font-semibold text-[#EB7A28]"
                            : "text-[#2C477C] hover:bg-[#FFF0E3]"
                        }`}
                      >
                        {ChildIcon ? (
                          <ChildIcon
                            size={13}
                            className="shrink-0 text-[#7B9CC0]"
                          />
                        ) : (
                          <span
                            className={`shrink-0 text-[13px] leading-none ${
                              isChildActive
                                ? "text-[#EB7A28]"
                                : "text-[#98B2D0]"
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
                  {(name === "Products" || name === "Sales") &&
                    children.length > 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (name === "Products") {
                          setShowAllProducts((showAll) => !showAll);
                        } else {
                          setShowAllSales((showAll) => !showAll);
                        }
                      }}
                      aria-expanded={showAllChildren}
                      className="flex min-h-[34px] w-full items-center rounded-md px-2 text-left text-[11px] font-semibold text-[#5584BC] transition-colors hover:bg-[#EEF4FB] hover:text-[#3F6FA8]"
                    >
                      {(name === "Products" ? showAllProducts : showAllSales)
                        ? "Show less"
                        : `+${children.length - 5} more`}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
