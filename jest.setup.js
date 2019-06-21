jest.mock('utils', () => {
  const fs = require('memfs').promises

  return {
    readFile: fs.readFile,
    writeFile: fs.writeFile,
  }
})
