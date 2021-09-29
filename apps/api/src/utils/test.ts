import fs from "fs"
import path from "path"

import { HttpStatus, INestApplication } from "@nestjs/common"
import { DynamicModule } from "@nestjs/common/interfaces/modules/dynamic-module.interface"
import { ForwardReference } from "@nestjs/common/interfaces/modules/forward-reference.interface"
import { Provider } from "@nestjs/common/interfaces/modules/provider.interface"
import { Type } from "@nestjs/common/interfaces/type.interface"
import { FastifyAdapter } from "@nestjs/platform-fastify"
import { Test, TestingModule } from "@nestjs/testing"
import { AxiosResponse } from "axios"
import { Connection, createConnection } from "typeorm"
import { getRepository } from "typeorm"
import { Builder, Loader, Parser, Resolver, fixturesIterator } from "typeorm-fixtures-cli/dist"

import { configurationTest } from "../config/configuration.test"
import { getRootModuleImports } from "./utils"

export const buildAxiosResponse = (data: Record<string, unknown>): AxiosResponse<unknown> => {
  return {
    status: HttpStatus.OK,
    statusText: "",
    headers: [],
    config: {},
    data,
  }
}

export class TestingHelper {
  module: TestingModule
  app: INestApplication

  async initializeModuleAndApp(
    testName: string,
    importedModules: Array<Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference>,
    providers: Provider[] = []
  ) {
    const databaseName = `stator_test_${testName}`
    const configuration = configurationTest.bind(this, databaseName)

    const dbConfig = configuration().database
    const connection = await createConnection({ ...dbConfig, type: "postgres" })
    await connection.query(`DROP DATABASE IF EXISTS ${databaseName}`)
    await connection.query(`CREATE DATABASE ${databaseName}`)

    this.module = await Test.createTestingModule({
      imports: [...getRootModuleImports(configuration), ...importedModules],
      providers: providers,
    }).compile()

    this.app = this.module.createNestApplication(new FastifyAdapter())

    await this.app.init()
    await this.app.getHttpAdapter().getInstance().ready()

    await connection.close()

    return this
  }

  async reloadFixtures() {
    const connection: Connection = this.module.get("Connection")
    await connection.synchronize(true)

    const loader = new Loader()

    loader.load(path.resolve(this.getFixturePath()))

    const fixtures = fixturesIterator(new Resolver().resolve(loader.fixtureConfigs))
    const builder = new Builder(connection, new Parser())

    for (const fixture of fixtures) {
      const entity = await builder.build(fixture)
      await getRepository(entity.constructor.name).save(entity)
    }
  }

  async shutdownServer() {
    await this.app.close()
    const connection: Connection = await this.module.get("Connection")
    if (connection.isConnected) {
      await connection.dropDatabase()
      await connection.close()
    }
  }

  private getFixturePath() {
    let fixturesPath = "./src/assets/fixtures"
    if (fs.existsSync(fixturesPath)) {
      return fixturesPath
    }

    fixturesPath = "./assets/fixtures"
    if (fs.existsSync(fixturesPath)) {
      return fixturesPath
    }

    fixturesPath = "./apps/api/src/assets/fixtures"
    if (fs.existsSync(fixturesPath)) {
      return fixturesPath
    }

    throw new Error("Unable to find fixture path")
  }
}
