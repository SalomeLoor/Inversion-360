
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import InvestorPanel from './components/InvestorPanel'
import AdvisorPanel from './components/AdvisorPanel'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<HomePage />} />
          <Route path= "/dashboard" element={<Dashboard />} />
          <Route path="/inversor" element={<InvestorPanel />} />
          <Route path="/asesor" element={<AdvisorPanel />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
