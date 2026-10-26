import { useEffect, useState } from 'react'
import { setActiveBusinessStorage } from './utils/businessStorage.js'
import './App.css'
import AdminSidebar from './component/Admin-Sidebar.jsx'
import ElectronicsSidebar from './component/ElectronicsSidebar.jsx'
import MSCSideBar from './component/MSCSideBar.jsx'
import PharmacySidebar from './component/PharmacySidebar.jsx'
import RestaurantSidebar from './component/RestaurantSidebar.jsx'
import SuperMarketSidebar from './component/SuperMarketSidebar.jsx'
import TopNavBar from './component/TopNavBar.jsx'
import Login from './pages/Vendor Login/Login.jsx'
import AdminDashboard from './pages/Admin/Home/Dashboard.jsx'
import AdminRemainders from './pages/Admin/Home/Remainders.jsx'
import AdminSales from './pages/Admin/Home/Sales.jsx'
import AdminShipment from './pages/Admin/Home/Shipment.jsx'
import AdminSalseData from './pages/Admin/Home/SalseData.jsx'
import AdministerBackup from './pages/Admin/Administer Backup/AdministerBackup.jsx'
import ManageModules from './pages/Admin/Modules/ManageModules.jsx'
import SuperAdminDashboard from './pages/Admin/Superadmin/SuperAdminDashboard.jsx'
import WebsiteDashboard from './pages/Admin/Website/Dashboard.jsx'
import WebsiteBlogs from './pages/Admin/Website/Blogs.jsx'
import WebsitePages from './pages/Admin/Website/Pages.jsx'
import WebsiteSEOPanel from './pages/Admin/Website/SEOPanel.jsx'
import WebsiteCreatePage from './pages/Admin/Website/CreatePage.jsx'
import WebsiteAddBlogPost from './pages/Admin/Website/AddBlogPost.jsx'
import WebsiteImportBlogPost from './pages/Admin/Website/ImportBlogPost.jsx'
import StockExpiryReport from './pages/Admin/Reports/StockExpiryReport.jsx'
import RestaurantDashboard from './pages/Restaurant/Home/Dashboard.jsx'
import RestaurantRemainders from './pages/Restaurant/Home/Remainders.jsx'
import RestaurantSales from './pages/Restaurant/Home/Sales.jsx'
import RestaurantShipment from './pages/Restaurant/Home/Shipment.jsx'
import RestaurantSalseData from './pages/Restaurant/Home/SalseData.jsx'
import RestaurantCategories from './pages/Restaurant/Restaurant/Categories.jsx'
import RestaurantMenuItems from './pages/Restaurant/Restaurant/MenuItems.jsx'
import RestaurantBillingKOT from './pages/Restaurant/Restaurant/BillingKOT.jsx'
import RestaurantCashier from './pages/Restaurant/Restaurant/Cashier.jsx'
import RestaurantOutletTime from './pages/Restaurant/Restaurant/OutletTime.jsx'
import RestaurantLiveOrders from './pages/Restaurant/Restaurant/LiveOrders.jsx'
import RestaurantBillingGSTSettings from './pages/Restaurant/Restaurant/BillingGSTSettings.jsx'
import SuperMarketDashboard from './pages/SuperMarket/Home/Dashboard.jsx'
import SuperMarketRemainders from './pages/SuperMarket/Home/Remainders.jsx'
import SuperMarketSales from './pages/SuperMarket/Home/Sales.jsx'
import SuperMarketShipment from './pages/SuperMarket/Home/Shipment.jsx'
import SuperMarketSalseData from './pages/SuperMarket/Home/SalseData.jsx'
import ElectronicsDashboard from './pages/Electronics/Home/Dashboard.jsx'
import ElectronicsRemainders from './pages/Electronics/Home/Remainders.jsx'
import ElectronicsSales from './pages/Electronics/Home/Sales.jsx'
import ElectronicsShipment from './pages/Electronics/Home/Shipment.jsx'
import ElectronicsSalseData from './pages/Electronics/Home/SalseData.jsx'
import Dashboard from './pages/Pharmacy/Home/Dashboard.jsx'
import MSCDashboard from './pages/Multi-Service Center/Home/Dashboard.jsx'
import Remainders from './pages/Pharmacy/Home/Remainders.jsx'
import Sales from './pages/Pharmacy/Home/Sales.jsx'
import Shipment from './pages/Pharmacy/Home/Shipment.jsx'
import SalseData from './pages/Pharmacy/Home/SalseData.jsx'
import ListExpenses from './pages/Pharmacy/Expenses/Expences.jsx'
import AddExpense from './pages/Pharmacy/Expenses/AddExpense.jsx'
import ExpenseCategory from './pages/Pharmacy/Expenses/ExpenseCategory.jsx'
import AdminListExpenses from './pages/Admin/Expenses/Expences.jsx'
import AdminAddExpense from './pages/Admin/Expenses/AddExpense.jsx'
import ElectronicsListExpenses from './pages/Electronics/Expenses/Expences.jsx'
import ElectronicsAddExpense from './pages/Electronics/Expenses/AddExpense.jsx'
import MSCListExpenses from './pages/Multi-Service Center/Expenses/Expences.jsx'
import MSCAddExpense from './pages/Multi-Service Center/Expenses/AddExpense.jsx'
import MSCExpenseCategory from './pages/Multi-Service Center/Expenses/ExpenseCategory.jsx'
import RestaurantListExpenses from './pages/Restaurant/Expenses/Expences.jsx'
import RestaurantAddExpense from './pages/Restaurant/Expenses/AddExpense.jsx'
import SuperMarketListExpenses from './pages/SuperMarket/Expenses/Expences.jsx'
import SuperMarketAddExpense from './pages/SuperMarket/Expenses/AddExpense.jsx'
import ProfitLoss from './pages/Pharmacy/Reports/ProfiteLoss.jsx'
import MSCProfitLoss from './pages/Multi-Service Center/Reports/ProfiteLoss.jsx'
import SalesReport from './pages/Pharmacy/Reports/Sales.jsx'
import MSCSalesReport from './pages/Multi-Service Center/Reports/Sales.jsx'
import PurchaseReport from './pages/Pharmacy/Reports/Purchase.jsx'
import MSCPurchaseReport from './pages/Multi-Service Center/Reports/Purchase.jsx'
import TaxReport from './pages/Pharmacy/Reports/TaxReport.jsx'
import MSCTaxReport from './pages/Multi-Service Center/Reports/TaxReport.jsx'
import CustomersSuppliersReports from './pages/Pharmacy/Reports/CustomersSuppliersReports.jsx'
import MSCCustomersSuppliersReports from './pages/Multi-Service Center/Reports/CustomersSuppliersReports.jsx'
import CustomerReminder from './pages/Pharmacy/Reports/CustomerReminder.jsx'
import MSCCustomerReminder from './pages/Multi-Service Center/Reports/CustomerReminder.jsx'
import CustomerGroupsReport from './pages/Pharmacy/Reports/CustomerGroupsReport.jsx'
import MSCCustomerGroupsReport from './pages/Multi-Service Center/Reports/CustomerGroupsReport.jsx'
import StockReport from './pages/Pharmacy/Reports/StockReport.jsx'
import MSCStockReport from './pages/Multi-Service Center/Reports/StockReport.jsx'
import StockAdjustmentReport from './pages/Pharmacy/Reports/StockAdjustmentReport.jsx'
import MSCStockAdjustmentReport from './pages/Multi-Service Center/Reports/StockAdjustmentReport.jsx'
import RackWiseReport from './pages/Pharmacy/Reports/Rack-wiseReport.jsx'
import MSCRackWiseReport from './pages/Multi-Service Center/Reports/Rack-wiseReport.jsx'
import NotificationTemplates from './pages/Pharmacy/NotificationTemplates/NotificationTemplates.jsx'
import AIOfferSuggestions from './pages/Pharmacy/AIOfferSuggestions/AIOfferSuggestions.jsx'
import RackInventoryInsights from './pages/Pharmacy/Reports/RackInventoryInsights.jsx'
import MSCRackInventoryInsights from './pages/Multi-Service Center/Reports/RackInventoryInsights.jsx'
import Doctors from './pages/Pharmacy/Pharmacy/Doctors.jsx'
import TrendingProducts from './pages/Pharmacy/Reports/TrendingProducts.jsx'
import MSCTrendingProducts from './pages/Multi-Service Center/Reports/TrendingProducts.jsx'
import Prescriptions from './pages/Pharmacy/Pharmacy/Prescriptions.jsx'
import ItemsReport from './pages/Pharmacy/Reports/ItemsReport.jsx'
import MSCItemsReport from './pages/Multi-Service Center/Reports/ItemsReport.jsx'
import BatchRecalls from './pages/Pharmacy/Pharmacy/BatchRecalls.jsx'
import ProductPurchaseReport from './pages/Pharmacy/Reports/ProductPurchaseReport.jsx'
import MSCProductPurchaseReport from './pages/Multi-Service Center/Reports/ProductPurchaseReport.jsx'
import ProductSellReport from './pages/Pharmacy/Reports/ProductSellReport.jsx'
import MSCProductSellReport from './pages/Multi-Service Center/Reports/ProductSellReport.jsx'
import ImportClients from './pages/Pharmacy/Yearly renewal/ImportClients.jsx'
import BusinessSettings from './pages/Pharmacy/Settings/BusinessSettings.jsx'
import PurchasePaymentReport from './pages/Pharmacy/Reports/PurchasePaymentReport.jsx'
import MSCPurchasePaymentReport from './pages/Multi-Service Center/Reports/PurchasePaymentReport.jsx'
import BusinessLocations from './pages/Pharmacy/Settings/BusinessLocations.jsx'
import SellPaymentReport from './pages/Pharmacy/Reports/SellPaymentReport.jsx'
import MSCSellPaymentReport from './pages/Multi-Service Center/Reports/SellPaymentReport.jsx'
import InvoiceSettings from './pages/Pharmacy/Settings/InvoiceSettings.jsx'
import DiscountWiseReport from './pages/Pharmacy/Reports/Discount-wiseReport.jsx'
import MSCDiscountWiseReport from './pages/Multi-Service Center/Reports/Discount-wiseReport.jsx'
import BarcodeSettings from './pages/Pharmacy/Settings/BarcodeSettings.jsx'
import ExpenseReport from './pages/Pharmacy/Reports/ExpenseReport.jsx'
import MSCExpenseReport from './pages/Multi-Service Center/Reports/ExpenseReport.jsx'
import Printers from './pages/Pharmacy/Settings/Printers.jsx'
import RegisterReport from './pages/Pharmacy/Reports/RegisterReport.jsx'
import MSCRegisterReport from './pages/Multi-Service Center/Reports/RegisterReport.jsx'
import TaxRates from './pages/Pharmacy/Settings/TaxRates .jsx'
import SalesRepresentativeReport from './pages/Pharmacy/Reports/SalesRepresentativeReport.jsx'
import MSCSalesRepresentativeReport from './pages/Multi-Service Center/Reports/SalesRepresentativeReport.jsx'
import Subscription from './pages/Pharmacy/Settings/Subscription.jsx'
import ActivityLog from './pages/Pharmacy/Reports/ActivityLog.jsx'
import MSCActivityLog from './pages/Multi-Service Center/Reports/ActivityLog.jsx'
import ListStockAdjustments from './pages/Pharmacy/StockAdjustments/ListStockAdjustments.jsx'
import AddStockAdjustment from './pages/Pharmacy/StockAdjustments/AddStockAdjustment.jsx'
import MSCListStockAdjustments from './pages/Multi-Service Center/StockAdjustments/ListStockAdjustments.jsx'
import MSCAddStockAdjustment from './pages/Multi-Service Center/StockAdjustments/AddStockAdjustment.jsx'
import AdminListStockAdjustments from './pages/Admin/StockAdjustments/ListStockAdjustments.jsx'
import AdminAddStockAdjustment from './pages/Admin/StockAdjustments/AddStockAdjustment.jsx'
import ElectronicsListStockAdjustments from './pages/Electronics/StockAdjustments/ListStockAdjustments.jsx'
import ElectronicsAddStockAdjustment from './pages/Electronics/StockAdjustments/AddStockAdjustment.jsx'
import RestaurantListStockAdjustments from './pages/Restaurant/StockAdjustments/ListStockAdjustments.jsx'
import RestaurantAddStockAdjustment from './pages/Restaurant/StockAdjustments/AddStockAdjustment.jsx'
import SuperMarketListStockAdjustments from './pages/SuperMarket/StockAdjustments/ListStockAdjustments.jsx'
import SuperMarketAddStockAdjustment from './pages/SuperMarket/StockAdjustments/AddStockAdjustment.jsx'
import Stocks from './pages/Pharmacy/Stocks/Stocks.jsx'
import ModifyBill from './pages/Pharmacy/Modify Bill/ModifyBill.jsx'
import EWayBill from './pages/Pharmacy/E-WayBill/E-WayBill.jsx'
import ListStockTransfers from './pages/Pharmacy/StockTransfers/ListStockTransfers.jsx'
import AdminListStockTransfers from './pages/Admin/StockTransfers/ListStockTransfers.jsx'
import ElectronicsListStockTransfers from './pages/Electronics/StockTransfers/ListStockTransfers.jsx'
import MSCListStockTransfers from './pages/Multi-Service Center/StockTransfers/ListStockTransfers.jsx'
import RestaurantListStockTransfers from './pages/Restaurant/StockTransfers/ListStockTransfers.jsx'
import SuperMarketListStockTransfers from './pages/SuperMarket/StockTransfers/ListStockTransfers.jsx'
import AddStockTransfer from './pages/Pharmacy/StockTransfers/AddStockTransfer.jsx'
import AdminAddStockTransfer from './pages/Admin/StockTransfers/AddStockTransfer.jsx'
import ElectronicsAddStockTransfer from './pages/Electronics/StockTransfers/AddStockTransfer.jsx'
import MSCAddStockTransfer from './pages/Multi-Service Center/StockTransfers/AddStockTransfer.jsx'
import RestaurantAddStockTransfer from './pages/Restaurant/StockTransfers/AddStockTransfer.jsx'
import SuperMarketAddStockTransfer from './pages/SuperMarket/StockTransfers/AddStockTransfer.jsx'
import EditStockTransfer from './pages/Pharmacy/StockTransfers/EditStockTransfer.jsx'
import PharmacyUsers from './pages/Pharmacy/User_Management/Users.jsx'
import PharmacyRoles from './pages/Pharmacy/User_Management/Roles.jsx'
import PharmacySalesCommissionAgents from './pages/Pharmacy/User_Management/SCA.jsx'
import PharmacySuppliers from './pages/Pharmacy/Contacts/Suppliers.jsx'
import PharmacyCustomers from './pages/Pharmacy/Contacts/Customers.jsx'
import PharmacyCustomerGroups from './pages/Pharmacy/Contacts/Customer_Groups.jsx'
import PharmacyImportContacts from './pages/Pharmacy/Contacts/Import_Contacts.jsx'
import PharmacyWishes from './pages/Pharmacy/Wishes/Wishes.jsx'
import PharmacyListProducts from './pages/Pharmacy/Products/List_Products.jsx'
import PharmacyAddProduct from './pages/Pharmacy/Products/Add_Product.jsx'
import PharmacyUpdatePrice from './pages/Pharmacy/Products/Update_Price.jsx'
import PharmacyPrintLabels from './pages/Pharmacy/Products/Print_Labels.jsx'
import PharmacyVariations from './pages/Pharmacy/Products/Variations.jsx'
import PharmacyImportProducts from './pages/Pharmacy/Products/Import_Products.jsx'
import PharmacyImportOpeningStock from './pages/Pharmacy/Products/IOS.jsx'
import PharmacySellingPriceGroups from './pages/Pharmacy/Products/SPG.jsx'
import PharmacyUnits from './pages/Pharmacy/Products/Units.jsx'
import PharmacyCategories from './pages/Pharmacy/Products/Categories.jsx'
import PharmacyBrands from './pages/Pharmacy/Products/Brands.jsx'
import PharmacyWarranties from './pages/Pharmacy/Products/Warranties.jsx'
import PharmacyListPurchases from './pages/Pharmacy/Purchases/List_Purchases.jsx'
import PharmacyAddPurchase from './pages/Pharmacy/Purchases/Add_Purchase.jsx'
import PharmacyListPurchaseReturn from './pages/Pharmacy/Purchases/List_Purchase_Return.jsx'
import PharmacySalesOrder from './pages/Pharmacy/Sell/Sales_order.jsx'
import PharmacyAllSales from './pages/Pharmacy/Sell/All_Sales.jsx'
import PharmacyAddSale from './pages/Pharmacy/Sell/Add_Sale.jsx'
import PharmacyAddDraft from './pages/Pharmacy/Sell/Add_Draft.jsx'
import PharmacyAddQuotation from './pages/Pharmacy/Sell/Add_Quotation.jsx'
import PharmacyListDraft from './pages/Pharmacy/Sell/List_Draft.jsx'
import PharmacyListQuotation from './pages/Pharmacy/Sell/List_Quotation.jsx'
import PharmacyListSellReturn from './pages/Pharmacy/Sell/LSR.jsx'
import PharmacyShipments from './pages/Pharmacy/Sell/Shipments.jsx'
import PharmacyDiscounts from './pages/Pharmacy/Sell/Discounts.jsx'
import PharmacyImportSales from './pages/Pharmacy/Sell/Import_Sales.jsx'
import PharmacyListPOS from './pages/Pharmacy/Sell/List_POS.jsx'
import PharmacyPOS from './pages/Pharmacy/Sell/POS.jsx'

