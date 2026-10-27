import { ArrowLeft, UserRound } from "lucide-react";

const detailSections = [
  {
    title: "User Details",
    fields: [
      ["prefix", "Prefix"],
      ["firstName", "First Name"],
      ["lastName", "Last Name"],
      ["email", "Email"],
      ["role", "Role"],
      ["isActive", "Account Status"],
      ["serviceStaffPin", "Service Staff PIN"],
      ["allowLogin", "Login Access"],
      ["username", "Username"],
      ["usernameSuffix", "Username Suffix"],
      ["allLocations", "All Locations"],
      ["locations", "Assigned Locations"],
      ["salesCommission", "Sales Commission"],
      ["maxSalesDiscount", "Maximum Sales Discount"],
      ["allowSelectedContacts", "Selected Contact Access"],
    ],
  },
  {
    title: "Personal & Contact Information",
    fields: [
      ["dateOfBirth", "Date of Birth"],
      ["gender", "Gender"],
      ["maritalStatus", "Marital Status"],
      ["bloodGroup", "Blood Group"],
      ["mobileNumber", "Mobile Number"],
      ["alternateContactNumber", "Alternate Contact Number"],
      ["familyContactNumber", "Family Contact Number"],
      ["guardianName", "Guardian Name"],
      ["facebookLink", "Facebook"],
      ["twitterLink", "Twitter"],
      ["socialMedia1", "Other Social Media"],
      ["socialMedia2", "Other Social Media"],
    ],
  },
  {
    title: "Address & Identification",
    fields: [
      ["idProofName", "ID Proof"],
      ["idProofNumber", "ID Proof Number"],
      ["permanentAddress", "Permanent Address"],
      ["currentAddress", "Current Address"],
    ],
  },
  {
    title: "Bank & Tax Information",
    fields: [
      ["accountHolderName", "Account Holder"],
      ["accountNumber", "Account Number"],
      ["bankName", "Bank"],
      ["bankIdentifierCode", "Bank Identifier Code"],
      ["branch", "Branch"],
      ["taxPayerId", "Tax Payer ID"],
    ],
  },
  {
    title: "Custom Fields",
    fields: [
      ["customField1", "Custom Field 1"],
      ["customField2", "Custom Field 2"],
      ["customField3", "Custom Field 3"],
      ["customField4", "Custom Field 4"],
    ],
  },
];

function formatValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value ?? "").trim() || "—";
}

export default function ViewUser({ user = {}, onBack }) {
  const [firstName, ...lastNameParts] = (user.name || "")
    .split(" ")
    .filter(Boolean);
  const details = {
    ...user,
    firstName: user.firstName || firstName || "",
    lastName: user.lastName || lastNameParts.join(" "),
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] p-3 text-[#10234F] sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-3 inline-flex items-center gap-2 rounded-lg border border-[#F2E8DE] bg-white px-3 py-2 text-xs font-semibold text-[#19366F] transition hover:bg-[#FFF1E5]"
              >
                <ArrowLeft size={14} />
                Back to Users
              </button>
            )}
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF6814]">
              User Management
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#10234F] sm:text-3xl">
              View User
            </h1>
            <p className="mt-1 text-sm text-[#73809A]">
              Review this user&apos;s account, permissions, and profile details.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F5D9C3] bg-[#FFF0E4] px-3 py-2 text-xs font-semibold text-[#B94D0A]">
            <UserRound size={15} />
            {details.name || details.username || "User profile"}
          </div>
        </header>

        {detailSections.map((section) => (
          <section
            key={section.title}
            className="overflow-hidden rounded-2xl border border-[#F2E8DE] bg-white shadow-[0_6px_18px_rgba(16,35,79,0.04)]"
          >
            <h2 className="border-b border-[#F2E8DE] bg-[#FFFCF8] px-5 py-4 text-base font-bold text-[#10234F]">
              {section.title}
            </h2>
            <dl className="grid gap-x-6 gap-y-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.fields.map(([key, label]) => (
                <div key={key} className="min-w-0">
                  <dt className="text-xs font-semibold text-[#71839B]">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words text-sm text-[#19366F]">
                    {formatValue(details[key])}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
