const path = require('path')

const castlightParse = require('./src/castlight-health-testing-sites/parse-page')
const nycGovParse = require('./src/nyc-gov-covid-testing-page/parse-page')
const parseFile = require('./src/parse-file')
const writeFile = require('./src/write-file')


const init = (async () => {
  let filePath = path.join(__dirname, "./data/site-references/private-covid-sites-1-13-22.html")
  let filePromise = parseFile(filePath)
  filePromise.then(file => {
    let data = castlightParse(file)
    writeFile(data, 'private-11106-sites-1-15-22.json', path.join(__dirname, "./data/site-data"))
    data
  })
})


/**const init = (async () => {
  let filePath = path.join(__dirname, "./data/site-references/city-covid-sites-1-13-22.html")
  let filePromise = parseFile(filePath)
  filePromise.then(file => {
    let data = nycGovParse(file)
    writeFile(data, 'city-queens-sites-1-15-22.json', path.join(__dirname, "./data/site-data"))
    data
  })
  
})*/

init()
