import { CakeSlice, CalendarDays, Gift, Sparkles } from "lucide-react";

function Wishes() {
  const today = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#FFFAF5] px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[#8798AD]">
              <span>Wishes</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#5584BC]">Birthday customers</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E3] text-[#F5852A]">
                <Gift size={21} strokeWidth={2.2} />
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#283961]">
                  Wishes
                </h1>
                <p className="mt-0.5 text-sm text-[#71809A]">
                  Make your customers feel remembered.
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#E4EAF2] bg-white px-3.5 py-2 text-sm font-medium text-[#536985] shadow-sm">
            <CalendarDays size={16} className="text-[#5584BC]" />
            {today}
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#F0E4D7] bg-white shadow-[0_8px_28px_rgba(40,57,97,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2EAE2] px-5 py-4 sm:px-7">
            <div>
              <h2 className="text-lg font-semibold text-[#F5852A]">
                Today&apos;s Birthday Customers
              </h2>
              <p className="mt-1 text-sm text-[#8798AD]">
                Customers whose birthday is today
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF5EA] px-3 py-1.5 text-xs font-semibold text-[#D9782C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5852A]" />
              0 birthdays today
            </span>
          </div>

          <div className="relative flex min-h-[390px] flex-col items-center justify-center overflow-hidden px-6 py-12 text-center sm:min-h-[430px]">
            <div className="pointer-events-none absolute -left-14 -top-16 h-48 w-48 rounded-full bg-[#FFF8F0]" />
            <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-[#F4F8FD]" />

            <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF0E3] to-[#FFF9F2] shadow-[0_8px_24px_rgba(245,133,42,0.12)]">
              <span className="absolute -right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-[#EAF2FC] text-[#5584BC]">
                <Sparkles size={15} />
              </span>
              <CakeSlice
                size={52}
                strokeWidth={1.65}
                className="text-[#F5852A]"
                aria-hidden="true"
              />
            </div>

            <h3 className="relative text-xl font-semibold text-[#283961]">
              No birthdays today
            </h3>
            <p className="relative mt-2 max-w-md text-sm leading-6 text-[#71809A]">
              There are no customer birthdays to celebrate today. When a
              customer&apos;s birthday arrives, they&apos;ll appear here.
            </p>

            <div className="relative mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F5F8FC] px-3.5 py-2 text-xs font-medium text-[#627995]">
              <CalendarDays size={15} className="text-[#5584BC]" />
              Add birthdays to customer profiles to see them here
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-[#94A0B2]">
          A thoughtful birthday wish can make a lasting customer connection.
        </p>
      </div>
    </main>
  );
}

export default Wishes;