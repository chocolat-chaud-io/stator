import { configuration } from "./configuration"

export const configurationTest = () => {
  const baseConfig = configuration()
  return {
    ...baseConfig,

    database: {
      ...baseConfig.database,
      name: process.env.DATABASE_NAME || "stator-test",
    },
  }
}
