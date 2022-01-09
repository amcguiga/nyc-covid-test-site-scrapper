const fs = require('fs')

const parseFile = async (filePath) => 
  (await fs.promises.readFile(filePath, { encoding: 'utf8' }))

module.exports = parseFile