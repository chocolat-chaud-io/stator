import { AsyncThunk, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { RootEntity } from "@stator/models"
import { AxiosRequestConfig, AxiosResponse } from "axios"

import { apiClient } from "../../clients/api-client"
import { SliceState, StateEntityType } from "./slice-state"

type AllowedMethod = "get" | "getAll" | "post" | "put" | "delete"
type UrlPath<T> = string | ((request: T) => string)

const pendingReducer = <TEntity extends RootEntity, ThunkArg, ThunkApiConfig, TSliceState extends SliceState<TEntity>>(
  thunk: AsyncThunk<TEntity, ThunkArg, ThunkApiConfig>,
  method: AllowedMethod
) => ({
  [thunk.pending.toString()]: (state: TSliceState, action: PayloadAction<TEntity, string, { arg: TEntity }>) => {
    if (method === "getAll" || method === "post") {
      state.status[method].loading = true
    } else {
      state.status[method].ids[action.meta.arg.id] = true
    }
    state.status.error = null
  },
})

const rejectedReducer = <TEntity extends RootEntity, ThunkArg, ThunkApiConfig, TSliceState extends SliceState<TEntity>>(
  thunk: AsyncThunk<TEntity, ThunkArg, ThunkApiConfig>,
  method: AllowedMethod
) => ({
  [thunk.rejected.toString()]: (
    state: TSliceState,
    action: PayloadAction<TEntity, string, { arg: TEntity }, Error>
  ) => {
    if (method === "getAll" || method === "post") {
      state.status[method].loading = false
    } else {
      state.status[method].ids[action.meta.arg.id] = true
    }
    state.status.error = action.error
  },
})

const handleRequest = async <T>(requestFn: Promise<AxiosResponse<T>>) => {
  try {
    return (await requestFn).data
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message
      throw Error(typeof errorMessage === "string" ? errorMessage : errorMessage.join("\n"))
    }

    throw Error(error.message)
  }
}

export const thunkReducerGetAllFactory = <
  TSliceState extends SliceState<RootEntity>,
  TRequestParams = unknown,
  TRequestQuery = unknown
>(
  urlPath: UrlPath<TRequestParams>,
  onFulfilled?: (state: TSliceState, action: PayloadAction<StateEntityType<TSliceState>[]>) => void
) => {
  const thunk = createAsyncThunk(
    `${urlPath}/getAll`,
    async (request: { params?: TRequestParams; query?: TRequestQuery; config?: AxiosRequestConfig }) => {
      const url = typeof urlPath === "function" ? urlPath(request.params) : urlPath
      const config: AxiosRequestConfig = { ...request.config, params: { ...request.query } }

      return await handleRequest(apiClient.get<StateEntityType<TSliceState>>(url, config))
    }
  )

  return {
    thunk,
    reducers: {
      ...pendingReducer(thunk, "getAll"),
      ...rejectedReducer(thunk, "getAll"),
      [thunk.fulfilled.toString()]: (state: TSliceState, action: PayloadAction<StateEntityType<TSliceState>[]>) => {
        if (onFulfilled) {
          onFulfilled(state, action)
        } else {
          state.entities = action.payload
        }
        state.status.getAll.loading = false
      },
    },
  }
}

export const thunkReducerGetFactory = <
  TSliceState extends SliceState<RootEntity>,
  TRequestParams = unknown,
  TRequestQuery = unknown
>(
  urlPath: UrlPath<TRequestParams>,
  onFulfilled?: (state: TSliceState, action: PayloadAction<StateEntityType<TSliceState>>) => void
) => {
  const thunk = createAsyncThunk(
    `${urlPath}/get`,
    async (request: { params?: TRequestParams; query?: TRequestQuery; config?: AxiosRequestConfig }) => {
      const url = typeof urlPath === "function" ? urlPath(request.params) : urlPath
      const config: AxiosRequestConfig = { ...request.config, params: { ...request.query } }

      return await handleRequest(apiClient.get<StateEntityType<TSliceState>>(url, config))
    }
  )

  return {
    thunk,
    reducers: {
      ...pendingReducer(thunk, "get"),
      ...rejectedReducer(thunk, "get"),
      [thunk.fulfilled.toString()]: (
        state: TSliceState,
        action: PayloadAction<StateEntityType<TSliceState>, string, { arg: StateEntityType<TSliceState> }>
      ) => {
        if (onFulfilled) {
          onFulfilled(state, action)
        } else {
          const entities = [...state.entities]
          const index = entities.findIndex(entity => entity.id === action.payload.id)
          if (index === -1) {
            entities.push(action.payload)
          } else {
            entities[index] = action.payload
          }
          state.entities = entities
        }
        state.status.get.ids[action.meta.arg.id] = false
      },
    },
  }
}

