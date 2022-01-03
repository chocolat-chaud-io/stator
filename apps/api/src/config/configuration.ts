import { ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface"
import { Todo } from "@stator/models"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require("../../../database/orm-config")

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  address: process.env.ADDRESS || "0.0.0.0",
  test: process.env.TEST === "true",

  database: {
    ...ormConfig,
    certificateAuthority: process.env.DATABASE_CA_CERT,
    keepConnectionAlive: false,
    entities: [Todo],
    logging: ["error"],
    retries: 1,
  },
})

export const getOrmConfigFn = async (configService: ConfigService): Promise<TypeOrmModuleOptions> =>
  Promise.resolve({
    type: "postgres",
    host: configService.get("database.host"),
    port: configService.get<number>("database.port"),
    database: configService.get("database.name"),
    username: configService.get("database.username"),
    password: configService.get("database.password"),
    synchronize: configService.get("database.synchronize"),
    keepConnectionAlive: configService.get("database.keepConnectionAlive"),
    ssl: configService.get("database.certificateAuthority") ?? false,
    entities: configService.get("database.entities"),
    logging: configService.get("database.logging"),
    retries: configService.get("database.retries"),
  })
