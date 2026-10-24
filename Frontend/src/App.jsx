import { useState } from 'react'
import './App.css'
import MSCSideBar from './component/MSCSideBar.jsx'
import PharmacySidebar from './component/PharmacySidebar.jsx'
import TopNavBar from './component/TopNavBar.jsx'
import Login from './pages/Vendor Login/Login.jsx'
import Dashboard from './pages/Pharmacy/Home/Dashboard.jsx'
import MSCDashboard from './pages/Multi-Service Center/Home/Dashboard.jsx'
import Remainders from './pages/Pharmacy/Home/Remainders.jsx'
import Sales from './pages/Pharmacy/Home/Sales.jsx'
import Shipment from './pages/Pharmacy/Home/Shipment.jsx'
import SalseData from './pages/Pharmacy/Home/SalseData.jsx'
import ListExpenses from './pages/Pharmacy/Expenses/Expences.jsx'
import AddExpense from './pages/Pharmacy/Expenses/AddExpense.jsx'
import ExpenseCategory from './pages/Pharmacy/Expenses/ExpenseCategory.jsx'
import MSCListExpenses from './pages/Multi-Service Center/Expenses/Expences.jsx'
import MSCAddExpense from './pages/Multi-Service Center/Expenses/AddExpense.jsx'
import MSCExpenseCategory from './pages/Multi-Service Center/Expenses/ExpenseCategory.jsx'
import ProfitLoss from './pages/Pharmacy/Reports/ProfiteLoss.jsx'
import MSCProfitLoss from './pages/Multi-Service Center/Reports/ProfiteLoss.jsx'
import SalesReport from './pages/Pharmacy/Reports/Sales.jsx'
import MSCSalesReport from './pages/Multi-Service Center/Reports/Sales.jsx'
import PurchaseReport from './pages/Pharmacy/Reports/Purchase.jsx'
import TaxReport from './pages/Pharmacy/Reports/TaxReport.jsx'
import CustomersSuppliersReports from './pages/Pharmacy/Reports/CustomersSuppliersReports.jsx'
import CustomerReminder from './pages/Pharmacy/Reports/CustomerReminder.jsx'
import CustomerGroupsReport from './pages/Pharmacy/Reports/CustomerGroupsReport.jsx'
import StockReport from './pages/Pharmacy/Reports/StockReport.jsx'
import MSCStockReport from './pages/Multi-Service Center/Reports/StockReport.jsx'
import StockAdjustmentReport from './pages/Pharmacy/Reports/StockAdjustmentReport.jsx'
import RackWiseReport from './pages/Pharmacy/Reports/Rack-wiseReport.jsx'
import NotificationTemplates from './pages/Pharmacy/NotificationTemplates/NotificationTemplates.jsx'
import AIOfferSuggestions from './pages/Pharmacy/AIOfferSuggestions/AIOfferSuggestions.jsx'
import RackInventoryInsights from './pages/Pharmacy/Reports/RackInventoryInsights.jsx'
import Doctors from './pages/Pharmacy/Pharmacy/Doctors.jsx'
import TrendingProducts from './pages/Pharmacy/Reports/TrendingProducts.jsx'
import Prescriptions from './pages/Pharmacy/Pharmacy/Prescriptions.jsx'
import ItemsReport from './pages/Pharmacy/Reports/ItemsReport.jsx'
import BatchRecalls from './pages/Pharmacy/Pharmacy/BatchRecalls.jsx'
import ProductPurchaseReport from './pages/Pharmacy/Reports/ProductPurchaseReport.jsx'
import ProductSellReport from './pages/Pharmacy/Reports/ProductSellReport.jsx'
import ImportClients from './pages/Pharmacy/Yearly renewal/ImportClients.jsx'
import BusinessSettings from './pages/Pharmacy/Settings/BusinessSettings.jsx'
import PurchasePaymentReport from './pages/Pharmacy/Reports/PurchasePaymentReport.jsx'
import BusinessLocations from './pages/Pharmacy/Settings/BusinessLocations.jsx'
import SellPaymentReport from './pages/Pharmacy/Reports/SellPaymentReport.jsx'
import InvoiceSettings from './pages/Pharmacy/Settings/InvoiceSettings.jsx'
import DiscountWiseReport from './pages/Pharmacy/Reports/Discount-wiseReport.jsx'
import BarcodeSettings from './pages/Pharmacy/Settings/BarcodeSettings.jsx'
import ExpenseReport from './pages/Pharmacy/Reports/ExpenseReport.jsx'
import Printers from './pages/Pharmacy/Settings/Printers.jsx'
import RegisterReport from './pages/Pharmacy/Reports/RegisterReport.jsx'
import TaxRates from './pages/Pharmacy/Settings/TaxRates .jsx'
import SalesRepresentativeReport from './pages/Pharmacy/Reports/SalesRepresentativeReport.jsx'
import Subscription from './pages/Pharmacy/Settings/Subscription.jsx'
import ActivityLog from './pages/Pharmacy/Reports/ActivityLog.jsx'
import ListStockAdjustments from './pages/Pharmacy/StockAdjustments/ListStockAdjustments.jsx'
import AddStockAdjustment from './pages/Pharmacy/StockAdjustments/AddStockAdjustment.jsx'
import MSCListStockAdjustments from './pages/Multi-Service Center/StockAdjustments/ListStockAdjustments.jsx'
import MSCAddStockAdjustment from './pages/Multi-Service Center/StockAdjustments/AddStockAdjustment.jsx'
import Stocks from './pages/Pharmacy/Stocks/Stocks.jsx'
import ModifyBill from './pages/Pharmacy/Modify Bill/ModifyBill.jsx'
import EWayBill from './pages/Pharmacy/E-WayBill/E-WayBill.jsx'
import ListStockTransfers from './pages/Pharmacy/StockTransfers/ListStockTransfers.jsx'
import AddStockTransfer from './pages/Pharmacy/StockTransfers/AddStockTransfer.jsx'
import EditStockTransfer from './pages/Pharmacy/StockTransfers/EditStockTransfer.jsx'

