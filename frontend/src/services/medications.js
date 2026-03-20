import api from './api';

export const getMedications = async () => {
  const response = await api.get('/patient_medications');
  return response.data;
};

export const saveMedication = async (data) => {
  const response = await api.post('/patient_medications', data);
  return response.data;
};

export const updateMedication = async (id, data) => {
  const response = await api.put(`/patient_medications/${id}`, data);
  return response.data;
};

export const deleteMedication = async (id) => {
  const response = await api.delete(`/patient_medications/${id}`);
  return response.data;
};