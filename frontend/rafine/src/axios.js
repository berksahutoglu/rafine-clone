import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://rafine-clone-6.onrender.com/api/",
  withCredentials: true,
});
