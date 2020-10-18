import { ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface"
import { Todo } from "@stator/models"

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  address: process.env.ADDRESS || "0.0.0.0",

  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
    name: process.env.DATABASE_NAME || "stator",
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    synchronize: process.env.DATABASE_SYNCHRONIZE || true,
    certificateAuthority: process.env.DATABASE_CA_CERT,
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
    ssl: configService.get("database.certificateAuthority")
      ? {
          ca: configService.get("database.certificateAuthority"),
        }
      : false,
    entities: [Todo],
  })
