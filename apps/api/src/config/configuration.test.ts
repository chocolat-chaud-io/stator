export const configurationTest = () => ({
  port: parseInt(process.env.PORT, 10) || 3333,

  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
    name: process.env.DATABASE_NAME || "stator-test",
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    synchronize: process.env.DATABASE_SYNCHRONIZE || true,
  },
})
