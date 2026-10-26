let activeBusiness = "Pharmacy";
const pharmacySampleProducts = [
  { id: "pharmacy-1", name: "Paracetamol 500mg", sku: "0038", sellingPrice: 22.5, purchasePrice: 16, stock: 197, unit: "piece", category: "Health & Wellness Products", brand: "MediCare" },
  { id: "pharmacy-2", name: "Cetirizine 10mg", sku: "0061", sellingPrice: 10, purchasePrice: 7, stock: 84, unit: "strip", category: "Allergy Relief", brand: "MediCare" },
  { id: "pharmacy-3", name: "Antiseptic Liquid", sku: "0067", sellingPrice: 55, purchasePrice: 42, stock: 32, unit: "bottle", category: "First Aid", brand: "CareWell" },
];

export function setActiveBusinessStorage(business) {
  activeBusiness = business || "Pharmacy";
}

export function getActiveBusinessStorage() {
  return activeBusiness;
}

export function getBusinessLocation() {
  return activeBusiness;
}

export function getBusinessSampleProducts(pharmacyProducts = []) {
  if (activeBusiness === "Pharmacy") {
    return pharmacyProducts.length ? pharmacyProducts : pharmacySampleProducts;
  }
  const productsByBusiness = {
    Admin: [
      { id: "admin-1", name: "General Merchandise", sku: "ADM-001", sellingPrice: 100, stock: 25, unit: "piece", category: "General", brand: "Billomax" },
    ],
    "Electronics & MobileShop": [
      { id: "electronics-1", name: "USB-C Charger", sku: "ELE-001", sellingPrice: 899, stock: 18, unit: "piece", category: "Accessories", brand: "Billomax" },
      { id: "electronics-2", name: "Wireless Earbuds", sku: "ELE-002", sellingPrice: 2499, stock: 12, unit: "piece", category: "Audio", brand: "Billomax" },
      { id: "electronics-3", name: "Smartphone", sku: "ELE-003", sellingPrice: 15999, stock: 8, unit: "piece", category: "Mobile Phones", brand: "Billomax" },
    ],
    "Multi-Service Center": [
      { id: "msc-1", name: "Service Fee", sku: "MSC-001", sellingPrice: 100, stock: 999, unit: "service", category: "Services", brand: "Billomax" },
      { id: "msc-2", name: "Printout", sku: "MSC-002", sellingPrice: 5, stock: 999, unit: "page", category: "Printing", brand: "Billomax" },
    ],
    Restaurant: [
      { id: "restaurant-1", name: "Chicken Biryani", sku: "RES-001", sellingPrice: 220, stock: 30, unit: "plate", category: "Main Course", brand: "Kitchen" },
      { id: "restaurant-2", name: "Masala Tea", sku: "RES-002", sellingPrice: 25, stock: 50, unit: "cup", category: "Beverages", brand: "Kitchen" },
      { id: "restaurant-3", name: "Veg Fried Rice", sku: "RES-003", sellingPrice: 160, stock: 24, unit: "plate", category: "Main Course", brand: "Kitchen" },
    ],
    "Super Market": [
      { id: "supermarket-1", name: "Basmati Rice 5kg", sku: "SUP-001", sellingPrice: 599, stock: 40, unit: "bag", category: "Groceries", brand: "Billomax" },
      { id: "supermarket-2", name: "Cooking Oil 1L", sku: "SUP-002", sellingPrice: 145, stock: 55, unit: "bottle", category: "Groceries", brand: "Billomax" },
      { id: "supermarket-3", name: "Fresh Milk 1L", sku: "SUP-003", sellingPrice: 68, stock: 32, unit: "carton", category: "Dairy", brand: "Billomax" },
    ],
  };
  return (productsByBusiness[activeBusiness] || []).map((product) => ({
    ...product,
    purchasePrice: product.purchasePrice ?? Math.round(Number(product.sellingPrice || 0) * 0.7),
    location: activeBusiness,
    type: product.type || "Single",
    tax: product.tax || "0%",
    notForSelling: false,
  }));
}

