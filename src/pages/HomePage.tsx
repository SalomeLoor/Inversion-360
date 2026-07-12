import { useEffect, useState } from 'react'
import {
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from 'react-router-dom'
import '../styles/HomePage.css'
import { getSessionUser, loginUser, registerUser, saveSession } from '../utils/auth'

const HomePage = () => {
    const navigate = useNavigate()

    const [mode, setMode] = useState<"login" | "register">("login");
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (getSessionUser()) {
            navigate('/dashboard')
        }
    }, [navigate])

    async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = mode === 'login'
                ? await loginUser({ email: form.email, password: form.password })
                : await registerUser({ fullName: form.fullName, email: form.email, password: form.password })

            if (!result.success) {
                setError(result.error)
                return
            }

            saveSession(result.user)
            navigate('/dashboard')
        } catch {
            setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-hero">
                <div className="brand auth-brand">
                    <ShieldCheck size={34} aria-hidden="true" />
                    <div>
                        <strong>Inversion360</strong>
                        <span>Robo-advisory explicable con aprobacion humana</span>
                    </div>
                </div>
                <h1>Gestiona propuestas de inversion con trazabilidad y control.</h1>
                <p>
                    Perfilamiento, reglas versionadas, portafolios explicables, agentes IA controlados y revision de
                    asesor en un solo flujo operativo.
                </p>
            </section>

            <form className="auth-card" onSubmit={submitAuth}>
                <div className="segmented auth-tabs">
                    <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
                        Login
                    </button>
                    <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} type="button">
                        Registro
                    </button>
                </div>

                <div>
                    <h2>{mode === "login" ? "Ingresar" : "Crear usuario"}</h2>
                    <p>Acceso para asesores y administradores de la demo.</p>
                </div>

                {error ? (
                    <div className="auth-error">
                        <AlertTriangle size={18} aria-hidden="true" />
                        {error}
                    </div>
                ) : null}

                {mode === "register" ? (
                    <label>
                        Nombre
                        <input
                            value={form.fullName}
                            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                            required
                        />
                    </label>
                ) : null}

                <label>
                    Email
                    <input
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        minLength={8}
                        type="password"
                        value={form.password}
                        onChange={(event) => setForm({ ...form, password: event.target.value })}
                        required
                    />
                </label>

                <button className="primary-button auth-submit" disabled={loading} type="submit">
                    <ShieldCheck size={18} aria-hidden="true" />
                    {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Registrar"}
                </button>
            </form>
        </main>
    )
}

export default HomePage
