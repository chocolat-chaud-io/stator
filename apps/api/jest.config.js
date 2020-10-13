module.exports = {
  name: "api",
  preset: "../../jest.config.js",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/apps/api",
  coverageThreshold: {
    global: {
      branches: 80,
    },
  },
  coveragePathIgnorePatterns: ["./src/config/"],
}
