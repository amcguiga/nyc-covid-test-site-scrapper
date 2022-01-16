import { URL } from 'url'; 

import { parsePage as castlightParsePage } from './src/castlight-health-testing-sites/parse-page.js'
import { parsePage as nycGovParsePage } from './src/nyc-gov-covid-testing-page/parse-page.js'
import { loadPage as castlightLoad } from './src/castlight-health-testing-sites/load-page.js'
import { loadPage as nycGovLoad } from './src/nyc-gov-covid-testing-page/load-page.js'
import { parseFile } from './src/parse-file.js'
import { writeFile } from './src/write-file.js'

const privateSitePath = new URL('./data/site-references/private-covid-sites-1-13-22.html', import.meta.url).pathname
const govSitePath = new URL('./data/site-references/city-covid-sites-1-13-22.html', import.meta.url).pathname

const init = (async () => {
  let privateData = castlightLoad().then(page => 
    (castlightParsePage(page.rawBody))
  )
  let publicData = nycGovLoad().then(page => 
    (nycGovParsePage(page.rawBody))
  )

  Promise.all([privateData, publicData]).then(datasets => 
    ({
      data: datasets.reduce((acc, data) => [...acc, ...data]),
      runTime: new Date().toLocaleTimeString()
    })
  ).then(dataset => {
    writeFile(dataset, 'sites-1-16-22.json', new URL('./data/site-data', import.meta.url).pathname)
    return dataset
  })  
})

init()
