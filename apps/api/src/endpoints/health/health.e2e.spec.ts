import supertest from "supertest"

import { TestingHelper } from "../../utils/test"
import { HealthModule } from "./health.module"

describe("Health", () => {
  let testingHelper: TestingHelper

  beforeAll(async () => {
    testingHelper = await new TestingHelper().initializeModuleAndApp("health", [HealthModule])
  })

  afterAll(async () => {
    await testingHelper.shutdownServer()
  })

  describe("GET /health", () => {
    it("should return status 200", async () => {
      await supertest
        .agent(testingHelper.app.getHttpServer())
        .get("/health")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          status: "ok",
          info: {
            api: { status: "up" },
          },
          error: {},
          details: {
            api: { status: "up" },
          },
        })
    })
  })
})
