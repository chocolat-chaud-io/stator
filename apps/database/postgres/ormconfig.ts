import { ConnectionOptions } from "typeorm"

const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "stator",

  entities: [__dirname + "/../../../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*.ts"],
  cli: {
    migrationsDir: "apps/database/postgres/migrations",
  },
}

export = config
