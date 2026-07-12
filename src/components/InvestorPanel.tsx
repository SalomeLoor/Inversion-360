import { Home, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InvestorPanel = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");

  function logout() {
    setActiveView("home");
    navigate("/");
  }
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="brand">
          <ShieldCheck size={28} aria-hidden="true" />
          <div>
            <strong>Inversion360</strong>
            <span>Robo-advisory</span>
          </div>
        </div>

        <nav className="nav-stack">
          <button
            className={activeView === "home" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveView("home")}
            type="button"
          >
            <Home size={18} aria-hidden="true" />
            Principal
          </button>
          

        </nav>

        <div className="sidebar-note">
          <span>Sesion</span>
          <button className="logout-button" onClick={logout} type="button">
            <LogOut size={16} aria-hidden="true" />
            Salir
          </button>
        </div>

      </aside>

    </div>
  )
}

export default InvestorPanel
