import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatBot from '../components/Chatbot/Chatbot';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/inversor/principal');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand auth-brand">
          <ShieldCheck size={34} aria-hidden="true" />
          <div>
            <strong>Inversion360</strong>
            <span>Robo-advisory explicable con aprobación humana</span>
          </div>
        </div>
        <h1>Gestiona propuestas de inversión con trazabilidad y control.</h1>
        <p>
          Perfilamiento, reglas versionadas, portafolios explicables, agentes IA controlados y revisión de asesor en un solo flujo operativo.
        </p>
        <button className="welcome-cta" onClick={() => navigate('/login')} type="button">
            iniciar sesión
        </button>
      </section>

      <section className="auth-card">
        <ChatBot />
      </section>
    </main>
  );
};

export default HomePage;