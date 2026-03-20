import api from './api';

export const saveActivityLog = async (data) => {
    const response = await api.post('/activity_logs', data);
    return response.data;
};

export const getActivityLogs = async () => {
    const response = await api.get('/activity_logs');
    return response.data;
};

export const deleteActivityLog = async (id) => {
    const response = await api.delete(`/activity_logs/${id}`);
    return response.data;
};
