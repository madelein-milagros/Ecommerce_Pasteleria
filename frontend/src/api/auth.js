import axios from "axios";

const API = "http://localhost:8000/api/auth/";

export const loginRequest = async (username, password) => {
  const res = await axios.post(`${API}login/`, {
    username,
    password,
  });
  return res.data;
};

export const registerRequest = async (username, email, password) => {
  const res = await axios.post(`${API}register/`, {
    username,
    email,
    password,
  });
  return res.data;
};
