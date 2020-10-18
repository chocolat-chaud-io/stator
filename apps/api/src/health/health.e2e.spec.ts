import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import * as supertest from "supertest"

import { HealthModule } from "./health.module"

describe("HealthController", () => {
  let app: INestApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("GET /health", () => {
    it("should return status 200", async () => {
      await supertest
        .agent(app.getHttpServer())
        .get("/health")
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
