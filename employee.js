import axios from 'axios';
const API_URL = 'http://localhost:8080/api/v1/employees';
export const fetchAll = () => axios.get(API_URL);
export const createOne = data => axios.post(API_URL, data);
export const updateOne = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteOne = id => axios.delete(`${API_URL}/${id}`);
// New helper for projects
export const updateProjects = payload =>
    axios.put(`${API_URL}/projects`, payload);