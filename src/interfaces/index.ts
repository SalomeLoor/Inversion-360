export interface User {
  id: string;
  name: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
  ok: boolean;
  token?: string;
  usuario?: User;
  respuesta?: string;
  fase?: string;
  sugerencias?: string[];
  registro_completado?: boolean;
}

export interface Mensaje {
  id: string;
  rol: 'user' | 'assistant';
  contenido: string;
  indice_orden: number;
  created_at?: string;
}

export interface ConversacionResponse {
  ok: boolean;
  autenticado: boolean;
  data: Mensaje[];
}

export interface EnviarMensajePayload {
  pregunta: string;
  provider?: string;
  model?: string;
  webSearch?: boolean;
}

export interface EnviarMensajeResponse {
  ok: boolean;
  respuesta: string;
  fase?: string;
  token?: string;
  usuario?: User;
  sugerencias?: string[];
  registro_completado?: boolean;
  tiene_datos?: boolean;
  debug?: {
    query_generada?: string;
    total_filas?: number;
    error_sql?: string;
  };
}

export interface TimelineResponse {
  ok: boolean;
  fase_actual: string;
  historial: Array<{
    id: string;
    evento: string;
    datos: any;
    created_at: string;
  }>;
  hay_mas: boolean;
}