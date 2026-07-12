import type React from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/InvestorPanel.css";
import { OptionsMenu } from "../utils/OptionsMenu";


const InvestorPanel = (): React.ReactElement => {
  const navigate = useNavigate();
  const { logout: authLogout , user } = useAuth(); // 👈 Obtén la función del contexto

  const [btnActivo, setBtnActivo] = useState<string>("/inversor/principal");

  const botonActivo = (ruta: string): void => {
    setBtnActivo(ruta);
    navigate(ruta);
  };

  const logout = (): void => {
    authLogout(); 
    setBtnActivo("/inversor/principal");
    navigate("/");
  };

  return (
    <>
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
            {OptionsMenu.map((menu: any, index: number) => {
              return menu.rol_permitido === user?.rol ? (
                <button
                key={index}
                type="button"
                className={
                  btnActivo === menu.rutas_padre
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => botonActivo(menu.rutas_padre)}
              >
                {menu.icono && <menu.icono size={18} aria-hidden="true" />}
                {menu.btn_Name}
              </button>
              ) : null;
            })}
          </nav>

          <div className="sidebar-note">
            <span>Sesión</span>
            <button
              className="logout-button"
              onClick={logout}
              type="button"
            >
              <LogOut size={16} aria-hidden="true" />
              Salir
            </button>
          </div>
        </aside>
      </div>
      <section className="panelCentral">
        <Outlet />
      </section>
    </>
  );
};

export default InvestorPanel;