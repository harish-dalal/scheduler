import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const createTask = (task) => {
  return axios.post(`${API_URL}/notification`, task);
};

export const getTasks = () => {
  return axios.get(`${API_URL}/notification`);
};

export const deleteTask = (taskId) => {
  return axios.delete(`${API_URL}/tasks/${taskId}`);
};
