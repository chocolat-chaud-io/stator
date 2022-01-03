import { configuration } from "./configuration"

export const configurationTest = (databaseName: string) => {
  const baseConfig = configuration()

  return {
    ...baseConfig,
    test: true,
    database: {
      ...baseConfig.database,
      name: databaseName,
      keepConnectionAlive: false,
    },
  }
}
