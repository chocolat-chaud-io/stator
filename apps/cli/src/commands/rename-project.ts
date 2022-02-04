import fs from "fs"
import path from "path"

import { Command, Option } from "clipanion"

import { walk } from "../utils"

export class RenameProject extends Command {
  static paths = [["rename-project"]]
  organization = Option.String("--organization",{ required: true })
  project = Option.String("--project", { required: true })

  static usage = Command.Usage({
    category: "getting-started",
    description: "This script will rename all occurrences of stator and chocolat-chaud with your own names.",
    examples: [["A basic example", "npm run stator-cli rename-project --organization chocolat-chaud-io --project stator"]],
  })

  async execute(): Promise<number | void> {
    await this.renameProject()
  }

  async renameProject() {
    try {
      console.log(this.organization, this.project, __dirname)
      const organizationRegex = /^[a-zA-Z-\d_]+$/gim
      if (!organizationRegex.test(this.organization)) {
        console.error("The organization name must respect this regex /^[a-zA-Z-\\d_]+$/gmi")
        process.exit(1)
      }

      const projectRegex = /^[a-zA-Z-\d_]+$/gim
      if (!projectRegex.test(this.project)) {
        console.error("The project name must respect this regex /^[a-zA-Z-\\d_]+$/gmi")
        process.exit(1)
      }
      const databaseName = this.project.replace(/-/g, "_")
      const databaseFiles = ["docker-compose.yml", "seed-data.js", "init.sql", "test.ts", "orm-config.ts"]

      const ignoredFolders = ["node_modules", "dist", ".git", ".idea", ".cache"]
      for await (const entry of walk(path.join(__dirname, "../"), ignoredFolders)) {
        const entryStat = await fs.promises.lstat(entry)
        if (entryStat.isFile()) {
          const fileContent = await fs.promises.readFile(entry, "utf-8")
          if (fileContent) {
            const isDatabaseFile = databaseFiles.some(databaseFile => entry.includes(databaseFile))
            const replacedFileContent = fileContent
              .replace(/chocolat-chaud-io/gim, this.organization)
              .replace(/stator/gim, isDatabaseFile ? databaseName : this.project)
            await fs.promises.writeFile(entry, replacedFileContent, "utf-8")
          }
        }
      }

      console.info(`This is now YOUR project provided generously by:

███████ ████████  █████  ████████  ██████  ██████ 
██         ██    ██   ██    ██    ██    ██ ██   ██ 
███████    ██    ███████    ██    ██    ██ ██████  
     ██    ██    ██   ██    ██    ██    ██ ██   ██ 
███████    ██    ██   ██    ██     ██████  ██   ██ 
                                                   
    `)
    } catch (error) {
      console.error(error as Error)
    }
  }
}
