import { useState } from 'react'
import './App.css'
import Sidebar from './component/Sidebar.jsx'
import TopNavBar from './component/TopNavBar.jsx'
import Dashboard from './pages/Pharmacy/Home/Dashboard.jsx'
import Remainders from './pages/Pharmacy/Home/Remainders.jsx'
import Sales from './pages/Pharmacy/Home/Sales.jsx'
import Shipment from './pages/Pharmacy/Home/Shipment.jsx'
import SalseData from './pages/Pharmacy/Home/SalseData.jsx'
import ListExpenses from './pages/Pharmacy/Expenses/Expences.jsx'
import AddExpense from './pages/Pharmacy/Expenses/AddExpense.jsx'
import ExpenseCategory from './pages/Pharmacy/Expenses/ExpenseCategory.jsx'

function App() {
  const [activePage, setActivePage] = useState('Home')

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar onNavigate={setActivePage} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavBar />
        {activePage === 'Home' && (
          <>
            <Dashboard />
            <Remainders />
            <Sales />
            <Shipment />
            <SalseData />
          </>
        )}
        {activePage === 'List Expenses' && <ListExpenses />}
        {activePage === 'Add Expense' && <AddExpense />}
        {activePage === 'Expense Categories' && <ExpenseCategory />}
      </div>
    </div>
  )
}

export default App
