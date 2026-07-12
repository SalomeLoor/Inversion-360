import { connection } from "../database/connection";

export const asesorService = {
  listarPendientes: async () => {
    try {
      const { data } = await connection.get('/propuestas/pendientes');
      return data;
    } catch (error) {
      console.error('Error al listar propuestas pendientes:', error);
      throw error;
    }
  },

  aprobar: async (id: string, comentarios?: string) => {
    try {
      const { data } = await connection.post(`/propuestas/${id}/aprobar`, { comentarios });
      return data;
    } catch (error) {
      console.error('Error al aprobar propuesta:', error);
      throw error;
    }
  },

  // Rechazar una propuesta
  rechazar: async (id: string, comentarios: string) => {
    try {
      const { data } = await connection.post(`/propuestas/${id}/rechazar`, { comentarios });
      return data;
    } catch (error) {
      console.error('Error al rechazar propuesta:', error);
      throw error;
    }
  },

  // Editar una propuesta (instrumentos y/o riesgo)
  editar: async (id: string, payload: { instrumentos?: any; riesgo_esperado?: string; comentarios?: string }) => {
    try {
      const { data } = await connection.put(`/propuestas/${id}/editar`, payload);
      return data;
    } catch (error) {
      console.error('Error al editar propuesta:', error);
      throw error;
    }
  },
};