export function getBusinessSampleSales(pharmacySales = []) {
  if (activeBusiness === "Pharmacy") return pharmacySales;

  const products = getBusinessSampleProducts([]);
  if (!products.length) return [];

  const examples = {
    Admin: ["Office Supplies Buyer", "Business Services Client"],
    "Electronics & MobileShop": ["Arun Electronics", "City Mobile Store"],
    "Multi-Service Center": ["Walk-In Service Client", "Print Desk Customer"],
    Restaurant: ["Table 4 Guest", "Takeaway Customer"],
    "Super Market": ["Neighborhood Shopper", "Greenfield Residents"],
  };
  const customers = examples[activeBusiness] || ["Walk-In Customer"];
  const operator = activeBusiness.toLowerCase();

  return products.slice(0, Math.min(products.length, 3)).map((product, index) => {
    const quantity = index + 1;
    const total = Number(product.sellingPrice || 0) * quantity;
    const status = index === 2 ? "Due" : "Paid";
    return {
      id: `${operator}-sale-${index + 1}`,
      date: `26/10/2026 ${String(10 + index).padStart(2, "0")}:30`,
      invoiceNo: `${operator.slice(0, 3).toUpperCase()}-${1001 + index}`,
      customerName: customers[index % customers.length],
      contactNumber: "",
      location: activeBusiness,
      paymentStatus: status,
      paymentMethod: index === 1 ? "Card" : "Cash",
      total,
      totalPaid: status === "Paid" ? total : 0,
      sellDue: status === "Paid" ? 0 : total,
      sellReturnDue: index === 0 ? Math.round(total * 0.1) : 0,
      shippingStatus: index === 1 ? "Shipped" : "",
      deliveryPerson: index === 1 ? `${activeBusiness} Delivery` : "",
      shippingDetails: index === 1 ? "Service delivery order" : "",
      shippingAddress: index === 1 ? "Main Street" : "",
      totalItems: quantity,
      addedBy: operator,
      sellNote: "",
      staffNote: "",
      items: [{
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity,
        unit: product.unit,
        unitPrice: product.sellingPrice,
      }],
    };
  });
}

export function getBusinessSampleDiscounts(pharmacyDiscounts = []) {
  if (activeBusiness === "Pharmacy") return pharmacyDiscounts;
  const [featuredProduct] = getBusinessSampleProducts([]);
  if (!featuredProduct) return [];
  const dateRange = { startsAt: "01/10/2026 09:00", endsAt: "31/12/2026 23:59" };
  return [
    {
      id: `${activeBusiness}-discount-001`,
      name: `${activeBusiness} Welcome Offer`,
      ...dateRange,
      amount: "10",
      type: "Percentage",
      priority: 1,
      brand: featuredProduct.brand || "",
      category: featuredProduct.category || "",
      products: `${featuredProduct.name} (${featuredProduct.sku})`,
      location: activeBusiness,
      active: true,
    },
  ];
}

export function getBusinessSampleQuotations(pharmacyQuotations = []) {
  if (activeBusiness === "Pharmacy") return pharmacyQuotations;
  const products = getBusinessSampleProducts([]);
  return products.slice(0, 3).map((product, index) => ({
    id: `${activeBusiness}-quotation-${index + 1}`,
    date: "26/10/2026",
    invoiceNo: `${activeBusiness.slice(0, 3).toUpperCase()}-Q-${1001 + index}`,
    customerName: `${activeBusiness} Customer`,
    location: activeBusiness,
    totalItems: index + 1,
    addedBy: activeBusiness.toLowerCase(),
    total: Number(product.sellingPrice || 0) * (index + 1),
    items: [{
      id: `${activeBusiness}-quotation-item-${index + 1}`,
      name: product.name,
      quantity: index + 1,
      unitPrice: product.sellingPrice,
    }],
  }));
}

