import fs from 'fs'
import path from 'path'

function getDirectoryEntries(directory) {
  try {
    return fs.readdirSync(directory)
  } catch (e) {
    return []
  }
}

function findResolvedFile(filename, directory) {
  const directoryEntries = getDirectoryEntries(directory)
  if (directoryEntries.includes(filename)) {
    return path.resolve(directory, filename)
  }
  return null
}

function findFileInDirectoryAndParents(filename, directory) {
  let currentDirectory = directory
  let oldDirectory
  while (currentDirectory !== oldDirectory) {
    const resolvedFile = findResolvedFile(filename, currentDirectory)
    if (resolvedFile) {
      return resolvedFile
    }
    oldDirectory = currentDirectory
    currentDirectory = path.dirname(currentDirectory)
  }
  return null
}

export default findFileInDirectoryAndParents
