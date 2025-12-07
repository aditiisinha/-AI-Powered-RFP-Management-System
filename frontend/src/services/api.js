import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// RFP APIs
export const createRFPFromText = (userInput) => {
  return api.post('/rfps/create-from-text', { userInput });
};

export const getRFPs = () => {
  return api.get('/rfps');
};

export const getRFP = (id) => {
  return api.get(`/rfps/${id}`);
};

export const updateRFP = (id, data) => {
  return api.put(`/rfps/${id}`, data);
};

export const deleteRFP = (id) => {
  return api.delete(`/rfps/${id}`);
};

// Vendor APIs
export const getVendors = () => {
  return api.get('/vendors');
};

export const createVendor = (data) => {
  return api.post('/vendors', data);
};

export const updateVendor = (id, data) => {
  return api.put(`/vendors/${id}`, data);
};

export const deleteVendor = (id) => {
  return api.delete(`/vendors/${id}`);
};

// Proposal APIs
export const getProposals = (rfpId) => {
  return api.get(`/proposals/rfp/${rfpId}`);
};

export const getProposal = (id) => {
  return api.get(`/proposals/${id}`);
};

// Email APIs
export const sendRFP = (rfpId, vendorIds) => {
  return api.post('/email/send-rfp', { rfpId, vendorIds });
};

export const checkResponses = () => {
  return api.post('/email/check-responses');
};

// AI APIs
export const compareProposals = (rfpId) => {
  return api.post(`/ai/compare-proposals/${rfpId}`);
};

export const getRecommendations = (rfpId) => {
  return api.get(`/ai/recommendations/${rfpId}`);
};

export default api;