function App() {
  const [activePage, setActivePage] = useState('Home')
  const [selectedStockTransfer, setSelectedStockTransfer] = useState(null)
  const [activeBusiness, setActiveBusiness] = useState(null)

  const pageContent = (() => {
    switch (activePage) {
      case 'Home':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCDashboard />
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
      case 'List Expenses':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCListExpenses onNavigate={setActivePage} />
        }
        return <ListExpenses onNavigate={setActivePage} />
      case 'Add Expense':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCAddExpense />
        }
        return <AddExpense />
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
        return <PurchaseReport />
      case 'Tax Report':
        return <TaxReport />
      case 'Customers & Suppliers Reports':
        return <CustomersSuppliersReports />
      case 'Customer Reminders':
        return <CustomerReminder />
      case 'Customer Groups Report':
        return <CustomerGroupsReport />
      case 'Stock Report':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCStockReport />
        }
        return <StockReport />
      case 'Stock Adjustment Report':
        return <StockAdjustmentReport />
      case 'Stocks (Expiry/Dump/Faulty)':
        return <Stocks onNavigate={setActivePage} />
      case 'Modify Bill':
        return <ModifyBill />
      case 'E-Way Bill':
        return <EWayBill />
      case 'List Stock Adjustments':
        if (activeBusiness === 'Multi-Service Center') {
          return (
            <MSCListStockAdjustments
              onAdd={() => setActivePage('Add Stock Adjustments')}
            />
          )
        }
        return (
          <ListStockAdjustments
            onAdd={() => setActivePage('Add Stock Adjustments')}
          />
        )
      case 'Add Stock Adjustments':
        if (activeBusiness === 'Multi-Service Center') {
          return <MSCAddStockAdjustment />
        }
        return <AddStockAdjustment />
      case 'List Stock Transfers':
        return (
          <ListStockTransfers
            onAdd={() => setActivePage('Add Stock Transfers')}
            onEdit={(transfer) => {
              setSelectedStockTransfer(transfer)
              setActivePage('Edit Stock Transfers')
            }}
          />
        )
      case 'Add Stock Transfers':
        return <AddStockTransfer />
      case 'Edit Stock Transfers':
        return (
          <EditStockTransfer
            transfer={selectedStockTransfer}
            onCancel={() => setActivePage('List Stock Transfers')}
          />
        )
      case 'Rack-wise Report':
        return <RackWiseReport />
      case 'Notification Templates':
        return <NotificationTemplates />
      case 'AI Offer Suggestions':
        return <AIOfferSuggestions />
      case 'Rack Inventory Insights':
        return <RackInventoryInsights />
      case 'Doctors':
        return <Doctors />
      case 'Trending Products':
        return <TrendingProducts />
      case 'Prescriptions':
        return <Prescriptions />
      case 'Items Report':
        return <ItemsReport />
      case 'Batch Recalls':
        return <BatchRecalls />
      case 'Product Purchase Report':
        return <ProductPurchaseReport />
      case 'Product Sell Report':
        return <ProductSellReport />
      case 'Purchase Payment Report':
        return <PurchasePaymentReport />
      case 'Sell Payment Report':
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
        return <DiscountWiseReport />
      case 'Expense Report':
        return <ExpenseReport />
      case 'Receipt Printers':
        return <Printers />
      case 'Register Report':
        return <RegisterReport />
      case 'Tax Rates':
        return <TaxRates />
      case 'Sales Representative Report':
        return <SalesRepresentativeReport />
      case 'Package Subscription':
        return <Subscription />
      case 'Activity Log':
        return <ActivityLog />
      default:
        return null
    }
  })()

  if (!activeBusiness) {
    return (
      <Login
        onSelectBusiness={(business) => {
          if (business === 'Pharmacy' || business === 'Multi-Service Center') {
            setActivePage('Home')
            setActiveBusiness(business)
          }
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      {activeBusiness === 'Multi-Service Center' ? (
        <MSCSideBar onNavigate={setActivePage} />
      ) : (
        <PharmacySidebar onNavigate={setActivePage} />
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopNavBar
          businessName={activeBusiness}
          onLogout={() => {
            setActivePage('Home')
            setSelectedStockTransfer(null)
            setActiveBusiness(null)
          }}
        />
        <div className="min-h-0 flex-1">{pageContent}</div>
      </div>
    </div>
  )
}

export default App
