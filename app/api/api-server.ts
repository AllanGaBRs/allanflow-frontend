import axios from "axios";
import { env } from "@/app/config/env";

export const apiServer = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});