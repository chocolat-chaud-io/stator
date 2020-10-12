import axios from "axios"

export const http = (url: string) =>
  axios.create({
    baseURL: url,
    timeout: 10000,
  })