export function getBusinessSupplierNames() {
  if (activeBusiness === "Pharmacy") return ["netmeds", "lokesh"];
  const suppliers = {
    Admin: ["Office Essentials Supply", "Business Services Co."],
    "Electronics & MobileShop": ["Tech Hub Distribution", "Mobile Accessories Wholesale"],
    "Multi-Service Center": ["Print & Stationery Supply", "Service Solutions Ltd."],
    Restaurant: ["Fresh Foods Distributor", "Beverage Supply Co."],
    "Super Market": ["City Wholesale Grocers", "Daily Needs Distribution"],
  };
  return suppliers[activeBusiness] || [];
}

export function getBusinessSampleContacts(type, pharmacyContacts = []) {
  if (activeBusiness === "Pharmacy") return pharmacyContacts;
  const serviceContacts = {
    Admin: {
      customers: ["Northstar Office Buyers", "Operations Support Client"],
      suppliers: ["Office Essentials Supply", "Business Services Co."],
    },
    "Electronics & MobileShop": {
      customers: ["Arun Electronics", "City Mobile Store"],
      suppliers: ["Tech Hub Distribution", "Mobile Accessories Wholesale"],
    },
    "Multi-Service Center": {
      customers: ["Walk-In Service Client", "Print Desk Customer"],
      suppliers: ["Print & Stationery Supply", "Service Solutions Ltd."],
    },
    Restaurant: {
      customers: ["Table 4 Guest", "Takeaway Customer"],
      suppliers: ["Fresh Foods Distributor", "Beverage Supply Co."],
    },
    "Super Market": {
      customers: ["Neighborhood Shopper", "Greenfield Residents"],
      suppliers: ["City Wholesale Grocers", "Daily Needs Distribution"],
    },
  };
  const names = serviceContacts[activeBusiness]?.[type] || [];
  const base = pharmacyContacts[0] || {};
  return names.map((name, index) => ({
    ...base,
    id: `${activeBusiness}-${type}-${index + 1}`,
    contactId: `${type === "customers" ? "CU" : "SU"}${String(index + 1).padStart(4, "0")}`,
    businessName: name,
    name: name,
    email: `${type === "customers" ? "contact" : "orders"}${index + 1}@example.com`,
    mobile: "",
    taxNumber: "",
    openingBalance: 0,
    advanceBalance: 0,
    addedOn: "26/10/2026",
    address: "",
    assignedTo: "None",
    status: "Active",
    customValues: {},
    ...(type === "customers"
      ? { creditLimit: null, payTerm: "", customerGroup: "", saleDue: 0, saleReturnDue: 0, lastSaleOn: "" }
      : { payTerm: "", purchaseDue: 0, purchaseReturnDue: 0 }),
  }));
}

export function getBusinessSampleUsers(pharmacyUsers = []) {
  if (activeBusiness === "Pharmacy") return pharmacyUsers;
  const users = {
    Admin: [
      ["admin", "Business Administrator", "Admin"],
      ["operations", "Operations Manager", "Manager"],
      ["accounts", "Accounts Operator", "Cashier"],
    ],
    "Electronics & MobileShop": [
      ["owner", "Electronics Store Owner", "Admin"],
      ["manager", "Electronics Store Manager", "Manager"],
      ["sales", "Electronics Sales Associate", "Sales Associate"],
    ],
    "Multi-Service Center": [
      ["owner", "Service Center Owner", "Admin"],
      ["manager", "Service Center Manager", "Manager"],
      ["agent", "Customer Service Agent", "Service Agent"],
    ],
    Restaurant: [
      ["owner", "Restaurant Owner", "Admin"],
      ["manager", "Restaurant Manager", "Manager"],
      ["cashier", "Restaurant Cashier", "Cashier"],
    ],
    "Super Market": [
      ["owner", "Market Owner", "Admin"],
      ["manager", "Market Store Manager", "Manager"],
      ["cashier", "Market Cashier", "Cashier"],
    ],
  };
  return (users[activeBusiness] || []).map(([username, name, role], index) => ({
    id: `${activeBusiness}-user-${index + 1}`,
    username: `${activeBusiness.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${username}`,
    name,
    role,
    email: `${username}@example.com`,
  }));
}

