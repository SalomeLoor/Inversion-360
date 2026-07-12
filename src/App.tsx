
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import InvestorPanel from './components/InvestorPanel'
import AdvisorPanel from './components/AdvisorPanel'
import Principal from './components/Principal'
import MisPropuestas from './components/MisPropuestas'
import HistorialPropuestas from './components/HistorialPropuestas'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/inversor" element={<InvestorPanel />}>
            <Route path="principal" element={<Principal />} />
            <Route path="propuestas" element={<MisPropuestas />} />
            <Route path="historial" element={<HistorialPropuestas />} />
          </Route>
          <Route path="propuestas" element={<HistorialPropuestas />} />
          <Route path="/asesor" element={<AdvisorPanel />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
