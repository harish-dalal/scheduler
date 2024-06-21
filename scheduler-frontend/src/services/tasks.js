import axios from "axios";

export const API_URL = "http://localhost:5000/api";

export const getUser = () => {
  return localStorage.getItem("userid");
};

const getHeaders = () => {
  return {
    headers: { "x-user-id": getUser() },
  };
};

export const createTask = (task) => {
  console.log(getHeaders());
  return axios.post(`${API_URL}/task`, task, getHeaders());
};

export const getTasks = () => {
  return axios.get(`${API_URL}/task`, getHeaders());
};

export const updateTaskStatus = (taskId, isComplete) => {
  return axios.put(
    `${API_URL}/task/${taskId}/status`,
    { status: isComplete ? "complete" : "incomplete" },
    getHeaders()
  );
};

export const deleteTask = (taskId) => {
  return axios.delete(`${API_URL}/task/${taskId}/delete`, getHeaders());
};
