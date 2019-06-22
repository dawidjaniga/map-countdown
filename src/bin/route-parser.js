import path from 'path'
import RouteParser from './../route-parser'
const runFromCLI = require.main === module

export function main () {
  const file = process.argv[2]
  const outputFilePath = process.argv[3]
  const parser = new RouteParser(file, outputFilePath)
  try {
    parser.parse()
    console.log(
      `✅ File ${file} successfully parsed and saved to ${path.resolve(
        outputFilePath
      )}`
    )
  } catch (e) {
    throw e
  }
}

if (runFromCLI) {
  main()
}
