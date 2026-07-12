import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Clock3,
  Fingerprint,
  LayoutGrid,
  RotateCcw,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { inversorService } from '../services/inversorservice';
import { useAuth } from '../context/AuthContext';
import '../styles/MisPropuestas.css';

interface Instrumento {
  nombre: string;
  categoria: string;
  porcentaje: number;
  riesgo: string;
  monto?: number;
}

interface Propuesta {
  id: string;
  perfil_id: string;
  instrumentos: Instrumento[] | string; // Puede ser array o string JSON
  riesgo_esperado: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'editada';
  justificacion?: string;
  version_reglas?: string;
  createdAt: string;
  PerfilInversionista?: {
    perfil: string;
    objetivo: string;
    horizonte: string;
    tolerancia_perdida: string;
    ingresos: string;
    experiencia: string;
    score: number;
  };
}

const STATUS_TABS = ['Pendientes', 'Aprobadas', 'Rechazadas', 'Editadas'];

const MisPropuestas: React.FC = () => {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState('Pendientes');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const cargarPropuestas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inversorService.obtenerMisPropuestas();
      if (response.ok) {
        // Asegurar que instrumentos sea array en cada propuesta
        const data = (response.data || []).map((p: any) => ({
          ...p,
          instrumentos: parseInstrumentos(p.instrumentos),
        }));
        setPropuestas(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } else {
        setError(response.mensaje || 'Error al cargar propuestas');
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Función para parsear instrumentos de forma segura
  const parseInstrumentos = (instrumentos: any): Instrumento[] => {
    if (!instrumentos) return [];
    if (Array.isArray(instrumentos)) return instrumentos;
    if (typeof instrumentos === 'string') {
      try {
        const parsed = JSON.parse(instrumentos);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    cargarPropuestas();
  }, []);

  // Filtrar por estado
  const filtered = propuestas.filter(
    (p) => p.estado.toLowerCase() === statusTab.slice(0, -1).toLowerCase()
  );

  const selected = propuestas.find((p) => p.id === selectedId);
  const instrumentos = selected ? parseInstrumentos(selected.instrumentos) : [];

  // Colores para el gráfico
  const COLORS = ['#266c61', '#6a7ee0', '#a06be0', '#d7638f', '#e0a13f', '#a83f3f', '#4aa3a3'];

  if (loading) return <div className="loading">Cargando tus propuestas...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (propuestas.length === 0) {
    return (
      <section className="pr-page">
        <div className="empty-state">
          <h2>No tienes propuestas aún</h2>
          <p>Completa el perfilamiento con el asesor IA para generar tu primera propuesta.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pr-page">
      <header className="pr-header">
        <span className="pr-badge">
          {propuestas.length} propuesta{propuestas.length > 1 ? 's' : ''} generada{propuestas.length > 1 ? 's' : ''}
        </span>
        <h1 className="pr-title">Mis Propuestas de Inversión</h1>
      </header>

      {/* Pestañas de estado */}
      <div className="pr-status-tabs">
        {STATUS_TABS.map((tab) => {
          const count = propuestas.filter(
            (p) => p.estado.toLowerCase() === tab.slice(0, -1).toLowerCase()
          ).length;
          return (
            <button
              key={tab}
              type="button"
              className={statusTab === tab ? 'active' : ''}
              onClick={() => setStatusTab(tab)}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de propuestas filtradas */}
      <div className="pr-pending">
        <div className="pr-pending-head">
          <LayoutGrid size={16} aria-hidden="true" />
          <div>
            <strong>Propuestas {statusTab.toLowerCase()}</strong>
            <span>Selecciona una para ver los detalles.</span>
          </div>
        </div>

        <div className="pr-ticket-scroll">
          {filtered.length === 0 ? (
            <div className="empty-state-small">No hay propuestas en este estado</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === selectedId ? 'pr-ticket active' : 'pr-ticket'}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="pr-ticket-top">
                  <span className={`pr-pill pr-pill-${item.estado}`}>
                    {item.estado}
                  </span>
                  <span className="pr-ticket-id">
                    <Fingerprint size={12} aria-hidden="true" />
                    #{item.id.slice(0, 8)}
                  </span>
                </div>
                <div className="pr-ticket-body">
                  <span>Perfil</span>
                  <strong>{item.PerfilInversionista?.perfil || 'N/A'}</strong>
                </div>
                <div className="pr-ticket-body">
                  <span>Riesgo</span>
                  <strong>{item.riesgo_esperado}</strong>
                </div>
                <div className="pr-ticket-body">
                  <span>Generado</span>
                  <strong>{new Date(item.createdAt).toLocaleDateString()}</strong>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detalle de la propuesta seleccionada */}
      {selected && (
        <>
          {/* Estado de revisión */}
          <div className="pr-card pr-review">
            <Clock3 size={20} aria-hidden="true" />
            <div>
              <div className="pr-review-top">
                <strong>Estado de revisión</strong>
                <span className={`pr-pill pr-pill-${selected.estado}`}>
                  {selected.estado === 'pendiente' && '⏳ Pendiente'}
                  {selected.estado === 'aprobada' && '✅ Aprobada'}
                  {selected.estado === 'rechazada' && '❌ Rechazada'}
                  {selected.estado === 'editada' && '✏️ Editada'}
                </span>
              </div>
              <p className="pr-text">
                {selected.estado === 'pendiente' && 'La propuesta está en espera de revisión por un asesor.'}
                {selected.estado === 'aprobada' && '¡Felicidades! Tu propuesta ha sido aprobada.'}
                {selected.estado === 'rechazada' && 'La propuesta fue rechazada. Puedes iniciar un nuevo diagnóstico.'}
                {selected.estado === 'editada' && 'El asesor ha editado la propuesta. Revísala nuevamente.'}
              </p>
            </div>
          </div>

          {/* Perfil y justificación */}
          <div className="pr-card">
            <div className="pr-tags">
              <span className="pr-pill pr-pill-dark">
                {selected.PerfilInversionista?.perfil || 'Sin perfil'}
              </span>
              <span className="pr-pill pr-pill-neutral">
                Puntaje: {selected.PerfilInversionista?.score ?? 'N/A'}
              </span>
              <span className="pr-pill pr-pill-neutral">
                Objetivo: {selected.PerfilInversionista?.objetivo || 'N/A'}
              </span>
            </div>
            {selected.justificacion && (
              <p className="pr-text">{selected.justificacion}</p>
            )}
          </div>

          {/* Asignación de activos */}
          <div className="pr-card">
            <h2 className="pr-card-title">Asignación de activos propuesta</h2>

            <div className="pr-metric-grid">
              <div className="pr-metric">
                <span>Riesgo esperado</span>
                <strong>{selected.riesgo_esperado}</strong>
              </div>
              <div className="pr-metric">
                <span>Versión reglas</span>
                <strong>{selected.version_reglas || 'v1.0.0'}</strong>
              </div>
              <div className="pr-metric">
                <span>Estado</span>
                <strong className={`estado-${selected.estado}`}>
                  {selected.estado}
                </strong>
              </div>
            </div>

            {instrumentos.length > 0 && (
              <div className="pr-chart-row">
                <div className="pr-chart-box">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={instrumentos}
                        dataKey="porcentaje"
                        nameKey="nombre"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {instrumentos.map((item, index) => (
                          <Cell key={item.nombre} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => value !== undefined ? `${value}%` : ''}
                        contentStyle={{ borderRadius: 6, border: '1px solid #dfe7e5', fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <ul className="pr-legend">
                    {instrumentos.map((item, index) => (
                      <li key={item.nombre}>
                        <span
                          className="pr-legend-dot"
                          style={{ background: COLORS[index % COLORS.length] }}
                        />
                        {item.nombre}
                        <b>{item.porcentaje}%</b>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pr-table">
                  <div className="pr-table-head">
                    <span>Activo</span>
                    <span>Riesgo</span>
                    <span>%</span>
                  </div>
                  {instrumentos.map((item) => (
                    <div className="pr-table-row" key={item.nombre}>
                      <span className="pr-asset-name">
                        <strong>{item.nombre}</strong>
                        <small>{item.categoria}</small>
                      </span>
                      <span>{item.riesgo}</span>
                      <span>{item.porcentaje}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Aviso regulatorio */}
          <div className="pr-notice">
            <AlertTriangle size={18} aria-hidden="true" />
            <span>
              Aviso importante: esta es una simulación de asesoría automática (Robo-Advisor). De acuerdo a
              la normativa financiera ecuatoriana, esta propuesta debe ser revisada, editada o autorizada
              por un asesor humano registrado antes de proceder a la ejecución de órdenes reales.
            </span>
          </div>
        </>
      )}

      <button className="pr-repeat-btn" type="button" onClick={() => window.location.href = '/inversor/principal'}>
        <RotateCcw size={16} aria-hidden="true" />
        Volver al diagnóstico
      </button>
    </section>
  );
};

export default MisPropuestas;