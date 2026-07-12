
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path= "/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
