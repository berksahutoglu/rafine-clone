import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8800";

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const makeRequest = instance;
