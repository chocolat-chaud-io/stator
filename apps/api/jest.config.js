module.exports = {
  name: "api",
  preset: "../../jest.config.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/apps/api",
  coveragePathIgnorePatterns: ["./src/config/"],
}
