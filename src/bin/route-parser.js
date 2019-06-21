import RouteParser from './../route-parser'
const runFromCLI = require.main === module

export function main () {
  const file = process.argv[2]
  const parser = new RouteParser(file)
  process.stdout.write(JSON.stringify(parser.parse()))
}

if (runFromCLI) {
  main()
}
