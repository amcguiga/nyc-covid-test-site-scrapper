const { JSDOM } = require('jsdom')
const { testingSite, siteTestsAvailable, siteAddress, siteSchedule } = require('../testing-site')

const parsePage = (page) => {
  let dom = new JSDOM(page)
  const boroughs = ['queens']

  return boroughs.flatMap( borough => {
    let sites = dom.window.document.querySelectorAll(`div#${borough} > p`)
    return Array.from(sites).map( site => {
      // the paragraph tag has no html element structure under it, but each "item" is separated by a br
      let lines = site.innerHTML.split('<br>').slice(0, -1)
      let parsedLines = lines.map( line => {
        let placeholder = dom.window.document.createElement('p')
        placeholder.innerHTML = line.trim()
        return placeholder.textContent.replace(/\n|\r|\t/g, '').replace(/  +/g, ' ')
      })

      // This monster is because sometimes they slip extra address lines or directions in
      let result = parsedLines.reduce( (acc, line) => {
        if (/.+NY ?\d{5}/.test(line))
          return {
            siteInfo: acc.siteInfo,
            neighborhood: line,
            schedule: acc.schedule
          }
        else if (acc.neighborhood)
          return {
            siteInfo: acc.siteInfo,
            neighborhood: acc.neighborhood,
            schedule: [...acc.schedule, line]
          }
        else 
          return {
            siteInfo: [...acc.siteInfo, line],
            neighborhood: acc.neighborhood,
            schedule: acc.schedule
          }
      }, { siteInfo: [], neighborhood: undefined, schedule: []})

      let [name, tests, ...streets] = result.siteInfo
      let [dates, ...times] = result.schedule
      let info = Array.from(site.getElementsByTagName('i')).map( info => 
        info.textContent.replace(/\n|\r|\t/g, '').replace(/  +/g, ' ')
      )

      let siteTests = siteTestsAvailable(tests)
      let rawAddress = { streets: streets, neighborhood: result.neighborhood, borough: borough }
      let [line1, ...addressInfo] = streets
      let [neighborhood, postal] = result.neighborhood.split(/, ?NY ?/).map(part => part.trim())
      let address = siteAddress(rawAddress, line1, neighborhood, borough, postal, undefined, addressInfo) 
      let schedule = siteSchedule({ dates: dates, times: times }, [])

      return testingSite(name, 'city', 'mobile', siteTests, address, schedule, info, undefined, undefined, undefined)
    })
  })
}

module.exports = parsePage