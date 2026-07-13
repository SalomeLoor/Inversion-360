import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { connection } from '../database/connection';
import '../styles/HomePage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await connection.post('/login', { email, password });
      if (!data.ok) {
        setError(data.mensaje || 'Error al iniciar sesión');
        return;
      }
      login(data.usuario, data.token);
      navigate('/inversor/principal');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

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
        <h1>Iniciar sesión</h1>
        <p>Ingresa con tu correo y contraseña para acceder a tu panel de inversor.</p>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Acceder</h2>
        <p>Introduce tus credenciales</p>

        {error && (
          <div className="auth-error">
            <AlertTriangle size={18} aria-hidden="true" />
            {error}
          </div>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ejemplo@correo.com"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        <button className="primary-button auth-submit" disabled={loading} type="submit">
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>

        <p style={{ marginTop: '12px', fontSize: '13px', color: '#7a908c' }}>
          ¿No tienes cuenta? Vuelve al <a href="/" style={{ color: '#102d31', fontWeight: '600' }}>chat de registro</a>.
        </p>
      </form>
    </main>
  );
};

export default LoginPage;