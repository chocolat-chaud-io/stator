import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"

const ormConfig: PostgresConnectionOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "stator",
  synchronize: !!(process.env.DATABASE_SYNCHRONIZE ?? true),

  entities: [__dirname + "/../../libs/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*.ts"],
  cli: {
    migrationsDir: "apps/database/migrations",
  },
}

module.exports = ormConfig
