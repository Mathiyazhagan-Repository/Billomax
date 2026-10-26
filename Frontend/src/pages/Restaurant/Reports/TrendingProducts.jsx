
import React, { useMemo, useState } from "react";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Printer,
  TrendingUp,
  Package,
  ShoppingBag,
  Info,
  CalendarDays,
  BarChart3,
  Download,
  X,
} from "lucide-react";

const initialProducts = [
  { product: "Dolo 650 - 0001 (Pc(s))", unitsSold: 53 },
  { product: "Amoxicillin - 0038 (pice)", unitsSold: 42 },
  { product: "Amoxicillin - 0050 (pice)", unitsSold: 23 },
  { product: "Budesonide - 0054 (pice)", unitsSold: 15 },
  { product: "Amoxicillin - 0056 (pice)", unitsSold: 10 },
];

function SummaryCard({ title, value, caption, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-[0_4px_18px_rgba(16,35,79,0.035)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#10234F]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{caption}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}

export default function TrendingProducts() {
  const [products] = useState(initialProducts);
  const [showFilters, setShowFilters] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [topCount, setTopCount] = useState("5");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((item) => item.product.toLowerCase().includes(query))
      .sort((a, b) =>
        sortOrder === "desc"
          ? b.unitsSold - a.unitsSold
          : a.unitsSold - b.unitsSold
      )
      .slice(0, Number(topCount));
  }, [products, search, sortOrder, topCount]);

  const totalUnits = filteredProducts.reduce(
    (total, product) => total + product.unitsSold,
    0
  );

  const highestValue = Math.max(
    ...filteredProducts.map((product) => product.unitsSold),
    1
  );

  const resetFilters = () => {
    setSearch("");
    setSortOrder("desc");
    setTopCount("5");
  };

  const exportCSV = () => {
    const rows = [
      ["Product", "Total unit sold"],
      ...filteredProducts.map((item) => [item.product, item.unitsSold]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "TrendingProducts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const chartWidth = Math.max(filteredProducts.length * 150 + 70, 320);

  return (
    <main className="min-h-screen min-w-0 bg-[#FFFAF5] px-4 py-5 text-slate-700 sm:px-6 lg:px-8">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-card { border: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#E86A20]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6814]" />
              Sales analytics
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              Trending Products
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              See which products are leading by units sold.
            </p>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E1E7EF] bg-white px-4 py-2.5 text-sm font-semibold text-[#34445E] transition hover:border-orange-200 hover:bg-orange-50"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              <Printer size={16} />
              Print report
            </button>
          </div>
        </header>

        {/* Filters */}
        <section className="no-print overflow-visible rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_24px_rgba(16,35,79,0.04)]">
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
                <Filter size={19} />
              </span>
              <span>
                <span className="block font-bold text-[#10234F]">Filters</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Adjust the number and order of products displayed.
                </span>
              </span>
            </div>
            {showFilters ? (
              <ChevronUp size={18} className="text-slate-400" />
            ) : (
              <ChevronDown size={18} className="text-slate-400" />
            )}
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 border-t border-[#EDF0F5] px-5 py-5 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  Number of products
                </span>
                <select
                  value={topCount}
                  onChange={(event) => setTopCount(event.target.value)}
                  className="w-full rounded-xl border border-[#DFE5EE] bg-[#FFFEFC] px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="5">Top 5 products</option>
                  <option value="10">Top 10 products</option>
                  <option value="20">Top 20 products</option>
                  <option value={String(products.length)}>All products</option>
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  Sort by units sold
                </span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="w-full rounded-xl border border-[#DFE5EE] bg-[#FFFEFC] px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="desc">Highest to lowest</option>
                  <option value="asc">Lowest to highest</option>
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E1E7EF] bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-orange-50"
                >
                  <RotateCcw size={15} />
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Products Displayed"
            value={filteredProducts.length}
            caption="Products in the current chart"
            icon={Package}
          />
          <SummaryCard
            title="Total Units Sold"
            value={totalUnits.toLocaleString("en-IN")}
            caption="Combined units across displayed products"
            icon={ShoppingBag}
          />
          <SummaryCard
            title="Top Product Units"
            value={highestValue.toLocaleString("en-IN")}
            caption="Highest units sold in this view"
            icon={TrendingUp}
          />
        </section>

        {/* Chart */}
        <section className="print-card overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-[0_5px_24px_rgba(16,35,79,0.045)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#EDF0F5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#E86A20]">
                <TrendingUp size={19} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-[#10234F]">
                    Top Trending Products
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowInfo((value) => !value)}
                    aria-label="About this chart"
                    aria-expanded={showInfo}
                    className="rounded-full text-cyan-500 transition hover:text-cyan-700"
                  >
                    <Info size={17} />
                  </button>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Product performance measured by total units sold.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#D85B13]">
              <BarChart3 size={14} />
              Units sold
            </span>
          </div>

          {showInfo && (
            <div className="mx-5 mt-4 flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-600 sm:mx-6">
              <Info size={17} className="mt-0.5 shrink-0 text-cyan-600" />
              <p>
                This chart compares the total units sold for each product in
                the displayed results. Product labels and quantities are
                retained from your existing screenshot.
              </p>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                aria-label="Close chart information"
                className="ml-auto text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Search */}
          <div className="no-print flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-[#10234F]">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search trending products"
              className="w-full rounded-xl border border-[#DFE5EE] bg-[#FFFEFC] px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:max-w-xs"
            />
          </div>

          {/* Horizontal chart */}
          <div className="px-5 pb-6 pt-5 sm:px-6">
            {filteredProducts.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#DFE5EE] bg-[#FCFDFE] px-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Package size={22} />
                </span>
                <p className="mt-3 font-semibold text-[#10234F]">
                  No products found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try another product name or reset the filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-sm font-semibold text-[#E86A20] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div
                  className="min-w-full"
                  style={{ minWidth: `${chartWidth}px` }}
                >
                  {/* Y-axis and chart bars */}
                  <div className="relative ml-12 mr-3 border-b border-[#DDE5EF]">
                    {Array.from({ length: 5 }, (_, index) => {
                      const tick =
                        Math.ceil(highestValue / 5) * (5 - index);
                      const maxTick = Math.max(
                        Math.ceil(highestValue / 5) * 5,
                        5
                      );

                      return (
                        <div
                          key={index}
                          className="relative border-t border-[#E9EDF3]"
                          style={{ height: "58px" }}
                        >
                          <span
                            className={`absolute -left-12 w-9 text-right text-xs tabular-nums text-slate-400 ${
                              index === 0 ? "top-1" : "top-0 -translate-y-1/2"
                            }`}
                          >
                            {Math.round((maxTick / 5) * (5 - index))}
                          </span>
                        </div>
                      );
                    })}

                    <div className="absolute inset-x-0 bottom-0 top-7 flex items-end justify-around gap-5 px-3">
                      {filteredProducts.map((item, index) => {
                        const maxTick =
                          Math.max(Math.ceil(highestValue / 5) * 5, 5);
                        const height = Math.max(
                          (item.unitsSold / maxTick) * 100,
                          1
                        );

                        return (
                          <div
                            key={`${item.product}-${index}`}
                            className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
                          >
                            <div
                              title={`${item.product}: ${item.unitsSold} units sold`}
                              className="relative w-[55%] max-w-24 rounded-t-lg bg-gradient-to-t from-[#4F91D8] to-[#80B6EE] shadow-[0_3px_10px_rgba(79,145,216,0.16)] transition-all duration-300 group-hover:from-[#FF6814] group-hover:to-[#FF9B59]"
                              style={{ height: `${height}%` }}
                            >
                              <span className="absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#10234F] px-2 py-1 text-xs font-bold text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                                {item.unitsSold}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Product labels */}
                  <div className="ml-12 mr-3 flex gap-5 px-3 pt-3">
                    {filteredProducts.map((item, index) => (
                      <div
                        key={`${item.product}-label-${index}`}
                        className="min-w-0 flex-1 text-center"
                      >
                        <p
                          title={item.product}
                          className="mx-auto max-w-40 text-xs leading-5 text-slate-500"
                        >
                          {item.product}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#34445E]">
              <span className="h-3 w-3 rounded-full bg-[#80B6EE]" />
              Total unit sold
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 pb-3 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>Billomax · Trending Products</p>
          <p>Billing & invoicing management</p>
        </footer>
      </div>
      {/* Fixed Bottom Actions */}
<div className="no-print fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
  <button
    type="button"
    onClick={() =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    aria-label="Scroll to top"
    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3478F6] text-white shadow-[0_6px_18px_rgba(52,120,246,0.35)] transition hover:bg-[#2563EB] hover:shadow-lg"
  >
    <ChevronUp size={22} strokeWidth={3} />
  </button>

  <button
    type="button"
    onClick={() => window.print()}
    className="inline-flex items-center gap-2 rounded-xl bg-[#7778FF] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#6667F0]"
  >
    <Printer size={17} />
    Print
  </button>
</div>
    </main>
  );
}
