
import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  Package,
  Sparkles,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    priceLabel: "Free for 7 Days",
    description:
      "Perfect for small businesses starting digital billing. Includes 1 Business Location, 3 Users, and 30 Products. Generate 100 invoices/month for smooth sales management. Enjoy a 15-day free trial with full access, no credit card needed. Start simple, grow confidently with tools designed to make billing effortless.",
    features: [
      "1 Business Locations",
      "3 Users",
      "30 Products",
      "100 Invoices",
    ],
    buttonText: "Register Free",
    free: true,
  },
  {
    name: "Basic",
    monthlyPrice: 5000,
    annualPrice: 50000,
    priceLabel: "₹ 5,000.00 / 1 Months",
    description:
      "Ideal for growing businesses with multiple locations and more staff. Includes 3 Business Locations, 5 Users, and 100 Products. Generate 2,000 invoices/month to keep operations smooth. Access advanced reports and enjoy priority email support, ensuring your team stays informed and your business runs efficiently at every step.",
    features: [
      "3 Business Locations",
      "5 Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
  },
  {
    name: "Standard",
    monthlyPrice: 10000,
    annualPrice: 100000,
    priceLabel: "₹ 10,000.00 / 1 Months",
    description:
      "A solid choice for established businesses needing more power and flexibility. Includes 5 Business Locations, 10 Users, and 500 Products. Generate 5,000 invoices/month with advanced inventory tracking for better control. Enjoy priority support and custom branding options to align the platform with your business identity and operations.",
    features: [
      "5 Business Locations",
      "10 Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
  },
  {
    name: "Professional",
    monthlyPrice: 15000,
    annualPrice: 150000,
    priceLabel: "₹ 15,000.00 / 1 Months",
    description:
      "Designed for fast-growing businesses needing more capacity without going full enterprise. Includes 8 Business Locations, 20 Users, and 1,000 Products. Generate 10,000 invoices/month with AI-powered sales forecasts, smart expense tracking, and automated reminders. Gain premium reports, role-based access control, and faster support to boost productivity and efficiency.",
    features: [
      "Unlimited Business Locations",
      "Unlimited Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: 25000,
    annualPrice: 250000,
    priceLabel: "₹ 25,000.00 / 1 Months",
    description:
      "Our most advanced plan for enterprises demanding power, flexibility, and automation. Access via web or tablet from anywhere. Includes Unlimited Locations, Users, Products, and invoices. Leverage AI-driven insights, predictive forecasts, smart stock alerts, and automated follow-ups. Enjoy enterprise-grade security, dedicated account management, custom integrations, and 24/7 premium support.",
    features: [
      "Unlimited Business Locations",
      "Unlimited Users",
      "Unlimited Products",
      "Unlimited Invoices",
    ],
    popular: true,
  },
];

const formatPrice = (price) =>
  `₹ ${price.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const planIcons = [Zap, Users, Package, Building2, Sparkles];

export default function Pricing({ onBack, onRegister, onSubscribe }) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handlePlanAction = (plan) => {
    const action = plan.free ? onRegister : onSubscribe;

    if (action) {
      action({
        plan: plan.name,
        billingCycle,
        price:
          billingCycle === "monthly"
            ? plan.monthlyPrice
            : plan.annualPrice,
      });
    } else {
      window.alert(
        `${plan.name} selected. Connect this button to your registration or subscription flow.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[#E8E5DF] bg-white px-4 py-2 text-sm font-semibold text-[#19366F] transition hover:border-[#FFB17B] hover:bg-[#FFF8F0]"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        )}

        {/* Heading */}
        <header className="mx-auto mb-9 max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E4] text-[#FF6814]">
            <ShieldCheck size={25} />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FF6814]">
            Billomax Plans
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#10234F] sm:text-4xl">
            Simple, Transparent Pricing
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#758198] sm:text-base">
            Choose your preferred Billomax - Your Trusted Partner in
            Billing & Invoicing pricing plan.
          </p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#E8E0D6] bg-white p-2 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-[#FFF0E4] text-[#E85D0A]"
                  : "text-[#758198] hover:bg-[#FFF8F0]"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={billingCycle === "annual"}
              aria-label="Switch annual billing"
              onClick={() =>
                setBillingCycle((current) =>
                  current === "monthly" ? "annual" : "monthly"
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                billingCycle === "annual"
                  ? "bg-[#FF6814]"
                  : "bg-[#D5DCE6]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                  billingCycle === "annual" ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              aria-pressed={billingCycle === "annual"}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                billingCycle === "annual"
                  ? "bg-[#FFF0E4] text-[#E85D0A]"
                  : "text-[#758198] hover:bg-[#FFF8F0]"
              }`}
            >
              Annual
            </button>
          </div>
        </header>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {pricingPlans.map((plan, index) => {
            const PlanIcon = planIcons[index];
            const displayedPrice =
              billingCycle === "monthly"
                ? plan.monthlyPrice
                : plan.annualPrice;

            return (
              <article
                key={plan.name}
                className={`relative flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? "border-[#FF9A57] shadow-[0_8px_28px_rgba(255,104,20,0.12)]"
                    : "border-[#E8E5DF] shadow-[0_4px_18px_rgba(16,35,79,0.05)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-r from-[#FF6814] to-[#FF812B] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Popular
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E4] text-[#FF6814]">
                    <PlanIcon size={20} />
                  </div>

                  <h2 className="text-lg font-bold text-[#10234F]">
                    {plan.name}
                  </h2>

                  <div className="mt-3 min-h-[76px]">
                    {plan.free ? (
                      <p className="text-base font-bold text-[#16854A]">
                        {plan.priceLabel}
                      </p>
                    ) : (
                      <>
                        <p className="text-2xl font-bold tracking-tight text-[#10234F]">
                          {formatPrice(displayedPrice)}
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#8791A5]">
                          / {billingCycle === "monthly" ? "month" : "year"}
                        </p>
                      </>
                    )}
                  </div>

                  <p className="mt-2 min-h-[190px] text-sm leading-[1.7] text-[#68758C]">
                    {plan.description}
                  </p>

                  <div className="my-5 h-px bg-[#F0E9E0]" />

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-[#354563]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5F8EC] text-[#16A05D]">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handlePlanAction(plan)}
                    className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#FF6814] to-[#FF812B] text-white shadow-md shadow-orange-100 hover:brightness-105"
                        : "border border-[#E8E5DF] bg-[#FFF9F2] text-[#10234F] hover:border-[#FFB17B] hover:bg-[#FFF0E4]"
                    }`}
                  >
                    {plan.buttonText}
                    <ArrowRight size={15} />
                  </button>
                </div>

                {plan.popular && (
                  <div className="h-1 bg-gradient-to-r from-[#FF6814] to-[#FFB16D]" />
                )}
              </article>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center text-xs text-[#8791A5] sm:flex-row">
          <BadgeCheck size={16} className="text-[#16A05D]" />
          <span>
            Billomax — Your Trusted Partner in Billing & Invoicing
          </span>
        </div>
      </div>
    </div>
  );
}
