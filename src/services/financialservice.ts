import { connection } from '../database/connection';
import type {
  ConversacionResponse,
  EnviarMensajePayload,
  EnviarMensajeResponse,
  TimelineResponse
} from '../interfaces/index';

export const serviceFinancial = {
  obtenerConversacion: async (): Promise<ConversacionResponse> => {
    try {
      const { data } = await connection.get<ConversacionResponse>('/conversacion');
      return data;
    } catch (error) {
      console.error('Error en obtenerConversacion:', error);
      throw error;
    }
  },

  conversacion: async (payload: EnviarMensajePayload): Promise<EnviarMensajeResponse> => {
    try {
      const { data } = await connection.post<EnviarMensajeResponse>('/conversacion/mensaje', payload);
      return data;
    } catch (error) {
      console.error('Error en conversacion:', error);
      throw error;
    }
  },

  obtenerTimeline: async (): Promise<TimelineResponse> => {
    try {
      const { data } = await connection.get<TimelineResponse>('/conversacion/timeline');
      return data;
    } catch (error) {
      console.error('Error en obtenerTimeline:', error);
      throw error;
    }
  }
};