export const thunkReducerPostFactory = <
  TSliceState extends SliceState<RootEntity>,
  TRequestBody = unknown,
  TRequestParams = unknown,
  TRequestQuery = unknown
>(
  urlPath: UrlPath<TRequestParams>,
  onFulfilled?: (state: TSliceState, action: PayloadAction<StateEntityType<TSliceState>>) => void
) => {
  const thunk = createAsyncThunk(
    `${urlPath}/post`,
    async (request: {
      params?: TRequestParams
      query?: TRequestQuery
      data?: TRequestBody
      config?: AxiosRequestConfig
    }) => {
      const url = typeof urlPath === "function" ? urlPath(request.params) : urlPath
      const data = { ...request.data, ...request.config?.data }
      const config: AxiosRequestConfig = { ...request.config, params: request.query }

      return await handleRequest(apiClient.post<StateEntityType<TSliceState>>(url, data, config))
    }
  )

  return {
    thunk,
    reducers: {
      ...pendingReducer(thunk, "post"),
      ...rejectedReducer(thunk, "post"),
      [thunk.fulfilled.toString()]: (state: TSliceState, action: PayloadAction<StateEntityType<TSliceState>>) => {
        if (onFulfilled) {
          onFulfilled(state, action)
        } else {
          state.entities = [...state.entities, action.payload]
        }
        state.status.post.loading = false
      },
    },
  }
}

export const thunkReducerPutFactory = <
  TSliceState extends SliceState<RootEntity>,
  TRequestBody = unknown,
  TRequestParams = unknown,
  TRequestQuery = unknown
>(
  urlPath: UrlPath<TRequestParams>,
  onFulfilled?: (state: TSliceState, action: PayloadAction<StateEntityType<TSliceState>>) => void
) => {
  const thunk = createAsyncThunk(
    `${urlPath}/put`,
    async (request: {
      params?: TRequestParams
      query?: TRequestQuery
      data?: TRequestBody
      config?: AxiosRequestConfig
    }) => {
      const url = typeof urlPath === "function" ? urlPath(request.params) : urlPath
      const data = { ...request.data, ...request.config?.data }
      const config: AxiosRequestConfig = { ...request.config, params: request.query }

      return await handleRequest(apiClient.put<StateEntityType<TSliceState>>(url, data, config))
    }
  )

  return {
    thunk,
    reducers: {
      ...pendingReducer(thunk, "put"),
      ...rejectedReducer(thunk, "put"),
      [thunk.fulfilled.toString()]: (state: TSliceState, action: PayloadAction<StateEntityType<TSliceState>>) => {
        if (onFulfilled) {
          onFulfilled(state, action)
        } else {
          state.entities = state.entities.map(entity => (entity.id === action.payload.id ? action.payload : entity))
        }
        state.status.put.ids[action.payload.id] = false
      },
    },
  }
}

export const thunkReducerDeleteFactory = <
  TSliceState extends SliceState<RootEntity>,
  TRequestParams extends { id: number } = { id: number },
  TRequestQuery = unknown
>(
  urlPath: UrlPath<TRequestParams>,
  onFulfilled?: (state: TSliceState, action: PayloadAction<StateEntityType<TSliceState>>) => void
) => {
  const thunk = createAsyncThunk(
    `${urlPath}/delete`,
    async (request: { params?: TRequestParams; query?: TRequestQuery; config?: AxiosRequestConfig }) => {
      const url = typeof urlPath === "function" ? urlPath(request.params) : urlPath
      const config: AxiosRequestConfig = { ...request.config, params: request.query }

      return await handleRequest(apiClient.delete<StateEntityType<TSliceState>>(url, config))
    }
  )

  return {
    thunk,
    reducers: {
      ...pendingReducer(thunk, "delete"),
      ...rejectedReducer(thunk, "delete"),
      [thunk.fulfilled.toString()]: (
        state: TSliceState,
        action: PayloadAction<StateEntityType<TSliceState>, string, { arg: { params: TRequestParams } }>
      ) => {
        if (onFulfilled) {
          onFulfilled(state, action)
        } else {
          state.entities = state.entities.filter(entity => entity.id !== action.meta.arg.params.id)
        }
        state.status.delete.ids[action.payload.id] = false
      },
    },
  }
}
