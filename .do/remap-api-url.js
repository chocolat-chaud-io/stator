const replace = require("replace-in-file")

try {
  const result = replace.sync({
    files: "apps/webapp/src/environments/environment.prod.ts",
    from: "${process.env.API_URL}",
    to: "do",
  })
  console.log(result)
} catch (e) {
  console.error(e)
}
