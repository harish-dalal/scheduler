import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const signin = (username) => {
  return axios.post(`${API_URL}/signin`, { username });
};
