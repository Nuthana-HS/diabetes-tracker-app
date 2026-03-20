import api from './api';

export const getBloodSugarReadings = async () => {
  const response = await api.get('/blood_sugar_readings');
  return response.data;
};

export const saveBloodSugarReading = async (data) => {
  const response = await api.post('/blood_sugar_readings', {
    blood_sugar_reading: data
  });
  return response.data;
};

export const deleteBloodSugarReading = async (id) => {
  const response = await api.delete(`/blood_sugar_readings/${id}`);
  return response.data;
};