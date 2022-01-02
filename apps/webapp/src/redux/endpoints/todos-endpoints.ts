import { statorApi as api } from "../stator-api"
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getManyTodos: build.query<GetManyTodosApiResponse, GetManyTodosApiArg>({
      query: queryArg => ({
        url: `/api/todos`,
        params: {
          fields: queryArg.fields,
          s: queryArg.s,
          filter: queryArg.filter,
          or: queryArg.or,
          sort: queryArg.sort,
          join: queryArg.join,
          limit: queryArg.limit,
          offset: queryArg.offset,
          page: queryArg.page,
          cache: queryArg.cache,
        },
      }),
    }),
    createOneTodo: build.mutation<CreateOneTodoApiResponse, CreateOneTodoApiArg>({
      query: queryArg => ({ url: `/api/todos`, method: "POST", body: queryArg.todo }),
    }),
    updateOneTodo: build.mutation<UpdateOneTodoApiResponse, UpdateOneTodoApiArg>({
      query: queryArg => ({ url: `/api/todos/${queryArg.id}`, method: "PATCH", body: queryArg.todo }),
    }),
    deleteOneTodo: build.mutation<DeleteOneTodoApiResponse, DeleteOneTodoApiArg>({
      query: queryArg => ({ url: `/api/todos/${queryArg.id}`, method: "DELETE" }),
    }),
  }),
  overrideExisting: false,
})
export { injectedRtkApi as todosApi }
export type GetManyTodosApiResponse = /** status 200 Get many base response */ GetManyTodoResponseDto | Todo[]
export type GetManyTodosApiArg = {
  /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
  fields?: string[]
  /** Adds search condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#search" target="_blank">Docs</a> */
  s?: string
  /** Adds filter condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#filter" target="_blank">Docs</a> */
  filter?: string[]
  /** Adds OR condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#or" target="_blank">Docs</a> */
  or?: string[]
  /** Adds sort by field. <a href="https://github.com/nestjsx/crud/wiki/Requests#sort" target="_blank">Docs</a> */
  sort?: string[]
  /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
  join?: string[]
  /** Limit amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#limit" target="_blank">Docs</a> */
  limit?: number
  /** Offset amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#offset" target="_blank">Docs</a> */
  offset?: number
  /** Page portion of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#page" target="_blank">Docs</a> */
  page?: number
  /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
  cache?: number
}
export type CreateOneTodoApiResponse = /** status 201 Get create one base response */ Todo
export type CreateOneTodoApiArg = {
  todo: Todo
}
export type UpdateOneTodoApiResponse = /** status 200 Response */ Todo
export type UpdateOneTodoApiArg = {
  id: number
  todo: Todo
}
export type DeleteOneTodoApiResponse = unknown
export type DeleteOneTodoApiArg = {
  id: number
}
export type Todo = {
  text: string
  id?: number
  createdAt?: string
  updatedAt?: string
}
export type GetManyTodoResponseDto = {
  data: Todo[]
  count: number
  total: number
  page: number
  pageCount: number
}
export const { useGetManyTodosQuery, useCreateOneTodoMutation, useUpdateOneTodoMutation, useDeleteOneTodoMutation } = injectedRtkApi
