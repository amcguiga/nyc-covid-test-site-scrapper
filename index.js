const path = require('path')

const castlightParse = require('./src/castlight-health-testing-sites/parse-page')
const parseFile = require('./src/parse-file')

const init = (async () => {
  let filePath = path.join(__dirname, "./data/site-references/private-covid-sites-1-6-22.html")
  let filePromise = parseFile(filePath)
  filePromise.then(file => {
  let data = castlightParse(file)
  console.log(data)
  data
  })
})

init()