const businessTablePages = [
  'User Management',
  'Users',
  'Roles',
  'Sales Commission Agents',
  'Contacts',
  'Suppliers',
  'Customers',
  'Customer Groups',
  'Import Contacts',
  'Wishes',
  'Products',
  'List Products',
  'Add Product',
  'Update Price',
  'Print Labels',
  'Variations',
  'Import Products',
  'Import Opening Stock',
  'Selling Price Group',
  'Units',
  'Categories',
  'Brands',
  'Warranties',
  'Purchases',
  'List Purchases',
  'Add Purchase',
  'List Purchase Return',
  'Sales',
  'Sales Order',
  'All Sales',
  'Add Sale',
  'List POS',
  'POS',
  'Add Draft',
  'List Draft',
  'Add Quotation',
  'List Quotations',
  'List Sell Return',
  'Shipments',
  'Discounts',
  'Import Sales',
]

function App() {
  const [activePage, setActivePage] = useState('Home')
  const [selectedStockTransfer, setSelectedStockTransfer] = useState(null)
  const [activeBusiness, setActiveBusiness] = useState(null)
  const [stockTransferReturnPage, setStockTransferReturnPage] = useState(
    'List Stock Transfers'
  )
  const [websiteCreatePageReturnPage, setWebsiteCreatePageReturnPage] = useState(
    'Website Dashboard'
  )
  const [websiteAddBlogReturnPage, setWebsiteAddBlogReturnPage] = useState(
    'Website Dashboard'
  )
  const [websiteImportBlogReturnPage, setWebsiteImportBlogReturnPage] =
    useState('Website Blogs')
  const [websiteBlogEditContext, setWebsiteBlogEditContext] = useState(null)
  const [websiteBlogUpdate, setWebsiteBlogUpdate] = useState(null)
  const [websitePageEditContext, setWebsitePageEditContext] = useState(null)
  const [websitePageUpdate, setWebsitePageUpdate] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activePage])

  const sidebarActivePage =
    activePage === 'Website Import Blog Post'
      ? websiteImportBlogReturnPage
      : activePage === 'Website Add Blog Post'
      ? websiteAddBlogReturnPage
      : activePage === 'Website Create Page'
      ? websiteCreatePageReturnPage
      : activePage === 'Dashboard'
      ? 'Home'
      : activePage === 'Edit Stock Transfers'
        ? 'List Stock Transfers'
        : activePage

  const openWebsiteCreatePage = (returnPage) => {
    setWebsitePageEditContext(null)
    setWebsiteCreatePageReturnPage(returnPage)
    setActivePage('Website Create Page')
  }

  const openWebsitePageEdit = (item, returnPage, source) => {
    setWebsitePageEditContext({ item, returnPage, source })
    setWebsiteCreatePageReturnPage(returnPage)
    setActivePage('Website Create Page')
  }

  const openWebsiteAddBlogPost = (returnPage) => {
    setWebsiteBlogEditContext(null)
    setWebsiteAddBlogReturnPage(returnPage)
    setActivePage('Website Add Blog Post')
  }

  const openWebsiteBlogEdit = (item, returnPage, source) => {
    setWebsiteBlogEditContext({ item, returnPage, source })
    setWebsiteAddBlogReturnPage(returnPage)
    setActivePage('Website Add Blog Post')
  }

  const openWebsiteImportBlogPost = (returnPage) => {
    setWebsiteImportBlogReturnPage(returnPage)
    setActivePage('Website Import Blog Post')
  }

  const openAddStockTransfer = (returnPage) => {
    setStockTransferReturnPage(returnPage)
    setActivePage('Add Stock Transfers')
  }

  const pageContent = (() => {
    switch (activePage) {
      case 'SuperAdmin':
        if (activeBusiness === 'Admin') {
          return <SuperAdminDashboard />
        }
        return null
      case 'Website Dashboard':
        if (activeBusiness === 'Admin') {
          return (
            <WebsiteDashboard
              onNavigate={setActivePage}
              onCreatePage={() => openWebsiteCreatePage('Website Dashboard')}
              onCreateBlog={() =>
                openWebsiteAddBlogPost('Website Dashboard')
              }
              onOpenSeo={() => setActivePage('Website SEO Panel')}
              onEditPage={(item) =>
                openWebsitePageEdit(item, 'Website Dashboard', 'dashboard')
              }
              editedPage={websitePageUpdate}
              onEditBlog={(item) =>
                openWebsiteBlogEdit(item, 'Website Dashboard', 'dashboard')
              }
              editedBlog={websiteBlogUpdate}
            />
          )
        }
        return null
      case 'Website Blogs':
        if (activeBusiness === 'Admin') {
          return (
            <WebsiteBlogs
              onAddBlog={() => openWebsiteAddBlogPost('Website Blogs')}
              onImportBlog={() =>
                openWebsiteImportBlogPost('Website Blogs')
              }
              onEditBlog={(item) =>
                openWebsiteBlogEdit(item, 'Website Blogs', 'blogs')
              }
              editedBlog={websiteBlogUpdate}
            />
          )
        }
        return null
      case 'Website Pages':
        if (activeBusiness === 'Admin') {
          return (
            <WebsitePages
              onAddPage={() => openWebsiteCreatePage('Website Pages')}
              onEditPage={(item) =>
                openWebsitePageEdit(item, 'Website Pages', 'pages')
              }
              editedPage={websitePageUpdate}
            />
          )
        }
        return null
      case 'Website Create Page':
        if (activeBusiness === 'Admin') {
          return (
            <WebsiteCreatePage
              initialData={
                websitePageEditContext
                  ? websitePageEditContext.source === 'dashboard'
                    ? {
                        ...websitePageEditContext.item,
                        excerpt: websitePageEditContext.item.description || '',
                        publishImmediately:
                          websitePageEditContext.item.status === 'Published',
                      }
                    : {
                        ...websitePageEditContext.item,
                        excerpt: '',
                        metaTitle: websitePageEditContext.item.seoTitle || '',
                        publishImmediately:
                          websitePageEditContext.item.status === 'Published',
                        showInNavigation: Boolean(
                          websitePageEditContext.item.navbar
                        ),
                      }
                  : undefined
              }
              isEditing={Boolean(websitePageEditContext)}
              onBack={() =>
                setActivePage(
                  websitePageEditContext?.returnPage ||
                    websiteCreatePageReturnPage
                )
              }
              onSave={
                websitePageEditContext
                  ? (data) => {
                      setWebsitePageUpdate({
                        source: websitePageEditContext.source,
                        id: websitePageEditContext.item.id,
                        data,
                      })
                      setActivePage(websitePageEditContext.returnPage)
                      setWebsitePageEditContext(null)
                    }
                  : undefined
              }
              backLabel={
                (websitePageEditContext?.returnPage ||
                  websiteCreatePageReturnPage) === 'Website Pages'
                  ? 'Back to Website Pages'
                  : 'Back to Dashboard'
              }
            />
          )
        }
        return null
      case 'Website Add Blog Post':
        if (activeBusiness === 'Admin') {
          return (
            <WebsiteAddBlogPost
              initialData={websiteBlogEditContext
                ? {
                    ...websiteBlogEditContext.item,
                    metaTitle:
                      websiteBlogEditContext.item.metaTitle ||
                      websiteBlogEditContext.item.seoTitle ||
                      '',
                    publishedAt:
                      websiteBlogEditContext.item.publishedAt ||
                      websiteBlogEditContext.item.published ||
                      websiteBlogEditContext.item.updated ||
                      '',
                    publishImmediately:
                      websiteBlogEditContext.item.status === 'Published',
                  }
                : undefined}
              isEditing={Boolean(websiteBlogEditContext)}
              onSave={
                websiteBlogEditContext
                  ? (data) => {
                      setWebsiteBlogUpdate({
                        source: websiteBlogEditContext.source,
                        id: websiteBlogEditContext.item.id,
                        data,
                      })
                      setActivePage(websiteBlogEditContext.returnPage)
                      setWebsiteBlogEditContext(null)
                    }
                  : undefined
              }
              onCancel={() => setActivePage(websiteAddBlogReturnPage)}
              cancelLabel={
                websiteAddBlogReturnPage === 'Website Blogs'
                  ? 'Back to Blogs'
                  : 'Back to Dashboard'
              }
            />
          )
        }
        return null
      case 'Website Import Blog Post':
        if (activeBusiness === 'Admin') {
          return (
            <WebsiteImportBlogPost
              onCancel={() => setActivePage(websiteImportBlogReturnPage)}
            />
          )
        }
        return null
      case 'Website SEO Panel':
        if (activeBusiness === 'Admin') {
          return <WebsiteSEOPanel />
        }
        return null
      case 'Dashboard':
      case 'Home':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCDashboard />
        }
        if (activeBusiness === 'Admin') {
          return (
            <>
              <AdminDashboard />
              <AdminRemainders />
              <AdminSales />
              <AdminShipment />
              <AdminSalseData />
            </>
          )
        }
        if (activeBusiness === 'Restaurant') {
          return (
            <>
              <RestaurantDashboard />
              <RestaurantRemainders />
              <RestaurantSales />
              <RestaurantShipment />
              <RestaurantSalseData />
            </>
          )
        }
        if (activeBusiness === 'Super Market') {
          return (
            <>
              <SuperMarketDashboard />
              <SuperMarketRemainders />
              <SuperMarketSales />
              <SuperMarketShipment />
              <SuperMarketSalseData />
            </>
          )
        }
        if (activeBusiness === 'Electronics & MobileShop') {
          return (
            <>
              <ElectronicsDashboard />
              <ElectronicsRemainders />
              <ElectronicsSales />
              <ElectronicsShipment />
              <ElectronicsSalseData />
            </>
          )
        }
        return (
          <>
            <Dashboard />
            <Remainders />
            <Sales />
            <Shipment />
            <SalseData />
          </>
        )
      case 'User Management':
      case 'Users':
        return <PharmacyUsers />
      case 'Roles':
        return <PharmacyRoles />
      case 'Sales Commission Agents':
        return <PharmacySalesCommissionAgents />
      case 'Contacts':
      case 'Suppliers':
        return <PharmacySuppliers />
      case 'Customers':
        return <PharmacyCustomers />
      case 'Customer Groups':
        return <PharmacyCustomerGroups />
      case 'Import Contacts':
        return <PharmacyImportContacts />
      case 'Wishes':
        return <PharmacyWishes />
      case 'Products':
      case 'List Products':
        return <PharmacyListProducts onNavigate={setActivePage} />
      case 'Add Product':
        return <PharmacyAddProduct onNavigate={setActivePage} />
      case 'Update Price':
        return <PharmacyUpdatePrice onNavigate={setActivePage} />
      case 'Print Labels':
        return <PharmacyPrintLabels />
      case 'Variations':
        return <PharmacyVariations />
      case 'Import Products':
        return <PharmacyImportProducts />
      case 'Import Opening Stock':
        return <PharmacyImportOpeningStock />
      case 'Selling Price Group':
        return <PharmacySellingPriceGroups />
      case 'Units':
        return <PharmacyUnits />
      case 'Categories':
        return <PharmacyCategories />
      case 'Brands':
        return <PharmacyBrands />
      case 'Warranties':
        return <PharmacyWarranties />
      case 'Purchases':
      case 'List Purchases':
        return <PharmacyListPurchases onNavigate={setActivePage} />
      case 'Add Purchase':
        return <PharmacyAddPurchase onNavigate={setActivePage} />
      case 'List Purchase Return':
        return <PharmacyListPurchaseReturn />
      case 'Sales Order':
        return <PharmacySalesOrder />
      case 'Sales':
      case 'Sell':
      case 'All Sales':
        return <PharmacyAllSales />
      case 'List POS':
        return <PharmacyListPOS />
      case 'POS':
        return <PharmacyPOS onNavigate={setActivePage} />
      case 'Add Sale':
        return <PharmacyAddSale onNavigate={setActivePage} />
      case 'Add Draft':
        return <PharmacyAddDraft onNavigate={setActivePage} />
      case 'List Draft':
        return <PharmacyListDraft onNavigate={setActivePage} />
      case 'Add Quotation':
        return <PharmacyAddQuotation onNavigate={setActivePage} />
      case 'List Quotations':
        return <PharmacyListQuotation onNavigate={setActivePage} />
      case 'List Sell Return':
        return <PharmacyListSellReturn />
      case 'Shipments':
        return <PharmacyShipments />
      case 'Discounts':
        return <PharmacyDiscounts />
      case 'Import Sales':
        return <PharmacyImportSales />
      case 'Menu Categories':
        return <RestaurantCategories />
      case 'Menu Items':
        return <RestaurantMenuItems />
      case 'Billing & KOT':
        return <RestaurantBillingKOT />
      case 'Cashier':
        return <RestaurantCashier />
      case 'Outlet Time':
        return <RestaurantOutletTime />
      case 'Live Orders':
        return <RestaurantLiveOrders />
      case 'Billing & GST Settings':
        return <RestaurantBillingGSTSettings />
      case 'List Expenses':
        if (activeBusiness === 'Admin') {
          return <AdminListExpenses onNavigate={setActivePage} />
        }
        if (activeBusiness === 'Electronics & MobileShop') {
          return <ElectronicsListExpenses onNavigate={setActivePage} />
        }
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCListExpenses onNavigate={setActivePage} />
        }
        if (activeBusiness === 'Restaurant') {
          return <RestaurantListExpenses onNavigate={setActivePage} />
        }
        if (activeBusiness === 'Super Market') {
          return <SuperMarketListExpenses onNavigate={setActivePage} />
        }
        return <ListExpenses onNavigate={setActivePage} />
      case 'Add Expense':
        if (activeBusiness === 'Admin') {
          return <AdminAddExpense onBack={() => setActivePage('List Expenses')} />
        }
        if (activeBusiness === 'Electronics & MobileShop') {
          return <ElectronicsAddExpense onBack={() => setActivePage('List Expenses')} />
        }
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCAddExpense onBack={() => setActivePage('List Expenses')} />
        }
        if (activeBusiness === 'Restaurant') {
          return <RestaurantAddExpense onBack={() => setActivePage('List Expenses')} />
        }
        if (activeBusiness === 'Super Market') {
          return <SuperMarketAddExpense onBack={() => setActivePage('List Expenses')} />
        }
        return <AddExpense onBack={() => setActivePage('List Expenses')} />
      case 'Expense Categories':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCExpenseCategory />
        }
        return <ExpenseCategory />
      case 'Reports':
      case 'Profit / Loss Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCProfitLoss />
        }
        return <ProfitLoss />
      case 'Sales Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCSalesReport />
        }
        return <SalesReport />
      case 'Purchase & Sale':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCPurchaseReport />
        }
        return <PurchaseReport />
      case 'Tax Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCTaxReport />
        }
        return <TaxReport />
      case 'Customers & Suppliers Reports':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCCustomersSuppliersReports />
        }
        return <CustomersSuppliersReports />
      case 'Customer Reminders':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCCustomerReminder />
        }
        return <CustomerReminder />
      case 'Customer Groups Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCCustomerGroupsReport />
        }
        return <CustomerGroupsReport />
      case 'Stock Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCStockReport />
        }
        return <StockReport />
      case 'Stock Expiry Report':
        return <StockExpiryReport />
      case 'Stock Adjustment Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCStockAdjustmentReport />
        }
        return <StockAdjustmentReport />
      case 'Stocks (Expiry/Dump/Faulty)':
        return <Stocks onNavigate={setActivePage} />
      case 'Modify Bill':
        return <ModifyBill />
      case 'E-Way Bill':
        return <EWayBill />
      case 'List Stock Adjustments':
        if (activeBusiness === 'Admin') {
          return (
            <AdminListStockAdjustments
              onAdd={() => openAddStockTransfer('List Stock Adjustments')}
            />
          )
        }
        if (activeBusiness === 'Electronics & MobileShop') {
          return (
            <ElectronicsListStockAdjustments
              onAdd={() => openAddStockTransfer('List Stock Adjustments')}
            />
          )
        }
        if (activeBusiness === 'Multi-Service Center') {
          return (
            <MSCListStockAdjustments
              onAdd={() => openAddStockTransfer('List Stock Adjustments')}
            />
          )
        }
        if (activeBusiness === 'Restaurant') {
          return (
            <RestaurantListStockAdjustments
              onAdd={() => openAddStockTransfer('List Stock Adjustments')}
            />
          )
        }
        if (activeBusiness === 'Super Market') {
          return (
            <SuperMarketListStockAdjustments
              onAdd={() => openAddStockTransfer('List Stock Adjustments')}
            />
          )
        }
        return (
          <ListStockAdjustments
            onAdd={() => openAddStockTransfer('List Stock Adjustments')}
          />
        )
      case 'Add Stock Adjustments':
        if (activeBusiness === 'Admin') {
          return <AdminAddStockAdjustment />
        }
        if (activeBusiness === 'Electronics & MobileShop') {
          return <ElectronicsAddStockAdjustment />
        }
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCAddStockAdjustment />
        }
        if (activeBusiness === 'Restaurant') {
          return <RestaurantAddStockAdjustment />
        }
        if (activeBusiness === 'Super Market') {
          return <SuperMarketAddStockAdjustment />
        }
        return <AddStockAdjustment />
      case 'List Stock Transfers':
        if (activeBusiness === 'Admin') {
          return (
            <AdminListStockTransfers
              onAdd={() => openAddStockTransfer('List Stock Transfers')}
            />
          )
        }
        if (activeBusiness === 'Electronics & MobileShop') {
          return (
            <ElectronicsListStockTransfers
              onAdd={() => openAddStockTransfer('List Stock Transfers')}
            />
          )
        }
        if (activeBusiness === 'Multi-Service Center') {
          return (
            <MSCListStockTransfers
              onAdd={() => openAddStockTransfer('List Stock Transfers')}
            />
          )
        }
        if (activeBusiness === 'Restaurant') {
          return (
            <RestaurantListStockTransfers
              onAdd={() => openAddStockTransfer('List Stock Transfers')}
            />
          )
        }
        if (activeBusiness === 'Super Market') {
          return (
            <SuperMarketListStockTransfers
              onAdd={() => openAddStockTransfer('List Stock Transfers')}
            />
          )
        }
        return (
          <ListStockTransfers
            onAdd={() => openAddStockTransfer('List Stock Transfers')}
            onEdit={(transfer) => {
              setSelectedStockTransfer(transfer)
              setActivePage('Edit Stock Transfers')
            }}
          />
        )
      case 'Add Stock Transfers':
        if (activeBusiness === 'Admin') {
          return (
            <AdminAddStockTransfer
              onCancel={() => setActivePage(stockTransferReturnPage)}
            />
          )
        }
        if (activeBusiness === 'Electronics & MobileShop') {
          return (
            <ElectronicsAddStockTransfer
              onCancel={() => setActivePage(stockTransferReturnPage)}
            />
          )
        }
        if (activeBusiness === 'Multi-Service Center') {
          return (
            <MSCAddStockTransfer
              onCancel={() => setActivePage(stockTransferReturnPage)}
            />
          )
        }
        if (activeBusiness === 'Restaurant') {
          return (
            <RestaurantAddStockTransfer
              onCancel={() => setActivePage(stockTransferReturnPage)}
            />
          )
        }
        if (activeBusiness === 'Super Market') {
          return (
            <SuperMarketAddStockTransfer
              onCancel={() => setActivePage(stockTransferReturnPage)}
            />
          )
        }
        return (
          <AddStockTransfer
            onCancel={() => setActivePage(stockTransferReturnPage)}
          />
        )
      case 'Edit Stock Transfers':
        return (
          <EditStockTransfer
            transfer={selectedStockTransfer}
            onCancel={() => setActivePage('List Stock Transfers')}
          />
        )
      case 'Rack-wise Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCRackWiseReport />
        }
        return <RackWiseReport />
      case 'Notification Templates':
        return <NotificationTemplates />
      case 'AI Offer Suggestions':
        return <AIOfferSuggestions />
      case 'Rack Inventory Insights':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCRackInventoryInsights />
        }
        return <RackInventoryInsights />
      case 'Doctors':
        return <Doctors />
      case 'Trending Products':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCTrendingProducts />
        }
        return <TrendingProducts />
      case 'Prescriptions':
        return <Prescriptions />
      case 'Items Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCItemsReport />
        }
        return <ItemsReport />
      case 'Batch Recalls':
        return <BatchRecalls />
      case 'Product Purchase Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCProductPurchaseReport />
        }
        return <ProductPurchaseReport />
      case 'Product Sell Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCProductSellReport />
        }
        return <ProductSellReport />
      case 'Purchase Payment Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCPurchasePaymentReport />
        }
        return <PurchasePaymentReport />
      case 'Sell Payment Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCSellPaymentReport />
        }
        return <SellPaymentReport />
      case 'Yearly renewal':
        return <ImportClients />
      case 'Business Settings':
        return <BusinessSettings />
      case 'Business Locations':
        return <BusinessLocations />
      case 'Invoice Settings':
        return <InvoiceSettings />
      case 'Barcode Settings':
        return <BarcodeSettings />
      case 'Discount-wise Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCDiscountWiseReport />
        }
        return <DiscountWiseReport />
      case 'Expense Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCExpenseReport />
        }
        return <ExpenseReport />
      case 'Receipt Printers':
        return <Printers />
      case 'Register Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCRegisterReport />
        }
        return <RegisterReport />
      case 'Tax Rates':
        return <TaxRates />
      case 'Sales Representative Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCSalesRepresentativeReport />
        }
        return <SalesRepresentativeReport />
      case 'Package Subscription':
        return <Subscription />
      case 'Activity Log':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCActivityLog />
        }
        return <ActivityLog />
      case 'Administer Backup':
        return <AdministerBackup />
      case 'Modules':
        return <ManageModules />
      default:
        return null
    }
  })()

  if (!activeBusiness) {
    return (
      <Login
        onSelectBusiness={(business) => {
          if (
            business === 'Admin' ||
            business === 'Pharmacy' ||
            business === 'Multi-Service Center' ||
            business === 'Restaurant' ||
            business === 'Super Market' ||
            business === 'Electronics & MobileShop'
          ) {
            setActivePage('Home')
            setActiveBusinessStorage(business)
            setActiveBusiness(business)
          }
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      {activeBusiness === 'Admin' ? (
        <AdminSidebar activePage={sidebarActivePage} onNavigate={setActivePage} />
      ) : activeBusiness === 'Electronics & MobileShop' ? (
        <ElectronicsSidebar activePage={sidebarActivePage} onNavigate={setActivePage} />
      ) : activeBusiness === 'Multi-Service Center' ? (
        <MSCSideBar activePage={sidebarActivePage} onNavigate={setActivePage} />
      ) : activeBusiness === 'Restaurant' ? (
        <RestaurantSidebar activePage={sidebarActivePage} onNavigate={setActivePage} />
      ) : activeBusiness === 'Super Market' ? (
        <SuperMarketSidebar activePage={sidebarActivePage} onNavigate={setActivePage} />
      ) : (
        <PharmacySidebar activePage={sidebarActivePage} onNavigate={setActivePage} />
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopNavBar
          businessName={activeBusiness}
          onLogout={() => {
            setActivePage('Home')
            setSelectedStockTransfer(null)
            setActiveBusinessStorage(null)
            setActiveBusiness(null)
          }}
        />
        <div
          className={`min-h-0 flex-1 ${
            businessTablePages.includes(activePage)
              ? 'pharmacy-report-table-theme'
              : ''
          }`}
        >
          {pageContent}
        </div>
      </div>
    </div>
  )
}

export default App
