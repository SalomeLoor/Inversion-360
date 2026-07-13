import type React from "react";
import type { ComponentType } from "react";
import { LogOut, ShieldCheck } from "lucide-react"; //biblioteca de iconos SVG
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../styles/InvestorPanel.css";
import { OptionsMenu } from "../utils/OptionsMenu";

interface MenuOption {
  rutas_padre: string;
  icono?: ComponentType<any>;
  btn_Name: string;
}

const InvestorPanel = (): React.ReactElement => {
  const navigate = useNavigate();

  // Ruta activa del menú
  const [btnActivo, setBtnActivo] = useState<string>("/inversor/principal");

  // Navegar entre las opciones del menú
  const botonActivo = (ruta: string): void => {
    setBtnActivo(ruta);
    navigate(ruta);
  };

  // Cerrar sesión
  const logout = (): void => {
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
            {OptionsMenu.map((menu: MenuOption, index: number) => (
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
            ))}
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
        <header className="portal-topbar">
          <div className="portal-title">AEGIS ROBO-ADVISORY</div>
          <div className="portal-nav-buttons">
            <button className="portal-nav-btn active" onClick={() => navigate("/inversor/principal")}>
              Portal Inversionista
            </button>
            <button className="portal-nav-btn" onClick={() => navigate("/asesor")}>
              Portal Asesor Humano
            </button>
          </div>
        </header>
        <Outlet />
      </section>
    </>
  );
};

export default InvestorPanel;