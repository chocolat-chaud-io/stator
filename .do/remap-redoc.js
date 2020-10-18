const replace = require("replace-in-file")

try {
  console.log(
    replace.sync({
      files: "apps/api/src/assets/index.html",
      from: "/documentation/json",
      to: "/do/documentation/json",
    })
  )
} catch (e) {
  console.error(e)
}
