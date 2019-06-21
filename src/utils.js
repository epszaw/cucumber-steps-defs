const { promisify } = require('util')
const fs = require('fs')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

module.exports = {
  readFile,
  writeFile,
  mkdir,
}
