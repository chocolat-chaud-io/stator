const replace = require("replace-in-file")

try {
  console.log(
    replace.sync({
      files: "apps/webapp/src/environments/environment.prod.ts",
      from: "${process.env.API_URL}",
      to: "do",
    })
  )
} catch (e) {
  console.error(e)
}
