
import { useState } from "react";
import {
  Pill,
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

const menuItems = [
  { name: "Home", icon: Home },
  { name: "User Management", icon: Users, expandable: true },
  { name: "Contacts", icon: Contact, expandable: true },
  { name: "Wishes", icon: Building2, expandable: true },
  { name: "Products", icon: Boxes, expandable: true },
  { name: "Purchases", icon: ShoppingCart, expandable: true },
  { name: "Sell", icon: Truck, expandable: true },
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
  { name: "Reports", icon: ChartNoAxesColumn, expandable: true },
  { name: "Notification Templates", icon: Mail },
  { name: "AI Offer Suggestions", icon: Lightbulb },
  { name: "Pharmacy", icon: BriefcaseMedical, expandable: true },
  { name: "Yearly renewal", icon: RefreshCw },
  { name: "Settings", icon: Settings, expandable: true },
];

export default function Sidebar({ onNavigate }) {
  const [activeItem, setActiveItem] = useState("Home");
  const [expandedItems, setExpandedItems] = useState(["Expenses"]);

  const navigateTo = (name) => {
    setActiveItem(name);
    onNavigate?.(name);
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[224px] shrink-0 flex-col self-start border-r border-[#F0EAE3] bg-[#FFFCF8] px-3 py-4 font-sans">
      {/* Pharmacy Header */}
      <div className="mb-5 flex h-[40px] items-center justify-center gap-2">
        <Pill
          size={31}
          strokeWidth={3.5}
          className="shrink-0 rotate-[-42deg] text-[#FF790F]"
        />

        <span className="whitespace-nowrap text-[16px] font-extrabold tracking-[-0.6px] text-[#10265F]">
          Pharmacy
        </span>

        <span className="ml-auto rounded-[7px] bg-[#19A83B] px-[9px] py-[3px] text-[10px] font-bold leading-none text-white">
          Rx
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex min-h-0 flex-1 flex-col gap-[2px] overflow-y-auto pb-2" aria-label="Main navigation">
        {menuItems.map(({ name, icon: Icon, expandable, children }) => {
          const isActive = activeItem === name;
          const isExpanded = expandedItems.includes(name);
          const hasChildren = Boolean(children?.length);

          return (
            <div key={name}>
              <button
                type="button"
                onClick={() => {
                  navigateTo(name);
                  if (expandable || hasChildren) {
                    setExpandedItems((current) =>
                      isExpanded
                        ? current.filter((item) => item !== name)
                        : [...current, name]
                    );
                  }
                }}
                aria-current={isActive ? "page" : undefined}
                aria-expanded={expandable || hasChildren ? isExpanded : undefined}
                className={`group flex min-h-[38px] w-full items-center gap-[13px] rounded-[8px] px-[11px] text-left transition-colors duration-150 ${
                  isActive
                    ? "bg-[#FF7F19] text-white shadow-sm"
                    : "text-[#15336E] hover:bg-[#FFF0E3]"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2.8}
                  className={`shrink-0 ${
                    isActive ? "text-white" : "text-[#4276B5]"
                  }`}
                />

                <span className="min-w-0 flex-1 whitespace-nowrap text-[12px] font-medium tracking-[-0.2px]">
                  {name}
                </span>

                {(expandable || hasChildren) &&
                  (hasChildren && isExpanded ? (
                    <ChevronDown
                      size={12}
                      strokeWidth={1.7}
                      className="ml-auto shrink-0 text-[#8DAACB]"
                    />
                  ) : (
                    <ChevronRight
                      size={12}
                      strokeWidth={1.7}
                      className={`ml-auto shrink-0 ${
                        isActive ? "text-white/80" : "text-[#8DAACB]"
                      }`}
                    />
                  ))}
              </button>

              {hasChildren && isExpanded && (
                <div className="ml-5 border-l border-[#DCE6F1] pl-2">
                  {children.map(({ name: childName, icon: ChildIcon }) => {
                    const isChildActive = activeItem === childName;

                    return (
                      <button
                        key={childName}
                        type="button"
                        onClick={() => navigateTo(childName)}
                        aria-current={isChildActive ? "page" : undefined}
                        className={`flex min-h-[34px] w-full items-center gap-2 rounded-md px-2 text-left text-[11px] transition-colors ${
                          isChildActive
                            ? "bg-[#FFF0E3] font-semibold text-[#E96B10]"
                            : "text-[#15336E] hover:bg-[#FFF0E3]"
                        }`}
                      >
                        <ChildIcon
                          size={13}
                          className="shrink-0 text-[#6C91B9]"
                        />
                        <span className="whitespace-nowrap">{childName}</span>
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
