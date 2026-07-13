import { connection } from "../database/connection";

export const inversorService = {
  obtenerMisPropuestas: async () => {
    try {
      const { data } = await connection.get('/propuestas/mis-propuestas');
      return data;
    } catch (error) {
      console.error('Error al obtener mis propuestas:', error);
      throw error;
    }
  },
};