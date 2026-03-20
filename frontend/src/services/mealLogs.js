import api from './api';

export const saveMealLog = async (data) => {
    const response = await api.post('/meal_logs', data);
    return response.data;
};

export const getMealLogs = async () => {
    const response = await api.get('/meal_logs');
    return response.data;
};

export const deleteMealLog = async (id) => {
    const response = await api.delete(`/meal_logs/${id}`);
    return response.data;
};
