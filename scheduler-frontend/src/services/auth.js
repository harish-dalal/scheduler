import axios from "axios";
import { API_URL } from "./tasks";

export const signin = (username) => {
  return axios.post(`${API_URL}/signin`, { username });
};
