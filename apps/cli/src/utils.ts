import fs from "fs"
import path from "path"

export const walk = async function* (dir: string, ignoredPaths: Array<string>, walkedFolderNames: string[] = []) {
  for await (const directoryEntry of await fs.promises.opendir(dir)) {
    const entryPath = path.join(dir, directoryEntry.name)
    if (directoryEntry.isDirectory() && !ignoredPaths.includes(directoryEntry.name)) {
      walkedFolderNames.push(entryPath)
      yield* walk(entryPath, ignoredPaths, walkedFolderNames)
    } else if (directoryEntry.isFile()) {
      yield entryPath
    }
  }
}
