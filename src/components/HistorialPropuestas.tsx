import React, { useEffect, useState } from 'react';
import { Check, X, Edit, RefreshCw, MessageSquare } from 'lucide-react';
import { asesorService } from '../services/asesorservice';
import '../styles/HistorialPropuestas.css';

interface Propuesta {
  id: string;
  perfil_id: string;
  instrumentos: any[];
  riesgo_esperado: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'editada';
  justificacion?: string;
  createdAt: string;
  PerfilInversionista?: {
    id: string;
    perfil: string;
    edad: string;
    objetivo: string;
    user_id: string;
    User?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

const HistorialPropuestas: React.FC = () => {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPropuesta, setSelectedPropuesta] = useState<Propuesta | null>(null);
  const [modalAction, setModalAction] = useState<'aprobar' | 'rechazar' | 'editar' | null>(null);
  const [comentarios, setComentarios] = useState('');
  const [editInstrumentos, setEditInstrumentos] = useState<any[]>([]);
  const [editRiesgo, setEditRiesgo] = useState('');
  const [editComentarios, setEditComentarios] = useState('');

  const cargarPropuestas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await asesorService.listarPendientes();
      if (response.ok) {
        setPropuestas(response.data || []);
      } else {
        setError(response.mensaje || 'Error al cargar propuestas');
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPropuestas();
  }, []);

  const openModal = (propuesta: Propuesta, accion: 'aprobar' | 'rechazar' | 'editar') => {
    setSelectedPropuesta(propuesta);
    setModalAction(accion);
    setComentarios('');
    setEditInstrumentos(propuesta.instrumentos || []);
    setEditRiesgo(propuesta.riesgo_esperado || '');
    setEditComentarios('');
  };

  const closeModal = () => {
    setSelectedPropuesta(null);
    setModalAction(null);
    setComentarios('');
    setEditInstrumentos([]);
    setEditRiesgo('');
    setEditComentarios('');
  };

  const handleAprobar = async () => {
    if (!selectedPropuesta) return;
    try {
      const response = await asesorService.aprobar(selectedPropuesta.id, comentarios);
      if (response.ok) {
        await cargarPropuestas();
        closeModal();
      } else {
        alert(response.mensaje || 'Error al aprobar');
      }
    } catch (err: any) {
      alert(err.response?.data?.mensaje || 'Error al aprobar');
    }
  };

  const handleRechazar = async () => {
    if (!selectedPropuesta || !comentarios.trim()) {
      alert('Debes ingresar un comentario para rechazar');
      return;
    }
    try {
      const response = await asesorService.rechazar(selectedPropuesta.id, comentarios);
      if (response.ok) {
        await cargarPropuestas();
        closeModal();
      } else {
        alert(response.mensaje || 'Error al rechazar');
      }
    } catch (err: any) {
      alert(err.response?.data?.mensaje || 'Error al rechazar');
    }
  };

  const handleEditar = async () => {
    if (!selectedPropuesta) return;
    try {
      const payload: any = {};
      if (editInstrumentos.length > 0) payload.instrumentos = editInstrumentos;
      if (editRiesgo) payload.riesgo_esperado = editRiesgo;
      if (editComentarios) payload.comentarios = editComentarios;

      if (Object.keys(payload).length === 0) {
        alert('Debes modificar al menos un campo');
        return;
      }

      const response = await asesorService.editar(selectedPropuesta.id, payload);
      if (response.ok) {
        await cargarPropuestas();
        closeModal();
      } else {
        alert(response.mensaje || 'Error al editar');
      }
    } catch (err: any) {
      alert(err.response?.data?.mensaje || 'Error al editar');
    }
  };

  const renderModal = () => {
    if (!selectedPropuesta || !modalAction) return null;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>
            {modalAction === 'aprobar' && 'Aprobar propuesta'}
            {modalAction === 'rechazar' && 'Rechazar propuesta'}
            {modalAction === 'editar' && 'Editar propuesta'}
          </h3>

          {modalAction === 'aprobar' && (
            <>
              <p>¿Estás seguro de aprobar esta propuesta?</p>
              <textarea
                placeholder="Comentarios (opcional)"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={3}
              />
              <div className="modal-actions">
                <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                <button className="btn-success" onClick={handleAprobar}>Aprobar</button>
              </div>
            </>
          )}

          {modalAction === 'rechazar' && (
            <>
              <p>Indica el motivo del rechazo:</p>
              <textarea
                placeholder="Comentarios obligatorios"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={3}
                required
              />
              <div className="modal-actions">
                <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                <button className="btn-danger" onClick={handleRechazar}>Rechazar</button>
              </div>
            </>
          )}

          {modalAction === 'editar' && (
            <>
              <p>Modifica los instrumentos o el riesgo esperado:</p>
              <label>
                Instrumentos (JSON)
                <textarea
                  value={JSON.stringify(editInstrumentos, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditInstrumentos(parsed);
                    } catch {
                      // no hacer nada si no es válido
                    }
                  }}
                  rows={6}
                  style={{ fontFamily: 'monospace' }}
                />
              </label>
              <label>
                Riesgo esperado
                <input
                  type="text"
                  value={editRiesgo}
                  onChange={(e) => setEditRiesgo(e.target.value)}
                />
              </label>
              <label>
                Comentarios para el usuario
                <textarea
                  value={editComentarios}
                  onChange={(e) => setEditComentarios(e.target.value)}
                  rows={2}
                />
              </label>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                <button className="btn-primary" onClick={handleEditar}>Guardar cambios</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Cargando propuestas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="gestion-propuestas">
      <div className="header">
        <h2>Propuestas pendientes de revisión</h2>
        <button className="btn-refresh" onClick={cargarPropuestas}>
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {propuestas.length === 0 ? (
        <div className="empty-state">No hay propuestas pendientes</div>
      ) : (
        <div className="propuestas-grid">
          {propuestas.map((prop) => (
            <div key={prop.id} className="propuesta-card">
              <div className="propuesta-header">
                <span className="propuesta-id">ID: {prop.id.slice(0, 8)}</span>
                <span className={`estado ${prop.estado}`}>{prop.estado}</span>
              </div>
              <div className="propuesta-body">
                <p><strong>Cliente:</strong> {prop.PerfilInversionista?.User?.name || 'Desconocido'}</p>
                <p><strong>Email:</strong> {prop.PerfilInversionista?.User?.email || 'N/A'}</p>
                <p><strong>Perfil:</strong> {prop.PerfilInversionista?.perfil || 'N/A'}</p>
                <p><strong>Riesgo esperado:</strong> {prop.riesgo_esperado}</p>
                <p><strong>Instrumentos:</strong> {prop.instrumentos?.length || 0} activos</p>
                {prop.justificacion && (
                  <details>
                    <summary>Ver justificación</summary>
                    <p className="justificacion">{prop.justificacion}</p>
                  </details>
                )}
              </div>
              <div className="propuesta-actions">
                <button className="btn-success" onClick={() => openModal(prop, 'aprobar')}>
                  <Check size={16} /> Aprobar
                </button>
                <button className="btn-danger" onClick={() => openModal(prop, 'rechazar')}>
                  <X size={16} /> Rechazar
                </button>
                <button className="btn-primary" onClick={() => openModal(prop, 'editar')}>
                  <Edit size={16} /> Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderModal()}
    </div>
  );
};

export default HistorialPropuestas;