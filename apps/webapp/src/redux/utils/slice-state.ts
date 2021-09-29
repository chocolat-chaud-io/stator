import { RootEntity } from "@stator/models"

export interface SliceState<T> {
  entities: T[]
  status: {
    get?: { ids: Map<number, boolean> }
    getAll?: { loading: boolean }
    post?: { loading: boolean }
    put?: { ids: Map<number, boolean> }
    delete?: { ids: Map<number, boolean> }
    error?: Error
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type StateEntityType<T> = T extends SliceState<infer T> ? T : never

export const getInitialSliceState = <T extends SliceState<unknown>>(): T => {
  return {
    entities: [],
    status: {
      get: { ids: {} },
      getAll: { loading: false },
      post: { loading: false },
      put: { ids: {} },
      delete: { ids: {} },
      error: null,
    },
  } as T
}

export const isEntityLoading = <T extends SliceState<TEntity>, TEntity extends RootEntity>(state: T, entity: TEntity) => {
  return !!(state.status.get.ids[entity.id] || state.status.put.ids[entity.id] || state.status.delete.ids[entity.id])
}
