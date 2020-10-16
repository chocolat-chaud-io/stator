import { createAsyncThunk } from "@reduxjs/toolkit"
import { RootEntity } from "@stator/models"
import { AxiosResponse } from "axios"

import { environment } from "../../environments/environment"
import { http } from "../../services/http"

const handleRequest = async <T>(requestFn: Promise<AxiosResponse<T>>) => {
  try {
    return (await requestFn).data
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message.join("\n") : error.message
    throw Error(errorMessage)
  }
}

export const thunkFactory = <T extends RootEntity>(baseEndpoint: string) => {
  const httpClient = http(environment.apiUrl)

  return {
    get: createAsyncThunk(`${baseEndpoint}/get`, async (entity: T) => {
      return await handleRequest(httpClient.get<T>(`${baseEndpoint}/${entity.id}`))
    }),
    getAll: createAsyncThunk(`${baseEndpoint}/get`, async () => {
      return await handleRequest(httpClient.get<T[]>(baseEndpoint))
    }),
    post: createAsyncThunk(`${baseEndpoint}/post`, async (entity: T) => {
      return await handleRequest(httpClient.post<T>(baseEndpoint, entity))
    }),
    put: createAsyncThunk(`${baseEndpoint}/put`, async (entity: T) => {
      return await handleRequest(httpClient.put<T>(`${baseEndpoint}/${entity.id}`, entity))
    }),
    delete: createAsyncThunk(`${baseEndpoint}/delete`, async (entity: T) => {
      return await handleRequest(httpClient.delete<void>(`${baseEndpoint}/${entity.id}`))
    }),
  }
}

export type ThunkFactoryType = ReturnType<typeof thunkFactory>
