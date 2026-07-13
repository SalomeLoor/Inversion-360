import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { serviceFinancial } from '../../services/financialservice';
import './Chatbot.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  autoSend?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ autoSend }) => {
  const { user, login } = useAuth();
  const esAsesor = user?.rol === 'asesor';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const greetingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasGreetedRef = useRef(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const autoSendDoneRef = useRef(false);

  useEffect(() => {
    if (user && esAsesor) return;

    if (user && autoSend && !autoSendDoneRef.current) {
      autoSendDoneRef.current = true;
      const timer = setTimeout(() => {
        sendMessage(autoSend, true);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (user) return;

    if (hasGreetedRef.current || chatStarted) return;

    greetingTimerRef.current = setTimeout(() => {
      if (!user && !chatStarted) {
        setChatStarted(true);
        setMessages([
          {
            role: 'assistant',
            content:
              '👋 Hola, soy el asistente de Inversion360. ¿Quieres registrarte o ya tienes cuenta? Puedes escribirme "registrarme" o "iniciar sesión".',
          },
        ]);
        hasGreetedRef.current = true;
      }
    }, 3000);

    return () => {
      if (greetingTimerRef.current) {
        clearTimeout(greetingTimerRef.current);
        greetingTimerRef.current = null;
      }
    };
  }, [user, chatStarted, autoSend, esAsesor]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string, isAuto = false) => {
    const messageToSend = text || input;
    if (!messageToSend.trim() || loading) return;

    const userMessage = messageToSend.trim();
    if (!isAuto) {
      setInput('');
    }
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const payload: any = {
        pregunta: userMessage,
        provider: 'deepseek',
        model: 'deepseek-v4-flash',
        webSearch: false,
      };

      if (ownerId) {
        payload.ownerId = ownerId;
      }

      const response: any = await serviceFinancial.conversacion(payload);

      if (response?.ownerId) {
        setOwnerId(response.ownerId);
      }

      if (response.accion === 'login' || response.redirigir === '/login') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.respuesta },
        ]);
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      if (response.token && response.usuario) {
        login(response.usuario, response.token);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.respuesta },
        ]);
        setTimeout(() => {
          window.location.href = '/inversor/principal';
        }, 1500);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.respuesta || 'No entendí, ¿puedes repetir?' },
      ]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Ocurrió un error. Inténtalo de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const placeholder = esAsesor
    ? 'Pregunta sobre clientes, perfiles o propuestas...'
    : 'Escribe tu mensaje...';

  const statusLabel = esAsesor ? 'Asesor IA' : user ? 'Asesor IA' : 'Asistente activo';

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-brand">
          <ShieldCheck size={24} aria-hidden="true" />
          <span>Inversion360</span>
        </div>
        <span className="chat-status">{statusLabel}</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="message-content typing">Escribiendo...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={loading}
        />
        <button onClick={() => sendMessage()} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;