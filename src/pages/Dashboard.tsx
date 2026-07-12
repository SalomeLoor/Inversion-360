import { ClipboardCheck, Home, LogOut, ShieldCheck, UserRound } from "lucide-react"
import AdvisorPanel from "../components/AdvisorPanel"
import InvestorPanel from "../components/InvestorPanel"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css'

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState("dashboard");

    function logout() {
        setActiveView("home");
        navigate("/");
    }

    return (
        <div>
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
                        <button
                            className={activeView === "investor" ? "nav-item active" : "nav-item"}
                            onClick={() => setActiveView("investor")}
                            type="button"
                        >
                            <UserRound size={18} aria-hidden="true" />
                            Inversionista
                        </button>
                        <button
                            className={activeView === "advisor" ? "nav-item active" : "nav-item"}
                            onClick={() => setActiveView("advisor")}
                            type="button"
                        >
                            <ClipboardCheck size={18} aria-hidden="true" />
                            Asesor
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

                <main className="workspace">
                    {activeView === "investor" ? <InvestorPanel /> : null}
                    {activeView === "advisor" ? <AdvisorPanel /> : null}
                </main>
            </div>
        </div>
    )
}

export default Dashboard
