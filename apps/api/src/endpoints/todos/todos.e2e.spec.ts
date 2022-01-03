import { Todo } from "@stator/models"
import * as supertest from "supertest"
import { Repository } from "typeorm"

import { TestingHelper } from "../../utils/test"
import { TodosModule } from "./todos.module"

describe("Todos", () => {
  let testingHelper: TestingHelper
  let repository: Repository<Todo>

  beforeAll(async () => {
    testingHelper = await new TestingHelper().initializeModuleAndApp("todos", [TodosModule])

    repository = testingHelper.module.get("TodoRepository")
  })

  beforeEach(() => testingHelper.reloadFixtures())
  afterAll(() => testingHelper.shutdownServer())

  describe("GET /todos", () => {
    it("should return an array of todos", async () => {
      const { body } = await supertest
        .agent(testingHelper.app.getHttpServer())
        .get("/todos")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(body).toMatchObject([
        { id: expect.any(Number), text: "test-name-0" },
        { id: expect.any(Number), text: "test-name-1" },
      ])
    })

    it("should create one todo", async () => {
      const todo = { text: "test-name-0" }

      const { body } = await supertest
        .agent(testingHelper.app.getHttpServer())
        .post("/todos")
        .send(todo)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)

      expect(body).toMatchObject({ id: expect.any(Number), text: "test-name-0" })
    })

    it("should update the name of a todo", async () => {
      const { body } = await supertest
        .agent(testingHelper.app.getHttpServer())
        .patch(`/todos/1`)
        .send({ text: "updated-name" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(body).toMatchObject({ id: 1, text: "updated-name" })
    })

    it("should delete one todo", async () => {
      await supertest.agent(testingHelper.app.getHttpServer()).delete(`/todos/1`).set("Accept", "application/json").expect(200)
      const missingTodo = await repository.findOne({ id: 1 })

      expect(missingTodo).toBe(undefined)
    })
  })
})
