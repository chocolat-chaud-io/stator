import fs from "fs"
import path from "path"

import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface"
import { Provider } from "@nestjs/common/interfaces/modules/provider.interface"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { Test, TestingModule } from "@nestjs/testing"
import { Connection, createConnection } from "typeorm"
import { Builder, Loader, Parser, Resolver, fixturesIterator } from "typeorm-fixtures-cli/dist"
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions"

import { configurationTest } from "../config/configuration.test"
import { getRootModuleImports } from "./utils"

export class TestingHelper {
  module: TestingModule
  app: NestFastifyApplication

  async initializeModuleAndApp(testName: string, importedModules: ModuleMetadata["imports"], providers: Provider[] = undefined) {
    const databaseName = `stator_test_${testName}`
    const configuration = configurationTest.bind(this, databaseName)

    const connectionOptions: ConnectionOptions = { ...configuration().database }
    const connection = await createConnection(connectionOptions)
    await this.createDatabaseIfNotExist(connection, databaseName)

    this.module = await Test.createTestingModule({
      imports: [...getRootModuleImports(configuration), ...importedModules],
      providers: providers,
    }).compile()

    this.app = this.module.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await this.app.init()
    await this.app.getHttpAdapter().getInstance().ready()

    return this
  }

  async reloadFixtures() {
    const connection = await this.app.get(Connection)
    await connection.synchronize(true)

    const loader = new Loader()

    loader.load(path.resolve(this.getFixturePath()))

    const fixtures = fixturesIterator(new Resolver().resolve(loader.fixtureConfigs))
    const builder = new Builder(connection, new Parser())

    for (const fixture of fixtures) {
      const entity = await builder.build(fixture)
      await connection.getRepository(entity.constructor.name).save(entity)
    }
  }

  async shutdownServer() {
    await this.app.close()
  }

  private getFixturePath() {
    const possibleFixturePaths = ["./apps/api/src/assets/fixtures", "./src/assets/fixtures", "./assets/fixtures"]
    for (const possibleFixturePath of possibleFixturePaths) {
      if (fs.existsSync(possibleFixturePath)) {
        return possibleFixturePath
      }
    }
  }

  private async createDatabaseIfNotExist(connection: Connection, databaseName: string) {
    await connection.query(`CREATE EXTENSION IF NOT EXISTS dblink;
DO $$
BEGIN
PERFORM dblink_exec('', 'CREATE DATABASE ${databaseName}');
EXCEPTION WHEN duplicate_database THEN RAISE NOTICE '%, skipping', SQLERRM USING ERRCODE = SQLSTATE;
END
$$;`)
    await connection.close()
  }
}
