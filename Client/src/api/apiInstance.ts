import axios from "axios";

export const zfwApiInstance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 1000,
});