import axios from "axios";

export const API_URL = "http://localhost:5000/api";

export const getUser = () => {
  return {
    userid: localStorage.getItem("userid"),
    username: localStorage.getItem("username"),
  };
};

const getHeaders = () => {
  return {
    headers: { "x-user-id": getUser().userid },
  };
};

export const createTask = (task) => {
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
