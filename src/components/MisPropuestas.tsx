import { AlertTriangle, Clock3, Fingerprint, LayoutGrid, RotateCcw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"; // libreria para graficos
import "../styles/MisPropuestas.css";
import { useState } from "react";

const RULES = [
  { label: "Objetivo", value: "+3 pts" },
  { label: "Horizonte", value: "+3 pts" },
  { label: "Tolerancia", value: "+5 pts" },
  { label: "Ajuste (edad/ingreso)", value: "+1 pt" },
];
const ASSETS = [
  { code: "EC-CASH", desc: "Depósito a Plazo Fijo (DPF)", risk: "Bajo", pct: 5, amount: 25 },
  { code: "EC-MUTUAL-FUND", desc: "Fondo mutuo local administrado", risk: "Medio", pct: 10, amount: 50 },
  { code: "EC-REIT", desc: "Fideicomiso inmobiliario (UIO/GYE)", risk: "Medio", pct: 10, amount: 50 },
  { code: "EC-FAVORITA", desc: "Acciones Corporación Favorita C.A.", risk: "Alto", pct: 45, amount: 225 },
  { code: "EC-PICHINCHA", desc: "Acciones Banco Pichincha C.A.", risk: "Alto", pct: 15, amount: 75 },
  { code: "EC-GOV-BOND", desc: "Bonos del Estado ecuatoriano", risk: "Alto", pct: 15, amount: 75 },
];
const ASSET_COLORS = ["#266c61", "#6a7ee0", "#a06be0", "#d7638f", "#e0a13f", "#a83f3f"];

const STATUS_TABS = ["Pendientes", "Aprobadas", "Rechazadas"];

const PROPOSALS = [
    { id: "26b6e6d7", profile: "Agresivo", objetivo: "Comprar casa", inversion: "$500 USD", generado: "11 jul 2026, 20:23" },
    //{ id: "9f3a12ce", profile: "Moderado", objetivo: "Fondo de emergencia", inversion: "$300 USD", generado: "09 jul 2026, 11:05" },
   // { id: "7c81d40b", profile: "Conservador", objetivo: "Jubilación", inversion: "$800 USD", generado: "02 jul 2026, 16:40" },
];

const MisPropuestas = () => {

  const [statusTab, setStatusTab] = useState("Pendientes");
  const [activeId, setActiveId] = useState(PROPOSALS[0].id);


  return (
    <section className="pr-page">
      <header className="pr-header">
        <span className="pr-badge">Diagnóstico conversacional completado</span>
        <h1 className="pr-title">Tu Portafolio de Activos en Ecuador</h1>
      </header>

      <div className="pr-status-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={statusTab === tab ? "active" : ""}
            onClick={() => setStatusTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pr-pending">
        <div className="pr-pending-head">
          <LayoutGrid size={16} aria-hidden="true" />
          <div>
            <strong>Propuestas {statusTab.toLowerCase()}</strong>
            <span>Desliza para ver todas tus propuestas y selecciona una para revisarla.</span>
          </div>
        </div>

        <div className="pr-ticket-scroll">
          {PROPOSALS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activeId ? "pr-ticket active" : "pr-ticket"}
              onClick={() => setActiveId(item.id)}
            >
              <div className="pr-ticket-top">
                <span className="pr-pill pr-pill-dark">{item.profile}</span>
                <span className="pr-ticket-id">
                  <Fingerprint size={12} aria-hidden="true" />
                  #{item.id}
                </span>
              </div>
              <div className="pr-ticket-body">
                <span>Objetivo</span>
                <strong>{item.objetivo}</strong>
              </div>
              <div className="pr-ticket-body">
                <span>Inversión</span>
                <strong>{item.inversion}</strong>
              </div>
              <div className="pr-ticket-body">
                <span>Generado</span>
                <strong>{item.generado}</strong>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pr-card pr-review">
        <Clock3 size={20} aria-hidden="true" />
        <div>
          <div className="pr-review-top">
            <strong>Estado de revisión regulatoria</strong>
            <span className="pr-pill pr-pill-warning">Pendiente de revisión</span>
          </div>
          <p className="pr-text">La propuesta está en lista de espera y será analizada por el asesor regulado en breve.</p>
          <p className="pr-advisor">Asesor asignado: Dra. Ana Galarza</p>
        </div>
      </div>

      <div className="pr-card">
        <div className="pr-tags">
          <span className="pr-pill pr-pill-dark">Agresivo</span>
          <span className="pr-pill pr-pill-neutral">Puntaje: 12</span>
          <span className="pr-pill pr-pill-neutral">Asesor: Dra. Ana Galarza</span>
        </div>
        <p className="pr-text">
          Perfil calculado con puntaje acumulado de 12/15, reflejando el objetivo de comprar casa,
          horizonte medio y tolerancia al riesgo alta. Ajustado al alza por edad menor a 30 años.
        </p>
        <ul className="pr-tips">
          <li>Aproveche las tasas competitivas de los DPF locales en dólares, de bajo riesgo.</li>
          <li>Diversifique en fondos mutuos administrados autorizados por la Superintendencia.</li>
          <li>Considere invertir paulatinamente en acciones de empresas ecuatorianas líderes.</li>
        </ul>
      </div>

      <div className="pr-card">
        <strong>Desglose de reglas del agente financiero</strong>
        <div className="pr-rule-grid">
          {RULES.map((rule) => (
            <div className="pr-rule-item" key={rule.label}>
              <span>{rule.label}</span>
              <strong>{rule.value}</strong>
            </div>
          ))}
        </div>
        <p className="pr-note">El perfil se determina como: Conservador (≤5), Moderado (6–11), Agresivo (≥12).</p>
      </div>

      <div className="pr-card">
        <h2 className="pr-card-title">Asignación de activos propuesta</h2>

        <div className="pr-metric-grid">
          <div className="pr-metric">
            <span>Inversión planificada</span>
            <strong>$500.00 USD</strong>
          </div>
          <div className="pr-metric">
            <span>Riesgo esperado</span>
            <strong>Alto</strong>
          </div>
          <div className="pr-metric">
            <span>Retorno histórico estimado</span>
            <strong>9.95%</strong>
          </div>
        </div>

        <div className="pr-chart-row">
          <div className="pr-chart-box">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={ASSETS} dataKey="amount" nameKey="code" innerRadius={55} outerRadius={80} paddingAngle={2}>
                  {ASSETS.map((asset, index) => (
                    <Cell key={asset.code} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name]}
                  contentStyle={{ borderRadius: 6, border: "1px solid #dfe7e5", fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>

            <ul className="pr-legend">
              {ASSETS.map((asset, index) => (
                <li key={asset.code}>
                  <span className="pr-legend-dot" style={{ background: ASSET_COLORS[index % ASSET_COLORS.length] }} />
                  {asset.code}
                  <b>{asset.pct}%</b>
                </li>
              ))}
            </ul>
          </div>

          <div className="pr-table">
            <div className="pr-table-head">
              <span>Activo</span>
              <span>Riesgo</span>
              <span>%</span>
              <span>Monto</span>
            </div>
            {ASSETS.map((asset) => (
              <div className="pr-table-row" key={asset.code}>
                <span className="pr-asset-name">
                  <strong>{asset.code}</strong>
                  <small>{asset.desc}</small>
                </span>
                <span>{asset.risk}</span>
                <span>{asset.pct}%</span>
                <strong className="pr-amount">${asset.amount.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pr-card">
        <strong>Justificación de la IA financiera</strong>
        <p className="pr-text">
          Portafolio diseñado para maximizar el crecimiento patrimonial asumiendo riesgos de mercado
          locales. Se concentra en renta variable de emisores líderes, capturando altos rendimientos
          por dividendos. Se asigna un 15% a bonos soberanos para complementar el rendimiento,
          manteniendo liquidez mínima.
        </p>
      </div>

      <div className="pr-notice">
        <AlertTriangle size={18} aria-hidden="true" />
        <span>
          Aviso importante: esta es una simulación de asesoría automática (Robo-Advisor). De acuerdo a
          la normativa financiera ecuatoriana, esta propuesta debe ser revisada, editada o autorizada
          por un asesor humano registrado antes de proceder a la ejecución de órdenes reales.
        </span>
      </div>

      <button className="pr-repeat-btn" type="button">
        <RotateCcw size={16} aria-hidden="true" />
        Repetir diagnóstico conversacional
      </button>
    </section>
  )
}

export default MisPropuestas