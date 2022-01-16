import { URL } from 'url'; 

import { parsePage as castlightParsePage } from './castlight-health-testing-sites/parse-page.js'
import { parsePage as nycGovParsePage } from './nyc-gov-covid-testing-page/parse-page.js'
import { parseFile } from './parse-file.js'
import { writeFile } from './write-file.js'

const castlightFilePath = '../data/site-references/private-covid-sites-1-15-22.html'
const nycGovFilePath = '../data/site-references/city-covid-sites-1-13-22.html'

const init = (async () => {
  let privateData = parseFile(castlightFilePath).then(file => 
    (castlightParsePage(file))
  )

  let publicData = parseFile(nycGovFilePath).then(file => 
    (nycGovParsePage(file))
  )

  Promise.all([privateData, publicData]).then(datasets => 
    ({
      data: datasets.reduce((acc, data) => [...acc, ...data]),
      runTime: new Date().toLocaleTimeString()
    })
  ).then(dataset => {
    writeFile(dataset, 'sites-1-16-22.json', new URL('../data/site-data/test', import.meta.url).pathname)
    return dataset
  })  
})

init()