export function getBusinessSampleRoles(pharmacyRoles = []) {
  if (activeBusiness === "Pharmacy") return pharmacyRoles;
  const roles = {
    Admin: ["Admin", "Manager", "Cashier"],
    "Electronics & MobileShop": ["Admin", "Store Manager", "Sales Associate", "Cashier"],
    "Multi-Service Center": ["Admin", "Center Manager", "Service Agent", "Cashier"],
    Restaurant: ["Admin", "Restaurant Manager", "Cashier", "Kitchen Staff"],
    "Super Market": ["Admin", "Store Manager", "Sales Associate", "Cashier"],
  };
  return (roles[activeBusiness] || []).map((name, index) => ({
    id: `${activeBusiness}-role-${index + 1}`,
    name,
    protected: index === 0,
  }));
}

export function getBusinessSampleAgents(pharmacyAgents = []) {
  if (activeBusiness === "Pharmacy") return pharmacyAgents;
  const agents = {
    Admin: ["Account Representative", "Business Development Agent"],
    "Electronics & MobileShop": ["Electronics Sales Associate", "Device Account Manager"],
    "Multi-Service Center": ["Service Desk Agent", "Community Outreach Agent"],
    Restaurant: ["Catering Coordinator", "Restaurant Sales Agent"],
    "Super Market": ["Wholesale Sales Agent", "Local Business Representative"],
  };
  return (agents[activeBusiness] || []).map((name, index) => ({
    id: `${activeBusiness}-agent-${index + 1}`,
    name,
    email: `agent${index + 1}@example.com`,
    contactNumber: "",
    address: "",
    commission: "10.00",
  }));
}

export function getBusinessSampleCustomerGroups(pharmacyGroups = []) {
  if (activeBusiness === "Pharmacy") return pharmacyGroups;
  const groups = {
    Admin: ["Corporate Clients", "Service Partners"],
    "Electronics & MobileShop": ["Retail Customers", "Trade Partners"],
    "Multi-Service Center": ["Walk-In Clients", "Institutional Clients"],
    Restaurant: ["Dine-In Customers", "Corporate Catering"],
    "Super Market": ["Retail Customers", "Wholesale Customers"],
  };
  return (groups[activeBusiness] || []).map((name, index) => ({
    id: `${activeBusiness}-customer-group-${index + 1}`,
    name,
    calculationPercentage: "",
    sellingPriceGroup: "",
  }));
}

export function getBusinessSampleCategories(pharmacyCategories = []) {
  if (activeBusiness === "Pharmacy") return pharmacyCategories;
  const categories = [...new Set(
    getBusinessSampleProducts([]).map((product) => product.category).filter(Boolean),
  )];
  return categories.map((name, index) => ({
    id: `${activeBusiness}-category-${index + 1}`,
    name,
    code: name.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
    description: `${name} products and services`,
  }));
}

export function getBusinessSampleBrands(pharmacyBrands = []) {
  if (activeBusiness === "Pharmacy") return pharmacyBrands;
  const brands = [...new Set(
    getBusinessSampleProducts([]).map((product) => product.brand).filter(Boolean),
  )];
  return brands.map((name, index) => ({
    id: `${activeBusiness}-brand-${index + 1}`,
    name,
    note: `${activeBusiness} catalog brand`,
  }));
}

function scopedKey(key) {
  if (activeBusiness === "Pharmacy" || !String(key).startsWith("billomax-")) {
    return key;
  }
  const businessKey = activeBusiness
    .toLowerCase()
    .replaceAll("&", "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return String(key).replace(/^billomax-/, `billomax-${businessKey}-`);
}

export const businessStorage = {
  getItem(key) {
    return window.localStorage.getItem(scopedKey(key));
  },
  setItem(key, value) {
    window.localStorage.setItem(scopedKey(key), value);
  },
  removeItem(key) {
    window.localStorage.removeItem(scopedKey(key));
  },
};
