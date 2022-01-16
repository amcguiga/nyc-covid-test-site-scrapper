import { JSDOM } from 'jsdom'
import { testingSite, siteTestsAvailable, siteAddress, siteSchedule, siteTest } from '../testing-site.js'

const boroughs = ['queens', 'bronx', 'brooklyn', 'staten-island', 'manhattan']
const testingMatcher = new Map([
  ['rapid', { matches: ['rapid antigen'], timeline: '1 Day' }],
  ['pcr', { matches: ['pcr', 'testing available'], timeline: '3-5 Days' }],
  ['saliva', { matches: ['saliva'], timeline: '3-5 Days' }],
  ['flu', { matches: ['flu'], timeline: '3-5 Days' }],
])

const parsePage = (page) => {
  let dom = new JSDOM(page)

  return boroughs.flatMap( borough => {
    let sites = dom.window.document.querySelectorAll(`div#${borough} > p`)
    return Array.from(sites).map( site => {
      // the paragraph tag has no html element structure under it, but each 'item' is separated by a br
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

      let siteTests = Array.from(testingMatcher.entries()).reduce((acc, [key, { matches, timeline }]) => {
        let matcher = new RegExp(matches.join('|'))
        if (matcher.test(tests?.toLowerCase()))
          return [...acc, siteTest({ testType: key, resultTimeline: timeline})]
        else 
          return acc
      }, [])

      let testsAvailable = siteTestsAvailable({ raw: tests, siteTests: siteTests })
      let rawAddress = { streets: streets, neighborhood: result.neighborhood, borough: borough }
      let [line1, ...addressInfo] = streets
      let [neighborhood, postal] = result.neighborhood.split(/, ?NY ?/).map(part => part.trim())
      let address = siteAddress({
        raw: rawAddress, 
        street: line1, 
        neighborhood: neighborhood, 
        borough: borough, 
        postal: postal, 
        info: addressInfo 
      }) 
      let schedule = siteSchedule({ raw: { dates: dates, times: times } })

      return testingSite({
        name: name,
        providerType: 'city',
        locationType: 'mobile',
        testsAvailable: testsAvailable,
        address: address,
        schedule: schedule,
        info: info
      })
    })
  })
}

export { parsePage }