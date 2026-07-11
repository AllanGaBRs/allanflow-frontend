import axios from "axios";

export const apiServer = axios.create({
  baseURL:
    process.env.API_URL!,
  headers: {
    "Content-Type": "application/json",
  },
});