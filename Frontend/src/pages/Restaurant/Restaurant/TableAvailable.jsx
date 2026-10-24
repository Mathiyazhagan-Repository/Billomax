
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Minus,
  Search,
  Utensils,
  ClipboardList,
  Printer,
  ReceiptText,
  X,
  CheckCircle2,
} from "lucide-react";

const MENU_ITEMS = [
  { id: 1, name: "Chicken Biryani", category: "Main Course", price: 200 },
  { id: 2, name: "Paneer Butter Masala", category: "Main Course", price: 160 },
  { id: 3, name: "Green Garden Salad", category: "Salads", price: 90 },
  { id: 4, name: "Chicken", category: "Grill", price: 180 },
];

const CATEGORIES = ["All", "Main Course", "Salads", "Grill"];

const formatMoney = (amount) =>
  amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function TableAvailable({ initialOrder, onBack }) {
  const initialOrderItems = (initialOrder?.items || []).map((orderItem, index) => {
    const name = orderItem.name || orderItem.description;
    const menuItem = MENU_ITEMS.find(
      (item) => item.name.toLowerCase() === name?.toLowerCase()
    );

    return {
      id: menuItem?.id ?? `order-item-${index}`,
      name,
      category: orderItem.category || menuItem?.category || "Main Course",
      price: Number(orderItem.price ?? orderItem.rate) || 0,
      quantity: Number(orderItem.quantity ?? orderItem.qty) || 1,
    };
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quantities, setQuantities] = useState(() =>
    initialOrderItems.reduce(
      (current, item) => ({
        ...current,
        [item.id]: (current[item.id] || 0) + item.quantity,
      }),
      {}
    )
  );
  const [steward, setSteward] = useState(initialOrder?.steward || "");
  const [covers, setCovers] = useState(String(initialOrder?.covers || 1));
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "Main Course",
    price: "",
  });
  const [extraItems, setExtraItems] = useState(() =>
    initialOrderItems.filter(
      (item) => !MENU_ITEMS.some((menuItem) => menuItem.id === item.id)
    )
  );
  const [notice, setNotice] = useState("");

  const tableName = initialOrder?.table || "Table 2";
  const billNo = initialOrder?.billNo || "BILL-0516";
  const menu = [...MENU_ITEMS, ...extraItems];

  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [menu, category, search]);

  const selectedItems = menu.filter(
    (item) => (quantities[item.id] || 0) > 0
  );

  const totalItems = selectedItems.reduce(
    (sum, item) => sum + quantities[item.id],
    0
  );

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * quantities[item.id],
    0
  );

  // Retained from the reference screen: service 10%, State GST 2.5%,
  // Central GST 2.5%, plus a displayed round-off line.
  const serviceCharge = subtotal * 0.1;
  const stateGST = subtotal * 0.025;
  const centralGST = subtotal * 0.025;
  const beforeRoundOff =
    subtotal + serviceCharge + stateGST + centralGST;
  const roundOff = Math.round(beforeRoundOff) - beforeRoundOff;
  const netPayable = beforeRoundOff + roundOff;

  const changeQuantity = (id, change) => {
    setQuantities((current) => {
      const nextQuantity = Math.max(0, (current[id] || 0) + change);
      return { ...current, [id]: nextQuantity };
    });
  };

  const addCustomItem = (event) => {
    event.preventDefault();

    if (!newItem.name.trim() || newItem.price === "") {
      setNotice("Enter the menu item name and price.");
      return;
    }

    const price = Number(newItem.price);

    if (!Number.isFinite(price) || price < 0) {
      setNotice("Enter a valid price.");
      return;
    }

    const item = {
      id: Date.now(),
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      category: newItem.category,
      price,
    };

    setExtraItems((current) => [...current, item]);
    setQuantities((current) => ({ ...current, [item.id]: 1 }));
    setNewItem({
      name: "",
      description: "",
      category: "Main Course",
      price: "",
    });
    setShowAddItem(false);
    setNotice(`${item.name} added to the order.`);
  };

  const saveBill = () => {
    if (totalItems === 0) {
      setNotice("Add at least one menu item before saving the bill.");
      return;
    }

    const bill = {
      billNo,
      table: tableName,
      steward,
      covers: Number(covers) || 1,
      items: selectedItems.map((item) => ({
        ...item,
        quantity: quantities[item.id],
        amount: item.price * quantities[item.id],
      })),
      subtotal,
      serviceCharge,
      stateGST,
      centralGST,
      roundOff,
      netPayable,
    };

    // Replace with your backend save API when available.
    const blob = new Blob([JSON.stringify(bill, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${billNo}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setNotice("Bill details downloaded. Connect your API to save it permanently.");
  };

  const printKOT = () => {
    if (totalItems === 0) {
      setNotice("Add menu items before printing the KOT.");
      return;
    }

    window.print();
  };

  const moneyRow = (label, amount) => (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-[#61718B]">{label}</span>
      <span className="font-medium tabular-nums text-[#10234F]">
        ₹ {formatMoney(amount)}
      </span>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FFFAF5] font-sans text-[#10234F]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E9E2DA] bg-white/95 px-4 py-3 backdrop-blur print:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => {
                if (onBack) {
                  onBack();
                  return;
                }

                window.history.back();
              }}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-extrabold sm:text-base">
                Order for {tableName}
              </h1>
              <p className="mt-0.5 text-[11px] text-[#718096]">
                Bill No: {billNo}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddItem(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E4EAF2] bg-white px-3 py-2.5 text-xs font-bold transition hover:border-orange-200 hover:bg-orange-50 sm:text-sm"
          >
            <Plus size={15} className="text-[#FF6814]" />
            <span className="hidden sm:inline">Add Menu Item</span>
            <span className="sm:hidden">Add Item</span>
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-61px)] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Menu section */}
        <section className="min-w-0 p-4 sm:p-5 print:hidden">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A98AB]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search menu item..."
              className="w-full rounded-xl border border-[#DDE5EF] bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#97A3B3] focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  category === item
                    ? "border-[#FF6814] bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-sm"
                    : "border-[#DDE5EF] bg-white text-[#61718B] hover:border-orange-200 hover:text-[#FF6814]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Menu cards */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredItems.map((item) => {
              const quantity = quantities[item.id] || 0;

              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border bg-white p-3.5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    quantity > 0
                      ? "border-orange-300 shadow-sm"
                      : "border-[#E5EAF1]"
                  }`}
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8A98AB]">
                    {item.category}
                  </p>

                  <h2 className="mt-1 min-h-10 text-sm font-bold leading-5">
                    {item.name}
                  </h2>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-[#FF6814]">
                      ₹ {formatMoney(item.price)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        aria-label={`Decrease ${item.name}`}
                        onClick={() => changeQuantity(item.id, -1)}
                        disabled={quantity === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE5EF] text-[#61718B] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="min-w-5 text-center text-sm font-bold">
                        {quantity}
                      </span>

                      <button
                        aria-label={`Increase ${item.name}`}
                        onClick={() => changeQuantity(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-[#FF6814] hover:bg-orange-100"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {quantity > 0 && (
                    <p className="mt-3 border-t border-[#F0F2F6] pt-2 text-[11px] text-[#61718B]">
                      Item total:{" "}
                      <span className="font-bold text-[#10234F]">
                        ₹ {formatMoney(item.price * quantity)}
                      </span>
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-[#DDE5EF] bg-white p-10 text-center">
              <Search className="mx-auto text-[#A0AEC0]" size={26} />
              <p className="mt-3 font-bold">No menu items found</p>
              <p className="mt-1 text-sm text-[#718096]">
                Try another search term or category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 text-sm font-bold text-[#FF6814] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Current order */}
        <aside className="flex min-h-[calc(100vh-61px)] flex-col border-l border-[#E5EAF1] bg-white print:border-0">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-3.5 text-white">
            <h2 className="flex items-center gap-2 text-sm font-extrabold">
              <ClipboardList size={17} />
              Current Order
            </h2>
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#C9500E]">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_90px] gap-3 border-b border-[#EDF0F5] p-3">
            <label className="text-[11px] font-semibold text-[#61718B]">
              Steward
              <input
                value={steward}
                onChange={(event) => setSteward(event.target.value)}
                placeholder="Steward name"
                className="mt-1 w-full rounded-lg border border-[#DDE5EF] px-2.5 py-2 text-xs font-normal text-[#10234F] outline-none focus:border-orange-300"
              />
            </label>

            <label className="text-[11px] font-semibold text-[#61718B]">
              Covers
              <input
                type="number"
                min="1"
                value={covers}
                onChange={(event) => setCovers(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#DDE5EF] px-2.5 py-2 text-xs font-normal text-[#10234F] outline-none focus:border-orange-300"
              />
            </label>
          </div>

          {/* Selected items */}
          <div className="min-h-36 flex-1 overflow-y-auto p-3">
            {selectedItems.length === 0 ? (
              <div className="flex h-full min-h-36 flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6814]">
                  <Utensils size={22} />
                </div>
                <p className="mt-3 text-xs font-semibold text-[#718096]">
                  Tap menu items to add them here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#E9EDF3] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold">{item.name}</p>
                        <p className="mt-1 text-[11px] text-[#718096]">
                          ₹ {formatMoney(item.price)} each
                        </p>
                      </div>
                      <button
                        aria-label={`Remove ${item.name}`}
                        onClick={() =>
                          setQuantities((current) => ({
                            ...current,
                            [item.id]: 0,
                          }))
                        }
                        className="rounded-md p-1 text-[#8A98AB] hover:bg-red-50 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changeQuantity(item.id, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#DDE5EF] hover:bg-slate-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="min-w-4 text-center text-xs font-bold">
                          {quantities[item.id]}
                        </span>
                        <button
                          onClick={() => changeQuantity(item.id, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50 text-[#FF6814] hover:bg-orange-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold">
                        ₹ {formatMoney(item.price * quantities[item.id])}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bill calculation */}
          <div className="space-y-3 border-t border-[#E8EDF4] p-4">
            {moneyRow("Total", subtotal)}
            {moneyRow("Service (10%)", serviceCharge)}
            {moneyRow("State GST (2.5%)", stateGST)}
            {moneyRow("Central GST (2.5%)", centralGST)}
            {moneyRow("Round Off", roundOff)}

            <div className="flex items-center justify-between border-t border-[#E5EAF1] pt-3">
              <span className="text-sm font-black">Net Payable</span>
              <span className="text-lg font-black text-[#FF6814]">
                ₹ {formatMoney(netPayable)}
              </span>
            </div>

            <button
              onClick={saveBill}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              disabled={totalItems === 0}
            >
              <ReceiptText size={16} />
              Save &amp; Print Bill
            </button>

            <button
              onClick={printKOT}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-bold text-[#D95A12] transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={totalItems === 0}
            >
              <Printer size={14} />
              Save &amp; KOT Print
            </button>
          </div>
        </aside>
      </div>

      {/* Add menu item dialog */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10234F]/40 p-4 print:hidden">
          <form
            onSubmit={addCustomItem}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Add Menu Item</h2>
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="rounded-lg p-2 text-[#718096] hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mt-5 block text-xs font-bold">
              Item name
              <input
                required
                value={newItem.name}
                onChange={(event) =>
                  setNewItem({ ...newItem, name: event.target.value })
                }
                placeholder="Enter menu item name"
                className="mt-2 w-full rounded-xl border border-[#DDE5EF] px-3 py-2.5 text-sm font-normal outline-none focus:border-orange-300"
              />
            </label>

            <label className="mt-4 block text-xs font-bold">
              Description
              <textarea
                value={newItem.description}
                onChange={(event) =>
                  setNewItem({ ...newItem, description: event.target.value })
                }
                placeholder="Enter item description"
                rows={3}
                className="mt-2 w-full resize-y rounded-xl border border-[#DDE5EF] px-3 py-2.5 text-sm font-normal outline-none focus:border-orange-300"
              />
            </label>

            <label className="mt-4 block text-xs font-bold">
              Category
              <select
                value={newItem.category}
                onChange={(event) =>
                  setNewItem({ ...newItem, category: event.target.value })
                }
                className="mt-2 w-full rounded-xl border border-[#DDE5EF] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-orange-300"
              >
                {CATEGORIES.filter((item) => item !== "All").map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-xs font-bold">
              Price (₹)
              <input
                required
                min="0"
                step="0.01"
                type="number"
                value={newItem.price}
                onChange={(event) =>
                  setNewItem({ ...newItem, price: event.target.value })
                }
                placeholder="0.00"
                className="mt-2 w-full rounded-xl border border-[#DDE5EF] px-3 py-2.5 text-sm font-normal outline-none focus:border-orange-300"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="rounded-xl border border-[#DDE5EF] px-4 py-2.5 text-sm font-bold text-[#61718B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-5 py-2.5 text-sm font-bold text-white"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}

      {notice && (
        <div className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-xl border border-orange-100 bg-white p-4 shadow-xl print:hidden">
          <CheckCircle2
            className="mt-0.5 shrink-0 text-[#FF6814]"
            size={18}
          />
          <p className="text-sm">{notice}</p>
          <button
            onClick={() => setNotice("")}
            className="ml-2 text-[#8A98AB] hover:text-[#10234F]"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 4mm;
          }
          body {
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          aside,
          aside * {
            visibility: visible;
          }
          aside {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            min-height: auto !important;
            border: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
