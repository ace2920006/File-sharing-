import axios from 'axios';

const API_BASE = '/api/files';

export const uploadFileApi = async (formData, onProgress) => {
  const response = await axios.post(`${API_BASE}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted, progressEvent.loaded, progressEvent.total);
      }
    },
  });
  return response.data;
};

export const getFileInfoApi = async (token) => {
  const response = await axios.get(`${API_BASE}/info/${token}`);
  return response.data;
};

export const verifyPasswordApi = async (token, password) => {
  const response = await axios.post(`${API_BASE}/verify`, { token, password });
  return response.data;
};

export const getDownloadUrl = (token, password = '') => {
  if (password) {
    return `${API_BASE}/${token}?password=${encodeURIComponent(password)}`;
  }
  return `${API_BASE}/${token}`;
};
