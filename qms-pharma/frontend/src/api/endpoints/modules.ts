import { apiClient } from '../client';

export const modulesApi = {
  listDesvios: async () => (await apiClient.get('/api/desvios')).data,
  listCambios: async () => (await apiClient.get('/api/cambios')).data,
  listRiesgos: async () => (await apiClient.get('/api/riesgos')).data,
  listDocumentos: async () => (await apiClient.get('/api/documentos')).data,
  listCapas: async () => (await apiClient.get('/api/capas')).data,
};
