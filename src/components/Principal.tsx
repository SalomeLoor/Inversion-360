import React, { useState, useEffect } from 'react';
import { MessageSquareText, Scale, UserCheck, ArrowRight, ChevronRight, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatBot from '../components/Chatbot/Chatbot';
import { serviceFinancial } from '../services/financialservice';
import '../styles/Principal.css';
import { inversorService } from '../services/inversorservice';

const FEATURES_INVERSOR = [
  {
    icon: MessageSquareText,
    title: "Conversación guiada",
    description: "Responde preguntas en lenguaje natural para definir tu perfil de riesgo, sin formularios rígidos.",
  },
  {
    icon: Scale,
    title: "Portafolio local (Ecuador)",
    description: "Propuestas dolarizadas con DPFs, acciones locales y bienes raíces, ajustadas a tu perfil.",
  },
  {
    icon: UserCheck,
    title: "Supervisión humana",
    description: "Cada propuesta generada por la IA es revisada y validada por un asesor certificado.",
  },
];

const FEATURES_ASESOR = [
  {
    icon: MessageSquareText,
    title: "Consulta libre",
    description: "Pregunta por cualquier cliente, perfil o propuesta en lenguaje natural, sin formularios ni filtros manuales.",
  },
  {
    icon: Scale,
    title: "Visión completa de cartera",
    description: "Estados de propuestas, perfiles de riesgo y revisiones de todos los clientes en un solo lugar.",
  },
  {
    icon: UserCheck,
    title: "Trazabilidad de decisiones",
    description: "Historial de aprobaciones, rechazos y ediciones con motivo y fecha de cada revisión.",
  },
];

const Principal = () => {
  const { user } = useAuth();
  const esAsesor = user?.rol === 'asesor';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tienePerfil, setTienePerfil] = useState(false);
  const [propuestaAprobada, setPropuestaAprobada] = useState(false);
  const [cargandoEstado, setCargandoEstado] = useState(true);

  useEffect(() => {
    if (!user || esAsesor) {
      setCargandoEstado(false);
      return;
    }
    inversorService.obtenerMisPropuestas()
      .then((res: any) => {
        const propuestas = res?.data || [];
        setTienePerfil(propuestas.length > 0);
        setPropuestaAprobada(propuestas.some((p: any) => p.estado === 'aprobada'));
      })
      .catch(() => {
        setTienePerfil(false);
        setPropuestaAprobada(false);
      })
      .finally(() => setCargandoEstado(false));
  }, [user, esAsesor]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const yaAvanzado = tienePerfil || propuestaAprobada;

  const welcomeSubtitle = esAsesor
    ? "Consulta clientes, perfiles de riesgo y propuestas de portafolio en lenguaje natural con el asesor IA."
    : yaAvanzado
      ? "Conversa con el asesor IA para resolver dudas sobre tus inversiones o revisar tu propuesta de portafolio."
      : "Conversa con el asesor IA para definir tu perfil de riesgo preliminar y diseñar una propuesta de portafolio diversificado.";

  const ctaLabel = esAsesor
    ? "Abrir asesor IA"
    : yaAvanzado
      ? "Hablar con el asesor IA"
      : "Iniciar conversación con asesor IA";

  const autoSendMessage = esAsesor || yaAvanzado
    ? undefined
    : "Hola, quiero completar mi perfil de inversionista";

  const features = esAsesor ? FEATURES_ASESOR : FEATURES_INVERSOR;

  return (
    <>
      <section className="welcome-panel">
        <h1 className="welcome-title">Bienvenido, {user?.name || 'Inversor'}</h1>
        <p className="welcome-subtitle">{welcomeSubtitle}</p>

        <div className="welcome-features">
          {features.map(({ icon: Icon, title, description }) => (
            <article className="welcome-feature" key={title}>
              <Icon size={20} aria-hidden="true" />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <button className="welcome-cta" onClick={openModal} type="button" disabled={cargandoEstado}>
          {ctaLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>

      <section className="profile-panel">
        <div className="profile-info">
          <h2 className="profile-title">{esAsesor ? 'Perfil de asesor' : 'Perfil de administrador'}</h2>

          <span className="profile-group-label">Información personal</span>
          <div className="profile-row">
            <span className="profile-row-label">Nombre</span>
            <span className="profile-row-value">{user?.name || 'Juan Pérez'}</span>
            <ChevronRight size={16} aria-hidden="true" />
          </div>
          <div className="profile-row">
            <span className="profile-row-label">Email</span>
            <span className="profile-row-value">{user?.email || 'juan.perez@inversion360.com'}</span>
            <ChevronRight size={16} aria-hidden="true" />
          </div>

          <span className="profile-group-label">Seguridad</span>
          <div className="profile-row">
            <span className="profile-row-label">Contraseña</span>
            <span className="profile-row-value">••••••••••••</span>
            <ChevronRight size={16} aria-hidden="true" />
          </div>
        </div>

        <div className="profile-avatar-card">
          <div className="profile-avatar">
            <UserCheck size={40} aria-hidden="true" />
          </div>
          <strong className="profile-avatar-name">{user?.name || 'Juan Pérez'}</strong>
          <button className="profile-photo-button" type="button">
            <RefreshCw size={14} aria-hidden="true" />
            Cambiar foto
          </button>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            <ChatBot autoSend={autoSendMessage} />
          </div>
        </div>
      )}
    </>
  );
};

export default Principal;