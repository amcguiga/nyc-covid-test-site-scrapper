import * as fs from 'fs'

const parseFile = async (filePath) => 
  (await fs.promises.readFile(filePath, { encoding: 'utf8' }))

export { parseFile }