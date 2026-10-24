import { useState } from 'react'
import './App.css'
import Sidebar from './component/Pharmacy-Sidebar.jsx'
import TopNavBar from './component/TopNavBar.jsx'
import Dashboard from './pages/Pharmacy/Home/Dashboard.jsx'
import Remainders from './pages/Pharmacy/Home/Remainders.jsx'
import Sales from './pages/Pharmacy/Home/Sales.jsx'
import Shipment from './pages/Pharmacy/Home/Shipment.jsx'
import SalseData from './pages/Pharmacy/Home/SalseData.jsx'
import ListExpenses from './pages/Pharmacy/Expenses/Expences.jsx'
import AddExpense from './pages/Pharmacy/Expenses/AddExpense.jsx'
import ExpenseCategory from './pages/Pharmacy/Expenses/ExpenseCategory.jsx'
import ProfitLoss from './pages/Pharmacy/Reports/ProfiteLoss.jsx'
import SalesReport from './pages/Pharmacy/Reports/Sales.jsx'
import PurchaseReport from './pages/Pharmacy/Reports/Purchase.jsx'
import TaxReport from './pages/Pharmacy/Reports/TaxReport.jsx'
import CustomersSuppliersReports from './pages/Pharmacy/Reports/CustomersSuppliersReports.jsx'
import CustomerReminder from './pages/Pharmacy/Reports/CustomerReminder.jsx'
import CustomerGroupsReport from './pages/Pharmacy/Reports/CustomerGroupsReport.jsx'
import StockReport from './pages/Pharmacy/Reports/StockReport.jsx'
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
import Stocks from './pages/Pharmacy/Stocks/Stocks.jsx'
import ModifyBill from './pages/Pharmacy/Modify Bill/ModifyBill.jsx'
import EWayBill from './pages/Pharmacy/E-WayBill/E-WayBill.jsx'
import ListStockTransfers from './pages/Pharmacy/StockTransfers/ListStockTransfers.jsx'
import AddStockTransfer from './pages/Pharmacy/StockTransfers/AddStockTransfer.jsx'
import EditStockTransfer from './pages/Pharmacy/StockTransfers/EditStockTransfer.jsx'

function App() {
  const [activePage, setActivePage] = useState('Home')
  const [selectedStockTransfer, setSelectedStockTransfer] = useState(null)

  const pageContent = (() => {
    switch (activePage) {
      case 'Home':
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
        return <ListExpenses onNavigate={setActivePage} />
      case 'Add Expense':
        return <AddExpense />
      case 'Expense Categories':
        return <ExpenseCategory />
      case 'Reports':
      case 'Profit / Loss Report':
        return <ProfitLoss />
      case 'Sales Report':
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
        return (
          <ListStockAdjustments
            onAdd={() => setActivePage('Add Stock Adjustments')}
          />
        )
      case 'Add Stock Adjustments':
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

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar onNavigate={setActivePage} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopNavBar />
        <div className="min-h-0 flex-1">{pageContent}</div>
      </div>
    </div>
  )
}

export default App
