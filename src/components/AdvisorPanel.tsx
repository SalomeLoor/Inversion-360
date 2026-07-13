import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  FileText, 
  History, 
  LogOut, 
  User, 
  Fingerprint, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileEdit,
  FolderOpen,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { asesorService } from "../services/asesorservice";
import type { Proposal, AssetAllocation } from "../types/proposal";
import "../styles/AdvisorPanel.css";

const AdvisorPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  
  // Real backend integration states
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [revisions, setRevisions] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Selected proposal in the pending list
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  
  // Editable form state for the selected proposal
  const [editedPercentages, setEditedPercentages] = useState<{ [code: string]: number }>({});
  const [comments, setComments] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Viewed revision detail (for diff comparison)
  const [viewedRevisionId, setViewedRevisionId] = useState<string | null>(null);

  // Authenticator Context integration
  const { user, logout: authLogout } = useAuth();
  const advisorName = user ? user.name : "Dra. Ana Galarza";

  // Filter pending proposals
  const pendingProposals = proposals.filter((p) => p.status === "Pendiente");

  // Get currently selected proposal
  const selectedProposal = proposals.find((p) => p.id === selectedProposalId && p.status === "Pendiente");

  // Helper to map backend proposal structure to our frontend presentation Proposal
  const mapBackendProposal = (p: any): Proposal => {
    let assets: AssetAllocation[] = [];
    if (p.instrumentos) {
      let parsed: any[] = [];
      if (Array.isArray(p.instrumentos)) {
        parsed = p.instrumentos;
      } else if (typeof p.instrumentos === "string") {
        try {
          parsed = JSON.parse(p.instrumentos);
        } catch {
          parsed = [];
        }
      }
      
      assets = parsed.map((inst: any) => ({
        code: inst.nombre || inst.code || "Activo",
        desc: inst.desc || inst.categoria || "Descripción",
        risk: inst.riesgo || "Medio",
        type: inst.categoria || "RENTA FIJA",
        pct: inst.porcentaje || 0,
        amount: inst.monto || 0
      }));
    }

    // Default assets if empty
    if (assets.length === 0) {
      assets = [
        { code: "EC-CASH", desc: "Depósito a Plazo Fijo (DPF) Bancos Ecuador", risk: "Bajo", type: "LIQUIDEZ", pct: 0, amount: 0 },
        { code: "EC-MUTUAL-FUND", desc: "Fondo de Inversión Local Administrado", risk: "Medio", type: "RENTA FIJA", pct: 0, amount: 0 },
        { code: "EC-REIT", desc: "Fideicomiso Inmobiliario Local (Bienes Raíces UIO/GYE)", risk: "Medio", type: "ALTERNATIVOS", pct: 0, amount: 0 },
        { code: "EC-FAVORITA", desc: "Acciones Corporación Favorita C.A.", risk: "Alto", type: "RENTA VARIABLE", pct: 0, amount: 0 },
        { code: "EC-PICHINCHA", desc: "Acciones Banco Pichincha C.A.", risk: "Alto", type: "RENTA VARIABLE", pct: 0, amount: 0 },
        { code: "EC-GOV-BOND", desc: "Bonos del Estado Ecuatoriano", risk: "Alto", type: "RENTA FIJA", pct: 0, amount: 0 }
      ];
    }

    const totalInversion = assets.reduce((sum, a) => sum + (a.amount || 0), 0) || 500;

    return {
      id: p.id,
      clientId: p.perfil_id || "Cliente",
      clientName: p.PerfilInversionista?.perfil || "Cliente",
      age: 25, // Fallback if age not in PerfilInversionista
      monthlyIncome: parseFloat(p.PerfilInversionista?.ingresos) || 2000,
      profile: p.PerfilInversionista?.perfil || p.riesgo_esperado || "Moderado",
      objetivo: p.PerfilInversionista?.objetivo || "COMPRAR CASA",
      inversion: totalInversion,
      horizonte: p.PerfilInversionista?.horizonte || "MEDIO",
      tolerancia: p.PerfilInversionista?.tolerancia_perdida || "MEDIA",
      generado: p.createdAt ? p.createdAt.substring(0, 19).replace("T", " ") : new Date().toISOString().substring(0, 19).replace("T", " "),
      status: p.estado === "pendiente" ? "Pendiente" : p.estado === "aprobada" ? "Aprobada" : "Rechazada",
      score: p.PerfilInversionista?.score || 10,
      rulesVersion: p.version_reglas || "v1.0.0",
      justificationIA: p.justificacion || "Portafolio sugerido por la IA.",
      assets: assets
    };
  };

  // Load pending proposals from actual database
  const loadPendingProposals = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await asesorService.listarPendientes();
      if (response && response.ok) {
        const rawList = response.data || [];
        const mapped = rawList.map((p: any) => mapBackendProposal(p));
        setProposals(mapped);
      } else if (Array.isArray(response)) {
        setProposals(response.map((p: any) => mapBackendProposal(p)));
      }
    } catch (error) {
      console.error("Error al cargar propuestas pendientes:", error);
      setErrorMessage("Error de conexión al cargar propuestas desde el backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingProposals();
  }, []);

  // Initialize editable asset percentages when selected proposal changes
  useEffect(() => {
    if (selectedProposal) {
      const pcts: { [code: string]: number } = {};
      selectedProposal.assets.forEach((asset) => {
        pcts[asset.code] = asset.pct;
      });
      setEditedPercentages(pcts);
      setComments("");
      setErrorMessage("");
    }
  }, [selectedProposalId]);

  // Handle logout using authenticator context
  function logout() {
    authLogout();
    navigate("/");
  }

  // Calculate sum of currently edited percentages
  const totalPercentage = Object.values(editedPercentages).reduce((sum, val) => sum + (val || 0), 0);

  // Handle asset percentage input changes
  const handlePercentageChange = (code: string, value: string) => {
    const num = parseInt(value, 10);
    setEditedPercentages((prev) => ({
      ...prev,
      [code]: isNaN(num) ? 0 : num,
    }));
  };

  // Register advisor decision in real database
  const registerDecision = async (type: "Aprobada sin Cambios" | "Modificada y Aprobada" | "Rechazada") => {
    if (!selectedProposal) return;
    setErrorMessage("");

    // Validate comments for modification or rejection
    if ((type === "Modificada y Aprobada" || type === "Rechazada") && !comments.trim()) {
      setErrorMessage("Los comentarios y justificación son requeridos para modificar o rechazar.");
      return;
    }

    // Validate percentage sum is exactly 100% for approval
    if (type === "Modificada y Aprobada" && totalPercentage !== 100) {
      setErrorMessage("La suma total asignada debe ser exactamente 100% para aprobar.");
      return;
    }

    try {
      // Map edited assets (calculate amounts based on new percentages)
      const revisedAssets: AssetAllocation[] = selectedProposal.assets.map((asset) => {
        const newPct = type === "Aprobada sin Cambios" ? asset.pct : (editedPercentages[asset.code] || 0);
        const newAmount = parseFloat(((newPct / 100) * selectedProposal.inversion).toFixed(2));
        return {
          ...asset,
          pct: newPct,
          amount: newAmount,
        };
      });

      // Execute actual API calls
      if (type === "Aprobada sin Cambios") {
        await asesorService.aprobar(selectedProposal.id, comments.trim());
      } else if (type === "Rechazada") {
        await asesorService.rechazar(selectedProposal.id, comments.trim());
      } else if (type === "Modificada y Aprobada") {
        const instrumentosPayload = revisedAssets.map((asset) => ({
          nombre: asset.code,
          categoria: asset.type,
          porcentaje: asset.pct,
          riesgo: asset.risk,
          monto: asset.amount
        }));
        await asesorService.editar(selectedProposal.id, {
          instrumentos: instrumentosPayload,
          riesgo_esperado: selectedProposal.profile,
          comentarios: comments.trim()
        });
      }

      // Update proposal state local record
      const updatedStatus = type === "Rechazada" ? "Rechazada" : "Aprobada";
      const updatedProposal: Proposal = {
        ...selectedProposal,
        status: updatedStatus,
        advisorComments: comments.trim(),
        reviewedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        reviewedBy: advisorName,
        decisionType: type,
        revisedAssets: revisedAssets,
        assets: selectedProposal.assets
      };

      // Add to local session revisions list
      setRevisions((prev) => [updatedProposal, ...prev]);

      // Remove from pending list
      setProposals((prev) => prev.filter((p) => p.id !== selectedProposal.id));

      // Reset selection
      setSelectedProposalId(null);
      setComments("");
    } catch (err: any) {
      console.error("Error al registrar decisión en base de datos:", err);
      setErrorMessage("Error de servidor al guardar la decisión en la base de datos.");
    }
  };

  // Get currently viewed revision for comparison
  const viewedRevision = revisions.find((r) => r.id === viewedRevisionId);

  return (
    <div className="advisor-app">
      {/* Top Global Header */}
      <header className="portal-topbar advisor-header">
        <div className="portal-brand">
          <ShieldCheck size={22} aria-hidden="true" />
          <span>AEGIS ROBO-ADVISORY</span>
        </div>
        <div className="portal-nav-buttons">
          <button className="portal-nav-btn" onClick={() => navigate("/inversor/principal")}>
            Portal Inversionista
          </button>
          <button className="portal-nav-btn active" onClick={() => navigate("/asesor")}>
            Portal Asesor Humano
          </button>
        </div>
      </header>

      <div className="app-shell-container">
        {/* Sidebar Nav */}
        <aside className="sidebar advisor-sidebar" aria-label="Navegacion principal">
          <div className="brand">
            <ShieldCheck size={28} aria-hidden="true" />
            <div>
              <strong>Inversion360</strong>
              <span>Robo-advisory</span>
            </div>
          </div>

          {/* Advisor info section */}
          <div className="advisor-profile-card">
            <div className="advisor-avatar">
              <User size={18} aria-hidden="true" />
            </div>
            <div className="advisor-info">
              <span className="advisor-meta-label">Asesor en Análisis</span>
              <strong className="advisor-name-text">{advisorName}</strong>
            </div>
          </div>

          <nav className="nav-stack">
            <button
              className={activeTab === "pending" ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActiveTab("pending");
                setViewedRevisionId(null);
              }}
              type="button"
            >
              <FileText size={18} aria-hidden="true" />
              Propuestas Pendientes
            </button>
            <button
              className={activeTab === "history" ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab("history")}
              type="button"
            >
              <History size={18} aria-hidden="true" />
              Historial de Revisiones
            </button>
          </nav>

          <div className="sidebar-note">
            <span>Sesión</span>
            <button className="logout-button" onClick={logout} type="button">
              <LogOut size={16} aria-hidden="true" />
              Salir
            </button>
          </div>
        </aside>

        {/* Main white background workspace area */}
        <main className="advisor-workspace">
          {activeTab === "pending" ? (
            <div className="audit-split-view">
              {/* Left Column: Pending Proposals Scroll */}
              <div className="pending-column">
                <div className="column-header">
                  <FileText size={18} aria-hidden="true" />
                  <div>
                    <h2>Propuestas Pendientes</h2>
                    <p>Selecciona una propuesta para auditar y tomar una decisión regulada.</p>
                  </div>
                </div>

                <div className="proposals-scroll">
                  {loading ? (
                    <div className="empty-scroll-state">
                      <p>Cargando propuestas desde el servidor...</p>
                    </div>
                  ) : pendingProposals.length === 0 ? (
                    <div className="empty-scroll-state">
                      <CheckCircle2 size={36} className="success-icon" />
                      <p>No hay propuestas pendientes de revisión.</p>
                    </div>
                  ) : (
                    pendingProposals.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={item.id === selectedProposalId ? "proposal-card active" : "proposal-card"}
                        onClick={() => setSelectedProposalId(item.id)}
                      >
                        <div className="proposal-card-top">
                          <span className="profile-badge">{item.profile}</span>
                          <span className="proposal-id">
                            <Fingerprint size={12} aria-hidden="true" />
                            #{item.id.substring(0, 8)}
                          </span>
                        </div>
                        <div className="proposal-card-details">
                          <div className="detail-row">
                            <span>Perfil ID:</span>
                            <strong>{item.clientId.substring(0, 8)}</strong>
                          </div>
                          <div className="detail-row">
                            <span>Inversión:</span>
                            <strong>${item.inversion} USD</strong>
                          </div>
                          <div className="detail-row">
                            <span>Edad:</span>
                            <strong>{item.age} años</strong>
                          </div>
                          <div className="detail-row">
                            <span>Objetivo:</span>
                            <strong className="goal-text">{item.objetivo}</strong>
                          </div>
                        </div>
                        <div className="proposal-card-footer">
                          <span>Generado: {item.generado}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Selected Proposal Audit workspace */}
              <div className="audit-workspace-column">
                {selectedProposal ? (
                  <div className="audit-flow-container">
                    <div className="audit-header">
                      <h1>Auditoría de Propuesta</h1>
                      <span className="audit-id-badge">ID: {selectedProposal.id.substring(0, 8)}...</span>
                    </div>

                    {errorMessage && (
                      <div className="audit-alert-error">
                        <AlertTriangle size={18} aria-hidden="true" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Section 1: Client Data & AI Profile */}
                    <section className="audit-card">
                      <h3>Datos del Cliente y Perfil IA</h3>
                      <div className="details-table">
                        <div className="details-grid">
                          <div className="grid-cell">
                            <span className="cell-label">Perfil ID:</span>
                            <strong className="cell-value">{selectedProposal.clientId}</strong>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">Perfil del Agente:</span>
                            <strong className="cell-value color-profile">{selectedProposal.profile}</strong>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">Inversión Planificada:</span>
                            <strong className="cell-value text-blue">${selectedProposal.inversion}.00 USD</strong>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">Edad:</span>
                            <strong className="cell-value">{selectedProposal.age} años</strong>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">Ingresos Mensuales:</span>
                            <strong className="cell-value">${selectedProposal.monthlyIncome} USD</strong>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">Objetivo:</span>
                            <strong className="cell-value uppercase">{selectedProposal.objetivo}</strong>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">Horizonte:</span>
                            <strong className="cell-value uppercase">{selectedProposal.horizonte}</strong>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">Tolerancia:</span>
                            <strong className="cell-value uppercase">{selectedProposal.tolerancia}</strong>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Section 2: AI Justification */}
                    <section className="audit-card">
                      <h3>Justificación de la IA</h3>
                      <p className="justification-text">{selectedProposal.justificationIA}</p>
                      <div className="rules-version">Reglas aplicadas: {selectedProposal.rulesVersion}</div>
                    </section>

                    {/* Section 3: Asset Adjustment Table */}
                    <section className="audit-card">
                      <h3>Ajuste y Distribución de Activos (Ecuador)</h3>
                      <p className="table-tip">Puedes editar los porcentajes de asignación directamente. El sistema recalcula los montos en dólares en tiempo real. La suma de los activos debe ser exactamente <strong>100%</strong>.</p>
                      
                      <table className="assets-edit-table">
                        <thead>
                          <tr>
                            <th>Activo de Ecuador</th>
                            <th>Tipo</th>
                            <th>Riesgo</th>
                            <th style={{ width: "120px" }}>Porcentaje (%)</th>
                            <th style={{ textAlign: "right" }}>Monto ($ USD)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProposal.assets.map((asset) => {
                            const currentPct = editedPercentages[asset.code] !== undefined ? editedPercentages[asset.code] : asset.pct;
                            const calculatedAmount = (currentPct / 100) * selectedProposal.inversion;

                            return (
                              <tr key={asset.code}>
                                <td>
                                  <div className="asset-meta">
                                    <strong>{asset.code}</strong>
                                    <span>{asset.desc}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className={`type-badge ${asset.type.toLowerCase().replace(" ", "-")}`}>
                                    {asset.type}
                                  </span>
                                </td>
                                <td>
                                  <span className={`risk-badge ${asset.risk.toLowerCase()}`}>
                                    {asset.risk}
                                  </span>
                                </td>
                                <td>
                                  <div className="input-percentage-container">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={currentPct}
                                      onChange={(e) => handlePercentageChange(asset.code, e.target.value)}
                                      className="percentage-input"
                                    />
                                    <span>%</span>
                                  </div>
                                </td>
                                <td className="amount-cell">
                                  ${calculatedAmount.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* Total Sum Badge Row */}
                      <div className="total-sum-row">
                        <span>Suma Total Asignada:</span>
                        <span className={`sum-badge ${totalPercentage === 100 ? "valid" : "invalid"}`}>
                          {totalPercentage}%
                        </span>
                      </div>
                    </section>

                    {/* Section 4: Actions and Comments */}
                    <section className="audit-card border-accent">
                      <h3>Registrar Decisión Regulada</h3>
                      <div className="comments-input-group">
                        <label htmlFor="comments-textarea">
                          Comentarios y Justificación del Asesor (Requerido para Modificar o Rechazar)
                        </label>
                        <textarea
                          id="comments-textarea"
                          rows={4}
                          placeholder="Escribe aquí tus observaciones técnicas sobre la adecuación del portafolio o justificaciones para el cliente..."
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                        />
                      </div>

                      <div className="actions-button-grid">
                        <button
                          type="button"
                          className="action-btn btn-reject"
                          onClick={() => registerDecision("Rechazada")}
                        >
                          <XCircle size={16} aria-hidden="true" />
                          Rechazar Propuesta
                        </button>
                        <button
                          type="button"
                          className="action-btn btn-modify"
                          disabled={totalPercentage !== 100}
                          onClick={() => registerDecision("Modificada y Aprobada")}
                          title={totalPercentage !== 100 ? "La suma debe ser exactamente 100%" : ""}
                        >
                          <FileEdit size={16} aria-hidden="true" />
                          Modificar y Aprobar
                        </button>
                        <button
                          type="button"
                          className="action-btn btn-approve"
                          onClick={() => registerDecision("Aprobada sin Cambios")}
                        >
                          <CheckCircle2 size={16} aria-hidden="true" />
                          Aprobar sin Cambios
                        </button>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="empty-workspace-state">
                    <FolderOpen size={48} className="folder-icon" />
                    <h2>Selecciona una propuesta</h2>
                    <p>Elige una solicitud de la bandeja de entrada para cargar los datos de perfilamiento, asignación de activos de la IA y aplicar el criterio de aceptación.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // History View
            <div className="history-view-container">
              {!viewedRevisionId ? (
                // Revisions List Table
                <div className="revisions-list-card">
                  <div className="list-header">
                    <History size={20} aria-hidden="true" />
                    <h2>Historial de Decisiones Reguladas (Pista de Auditoría)</h2>
                  </div>
                  <p className="list-subtitle">Auditoría completa de decisiones del asesor de acuerdo a la regulación ecuatoriana y la Ley del Mercado de Valores.</p>

                  <div className="table-responsive">
                    <table className="revisions-table">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>ID Propuesta</th>
                          <th>Cliente (Perfil ID)</th>
                          <th>Monto ($)</th>
                          <th>Perfil IA</th>
                          <th>Decisión</th>
                          <th>Asesor</th>
                          <th>Comentarios / Ajustes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revisions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="empty-table-cell">
                              No se han registrado auditorías todavía. Realiza una decisión en las propuestas pendientes.
                            </td>
                          </tr>
                        ) : (
                          revisions.map((rev) => (
                            <tr
                              key={rev.id}
                              className="revision-row-clickable"
                              onClick={() => setViewedRevisionId(rev.id)}
                              title="Haga clic para ver la comparación detallada"
                            >
                              <td>{rev.reviewedAt}</td>
                              <td><strong className="text-blue">#{rev.id.substring(0, 8)}</strong></td>
                              <td>{rev.clientId.substring(0, 8)}</td>
                              <td>${rev.inversion} USD</td>
                              <td><span className="profile-badge-small">{rev.profile}</span></td>
                              <td>
                                <span className={`decision-badge ${rev.decisionType?.toLowerCase().replace(/ /g, "-")}`}>
                                  {rev.decisionType}
                                </span>
                              </td>
                              <td>{rev.reviewedBy}</td>
                              <td className="comments-cell-truncate">{rev.advisorComments || "-"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Detailed side-by-side comparison view (Diff document)
                viewedRevision && (
                  <div className="diff-view-card">
                    <div className="diff-view-header">
                      <button
                        type="button"
                        className="back-btn"
                        onClick={() => setViewedRevisionId(null)}
                      >
                        <ArrowLeft size={16} />
                        Volver al Historial
                      </button>
                      <div className="diff-view-title-group">
                        <h2>Comparación de Propuesta: #{viewedRevision.id.substring(0, 8)}</h2>
                        <span className={`decision-badge large ${viewedRevision.decisionType?.toLowerCase().replace(/ /g, "-")}`}>
                          Decisión: {viewedRevision.decisionType}
                        </span>
                      </div>
                    </div>

                    <div className="diff-meta-summary">
                      <div className="meta-box">
                        <strong>Cliente:</strong> {viewedRevision.clientId.substring(0, 8)}
                      </div>
                      <div className="meta-box">
                        <strong>Revisado por:</strong> {viewedRevision.reviewedBy}
                      </div>
                      <div className="meta-box">
                        <strong>Fecha de Auditoría:</strong> {viewedRevision.reviewedAt}
                      </div>
                      <div className="meta-box">
                        <strong>Inversión Total:</strong> ${viewedRevision.inversion} USD
                      </div>
                    </div>

                    <div className="diff-columns-grid">
                      {/* Left: AI Original Proposal Document */}
                      <div className="diff-col col-original">
                        <div className="col-header">
                          <CheckCircle2 size={16} />
                          <h3>Propuesta del Agente IA (Original)</h3>
                        </div>
                        <div className="col-body">
                          <div className="card-section">
                            <h4>Justificación de la IA:</h4>
                            <p className="doc-text">{viewedRevision.justificationIA}</p>
                          </div>

                          <div className="card-section">
                            <h4>Distribución de Activos IA:</h4>
                            <table className="diff-assets-table">
                              <thead>
                                <tr>
                                  <th>Activo</th>
                                  <th style={{ textAlign: "center" }}>% Original</th>
                                  <th style={{ textAlign: "right" }}>Monto Original</th>
                                </tr>
                              </thead>
                              <tbody>
                                {viewedRevision.assets.map((asset) => (
                                  <tr key={asset.code}>
                                    <td>
                                      <strong>{asset.code}</strong>
                                      <span className="asset-sub">{asset.desc}</span>
                                    </td>
                                    <td style={{ textAlign: "center" }} className="weight-bold">{asset.pct}%</td>
                                    <td style={{ textAlign: "right" }}>${asset.amount.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Right: Advisor Reviewed / Revised Document */}
                      <div className="diff-col col-revised">
                        <div className="col-header">
                          <FileEdit size={16} />
                          <h3>Propuesta del Asesor Humano (Modificaciones)</h3>
                        </div>
                        <div className="col-body">
                          <div className="card-section bg-light-blue">
                            <h4>Observaciones y Comentarios de Firma:</h4>
                            <p className="doc-text comment-text">
                              {viewedRevision.advisorComments || "Aprobada sin cambios en la estructura de asignación."}
                            </p>
                          </div>

                          <div className="card-section">
                            <h4>Distribución de Activos Final Aprobada:</h4>
                            <table className="diff-assets-table">
                              <thead>
                                <tr>
                                  <th>Activo</th>
                                  <th style={{ textAlign: "center" }}>% Aprobado</th>
                                  <th style={{ textAlign: "right" }}>Monto Aprobado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {viewedRevision.revisedAssets?.map((asset, idx) => {
                                  const originalAsset = viewedRevision.assets[idx];
                                  const diffPct = asset.pct - originalAsset.pct;
                                  
                                  let diffClass = "";
                                  let diffSign = "";
                                  if (diffPct > 0) {
                                    diffClass = "pct-up";
                                    diffSign = `(+${diffPct}%)`;
                                  } else if (diffPct < 0) {
                                    diffClass = "pct-down";
                                    diffSign = `(${diffPct}%)`;
                                  }

                                  return (
                                    <tr key={asset.code} className={diffPct !== 0 ? "row-changed" : ""}>
                                      <td>
                                        <strong>{asset.code}</strong>
                                        <span className="asset-sub">{asset.desc}</span>
                                      </td>
                                      <td style={{ textAlign: "center" }}>
                                        <span className="weight-bold">{asset.pct}%</span>{" "}
                                        {diffSign && <span className={`diff-pct-indicator ${diffClass}`}>{diffSign}</span>}
                                      </td>
                                      <td style={{ textAlign: "right" }} className={diffPct !== 0 ? "weight-bold" : ""}>
                                        ${asset.amount.toFixed(2)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdvisorPanel;
