import { MessageSquareText, Scale, UserCheck, ArrowRight, ChevronRight, RefreshCw } from "lucide-react";
import "../styles/Principal.css";
const FEATURES = [
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
const Principal = (/*{ onStartChat }*/) => {
    return (
        <>
        <section className="welcome-panel">
            <h1 className="welcome-title">Bienvenido, Juan</h1>
            <p className="welcome-subtitle">
                Conversa con el asesor IA para definir tu perfil de riesgo preliminar y diseñar una
                propuesta de portafolio diversificado.
            </p>

            <div className="welcome-features">
                {FEATURES.map(({ icon: Icon, title, description }) => (
                    <article className="welcome-feature" key={title}>
                        <Icon size={20} aria-hidden="true" />
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </article>
                ))}
            </div>

            <button className="welcome-cta" /*onClick={onStartChat}*/ type="button">
                Iniciar conversación con asesor IA
                <ArrowRight size={16} aria-hidden="true" />
            </button>
        </section>
        
        <section className="profile-panel">
                <div className="profile-info">
                    <h2 className="profile-title">Perfil de administrador</h2>

                    <span className="profile-group-label">Información personal</span>
                    <div className="profile-row">
                        <span className="profile-row-label">Nombre</span>
                        <span className="profile-row-value">Juan Pérez</span>
                        <ChevronRight size={16} aria-hidden="true" />
                    </div>
                    <div className="profile-row">
                        <span className="profile-row-label">Email</span>
                        <span className="profile-row-value">juan.perez@inversion360.com</span>
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
                    <strong className="profile-avatar-name">Juan Pérez</strong>
                    <button className="profile-photo-button" type="button">
                        <RefreshCw size={14} aria-hidden="true" />
                        Cambiar foto
                    </button>
                </div>
            </section>
        </>
    )
}

export default Principal