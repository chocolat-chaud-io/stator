const replace = require("replace-in-file")

try {
  const result = replace.sync({
    files: "apps/api/src/assets/index.html",
    from: "/documentation/json",
    to: "/do/documentation/json",
  })
  console.log(result)
} catch (e) {
  console.error(e)
}
