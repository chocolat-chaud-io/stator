import { ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface"
import { Todo } from "@stator/models"

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3333,

  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
    name: process.env.DATABASE_NAME || "stator",
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    synchronize: process.env.DATABASE_SYNCHRONIZE || true,
  },
})

export const getOrmConfigFn = async (configService: ConfigService): Promise<TypeOrmModuleOptions> =>
  Promise.resolve({
    type: "postgres",
    host: configService.get("database.host"),
    port: configService.get<number>("database.port"),
    database: configService.get("database.name"),
    synchronize: configService.get("database.synchronize"),
    username: configService.get("database.username"),
    password: configService.get("database.password"),
    entities: [Todo],
  })
