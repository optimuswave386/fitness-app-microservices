import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['X-User-ID'] = userId;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getActivities = async () => {
  try {
    const response = await api.get('/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

export const getActivityById = async (id) => {
  try {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching activity with id ${id}:`, error);
    throw error;
  }
};

export const getActivityDetail = async (id) => {
  try {
    const response = await api.get(`/recommendations/activity/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching activity detail with id ${id}:`, error);
    throw error;
  }
}

export const AddActivity = async (activity) => {
  try {
    const response = await api.post('/activities', activity);
    return response.data;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

export default api;