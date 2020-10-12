import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { Todo } from "@stator/models"
import * as supertest from "supertest"
import { Repository } from "typeorm"

import { configurationTest } from "../config/configuration-test"
import { getRootModuleImports } from "../utils"
import { TodosModule } from "./todos.module"

describe("Todos", () => {
  let app: INestApplication
  let repository: Repository<Todo>

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [...getRootModuleImports(configurationTest), TodosModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    repository = module.get("TodoRepository")
  })

  afterEach(async () => {
    await repository.delete({})
  })

  afterAll(async () => {
    await app.close()
  })

  describe("GET /todos", () => {
    it("should return an array of todos", async () => {
      await repository.save([{ text: "test-name-0" }, { text: "test-name-1" }])

      const { body } = await supertest
        .agent(app.getHttpServer())
        .get("/todos")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(body).toEqual([
        { id: expect.any(Number), text: "test-name-0" },
        { id: expect.any(Number), text: "test-name-1" },
      ])
    })

    it("should return a single todo", async () => {
      const todo = await repository.save({ text: "test-name-0" })

      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/todos/${todo.id}`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(body).toEqual({ id: todo.id, text: "test-name-0" })
    })

    it("should create one todo", async () => {
      const todo = { text: "test-name-0" }

      const { body } = await supertest
        .agent(app.getHttpServer())
        .post("/todos")
        .send(todo)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)

      expect(body).toEqual({ id: expect.any(Number), text: "test-name-0" })
    })

    it("should create multiple todos", async () => {
      const todos = [{ text: "test-name-0" }, { text: "test-name-1" }]

      const { body } = await supertest
        .agent(app.getHttpServer())
        .post("/todos/bulk")
        .send({ bulk: todos })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)

      expect(body).toEqual([
        { id: expect.any(Number), text: "test-name-0" },
        { id: expect.any(Number), text: "test-name-1" },
      ])
    })

    it("should update the name of a todo", async () => {
      const todo = await repository.save({ text: "test-name-0" })

      const { body } = await supertest
        .agent(app.getHttpServer())
        .put(`/todos/${todo.id}`)
        .send({ text: "updated-name" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(body).toEqual({ id: expect.any(Number), text: "updated-name" })
    })

    it("should delete one todo", async () => {
      const todo = await repository.save({ text: "test-name-0" })

      await supertest
        .agent(app.getHttpServer())
        .delete(`/todos/${todo.id}`)
        .set("Accept", "application/json")
        .expect(200)
      const missingTodo = await repository.findOne({ id: todo.id })

      expect(missingTodo).toBe(undefined)
    })
  })
})
