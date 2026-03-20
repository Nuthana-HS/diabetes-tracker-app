import api from './api';

export const saveHbA1c = async (data) => {
  const response = await api.post('/hba1c_records', data);
  return response.data;
};

export const getHbA1cHistory = async () => {
  const response = await api.get('/hba1c_records');
  return response.data;
};

export const deleteHbA1c = async (id) => {
  const response = await api.delete(`/hba1c_records/${id}`);
  return response.data;
};