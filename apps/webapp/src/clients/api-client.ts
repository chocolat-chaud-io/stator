import axios from "axios"
import { environment } from "../environments/environment"

export const apiClient = axios.create({
  baseURL: environment.apiUrl,
  timeout: 60000,
})
